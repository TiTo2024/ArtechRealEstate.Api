import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['webcams-calendars-circumstances-border.trycloudflare.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:5275',
        changeOrigin: true,
      },
    },
  },
})
