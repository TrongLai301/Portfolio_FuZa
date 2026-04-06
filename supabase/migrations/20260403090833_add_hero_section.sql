-- === HỖ TRỢ HERO SECTION & TYPEWRITER TEXTS ===

-- 1. BẢNG CÀI ĐẶT HERO (HERO SETTINGS)
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_bg_url TEXT,
  orbit_image_url TEXT,
  -- Phần text trong <span>: Hello, I'm FuZa
  main_text_prefix TEXT DEFAULT 'Hello,',
  main_text_prefix_color TEXT DEFAULT '#fff',
  main_text_suffix TEXT DEFAULT 'I''m FuZa',
  main_text_suffix_color TEXT DEFAULT '#6366f1',
  orbit_animation_color TEXT DEFAULT '#6366f1',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG DANH SÁCH CHỮ CHẠY (TYPEWRITER TEXTS)
CREATE TABLE IF NOT EXISTS typewriter_texts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_id UUID REFERENCES hero_settings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_color TEXT DEFAULT '#6366f1',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TỰ ĐỘNG CẬP NHẬT THỜI GIAN (TRIGGER)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_hero_settings_updated_at') THEN
    CREATE TRIGGER update_hero_settings_updated_at BEFORE UPDATE ON hero_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_typewriter_texts_updated_at') THEN
    CREATE TRIGGER update_typewriter_texts_updated_at BEFORE UPDATE ON typewriter_texts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;

-- 4. BẬT RLS (ROW LEVEL SECURITY)
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE typewriter_texts ENABLE ROW LEVEL SECURITY;

-- 5. CHÍNH SÁCH BẢO MẬT (POLICIES)
-- Môi trường Supabase thường đã có chính sách global hoặc cần tạo riêng cho từng bảng mới

-- Cho phép xem công khai (Anon & Authenticated)
DROP POLICY IF EXISTS "Allow public read" ON hero_settings;
CREATE POLICY "Allow public read" ON hero_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON typewriter_texts;
CREATE POLICY "Allow public read" ON typewriter_texts FOR SELECT USING (true);

-- Toàn quyền cho người dùng đã đăng nhập (Admin)
DROP POLICY IF EXISTS "Allow authenticated full access" ON hero_settings;
CREATE POLICY "Allow authenticated full access" ON hero_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access" ON typewriter_texts;
CREATE POLICY "Allow authenticated full access" ON typewriter_texts FOR ALL TO authenticated USING (true) WITH CHECK (true);
