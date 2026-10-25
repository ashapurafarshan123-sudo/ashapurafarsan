-- ==============================================================================
-- Migration: 20261026000001_admin_panel_enhancements.sql
-- Description: Complete Admin Panel Schema Enhancements
-- 1. Automatic Admin Provisioning for vaibhavchawda432@gmail.com
-- 2. Discounts Table & Global Discount Configuration
-- 3. Discount-enforced create_order_secure RPC
-- 4. Advanced Operational & Sales Analytics RPC
-- ==============================================================================

-- 1. DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    title TEXT NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value >= 0),
    min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_storewide BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discounts_active ON public.discounts(is_active, is_storewide);

-- Discounts updated_at trigger
DROP TRIGGER IF EXISTS set_discounts_updated_at ON public.discounts;
CREATE TRIGGER set_discounts_updated_at
    BEFORE UPDATE ON public.discounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS on discounts
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active discounts" ON public.discounts;
CREATE POLICY "Public can view active discounts"
    ON public.discounts FOR SELECT
    USING (
        is_active = TRUE 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admins can insert discounts" ON public.discounts;
CREATE POLICY "Admins can insert discounts"
    ON public.discounts FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update discounts" ON public.discounts;
CREATE POLICY "Admins can update discounts"
    ON public.discounts FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete discounts" ON public.discounts;
CREATE POLICY "Admins can delete discounts"
    ON public.discounts FOR DELETE
    USING (public.is_admin(auth.uid()));


-- 2. SEED DEFAULT STOREWIDE DISCOUNT IN STORE_SETTINGS
INSERT INTO public.store_settings (key, value, description)
VALUES (
    'global_discount',
    jsonb_build_object(
        'is_active', false,
        'type', 'percentage',
        'value', 10,
        'min_order_amount', 0,
        'start_date', null,
        'end_date', null,
        'banner_text', 'Special 10% Off Storewide on Fresh Farsan!'
    ),
    'Storewide global discount configuration'
)
ON CONFLICT (key) DO NOTHING;


-- 3. PROVISION ADMIN ROLE AUTOMATICALLY FOR vaibhavchawda432@gmail.com
-- Provision helper function
CREATE OR REPLACE FUNCTION public.provision_admin_by_email(admin_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(admin_email));

    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.admin_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    END IF;
END;
$$;

-- Run for initial admin account if already registered in auth.users
SELECT public.provision_admin_by_email('vaibhavchawda432@gmail.com');

-- Update user creation trigger to automatically grant admin role to designated admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert user profile
    INSERT INTO public.profiles (id, full_name, phone, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = CASE WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
        phone = CASE WHEN public.profiles.phone IS NULL OR public.profiles.phone = '' THEN EXCLUDED.phone ELSE public.profiles.phone END;

    -- Automatically assign admin role if designated admin email registers
    IF LOWER(TRIM(NEW.email)) = 'vaibhavchawda432@gmail.com' THEN
        INSERT INTO public.admin_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    END IF;

    RETURN NEW;
END;
$$;


-- 4. ENHANCE CREATE_ORDER_SECURE WITH SERVER-SIDE GLOBAL DISCOUNT ENFORCEMENT
CREATE OR REPLACE FUNCTION public.create_order_secure(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_order_type TEXT,
    p_delivery_address TEXT,
    p_items JSONB,
    p_customer_email TEXT DEFAULT NULL,
    p_order_note TEXT DEFAULT NULL,
    p_payment_method TEXT DEFAULT 'cod'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_order_id UUID := gen_random_uuid();
    v_order_num TEXT;
    v_subtotal NUMERIC(10, 2) := 0;
    v_shipping NUMERIC(10, 2) := 0;
    v_discount NUMERIC(10, 2) := 0;
    v_total NUMERIC(10, 2) := 0;
    v_user_id UUID := auth.uid();
    v_item RECORD;
    v_variant RECORD;
    v_clean_phone TEXT;
    v_discount_settings JSONB;
    v_disc_active BOOLEAN := FALSE;
    v_disc_type TEXT := 'percentage';
    v_disc_val NUMERIC(10, 2) := 0;
    v_disc_min NUMERIC(10, 2) := 0;
    v_disc_start TIMESTAMPTZ;
    v_disc_end TIMESTAMPTZ;
BEGIN
    -- 1. Validate Basic Inputs
    IF p_customer_name IS NULL OR TRIM(p_customer_name) = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;

    v_clean_phone := REGEXP_REPLACE(p_customer_phone, '\D', '', 'g');
    IF LENGTH(v_clean_phone) = 12 AND v_clean_phone LIKE '91%' THEN
        v_clean_phone := SUBSTRING(v_clean_phone FROM 3);
    ELSIF LENGTH(v_clean_phone) = 11 AND v_clean_phone LIKE '0%' THEN
        v_clean_phone := SUBSTRING(v_clean_phone FROM 2);
    END IF;

    IF v_clean_phone IS NULL OR LENGTH(v_clean_phone) != 10 THEN
        RAISE EXCEPTION 'A valid 10-digit Indian mobile number is required';
    END IF;

    IF p_order_type NOT IN ('delivery', 'pickup') THEN
        RAISE EXCEPTION 'Order type must be either delivery or pickup';
    END IF;

    IF p_order_type = 'delivery' AND (p_delivery_address IS NULL OR TRIM(p_delivery_address) = '') THEN
        RAISE EXCEPTION 'Delivery address is required for home delivery';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one product';
    END IF;

    -- 2. Generate Human-Readable Unique Order Number (e.g. AF-20261026-A4F2)
    v_order_num := 'AF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- 3. Calculate Item Prices from Trusted Database Tables
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id TEXT,
        size_label TEXT,
        quantity INTEGER
    )
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Quantity must be greater than 0';
        END IF;

        SELECT pv.id AS variant_id, pv.price, pv.stock_quantity, p.name AS product_name
        INTO v_variant
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        WHERE pv.product_id = v_item.product_id
          AND pv.size_label = v_item.size_label
          AND pv.is_active = TRUE
          AND p.is_active = TRUE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant % (%) is unavailable or out of stock', v_item.product_id, v_item.size_label;
        END IF;

        v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
    END LOOP;

    -- 4. Calculate Delivery Fee
    IF p_order_type = 'delivery' THEN
        v_shipping := 0;
    ELSE
        v_shipping := 0;
    END IF;

    -- 5. Calculate Trusted Server-Side Discount from store_settings
    SELECT value INTO v_discount_settings
    FROM public.store_settings
    WHERE key = 'global_discount';

    IF v_discount_settings IS NOT NULL THEN
        v_disc_active := COALESCE((v_discount_settings->>'is_active')::boolean, false);
        v_disc_type := COALESCE(v_discount_settings->>'type', 'percentage');
        v_disc_val := COALESCE((v_discount_settings->>'value')::numeric, 0);
        v_disc_min := COALESCE((v_discount_settings->>'min_order_amount')::numeric, 0);
        
        IF v_discount_settings->>'start_date' IS NOT NULL THEN
            v_disc_start := (v_discount_settings->>'start_date')::timestamptz;
        END IF;
        IF v_discount_settings->>'end_date' IS NOT NULL THEN
            v_disc_end := (v_discount_settings->>'end_date')::timestamptz;
        END IF;

        IF v_disc_active 
           AND (v_disc_start IS NULL OR v_disc_start <= NOW())
           AND (v_disc_end IS NULL OR v_disc_end >= NOW())
           AND (v_subtotal >= v_disc_min) THEN
            IF v_disc_type = 'percentage' AND v_disc_val > 0 THEN
                v_discount := ROUND((v_subtotal * (LEAST(v_disc_val, 100) / 100)), 2);
            ELSIF v_disc_type = 'fixed' AND v_disc_val > 0 THEN
                v_discount := LEAST(v_subtotal, v_disc_val);
            END IF;
        END IF;
    END IF;

    v_total := GREATEST(0, v_subtotal + v_shipping - v_discount);

    -- 6. Insert Order
    INSERT INTO public.orders (
        id,
        order_number,
        user_id,
        customer_name,
        customer_phone,
        customer_email,
        order_type,
        delivery_address,
        order_note,
        status,
        payment_status,
        payment_method,
        subtotal,
        shipping_amount,
        discount_amount,
        total_amount
    )
    VALUES (
        v_order_id,
        v_order_num,
        v_user_id,
        TRIM(p_customer_name),
        v_clean_phone,
        NULLIF(TRIM(COALESCE(p_customer_email, '')), ''),
        p_order_type,
        CASE WHEN p_order_type = 'delivery' THEN TRIM(p_delivery_address) ELSE 'Store Pickup (Mira Road)' END,
        NULLIF(TRIM(COALESCE(p_order_note, '')), ''),
        'pending',
        'pending',
        COALESCE(NULLIF(p_payment_method, ''), 'cod'),
        v_subtotal,
        v_shipping,
        v_discount,
        v_total
    );

    -- 7. Insert Order Items Snapshots
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id TEXT,
        size_label TEXT,
        quantity INTEGER
    )
    LOOP
        SELECT pv.id AS variant_id, pv.price, p.name AS product_name
        INTO v_variant
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        WHERE pv.product_id = v_item.product_id
          AND pv.size_label = v_item.size_label;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name_snapshot,
            variant_size_snapshot,
            unit_price,
            quantity,
            line_total
        )
        VALUES (
            v_order_id,
            v_item.product_id,
            v_variant.variant_id,
            v_variant.product_name,
            v_item.size_label,
            v_variant.price,
            v_item.quantity,
            (v_variant.price * v_item.quantity)
        );
    END LOOP;

    -- 8. Return Result
    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_num,
        'customer_name', TRIM(p_customer_name),
        'customer_phone', v_clean_phone,
        'order_type', p_order_type,
        'subtotal', v_subtotal,
        'discount_amount', v_discount,
        'shipping_amount', v_shipping,
        'total_amount', v_total
    );
END;
$$;


-- 5. ADVANCED OPERATIONAL & SALES ANALYTICS RPC
CREATE OR REPLACE FUNCTION public.admin_get_advanced_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_gross_sales NUMERIC(10, 2) := 0;
    v_net_sales NUMERIC(10, 2) := 0;
    v_discounts_granted NUMERIC(10, 2) := 0;
    v_refunds NUMERIC(10, 2) := 0;
    v_total_orders INTEGER := 0;
    v_website_orders_count INTEGER := 0;
    v_website_sales NUMERIC(10, 2) := 0;
    v_whatsapp_orders_count INTEGER := 0;
    v_whatsapp_confirmed_count INTEGER := 0;
    v_whatsapp_sales NUMERIC(10, 2) := 0;
    v_pending_orders_count INTEGER := 0;
    v_today_sales NUMERIC(10, 2) := 0;
    v_this_month_sales NUMERIC(10, 2) := 0;
    v_in_stock_count INTEGER := 0;
    v_out_of_stock_count INTEGER := 0;
    v_aov NUMERIC(10, 2) := 0;
    v_best_sellers JSONB := '[]'::jsonb;
    v_daily_trends JSONB := '[]'::jsonb;
    v_start TIMESTAMPTZ := COALESCE(p_start_date, NOW() - INTERVAL '30 days');
    v_end TIMESTAMPTZ := COALESCE(p_end_date, NOW());
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    -- Total Sales (Excludes cancelled orders and unconfirmed WhatsApp enquiries)
    -- Confirmed sales includes:
    -- 1. Website orders that are not cancelled
    -- 2. WhatsApp orders that are confirmed, processing, out_for_delivery, delivered
    SELECT 
        COALESCE(SUM(total_amount), 0),
        COALESCE(SUM(subtotal), 0),
        COALESCE(SUM(discount_amount), 0),
        COUNT(*)
    INTO v_gross_sales, v_net_sales, v_discounts_granted, v_total_orders
    FROM public.orders
    WHERE created_at >= v_start AND created_at <= v_end
      AND status NOT IN ('cancelled')
      AND (payment_method != 'whatsapp_direct' OR status IN ('confirmed', 'processing', 'out_for_delivery', 'delivered'));

    -- Average Order Value
    IF v_total_orders > 0 THEN
        v_aov := ROUND((v_gross_sales / v_total_orders), 2);
    END IF;

    -- Website Orders breakdown
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO v_website_orders_count, v_website_sales
    FROM public.orders
    WHERE created_at >= v_start AND created_at <= v_end
      AND payment_method != 'whatsapp_direct'
      AND status NOT IN ('cancelled');

    -- WhatsApp Orders breakdown
    -- Total enquiries created:
    SELECT COUNT(*)
    INTO v_whatsapp_orders_count
    FROM public.orders
    WHERE created_at >= v_start AND created_at <= v_end
      AND payment_method = 'whatsapp_direct';

    -- Confirmed WhatsApp orders & revenue:
    SELECT 
        COUNT(*),
        COALESCE(SUM(total_amount), 0)
    INTO v_whatsapp_confirmed_count, v_whatsapp_sales
    FROM public.orders
    WHERE created_at >= v_start AND created_at <= v_end
      AND payment_method = 'whatsapp_direct'
      AND status IN ('confirmed', 'processing', 'out_for_delivery', 'delivered');

    -- Pending Orders count across all active channels
    SELECT COUNT(*)
    INTO v_pending_orders_count
    FROM public.orders
    WHERE status = 'pending';

    -- Today's Confirmed Sales
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_today_sales
    FROM public.orders
    WHERE created_at >= DATE_TRUNC('day', NOW())
      AND status NOT IN ('cancelled')
      AND (payment_method != 'whatsapp_direct' OR status IN ('confirmed', 'processing', 'out_for_delivery', 'delivered'));

    -- This Month's Confirmed Sales
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_this_month_sales
    FROM public.orders
    WHERE created_at >= DATE_TRUNC('month', NOW())
      AND status NOT IN ('cancelled')
      AND (payment_method != 'whatsapp_direct' OR status IN ('confirmed', 'processing', 'out_for_delivery', 'delivered'));

    -- In Stock vs Out of Stock Products
    SELECT COUNT(*) INTO v_in_stock_count FROM public.products WHERE is_active = TRUE;
    SELECT COUNT(*) INTO v_out_of_stock_count FROM public.products WHERE is_active = FALSE;

    -- Best Selling Products (Aggregated from real order_items)
    SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
    INTO v_best_sellers
    FROM (
        SELECT 
            oi.product_name_snapshot AS product_name,
            oi.product_id,
            SUM(oi.quantity) AS units_sold,
            SUM(oi.line_total) AS total_revenue
        FROM public.order_items oi
        JOIN public.orders o ON o.id = oi.order_id
        WHERE o.created_at >= v_start AND o.created_at <= v_end
          AND o.status NOT IN ('cancelled')
        GROUP BY oi.product_name_snapshot, oi.product_id
        ORDER BY units_sold DESC
        LIMIT 8
    ) sub;

    -- Daily Sales Trends
    SELECT COALESCE(jsonb_agg(daily), '[]'::jsonb)
    INTO v_daily_trends
    FROM (
        SELECT 
            TO_CHAR(DATE_TRUNC('day', o.created_at), 'YYYY-MM-DD') AS date,
            COUNT(*) AS order_count,
            COALESCE(SUM(o.total_amount), 0) AS daily_revenue
        FROM public.orders o
        WHERE o.created_at >= v_start AND o.created_at <= v_end
          AND o.status NOT IN ('cancelled')
          AND (o.payment_method != 'whatsapp_direct' OR o.status IN ('confirmed', 'processing', 'out_for_delivery', 'delivered'))
        GROUP BY DATE_TRUNC('day', o.created_at)
        ORDER BY DATE_TRUNC('day', o.created_at) ASC
    ) daily;

    RETURN jsonb_build_object(
        'gross_sales', v_gross_sales,
        'net_sales', v_net_sales,
        'discounts_granted', v_discounts_granted,
        'refunds', v_refunds,
        'total_orders', v_total_orders,
        'website_orders_count', v_website_orders_count,
        'website_sales', v_website_sales,
        'whatsapp_orders_count', v_whatsapp_orders_count,
        'whatsapp_confirmed_count', v_whatsapp_confirmed_count,
        'whatsapp_sales', v_whatsapp_sales,
        'pending_orders_count', v_pending_orders_count,
        'today_sales', v_today_sales,
        'this_month_sales', v_this_month_sales,
        'in_stock_products_count', v_in_stock_count,
        'out_of_stock_products_count', v_out_of_stock_count,
        'average_order_value', v_aov,
        'best_selling_products', v_best_sellers,
        'daily_trends', v_daily_trends
    );
END;
$$;
