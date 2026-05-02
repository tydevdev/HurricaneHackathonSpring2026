import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two real pages, two real URLs.
//   /                   → landing (src/landing-main.tsx via index.html)
//   /app/               → workspace (src/app-main.tsx via app/index.html)
// `base: './'` keeps every emitted asset reference relative so this works
// from any GitHub Pages sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
})
