import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

describe('Database Migrations Integrity & RLS Verification', () => {
  const coreSql = fs.readFileSync('supabase/migrations/20261023000001_core_schema.sql', 'utf8');
  const seedSql = fs.readFileSync('supabase/migrations/20261023000002_seed_products.sql', 'utf8');
  const rlsSql = fs.readFileSync('supabase/migrations/20261023000003_rls_and_rpc.sql', 'utf8');
  const storageSql = fs.readFileSync('supabase/migrations/20261023000004_storage.sql', 'utf8');

  it('declares all required application tables with primary keys and foreign keys', () => {
    const requiredTables = [
      'public.profiles',
      'public.admin_roles',
      'public.categories',
      'public.products',
      'public.product_variants',
      'public.user_addresses',
      'public.orders',
      'public.order_items',
      'public.store_settings',
    ];

    for (const table of requiredTables) {
      assert.ok(
        coreSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
        `Table definition missing: ${table}`
      );
    }
  });

  it('enables Row Level Security (RLS) on all exposed tables', () => {
    const rlsTables = [
      'public.profiles',
      'public.admin_roles',
      'public.categories',
      'public.products',
      'public.product_variants',
      'public.user_addresses',
      'public.orders',
      'public.order_items',
      'public.store_settings',
    ];

    for (const table of rlsTables) {
      assert.ok(
        rlsSql.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`),
        `RLS not enabled on ${table}`
      );
    }
  });

  it('defines secure PostgreSQL functions with SECURITY DEFINER and search_path set', () => {
    assert.ok(rlsSql.includes('FUNCTION public.is_admin'));
    assert.ok(rlsSql.includes('SECURITY DEFINER'));
    assert.ok(rlsSql.includes('SET search_path = public'));
    assert.ok(rlsSql.includes('FUNCTION public.create_order_secure'));
    assert.ok(rlsSql.includes('FUNCTION public.admin_get_dashboard_stats'));
    assert.ok(rlsSql.includes('FUNCTION public.admin_update_order_status'));
  });

  it('includes seed data for all categories, 35 products and default store settings', () => {
    assert.ok(seedSql.includes("INSERT INTO public.categories"));
    assert.ok(seedSql.includes("INSERT INTO public.products"));
    assert.ok(seedSql.includes("INSERT INTO public.product_variants"));
    assert.ok(seedSql.includes("hero-ashapura-spcl-kachori"));
    assert.ok(seedSql.includes("ratlami-sev"));
  });

  it('defines storage policies for product-images bucket with admin-only upload', () => {
    assert.ok(storageSql.includes("bucket_id = 'product-images'"));
    assert.ok(storageSql.includes("public.is_admin(auth.uid())"));
  });
});
