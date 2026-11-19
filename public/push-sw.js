// Se carga dentro del service worker que genera Workbox (vite.config.ts → workbox.importScripts).
// Muestra las notificaciones que manda el backend y abre la app al pulsarlas.

self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { body: event.data ? event.data.text() : '' };
    }

    event.waitUntil(
        self.registration.showNotification(data.title || 'Golify', {
            body: data.body || '',
            tag: data.tag || undefined,
            icon: '/pwa-192x192.png',
            badge: '/badge-96x96.png',
            lang: 'es',
            data: { url: data.url || '/' },
        }),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = new URL(event.notification.data?.url || '/', self.location.origin).href;

    event.waitUntil(
        (async () => {
            // Si la app ya está abierta, se reutiliza esa ventana en vez de abrir otra
            const windows = await self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true,
            });
            for (const client of windows) {
                if (new URL(client.url).origin !== self.location.origin) continue;
                try {
                    const focused = await client.focus();
                    await focused.navigate(url);
                    return;
                } catch {
                    // Algunos navegadores no dejan navegar desde aquí: se abre una ventana nueva
                }
            }
            await self.clients.openWindow(url);
        })(),
    );
});
