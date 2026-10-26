-- ==============================================================================
-- Migration: 20261026000002_fix_rls_and_stock_policies.sql
-- Description: Allow public storefront visitors to read all products & variants
--              so that Out of Stock status is visible to customers (disabling
--              Add to Cart and showing "Out of Stock" badges), while keeping
--              all INSERT, UPDATE, DELETE permissions strictly admin-only.
-- ==============================================================================

-- 1. UPDATE PRODUCTS SELECT POLICY
DROP POLICY IF EXISTS "Public can view active products or admin can view all" ON public.products;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Public can view all products or admin view all" ON public.products;

CREATE POLICY "Public can view all products or admin view all"
    ON public.products FOR SELECT
    USING (true);

-- 2. UPDATE PRODUCT_VARIANTS SELECT POLICY
DROP POLICY IF EXISTS "Public can view active variants or admin can view all" ON public.product_variants;
DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
DROP POLICY IF EXISTS "Public can view all variants or admin view all" ON public.product_variants;

CREATE POLICY "Public can view all variants or admin view all"
    ON public.product_variants FOR SELECT
    USING (true);
