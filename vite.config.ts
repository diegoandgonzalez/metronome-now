import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  define: {
    "__APP_VERSION__": JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      manifest: {
        name: "Metronome Now",
        short_name: "Metronome Now",
        description: "Online metronome with bpm programming, timer, templates and more!",
        theme_color: "#d42b3c",
        background_color: "#19171c",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/images/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/images/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/images/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any"
          },
        ],
        screenshots: [
          {
            src: "/images/screenshots/mobile_screencap.png",
            sizes: "1080x1920",
            type: "image/png",
            label: "Metronome Now"
          },
          {
            src: "/images/screenshots/mobile_screencap_2.png",
            sizes: "1080x1920",
            type: "image/png",
            label: "Metronome Now - Templates"
          },
          {
            src: "/images/screenshots/desktop_screencap.png",
            sizes: "1275x715",
            type: "image/png",
            form_factor: "wide",
            label: "Metronome Now"
          },
          {
            src: "/images/screenshots/desktop_screencap_2.png",
            sizes: "1275x715",
            type: "image/png",
            form_factor: "wide",
            label: "Metronome Now - Templates"
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