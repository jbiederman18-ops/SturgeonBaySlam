'use strict';
// The Ledger: the Good Lord Above's big book. His weekly file (snafu.js) is the parking ticket;
// this is the report card. Every notable kindness and every cheap move is written down silently.
// He reads it once mid-era and again on moving day, then hands down a gift or a punishment.
// At the very end, claiming the legacy, He reads the whole career: Heaven, folding chairs, or the Pit.
// The drama of a wrestling show is the goal of booking, so finishes never count. Booking only counts
// when it reaches life outside the ring: promises, overwork, giving someone their spot back.

const LEDGER_ACTS={
 promiseKept:{pts:2,say:e=>`You kept your word to ${nameOf(e.actor)}.`},
 humble:{pts:3,say:()=>'When I sent something down, you said “Thy will be done.” Nobody says that.'},
 madeRight:{pts:1,say:()=>'You paid to make My messes right.'},
 peopleFirst:{pts:2,say:()=>'When it was money or people, you spent the money.'},
 hardTruth:{pts:1,cap:2,say:e=>`You told ${nameOf(e.actor)} the truth when it cost you.`},
 showedUp:{pts:2,say:e=>`You showed up for ${nameOf(e.actor)} the one night it mattered.`},
 forgotten:{pts:1,cap:2,say:e=>`You put ${nameOf(e.actor)} back on the card after weeks away.`},
 closer:{pts:1,cap:2,say:e=>`${nameOf(e.actor)} trusts you a little more than before. I noticed.`},
 lockerRoom:{pts:3,say:()=>'You turned down the celebrity to protect your locker room.'},
 generous:{pts:3,say:e=>`You started a tradition: ${TRADITIONS[e.detail]?.name||'a good one'}.`},
 fairFight:{pts:1,say:()=>'You beat the competition fair and square.'},
 promiseBroken:{pts:-4,say:e=>`You broke your word to ${nameOf(e.actor)}.`},
 blamed:{pts:-5,say:e=>`You blamed ${nameOf(e.actor)} for My work.`},
 // Retired in 7.83: kept so older ledgers still load, then stripped.
 faceCheat:{pts:0,retired:true,say:()=>''},
 gossip:{pts:-2,cap:4,say:e=>`What you said about ${nameOf(e.target)} got back to them.`},
 brushOff:{pts:-1,cap:2,say:e=>`You brushed ${nameOf(e.actor)} off.`},
 bitFlopped:{pts:-1,say:()=>'You made My punishment into a bit. It did not land.'},
 raid:{pts:-3,say:()=>'You raided another promotion’s card.'},
 celebrity:{pts:-3,say:()=>'You put a celebrity ahead of your own locker room.'},
 overworked:{pts:-1,say:e=>`You worked ${nameOf(e.actor)} three times in one night.`},
 overpromised:{pts:-2,say:()=>'You promised more than the card could hold.'}
};
// Era problems where "make it right" means spending on people, not equipment.
const PEOPLE_FIRST_ISSUES=['c-motel','s-resale','s-legend'];
const GENEROUS_TRADITIONS=['kids','tryouts','homecoming'];
// Per-week average needed for a verdict. Over a 12-week era that's a net of about ±9.
const LEDGER_BAND=.75,LEDGER_CARRY=.25;
// Chapters per era (see eraIndex in rise.js): the check-in lands halfway through.
const ERA_CHAPTERS=[2,1,2,2,1];

function ledgerEra(s=state){return eraIndex(s?.progression?.stage||0)}
function ledgerDefaults(s){
 const l=s.ledger&&typeof s.ledger==='object'?s.ledger:{};
 if(!Array.isArray(l.entries))l.entries=[];
 if(!Array.isArray(l.visits))l.visits=[];
 if(!Number.isFinite(l.carry))l.carry=0;
 if(!Number.isFinite(l.total))l.total=l.entries.reduce((n,e)=>n+(e.pts||0),0);
 // Retired acts come off the books.
 if(l.entries.some(e=>LEDGER_ACTS[e.key]?.retired)){for(const e of l.entries)if(LEDGER_ACTS[e.key]?.retired)l.total-=e.pts||0;l.entries=l.entries.filter(e=>!LEDGER_ACTS[e.key]?.retired)}
 if(!l.eraStart||typeof l.eraStart!=='object')l.eraStart={};
 if(!l.effects||typeof l.effects!=='object')l.effects={};
 s.ledger=l;
 const era=ledgerEra(s);if(l.eraStart[era]==null)l.eraStart[era]=era===0?1:s.week;
 return l;
}
// Write one act down. Caps stop any one habit from being farmed or sinking you alone.
function ledgerNote(key,detail={},s=state){
 const act=LEDGER_ACTS[key];if(!act||act.retired)return null;
 const l=ledgerDefaults(s);
 if(act.cap&&l.entries.filter(e=>e.key===key&&e.week===s.week).length>=act.cap)return null;
 const entry={week:s.week,era:ledgerEra(s),key,pts:act.pts,...detail};
 l.entries.push(entry);l.total+=act.pts;
 if(l.entries.length>400)l.entries=l.entries.slice(-400);
 return entry;
}
function ledgerSay(e){return LEDGER_ACTS[e.key]?.say(e)||'You know what you did.'}
function ledgerSlice(from,to,s=state){return ledgerDefaults(s).entries.filter(e=>e.week>=from&&e.week<=to)}
function ledgerVerdict(avg){return avg>=LEDGER_BAND?'nice':avg<=-LEDGER_BAND?'naughty':'lukewarm'}
function ledgerScore(from,to,s=state){
 const l=ledgerDefaults(s),entries=ledgerSlice(from,to,s),net=entries.reduce((n,e)=>n+e.pts,0),weeks=Math.max(1,to-from+1);
 return {entries,net,weeks,avg:net/weeks+l.carry};
}
// The acts He brings up: the biggest ones pointing the way of the verdict, newest first.
function ledgerHighlights(entries,verdict){
 const pick=sign=>{const seen=new Set();return entries.filter(e=>Math.sign(e.pts)===sign).slice().reverse().sort((a,b)=>Math.abs(b.pts)-Math.abs(a.pts)).filter(e=>{const t=ledgerSay(e);if(seen.has(t))return false;seen.add(t);return true})};
 const list=verdict==='nice'?pick(1).slice(0,3):verdict==='naughty'?pick(-1).slice(0,3):[...pick(1).slice(0,1),...pick(-1).slice(0,1)];
 return list.map(e=>({...e}));
}
// Silent in normal play. Easy mode gets a rough lean on the Decisions tab.
function ledgerLean(s=state){
 const l=ledgerDefaults(s),from=l.eraStart[ledgerEra(s)]||1,score=ledgerScore(from,Math.max(from,s.week),s);
 return ledgerVerdict(score.avg);
}

// ---------- Gifts and punishments ----------
const LEDGER_GIFTS={
 plate:{name:'The collection plate, returned',apply:()=>{const n=fixCost()*5;state.cash+=n;return `+${money(n)} cash`}},
 forgiveness:{name:'Forgiveness',apply:()=>{for(const x of openSins())x.judged='forgiven';return 'His file on you is wiped clean'}},
 blessedCard:{name:'A blessed card',apply:()=>{ledgerDefaults(state).effects.quality={value:1,shows:1};return 'Next show, every segment +1 quality'}},
 packed:{name:'A packed house',apply:()=>{ledgerDefaults(state).effects.crowd={factor:1.15,shows:2};return 'Next two shows draw 15% more'}},
 lockerRoom:{name:'A blessing on the locker room',apply:()=>{for(const r of state.roster){r.morale=clamp((r.morale??70)+5);if(isFeatured(r.id))r.trust=clamp(r.trust+3)}return 'Everyone +5 morale · featured wrestlers +3 trust'}},
 halo:{name:'A halo for one',apply:()=>{const r=state.roster.slice().sort((a,b)=>b.trust-a.trust||a.id-b.id)[0];r.momentum=clamp(r.momentum+3,-20,20);return `${r.name} +3 momentum`}},
 grace:{name:'Grace',apply:()=>{ledgerDefaults(state).effects.grace=true;return 'The next act of God is waived the moment it lands'}}
};
const LEDGER_PUNISHMENTS={
 plague:{name:'A plague of empty chairs',apply:()=>{ledgerDefaults(state).effects.crowd={factor:.85,shows:2};return 'Next two shows draw 15% fewer'}},
 cursed:{name:'A cursed card',apply:()=>{ledgerDefaults(state).effects.quality={value:-1,shows:1};return 'Next show, every segment −1 quality'}},
 tithe:{name:'A tithe, taken',apply:()=>{const n=Math.min(Math.max(0,state.cash),fixCost()*5);state.cash-=n;return `−${money(n)} cash`}},
 heard:{name:'A locker room that’s heard',apply:()=>{for(const r of state.roster)r.morale=clamp((r.morale??70)-5);return 'Everyone −5 morale. He told them. All of it.'}},
 smite:{name:'An act of God, unprompted',apply:()=>{ledgerDefaults(state).effects.forceSmite=true;return 'Next week, an act of God whatever your file says'}},
 rival:{name:'A blessing for the competition',apply:()=>{const until=careerSeason()*12;ledgerDefaults(state).effects.rival={factor:1.2,until};return `${currentEra().rival.name} draws 20% more through week ${until}`}}
};
// His mood (favor) sets the size: a pleased Lord gives two gifts, a displeased one hands down two punishments.
function ledgerOutcome(verdict){
 if(verdict==='lukewarm')return {size:'none',items:[]};
 const l=ledgerDefaults(state),table=verdict==='nice'?LEDGER_GIFTS:LEDGER_PUNISHMENTS,keys=Object.keys(table);
 const big=verdict==='nice'?lordFavor()>=60:lordFavor()<40;
 const start=(l.visits.filter(v=>v.verdict===verdict).length*3+ledgerEra(state))%keys.length;
 const picked=[keys[start],...(big?[keys[(start+1)%keys.length]]:[])];
 return {size:big?'big':'small',items:picked.map(key=>({key,name:table[key].name,text:table[key].apply()}))};
}
function ledgerVisit(kind,from,to,extra={}){
 const l=ledgerDefaults(state),score=ledgerScore(from,to),verdict=ledgerVerdict(score.avg);
 if(kind==='checkin'&&verdict==='lukewarm'){const v={kind,era:ledgerEra(state),week:state.week,verdict,silent:true,seen:true,...extra};l.visits.push(v);return v}
 const outcome=ledgerOutcome(verdict);
 const v={id:l.visits.length+1,kind,era:extra.era??ledgerEra(state),week:state.week,from,to,verdict,size:outcome.size,outcome:outcome.items,highlights:ledgerHighlights(score.entries,verdict),seen:false,...extra};
 l.visits.push(v);
 incident(`The Good Lord Above read the ledger. ${verdict==='nice'?'Good boy.':verdict==='naughty'?'Naughty.':'Lukewarm.'}${outcome.items.length?' '+outcome.items.map(i=>`${i.name}: ${i.text}.`).join(' '):''}`,[],'lord');
 return v;
}
// Start of every week: the mid-era check-in, and a season reckoning once the dynasty is claimed.
function ledgerTick(s=state){
 const l=ledgerDefaults(s);
 if(s!==state||!s.started||s.liveShow||s.recap)return null;
 const era=ledgerEra(s),start=l.eraStart[era]||1,p=s.progression||{};
 if(p.dynasty){
  if(s.week%12===1&&s.week>(l.final?.week||0)+1&&!l.visits.some(v=>v.kind==='season'&&v.week===s.week))return ledgerVisit('season',s.week-12,s.week-1);
  return null;
 }
 const mid=start+ERA_CHAPTERS[era]*6;
 if(s.week>=mid&&s.week<mid+4&&!l.visits.some(v=>v.kind==='checkin'&&v.era===era))return ledgerVisit('checkin',start,s.week-1);
 return null;
}
// Moving day: the whole era, before the epilogue reel. A quarter of it carries into the next era.
function ledgerReckoning(era){
 const l=ledgerDefaults(state);
 if(l.visits.some(v=>v.kind==='reckoning'&&v.era===era))return null;
 const from=l.eraStart[era]||1,score=ledgerScore(from,state.week);
 const v=ledgerVisit('reckoning',from,state.week,{era});
 l.carry=Math.round(LEDGER_CARRY*(score.avg-l.carry)*100)/100;
 return v;
}
// The end of your life's work: the whole career, every page.
function ledgerFinal(){
 const l=ledgerDefaults(state);if(l.final)return l.final;
 const avg=l.total/Math.max(1,state.week),verdict=ledgerVerdict(avg);
 l.final={week:state.week,verdict,highlights:ledgerHighlights(l.entries,verdict),seen:false};
 incident(`The Good Lord Above read the whole ledger. ${verdict==='nice'?'Ringside, forever.':verdict==='naughty'?'The deepest pit of oblivion.':'Folding chairs, forever.'}`,[],'lord');
 return l.final;
}
function pendingLedgerVisit(kind=null){return (state.ledger?.visits||[]).find(v=>!v.seen&&!v.silent&&(!kind||v.kind===kind))||null}
function pendingFinal(){return state.ledger?.final&&!state.ledger.final.seen?state.ledger.final:null}

// ---------- Effects on the show ----------
function ledgerCrowdFactor(){const c=state.ledger?.effects?.crowd;return c?.shows>0?c.factor:1}
function ledgerSegmentBonus(){const q=state.ledger?.effects?.quality;return q?.shows>0?q.value:0}
function ledgerRivalFactor(week=state.week){const r=state.ledger?.effects?.rival;return r&&week<=r.until?r.factor:1}
// Before lastSeen updates: who's coming back after three or more weeks away.
function ledgerShowStart(){
 const ids=showParticipants();
 for(const id of ids){const r=w(id);if(r?.lastSeen&&state.week-r.lastSeen>=3)ledgerNote('forgotten',{actor:id})}
}
function ledgerShowEnd(fallout){
 const e=ledgerDefaults(state).effects;
 if(e.quality?.shows>0){fallout.push(incident(e.quality.value>0?'A blessed card: every segment felt lighter tonight.':'A cursed card: every segment felt heavier tonight.',[],'lord'));if(--e.quality.shows<=0)delete e.quality}
 if(e.crowd?.shows>0){fallout.push(incident(e.crowd.factor>1?'A packed house, from above.':'A plague of empty chairs.',[],'lord'));if(--e.crowd.shows<=0)delete e.crowd}
 if(e.rival&&state.week>=e.rival.until)delete e.rival;
}

// ---------- His visits, on the cutscene player ----------
const VERDICT_TITLE={nice:'Good boy',naughty:'Naughty',lukewarm:'Lukewarm'};
function ledgerVisitPages(v){
 const L='lord',era=ERAS[v.era]||currentEra(),pages=[];
 const detail=v.kind==='checkin'?'A look at the ledger':v.kind==='reckoning'?`The ${era.name} reckoning`:'A season’s reckoning';
 pages.push({type:'title',place:'Up Above',detail,when:`Week ${v.week}`,actor:L});
 pages.push({type:'line',actor:L,text:v.kind==='checkin'?'Halfway through the era. I like to look at the ledger halfway. Keeps everyone honest. Mostly you.':v.kind==='reckoning'?`Before you pack the van: the ledger. The whole ${era.name}.`:'Another season. Another page of the ledger.'});
 pages.push({type:'line',actor:L,set:'record',text:'Not the little file. The big book. I write everything down.',card:{small:'The ledger',title:v.kind==='reckoning'?era.name:`Weeks ${v.from}–${v.to}`,items:v.highlights.length?v.highlights.map(ledgerSay):['Nothing worth mentioning. That is its own kind of problem.']}});
 for(const e of v.highlights.slice(0,2))pages.push({type:'line',actor:L,set:'record',text:ledgerSay(e),emote:e.pts>0?'delight':'angry'});
 if(v.verdict==='nice')pages.push(
  {type:'shout',text:'GOOD BOY!',tone:'good',actor:L},
  {type:'line',actor:L,emote:'delight',text:'You have been a good boy. I did not see that coming. I made you, and I did not see it coming.'},
  {type:'narration',actor:L,text:'He reaches into His robe.',card:{small:'A gift from above',title:v.outcome.map(i=>i.name).join(' + '),items:v.outcome.map(i=>i.text)}}
 );
 else if(v.verdict==='naughty')pages.push(
  {type:'shout',text:'NAUGHTY!',tone:'bad',actor:L,shake:true},
  {type:'line',actor:L,emote:'angry',text:'You have been a naughty, naughty boy. Again. We talked about this at the gates.'},
  {type:'narration',actor:L,shake:true,text:'He reaches for the big brass lever. He thinks better of it. He reaches for a smaller lever.',card:{small:'A punishment from above',title:v.outcome.map(i=>i.name).join(' + '),items:v.outcome.map(i=>i.text)}}
 );
 else pages.push(
  {type:'line',actor:L,emote:'intense',text:'You are lukewarm. Neither hot nor cold. I have a whole verse about the lukewarm. It does not end well for them.'},
  {type:'line',actor:L,text:'No gift. No punishment. Just this look.',card:{small:'The ledger',title:'Lukewarm'}}
 );
 pages.push({type:'line',actor:L,text:v.verdict==='nice'?'Keep it up. I will be checking in.':v.verdict==='lukewarm'?'Pick a side. Preferably Mine.':v.kind==='checkin'?'Turn it around. You have half an era.':'The pit is still down there. The deepest one. It has a little plaque with your name on it. Do not make Me finish engraving it.',emote:v.verdict==='naughty'?'angry':null});
 return pages;
}
function ledgerFinalPages(f){
 const L='lord',pages=[
  {type:'title',place:'Up Above',detail:'Just past the Pearly Gates',when:'The end of your life’s work',actor:L},
  {type:'line',actor:L,emote:'delight',text:'There you are. My child. Look what you built. A dynasty, from folding chairs.'},
  {type:'line',actor:L,text:'I wept at the disqualifications. Every one.'},
  {type:'line',actor:L,set:'record',text:'But your life’s work was also a test. And I have read the ledger. All of it.',card:{small:'The whole ledger',title:'Your career',items:f.highlights.length?f.highlights.map(ledgerSay):['Remarkably little, considering.']}}
 ];
 for(const e of f.highlights.slice(0,2))pages.push({type:'line',actor:L,set:'record',text:ledgerSay(e),emote:e.pts>0?'delight':'angry'});
 if(f.verdict==='nice')pages.push(
  {type:'shout',text:'AMEN!',tone:'good',actor:L},
  {type:'line',actor:L,emote:'delight',text:'You were a good boy. Mostly. Enough. The banana is forgiven.'},
  {type:'line',actor:L,text:'There is a seat for you up here. Ringside. Forever. The concessions are free and nobody ever sends you a toilet paper ad.'},
  {type:'ending',tier:'best',title:'Ringside, forever',label:'The ending',actor:L}
 );
 else if(f.verdict==='naughty')pages.push(
  {type:'shout',text:'SILENCE!',tone:'bad',actor:L,shake:true},
  {type:'line',actor:L,emote:'angry',text:'You were naughty. All the way to the top. Every rung.'},
  {type:'line',actor:L,emote:'intense',text:'I told you on the first night. Should you fail, the deepest pit of oblivion.'},
  {type:'line',actor:L,text:'You did not fail at wrestling. You failed at everything else.'},
  {type:'narration',actor:L,text:'He reaches for the big brass lever. The plaque underneath has your name on it. He finished engraving it.'},
  {type:'shout',text:'CLUNK!',tone:'bad',actor:L,shake:true},
  {type:'narration',actor:L,figure:false,set:'fall',shake:true,text:'You fall past the clouds, past Green Bay, past the bottom of Lake Michigan, and keep going.'},
  {type:'ending',tier:'bad',title:'The deepest pit of oblivion',label:'The ending',actor:L,figure:false,set:'void'},
  {type:'narration',actor:L,figure:false,set:'void',text:'At the bottom of the pit there is a folding chair, a broom, and a card that is due Saturday.'}
 );
 else pages.push(
  {type:'line',actor:L,emote:'intense',text:'You were neither good nor bad. You were… fine.'},
  {type:'line',actor:L,text:'I am sending you back to St. Elbow’s Community Hall. You will set up the folding chairs. Every week. Forever. Think about it while you stack them.'},
  {type:'ending',tier:'neutral',title:'Folding chairs, forever',label:'The ending',actor:L}
 );
 pages.push({type:'narration',actor:L,figure:false,text:'Your dynasty goes on. The ledger stays open.'});
 return pages;
}
function playLord(header,pages,after){
 const d=$('#modal');if(!d)return;
 d.oncancel=null;d.onclose=()=>{scenePlayer?.close?.();if(!d.open)d.removeAttribute('aria-label')};
 runScenePlayer({header,pages,finishLabel:after?'Continue →':'Back to the week →',finish:()=>{d.removeAttribute('aria-label');d.close();if(after)after();else render()}});
}
function openLedgerVisit(v,after=null){
 if(!v)return;v.seen=true;save();
 const header=`<span class="aa-brand">The Good Lord Above</span><span>Week ${v.week}</span><span>${esc(VERDICT_TITLE[v.verdict])}</span>`;
 playLord(header,ledgerVisitPages(v),after);
}
function openLedgerFinal(after=null){
 const f=state.ledger?.final;if(!f)return;f.seen=true;save();
 playLord(`<span class="aa-brand">The Good Lord Above</span><span>The end of your life’s work</span><span>${esc({nice:'Best ending',naughty:'Bad ending',lukewarm:'Neutral ending'}[f.verdict])}</span>`,ledgerFinalPages(f),after);
}
// Called from the weekly-visit opener: era visits and the ending play before any act of God.
function maybeLedgerVisit(){
 const f=pendingFinal();
 if(f){openLedgerFinal();return true}
 const v=pendingLedgerVisit();
 if(v&&!(v.kind==='reckoning'&&state.rise?.pendingMove)){openLedgerVisit(v);return true}
 return false;
}
function ledgerPanelNote(){
 const f=state.ledger?.final;
 const lean=easyMode()?`<p class="note">The ledger is leaning <strong>${{nice:'nice',naughty:'naughty',lukewarm:'neither way'}[ledgerLean()]}</strong> this era.</p>`:'';
 return `${lean}${f?`<button type="button" class="text-btn" data-ledger-final>Watch your ending again</button>`:''}`;
}

// ---------- Jesus, at the punch bowl ----------
// He doesn't know the numbers. He just hears things at prayer group. A hint after the show when the
// ledger has turned, when it's been a while, or when a visit from above is coming.
const JESUS=24;
const JESUS_HINTS={
 nice:[
  'He asks about you, you know. In a good way. Whatever you’re doing, keep doing it.',
  'Your name came up at prayer group. Somebody up there smiled. I’m just passing it along.',
  'I lit a candle for you this week. It’s burning very bright. That’s usually a good sign.'
 ],
 naughty:[
  'He asks about you. I’d say a prayer. Maybe two. I’ll say one too.',
  'I tried to put in a good word for you upstairs. There was a long pause.',
  'The punch bowl cracked when I said your name. Probably nothing. I’d pray anyway.'
 ],
 lukewarm:[
  'He mentioned you. He said “hm.” That was all. Just “hm.”',
  'You know what He says about lukewarm. He says it a lot, actually. Come sit at the fellowship table and think about it.',
  'There’s room at the table on both ends, friend. Sooner or later you have to pick a chair.'
 ]
};
const JESUS_SOON={
 nice:'Something tells me He’ll be dropping by soon. You might want to comb your hair. He’ll like what He sees.',
 naughty:'Something tells me He’ll be dropping by soon. I’d tidy up. Your soul, I mean. The hallway too.',
 lukewarm:'Something tells me He’ll be dropping by soon. I don’t know what He’ll say. Neither do you, I think.'
};
function visitSoon(s=state){
 const l=ledgerDefaults(s),era=ledgerEra(s),start=l.eraStart[era]||1,mid=start+ERA_CHAPTERS[era]*6;
 const checkin=!s.progression?.dynasty&&!l.visits.some(v=>v.kind==='checkin'&&v.era===era)&&mid-s.week>=0&&mid-s.week<=2;
 return checkin||!!s.progression?.offerWeek;
}
function jesusHint(s=state){
 if(!w(JESUS)||!s.started)return null;
 const l=ledgerDefaults(s),last=l.jesus,lean=ledgerLean(s),soon=visitSoon(s),since=last?s.week-last.week:99;
 const due=since>=2&&(!last||lean!==last.lean||since>=4||soon&&!last.soon);
 if(!due)return null;
 const text=soon?JESUS_SOON[lean]:JESUS_HINTS[lean][Math.floor(s.week/2)%JESUS_HINTS[lean].length];
 l.jesus={week:s.week,lean,soon};
 return {lean,text};
}
function jesusHintPages(h){
 const hint=h?.backstage?.jesus;if(!hint||!w(JESUS))return [];
 return [
  {type:'narration',text:'On your way out, Jesus is stacking paper cups at the punch bowl. He waves you over.',actor:JESUS},
  {type:'line',text:hint.text,actor:JESUS,emote:hint.lean==='nice'?'delight':hint.lean==='naughty'?'hurt':null}
 ];
}
function jesusHintCard(h){
 const hint=h?.backstage?.jesus;if(!hint||!w(JESUS))return '';
 return `<section class="post-jesus" style="--character-color:${w(JESUS).color}"><div class="post-jesus-art" aria-hidden="true">${portrait(w(JESUS))}</div><div><small>At the punch bowl</small><p><strong>${esc(w(JESUS).name)}:</strong> “${esc(hint.text)}”</p></div></section>`;
}
