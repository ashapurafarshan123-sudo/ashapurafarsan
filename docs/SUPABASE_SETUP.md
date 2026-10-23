# ASHAPURA FARSAN — SUPABASE PRODUCTION SETUP GUIDE

This document provides step-by-step instructions to configure your Supabase backend for Ashapura Farsan.

---

## 1. Create a Supabase Project

1. Navigate to [Supabase](https://supabase.com/) and sign in to your dashboard.
2. Click **New project** and select an appropriate organization.
3. Configure your project:
   - **Name:** `ashapura-farsan`
   - **Database Password:** Choose a strong password and save it securely in your password manager.
   - **Region:** Choose `South Asia (Mumbai)` for the lowest latency in India.
4. Click **Create new project** and wait ~2 minutes for the database to provision.

---

## 2. Execute Database Migrations

You can run the complete migration script in one step:

1. In your Supabase Dashboard, click on **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy the entire contents of [`supabase/full_schema_setup.sql`](../supabase/full_schema_setup.sql).
4. Paste it into the SQL editor and click **Run** (or press `Ctrl+Enter`).
5. Confirm that the output shows:
   - All 9 tables created: `profiles`, `admin_roles`, `categories`, `products`, `product_variants`, `user_addresses`, `orders`, `order_items`, `store_settings`.
   - 12 categories and 35 products seeded with official package weights (250g, 500g, 1kg).
   - Row Level Security (RLS) enabled on all exposed tables.
   - PostgreSQL functions created: `is_admin`, `create_order_secure`, `admin_get_dashboard_stats`, `admin_update_order_status`.
   - Storage bucket `product-images` initialized with admin-only upload policies.

*(Alternatively, you can run the files in `supabase/migrations/` in sequence using the Supabase CLI: `supabase db push`)*.

---

## 3. Retrieve API Keys & Configure Environment Variables

1. In Supabase Dashboard, go to **Project Settings** (gear icon) > **API**.
2. Locate the following values:
   - **Project URL:** `https://<your-project-id>.supabase.co`
   - **Project API Keys > `anon` (public):** `eyJhbGciOi...`
3. In your local project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in the values:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   VITE_SITE_URL=http://localhost:5173
   ```

> ⚠️ **SECURITY CRITICAL:** NEVER put your `service_role` secret key or database connection password in frontend files or `.env`. Only the `anon` public key is safe for client applications.

---

## 4. Provision Your First Store Administrator

The Ashapura Farsan admin dashboard is protected by Row Level Security and trusted database roles. Ordinary customers cannot grant themselves admin access.

### Step-by-step Admin Provisioning:

1. Go to your store website or local server (`/register`) and register your owner account (e.g. `owner@ashapurafarsan.com`).
2. Open your Supabase Dashboard > **Authentication** > **Users**.
3. Locate your newly registered user and copy their **User UID** (a UUID like `4d7c0827-89bb-4952-b132-723a12cb7fbc`).
4. Go to **SQL Editor** in Supabase and run:
   ```sql
   INSERT INTO public.admin_roles (user_id, role)
   VALUES ('<PASTE-USER-UID-HERE>', 'admin');
   ```
5. Log in through the unified login page (`/login`). You will now be automatically redirected to `/admin` with full operational controls for products, pricing, orders, and customer accounts!

---

## 5. Configure Authentication & Password Recovery Redirect URLs

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**.
2. Set **Site URL:**
   - Production: `https://ashapurafarsan1.netlify.app`
   - Local: `http://localhost:5173`
3. Under **Redirect URLs**, add:
   - `https://ashapurafarsan1.netlify.app/login`
   - `https://ashapurafarsan1.netlify.app/reset-password`
   - `https://ashapurafarsan1.netlify.app/account`
   - `https://ashapurafarsan1.netlify.app/**`
   - `http://localhost:5173/login`
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/account`
4. Click **Save**.

---

## 6. Configure Production Environment Variables in Netlify

1. In your Netlify team dashboard, go to your site: **ashapurafarsan1**.
2. Navigate to **Site configuration** > **Environment variables**.
3. Add the following variables:
   - `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-anon-public-key>`
   - `VITE_SITE_URL`: `https://ashapurafarsan1.netlify.app`
4. Trigger a new deployment (or push a commit to `main`). Netlify will build the production bundle with real Supabase persistence!

---

## 7. Storage Bucket Verification

If you wish to upload custom product photos from the Admin panel:
1. In Supabase Dashboard, go to **Storage**.
2. Verify that the bucket `product-images` exists and is set to **Public**.
3. The RLS policies in `20261023000004_storage.sql` automatically permit public reading while restricting image uploads, overwrites and deletions exclusively to verified administrators.
