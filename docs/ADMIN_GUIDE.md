# Ashapura Farsan — Administrator Portal & Supabase Operational Guide

Welcome to the **Ashapura Farsan Management Portal**. This system empowers store operators to manage products, pricing, stock levels, global discounts, website orders, and WhatsApp order intents in real-time, backed directly by Supabase PostgreSQL and Row-Level Security (RLS).

---

## 1. Initial Admin Credentials & Access

- **Admin Login URL:** `https://ashapurafarsan1.netlify.app/admin/login` (or `/admin/login` on your domain)
- **Initial Email:** `vaibhavchawda432@gmail.com`
- **Initial Password:** `admin12345`

> [!IMPORTANT]
> **Change Your Password Immediately After First Login:**
> 1. Sign in at `/admin/login`.
> 2. Click the **Password** button in the top navigation bar or navigate to **Store Settings** -> **Change Administrator Password**.
> 3. Enter your new secure password (minimum 6 characters) and click **Update Password**.
> 4. The password updates immediately in Supabase Auth.

---

## 2. Supabase Database Setup & Provisioning

All required tables, functions, and Row-Level Security policies are packaged in:
- `supabase/migrations/20261026000001_admin_panel_enhancements.sql` (incremental upgrade)
- `supabase/full_schema_setup.sql` (complete consolidated setup)

### How to Provision or Verify the Admin Role in Supabase
When the account `vaibhavchawda432@gmail.com` signs up or logs in, the PostgreSQL trigger `handle_new_user()` automatically inserts their `user_id` into `public.admin_roles` with `role = 'admin'`.

If you already created the user manually in the Supabase Dashboard, run this quick SQL in the **Supabase SQL Editor**:
```sql
SELECT public.provision_admin_by_email('vaibhavchawda432@gmail.com');
```

---

## 3. Admin Dashboard Modules

### 1. Dashboard Overview (`/admin`)
- **8 Live KPI Cards:**
  1. **Total Confirmed Sales (₹):** Sum of confirmed/delivered orders (strictly excludes cancelled orders and unconfirmed WhatsApp enquiries).
  2. **Today's Sales (₹):** Confirmed sales placed today.
  3. **This Month's Sales (₹):** Month-to-date confirmed sales.
  4. **Total Website Orders:** Total checkouts placed through website checkout.
  5. **WhatsApp Enquiries:** Total order intents received via WhatsApp.
  6. **Pending Orders:** Urgent orders awaiting shop fulfilment.
  7. **In Stock Products:** Active catalog items available for customer purchase.
  8. **Out of Stock Products:** Products currently hidden or blocked from purchase.
- **Interactive Sales Trend Chart:** Real-time daily revenue bar visualization.
- **Recent Orders Table:** Quick access to recent multi-channel orders.
- **Best Sellers:** Top-performing items derived from real `order_items` snapshots.
- **Date Filters:** Quick toggles for *Today*, *Last 7 Days*, *Last 30 Days*, *This Month*, or *Custom Date Range*.

---

### 2. Products & Inventory Management (`/admin/products`)
- **Full CRUD:** Add new farsan, edit details, or safely delete products.
- **In Stock / Out of Stock Toggle:** Click the stock badge on any item to instantly switch its status. When marked **Out of Stock**, the storefront displays an *Out of Stock* tag and prevents customer checkout.
- **Variant Pricing:** Set independent packaging prices for **250 g**, **500 g**, **750 g (optional)**, and **1 kg**.
- **Supabase Storage Image Upload:** Upload product photos directly to the `product-images` bucket.
- **Safe Archival Protection:** Deleting a product that is linked to previous order history automatically marks it inactive/archived rather than destroying database integrity, ensuring your accounting totals are never corrupted.
- **Search & Sort:** Filter by category, stock status, and sort by name or price.

---

### 3. Website Orders (`/admin/website-orders`)
- **Dedicated Web Checkout Page:** Displays only orders submitted via the online checkout flow.
- **Order Details:** Order reference number (`AF-YYYYMMDD-XXXX`), customer name, phone, delivery address, ordered variants, line totals, and payment status.
- **Status Updates:** Update fulfilment status (*Pending*, *Confirmed*, *Preparing*, *Dispatched*, *Delivered*, *Cancelled*) and payment status (*Pending*, *COD*, *Paid*, *Refunded*).
- **Print Packing Slip / Invoice:** Click **Print Slip** inside any order modal to generate a clean printable invoice with shop details, customer info, itemized table, and total.
- **CSV Export:** Click **Export CSV** to download a spreadsheet of filtered orders.

---

### 4. WhatsApp Orders & Enquiries (`/admin/whatsapp-orders`)
- **Strict Segregation:** WhatsApp enquiries are clearly badged as **Order Intents**.
- **Financial Integrity:** WhatsApp link clicks and inquiries are **never fabricated as completed revenue** until the shop operator manually confirms the order.
- **One-Click WhatsApp Chat:** Click **WhatsApp** on any order card to open a pre-filled WhatsApp conversation with the customer's phone number.
- **Status Workflow:** Transition an enquiry to *Confirmed Order*, *Preparing*, *Delivered*, or *Cancelled*. Once marked *Confirmed* or *Delivered*, it joins your confirmed revenue reports.
- **CSV Export:** Download a complete record of customer WhatsApp inquiries for marketing and follow-ups.

---

### 5. Global Discounts (`/admin/discounts`)
- **Storewide Controls:** Enable or disable global discounts with a single toggle.
- **Discount Formats:** Configure percentage discounts (e.g. 5%, 10%, 15%, 20%) or fixed amounts (₹).
- **Minimum Order Amount Threshold:** Set an optional subtotal threshold (e.g., minimum ₹500 to qualify).
- **Scheduled Windows:** Set start and end dates/times for festive promotions (e.g., Diwali or New Year).
- **Live Interactive Price Preview:** View before-and-after prices across sample farsan products in real-time before publishing.
- **Tamper-Proof Backend Calculation:** Pricing rules are strictly validated and enforced in PostgreSQL (`create_order_secure`), preventing browser tampering.

---

### 6. Sales & Financial Reports (`/admin/reports`)
- **Comprehensive Analytics:** Gross Merchandise Value (GMV), Discounts Granted, Net Sales, Average Order Value (AOV), and total fulfilled orders.
- **Channel Breakdown:** Side-by-side comparison of Website Checkout Sales vs. Confirmed WhatsApp Sales.
- **Best-Selling Farsan:** Ranked table of top products by units sold and revenue.
- **Export Reports:** Download CSV financial summaries for any selected period (*Today*, *7 Days*, *30 Days*, *This Month*, *This Year*, or *Custom*).

---

### 7. Store Settings (`/admin/settings`)
- **Operational Hours & Announcements:** Update daily operating hours and site-wide top announcement banners.
- **Contact & WhatsApp Numbers:** Change primary shop phone and WhatsApp order receiving numbers.
- **Delivery Coverage & Charges:** Adjust delivery fees and local delivery boundaries in Mira Road.
- **Admin Password Reset:** Change your operator password securely anytime.

---

## 4. Security Architecture

1. **Row-Level Security (RLS):** All exposed tables have strict RLS policies. Normal authenticated users and anonymous visitors cannot modify products, orders, settings, or admin roles.
2. **PostgreSQL RPC Verification:** The `public.is_admin()` security definer function inspects `public.admin_roles` rather than trusting unverified frontend flags or client metadata.
3. **No Secrets in Bundles:** Only the public Supabase Anon key is bundled in the frontend. The Service Role key is never exposed.
4. **Session Persistence:** Supabase Auth manages encrypted sessions in local storage, automatically handling token refreshes.
