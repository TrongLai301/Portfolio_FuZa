import { supabase } from "../lib/supabaseClient";

export interface SiteSettings {
  id?: string;
  header_logo_text: string;
  header_logo_color: string;
  menu_text_color: string;
  menu_active_color: string;
  title_primary_color: string;
  title_secondary_color: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  header_logo_text: "FuZa's profile",
  header_logo_color: "#ffffff",
  menu_text_color: "#bdc3c7",
  menu_active_color: "linear-gradient(204deg, rgb(105, 118, 128) 24%, rgb(223, 235, 245) 72%)",
  title_primary_color: "#ffffff",
  title_secondary_color: "linear-gradient(180deg, rgb(51, 51, 51) 0%, rgb(255, 255, 255) 100%)",
};

export const siteSettingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[SiteSettings] Database query error, using defaults:", error.message);
        return DEFAULT_SITE_SETTINGS;
      }

      if (!data) {
        return DEFAULT_SITE_SETTINGS;
      }

      return {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
      };
    } catch (err: any) {
      console.warn("[SiteSettings] Failed to fetch settings:", err.message);
      return DEFAULT_SITE_SETTINGS;
    }
  },

  saveSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const current = await siteSettingsService.getSettings();
    const payload = {
      ...DEFAULT_SITE_SETTINGS,
      ...current,
      ...settings,
    };

    if (current.id) {
      const { data, error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", current.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
