import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null, // on enregistre le service worker manuellement dans main.tsx
      // manifest géré manuellement via public/manifest.webmanifest (voir historique projet) :
      // on désactive la génération automatique pour éviter tout conflit entre les deux fichiers.
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    host: true,
  },
});
