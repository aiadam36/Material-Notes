const CACHE_NAME = "material-notes-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./info.html",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
