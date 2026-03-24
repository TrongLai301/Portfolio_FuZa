const BASE_URL = "https://api.lanyard.rest/v1";

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
}

export interface Activity {
  type: number;
  state: string;
  name: string;
  details?: string;
  application_id?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
}

export interface LanyardData {
  discord_user: DiscordUser;
  discord_status: "online" | "idle" | "dnd" | "offline";
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  };
  kv?: Record<string, string>;
}

export const getDiscordStatus = async (
  userId: string,
): Promise<LanyardData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching Discord status:", error);
    return null;
  }
};
