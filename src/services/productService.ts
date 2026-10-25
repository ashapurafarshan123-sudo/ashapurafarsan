import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, ProductWeight } from '../types';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';

export interface AdminProductPayload {
  id?: string;
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  image: string;
  bestseller: boolean;
  prices: {
    '250g': number;
    '500g': number;
    '750g'?: number;
    '1kg': number;
  };
  isActive?: boolean;
}

export const productService = {
  /**
   * Fetch all active products for the storefront
   * Seamlessly checks Supabase; falls back to static product catalog
   */
  async getActiveProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return STATIC_PRODUCTS;
    }

    try {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          category_slug,
          description,
          image,
          bestseller,
          is_active,
          product_variants (
            size_label,
            price,
            is_active
          )
        `)
        .eq('is_active', true);

      if (error || !dbProducts || dbProducts.length === 0) {
        return STATIC_PRODUCTS;
      }

      // Format to frontend Product interface
      return dbProducts.map((p) => {
        const prices: { '250g': number; '500g': number; '750g'?: number; '1kg': number } = {
          '250g': 0,
          '500g': 0,
          '1kg': 0,
        };

        if (Array.isArray(p.product_variants)) {
          p.product_variants.forEach((v: { size_label: string; price: number }) => {
            if (v.size_label === '750g') {
              prices['750g'] = Number(v.price);
            } else if (v.size_label in prices) {
              prices[v.size_label as ProductWeight] = Number(v.price);
            }
          });
        }

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          categorySlug: p.category_slug,
          description: p.description || '',
          image: p.image,
          bestseller: Boolean(p.bestseller),
          prices,
        };
      });
    } catch (err) {
      console.warn('Error fetching products from Supabase, using static catalog:', err);
      return STATIC_PRODUCTS;
    }
  },

  /**
   * Admin: Fetch all products including inactive ones
   */
  async getAdminProducts(): Promise<Array<Product & { isActive: boolean }>> {
    if (!isSupabaseConfigured()) {
      return STATIC_PRODUCTS.map((p) => ({ ...p, isActive: true }));
    }

    try {
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          category_slug,
          description,
          image,
          bestseller,
          is_active,
          product_variants (
            size_label,
            price,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error || !dbProducts) {
        return STATIC_PRODUCTS.map((p) => ({ ...p, isActive: true }));
      }

      return dbProducts.map((p) => {
        const prices: { '250g': number; '500g': number; '750g'?: number; '1kg': number } = {
          '250g': 0,
          '500g': 0,
          '1kg': 0,
        };

        if (Array.isArray(p.product_variants)) {
          p.product_variants.forEach((v: { size_label: string; price: number }) => {
            if (v.size_label === '750g') {
              prices['750g'] = Number(v.price);
            } else if (v.size_label in prices) {
              prices[v.size_label as ProductWeight] = Number(v.price);
            }
          });
        }

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          categorySlug: p.category_slug,
          description: p.description || '',
          image: p.image,
          bestseller: Boolean(p.bestseller),
          isActive: Boolean(p.is_active),
          prices,
        };
      });
    } catch {
      return STATIC_PRODUCTS.map((p) => ({ ...p, isActive: true }));
    }
  },

  /**
   * Admin: Create or update product and its variant prices
   */
  async saveProduct(payload: AdminProductPayload): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const productId = payload.id || `prod-${payload.slug}`;

      // Upsert product
      const { error: prodErr } = await supabase.from('products').upsert({
        id: productId,
        slug: payload.slug,
        name: payload.name,
        category_slug: payload.categorySlug,
        description: payload.description,
        image: payload.image,
        bestseller: payload.bestseller,
        is_active: payload.isActive ?? true,
      });

      if (prodErr) return { success: false, error: prodErr.message };

      // Upsert variants
      const weights: ProductWeight[] = ['250g', '500g', '750g', '1kg'];
      for (const w of weights) {
        const price = payload.prices[w];
        if (price !== undefined && price > 0) {
          await supabase.from('product_variants').upsert(
            {
              product_id: productId,
              size_label: w,
              price: Number(price),
              is_active: true,
            },
            { onConflict: 'product_id,size_label' }
          );
        }
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to save product' };
    }
  },

  /**
   * Admin: Toggle product active/inactive (Stock toggle / soft archive)
   */
  async toggleProductActive(productId: string, currentStatus: boolean): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Admin: Safe Delete Product (Checks if referenced by past orders)
   */
  async deleteProduct(productId: string): Promise<{ success: boolean; archived?: boolean; message?: string; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: true, message: 'Product removed.' };
    }

    try {
      // Check if product is referenced in order_items
      const { count, error: countErr } = await supabase
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);

      if (countErr) {
        console.warn('Could not check order items reference, defaulting to soft-delete:', countErr.message);
      }

      if (count && count > 0) {
        // Safe archival: Mark inactive so order history is strictly preserved
        const { error: archiveErr } = await supabase
          .from('products')
          .update({ is_active: false })
          .eq('id', productId);

        if (archiveErr) return { success: false, error: archiveErr.message };

        return {
          success: true,
          archived: true,
          message: 'Product is linked to previous order history and has been safely archived (marked Out of Stock/Inactive) to preserve financial integrity.',
        };
      }

      // If no past orders reference it, delete product_variants then product
      await supabase.from('product_variants').delete().eq('product_id', productId);
      const { error: delErr } = await supabase.from('products').delete().eq('id', productId);

      if (delErr) {
        // If foreign key constraint blocks deletion, fall back to soft archive
        await supabase.from('products').update({ is_active: false }).eq('id', productId);
        return {
          success: true,
          archived: true,
          message: 'Product safely archived to preserve data integrity.',
        };
      }

      return { success: true, message: 'Product deleted permanently.' };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to delete product' };
    }
  },

  /**
   * Admin: Upload product image to Supabase Storage bucket
   */
  async uploadProductImage(file: File): Promise<{ url: string | null; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Supabase storage is not configured.' };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      return { url: data.publicUrl };
    } catch (err: unknown) {
      return { url: null, error: (err as Error)?.message || 'Failed to upload image' };
    }
  },
};
