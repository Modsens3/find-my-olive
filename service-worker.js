// Olive Mapper Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'olive-mapper-v1.0.0';
const RUNTIME_CACHE = 'olive-mapper-runtime';

// Files to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests that aren't our CDN resources
  if (url.origin !== location.origin && !isCachedCDNResource(url.href)) {
    // For OpenStreetMap tiles, use network-first strategy
    if (url.hostname.includes('tile.openstreetmap.org')) {
      event.respondWith(networkFirst(request));
      return;
    }
    return;
  }
  
  // For navigation requests, use network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // For static assets, use cache-first strategy
  event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[Service Worker] Serving from cache:', request.url);
    return cached;
  }
  
  console.log('[Service Worker] Fetching from network:', request.url);
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const runtimeCache = await caches.open(RUNTIME_CACHE);
      runtimeCache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline page or placeholder if available
    return new Response('Offline - Please check your internet connection', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    console.log('[Service Worker] Trying network first:', request.url);
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline fallback
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      const fallback = await cache.match('/index.html');
      return fallback || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    }
    
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Check if URL is a cached CDN resource
function isCachedCDNResource(url) {
  return STATIC_CACHE_URLS.some(cachedUrl => 
    url.includes(cachedUrl) || cachedUrl.includes(url)
  );
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Background sync for offline data (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-trees') {
    event.waitUntil(syncTrees());
  }
});

async function syncTrees() {
  // Placeholder for future cloud sync functionality
  console.log('[Service Worker] Syncing trees data...');
  return Promise.resolve();
}

// Periodic background sync (future enhancement)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

async function updateCache() {
  console.log('[Service Worker] Updating cache...');
  const cache = await caches.open(CACHE_NAME);
  
  try {
    await cache.addAll(STATIC_CACHE_URLS);
    console.log('[Service Worker] Cache updated successfully');
  } catch (error) {
    console.error('[Service Worker] Cache update failed:', error);
  }
}

console.log('[Service Worker] Script loaded');

