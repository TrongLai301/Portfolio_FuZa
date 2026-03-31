-- === BẮT ĐẦU CẤU HÌNH BẢO MẬT (RLS POLICIES) ===

-- 1. DANH SÁCH CÁC BẢNG CẦN BẬT RLS
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- 2. CHO PHÉP MỌI NGƯỜI (ANON) ĐƯỢC XEM DỮ LIỆU (SELECT)
-- Áp dụng cho tất cả các bảng trong public schema
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow public read" ON %I', t);
        EXECUTE format('CREATE POLICY "Allow public read" ON %I FOR SELECT USING (true)', t);
    END LOOP;
END $$;

-- 3. CHỈ CHO PHÉP NGƯỜI ĐÃ LOGIN (AUTHENTICATED) ĐƯỢC TOÀN QUYỀN (ALL)
-- Áp dụng cho tất cả các bảng trong public schema
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated full access" ON %I', t);
        EXECUTE format('CREATE POLICY "Allow authenticated full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
    END LOOP;
END $$;

-- === KẾT THÚC CẤU HÌNH BẢO MẬT ===
