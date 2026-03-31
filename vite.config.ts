import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // base only applies when building for production (GitHub Pages)
  // locally (npm run dev), base stays as '/' so localhost:5173/ works normally
  base: mode === 'production' ? '/Portfolio_FuZa/' : '/',
  server: {
    host: true,
    proxy: {
      // Forward Supabase API & storage requests through the dev server
      // so mobile devices on LAN can reach the local Supabase instance
      '/supabase-local': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-local/, ''),
      }
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
}))
