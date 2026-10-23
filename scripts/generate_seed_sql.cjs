const fs = require('fs');

const catMatch = fs.readFileSync('src/data/categories.ts', 'utf8');
const prodMatch = fs.readFileSync('src/data/products.ts', 'utf8');
const stripTs = (ts) => ts.replace(/:\s*Category\[\]/g, '').replace(/:\s*Product\[\]/g, '').replace(/import[^;]+;/g, '').replace(/export\s+/g, '');

const evalContext = {};
const fn = new Function('exports', stripTs(catMatch) + '\n' + stripTs(prodMatch) + '\nexports.CATEGORIES = CATEGORIES; exports.PRODUCTS = PRODUCTS;');
fn(evalContext);

const esc = (s) => (s ? "'" + s.replace(/'/g, "''") + "'" : "NULL");

let sql = '-- ==============================================================================\n';
sql += '-- Migration: 20261023000002_seed_products.sql\n';
sql += '-- Description: Seed categories, products, variants and default store settings\n';
sql += '-- ==============================================================================\n\n';

sql += '-- 1. SEED CATEGORIES\n';
evalContext.CATEGORIES.forEach((cat, idx) => {
  sql += 'INSERT INTO public.categories (slug, title, subtitle, image, theme_color, text_color, subtext_color, icon_type, sort_order, is_active)\n';
  sql += 'VALUES (' + [
    esc(cat.slug),
    esc(cat.title),
    esc(cat.subtitle),
    esc(cat.image),
    esc(cat.themeColor),
    esc(cat.textColor),
    esc(cat.subtextColor),
    esc(cat.iconType),
    idx + 1,
    'TRUE'
  ].join(', ') + ')\n';
  sql += 'ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, image = EXCLUDED.image, theme_color = EXCLUDED.theme_color, text_color = EXCLUDED.text_color, subtext_color = EXCLUDED.subtext_color, icon_type = EXCLUDED.icon_type, sort_order = EXCLUDED.sort_order;\n\n';
});

sql += '-- 2. SEED PRODUCTS & VARIANTS\n';
evalContext.PRODUCTS.forEach((prod) => {
  sql += 'INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)\n';
  sql += 'VALUES (' + [
    esc(prod.id),
    esc(prod.slug),
    esc(prod.name),
    esc(prod.categorySlug),
    esc(prod.description),
    esc(prod.image),
    prod.bestseller ? 'TRUE' : 'FALSE',
    'TRUE'
  ].join(', ') + ')\n';
  sql += 'ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, name = EXCLUDED.name, category_slug = EXCLUDED.category_slug, description = EXCLUDED.description, image = EXCLUDED.image, bestseller = EXCLUDED.bestseller, is_active = EXCLUDED.is_active;\n\n';

  // Seed variants
  const weights = ['250g', '500g', '1kg'];
  weights.forEach((w) => {
    const price = prod.prices[w] || 0;
    sql += 'INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)\n';
    sql += 'VALUES (' + [
      esc(prod.id),
      esc(w),
      price,
      100,
      'TRUE'
    ].join(', ') + ')\n';
    sql += 'ON CONFLICT (product_id, size_label) DO UPDATE SET price = EXCLUDED.price, is_active = EXCLUDED.is_active;\n';
  });
  sql += '\n';
});

sql += '-- 3. SEED STORE SETTINGS\n';
sql += `INSERT INTO public.store_settings (key, value, description)
VALUES 
  ('shipping', '{"standard_fee": 0, "free_shipping_min": 0, "local_delivery_area": "Mira Road, Mumbai"}', 'Delivery fee rules and local coverage'),
  ('contact', '{"phone_primary": "801058 0082", "whatsapp_number": "919772331014", "address": "Shop No 15, Shantipark, Mira Road, Mumbai - 401107", "hours": "Open Daily: 8:00 AM - 10:30 PM"}', 'Store contact details and operating hours'),
  ('operational', '{"is_store_open": true, "accepting_orders": true, "announcement": "Fresh farsan prepared daily in pure groundnut oil!"}', 'Live store operations and announcements')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;
`;

fs.writeFileSync('supabase/migrations/20261023000002_seed_products.sql', sql, 'utf8');
console.log('Successfully generated supabase/migrations/20261023000002_seed_products.sql');
