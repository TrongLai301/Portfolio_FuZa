-- === KHỞI TẠO TOÀN BỘ DATABASE PORTFOLIO FUZA ===

-- 0. KHỞI TẠO KIỂU DỮ LIỆU ENUM (ENUM TYPES)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        CREATE TYPE media_type AS ENUM ('anime', 'game');
    END IF;
END $$;

-- 1. BẢNG KỸ NĂNG (SKILLS)
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT,
  color_code VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG NHẠC (SONGS)
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HỆ THỐNG PHÂN LOẠI (CATEGORIES / GENRES)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type media_type NOT NULL, -- Enum 'anime' hoặc 'game'
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NỘI DUNG MEDIA (ANIME & GAMES)
CREATE TABLE IF NOT EXISTS medias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type media_type NOT NULL, -- Enum 'anime' hoặc 'game'
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  year INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG TRUNG GIAN (N-N) GIỮA MEDIA VÀ CATEGORY
CREATE TABLE IF NOT EXISTS media_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES medias(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ẢNH KỶ NIỆM (CELEBRATIONS)
CREATE TABLE IF NOT EXISTS celebrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  date DATE NOT NULL,
  caption TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VALORANT DATA
-- Bảng Profile Chính
CREATE TABLE IF NOT EXISTS valorant_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  region VARCHAR(10) DEFAULT 'ap',
  main_role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Settings (1-1)
CREATE TABLE IF NOT EXISTS valorant_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID UNIQUE REFERENCES valorant_profiles(id) ON DELETE CASCADE,
  dpi INTEGER,
  sensitivity FLOAT,
  polling_rate VARCHAR(20),
  crosshair_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Graphics (1-1)
CREATE TABLE IF NOT EXISTS valorant_graphics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID UNIQUE REFERENCES valorant_profiles(id) ON DELETE CASCADE,
  -- DISPLAY
  display_mode TEXT DEFAULT 'Fullscreen',
  resolution TEXT DEFAULT '1920x1080 (16:9)',
  aspect_ratio TEXT DEFAULT 'Letterbox',
  aspect_ratio_method TEXT DEFAULT 'Fill',
  enemy_highlight_color TEXT DEFAULT 'Yellow (Deuteranopia)',
  -- PERFORMANCE
  multithreaded_rendering TEXT DEFAULT 'On',
  material_quality TEXT DEFAULT 'Medium',
  texture_quality TEXT DEFAULT 'Medium',
  detail_quality TEXT DEFAULT 'Medium',
  ui_quality TEXT DEFAULT 'Medium',
  vignette TEXT DEFAULT 'Off',
  vsync TEXT DEFAULT 'Off',
  nvidia_reflex_low_latency TEXT DEFAULT 'On + Boost',
  -- QUALITY
  anti_aliasing TEXT DEFAULT 'MSAA 4x',
  anisotropic_filtering TEXT DEFAULT '4x',
  improve_clarity TEXT DEFAULT 'Off',
  experimental_sharpening TEXT DEFAULT 'Off',
  bloom TEXT DEFAULT 'Off',
  distortion TEXT DEFAULT 'Off',
  cast_shadows TEXT DEFAULT 'Off',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Gear (1-1)
CREATE TABLE IF NOT EXISTS valorant_gears (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID UNIQUE REFERENCES valorant_profiles(id) ON DELETE CASCADE,
  mouse TEXT,
  keyboard TEXT,
  headset TEXT,
  mousepad TEXT,
  monitor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Most Played Agents (1-N)
CREATE TABLE IF NOT EXISTS valorant_most_played_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES valorant_profiles(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  agent_image TEXT,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TỰ ĐỘNG CẬP NHẬT THỜI GIAN (TRIGGER) ===
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Áp dụng trigger cho mọi bảng
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_skills_updated_at') THEN
    CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_songs_updated_at') THEN
    CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at') THEN
    CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_medias_updated_at') THEN
    CREATE TRIGGER update_medias_updated_at BEFORE UPDATE ON medias FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_celebrations_updated_at') THEN
    CREATE TRIGGER update_celebrations_updated_at BEFORE UPDATE ON celebrations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_v_profiles_updated_at') THEN
    CREATE TRIGGER update_v_profiles_updated_at BEFORE UPDATE ON valorant_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_v_settings_updated_at') THEN
    CREATE TRIGGER update_v_settings_updated_at BEFORE UPDATE ON valorant_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_v_graphics_updated_at') THEN
    CREATE TRIGGER update_v_graphics_updated_at BEFORE UPDATE ON valorant_graphics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_v_gears_updated_at') THEN
    CREATE TRIGGER update_v_gears_updated_at BEFORE UPDATE ON valorant_gears FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_v_agents_updated_at') THEN
    CREATE TRIGGER update_v_agents_updated_at BEFORE UPDATE ON valorant_most_played_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;
