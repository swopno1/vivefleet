self.addEventListener("install", (evt) => {
  self.skipWaiting();
});
self.addEventListener("fetch", (evt) => {
  /* Cache-first strategy for tiles and API */
});
self.addEventListener("sync", (evt) => {
  if (evt.tag === "sync-positions") evt.waitUntil(syncPositions());
});
