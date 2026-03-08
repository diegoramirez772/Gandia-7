import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,       // Puerto fijo — Supabase guarda la sesión por origin.
    strictPort: true, // Si 5173 está ocupado, falla en lugar de usar otro puerto.
  },
})