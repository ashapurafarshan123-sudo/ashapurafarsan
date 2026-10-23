-- ==============================================================================
-- Migration: 20261023000003_rls_and_rpc.sql
-- Description: Complete Row Level Security policies and secure PostgreSQL functions
-- ==============================================================================

-- 1. HELPER FUNCTIONS FOR AUTHORIZATION
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    IF check_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = check_user_id
    );
END;
$$;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile or admin can view any" ON public.profiles;
CREATE POLICY "Users can view own profile or admin can view any"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 4. ADMIN_ROLES POLICIES (Strict: read-only for self/admin, no client-side insert/update)
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_roles;
CREATE POLICY "Users can view their own admin status"
    ON public.admin_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Notice: No INSERT/UPDATE/DELETE policies for authenticated or anon roles.
-- Admin assignment must be done via Supabase SQL dashboard or backend service_role.

-- 5. CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public can view active categories or admin can view all" ON public.categories;
CREATE POLICY "Public can view active categories or admin can view all"
    ON public.categories FOR SELECT
    USING (is_active = TRUE OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
    ON public.categories FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
    ON public.categories FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 6. PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view active products or admin can view all" ON public.products;
CREATE POLICY "Public can view active products or admin can view all"
    ON public.products FOR SELECT
    USING (is_active = TRUE OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
    ON public.products FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 7. PRODUCT_VARIANTS POLICIES
DROP POLICY IF EXISTS "Public can view active variants or admin can view all" ON public.product_variants;
CREATE POLICY "Public can view active variants or admin can view all"
    ON public.product_variants FOR SELECT
    USING (is_active = TRUE OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert variants" ON public.product_variants;
CREATE POLICY "Admins can insert variants"
    ON public.product_variants FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update variants" ON public.product_variants;
CREATE POLICY "Admins can update variants"
    ON public.product_variants FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete variants" ON public.product_variants;
CREATE POLICY "Admins can delete variants"
    ON public.product_variants FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 8. USER_ADDRESSES POLICIES
DROP POLICY IF EXISTS "Users manage own addresses" ON public.user_addresses;
CREATE POLICY "Users manage own addresses"
    ON public.user_addresses FOR ALL
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = user_id);

-- 9. ORDERS POLICIES
DROP POLICY IF EXISTS "Customers can view their own orders or admin all" ON public.orders;
CREATE POLICY "Customers can view their own orders or admin all"
    ON public.orders FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Authenticated users can insert own orders" ON public.orders;
CREATE POLICY "Authenticated users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR (auth.uid() IS NULL AND user_id IS NULL)
    );

DROP POLICY IF EXISTS "Only admins can update orders" ON public.orders;
CREATE POLICY "Only admins can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can delete orders" ON public.orders;
CREATE POLICY "Only admins can delete orders"
    ON public.orders FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 10. ORDER_ITEMS POLICIES
DROP POLICY IF EXISTS "Users can view order items of their own orders or admin" ON public.order_items;
CREATE POLICY "Users can view order items of their own orders or admin"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE public.orders.id = public.order_items.order_id
            AND (
                (public.orders.user_id IS NOT NULL AND public.orders.user_id = auth.uid())
                OR public.is_admin(auth.uid())
            )
        )
    );

DROP POLICY IF EXISTS "Admins can insert order items" ON public.order_items;
CREATE POLICY "Admins can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update order items" ON public.order_items;
CREATE POLICY "Admins can update order items"
    ON public.order_items FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;
CREATE POLICY "Admins can delete order items"
    ON public.order_items FOR DELETE
    USING (public.is_admin(auth.uid()));

-- 11. STORE_SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can read store settings" ON public.store_settings;
CREATE POLICY "Public can read store settings"
    ON public.store_settings FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "Admins can modify store settings" ON public.store_settings;
CREATE POLICY "Admins can modify store settings"
    ON public.store_settings FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));


-- ==============================================================================
-- 12. SECURE SERVER-SIDE ORDER CREATION RPC FUNCTION
-- Calculates totals from database variants, ignores client submitted prices
-- Creates order and order_items atomically
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.create_order_secure(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_order_type TEXT,
    p_delivery_address TEXT,
    p_order_note TEXT,
    p_items JSONB,
    p_payment_method TEXT DEFAULT 'cod'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_order_id UUID := gen_random_uuid();
    v_order_num TEXT;
    v_subtotal NUMERIC(10, 2) := 0;
    v_shipping NUMERIC(10, 2) := 0;
    v_discount NUMERIC(10, 2) := 0;
    v_total NUMERIC(10, 2) := 0;
    v_item RECORD;
    v_variant RECORD;
    v_clean_phone TEXT;
BEGIN
    -- 1. Input Validations
    IF TRIM(COALESCE(p_customer_name, '')) = '' THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;

    v_clean_phone := REGEXP_REPLACE(p_customer_phone, '\D', '', 'g');
    IF LENGTH(v_clean_phone) != 10 THEN
        RAISE EXCEPTION 'A valid 10-digit Indian phone number is required';
    END IF;

    IF p_order_type NOT IN ('delivery', 'pickup') THEN
        RAISE EXCEPTION 'Invalid order type. Must be delivery or pickup';
    END IF;

    IF p_order_type = 'delivery' AND TRIM(COALESCE(p_delivery_address, '')) = '' THEN
        RAISE EXCEPTION 'Delivery address is required for home delivery';
    END IF;

    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- 2. Generate Human-Readable Unique Order Number (e.g. AF-20261023-A4F2)
    v_order_num := 'AF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- 3. Calculate Item Prices from Database and Verify
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id TEXT,
        size_label TEXT,
        quantity INTEGER
    )
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Quantity must be greater than 0';
        END IF;

        -- Fetch official price and name from trusted database tables
        SELECT pv.id AS variant_id, pv.price, pv.stock_quantity, p.name AS product_name
        INTO v_variant
        FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        WHERE pv.product_id = v_item.product_id
          AND pv.size_label = v_item.size_label
          AND pv.is_active = TRUE
          AND p.is_active = TRUE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant % (%) is unavailable or inactive', v_item.product_id, v_item.size_label;
        END IF;

        v_subtotal := v_subtotal + (v_variant.price * v_item.quantity);
    END LOOP;

    -- 4. Calculate Delivery Fee
    IF p_order_type = 'delivery' THEN
        -- Default to free local delivery or rate from settings
        v_shipping := 0;
    ELSE
        v_shipping := 0;
    END IF;

    v_total := v_subtotal + v_shipping - v_discount;

    -- 5. Insert Order
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

    -- 6. Insert Order Items Snapshots
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

    -- 7. Return Result
    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_num,
        'customer_name', TRIM(p_customer_name),
        'customer_phone', v_clean_phone,
        'order_type', p_order_type,
        'subtotal', v_subtotal,
        'shipping_amount', v_shipping,
        'total_amount', v_total
    );
END;
$$;


-- ==============================================================================
-- 13. ADMIN DASHBOARD STATS RPC FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.admin_get_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_revenue NUMERIC(10, 2) := 0;
    v_total_orders INTEGER := 0;
    v_pending_orders INTEGER := 0;
    v_processing_orders INTEGER := 0;
    v_delivered_orders INTEGER := 0;
    v_total_customers INTEGER := 0;
    v_total_products INTEGER := 0;
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    -- Revenue from orders that are confirmed, processing, out_for_delivery, delivered
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_total_revenue
    FROM public.orders
    WHERE status NOT IN ('cancelled');

    -- Total orders
    SELECT COUNT(*) INTO v_total_orders FROM public.orders;

    -- Pending orders
    SELECT COUNT(*) INTO v_pending_orders FROM public.orders WHERE status = 'pending';

    -- Processing/Awaiting fulfilment
    SELECT COUNT(*) INTO v_processing_orders FROM public.orders WHERE status IN ('confirmed', 'processing', 'out_for_delivery');

    -- Delivered orders
    SELECT COUNT(*) INTO v_delivered_orders FROM public.orders WHERE status = 'delivered';

    -- Customers count
    SELECT COUNT(*) INTO v_total_customers FROM public.profiles;

    -- Active products count
    SELECT COUNT(*) INTO v_total_products FROM public.products WHERE is_active = TRUE;

    RETURN jsonb_build_object(
        'total_revenue', v_total_revenue,
        'total_orders', v_total_orders,
        'pending_orders', v_pending_orders,
        'processing_orders', v_processing_orders,
        'delivered_orders', v_delivered_orders,
        'total_customers', v_total_customers,
        'total_products', v_total_products
    );
END;
$$;


-- ==============================================================================
-- 14. ADMIN UPDATE ORDER STATUS RPC FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
    p_order_id UUID,
    p_status TEXT,
    p_payment_status TEXT DEFAULT NULL,
    p_internal_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    IF p_status NOT IN ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid order status: %', p_status;
    END IF;

    IF p_payment_status IS NOT NULL AND p_payment_status NOT IN ('pending', 'paid', 'cod', 'cancelled', 'refunded') THEN
        RAISE EXCEPTION 'Invalid payment status: %', p_payment_status;
    END IF;

    UPDATE public.orders
    SET
        status = p_status,
        payment_status = COALESCE(p_payment_status, payment_status),
        internal_notes = COALESCE(p_internal_notes, internal_notes),
        updated_at = NOW()
    WHERE id = p_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    RETURN jsonb_build_object('success', TRUE, 'order_id', p_order_id, 'status', p_status);
END;
$$;
