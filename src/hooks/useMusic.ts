import { useState, useCallback, useEffect } from "react";
import { musicService, type Song, type CreateSongInput } from "../services/musicService";
import { toast } from "sonner";

export interface SongSubmitInput extends Partial<CreateSongInput> {
  audio_file?: File | null;
  cover_file?: File | null;
  existing_audio_url?: string;
  existing_cover_url?: string;
}

export const useMusic = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await musicService.getSongs();
      setSongs(data);
      
      if (data.length > 0) {
        const max = Math.max(...data.map(s => s.display_order || 0));
        setNextOrder(max + 1);
      } else {
        setNextOrder(1);
      }
    } catch (error: any) {
      toast.error("Fetch songs failed: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSong = async (input: SongSubmitInput) => {
    setUploading(true);
    let uploadedAudioUrl = "";
    let uploadedCoverUrl = "";

    try {
      // 1. Validation
      if (!input.audio_file || !input.cover_file) {
        throw new Error("Missing required signal components (Audio or Banner)");
      }

      // 2. Upload Files
      uploadedAudioUrl = await musicService.uploadFile(input.audio_file, "audio");
      uploadedCoverUrl = await musicService.uploadFile(input.cover_file, "covers");

      // 3. Create Record
      const newSong: CreateSongInput = {
        title: input.title!,
        artist: input.artist!,
        audio_url: uploadedAudioUrl,
        cover_url: uploadedCoverUrl,
        display_order: input.display_order || 0
      };

      await musicService.createSong(newSong);
      toast.success("Song created!");
      await fetchSongs();
      return true;
    } catch (error: any) {
      // 4. ROLLBACK: Cleanup uploaded files if DB fails
      if (uploadedAudioUrl) await musicService.deleteFileByUrl(uploadedAudioUrl, "audio");
      if (uploadedCoverUrl) await musicService.deleteFileByUrl(uploadedCoverUrl, "covers");
      
      toast.error("Deployment failed: " + error.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const editSong = async (id: string, input: SongSubmitInput) => {
    setUploading(true);
    let uploadedAudioUrl = "";
    let uploadedCoverUrl = "";

    try {
      // 1. Upload new files if provided
      if (input.audio_file) {
        uploadedAudioUrl = await musicService.uploadFile(input.audio_file, "audio");
      }
      if (input.cover_file) {
        uploadedCoverUrl = await musicService.uploadFile(input.cover_file, "covers");
      }

      // 2. Prepare update data
      const updateData: Partial<CreateSongInput> = {
        title: input.title,
        artist: input.artist,
        display_order: input.display_order,
      };
      
      if (uploadedAudioUrl) updateData.audio_url = uploadedAudioUrl;
      if (uploadedCoverUrl) updateData.cover_url = uploadedCoverUrl;

      // 3. Update Record
      await musicService.updateSong(id, updateData);

      // 4. Cleanup old files (Optional)
      if (uploadedAudioUrl && input.existing_audio_url) {
        await musicService.deleteFileByUrl(input.existing_audio_url, "audio");
      }
      if (uploadedCoverUrl && input.existing_cover_url) {
        await musicService.deleteFileByUrl(input.existing_cover_url, "covers");
      }

      toast.success("Song updated!");
      await fetchSongs();
      return true;
    } catch (error: any) {
      // ROLLBACK NEW UPLOADS
      if (uploadedAudioUrl) await musicService.deleteFileByUrl(uploadedAudioUrl, "audio");
      if (uploadedCoverUrl) await musicService.deleteFileByUrl(uploadedCoverUrl, "covers");

      toast.error("Retune failed: " + error.message);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeSong = async (id: string, audioUrl: string, coverUrl: string) => {
    try {
      await musicService.deleteSong(id, audioUrl, coverUrl);
      toast.success("Song deleted.");
      await fetchSongs();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return {
    songs,
    loading,
    uploading,
    nextOrder,
    fetchSongs,
    saveSong,
    editSong,
    removeSong
  };
};
