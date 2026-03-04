const APP_CACHE = "kolobok-v4";

const filesToCache = [
	"index.html",
	"Kolobok.json",
	"assets/meta/KolobokFavIcon_16x16.png",
	"assets/meta/KolobokFavIcon_192x192.png",
	"assets/meta/KolobokFavIcon_512x512.png",
	"KolobokGame.html",
	"KolobokGame.js",
	"assets/meta/KolobokShare.png"
];

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(APP_CACHE).then(cache => cache.addAll(filesToCache))
	);
	self.skipWaiting();
});

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys
					.filter(key => key !== APP_CACHE)
					.map(key => caches.delete(key))
			)
		)
	);
	self.clients.claim();
});

self.addEventListener("fetch", event => {
	if (event.request.method !== "GET") {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then(response => {
				if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
					const copy = response.clone();
					caches.open(APP_CACHE).then(cache => cache.put(event.request, copy));
				}
				return response;
			})
			.catch(() => caches.match(event.request))
	);
});
