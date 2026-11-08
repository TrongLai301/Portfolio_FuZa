import { supabase, resolveStorageUrl } from "../lib/supabaseClient";
import { deleteStorageFile } from "./storageService";

export interface Celebration {
  id: string;
  image_url: string;
  date: string;
  caption: string;
  description: string;
  created_at: string;
}

export interface CreateCelebrationInput {
  image_url?: string;
  image_file?: File | null;
  date: string;
  caption: string;
  description?: string;
}

export const celebrationService = {
  async getAll(): Promise<Celebration[]> {
    const { data, error } = await supabase
      .from("celebrations")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("[celebrationService] Failed to fetch celebrations:", error);
      throw error;
    }
    return (data || []).map((item) => ({
      ...item,
      image_url: resolveStorageUrl(item.image_url),
    }));
  },

  async create(input: CreateCelebrationInput): Promise<Celebration> {
    let image_url = input.image_url || "";

    if (input.image_file) {
      const file = input.image_file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `celebrations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          contentType: file.type || undefined,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      image_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("celebrations")
      .insert([{
        image_url,
        date: input.date,
        caption: input.caption,
        description: input.description,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: CreateCelebrationInput): Promise<Celebration> {
    let image_url = input.image_url || "";
    let oldImageUrl = input.image_url;
    let newlyUploadedUrl = "";

    try {
      if (input.image_file) {
        // If oldImageUrl is not provided by caller, retrieve existing image from DB first
        if (!oldImageUrl) {
          const { data: existing } = await supabase
            .from("celebrations")
            .select("image_url")
            .eq("id", id)
            .maybeSingle();
          oldImageUrl = existing?.image_url;
        }

        const file = input.image_file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `celebrations/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, file, {
            contentType: file.type || undefined,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
        newlyUploadedUrl = image_url;
      }

      const { data, error } = await supabase
        .from("celebrations")
        .update({
          image_url: image_url || undefined,
          date: input.date,
          caption: input.caption,
          description: input.description,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Clean up old image from storage only after DB update succeeds
      if (newlyUploadedUrl && oldImageUrl) {
        await deleteStorageFile(oldImageUrl);
      }

      return data;
    } catch (err) {
      // Rollback newly uploaded file on failure
      if (newlyUploadedUrl) {
        await deleteStorageFile(newlyUploadedUrl);
      }
      throw err;
    }
  },

  async delete(id: string, imageUrl?: string): Promise<void> {
    let targetImageUrl = imageUrl;

    // If imageUrl was not provided by caller, query the record first to ensure the storage file is deleted
    if (!targetImageUrl) {
      const { data: existing } = await supabase
        .from("celebrations")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();
      targetImageUrl = existing?.image_url;
    }

    // 1. Delete from DB
    const { error } = await supabase.from("celebrations").delete().eq("id", id);
    if (error) throw error;

    // 2. Delete media (image/video/gif) from storage
    if (targetImageUrl) {
      await deleteStorageFile(targetImageUrl);
    }
  }
};
