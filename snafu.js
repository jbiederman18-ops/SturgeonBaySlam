'use strict';
// Little snafus are acts of God. The Good Lord Above keeps a file on you: broken promises,
// words that got back to someone, and blaming His work on a wrestler. The drama of the show itself
// (finishes, cheating, run-ins) is the point of booking and never counts.
// When the file gets heavy enough He checks in at the start of a week and sends something down.
// How you take it moves your standing with Him, and your standing decides how much He lets slide.

// ---------- His file on you ----------
// Weight decides how fast sins add up. A broken promise or a scapegoat always brings a visit.
const SIN_KINDS={
 promise:{weight:3,short:'Broke your word'},
 blame:{weight:3,short:'Blamed a wrestler for an act of God'},
 // Retired in 7.83: finishes are the show. Kept so older files still read.
 cheat:{weight:1,short:'Booked a cheating finish'},
 gossip:{weight:1,short:'Talked behind someone’s back'}
};
const LORD_START=50;
const LORD_TIERS=[
 {min:80,id:'beaming',name:'Beaming'},
 {min:60,id:'pleased',name:'Pleased'},
 {min:40,id:'watching',name:'Watching'},
 {min:20,id:'displeased',name:'Displeased'},
 {min:0,id:'wrathful',name:'Wrathful'}
];
// What each answer does to His favor. The bit is settled on show night: He's in the cheap seats.
const LORD_FAVOR={crew:6,safe:2,blame:-12,wildLanded:3,wildFlopped:-6};
const SCAPEGOAT_TRUST=8,SCAPEGOAT_MORALE=4;

function lordDefaults(lord){
 const l=lord&&typeof lord==='object'?lord:{};
 if(!Number.isFinite(l.favor))l.favor=LORD_START;
 if(!Array.isArray(l.sins))l.sins=[];
 if(!Number.isInteger(l.seq))l.seq=l.sins.reduce((n,x)=>Math.max(n,x.id||0),0);
 // Cheating finishes no longer count. Anything still open from before is forgiven.
 for(const x of l.sins)if(x.kind==='cheat'&&x.judged==null)x.judged='forgiven';
 return l;
}
function lordFavor(s=state){return s.lord?.favor??LORD_START}
function lordTier(favor=lordFavor()){return LORD_TIERS.find(t=>favor>=t.min)||LORD_TIERS.at(-1)}
// How much sin it takes before He comes down. Pleased: He lets the little things pile up a while.
function lordThreshold(favor=lordFavor()){return favor>=60?3:favor>=20?2:1}
function sinWeight(sins){return sins.reduce((n,x)=>n+(SIN_KINDS[x.kind]?.weight||1),0)}
function openSins(s=state){return (s.lord?.sins||[]).filter(x=>x.judged==null)}
function addSin(kind,detail={},s=state){
 if(!SIN_KINDS[kind]||kind==='cheat')return null;
 const l=s.lord=lordDefaults(s.lord);
 const sin={id:++l.seq,week:s.week,kind,...detail,judged:null};
 l.sins.push(sin);
 // Keep the file readable: judged sins older than a season fall off.
 if(l.sins.length>40)l.sins=l.sins.filter(x=>x.judged==null||x.week>s.week-16).slice(-40);
 return sin;
}
function shiftFavor(delta,s=state){const l=s.lord=lordDefaults(s.lord);l.favor=clamp(l.favor+delta);return l.favor}
// He makes Wrathful bookers pay double, and a Beaming one draws a slightly bigger crowd.
function lordTitheFactor(favor=lordFavor()){return favor<20?2:1}
function lordAttendanceFactor(favor=lordFavor()){return favor>=80?1.05:favor<20?.92:1}

function nameOf(id){return w(id)?.name||'a wrestler'}
// The sin in His own words, and a short line for the paper card.
function sinText(sin){
 if(sin.kind==='promise'){
  const p=state.promises.find(x=>x.id===sin.promise);
  return p?`You gave ${nameOf(sin.actor)} your word: ${promiseWhat(p)}, by week ${p.due}. Your word was worth nothing.`:`You gave ${nameOf(sin.actor)} your word. Your word was worth nothing.`;
 }
 if(sin.kind==='cheat'){
  const who=(sin.actors||[sin.actor]).filter(id=>id!=null).map(nameOf).join(' and ')||'somebody';
  return `You booked ${who} to win ${sin.finish==='Interference'?'with a run-in':'by cheating'}. On purpose. There were children there.`;
 }
 if(sin.kind==='gossip')return `You talked about ${nameOf(sin.target)} to ${nameOf(sin.actor)}. ${nameOf(sin.target)} heard. They always hear.`;
 if(sin.kind==='blame')return `You told everyone ${nameOf(sin.actor)} caused ${sin.issue?'“'+sin.issue+'”':'it'}. That was Me. I did that.`;
 return 'You know what you did.';
}
function sinShort(sin){
 if(sin.kind==='promise')return `Broke your word to ${nameOf(sin.actor)}`;
 if(sin.kind==='cheat')return `Booked ${(sin.actors||[sin.actor]).filter(id=>id!=null).map(nameOf).join(' & ')||'a wrestler'} to ${sin.finish==='Interference'?'win with a run-in':'cheat'}`;
 if(sin.kind==='gossip')return `Talked behind ${nameOf(sin.target)}’s back`;
 if(sin.kind==='blame')return `Blamed ${nameOf(sin.actor)} for an act of God`;
 return SIN_KINDS[sin.kind]?.short||'A sin';
}

// ---------- The week's judgment ----------
function snafuDefaults(s){
 s.lord=lordDefaults(s.lord);
 if(!s.production||s.production.week!==s.week)s.production={week:s.week,choice:null};
 const p=s.production;
 if(typeof ledgerTick==='function')ledgerTick(s);
 if(p.judged==null){
  if(p.issueId){p.judged=true;p.sins??=[]}
  // Saves from before the Lord made their call against the original three-problem rotation.
  else if(p.choice){const pool=PRODUCTION_ISSUES.slice(0,3);p.issueId=pool[(s.week-1)%pool.length].id;p.judged=true;p.sins=[]}
  else judgeWeek(s);
 }
 // A hired crew member quietly cleans up acts of God in their department. He allows it.
 const issue=p.issueId?allProductionIssues().find(item=>item.id===p.issueId):null,handler=issue&&crewHandles(issue,s);
 if(handler&&!p.choice&&!s.liveShow&&!s.recap){p.choice='safe';p.crew=handler.id}
 // The old smoke-break briefing is gone. Its record has nothing left to ask.
 if(s.weeklyBriefing)s.weeklyBriefing=null;
 return s;
}
function judgeWeek(s){
 const p=s.production,due=openSins(s).filter(x=>x.week<s.week),effects=s.ledger?.effects||{};
 p.judged=true;p.sins=[];p.issueId=null;
 // A naughty reckoning can send one down whatever the file says.
 const forced=!!effects.forceSmite;delete effects.forceSmite;
 if(!forced&&(!due.length||sinWeight(due)<lordThreshold(s.lord.favor)))return;
 // Grace from a good reckoning waives the next one the moment it lands.
 if(!forced&&effects.grace){delete effects.grace;for(const sin of due)sin.judged='forgiven';if(s===state)incident('Grace: He was going to send something down. He decided not to.',[],'lord');return}
 const pool=productionPool(s);
 p.issueId=pool[(s.week-1)%pool.length].id;
 p.sins=due.map(x=>x.id);
 for(const sin of due)sin.judged=s.week;
}
function productionIssue(){return state.production?.issueId?allProductionIssues().find(issue=>issue.id===state.production.issueId)||null:null}
function judgmentSins(){return (state.production?.sins||[]).map(id=>state.lord.sins.find(x=>x.id===id)).filter(Boolean)}
function weeklyBriefingPending(s=state){return !!s.started&&!s.liveShow&&!s.recap&&s.production?.week===s.week&&!!s.production.issueId&&!s.production.choice}
// Kept for older callers: there is no separate briefing record any more.
function ensureWeeklyBriefing(){snafuDefaults(state);return null}
function completeWeeklyBriefing(){return !!state.production?.choice}

function issueSegmentName(issue){const main=issue.segment==='main'||issue.segment===3;return issue.matchOnly?'first match':main?'main event':'opener'}
function issueStatName(issue){
 if(issue.stat!=='skill')return 'mic skills';
 const card=state.card.map((segment,i)=>state.drafts?.[i]||segment);
 const segment=card[issueSegmentIndex(issue,card)];
 if(segment?.kind==='promo')return 'mic skills';
 if(segment?.kind==='match'||issue.matchOnly)return 'ring skill';
 return 'ring skill for a match or mic skills for a promo';
}
function titheCost(){return fixCost()*lordTitheFactor()}
// The wrestler who would take the fall: someone from His file if they're still here,
// otherwise whoever is booked on the affected segment, otherwise the locker room's loudest.
function lordScapegoat(){
 const p=state.production;
 if(p?.scapegoat!=null&&w(p.scapegoat))return p.scapegoat;
 for(const sin of judgmentSins().slice().reverse()){const id=sin.kind==='gossip'?sin.target:sin.actor;if(id!=null&&w(id))return id}
 const issue=productionIssue(),card=state.card.map((segment,i)=>state.drafts[i]||segment),segment=issue&&card[issueSegmentIndex(issue,card)];
 const booked=segment?matchPeople(segment).filter(id=>w(id)):[];
 if(booked.length)return booked[0];
 return state.roster.filter(r=>!r.champ).slice().sort((a,b)=>b.pop-a.pop||a.id-b.id)[0]?.id??state.roster[0].id;
}
function productionCastNote(issue){
 const card=state.card.map((segment,i)=>state.drafts[i]||segment);
 const segment=card[issueSegmentIndex(issue,card)];
 const people=segment?matchPeople(segment).map(w):[];
 if(!people.length)return `It lands on the ${issueSegmentName(issue)}. Pencil someone in to see who has to work around it.`;
 const stat=issue.stat==='skill'&&segment.kind!=='promo'?'skill':'charisma';
 const ready=people.reduce((total,r)=>total+r[stat],0)/people.length>=75;
 return `${people.map(r=>r.name).join(' / ')} · ${ready?'They could make a bit of it.':'A bit would be a risk with them.'}`;
}
// Four ways to take it. Keys stay compatible with the show engine: safe/crew/wild, plus blame.
function productionOptions(){
 const issue=productionIssue();if(!issue)return [];
 const segment=issueSegmentName(issue),stat=issueStatName(issue),crew=state.production.crew&&CREW.find(c=>c.id===state.production.crew),scapegoat=nameOf(lordScapegoat());
 return [
  {key:'crew',label:'Thy will be done. We’ll make do.',plan:issue.crew,hint:typeof wholeRoom==='function'&&wholeRoom()?`Free. The whole room covers for it, so the ${segment} loses nothing. He likes being taken seriously.`:`Free. The ${segment} loses 1 quality. He likes being taken seriously.`},
  {key:'safe',label:'I’ll make it right, whatever it costs.',plan:issue.safe,hint:crew?`${crew.name} handled it. No extra cost.`:`Adds ${money(titheCost())} to show costs. No quality lost. He notices the gesture.`},
  {key:'wild',label:'Watch me turn this into a bit.',plan:issue.wild,hint:`Free. The ${segment} gains 2 quality with average ${stat} of 75+, or loses 2. He’ll be watching from the cheap seats.`},
  {key:'blame',label:`That was ${scapegoat}’s fault, actually.`,plan:`Pin it on ${scapegoat}`,hint:`Free, no quality lost. ${scapegoat} loses trust and morale, and it goes in His file.`}
 ];
}
function productionChips(key){
 const issue=productionIssue();if(!issue)return [];
 const segment=issueSegmentName(issue),stat=issueStatName(issue),favor=(value,label)=>easyMode()?[{stat:'favor',value,label}]:[];
 if(key==='safe')return state.production.crew?[{stat:'info',label:'Your crew has it · free'}]:[{stat:'cash',value:-titheCost(),label:money(titheCost())+' show cost'},{stat:'quality',label:'No quality loss'},...favor(LORD_FAVOR.safe)];
 if(key==='wild')return [{stat:'quality',label:`${segment} ±2 quality`},{stat:'info',label:`Needs ${stat} 75+`},...favor(null,'Favor ±, if it lands')];
 if(key==='blame')return [{stat:'trust',value:-SCAPEGOAT_TRUST,who:nameOf(lordScapegoat())},{stat:'morale',value:-SCAPEGOAT_MORALE,who:nameOf(lordScapegoat())},{stat:'info',label:'Goes in His file'},...favor(LORD_FAVOR.blame)];
 const covered=wholeRoom();
 return [{stat:'quality',value:covered?0:-1,label:covered?'No quality loss':`${segment} −1 quality`},{stat:'info',label:'Free'},...favor(LORD_FAVOR.crew)];
}
function chooseBriefingProduction(choice){
 const p=state.production,issue=productionIssue();
 if(!issue||p.week!==state.week||p.choice||!productionOptions().some(option=>option.key===choice))return false;
 const before=lordTier().id;
 if(choice==='safe'){p.cost=titheCost();ledgerNote('madeRight');if(PEOPLE_FIRST_ISSUES.includes(issue.id))ledgerNote('peopleFirst')}
 if(choice==='crew')ledgerNote('humble');
 if(choice==='blame'){
  const id=lordScapegoat(),r=w(id);
  p.scapegoat=id;r.trust=clamp(r.trust-SCAPEGOAT_TRUST);r.morale=clamp((r.morale??70)-SCAPEGOAT_MORALE);
  addSin('blame',{actor:id,issue:issue.title.replace(/\.$/,'')});ledgerNote('blamed',{actor:id});
 }
 if(LORD_FAVOR[choice])shiftFavor(LORD_FAVOR[choice]);
 p.choice=choice;p.tierBefore=before;
 save();return true;
}
function applyProductionDecision(index,people,fallout){
 const p=state.production;
 if(p.week!==state.week||!p.choice)return 0;
 const issue=productionIssue();if(!issue)return 0;
 const target=issueSegmentIndex(issue);if(index!==target)return 0;
 const option=productionOptions().find(option=>option.key===p.choice);if(!option)return 0;
 const average=people.length?people.reduce((total,r)=>total+r[(issue.stat==='skill'&&state.card[index].kind!=='promo'?'skill':'charisma')],0)/people.length:0;
 let delta=0,outcome;
 if(p.choice==='safe')outcome=p.crew?'Your crew handled it at no extra cost. He allowed it.':`You made it right. ${money(p.cost??fixCost())} was included in show costs.`;
 else if(p.choice==='crew'){if(typeof wholeRoom==='function'&&wholeRoom()){outcome='You made do, and the whole locker room covered for it. No quality lost.'}else{delta=-1;outcome='You made do. The segment lost 1 quality.'}}
 else if(p.choice==='blame')outcome=`${nameOf(p.scapegoat)} took the blame. Nobody asked them.`;
 else{
  delta=average>=75?2:-2;
  if(p.wildFavor==null){p.wildFavor=delta>0?LORD_FAVOR.wildLanded:LORD_FAVOR.wildFlopped;shiftFavor(p.wildFavor);if(delta<0)ledgerNote('bitFlopped')}
  outcome=(delta>0?issue.success+' From the cheap seats, one slow clap.':issue.failure+' From the cheap seats, a single roll of thunder.')+` Segment quality ${delta>0?'+':''}${delta}.`;
 }
 fallout.push(incident(`An act of God: ${issue.title} ${option.plan}. ${outcome}`,people.map(r=>r.id).concat(p.scapegoat!=null?[p.scapegoat]:[]),'production'));
 return delta;
}

// ---------- His visit, on the cutscene player ----------
const LORD_GREETINGS={
 beaming:'My child! I was in the neighborhood. I am always in the neighborhood. That is sort of My whole thing.',
 pleased:'Hello again. Don’t get up. I saw the last show. The chair spot. I rewound it.',
 watching:'I said I would check in. You did not know when. Surprise.',
 displeased:'You again. Or rather, Me again. Because of you.',
 wrathful:'Do you know how many times I have had to come down to Wisconsin this year? I have a universe to run.'
};
function lordVisitPages(){
 const L='lord',issue=productionIssue();if(!issue)return [];
 const sins=judgmentSins(),tier=lordTier(state.production.choice?lordFavorBefore():lordFavor()).id,town=showLocation().town;
 const pages=[
  {type:'title',place:'Up Above',detail:'He is checking in',when:`Week ${state.week} · ${town}, WI`,actor:L},
  {type:'line',text:(state.ledger?.visits||[]).some(v=>v.week===state.week&&!v.silent)?'While I am here. Your file.':LORD_GREETINGS[tier],actor:L,emote:['beaming','pleased'].includes(tier)?'delight':['displeased','wrathful'].includes(tier)?'angry':null},
  {type:'line',text:'I have been reading your file.',actor:L,set:'record',card:{small:'His file on you',title:`Week ${state.week}`,items:sins.length?sins.slice(0,4).map(sinShort).concat(sins.length>4?[`…and ${sins.length-4} more`]:[]):['General conduct']}}
 ];
 for(const sin of sins.slice(0,2))pages.push({type:'line',text:sinText(sin),actor:L,set:'record',emote:sin.kind==='promise'||sin.kind==='blame'?'angry':'intense'});
 if(sins.length>2)pages.push({type:'line',text:'There is more. There is always more. Little sins add up.',actor:L,set:'record'});
 pages.push(
  {type:'line',text:'So. A small punishment. Nothing biblical. I am not doing frogs again.',actor:L},
  {type:'shout',text:'SMITE!',tone:'bad',actor:L,shake:true},
  {type:'narration',text:`${issue.title} ${issueText(issue)}`,actor:L,figure:false,set:'bay',card:{small:'An act of God',title:issue.title}}
 );
 return pages;
}
function lordFavorBefore(){const p=state.production;return p.favorBefore??lordFavor()}
function lordChoicePage(){
 const options=productionOptions();
 return {type:'choice',actor:'lord',replies:options.map(o=>({text:o.label,key:o.key})),
  costFor:reply=>options.find(x=>x.key===reply.key)?.plan||'',
  chipsFor:reply=>productionChips(reply.key)};
}
function lordAnswerPages(key){
 const L='lord',p=state.production,scapegoat=nameOf(p.scapegoat??lordScapegoat()),option=productionOptions().find(o=>o.key===key);
 const pages=[{type:'you',text:option?.label||'…',actor:L}];
 if(key==='crew')pages.push(
  {type:'shout',text:'Amen.',tone:'good',actor:L},
  {type:'line',text:'Thy will be done. Yes. That is the correct thing to say. Nobody ever says it.',actor:L,emote:'delight'},
  {type:'narration',text:`Somewhere above the clouds, a choir starts back up. ${option.plan}.`,actor:L}
 );
 if(key==='safe')pages.push(
  {type:'line',text:'I do not need money. I made money. I made the concept of money.',actor:L},
  {type:'line',text:'…But it is a nice gesture. I will put it toward the new cherubs.',actor:L,emote:'delight'},
  {type:'narration',text:`An envelope leaves your wallet. You did not see it go. ${option.plan}.`,actor:L,card:{small:'On the show budget',title:money(p.cost??titheCost())}}
 );
 if(key==='wild')pages.push(
  {type:'line',text:'You are going to put My punishment in the show.',actor:L,emote:'intense'},
  {type:'line',text:'…Fine. It had better be good. I will be in the cheap seats. I am always in the cheap seats.',actor:L},
  {type:'narration',text:`${option.plan}. If it lands, He might even enjoy it.`,actor:L}
 );
 if(key==='blame')pages.push(
  {type:'shout',text:'SILENCE!',tone:'bad',actor:L,shake:true},
  {type:'line',text:`${scapegoat}. You are blaming ${scapegoat}. For My work. I signed it. It has My handwriting on it.`,actor:L,emote:'angry'},
  {type:'line',text:'I am adding this to your file. In pen.',actor:L,set:'record',emote:'angry'},
  {type:'narration',text:`By doors, the whole locker room has heard ${scapegoat} caused it. ${scapegoat} did not cause it.`,actor:L,figure:false,set:'bay'}
 );
 const before=p.tierBefore||lordTier(lordFavorBefore()).id,after=lordTier().id;
 if(before!==after)pages.push({type:'narration',text:'Something shifted, up above.',actor:L,card:{small:'The Good Lord Above',title:lordTier().name}});
 pages.push({type:'line',text:['beaming','pleased'].includes(after)?'Go on. Make Me proud.':after==='wrathful'?'Remember the pit. The deepest one. It has your name on a little plaque.':'I will be checking in.',actor:L});
 return pages;
}
function crewHandledPages(){
 const L='lord',crew=CREW.find(c=>c.id===state.production.crew);
 return [
  {type:'narration',text:`Before the thunder has finished, ${crew?.name||'your crew'} already has it handled.`,actor:L,figure:false,set:'bay'},
  {type:'line',text:'…Hm. Well. I will allow it. Hire good people. That is in the book somewhere.',actor:L}
 ];
}
function openWeeklyBriefing(reviewOnly=false){
 if(onTitle||state.liveShow||state.recap)return;
 snafuDefaults(state);
 const d=$('#modal');if(!d)return;
 const issue=productionIssue(),p=state.production;
 if(!issue){
  if(reviewOnly)modal(`Week ${state.week} · Up above`,`<p>No word from the Good Lord Above this week.</p><p class="note">${esc(lordFileNote())}</p>`,(_,dialog)=>dialog.close(),'Close');
  return;
 }
 p.seen=true;
 if(!p.choice)p.favorBefore=lordFavor();
 save();
 const header=`<span class="aa-brand">The Good Lord Above</span><span>Week ${state.week}</span><span>He is checking in</span>`;
 const answered=!!p.choice,pages=lordVisitPages();
 if(answered)pages.push(...(p.crew?crewHandledPages():lordAnswerPages(p.choice)));
 else pages.push(lordChoicePage());
 d.oncancel=null;d.onclose=()=>{scenePlayer?.close?.();if(!d.open){d.removeAttribute('aria-label');render()}};
 runScenePlayer({header,pages,
  onChoose:index=>{const key=productionOptions()[index]?.key;if(!chooseBriefingProduction(key))return null;return lordAnswerPages(key)},
  finishLabel:'Back to the week →',
  finish:()=>{d.removeAttribute('aria-label');d.close();render()}});
}
// He shows up on His own the first time you look at the week after a judgment.
function maybeLordVisit(){
 const p=state.production,d=typeof $==='function'?$('#modal'):null;
 if(!d||onTitle||!state.started||state.liveShow||state.recap||d.open||(typeof tutorialRun!=='undefined'&&tutorialRun))return;
 // Era visits and the ending come first; an act of God the same week waits its turn.
 if(pendingFinal()||pendingLedgerVisit()&&!(pendingLedgerVisit().kind==='reckoning'&&state.rise?.pendingMove)){setTimeout(()=>{if(!d.open)maybeLedgerVisit()},0);return}
 if(!p?.issueId||p.seen)return;
 setTimeout(()=>{if(!d.open&&!state.production.seen)openWeeklyBriefing()},0);
}

// ---------- On the pages ----------
function lordFileNote(){
 const open=openSins(),weight=sinWeight(open),need=lordThreshold();
 if(!open.length)return 'His file on you is clean. For now.';
 return weight>=need?'Your file is heavy. Expect a visit next week.':`${open.length} thing${open.length===1?'':'s'} on file. Little sins add up.`;
}
function favorMeter(){
 const f=lordFavor(),tier=lordTier(f);
 return `<div class="lord-meter tier-${tier.id}"><div><small>His mood</small><strong>${esc(tier.name)}</strong></div><div class="bar" role="img" aria-label="${esc('The Good Lord Above is '+tier.name.toLowerCase())}"><i style="width:${f}%"></i></div></div>`;
}
function lordFileList(){
 const open=openSins();
 return open.length?`<ul class="lord-file">${open.slice(-6).reverse().map(sin=>`<li><small>Week ${sin.week}</small> ${esc(sinShort(sin))}</li>`).join('')}</ul>`:'';
}
function lordPanel(){
 const issue=productionIssue(),p=state.production,option=productionOptions().find(o=>o.key===p.choice);
 const status=!issue?`<p>No word from above this week.</p>`
  :p.choice?`<p><strong>${esc(issue.title)}</strong></p><div class="press-picked" tabindex="-1"><span class="press-decision-stamp">Answered ✓</span><strong>${esc(p.crew?'Your crew handled it':option?.label||'')}</strong>${effectChips(productionChips(p.choice),'What it costs')}</div><button type="button" class="text-btn" data-lord-visit>Replay His visit</button>`
  :`<p><strong>${esc(issue.title)}</strong> ${esc(issueText(issue))}</p><p class="note">${esc(productionCastNote(issue))}</p><button type="button" class="btn primary" data-lord-visit>Answer to Him →</button>`;
 return `<section class="card lord-panel" aria-labelledby="lord-panel-title"><div class="lord-panel-head"><div class="lord-face">${CUTSCENE_CAST.lord.art()}</div><div><small>Up above</small><h3 id="lord-panel-title">The Good Lord Above</h3></div></div>${favorMeter()}${status}<h4>His file on you</h4><p class="note">${esc(lordFileNote())}</p>${lordFileList()}<p class="note">Broken promises and words that get back to people go in the file. The drama you book in the ring never does. How you take His punishment is between you and Him.</p>${ledgerPanelNote()}</section>`;
}
// The Book page only needs to know whether He is waiting on you.
function weeklyBriefingCard(){
 const issue=productionIssue(),p=state.production;
 if(!issue)return '';
 return `<section class="card lord-notice ${p.choice?'is-done':'is-due'}" id="booker-inbox"><div class="lord-face">${CUTSCENE_CAST.lord.art()}</div><div><small>An act of God</small><strong>${esc(issue.title)}</strong><p class="note">${p.choice?esc(p.crew?'Your crew handled it.':productionOptions().find(o=>o.key===p.choice)?.plan||'Answered.'):'The Good Lord Above is waiting on your answer before doors.'}</p></div><button type="button" class="btn ${p.choice?'':'primary'}" data-lord-visit>${p.choice?'Replay':'Answer to Him →'}</button></section>`;
}
function bindBookerInbox(){
 document.querySelectorAll('[data-lord-visit]').forEach(button=>button.onclick=()=>openWeeklyBriefing(true));
 document.querySelectorAll('[data-ledger-final]').forEach(button=>button.onclick=()=>openLedgerFinal());
 maybeLordVisit();
}
