-- ==============================================================================
-- ASHAPURA FARSAN: CLEAN SCHEMA SETUP & RE-SYNC SCRIPT FOR SUPABASE
-- Project: https://supabase.com/dashboard/project/kplcpasenjwdpqtqvwtb
-- SQL Editor URL: https://supabase.com/dashboard/project/kplcpasenjwdpqtqvwtb/sql/new
-- ==============================================================================

-- 0. CLEAN UP CONFLICTING OLD PRE-REDESIGN TABLES
-- (auth.users accounts in auth schema remain completely untouched and safe)
DROP TABLE IF EXISTS public.discounts CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.admin_roles CASCADE;
DROP TABLE IF EXISTS public.store_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop obsolete functions if any
DROP FUNCTION IF EXISTS public.admin_get_advanced_analytics CASCADE;
DROP FUNCTION IF EXISTS public.provision_admin_by_email CASCADE;
DROP FUNCTION IF EXISTS public.create_order_secure CASCADE;
DROP FUNCTION IF EXISTS public.admin_get_dashboard_stats CASCADE;
DROP FUNCTION IF EXISTS public.admin_update_order_status CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;


-- ==============================================================================

-- ==============================================================================
-- Migration: 20261023000001_core_schema.sql
-- Description: Core Ashapura Farsan database schema
-- Tables: profiles, admin_roles, categories, products, product_variants,
--         user_addresses, orders, order_items, store_settings
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 3. PROFILES TABLE (linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. ADMIN_ROLES TABLE (Dedicated role table - not editable via client profiles)
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user ON public.admin_roles(user_id);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT,
    theme_color TEXT,
    text_color TEXT,
    subtext_color TEXT,
    icon_type TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.categories(is_active, sort_order);

-- 6. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    description TEXT,
    image TEXT NOT NULL,
    bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active_bestseller ON public.products(is_active, bestseller);

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. PRODUCT_VARIANTS TABLE (e.g. 250g, 500g, 1kg packaging)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_label TEXT NOT NULL CHECK (size_label IN ('250g', '500g', '750g', '1kg', 'standard')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_product_size UNIQUE (product_id, size_label)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_lookup ON public.product_variants(product_id, is_active);

-- 8. USER_ADDRESSES TABLE (Customer Saved Delivery Addresses)
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL DEFAULT 'Mira Road',
    pincode TEXT NOT NULL DEFAULT '401107',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON public.user_addresses(user_id);

CREATE TRIGGER set_user_addresses_updated_at
    BEFORE UPDATE ON public.user_addresses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
    delivery_address TEXT,
    order_note TEXT,
    internal_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cod', 'cancelled', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'whatsapp_direct', 'store_pickup')),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 10. ORDER_ITEMS TABLE (Historical immutable snapshot of items purchased)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name_snapshot TEXT NOT NULL,
    variant_size_snapshot TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 11. STORE_SETTINGS TABLE (Key-value store for store configurations)
CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NEW USER AUTOMATIC PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = CASE WHEN public.profiles.phone IS NULL OR public.profiles.phone = '' THEN EXCLUDED.phone ELSE public.profiles.phone END;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================

-- ==============================================================================
-- Migration: 20261023000002_seed_products.sql
-- Description: Seed categories, products, variants and default store settings
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('namkeen', 'Namkeen', 'Classic salted bites', '/images/categories/food-namkeen.png', '#355963', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'namkeen', 1, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('diet-chivda', 'Diet Chivda', 'Light & healthy', '/images/categories/food-traditional-farsan.png', '#1E3F2B', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'diet', 2, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('nali', 'Nali', 'Crispy spirals', '/images/categories/food-snacks.png', '#A87928', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'spiral', 3, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('chakli', 'Chakli', 'Rice flour crunch', '/images/categories/chakli.webp', '#D8B272', '#2D180C', '#5E4636', 'chakli', 4, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('maida', 'Maida', 'Flour-based snacks', '/images/categories/food-snacks.png', '#B67E70', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'samosa', 5, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('chana-singh', 'Chana & Singh', 'Roasted & spiced', '/images/categories/food-dry-fruits.png', '#4A1521', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'nuts', 6, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('chikki', 'Chikki', 'Sweet brittle bars', '/images/categories/food-special-combos.png', '#432035', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'chikki', 7, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('poha-chivda', 'Poha Chivda', 'Flattened rice mix', '/images/categories/food-traditional-farsan.png', '#BA832B', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'poha', 8, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('bhel', 'Bhel', 'Mumbai street style', '/images/categories/food-namkeen.png', '#581C26', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'bhel', 9, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('wafers', 'Wafers', 'Crispy potato slices', '/images/categories/food-traditional-farsan.png', '#96632B', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'wafer', 10, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('satwik', 'Satwik', 'Khari & toast items', '/images/categories/food-beverages-others.png', '#254A36', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'tea', 11, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)
VALUES ('cakes', 'Cakes', 'Slice cakes & plum cakes', '/images/categories/food-desi-sweets.png', '#52233E', '#FFFFFF', 'rgba(255, 255, 255, 0.85)', 'cake', 12, TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;

-- 2. SEED PRODUCTS & VARIANTS
INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('hero-ashapura-spcl-kachori', 'ashapura-spcl-kachori', 'Ashapura Spcl Kachori', 'maida', 'Flaky, golden-fried artisanal kachoris filled with spiced crushed moong dal, roasted hing, and black pepper.', '/images/products/hero-kachori.png', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-kachori', '250g', 110, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-kachori', '500g', 210, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-kachori', '1kg', 400, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('hero-ashapura-spcl-multigrain-chivda', 'ashapura-spcl-multigrain-chivda', 'Ashapura Spcl Multigrain Chivda', 'diet-chivda', 'Signature zero-oil roasted mix of oats, crisp ragi flakes, bajra puffs, and golden cashews with rock salt.', '/images/products/hero-multigrain-chivda.png', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-multigrain-chivda', '250g', 120, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-multigrain-chivda', '500g', 230, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-multigrain-chivda', '1kg', 440, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('hero-ashapura-spcl-khatta-meetha-mix', 'ashapura-spcl-khatta-meetha-mix', 'Ashapura Spcl Khatta Meetha Mix', 'namkeen', 'A legendary Mumbai-style medley of crisp sev, sweet raisins, toasted peanuts, and aromatic candied spices.', '/images/products/hero-khatta-meetha.png', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-khatta-meetha-mix', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-khatta-meetha-mix', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('hero-ashapura-spcl-khatta-meetha-mix', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-ratlami-sev', 'ratlami-sev', 'Ratlami Sev', 'namkeen', 'Crisp, spicy chickpea noodles flavored with cloves, black pepper and hing.', '/images/products/ratlami-sev.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '250g', 90, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '500g', 170, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '1kg', 330, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-bhavnagri-gathiya', 'bhavnagri-gathiya', 'Bhavnagri Gathiya', 'namkeen', 'Soft, melt-in-the-mouth carom-spiced gathiya, the traditional morning snack of Saurashtra.', '/images/products/bhavnagri-gathiya.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagri-gathiya', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagri-gathiya', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagri-gathiya', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-nylon-sev', 'nylon-sev', 'Fine Nylon Sev', 'namkeen', 'Ultra-thin, golden sev ideal for chaat garnishing, poha, or light munching.', '/images/products/nylon-sev.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nylon-sev', '250g', 85, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nylon-sev', '500g', 160, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nylon-sev', '1kg', 310, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-tikha-gathiya', 'tikha-gathiya', 'Tikha Spicy Gathiya', 'namkeen', 'Fiery gathiya coated with red chilli and ajwain for true spice lovers.', '/images/products/tikha-gathiya.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '250g', 90, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '500g', 175, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '1kg', 340, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-roasted-poha', 'diet-roasted-poha-chivda', 'Diet Roasted Poha Chivda', 'diet-chivda', 'Oil-free crisp roasted poha lightly seasoned with turmeric, curry leaves and roasted peanuts.', '/images/products/diet-roasted-poha-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-roasted-poha', '250g', 80, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-roasted-poha', '500g', 150, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-roasted-poha', '1kg', 290, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-kurmura-chivda', 'diet-kurmura-bhel-mix', 'Diet Kurmura Chivda', 'diet-chivda', 'Crisp puffed rice with roasted dal, green chilli tempering and subtle spices.', '/images/products/diet-kurmura-bhel-mix.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-kurmura-chivda', '250g', 70, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-kurmura-chivda', '500g', 130, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-kurmura-chivda', '1kg', 250, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-makhana-mix', 'roasted-makhana-mix', 'Roasted Makhana Mix', 'diet-chivda', 'Crunchy lotus seeds roasted with Himalayan pink salt and mild pepper.', '/images/products/roasted-makhana-mix.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-makhana-mix', '250g', 150, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-makhana-mix', '500g', 290, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-makhana-mix', '1kg', 560, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-crispy-spirals', 'masala-nali-spirals', 'Masala Nali Spirals', 'nali', 'Hollow, spiral fryum tubes sprinkled with tangy chaat masala.', '/images/products/masala-nali-spirals.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-crispy-spirals', '250g', 75, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-crispy-spirals', '500g', 140, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-crispy-spirals', '1kg', 270, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-salted-tubes', 'classic-salted-nali', 'Classic Salted Nali', 'nali', 'Mildly salted, crisp hollow cylinders loved especially by children.', '/images/products/classic-salted-nali.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-salted-tubes', '250g', 70, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-salted-tubes', '500g', 130, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-salted-tubes', '1kg', 250, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-butter-rice', 'butter-rice-chakli', 'Butter Rice Chakli', 'chakli', 'Crunchy spiral rounds made from spiced rice flour with a fragrant hint of white butter.', '/images/products/butter-rice-chakli.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-rice', '250g', 110, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-rice', '500g', 210, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-rice', '1kg', 400, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-methi-crunch', 'methi-chakli', 'Methi Crunch Chakli', 'chakli', 'Infused with roasted fenugreek leaves and cumin for an earthy aromatic crunch.', '/images/products/methi-chakli.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-methi-crunch', '250g', 115, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-methi-crunch', '500g', 220, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-methi-crunch', '1kg', 420, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-dry-fruit-shakarpara', 'shakarpara-sweet', 'Sweet Shakarpara', 'maida', 'Diamond-cut bite-sized sweet pastry cubes coated in crystallized sugar.', '/images/products/shakarpara-sweet.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-dry-fruit-shakarpara', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-dry-fruit-shakarpara', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-dry-fruit-shakarpara', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-namakpara', 'namakpara-salted', 'Namakpara Ajwain Sticks', 'maida', 'Flaky savoury flour crisps delicately flavoured with crushed carom seeds.', '/images/products/namakpara-salted.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-namakpara', '250g', 90, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-namakpara', '500g', 170, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-namakpara', '1kg', 330, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-farsi-puri', 'farsi-puri-crispy', 'Gujarati Farsi Puri', 'maida', 'Crisp, layered spiced puris with black pepper pearls, perfect for evening tea.', '/images/products/farsi-puri-crispy.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-farsi-puri', '250g', 100, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-farsi-puri', '500g', 190, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-farsi-puri', '1kg', 370, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-roasted-haldi', 'roasted-haldi-chana', 'Roasted Haldi Chana', 'chana-singh', 'Crunchy dry-roasted Bengal gram with turmeric, rock salt, and spices.', '/images/products/roasted-haldi-chana.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-roasted-haldi', '250g', 80, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-roasted-haldi', '500g', 150, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-roasted-haldi', '1kg', 290, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('singh-masala-coated', 'masala-singh-peanuts', 'Masala Singh Peanuts', 'chana-singh', 'Crispy gram-flour battered peanuts packed with tangy Gujarati spices.', '/images/products/masala-singh-peanuts.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-masala-coated', '250g', 90, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-masala-coated', '500g', 170, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-masala-coated', '1kg', 330, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('singh-hing-jeera', 'hing-jeera-singh', 'Hing Jeera Salted Peanuts', 'chana-singh', 'Whole roasted peanuts tempered with asafoetida and cumin salt.', '/images/products/hing-jeera-singh.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-hing-jeera', '250g', 85, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-hing-jeera', '500g', 160, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('singh-hing-jeera', '1kg', 310, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chikki-peanut-jaggery', 'peanut-jaggery-chikki', 'Peanut Jaggery Chikki', 'chikki', 'Traditional brittle slab of golden roasted peanuts bound with pure organic jaggery.', '/images/products/peanut-jaggery-chikki.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-jaggery', '250g', 100, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-jaggery', '500g', 190, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-jaggery', '1kg', 370, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chikki-til-sesame', 'til-sesame-chikki', 'Til Sesame Chikki', 'chikki', 'Nutty white sesame seeds caramelized in sugar syrup with cardamom essence.', '/images/products/til-sesame-chikki.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-sesame', '250g', 110, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-sesame', '500g', 210, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-sesame', '1kg', 400, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chikki-dryfruit-crush', 'dryfruit-crush-chikki', 'Dryfruit Royal Chikki', 'chikki', 'Cashews, almonds, and pistachios combined into a crunchy festive treat.', '/images/products/dryfruit-crush-chikki.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-dryfruit-crush', '250g', 220, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-dryfruit-crush', '500g', 420, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-dryfruit-crush', '1kg', 800, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-cornflakes-mix', 'cornflakes-chivda', 'Cornflakes Chivda', 'poha-chivda', 'Sweet and tangy mixture with crispy cornflakes, raisins, cashews and fried curry leaves.', '/images/products/cornflakes-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-cornflakes-mix', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-cornflakes-mix', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-cornflakes-mix', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-gujarati-special', 'gujarati-special-poha-chivda', 'Gujarati Special Poha Chivda', 'poha-chivda', 'Thin flattened rice tossed with sesame, split dalia, peanuts and mild sweetness.', '/images/products/gujarati-special-poha-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-gujarati-special', '250g', 85, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-gujarati-special', '500g', 160, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-gujarati-special', '1kg', 310, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-mumbai-sukha-mix', 'mumbai-sukha-bhel-mix', 'Mumbai Sukha Bhel Mix', 'bhel', 'Authentic dry bhel blend with roasted murmura, sev, puris and dry tangy chutney powder.', '/images/products/mumbai-sukha-bhel-mix.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-sukha-mix', '250g', 80, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-sukha-mix', '500g', 150, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-sukha-mix', '1kg', 290, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-flat-papdi-puri', 'chaat-papdi-puri', 'Crisp Chaat Papdi', 'bhel', 'Golden flat round puris crafted specifically for homemade sev puri and dahi puri.', '/images/products/chaat-papdi-puri.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-flat-papdi-puri', '250g', 75, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-flat-papdi-puri', '500g', 140, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-flat-papdi-puri', '1kg', 270, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-classic-salted', 'classic-salted-potato-wafers', 'Classic Salted Potato Wafers', 'wafers', 'Thin hand-cut potato slices fried to a light golden crunch, lightly sea-salted.', '/images/products/classic-salted-potato-wafers.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-classic-salted', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-classic-salted', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-classic-salted', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-tomato-masala', 'tangy-tomato-wafers', 'Tangy Tomato Wafers', 'wafers', 'Potato crisps infused with tangy tomato dust and aromatic Indian spices.', '/images/products/tangy-tomato-wafers.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-masala', '250g', 100, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-masala', '500g', 190, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-masala', '1kg', 370, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-banana-mari', 'kela-mari-wafers', 'Kela Mari Yellow Banana Wafers', 'wafers', 'Crispy raw banana chips dusted with freshly cracked black pepper and rock salt.', '/images/products/kela-mari-wafers.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-banana-mari', '250g', 110, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-banana-mari', '500g', 210, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-banana-mari', '1kg', 400, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('satwik-maska-khari', 'pure-maska-khari', 'Pure Maska Khari Biscuit', 'satwik', 'Feathery light puff pastry fingers baked with pure butter, ideal chai accompaniment.', '/images/products/pure-maska-khari.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-maska-khari', '250g', 90, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-maska-khari', '500g', 170, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-maska-khari', '1kg', 330, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('satwik-methi-khari', 'roasted-methi-khari', 'Roasted Methi Khari', 'satwik', 'Flaky layered puff biscuits enriched with dried fenugreek leaves for rich aroma.', '/images/products/roasted-methi-khari.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-methi-khari', '250g', 95, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-methi-khari', '500g', 180, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-methi-khari', '1kg', 350, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('satwik-jeera-toast', 'crunchy-jeera-toast', 'Crunchy Jeera Toast Rusk', 'satwik', 'Twice-baked crispy golden wheat rusks speckled with fragrant roasted cumin.', '/images/products/crunchy-jeera-toast.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-jeera-toast', '250g', 80, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-jeera-toast', '500g', 150, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('satwik-jeera-toast', '1kg', 290, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('cakes-traditional-plum', 'traditional-plum-cake', 'Traditional Rich Plum Cake', 'cakes', 'Soft spiced bakery cake studded with candied fruit peels, raisins, and aromatic spices.', '/images/products/traditional-plum-cake.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-traditional-plum', '250g', 130, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-traditional-plum', '500g', 250, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-traditional-plum', '1kg', 480, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('cakes-mava-cupcake', 'gujarati-mava-cake', 'Rich Mava Cake Slices', 'cakes', 'Dense cardamom-scented sponge infused with fresh evaporated milk solid (mava).', '/images/products/gujarati-mava-cake.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;

INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-mava-cupcake', '250g', 140, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-mava-cupcake', '500g', 270, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('cakes-mava-cupcake', '1kg', 520, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;

-- 3. SEED STORE SETTINGS
INSERT INTO public.store_settings (key, value, description)
VALUES 
  ('shipping', '{"standard_fee": 0, "free_shipping_min": 0, "local_delivery_area": "Mira Road, Mumbai"}', 'Delivery fee rules and local coverage'),
  ('contact', '{"phone_primary": "801058 0082", "whatsapp_number": "919772331014", "address": "Shop No 15, Shantipark, Mira Road, Mumbai - 401107", "hours": "Open Daily: 8:00 AM - 10:30 PM"}', 'Store contact details and operating hours'),
  ('operational', '{"is_store_open": true, "accepting_orders": true, "announcement": "Fresh farsan prepared daily in pure groundnut oil!"}', 'Live store operations and announcements')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;


-- ==============================================================================

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


-- ==============================================================================

-- ==============================================================================
-- Migration: 20261023000004_storage.sql
-- Description: Supabase Storage bucket for product images with RLS policies
-- ==============================================================================

-- 1. Create product-images storage bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    TRUE,
    5242880, -- 5 MB max limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- 2. Storage Policies for product-images bucket
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'product-images'
        AND public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'product-images'
        AND public.is_admin(auth.uid())
    )
    WITH CHECK (
        bucket_id = 'product-images'
        AND public.is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'product-images'
        AND public.is_admin(auth.uid())
    );


-- ==============================================================================

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
