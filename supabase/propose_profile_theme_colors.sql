-- ==============================================================================
-- 🎨 SUPABASE SQL EDITOR - BỘ ĐỀ XUẤT PHỐI MÀU GIAO DIỆN PROFILE FUZA
-- ==============================================================================
-- Hướng dẫn: 
-- 1. Vào Supabase Dashboard -> chọn Project của bạn -> chọn "SQL Editor".
-- 2. Dán toàn bộ nội dung script này vào và bấm "Run" (hoặc Ctrl + Enter).
-- 3. Mặc định Script đang bật [PRESET 1: COSMIC STARLIGHT & CYAN NEBULA] 
--    (Phối màu cực kỳ ăn khớp với Video Anime dạ vũ, xóa sạch vệt đỏ chói và chữ đen).
-- 4. Nếu muốn đổi sang Preset khác (Cyber Synthwave hoặc Emerald Mint), chỉ cần 
--    bỏ comment block tương ứng ở cuối file.
-- ==============================================================================

-- ==============================================================================
-- [PRESET 1] 🌌 COSMIC STARLIGHT & CYAN NEBULA (Khuyên Dùng Nhất Cho FuZa)
-- ==============================================================================
-- • Halo & Orbit: Xanh Băng Băng Vũ Trụ (#38BDF8) - Hòa quyện tuyệt đối với sao trời
-- • Tiêu đề (About Me, Skills, Contact): Trắng tinh khôi + Gradient Tinh Vân Dạ Quang (#38BDF8 -> #A855F7)
-- • Chữ FuZa: Gradient 3 tầng vũ trụ (#38BDF8 -> #818CF8 -> #C084FC)
-- • Music Player & Sóng nhạc: Phát sáng Cyan Ice thanh thoát, sang trọng
-- ==============================================================================

-- 1. CẬP NHẬT / KHỞI TẠO SITE_SETTINGS (Header Logo, Navbar & Tiêu đề các Section)
DO $$
DECLARE
  v_site_id UUID;
BEGIN
  SELECT id INTO v_site_id FROM site_settings LIMIT 1;
  
  IF v_site_id IS NULL THEN
    INSERT INTO site_settings (
      header_logo_text,
      header_logo_color,
      menu_text_color,
      menu_active_color,
      title_primary_color,
      title_secondary_color
    ) VALUES (
      'FuZa''s profile',
      'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
      '#94a3b8',
      'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
      '#ffffff',
      'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)'
    );
  ELSE
    UPDATE site_settings
    SET
      header_logo_text = 'FuZa''s profile',
      -- Logo góc trái sáng trắng phớt ánh xanh neon
      header_logo_color = 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
      -- Chữ Menu bình thường: Màu bạc khói rõ nét trên nền tối (#94A3B8)
      menu_text_color = '#94a3b8',
      -- Chữ Menu khi chọn/hover: Gradient Cyan sang Lam Tím rực rỡ
      menu_active_color = 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
      -- Phần đầu tiêu đề (About / My / Contact): Trắng sáng
      title_primary_color = '#ffffff',
      -- Phần đuôi tiêu đề (Me / Skills / Celebrates): Gradient Cyan tím siêu nịnh mắt, không còn bị đen xì!
      title_secondary_color = 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
      updated_at = NOW()
    WHERE id = v_site_id;
  END IF;
END $$;


-- 2. CẬP NHẬT / KHỞI TẠO HERO_SETTINGS & DANH SÁCH CHỮ CHẠY TYPEWRITER
DO $$
DECLARE
  v_hero_id UUID;
BEGIN
  SELECT id INTO v_hero_id FROM hero_settings LIMIT 1;
  
  IF v_hero_id IS NULL THEN
    INSERT INTO hero_settings (
      main_text_prefix,
      main_text_prefix_color,
      main_text_suffix,
      main_text_suffix_color,
      orbit_animation_color,
      description
    ) VALUES (
      'Hello,',
      '#ffffff',
      'I''m FuZa',
      'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
      '#38bdf8', -- Đổi vòng tròn đỏ chói sang màu Cyan Vũ Trụ
      'A passionate developer who loves building modern and responsive web applications using React, Java, and JavaScript.'
    ) RETURNING id INTO v_hero_id;
  ELSE
    UPDATE hero_settings
    SET
      main_text_prefix = 'Hello,',
      main_text_prefix_color = '#ffffff',
      main_text_suffix = 'I''m FuZa',
      -- Tên FuZa chuyển gradient 3 màu mềm mại: Cyan -> Lam Tím -> Tím Lavender
      main_text_suffix_color = 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
      -- Vòng Orbit + Aura phát sáng Avatar + Music Player đồng bộ màu Cyan (#38bdf8)
      orbit_animation_color = '#38bdf8',
      updated_at = NOW()
    WHERE id = v_hero_id;
  END IF;

  -- Xóa và cập nhật lại danh sách Typewriter Texts với màu sắc sinh động, phong phú
  DELETE FROM typewriter_texts WHERE hero_id = v_hero_id;

  INSERT INTO typewriter_texts (hero_id, content, content_color, display_order) VALUES
    (v_hero_id, 'Software & Web Developer', '#38bdf8', 0),
    (v_hero_id, 'Full-stack Enthusiast', '#818cf8', 1),
    (v_hero_id, 'Anime & Starry Night Lover ❄️', '#c084fc', 2),
    (v_hero_id, 'Valorant Radiant Aimer 🎯', '#f43f5e', 3);
END $$;

-- ==============================================================================
-- THÔNG BÁO HOÀN TẤT
-- ==============================================================================
SELECT '✅ Đã áp dụng thành công bộ màu Cosmic Starlight & Cyan Nebula cho Profile FuZa!' AS result;


/* 
-- ==============================================================================
-- 🎁 CÁC PRESET DỰ PHÒNG (NẾU MUỐN ĐỔI PHONG CÁCH TRONG TƯƠNG LAI)
-- ==============================================================================

--- >>> PRESET 2: CYBERPUNK SYNTHWAVE (Hồng Neon & Tím Dạ Quang Cá Tính) <<< ---
DO $$
DECLARE
  v_site_id UUID;
  v_hero_id UUID;
BEGIN
  SELECT id INTO v_site_id FROM site_settings LIMIT 1;
  SELECT id INTO v_hero_id FROM hero_settings LIMIT 1;

  IF v_site_id IS NOT NULL THEN
    UPDATE site_settings SET
      header_logo_color = 'linear-gradient(135deg, #ffffff 0%, #ec4899 100%)',
      menu_text_color = '#94a3b8',
      menu_active_color = 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)',
      title_primary_color = '#ffffff',
      title_secondary_color = 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
      updated_at = NOW()
    WHERE id = v_site_id;
  END IF;

  IF v_hero_id IS NOT NULL THEN
    UPDATE hero_settings SET
      main_text_prefix_color = '#ffffff',
      main_text_suffix_color = 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%)',
      orbit_animation_color = '#ec4899',
      updated_at = NOW()
    WHERE id = v_hero_id;

    DELETE FROM typewriter_texts WHERE hero_id = v_hero_id;
    INSERT INTO typewriter_texts (hero_id, content, content_color, display_order) VALUES
      (v_hero_id, 'Cyberpunk Tech Architect', '#ec4899', 0),
      (v_hero_id, 'Full-stack Engineer', '#a855f7', 1),
      (v_hero_id, 'Night City Wanderer 🌆', '#06b6d4', 2),
      (v_hero_id, 'Precision Headshot Hunter 🎯', '#f43f5e', 3);
  END IF;
END $$;


--- >>> PRESET 3: EMERALD AURORA (Ngọc Lục Bảo & Băng Tuyết Tươi Mát) <<< ---
DO $$
DECLARE
  v_site_id UUID;
  v_hero_id UUID;
BEGIN
  SELECT id INTO v_site_id FROM site_settings LIMIT 1;
  SELECT id INTO v_hero_id FROM hero_settings LIMIT 1;

  IF v_site_id IS NOT NULL THEN
    UPDATE site_settings SET
      header_logo_color = 'linear-gradient(135deg, #ffffff 0%, #10b981 100%)',
      menu_text_color = '#94a3b8',
      menu_active_color = 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
      title_primary_color = '#ffffff',
      title_secondary_color = 'linear-gradient(90deg, #34d399 0%, #38bdf8 100%)',
      updated_at = NOW()
    WHERE id = v_site_id;
  END IF;

  IF v_hero_id IS NOT NULL THEN
    UPDATE hero_settings SET
      main_text_prefix_color = '#ffffff',
      main_text_suffix_color = 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      orbit_animation_color = '#10b981',
      updated_at = NOW()
    WHERE id = v_hero_id;

    DELETE FROM typewriter_texts WHERE hero_id = v_hero_id;
    INSERT INTO typewriter_texts (hero_id, content, content_color, display_order) VALUES
      (v_hero_id, 'Creative Frontend Crafter', '#10b981', 0),
      (v_hero_id, 'Clean Architecture Dev', '#34d399', 1),
      (v_hero_id, 'Nature & Anime Lover 🌿', '#38bdf8', 2),
      (v_hero_id, 'Tactical Shooter Specialist 🎮', '#f59e0b', 3);
  END IF;
END $$;
*/

