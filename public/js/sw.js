// Cache ID Version
const cacheID = 'v1';
// Files to precache
const cacheFiles = [
  '/',
  // HTML Files
  '../index.html',
  '../homepage.html',
  '../create_account.html',
  '../forgot_password.html',
  '../account_settings.html',
  '../schedule_upcoming.html',
  '../schedule_previous.html',
  '../roster_vanilla.html',
  '../player_stats_vanilla.html',
  '../player_info_vanilla.html',
  '../input_stats_vanilla.html',
  '../gamestat_summary.html',
  // CSS Files
  // Image Files
  '../images/edit.svg',
  '../images/LAGalaxy.svg',
  '../soccer_icon.png',
  // JS Files
  './schedule.js',
  './hideInputTab.js',
  './CRUD_roster.js',
  './raven.js',
  './firebase.js',
  './firestore.js',
  './sw.js',
  './app.js',
  // Misc. Files
  '../manifest.json',
];

// Service Worker Install Event
self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheID)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
      console.log(`Unable to add cached assets: ${error}`);
    })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Load up all items from cache, and check if cache items are not outdated
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheID) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });