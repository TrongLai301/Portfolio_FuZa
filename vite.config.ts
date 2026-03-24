import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // base only applies when building for production (GitHub Pages)
  // locally (npm run dev), base stays as '/' so localhost:5173/ works normally
  base: mode === 'production' ? '/Portfolio_FuZa/' : '/',
  plugins: [
    react(),
    tailwindcss()
  ],
}))
