
const CACHE = 'hk-biosphere-shell-v7';
const RUNTIME = 'hk-biosphere-runtime-v7';

const CORE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './biosphere-upgrades.js',
  './manifest.webmanifest',
  './icon.svg',
  './final-polish.css',
  './final-polish.js',
  './assets/chitral-valley-hero.png',
  './assets/hindukush-fullscape.webp',
  './assets/markhor-vine-emblem.webp'
];

const REMOTE_CACHE_HOSTS = [
  'upload.wikimedia.org',
  'thumb.wikimedia.org',
  'api.inaturalist.org',
  'static.inaturalist.org',
  'cdn.jsdelivr.net',
  'storage.googleapis.com',
  'api.gbif.org',
  'inaturalist-open-data.s3.amazonaws.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => ![CACHE, RUNTIME].includes(key))
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const approvedRemote = REMOTE_CACHE_HOSTS.includes(url.hostname);

  if (!sameOrigin && !approvedRemote) return;

  // Never cache API requests or their responses.
  if (sameOrigin && url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(
      sameOrigin ? CACHE : RUNTIME
    );

    // Website files: network first, cached copy as offline fallback.
    if (sameOrigin) {
      try {
        const response = await fetch(req);

        if (response && response.ok) {
          await cache.put(req, response.clone());
        }

        return response;
      } catch (error) {
        return (await cache.match(req)) ||
          (await caches.match('./index.html')) ||
          Response.error();
      }
    }

    // Approved remote resources: use cache first, update in background.
    const cached = await cache.match(req);

    if (cached) {
      event.waitUntil(
        fetch(req)
          .then(response => {
            if (response && (response.ok || response.type === 'opaque')) {
              return cache.put(req, response.clone());
            }
          })
          .catch(() => {})
      );

      return cached;
    }

    try {
      const response = await fetch(req);

      if (response && (response.ok || response.type === 'opaque')) {
        event.waitUntil(cache.put(req, response.clone()));
      }

      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
