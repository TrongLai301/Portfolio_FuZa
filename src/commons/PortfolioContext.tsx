import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { skillService, type Skill } from "../services/skillService";
import { musicService, type Song } from "../services/musicService";
import {
  socialLinkService,
  type SocialLink,
} from "../services/socialLinkService";
import { resolveStorageUrl } from "../lib/supabaseClient";
import {
  fetchHeroData,
  type HeroSettings,
  type TypewriterText,
} from "../services/heroService";
import {
  siteSettingsService,
  type SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "../services/siteSettingsService";
import { toast } from "sonner";

interface PortfolioContextType {
  skills: Skill[];
  songs: Song[];
  socialLinks: SocialLink[];
  heroSettings: HeroSettings | null;
  typewriterTexts: TypewriterText[];
  siteSettings: SiteSettings;
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  isVideoPlaying: boolean;
  toggleVideo: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [typewriterTexts, setTypewriterTexts] = useState<TypewriterText[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Apply CSS root variables whenever siteSettings changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      const getFirstColor = (val?: string) => {
        if (!val || typeof val !== "string") return "#ffffff";
        if (val.includes("gradient")) {
          const match = val.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/);
          return match ? match[0] : "#ffffff";
        }
        return val;
      };

      const root = document.documentElement;
      root.style.setProperty("--color-signature", siteSettings.header_logo_color || "#ffffff");
      root.style.setProperty("--color-signature-solid", getFirstColor(siteSettings.header_logo_color));
      root.style.setProperty("--color-menu-items", siteSettings.menu_text_color || "#bdc3c7");
      root.style.setProperty("--color-menu-active", siteSettings.menu_active_color || "#ffffff");
      root.style.setProperty("--color-menu-active-solid", getFirstColor(siteSettings.menu_active_color));
      root.style.setProperty("--color-title-primary", siteSettings.title_primary_color || "#ffffff");
      root.style.setProperty("--color-title-secondary", siteSettings.title_secondary_color || "#bdc3c7");
    }
  }, [siteSettings]);

  const toggleVideo = useCallback(() => setIsVideoPlaying((prev) => !prev), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi tất cả API song song để tối ưu tốc độ
      const [skillsData, songsData, socialLinksData, heroResult, siteSettingsData] =
        await Promise.all([
          skillService.getSkills(),
          musicService.getSongs(),
          socialLinkService.getAll(),
          fetchHeroData(),
          siteSettingsService.getSettings(),
        ]);

      setSkills(skillsData);
      setSiteSettings(siteSettingsData);
      const resolvedHero = heroResult.settings
        ? {
            ...heroResult.settings,
            video_bg_url: resolveStorageUrl(heroResult.settings.video_bg_url),
            orbit_image_url: resolveStorageUrl(
              heroResult.settings.orbit_image_url,
            ),
          }
        : null;

      setHeroSettings(resolvedHero);
      setTypewriterTexts(heroResult.typewriterTexts);
      // Rewrite storage URLs so mobile on LAN can access audio/images
      setSongs(
        songsData.map((song) => ({
          ...song,
          audio_url: resolveStorageUrl(song.audio_url),
          cover_url: resolveStorageUrl(song.cover_url),
        })),
      );
      setSocialLinks(socialLinksData.filter((link) => link.is_active));
    } catch (err: any) {
      console.error("Error fetching portfolio data:", err);
      const msg = err.message || "Failed to load dynamic content";
      setError(msg);
      toast.error("Portfolio System: " + msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSiteSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = await siteSettingsService.saveSettings(newSettings);
      setSiteSettings(updated);
      toast.success("Theme settings saved successfully!");
    } catch (err: any) {
      toast.error("Failed to save theme settings: " + err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PortfolioContext.Provider
      value={{
        skills,
        songs,
        socialLinks,
        heroSettings,
        typewriterTexts,
        siteSettings,
        loading,
        error,
        refreshAll: fetchData,
        updateSiteSettings,
        isVideoPlaying,
        toggleVideo,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
