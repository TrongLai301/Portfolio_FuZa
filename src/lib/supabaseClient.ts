import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// In development, use a relative proxy path so that mobile devices
// on the same LAN can reach the local Supabase through Vite's proxy.
const isLocalDev = rawSupabaseUrl?.includes('127.0.0.1') || rawSupabaseUrl?.includes('localhost');
const supabaseUrl = isLocalDev ? `${window.location.origin}/supabase-local` : rawSupabaseUrl;

if (!rawSupabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Resolves Supabase storage URLs for local development.
 * Storage URLs are stored in DB pointing to 127.0.0.1, but in dev
 * we route them through Vite's proxy so mobile LAN access works too.
 */
export function resolveStorageUrl(url: string): string {
  if (!url) return url;
  if (url.includes('127.0.0.1') || url.includes('localhost')) {
    // Rewrite to use proxy path relative to current origin
    return url.replace(/https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, `${window.location.origin}/supabase-local`);
  }
  return url;
}

