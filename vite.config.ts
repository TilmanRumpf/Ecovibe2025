import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    outDir: "dist",
    sourcemap: false,
  },
  plugins: [
    react(),
    // Include tempo plugin when VITE_TEMPO is enabled
    ...(process.env.VITE_TEMPO === "true" ? [tempo()] : []),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.VITE_TEMPO === "true" ? true : undefined,
  },
  define: {
    // Ensure environment variables are properly defined
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY,
    ),
  },
});