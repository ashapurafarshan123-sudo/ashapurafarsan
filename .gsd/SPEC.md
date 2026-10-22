# Ashapura Farsan — Technical Specification

Status: FINALIZED
Date: 2026-10-19
Owner: Senior Front-end Engineer

## 1. Overview & Objective
Ashapura Farsan is an authentic Gujarati farsan, namkeen, and wafers shop located at Shop No 15, Shantipark, Mira Road, Mumbai. This project implements their complete, production-quality, mobile-first website matching `design.md` exactly at 1536px desktop and across all mobile viewports (down to 360px).

## 2. Technical Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with CSS Variables mapped to `:root` tokens from `design.md`
- **Routing**: React Router v6
- **State Management**: React Context (`CartContext` with localStorage persistence)
- **Icons**: Lucide React (1.5px stroke, rounded caps) + Custom WhatsApp SVG glyph
- **Motion**: Framer Motion strictly for hero load reveal, cart drawer slide, and cart badge pop
- **Typography**: Playfair Display (500, 600, 700, italic), Mulish (400, 500, 600, 700), Kaushan Script
- **SEO & Structured Data**: React Helmet Async + LocalBusiness JSON-LD schema
- **Ordering**: WhatsApp direct ordering (`https://wa.me/919772331014`) with formatted message

## 3. Architecture & File Structure
```
d:/Ashapura/
├── public/
│   ├── images/
│   │   ├── hero-farsan.webp
│   │   ├── categories/ (<slug>.webp)
│   │   ├── products/ (<slug>.webp)
│   │   ├── logo-badge.svg
│   │   ├── mandala.svg
│   │   ├── leaf-sprig.svg
│   │   └── brush-swoosh.svg
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── config/
│   │   └── shop.ts
│   ├── data/
│   │   ├── categories.ts
│   │   └── products.ts
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   └── CartContext.tsx
│   ├── components/
│   │   ├── TopBar.tsx
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustRow.tsx
│   │   ├── FeatureStrip.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── SmartImage.tsx
│   │   ├── Footer.tsx
│   │   ├── StickyMobileBar.tsx
│   │   ├── SEO.tsx
│   │   └── Icons.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── PlaceOrder.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── FAQ.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── MISSING_ASSETS.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 4. Quality & Compliance Gates
- Zero TypeScript or lint errors.
- Visual parity with `design.md` specifications at 1536px desktop and 390px/360px mobile.
- Zero external image CDNs, zero emoji icons, zero lorem ipsum.
- Contrast ratio >= 4.5:1. Tap targets >= 44px.

## 5. Phase 5: Hero Specialties Scroll-Split 3D Showcase
- **Location**: Home page, immediately following `#categories` ("Shop by Categories") and before `#bestsellers` ("Our Range of Farsan").
- **Component**: `ScrollSplitCard.tsx` with Framer Motion 3D perspective transforms (`preserve-3d`, `backface-visibility: hidden`).
- **3D Interaction**:
  1. Initial state (0% - 15%): Single cohesive panoramic image (`/images/hero-banner.jpg`).
  2. Separation state (15% - 40%): Image splits into 3 discrete cards with dynamic rounded corners and depth shadows.
  3. 3D Flip state (40% - 80%): Cards rotate 180° around the Y-axis revealing the 3 hero specialties with custom product photos.
  4. Final state (80% - 100%): Cards shift upward as signature brand quote fades in.
- **Hero Products Data & Visuals**:
  1. **Ashapura Spcl Kachori**: Crimson `#4A1521`, Flame icon, `hero-kachori.png`, ₹110 / 250g.
  2. **Ashapura Spcl Multigrain Chivda**: Forest Green `#1E3F2B`, Wheat icon, `hero-multigrain-chivda.png`, ₹120 / 250g.
  3. **Ashapura Spcl Khatta Meetha Mix**: Spiced Amber `#96591C`, Sparkle icon, `hero-khatta-meetha.png`, ₹95 / 250g.
- **Typography & Styling**:
  - Headings & Titles: Cormorant Garamond (weight 600)
  - Descriptions, Badges, Prices & Buttons: DM Sans (weight 400-600)
  - Responsive down to 360px mobile viewports without overflowing or clipping.
