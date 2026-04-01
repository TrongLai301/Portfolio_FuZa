import { supabase } from "../lib/supabaseClient";

export interface Skill {
  id: string;
  name: string;
  icon_name: string;
  color_code: string;
  display_order: number;
}

export type CreateSkillInput = Omit<Skill, "id">;

export const skillService = {
  getSkills: async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data as Skill[];
  },

  createSkill: async (skill: CreateSkillInput) => {
    const { data, error } = await supabase
      .from("skills")
      .insert([skill])
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  updateSkill: async (id: string, skill: Partial<CreateSkillInput>) => {
    const { data, error } = await supabase
      .from("skills")
      .update(skill)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  deleteSkill: async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
};
