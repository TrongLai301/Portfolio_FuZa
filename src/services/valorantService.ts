import { supabase } from "../lib/supabaseClient";

export interface GraphicsData {
  display_mode: string;
  resolution: string;
  aspect_ratio: string;
  aspect_ratio_method: string;
  enemy_highlight_color: string;
  multithreaded_rendering: string;
  material_quality: string;
  texture_quality: string;
  detail_quality: string;
  ui_quality: string;
  vignette: string;
  vsync: string;
  nvidia_reflex_low_latency: string;
  anti_aliasing: string;
  anisotropic_filtering: string;
  improve_clarity: string;
  experimental_sharpening: string;
  bloom: string;
  distortion: string;
  cast_shadows: string;
}

export interface ValorantData {
  profile: {
    id?: string;
    name: string;
    tag: string;
    region: string;
    main_role: string;
  };
  settings: {
    dpi: number;
    sensitivity: number;
    polling_rate: string;
    crosshair_code: string;
  };
  graphics: GraphicsData;
  gears: {
    mouse: string;
    keyboard: string;
    headset: string;
    mousepad: string;
    monitor: string;
  };
  agents: {
    agent_name: string;
    agent_image: string;
    play_count: number;
  }[];
}

export const valorantService = {
  async getProfile(): Promise<ValorantData | null> {
    const { data: profiles, error: pError } = await supabase
      .from("valorant_profiles")
      .select("*")
      .limit(1);

    if (pError) throw pError;
    if (!profiles || profiles.length === 0) return null;

    const profile = profiles[0];

    const [settingsRes, graphicsRes, gearsRes, agentsRes] = await Promise.all([
      supabase.from("valorant_settings").select("*").eq("profile_id", profile.id).maybeSingle(),
      supabase.from("valorant_graphics").select("*").eq("profile_id", profile.id).maybeSingle(),
      supabase.from("valorant_gears").select("*").eq("profile_id", profile.id).maybeSingle(),
      supabase.from("valorant_most_played_agents").select("*").eq("profile_id", profile.id)
    ]);

    return {
      profile,
      settings: settingsRes.data || {
        dpi: 0,
        sensitivity: 0,
        polling_rate: "",
        crosshair_code: "",
      },
      graphics: graphicsRes.data || {
        display_mode: 'Fullscreen',
        resolution: '1920x1080 (16:9)',
        aspect_ratio: 'Letterbox',
        aspect_ratio_method: 'Fill',
        enemy_highlight_color: 'Yellow (Deuteranopia)',
        multithreaded_rendering: 'On',
        material_quality: 'Medium',
        texture_quality: 'Medium',
        detail_quality: 'Medium',
        ui_quality: 'Medium',
        vignette: 'Off',
        vsync: 'Off',
        nvidia_reflex_low_latency: 'On + Boost',
        anti_aliasing: 'MSAA 4x',
        anisotropic_filtering: '4x',
        improve_clarity: 'Off',
        experimental_sharpening: 'Off',
        bloom: 'Off',
        distortion: 'Off',
        cast_shadows: 'Off',
      },
      gears: gearsRes.data || {
        mouse: "",
        keyboard: "",
        headset: "",
        mousepad: "",
        monitor: ""
      },
      agents: agentsRes.data || []
    };
  },

  async saveAll(data: ValorantData): Promise<boolean> {
    let profile_id = data.profile.id;

    // 1. Upsert Profile
    const profilePayload = {
      name: data.profile.name,
      tag: data.profile.tag,
      region: data.profile.region,
      main_role: data.profile.main_role
    };

    let pRes;
    if (profile_id) {
       pRes = await supabase
        .from("valorant_profiles")
        .update(profilePayload)
        .eq("id", profile_id)
        .select()
        .single();
    } else {
       pRes = await supabase
        .from("valorant_profiles")
        .insert([profilePayload])
        .select()
        .single();
    }

    if (pRes.error) throw pRes.error;
    profile_id = pRes.data.id;

    // 2. Upsert Settings, Graphics & Gears
    const [sRes, grRes, gRes] = await Promise.all([
      supabase.from("valorant_settings").upsert({
        profile_id,
        ...data.settings
      }, { onConflict: 'profile_id' }),
      supabase.from("valorant_graphics").upsert({
        profile_id,
        ...data.graphics
      }, { onConflict: 'profile_id' }),
      supabase.from("valorant_gears").upsert({
        profile_id,
        ...data.gears
      }, { onConflict: 'profile_id' })
    ]);

    if (sRes.error) throw sRes.error;
    if (grRes.error) throw grRes.error;
    if (gRes.error) throw gRes.error;

    // 3. Update Agents
    const { error: dError } = await supabase
      .from("valorant_most_played_agents")
      .delete()
      .eq("profile_id", profile_id);

    if (dError) throw dError;

    if (data.agents && data.agents.length > 0) {
      const agentsToInsert = data.agents.map(a => ({
        profile_id,
        agent_name: a.agent_name,
        agent_image: a.agent_image,
        play_count: a.play_count
      }));

      const { error: iError } = await supabase
        .from("valorant_most_played_agents")
        .insert(agentsToInsert);

      if (iError) throw iError;
    }

    return true;
  }
};
