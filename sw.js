const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1';

const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/script.js',
  '/css/style.css',
  '/img/arvid_strauss.jpg',
  '/img/stella_janasek.jpg',
  'libraries/vexflow-master/releases/vexflow-min.js',
  '/notes.json',
  '/img/icons/icon-256x256.png',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  '/manifest.json'
];

// install service worker
self.addEventListener('install', evt => {
  //console.log('service worker has been installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', evt => {
  //console.log('Service worker has been activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then(cacheRes => {
        return (
          cacheRes ||
          fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCache).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              return fetchRes;
            });
          })
        );
      })
      .catch(err => {
        console.log(err);
      })
  );
});
