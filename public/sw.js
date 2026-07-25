const CACHE_NAME = 'pronounpocket-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'icon.svg',
  'manifest.json'
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate caching pattern
self.addEventListener('fetch', (event) => {
  // Only cache same-origin GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip hot-reload or special developer websocket/Vite URLs
  if (
    event.request.url.includes('chrome-extension://') || 
    event.request.url.includes('/@vite/') || 
    event.request.url.includes('/@id/') ||
    event.request.url.includes('/node_modules/') ||
    event.request.url.includes('/@react-refresh')
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Check if response is valid (status 200/OK) before caching
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.warn('[Service Worker] Fetch failed, serving cache:', err);
          // Return fallback response if network fails and cache is empty
        });

        // Return cached response instantly if present, falling back to network fetch
        return cachedResponse || fetchPromise;
      });
    })
  );
});
