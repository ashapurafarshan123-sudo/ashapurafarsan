const fs = require('fs');

const f1 = fs.readFileSync('supabase/migrations/20261023000001_core_schema.sql', 'utf8');
const f2 = fs.readFileSync('supabase/migrations/20261023000002_seed_products.sql', 'utf8');
const f3 = fs.readFileSync('supabase/migrations/20261023000003_rls_and_rpc.sql', 'utf8');
const f4 = fs.readFileSync('supabase/migrations/20261023000004_storage.sql', 'utf8');

const cleanupHeader = `-- ==============================================================================
-- ASHAPURA FARSAN: CLEAN SCHEMA SETUP & RE-SYNC SCRIPT FOR SUPABASE
-- Project: https://supabase.com/dashboard/project/kplcpasenjwdpqtqvwtb
-- SQL Editor URL: https://supabase.com/dashboard/project/kplcpasenjwdpqtqvwtb/sql/new
-- ==============================================================================

-- 0. CLEAN UP CONFLICTING OLD PRE-REDESIGN TABLES
-- (auth.users accounts in auth schema remain completely untouched and safe)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.admin_roles CASCADE;
DROP TABLE IF EXISTS public.store_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop obsolete functions if any
DROP FUNCTION IF EXISTS public.create_order_secure CASCADE;
DROP FUNCTION IF EXISTS public.admin_get_dashboard_stats CASCADE;
DROP FUNCTION IF EXISTS public.admin_update_order_status CASCADE;
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at CASCADE;
`;

const fullSql = [
  cleanupHeader,
  '\n-- ==============================================================================\n',
  f1,
  '\n-- ==============================================================================\n',
  f2,
  '\n-- ==============================================================================\n',
  f3,
  '\n-- ==============================================================================\n',
  f4
].join('\n');

fs.writeFileSync('supabase/full_schema_setup.sql', fullSql, 'utf8');
fs.writeFileSync('supabase/upgrade_existing_project.sql', fullSql, 'utf8');
console.log('Successfully generated clean full_schema_setup.sql and upgrade_existing_project.sql');
