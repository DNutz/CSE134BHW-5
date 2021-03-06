const cacheID = 'v1';
const cacheFiles = [
  '/',
  './index.html',
  './homepage.html',
  './create_account.html',
  './forgot_password.html',
  './account_settings.html',
  './schedule_upcoming.html',
  './schedule_previous.html',
  './roster_vanilla.html',
  './player_stats_vanilla.html',
  './player_info_vanilla.html',
  './input_stats_vanilla.html',
  './gamestat_summary.html',
  './offline.html',
  './images/edit.svg',
  './images/LAGalaxy.svg',
  './images/soccer_icon.png',
  './js/schedule.js',
  './js/hideInputTab.js',
  './js/CRUD_roster.js',
  './js/raven.js',
  './js/firebase.js',
  './js/firestore.js',
  './sw.js',
  './js/app.js',
  './manifest.json',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheID)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheID) {
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
          if (response) {
            return response;
          }
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              if(!response || response.status !== 200 || fetchRequest.method == 'POST') {
                return response;
              }
              var responseToCache = response.clone();
              caches.open(cacheID)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        }).catch(function() {
          return caches.match('./offline.html');
        })
      );
  });