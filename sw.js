'use strict';
// Bump this and every HTML asset query together for an atomic shell update.
const VERSION='v7.2';
const CACHE_PREFIX=`sturgeon-bay-slam-shell:${self.registration.scope}:`;
const CACHE_NAME=CACHE_PREFIX+VERSION;
const SHELL=[
 './index.html','./manifest.webmanifest?v=7.2','./apple-touch-icon.png',
 './icons/icon-192.png','./icons/icon-512.png','./icons/favicon-32.png',
 './icons/apple-touch-icon-152.png','./icons/apple-touch-icon-167.png',
 ...['style','bootleg','exchange','booking','multi','career','stories','webapp','tour','snafu'].map(name=>`./${name}.css?v=7.2`),
 ...['matches','portraits','moments','exchange','kayfabe','booking','career','stories','snafu','webapp','game'].map(name=>`./${name}.js?v=7.2`),
 './fonts/display.otf','./fonts/body.otf','./fonts/body-bold.otf',
 ...Array.from({length:6},(_,i)=>`./art/paper-0${i}.jpg`)
];
const shellURLs=new Set(SHELL.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})))));
 // A new shell waits until the player chooses to restart or all old windows close.
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME)await caches.delete(key);
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());
 if(event.data?.type==='OFFLINE_STATUS')event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME),keys=new Set((await cache.keys()).map(request=>request.url));
  event.ports[0]?.postMessage({ready:[...shellURLs].every(url=>keys.has(url)),version:VERSION});
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==scope.origin)return;
 const appNavigation=request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html');
 if(!appNavigation&&!shellURLs.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME),key=appNavigation?new URL('./index.html',scope).href:request;
  return await cache.match(key)||fetch(request);
 })());
});
