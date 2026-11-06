import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'prompt',
            pwaAssets: {
                config: true,
                overrideManifestIcons: true,
            },
            manifest: {
                name: 'Football Predictions',
                short_name: 'Porra',
                description: 'La porra de LaLiga con tus amigos',
                lang: 'es',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                orientation: 'portrait',
                theme_color: '#0A0E1A',
                background_color: '#0A0E1A',
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
                // Las fuentes en griego, cirílico y vietnamita solo se descargan si alguna vez hacen falta
                globIgnores: ['**/*-{greek,greek-ext,cyrillic,cyrillic-ext,vietnamese}-*.woff2'],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/api\//],
                cleanupOutdatedCaches: true,
            },
        }),
    ],
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
    preview: {
        proxy: {
            '/api': 'http://localhost:8080',
        },
    },
});
