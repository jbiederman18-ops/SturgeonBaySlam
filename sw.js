'use strict';
// Bump this and every HTML asset query together for an atomic shell update.
const VERSION='v7.94';
const CACHE_PREFIX=`sturgeon-bay-slam-shell:${self.registration.scope}:`;
const CACHE_NAME=CACHE_PREFIX+VERSION;
const SHELL=[
 './index.html','./manifest.webmanifest?v=7.94','./icons/window-card-180.png',
 './icons/window-card-192.png','./icons/window-card-512.png','./icons/window-card-32.png',
 './icons/window-card-152.png','./icons/window-card-167.png',
 ...['style','bootleg','exchange','booking','multi','career','stories','webapp','tour','snafu','desk','collage','press','poster','calls','pick','relationships','townmap','cutscenes','tutorial','aftershow','flyer','title'].map(name=>`./${name}.css?v=7.94`),
 ...['matches','portraits','moments','exchange','kayfabe','booking','pick','career','stories','snafu','ledger','routes','roster','relationships','townmap','opening','tutorial','webapp','progression','rise','aftershow','game','dropdowns'].map(name=>`./${name}.js?v=7.94`),
 './art/press-grain.svg','./art/press-harbor.svg','./art/press-dust.svg',
 './fonts/barlow-condensed-bold.woff2','./fonts/barlow-condensed-extrabold.woff2','./fonts/barlow-condensed-extrabold-italic.woff2','./fonts/dm-sans.woff2','./fonts/alfa-slab-one.woff2','./fonts/oswald-regular.woff2','./fonts/oswald-bold.woff2',
 ...Array.from({length:6},(_,i)=>`./art/paper-0${i}.jpg`),
 ...['liam-neesen','the-tooth','tessa-blanchard','rulebook-dog'].map(name=>`./art/${name}-v2.jpg`),'./art/good-lord-above.jpg'
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

