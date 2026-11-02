const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const scope='https://example.test/SturgeonBaySlam/';
const handlers={},stores=new Map(),requests=[];
let online=true,skipped=false,claimed=false;
class FakeCache{
 constructor(){this.values=new Map()}
 async addAll(items){
  const responses=await Promise.all(items.map(async request=>[request.url,await network(request)]));
  for(const [url,response] of responses)this.values.set(url,response);
 }
 async keys(){return [...this.values.keys()].map(url=>new Request(url))}
 async match(key){return this.values.get(typeof key==='string'?key:key.url)?.clone()}
}
async function network(request){
 if(!online)throw Error('Network unavailable');
 const url=new URL(typeof request==='string'?request:request.url);
 requests.push(url.href);
 assert.ok(url.pathname.startsWith('/SturgeonBaySlam/'),'Every precache request must stay inside the deployment subdirectory');
 const local=path.join(root,url.pathname.slice('/SturgeonBaySlam/'.length));
 return new Response(fs.readFileSync(local),{status:200});
}
const caches={async open(name){if(!stores.has(name))stores.set(name,new FakeCache());return stores.get(name)},async keys(){return [...stores.keys()]},async delete(name){return stores.delete(name)}};
const self={registration:{scope},clients:{async claim(){claimed=true}},async skipWaiting(){skipped=true},addEventListener(type,handler){handlers[type]=handler}};
const context=vm.createContext({self,caches,Request,Response,URL,Set,fetch:network});
vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8'),context);
async function lifecycle(type,extras={}){
 let pending=Promise.resolve(),response;
 const event={...extras,waitUntil(promise){pending=promise},respondWith(promise){response=promise}};
 handlers[type](event);await pending;return response&&await response;
}
(async()=>{
 await lifecycle('install');
 assert.equal(skipped,false,'Installation must not interrupt an active show');
 const shell=JSON.parse(vm.runInContext('JSON.stringify(SHELL)',context));
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const [,asset] of html.matchAll(/(?:href|src)="([^"]+)"/g))assert.ok(shell.includes('./'+asset),'Missing offline asset: '+asset);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
 assert.equal(manifest.display,'standalone');assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');assert.equal(manifest.id,'./');
 for(const icon of manifest.icons)assert.ok(fs.existsSync(path.join(root,icon.src)));
 assert.match(html,/viewport-fit=cover/);assert.doesNotMatch(html,/user-scalable=no|maximum-scale=1/);
 const dimensions={'apple-touch-icon.png':180,'icons/apple-touch-icon-167.png':167,'icons/apple-touch-icon-152.png':152,'icons/icon-192.png':192,'icons/icon-512.png':512,'icons/icon-1024.png':1024,'icons/favicon-32.png':32};
 for(const [file,size] of Object.entries(dimensions)){
  const data=fs.readFileSync(path.join(root,file));assert.equal(data.readUInt32BE(16),size,file);assert.equal(data.readUInt32BE(20),size,file);assert.equal(data[25],2,'Icons should be opaque RGB PNGs');
 }
 const shellBytes=shell.reduce((n,file)=>n+fs.statSync(path.join(root,file.split('?')[0])).size,0);
 assert.ok(shellBytes<5_000_000,'Offline download should stay below 5 MB');
 stores.set('another-app-cache',new FakeCache());
 stores.set('sturgeon-bay-slam-shell:https://example.test/another-game/:v4',new FakeCache());
 stores.set('sturgeon-bay-slam-shell:'+scope+':v4',new FakeCache());
 await lifecycle('activate');assert.equal(claimed,true);assert.ok(stores.has('another-app-cache'));assert.ok(stores.has('sturgeon-bay-slam-shell:https://example.test/another-game/:v4'));assert.equal(stores.has('sturgeon-bay-slam-shell:'+scope+':v4'),false);
 online=false;requests.length=0;
 for(const route of [scope,scope+'index.html?resume=1']){
  const response=await lifecycle('fetch',{request:{method:'GET',mode:'navigate',url:route}});
  assert.match(await response.text(),/apple-touch-icon/);
 }
 for(const asset of shell){
  const response=await lifecycle('fetch',{request:new Request(new URL(asset,scope))});assert.equal(response.status,200);assert.ok((await response.arrayBuffer()).byteLength>0);
 }
 assert.equal(requests.length,0,'All shell assets and app navigations should work without the network');
 assert.equal(await lifecycle('fetch',{request:new Request('https://other.test/file.js')}),undefined);
 assert.equal(await lifecycle('fetch',{request:{method:'POST',mode:'same-origin',url:scope+'save'}}),undefined);
 assert.equal(await lifecycle('fetch',{request:{method:'GET',mode:'navigate',url:scope+'not-a-game-page'}}),undefined);
 let offlineStatus;
 await lifecycle('message',{data:{type:'OFFLINE_STATUS'},ports:[{postMessage(value){offlineStatus=value}}]});assert.equal(offlineStatus.ready,true);
 const current=await caches.open(vm.runInContext('CACHE_NAME',context));current.values.delete(new URL('./index.html',scope).href);
 await lifecycle('message',{data:{type:'OFFLINE_STATUS'},ports:[{postMessage(value){offlineStatus=value}}]});assert.equal(offlineStatus.ready,false,'Do not promise offline readiness after cache loss');
 await lifecycle('message',{data:{type:'SKIP_WAITING'}});assert.equal(skipped,true);
 // A half-downloaded release must fail installation and leave the older shell alone.
 const previous=new FakeCache();stores.set('old-working-shell',previous);
 await assert.rejects(lifecycle('install'),/Network unavailable/);assert.equal(stores.get('old-working-shell'),previous);
 console.log(`Passed: icons, manifest, scoped offline shell, ${shell.length} cached assets (${(shellBytes/1e6).toFixed(2)} MB), offline navigations, update waiting, safe cache cleanup, failed installation and cache-loss detection.`);
})().catch(error=>{console.error(error);process.exitCode=1});
