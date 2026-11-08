import { supabase } from "../lib/supabaseClient";

/**
 * Extracts relative storage file path from any Supabase URL
 * Handles production (https://<ref>.supabase.co/storage/v1/object/public/<bucket>/...),
 * local development/proxy paths (/supabase-local/storage/v1/object/public/<bucket>/...),
 * and direct relative bucket paths (e.g. "covers/abc.png", "audio/song.mp3", "celebrations/mem.jpg").
 */
export const getStoragePathFromUrl = (url: string, bucket = "portfolio"): string | null => {
  if (!url) return null;
  
  // Clean query parameters and hash if any
  const cleanUrl = url.split("?")[0].split("#")[0];

  // Match anything after /<bucket>/
  const bucketPattern = new RegExp(`/${bucket}/(.+)$`);
  const match = cleanUrl.match(bucketPattern);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  // If the input was already a relative path inside the bucket (e.g. "covers/abc.png")
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  }

  return null;
};

/**
 * Deletes multiple files from Supabase Storage by their public URLs or relative paths in a single batch request.
 * Safe to call even if files are external or don't exist.
 */
export const deleteStorageFiles = async (
  urlsOrPaths: (string | null | undefined)[],
  bucket = "portfolio"
): Promise<boolean> => {
  if (!urlsOrPaths || urlsOrPaths.length === 0) return false;

  const validPaths = Array.from(
    new Set(
      urlsOrPaths
        .map((u) => (u ? getStoragePathFromUrl(u, bucket) : null))
        .filter((p): p is string => Boolean(p))
    )
  );

  if (validPaths.length === 0) return false;

  try {
    const { error } = await supabase.storage.from(bucket).remove(validPaths);
    if (error) {
      console.warn(`[StorageService] Could not remove files ${JSON.stringify(validPaths)}:`, error.message);
      return false;
    }
    console.log(`[StorageService] Successfully removed files ${JSON.stringify(validPaths)} from bucket "${bucket}"`);
    return true;
  } catch (err: any) {
    console.warn(`[StorageService] Error during batch deletion of files:`, err.message);
    return false;
  }
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
  return deleteStorageFiles([urlOrPath], bucket);
};
