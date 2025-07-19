import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    target: "es2015",
    minify: "esbuild",
    sourcemap: false,
  },
});
