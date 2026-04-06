# Portfolio FuZa

Dự án Portfolio cá nhân được xây dựng với React, TypeScript và Vite, kết hợp với Supabase để quản lý Database và Storage.

## 🚀 Lệnh Phát Triển (Development)

### Frontend (NPM)
Chạy ứng dụng ở môi trường local:
```bash
npm install     # Cài đặt bài phụ thuộc
npm run dev     # Khởi chạy server phát triển
npm run build   # Build dự án cho production
npm run lint    # Kiểm tra lỗi code (ESLint)
```

### Database (Supabase CLI)
Quản lý database migrations:
```bash
# Tạo một file migration mới (trống)
npx supabase migration new [migration_name]

# Áp dụng các migration chưa chạy vào database local (nếu dùng docker)
npx supabase migration up

# Đẩy các thay đổi lên database remote (production)
npx supabase db push

# Kiểm tra trạng thái các migration
npx supabase migration list
```

## 📂 Cấu Trúc Database

Mô hình database được thiết kế bằng DBML trong thư mục `docs/database_design.dbml`. Bạn có thể dán nội dung này vào [dbdiagram.io](https://dbdiagram.io/) để xem sơ đồ trực quan.

## 🛠 Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (Database, Auth, Storage).
- **Tooling**: TypeScript, ESLint.

## 📦 Triển Khai (Deployment)

Dự án này được cấu hình để triển khai thông qua GitHub Actions (nếu có) hoặc build tay:

1. Chạy `npm run build`.
2. Kiểm tra thư mục `dist/`.
3. Đẩy code lên branch `main` để kích hoạt CI/CD (nếu đã cài đặt).
