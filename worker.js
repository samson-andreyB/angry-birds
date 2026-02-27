const APP_CACHE = "angrybirds-v2";

const filesToCache = [
	"AngryBirds.htm",
	"AngryBirds.json",
	"AngryBirds.png",
	"AngryBirdsFavIcon_16x16.png",
	"AngryBirdsFavIcon_192x192.png",
	"AngryBirdsFavIcon_512x512.png",
	"AngryBirdsGame.htm",
	"AngryBirdsGame.js",
	"AngryBirdsShare.png"
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
