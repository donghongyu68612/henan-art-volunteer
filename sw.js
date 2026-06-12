const CACHE = 'henan-art-v7';
const STATIC_CACHE = 'henan-art-static-v7';

const PRECACHE = [
  'manifest.json',
  'icons/icon-72.png',
  'icons/icon-96.png',
  'icons/icon-128.png',
  'icons/icon-144.png',
  'icons/icon-152.png',
  'icons/icon-192.png',
  'icons/icon-384.png',
  'icons/icon-512.png',
  'icons/icon-192.svg',
  'icons/icon-512.svg',
];

const CDN_CACHE = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
];

// Install: precache static assets and CDN resources
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(c => c.addAll(PRECACHE)),
      caches.open(CACHE).then(c => c.addAll(CDN_CACHE)),
    ])
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE && k !== STATIC_CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
//   index.html       → Network-first (always fresh)
//   CDN (versioned)  → Cache-first (immutable)
//   Static assets    → Cache-first
//   Other            → Network-first with cache fallback
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // index.html: network-first
  if (url.endsWith('/index.html') || url === self.location.origin + '/' || url === self.location.origin + '/index.html') {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // CDN versioned resources: cache-first (immutable)
  if (isCdnUrl(url)) {
    e.respondWith(cacheFirst(e.request, CACHE));
    return;
  }

  // Static assets (icons, manifest): cache-first
  if (url.includes('/icons/') || url.includes('manifest.json')) {
    e.respondWith(cacheFirst(e.request, STATIC_CACHE));
    return;
  }

  // Everything else: network-first
  e.respondWith(networkFirst(e.request));
});

function isCdnUrl(url) {
  return url.includes('cdnjs.cloudflare.com') || url.includes('cdn.jsdelivr.net');
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    // Only cache successful same-origin or CDN responses
    if (res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('网络不可用，请检查连接', { status: 503, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } });
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return new Response('资源不可用', { status: 503 });
  }
}
