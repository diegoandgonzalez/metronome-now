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
        description: "Online metronome for your everyday needs",
        theme_color: "#d63444",
        background_color: "#201E23",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/images/icons/desktop-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
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
            sizes: "374x694",
            type: "image/png",
            label: "Metronome now"
          },
          {
            src: "/images/screenshots/desktop_screencap.png",
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