
const CACHE_FILES = [
    '/index.html',
    '/js/index.html',
    '/js/idb.js',
    '/css/styles.css',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'  
];

const TITLE_APPL ='budget-tracker'
const VERSION = '-v0.1';
const CACHE_NAME = TITLE_APPL + VERSION;

    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open(CACHE_NAME).then(function (cache){
                console.log('Cache is being installed:' + CACHE_NAME)
    
                return cache.addAll(ADD_CACHE_FILES)
            })
        )
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys().then(function (keyList) {
                let cacheList = keyList.filter(function (key) {
                    return key.indexOf(TITLE_APPL);
                })
    
                cacheList.push(CACHE_NAME);
    
                return Promise.all(keyList.map(function (key, i) {
                    if (cacheList.indexOf(key) === -1) {
                        console.log('deleting cache: ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                }));
            })
        )
    });

    self.addEventListener('fetch', function (event) {
        console.log('fetch request : ' + event.request.url)
        event.respondWith(
            caches.match(event.request).then(function (request) {
                if (request) {
                    console.log('cache is responding: ' + event.request.url)
                    return request
                } else {
                    console.log('error,  refetching: ' + event.request.url)
                    return fetch(event.request)
                }
            })
        )
    });