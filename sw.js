const CACHE_NAME = "albaz-lore-v24"; // Ho alzato la versione per forzare l'aggiornamento
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./screenshot.png"
];

// 1. Installazione
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Forza il SW ad attivarsi subito
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 2. Pulizia vecchie cache (MANCAVA QUESTO!)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Rimozione vecchia cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Prende subito il controllo della pagina
});

// 3. Fetch (Strategia: Cache First, Network Fallback)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});