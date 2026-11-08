-- ==============================================================================
-- 🎮 SUPABASE SQL EDITOR - BỘ DANH MỤC THỂ LOẠI ANIME & GAME CHO PORTFOLIO FUZA
-- ==============================================================================
-- Hướng dẫn:
-- 1. Mở Supabase Dashboard -> chọn Project của bạn -> chọn "SQL Editor".
-- 2. Dán toàn bộ mã SQL này vào và nhấn nút "Run" (hoặc phím tắt Ctrl + Enter).
-- 3. Toàn bộ các thể loại Anime & Game phổ biến sẽ được nhập vào bảng `categories`.
-- 4. Script sử dụng `ON CONFLICT (slug) DO NOTHING`, an toàn để chạy nhiều lần
--    mà không bị trùng lặp dữ liệu hay báo lỗi.
-- ==============================================================================

-- 1. ĐẢM BẢO ENUM VÀ BẢNG CATEGORIES ĐÃ ĐƯỢC KHỞI TẠO
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        CREATE TYPE media_type AS ENUM ('anime', 'game');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type media_type NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật RLS và cấp quyền đọc công khai
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON categories;
CREATE POLICY "Allow public read" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access" ON categories;
CREATE POLICY "Allow authenticated full access" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 2. NHẬP DANH SÁCH THỂ LOẠI ANIME (ANIME CHANNELS)
INSERT INTO categories (type, name, slug) VALUES
  ('anime', 'Action', 'anime-action'),
  ('anime', 'Adventure', 'anime-adventure'),
  ('anime', 'Romance', 'anime-romance'),
  ('anime', 'Comedy', 'anime-comedy'),
  ('anime', 'Drama', 'anime-drama'),
  ('anime', 'Fantasy', 'anime-fantasy'),
  ('anime', 'Sci-Fi', 'anime-sci-fi'),
  ('anime', 'Shounen', 'anime-shounen'),
  ('anime', 'Slice of Life', 'anime-slice-of-life'),
  ('anime', 'Isekai', 'anime-isekai'),
  ('anime', 'Supernatural', 'anime-supernatural'),
  ('anime', 'Psychological', 'anime-psychological'),
  ('anime', 'Mystery', 'anime-mystery'),
  ('anime', 'Horror', 'anime-horror'),
  ('anime', 'Music', 'anime-music'),
  ('anime', 'Mecha', 'anime-mecha'),
  ('anime', 'Sports', 'anime-sports'),
  ('anime', 'School', 'anime-school'),
  ('anime', 'Dark Fantasy', 'anime-dark-fantasy'),
  ('anime', 'Cyberpunk', 'anime-cyberpunk')
ON CONFLICT (slug) DO NOTHING;


-- 3. NHẬP DANH SÁCH THỂ LOẠI GAME (GAME FREQUENCIES)
INSERT INTO categories (type, name, slug) VALUES
  ('game', 'FPS / Shooter', 'game-fps-shooter'),
  ('game', 'Tactical Shooter', 'game-tactical-shooter'),
  ('game', 'RPG (Role-Playing)', 'game-rpg'),
  ('game', 'Action RPG', 'game-action-rpg'),
  ('game', 'Open World', 'game-open-world'),
  ('game', 'MOBA', 'game-moba'),
  ('game', 'Battle Royale', 'game-battle-royale'),
  ('game', 'Strategy / RTS', 'game-strategy-rts'),
  ('game', 'Survival', 'game-survival'),
  ('game', 'Adventure', 'game-adventure'),
  ('game', 'Horror', 'game-horror'),
  ('game', 'Gacha / Anime Game', 'game-gacha-anime-game'),
  ('game', 'Simulation', 'game-simulation'),
  ('game', 'Racing / Sports', 'game-racing-sports'),
  ('game', 'Fighting', 'game-fighting'),
  ('game', 'Platformer', 'game-platformer'),
  ('game', 'Souls-like', 'game-souls-like'),
  ('game', 'Co-op / Multiplayer', 'game-co-op-multiplayer'),
  ('game', 'Sandbox', 'game-sandbox'),
  ('game', 'Stealth', 'game-stealth')
ON CONFLICT (slug) DO NOTHING;


-- ==============================================================================
-- 4. KIỂM TRA KẾT QUẢ IMPORT
-- ==============================================================================
SELECT 
  type AS "Phân loại", 
  COUNT(*) AS "Số lượng thể loại"
FROM categories 
GROUP BY type;

