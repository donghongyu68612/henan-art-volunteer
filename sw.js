const CACHE_NAME = "henan-art-volunteer-v6";
const urlsToCache = [
  "manifest.json"
];

self.addEventListener("install", function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  const url = event.request.url;
  // index.html: 始终从网络获取，不缓存
  if (url.indexOf('index.html') !== -1) {
    event.respondWith(fetch(event.request).catch(function() {
      return new Response('请刷新页面获取最新版本', {status: 503});
    }));
    return;
  }
  // 其他静态资源: 缓存优先，网络兜底
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).catch(function() {
        return new Response('离线', {status: 503});
      });
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
