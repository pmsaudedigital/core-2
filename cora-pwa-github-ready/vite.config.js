import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Em "GitHub Pages de projeto" (usuario.github.io/nome-do-repo) o site fica
  // numa subpasta, então o base precisa bater com o nome do repositório.
  // O workflow do GitHub Actions já define isso automaticamente (VITE_BASE_PATH).
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "CORA · Motor de Contexto Ácido-base",
        short_name: "CORA",
        description: "Apoio à decisão em gasometria arterial — análise ácido-base, ânion gap e condutas baseadas em evidências.",
        start_url: process.env.VITE_BASE_PATH || "/",
        scope: process.env.VITE_BASE_PATH || "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0C1A18",
        theme_color: "#0C1A18",
        lang: "pt-BR",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
