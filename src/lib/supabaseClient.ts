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
  if (!url || typeof url !== "string") return url;
  
  // 1. If it already contains /supabase-local, ensure the origin matches current window.location.origin
  const proxyPattern = /https?:\/\/[^/]+\/supabase-local/;
  if (proxyPattern.test(url)) {
    return url.replace(proxyPattern, `${window.location.origin}/supabase-local`);
  }

  // 2. If it points to local Supabase port 54321 on any IP / hostname, route through dev proxy
  const supabasePortPattern = /https?:\/\/[^/]+:54321/;
  if (supabasePortPattern.test(url)) {
    return url.replace(supabasePortPattern, `${window.location.origin}/supabase-local`);
  }

  // 3. Fallback for raw localhost or 127.0.0.1
  const localPattern = /https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/;
  if (localPattern.test(url)) {
    return url.replace(localPattern, `${window.location.origin}/supabase-local`);
  }

  return url;
}

