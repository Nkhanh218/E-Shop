import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/": "http://localhost:5000",
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
