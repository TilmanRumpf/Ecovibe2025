import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only log in development
if (import.meta.env.DEV) {
  console.log("🔧 Supabase Configuration:", {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    urlLength: supabaseUrl?.length,
    keyLength: supabaseAnonKey?.length,
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "Missing Supabase environment variables";
  if (import.meta.env.DEV) {
    console.error("❌ Missing Supabase environment variables:", {
      VITE_SUPABASE_URL: !!supabaseUrl,
      VITE_SUPABASE_ANON_KEY: !!supabaseAnonKey,
    });
  }
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "X-Client-Info": "ecovibe-design-app",
    },
  },
});

// Force HTTPS in production
if (
  typeof window !== "undefined" &&
  window.location.protocol === "http:" &&
  window.location.hostname !== "localhost"
) {
  window.location.replace(window.location.href.replace("http:", "https:"));
}

if (import.meta.env.DEV) {
  console.log("✅ Supabase client created successfully");
}
