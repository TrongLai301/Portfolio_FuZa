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
  
  // Pattern to match any existing origin followed by our proxy path
  // This handles http://localhost:5173/supabase-local, http://10.22.20.156:5173/supabase-local, etc.
  const proxyPattern = /https?:\/\/[^/]+\/supabase-local/;
  
  if (proxyPattern.test(url)) {
    // Force the current origin so it works on any device on the LAN
    const resolved = url.replace(proxyPattern, `${window.location.origin}/supabase-local`);
    console.log("Resolved Proxy URL:", resolved);
    return resolved;
  }

  // Fallback for raw local Supabase URLs (127.0.0.1:54321)
  const localPattern = /https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/;
  if (localPattern.test(url)) {
    return url.replace(localPattern, `${window.location.origin}/supabase-local`);
  }

  return url;
}

