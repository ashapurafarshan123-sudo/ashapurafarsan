import os
import json
from process_zip_catalog import CATALOG_DEFS

# Read CATALOG_DEFS and write src/data/products.ts
output_ts = os.path.join('src', 'data', 'products.ts')

content = """import { Product } from '../types';

/**
 * ASHAPURA FARSAN — OFFICIAL PRODUCT CATALOG
 * 72 Authentic Gujarati Namkeen, Farsan, Wafers, Chivda & Snacks.
 * Includes real optimized WebP photography and multi-weight pricing tiers (250g, 500g, 1kg).
 */

export const PRODUCTS: Product[] = [
"""

for p in CATALOG_DEFS:
    prod_id = f"{p['category_slug']}-{p['slug']}"
    bestseller_str = "true" if p['bestseller'] else "false"
    p250 = p['prices']['250g']
    p500 = p['prices']['500g']
    p1kg = p['prices']['1kg']
    img_path = f"/images/products/{p['slug']}.webp"
    
    # Escape quotes
    name = p['name'].replace("'", "\\'")
    desc = p['description'].replace("'", "\\'")
    
    content += f"""  {{
    id: '{prod_id}',
    slug: '{p['slug']}',
    name: '{name}',
    categorySlug: '{p['category_slug']}',
    description: '{desc}',
    image: '{img_path}',
    bestseller: {bestseller_str},
    prices: {{ '250g': {p250}, '500g': {p500}, '1kg': {p1kg} }},
  }},
"""

content += """];

export default PRODUCTS;
"""

with open(output_ts, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully wrote {len(CATALOG_DEFS)} products to {output_ts}!")
