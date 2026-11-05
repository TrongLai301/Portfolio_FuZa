import { supabase } from "../lib/supabaseClient";

/**
 * Extracts relative storage file path from any Supabase URL
 * Handles both production (https://<ref>.supabase.co/storage/v1/object/public/<bucket>/...)
 * and local development/proxy paths (/supabase-local/storage/v1/object/public/<bucket>/...)
 */
export const getStoragePathFromUrl = (url: string, bucket = "portfolio"): string | null => {
  if (!url) return null;
  
  // Clean query parameters and hash if any
  const cleanUrl = url.split("?")[0].split("#")[0];

  // Match anything after /<bucket>/
  const bucketPattern = new RegExp(`/${bucket}/(.+)$`);
  const match = cleanUrl.match(bucketPattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // If the input was already a relative path inside the bucket (e.g. "covers/abc.png")
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    return url;
  }

  return null;
};

/**
 * Deletes a file from Supabase Storage by its public URL or relative path.
 * Safe to call even if the file is external or doesn't exist.
 */
export const deleteStorageFile = async (
  urlOrPath?: string | null,
  bucket = "portfolio"
): Promise<boolean> => {
  if (!urlOrPath) return false;

  const path = getStoragePathFromUrl(urlOrPath, bucket);
  if (!path) {
    // If it's an external URL (e.g. imgur, external cdn), ignore deletion
    return false;
  }

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.warn(`[StorageService] Could not remove file "${path}":`, error.message);
      return false;
    }
    console.log(`[StorageService] Successfully removed old file "${path}"`);
    return true;
  } catch (err: any) {
    console.warn(`[StorageService] Error during deletion of "${path}":`, err.message);
    return false;
  }
};
