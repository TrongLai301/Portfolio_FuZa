import { supabase } from "../lib/supabaseClient";

export interface HeroSettings {
  id: string;
  main_text_prefix: string;
  main_text_prefix_color: string;
  main_text_suffix: string;
  main_text_suffix_color: string;
  orbit_animation_color: string;
  description: string;
  video_bg_url: string;
  orbit_image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface TypewriterText {
  id: string;
  hero_id: string;
  content: string;
  content_color: string;
  display_order: number;
}

export interface HeroData {
  settings: HeroSettings | null;
  typewriterTexts: TypewriterText[];
}

export const fetchHeroData = async (): Promise<HeroData> => {
  try {
    const { data: settings, error: settingsError } = await supabase
      .from("hero_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (settingsError) throw settingsError;

    if (!settings) {
      return { settings: null, typewriterTexts: [] };
    }

    const { data: texts, error: textsError } = await supabase
      .from("typewriter_texts")
      .select("*")
      .eq("hero_id", settings.id)
      .order("display_order", { ascending: true });

    if (textsError) throw textsError;

    return {
      settings,
      typewriterTexts: texts || [],
    };
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return { settings: null, typewriterTexts: [] };
  }
};
