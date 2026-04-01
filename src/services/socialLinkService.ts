import { supabase } from "../lib/supabaseClient";

export interface SocialLink {
  id?: string;
  name: string;
  url: string;
  icon_name: string;
  color_code?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const socialLinkService = {
  async getAll() {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return data as SocialLink[];
  },

  async create(link: SocialLink) {
    const { data, error } = await supabase
      .from("social_links")
      .insert([link])
      .select();
    if (error) throw error;
    return data[0] as SocialLink;
  },

  async update(id: string, link: Partial<SocialLink>) {
    const { data, error } = await supabase
      .from("social_links")
      .update(link)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0] as SocialLink;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
};
