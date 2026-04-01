export interface Anime {
  id: string;
  title: string;
  imageSrc: string;
  genres: string[];
  year: number;
  description: string;
}

export type Game = Anime;

export interface CelebratePhoto {
  id: string;
  imageSrc: string;
  date: string;
  caption?: string;
  description?: string;
}

export interface ValorantProfile {
  ign: string;
  playerCard: string;
  rankIcon: string;
  rankName: string;
  mainRole: string;
  level: number;
  stats: {
    headshot: string;
    winRate: string;
    wins: number;
    losses: number;
  };
  settings: {
    config: { label: string; value: string }[];
    graphics: {
      display: { label: string; value: string }[];
      performance: { label: string; value: string }[];
      quality: { label: string; value: string }[];
    };
  };
  gear: { name: string; value: string }[];
  agentsTier: {
    tier: string;
    color: string;
    agents: { id: string; name: string; img: string }[];
  }[];
}
