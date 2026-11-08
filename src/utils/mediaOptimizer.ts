/**
 * Media Optimizer & Compression Utility
 * - Compresses static images to lightweight WebP (max 1440px, ~82% quality, ~100-250KB)
 * - Preserves animated GIF & animated WebP multi-frame sequences completely intact
 * - Provides standardized media type detectors for autoplay videos and GIFs
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  forceWebp?: boolean;
}

/**
 * Check if a URL or path is a video based on common video extensions
 */
export const isVideoUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== "string") return false;
  return Boolean(url.match(/\.(mp4|webm|mov|m4v|ogg|ogv|quicktime|mkv)($|\?|#)/i));
};

/**
 * Check if a URL or path is a GIF
 */
export const isGifUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== "string") return false;
  return Boolean(url.match(/\.gif($|\?|#)/i));
};

/**
 * Check if a File or URL is a video
 */
export const isVideoFile = (fileOrUrl?: any): boolean => {
  if (!fileOrUrl) return false;
  if (typeof fileOrUrl === "string") {
    return isVideoUrl(fileOrUrl);
  }
  if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
    if (fileOrUrl.type && fileOrUrl.type.startsWith("video/")) return true;
    if ("name" in fileOrUrl && typeof (fileOrUrl as any).name === "string") {
      return isVideoUrl((fileOrUrl as any).name);
    }
  }
  return false;
};

/**
 * Check if a File or URL is a GIF image
 */
export const isGifFile = (fileOrUrl?: any): boolean => {
  if (!fileOrUrl) return false;
  if (typeof fileOrUrl === "string") {
    return isGifUrl(fileOrUrl);
  }
  if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
    if (fileOrUrl.type === "image/gif") return true;
    if ("name" in fileOrUrl && typeof (fileOrUrl as any).name === "string") {
      return isGifUrl((fileOrUrl as any).name);
    }
  }
  return false;
};

/**
 * Fast detection of animated WebP files by inspecting RIFF chunk headers for "ANIM"
 */
export const isAnimatedWebp = async (file: File | Blob): Promise<boolean> => {
  if (!file) return false;
  const isWebpType = file.type === "image/webp" || ("name" in file && (file as any).name?.toLowerCase().endsWith(".webp"));
  if (!isWebpType) return false;

  try {
    const slice = file.slice(0, 2048);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // Look for ASCII "ANIM" bytes [65, 78, 73, 77]
    for (let i = 0; i < bytes.length - 4; i++) {
      if (
        bytes[i] === 0x41 && // 'A'
        bytes[i + 1] === 0x4e && // 'N'
        bytes[i + 2] === 0x49 && // 'I'
        bytes[i + 3] === 0x4d // 'M'
      ) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
};

/**
 * Determine if a file is an animated media (GIF or animated WebP) whose
 * frames must NEVER be flattened by HTML5 Canvas.
 */
export const isAnimatedMedia = async (file: File | Blob): Promise<boolean> => {
  if (isGifFile(file)) return true;
  return await isAnimatedWebp(file);
};

/**
 * Client-side static image optimizer
 * Converts PNG/JPEG/static WebP to lightweight WebP (~82% quality, max 1440px),
 * reducing file size from 5-20MB down to 100-250KB without perceptible quality loss.
 * Automatically skips animated GIFs and animated WebPs.
 */
export const optimizeImage = async (
  file: File,
  options: OptimizeImageOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1440,
    maxHeight = 1440,
    quality = 0.82,
    forceWebp = true,
  } = options;

  // 1. Skip non-image or vector files
  if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    return file;
  }

  // 2. CRITICAL: NEVER convert or flatten animated GIFs
  if (isGifFile(file)) {
    console.info(`[mediaOptimizer] Preserving animated GIF frames for: ${file.name}`);
    return file;
  }

  // 3. Skip animated WebP files
  const animatedWebp = await isAnimatedWebp(file);
  if (animatedWebp) {
    console.info(`[mediaOptimizer] Preserving animated WebP frames for: ${file.name}`);
    return file;
  }

  // 4. If image is already tiny (< 80KB) and not a huge dimension file, keep original
  if (file.size < 80 * 1024) {
    return file;
  }

  return new Promise<File>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Scale down proportionally if larger than maximum bounds
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const targetMime = forceWebp ? "image/webp" : (file.type || "image/jpeg");

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If compression somehow produced a larger file than original, keep original
          if (blob.size >= file.size && file.type === targetMime) {
            resolve(file);
            return;
          }

          const originalExt = file.name.split(".").pop();
          const targetExt = targetMime === "image/webp" ? "webp" : (originalExt || "jpg");
          const newFileName = file.name.replace(/\.[^.]+$/, `.${targetExt}`);

          const optimizedFile = new File([blob], newFileName, {
            type: targetMime,
            lastModified: Date.now(),
          });

          const savedKb = Math.round((file.size - blob.size) / 1024);
          const percent = ((1 - blob.size / file.size) * 100).toFixed(1);
          console.info(
            `[mediaOptimizer] Optimized ${file.name}: ${(file.size / 1024).toFixed(0)}KB -> ${(blob.size / 1024).toFixed(0)}KB (-${percent}%, saved ${savedKb}KB)`
          );

          resolve(optimizedFile);
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

/**
 * Format bytes into human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

