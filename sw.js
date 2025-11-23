const CACHE_NAME = "albaz-lore-v31"; // Versione aggiornata
const ASSETS = [
  "/Storia-dell-Abisso/",
  "/Storia-dell-Abisso/index.html",
  "/Storia-dell-Abisso/manifest.json",
  "/Storia-dell-Abisso/icon-192.png",
  "/Storia-dell-Abisso/icon-512.png",
  "/Storia-dell-Abisso/screenshot.png",
  // AGGIUNTE FONDAMENTALI: Le librerie esterne
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:ital,wght@0,300;0,400;1,400&display=swap"
];

// Installazione: Scarica tutto, inclusi i CDN
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usa addAll, ma gestisce gli errori se un CDN fallisce
      return cache.addAll(ASSETS).catch(err => console.error("Errore caching:", err));
    })
  );
});

// Attivazione: Pulisce la vecchia cache corrotta
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Strategia Ibrida (Network First per HTML, Cache First per asset statici)
self.addEventListener("fetch", (e) => {
  // Ignora le richieste non GET
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Se è nella cache, usalo (velocissimo)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Altrimenti scaricalo da internet
      return fetch(e.request);
    })
  );
});