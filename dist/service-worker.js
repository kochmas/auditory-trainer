const cacheName = 'listenup-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './main.css',
        './app.js',
        'icons/icon-96x96.png',
        'icons/icon-128x128.png',
        'icons/icon-152x152.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'

      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(existingCacheNames => {
      return Promise.all(
        existingCacheNames.map(existingCacheName => {
          if (existingCacheName !== cacheName) {
            return caches.delete(existingCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
