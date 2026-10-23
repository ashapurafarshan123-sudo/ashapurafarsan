-- ==============================================================================
-- ASHAPURA FARSAN — 72 REAL PRODUCTS & VARIANTS SEED MIGRATION
-- Generated from client image catalog with 600x600 transparent WebP assets
-- ==============================================================================

BEGIN;

-- 1. UPSERT ALL PRODUCTS
INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-bajra-puri', 'bajra-puri', 'Bajra Puri', 'maida', 'Crispy, nutritious pearl millet puris spiced with sesame, carom seeds, and mild hing.', '/images/products/bajra-puri.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-bhadang-bhel', 'bhadang-bhel', 'Bhadang Bhel', 'bhel', 'Zesty spiced puffed rice bhel tossed with roasted peanuts, curry leaves, and red chili.', '/images/products/bhadang-bhel.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-bhajni-chakli', 'bhajni-chakli', 'Bhajni Chakli', 'chakli', 'Authentic multigrain roasted flour chakli hand-pressed with cumin and coriander spice notes.', '/images/products/bhajni-chakli.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-bhavnagari-gathiya', 'bhavnagari-gathiya', 'Bhavnagari Gathiya', 'namkeen', 'Melt-in-mouth Gujarati Bhavnagari gathiya with subtle carom seed and black pepper warmth.', '/images/products/bhavnagari-gathiya.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-bombay-mix-farsan', 'bombay-mix-farsan', 'Bombay Mix Farsan', 'namkeen', 'The quintessential Mumbai tea-time farsan with crunchy sev, boondi, flakes, and nuts.', '/images/products/bombay-mix-farsan.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-butter-chakli', 'butter-chakli', 'Butter Chakli', 'chakli', 'Delicate spiral rice flour chaklis infused with pure butter for a melt-in-mouth crunch.', '/images/products/butter-chakli.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-chana-dal', 'chana-dal', 'Chana Dal Namkeen', 'chana-singh', 'Golden fried split Bengal gram seasoned with rock salt, amchur, and roasted spices.', '/images/products/chana-dal.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-chanajhor', 'chanajhor', 'Chana Jor Garam', 'namkeen', 'Pressed and spiced black chickpeas roasted to perfection with tangy chaat masala.', '/images/products/chanajhor.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-cheese-balls', 'cheese-balls', 'Cheese Balls', 'nali', 'Airy, crunchy puffed corn balls generously dusted with savory cheddar cheese seasoning.', '/images/products/cheese-balls.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-corn-khatta-mitha-chivda', 'corn-khatta-mitha-chivda', 'Corn Khatta Meetha Chivda', 'poha-chivda', 'Crunchy golden cornflakes tossed in sweet-and-sour spices with raisins and peanuts.', '/images/products/corn-khatta-mitha-chivda.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-dabeli-sing', 'dabeli-sing', 'Dabeli Sing', 'chana-singh', 'Signature roasted Bharuch peanuts coated in aromatic sweet and spicy Kutchhi Dabeli masala.', '/images/products/dabeli-sing.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-dal-moth', 'dal-moth', 'Dal Moth', 'namkeen', 'Crispy fried whole brown lentils blended with fine gram sev, cashews, and rich spices.', '/images/products/dal-moth.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-diet-bhel', 'diet-bhel', 'Diet Bhel', 'bhel', 'Zero-guilt roasted puffed rice tossed with turmeric, mustard seeds, and light rock salt.', '/images/products/diet-bhel.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-diet-chivda', 'diet-chivda', 'Diet Chivda', 'diet-chivda', 'Wholesome roasted poha mix with minimal oil, seasoned with green chili and roasted curry leaves.', '/images/products/diet-chivda.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-farali-chivda', 'farali-chivda', 'Farali Chivda (Fasting Special)', 'poha-chivda', 'Traditional Upvas chivda made with crispy sago pearls, potato salli, roasted peanuts, and sendha namak.', '/images/products/farali-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-golden-mix-chivda', 'golden-mix-chivda', 'Golden Mix Chivda', 'poha-chivda', 'Crispy beaten rice, puffed cereals, and roasted nuts tossed in a golden aromatic glaze.', '/images/products/golden-mix-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-kachori', 'kachori', 'Ashapura Spcl Kachori', 'maida', 'Flaky, golden-fried artisanal kachoris filled with spiced crushed moong dal, roasted hing, and black pepper.', '/images/products/kachori.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-kerela-chips', 'kerela-chips', 'Kerala Banana Chips', 'wafers', 'Sun-ripened Nendran raw bananas sliced and crisp-fried in pure coconut oil with sea salt.', '/images/products/kerela-chips.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-khatta-mitha-chivda', 'khatta-mitha-chivda', 'Khatta Meetha Chivda', 'poha-chivda', 'A sweet, tangy harmony of crispy poha, savory sev, golden raisins, and roasted peanuts.', '/images/products/khatta-mitha-chivda.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-lasun-chivda', 'lasun-chivda', 'Lasun Chivda', 'poha-chivda', 'Bold and fragrant roasted garlic flakes tossed with crispy poha and fiery red chili.', '/images/products/lasun-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-lemon-bhel', 'lemon-bhel', 'Lemon Bhel', 'bhel', 'Crispy puffed rice infused with zesty natural lemon essence and crushed green chilies.', '/images/products/lemon-bhel.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-long-banana-spicy-chips', 'long-banana-spicy-chips', 'Long Banana Spicy Chips', 'wafers', 'Ribbon-cut raw banana strips seasoned with hot Kashmiri red chili and cumin seasoning.', '/images/products/long-banana-spicy-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-makai-mung-stick', 'makai-mung-stick', 'Makai Moong Stick', 'diet-chivda', 'Crunchy roasted corn and sprouted moong flour sticks packed with fiber and savory flavor.', '/images/products/makai-mung-stick.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-makhaniya-gathiya', 'makhaniya-gathiya', 'Makhaniya Gathiya', 'namkeen', 'Soft, pillowy gram flour gathiya that melts effortlessly in your mouth, lightly salted.', '/images/products/makhaniya-gathiya.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-mangluri-chivda', 'mangluri-chivda', 'Mangalori Chivda', 'poha-chivda', 'Coastal-style poha chivda tempered with fresh curry leaves, mustard seeds, and fried coconut slices.', '/images/products/mangluri-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-masala-nali', 'masala-nali', 'Masala Nali', 'nali', 'Hollow cylinder fryums dusted generously with tangy peri-peri and Indian chaat spices.', '/images/products/masala-nali.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-masala-patla-chips', 'masala-patla-chips', 'Masala Patla Potato Chips', 'wafers', 'Ultra-thin sliced golden potatoes seasoned with our secret blend of Gujarati masala spices.', '/images/products/masala-patla-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-methi-gathiya', 'methi-gathiya', 'Methi Gathiya', 'namkeen', 'Traditional thick chickpea flour noodles flavored with aromatic dried fenugreek leaves (kasuri methi).', '/images/products/methi-gathiya.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-methi-muthiya', 'methi-muthiya', 'Methi Muthiya', 'maida', 'Crispy fried bite-sized dumplings made with fresh fenugreek leaves, gram flour, and sesame.', '/images/products/methi-muthiya.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-methi-puri', 'methi-puri', 'Methi Puri', 'maida', 'Flaky, layered savory mathris enriched with fragrant fenugreek, ajwain, and pure ghee.', '/images/products/methi-puri.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-mini-bhakarwadi', 'mini-bhakarwadi', 'Mini Bhakarwadi', 'maida', 'Crispy spiral roll bites stuffed with a fiery coconut, sesame, and sweet-spicy spice mix.', '/images/products/mini-bhakarwadi.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-miri-gathiya', 'miri-gathiya', 'Miri Gathiya', 'namkeen', 'Savory gram flour gathiya generously seasoned with freshly crushed Malabar black pepper.', '/images/products/miri-gathiya.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-miri-yellow-chips', 'miri-yellow-chips', 'Miri Yellow Banana Chips', 'wafers', 'Crisp yellow banana rounds coated with freshly crushed black peppercorns and pink rock salt.', '/images/products/miri-yellow-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-mix-farsan', 'mix-farsan', 'Gujarati Mix Farsan', 'namkeen', 'The quintessential snack mix with sev, gathiya, boondi, and fried pulses for everyday enjoyment.', '/images/products/mix-farsan.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-mix-multigran-poha-chivda', 'mix-multigran-poha-chivda', 'Mix Multigrain Poha Chivda', 'poha-chivda', 'Wholesome roasted poha blended with sorghum, ragi, and corn puffs for healthy guilt-free munching.', '/images/products/mix-multigran-poha-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-mora-sev', 'mora-sev', 'Mora Sev (Zero Salt)', 'namkeen', 'Crispy gram flour vermicelli prepared completely without salt, ideal for diet restrictions & bhel.', '/images/products/mora-sev.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-multigran-chivda', 'multigran-chivda', 'Multigrain Chivda', 'diet-chivda', 'A crunchy blend of roasted whole pulses, oats, and grains lightly spiced with green chili.', '/images/products/multigran-chivda.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('bhel-mumbai-bhel', 'mumbai-bhel', 'Mumbai Sukha Bhel', 'bhel', 'Authentic Chowpatty-style dry bhel mix with crisp murmura, sev, papdi, and tangy spices.', '/images/products/mumbai-bhel.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-mung-dal', 'mung-dal', 'Crispy Moong Dal', 'chana-singh', 'Delicately fried yellow moong lentils lightly sprinkled with sea salt for a protein-rich snack.', '/images/products/mung-dal.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-muruku-chakli', 'muruku-chakli', 'Murukku Chakli', 'chakli', 'South-Indian inspired rice and urad dal spiral murukku with fragrant cumin and asafoetida.', '/images/products/muruku-chakli.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-nachni-chips', 'nachni-chips', 'Nachni Chips', 'diet-chivda', 'Crisp, calcium-rich finger millet (ragi) chips lightly seasoned with chatpata masala.', '/images/products/nachni-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-nachni-rosted-chivda', 'nachni-rosted-chivda', 'Roasted Nachni Chivda', 'diet-chivda', 'Oil-free roasted ragi flakes tossed with crunchy peanuts, dry coconut, and mustard tempering.', '/images/products/nachni-rosted-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-nadiyadi-bhusa', 'nadiyadi-bhusa', 'Nadiyadi Bhusa', 'namkeen', 'The pride of Nadiyad — sweet, spicy, and tangy mixture with crunchy sev, nuts, and lentils.', '/images/products/nadiyadi-bhusa.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-nailon-sev', 'nailon-sev', 'Nylon Sev', 'namkeen', 'Extra-fine, golden chickpea vermicelli — the indispensable topping for sev puri, dahi puri & chaat.', '/images/products/nailon-sev.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-naylon-bhavnagri-gathiya', 'naylon-bhavnagri-gathiya', 'Nylon Bhavnagri Gathiya', 'namkeen', 'Feather-light, soft Bhavnagari gathiya strands crafted with pure groundnut oil and carom seeds.', '/images/products/naylon-bhavnagri-gathiya.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-palak-pudina-stick', 'palak-pudina-stick', 'Palak Pudina Stick', 'nali', 'Crispy extruded snack sticks packed with real spinach and garden mint herbal freshness.', '/images/products/palak-pudina-stick.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chikki-peanut-chikki', 'peanut-chikki', 'Peanut Chikki', 'chikki', 'Crunchy brittle made with golden roasted Bharuch peanuts and organic clarified jaggery.', '/images/products/peanut-chikki.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('poha-chivda-poha-chivda', 'poha-chivda', 'Gujarati Poha Chivda', 'poha-chivda', 'Light, paper-thin beaten rice roasted to crisp perfection with turmeric, peanuts, and green chili.', '/images/products/poha-chivda.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-potato-waffers', 'potato-waffers', 'Classic Salted Potato Wafers', 'wafers', 'Paper-thin, golden potato chips fried to a delicate shatter-crunch and seasoned with sea salt.', '/images/products/potato-waffers.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-ratlami-sev', 'ratlami-sev', 'Ratlami Sev', 'namkeen', 'Signature spicy sev flavored with bold clove, black pepper, and hing, hailing from the Malwa heartland.', '/images/products/ratlami-sev.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-roasted-multigran-chivda', 'roasted-multigran-chivda', 'Roasted Multigrain Chivda', 'diet-chivda', 'Low-calorie roasted mixture of wheat flakes, bajra puffs, and golden moong.', '/images/products/roasted-multigran-chivda.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('diet-chivda-roasted-nachni-chips', 'roasted-nachni-chips', 'Roasted Nachni Chips', 'diet-chivda', 'Oven-roasted ragi wafers with a zesty sprinkle of chaat masala and dry mango powder.', '/images/products/roasted-nachni-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-sada-bundi', 'sada-bundi', 'Sada Boondi', 'namkeen', 'Golden round droplets of gram flour, lightly salted and perfect for raita, jaljeera, or snacking.', '/images/products/sada-bundi.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-sada-nali', 'sada-nali', 'Sada Nali', 'nali', 'Crispy hollow tube fryums delicately salted — a beloved tea-time nostalgia snack for kids & adults.', '/images/products/sada-nali.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('nali-sada-vati', 'sada-vati', 'Sada Vati', 'nali', 'Crisp cup-shaped salted fryums with light crunch and delicate flavor.', '/images/products/sada-vati.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-salted-patla-chips', 'salted-patla-chips', 'Salted Patla Potato Chips', 'wafers', 'Feather-light sliced potato chips sprinkled with mineral rock salt.', '/images/products/salted-patla-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-salted-pinuts', 'salted-pinuts', 'Salted Peanuts', 'chana-singh', 'Traditional roasted Bharuch peanuts lightly dusted with fine salt.', '/images/products/salted-pinuts.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-salted-yellow-chana', 'salted-yellow-chana', 'Salted Yellow Chana', 'chana-singh', 'Crispy sand-roasted yellow split Bengal gram with delicate natural salt seasoning.', '/images/products/salted-yellow-chana.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-sev-puri', 'sev-puri', 'Sev Puri Flat Papdi', 'maida', 'Crispy, flaky wheat flour flat papdis specially baked for Mumbai sev puri & chaat platters.', '/images/products/sev-puri.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-sezwan-chakali', 'sezwan-chakali', 'Schezwan Chakli', 'chakli', 'Spicy fusion chakli spiked with bold garlic, ginger, and spicy Schezwan chili paste.', '/images/products/sezwan-chakali.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('maida-shakkar-para', 'shakkar-para', 'Shakkar Para', 'maida', 'Sweet, flaky diamond-shaped bites glazed in delicate cardamom sugar syrup.', '/images/products/shakkar-para.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-sing-bhujiya', 'sing-bhujiya', 'Sing Bhujia', 'chana-singh', 'Crunchy roasted peanuts enrobed in a spiced, golden chickpea flour crust.', '/images/products/sing-bhujiya.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-softy-chakali', 'softy-chakali', 'Softy Chakli', 'chakli', 'Ultra-tender, soft-textured spiral chakli made with freshly milled rice and cream.', '/images/products/softy-chakali.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-sweet-kerela-chips', 'sweet-kerela-chips', 'Sweet Kerala Banana Chips', 'wafers', 'Traditional Sharkara Varatti — thick banana chunks coated in caramelized jaggery, dried ginger, and cumin.', '/images/products/sweet-kerela-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-tikha-bundi', 'tikha-bundi', 'Tikha Boondi', 'namkeen', 'Spicy, savory chickpea flour pearls tossed with red chili, roasted hing, and curry leaves.', '/images/products/tikha-bundi.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-tikha-gathiya', 'tikha-gathiya', 'Tikha Gathiya', 'namkeen', 'Fiery Gujarati gathiya loaded with crushed red chilies, black pepper, and carom seeds.', '/images/products/tikha-gathiya.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('namkeen-tikha-sev', 'tikha-sev', 'Tikha Sev', 'namkeen', 'Zesty spicy gram flour noodles with a kick of hot chili powder and asafoetida.', '/images/products/tikha-sev.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chikki-til-katri', 'til-katri', 'Til Katri', 'chikki', 'Delicate, nutty sesame seed diamonds bound with pure jaggery and green cardamom.', '/images/products/til-katri.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chakli-tomato-chakli', 'tomato-chakli', 'Tomato Chakli', 'chakli', 'Crunchy spiral chakli infused with real tangy tomato puree and savory spice notes.', '/images/products/tomato-chakli.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-tomato-banana-chips', 'tomato-banana-chips', 'Tomato Banana Chips', 'wafers', 'Crisp raw banana wafers dusted in sweet and tangy Spanish tomato seasoning.', '/images/products/tomato-banana-chips.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('wafers-yellow-banana-chips', 'yellow-banana-chips', 'Yellow Banana Chips', 'wafers', 'Authentic thin-cut raw banana rounds lightly seasoned with turmeric and sea salt.', '/images/products/yellow-banana-chips.webp', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();

INSERT INTO public.products (id, slug, name, category_slug, description, image, bestseller, is_active)
VALUES ('chana-singh-yellow-chana', 'yellow-chana', 'Roasted Yellow Chana', 'chana-singh', 'Crunchy, sand-roasted split Bengal gram — high protein, natural fiber, and irresistible crunch.', '/images/products/yellow-chana.webp', FALSE, TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    category_slug = EXCLUDED.category_slug,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    bestseller = EXCLUDED.bestseller,
    is_active = TRUE,
    updated_at = NOW();


-- 2. UPSERT ALL PRODUCT PACKAGING VARIANTS (250g, 500g, 1kg)
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-bajra-puri', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-bajra-puri', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-bajra-puri', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-bhadang-bhel', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-bhadang-bhel', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-bhadang-bhel', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-bhajni-chakli', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-bhajni-chakli', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-bhajni-chakli', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagari-gathiya', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagari-gathiya', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bhavnagari-gathiya', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bombay-mix-farsan', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bombay-mix-farsan', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-bombay-mix-farsan', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-chakli', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-chakli', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-butter-chakli', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-chana-dal', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-chana-dal', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-chana-dal', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-chanajhor', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-chanajhor', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-chanajhor', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-cheese-balls', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-cheese-balls', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-cheese-balls', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-corn-khatta-mitha-chivda', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-corn-khatta-mitha-chivda', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-corn-khatta-mitha-chivda', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-dabeli-sing', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-dabeli-sing', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-dabeli-sing', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-dal-moth', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-dal-moth', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-dal-moth', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-diet-bhel', '250g', 85.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-diet-bhel', '500g', 160.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-diet-bhel', '1kg', 300.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-diet-chivda', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-diet-chivda', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-diet-chivda', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-farali-chivda', '250g', 115.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-farali-chivda', '500g', 220.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-farali-chivda', '1kg', 420.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-golden-mix-chivda', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-golden-mix-chivda', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-golden-mix-chivda', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-kachori', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-kachori', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-kachori', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-kerela-chips', '250g', 120.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-kerela-chips', '500g', 230.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-kerela-chips', '1kg', 440.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-khatta-mitha-chivda', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-khatta-mitha-chivda', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-khatta-mitha-chivda', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-lasun-chivda', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-lasun-chivda', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-lasun-chivda', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-lemon-bhel', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-lemon-bhel', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-lemon-bhel', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-long-banana-spicy-chips', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-long-banana-spicy-chips', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-long-banana-spicy-chips', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-makai-mung-stick', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-makai-mung-stick', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-makai-mung-stick', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-makhaniya-gathiya', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-makhaniya-gathiya', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-makhaniya-gathiya', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mangluri-chivda', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mangluri-chivda', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mangluri-chivda', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-masala-nali', '250g', 85.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-masala-nali', '500g', 160.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-masala-nali', '1kg', 300.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-masala-patla-chips', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-masala-patla-chips', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-masala-patla-chips', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-methi-gathiya', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-methi-gathiya', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-methi-gathiya', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-muthiya', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-muthiya', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-muthiya', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-puri', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-puri', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-methi-puri', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-mini-bhakarwadi', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-mini-bhakarwadi', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-mini-bhakarwadi', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-miri-gathiya', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-miri-gathiya', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-miri-gathiya', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-miri-yellow-chips', '250g', 115.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-miri-yellow-chips', '500g', 220.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-miri-yellow-chips', '1kg', 420.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mix-farsan', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mix-farsan', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mix-farsan', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mix-multigran-poha-chivda', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mix-multigran-poha-chivda', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-mix-multigran-poha-chivda', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mora-sev', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mora-sev', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-mora-sev', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-multigran-chivda', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-multigran-chivda', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-multigran-chivda', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-bhel', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-bhel', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('bhel-mumbai-bhel', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-mung-dal', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-mung-dal', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-mung-dal', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-muruku-chakli', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-muruku-chakli', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-muruku-chakli', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-chips', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-chips', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-chips', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-rosted-chivda', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-rosted-chivda', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-nachni-rosted-chivda', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nadiyadi-bhusa', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nadiyadi-bhusa', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nadiyadi-bhusa', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nailon-sev', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nailon-sev', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-nailon-sev', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-naylon-bhavnagri-gathiya', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-naylon-bhavnagri-gathiya', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-naylon-bhavnagri-gathiya', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-palak-pudina-stick', '250g', 85.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-palak-pudina-stick', '500g', 160.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-palak-pudina-stick', '1kg', 300.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-chikki', '250g', 120.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-chikki', '500g', 230.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-peanut-chikki', '1kg', 440.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-poha-chivda', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-poha-chivda', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('poha-chivda-poha-chivda', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-potato-waffers', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-potato-waffers', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-potato-waffers', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-ratlami-sev', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-multigran-chivda', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-multigran-chivda', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-multigran-chivda', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-nachni-chips', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-nachni-chips', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('diet-chivda-roasted-nachni-chips', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-sada-bundi', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-sada-bundi', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-sada-bundi', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-nali', '250g', 80.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-nali', '500g', 150.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-nali', '1kg', 290.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-vati', '250g', 80.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-vati', '500g', 150.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('nali-sada-vati', '1kg', 290.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-salted-patla-chips', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-salted-patla-chips', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-salted-patla-chips', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-pinuts', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-pinuts', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-pinuts', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-yellow-chana', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-yellow-chana', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-salted-yellow-chana', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-sev-puri', '250g', 85.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-sev-puri', '500g', 160.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-sev-puri', '1kg', 300.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-sezwan-chakali', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-sezwan-chakali', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-sezwan-chakali', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-shakkar-para', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-shakkar-para', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('maida-shakkar-para', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-sing-bhujiya', '250g', 100.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-sing-bhujiya', '500g', 190.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-sing-bhujiya', '1kg', 360.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-softy-chakali', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-softy-chakali', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-softy-chakali', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-sweet-kerela-chips', '250g', 125.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-sweet-kerela-chips', '500g', 240.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-sweet-kerela-chips', '1kg', 460.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-bundi', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-bundi', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-bundi', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '250g', 95.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '500g', 180.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-gathiya', '1kg', 340.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-sev', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-sev', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('namkeen-tikha-sev', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-katri', '250g', 125.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-katri', '500g', 240.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chikki-til-katri', '1kg', 460.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-tomato-chakli', '250g', 105.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-tomato-chakli', '500g', 200.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chakli-tomato-chakli', '1kg', 380.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-banana-chips', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-banana-chips', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-tomato-banana-chips', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-yellow-banana-chips', '250g', 110.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-yellow-banana-chips', '500g', 210.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('wafers-yellow-banana-chips', '1kg', 400.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-yellow-chana', '250g', 90.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-yellow-chana', '500g', 170.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;
INSERT INTO public.product_variants (product_id, size_label, price, stock_quantity, is_active)
VALUES ('chana-singh-yellow-chana', '1kg', 320.00, 100, TRUE)
ON CONFLICT (product_id, size_label) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = TRUE;

COMMIT;
