import diamond2 from "../../assets/image/Diamond_Rank.webp";

export interface Anime {
  id: string;
  title: string;
  imageSrc: string;
  genres: string[];
  year: number;
  description: string;
}

export const mockAnimes: Anime[] = [
  {
    id: "1",
    title: "Your Lie in April",
    imageSrc: "https://m.media-amazon.com/images/I/7142BiB8n4L._AC_UF894,1000_QL80_.jpg",
    genres: ["Romance", "Drama", "Music"],
    year: 2014,
    description: "A piano prodigy who lost his ability to play after suffering a traumatic event in his childhood is forced back into the spotlight by an eccentric girl with a secret of her own."
  },
  {
    id: "2",
    title: "Attack on Titan",
    imageSrc: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genres: ["Action", "Dark Fantasy", "Drama"],
    year: 2013,
    description: "After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction."
  },
  {
    id: "3",
    title: "Demon Slayer",
    imageSrc: "https://snworksceo.imgix.net/cds/40648bde-24b4-45e9-9d0f-24e78d1cd18b.sized-1000x1000.jpg?w=1000&dpr=2",
    genres: ["Action", "Dark Fantasy", "Historical"],
    year: 2019,
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister."
  },
  {
    id: "4",
    title: "Jujutsu Kaisen",
    imageSrc: "https://m.media-amazon.com/images/M/MV5BMjBlNTExMDAtMWZjZi00MDc5LWFkMjgtZDU0ZWQ5ODk3YWY5XkEyXkFqcGc@._V1_.jpg",
    genres: ["Action", "Supernatural", "Fantasy"],
    year: 2020,
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself."
  },
  {
    id: "5",
    title: "Steins;Gate",
    imageSrc: "https://m.media-amazon.com/images/M/MV5BMjUxMzE4ZDctODNjMS00MzIwLThjNDktODkwYjc5YWU0MDc0XkEyXkFqcGdeQXVyNjc3OTE4Nzk@._V1_FMjpg_UX1000_.jpg",
    genres: ["Sci-Fi", "Thriller", "Psychological"],
    year: 2011,
    description: "After discovering time travel, a university student and his colleagues must use their knowledge of it to stop an evil organization and their diabolical plans."
  }
];

export type Game = Anime;

export const mockGames: Game[] = [
  {
    id: "g1",
    title: "Valorant",
    imageSrc: "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/valo2.png",
    genres: ["FPS", "Tactical", "Hero Shooter"],
    year: 2020,
    description: "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities."
  },
  {
    id: "g2",
    title: "League of Legends",
    imageSrc: "https://cdn-media.sforum.vn/storage/app/media/phuonganh/ke-hoach-cai-to-lmht-giua-mua-giai-2026.jpg",
    genres: ["MOBA", "Strategy", "Competitive"],
    year: 2009,
    description: "A team-based strategy game where two teams of five powerful champions face off to destroy the other's base."
  },
  {
    id: "g3",
    title: "Ori and the Will of the Wisps",
    imageSrc: "https://store-images.s-microsoft.com/image/apps.18799.14047496556148589.9fda5cef-7995-4dbb-a626-66d2ab3feb4f.1e167626-8b7d-47b4-9fe5-d06a43ac6677",
    genres: ["Platformer", "Metroidvania", "Adventure"],
    year: 2020,
    description: "Embark on an all-new adventure in a vast, exotic world where you'll encounter towering enemies and challenging puzzles."
  },
  {
    id: "g4",
    title: "R.E.P.O",
    imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqxjpRUcz52NNZazOajiFBptlOsDOYffWM9Q&s",
    genres: ["Horror", "Survival", "Co-op"],
    year: 2024,
    description: "A bodycam-style horror game where you must collect and return items while surviving terrifying entities."
  }
];
 
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

const VALORANT_DPI = 1600;
const VALORANT_SENS = 0.16;

export const mockValorantProfile: ValorantProfile = {
  ign: "FuZa#Kyu",
  playerCard: "https://media.valorant-api.com/playercards/33c1f011-4eca-841c-a3a4-14b52fe4ef85/displayicon.png",
  rankIcon: diamond2,
  rankName: "Diamond 2",
  mainRole: "Flex / Controller Main",
  level: 302,
  stats: {
    headshot: "25.4%",
    winRate: "52.8%",
    wins: 124,
    losses: 110
  },
  settings: {
    config: [
      { label: "DPI", value: VALORANT_DPI.toString() },
      { label: "Sensitivity", value: VALORANT_SENS.toString() },
      { label: "eDPI", value: (VALORANT_DPI * VALORANT_SENS).toString() },
      { label: "Polling Rate", value: "1000 Hz" },
      { label: "Resolution", value: "1920x1080 (16:9)" },
      { label: "Crosshair", value: "Cyan, 1-4-2-2" }
    ],
    graphics: {
      display: [
        { label: "Resolution", value: "1920x1080 (16:9)" },
        { label: "Display Mode", value: "Fullscreen" },
        { label: "Aspect Ratio", value: "Letterbox" },
        { label: "Aspect Ratio Method", value: "Fill" },
        { label: "Enemy Highlight Color", value: "Yellow (Deuteranopia)" }
      ],
      performance: [
        { label: "Multithreaded Rendering", value: "On" },
        { label: "Material Quality", value: "Low" },
        { label: "Texture Quality", value: "Low" },
        { label: "Detail Quality", value: "Low" },
        { label: "UI Quality", value: "Low" },
        { label: "Vignette", value: "Off" },
        { label: "VSync", value: "Off" },
        { label: "NVIDIA Reflex Low Latency", value: "On + Boost" }
      ],
      quality: [
        { label: "Anti-Aliasing", value: "MSAA 4x" },
        { label: "Anisotropic Filtering", value: "4x" },
        { label: "Improve Clarity", value: "Off" },
        { label: "Experimental Sharpening", value: "Off" },
        { label: "Bloom", value: "Off" },
        { label: "Distortion", value: "Off" },
        { label: "Cast Shadows", value: "Off" }
      ]
    }
  },
  gear: [
    { name: "Mouse", value: "Dareu A950" },
    { name: "Keyboard", value: "HE MADLIONS FIRE68" },
    { name: "Headset", value: "KZ Castor" },
    { name: "Mousepad", value: "Spacepad Hana" },
    { name: "Monitor", value: "Gaming ASUS TUF VG249QE5A 180HZ" }
  ],
  agentsTier: [
    {
      tier: "S", color: "bg-[#536976]", agents: [
        { id: "omen", name: "Omen", img: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png" },
        { id: "Miks", name: "Miks", img: "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/displayicon.png" },
        { id: "jett", name: "Jett", img: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png" }
      ]
    }
  ]
};
