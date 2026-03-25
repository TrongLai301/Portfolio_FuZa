import diamond2 from "../../assets/image/commons/diamond_Rank.webp";

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
    imageSrc:
      "https://m.media-amazon.com/images/I/7142BiB8n4L._AC_UF894,1000_QL80_.jpg",
    genres: ["Romance", "Drama", "Music"],
    year: 2014,
    description:
      "A piano prodigy who lost his ability to play after suffering a traumatic event in his childhood is forced back into the spotlight by an eccentric girl with a secret of her own.",
  },
  {
    id: "2",
    title: "Sword art online",
    imageSrc:
      "https://m.media-amazon.com/images/M/MV5BN2NhYzU2NDEtYzI1NS00MjgzLThjZGUtOTYxNGJkZjZmNDdjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genres: ["Action", "Adventure", "Romance", "Game"],
    year: 2012,
    description:
      "Sword Art Online is a futuristic VRMMORPG set in the 2020s, where players are trapped in a virtual world after the NerveGear system malfunctions. Created by Kayaba Akihiko, the game forces players to clear 100 floors of a deadly dungeon to escape. The story follows Kazuto 'Kirito' Kirigaya and Asuna Yuuki as they battle through perilous challenges, forge deep bonds, and confront both emotional and physical threats. Known for its intense narrative, emotional depth, and immersive world-building, the series blends action, romance, and philosophical themes about identity and reality in digital spaces.",
  },
  {
    id: "3",
    title: "Demon Slayer",
    imageSrc:
      "https://snworksceo.imgix.net/cds/40648bde-24b4-45e9-9d0f-24e78d1cd18b.sized-1000x1000.jpg?w=1000&dpr=2",
    genres: ["Action", "Dark Fantasy", "Historical"],
    year: 2019,
    description:
      "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
  },
  {
    id: "4",
    title: "Jujutsu Kaisen",
    imageSrc:
      "https://m.media-amazon.com/images/M/MV5BMjBlNTExMDAtMWZjZi00MDc5LWFkMjgtZDU0ZWQ5ODk3YWY5XkEyXkFqcGc@._V1_.jpg",
    genres: ["Action", "Supernatural", "Fantasy"],
    year: 2020,
    description:
      "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
  },
  {
    id: "5",
    title: "Assasination Classroom",
    imageSrc:
      "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/assassinationclassroom_visual_hq.jpg",
    genres: ["Action", "Shounen", "Comedy", "School"],
    year: 2012,
    description:
      "Assassination Classroom follows Class 3-E at Kunugigaoka Junior High School, where students are tasked with assassinating their teacher—a sentient, octopus-like being capable of incredible speed and power. Despite his menacing appearance and the threat he poses, the mysterious creature is kind and dedicated to teaching, fostering deep bonds with his students. The series blends action, sci-fi, and humor as the class grapples with moral dilemmas, personal growth, and the true nature of their enigmatic instructor. Its mix of suspense and heartfelt moments has made it a standout in shonen manga.",
  },
  {
    id: "6",
    title: "Hunter x Hunter",
    imageSrc:
      "https://external-preview.redd.it/hunter-x-hunter-10th-anniversary-visual-v0-dX60EfDq7QPTurQGni-XWj2AbEGjGDy2lcvw5Rkg1YU.jpg?auto=webp&s=1a341832c36838e50a34649a4975f28c466352f2",
    genres: ["Action", "Shounen", "Super Power", "Fantasy", "Adventure"],
    year: 1999,
    description:
      "Hunter x Hunter is a Japanese anime and manga series centered on Gon Freecss, a young boy who discovers his father is a legendary Hunter. Inspired by this revelation, Gon embarks on a journey to become a Hunter himself—elite individuals licensed to pursue rare treasures, mythical creatures, or even people. The story blends adventure, mystery, and personal growth as Gon forms bonds with friends and faces intense challenges. The world of Hunters is defined by unique abilities, rigorous exams, and a hierarchy of skill, where one’s strength and determination determine their place. With its deep lore and character-driven narrative, the series explores themes of identity, ambition, and the meaning of power.",
  },
];

export type Game = Anime;

export const mockGames: Game[] = [
  {
    id: "g1",
    title: "Valorant",
    imageSrc:
      "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/valo2.png",
    genres: ["FPS", "Tactical", "Hero Shooter"],
    year: 2020,
    description:
      "A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.",
  },
  {
    id: "g2",
    title: "League of Legends",
    imageSrc:
      "https://cdn-media.sforum.vn/storage/app/media/phuonganh/ke-hoach-cai-to-lmht-giua-mua-giai-2026.jpg",
    genres: ["MOBA", "Strategy", "Competitive"],
    year: 2009,
    description:
      "A team-based strategy game where two teams of five powerful champions face off to destroy the other's base.",
  },
  {
    id: "g3",
    title: "Ori and the Will of the Wisps",
    imageSrc:
      "https://store-images.s-microsoft.com/image/apps.18799.14047496556148589.9fda5cef-7995-4dbb-a626-66d2ab3feb4f.1e167626-8b7d-47b4-9fe5-d06a43ac6677",
    genres: ["Platformer", "Metroidvania", "Adventure"],
    year: 2020,
    description:
      "Embark on an all-new adventure in a vast, exotic world where you'll encounter towering enemies and challenging puzzles.",
  },
  {
    id: "g4",
    title: "R.E.P.O",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqxjpRUcz52NNZazOajiFBptlOsDOYffWM9Q&s",
    genres: ["Horror", "Survival", "Co-op"],
    year: 2025,
    description:
      "A bodycam-style horror game where you must collect and return items while surviving terrifying entities.",
  },
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
  playerCard:
    "https://media.valorant-api.com/playercards/33c1f011-4eca-841c-a3a4-14b52fe4ef85/displayicon.png",
  rankIcon: diamond2,
  rankName: "Diamond 2",
  mainRole: "Flex / Controller Main",
  level: 302,
  stats: {
    headshot: "25.4%",
    winRate: "52.8%",
    wins: 124,
    losses: 110,
  },
  settings: {
    config: [
      { label: "DPI", value: VALORANT_DPI.toString() },
      { label: "Sensitivity", value: VALORANT_SENS.toString() },
      { label: "eDPI", value: (VALORANT_DPI * VALORANT_SENS).toString() },
      { label: "Polling Rate", value: "1000 Hz" },
      { label: "Resolution", value: "1920x1080 (16:9)" },
      { label: "Crosshair", value: "Cyan, 1-4-2-2" },
    ],
    graphics: {
      display: [
        { label: "Resolution", value: "1920x1080 (16:9)" },
        { label: "Display Mode", value: "Fullscreen" },
        { label: "Aspect Ratio", value: "Letterbox" },
        { label: "Aspect Ratio Method", value: "Fill" },
        { label: "Enemy Highlight Color", value: "Yellow (Deuteranopia)" },
      ],
      performance: [
        { label: "Multithreaded Rendering", value: "On" },
        { label: "Material Quality", value: "Low" },
        { label: "Texture Quality", value: "Low" },
        { label: "Detail Quality", value: "Low" },
        { label: "UI Quality", value: "Low" },
        { label: "Vignette", value: "Off" },
        { label: "VSync", value: "Off" },
        { label: "NVIDIA Reflex Low Latency", value: "On + Boost" },
      ],
      quality: [
        { label: "Anti-Aliasing", value: "MSAA 4x" },
        { label: "Anisotropic Filtering", value: "4x" },
        { label: "Improve Clarity", value: "Off" },
        { label: "Experimental Sharpening", value: "Off" },
        { label: "Bloom", value: "Off" },
        { label: "Distortion", value: "Off" },
        { label: "Cast Shadows", value: "Off" },
      ],
    },
  },
  gear: [
    { name: "Mouse", value: "Dareu A950" },
    { name: "Keyboard", value: "HE MADLIONS FIRE68" },
    { name: "Headset", value: "KZ Castor" },
    { name: "Mousepad", value: "Spacepad Hana" },
    { name: "Monitor", value: "Gaming ASUS TUF VG249QE5A 180HZ" },
  ],
  agentsTier: [
    {
      tier: "S",
      color: "bg-[#536976]",
      agents: [
        {
          id: "jett",
          name: "Jett",
          img: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png",
        },
        {
          id: "Miks",
          name: "Miks",
          img: "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/displayicon.png",
        },
        {
          id: "Sage",
          name: "Sage",
          img: "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png",
        },
      ],
    },
  ],
};
import okhi07122025 from "../../assets/image/celebrates/okhi07122025.jpeg";
import zt29072025 from "../../assets/image/celebrates/zt29072025.jpg";
import okhi02052025 from "../../assets/image/celebrates/okhi02052025.jpg";
import hagiang30012024 from "../../assets/image/celebrates/hagiangdot1_30012024.jpg";
import okhi06072024 from "../../assets/image/celebrates/okhi06072024.png";
import sn02032023 from "../../assets/image/celebrates/SN02032023.jpg";
import chilon17052022 from "../../assets/image/celebrates/Hoichilon17052022.jpg";
import hoguom23122022 from "../../assets/image/celebrates/hoguom23122022.jpg";
import anhLop04072022 from "../../assets/image/celebrates/anhLop04072022.jpg";
import sapa11072022 from "../../assets/image/celebrates/sapa11072022.jpg";
import refuntromxoai16052022 from "../../assets/image/celebrates/refuntromxoai16052022.jpg";
import tamdao17022024 from "../../assets/image/celebrates/tamdao17022024.jpg";
import hagiang24112025 from "../../assets/image/celebrates/hagiang24112025.jpeg";
import thachthat27122025 from "../../assets/image/celebrates/thachThat27122025.jpg";
import photobooth26122025 from "../../assets/image/celebrates/photobooth26122025.jpg";
import catba02092025 from "../../assets/image/celebrates/catba02092025.jpg";
import tronnhadisapa30042022 from "../../assets/image/celebrates/tronnhadisapa30042022.jpg";

export interface CelebratePhoto {
  id: string;
  imageSrc: string;
  date: string;
  caption?: string;
  description?: string;
}

export const mockCelebrations: CelebratePhoto[] = [
  {
    id: "c1",
    imageSrc: thachthat27122025,
    date: "27-11-2025",
    caption: "Nghỉ dưỡng ở Thạch Thất",
    description: "Một chuyến đi thư giãn tuyệt vời cùng bạn bè tại khu nghỉ dưỡng Thạch Thất. Không khí trong lành và những phút giây giải trí không thể nào quên.",
  },
  {
    id: "c2",
    imageSrc: photobooth26122025,
    date: "26-12-2025",
    caption: "Đánh lẻ photobooth",
    description: "Lưu giữ những khoảnh khắc đẹp nhất qua những khung hình photobook chất lượng. Mỗi trang sách là một câu chuyện cảm xúc.",
  },
  {
    id: "c3",
    imageSrc: okhi07122025,
    date: "07-12-2025",
    caption: "Ổ khỉ meeting",
    description: "Buổi họp mặt cuối năm của biệt đội Ổ Khỉ. Rất nhiều tiếng cười và những kế hoạch mới cho năm sau.",
  },
  {
    id: "c4",
    imageSrc: hagiang24112025,
    date: "24-11-2025",
    caption: "Hà giang đợt 2",
    description: "Trải nghiệm cung đường Hà Giang hùng vĩ lần thứ 2. Vẫn là những cao nguyên đá và những nụ cười trẻ thơ làm say đắm lòng người.",
  },
  {
    id: "c5",
    imageSrc: catba02092025,
    date: "02-09-2025",
    caption: "Đánh lẻ cát bà",
    description: "Chuyến đi biển Cát Bà ngẫu hứng. Tận hưởng hương vị biển cả và sự tĩnh lặng của vịnh Lan Hạ.",
  },
  {
    id: "c6",
    imageSrc: zt29072025,
    date: "29-07-2025",
    caption: "ZT và ninh bình của cô ấy",
    description: "Khám phá vẻ đẹp Tràng An và Hang Múa. Một hành trình đầy kỷ niệm cùng những người thân yêu.",
  },
  {
    id: "c7",
    imageSrc: okhi02052025,
    date: "02-05-2025",
    caption: "Ổ khỉ meeting",
    description: "Meeting ngẫu hứng giữa cái nắng hè. Câu chuyện vẫn nối dài không dứt.",
  },
  {
    id: "c8",
    imageSrc: okhi06072024,
    date: "06-07-2024",
    caption: "Gen1 ổ khỉ",
    description: "Những thành viên đầu tiên đặt nền móng cho Ổ Khỉ. Giai đoạn khó khăn nhưng đầy nhiệt huyết.",
  },
  {
    id: "c9",
    imageSrc: tamdao17022024,
    date: "17-02-2024",
    caption: "Lần đầu gặp ZT",
    description: "Khoảnh khắc quan trọng đánh dấu lần đầu tiên gặp gỡ ZT tại Tam Đảo trong sương mù.",
  },
  {
    id: "c10",
    imageSrc: hagiang30012024,
    date: "30-01-2024",
    caption: "Hà giang đợt 1",
    description: "Lần đầu chinh phục Mã Pì Lèng và cảm nhận cái lạnh của cực Bắc Tổ quốc.",
  },
  {
    id: "c11",
    imageSrc: sn02032023,
    date: "02-03-2023",
    caption: "Sinh nhật đầu tiên ở Hà nội",
    description: "Cảm giác đón sinh nhật xa nhà lần đầu tiên, ấm áp trong vòng tay bạn bè mới.",
  },
  {
    id: "c12",
    imageSrc: hoguom23122022,
    date: "23-12-2022",
    caption: "Trại thương điên meeting",
    description: "Buổi tối đi dạo Hồ Gươm, chia sẻ những câu chuyện điên rồ nhất của tuổi trẻ.",
  },
  {
    id: "c13",
    imageSrc: chilon17052022,
    date: "17-05-2022",
    caption: "Anh xem chỉ lớn, nói là không làm",
    description: "Câu chuyện vui về những lời hứa 'bay bổng' và thực tế hài hước của đám bạn thân.",
  },
  {
    id: "c14",
    imageSrc: anhLop04072022,
    date: "04-07-2022",
    caption: "Ảnh lớp của ae tôi",
    description: "Kỷ niệm ngày bế giảng, chia tay mái trường với bao hoài bão.",
  },
  {
    id: "c15",
    imageSrc: sapa11072022,
    date: "11-07-2022",
    caption: "Sapa ngày không em",
    description: "Dạo quanh thị trấn mờ sương, tận hưởng cảm giác một mình bình yên.",
  },
  {
    id: "c16",
    imageSrc: refuntromxoai16052022,
    date: "16-05-2022",
    caption: "Trộm xoài cũng vui",
    description: "Chuyện nghịch ngợm thời sinh viên, những tiếng cười sảng khoái dưới gốc xoài.",
  },
  {
    id: "c17",
    imageSrc: tronnhadisapa30042022,
    date: "30-04-2022",
    caption: "Trốn nhà đi sapa",
    description: "Quyết định táo bạo nhất năm, bỏ sau lưng mọi lo âu để tìm đến Fansipan.",
  },
];
