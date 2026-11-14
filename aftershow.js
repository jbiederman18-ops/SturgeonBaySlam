'use strict';
// After the show: a one-screen overview of the night, then the backstage walk. Wrestlers with
// something to say come up to you one at a time, biggest moment first. Show night itself is no
// longer read segment by segment; the full report sits one tap behind the overview.
// Dialogue lives in routes.js (`backstage` on each featured route, BACKSTAGE_GENERIC as fallback) and
// roster.js (SUPPORTING_ROUTES: the rest of the roster, who share the same four slots).
const BACKSTAGE_CAP=4;
// How much each kind of moment matters when choosing who comes over. Biggest wins per wrestler.
// lostToCheat and remembers only fire for routes that write them (Rudy Giuliani, Terrible Towel).
const BACKSTAGE_WEIGHT={broken:90,lostToCheat:85,stole:80,lost:50,won:45,kept:65,flat:55,benched:60,remembers:40,idle:35};
// Catch-up nudge: anyone who hasn't come over in a while gets a little more pull, so the whole roster
// turns up across a month without a fixed slot. Points per week since their last walk, capped.
const BACKSTAGE_NUDGE=4,BACKSTAGE_NUDGE_CAP=20;
const BACKSTAGE_KINDS=['won','lost','lostToCheat','stole','flat','kept','broken','benched','idle','remembers','cutIn','skip'];
function backstageIds(){return [...FEATURED_IDS,...(typeof SUPPORTING_IDS==='object'?SUPPORTING_IDS:[])]}
let postView='overview',postViewWeek=null;

function showGrade(rating){return rating>=80?'A':rating>=65?'B':rating>=50?'C':'D'}
function tonightResults(h){const res=relations().results;return res?.week===h?.week?res:{won:[],lost:[]}}
function bondBetween(a,b){return liveBonds().find(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a))||null}
function rivalBond(a,b){return ['grudge','irritation'].includes(bondBetween(a,b)?.bond)}
// Who a wrestler minds seeing on the card in their place. One-sided bonds only run one way.
function rivalsOf(id){return liveBonds().filter(b=>['grudge','irritation'].includes(b.bond)&&(b.a===id||b.b===id)||b.bond==='one-sided'&&b.a===id).map(b=>b.a===id?b.b:b.a)}
function matchOfTheNight(h){
 let best=-1;(h.results||[]).forEach((r,i)=>{if(r.label!=='PROMO'&&Number.isFinite(r.rating)&&(best<0||r.rating>h.results[best].rating))best=i});
 return best;
}
function postVenue(h){return h.location?.venue||h.location?.town||'the hall'}
function promisePhrase(p){
 if(p.kind==='team')return `a tag match with ${dialogueName(p.target)}`;
 const what=promiseWhat(p,dialogueName);
 return /^(time|a|the) /.test(what)?what:'a '+what;
}

// ---------- Who comes over ----------
function buildBackstage(h){
 const card=state.card||[],results=h.results||[],motn=matchOfTheNight(h),on=new Map(),list=[],skipped=[];
 card.forEach((s,i)=>{for(const id of matchPeople(s)){if(!on.has(id))on.set(id,[]);on.get(id).push(i)}});
 const promises=state.promises.filter(p=>p.resolved===h.week&&['kept','broken'].includes(p.status)),walked=relations().walked||{};
 for(const id of backstageIds()){
  const route=routeFor(id);
  if(!w(id)||!route)continue;
  const options=[],own=route.backstage||{};
  for(const p of promises.filter(p=>p.actor===id))options.push({kind:p.status,score:BACKSTAGE_WEIGHT[p.status],promise:{kind:p.kind,target:p.target??null,made:promiseMade(p)},other:p.target??null});
  if(on.has(id)){
   for(const i of on.get(id)){
    const s=card[i],r=results[i];if(!s||!r)continue;
    let other=null;
    if(s.kind==='match'&&s.finish!=='No contest'){
     const sides=matchSides(s),mine=sides.find(side=>side.includes(id))||[],others=matchPeople(s).filter(x=>!mine.includes(x)),rival=others.find(x=>rivalBond(id,x));
     const winners=sides[winningSide(s)]||[],won=winners.includes(id),grade=showGrade(r.rating);
     const opponents=won||!winners.length?others:winners;
     other=opponents.find(x=>rivalBond(id,x))??opponents[0]??null;
     // Beaten by a cheat: only routes that write `lostToCheat` take it personally.
     const kind=!won&&own.lostToCheat&&(r.cheated||matchCheated(s))?'lostToCheat':won?'won':'lost';
     options.push({kind,score:BACKSTAGE_WEIGHT[kind]+(rival!=null?25:0)+(s.title?10:0),other,grade});
    }else if(s.target!=null)other=s.target;
    const grade=showGrade(r.rating);
    if(i===motn&&grade==='A')options.push({kind:'stole',score:BACKSTAGE_WEIGHT.stole,other,grade});
    if(grade==='D')options.push({kind:'flat',score:BACKSTAGE_WEIGHT.flat,other,grade});
   }
  }else{
   const rival=rivalsOf(id).find(x=>on.has(x));
   if(rival!=null)options.push({kind:'benched',score:BACKSTAGE_WEIGHT.benched,other:rival});
   else if(h.week>=4&&h.week-(w(id).lastSeen??0)>=4)options.push({kind:'idle',score:BACKSTAGE_WEIGHT.idle});
  }
  // A grudge that comes back weeks later, calmly (only routes that write `remembers`).
  if(own.remembers){const old=lastBroken(id);if(old&&h.week-old.resolved>=3&&h.week-old.resolved<=8)options.push({kind:'remembers',score:BACKSTAGE_WEIGHT.remembers,promise:{kind:old.kind,target:old.target??null,made:promiseMade(old)},other:old.target??null})}
  if(!options.length)continue;
  const top=options.reduce((a,b)=>b.score>a.score?b:a);
  const gap=Math.max(0,h.week-(walked[id]??0)-1),nudge=top.kind==='idle'?0:Math.min(BACKSTAGE_NUDGE_CAP,gap*BACKSTAGE_NUDGE);
  const approach={id,kind:top.kind,score:top.score+nudge,other:top.other??null,on:on.has(id),...(top.grade?{grade:top.grade}:{}),...(top.promise?{promise:top.promise}:{})};
  // A sore wrestler with something to say doesn't come over. That's a tell too. (Some always come over.)
  (soreLine(id)&&!route.neverSkips?skipped:list).push(approach);
 }
 const chosen=list.sort((a,b)=>b.score-a.score||a.id-b.id).slice(0,BACKSTAGE_CAP);
 // The card comes to you in the hallway first; anyone left off finds you on the way out.
 const order=[...chosen.filter(a=>a.on),...chosen.filter(a=>!a.on)];
 // One rival cuts in on the other's talk, right after it.
 for(let i=0;i<order.length;i++){
  const j=order.findIndex((b,k)=>k>i&&rivalBond(order[i].id,b.id)&&!routeFor(b.id)?.noCutIn);
  if(j<0)continue;
  const [cut]=order.splice(j,1);
  order.splice(i+1,0,{...cut,cutIn:true,on:order[i].on,other:order[i].id});
  break;
 }
 return {approaches:order,skipped:skipped.sort((a,b)=>b.score-a.score).slice(0,1),answers:{},done:false,jesus:typeof jesusHint==='function'?jesusHint():null};
}
function ensureBackstage(h){
 if(!h)return {approaches:[],skipped:[],answers:{},done:true};
 if(!h.backstage)h.backstage=recordWalk(buildBackstage(h),h.week);
 return h.backstage;
}
// Who came over, by week: feeds the catch-up nudge.
function recordWalk(bs,week){const walked=relations().walked??={};for(const a of bs.approaches)walked[a.id]=week;return bs}

function promiseMade(p){const week=Number(String(p?.id||'').split('-')[0]);return Number.isInteger(week)?week:null}
function lastBroken(id){return state.promises.filter(p=>p.actor===id&&p.status==='broken').sort((a,b)=>b.resolved-a.resolved)[0]||null}

// ---------- Dialogue ----------
function backstageMoment(a){
 const own=routeFor(a.id)?.backstage||{};
 if(a.cutIn)return own.cutIn||BACKSTAGE_GENERIC.cutIn;
 return own[a.kind]||BACKSTAGE_GENERIC[a.kind]||(a.kind==='lostToCheat'?own.lost||BACKSTAGE_GENERIC.lost:null)||BACKSTAGE_GENERIC.won;
}
function fillBackstage(text,a){
 return String(text||'')
  .replaceAll('{name}',dialogueName(a.other))
  .replaceAll('{speaker}',routeFor(a.id)?.speaker||w(a.id).name)
  .replaceAll('{promise}',a.promise?promisePhrase({...a.promise,actor:a.id}):'a spot on the card')
  .replaceAll('{week}',a.promise?.made!=null?`week ${a.promise.made}`:'that week')
  .replaceAll('{grade}',a.grade||'C');
}
function backstageWhen(a,when={}){
 const res=tonightResults(state.recap),r=w(a.id),won=res.won.includes(a.id),lost=res.lost.includes(a.id);
 const checks={wonTonight:on=>!on||won,lostTonight:on=>!on||lost,wonLastShow:on=>!on||won,lostLastShow:on=>!on||lost,champion:on=>!!r.champ===!!on,minTrust:n=>r.trust>=n,eventWeek:on=>!on||isEvent(),notEventWeek:on=>!on||!isEvent(),
  beatenByCheat:on=>!on||!!res.cheatLosses?.includes(a.id),cheatedLastShow:on=>!on||!!res.cheatWins?.includes(a.id),cheatedTonight:on=>!on||!!res.cheatWins?.includes(a.id)};
 return Object.entries(when||{}).every(([key,value])=>!checks[key]||checks[key](value));
}
function backstageCase(a,reply){return reply.cases?.find(c=>backstageWhen(a,c.when))||null}
// What they need tonight: a loss or a win reads the route's moods off tonight's result.
// Routes with moodOn:'heat' (Terrible Towel, David Guetta) read the room's heat instead of a result.
function backstageMood(a){
 const route=routeFor(a.id),res=tonightResults(state.recap),h=state.recap;
 if(route?.moodOn==='heat'&&Number.isFinite(h?.rating))return h.rating<50?'low':h.rating>=80?'high':null;
 return res.lost.includes(a.id)?'low':res.won.includes(a.id)?'high':null;
}
function backstageWant(a){
 const route=routeFor(a.id),mood=backstageMood(a);
 return mood&&route.moods?.[mood]?.style||route.style;
}
// A route with holdsGrudge (Terrible Towel) warms up at half speed for 12 weeks after a broken promise.
function grudgeHeld(id){const route=routeFor(id),old=lastBroken(id);return !!route?.holdsGrudge&&!!old&&state.week-old.resolved<12}
function backstageDelta(a,reply){
 const hit=backstageCase(a,reply);
 if(Number.isFinite(hit?.delta))return hit.delta;
 if(Number.isFinite(reply.delta))return reply.delta;
 if(reply.breaks)return -6;
 if(reply.truth)return -2;
 const route=routeFor(a.id),want=backstageWant(a),rep=playStyle();
 let delta=(reply.style===want?6:2)+(rep===want?1:0);
 if(route.distrusts&&rep===route.distrusts)delta-=2;
 if(isStale(a.id,reply))delta=Math.ceil(delta/2);
 if(delta>0&&grudgeHeld(a.id))delta=Math.ceil(delta/2);
 return delta;
}
function backstageMorale(a,reply){const hit=backstageCase(a,reply);return Number(hit?.morale??reply.morale??(reply.truth?4:0))||0}
function backstageSides(a,reply){
 const sides={...(backstageCase(a,reply)?.sides||reply.sides||{})};
 // A route that leaks (Jaxxon) passes what you said on to whoever else was in his night.
 if(routeFor(a.id)?.leaks&&reply.style&&a.other!=null&&w(a.other)&&!(a.other in sides))sides[a.other]=-1;
 return sides;
}
function backstageNeedsOpponent(reply){return reply.promise==='rematch'||reply.promise==='team'}
function backstagePromise(a,reply){
 if(!reply.promise)return null;
 const target=backstageNeedsOpponent(reply)?a.other:null;
 if(backstageNeedsOpponent(reply)&&!w(target))return null;
 return {kind:reply.promise,target,due:state.week+(Number.isFinite(reply.due)?reply.due:1)};
}
function backstageCost(a,reply){
 const p=backstagePromise(a,reply);if(!p)return '';
 if(matchingPromise(a.id,p.kind,p.due))return 'Already promised';
 const owed=promisesOwed(p.due),weight=promiseWeight({...p,actor:a.id});
 return `Promises ${promiseWhat({...p,actor:a.id})}${weight>1?' (counts double)':''}, week ${p.due}${owed?` · that show already owes ${owed}`:''}`;
}
function backstageChips(a,reply){
 const delta=backstageDelta(a,reply),chips=[{stat:'trust',label:delta>=6?'Warms to this ▲▲':delta>0?'Small step ▲':reply.breaks?'Breaks their world ▼':reply.truth?'Hard truth ▼':'Cools things ▼'}];
 if(isStale(a.id,reply)&&!backstageCase(a,reply))chips.push({stat:'trust',label:'Heard it before'});
 const route=routeFor(a.id);
 if(reply.style&&reply.style===backstageWant(a)&&reply.style!==route.style)chips.push({stat:'trust',label:'What they need tonight'});
 const morale=backstageMorale(a,reply);if(morale)chips.push({stat:'morale',label:`Morale ${morale>0?'+':'−'}${Math.abs(morale)}`});
 for(const [id,d] of Object.entries(backstageSides(a,reply)))if(w(Number(id)))chips.push({stat:'trust',label:`${w(Number(id)).name} ${d>0?'▲':'▼'}`});
 if(backstagePromise(a,reply))chips.push({stat:'promise',label:'Makes a promise'});
 return chips;
}
// Applies one backstage reply. Returns false if it cannot be applied (already answered, no show).
function answerBackstage(index,choice){
 const h=state.recap,bs=h?.backstage,a=bs?.approaches[index];
 if(!a||bs.answers[index])return false;
 const reply=backstageMoment(a).replies[choice];if(!reply||(backstageNeedsOpponent(reply)&&!w(a.other)))return false;
 const rel=relations(),r=w(a.id),hit=backstageCase(a,reply),stale=!hit&&isStale(a.id,reply),delta=backstageDelta(a,reply),before=affectionTier(r),morale=backstageMorale(a,reply);
 offstageTrust(r,delta);
 if(morale)r.morale=clamp((r.morale??70)+morale);
 if(reply.style){rel.style[reply.style]++;const said=rel.said[a.id]??=[];said.push(reply.style);if(said.length>STALE_AFTER)said.splice(0,said.length-STALE_AFTER)}
 else rel.said[a.id]=[];
 const heard=[];
 for(const [key,d] of Object.entries(backstageSides(a,reply))){
  const other=Number(key);if(!w(other)||other===a.id||!Number.isFinite(d))continue;
  offstageTrust(w(other),d);
  if(d<0&&routeFor(other)?.heard)heard.push(other);
 }
 for(const other of heard)rel.jealous[other]={of:a.id,week:state.week,heard:true};
 if(reply.breaks)rel.sore[a.id]=state.week;
 if(rel.jealous[a.id]&&(delta>0||!isFeatured(a.id)))delete rel.jealous[a.id];
 let payoff=null;const p=backstagePromise(a,reply);
 if(p){
  const had=matchingPromise(a.id,p.kind,p.due);
  makePromise(a.id,p.kind,p.due,p.target);
  payoff=had?'Already on the promise ledger':promiseLabel(state.promises.filter(x=>x.actor===a.id&&x.kind===p.kind).at(-1));
 }
 bs.answers[index]={reply:choice,delta,stale,heard,case:hit?reply.cases.indexOf(hit):null,from:before,to:affectionTier(r),payoff};
 incident(`After the show, ${r.name} caught you ${a.on?'backstage':'on the way out'}.${payoff?' '+payoff+'.':''}`,[a.id],'relationship');
 return true;
}

// ---------- The walk (played in the cutscene player) ----------
function backstageOpening(index){
 const h=state.recap,list=h.backstage.approaches,a=list[index],m=backstageMoment(a),pages=[];
 const prev=list[index-1];
 if(!prev||prev.on!==a.on)pages.push({type:'title',place:a.on?'The back hallway':'The parking lot',detail:postVenue(h),when:`Week ${h.week} · after the show`,actor:a.id});
 if(a.cutIn)pages.push({type:'narration',text:`${dialogueName(a.id)} cuts in.`,actor:a.id,emote:'angry'});
 pages.push({type:'narration',text:fillBackstage(m.tell,a),actor:a.id});
 // The wider roster has no evenings, so word that got back to them comes out here, first thing.
 const note=relations().jealous[a.id],route=routeFor(a.id);
 if(!isFeatured(a.id)&&note?.heard&&route?.heard&&state.week-note.week<=2)pages.push({type:'line',text:route.heard.replaceAll('{name}',dialogueName(note.of)),actor:a.id,emote:'hurt'});
 const rivalLine=FEATURED_RIVAL_LINES[a.id]?.[a.cutIn?'cutIn':a.kind]?.[a.other];
 const line=fillBackstage(rivalLine??m.line,a);
 pages.push({type:'line',text:line,actor:a.id,emote:a.cutIn?'intense':null});
 pages.push({type:'choice',replies:m.replies.map(reply=>backstageNeedsOpponent(reply)&&!w(a.other)?{...reply,disabled:true,text:reply.promise==='team'?'No tag partner was named':'No opponent was named'}:{...reply,text:fillBackstage(reply.text,a)}),actor:a.id,costFor:reply=>backstageCost(a,reply),chipsFor:reply=>backstageChips(a,reply),prompt:line});
 return pages;
}
function backstageOutcome(index){
 const h=state.recap,a=h.backstage.approaches[index],answer=h.backstage.answers[index];if(!answer)return [];
 const reply=backstageMoment(a).replies[answer.reply],hit=Number.isInteger(answer.case)?reply.cases?.[answer.case]:null,actor=a.id;
 const emote=emoteFor(answer.delta,reply),pages=[{type:'shout',text:shoutFor(reply),tone:reply.breaks?'bad':'good',actor},{type:'you',text:fillBackstage(reply.text,a),actor}];
 for(const part of splitReaction(fillBackstage(hit?.reaction||reply.reaction,a)))pages.push({...part,actor,emote});
 const route=routeFor(actor);
 if(answer.stale)pages.push(route.stale?{type:'line',text:route.stale,actor}:{type:'narration',text:`${route.speaker} nods. They’ve heard that one from you before.`,actor});
 if(answer.from&&answer.to&&answer.from!==answer.to&&route.tells?.[answer.to])pages.push({type:'tell',up:AFFECTION_TIERS.indexOf(answer.to)>AFFECTION_TIERS.indexOf(answer.from),text:route.tells[answer.to],actor});
 for(const other of answer.heard||[])pages.push({type:'narration',text:`That will get back to ${w(other).name}.`,actor:other,emote:'hurt'});
 if(answer.payoff)pages.push({type:'stamp',text:answer.payoff,actor});
 return pages;
}
function backstageEnding(h){
 const bs=h.backstage,pages=[],last=bs.approaches.at(-1)?.id??bs.skipped[0]?.id;
 for(const a of bs.skipped){
  const own=routeFor(a.id)?.backstage?.skip;
  pages.push({type:'narration',text:fillBackstage(own||BACKSTAGE_GENERIC.skip,a),actor:a.id,emote:'hurt'});
 }
 if(typeof jesusHintPages==='function')pages.push(...jesusHintPages(h));
 pages.push({type:'narration',text:bs.approaches.length?'The lot empties out. The building goes dark behind you.':'The building empties out. Everyone seems fine.',actor:last,figure:false});
 return pages;
}
function openBackstageWalk(){
 const h=state.recap;if(!h)return;
 const bs=ensureBackstage(h),d=$('#modal'),order=bs.approaches.map((_,i)=>i).filter(i=>!bs.answers[i]);
 let at=0;
 const header=`<span class="aa-brand">After the show</span><span>Week ${h.week} · ${esc(postVenue(h))}</span><span>${bs.approaches.length} want${bs.approaches.length===1?'s':''} a word</span>`;
 const pages=order.length?backstageOpening(order[0]):backstageEnding(h);
 d.oncancel=()=>scenePlayer?.close?.();
 d.onclose=()=>{scenePlayer?.close?.();if(!d.open){d.removeAttribute('aria-label');render()}};
 runScenePlayer({header,pages,
  onChoose:choice=>{
   const index=order[at];if(!answerBackstage(index,choice))return null;
   at++;const more=backstageOutcome(index);
   if(at<order.length)more.push(...backstageOpening(order[at]));
   else{bs.done=true;more.push(...backstageEnding(h))}
   save();return more;
  },
  finishLabel:`Head home · Week ${h.week+1} →`,
  finish:()=>{bs.done=true;d.onclose=null;d.removeAttribute('aria-label');d.close();nextWeek()}
 });
}

// ---------- Screens ----------
function postShowPage(h){
 const bs=ensureBackstage(h),results=h.results||[],motn=matchOfTheNight(h);
 const verdict=h.rating>=80?'Packed house, hot finish.':h.rating>=65?'That’s some good wrestling.':h.rating>=50?'A little rough. A lot of heart.':'There’s always next week.';
 const town=h.location?.town?` · ${h.location.town}, WI`:'';
 const promises=state.promises.filter(p=>p.resolved===h.week&&['kept','broken','forgiven'].includes(p.status));
 const heat=results.map((r,i)=>`<li class="${i===motn?'is-best':''}" style="--heat:${clamp(r.rating)}%"><span class="sr-only">${esc(r.headline)}: ${showGrade(r.rating)}</span></li>`).join('');
 const best=results[motn];
 const rows=results.map((r,i)=>{const grade=showGrade(r.rating);return `<li class="post-row ${i===motn?'is-best':''}"><small>${i===results.length-1?'Main event':esc(r.label==='PROMO'?'Promo':'Match '+(i+1))}</small><strong>${esc(r.headline)}</strong><b class="post-grade grade-${grade}" aria-label="Grade ${grade}">${grade}</b></li>`}).join('');
 const left=bs.approaches.filter((_,i)=>!bs.answers[i]).length,walked=bs.done||!bs.approaches.length;
 const faces=bs.approaches.map(a=>`<li style="--character-color:${w(a.id).color}" data-mood="${affectionTier(w(a.id))}"><span class="sr-only">${esc(w(a.id).name)}</span>${portrait(w(a.id))}</li>`).join('');
 const cta=walked
  ?`<button class="btn primary press-cta" id="next-week">Head home · Week ${h.week+1} <span aria-hidden="true">→</span></button>`
  :`<button class="btn primary press-cta" id="post-walk">${left<bs.approaches.length?'Back to the hallway':'Head backstage'} <span aria-hidden="true">→</span></button>`;
 const waiting=bs.approaches.length
  ?`<div class="post-waiting-copy"><strong>${walked?'Everyone’s had their say':`${left} ${left===1?'person wants':'people want'} a word`}</strong><span>${walked?'The lot’s empty.':'They’ll find you on the way out.'}</span></div><ul class="post-faces" aria-label="Waiting to talk">${faces}</ul>`
  :`<div class="post-waiting-copy"><strong>A quiet night backstage</strong><span>The building empties out. Everyone seems fine.</span></div>`;
 return `<div class="recap-wrap post-show">
 ${pressHeading('After the show',`${esc(h.name)} · Week ${h.week}${esc(town)}`)}
 <section class="post-hero"><small>Tonight in one line</small><h2>${esc(verdict)}</h2></section>
 <div class="press-receipts">
  <div><small>Attendance</small><strong>${h.attendance}</strong><span>${Math.round(h.attendance/(h.capacity||300)*100)}% capacity</span></div>
  ${Number.isFinite(h.ticket)?`<div><small>Gate</small><strong>${money(h.gate??h.attendance*h.ticket)}</strong><span>ticket sales</span></div>`:''}
  <div><small>Profit</small><strong class="${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</strong><span>after ${money(h.cost)} costs</span></div>
 </div>
 ${results.length?`<section class="post-heat" aria-labelledby="post-heat-title"><h3 id="post-heat-title">Crowd heat across the card</h3><ol class="post-heat-bars">${heat}</ol></section>`:''}
 ${best?`<section class="post-motn"><small>Match of the night</small><strong>${esc(best.headline)}</strong>${best.explanation?`<p>${esc(best.explanation)}</p>`:''}</section>`:''}
 <section class="post-card" aria-labelledby="post-card-title"><h3 id="post-card-title">The card <span>Graded by the crowd</span></h3><ol>${rows}</ol></section>
 ${promises.length?`<ul class="post-promises" aria-label="Promises tonight">${promises.map(p=>`<li class="is-${p.status}">${p.status==='kept'?'Kept':p.status==='forgiven'?'Forgiven':'Broken'} · ${esc(w(p.actor).name)}: ${esc(promiseWhat(p))}</li>`).join('')}</ul>`:''}
 ${riseRecap(h)}
 ${typeof jesusHintCard==='function'?jesusHintCard(h):''}
 <section class="post-waiting">${waiting}</section>
 ${cta}
 <button type="button" class="text-btn post-report-link" id="post-report">Full show report →</button>
 </div>`;
}
// The old recap, now one tap behind the overview.
function recapPage(){
 const h=state.recap;
 if(postViewWeek!==h.week){postView='overview';postViewWeek=h.week}
 return postView==='report'?fullReportPage():postShowPage(h);
}
// Per-segment summaries from show night, kept for the full report (short text only).
function captureShowReport(){
 const live=state.liveShow;if(!live)return [];
 return live.moments.map((m,i)=>{
  const s=state.card[i],answer=live.answers[i];if(!s||!answer)return null;
  try{
   const tier=CALL_TIERS[answer.tier||callTier(answer.delta??0)]||CALL_TIERS.fair,quote=reportQuote(m,answer);
   return {summary:reportSummary(m,s,answer),quote:quote?{who:quote.who,text:quote.text.replace(/^[“"]|[”"]$/g,'')}:null,stamp:tier.stamp,call:`${callLead(s).name}’s call · ${answer.labelTag||answer.tag||''}`.replace(/ · $/,'')};
  }catch{return null}
 });
}
function reportExtra(h,i){
 const r=h.report?.[i];if(!r)return '';
 return `<p class="post-report-summary">${esc(r.summary)}</p>${r.quote?`<blockquote class="report-quote"><p>“${esc(r.quote.text)}”</p><cite>${esc(r.quote.who)}</cite></blockquote>`:''}<p class="post-report-call"><span class="call-stamp">${esc(r.stamp)}</span> ${esc(r.call)}</p>`;
}
function bindPostShow(){
 if($('#post-walk'))$('#post-walk').onclick=openBackstageWalk;
 if($('#post-report'))$('#post-report').onclick=()=>{postView='report';render();window.scrollTo(0,0)};
 if($('#post-back'))$('#post-back').onclick=()=>{postView='overview';render();window.scrollTo(0,0)};
}
