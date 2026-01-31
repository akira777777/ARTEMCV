// Enhanced service-worker.js with improved caching strategies
const CACHE_NAME = 'artemcv-v2';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// Cache versioning for better cache management
const DYNAMIC_CACHE = 'artemcv-dynamic-v1';
const IMAGE_CACHE = 'artemcv-images-v1';

// Critical assets that should be precached
const PRECACHE_ASSETS = [
  '/index.css',
  '/assets/index-', // Main JS bundle
  '/assets/react-', // React chunk
  '/assets/motion-', // Framer Motion chunk
  '/assets/icons-', // Icons chunk
  // Image assets
  '/marketplace.webp',
  '/detailing.webp',
  '/barber.webp',
  '/dental.webp',
  '/game.webp',
];

// Precache critical assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Precache static assets
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('[Service Worker] Pre-caching static assets');
          return cache.addAll(STATIC_CACHE);
        }),
      // Precache critical dynamic assets
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          console.log('[Service Worker] Pre-caching dynamic assets');
          // Add wildcard matching for dynamic assets
          return Promise.all(
            PRECACHE_ASSETS.map(asset => {
              if (asset.endsWith('-')) {
                // Handle versioned assets with wildcards
                return fetch('/').then(response => response.text()).then(html => {
                  // Parse HTML to find actual asset URLs
                  const matches = html.match(new RegExp(asset + '[a-zA-Z0-9_-]+\.js', 'g'));
                  if (matches) {
                    return cache.addAll(matches);
                  }
                }).catch(() => {});
              } else {
                return cache.add(asset).catch(() => {});
              }
            })
          );
        })
    ]).then(() => {
      console.log('[Service Worker] Installation complete');
      self.skipWaiting(); // Activate immediately
    }).catch((error) => {
      console.error('[Service Worker] Installation failed:', error);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  const currentCaches = [CACHE_NAME, DYNAMIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim(); // Take control of all clients immediately
    })
  );
});

// Network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Don't cache certain types of requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip navigation requests for specific routes that shouldn't be cached
  if (event.request.destination === 'document') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);
        
        // If request succeeded, cache a copy
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);
        }
        
        return networkResponse;
      } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Both failed, return offline fallback if it's an image
        if (event.request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="#333"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12px">IMG</text></svg>',
            {
              headers: { 'Content-Type': 'image/svg+xml' }
            }
          );
        }
        
        // Return error for other requests
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/html' })
        });
      }
    })()
  );
});

// Listen for message events from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});