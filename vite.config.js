import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "/fantazy-statistics/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/@mui")) {
            return "vendor-mui";
          }
          if (id.includes("node_modules/@emotion")) {
            return "vendor-emotion";
          }
          if (id.includes("node_modules/lodash") || id.includes("node_modules/axios")) {
            return "vendor-utils";
          }
        },
      },
    },
  },
});
