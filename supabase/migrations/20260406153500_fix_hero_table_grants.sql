-- =====================================================================
-- Bổ sung quyền truy cập phân quyền RBAC (Role-Based Access Control)
-- cho các bảng liên quan đến Hero Section
-- Chặn lỗi 'permission denied for table hero_settings' từ API (PostgREST)
-- =====================================================================

-- Cấp quyền thao tác toàn diện cho người dùng đã đăng nhập và ẩn danh
GRANT ALL ON TABLE public.hero_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.typewriter_texts TO anon, authenticated, service_role;
