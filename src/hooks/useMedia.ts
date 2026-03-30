import { useState, useCallback, useEffect } from "react";
import { mediaService, type Media, type Category, type CreateMediaInput } from "../services/mediaService";
import { musicService } from "../services/musicService"; // Re-use storage utility
import { toast } from "sonner";

export interface MediaSubmitInput extends Partial<CreateMediaInput> {
  image_file?: File | null;
  existing_image_url?: string;
  category_ids?: string[];
}

export const useMedia = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [mediaData, catData] = await Promise.all([
        mediaService.getMedias(),
        mediaService.getCategories(),
      ]);
      setMedias(mediaData);
      setCategories(catData);
    } catch (error: any) {
      toast.error("Fetch media failed: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMedia = async (input: MediaSubmitInput) => {
    setSubmitting(true);
    let uploadedImageUrl = "";

    try {
      // 1. Validation
      if (!input.image_file) throw new Error("Missing visual signal (Cover Image)");

      // 2. Upload Image
      uploadedImageUrl = await musicService.uploadFile(input.image_file, "covers");

      // 3. Save to DB
      const newMedia: CreateMediaInput = {
        type: input.type!, // Gán type vào đây
        title: input.title!,
        image_url: uploadedImageUrl,
        year: input.year || new Date().getFullYear(),
        description: input.description,
        category_ids: input.category_ids || [],
      };

      await mediaService.createMedia(newMedia);
      toast.success("Media record deployed!");
      await fetchData();
      return true;
    } catch (error: any) {
      // Rollback
      if (uploadedImageUrl) {
        await musicService.deleteFileByUrl(uploadedImageUrl, "covers");
      }
      toast.error("Save failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const editMedia = async (id: string, input: MediaSubmitInput) => {
    setSubmitting(true);
    let uploadedImageUrl = "";

    try {
      // 1. Handle New Upload
      if (input.image_file) {
        uploadedImageUrl = await musicService.uploadFile(input.image_file, "covers");
      }

      // 2. Prepare Data
      const updateData: Partial<CreateMediaInput> = {
        type: input.type, // Gán type vào đây
        title: input.title,
        year: input.year,
        description: input.description,
        category_ids: input.category_ids,
      };

      if (uploadedImageUrl) updateData.image_url = uploadedImageUrl;

      // 3. Update DB
      await mediaService.updateMedia(id, updateData);

      // 4. Cleanup old file
      if (uploadedImageUrl && input.existing_image_url) {
        await musicService.deleteFileByUrl(input.existing_image_url, "covers");
      }

      toast.success("Media record optimized!");
      await fetchData();
      return true;
    } catch (error: any) {
      // Rollback
      if (uploadedImageUrl) {
        await musicService.deleteFileByUrl(uploadedImageUrl, "covers");
      }
      toast.error("Update failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeMedia = async (id: string, imageUrl: string) => {
    try {
      await mediaService.deleteMedia(id, imageUrl);
      toast.success("Media purged from database.");
      await fetchData();
    } catch (error: any) {
      toast.error("Purge failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    medias,
    categories,
    loading,
    submitting,
    fetchData,
    saveMedia,
    editMedia,
    removeMedia
  };
};
