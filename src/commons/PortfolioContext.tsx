import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { skillService, type Skill } from "../services/skillService";
import { musicService, type Song } from "../services/musicService";
import { socialLinkService, type SocialLink } from "../services/socialLinkService";
import { resolveStorageUrl } from "../lib/supabaseClient";

interface PortfolioContextType {
  skills: Skill[];
  songs: Song[];
  socialLinks: SocialLink[];
  loading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi tất cả API song song để tối ưu tốc độ
      const [skillsData, songsData, socialLinksData] = await Promise.all([
        skillService.getSkills(),
        musicService.getSongs(),
        socialLinkService.getAll()
      ]);

      setSkills(skillsData);
      // Rewrite storage URLs so mobile on LAN can access audio/images
      setSongs(songsData.map(song => ({
        ...song,
        audio_url: resolveStorageUrl(song.audio_url),
        cover_url: resolveStorageUrl(song.cover_url),
      })));
      setSocialLinks(socialLinksData.filter(link => link.is_active));
    } catch (err: any) {
      console.error("Error fetching portfolio data:", err);
      setError(err.message || "Failed to load dynamic content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PortfolioContext.Provider value={{ 
      skills, 
      songs, 
      socialLinks, 
      loading, 
      error,
      refreshAll: fetchData 
    }}>
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
