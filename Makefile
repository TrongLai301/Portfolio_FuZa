# ==============================================================================
# Makefile - Portfolio FuZa
# ==============================================================================

.PHONY: help install dev build preview lint deploy \
        sb-start sb-stop sb-status sb-reset sb-migrate sb-new-migration sb-push \
        db-start db-stop db-status db-reset db-migrate clean

# Mặc định khi chỉ gõ 'make' sẽ hiển thị menu trợ giúp
.DEFAULT_GOAL := help

# Colors
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RESET  := \033[0m

## ----------------------------------------------------------------------
## 📖 TRỢ GIÚP (HELP)
## ----------------------------------------------------------------------
help: ## Hiển thị danh sách các lệnh có sẵn
	@echo ""
	@echo "$(CYAN)Portfolio FuZa - Command Runner$(RESET)"
	@echo "Sử dụng: $(YELLOW)make [target]$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-18s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

## ----------------------------------------------------------------------
## 🌐 FRONTEND (REACT / VITE)
## ----------------------------------------------------------------------
install: ## Cài đặt các thư viện phụ thuộc (npm install)
	npm install

dev: ## Chạy Vite development server
	npm run dev

build: ## Build dự án cho production
	npm run build

preview: ## Xem trước bản build production tại local
	npm run preview

lint: ## Kiểm tra lỗi code với ESLint
	npm run lint

deploy: ## Deploy dự án lên GitHub Pages
	npm run deploy

## ----------------------------------------------------------------------
## 🗄️ SUPABASE LOCAL (DOCKER)
## ----------------------------------------------------------------------
sb-start: ## Khởi động Supabase local (yêu cầu Docker Desktop đang chạy)
	supabase start

sb-stop: ## Dừng toàn bộ containers Supabase local
	supabase stop

sb-status: ## Kiểm tra trạng thái và lấy API keys / URLs của Supabase local
	supabase status

sb-reset: ## Xóa trắng database và chạy lại toàn bộ migration
	supabase db reset

sb-migrate: ## Chạy các migration chưa được áp dụng
	supabase migration up

sb-new-migration: ## Tạo file migration mới (VD: make sb-new-migration name=add_table)
	@if [ -z "$(name)" ]; then \
		echo "$(YELLOW)Lỗi: Vui lòng cung cấp tham số name. Ví dụ: make sb-new-migration name=add_table$(RESET)"; \
		exit 1; \
	fi
	supabase migration new $(name)

sb-push: ## Đẩy các migration lên remote database (production)
	supabase db push

# Aliases ngắn gọn cho database
db-start: sb-start ## Alias cho sb-start
db-stop: sb-stop ## Alias cho sb-stop
db-status: sb-status ## Alias cho sb-status
db-reset: sb-reset ## Alias cho sb-reset
db-migrate: sb-migrate ## Alias cho sb-migrate

## ----------------------------------------------------------------------
## 🧹 DỌN DẸP
## ----------------------------------------------------------------------
clean: ## Xóa thư mục build dist
	rm -rf dist

