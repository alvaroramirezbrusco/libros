const CACHE_NAME = 'bookweb-v1'
const BASE_PATH = new URL('./', self.registration.scope).pathname
const APP_SHELL = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.webmanifest`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(`${BASE_PATH}index.html`, responseCopy)
          })
          return response
        })
        .catch(() => caches.match(`${BASE_PATH}index.html`))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response
        }

        const responseCopy = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy)
        })
        return response
      })
    })
  )
})
