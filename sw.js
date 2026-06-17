const CACHE_NAME = 'dua-pharma-portal-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Add paths to any local icons or assets here if you have them, e.g.:
  // './icon-192.png',
  // './icon-512.png'
];

// Install Event: Cache the portal layout core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Dua Pharma Portal: Caching structural shell assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up older cache versions if updated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Dua Pharma Portal: Removing old cache storage', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First Strategy with Network Fallback
self.addEventListener('fetch', (event) => {
  // Only handle local same-origin requests (the dashboard shell)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately for true instant/offline loading
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
  }
});
