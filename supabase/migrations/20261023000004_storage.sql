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
