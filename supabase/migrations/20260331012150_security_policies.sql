-- === BẮT ĐẦU CẤU HÌNH BẢO MẬT (RLS POLICIES) ===

-- 1. CẤP QUYỀN TRUY CẬP SCHEMA (QUAN TRỌNG ĐỂ HẾT 403)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 2. BẬT RLS CHO TẤT CẢ CÁC BẢNG
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- 3. CHO PHÉP MỌI NGƯỜI (ANON) ĐƯỢC XEM DỮ LIỆU (SELECT)
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow public read" ON %I', t);
        EXECUTE format('CREATE POLICY "Allow public read" ON %I FOR SELECT USING (true)', t);
    END LOOP;
END $$;

-- 4. CHỈ CHO PHÉP NGƯỜI ĐÃ LOGIN (AUTHENTICATED) ĐƯỢC TOÀN QUYỀN (ALL)
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated full access" ON %I', t);
        EXECUTE format('CREATE POLICY "Allow authenticated full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;

-- === KẾT THÚC CẤU HÌNH BẢO MẬT ===
