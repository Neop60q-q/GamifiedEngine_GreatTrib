import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/xp-api": {
        target: "http://127.0.0.1:8002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xp-api/, ""),
      },
      "/avatar-api": {
        target: "http://127.0.0.1:8003",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/avatar-api/, ""),
      },
      "/creation-api": {
        target: "http://127.0.0.1:8001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/creation-api/, ""),
      },
    },
  },
});
