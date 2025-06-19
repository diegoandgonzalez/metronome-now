import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { manifestForPlugIn } from "./manifest";

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  server: {
    open: true,
    port: 3000,
  }
})