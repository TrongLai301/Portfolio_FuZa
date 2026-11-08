import { useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface UsePasteImageOptions {
  onPaste: (file: File) => void;
  enabled?: boolean;
  allowedTypes?: string[]; // e.g. ["image/", "video/"]
  successMessage?: string;
}

/**
 * usePasteImage Hook
 * Allows users to paste images or short media directly from the clipboard (Ctrl+V / Cmd+V)
 * anywhere within active admin forms, eliminating the need to browse file folders.
 */
export function usePasteImage({
  onPaste,
  enabled = true,
  allowedTypes = ["image/", "video/"],
  successMessage = "Đã dán ảnh từ clipboard!",
}: UsePasteImageOptions) {
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!enabled) return;

      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      let extractedFile: File | null = null;

      // 1. Inspect clipboard items
      if (clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          const isAllowed = allowedTypes.some((typePrefix) =>
            item.type.toLowerCase().startsWith(typePrefix.toLowerCase())
          );
          if (isAllowed) {
            const file = item.getAsFile();
            if (file) {
              extractedFile = file;
              break;
            }
          }
        }
      }

      // 2. Fallback to clipboard files
      if (!extractedFile && clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          const file = clipboardData.files[i];
          const isAllowed = allowedTypes.some((typePrefix) =>
            file.type.toLowerCase().startsWith(typePrefix.toLowerCase())
          );
          if (isAllowed) {
            extractedFile = file;
            break;
          }
        }
      }

      if (extractedFile) {
        e.preventDefault();
        e.stopPropagation();

        // Assign a friendly timestamped filename if generic or missing
        let finalFile = extractedFile;
        if (!extractedFile.name || extractedFile.name === "image.png") {
          const ext = extractedFile.type.split("/")[1] || "png";
          finalFile = new File([extractedFile], `pasted_${Date.now()}.${ext}`, {
            type: extractedFile.type,
            lastModified: Date.now(),
          });
        }

        if (successMessage) {
          toast.success(successMessage);
        }

        onPaste(finalFile);
      }
    },
    [enabled, onPaste, allowedTypes, successMessage]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [enabled, handlePaste]);
}

