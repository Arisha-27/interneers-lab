import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/Users/arisharizwan/Week9-10_DJ/Week9-10_DJ/inventory-app/src',
    },
  },
  server: {
    hmr: {
      overlay: true
    }
  }
})
