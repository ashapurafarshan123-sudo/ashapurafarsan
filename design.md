# Ashapura Farsan — design.md

Source of truth for the website UI. This file describes the attached reference design (desktop home page, 1536px wide) so it can be rebuilt **exactly**. All pixel values below were measured at 1536px; convert to `rem` / `clamp()` so the layout scales.

## 0. Rules for the builder (read first)

1. Recreate the reference **same to same**: same layout, same order of sections, same colours, same fonts, same copy. Do not "improve" or restyle it.
2. This must look like a hand-crafted local-brand site, not a template. No emoji icons, no stock gradient blobs, no glassmorphism, no purple/blue tech palettes, no lorem ipsum.
3. Use **real food photography** (generated or shot) for the hero and all product/category images. No illustrations or emoji in place of food.
4. One icon family only: Lucide line icons, 1.5px stroke, rounded caps (WhatsApp uses its own glyph).
5. Mobile-first build. Most visitors arrive by scanning the QR poster on a phone, so the mobile version must be as polished as the desktop reference.
6. Anything below the fold that is not visible in the reference follows the same tokens and component styles in this file.

## 1. Brand

- **Name:** Ashapura — "Farsan · Namkeen · Wafers"
- **Type of business:** Traditional Gujarati farsan shop, Mira Road, Mumbai. Online ordering with direct shop contact.
- **Mood:** warm, homely, festive, premium-but-affordable. Think a clean modern take on a classic Gujarati sweet and farsan shop: cream paper, saffron-orange, chocolate brown, golden food photography.
- **Tagline overlay on hero image:** "Har Bite Mein Tradition"

## 2. Design tokens

```css
:root {
  /* Brown (text + top bar) */
  --brown-900: #3A1B10;   /* top bar bg, headings, primary text */
  --brown-700: #5E4636;   /* body text */
  --brown-500: #8A7565;   /* muted text, subtitles, placeholder */

  /* Cream / peach (backgrounds) */
  --cream-50:  #FFFBF5;   /* lightest page bg */
  --cream-100: #FFF7EC;   /* header, specialties section */
  --peach-100: #FCEBD6;   /* feature strip, best seller section */
  --peach-200: #F6D7AE;   /* hero left gradient mid */
  --peach-halo:#FBE3C8;   /* halo behind category photos */

  /* Brand orange */
  --orange-600: #CC5A0E;  /* primary buttons, eyebrow text, italic accent words */
  --orange-700: #B34D0A;  /* hover / pressed */
  --orange-500: #D9680F;  /* search button, icon circles */
  --amber-400:  #F5A623;  /* logo badge gradient start */
  --amber-600:  #E8891A;  /* logo badge gradient end */

  /* Lines & surfaces */
  --line:       #F0E1CE;  /* card + header borders */
  --line-strong:#E6D0B4;  /* dividers in strips */
  --white:      #FFFFFF;
  --badge-red:  #C81E1E;  /* cart count badge */

  /* Radius */
  --r-card: 10px;
  --r-pill: 999px;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(120, 70, 20, 0.06);
  --shadow-card-hover: 0 8px 20px rgba(120, 70, 20, 0.12);
  --shadow-cta: 0 6px 14px rgba(204, 90, 14, 0.28);

  /* Layout */
  --container: 1288px;    /* content spans x=127 to x=1415 at 1536px */
  --gutter: 24px;
}
```

### Hero gradient

```css
--hero-bg: linear-gradient(90deg, #FCEBD3 0%, #F6D7AE 38%, #C98A54 58%, #6E3B1E 80%, #4A2412 100%);
```
The hero photo sits on the right and is feathered into this gradient (see Hero).

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Headings (H1, H2, logo wordmark) | **Fraunces** (`@fontsource-variable/fraunces`) | Variable font, weight 600; the accent word in H2 uses *italic* |
| Body, nav, buttons, UI | **Mulish** (fallback: Nunito Sans, system-ui) | weights 400/500/600/700 |
| Hero overlay script | **Kaushan Script** (fallback: Yellowtail, cursive) | white, slanted, only used for "Har Bite Mein Tradition" |

Fraunces is self-hosted via `@fontsource-variable/fraunces` and `@fontsource-variable/fraunces/full-italic.css`. Mulish and Kaushan Script load from Google Fonts with `display=swap`.

### Type scale (at 1536px; use `clamp()` for fluid scaling)

| Element | Size / line-height | Weight | Colour | Extra |
|---|---|---|---|---|
| Top bar text | 12px / 1.2 | 500 | `#F7E8D3` | |
| Nav links | 13px | 500 (active 600) | `--brown-900`, active `--orange-600` | |
| Logo wordmark "Ashapura" | 24px / 1 | 600 | `--brown-900` | Fraunces |
| Logo tagline | 9.5px | 500 | `--brown-500` | uppercase, letter-spacing .2em |
| Eyebrow label | 11px | 700 | `--orange-600` | uppercase, letter-spacing .22em |
| H1 | 46px / 1.12 (`clamp(32px, 3vw, 50px)`) | 600 | `--brown-900` / white | Fraunces, letter-spacing 0 |
| H2 | 34px / 1.15 (`clamp(26px, 2.2vw, 34px)`) | 600 | `--brown-900` | accent word: italic, `--orange-600` |
| Hero paragraph | 14.5px / 1.55 | 400 | `--brown-700` | max-width ~340px |
| Section sub-text | 13px / 1.5 | 400 | `--brown-700` | |
| Button text | 13px | 700 (outline: 600) | white / `--brown-900` | |
| Trust items | 11px / 1.25 | 500 | `--brown-900` | |
| Strip title | 12px | 700 | `--brown-900` | |
| Strip sub-text | 11px | 400 | `--brown-500` | |
| Category card title | 13px | 600 | `--brown-900` | |
| Category card sub-text | 10.5px | 400 | `--brown-500` | |
| Hero script overlay | 34px / 1.1 | 400 | `#FFFFFF` | rotate -9°, text-shadow `0 2px 10px rgba(0,0,0,.35)` |

## 4. Page structure (top to bottom)

| # | Section | Height @1536 | Background |
|---|---|---|---|
| 1 | Top info bar | 31px | `--brown-900` |
| 2 | Header (logo, nav, search, account, cart) | 78px | `--cream-100`, bottom border `--line` |
| 3 | Hero | 386px | `--hero-bg` + photo |
| 4 | Feature strip (4 items) | 65px | `--peach-100` |
| 5 | Our Specialties (category grid) | ~365px | `--cream-100` with very soft warm gradient |
| 6 | Our Range of Farsan (best sellers) | starts at y=925 | `--peach-100` + leaf line-art on both sides |
| 7 | Remaining pages/sections (all products, about, FAQ, footer) | — | follow same tokens |

Container: `max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter)`. Left edge of content text = x 127px at 1536px.

## 5. Section specs

### 5.1 Top info bar
- Height 31px, bg `--brown-900`, text `#F7E8D3`, 12px/500.
- Three items spread with `justify-content: space-between` inside the container:
  - Left: truck/delivery icon + **"Open Daily 10:00 AM – 10:00 PM"**
  - Center: map-pin icon + **"Shop No 15, Shantipark, Mira Road"**
  - Right: phone icon + **"Call: 801058 0082 / +91 97723 31014"**
- Icons 14px, same cream colour, 8px gap to text.

### 5.2 Header
- Height 78px, bg `--cream-100`, 1px bottom border `--line`.
- **Logo (left):** circular badge 62px, gradient `radial-gradient(circle at 35% 30%, #F5A623, #E8891A)`, containing the words "Ashapura / Farsan" in two centred lines, Playfair bold ~13px, `--brown-900`, with a thin inner ring. Right of the badge, 12px gap: wordmark **"Ashapura"** (Playfair 24px) and under it the tagline **"FARSAN · NAMKEEN · WAFERS"**.
- **Nav (centre-left, starts near x=468):** Home, Shop, About Us, Place Order, Contact, FAQ. Gap 30px. The active item (Home) is orange with a 2px orange underline sitting at the bottom edge of the header, slightly wider than the text.
- **Search (x 959 → 1294, 335px wide):** height 40px, pill, white bg, 1px border `#E9D8C2`, placeholder **"Search snacks, sev, namkeen..."** (12px, `--brown-500`), 16px left padding. Circular submit button 34px, `--orange-500`, white magnifier icon 14px, inset 3px from the right.
- **Right icons:** user icon (22px) at x≈1355, cart icon (22px) at x≈1401 with a 16px red circle badge `--badge-red` showing **0** (white, 9px, bold) at the cart's top-right.
- Header is sticky on scroll (keep the top bar scrolling away, header stays).

### 5.3 Hero
- Height 386px, `overflow: hidden`, background `--hero-bg`.
- **Decorative mandala line-art:** faint (opacity ≈ 0.06) behind the text on the far left; a slightly stronger light-line mandala in the top-right corner (opacity ≈ 0.12). SVG, not an image.
- **Photo (right):** one wide food photo placed right-aligned, covering about 62% of the hero width (starts near x≈650). Left edge feathered into the gradient with `mask-image: linear-gradient(to right, transparent 0%, #000 28%)`. Photo content: a large dark-wood bowl of golden namkeen/chivda mixture with peanuts, curry leaves and green chillies; small bowls of fine sev, yellow chana/gathiya and chakri-type snacks on the right; a cup of chai in the back; loose peanuts and curry leaves scattered on a warm brown wooden table; shallow depth of field; warm golden light; dark brown vignette on the right.
- **Script overlay (top-right of photo, x≈1315–1470, y≈170–265):** two lines **"Har Bite" / "Mein Tradition"**, white, Kaushan Script 34px, rotated -9°, right-aligned, with a hand-drawn brush swoosh underline (SVG, white) under the second line.
- **Left content block (starts x=127, vertically centred):**
  1. Eyebrow: **TRADITIONAL GUJARATI FARSAN**
  2. H1: **Authentic Taste / of Gujarat** (two lines, max-width ≈ 430px)
  3. Paragraph (3 lines): "From timeless recipes to the finest ingredients, we bring you the true taste of Gujarati farsan, namkeen, and more — made with love and tradition."
  4. Buttons (gap 14px, height 41px):
     - Primary: cart icon + **Shop Now**, width ≈ 131px, bg `--orange-600`, white text, pill, `--shadow-cta`
     - Secondary: **Explore Our Range** + right-arrow icon (12px), width ≈ 162px, transparent bg, 1px border `#8A6A55`, text `--brown-900`, pill
  5. Trust row (margin-top ≈ 32px): four items, each = 22px outline icon (`--brown-900`) + two-line label, separated by 1px vertical dividers (`#D9BFA0`, 28px tall), gap ≈ 26px:
     - Leaf — "Premium Quality Ingredients"
     - Truck — "Fast & Safe Delivery"
     - Award/badge — "Authentic Gujarati Taste"
     - Heart — "Made with Love"

### 5.4 Feature strip
- Height 65px, bg `--peach-100`. Four equal columns, vertically centred content, 1px vertical dividers (`--line-strong`) between columns.
- Each item: 26px filled orange circle (`--orange-500`) with a white 14px icon, 12px gap, then title (12px/700) + sub-text (11px, `--brown-500`):
  1. Clock — **Open Daily** / 10:00 AM – 10:00 PM
  2. Leaf — **Fresh Every Day** / Made in-house, no preservatives
  3. Rupee (₹) — **Affordable Prices** / Great quality, great value
  4. WhatsApp glyph — **WhatsApp Orders** / Fast, easy, direct to shop

### 5.5 Our Specialties (category grid)
- Section padding-top ≈ 28px. Background `--cream-100`, with a barely visible vertical warm gradient to `--peach-100` at the bottom.
- Header block (left aligned):
  - Eyebrow **BROWSE BY TYPE**
  - H2 **Our *Specialties*** — "Our" regular brown, "Specialties" in italic Playfair, `--orange-600`
  - Sub-text: "Explore our wide range of traditional farsan, namkeen, wafers and more."
- **Grid:** starts ≈ 20px below sub-text. Gap 11–12px. Desktop = 7 columns of equal width, rows left-aligned (row 1 has 7 cards, row 2 has 5 cards and the remaining space stays empty). Card height ≈ 110px.
- **Category card:**
  - bg white, 1px border `--line`, radius `--r-card`, `--shadow-card`.
  - Top-centre: a soft peach oval halo (`--peach-halo`, ≈ 90×56px) with a round-cropped / cut-out food photo (≈ 54px) centred on it.
  - Bottom-left (padding 16px): title (13px/600) and, below it, sub-text (10.5px, `--brown-500`).
  - Bottom-right: small right-arrow icon (11px, `--brown-900`), aligned to the sub-text baseline.
  - Hover: lift 2px, `--shadow-card-hover`, arrow nudges 3px right. Whole card is a link.
- **The 12 cards, in order:**

| # | Title | Sub-text |
|---|---|---|
| 1 | Namkeen | Classic salted bites |
| 2 | Diet Chivda | Light & healthy |
| 3 | Nali | Crispy spirals |
| 4 | Chakli | Rice flour crunch |
| 5 | Maida | Flour-based snacks |
| 6 | Chana & Singh | Roasted & spiced |
| 7 | Chikki | Sweet brittle bars |
| 8 | Poha Chivda | Flattened rice mix |
| 9 | Bhel | Mumbai street style |
| 10 | Wafers | Crispy potato slices |
| 11 | Satwik | Khari & toast items |
| 12 | Cakes | Slice cakes & plum cakes |

### 5.6 Best Seller — "Our Range of Farsan"
- Background `--peach-100`. Faint orange leaf-sprig line-art (opacity ≈ 0.2, SVG) on the far left (x≈10–70) and far right (x≈1460–1520) edges.
- Header block (left aligned): eyebrow **BEST SELLER**; H2 **Our Range of *Farsan*** (italic orange accent on "Farsan"); sub-text "Discover our most loved picks — freshly made favourites chosen by our regular customers."
- Right side, vertically aligned with the H2: outline pill button **View All Products →** (height 34px, ≈136px wide, 1px border `#B5651D`, text 12px/600 `--brown-900`).
- **Product cards below the header (not visible in the reference — build in the same style):** horizontal row of cards (4 per row on desktop), each = white card, radius 10px, `--shadow-card`, product photo on a `--peach-halo` backdrop, product name (Playfair 16px or Mulish 14/600), weight selector chips (250 g / 500 g / 1 kg), price in ₹ (`--orange-600`, 600), and an **Add to Cart** pill button (orange). Show a small "Bestseller" tag (orange text on `#FDE3C6`) on top-left of the photo.

## 6. Components

**Buttons**
- Primary: bg `--orange-600`, white text, radius pill, height 41px, padding 0 22px, `--shadow-cta`. Hover → `--orange-700`. Active → translateY(1px). Focus → 2px outline `--orange-600` with 2px offset.
- Secondary/outline: transparent, 1px border `#8A6A55`, text `--brown-900`. Hover → bg `--peach-100`.
- Small outline ("View All Products"): height 34px, border `#B5651D`.

**Search:** pill, white, focus → border `--orange-600` and 3px ring `rgba(204,90,14,.15)`.

**Cart badge:** 16px circle, `--badge-red`, white 9px bold number, positioned top-right of the cart icon.

**Section header pattern:** eyebrow → H2 (one accent word in italic orange) → one-line sub-text. Always left aligned in this design.

**Dividers:** 1px vertical lines inside strips (`--line-strong` / `#D9BFA0`), never full-width horizontal rules.

## 7. Imagery & assets

Create these assets (WebP, optimised, `loading="lazy"` except hero):

- `hero-farsan.webp` — 2400×1000, right-weighted composition as described in 5.3, darker on the right side so the white script text stays readable.
- 12 category photos, transparent-background cut-outs, 400×400, top-down or 3/4 view, warm light: namkeen mix, diet chivda (in a green bowl), nali, chakli, maida snacks (round biscuit-like), chana & singh (brown coated peanuts), chikki, poha chivda, bhel, wafers, satwik (khari/toast), cakes (chocolate slice).
- Product photos for best sellers: same lighting and colour grade as the hero.
- `logo-badge.svg` — circular amber badge with "Ashapura Farsan" text.
- `mandala.svg` — fine line-art mandala, single colour, used at low opacity.
- `leaf-sprig.svg` — outlined leaf sprig, used at low opacity.
- `brush-swoosh.svg` — hand-drawn underline for the hero script text.

Colour grade for all photos: warm golden highlights, rich brown shadows, no blue cast, no over-saturation.

## 8. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Exactly as the reference |
| 1024–1279px | Container padding 24px; nav gap 22px; category grid 5 columns; hero H1 40px |
| 640–1023px | Hamburger menu replaces nav; search moves to its own full-width row under the header; category grid 4 columns; hero text on the left over the photo, with a left-to-right dark-to-transparent overlay only if needed for legibility |
| < 640px | See mobile below |

### Mobile (< 640px)
- **Top bar:** single row — phone number (tap-to-call) and "Open Daily 10:00 AM – 10:00 PM"; address hidden here and shown in the footer.
- **Header:** logo badge 44px + "Ashapura" wordmark (tagline hidden), then search icon, user icon, cart icon, hamburger. Tapping the search icon opens a full-width search pill.
- **Hero:** photo as a 220px-tall banner on top (with the script overlay scaled to 22px); below it the eyebrow, H1 (32px), paragraph, then the two buttons side by side (full width, 50/50). Trust row becomes a 2×2 grid without dividers.
- **Feature strip:** 2×2 grid, dividers removed, 12px row gap.
- **Specialties:** 2-column grid (cards keep the same internal layout), gap 10px; all 12 cards visible.
- **Best sellers:** horizontal scroll-snap row with a 15% peek of the next card; "View All Products" moves below the header text.
- Tap targets ≥ 44px. Body text never below 14px on mobile (sub-text 12px minimum).
- Optional, recommended: sticky bottom bar with a **WhatsApp Order** button (orange pill) on mobile only.

## 9. Motion

The reference is static. Keep motion minimal:
- One page-load reveal: hero text and photo fade in over 500ms. Nothing else animates on scroll.
- Hover/press states on cards and buttons as specified above (150–200ms ease-out).
- Cart badge does a quick scale pop when the count changes.
- Respect `prefers-reduced-motion` (disable the reveal and hover lifts).

## 10. Accessibility & quality floor

- Text contrast ≥ 4.5:1 (check `--brown-500` on cream; darken to `#7A6352` if it fails).
- Visible keyboard focus on every link, button and input.
- Alt text on all photos (e.g. "Bowl of Gujarati namkeen mixture with peanuts and curry leaves").
- Semantic HTML: one `h1` on the page, `nav`, `main`, `section` with headings, buttons are `button`, links are `a`.
- Images have explicit width/height to avoid layout shift. Hero image preloaded.
- Lighthouse targets: Performance ≥ 90 on mobile, Accessibility ≥ 95.

## 11. Do / Don't

**Do**
- Keep the cream + saffron-orange + chocolate-brown palette exactly as listed.
- Use the Playfair Display italic accent on the one word shown in each H2 ("Specialties", "Farsan").
- Keep generous whitespace and left-aligned section headers.
- Keep the exact copy, phone numbers, address and timings from this file.

**Don't**
- Don't add extra gradients, glows, glass cards, neon colours or dark mode.
- Don't replace photos with emoji or flat illustrations.
- Don't centre-align the section headers or add numbered steps.
- Don't change the order of sections or the number of category cards.
- Don't use more than two typefaces plus the single script face.

## 12. Acceptance checklist

- [ ] Side-by-side with the reference at 1536px, every section matches in layout, colour and spacing.
- [ ] Top bar, header, hero, feature strip, Specialties (12 cards, 7 + 5), and Best Seller header all present with exact copy.
- [ ] Fonts loaded: Playfair Display, Mulish, Kaushan Script.
- [ ] All images are real photos; no emoji icons anywhere.
- [ ] Mobile layout checked at 360px and 390px widths: no horizontal scroll, all tap targets ≥ 44px.
- [ ] Hover, focus and reduced-motion states implemented.
