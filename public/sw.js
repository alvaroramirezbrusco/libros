// Subí el número cada vez que cambies este archivo -> fuerza el SW nuevo
const VERSION = 'v3'
const SHELL_CACHE = `bookweb-shell-${VERSION}`      // el "cascarón" de la app
const RUNTIME_CACHE = `bookweb-runtime-${VERSION}`  // JS/CSS/fuentes pedidos al vuelo
const DATA_CACHE = `bookweb-data-${VERSION}`        // respuestas de las APIs y portadas

// Ruta base donde vive la app (ej: "/" en local, "/libros/" en GitHub Pages).
// Se calcula del scope del SW, así no hay que hardcodear el path en ningún lado.
const SCOPE = new URL(self.registration.scope).pathname

const SHELL_ASSETS = [
  SCOPE,
  SCOPE + 'index.html',
  SCOPE + 'manifest.webmanifest',
  SCOPE + 'pwa-192.png',
  SCOPE + 'pwa-512.png',
]

// INSTALL: precachea el cascarón + los bundles con hash que usa index.html
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE)
    await cache.addAll(SHELL_ASSETS)

    // index.html referencia .../assets/index-XXXX.js y .css (el hash cambia en cada build);
    // los leemos del HTML y los precacheamos para que la app abra offline en la 1ª visita.
    try {
      const res = await fetch(SCOPE + 'index.html', { cache: 'no-cache' })
      const html = await res.text()
      const urls = [...html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)].map((m) => m[1])
      await Promise.all(urls.map((u) => cache.add(u).catch(() => {})))
    } catch {
      // sin conexión durante la instalación: los assets se cachean luego vía fetch
    }
  })())
  self.skipWaiting()
})

// ACTIVATE: borra los cachés de versiones viejas y toma control de las pestañas abiertas
self.addEventListener('activate', (event) => {
  const permitidas = [SHELL_CACHE, RUNTIME_CACHE, DATA_CACHE]
  event.waitUntil(
    caches.keys()
      .then((claves) =>
        Promise.all(
          claves.filter((c) => !permitidas.includes(c)).map((c) => caches.delete(c))
        )
      )
      .then(() => self.clients.claim())
  )
})

// FETCH: una estrategia según qué se pide
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // 1. Navegación entre páginas: intenta la red; si no hay, sirve el index.html cacheado
  //    (así la SPA arranca offline y react-router se encarga de la ruta)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () =>
        (await caches.match(SCOPE + 'index.html')) || caches.match(SCOPE)
      )
    )
    return
  }

  // 2. Portadas de Open Library -> cache-first (una vez bajadas no cambian)
  if (url.origin === 'https://covers.openlibrary.org') {
    event.respondWith(cacheFirst(request, DATA_CACHE, 120))
    return
  }

  // 3. APIs (Open Library / MyMemory) -> network-first:
  //    online traés datos frescos, offline devolvés la última respuesta guardada
  if (
    url.origin === 'https://openlibrary.org' ||
    url.origin === 'https://api.mymemory.translated.net'
  ) {
    event.respondWith(networkFirst(request, DATA_CACHE))
    return
  }

  // 4. Resto del mismo origen (JS, CSS, fuentes, íconos) -> stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
    return
  }
})

// ---------- helpers de estrategia ----------

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  try {
    const res = await fetch(request)
    if (res.ok) {
      cache.put(request, res.clone())
      if (maxEntries) trimCache(cacheName, maxEntries)
    }
    return res
  } catch {
    return Response.error()
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(request)
    if (res.ok) cache.put(request, res.clone())
    return res
  } catch {
    const hit = await cache.match(request)
    if (hit) return hit
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)

  if (hit) {
    // hay copia: la devolvemos ya y actualizamos en segundo plano
    fetch(request)
      .then((res) => { if (res.ok) cache.put(request, res.clone()) })
      .catch(() => {})
    return hit
  }

  // no hay copia: vamos a la red y la guardamos
  try {
    const res = await fetch(request)
    if (res.ok) cache.put(request, res.clone())
    return res
  } catch {
    return Response.error()
  }
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const claves = await cache.keys()
  if (claves.length > maxEntries) {
    await cache.delete(claves[0]) // borra la entrada más vieja
    trimCache(cacheName, maxEntries)
  }
}
