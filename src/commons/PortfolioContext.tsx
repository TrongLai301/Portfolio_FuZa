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
import { toast } from "sonner";

interface PortfolioContextType {
  skills: Skill[];
  songs: Song[];
  socialLinks: SocialLink[];
  heroSettings: HeroSettings | null;
  typewriterTexts: TypewriterText[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const toggleVideo = useCallback(() => setIsVideoPlaying((prev) => !prev), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi tất cả API song song để tối ưu tốc độ
      const [skillsData, songsData, socialLinksData, heroResult] =
        await Promise.all([
          skillService.getSkills(),
          musicService.getSongs(),
          socialLinkService.getAll(),
          fetchHeroData(),
        ]);

      setSkills(skillsData);
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
        loading,
        error,
        refreshAll: fetchData,
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
