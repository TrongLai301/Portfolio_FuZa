import { supabase, resolveStorageUrl } from "../lib/supabaseClient";
import { deleteStorageFile } from "./storageService";

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
      image_url: resolveStorageUrl(item.image_url),
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

  updateMedia: async (id: string, input: Partial<CreateMediaInput>, oldImageUrl?: string) => {
    const { category_ids, ...mediaData } = input;

    let targetOldImageUrl = oldImageUrl;
    if (mediaData.image_url && !targetOldImageUrl) {
      const { data: existing } = await supabase
        .from("medias")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();
      if (existing?.image_url && existing.image_url !== mediaData.image_url) {
        targetOldImageUrl = existing.image_url;
      }
    }

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

    // Clean up replaced image from storage
    if (targetOldImageUrl && mediaData.image_url && targetOldImageUrl !== mediaData.image_url) {
      await deleteStorageFile(targetOldImageUrl);
    }

    return true;
  },

  deleteMedia: async (id: string, imageUrl?: string) => {
    let targetImageUrl = imageUrl;

    // If imageUrl was not provided by caller, query the record first so the image is never orphaned in storage
    if (!targetImageUrl) {
      const { data: existing } = await supabase
        .from("medias")
        .select("image_url")
        .eq("id", id)
        .maybeSingle();
      targetImageUrl = existing?.image_url;
    }

    // 1. Delete relational links
    await supabase.from("media_categories").delete().eq("media_id", id);

    // 2. Delete record from DB
    const { error } = await supabase.from("medias").delete().eq("id", id);
    if (error) throw error;

    // 3. Delete media file from storage
    if (targetImageUrl) {
      await deleteStorageFile(targetImageUrl);
    }
    return true;
  }
};
