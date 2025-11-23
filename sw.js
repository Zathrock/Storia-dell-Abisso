const CACHE_NAME = "albaz-lore-final-v1";
const ASSETS = [
  "/Storia-dell-Abisso/",             // La cartella (per quando navighi)
  "/Storia-dell-Abisso/index.html",   // IL FILE (Fondamentale per lo start_url)
  "/Storia-dell-Abisso/manifest.json",
  "/Storia-dell-Abisso/icon-192.png",
  "/Storia-dell-Abisso/icon-512.png",
  // Librerie esterne
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:ital,wght@0,300;0,400;1,400&display=swap"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});