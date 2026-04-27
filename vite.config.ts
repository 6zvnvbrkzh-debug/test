import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy dependencies into long-lived cacheable chunks so a code change
    // in our app doesn't bust the vendor cache, and the browser can parallelize downloads.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) return "vendor-react";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (
            id.includes("recharts") ||
            id.includes("/d3-") ||
            id.includes("victory-vendor") ||
            id.includes("internmap")
          ) return "vendor-charts";
          // lodash kept separate — it's a shared transitive dep, putting it with charts
          // pulls the entire chart bundle into homepage preload.
          if (id.includes("lodash")) return "vendor-lodash";
          if (id.includes("sonner")) return "vendor-toast";
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) return "vendor-forms";
          if (id.includes("date-fns")) return "vendor-date";
          // Admin-heavy / low-traffic UI libs — separate chunk so the homepage doesn't ship them
          if (id.includes("@dnd-kit")) return "vendor-dnd";
          if (
            id.includes("cmdk") ||
            id.includes("vaul") ||
            id.includes("input-otp") ||
            id.includes("embla-carousel") ||
            id.includes("react-day-picker") ||
            id.includes("react-resizable-panels")
          ) return "vendor-ui-extras";
          return "vendor-other";
        },
      },
    },
    // Slightly raise the warning threshold; with code-splitting the warning is misleading
    // for the React vendor chunk which is unavoidably ~140kB.
    chunkSizeWarningLimit: 600,
  },
}));
