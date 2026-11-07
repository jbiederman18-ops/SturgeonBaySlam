'use strict';
let webAppRegistration=null,webAppOfflineReady=false,webAppUpdateRequested=false,webAppOfflineError=false;
let careerStorageUnavailable=false;
function standaloneMode(){return !!navigator.standalone||window.matchMedia('(display-mode: standalone)').matches}
function webAppPanel(compact=false){
 const body=`<img class="webapp-icon" src="icons/window-card-192.png" alt="" width="64" height="64"><h3>Install Bay Slam</h3><p>Install Bay Slam for a full-screen game, then play offline once the game is ready.</p><ol><li>Open this game in Safari.</li><li>Tap <strong>Share → Add to Home Screen</strong>.</li><li>Keep <strong>Open as Web App</strong> enabled if offered, then tap <strong>Add</strong>.</li><li>Open the new Home Screen app once while online. Wait for <strong>Ready for offline play</strong> before going offline.</li></ol><p class="webapp-cache-status" role="status"></p><p class="note">Already playing in Safari? Export your career from the Office, then import it in the Home Screen app. Safari and the installed app may keep separate saves. Keep a backup in Files.</p>`;
 return compact?`<details class="webapp-card compact"><summary>${standaloneMode()?'Your Home Screen game':'Install on your iPhone or iPad'}</summary>${body}</details>`:`<section class="webapp-card">${body}</section>`;
}
function refreshWebAppUI(){
 const online=navigator.onLine!==false;
 document.querySelectorAll('.webapp-cache-status').forEach(el=>{el.textContent=webAppOfflineReady?(online?'Ready for offline play. Your career saves on this device.':'Offline play is ready. Keep booking.'):webAppOfflineError?'Offline setup could not finish. You can play online; reopen the game to retry.':(online?'Preparing offline play… Keep this window open for a moment.':'Reconnect once to finish preparing offline play.');if(!('serviceWorker' in navigator)||!window.isSecureContext)el.textContent='Play online here. Offline installation needs an HTTPS site.'});
 const notice=document.getElementById('webapp-notice'),modalOpen=!!document.querySelector('dialog[open]');
 const waiting=!!webAppRegistration?.waiting&&!state.liveShow&&!modalOpen;
 if(notice)notice.hidden=!waiting;
 document.body.classList.toggle('has-app-update',waiting);
 const warning=document.getElementById('save-warning');if(warning)warning.hidden=!careerStorageUnavailable;
}
function requestCareerPersistence(){
 if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
}
async function checkOfflineStatus(){
 const worker=navigator.serviceWorker?.controller||webAppRegistration?.active;
 if(!worker)return;
 const channel=new MessageChannel();
 channel.port1.onmessage=event=>{webAppOfflineReady=event.data?.ready===true;channel.port1.close();refreshWebAppUI()};
 worker.postMessage({type:'OFFLINE_STATUS'},[channel.port2]);
}
function updateVisibleHeight(){
 if(window.visualViewport&&window.visualViewport.scale!==1)return;
 document.documentElement.style.setProperty('--app-visible-height',`${Math.round(window.visualViewport?.height||window.innerHeight)}px`);
}
async function prepareWebApp(){
 updateVisibleHeight();window.visualViewport?.addEventListener('resize',updateVisibleHeight);window.addEventListener('resize',updateVisibleHeight);
 window.addEventListener('online',refreshWebAppUI);window.addEventListener('offline',refreshWebAppUI);
 document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){save()}
  else{updateVisibleHeight();webAppRegistration?.update().catch(()=>{});checkOfflineStatus()}
 });
 window.addEventListener('pagehide',()=>{save()});
 document.getElementById('apply-webapp-update')?.addEventListener('click',()=>{
  if(state.liveShow||document.querySelector('dialog[open]'))return;
  save();if(careerStorageUnavailable){toast('Export your career before restarting; this browser could not save it.');return}
  if(webAppRegistration?.waiting){webAppUpdateRequested=true;webAppRegistration.waiting.postMessage({type:'SKIP_WAITING'})}
 });
 const modal=document.getElementById('modal');
 if(modal)new MutationObserver(refreshWebAppUI).observe(modal,{attributes:true,attributeFilter:['open']});
 refreshWebAppUI();
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(webAppUpdateRequested)window.location.reload();else checkOfflineStatus()});
 try{
  webAppRegistration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
  webAppRegistration.addEventListener('updatefound',()=>{
   const worker=webAppRegistration.installing;
   worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){checkOfflineStatus();refreshWebAppUI()}});
  });
  if(webAppRegistration.active)await checkOfflineStatus();
  navigator.serviceWorker.ready.then(checkOfflineStatus).catch(()=>{});
  refreshWebAppUI();
 }catch{
  webAppOfflineError=true;refreshWebAppUI();
 }
}
document.addEventListener('DOMContentLoaded',prepareWebApp,{once:true});
