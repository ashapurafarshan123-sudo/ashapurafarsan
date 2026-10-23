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
