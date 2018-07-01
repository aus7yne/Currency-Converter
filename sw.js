/*jshint esversion: 6 */

let CACHE_NAME = 'alc-cache-v1';
let allCaches = [
  CACHE_NAME,
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '../currency_cal_alc',
        '../currency_cal_alc/index.html',
        '../currency_cal_alc/converter.js',
        '../currency_cal_alc/idb.js',
        'https://free.currencyconverterapi.com/api/v5/currencies'
      ]);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('alc-cache-') &&
            !allCaches.includes(cacheName);
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});











/* self.addEventListener('activate', function (event) {

  var cacheWhitelist = ['alc-cache-v1'];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          //console.log(cacheName);
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(caches.delete(cacheName));
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/currency_cal_alc') {
      event.respondWith(caches.match('/currency_cal_alc/index.html'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
}); */