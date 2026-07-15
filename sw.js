// MXT Lab service worker — cleanup version.
// Replaces a prior compromised worker that loaded a third-party ad-injection
// script from 5gvci.com. This version actively unregisters itself and clears
// all caches so any browser that still has the old worker installed gets
// cleaned up on next visit, then stops running entirely.
//
// Once confirmed that returning visitors are clean (a few weeks of traffic),
// this file -- and any script that registers it -- can be removed outright.
// Do not reintroduce a service worker without reviewing exactly what it does
// and where every imported script comes from.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear any caches left behind by the old worker.
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      // Unregister this worker so it stops intercepting requests entirely.
      await self.registration.unregister();

      // Force any open tabs to reload without the worker controlling them.
      const clientsList = await self.clients.matchAll({ type: 'window' });
      clientsList.forEach((client) => client.navigate(client.url));
    })()
  );
});
