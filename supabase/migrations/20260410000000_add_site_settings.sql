-- === BẢNG CÀI ĐẶT GIAO DIỆN & HEADER (SITE SETTINGS) ===

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  header_logo_text TEXT DEFAULT 'FuZa''s profile',
  header_logo_color TEXT DEFAULT '#ffffff',
  menu_text_color TEXT DEFAULT '#bdc3c7',
  menu_active_color TEXT DEFAULT '#ffffff',
  title_primary_color TEXT DEFAULT '#ffffff',
  title_secondary_color TEXT DEFAULT '#bdc3c7',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger auto update updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_settings_updated_at') THEN
    CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read site_settings" ON site_settings;
CREATE POLICY "Allow public read site_settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access site_settings" ON site_settings;
CREATE POLICY "Allow authenticated full access site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO site_settings (header_logo_text, header_logo_color, menu_text_color, menu_active_color, title_primary_color, title_secondary_color)
SELECT 'FuZa''s profile', '#ffffff', '#bdc3c7', '#ffffff', '#ffffff', '#bdc3c7'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
