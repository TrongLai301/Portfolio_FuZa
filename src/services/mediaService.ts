import { supabase } from "../lib/supabaseClient";

export type MediaType = 'anime' | 'game';

export interface Category {
  id: string;
  type: MediaType;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  image_url: string;
  year?: number;
  description?: string;
  created_at?: string;
  categories?: Category[];
}

export interface CreateMediaInput {
  type: MediaType;
  title: string;
  image_url: string;
  year?: number;
  description?: string;
  category_ids?: string[];
}

export const mediaService = {
  // === CATEGORIES ===
  getCategories: async (type?: MediaType) => {
    let query = supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    
    if (type) {
      query = query.eq("type", type);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Category[];
  },

  createCategory: async (category: Omit<Category, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("categories")
      .insert([category])
      .select();
    
    if (error) throw error;
    return data?.[0] as Category;
  },

  deleteCategory: async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // === MEDIA ===
  getMedias: async (type?: MediaType) => {
    let query = supabase
      .from("medias")
      .select(`
        *,
        media_categories (
          categories (*)
        )
      `)
      .order("created_at", { ascending: false });
    
    if (type) {
      query = query.eq("type", type);
    }
    
    const { data, error } = await query;
    if (error) throw error;

    return data.map(item => ({
      ...item,
      categories: item.media_categories?.map((mc: any) => mc.categories) || []
    })) as Media[];
  },

  createMedia: async (input: CreateMediaInput) => {
    const { category_ids, ...mediaData } = input;

    const { data: media, error: mediaError } = await supabase
      .from("medias")
      .insert([mediaData])
      .select();
    
    if (mediaError) throw mediaError;
    const newMedia = media?.[0];

    if (category_ids && category_ids.length > 0) {
      const associations = category_ids.map(cid => ({
        media_id: newMedia.id,
        category_id: cid
      }));
      const { error: assocError } = await supabase
        .from("media_categories")
        .insert(associations);
      
      if (assocError) throw assocError;
    }

    return newMedia;
  },

  updateMedia: async (id: string, input: Partial<CreateMediaInput>) => {
    const { category_ids, ...mediaData } = input;

    const { error: mediaError } = await supabase
      .from("medias")
      .update(mediaData)
      .eq("id", id);
    
    if (mediaError) throw mediaError;

    if (category_ids !== undefined) {
      await supabase.from("media_categories").delete().eq("media_id", id);
      if (category_ids.length > 0) {
        const associations = category_ids.map(cid => ({
          media_id: id,
          category_id: cid
        }));
        await supabase.from("media_categories").insert(associations);
      }
    }

    return true;
  },

  deleteMedia: async (id: string, imageUrl: string) => {
    const { error } = await supabase.from("medias").delete().eq("id", id);
    if (error) throw error;
    try {
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
            await supabase.storage.from("portfolio").remove([`covers/${fileName}`]);
        }
    } catch (e) {
        console.warn("Media storage cleanup failed:", e);
    }
    return true;
  }
};
