'use strict';
// Relationship layer.
// Affection is the existing per-wrestler trust value, never shown as a number for featured wrestlers.
// Everything stays in kayfabe: replies that respect a wrestler's world warm them up; breaking it is the worst move.
// Engine only. All dialogue and route data lives in routes.js (format at its top), which loads first.

const PLAY_STYLES={believer:'Believer',straight:'Straight Man',hype:'Hype Man',bureaucrat:'Bureaucrat'};
// Open design question: 2 or 3 free evenings per week. One constant so the answer is a one-line change.
// Each free night offers a choice of who to see (NIGHT_CHOICES); the rest of the week is spoken for.
const EVENING_SLOTS=2;
const NIGHT_CHOICES=2;
// Drift: what you've built with a featured wrestler wears off once you go DRIFT_AFTER weeks without an evening
// together (DRIFT a week, never below where they started). Finished routes don't drift.
const DRIFT_AFTER=2,DRIFT=4,DRIFT_FLOOR=60;
// Only evenings carry a featured wrestler the last stretch: trust from the walk, kept promises, booking and
// other people's evenings stops at OFFSTAGE_CAP, below the later route beats and the Ask.
const OFFSTAGE_CAP=66;
const INVITES_PER_WEEK=EVENING_SLOTS*NIGHT_CHOICES;
// Route scenes can take every invitation but one, so there is always somebody new to drop in on.
const ROUTE_INVITES=INVITES_PER_WEEK-1;
const WEEK_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
// Which nights are free when no route insists on a day. Rotates by week so the free nights move around.
const NIGHT_PAIRS=[['Tuesday','Thursday'],['Monday','Wednesday'],['Wednesday','Thursday'],['Monday','Thursday'],['Tuesday','Wednesday']];
// What the booker is doing on the nights that aren't free (the town ribbon).
const BUSY_NIGHTS=['Office','Proofs','Chairs','Phones','Mats','Tickets'];
const AFFECTION_TIERS=['wary','friendly','warm','devoted'];
const ENDING_TIERS=['best','neutral','bad'];
const BEAT_KINDS=['beat','flag','ask','final'];
// Cutscene backdrops. A route may override with FEATURED_ROUTES[id].set.
const SCENE_SETS={0:'olympus',1:'barn',10:'hall',18:'tea',20:'craft',31:'library',34:'lanes',37:'yard'};
const SCENE_TIMES=['6:30 PM','7:15 PM','8:02 PM','9:40 PM'];
// The player's own exclamation when a reply lands, by the style of the reply.
const SHOUTS={believer:'I believe!',straight:'Noted.',hype:'Heck yes!',bureaucrat:'So moved!',breaks:'Come on…',truth:'Straight up.',accept:'Deal!',defer:'Hold on…',decline:'No.'};
// The relationship web from the cast bible, built on rivalry heat and team chemistry.
// grudge/irritation: warming one up makes the other jealous. one-sided/crush: only `a` gets jealous.
// friendship: their team bonds over it. Jealousy is full (trust cost, in-voice line) when the jealous
// wrestler had an unanswered invitation this week, so you passed them over; otherwise it's a soft tell.
const WEB_BONDS=[
 {a:0,b:34,bond:'grudge',label:'Grudge',meaning:'Greek rejected Liam for Demeter’s Baby. Liam kicked the director in the head and lost his SAG status; Greek has believed Wisconsin is ancient Greece ever since.'},
 {a:0,b:31,bond:'irritation',label:'Irritation',meaning:'Greek demands acclaim for Greco Wrestling. Ron demands an end to taking sides; each finds the other intolerable.'},
 {a:18,b:31,bond:'one-sided',label:'One-sided',meaning:'Charming thanks Ron for endorsements he never gave. Ron wants the schemes and the argument to end.'},
 {a:20,b:23,bond:'crush',era:1,label:'Crush',meaning:'A mixed tag team, or a heartbreak feud.'},
 {a:1,b:37,bond:'irritation',label:'Irritation',meaning:'The Dog escapes Hold One in ways 2 Holds cannot fit into his two-hold understanding of wrestling; the Dog wants another match to prove it.'},
 {a:10,b:20,bond:'irritation',label:'Irritation',meaning:'The Grinch showers everyone with affection and glitter. Sweeps cleans every speck and gets angrier with every new shower.'},
 {a:10,b:17,bond:'friendship',label:'Friendship',meaning:'Sweepstakes & Deductibles: their team grows when you look after one of them.'},
 // The wider roster (7.77). These wrestlers have no evenings; the bonds play out in the after-show walk
 // (`benched` when a one-sided `a` or either side of a rivalry sits out while the other works, `cutIn`
 // between rivals). `era` is the eraIndex() a bond goes live in; leave it off for "always".
 {a:9,b:37,bond:'one-sided',label:'Fear',meaning:'Mandy Mouse backs down from nobody twice her size. The Dog is the one exception, and she will not discuss it.'},
 {a:12,b:31,bond:'irritation',label:'Irritation',meaning:'Two correctors. Each one keeps correcting the other’s corrections.'},
 {a:28,b:18,bond:'one-sided',label:'One-sided',meaning:'Ted Turnsby keeps measuring himself against Charming Friendly. Charming has never noticed.'},
 {a:32,b:2,bond:'one-sided',label:'Follower',meaning:'Cleats goes wherever Rudy goes. Rudy keeps asking where his other shoe went.'},
 {a:17,b:2,bond:'one-sided',label:'One-sided',meaning:'The insurer has a folder of claims on Rudy’s legs. Rudy has never filed one.'},
 {a:22,b:29,bond:'friendship',label:'Friendship',meaning:'The Houseboat gives Freddie rides. Their team grows when you look after one of them.'},
 {a:26,b:7,bond:'friendship',label:'Friendship',meaning:'Two men certain they belong somewhere else. Their team grows when you look after one of them.'},
 {a:26,b:0,bond:'irritation',label:'Irritation',meaning:'Smark wants a traditional match. Greek only performs Greco Wrestling. Neither will budge.'},
 {a:24,b:0,bond:'one-sided',label:'One-sided',meaning:'Jesus keeps trying to save Greek, at every party. Greek bristles.'},
 {a:25,b:4,bond:'irritation',era:1,label:'Irritation',meaning:'Both want the whole crowd to move as one, on their count.'},
 {a:3,b:1,bond:'one-sided',label:'One-sided',meaning:'One Man resents being outnumbered by a man with fewer holds than One Man has members.'}
];
// A bond with an `era` stays dormant until the promotion reaches that era.
function bondLive(b){return !b.era||(typeof eraIndex==='function'&&eraIndex()>=b.era)}
function liveBonds(){return WEB_BONDS.filter(bondLive)}

function isFeatured(id){return Object.hasOwn(FEATURED_ROUTES,id)}
// Trust gained away from an evening together. Featured wrestlers stop at OFFSTAGE_CAP; losses always land.
function offstageTrust(r,delta){
 if(!r)return;
 if(delta>0&&isFeatured(r.id))r.trust=Math.max(r.trust,Math.min(OFFSTAGE_CAP,r.trust+delta));
 else r.trust=clamp(r.trust+delta);
}
// Featured routes first; the rest of the roster's spines live in roster.js (SUPPORTING_ROUTES).
function routeFor(id){return FEATURED_ROUTES[id]||(typeof SUPPORTING_ROUTES==='object'?SUPPORTING_ROUTES[id]:null)||null}
// How many promises a promise counts as toward what a show owes. Katy's segments run long.
function promiseWeight(p){return Number(routeFor(p?.actor)?.promiseWeight?.[p?.kind])||1}
function promisesOwed(due){return state.promises.filter(p=>p.status==='open'&&p.due===due).reduce((n,p)=>n+promiseWeight(p),0)}
function relations(){migrateRelationships(state);return state.relations}
function routeState(id){const rel=relations();return rel.routes[String(id)]??=blankRoute()}
function blankRoute(){return {beats:{},flags:{},memories:[],ask:null,ending:null}}
function sweepsRoute(){return routeState(10)}
function easyMode(){return !!state.preferences?.easyMode}
const AFFECTION_ORDER=['wary','friendly','warm','devoted'];
function affectionTier(r){const t=r.trust;return t<45?'wary':t<65?'friendly':t<80?'warm':'devoted'}
function tellFor(r){return FEATURED_ROUTES[r.id].tells[affectionTier(r)]}
// Featured wrestlers show a tell instead of a trust number.
function trustReadout(r){return isFeatured(r.id)&&!easyMode()?tellFor(r):`Trust ${r.trust}/100`}
// Short form for crowded rows (roster cards, chips).
function trustShort(r){return isFeatured(r.id)&&!easyMode()?'♥ Read them in the Locker Room':`Trust ${r.trust}/100`}
function signoffFor(r){return FEATURED_ROUTES[r.id].signoff[affectionTier(r)]}
function playStyle(){
 const counts=relations().style,best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
 return best&&best[1]>0?best[0]:null;
}
function reputationLine(){const style=playStyle();return style?`The locker room has you down as a ${PLAY_STYLES[style]}.`:'The locker room hasn’t made up its mind about you yet.'}
function nextEventWeek(week=state.week){return week%4===0?week+4:Math.ceil(week/4)*4}
function soreLine(id){
 const route=routeFor(id),when=relations().sore[id];
 return route&&when!=null&&state.week-when<(route.soreWeeks||4)?route.sore||route.backstage?.skip||'Still sore.':'';
}
// Post-show wording for a featured wrestler's reaction to a kept or broken promise.
function promiseReaction(id,kept){
 const r=w(id),reacts=FEATURED_ROUTES[id]?.reacts;
 return reacts?.[kept?'kept':'broken']||tellFor(r);
}
// Story-effect fallout: hide the trust part of a summary when any featured wrestler is involved.
function trustPhrase(ids,delta){
 if(!easyMode()&&ids.some(isFeatured))return '';
 return `trust ${delta>0?'+':'−'}${Math.abs(delta)}`;
}

// ---------- Route stories ----------
function camelBeat(id){return id.replace(/-(\w)/g,(_,c)=>c.toUpperCase())}
function beatKind(beat){return BEAT_KINDS.includes(beat?.kind)?beat.kind:beat?.flag?'flag':'beat'}
// A story plays only when it is finished enough not to strand the player: an Ask with accept and
// decline, and all three endings. Unfinished stories leave the wrestler on drop-in scenes.
function storyComplete(story){
 if(!story||typeof story!=='object'||!story.beats||typeof story.beats!=='object')return false;
 const beats=Object.values(story.beats);
 if(!beats.length||beats.some(b=>typeof b?.line!=='string'||!Array.isArray(b.replies)||!b.replies.length))return false;
 const ask=beats.find(b=>beatKind(b)==='ask');
 if(!ask||!['accept','decline'].every(kind=>ask.replies.some(reply=>reply.ask===kind)))return false;
 return ENDING_TIERS.every(tier=>typeof story.endings?.[tier]?.title==='string'&&typeof story.endings[tier].line==='string');
}
function routeStory(id){const story=ROUTE_STORIES?.[id];return storyComplete(story)?story:null}
function storyBeats(story){return Object.entries(story.beats).map(([id,beat])=>({id,beat,kind:beatKind(beat)}))}
function inSpotlight(){const arc=state.arc;return !!arc&&state.week<arc.start+4}
function lastResults(){const res=relations().results;return res?.week===state.week-1?res:null}
// Every key in `when` must hold. Unknown keys are ignored so a writer's new idea never breaks a week.
function conditionsMet(id,when={}){
 const r=w(id),rel=relations(),res=lastResults();
 if(!r)return false;
 const checks={
  minTrust:n=>r.trust>=n,
  visits:n=>(rel.visits[id]||0)>=n,
  afterSpotlight:on=>!on||!inSpotlight(),
  workedLastWeek:on=>!on||r.lastSeen===state.week-1,
  lostLastShow:on=>!on||!!res?.lost.includes(id),
  wonLastShow:on=>!on||!!res?.won.includes(id),
  eventWeek:on=>!on||isEvent(),
  notEventWeek:on=>!on||!isEvent(),
  champion:on=>!!r.champ===!!on,
  withLastWeek:other=>w(other)?.lastSeen===state.week-1,
  beatenByCheat:on=>!on||!!res?.cheatLosses?.includes(id),
  cheatedLastShow:on=>!on||!!res?.cheatWins?.includes(id)
 };
 return Object.entries(when||{}).every(([key,value])=>!checks[key]||checks[key](value));
}
function routeOpen(id){const story=routeStory(id);return !!story&&conditionsMet(id,story.opens||{visits:1})}
function dropInsOpen(id){
 const story=ROUTE_STORIES?.[id];
 return !!FEATURED_ROUTES[id].scenes?.length&&!(story?.opens?.afterSpotlight&&inSpotlight());
}
// Which route scene, if any, this wrestler has for you this week.
function routeBeat(id){
 const story=routeStory(id),route=routeState(id);
 if(!story||!w(id)||route.ending||!routeOpen(id))return null;
 const beats=storyBeats(story);
 if(route.ask?.status==='accepted'){
  const final=beats.find(b=>b.kind==='final');
  return final&&route.ask.due===state.week&&!route.ask.final&&conditionsMet(id,final.beat.when)?final.id:null;
 }
 for(const {id:beatId,beat,kind} of beats){
  if(kind==='beat'){if(route.beats[camelBeat(beatId)]!=null)continue;return conditionsMet(id,beat.when)?beatId:null}
  if(kind==='flag'){if(route.flags[beatId])continue;if(conditionsMet(id,beat.when))return beatId;continue}
  if(kind==='ask'){
   const ready=!route.ask||route.ask.status==='deferred'&&state.week>=route.ask.again;
   return ready&&conditionsMet(id,beat.when)?beatId:null;
  }
 }
 return null;
}
function sweepsBeat(){return routeBeat(10)}
function beatFor(invite){return invite.beat.startsWith('visit-')?null:routeStory(invite.actor)?.beats[invite.beat]||null}
const BEAT_PRIORITY={flag:0,final:1,ask:2,beat:3};

// The old smoke-break request no longer takes anyone out of the week ahead.
function briefingActor(){return null}
function fixedDay(invite){return beatFor(invite)?.day||FEATURED_ROUTES[invite.actor].days?.[0]||null}
function isUrgentKind(invite){return ['flag','ask','final'].includes(beatFor(invite)?beatKind(beatFor(invite)):'visit')?1:0}
function byDay(a,b){return WEEK_DAYS.indexOf(a)-WEEK_DAYS.indexOf(b)}
// The free nights this week: any day a route insists on first, then the week's usual pair.
function planNights(list){
 const want=Math.min(EVENING_SLOTS,list.length),nights=[];
 for(const invite of list){const day=fixedDay(invite);if(day&&!nights.includes(day)&&nights.length<want)nights.push(day)}
 for(const day of [...NIGHT_PAIRS[(Math.max(1,state.week)-1)%NIGHT_PAIRS.length],'Tuesday','Thursday','Monday','Wednesday'])if(nights.length<want&&!nights.includes(day))nights.push(day);
 return nights.sort(byDay);
}
function buildInvites(){
 const rel=relations(),backstage=briefingActor(),list=[];
 const routed=FEATURED_IDS.map(id=>({actor:id,beat:routeBeat(id)})).filter(x=>x.beat).map(x=>({...x,kind:beatKind(routeStory(x.actor).beats[x.beat])}))
  .sort((a,b)=>BEAT_PRIORITY[a.kind]-BEAT_PRIORITY[b.kind]||seenLately(b.actor)-seenLately(a.actor)||(rel.lastInvited[a.actor]||0)-(rel.lastInvited[b.actor]||0)||a.actor-b.actor);
 for(const item of routed)if(list.length<ROUTE_INVITES||item.kind==='flag'||item.kind==='final')list.push({actor:item.actor,beat:item.beat});
 const others=FEATURED_IDS.filter(id=>!list.some(x=>x.actor===id)&&id!==backstage&&w(id)&&dropInsOpen(id)).sort((a,b)=>(rel.lastInvited[a]||0)-(rel.lastInvited[b]||0)||a-b);
 while(list.length<INVITES_PER_WEEK&&others.length){const id=others.shift();list.push({actor:id,beat:'visit-'+((rel.visits[id]||0)%FEATURED_ROUTES[id].scenes.length)})}
 const nights=planNights(list),load=Object.fromEntries(nights.map(d=>[d,{all:0,urgent:0}])),cap=Math.ceil(list.length/Math.max(1,nights.length));
 const place=(invite,day)=>{invite.day=day;load[day].all++;if(isUrgentKind(invite))load[day].urgent++};
 const fixed=list.filter(i=>nights.includes(fixedDay(i)));
 for(const invite of fixed)place(invite,fixedDay(invite));
 // Urgent scenes spread across nights so two of them never compete for the same evening.
 for(const invite of list.filter(i=>!i.day).sort((a,b)=>isUrgentKind(b)-isUrgentKind(a))){
  const open=nights.filter(d=>load[d].all<cap),pool=open.length?open:nights;
  const day=pool.slice().sort((a,b)=>(isUrgentKind(invite)?load[a].urgent-load[b].urgent:0)||load[a].all-load[b].all||WEEK_DAYS.indexOf(a)-WEEK_DAYS.indexOf(b))[0];
  place(invite,day);
 }
 for(const invite of list){
  rel.lastInvited[invite.actor]=state.week;
  invite.id=`${state.week}-${invite.actor}`;
 }
 const sorted=list.sort((a,b)=>byDay(a.day,b.day));
 sorted.nights=nights;
 return sorted;
}
function ensureWeekAhead(){
 const rel=relations();
 if(rel.week?.week===state.week){
  // A week planned before free nights (7.85 and earlier) is one person per day. If no evening's been spent yet, re-plan it as free nights.
  if(Array.isArray(rel.week.nights)||Object.keys(rel.week.answers||{}).length||rel.week.spent?.length)return rel.week;
  rel.week={week:state.week,invites:[],spent:[],answers:{}};
  const invites=buildInvites();
  rel.week.invites=[...invites];rel.week.nights=invites.nights;
  return rel.week;
 }
 // A flag event that passed unanswered is gone for good.
 if(rel.week)for(const invite of rel.week.invites){
  const beat=routeStory(invite.actor)?.beats[invite.beat];
  if(beat&&beatKind(beat)==='flag'&&!rel.week.answers[invite.id])routeState(invite.actor).flags[invite.beat]='missed';
 }
 rel.week={week:state.week,invites:[],spent:[],answers:{}};
 const invites=buildInvites();
 rel.week.invites=[...invites];rel.week.nights=invites.nights;
 return rel.week;
}
// Weeks saved before free nights (7.85 and earlier) have no `nights`: every invitation was its own day.
function weekNights(week=ensureWeekAhead()){return Array.isArray(week.nights)?week.nights:[...new Set(week.invites.map(i=>i.day))].sort(byDay)}
function eveningCount(week=ensureWeekAhead()){return Array.isArray(week.nights)?week.nights.length:EVENING_SLOTS}
function nightInvites(day,week=ensureWeekAhead()){return week.invites.filter(i=>i.day===day)}
// The invitation you took on that night, if you've spent it.
function nightSpentOn(day,week=ensureWeekAhead()){return week.invites.find(i=>i.day===day&&week.answers[i.id])||null}
function eveningsLeft(){
 const week=ensureWeekAhead();
 if(!Array.isArray(week.nights))return Math.max(0,EVENING_SLOTS-week.spent.length);
 return week.nights.filter(day=>!nightSpentOn(day,week)).length;
}
// Can this invitation still be taken? (Its night is free and you have an evening for it.)
function inviteOpen(invite,week=ensureWeekAhead()){
 if(week.answers[invite.id]||eveningsLeft()<=0)return false;
 return !Array.isArray(week.nights)||!nightSpentOn(invite.day,week);
}
// On the road, evenings happen at the wrestler's haunt in the show's town (townmap.js).
function roadPlace(id){try{const town=showLocation().town,haunt=TOWN_MAPS[town]?.haunts?.[id];return haunt?`${haunt[0]} (${town})`:null}catch{return null}}
function sceneFor(invite){
 const route=FEATURED_ROUTES[invite.actor],beat=beatFor(invite);
 const place=roadPlace(invite.actor)||route.place;
 if(beat)return {place,kind:beatKind(beat),...beat};
 return {place,kind:'visit',...route.scenes[Number(invite.beat.split('-')[1])||0]};
}
function inviteMessage(invite){
 const r=w(invite.actor),tier=affectionTier(r),route=FEATURED_ROUTES[invite.actor],scene=sceneFor(invite);
 if(scene.invite)return {text:scene.invite,texted:true};
 return tier==='wary'?{text:route.invite.wary,texted:false}:{text:route.invite[tier==='friendly'?'friendly':'warm'],texted:true};
}
// ---------- Reading the room ----------
// What a wrestler wants from you shifts with their week: a loss or a win can swap the style they warm to
// (route `moods`). Saying the same kind of thing three times running wears thin. A locker-room reputation
// a wrestler distrusts (route `distrusts`) costs you with them. Replies can carry `cases` that override
// their effect in a given week, `truth` (a hard truth: small trust cost, no sore, morale help), `morale`,
// and `sides` (trust changes for other wrestlers who hear about it).
const STALE_AFTER=2;
function moodFor(id){const res=lastResults();return res?.lost.includes(id)?'low':res?.won.includes(id)?'high':null}
function moodEntry(id){const mood=moodFor(id);return mood?FEATURED_ROUTES[id]?.moods?.[mood]||null:null}
function wantStyle(id){return moodEntry(id)?.style||FEATURED_ROUTES[id].style}
function replyCase(actor,reply){return reply.cases?.find(c=>conditionsMet(actor,c.when))||null}
function isStale(actor,reply){
 if(!reply.style||reply.ask)return false;
 const said=relations().said[actor]||[];
 return said.length>=STALE_AFTER&&said.slice(-STALE_AFTER).every(style=>style===reply.style);
}
function replyMorale(actor,reply){const hit=replyCase(actor,reply);return Number(hit?.morale??reply.morale??(reply.truth?4:0))||0}
function replySides(actor,reply){return replyCase(actor,reply)?.sides||reply.sides||{}}
function replyDelta(actor,reply){
 const hit=replyCase(actor,reply);
 if(Number.isFinite(hit?.delta))return hit.delta;
 if(Number.isFinite(reply.delta))return reply.delta;
 if(reply.breaks)return -6;
 if(reply.truth)return -2;
 const route=FEATURED_ROUTES[actor],want=wantStyle(actor),rep=playStyle();
 let delta=(reply.style===want?6:2)+(rep===want?1:0);
 if(route.distrusts&&rep===route.distrusts)delta-=2;
 if(isStale(actor,reply))delta=Math.ceil(delta/2);
 return delta;
}
// The visible cost of a reply: what it commits the booking sheet to, and what that week already owes.
function replyCost(invite,reply){
 let kind=null,due=null;
 if(reply.promise){kind=reply.promise;due=state.week+(reply.due||0)}
 else if(reply.ask==='accept'&&invite){const cfg=askPromiseFor(beatFor(invite)||{});kind=cfg.kind;due=Number.isFinite(reply.askDue)?state.week+reply.askDue:cfg.due==='event'?nextEventWeek():state.week+(Number(cfg.due)||0)}
 if(!kind)return '';
 if(state.promises.some(p=>p.actor===invite?.actor&&p.kind===kind&&p.status==='open'))return 'Already promised';
 const what=promiseWhat({kind,target:null,actor:invite?.actor}),owed=promisesOwed(due),weight=promiseWeight({kind,actor:invite?.actor});
 return `Promises ${what}${weight>1?' (counts double)':''}, ${due===state.week?'this week':'week '+due}${owed?` · that show already owes ${owed}`:''}`;
}
function replyChips(actor,reply){
 const delta=replyDelta(actor,reply),chips=[{stat:'trust',label:delta>=6?'Warms to this ▲▲':delta>0?'Small step ▲':reply.breaks?'Breaks their world ▼':reply.truth?'Hard truth ▼':'Cools things ▼'}];
 if(isStale(actor,reply)&&!replyCase(actor,reply))chips.push({stat:'trust',label:'Heard it before'});
 if(moodEntry(actor)&&reply.style===wantStyle(actor)&&reply.style!==FEATURED_ROUTES[actor].style)chips.push({stat:'trust',label:'What they need this week'});
 const morale=replyMorale(actor,reply);if(morale)chips.push({stat:'morale',label:`Morale ${morale>0?'+':'−'}${Math.abs(morale)}`});
 for(const [id,d] of Object.entries(replySides(actor,reply)))if(w(Number(id)))chips.push({stat:'trust',label:`${w(Number(id)).name} ${d>0?'▲':'▼'}`});
 if(reply.promise||reply.ask==='accept')chips.push({stat:'promise',label:'Makes a promise'});
 return chips;
}
function askPromiseFor(beat){return {kind:'title',due:'event',...(beat.askPromise||{})}}
function routePayoff(invite,reply){
 const beat=beatFor(invite);if(!beat)return null;
 const id=invite.actor,route=routeState(id),kind=beatKind(beat),story=routeStory(id);
 if(kind==='beat')route.beats[camelBeat(invite.beat)]=state.week;
 if(kind==='flag')route.flags[invite.beat]='seen';
 if(beat.memory&&story.memories?.some(m=>m.id===beat.memory)&&!route.memories.some(m=>m.id===beat.memory))route.memories.push({id:beat.memory,week:state.week});
 if(beat.plan&&reply.promise){const due=state.week+(reply.due||0);if(!state.plans[due])state.plans[due]=beat.plan}
 if(kind==='final')route.ask.final=true;
 if(kind==='ask'){
  if(reply.ask==='accept'){
   const cfg=askPromiseFor(beat),due=Number.isFinite(reply.askDue)?state.week+reply.askDue:cfg.due==='event'?nextEventWeek():state.week+(Number(cfg.due)||0);
   makePromise(id,cfg.kind,due,cfg.target??null);
   const promise=state.promises.find(p=>p.actor===id&&p.kind===cfg.kind&&p.status==='open');
   route.ask={status:'accepted',week:state.week,due,promiseId:promise?.id||null,final:false,...(reply.cap?{cap:reply.cap}:{})};
   if(cfg.plan&&!state.plans[due])state.plans[due]=cfg.plan;
   const what=promise?promiseWhat(promise):'the match';
   return `${what[0].toUpperCase()+what.slice(1)} for ${FEATURED_ROUTES[id].speaker} at ${due%4===0?monthlyEventName(due):'week '+due+'’s show'} · due week ${due}`;
  }
  if(reply.ask==='defer')route.ask={status:'deferred',week:state.week,again:state.week+(beat.again||4)};
  if(reply.ask==='decline'){route.ask={status:'declined',week:state.week};route.ending='bad';route.endedWeek=state.week}
 }
 return null;
}
// Warming one wrestler up has consequences for the people around them.
function webReaction(actor,delta){
 if(delta<=0)return [];
 const rel=relations(),week=ensureWeekAhead(),notes=[];
 for(const bond of liveBonds().filter(b=>b.a===actor||b.b===actor)){
  const other=bond.a===actor?bond.b:bond.a;if(!w(other))continue;
  const jealousType=['grudge','irritation'].includes(bond.bond)||(['one-sided','crush'].includes(bond.bond)&&other===bond.a);
  if(jealousType&&isFeatured(other)){
   const passedOver=week.invites.some(i=>i.actor===other&&!week.answers[i.id]);
   if(passedOver)w(other).trust=clamp(w(other).trust-(bond.bond==='grudge'?2:1));
   rel.jealous[other]={of:actor,week:state.week,...(passedOver?{}:{soft:true})};notes.push(other);
  }
  if(bond.bond==='friendship')for(const team of state.teams.filter(t=>[t.a,t.b].includes(actor)&&[t.a,t.b].includes(other)))team.chemistry=clamp(team.chemistry+2);
 }
 return notes;
}
function jealousLine(id){
 const note=relations().jealous[id];
 if(!note||state.week-note.week>2)return '';
 const rival=w(note.of)?.name||'someone';
 if(note.heard)return FEATURED_ROUTES[id].heard?.replace('{name}',rival)||`Word got back to ${FEATURED_ROUTES[id].speaker} about what was said over an evening with ${rival}.`;
 if(note.soft)return `${FEATURED_ROUTES[id].speaker} heard you were out with ${rival}. They mention it, lightly.`;
 return FEATURED_ROUTES[id].jealous?.replace('{name}',rival)||`Word travels: you spent an evening with ${rival}. It shows.`;
}
// Applies one evening's reply. Returns false if it cannot be spent.
function answerScene(id,index){
 if(state.liveShow||state.recap)return false;
 const week=ensureWeekAhead(),invite=week.invites.find(item=>item.id===id);
 if(!invite||!inviteOpen(invite,week))return false;
 const scene=sceneFor(invite),reply=scene.replies[index];if(!reply)return false;
 const rel=relations(),r=w(invite.actor),hit=replyCase(invite.actor,reply),stale=!hit&&isStale(invite.actor,reply),delta=replyDelta(invite.actor,reply),before=affectionTier(r),morale=replyMorale(invite.actor,reply);
 r.trust=clamp(r.trust+delta);
 if(morale)r.morale=clamp((r.morale??70)+morale);
 if(reply.style){rel.style[reply.style]++;const said=rel.said[invite.actor]??=[];said.push(reply.style);if(said.length>STALE_AFTER)said.splice(0,said.length-STALE_AFTER)}
 else if(!reply.ask)rel.said[invite.actor]=[];
 const heard=[];
 for(const [key,d] of Object.entries(replySides(invite.actor,reply))){
  const other=Number(key);if(!w(other)||other===invite.actor||!Number.isFinite(d))continue;
  offstageTrust(w(other),d);
  if(d<0&&routeFor(other)?.heard)heard.push(other);
 }
 // Words that get back to someone go in the Good Lord Above's file.
 if(typeof addSin==='function')for(const other of heard)addSin('gossip',{actor:invite.actor,target:other});
 if(reply.breaks)rel.sore[invite.actor]=state.week;
 if(typeof ledgerNote==='function'){
  if(reply.truth)ledgerNote('hardTruth',{actor:invite.actor});
  if(reply.breaks)ledgerNote('brushOff',{actor:invite.actor});
  if(scene.kind==='flag')ledgerNote('showedUp',{actor:invite.actor});
  if(AFFECTION_ORDER.indexOf(affectionTier(r))>AFFECTION_ORDER.indexOf(before))ledgerNote('closer',{actor:invite.actor});
  for(const other of heard)ledgerNote('gossip',{actor:invite.actor,target:other});
 }
 if(invite.beat.startsWith('visit-'))rel.visits[invite.actor]=(rel.visits[invite.actor]||0)+1;
 rel.lastEvening[invite.actor]=state.week;
 if(rel.jealous[invite.actor]&&delta>0)delete rel.jealous[invite.actor];
 week.answers[id]={reply:index};week.spent.push(id);
 let payoff=null;
 if(reply.promise){
  const due=state.week+(reply.due||0),had=state.promises.some(p=>p.actor===invite.actor&&p.kind===reply.promise&&p.status==='open');
  makePromise(invite.actor,reply.promise,due);
  payoff=had?'Already on the promise ledger':promiseLabel(state.promises.filter(p=>p.actor===invite.actor&&p.kind===reply.promise).at(-1));
 }
 const memoriesBefore=routeState(invite.actor).memories.length;
 payoff=routePayoff(invite,reply)||payoff;
 const jealous=[...new Set([...webReaction(invite.actor,delta),...heard])];
 for(const other of heard)rel.jealous[other]={of:invite.actor,week:state.week,heard:true};
 Object.assign(week.answers[id],{payoff,delta,stale,heard,case:hit?reply.cases.indexOf(hit):null,mood:moodFor(invite.actor),from:before,to:affectionTier(r),memory:routeState(invite.actor).memories.length>memoriesBefore?routeState(invite.actor).memories.at(-1).id:null,jealous});
 incident(`An evening with ${r.name} at ${scene.place.split(' (')[0]}.${payoff?' '+payoff+'.':''}`,[invite.actor],'relationship');
 return true;
}
// Anyone you haven't spent an evening with lately cools off. Not while they can't ask you out (Sweeps' spotlight month).
function relationshipDrift(){
 const rel=relations();
 for(const id of FEATURED_IDS){
  const r=w(id);
  if(!r||routeState(id).ending||!dropInsOpen(id)||r.trust<=DRIFT_FLOOR)continue;
  if(state.week-(rel.lastEvening[id]??0)>=DRIFT_AFTER)r.trust=Math.max(DRIFT_FLOOR,r.trust-DRIFT);
 }
}
// The people you've been seeing ask again first.
function seenLately(id){const last=relations().lastEvening[id];return last!=null&&state.week-last<=DRIFT_AFTER?1:0}
// Runs after promises resolve at the end of a show.
function relationshipWeekEnd(fallout){
 const rel=relations(),won=[],lost=[],cheatWins=[],cheatLosses=[];
 for(const s of state.card.filter(s=>s.kind==='match'&&s.winner!=null)){
  const sides=matchSides(s),win=sides[winningSide(s)]||[],cheated=matchCheated(s);
  for(const pid of matchPeople(s)){(win.includes(pid)?won:lost).push(pid);if(cheated)(win.includes(pid)?cheatWins:cheatLosses).push(pid)}
 }
 rel.results={week:state.week,won,lost,cheatWins,cheatLosses};
 relationshipDrift();
 for(const id of FEATURED_IDS){
  const story=routeStory(id),route=routeState(id),ask=route.ask;
  if(!story||ask?.status!=='accepted'||route.ending)continue;
  const promise=state.promises.find(p=>p.id===ask.promiseId),hasFinal=storyBeats(story).some(b=>b.kind==='final');
  if(promise?.status==='kept')route.ending=hasFinal&&!ask.final?'neutral':'best';
  else if(promise?.status==='broken')route.ending='bad';
  if(route.ending==='best'&&ask.cap==='neutral')route.ending='neutral';
  if(route.ending){route.endedWeek=state.week;fallout.push(incident(story.endings[route.ending].line,[id],'aftermath'))}
 }
}

// ---------- Era epilogues ----------
function affectionEnding(id){const r=w(id);return soreLine(id)||affectionTier(r)==='wary'?'bad':'neutral'}
// Called once when the promotion leaves an era. Finished routes keep their ending; everyone else is
// read from how things stand between you.
function relationshipEraEnd(era){
 const rel=relations();
 if(rel.epilogues.some(e=>e.era===era))return rel.epilogues.find(e=>e.era===era);
 const cards=FEATURED_IDS.filter(id=>w(id)).map(id=>{
  const route=routeState(id),fromRoute=!!route.ending&&(route.endedEra==null||route.endedEra===era)&&!!routeStory(id);
  if(fromRoute)route.endedEra=era;
  return {id,tier:fromRoute?route.ending:affectionEnding(id),route:fromRoute};
 });
 const entry={era,week:state.week,seen:false,cards};
 rel.epilogues.push(entry);
 return entry;
}
const GENERIC_EPILOGUE={best:'Unforgettable',neutral:'Unfinished business',bad:'The one that got away'};
function epilogueText(card){
 const r=w(card.id),route=FEATURED_ROUTES[card.id];
 if(card.route&&ROUTE_STORIES[card.id]?.endings?.[card.tier])return ROUTE_STORIES[card.id].endings[card.tier];
 // TODO(dialogue): FEATURED_ROUTES[id].epilogue = {best,neutral,bad}, each {title,line}.
 if(route.epilogue?.[card.tier]?.title)return route.epilogue[card.tier];
 return {title:GENERIC_EPILOGUE[card.tier],line:tellFor(r)};
}
function pendingEpilogue(era){return relations().epilogues.find(e=>e.era===era&&!e.seen)||null}

// ---------- Locker room helpers ----------
function routeStatus(id){
 const story=routeStory(id),route=routeState(id),r=w(id);
 if(!story)return {key:'drop-in',text:'More to their story soon'};
 if(route.ending)return {key:'ended',text:story.endings[route.ending].title,tier:route.ending};
 if(route.ask?.status==='accepted')return {key:'promised',text:`You said yes · due week ${route.ask.due}`};
 if(route.ask?.status==='deferred')return {key:'waiting',text:'Still waiting on your answer'};
 if(!routeOpen(id))return {key:'closed',text:story.opens?.afterSpotlight&&inSpotlight()?'Busy with his spotlight month':'Spend an evening with them first'};
 const seen=Object.keys(route.beats).length,total=storyBeats(story).filter(b=>b.kind==='beat').length;
 return {key:'open',text:seen>=total?'Building up to something big':`Getting to know them · ${seen} of ${total} evenings`,progress:[seen,total]};
}
function memorySlots(id){
 const story=routeStory(id),route=routeState(id);
 return (story?.memories||[]).map(m=>{const found=route.memories.find(x=>x.id===m.id);return {...m,found,missed:route.flags[m.id]==='missed'}});
}

// ---------- Cutscene script (pure, so it can be tested without a page) ----------
// Splits a reaction into narration and quoted lines, so the speaker's words get the nameplate.
function splitReaction(text){
 const parts=[],re=/“([^”]*)”/g;let last=0,m;
 while((m=re.exec(text))){
  const before=text.slice(last,m.index).trim();if(before)parts.push({type:'narration',text:before});
  parts.push({type:'line',text:m[1].trim()});last=re.lastIndex;
 }
 const tail=text.slice(last).trim();if(tail)parts.push({type:'narration',text:tail});
 return parts.length?parts:[{type:'narration',text}];
}
function sceneSet(id){return FEATURED_ROUTES[id]?.set||SCENE_SETS[id]||'hall'}
function sceneTime(id){return FEATURED_ROUTES[id]?.time||SCENE_TIMES[id%SCENE_TIMES.length]}
function shoutFor(reply){return SHOUTS[reply.ask||(reply.breaks?'breaks':reply.truth?'truth':reply.style)]||'Well…'}
function emoteFor(delta,reply){return reply.breaks||delta<0&&!reply.truth?'hurt':delta>=6?'delight':'nod'}
function sceneOpening(invite){
 const r=w(invite.actor),scene=sceneFor(invite),sore=soreLine(invite.actor),jealous=jealousLine(invite.actor),actor=invite.actor;
 const pages=[{type:'title',place:scene.place.split(' (')[0],detail:scene.place.includes('(')?scene.place.slice(scene.place.indexOf('(')+1,-1):'',when:`${invite.day} · ${sceneTime(actor)}`,flag:scene.kind==='flag',ask:scene.kind==='ask',actor}];
 pages.push({type:'narration',text:moodEntry(actor)?.tell||tellFor(r),actor});
 if(sore)pages.push({type:'line',text:sore,actor,emote:'hurt'});
 if(jealous)pages.push({type:'narration',text:jealous,actor,emote:'hurt'});
 pages.push({type:'line',text:scene.line,actor,emote:scene.kind==='ask'||scene.kind==='flag'?'intense':null});
 return pages;
}
function sceneOutcome(invite){
 const answer=ensureWeekAhead().answers[invite.id];if(!answer)return [];
 const r=w(invite.actor),scene=sceneFor(invite),reply=scene.replies[answer.reply],actor=invite.actor,delta=answer.delta??replyDelta(actor,reply);
 const hit=Number.isInteger(answer.case)?reply.cases?.[answer.case]:null;
 const emote=emoteFor(delta,reply),pages=[{type:'shout',text:shoutFor(reply),tone:reply.breaks||reply.ask==='decline'?'bad':'good',actor},{type:'you',text:reply.text,actor}];
 for(const part of splitReaction(hit?.reaction||reply.reaction))pages.push({...part,actor,emote});
 if(answer.stale)pages.push(FEATURED_ROUTES[actor].stale?{type:'line',text:FEATURED_ROUTES[actor].stale,actor}:{type:'narration',text:`${FEATURED_ROUTES[actor].speaker} nods. They’ve heard that one from you before.`,actor});
 if(answer.from&&answer.to&&answer.from!==answer.to)pages.push({type:'tell',up:AFFECTION_TIERS.indexOf(answer.to)>AFFECTION_TIERS.indexOf(answer.from),text:FEATURED_ROUTES[actor].tells[answer.to],actor});
 pages.push({type:'line',text:signoffFor(r),actor,signoff:true});
 for(const other of answer.jealous||[])pages.push({type:'narration',text:(answer.heard||[]).includes(other)?`That will get back to ${w(other).name}.`:relations().jealous[other]?.soft?`Word of tonight will reach ${w(other).name} sooner or later.`:`Somewhere across town, ${w(other).name} kept tonight free. They hear about it anyway.`,actor:other,emote:'hurt'});
 if(answer.memory){const m=ROUTE_STORIES[actor].memories.find(x=>x.id===answer.memory);if(m)pages.push({type:'memory',title:m.title,caption:m.caption.replace('{week}',state.week),actor})}
 if(answer.payoff)pages.push({type:'stamp',text:answer.payoff,actor});
 const route=routeState(actor);
 if(route.ending&&route.endedWeek===state.week&&scene.kind==='ask')pages.push({type:'ending',tier:route.ending,title:ROUTE_STORIES[actor].endings[route.ending].title,actor});
 return pages;
}
function epilogueScript(entry){
 const era=ERAS[entry.era]||ERAS[0],pages=[{type:'title',place:`Era ${era.roman} · ${era.name}`,detail:'Epilogue',when:'Where everyone ended up',actor:entry.cards[0]?.id??0}];
 for(const card of entry.cards){
  const text=epilogueText(card);
  pages.push({type:'ending',tier:card.tier,title:text.title,actor:card.id,epilogue:true});
  for(const part of splitReaction(text.line))pages.push({...part,actor:card.id,emote:card.tier==='best'?'delight':card.tier==='bad'?'hurt':null});
 }
 return pages;
}

// ---------- Week ahead panel ----------
function inviteCard(invite,left,{focus=false,where=null}={}){
 const r=w(invite.actor),week=ensureWeekAhead(),answer=week.answers[invite.id],scene=sceneFor(invite),message=inviteMessage(invite),tier=affectionTier(r);
 const special=scene.kind==='flag'||scene.kind==='ask'||scene.kind==='final';
 const went=Array.isArray(week.nights)&&!answer?nightSpentOn(invite.day,week):null,open=inviteOpen(invite,week);
 const speaker=FEATURED_ROUTES[invite.actor].speaker;
 const label=scene.kind==='flag'?`Go now`:`See ${speaker}`;
 const action=answer?`<button type="button" class="btn invite-replay" data-week-scene="${invite.id}" aria-label="${esc('Replay '+invite.day+' night with '+r.name)}">${esc(invite.day)} night ✓</button>`
  :open?`<button type="button" class="btn ${special||focus?'primary':''}" data-week-scene="${invite.id}" aria-label="${esc(`Spend ${invite.day} night with ${r.name}`)}">${esc(label)}</button>`
  :went?`<span class="invite-status">You went to see ${esc(FEATURED_ROUTES[went.actor].speaker)}</span>`:`<span class="invite-status">No nights left</span>`;
 const tag=scene.kind==='flag'&&!answer?'<span class="invite-flag">Only this week</span>':scene.kind==='ask'&&!answer?'<span class="invite-flag is-ask">Wants to ask you something</span>':scene.kind==='final'&&!answer?'<span class="invite-flag is-ask">Tonight matters</span>':'';
 const place=where||scene.place.split(' (')[0];
 return `<li class="invite mood-${tier} ${answer?'is-spent':''} ${went?'is-passed':''} ${special?'is-flag':''} ${focus?'is-focus':''}" style="--character-color:${r.color}"><div class="invite-art" data-mood="${tier}">${portrait(r)}</div><div class="invite-copy"><small>${esc(place)} · ${esc(sceneTime(invite.actor))}</small><strong>${esc(r.name)}</strong>${tag}<p class="${message.texted?'invite-text':'invite-narration'}">${message.texted?'<span class="sr-only">Text message: </span>':''}${esc(message.text)}</p></div>${action}</li>`;
}
function nightsNote(week,left){
 const total=eveningCount(week);
 if(!left)return 'Your nights are spoken for.';
 return `${total===1?'One free night':`${['','One','Two','Three','Four'][total]||total} free nights`} this week${left<total?`, ${left} left`:''}. One visit a night. Whoever you don’t see, you don’t see.`;
}
function weekAheadPanel(){
 const week=ensureWeekAhead(),left=eveningsLeft(),total=eveningCount(week);
 const dots=Array.from({length:total},(_,i)=>`<i class="${i<total-left?'used':''}"></i>`).join('');
 const nights=weekNights(week).map(day=>{const went=nightSpentOn(day,week);return `<div class="night-block ${went?'is-spent':''}"><h4>${esc(day)} night <small>${went?'With '+esc(FEATURED_ROUTES[went.actor].speaker)+' ✓':'Free'}</small></h4><ol class="invite-list">${nightInvites(day,week).map(invite=>inviteCard(invite,left)).join('')}</ol></div>`}).join('');
 return `<section class="card week-ahead" id="week-ahead" aria-labelledby="week-ahead-title"><div class="week-ahead-head"><h3 id="week-ahead-title">The week ahead</h3><span class="evening-dots" role="img" aria-label="${left} of ${total} free nights left">${dots}</span></div><p class="note">${esc(reputationLine())} ${esc(nightsNote(week,left))}</p>${nights}<label class="easy-toggle"><input type="checkbox" data-easy-mode ${easyMode()?'checked':''}> Show what replies change (easy mode)</label></section>`;
}
// Compact strip for the Road page: who's asking, and a way in.
function weekAheadStrip(){
 const week=ensureWeekAhead(),left=eveningsLeft(),urgent=week.invites.find(i=>inviteOpen(i,week)&&['flag','ask','final'].includes(sceneFor(i).kind));
 const nights=weekNights(week).filter(day=>!nightSpentOn(day,week));
 return `<section class="week-strip" aria-labelledby="week-strip-title"><div class="week-strip-copy"><h2 id="week-strip-title">The week ahead</h2><p>${urgent?esc(`${w(urgent.actor).name}: ${inviteMessage(urgent).text}`):left?esc(Array.isArray(week.nights)?`Free ${nights.join(' and ')} night${nights.length===1?'':'s'} · ${week.invites.length} people to choose from`:`${left} free evening${left===1?'':'s'} · ${week.invites.length} invitations`):'Your nights are spoken for.'}</p></div><ul class="week-strip-faces">${week.invites.map(i=>`<li class="${week.answers[i.id]?'is-spent':''} ${urgent===i?'is-urgent':''}" style="--character-color:${w(i.actor).color}" data-mood="${affectionTier(w(i.actor))}"><span class="sr-only">${esc(w(i.actor).name)}${week.answers[i.id]?', night spent':''}</span>${portrait(w(i.actor))}</li>`).join('')}</ul><button type="button" class="btn ${left?'primary':''}" data-nav="locker">Town map →</button></section>`;
}

// ---------- The cutscene player (Ace Attorney style) ----------
let scenePlayer=null;
// Speakers who aren't wrestlers (the opening's Good Lord Above): {name,set,color,art()}. Keyed by string ids.
const CUTSCENE_CAST={};
function castMember(id){return typeof id==='string'?CUTSCENE_CAST[id]||null:null}
function reducedMotion(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return true}}
function playerMarkup(header){
 return `<div class="aa" data-page="title"><header class="aa-bar">${header}<span class="aa-tools"><button type="button" class="aa-tool" data-aa-log aria-expanded="false">Log</button><button type="button" class="aa-tool" data-aa-skip>Skip ▸▸</button></span></header><div class="aa-stage" data-set="hall"><div class="aa-scenery" aria-hidden="true"></div><div class="aa-titlecard" aria-hidden="true"></div><figure class="aa-figure" aria-hidden="true"><div class="aa-portrait"></div><span class="aa-heart">♥</span></figure><div class="aa-shout" aria-hidden="true"></div><div class="aa-flash" aria-hidden="true"></div><div class="aa-overlay" aria-hidden="true"></div><div class="aa-choices" role="group" aria-label="Your reply"></div></div><div class="aa-box"><span class="aa-name" hidden></span><p class="aa-text" aria-hidden="true"></p><p class="sr-only aa-live" aria-live="polite"></p><button type="button" class="aa-next" aria-label="Continue">▼</button><div class="aa-end"></div></div><ol class="aa-log" hidden></ol></div>`;
}
// While a cutscene is on screen the game behind it is frozen: no scrolling (iOS lets touches on a
// modal chain through to the page), no taps, no focus. Tied to #modal itself, so every way a scene
// opens or closes (the opening, evenings, the epilogue reel, the briefing) unlocks the same way.
let scenePageLock=null;
function setScenePageLock(on){
 const app=document.getElementById('app'),body=document.body;
 if(on&&!scenePageLock){
  const y=window.scrollY||0;scenePageLock={y};
  document.documentElement.classList.add('scene-locked');
  Object.assign(body.style,{position:'fixed',top:`-${y}px`,left:'0',right:'0',width:'100%'});
  if(app)app.inert=true;
 }else if(!on&&scenePageLock){
  const {y}=scenePageLock;scenePageLock=null;
  document.documentElement.classList.remove('scene-locked');
  for(const key of ['position','top','left','right','width'])body.style[key]='';
  if(app)app.inert=false;
  window.scrollTo(0,y);
 }
}
function watchScenePageLock(){
 const d=document.getElementById('modal');if(!d||d.dataset.sceneLock||typeof MutationObserver!=='function')return;
 d.dataset.sceneLock='1';
 const sync=()=>setScenePageLock(d.open&&d.classList.contains('aa-scene'));
 new MutationObserver(sync).observe(d,{attributes:true,attributeFilter:['open','class']});
 d.addEventListener('close',sync);
}
// Plays `pages` in #modal. `choose(i)` is called for choice pages and returns the next pages (or null).
function runScenePlayer({header,pages,onChoose,finish,finishLabel='Back to the week →'}){
 watchScenePageLock();
 const d=$('#modal'),instant=reducedMotion();
 d.className='aa-scene';d.setAttribute('aria-label','Cutscene');d.removeAttribute('aria-labelledby');d.innerHTML=playerMarkup(header);
 const root=d.querySelector('.aa'),stage=root.querySelector('.aa-stage'),box=root.querySelector('.aa-box'),name=root.querySelector('.aa-name'),text=root.querySelector('.aa-text'),live=root.querySelector('.aa-live'),choices=root.querySelector('.aa-choices'),fig=root.querySelector('.aa-figure'),art=root.querySelector('.aa-portrait'),shout=root.querySelector('.aa-shout'),flash=root.querySelector('.aa-flash'),overlay=root.querySelector('.aa-overlay'),titlecard=root.querySelector('.aa-titlecard'),log=root.querySelector('.aa-log'),end=root.querySelector('.aa-end');
 const player={queue:pages.slice(),index:-1,typing:null,auto:null,waiting:false,actor:null,done:false};
 scenePlayer=player;
 const setActor=id=>{
  if(id==null||id===player.actor)return;
  const cast=castMember(id);player.actor=id;
  if(cast){player.set=cast.set;stage.style.setProperty('--character-color',cast.color);fig.dataset.mood='';art.innerHTML=cast.art()}
  else{const r=w(id);player.set=sceneSet(id);stage.style.setProperty('--character-color',r.color);fig.dataset.mood=affectionTier(r);art.innerHTML=portrait(r)}
  fig.classList.remove('enter');void fig.offsetWidth;fig.classList.add('enter');
 };
 const emote=kind=>{fig.dataset.emote=kind||'';if(kind){fig.classList.remove('emoting');void fig.offsetWidth;fig.classList.add('emoting')}if(['hurt','angry'].includes(kind)&&!instant){root.classList.remove('shake');void root.offsetWidth;root.classList.add('shake')}};
 const addLog=(who,line)=>{const li=document.createElement('li');li.innerHTML=who?`<strong>${esc(who)}</strong> ${esc(line)}`:`<em>${esc(line)}</em>`;log.append(li)};
 const type=(line,done)=>{
  clearInterval(player.typing);text.textContent='';live.textContent=line;box.classList.add('is-typing');
  if(instant){text.textContent=line;box.classList.remove('is-typing');done();return}
  let i=0;const chars=[...line];
  const step=()=>{
   text.textContent+=chars[i++]||'';
   if(i>=chars.length){clearInterval(player.typing);player.typing=null;box.classList.remove('is-typing');done();return}
   const c=chars[i-1];if(/[.!?…—]/.test(c)){clearInterval(player.typing);player.typing=setTimeout(()=>{player.typing=setInterval(step,24)},c==='…'?260:150)}
  };
  player.typing=setInterval(step,24);
  player.finishTyping=()=>{clearInterval(player.typing);clearTimeout(player.typing);player.typing=null;text.textContent=line;box.classList.remove('is-typing');done()};
 };
 const clearOverlays=()=>{overlay.className='aa-overlay';overlay.innerHTML='';titlecard.className='aa-titlecard';shout.className='aa-shout'};
 const show=page=>{
  root.dataset.page=page.type;setActor(page.actor);stage.dataset.set=page.set||player.set||'hall';root.classList.toggle('no-figure',page.figure===false);clearOverlays();choices.innerHTML='';choices.classList.remove('is-open');end.innerHTML='';
  box.classList.remove('is-you','is-narration','is-ready');name.hidden=true;player.waiting=false;
  const wait=()=>{player.waiting=true;box.classList.add('is-ready')};
  const cast=castMember(page.actor),r=page.actor!=null&&!cast?w(page.actor):null,speaker=cast?cast.name:page.actor!=null?routeFor(page.actor)?.speaker||r?.name:'';
  // Optional overlays any line or narration page can carry: a paper card, or a row of wrestlers.
  if(page.card){overlay.className='aa-overlay is-on is-card';overlay.innerHTML=`<div class="aa-card"><small>${esc(page.card.small||'')}</small><strong>${esc(page.card.title)}</strong>${page.card.items?`<ul>${page.card.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:''}</div>`;addLog('',[page.card.small,page.card.title,...(page.card.items||[])].filter(Boolean).join(' · '))}
  if(page.prop){overlay.className='aa-overlay is-on is-prop';overlay.innerHTML=page.prop}
  if(page.shake&&!instant){root.classList.remove('shake');void root.offsetWidth;root.classList.add('shake')}
  if(page.lineup){overlay.className='aa-overlay is-on is-lineup';overlay.innerHTML=`<ul class="aa-lineup">${page.lineup.map(id=>`<li style="--character-color:${w(id).color}"><div>${portrait(w(id))}</div><span>${esc(w(id).name)}</span></li>`).join('')}</ul>`;addLog('','Introducing: '+page.lineup.map(id=>w(id).name).join(', '))}
  if(page.type==='title'){
   titlecard.innerHTML=`${page.flag?'<span class="aa-tag">Only this week</span>':page.ask?'<span class="aa-tag is-ask">Something to ask you</span>':''}<span class="aa-when">${esc(page.when)}</span><strong>${esc(page.place)}</strong>${page.detail?`<span>${esc(page.detail)}</span>`:''}`;
   titlecard.classList.add('is-on');text.textContent='';live.textContent=`${page.when}. ${page.place}${page.detail?', '+page.detail:''}.`;
   player.auto=setTimeout(next,instant?400:1500);player.waiting=true;return;
  }
  if(page.type==='shout'){
   shout.textContent=page.text;shout.className=`aa-shout is-on tone-${page.tone}`;live.textContent=page.text;text.textContent='';box.classList.add('is-narration');
   if(!instant){flash.classList.remove('is-on');void flash.offsetWidth;flash.classList.add('is-on')}
   player.auto=setTimeout(next,instant?300:900);player.waiting=true;return;
  }
  if(page.type==='choice'){
   box.classList.add('is-narration');text.textContent='How do you answer?';live.textContent='How do you answer?';
   choices.innerHTML=page.replies.map((reply,i)=>{const cost=page.costFor?page.costFor(reply):cast?'':replyCost(page.invite,reply);return `<button type="button" class="aa-choice" data-aa-choice="${i}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body"><strong>${esc(reply.text)}</strong>${cost?`<small class="aa-cost">${esc(cost)}</small>`:''}${page.chipsFor&&cast||easyMode()&&!cast?effectChips(page.chipsFor?page.chipsFor(reply):replyChips(page.actor,reply),'What this reply changes'):''}</span></button>`}).join('');
   choices.classList.add('is-open');
   choices.querySelectorAll('[data-aa-choice]').forEach(button=>button.onclick=event=>{event.stopPropagation();
    const said=button.querySelector('.answer-body strong')?.textContent||'';
    const more=onChoose(Number(button.dataset.aaChoice));if(!more)return;
    // You just read and picked the full reply, so the scene doesn't type it out again: it goes in the log.
    const echo=more.findIndex((p,i)=>i<2&&p.type==='you');
    if(echo>=0){addLog('You',more[echo].text||said);more.splice(echo,1)}else if(said)addLog('You',said);
    const go=()=>{
     if(player.done)return;
     if(!more.length){player.queue.splice(player.index,1);player.index--;next();return}
     player.queue.splice(player.index+1,0,...more);player.index++;show(player.queue[player.index]);
    };
    // A beat on the line you picked, so it reads as said, then the scene carries on.
    choices.querySelectorAll('[data-aa-choice]').forEach(b=>{b.disabled=true;b.classList.toggle('is-picked',b===button)});
    choices.classList.add('has-picked');
    if(instant)go();else player.pick=setTimeout(go,420);
   });
   choices.querySelector('button')?.focus({preventScroll:true});return;
  }
  if(page.type==='memory'){
   overlay.className='aa-overlay is-on is-memory';overlay.innerHTML=`<figure class="polaroid aa-polaroid"><div class="polaroid-art">${portrait(r)}</div><figcaption><strong>${esc(page.title)}</strong>${esc(page.caption)}</figcaption></figure><span class="aa-overlay-label">Pinned to the scrapbook</span>`;
   box.classList.add('is-narration');type(`A polaroid for the scrapbook: ${page.title}.`,wait);addLog('','Scrapbook: '+page.title);return;
  }
  if(page.type==='stamp'){
   overlay.className='aa-overlay is-on is-stamp';overlay.innerHTML=`<div class="aa-stamp"><small>On the booking sheet</small><strong>${esc(page.text)}</strong></div>`;
   box.classList.add('is-narration');type('It goes on the booking sheet.',wait);live.textContent='On the booking sheet: '+page.text;addLog('','On the booking sheet: '+page.text);return;
  }
  if(page.type==='ending'){
   overlay.className=`aa-overlay is-on is-ending tier-${page.tier}`;overlay.innerHTML=`<div class="aa-ending"><small>${page.label?esc(page.label):page.epilogue?esc(r.name):'Era ending'}</small><strong>${esc(page.title)}</strong><span>${{best:'Best ending',neutral:'Neutral ending',bad:'Bad ending'}[page.tier]}</span></div>`;
   emote(page.tier==='best'?'delight':page.tier==='bad'?'hurt':null);
   box.classList.add('is-narration');type(page.epilogue?`${r.name}. ${page.title}.`:page.title,wait);addLog('',page.title);return;
  }
  if(page.type==='tell'){
   overlay.className=`aa-overlay is-on is-tell ${page.up?'is-up':'is-down'}`;overlay.innerHTML=`<span class="aa-overlay-label">${page.up?'Something’s different':'Something cooled'}</span>`;
   emote(page.up?'delight':'hurt');fig.dataset.mood=affectionTier(r);
   box.classList.add('is-narration');type(page.text,wait);addLog('',page.text);return;
  }
  if(page.type==='you'){box.classList.add('is-you');name.hidden=false;name.textContent='You';type(page.text,wait);addLog('You',page.text);return}
  if(page.type==='narration'){box.classList.add('is-narration');if(page.emote)emote(page.emote);type(page.text,wait);addLog('',page.text);return}
  // A spoken line.
  name.hidden=false;name.textContent=speaker;emote(page.emote);fig.classList.add('talking');
  type(page.signoff?`“${page.text}”`:page.text,()=>{fig.classList.remove('talking');wait()});addLog(speaker,page.text);
 };
 const close=()=>{player.done=true;clearInterval(player.typing);clearTimeout(player.typing);clearTimeout(player.auto);clearTimeout(player.pick);if(scenePlayer===player)scenePlayer=null};
 const next=()=>{
  clearTimeout(player.auto);
  if(player.typing){player.finishTyping?.();return}
  if(player.queue[player.index]?.type==='choice')return;
  player.index++;
  const page=player.queue[player.index];
  if(!page){
   root.dataset.page='end';clearOverlays();choices.innerHTML='';box.classList.remove('is-ready','is-you');box.classList.add('is-narration');name.hidden=true;
   text.textContent='';live.textContent='';
   end.innerHTML=`<button type="button" class="btn primary" id="scene-done">${esc(finishLabel)}</button>`;
   end.querySelector('#scene-done').onclick=event=>{event.stopPropagation();close();finish()};
   end.querySelector('#scene-done').focus({preventScroll:true});return;
  }
  show(page);
 };
 const advance=()=>{if(player.waiting||player.typing)next()};
 box.onclick=event=>{if(event.target.closest('#scene-done,.aa-next'))return;advance()};
 root.querySelector('.aa-next').onclick=advance;
 root.onkeydown=event=>{if(['Enter',' '].includes(event.key)&&!event.target.closest('.aa-choices,.aa-tools,#scene-done,.aa-next')){event.preventDefault();advance()}};
 stage.onclick=event=>{if(!event.target.closest('.aa-choices')&&(player.waiting||player.typing))next()};
 root.querySelector('[data-aa-skip]').onclick=()=>{
  if(player.queue[player.index]?.type==='choice')return;
  clearTimeout(player.auto);player.finishTyping?.();
  const stop=player.queue.findIndex((p,i)=>i>player.index&&['choice','ending','memory','stamp'].includes(p.type));
  player.index=(stop<0?player.queue.length:stop)-1;player.typing=null;next();
 };
 root.querySelector('[data-aa-log]').onclick=event=>{const open=log.hidden;log.hidden=!open;event.currentTarget.setAttribute('aria-expanded',String(open))};
 if(!d.open)d.showModal();
 root.querySelector('.aa-next').focus({preventScroll:true});
 player.close=close;
 next();
 return player;
}
// Plays one evening. `back` returns to wherever the scene was opened from.
function openWeekAheadScene(id,back){
 const invite=ensureWeekAhead().invites.find(item=>item.id===id);if(!invite)return;
 const d=$('#modal'),wasOpen=d.open,week=ensureWeekAhead(),scene=sceneFor(invite),answered=!!week.answers[id];
 const total=eveningCount(week),used=Math.min(total,week.spent.length-(answered?1:0)+1);
 const header=`<span class="aa-brand">The week ahead</span><span>Week ${state.week} · ${esc(invite.day)} night</span><span>Free night ${used} of ${total}</span>`;
 const pages=answered?[sceneOpening(invite).at(-1),...sceneOutcome(invite)]:[...sceneOpening(invite),{type:'choice',replies:scene.replies,actor:invite.actor,invite}];
 if(!wasOpen){d.oncancel=()=>scenePlayer?.close?.();d.onclose=()=>{scenePlayer?.close?.();if(!d.open){d.removeAttribute('aria-label');render()}}}
 runScenePlayer({header,pages,onChoose:index=>{if(!answerScene(id,index))return null;save();return sceneOutcome(invite)},finish:()=>{d.removeAttribute('aria-label');back()}});
}
// The era-end reel, then `after`.
function openEpilogueReel(entry,after){
 const d=$('#modal'),era=ERAS[entry.era]||ERAS[0];
 const header=`<span class="aa-brand">Era ${era.roman} epilogue</span><span>${entry.cards.length} featured wrestlers</span>`;
 d.oncancel=null;d.onclose=()=>{scenePlayer?.close?.()};
 runScenePlayer({header,pages:epilogueScript(entry),finishLabel:after?'On to moving day →':'Close',finish:()=>{entry.seen=true;save();d.close();if(after)after();else render()}});
}
function bindWeekAhead(scope=document,back=null){
 const root=scope.querySelector?.('#week-ahead');
 if(root){
  const leave=back||(()=>{const d=$('#modal');d.close()});
  root.querySelectorAll('[data-week-scene]').forEach(button=>button.onclick=()=>openWeekAheadScene(button.dataset.weekScene,leave));
  const easy=root.querySelector('[data-easy-mode]');
  if(easy)easy.onchange=()=>{state.preferences.easyMode=easy.checked;save();if(back)back();else render()};
 }
 scope.querySelectorAll?.('[data-window-card]').forEach(button=>button.onclick=()=>openWindowCard(Number(button.dataset.windowCard)));
 scope.querySelectorAll?.('[data-epilogue-replay]').forEach(button=>button.onclick=()=>{const entry=relations().epilogues.find(e=>e.era===Number(button.dataset.epilogueReplay));if(entry)openEpilogueReel(entry,null)});
}

// ---------- Ledger, window card, locker room ----------
function promiseLedger(){
 const open=state.promises.filter(p=>p.status==='open').sort((a,b)=>a.due-b.due),recent=state.promises.filter(p=>p.status!=='open'&&p.resolved>=state.week-4).slice(-5).reverse();
 const due=p=>p.due<=state.week?'Tonight':p.due===state.week+1?'Next week':`In ${p.due-state.week} weeks`;
 const rows=open.map(p=>`<li class="ledger-row ${p.due<=state.week?'is-due':''} ${isFeatured(p.actor)?'is-route':''}"><span class="ledger-art">${portrait(w(p.actor))}</span><span class="ledger-what"><strong>${esc(w(p.actor).name)}</strong>${esc(promiseWhat(p))}${promiseWeight(p)>1?' · counts double':''}</span><span class="ledger-due">${due(p)}<small>Week ${p.due}</small></span><span class="ledger-state">${promiseMet(p)?'On the card ✓':'Not booked yet'}</span></li>`).join('');
 return `<section class="card promise-ledger" id="promise-ledger" aria-labelledby="ledger-title"><div class="ledger-head"><h3 id="ledger-title">Promise ledger</h3><span>Your word, in writing</span></div>${rows?`<ol>${rows}</ol>`:'<p class="note">No open promises. Your word is clear.</p>'}${recent.length?`<ul class="ledger-history" aria-label="Recently settled">${recent.map(p=>`<li class="${p.status}">${p.status==='kept'?'Kept':'Broken'} · ${esc(w(p.actor).name)} · week ${p.resolved}</li>`).join('')}</ul>`:''}</section>`;
}
function windowCard(r){
 if(!isFeatured(r.id))return '';
 const route=FEATURED_ROUTES[r.id],tier=affectionTier(r),story=routeStory(r.id),state_=routeState(r.id);
 const moodNotes=Object.entries(route.moods||{}).map(([m,e])=>`${m==='low'?'after a loss':'after a win'}: ${PLAY_STYLES[e.style]}`).join(' · ');
 const knownStyle=!easyMode()?'Read them on the night':['warm','devoted'].includes(tier)?PLAY_STYLES[route.style]+(moodNotes?` (${moodNotes})`:''):'Keep talking to find out';
 const slots=memorySlots(r.id);
 const memories=slots.map(m=>`<figure class="polaroid ${m.found?'':'is-empty'}">${m.found?`<div class="polaroid-art">${portrait(r)}</div><figcaption><strong>${esc(m.title)}</strong>${esc(m.caption.replace('{week}',m.found.week))}</figcaption>`:`<div class="polaroid-art"></div><figcaption>${m.missed?'This moment passed you by.':'A memory not made yet'}</figcaption>`}</figure>`).join('');
 const complete=slots.length&&slots.every(m=>m.found);
 const ending=story&&state_.ending?story.endings[state_.ending]:null;
 const era=ERAS[state_.endedEra??eraIndex()]||ERAS[0];
 return `<section class="window-card" style="--character-color:${r.color}">${complete?'<div class="window-banner">Main event</div>':''}<small>Window card</small><p class="window-tell">${esc(tellFor(r))}</p><dl><div><dt>Finds them at</dt><dd>${esc(route.place)}</dd></div><div><dt>Signs off</dt><dd>“${esc(signoffFor(r))}”</dd></div><div><dt>Warms to</dt><dd>${esc(knownStyle)}</dd></div></dl>${story?`<div class="scrapbook" aria-label="Scrapbook">${memories}</div>`:'<p class="note">Their scrapbook opens as their story does.</p>'}${ending?`<p class="window-ending"><small>Era ${era.roman} ending</small><strong>${esc(ending.title)}</strong></p>`:''}</section>`;
}
function openWindowCard(id){
 const r=w(id);if(!r)return;
 modal(esc(r.name),`<div class="window-modal"><div class="window-portrait" data-mood="${affectionTier(r)}" style="--character-color:${r.color}">${portrait(r)}</div><p class="scene-gimmick">${esc(r.gimmick)}</p>${windowCard(r)}</div>`,(_,d)=>d.close(),'Done');
 const cancel=$('#modal').querySelector('.cancel');if(cancel)cancel.hidden=true;
}
function castCard(id){
 const r=w(id);if(!r)return '';
 const tier=affectionTier(r),status=routeStatus(id),slots=memorySlots(id),promise=state.promises.find(p=>p.actor===id&&p.status==='open'),sore=soreLine(id),jealous=!!jealousLine(id);
 const pips=slots.length?`<span class="cast-pips" role="img" aria-label="${slots.filter(m=>m.found).length} of ${slots.length} scrapbook memories">${slots.map(m=>`<i class="${m.found?'on':m.missed?'missed':''}"></i>`).join('')}</span>`:'';
 return `<li><button type="button" class="cast-card mood-${tier} status-${status.key} ${status.tier?'tier-'+status.tier:''}" data-window-card="${id}" style="--character-color:${r.color}"><span class="cast-art" data-mood="${tier}">${portrait(r)}${tier==='devoted'?'<span class="cast-heart" aria-hidden="true">♥</span>':''}${sore?'<span class="cast-sore">Still sore</span>':jealous?'<span class="cast-sore">Jealous</span>':''}</span><span class="cast-copy"><strong>${esc(r.name)}</strong><span class="cast-tell">${esc(tellFor(r))}</span><span class="cast-status">${esc(status.text)}</span>${promise?`<span class="cast-promise">Promised: ${esc(promiseWhat(promise))} · week ${promise.due}</span>`:''}${pips}</span></button></li>`;
}
function webPanel(){
 const rows=liveBonds().filter(b=>w(b.a)&&w(b.b)).map(b=>{
  const story=storyFor(b.a,b.b),team=state.teams.find(t=>[t.a,t.b].includes(b.a)&&[t.a,t.b].includes(b.b));
  const reading=team?`Team chemistry: ${team.chemistry>=70?'clicking':team.chemistry>=45?'finding a rhythm':'new'}`:story?`Rivalry: ${story.heat>=60?'boiling':story.heat>=30?'simmering':'a spark'}`:'Nothing booked between them yet';
  const jealous=[b.a,b.b].some(id=>relations().jealous[id]&&state.week-relations().jealous[id].week<=2);
  return `<li class="bond bond-${b.bond}"><span class="bond-faces"><span style="--character-color:${w(b.a).color}">${portrait(w(b.a))}</span><span style="--character-color:${w(b.b).color}">${portrait(w(b.b))}</span></span><span class="bond-copy"><strong>${esc(w(b.a).name)} &amp; ${esc(w(b.b).name)}</strong><span class="bond-label">${esc(b.label)}${jealous?' · jealous this week':''}</span><span>${esc(b.meaning)}</span><small>${esc(reading)}</small></span></li>`;
 }).join('');
 return `<section class="card web-panel" aria-labelledby="web-title"><div class="ledger-head"><h3 id="web-title">Who feels what</h3><span>Get close to one, the other notices</span></div><ul class="bond-list">${rows}</ul></section>`;
}
function epiloguePanel(){
 const list=relations().epilogues;if(!list.length)return '';
 return `<section class="card epilogue-panel"><div class="ledger-head"><h3>Epilogues</h3><span>Where they ended up</span></div><ul class="epilogue-list">${list.map(e=>{const era=ERAS[e.era]||ERAS[0];return `<li><span><strong>Era ${era.roman} · ${esc(era.name)}</strong><small>${e.cards.filter(c=>c.tier==='best').length} best · ${e.cards.filter(c=>c.tier==='neutral').length} neutral · ${e.cards.filter(c=>c.tier==='bad').length} bad</small></span><button type="button" class="btn" data-epilogue-replay="${e.era}">Replay</button></li>`}).join('')}</ul></section>`;
}
function lockerPage(){
 const ids=FEATURED_IDS.filter(id=>w(id)).sort((a,b)=>{
  const rank=id=>{const s=routeStatus(id).key;return {promised:0,waiting:1,open:2,closed:3,'drop-in':4,ended:5}[s]??6};
  return rank(a)-rank(b)||w(b).trust-w(a).trust;
 });
 return `<div class="locker-page">${townMapPanel()}
 <header class="press-heading locker-subhead"><h2>The Locker Room</h2><p>Who you spend your evenings with matters as much as who you book.</p></header>
 <section class="cast-board" aria-labelledby="cast-title"><div class="cast-head"><h2 id="cast-title">The featured eight</h2><p>${esc(reputationLine())} Tap anyone for their window card.</p></div><ul class="cast-grid">${ids.map(castCard).join('')}</ul></section>
 <div class="locker-columns">${promiseLedger()}${webPanel()}</div>
 ${epiloguePanel()}
 </div>`;
}
