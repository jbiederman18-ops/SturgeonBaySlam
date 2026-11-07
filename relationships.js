'use strict';
// Relationship layer · vertical slice.
// Affection is the existing per-wrestler trust value, never shown as a number for featured wrestlers.
// Everything stays in kayfabe: replies that respect a wrestler's world warm them up; breaking it is the worst move.
// Engine only. All dialogue and route data lives in routes.js, which loads first.

const PLAY_STYLES={believer:'Believer',straight:'Straight Man',hype:'Hype Man',bureaucrat:'Bureaucrat'};
// Open design question: 2 or 3 free evenings per week. One constant so the answer is a one-line change.
const EVENING_SLOTS=2;
const INVITES_PER_WEEK=EVENING_SLOTS+1;
const WEEK_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const AFFECTION_TIERS=['wary','friendly','warm','devoted'];

function isFeatured(id){return Object.hasOwn(FEATURED_ROUTES,id)}
function relations(){migrateRelationships(state);return state.relations}
function sweepsRoute(){return relations().routes['10']}
function easyMode(){return !!state.preferences?.easyMode}
function affectionTier(r){const t=r.trust;return t<45?'wary':t<65?'friendly':t<80?'warm':'devoted'}
function tellFor(r){return FEATURED_ROUTES[r.id].tells[affectionTier(r)]}
// Featured wrestlers show a tell instead of a trust number.
function trustReadout(r){return isFeatured(r.id)?tellFor(r):`Trust ${r.trust}/100`}
function signoffFor(r){return FEATURED_ROUTES[r.id].signoff[affectionTier(r)]}
function playStyle(){
 const counts=relations().style,best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
 return best&&best[1]>0?best[0]:null;
}
function reputationLine(){const style=playStyle();return style?`The locker room has you down as a ${PLAY_STYLES[style]}.`:'The locker room hasn’t made up its mind about you yet.'}
function nextEventWeek(week=state.week){return week%4===0?week+4:Math.ceil(week/4)*4}
function soreLine(id){
 const route=FEATURED_ROUTES[id],when=relations().sore[id];
 return when!=null&&state.week-when<(route.soreWeeks||4)?route.sore:'';
}

function sweepsBeat(){
 const arc=state.arc,route=sweepsRoute(),r=w(10);
 if(!r||route.ending)return null;
 if(arc&&state.week<arc.start+4)return null; // the spotlight month already gives Sweeps the backstage scenes
 if(route.ask?.status==='accepted')return route.ask.due===state.week&&!route.ask.vigil?'vigil':null;
 if(!route.beats.afterHours)return 'after-hours';
 if(!route.beats.path)return r.trust>=55?'path':null;
 if(!route.flags.stain&&r.trust>=70&&r.lastSeen===state.week-1)return 'stain';
 const askReady=!route.ask||route.ask.status==='deferred'&&state.week>=route.ask.again;
 if(askReady&&r.trust>=75)return 'ask';
 return null;
}
function briefingActor(){return state.weeklyBriefing?.request.actor??backstageConversation().actor}
function buildInvites(){
 const rel=relations(),backstage=briefingActor(),list=[],beat=sweepsBeat();
 if(beat)list.push({actor:10,beat});
 const others=FEATURED_IDS.filter(id=>id!==10&&id!==backstage&&w(id)).sort((a,b)=>(rel.lastInvited[a]||0)-(rel.lastInvited[b]||0)||a-b);
 while(list.length<INVITES_PER_WEEK&&others.length){const id=others.shift();list.push({actor:id,beat:'visit-'+((rel.visits[id]||0)%FEATURED_ROUTES[id].scenes.length)})}
 const open=WEEK_DAYS.filter(day=>day!=='Sunday'&&day!=='Friday');let next=0;
 for(const invite of list){
  rel.lastInvited[invite.actor]=state.week;
  invite.day=invite.beat==='vigil'?'Friday':FEATURED_ROUTES[invite.actor].days?.[0]||open[next++%open.length];
  invite.id=`${state.week}-${invite.actor}`;
 }
 return list.sort((a,b)=>WEEK_DAYS.indexOf(a.day)-WEEK_DAYS.indexOf(b.day));
}
function ensureWeekAhead(){
 const rel=relations();
 if(rel.week?.week===state.week)return rel.week;
 // A flag event that passed unanswered is gone for good.
 if(rel.week)for(const invite of rel.week.invites)if(invite.beat==='stain'&&!rel.week.answers[invite.id])sweepsRoute().flags.stain='missed';
 rel.week={week:state.week,invites:[],spent:[],answers:{}};
 rel.week.invites=buildInvites();
 return rel.week;
}
function eveningsLeft(){const week=ensureWeekAhead();return Math.max(0,EVENING_SLOTS-week.spent.length)}
function sceneFor(invite){
 const route=FEATURED_ROUTES[invite.actor];
 if(invite.actor===10&&SWEEPS_BEATS[invite.beat])return {place:route.place,...SWEEPS_BEATS[invite.beat]};
 return {place:route.place,...route.scenes[Number(invite.beat.split('-')[1])||0]};
}
function inviteMessage(invite){
 const r=w(invite.actor),tier=affectionTier(r),route=FEATURED_ROUTES[invite.actor],scene=sceneFor(invite);
 if(scene.invite)return {text:scene.invite,texted:true};
 return tier==='wary'?{text:route.invite.wary,texted:false}:{text:route.invite[tier==='friendly'?'friendly':'warm'],texted:true};
}
function replyDelta(actor,reply){
 if(Number.isFinite(reply.delta))return reply.delta;
 if(reply.breaks)return -6;
 const style=FEATURED_ROUTES[actor].style;
 return (reply.style===style?6:2)+(playStyle()===style?1:0);
}
function replyChips(actor,reply){
 const delta=replyDelta(actor,reply),chips=[{stat:'trust',label:delta>=6?'Warms to this ▲▲':delta>0?'Small step ▲':reply.breaks?'Breaks their world ▼':'Cools things ▼'}];
 if(reply.promise||reply.ask==='accept')chips.push({stat:'promise',label:'Makes a promise'});
 return chips;
}
function sweepsPayoff(invite,reply){
 const route=sweepsRoute();
 if(invite.beat==='after-hours')route.beats.afterHours=state.week;
 if(invite.beat==='path')route.beats.path=state.week;
 if(invite.beat==='stain'){
  route.flags.stain='seen';route.memories.push({id:'stain',week:state.week});
  if(reply.promise&&!state.plans[state.week+1])state.plans[state.week+1]='Sweeps faces the Unsweepable Stain';
 }
 if(invite.beat==='vigil')route.ask.vigil=true;
 if(invite.beat==='ask'){
  if(reply.ask==='accept'){
   const due=nextEventWeek();makePromise(10,'title',due);
   const promise=state.promises.find(p=>p.actor===10&&p.kind==='title'&&p.status==='open');
   route.ask={status:'accepted',week:state.week,due,promiseId:promise?.id||null,vigil:false};
   return `A title match for Sweeps at ${monthlyEventName(due)} · due week ${due}`;
  }
  if(reply.ask==='defer')route.ask={status:'deferred',week:state.week,again:state.week+4};
  if(reply.ask==='decline'){route.ask={status:'declined',week:state.week};route.ending='bad'}
 }
 return null;
}
// Applies one evening's reply. Returns false if it cannot be spent.
function answerScene(id,index){
 if(state.liveShow||state.recap)return false;
 const week=ensureWeekAhead(),invite=week.invites.find(item=>item.id===id);
 if(!invite||week.answers[id]||eveningsLeft()<=0)return false;
 const scene=sceneFor(invite),reply=scene.replies[index];if(!reply)return false;
 const rel=relations(),r=w(invite.actor),delta=replyDelta(invite.actor,reply);
 r.trust=clamp(r.trust+delta);
 if(reply.style)rel.style[reply.style]++;
 if(reply.breaks)rel.sore[invite.actor]=state.week;
 if(invite.beat.startsWith('visit-'))rel.visits[invite.actor]=(rel.visits[invite.actor]||0)+1;
 week.answers[id]={reply:index};week.spent.push(id);
 let payoff=null;
 if(reply.promise){
  const due=state.week+(reply.due||0),had=state.promises.some(p=>p.actor===invite.actor&&p.kind===reply.promise&&p.status==='open');
  makePromise(invite.actor,reply.promise,due);
  payoff=had?'Already on the promise ledger':promiseLabel(state.promises.filter(p=>p.actor===invite.actor&&p.kind===reply.promise).at(-1));
 }
 if(invite.actor===10)payoff=sweepsPayoff(invite,reply)||payoff;
 week.answers[id].payoff=payoff;
 incident(`An evening with ${r.name} at ${scene.place.split(' (')[0]}.${payoff?' '+payoff+'.':''}`,[invite.actor],'relationship');
 return true;
}
// Runs after promises resolve at the end of a show.
function relationshipWeekEnd(fallout){
 const route=sweepsRoute(),ask=route.ask;
 if(ask?.status!=='accepted'||route.ending)return;
 const promise=state.promises.find(p=>p.id===ask.promiseId);
 if(promise?.status==='kept')route.ending=ask.vigil?'best':'neutral';
 else if(promise?.status==='broken')route.ending='bad';
 if(route.ending){route.endedWeek=state.week;fallout.push(incident(SWEEPS_ENDINGS[route.ending].line,[10],'aftermath'))}
}

function inviteCard(invite,left){
 const r=w(invite.actor),week=ensureWeekAhead(),answer=week.answers[invite.id],scene=sceneFor(invite),message=inviteMessage(invite),tier=affectionTier(r);
 const action=answer?`<span class="invite-status">Evening spent ✓</span>`:left?`<button type="button" class="btn ${scene.flag?'primary':''}" data-week-scene="${invite.id}" aria-label="${esc((scene.flag?'Go now: ':'Spend the evening with ')+r.name)}">${scene.flag?'Go now':'Spend the evening'}</button>`:`<span class="invite-status">No evenings left</span>`;
 return `<li class="invite mood-${tier} ${answer?'is-spent':''} ${scene.flag?'is-flag':''}" style="--character-color:${r.color}"><div class="invite-art">${portrait(r)}</div><div class="invite-copy"><small>${esc(invite.day)} · ${esc(scene.place.split(' (')[0])}</small><strong>${esc(r.name)}</strong>${scene.flag&&!answer?'<span class="invite-flag">Only this week</span>':''}<p class="${message.texted?'invite-text':'invite-narration'}">${message.texted?'<span class="sr-only">Text message: </span>':''}${esc(message.text)}</p></div>${action}</li>`;
}
function weekAheadPanel(){
 const week=ensureWeekAhead(),left=eveningsLeft();
 const dots=Array.from({length:EVENING_SLOTS},(_,i)=>`<i class="${i<EVENING_SLOTS-left?'used':''}"></i>`).join('');
 return `<section class="card week-ahead" id="week-ahead" aria-labelledby="week-ahead-title"><div class="week-ahead-head"><h3 id="week-ahead-title">The week ahead</h3><span class="evening-dots" role="img" aria-label="${left} of ${EVENING_SLOTS} evenings free">${dots}</span></div><p class="note">${esc(reputationLine())} ${left?`${left} free evening${left===1?'':'s'}. Whoever you don’t see this week, you don’t see.`:'Your evenings are spoken for.'}</p><ol class="invite-list">${week.invites.map(invite=>inviteCard(invite,left)).join('')}</ol><label class="easy-toggle"><input type="checkbox" data-easy-mode ${easyMode()?'checked':''}> Show what replies change (easy mode)</label></section>`;
}
function sceneMarkup(invite){
 const r=w(invite.actor),week=ensureWeekAhead(),answer=week.answers[invite.id],scene=sceneFor(invite),tier=affectionTier(r);
 const used=week.spent.length-(answer?1:0),sore=soreLine(invite.actor),speaker=FEATURED_ROUTES[invite.actor].speaker;
 const direction=`${tellFor(r)}${sore?` Before anything else: “${sore}”`:''}`;
 const replies=answer?'':`<p class="scene-prompt">How do you answer?</p><div class="scene-replies">${scene.replies.map((reply,i)=>`<button type="button" class="scene-reply" data-scene-reply="${i}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body"><strong>${esc(reply.text)}</strong>${easyMode()?effectChips(replyChips(invite.actor,reply),'What this reply changes'):''}</span></button>`).join('')}</div>`;
 const chosen=answer?scene.replies[answer.reply]:null;
 const reaction=answer?`<div class="scene-reaction"><p class="scene-you"><small>You said</small>${esc(chosen.text)}</p><p>${esc(chosen.reaction)}</p><p class="scene-signoff">“${esc(signoffFor(r))}”</p>${answer.payoff?`<p class="scene-payoff"><small>On the booking sheet</small>${esc(answer.payoff)}</p>`:''}${invite.actor===10&&sweepsRoute().memories.some(m=>m.week===state.week)&&invite.beat==='stain'?`<p class="scene-payoff"><small>Scrapbook</small>A polaroid is pinned to his window card.</p>`:''}<button type="button" class="btn primary" id="scene-done">Back to the week →</button></div>`:'';
 return `<form class="scene-form"><header class="scene-bar"><span class="scene-brand">The week ahead</span><span>Week ${state.week} · ${esc(invite.day)}</span><span>Evening ${Math.min(EVENING_SLOTS,used+1)} of ${EVENING_SLOTS}</span></header><div class="scene-body"><section class="scene-cast" style="--character-color:${r.color}"><div class="scene-place">${esc(scene.place)}</div><div class="scene-portrait" data-mood="${tier}">${portrait(r)}${tier==='devoted'?'<span class="scene-heart" aria-hidden="true">♥</span>':''}</div><h2 id="scene-title" tabindex="-1">${esc(r.name)}</h2><p class="scene-gimmick">${esc(r.gimmick)}</p></section><section class="scene-talk">${scene.flag?'<span class="scene-flag">Only this week</span>':''}<p class="scene-direction">${esc(direction)}</p><blockquote class="scene-line"><span class="scene-speaker">${esc(speaker)}</span>“${esc(scene.line)}”</blockquote>${replies}${reaction}</section></div></form>`;
}
// Plays one evening in the shared dialog. `back` returns to wherever the scene was opened from.
function openWeekAheadScene(id,back){
 const invite=ensureWeekAhead().invites.find(item=>item.id===id);if(!invite)return;
 const d=$('#modal'),wasOpen=d.open;
 const draw=()=>{
  d.className='week-ahead-scene';d.setAttribute('aria-labelledby','scene-title');d.innerHTML=sceneMarkup(invite);
  d.querySelectorAll('[data-scene-reply]').forEach(button=>button.onclick=()=>{if(answerScene(id,Number(button.dataset.sceneReply))){save();draw()}});
  const done=d.querySelector('#scene-done');if(done)done.onclick=()=>back();
  d.querySelector('form').onsubmit=event=>event.preventDefault();
  if(!d.open)d.showModal();d.scrollTop=0;d.querySelector('#scene-title').focus({preventScroll:true});
 };
 if(!wasOpen){d.oncancel=null;d.onclose=()=>{if(!d.open){d.removeAttribute('aria-labelledby');render()}}}
 draw();
}
function bindWeekAhead(scope=document,back=null){
 const root=scope.querySelector?.('#week-ahead');if(!root)return;
 const leave=back||(()=>{const d=$('#modal');d.close()});
 root.querySelectorAll('[data-week-scene]').forEach(button=>button.onclick=()=>openWeekAheadScene(button.dataset.weekScene,leave));
 const easy=root.querySelector('[data-easy-mode]');
 if(easy)easy.onchange=()=>{state.preferences.easyMode=easy.checked;save();if(back)back();else render()};
}

function promiseLedger(){
 const open=state.promises.filter(p=>p.status==='open').sort((a,b)=>a.due-b.due),recent=state.promises.filter(p=>p.status!=='open'&&p.resolved>=state.week-4).slice(-5).reverse();
 const due=p=>p.due<=state.week?'Tonight':p.due===state.week+1?'Next week':`In ${p.due-state.week} weeks`;
 const rows=open.map(p=>`<li class="ledger-row ${p.due<=state.week?'is-due':''} ${isFeatured(p.actor)?'is-route':''}"><span class="ledger-art">${portrait(w(p.actor))}</span><span class="ledger-what"><strong>${esc(w(p.actor).name)}</strong>${esc(promiseWhat(p))}</span><span class="ledger-due">${due(p)}<small>Week ${p.due}</small></span><span class="ledger-state">${promiseMet(p)?'On the card ✓':'Not booked yet'}</span></li>`).join('');
 return `<section class="card promise-ledger" id="promise-ledger" aria-labelledby="ledger-title"><div class="ledger-head"><h3 id="ledger-title">Promise ledger</h3><span>Your word, in writing</span></div>${rows?`<ol>${rows}</ol>`:'<p class="note">No open promises. Your word is clear.</p>'}${recent.length?`<ul class="ledger-history" aria-label="Recently settled">${recent.map(p=>`<li class="${p.status}">${p.status==='kept'?'Kept':'Broken'} · ${esc(w(p.actor).name)} · week ${p.resolved}</li>`).join('')}</ul>`:''}</section>`;
}
function windowCard(r){
 if(!isFeatured(r.id))return '';
 const route=FEATURED_ROUTES[r.id],tier=affectionTier(r),sweeps=r.id===10?sweepsRoute():null;
 const knownStyle=['warm','devoted'].includes(tier)?PLAY_STYLES[route.style]:'Keep talking to find out';
 const memories=sweeps?SWEEPS_MEMORIES.map(m=>{const found=sweeps.memories.find(x=>x.id===m.id),missed=sweeps.flags[m.id]==='missed';return `<figure class="polaroid ${found?'':'is-empty'}">${found?`<div class="polaroid-art">${portrait(r)}</div><figcaption><strong>${esc(m.title)}</strong>${esc(m.caption.replace('{week}',found.week))}</figcaption>`:`<div class="polaroid-art"></div><figcaption>${missed?'This moment passed you by.':'A memory not made yet'}</figcaption>`}</figure>`}).join(''):'';
 const complete=sweeps&&SWEEPS_MEMORIES.every(m=>sweeps.memories.some(x=>x.id===m.id));
 const ending=sweeps?.ending?SWEEPS_ENDINGS[sweeps.ending]:null;
 return `<section class="window-card" style="--character-color:${r.color}">${complete?'<div class="window-banner">Main event</div>':''}<small>Window card</small><p class="window-tell">${esc(tellFor(r))}</p><dl><div><dt>Finds them at</dt><dd>${esc(route.place)}</dd></div><div><dt>Signs off</dt><dd>“${esc(signoffFor(r))}”</dd></div><div><dt>Warms to</dt><dd>${esc(knownStyle)}</dd></div></dl>${sweeps?`<div class="scrapbook" aria-label="Scrapbook">${memories}</div>`:'<p class="note">Their scrapbook opens when their full route is written.</p>'}${ending?`<p class="window-ending"><small>Era I ending</small><strong>${esc(ending.title)}</strong></p>`:''}</section>`;
}
