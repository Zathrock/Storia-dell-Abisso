const CACHE_NAME = "albaz-lore-v33"; // Versione CardCluster
const ASSETS = [
  "/Storia-dell-Abisso/",
  "/Storia-dell-Abisso/index.html",
  "/Storia-dell-Abisso/manifest.json",
  "/Storia-dell-Abisso/icon-192.png",
  "/Storia-dell-Abisso/icon-512.png",
  // Librerie esterne per non rompere la grafica
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:ital,wght@0,300;0,400;1,400&display=swap"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
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
      // Se c'è nella cache, usalo
      if (response) return response;
      
      // TRUCCO FONDAMENTALE: Se Android chiede la cartella, dagli index.html
      // Questo è quello che fa funzionare start_url: "/" di CardCluster
      if (e.request.url.endsWith("/Storia-dell-Abisso/")) {
        return caches.match("/Storia-dell-Abisso/index.html");
      }

      return fetch(e.request);
    })
  );
});