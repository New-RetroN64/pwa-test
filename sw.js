// Nazwa pamięci roboczej
const CACHE_NAME = 'pwa-test';

// Pliki do zapisu na urządzeniu
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Instalacja
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalacja...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Zapisywanie plików w pamięci podręcznej');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Aktywacja
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Aktywacja...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Usuwanie starej pamięci podręcznej', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Zdarzenie wywoływane za każdym razem kiedy strona o coś poprosi
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // Najpierw sprawdzamy, czy mamy plik w pamięci podręcznej
        caches.match(event.request)
            .then((cachedResponse) => {
                // Jeśli plik jest w pamięci, zwracamy go
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Jeśli nie ma, pobieramy go z internetu
                return fetch(event.request);
            })
    );
});