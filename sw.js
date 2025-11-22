const CACHE_NAME = 'promocity-v2';
const ASSETS = [
  './',
  './index.html',
  './comercio.html',
  './planos.html',
  './css/style.css',
  './js/script.js',
  './data/comercios.json',
  './data/promocoes.json',
  './data/stories.json',
  './data/categorias.json'
];

// Instalação (Salva os arquivos)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Intercepta carregamento (Funciona Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
