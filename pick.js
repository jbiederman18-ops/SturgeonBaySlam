'use strict';
// Tap-to-pick booking, ported from the Tony Khan Simulator flow (v273–v295).
// Tap is the main input: a sheet slides up and ranks wrestlers for one space at a time.
// Drag only rearranges what is already on the card. Half-built segments stay drafts until legal.

const PROMO_SCENES=['Solo address','Face-off','Interview','Interruption'];
const PICK_SHAPES={singles:'Singles',tag:'Tag',trios:'Trios',triple:'Triple threat',four:'Four-way',royal:'Battle royal'};
const PICK_ORDINALS=['','','Third','Fourth','Fifth','Sixth'];
const PICK_FILTERS=[['best','Best fit'],['champion','Champion'],['Face','Faces'],['Heel','Heels'],['all','All']];
let pickSheet=null;

// ---------- Segment data ----------
function pickNormalize(d){
 if(d.kind==='promo'){d.hook||='Win the crowd';d.scene||='Solo address';d.target??=null;d.concept??='';d.prop??='';delete d.draft;return d}
 if(!MATCH_FORMATS[d.format])resizeBooking(d,'singles');
 d.sides=matchSides(d);
 d.type||='Singles match';d.finish||='Clean finish';d.presentation??='Competitive';d.interferenceReason??='Settle a grudge';d.prop??='';d.title=!!d.title;
 if(d.finish==='Upset victory'){d.finish='Clean finish';d.presentation='Upset'}
 delete d.draft;return d;
}
function pickWorking(index){
 const source=state.drafts[index]||state.card[index];
 return pickNormalize(source?.kind?structuredClone(source):blankBooking('match'));
}
function pickSpaces(d){
 if(!d)return [{pos:0,si:0,pi:0,id:null},{pos:1,si:1,pi:0,id:null}];
 if(d.kind==='promo')return [{pos:0,si:0,pi:0,id:d.a},...(d.a!=null||d.target!=null?[{pos:1,si:0,pi:1,id:d.target,optional:!promoNeedsTarget(d)}]:[])];
 let pos=0;return matchSides(d).flatMap((side,si)=>side.map((id,pi)=>({pos:pos++,si,pi,id})));
}
function pickSpaceLabel(d,space){
 if(d?.kind==='promo')return space.pos===0?'On the mic':promoNeedsTarget(d)?'Opponent':'Second · optional';
 if(space.pi>0)return 'Partner';
 if(space.si===0)return 'Pick';
 return PICK_ORDINALS[space.si]||'Opponent';
}
function pickShortName(r){
 const name=rosterCardName(r).replace(/[“”"][^“”"]*[“”"]\s*/g,'').split(',')[0].trim()||rosterCardName(r),words=name.split(' ');
 if(words[0]==='A'&&words.length>2)return 'The '+words[1];
 if(words[0]==='The')return name.length>18?words.slice(0,2).join(' '):name;
 return words.at(-1);
}
function pickSideName(side){const team=state.teams.find(t=>side.length===2&&[t.a,t.b].every(id=>side.includes(id)));return team?team.name:side.map(id=>pickShortName(w(id))).join(' & ')}
function pickTrim(text,max=42){return text.length>max?text.slice(0,max-1)+'…':text}
// Re-validate everything that depends on who is in the segment and clear what no longer applies.
function pickTidy(d){
 const cleared=[];
 if(d.kind==='match'){
  d.sides=matchSides(d);d.a=d.sides[0][0];d.b=d.sides[1][0];
  const ids=matchPeople(d),champ=champion();
  if(d.winner!=null&&!ids.includes(d.winner))d.winner=null;
  if(d.pin!=null&&(!ids.includes(d.pin)||d.winner==null||matchSides(d)[winningSide(d)]?.includes(d.pin)))delete d.pin;
  if(!rulesFor(d).includes(d.type)){if(d.type!=='Singles match')cleared.push('stipulation');d.type='Singles match'}
  if(d.title&&(teamFormat(d)||!champ||!ids.includes(champ.id))){d.title=false;cleared.push('title')}
  if(d.interferer!=null&&ids.includes(d.interferer)){d.interferer=null;cleared.push('run-in')}
 }else if(d.kind==='promo'&&d.target===d.a)d.target=null;
 if(SHOW_PROPS[d.prop]?.owner!=null&&!matchPeople(d).includes(SHOW_PROPS[d.prop].owner)){d.prop='';cleared.push('prop')}
 return cleared;
}
// A legal segment commits to the card; anything half-built lives in drafts until it is.
function pickStage(index,d){
 const cleared=pickTidy(d);
 const legal=!bookingProblems(d).length&&!(d.prop&&state.card.some((s,i)=>i!==index&&s.prop===d.prop));
 if(legal){state.card[index]=structuredClone({...d,concept:(d.concept||'').trim(),draft:false});delete state.drafts[index]}
 else{
  if(state.card[index].kind)state.card[index]={kind:null};
  if(matchPeople(d).length||d.kind==='promo'||matchFormat(d)!=='singles')state.drafts[index]=structuredClone(d);else delete state.drafts[index];
 }
 bookingUndo=null;
 return {legal,cleared};
}
function pickSet(d,pos,id){
 if(d.kind==='promo'){if(pos===0)setPromoSpeaker(d,id);else d.target=id;return}
 setBookingParticipant(d,pos,id);
}
function pickNextSpace(d,after=null){
 const spaces=pickSpaces(d);
 if(d.kind==='promo')return d.a==null?0:promoNeedsTarget(d)&&d.target==null?1:-1;
 if(after!=null){const filled=spaces[after],same=spaces.find(s=>s.si===filled.si&&s.id==null);if(same)return same.pos}
 return spaces.find(s=>s.id==null)?.pos??-1;
}
function pickSegmentOf(id,except=-1){
 for(let i=0;i<state.card.length;i++){if(i===except)continue;if(matchPeople(state.drafts[i]||{}).includes(id)||matchPeople(state.card[i]).includes(id))return i}
 return -1;
}
function pickReshape(d,shape){
 const people=pickSpaces(d).map(s=>s.id).filter(id=>id!=null);
 if(shape==='promo'){
  if(d.kind==='promo')return {d,dropped:0};
  const next=pickNormalize(blankBooking('promo'));next.a=people[0]??null;next.target=people[1]??null;
  return {d:next,dropped:Math.max(0,people.length-2)};
 }
 const next=d.kind==='match'?d:pickNormalize(blankBooking('match'));
 const previous=d.kind==='match'?matchSides(d):[[d.a],[d.target]];
 const sizes=MATCH_FORMATS[shape].sizes,kept=sizes.map((size,i)=>(previous[i]||[]).filter(id=>id!=null).slice(0,size));
 const spare=people.filter(id=>!kept.flat().includes(id));
 next.sides=kept.map((side,i)=>Array.from({length:sizes[i]},(_,slot)=>side[slot]??spare.shift()??null));
 next.format=shape;
 return {d:next,dropped:spare.length};
}

// ---------- Ranking ("Best fit") ----------
function weeksSinceTitleDefense(){
 const tracked=state.history.filter(h=>h.results?.some(r=>Object.hasOwn(r,'title')));
 const last=tracked.find(h=>h.results.some(r=>r.title));
 return last?state.week-last.week:tracked.length>=4?tracked.length:0;
}
function pairRatings(a,b){
 const ratings=[];
 for(const h of state.history)for(const r of h.results||[])if(r.label!=='PROMO'&&r.participants?.includes(a)&&r.participants?.includes(b))ratings.push(r.rating);
 return ratings;
}
function pickContext(d,pos){
 if(d.kind==='promo'){const other=pos===1?d.a:d.target;return {mode:other!=null?'versus':'open',anchors:other!=null?[w(other)]:[]}}
 const spaces=pickSpaces(d),me=spaces[pos];
 const partners=spaces.filter(s=>s.si===me.si&&s.pos!==pos&&s.id!=null).map(s=>w(s.id));
 const opponents=spaces.filter(s=>s.si!==me.si&&s.id!=null).map(s=>w(s.id));
 return partners.length?{mode:'partner',anchors:partners,opponents}:opponents.length?{mode:'versus',anchors:opponents}:{mode:'open',anchors:[]};
}
// Qualitative tells, not exact bonuses: each wrestler gets a score and at most one reason tab.
function pickReasons(d,pos,r,unavailable){
 const reasons=[],add=(text,cls,weight)=>reasons.push({text:pickTrim(text),cls,weight});
 const promo=d.kind==='promo',ctx=pickContext(d,pos);
 const promises=state.promises.filter(p=>p.status==='open'&&(!p.onDate||p.due===state.week)&&p.actor===r.id&&(promo?p.kind==='promo':p.kind!=='promo'));
 const promiseText=p=>(p.kind==='win'?'Promised a clean win':p.kind==='promo'?'Promised mic time':p.kind==='team'?'Promised a team spot':p.kind==='rematch'?'Promised · '+pickShortName(w(p.target)):p.kind==='title'?'Promised a title shot':'Promised a match')+(p.due<=state.week?' · tonight':'');
 const challenge=state.challenges.find(c=>c.status==='open'&&[c.actor,c.target].includes(r.id));
 let heat=0;
 if(ctx.mode==='open'){
  if(promises[0])add(promiseText(promises[0]),'must',90);
  if(!promo&&r.id===10&&sweepsQualifierPending())add('Qualifier · needs a clean win','must',85);
  if(challenge){const other=w(challenge.actor===r.id?challenge.target:challenge.actor);if(promo)add('Challenge · '+pickShortName(other),'feud',35);else add('Challenge · '+pickShortName(other),'must',80)}
  if(!promo&&r.champ&&weeksSinceTitleDefense()>=4)add('Title defense due','must',75);
  const rival=state.roster.filter(o=>o.id!==r.id&&!unavailable.has(o.id)).map(o=>({o,heat:state.rivalries[rivalryKey(o.id,r.id)]||0})).sort((a,b)=>b.heat-a.heat)[0];
  if(rival?.heat>=20){heat=rival.heat;add('Feud · '+pickShortName(rival.o),'feud',40+rival.heat/4)}
  if(promo&&r.charisma>=85)add('Great talker','hot',30);
  if(r.champ)add('Champion','gold',18);
  if(r.pop>=75)add('Top star','',12);
  if(r.lastSeen&&state.week-r.lastSeen>=3)add('Fresh · off TV a while','',10);
 }else{
  const anchors=ctx.anchors;
  heat=Math.max(0,...anchors.map(a=>state.rivalries[rivalryKey(a.id,r.id)]||0));
  for(const a of anchors){
   const owed=state.promises.some(p=>p.status==='open'&&[p.actor,p.target].includes(r.id)&&[p.actor,p.target].includes(a.id)&&(ctx.mode==='partner'?p.kind==='team':p.kind==='rematch'));
   if(owed)add(ctx.mode==='partner'?'Promised team':'Promised vs '+pickShortName(a),'must',95);
   if(ctx.mode==='versus'&&state.challenges.some(c=>c.status==='open'&&[c.actor,c.target].includes(r.id)&&[c.actor,c.target].includes(a.id)))add('Answers the challenge','must',90);
  }
  if(!promo&&ctx.mode==='versus'&&sweepsQualifierPending()&&(anchors.some(a=>a.id===10)||r.id===10)){
   if(r.id===17||anchors.some(a=>a.id===17))add('Won’t count for the qualifier','cold',-100);
   else add('Counts for the qualifier','must',65);
  }
  if(ctx.mode==='partner'){
   const team=state.teams.find(t=>[t.a,t.b].includes(r.id)&&anchors.some(a=>[t.a,t.b].includes(a.id)));
   if(team)add('Team · '+team.name,'hot',50+team.chemistry/5);
   if(heat>=20)add('Bad blood','cold',-20);
  }else{
   if(heat>=20)add('Rivals','feud',55+heat/4);else if(heat>=5)add('Feud','feud',38+heat/4);
   if(!promo){
    const past=anchors.flatMap(a=>pairRatings(a.id,r.id));
    if(past.length){const avg=past.reduce((n,x)=>n+x,0)/past.length;if(avg>=80)add('Best chemistry','hot',40);else if(avg>=68)add('Good chemistry','hot',30);else if(avg<55)add('Fell flat last time','cold',-10)}
    else if(r.skill>=72&&anchors.some(a=>a.skill>=72&&a.role!==r.role&&Math.abs(a.pop-r.pop)<=15))add('Electric?','hot',20);
    else add('Never met','',8);
   }
   if(anchors.some(a=>a.pop>=r.pop+15)&&r.pop>=45)add('Rub','rub',14);
   if(anchors.some(a=>a.role!==r.role))add('Face v heel','',8);
  }
  if(promises[0])add(promiseText(promises[0]),'must',26);
 }
 let score=0;const sorted=reasons.slice().sort((a,b)=>b.weight-a.weight);
 sorted.forEach((reason,i)=>{score+=reason.weight<0?reason.weight:i===0?reason.weight:reason.weight/4});
 score+=promo?(r.charisma-70)/3:(overallRating(r)-75)/3;
 if(promo&&ctx.anchors.length)score+=Math.min(12,heat/4);
 score+=Math.max(-5,Math.min(5,(r.momentum||0)/2));
 const warning=sorted.find(reason=>reason.weight<=-50);
 return {score,reasons:sorted,tab:warning||sorted.find(reason=>reason.weight>0)||null};
}
function pickHand(index,d,pos,filter){
 const current=pickSpaces(d)[pos]?.id,inSegment=new Set(matchPeople(d)),elsewhere=playedWrestlerIds(index);
 const unavailable=new Set([...inSegment,...elsewhere]);
 const promo=d.kind==='promo';
 const list=state.roster.filter(r=>r.id!==current).map(r=>{
  const usedHere=inSegment.has(r.id),usedThere=!usedHere&&elsewhere.has(r.id);
  const fit=pickReasons(d,pos,r,unavailable);
  return {r,...fit,score:fit.score-(usedHere||usedThere?45:0),used:usedHere||usedThere,where:usedHere?(promo?'In this promo':'In this match'):usedThere?slotLabel(pickSegmentOf(r.id,index)):''};
 });
 if(filter!=='best'){
  const shown=list.filter(x=>filter==='all'||(filter==='champion'?x.r.champ:x.r.role===filter));
  return {plain:shown.sort((a,b)=>a.used-b.used||(promo?b.r.charisma-a.r.charisma:overallRating(b.r)-overallRating(a.r)))};
 }
 const open=list.filter(x=>!x.used).sort((a,b)=>b.score-a.score);
 let rubs=0;
 for(const x of open)if(x.tab?.cls==='rub'&&++rubs>2)x.tab=x.reasons.find(reason=>reason.cls!=='rub'&&reason.weight>0)||null;
 const must=open.filter(x=>x.tab?.cls==='must'),rest=open.filter(x=>x.tab?.cls!=='must');
 const top=[...must,...rest].slice(0,12),needs=top.filter(x=>x.tab?.cls==='must');
 return {needs,fits:top.filter(x=>!needs.includes(x)),more:list.length-top.length};
}

// ---------- On the segment ----------
function pickCrowdRead(d){
 if(!d)return 'Tap to book it.';
 const spaces=pickSpaces(d),missing=spaces.find(s=>s.id==null&&!s.optional);
 if(d.kind==='promo'){
  if(d.a==null)return 'Needs someone on the mic';
  if(missing)return 'Needs an opponent';
  const a=w(d.a);return a.charisma>=80?'Should deliver':a.charisma>=65?'Solid':'Risky';
 }
 if(missing){
  const label=pickSpaceLabel(d,missing),sides=matchSides(d);
  if(label==='Partner')return 'Needs a partner'+(sides.length===2?' on the '+(missing.si===0?'left':'right'):'');
  if(label==='Pick')return 'Needs a wrestler';
  return label==='Opponent'?'Needs an opponent':'Needs a '+label.toLowerCase()+' corner';
 }
 if(d.winner==null)return 'Needs a winner';
 if(d.finish==='Interference'&&d.interferer==null)return 'Needs a run-in · Details';
 const people=matchPeople(d).map(w),avg=key=>people.reduce((n,r)=>n+r[key],0)/people.length;
 const heat=Math.max(0,...participantPairs(d).map(([a,b])=>state.rivalries[rivalryKey(a,b)]||0));
 const value=avg('skill')*.62+avg('pop')*.25+6+heat*.08+(d.title?4:0)+(people.some(r=>r.role==='Face')&&people.some(r=>r.role==='Heel')?3:0)+establishedTeams(d).reduce((n,t)=>n+t.chemistry*.025,0)-(people.length>=4?2:0);
 return value>=70?'Should deliver':value>=60?'Solid':'Risky';
}
function pickSummary(d,index){
 if(!d||bookingProblems(d).length)return '';
 const parts=[];
 if(d.kind==='promo'){parts.push(d.scene==='Solo address'?'Promo':d.scene,PROMO_INTENTS.find(i=>i.hook===d.hook)?.label||d.hook)}
 else{const win=matchSides(d)[winningSide(d)];parts.push(PICK_SHAPES[matchFormat(d)]||'Match',pickSideName(win)+(win.length>1?' win':' wins'));if(d.title)parts.push('Title')}
 if(state.promises.some(p=>p.status==='open'&&promiseMet(p,[d])))parts.push('Promised');
 if(d.kind==='match'&&qualifierGuidance(d)==='Counts toward Sweeps’ qualifier.')parts.push('Qualifier');
 return parts.join(' · ');
}
function stipSuits(d,rule){
 if(rule==='Singles match')return {tone:'standard',why:'Standard rules.'};
 const special=CHARACTER_SPECIALS.findIndex(s=>s.name===rule);
 if(special>=0)return {tone:'suits',why:'Suits '+pickShortName(w(special))+'.'};
 const people=matchPeople(d).map(w),heat=Math.max(0,...participantPairs(d).map(([a,b])=>state.rivalries[rivalryKey(a,b)]||0));
 const names=people.map(pickShortName).join(' & ');
 if(rule==='Submission match'){const weak=people.find(r=>r.skill<60);return weak?{tone:'tough',why:'Tough for '+pickShortName(weak)+'.'}:people.every(r=>r.skill>=75)?{tone:'suits',why:'Suits '+names+'.'}:{tone:'standard',why:'Technical. Purists like it.'}}
 if(rule==='Last person standing')return heat>=20?{tone:'suits',why:'Suits a grudge this hot.'}:{tone:'standard',why:'Lands best with real heat.'};
 return heat>=35?{tone:'suits',why:'Suits '+names+'. The grudge needs it.'}:{tone:'standard',why:'Chaos crowds love it.'};
}
function pickModifierChips(d,index){
 if(!d||d.kind!=='match'||!matchPeople(d).length)return d?.kind==='promo'&&d.a!=null?`<div class="pick-mods">${d.prop?`<button type="button" class="pick-mod" data-pick-extras="${index}">${esc(SHOW_PROPS[d.prop].name)}</button>`:''}</div>`:'';
 const chips=[];
 if(d.type!=='Singles match')chips.push(`<button type="button" class="pick-mod ${stipSuits(d,d.type).tone==='suits'?'gold':''}" data-pick-extras="${index}">${esc(d.type)}</button>`);
 if(d.title)chips.push(`<button type="button" class="pick-mod gold" data-pick-extras="${index}">★ Title on the line</button>`);
 if(d.finish==='Interference')chips.push(`<button type="button" class="pick-mod" data-pick-details="${index}">Run-in${d.interferer!=null?' · '+esc(pickShortName(w(d.interferer))):''}</button>`);
 if(d.finish==='Cheating')chips.push(`<button type="button" class="pick-mod" data-pick-details="${index}">Screwy finish</button>`);
 if(d.presentation!=='Competitive')chips.push(`<button type="button" class="pick-mod" data-pick-extras="${index}">${esc(d.presentation)}</button>`);
 if(d.prop)chips.push(`<button type="button" class="pick-mod" data-pick-extras="${index}">${esc(SHOW_PROPS[d.prop].name)}</button>`);
 return chips.length?`<div class="pick-mods">${chips.join('')}</div>`:'';
}
// Everything below the plates: crowns, pin-taker, modifiers, summary and the crowd read.
function pickSegmentFoot(index,d){
 const open=pickSheet?.index===index,full=d?.kind==='match'&&pickSpaces(d).every(s=>s.id!=null);
 const sides=d?.kind==='match'?matchSides(d):[];
 const crowns=full?`<div class="pick-crowns ${sides.length===2?'pair':'many'}">${sides.map((side,si)=>{const on=side.includes(d.winner);return `<button type="button" class="pick-crown ${on?'won':''}" data-pick-win="${index}:${si}" aria-pressed="${on}" aria-label="Book ${esc(sideLabel(side))} to win">${on?'👑 Wins':'👑 Win'}</button>`}).join('')}</div>`:'';
 const losers=full&&d.winner!=null?sides.filter(side=>!side.includes(d.winner)).flat():[];
 const pins=losers.length>=2?`<div class="pick-pins" role="group" aria-label="${matchFormat(d)==='royal'?'Last eliminated':'Who takes the pin'}">${losers.map(id=>{const on=d.pin===id;return `<button type="button" class="pick-pin" data-pick-pin="${index}:${id}" aria-pressed="${on}">${on?(matchFormat(d)==='royal'?'Last out':'Takes the pin'):'Pin'} · ${esc(pickShortName(w(id)))}</button>`}).join('')}</div>`:'';
 const empty=!d||!matchPeople(d).length&&!(d.kind==='promo');
 const read=pickCrowdRead(d),summary=pickSummary(d,index),warn=/^Needs/.test(read)||read==='Risky';
 return `<div class="pick-foot">
 ${crowns}${pins}${pickModifierChips(d,index)}
 ${empty?(open?'':`<button type="button" class="pick-hint" data-pick-open="${index}">Tap to book it.</button>`):`<p class="pick-line">${summary?`<b>${esc(summary)}</b>`:''}<span class="pick-read ${warn?'warn':''}">${esc(read)}</span><button type="button" class="text-btn pick-details" data-pick-details="${index}">Details</button></p>`}
 </div>`;
}

// ---------- The pick sheet ----------
function pickOpen(index,pos=null,{mode='pick',swap=null}={}){
 const d=pickWorking(index);
 if(state.liveShow||state.recap)return;
 $('.poster-editor:not([hidden])')?.replaceChildren();
 document.querySelectorAll('.poster-editor').forEach(el=>el.hidden=true);
 const spaces=pickSpaces(d);
 if(pos==null)pos=pickNextSpace(d);
 if(pos<0){mode='extras';pos=0}
 const target=spaces[pos];
 pickSheet={index,pos,mode,filter:'best',swap:swap??(target?.id!=null),confirm:null,openedAt:Date.now(),scroll:0};
 render();
 pickCenterSegment();
}
function pickClose(){
 if(!pickSheet)return;
 const index=pickSheet.index;pickSheet=null;
 document.body.classList.remove('pick-open');
 $('#pick-sheet-root')?.remove();
 render();
 focusBookingSegment(index);
}
function pickRoot(){
 let root=$('#pick-sheet-root');
 if(!root){root=document.createElement('div');root.id='pick-sheet-root';document.body.append(root)}
 return root;
}
function pickCenterSegment(){
 const bout=document.querySelector(`[data-poster-bout="${pickSheet?.index}"]`),sheet=$('.pick-sheet');if(!bout||!sheet)return;
 const top=Math.max(0,$('.topbar')?.getBoundingClientRect().bottom||0),bottom=window.innerHeight-sheet.offsetHeight,rect=bout.getBoundingClientRect();
 // Centre the segment between the header and the sheet; a tall segment lines up under the header instead.
 window.scrollBy({top:rect.height>bottom-top-16?rect.top-top-8:rect.top+rect.height/2-(top+bottom)/2,behavior:'auto'});
}
function pickQuestion(d,space){
 const index=pickSheet.index,main=index===state.card.length-1;
 if(pickSheet.mode==='extras')return d.kind==='promo'?'Shape the segment':'Stips & titles';
 if(!space)return 'Who wins?';
 if(space.id!=null&&pickSheet.swap)return 'Who replaces '+pickShortName(w(space.id))+'?';
 if(d.kind==='promo')return space.pos===0?'Who’s on the mic?':'Who’s out there with '+pickShortName(w(d.a))+'?';
 const ctx=pickContext(d,space.pos);
 if(ctx.mode==='partner')return 'Partner for '+pickShortName(ctx.anchors[0]);
 if(ctx.mode==='open')return main?'Who headlines?':'Who opens it?';
 if(space.si>=2)return matchFormat(d)==='royal'?'Who else is in the royal?':'Who’s the '+PICK_ORDINALS[space.si].toLowerCase()+' corner?';
 return 'Who faces '+pickShortName(ctx.anchors[0])+'?';
}
function pickCardHtml(x,i,promo){
 const r=x.r,tab=x.used?{text:x.where,cls:'used'}:x.tab;
 return `<button type="button" class="pick-card ${x.used?'used':''}" style="--deal:${Math.min(i,8)};--character-color:${r.color}" data-pick-card="${r.id}" aria-label="${esc(r.name)}${tab?', '+esc(tab.text):''}${x.used?', already booked':''}">
 <span class="pick-card-art">${portrait(r)}</span>
 <strong>${esc(rosterCardName(r))}</strong>
 <span class="pick-card-meta">${r.role.toUpperCase()}${r.champ?' · ★':''} · ${promo?'MIC '+r.charisma:'OVR '+overallRating(r)}</span>
 ${tab?`<span class="pick-tab ${tab.cls}">${esc(tab.text)}</span>`:''}
 </button>`;
}
function pickExtrasHtml(d,index){
 const rows=[],row=(act,kicker,name,why,on=false,disabled=false)=>`<button type="button" class="pick-row-btn ${on?'on':''}" data-pick="${act}" aria-pressed="${on}" ${disabled?'disabled':''}><small>${kicker}</small><strong>${name}</strong><span>${why}</span></button>`;
 const props=propsFor(d).map(([key,prop])=>{const taken=state.card.findIndex((s,i)=>i!==index&&s.prop===key);return row('prop:'+key,'Prop · '+money(niceMoney(prop.cost*costScale())),esc(prop.name),taken>=0?'Already in '+esc(slotLabel(taken))+'.':esc(prop.hint||''),d.prop===key,taken>=0)});
 if(d.kind==='promo'){
  const a=w(d.a);
  for(const intent of PROMO_INTENTS){
   const needs=['Issue a challenge','Fuel a rivalry'].includes(intent.hook);
   let why=intent.hint;
   if(needs&&d.target==null)why='Needs a second wrestler.';
   else if(a&&intent.hook==='Fuel a rivalry'&&d.target!=null&&(state.rivalries[rivalryKey(a.id,d.target)]||0)>=20)why='The feud is hot. Pour fuel on it.';
   else if(a&&intent.hook==='Debut a gimmick'&&a.newGimmick)why='New gimmick ready to show off.';
   else if(a&&intent.hook==='Win the crowd'&&a.morale<45)why='Unhappy, so the crowd is the pick-me-up.';
   rows.push(row('hook:'+intent.hook,'Story beat',esc(intent.label),esc(why),d.hook===intent.hook));
  }
  rows.push(...props);
  rows.push(row('details','Everything else','Opening line & presentation','Open the full editor →'));
  return rows.join('');
 }
 const champ=champion(),ids=matchPeople(d);
 if(champ&&ids.includes(champ.id)&&!teamFormat(d))rows.push(row('title','Title',d.title?'WWA Championship on the line':'Non-title',d.title?'Counts as a title defense. Tap to make it non-title.':'Tap to put the belt up. Counts as a title defense.',d.title));
 const order={suits:1,standard:2,tough:3};
 rows.push(...rulesFor(d).map(rule=>({rule,fit:stipSuits(d,rule)})).sort((a,b)=>(b.rule===d.type)-(a.rule===d.type)||order[a.fit.tone]-order[b.fit.tone]).map(({rule,fit})=>{const cost=ruleCost({...d,type:rule});return row('rule:'+rule,'Stipulation'+(cost?' · '+money(cost):''),esc(rule==='Singles match'?'Standard':rule),esc(fit.why),d.type===rule)}));
 rows.push(`<div class="pick-row-set" role="group" aria-label="Presentation"><small>Presentation</small><div>${SHEET_PRESENTATIONS.map(p=>`<button type="button" class="pick-chip" data-pick="present:${p}" aria-pressed="${d.presentation===p}">${p}</button>`).join('')}</div></div>`);
 rows.push(row('prop:','Prop','No prop','Keep it simple.',!d.prop),...props);
 rows.push(row('details','Everything else','Finish & run-ins','Open the full editor →'));
 return rows.join('');
}
function pickSheetHtml(){
 const s=pickSheet,index=s.index,d=pickWorking(index),spaces=pickSpaces(d),space=spaces[s.pos],promo=d.kind==='promo';
 const full=spaces.every(x=>x.id!=null||x.optional);
 if(s.mode==='extras'&&!full)s.mode='pick';
 const chip=(act,label,on,extra='')=>`<button type="button" class="pick-chip" data-pick="${act}" aria-pressed="${on}" ${extra}>${label}</button>`;
 const shapes=`<div class="pick-row" role="group" aria-label="Segment shape" data-keep="shapes">${Object.entries(PICK_SHAPES).map(([key,label])=>chip('shape:'+key,label,!promo&&matchFormat(d)===key)).join('')}${chip('shape:promo','Promo',promo)}</div>`;
 const scenes=promo?`<div class="pick-row" role="group" aria-label="Promo type" data-keep="scenes">${PROMO_SCENES.map(scene=>chip('scene:'+scene,scene==='Solo address'?'Solo':scene,d.scene===scene)).join('')}</div>`:'';
 const filters=`<div class="pick-row pick-filters" role="group" aria-label="Show" data-keep="filters">${full?chip('extras',promo?'Segment':'Stips & titles',s.mode==='extras'):''}${s.mode==='extras'?chip('mode-pick','Wrestlers',false):PICK_FILTERS.map(([key,label])=>chip('filter:'+key,label,s.filter===key)).join('')}</div>`;
 let body='';
 if(s.mode==='extras')body=`<div class="pick-extras">${pickExtrasHtml(d,index)}</div>`;
 else if(!space)body='';
 else{
  const hand=pickHand(index,d,s.pos,s.filter);let n=0;
  const grid=list=>`<div class="pick-grid">${list.map(x=>pickCardHtml(x,n++,promo)).join('')}</div>`;
  body=hand.plain?(hand.plain.length?grid(hand.plain):'<p class="pick-empty">Nobody fits that filter.</p>')
   :`${hand.needs.length?`<h3 class="pick-group">Needs you tonight</h3>${grid(hand.needs)}`:''}<h3 class="pick-group">${hand.needs.length?'Best fits':'Best fit'}</h3>${grid(hand.fits)}${hand.more?`<button type="button" class="text-btn pick-more" data-pick="filter:all">Everyone else · ${hand.more}</button>`:''}`;
 }
 const confirm=s.confirm?`<div class="pick-confirm" role="alert"><p>${esc(w(s.confirm.id).name)} is in ${esc(slotLabel(s.confirm.from))} tonight. Everyone works once a night.</p><div><button type="button" class="btn" data-pick="confirm-no">No</button><button type="button" class="btn primary" data-pick="confirm-move">Move them here</button></div></div>`:'';
 const footer=s.swap&&space?.id!=null&&s.mode==='pick'?`<footer class="pick-sheet-foot"><button type="button" class="btn" data-pick="send-back">Send back</button><button type="button" class="btn" data-pick="details">Details</button></footer>`:'';
 const status=state.drafts[index]?'Draft':state.card[index].kind?'Booked':'Open slot';
 return `<section class="pick-sheet" role="dialog" aria-labelledby="pick-question">
 <header class="pick-head" data-pick-grab><div><small>${esc(slotLabel(index))} · ${promo?'Promo':status}</small><h2 id="pick-question" tabindex="-1">${esc(pickQuestion(d,space))}</h2></div><button type="button" class="pick-x" data-pick="close" aria-label="Close">✕</button></header>
 ${confirm}
 <div class="pick-body">${shapes}${scenes}${filters}${body}</div>
 ${footer}
 </section>`;
}
function pickDraw({keepScroll=true}={}){
 if(!pickSheet)return;
 const root=pickRoot(),old=root.querySelector('.pick-body'),keep={};
 const scroll=keepScroll&&old?old.scrollTop:0;
 root.querySelectorAll('[data-keep]').forEach(el=>keep[el.dataset.keep]=el.scrollLeft);
 const focusAct=root.contains(document.activeElement)?document.activeElement.dataset.pick||document.activeElement.dataset.pickCard:null;
 root.innerHTML=pickSheetHtml();
 document.body.classList.add('pick-open');
 const body=root.querySelector('.pick-body');body.scrollTop=scroll;
 root.querySelectorAll('[data-keep]').forEach(el=>{if(keep[el.dataset.keep]!=null)el.scrollLeft=keep[el.dataset.keep]});
 if(!keepScroll)root.querySelector('.pick-sheet').classList.add('dealing');
 const content=$('.content')?.getBoundingClientRect(),sheet=root.querySelector('.pick-sheet');
 // Sit over the booking column, not the sidebar, on wide screens.
 if(content&&content.width<window.innerWidth-40){const width=Math.min(760,content.width);sheet.style.left=content.left+(content.width-width)/2+'px';sheet.style.right='auto';sheet.style.margin='0';sheet.style.width=width+'px'}
 bindPickSheet(root);
 const again=focusAct&&[...root.querySelectorAll('[data-pick],[data-pick-card]')].find(el=>(el.dataset.pick||el.dataset.pickCard)===focusAct);
 (again||(!root.contains(document.activeElement)?root.querySelector('#pick-question'):null))?.focus({preventScroll:true});
}
// Re-render the page and the sheet together, keeping the sheet's scroll unless the target changed.
function pickRefresh(keepScroll=true){render();pickDraw({keepScroll})}

let pickAudio=null;
function pickTick(){
 try{navigator.vibrate?.(8)}catch{}
 try{
  pickAudio??=new (window.AudioContext||window.webkitAudioContext)();
  const osc=pickAudio.createOscillator(),gain=pickAudio.createGain(),t=pickAudio.currentTime;
  osc.frequency.value=1650;gain.gain.setValueAtTime(.035,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.03);
  osc.connect(gain).connect(pickAudio.destination);osc.start(t);osc.stop(t+.035);
 }catch{}
}
function pickWarnPromise(before,after,removed){
 if(removed==null)return '';
 const p=state.promises.find(p=>p.status==='open'&&p.actor===removed&&promiseMet(p,[before])&&!promiseMet(p,[after]));
 return p?` ${w(removed).name} was promised this. Fans are still expecting it.`:'';
}
function pickPlace(id){
 const s=pickSheet,index=s.index,d=pickWorking(index),before=structuredClone(d),spaces=pickSpaces(d),space=spaces[s.pos];
 if(!space)return;
 if(matchPeople(d).includes(id)&&space.id!==id){toast(w(id).name+' is already in this '+(d.kind==='promo'?'promo':'match')+'.');return}
 const from=pickSegmentOf(id,index);
 if(from>=0&&s.confirm?.id!==id){s.confirm={id,from};pickDraw();$('.pick-confirm .primary')?.focus({preventScroll:true});return}
 if(from>=0){
  const other=pickWorking(from),otherSpace=pickSpaces(other).find(x=>x.id===id);
  pickSet(other,otherSpace.pos,null);pickStage(from,other);
 }
 const replaced=space.id,chain=replaced==null||replaced!==id;
 pickSet(d,s.pos,id);
 const {cleared}=pickStage(index,d);
 pickTick();
 const warn=pickWarnPromise(before,d,replaced);
 const next=chain?pickNextSpace(d,s.pos):-1;
 s.confirm=null;
 if(next>=0){s.pos=next;s.swap=false;s.mode='pick';s.filter='best';pickRefresh(false);pickCenterSegment()}
 else pickClose();
 const notes=[warn.trim(),cleared.length?'Cleared the '+cleared.join(', ')+'.':'',from>=0?w(id).name+' moved from '+slotLabel(from)+'.':''].filter(Boolean);
 if(notes.length)toast(notes.join(' '));
}
function pickAction(act){
 const s=pickSheet;if(!s)return;
 const [name,...rest]=act.split(':'),value=rest.join(':');
 const index=s.index;
 if(name==='close'){pickClose();return}
 if(name==='confirm-no'){s.confirm=null;pickDraw();return}
 if(name==='confirm-move'){pickPlace(s.confirm.id);return}
 if(name==='filter'){s.filter=value;s.mode='pick';pickDraw({keepScroll:false});return}
 if(name==='extras'){s.mode=s.mode==='extras'?'pick':'extras';pickDraw({keepScroll:false});return}
 if(name==='mode-pick'){s.mode='pick';pickDraw({keepScroll:false});return}
 if(name==='details'){pickSheet=null;document.body.classList.remove('pick-open');$('#pick-sheet-root')?.remove();render();openBookingDesk(index);document.querySelector(`[data-poster-editor="${index}"]`)?.scrollIntoView({block:'start'});return}
 const d=pickWorking(index);
 if(name==='send-back'){
  const space=pickSpaces(d)[s.pos],before=structuredClone(d),gone=space?.id;if(gone==null)return;
  pickSet(d,s.pos,null);pickStage(index,d);pickTick();
  toast(w(gone).name+' sent back to the roster.'+pickWarnPromise(before,d,gone));
  s.swap=false;pickRefresh(false);return;
 }
 if(name==='shape'){
  const {d:next,dropped}=pickReshape(d,value);
  pickStage(index,next);
  const target=pickNextSpace(next);
  if(target>=0){s.pos=target;s.swap=false;s.mode='pick'}else{s.pos=0;s.swap=false;s.mode='extras'}
  pickRefresh();
  if(dropped)toast(dropped+' sent back to the roster.');
  return;
 }
 if(name==='scene'){d.scene=value;if(!promoNeedsTarget(d)&&d.target==null)s.pos=Math.min(s.pos,0);pickStage(index,d);const next=pickNextSpace(d);if(next>=0&&next!==s.pos){s.pos=next;s.swap=false}pickRefresh();return}
 if(name==='hook'){d.hook=value;pickStage(index,d);const next=pickNextSpace(d);if(next>=0){s.pos=next;s.mode='pick';s.swap=false}pickRefresh();return}
 if(name==='title'){d.title=!d.title;pickStage(index,d);pickTick();pickRefresh();return}
 if(name==='rule'){d.type=value;pickStage(index,d);pickTick();pickRefresh();return}
 if(name==='present'){d.presentation=value;pickStage(index,d);pickRefresh();return}
 if(name==='prop'){d.prop=value;pickStage(index,d);pickRefresh();return}
}
function bindPickSheet(root){
 const sheet=root.querySelector('.pick-sheet');
 sheet.onclick=event=>{
  event.stopPropagation();
  const card=event.target.closest('[data-pick-card]');
  if(card){pickPlace(Number(card.dataset.pickCard));return}
  const button=event.target.closest('[data-pick]');
  if(button&&!button.disabled)pickAction(button.dataset.pick);
 };
 // Swipe the header down to close.
 const grab=sheet.querySelector('[data-pick-grab]');let start=null;
 grab.onpointerdown=event=>{if(event.target.closest('button'))return;start={y:event.clientY,id:event.pointerId};grab.setPointerCapture(event.pointerId)};
 grab.onpointermove=event=>{if(start?.id!==event.pointerId)return;const dy=Math.max(0,event.clientY-start.y);sheet.style.transform=dy?`translateY(${dy}px)`:''};
 grab.onpointerup=grab.onpointercancel=event=>{if(start?.id!==event.pointerId)return;const dy=event.clientY-start.y;start=null;sheet.style.transform='';if(dy>60)pickClose()};
}
// Outside taps close the sheet, except taps on the segment's own spaces and controls.
document.addEventListener('click',event=>{
 if(!pickSheet||Date.now()-pickSheet.openedAt<450)return;
 if(event.target.closest('#pick-sheet-root,[data-poster-slot],[data-pick-win],[data-pick-pin],[data-pick-open],[data-pick-label],[data-edit],#next-booking,[data-add-match],#suggest-rest,[data-pick-extras],#toast'))return;
 pickClose();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&pickSheet){event.preventDefault();pickClose()}});

// ---------- Segment taps and drags ----------
function pickBindSegments(poster){
 if(!pickSheet)document.body.classList.remove('pick-open');
 if(pickSheet&&!poster.querySelector(`[data-poster-bout="${pickSheet.index}"]`)){pickSheet=null;$('#pick-sheet-root')?.remove();document.body.classList.remove('pick-open')}
 else if(pickSheet&&!$('#pick-sheet-root .pick-sheet'))pickDraw({keepScroll:false});
 for(const button of poster.querySelectorAll('[data-pick-win]'))button.onclick=()=>{
  const [index,si]=button.dataset.pickWin.split(':').map(Number),d=pickWorking(index),side=matchSides(d)[si];
  d.winner=side.includes(d.winner)?null:side[0];pickStage(index,d);pickTick();pickRefresh();
  const read=pickCrowdRead(pickWorking(index));
  if(d.winner!=null)toast(pickSideName(side)+(side.length>1?' win.':' wins.')+(read.startsWith('Needs')?' '+read+'.':''));
 };
 for(const button of poster.querySelectorAll('[data-pick-pin]'))button.onclick=()=>{
  const [index,id]=button.dataset.pickPin.split(':').map(Number),d=pickWorking(index);
  if(d.pin===id)delete d.pin;else d.pin=id;pickStage(index,d);pickTick();pickRefresh();
 };
 for(const button of poster.querySelectorAll('[data-pick-open]'))button.onclick=()=>pickOpen(Number(button.dataset.pickOpen));
 for(const button of poster.querySelectorAll('[data-pick-extras]'))button.onclick=()=>pickOpen(Number(button.dataset.pickExtras),0,{mode:'extras'});
 for(const button of poster.querySelectorAll('[data-pick-details]'))button.onclick=()=>{const index=Number(button.dataset.pickDetails);pickSheet=null;$('#pick-sheet-root')?.remove();document.body.classList.remove('pick-open');openBookingDesk(index);document.querySelector(`[data-poster-editor="${index}"]`)?.scrollIntoView({block:'start'})};
 for(const slot of poster.querySelectorAll('[data-poster-slot]'))pickBindSlot(slot,poster);
 for(const label of poster.querySelectorAll('.press-bout-label[data-pick-label]'))pickBindSegmentDrag(label,poster);
}
let pickDrag=null,pickSuppressClick=false;
document.addEventListener('touchmove',event=>{if(pickDrag?.ghost)event.preventDefault()},{passive:false});
function pickGhost(el,event){
 const ghost=el.cloneNode(true);ghost.classList.add('pick-ghost');ghost.setAttribute('aria-hidden','true');
 const rect=el.getBoundingClientRect();ghost.style.width=rect.width+'px';ghost.style.height=rect.height+'px';
 ghost.style.left=event.clientX-rect.width/2+'px';ghost.style.top=event.clientY-rect.height/2+'px';
 document.body.append(ghost);document.body.classList.add('pick-dragging');el.classList.add('pick-lifted');
 return ghost;
}
function pickEndDrag(){
 if(pickDrag?.timer)clearTimeout(pickDrag.timer);
 pickDrag?.ghost?.remove();pickDrag?.el?.classList.remove('pick-lifted');
 document.body.classList.remove('pick-dragging');
 document.querySelectorAll('.pick-drop').forEach(el=>el.classList.remove('pick-drop'));
 pickDrag=null;
}
function pickBindSlot(slot,poster){
 const [index,pos]=slot.dataset.posterSlot.split(':').map(Number);
 const id=pickSpaces(pickWorking(index))[pos]?.id;
 slot.onclick=event=>{
  if(pickSuppressClick){pickSuppressClick=false;event.preventDefault();return}
  if(pickSheet?.index===index){
   if(pickSheet.pos===pos&&id==null)return;
   pickSheet.pos=pos;pickSheet.swap=id!=null;pickSheet.mode='pick';pickSheet.filter='best';pickSheet.confirm=null;pickRefresh(false);return;
  }
  pickOpen(index,pos,{swap:id!=null});
 };
 if(id==null)return;
 slot.onpointerdown=event=>{
  if(!event.isPrimary||event.button!==0)return;
  pickEndDrag();
  pickDrag={el:slot,index,pos,id,x:event.clientX,y:event.clientY,t:Date.now(),pointer:event.pointerId,moved:false,ghost:null};
  pickDrag.timer=setTimeout(()=>{if(!pickDrag||pickDrag.moved)return;pickDrag.timer=null;pickDrag.ghost=pickGhost(slot,{clientX:pickDrag.x,clientY:pickDrag.y});try{slot.setPointerCapture(pickDrag.pointer)}catch{};try{navigator.vibrate?.(10)}catch{}},260);
 };
 slot.onpointermove=event=>{
  if(pickDrag?.el!==slot||pickDrag.pointer!==event.pointerId)return;
  const dx=event.clientX-pickDrag.x,dy=event.clientY-pickDrag.y;
  if(!pickDrag.ghost){if(Math.hypot(dx,dy)>10){pickDrag.moved=true;clearTimeout(pickDrag.timer)}return}
  const g=pickDrag.ghost;g.style.left=event.clientX-g.offsetWidth/2+'px';g.style.top=event.clientY-g.offsetHeight/2+'px';
  document.querySelectorAll('.pick-drop').forEach(el=>el.classList.remove('pick-drop'));
  document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-poster-slot]')?.classList.add('pick-drop');
 };
 slot.onpointerup=event=>{
  if(pickDrag?.el!==slot)return;
  const drag=pickDrag,dx=event.clientX-drag.x,dy=event.clientY-drag.y,quick=Date.now()-drag.t<320;
  if(!drag.ghost){
   pickEndDrag();
   // Flick sideways to send someone back.
   if(drag.moved&&quick&&Math.abs(dx)>60&&Math.abs(dy)<35){pickSuppressClick=true;setTimeout(()=>pickSuppressClick=false,400);pickSendBack(index,pos)}
   return;
  }
  pickSuppressClick=true;setTimeout(()=>pickSuppressClick=false,400);
  const moved=Math.hypot(dx,dy)>12;
  drag.ghost.hidden=true;
  const under=document.elementFromPoint(event.clientX,event.clientY);
  pickEndDrag();
  if(!moved){editWrestler(id);return}
  const target=under?.closest('[data-poster-slot]');
  if(target){const [ti,tp]=target.dataset.posterSlot.split(':').map(Number);pickMove(index,pos,ti,tp);return}
  if(under?.closest('.poster-bout'))return;
  pickSendBack(index,pos);
 };
 slot.onpointercancel=()=>{if(pickDrag?.el===slot)pickEndDrag()};
 slot.oncontextmenu=event=>event.preventDefault();
}
function pickSendBack(index,pos){
 const d=pickWorking(index),before=structuredClone(d),gone=pickSpaces(d)[pos]?.id;if(gone==null)return;
 pickSet(d,pos,null);pickStage(index,d);pickTick();
 if(pickSheet?.index===index){pickSheet.pos=pos;pickSheet.swap=false;pickSheet.mode='pick'}
 pickSheet?pickRefresh(false):render();
 toast(w(gone).name+' sent back to the roster.'+pickWarnPromise(before,d,gone));
}
function pickMove(fromIndex,fromPos,toIndex,toPos){
 if(fromIndex===toIndex&&fromPos===toPos)return;
 const a=pickWorking(fromIndex),beforeA=structuredClone(a),id=pickSpaces(a)[fromPos].id;
 if(fromIndex===toIndex){
  const other=pickSpaces(a)[toPos]?.id??null;
  pickSet(a,toPos,null);pickSet(a,fromPos,other);pickSet(a,toPos,id);pickStage(fromIndex,a);
  pickTick();pickSheet?pickRefresh():render();toast(other!=null?'Traded places.':'Moved.');return;
 }
 const b=pickWorking(toIndex),toSpace=pickSpaces(b)[toPos];if(!toSpace)return;
 const other=toSpace.id??null;
 pickSet(b,toPos,id);pickSet(a,fromPos,other);
 pickStage(fromIndex,a);pickStage(toIndex,b);pickTick();
 pickSheet?pickRefresh():render();
 toast((other!=null?pickShortName(w(id))+' and '+pickShortName(w(other))+' traded places.':w(id).name+' moved to '+slotLabel(toIndex)+'.')+pickWarnPromise(beforeA,a,other==null?id:null));
}
// Hold a segment's billing label to drag the whole segment. Whatever ends up last is the main event.
function pickBindSegmentDrag(label,poster){
 const index=Number(label.dataset.pickLabel);
 label.onclick=event=>{if(pickSuppressClick){pickSuppressClick=false;event.preventDefault();return}pickOpen(index)};
 label.onpointerdown=event=>{
  if(!event.isPrimary||event.button!==0)return;pickEndDrag();
  const bout=label.closest('.poster-bout');
  pickDrag={el:bout,index,x:event.clientX,y:event.clientY,pointer:event.pointerId,moved:false,ghost:null,segment:true};
  pickDrag.timer=setTimeout(()=>{if(!pickDrag||pickDrag.moved)return;pickDrag.ghost=pickGhost(bout,{clientX:pickDrag.x,clientY:pickDrag.y});try{label.setPointerCapture(pickDrag.pointer)}catch{};try{navigator.vibrate?.(10)}catch{}},260);
 };
 label.onpointermove=event=>{
  if(!pickDrag?.segment||pickDrag.pointer!==event.pointerId)return;
  if(!pickDrag.ghost){if(Math.hypot(event.clientX-pickDrag.x,event.clientY-pickDrag.y)>10){pickDrag.moved=true;clearTimeout(pickDrag.timer)}return}
  pickDrag.ghost.style.top=event.clientY-pickDrag.ghost.offsetHeight/2+'px';
  document.querySelectorAll('.pick-drop').forEach(el=>el.classList.remove('pick-drop'));
  pickDrag.ghost.hidden=true;document.elementFromPoint(event.clientX,event.clientY)?.closest('.poster-bout')?.classList.add('pick-drop');pickDrag.ghost.hidden=false;
 };
 label.onpointerup=event=>{
  if(!pickDrag?.segment)return;
  const drag=pickDrag;if(!drag.ghost){pickEndDrag();return}
  pickSuppressClick=true;setTimeout(()=>pickSuppressClick=false,400);
  drag.ghost.hidden=true;const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-poster-bout]');pickEndDrag();
  if(!target)return;
  const to=Number(target.dataset.posterBout);if(to===index)return;
  let at=index;const step=to>at?1:-1;while(at!==to)at=moveBooking(at,step);
  render();focusBookingSegment(to);pickTick();toast(slotLabel(index)+' is now the '+slotLabel(to).toLowerCase()+'.');
 };
 label.onpointercancel=()=>{if(pickDrag?.segment)pickEndDrag()};
 label.oncontextmenu=event=>event.preventDefault();
}

// "Suggest the rest" fills empty spaces from wrestlers' traits alone. It ignores stories and
// obligations, so it never plays the game for you, and it leaves every winner to you.
function pickSuggestRest(){
 let filled=0;
 for(const index of billOrder()){
  const d=pickWorking(index);
  if(d.kind==='promo'&&d.a!=null&&!(promoNeedsTarget(d)&&d.target==null))continue;
  let pos;
  while((pos=pickNextSpace(d))>=0){
   const taken=new Set([...playedWrestlerIds(index),...matchPeople(d)]);
   const pool=state.roster.filter(r=>!taken.has(r.id));if(!pool.length)break;
   const ctx=pickContext(d,pos),anchor=ctx.anchors[0];
   const score=r=>d.kind==='promo'&&pos===0?r.charisma:!anchor?overallRating(r):(ctx.mode==='partner'?(r.role===anchor.role?12:0):(r.role!==anchor.role?12:0))-Math.abs(overallRating(r)-overallRating(anchor));
   const pick=pool.sort((a,b)=>score(b)-score(a))[0];
   pickSet(d,pos,pick.id);filled++;
  }
  pickStage(index,d);
 }
 render();
 toast(filled?`Filled ${filled} space${filled===1?'':'s'} by traits alone. Winners are still yours.`:'Every space is already filled.');
}
function pickHasEmptySpaces(){return state.card.some((segment,index)=>{const d=pickWorking(index);return pickNextSpace(d)>=0})}
