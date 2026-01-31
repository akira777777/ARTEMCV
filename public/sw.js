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

// Enhanced caching strategies
self.addEventListener('fetch', (event) => {
  // Don't cache certain types of requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip navigation requests for specific routes that shouldn't be cached
  if (event.request.destination === 'document') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Image caching strategy
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            // Return cached image and update in background
            fetch(event.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
            }).catch(() => {});
            return cachedResponse;
          }
          
          // Fetch from network and cache
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      }).catch(() => fetch(event.request))
    );
    return;
  }
  
  // Dynamic asset caching (JS, CSS, etc.)
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.css')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      }).catch(() => fetch(event.request))
    );
    return;
  }
  
  // Default network-first strategy with cache fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(DYNAMIC_CACHE);
          await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Both failed, return offline fallback
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