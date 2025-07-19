import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Only load tempo plugin in development
    ...(process.env.NODE_ENV !== 'production' ? [tempo()] : [])
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})