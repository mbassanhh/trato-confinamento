/* FAZENDA NOVA ESPERANÇA — CACHE OFFLINE DA INTERFACE
   Não sincroniza lançamentos; dados pendentes exigem rotina própria no aplicativo. */
const CACHE = 'fazenda-tratador-index-20261107-v2';
const APP = './index.html';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await cache.add(new Request(APP, {cache:'reload'}));
    await self.skipWaiting();
  }));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('fazenda-tratador-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      return (await caches.match(request)) || (await caches.match(APP)) || Response.error();
    }
  })());
});
