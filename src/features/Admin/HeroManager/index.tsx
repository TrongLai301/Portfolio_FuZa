import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { supabase, resolveStorageUrl } from "../../../lib/supabaseClient";
import { deleteStorageFile } from "../../../services/storageService";
import { toast } from "sonner";
import { optimizeImage } from "../../../utils/mediaOptimizer";
import HeroForm from "./HeroForm";

const HeroManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [typewriterTexts, setTypewriterTexts] = useState<any[]>([]);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const { data: heroData, error: heroError } = await supabase
        .from("hero_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (heroError) throw heroError;

      if (heroData) {
        setHeroId(heroData.id);
        setInitialValues({
          ...heroData,
          orbit_image_url: resolveStorageUrl(heroData.orbit_image_url),
          video_bg_url: resolveStorageUrl(heroData.video_bg_url),
        });

        const { data: twData, error: twError } = await supabase
          .from("typewriter_texts")
          .select("*")
          .eq("hero_id", heroData.id)
          .order("display_order", { ascending: true });

        if (twError) throw twError;
        setTypewriterTexts(twData || []);
      }
    } catch (error: any) {
      toast.error("Failed to load hero data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    let uploadPayload = file;
    // Optimize static images before uploading to hero
    if (file.type && file.type.startsWith("image/")) {
      uploadPayload = await optimizeImage(file, { maxWidth: 1200, maxHeight: 1200 });
    }

    const fileExt = uploadPayload.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `hero/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, uploadPayload, {
        contentType: uploadPayload.type || undefined,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveAll = async (values: any) => {
    setSaving(true);
    const { video_file, orbit_file, phrases, ...formValues } = values;

    let newlyUploadedVideo = "";
    let newlyUploadedOrbit = "";

    try {
      let videoUrl = initialValues?.video_bg_url;
      let orbitUrl = initialValues?.orbit_image_url;

      // 1. Upload files
      if (video_file) {
        toast.info("Uploading video background...");
        const newVideoUrl = await uploadFile(video_file, "backgrounds");
        videoUrl = newVideoUrl;
        newlyUploadedVideo = newVideoUrl;
      }
      if (orbit_file) {
        toast.info("Uploading orbit image...");
        const newOrbitUrl = await uploadFile(orbit_file, "orbits");
        orbitUrl = newOrbitUrl;
        newlyUploadedOrbit = newOrbitUrl;
      }

      // 2. Save Hero Settings
      const heroPayload = {
        ...formValues,
        video_bg_url: videoUrl,
        orbit_image_url: orbitUrl,
      };

      let currentHeroId = heroId;
      if (currentHeroId) {
        const { error: heroErr } = await supabase
          .from("hero_settings")
          .update(heroPayload)
          .eq("id", currentHeroId);
        if (heroErr) throw heroErr;
      } else {
        const { data, error: heroErr } = await supabase
          .from("hero_settings")
          .insert([heroPayload])
          .select()
          .single();
        if (heroErr) throw heroErr;
        currentHeroId = data.id;
        setHeroId(currentHeroId);
      }

      // 3. Sync Typewriter Phrases (delete and re-insert)
      const { error: delError } = await supabase
        .from("typewriter_texts")
        .delete()
        .eq("hero_id", currentHeroId);

      if (delError) throw delError;

      if (phrases && phrases.length > 0) {
        const phrasesToInsert = phrases.map((p: any, index: number) => ({
          hero_id: currentHeroId,
          content: p.content,
          content_color: p.content_color,
          display_order: index,
        }));

        const { error: insError } = await supabase
          .from("typewriter_texts")
          .insert(phrasesToInsert);

        if (insError) throw insError;
      }

      // 4. Clean up old files from storage only after DB update succeeds
      if (newlyUploadedVideo && initialValues?.video_bg_url) {
        await deleteStorageFile(initialValues.video_bg_url);
      }
      if (newlyUploadedOrbit && initialValues?.orbit_image_url) {
        await deleteStorageFile(initialValues.orbit_image_url);
      }

      toast.success("Synchronized successfully");
      await fetchHeroData();
    } catch (error: any) {
      // Rollback newly uploaded files on error to prevent storage bloat
      if (newlyUploadedVideo) {
        await deleteStorageFile(newlyUploadedVideo);
      }
      if (newlyUploadedOrbit) {
        await deleteStorageFile(newlyUploadedOrbit);
      }
      toast.error("Sync failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" description="Synchronizing systems..." />
      </div>
    );
  }

  return (
    <HeroForm
      initialValues={initialValues}
      typewriterTexts={typewriterTexts}
      onSaveAll={handleSaveAll}
      saving={saving}
    />
  );
};

export default HeroManager;
