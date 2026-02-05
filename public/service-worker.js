const CACHE_NAME = 'artermcv-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/vite.svg',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/components/Layout.tsx',
  '/src/pages/DentalEcosystemPage.tsx',
  '/src/pages/BarbershopGridPage.tsx',
  '/src/pages/DetailingHubPage.tsx',
  '/src/components/CarConfigurator.tsx',
  '/components/About.tsx',
  '/components/AnimatedTypography.tsx',
  '/components/AnimatedUnderline.tsx',
  '/components/BackgroundPaths.tsx',
  '/components/BackgroundPathsDemo.tsx',
  '/components/BackgroundPathsRoute.tsx',
  '/components/CTASection.tsx',
  '/components/ContactSectionSecure.tsx',
  '/components/CursorTrail.tsx',
  '/components/EnhancedElements.tsx',
  '/components/ErrorBoundary.tsx',
  '/components/Footer.tsx',
  '/components/Footer2026.tsx',
  '/components/FramerIntegration.tsx',
  '/components/GradientShaderCard.tsx',
  '/components/Header.tsx',
  '/components/HolographicElements.tsx',
  '/components/Icons.tsx',
  '/components/InteractiveElements.tsx',
  '/components/InteractiveGallery.tsx',
  '/components/LanguageSwitcher.tsx',
  '/components/MagneticButton.tsx',
  '/components/OptimizedImage.tsx',
  '/components/ParticleText.tsx',
  '/components/ScrollProgress.tsx',
  '/components/SectionDivider.tsx',
  '/components/SimpleTelegramChat.tsx',
  '/components/SkipLink.tsx',
  '/components/SpotlightGallery.tsx',
  '/components/TextReveal.tsx',
  '/components/WorkGallery.tsx',
  '/components/CardStack.tsx',
  '/components/Navigation.tsx',
  '/components/Hero.tsx',
  '/components/HeroClean.tsx',
  '/components/home/Hero2026.tsx',
  '/components/home/ParticleField.tsx',
  '/components/home/BentoGrid.tsx',
  '/components/home/LabSection.tsx',
  '/components/detailing/ProjectNavigation.tsx',
  '/components/detailing/CarConfigurator.tsx',
  '/components/ScrollToTop.tsx',
  '/components/ServicesGrid.tsx',
  '/pages/Home2026.tsx',
  '/pages/DetailingHub.tsx',
  '/components/LazyGradientShaderCard.tsx',
  '/components/LazySimpleTelegramChat.tsx',
  '/components/OptimizedGradientShaderCard.tsx',
  '/constants.tsx',
  '/i18n.tsx',
  '/node_modules/react/umd/react.development.js',
  '/node_modules/react-dom/umd/react-dom.development.js',
  '/node_modules/lucide-react/dist/index.esm.js',
  '/node_modules/framer-motion/dist/es/motion.js',
  '/node_modules/three/build/three.module.js',
  '/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js',
  '/node_modules/@react-three/drei/dist/drei.esm.js',
  '/node_modules/gsap/src/index.js',
  '/node_modules/tailwindcss/tailwind.css',
  '/node_modules/@types/react/index.d.ts',
  '/node_modules/@types/react-dom/index.d.ts'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim(); // Take control of all clients
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and requests to other origins
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle different types of requests differently
  const requestUrl = new URL(event.request.url);
  
  // Cache strategy based on request type
  if (requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    // Images: Network-first with cache fallback
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          // Clone and cache the response if successful
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => {
          // If network fails, try cache
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline placeholder if nothing is available
            return caches.match('/offline-image-placeholder.jpg');
          });
        });
      })
    );
  } else if (requestUrl.pathname.match(/\.(css|js)$/)) {
    // Scripts and styles: Cache-first strategy
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          // If we received a valid response, cache it
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
  } else {
    // HTML and other resources: Network-first with cache fallback
    event.respondWith(
      fetch(event.request).then((response) => {
        // If request was successful, update cache
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // If network fails, try cache, then fallback to offline page
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Serve fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
    );
  }
});

// Listen for message events from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});