import { supabase } from "../lib/supabaseClient";

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

    if (error) throw error;
    return data || [];
  },

  async create(input: CreateCelebrationInput): Promise<Celebration> {
    let image_url = input.image_url || "";

    if (input.image_file) {
      const fileExt = input.image_file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `celebrations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, input.image_file);

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

    if (input.image_file) {
      const fileExt = input.image_file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `celebrations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, input.image_file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      image_url = publicUrlData.publicUrl;
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
    return data;
  },

  async delete(id: string, imageUrl?: string): Promise<void> {
    // Delete from DB
    const { error } = await supabase.from("celebrations").delete().eq("id", id);
    if (error) throw error;

    // Delete image from storage if applicable
    if (imageUrl) {
      try {
        const path = imageUrl.split("/").pop();
        if (path) {
          await supabase.storage.from("portfolio").remove([`celebrations/${path}`]);
        }
      } catch (e) {
        console.error("Failed to delete celebration image:", e);
      }
    }
  }
};
