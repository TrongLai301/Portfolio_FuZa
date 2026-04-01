import { supabase } from "../lib/supabaseClient";

export interface Song {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string;
  display_order: number;
  created_at?: string;
}

export type CreateSongInput = Omit<Song, "id" | "created_at">;

export const musicService = {
  getSongs: async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data as Song[];
  },

  /**
   * Upload file to Supabase Storage
   * @param file File object from browser
   * @param folder Target folder (e.g., 'audio' or 'covers')
   */
  uploadFile: async (file: File, folder: "audio" | "covers") => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Note: Ensure bucket 'portfolio' exists in Supabase Dashboard
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
    return data.publicUrl;
  },

  createSong: async (song: CreateSongInput) => {
    const { data, error } = await supabase
      .from("songs")
      .insert([song])
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  updateSong: async (id: string, song: Partial<CreateSongInput>) => {
    const { data, error } = await supabase
      .from("songs")
      .update(song)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  deleteSong: async (id: string, audioUrl: string, coverUrl: string) => {
    // 1. Delete record from DB
    const { error: dbError } = await supabase.from("songs").delete().eq("id", id);
    if (dbError) throw dbError;

    // 2. Cleanup Storage (Optional but recommended)
    try {
        const audioPath = audioUrl.split("/").pop();
        const coverPath = coverUrl.split("/").pop();
        if(audioPath) await supabase.storage.from("portfolio").remove([`audio/${audioPath}`]);
        if(coverPath) await supabase.storage.from("portfolio").remove([`covers/${coverPath}`]);
    } catch (e) {
        console.warn("Storage cleanup failed:", e);
    }
    
    return true;
  },

  deleteFileByUrl: async (url: string, folder: "audio" | "covers") => {
    try {
      const fileName = url.split("/").pop();
      if (!fileName) return;
      await supabase.storage.from("portfolio").remove([`${folder}/${fileName}`]);
    } catch (e) {
      console.warn("Manual cleanup failed:", e);
    }
  }
};
