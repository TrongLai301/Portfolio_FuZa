import { supabase, resolveStorageUrl } from "../lib/supabaseClient";
import { deleteStorageFile, deleteStorageFiles } from "./storageService";
import { optimizeImage } from "../utils/mediaOptimizer";

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
    return (data || []).map((song) => ({
      ...song,
      cover_url: resolveStorageUrl(song.cover_url),
      audio_url: resolveStorageUrl(song.audio_url),
    })) as Song[];
  },

  /**
   * Upload file to Supabase Storage
   * @param file File object from browser
   * @param folder Target folder (e.g., 'audio' or 'covers')
   */
  uploadFile: async (file: File, folder: "audio" | "covers") => {
    let uploadPayload = file;
    // Optimize music covers to lightweight WebP
    if (folder === "covers" && !file.type.startsWith("audio/")) {
      uploadPayload = await optimizeImage(file, { maxWidth: 800, maxHeight: 800 });
    }

    const fileExt = uploadPayload.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Note: Ensure bucket 'portfolio' exists in Supabase Dashboard
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, uploadPayload, {
        contentType: uploadPayload.type || undefined,
        upsert: true,
      });

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

  updateSong: async (
    id: string,
    song: Partial<CreateSongInput>,
    oldFiles?: { audio_url?: string; cover_url?: string }
  ) => {
    let oldAudio = oldFiles?.audio_url;
    let oldCover = oldFiles?.cover_url;

    if ((song.audio_url && !oldAudio) || (song.cover_url && !oldCover)) {
      const { data: existing } = await supabase
        .from("songs")
        .select("audio_url, cover_url")
        .eq("id", id)
        .maybeSingle();
      if (existing) {
        if (song.audio_url && !oldAudio && existing.audio_url !== song.audio_url) {
          oldAudio = existing.audio_url;
        }
        if (song.cover_url && !oldCover && existing.cover_url !== song.cover_url) {
          oldCover = existing.cover_url;
        }
      }
    }

    const { data, error } = await supabase
      .from("songs")
      .update(song)
      .eq("id", id)
      .select();

    if (error) throw error;

    // Clean up replaced files from storage after DB update succeeds
    const filesToClean = [
      song.audio_url && oldAudio && oldAudio !== song.audio_url ? oldAudio : null,
      song.cover_url && oldCover && oldCover !== song.cover_url ? oldCover : null,
    ].filter(Boolean) as string[];

    if (filesToClean.length > 0) {
      await deleteStorageFiles(filesToClean);
    }

    return data?.[0];
  },

  deleteSong: async (id: string, audioUrl?: string, coverUrl?: string) => {
    let targetAudioUrl = audioUrl;
    let targetCoverUrl = coverUrl;

    // If either URL was not passed by caller, query the database first
    if (!targetAudioUrl || !targetCoverUrl) {
      const { data: existing } = await supabase
        .from("songs")
        .select("audio_url, cover_url")
        .eq("id", id)
        .maybeSingle();

      if (existing) {
        if (!targetAudioUrl) targetAudioUrl = existing.audio_url;
        if (!targetCoverUrl) targetCoverUrl = existing.cover_url;
      }
    }

    // 1. Delete record from DB
    const { error: dbError } = await supabase
      .from("songs")
      .delete()
      .eq("id", id);
    if (dbError) throw dbError;

    // 2. Cleanup both audio and cover files from storage in one batch
    const filesToDelete = [targetAudioUrl, targetCoverUrl].filter(Boolean) as string[];
    if (filesToDelete.length > 0) {
      await deleteStorageFiles(filesToDelete);
    }

    return true;
  },

  deleteFileByUrl: async (url: string, _folder?: "audio" | "covers") => {
    await deleteStorageFile(url);
  },

  updateOrder: async (songs: Song[]) => {
    const { error } = await supabase
      .from("songs")
      .upsert(songs, { onConflict: "id" });
    
    if (error) throw error;
    return true;
  }
};
