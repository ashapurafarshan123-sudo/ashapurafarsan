# Ashapura Farsan — Execution Roadmap

## Phase 1: Foundation & Design System Setup
- [x] Task 1.1: Project initialization (`package.json`, Vite, TypeScript, Tailwind, PostCSS, Fonts)
- [x] Task 1.2: Design Tokens (`index.css` variables, Tailwind theme mapping, container rules)
- [x] Task 1.3: SVG Assets (`logo-badge.svg`, `mandala.svg`, `leaf-sprig.svg`, `brush-swoosh.svg`, custom WhatsApp glyph)
- [x] Task 1.4: Base Data & Types (`shop.ts`, `categories.ts`, `products.ts`, `types/index.ts`)
- [x] Task 1.5: Core Utility Components (`SmartImage.tsx`, `Icons.tsx`, `SEO.tsx`, `CartContext.tsx`)
- [x] Task 1.6: Router Shell & App Layout with lazy loading
- [x] Task 1.7: Initialize `MISSING_ASSETS.md`

## Phase 2: Home Page Parity (Exact Match with design.md)
- [x] Task 2.1: TopBar (Hours, Address, Telephones, tap-to-call)
- [x] Task 2.2: Header (Logo badge + wordmark + tagline, Nav underline, Pill Search, Account, Cart icon & count badge)
- [x] Task 2.3: Hero Section (Gradient background, feathered food imagery, decorative mandalas, "Har Bite Mein Tradition" script with brush swoosh, H1, paragraph, CTA buttons, Trust Row)
- [x] Task 2.4: Feature Strip (Clock, Leaf, Rupee, WhatsApp glyph with dividers)
- [x] Task 2.5: Our Specialties (Left-aligned header, 12 category cards in 7+5 desktop grid, hover states)
- [x] Task 2.6: Best Seller Section ("Our Range of Farsan", View All button, leaf-sprig art, 8 product cards with weight chips and ₹ price calculator)
- [x] Task 2.7: Footer (Brown-900 background, Shop details, Quick links, Contact, Google Maps link, copyright)
- [x] Task 2.8: Mobile optimization for Home Page (<640px) & Sticky Mobile WhatsApp bar
- [x] Task 2.9: Visual verification & browser screenshot validation

## Phase 3: Shop, Cart Drawer & WhatsApp Order Flow
- [x] Task 3.1: Shop Page (`/shop` with category chip filtering, query search, empty states, product count)
- [x] Task 3.2: CartDrawer Component (Slide-in, quantity stepper, weight display, subtotal, backdrop & esc trap)
- [x] Task 3.3: PlaceOrder Page (`/place-order`, form with validation, Delivery/Pickup toggle, address requirement, order review)
- [x] Task 3.4: WhatsApp Order message formatting & redirection
- [x] Task 3.5: Order confirmation state & cart clear

## Phase 4: Content Pages, SEO & Polish
- [x] Task 4.1: About Page (`/about` brand story, values, shop legacy)
- [x] Task 4.2: Contact Page (`/contact` map link, tap-to-call, address, hours, direct message)
- [x] Task 4.3: FAQ Page (`/faq` accessible accordion with 6 questions + `// TODO(owner): confirm` comments)
- [x] Task 4.4: 404 Not Found Page
- [x] Task 4.5: SEO metadata per route, LocalBusiness JSON-LD on all pages, `robots.txt`, `sitemap.xml`, favicon
- [x] Task 4.6: Cross-viewport responsive validation (1536px, 1280px, 1024px, 768px, 390px, 360px)
- [x] Task 4.7: Final production build test (`npm run build`), missing asset summary & final report

## Phase 5: Hero Specialties 3D Scroll-Split Card with Signature Cutouts
- [x] Task 5.1: Implement Framer Motion 3D scroll split & flip card (`ScrollSplitCard.tsx`)
- [x] Task 5.2: Create and integrate Hero Products section (`HeroProductsSection.tsx`) with 3 signature items
- [x] Task 5.3: Process and integrate Kachori product cutout image (`hero-kachori.png`)
- [x] Task 5.4: Process and crop Multigrain Chivda & Khatta Meetha product cutout images
- [x] Task 5.5: Connect all 3 product cutouts to `HeroProductsSection.tsx` and `ScrollSplitCard.tsx`
- [x] Task 5.6: Update product registry in `src/data/products.ts` with hero asset links
- [x] Task 5.7: Verify 3D flip card visual balance on desktop (1440px) and mobile (390px) via automated capture
- [x] Task 5.8: Complete TypeScript check (`tsc`) and production build verification (`npm run build`)
- [x] Task 5.9: Replace front card placeholder with dedicated editorial food photograph (`specials-banner.jpg`)
- [x] Task 5.10: Implement HTML/CSS front card editorial content hierarchy (Eyebrow, Main heading, Supporting text)
- [x] Task 5.11: Update scroll instruction to "SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES" with animated arrow and decorative rules
- [x] Task 5.12: Prevent mobile collision between scroll instruction and sticky conclusion quote


## Phase 6: Production E-Commerce Full-Stack Implementation
- [x] Task 6.1: Full repository audit & Supabase client integration (`@supabase/supabase-js`, `src/lib/supabase.ts`, `.env.example`)
- [x] Task 6.2: Normalized PostgreSQL schema migrations (`20261023000001_core_schema.sql` - `profiles`, `admin_roles`, `categories`, `products`, `product_variants`, `user_addresses`, `orders`, `order_items`, `store_settings`)
- [x] Task 6.3: Catalog seed migrations (`20261023000002_seed_products.sql` - 12 categories, 35 products with 250g, 500g, 1kg prices, store settings)
- [x] Task 6.4: Row Level Security & Secure PostgreSQL RPC functions (`20261023000003_rls_and_rpc.sql` - `is_admin`, `create_order_secure`, `admin_get_dashboard_stats`, `admin_update_order_status`)
- [x] Task 6.5: Supabase Storage bucket configuration (`20261023000004_storage.sql` - `product-images` with admin-only upload policies)
- [x] Task 6.6: Consolidated database setup script (`supabase/full_schema_setup.sql`)
- [x] Task 6.7: Centralized Authentication Provider (`src/context/AuthContext.tsx`, `ProtectedRoute`, `AdminRoute`, `GuestRoute`)
- [x] Task 6.8: Customer Authentication Pages (`Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`)
- [x] Task 6.9: Customer Account Dashboard (`AccountLayout.tsx`, `AccountOverview.tsx`, `AccountOrders.tsx`, `OrderDetail.tsx`, `AccountProfile.tsx`, `AccountAddresses.tsx`)
- [x] Task 6.10: Service Layer (`orderService.ts`, `productService.ts`, `adminService.ts` with offline fallback)
- [x] Task 6.11: Protected Admin Dashboard (`AdminLayout.tsx`, `AdminOverview.tsx`, `AdminProducts.tsx`, `AdminOrders.tsx`, `AdminCustomers.tsx`, `AdminSettings.tsx`)
- [x] Task 6.12: Checkout integration (`PlaceOrder.tsx` with persistent order generation, verified order number format, autofill, address saving, and formatted WhatsApp message)
- [x] Task 6.13: Header dynamic account routing & indicator (`Header.tsx`)
- [x] Task 6.14: Automated test suite (`tests/auth_validation.test.js`, `tests/order_calculations.test.js`, `tests/admin_authorization.test.js`, `tests/database_migrations.test.js`)
- [x] Task 6.15: Setup guide & documentation (`docs/SUPABASE_SETUP.md`, `README.md`)
- [x] Task 6.16: TypeScript type-check (`tsc`) & production build verification (`npm run build`)

## Phase 7: Complete Supabase Admin Panel
- [x] Task 7.1: Database Schema Enhancements & Admin Provisioning SQL (`supabase/migrations/20261026000001_admin_panel_enhancements.sql`)
- [x] Task 7.2: Dedicated Admin Authentication (`/admin/login`, route protection in `AdminRoute.tsx`, change password workflow)
- [x] Task 7.3: Admin Layout & Dashboard Overview with Real Metrics (`AdminLayout.tsx` with 8 nav items, `AdminOverview.tsx` with 8 cards, date filters, sales chart, recent orders)
- [x] Task 7.4: Complete Product Management Full CRUD (`AdminProducts.tsx`, `productService.ts`, variant pricing, stock toggles, storage image upload)
- [x] Task 7.5: Website Orders & Separate WhatsApp Orders (`AdminWebsiteOrders.tsx`, `AdminWhatsAppOrders.tsx`, invoice printing, CSV export, WhatsApp order intent tracking)
- [x] Task 7.6: Global Discount Management & Storefront Integration (`AdminDiscounts.tsx`, live price preview, cart and checkout synchronization)
- [x] Task 7.7: Sales & Reports Section (`AdminReports.tsx`, GMV, Net Sales, AOV, top products, sales trends, CSV export)
- [x] Task 7.8: Store Operations, Security Testing & Documentation (`AdminSettings.tsx`, test suite additions, client setup guide `docs/ADMIN_GUIDE.md`)

