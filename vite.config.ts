import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Metronome Now",
        short_name: "Metronome Now",
        description: "Online metronome for your everyday needs",
        theme_color: "#d63444",
        background_color: "#201E23",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
        ],
        screenshots: [
          {
            src: "images/screenshots/mobile_screencap.png",
            sizes: "374x694",
            type: "image/png",
            label: "Metronome now"
          },
          {
            src: "images/screenshots/desktop_screencap.png",
            sizes: "1275x717",
            type: "image/png",
            form_factor: "wide",
            label: "Metronome now"
          },
        ]
      }
    })
  ],
  server: {
    open: true,
    port: 3000,
  }
})