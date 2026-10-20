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

// Zdarzenie 'activate' wywołuje się po udanej instalacji.
// To dobre miejsce na usuwanie starych, niepotrzebnych wersji pamięci podręcznej.
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

// Zdarzenie 'fetch' wywołuje się za każdym razem, gdy strona o coś prosi 
// (np. o plik HTML, obrazek, plik CSS).
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // ignorujemy dodatkowe parametry w URL (np. ?source=pwa) dodawane przez telefony
        caches.match(event.request, {ignoreSearch: true})
            .then((cachedResponse) => {
                // Jeśli plik jest w pamięci, zwracamy go
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Jeśli nie ma, pobieramy go z internetu
                return fetch(event.request);
            }).catch(() => {
                // Fallback: jeśli jesteśmy offline i próbujemy wczytać podstronę/główną stronę,
                // zwracamy z cache główny plik index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});
