const CACHE='hk-biosphere-shell-v6-api-fix';
const RUNTIME='hk-biosphere-runtime-v6-api-fix';
const CORE=['./','./index.html','./style.css','./script.js','./biosphere-upgrades.js','./manifest.webmanifest','./icon.svg','./final-polish.css','./final-polish.js','./assets/chitral-valley-hero.png','./assets/hindukush-fullscape.webp','./assets/markhor-vine-emblem.webp'];
const REMOTE_CACHE_HOSTS=['upload.wikimedia.org','thumb.wikimedia.org','api.inaturalist.org','static.inaturalist.org','cdn.jsdelivr.net','storage.googleapis.com','api.gbif.org','inaturalist-open-data.s3.amazonaws.com'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>![CACHE,RUNTIME].includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 const sameOrigin=url.origin===self.location.origin;
 const approvedRemote=REMOTE_CACHE_HOSTS.includes(url.hostname);
 if(!sameOrigin&&!approvedRemote)return;
 event.respondWith((async()=>{
   const cache=await caches.open(sameOrigin?CACHE:RUNTIME);
   const cached=await cache.match(req);
   if(cached){
     // Serve cached images/model files immediately; refresh in the background when online.
     if(approvedRemote)event.waitUntil(fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))return cache.put(req,r.clone())}).catch(()=>{}));
     return cached;
   }
   try{
     const response=await fetch(req);
     if(response&&(response.ok||response.type==='opaque'))event.waitUntil(cache.put(req,response.clone()));
     return response;
   }catch(error){
     if(sameOrigin)return (await caches.match('./index.html'))||Response.error();
     return Response.error();
   }
 })());
});
