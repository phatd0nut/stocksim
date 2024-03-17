// Service worker som cachar filer för att kunna användas offline.

var cacheName = 'cache-v1'; // Namn på cachen som används för att lagra filer.

// Cachade filer
var cachedAssets = [
    '/',
    'index.html',
    'manifest.json',
    'sw.js',
    '/src/css/style.css',
    '/src/js/Charts.js',
    '/src/js/CreateUser.js',
    '/src/js/DetectMode.js',
    '/src/js/Logo.js',
    '/src/js/Main.js',
    '/src/js/Portfolio.js',
    '/src/js/Search.js',
    '/src/js/Settings.js',
    '/src/js/Stock.js',
    '/src/js/StockApp.js',
    '/src/js/StockMarketAPI.js',
    '/src/js/StockPage.js',
    '/src/js/StockPrice.js',
    '/src/js/User.js',
    '/src/img/close_icon_1.png',
    '/src/img/close_icon_2.png',
    '/src/img/go_back_1.png',
    '/src/img/go_back_2.png',
    '/src/img/portfolio_icon1.png',
    '/src/img/portfolio_icon2.png',
    '/src/img/search_1.png',
    '/src/img/search_2.png',
    '/src/img/sedel_1_snurr.gif',
    '/src/img/sedel_1.gif',
    '/src/img/settings_icon_1.png',
    '/src/img/settings_icon_2.png',
    '/src/img/stocksim_cropped.png',
    '/src/img/stocksim_cropped2.png',
    '/src/img/stocksim_cropped3.png',
    '/src/img/stocksim_icon.png',
    '/src/img/stocksim_logo.png',
    '/src/img/stocksim_s_logo_2.png',
    '/src/img/stocksim_s_logo.png',
];

// Installera service workern och cachar filer i service workern.
self.addEventListener('install', function (event) {
    console.log('Service Worker installerad');
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(cachedAssets);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

// Aktivera service workern och ta bort gamla cachade filer.
self.addEventListener('activate', function (event) {
    console.log('Service Worker aktiverad');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (thisCacheName) {
                    if (thisCacheName !== cacheName) {
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    var specificFileUrl = 'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@1.1.0/dist/chartjs-adapter-date-fns.bundle.min.js';
    if (event.request.url === specificFileUrl) {
        // Om URL:en matchar den specifika filen, returnera en tom respons direkt.
        event.respondWith(new Response());
    } else if (event.request.url.startsWith('http')) {
        event.respondWith(
            fetch(event.request).catch(function(error) {
                console.log('Fetch failed; returning cache instead.', error);
                return caches.match(event.request);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});