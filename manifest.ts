export const manifestForPlugIn = {
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
                sizes: "192x192",
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
    }
}