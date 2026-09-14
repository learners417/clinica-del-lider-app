/* La Clínica del Líder — SW v1: la app abre aunque la red falle. */
const CACHE = 'cdl-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.url.includes('/api/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const c = r.clone(); caches.open(CACHE).then((ca) => ca.put('/', c)); return r; }).catch(() => caches.match('/')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok && (req.url.includes('/assets/') || req.destination === 'image' || req.destination === 'font')) {
      const c = r.clone(); caches.open(CACHE).then((ca) => ca.put(req, c));
    }
    return r;
  })));
});
