const CACHE_NAME = "albaz-lore-v30"; // Versione 30
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./screenshot.png"
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
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Se trova il file nella cache, lo restituisce
      if (response) {
        return response;
      }
      
      // TRUCCO: Se la richiesta è per la cartella root, restituisci index.html dalla cache
      // Questo risolve il problema di GitHub Pages!
      if (e.request.url.endsWith('/Storia-dell-Abisso/') || e.request.url.endsWith('/')) {
         return caches.match('./index.html');
      }

      // Altrimenti prova a scaricare da internet
      return fetch(e.request);
    })
  );
});