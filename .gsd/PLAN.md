# GSD Plan: Plan 7.1 — Database Schema Enhancements & Admin Provisioning SQL

**Phase:** Phase 7 — Complete Supabase Admin Panel  
**Plan:** 7.1  
**Type:** Implementation & Database Architecture  
**Autonomous:** Yes  

## Objective
Design and implement safe database migrations, provisioning the initial admin role for `vaibhavchawda432@gmail.com`, introducing global discount configurations in Supabase, and adding comprehensive PostgreSQL RPC functions for administrative analytics and discount enforcement.

## Tasks
1. `[ ]` Task 7.1.1: Create `supabase/migrations/20261026000001_admin_panel_enhancements.sql`:
   - Admin provisioning logic for `vaibhavchawda432@gmail.com` into `public.admin_roles`.
   - Dedicated `discounts` table with columns: `id`, `code`, `title`, `discount_percent`, `discount_amount`, `discount_type`, `min_order_amount`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`.
   - Update `store_settings` seed with default global discount configuration (`global_discount`).
   - Enhance `create_order_secure` RPC to read active global discount from `store_settings` and enforce discount calculation at the backend boundary.
   - Implement `admin_get_advanced_analytics(p_start_date TIMESTAMPTZ, p_end_date TIMESTAMPTZ)` RPC returning:
     - Gross sales, net sales, discounts granted, order count, AOV
     - Website orders vs. WhatsApp orders count and revenue breakdown
     - In-stock and out-of-stock product counts
     - Pending orders count
     - Best-selling products aggregated from `order_items`
     - Daily sales trend data
2. `[ ]` Task 7.1.2: Update `supabase/full_schema_setup.sql` consolidating the enhancements for single-click execution.
3. `[ ]` Task 7.1.3: Update database test suite in `tests/database_migrations.test.js` to verify new migration schema and RPC functions.

## Verification
- Run `node --test tests/database_migrations.test.js` to verify syntax and structural integrity.
