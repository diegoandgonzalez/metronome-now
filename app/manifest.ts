import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Metronome Now',
        short_name: 'Metronome Now',
        description: 'Online metronome with bpm programming, timer, templates and more!',
        display: 'standalone',
        theme_color: '#d42b3c',
        background_color: '#19171c',
        scope: '/',
        start_url: '/en',
        icons: [
            {
                src: '/images/icons/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/images/icons/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/images/icons/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
                purpose: 'any'
            },
        ],
        screenshots: [
            {
                src: '/images/screenshots/mobile_screencap.png',
                sizes: '1080x1920',
                type: 'image/png',
                label: 'Metronome Now'
            },
            {
                src: '/images/screenshots/mobile_screencap_2.png',
                sizes: '1080x1920',
                type: 'image/png',
                label: 'Metronome Now - Templates'
            },
            {
                src: '/images/screenshots/desktop_screencap.png',
                sizes: '1275x715',
                type: 'image/png',
                form_factor: 'wide',
                label: 'Metronome Now'
            },
            {
                src: '/images/screenshots/desktop_screencap_2.png',
                sizes: '1275x715',
                type: 'image/png',
                form_factor: 'wide',
                label: 'Metronome Now - Templates'
            },
        ]
    }
}