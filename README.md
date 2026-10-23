# Ashapura Farsan — Full-Stack E-Commerce Application

> Traditional Gujarati farsan, namkeen, wafers & snacks e-commerce application with customer authentication, persistent customer accounts, order management, and a protected administrative dashboard.

- **Live Storefront:** [https://ashapurafarsan12.netlify.app/](https://ashapurafarsan12.netlify.app/)
- **Backend:** Supabase (PostgreSQL 15 + Supabase Auth + Row Level Security + Storage)
- **Deployment:** Netlify (Continuous Deployment connected to GitHub)

---

## 🏗️ Technical Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 5, TypeScript 5 |
| **Routing** | React Router v6 (Nested layout routing, code-splitting with `React.lazy`) |
| **Styling & Design System** | Tailwind CSS with design tokens (`--brown-900`, `--cream-50`, `--orange-600`, `--peach-100`) |
| **Typography** | Fraunces variable serif headings, Mulish sans UI text |
| **Backend & Database** | Supabase (PostgreSQL 15 with UUIDs, foreign keys, triggers, constraints) |
| **Authentication & Auth State** | Supabase Auth (JWT session persistence, password reset flow, auto-profile trigger) |
| **Data Authorization** | Row Level Security (RLS) on all exposed tables + PostgreSQL Security Definer RPCs |
| **Automated Testing** | Node.js Native Test Runner (`node:test`) |
| **Hosting & CI/CD** | Netlify with SPA redirect rules and immutable asset caching |

---

## 🔒 Security Architecture

1. **Row Level Security (RLS) Everywhere:**
   - Every exposed table (`profiles`, `admin_roles`, `categories`, `products`, `product_variants`, `user_addresses`, `orders`, `order_items`, `store_settings`) has explicit Row Level Security enabled.
   - Customers can only read and manage their own profile, addresses, and orders.
   - Public visitors have read-only access to published active products and categories.
2. **Trusted Role Authorization:**
   - Administrative privileges are determined by the trusted `public.admin_roles` database table and verified via the `is_admin()` Security Definer function.
   - Client-supplied metadata or profile fields can NEVER grant admin privileges.
3. **Server-Side Price Integrity:**
   - Orders are created atomically via the `public.create_order_secure(...)` PostgreSQL function.
   - Prices, variant availability, line totals, and grand totals are queried directly from trusted database tables. Client-tampered prices and totals are completely discarded.
4. **No Service Role Key in Frontend:**
   - Only the publishable `anon` public key is used in the frontend client. No secret keys or database connection strings are exposed in client bundles or git repositories.
5. **Anti-Enumeration Protections:**
   - Password reset endpoints return generic confirmation responses to prevent email enumeration attacks.

---

## 📦 Features Overview

### 👤 Customer Features
- **Unified Authentication:** Sign up, sign in, sign out, and password recovery.
- **Account Overview (`/account`):** View order statistics, recent orders, and contact details.
- **Order History (`/account/orders`):** Filter and search past orders with live status badges.
- **Order Details (`/account/orders/:id`):** Itemized breakdown with product photos, historical price snapshots, fulfillment status, and shop contact shortcuts.
- **Profile Management (`/account/profile`):** Edit full name and mobile number.
- **Saved Delivery Addresses (`/account/addresses`):** Save and manage Mira Road addresses for 1-click checkout.
- **Direct WhatsApp Ordering (`/place-order`):** Persistent database recording with verified order reference numbers (`AF-YYYYMMDD-XXXX`) and direct WhatsApp shop dispatch.

### 🛡️ Admin Dashboard Features
- **Overview Dashboard (`/admin`):** Real-time revenue metrics, total orders, pending orders, awaiting fulfillment, customer counts, and product counts.
- **Product Management (`/admin/products`):** Create products, update descriptions, manage packaging weights (250g, 500g, 1kg), update prices, soft-archive products, and upload product images to Supabase Storage.
- **Order Management (`/admin/orders`):** Search by order number or customer name, filter by status, view complete itemized breakdowns, update fulfillment status (Pending → Confirmed → Processing → Out for Delivery → Delivered / Cancelled), and update payment status.
- **Customer Directory (`/admin/customers`):** View customer accounts, registration dates, total order counts, and lifetime spend.
- **Store Operations (`/admin/settings`):** Manage operating hours, dispatch numbers, store open/closed status, and homepage announcement banners.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with Node 22)
- npm 9+
- A Supabase account (free tier works great)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ashapura-farsan.git
cd ashapura-farsan

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5173
```

### 4. Database Setup
Follow the complete step-by-step setup in [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md). Run `supabase/full_schema_setup.sql` in your Supabase SQL editor to create all tables, seed all 35 products, and enable RLS policies.

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

Run automated test suites verifying authentication validation, order price integrity, and admin authorization:
```bash
# Run unit & integration tests
npm test

# Run TypeScript compiler check
npx tsc --noEmit

# Run production Vite build
npm run build
```

---

## 🌐 Netlify Deployment

1. Connect your repository to Netlify.
2. Build Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add Environment Variables in Netlify Dashboard (**Site configuration** > **Environment variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL`
4. Deploy! Netlify automatically handles SPA deep-routing via `public/_redirects`.
