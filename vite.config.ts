import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (/node_modules[\/](three|@react-three)/.test(id)) return 'three'
          if (/node_modules[\/](gsap|lenis)/.test(id)) return 'gsap'
        },
      },
    },
  },
})
