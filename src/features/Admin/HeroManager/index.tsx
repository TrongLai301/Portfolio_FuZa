import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { supabase } from "../../../lib/supabaseClient";
import { toast } from "sonner";
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
        setInitialValues(heroData);

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
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `hero/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveAll = async (values: any) => {
    setSaving(true);
    const { video_file, orbit_file, phrases, ...formValues } = values;

    try {
      let videoUrl = initialValues?.video_bg_url;
      let orbitUrl = initialValues?.orbit_image_url;

      // 1. Upload files
      if (video_file) {
        toast.info("Uploading video background...");
        videoUrl = await uploadFile(video_file, "backgrounds");
      }
      if (orbit_file) {
        toast.info("Uploading orbit image...");
        orbitUrl = await uploadFile(orbit_file, "orbits");
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

      // 3. Sync Typewriter Phrases (Simplest approach: delete and re-insert)
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

      toast.success("Synchronized successfully");
      await fetchHeroData();
    } catch (error: any) {
      toast.error("Sync failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" tip="Synchronizing systems..." />
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
