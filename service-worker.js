const CACHE_NAME = 'metalico-v1';
const OFFLINE_URL = '/Gastos_Metalico/';
const ASSETS = [
  '/Gastos_Metalico/',
  '/Gastos_Metalico/index.html',
  '/Gastos_Metalico/manifest.json',
  '/Gastos_Metalico/icons/icon-192.png',
  '/Gastos_Metalico/icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Cache addAll failed, some assets may be unavailable:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      });
    })
  );
});
