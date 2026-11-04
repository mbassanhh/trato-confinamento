const CACHE='fazenda-tratador-homologacao-v1';
const APP='./GESTAO_CONFINAMENTO_HOMOLOGACAO_OFFLINE_04_11.html';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.add(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(r=>{if(r.ok){const clone=r.clone();caches.open(CACHE).then(c=>c.put(event.request,clone));}return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match(APP))));
});
