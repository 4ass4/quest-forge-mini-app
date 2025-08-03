import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [basicSsl()],
  build: {
    outDir: './dist',
    rollupOptions: {
      output: {
        manualChunks: {
          telegram: ['@twa-dev/sdk'],
          ton: ['@tonconnect/sdk']
        }
      }
    }
  },
  server: {
    host: true,
    https: true,
    port: 5173
  },
  preview: {
    port: 4173,
    https: true
  },
  define: {
    global: 'globalThis'
  }
}) 