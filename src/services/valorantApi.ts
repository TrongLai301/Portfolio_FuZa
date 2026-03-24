import { toast } from "sonner";

const BASE_URL = "https://api.henrikdev.xyz/valorant";

/**
 * Hàm sinh Headers cho các Request. 
 * Khuyến cáo: Bạn nên tạo một file `.env` ở thư mục gốc của dự án chứa biến `VITE_VALORANT_API_KEY=YOUR_KEY`
 * để Vite có thể lấy nó mà không bị lộ lúc push code.
 */
const getHeaders = () => {
  // Lấy key từ biến môi trường của Vite, nếu chưa có thì có thể thay cứng Key vào dòng string phía sau chữ '||'
  const apiKey = import.meta.env.VITE_VALORANT_API_KEY || "YOUR_API_KEY_HERE";
  return {
    "Authorization": apiKey,
    "Content-Type": "application/json"
  };
};

/**
 * Lấy thông tin tài khoản cơ bản: Cấp độ (Level), Ảnh thẻ hồ sơ (Card), ID định danh
 * @param name Tên ingame (VD: FuZa)
 * @param tag Tag Ingame (VD: Kyu)
 */
export const getValorantAccount = async (name: string, tag: string) => {
  try {
    const response = await fetch(`${BASE_URL}/v1/account/${name}/${tag}`, {
      method: "GET",
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Lỗi get Account: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; // API trả về payload bọc trong object "data"
  } catch {
    toast.error("Failed to load Valorant account info");
    return null;
  }
};

/**
 * Lấy thông tin mức Rank, điểm Rank (RR) và cả link Icon của Rank đó
 * @param name Tên ingame 
 * @param tag Tag Ingame 
 * @param region Vùng máy chủ, mặc định cho VN là "ap" (Asia Pacific)
 */
export const getValorantMMR = async (name: string, tag: string, region: string = "ap") => {
  try {
    const response = await fetch(`${BASE_URL}/v1/mmr/${region}/${name}/${tag}`, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Lỗi get MMR: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Chứa currenttierpatched, rr, images.large...
  } catch {
    toast.error("Failed to load Valorant MMR info");
    return null;
  }
};

/**
 * Lấy thông tin xếp hạng V2 (Chứa lịch sử Win/Loss từng mùa Act)
 */
export const getValorantMMRv2 = async (name: string, tag: string, region: string = "ap") => {
  try {
    const response = await fetch(`${BASE_URL}/v2/mmr/${region}/${name}/${tag}`, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Lỗi get MMR v2: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Chứa current_data và by_season để trích xuất Win/Loss
  } catch {
    toast.error("Failed to load Valorant MMR V2 info");
    return null;
  }
};
