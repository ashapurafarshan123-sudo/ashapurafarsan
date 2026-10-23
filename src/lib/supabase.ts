import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Fallback dummy URL and key for safe build/preview if environment variables are not yet injected
const effectiveUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

if (!isSupabaseConfigured() && typeof window !== 'undefined') {
  console.warn(
    '[Ashapura Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured or using placeholder. Running in fallback mode. Connect your Supabase project in .env or Netlify settings.'
  );
}

export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'ashapura_auth_token',
  },
});

export default supabase;
