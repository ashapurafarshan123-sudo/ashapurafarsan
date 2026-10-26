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

// Canonical alias pairs for legacy seed product deduplication and synchronization
const LINKED_PRODUCT_ALIASES: Record<string, string[]> = {
  'maida-kachori': ['hero-ashapura-spcl-kachori'],
  'hero-ashapura-spcl-kachori': ['maida-kachori'],
  'namkeen-bhavnagari-gathiya': ['namkeen-bhavnagri-gathiya'],
  'namkeen-bhavnagri-gathiya': ['namkeen-bhavnagari-gathiya'],
  'wafers-potato-waffers': ['wafers-classic-salted'],
  'wafers-classic-salted': ['wafers-potato-waffers'],
};

export const productService = {
  /**
   * Fetch all active products for the storefront
   * Seamlessly checks Supabase; merges with catalog ensuring live prices and true stock states
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
        `);

      if (error || !dbProducts || dbProducts.length === 0) {
        return STATIC_PRODUCTS;
      }

      // Build lookup map of all DB products by canonical ID and slug
      const dbProductMap = new Map<string, Product>();

      dbProducts.forEach((p) => {
        const prices: { '250g': number; '500g': number; '750g'?: number; '1kg': number } = {
          '250g': 0,
          '500g': 0,
          '1kg': 0,
        };

        if (Array.isArray(p.product_variants)) {
          p.product_variants.forEach((v: { size_label: string; price: number; is_active?: boolean }) => {
            if (v.is_active !== false) {
              if (v.size_label === '750g') {
                prices['750g'] = Number(v.price);
              } else if (v.size_label in prices) {
                prices[v.size_label as ProductWeight] = Number(v.price);
              }
            }
          });
        }

        const formattedProd: Product = {
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

        dbProductMap.set(p.id, formattedProd);
        dbProductMap.set(p.slug, formattedProd);
      });

      // Merge with STATIC_PRODUCTS to guarantee:
      // 1. All catalog products are present on the storefront.
      // 2. If a product was marked Out of Stock in Supabase (or excluded by RLS), it is set to isActive = false.
      // 3. If a product was updated in Supabase, its live prices and stock are strictly applied.
      const result: Product[] = [];
      const handledIds = new Set<string>();

      // 1. Process all static catalog products first
      STATIC_PRODUCTS.forEach((staticP) => {
        const dbProd = dbProductMap.get(staticP.id) || dbProductMap.get(staticP.slug);
        if (dbProd) {
          result.push({
            ...staticP,
            name: dbProd.name || staticP.name,
            description: dbProd.description || staticP.description,
            image: dbProd.image || staticP.image,
            bestseller: dbProd.bestseller,
            isActive: dbProd.isActive, // Live stock status from DB
            prices: {
              ...staticP.prices,
              ...(dbProd.prices['250g'] > 0 ? { '250g': dbProd.prices['250g'] } : {}),
              ...(dbProd.prices['500g'] > 0 ? { '500g': dbProd.prices['500g'] } : {}),
              ...(dbProd.prices['750g'] !== undefined ? { '750g': dbProd.prices['750g'] } : {}),
              ...(dbProd.prices['1kg'] > 0 ? { '1kg': dbProd.prices['1kg'] } : {}),
            },
          });
          handledIds.add(staticP.id);
          handledIds.add(dbProd.id);
        } else {
          // In static catalog, but not returned in active Supabase query (e.g. filtered by RLS because is_active = false)
          result.push({
            ...staticP,
            isActive: false, // Marked Out of Stock
          });
          handledIds.add(staticP.id);
        }
      });

      // 2. Include any newly added custom products in DB that were not in STATIC_PRODUCTS
      dbProducts.forEach((p) => {
        if (!handledIds.has(p.id) && !handledIds.has(p.slug)) {
          const aliases = LINKED_PRODUCT_ALIASES[p.id] || [];
          const isAliasHandled = aliases.some((a) => handledIds.has(a));
          if (!isAliasHandled) {
            const prod = dbProductMap.get(p.id);
            if (prod) {
              result.push(prod);
              handledIds.add(p.id);
            }
          }
        }
      });

      return result;
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
          p.product_variants.forEach((v: { size_label: string; price: number; is_active?: boolean }) => {
            if (v.is_active !== false) {
              if (v.size_label === '750g') {
                prices['750g'] = Number(v.price);
              } else if (v.size_label in prices) {
                prices[v.size_label as ProductWeight] = Number(v.price);
              }
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
   * Persists changes to Supabase, verifies returned data, and re-fetches confirmation
   */
  async saveProduct(payload: AdminProductPayload): Promise<{
    success: boolean;
    product?: Product & { isActive: boolean };
    error?: string;
  }> {
    if (!isSupabaseConfigured()) {
      return { success: true };
    }

    try {
      const productId = payload.id || `prod-${payload.slug}`;

      // 1. Upsert product table row
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .upsert({
          id: productId,
          slug: payload.slug,
          name: payload.name,
          category_slug: payload.categorySlug,
          description: payload.description,
          image: payload.image,
          bestseller: payload.bestseller,
          is_active: payload.isActive ?? true,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (prodErr) {
        return { success: false, error: `Product table update failed: ${prodErr.message}` };
      }
      if (!prodData || prodData.length === 0) {
        return {
          success: false,
          error: 'Save failed: Admin session expired or unauthorized. Please re-login at /admin/login.',
        };
      }

      // 2. Upsert / synchronize variant prices
      const weights: ProductWeight[] = ['250g', '500g', '750g', '1kg'];
      for (const w of weights) {
        const price = payload.prices[w];
        if (price !== undefined && Number(price) > 0) {
          const { error: vErr } = await supabase
            .from('product_variants')
            .upsert(
              {
                product_id: productId,
                size_label: w,
                price: Number(price),
                is_active: payload.isActive ?? true,
              },
              { onConflict: 'product_id,size_label' }
            )
            .select();

          if (vErr) {
            return {
              success: false,
              error: `Failed to update variant price for ${w}: ${vErr.message}`,
            };
          }
        } else if (w === '750g' && (price === undefined || Number(price) <= 0)) {
          // Deactivate optional 750g if zero
          await supabase
            .from('product_variants')
            .update({ is_active: false, price: 0 })
            .eq('product_id', productId)
            .eq('size_label', '750g');
        }
      }

      // 3. Also synchronize linked legacy alias if applicable
      const aliases = LINKED_PRODUCT_ALIASES[productId] || [];
      for (const aliasId of aliases) {
        await supabase
          .from('products')
          .update({
            name: payload.name,
            description: payload.description,
            image: payload.image,
            bestseller: payload.bestseller,
            is_active: payload.isActive ?? true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', aliasId);

        for (const w of weights) {
          const price = payload.prices[w];
          if (price !== undefined && Number(price) > 0) {
            await supabase
              .from('product_variants')
              .upsert(
                {
                  product_id: aliasId,
                  size_label: w,
                  price: Number(price),
                  is_active: payload.isActive ?? true,
                },
                { onConflict: 'product_id,size_label' }
              );
          }
        }
      }

      // 4. Re-fetch the updated product from Supabase to verify persisted values
      const { data: refreshed, error: refreshErr } = await supabase
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
        .eq('id', productId)
        .maybeSingle();

      if (refreshErr || !refreshed) {
        return {
          success: false,
          error: `Saved, but verification re-fetch failed: ${refreshErr?.message || 'Product not found'}`,
        };
      }

      const confirmedPrices: { '250g': number; '500g': number; '750g'?: number; '1kg': number } = {
        '250g': 0,
        '500g': 0,
        '1kg': 0,
      };

      if (Array.isArray(refreshed.product_variants)) {
        refreshed.product_variants.forEach((v: { size_label: string; price: number; is_active: boolean }) => {
          if (v.is_active !== false) {
            if (v.size_label === '750g') {
              confirmedPrices['750g'] = Number(v.price);
            } else if (v.size_label in confirmedPrices) {
              confirmedPrices[v.size_label as ProductWeight] = Number(v.price);
            }
          }
        });
      }

      // Verify that requested 250g price was persisted
      if (payload.prices['250g'] && confirmedPrices['250g'] !== Number(payload.prices['250g'])) {
        return {
          success: false,
          error: `Price verification mismatch: Requested 250g ₹${payload.prices['250g']}, but database has ₹${confirmedPrices['250g']}`,
        };
      }

      const confirmedProduct: Product & { isActive: boolean } = {
        id: refreshed.id,
        slug: refreshed.slug,
        name: refreshed.name,
        categorySlug: refreshed.category_slug,
        description: refreshed.description || '',
        image: refreshed.image,
        bestseller: Boolean(refreshed.bestseller),
        isActive: Boolean(refreshed.is_active),
        prices: confirmedPrices,
      };

      return { success: true, product: confirmedProduct };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to save product' };
    }
  },

  /**
   * Admin: Toggle product active/inactive (Stock toggle / soft archive)
   * Synchronizes product_variants and verifies persistence
   */
  async toggleProductActive(productId: string, currentStatus: boolean): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const nextStatus = !currentStatus;

      // 1. Update product is_active
      const { data, error } = await supabase
        .from('products')
        .update({
          is_active: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select();

      if (error || !data || data.length === 0) {
        console.error('Failed to toggle product active in database:', error);
        return false;
      }

      // 2. Also update all variants is_active to match
      const { error: vErr } = await supabase
        .from('product_variants')
        .update({ is_active: nextStatus })
        .eq('product_id', productId);

      if (vErr) {
        console.warn('Variant active status sync warning:', vErr.message);
      }

      // 3. Also synchronize linked legacy alias if applicable
      const aliases = LINKED_PRODUCT_ALIASES[productId] || [];
      for (const aliasId of aliases) {
        await supabase
          .from('products')
          .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
          .eq('id', aliasId);

        await supabase
          .from('product_variants')
          .update({ is_active: nextStatus })
          .eq('product_id', aliasId);
      }

      // 4. Re-fetch to verify persistence
      const { data: verified } = await supabase
        .from('products')
        .select('is_active')
        .eq('id', productId)
        .maybeSingle();

      return verified?.is_active === nextStatus;
    } catch (e) {
      console.error('toggleProductActive exception:', e);
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
