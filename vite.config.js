import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // dev: ส่งต่อ /api ไป backend ให้เป็น same-origin (cookie ทำงานง่าย ไม่ต้องกังวล CORS)
      "/api": "http://localhost:4000",
    },
  },
})
