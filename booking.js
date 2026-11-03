'use strict';
function otherBookings(id,editingIndex){return state.card.map((segment,index)=>({segment,index})).filter(({segment,index})=>index!==editingIndex&&matchPeople(segment).includes(id)).map(({index})=>index+1)}
function bookingResumeStep(draft){
 if(draft.kind==='promo')return draft.a==null?'p0':'finish';
 if(!MATCH_FORMATS[draft.format])return 'format';
 const missing=matchSides(draft).flat().findIndex(id=>id==null);
 return missing<0?'finish':'p'+missing;
}
function bookingDraftSummary(draft){
 const names=matchPeople(draft).map(id=>w(id)?.name).filter(Boolean).join(' · '),issues=bookingProblems({...draft,draft:false});
 return (names||'No wrestlers selected')+' · '+(issues[0]||'Ready to save');
}
function sweepsQualifierPending(){const a=state.arc;return a?.route==='earn'&&!a.earned&&state.week>=a.start&&state.week<a.start+4}
function qualifierGuidance(draft){
 if(!sweepsQualifierPending()||draft.kind!=='match'||!matchPeople(draft).includes(10))return '';
 if(matchPeople(draft).includes(17))return 'Does not count toward Sweeps’ qualifier: choose an opponent other than the insurer.';
 return draft.winner===10&&draft.finish==='Clean finish'?'Counts toward Sweeps’ qualifier.':'For Sweeps’ qualifier, book him to win with a clean finish.';
}
function finishSummary(draft){
 if(bookingProblems(draft).length)return bookingProblems(draft)[0];
 return sideLabel(matchSides(draft)[winningSide(draft)])+' wins · '+(draft.type==='Singles match'?'Standard':draft.type)+' · '+draft.finish;
}
function returnToBooking(index,message){render();focusBookingSegment(index);toast(message)}
// Suggestions explain existing traits and story context; they do not add hidden bonuses.
function opponentFit(draft,key,candidate,index){
 if(draft.kind==='promo'&&key==='p0'){
  const promise=state.promises.find(p=>p.kind==='promo'&&p.actor===candidate.id&&p.status==='open');
  return {
   score:candidate.charisma+(promise?100:0),
   reasons:promise?[`Promised mic time · week ${promise.due}`]:[]
  };
 }
 if(draft.kind!=='match')return {score:0,reasons:[]};
 const sizes=matchSides(draft),position=Number(key.slice(1));let offset=0,sideIndex=0;
 for(let i=0;i<sizes.length;i++){if(position<offset+sizes[i].length){sideIndex=i;break}offset+=sizes[i].length}
 const opponents=sizes.filter((_,i)=>i!==sideIndex).flat().filter(id=>id!=null&&id!==candidate.id).map(w);
 if(!opponents.length)return {score:0,reasons:[]};
 const reasons=[];let score=0;
 if(sweepsQualifierPending()&&(opponents.some(r=>r.id===10)||candidate.id===10)){
  const insurer=candidate.id===17||opponents.some(r=>r.id===17);
  score+=insurer?-100:65;reasons.push(insurer?'Does not count toward Sweeps’ qualifier':'Qualifying opponent · book Sweeps a clean win');
 }
 const heat=Math.max(0,...opponents.map(r=>state.rivalries[rivalryKey(r.id,candidate.id)]||0));
 if(heat){score+=Math.min(40,heat);reasons.push(`Existing rivalry · ${heat} heat`)}
 if(state.challenges.some(c=>c.status==='open'&&opponents.some(r=>[c.actor,c.target].includes(r.id)&&[c.actor,c.target].includes(candidate.id)))){score+=45;reasons.push('Answers an open challenge')}
 if(opponents.some(r=>r.role!==candidate.role)){score+=15;reasons.push('Face / heel contrast')}
 if(candidate.skill>=75&&opponents.some(r=>r.skill>=75)){score+=14;reasons.push('Strong ring workers on both sides')}
 else if(candidate.skill>=80&&opponents.some(r=>r.skill<60)){score+=10;reasons.push('Experienced opponent for a developing wrestler')}
 if(candidate.charisma>=80&&opponents.some(r=>r.charisma>=80)){score+=10;reasons.push('Both can carry a talking rivalry')}
 if(opponents.some(r=>Math.abs(r.pop-candidate.pop)<=15)){score+=8;reasons.push('Similar popularity · competitive billing')}
 if(otherBookings(candidate.id,index).length){score-=12;reasons.push('Already booked in segment '+otherBookings(candidate.id,index).join(', '))}
 return {score,reasons};
}
function matchRead(draft,editingIndex){
 if(bookingProblems(draft).length)return {title:'Every spot is yours to choose.',notes:bookingProblems(draft)};
 const a=w(draft.a);if(draft.kind==='promo')return {title:a.charisma>=80?'Give this one a microphone.':'A moment to find their voice.',notes:[ringPersonalities[a.id].voice,`Charisma ${a.charisma} · Popularity ${a.pop}`,draft.target!=null?`Named target: ${w(draft.target).name}.`:'This address is for the audience.',SHOW_PROPS[draft.prop]?.hint||'The character’s own voice carries the scene.',otherBookings(a.id,editingIndex).length?'They already have another segment tonight.':'Fresh tonight. The spotlight is theirs.']};
 const people=matchPeople(draft).map(w),sides=matchSides(draft),win=sides[winningSide(draft)]||sides[0],pairs=participantPairs(draft),heat=Math.max(0,...pairs.map(([a,b])=>state.rivalries[rivalryKey(a,b)]||0)),notes=[];
 const label=MATCH_FORMATS[matchFormat(draft)].label;
 let title=heat>=35?'There’s already a grudge here.':teamFormat(draft)?'Build a team. Give them a moment.':people.length>2?'More rivals. More ways to steal it.':'Give the crowd a side to pick.';
 notes.push(`${label}: ${people.length} wrestlers, ${sides.length} opposing sides.`);
 if(heat)notes.push(`Strongest rivalry heat: ${heat}/100. A clean big-event finish can pay it off.`);
 if(teamFormat(draft)){const bonded=establishedTeams(draft);notes.push(bonded.length?`${bonded.map(t=>t.name).join(' and ')} bring established chemistry. Everyone on the winning team gets the win.`:'These are improvised teams. Everyone on the winning side shares the victory.');}
 if(people.every(r=>r.skill>=75))notes.push('Strong ring workers throughout. The purists have a reason to watch.');else if(people.some(r=>r.skill<60))notes.push('Keep the exchanges simple for the less experienced wrestlers.');
 const busy=people.filter(r=>otherBookings(r.id,editingIndex).length);if(busy.length)notes.push(`${busy.map(r=>r.name).join(', ')} already ${busy.length===1?'has':'have'} another segment tonight.`);
 if(draft.finish==='Upset victory')notes.push('The upset lands best when the winning side is less popular than the opposition.');
 if(draft.presentation==='Upset')notes.push('An upset earns its bonus when the winning side is less popular.');
 if(SHOW_PROPS[draft.prop])notes.push(SHOW_PROPS[draft.prop].hint);
 if(draft.finish==='Interference'&&draft.interferer!=null)notes.push(`${w(draft.interferer).name} becomes part of the story with the losing opponent.`);
 if(draft.title)notes.push(people.some(r=>r.champ)?w(draft.winner).champ?'The champion is booked to retain.':'You’re booking a new singles champion.':'Add the champion or turn off the title match.');
 if(matchFormat(draft)==='royal')notes.push('The finish is an over-the-top-rope elimination, not a pinfall.');
 if(state.request==='yes'&&people.some(r=>r.id===10))notes.push(win.includes(10)&&draft.finish==='Clean finish'?'This clean win delivers your promise to Sweeps.':'Remember: Sweeps was promised a clean win tonight.');
 const guidance=qualifierGuidance(draft);if(guidance)notes.unshift(guidance);
 for(const promise of state.promises.filter(p=>p.status==='open'&&matchPeople(draft).includes(p.actor)))notes.push(promiseLabel(promise)+(promiseMet(promise,[draft])?' · covered by this booking.':' · not yet covered by this booking.'));
 return {title,notes};
}
function openBookingDesk(editingIndex,chosenKind,entry=null){
 const original=state.drafts[editingIndex]||state.card[editingIndex];
 const host=document.querySelector(`[data-poster-editor="${editingIndex}"]`);
 if(!host)return;
 const active=$('.poster-editor:not([hidden])');
 if(active&&active!==host)active.replaceChildren();
 if(active&&active!==host)active.hidden=true;
 host.hidden=false;
 if(!original.kind&&!chosenKind){
  host.innerHTML='<div class="poster-controls"><button type="button" class="btn" data-kind="match">Book a match</button><button type="button" class="btn" data-kind="promo">Book a promo</button></div>';
  for(const button of host.querySelectorAll('[data-kind]'))button.onclick=()=>openBookingDesk(editingIndex,button.dataset.kind);
  host.querySelector('button').focus();
  return;
 }
 const draft=original.kind&&(!chosenKind||chosenKind===original.kind)?structuredClone(original):blankBooking(chosenKind);draft.concept??='';draft.hook??='';draft.scene??='Solo address';if(!Object.hasOwn(draft,'target'))draft.target=draft.kind==='promo'&&['Issue a challenge','Fuel a rivalry'].includes(draft.hook)?ringOpponent(draft,draft.a)?.id??null:null;draft.presentation??=draft.finish==='Upset victory'?'Upset':'Competitive';if(draft.finish==='Upset victory')draft.finish='Clean finish';
 if(draft.kind==='promo'){
  draft.hook||='Win the crowd';
  draft.target??=null;
  draft.draft=false;
 }
 if(draft.kind==='match'){
  draft.type||='Singles match';
  draft.finish||='Clean finish';
 }
 let promoExtrasOpen=!!(draft.concept||draft.prop||draft.scene!=='Solo address');
 let step=bookingResumeStep(draft),focusId=draft.a,query='',filter='all',sort='story',expanded=false,justBooked=null;
 if(entry)step=entry.step||step;
 if(draft.kind==='promo'&&draft.a==null)step='p0';
 const handToggle=$('.poster-hand-toggle');
 function collapseHand(){
  if(handToggle?.getAttribute('aria-expanded')==='true')handToggle.click();
 }
 const slots=()=>draft.kind==='promo'?[{key:'p0',id:draft.a,label:'Speaker'},{key:'p1',id:draft.target,label:'Recipient'}]:matchSides(draft).flatMap((side,si)=>side.map((id,pi)=>({key:'p'+(matchSides(draft).slice(0,si).flat().length+pi),id,label:teamFormat(draft)?`Team ${String.fromCharCode(65+si)} · ${pi+1}`:`Wrestler ${si+1}`})));
 const slotId=key=>slots().find(slot=>slot.key===key)?.id;
 if(!['format','finish'].includes(step)&&!slots().some(slot=>slot.key===step))step='p0';
 if(entry&&step!=='finish'&&step!=='format')focusId=slotId(step);

 const readSettings=()=>{const form=host.querySelector('form');if(!form)return;const f=new FormData(form);for(const key of ['type','finish','hook','concept','scene','presentation','prop','interferenceReason'])if(f.has(key))draft[key]=f.get(key);if($('#cast-title'))draft.title=$('#cast-title').checked;for(const key of ['target','interferer'])if(f.has(key))draft[key]=f.get(key)===''?null:Number(f.get(key));};
 const fail=message=>{const el=$('#cast-error');el.textContent=message;el.hidden=false;el.scrollIntoView({block:'nearest'});el.focus();};
 host.innerHTML=`<form><h3 id="poster-editor-heading">${draft.kind==='promo'?'Book a promo':'Book segment'}</h3><div class="cast-toolbar"><label for="cast-kind">Segment ${editingIndex+1}</label><select id="cast-kind" name="kind"><option value="match" ${draft.kind==='match'?'selected':''}>Match</option><option value="promo" ${draft.kind==='promo'?'selected':''}>Promo</option></select><span id="cast-live-status" role="status" aria-live="polite">${draft.kind==='promo'?'Choose who gets the mic.':'Choose the wrestlers for this segment.'}</span></div><p id="cast-error" class="cast-error" role="alert" tabindex="-1" hidden></p><div id="casting-desk"></div><div class="modal-actions"><button type="button" class="btn cancel">Done for now</button><button type="submit" class="btn primary">Save booking</button></div></form>`;
 const form=host.querySelector('form');
 form.onsubmit=event=>{
  event.preventDefault();
  readSettings();
  if(step!=='finish'){commitFocus();return}
  const problems=bookingProblems(draft);if(draft.prop&&state.card.some((s,i)=>i!==editingIndex&&s.prop===draft.prop))problems.push('That prop is already allocated to another segment.');if(problems.length)return fail(problems[0]);
  if(draft.kind==='match'){
   const ids=matchPeople(draft);if(new Set(ids).size!==ids.length)return fail('Each wrestler can appear only once in a match.');if(ids.length!==MATCH_FORMATS[matchFormat(draft)].sizes.reduce((n,size)=>n+size,0))return fail('Fill every participant slot.');
   if(!matchPeople(draft).includes(draft.winner))return fail('Choose a winner from this match.');
   if(draft.title&&(teamFormat(draft)||!matchPeople(draft).includes(champion().id)))return fail(`${champion().name} holds the title. Add the champion or turn off the title match.`);

  }
  state.card[editingIndex]=structuredClone({...draft,concept:draft.concept.trim(),draft:false});delete state.drafts[editingIndex];
  returnToBooking(editingIndex,draft.kind==='promo'?'Promo booked.':'Match booked.');
 };
 const stash=()=>{readSettings();state.drafts[editingIndex]=structuredClone(draft);save()};
 host.querySelector('.cancel').onclick=()=>{stash();returnToBooking(editingIndex,'Draft saved.')};
 form.addEventListener('input',stash);
 form.addEventListener('change',stash);

 const reserved=()=>draft.kind==='promo'?new Set(step==='p1'?[draft.a]:[]):new Set(slots().filter(slot=>slot.key!==step).map(slot=>slot.id));
 const filtered=()=>state.roster.filter(r=>(filter==='all'||(filter==='fresh'?otherBookings(r.id,editingIndex).length===0:filter==='champion'?r.champ:r.role===filter))&&(r.name+' '+r.gimmick+' '+ringPersonalities[r.id].style).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='story'?opponentFit(draft,step,b,editingIndex).score-opponentFit(draft,step,a,editingIndex).score||Number(/Promised|challenge|Sweeps/.test(suggestionReason(b,editingIndex)))-Number(/Promised|challenge|Sweeps/.test(suggestionReason(a,editingIndex)))||b.momentum-a.momentum:sort==='name'?a.name.localeCompare(b.name):b[sort]-a[sort]);
 const available=()=>filtered().filter(r=>!reserved().has(r.id));
 function announce(text){$('#cast-live-status').textContent=text;$('#cast-error').hidden=true}
 function toStep(next){if($('#promo-extras'))promoExtrasOpen=$('#promo-extras').open;stash();step=draft.kind==='match'&&!draft.format?'format':next;query='';filter='all';expanded=false;justBooked=null;if(step!=='finish')focusId=slotId(step);drawDesk();($('#cast-spotlight')||$('#cast-review')||$('.format-grid button'))?.focus({preventScroll:true});}
 function slot(id,key,label){const r=w(id);if(!r)return `<button type="button" class="cast-slot empty-cast-slot ${step===key?'active':''}" data-cast-slot="${key}" aria-label="Choose ${label}"><span class="empty-cast-icon">+</span><span><small>${label}</small><strong>Choose wrestler</strong></span></button>`;return `<button type="button" class="cast-slot ${step===key?'active':''} ${justBooked===key?'fresh-drop':''}" data-cast-slot="${key}" aria-pressed="${step===key}" aria-label="Change ${label}: ${esc(r.name)}"><span class="cast-slot-art" style="--character-color:${r.color}">${portrait(r)}</span><span><small>${label}</small><strong>${esc(r.name)}</strong></span>${justBooked===key?'<b class="cast-booked">BOOKED</b>':''}</button>`}
 function drawDesk(){
  if(step==='format'){
   $('#casting-desk').innerHTML=`<div class="cast-review-title"><small>FIRST, SET THE STAGE</small><h3>What kind of match?</h3><p>Choose the format. Then every spot is yours to cast.</p></div><div class="format-grid">${Object.entries(MATCH_FORMATS).map(([key,value])=>`<button type="button" class="btn" data-format="${key}">${value.label}</button>`).join('')}</div>`;
   syncFooter();document.querySelectorAll('[data-format]').forEach(button=>button.onclick=()=>{resizeBooking(draft,button.dataset.format);step='p0';focusId=null;stash();drawDesk();announce('Format selected. Cast your first wrestler.')});return;
  }
  syncFooter();
  $('#casting-desk').innerHTML=`<nav class="cast-stage-nav" aria-label="Booking stages">${draft.kind==='promo'?`<button type="button" data-step="p0" ${step==='p0'?'aria-current="step"':''}>1 Speaker</button><button type="button" data-step="finish" ${step!=='p0'?'aria-current="step"':''} ${draft.a==null?'disabled':''}>2 Pitch</button>`:`<button type="button" data-step="format">1 Format</button><button type="button" data-step="p0" ${step!=='finish'?'aria-current="step"':''}>2 Wrestlers</button><button type="button" data-step="finish" ${step==='finish'?'aria-current="step"':''}>3 Finish</button>`}</nav><div class="cast-progress">Segment ${editingIndex+1} · ${draft.kind==='promo'?(step==='finish'?'Shape the promo':step==='p1'?'Choose a recipient':'Choose who gets the mic'):step==='finish'?'Review the booking':`Choose ${slots().find(s=>s.key===step)?.label||'wrestler'} · ${Number(step.slice(1))+1} of ${slots().length}`}</div>${draft.kind==='match'?`<details class="cast-participants"><summary>Participants · ${slots().filter(s=>s.id!=null).length}/${slots().length} selected${matchPeople(draft).length?' · '+esc(matchPeople(draft).map(id=>rosterCardName(w(id))).join(' / ')):''} <span>Change</span></summary><div class="cast-slots ${slots().length>2?'multiple':draft.kind==='promo'?'solo':''}">${slots().map(slotData=>slot(slotData.id,slotData.key,slotData.label)).join('')}</div></details>` : ''}${draft.kind==='match'?`<div class="cast-format-summary"><strong>${MATCH_FORMATS[matchFormat(draft)].label}</strong>${teamFormat(draft)&&state.teams.length?`<details class="cast-team-loader"><summary>Load a team</summary>${state.teams.map((team,index)=>[0,1].map(si=>`<button type="button" data-team-load="${index}:${si}">${esc(team.name)} → Team ${String.fromCharCode(65+si)}</button>`).join('')).join('')}</details>`:''}</div>`:''}${step==='finish'?'<div id="cast-review"></div>':`<div class="cast-browse-head"><div><h3>${draft.kind==='promo'?'Who’s got something to say?':step==='p0'?'Who opens the fight?':'Who gets the next spot?'}</h3><p>${draft.kind==='promo'?'Find a voice. Give them a moment.':'Browse a card, then send them into the ring.'}</p></div></div><div class="cast-search"><button type="button" id="cast-surprise" aria-label="Suggest a wildcard wrestler">✦ Wildcard</button><input type="search" id="cast-search" aria-label="Search wrestlers" placeholder="Name, gimmick, or ring style…" value="${esc(query)}"><label class="cast-sort">Sort<select id="cast-sort" aria-label="Sort roster"><option value="story">Best fit</option><option value="skill">Ring</option><option value="charisma">Mic</option><option value="pop">Pop</option><option value="name">Name</option></select></label><div class="cast-filters" role="group" aria-label="Filter roster">${[['all','All'],['Face','Faces'],['Heel','Heels'],['fresh','Fresh'],['champion','★']].map(([key,label])=>`<button type="button" data-cast-filter="${key}" class="${filter===key?'active':''}" aria-pressed="${filter===key}" ${key==='champion'?'aria-label="Champions"':''}>${label}</button>`).join('')}</div></div><div id="cast-spotlight" tabindex="0" aria-label="Wrestler spotlight. Use left and right arrows to browse."></div><div class="cast-deck-head"><span id="cast-roster-count"></span><button type="button" id="cast-browse-all" aria-expanded="${expanded}">${expanded?'Show card strip':'Browse all cards'} ↗</button></div><div id="cast-deck" class="cast-deck ${expanded?'expanded':''}" aria-label="Roster cards"></div>`}`;
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>toStep(b.dataset.step));document.querySelectorAll('[data-cast-slot]').forEach(b=>b.onclick=()=>toStep(b.dataset.castSlot));
  if($('#change-format'))$('#change-format').onclick=()=>{stash();step='format';drawDesk()};
  document.querySelectorAll('[data-team-load]').forEach(button=>button.onclick=()=>{const [ti,si]=button.dataset.teamLoad.split(':').map(Number),team=state.teams[ti],others=draft.sides.filter((_,index)=>index!==si).flat();if([team.a,team.b].some(id=>others.includes(id))){fail('A team member is already on an opposing side. Change that slot first.');return}draft.sides[si][0]=team.a;draft.sides[si][1]=team.b;resizeBooking(draft,draft.format);step=slots().find(slot=>!draft.sides[si].includes(slot.id))?.key||'finish';focusId=slotId(step);drawDesk();announce(team.name+' loaded. Review the other team.')});
  if(step==='finish'){collapseHand();drawReview();return}
  $('#cast-sort').value=sort;$('#cast-sort').onchange=e=>{sort=e.target.value;drawRoster()};
  if(draft.kind==='promo')$('#cast-search').placeholder=step==='p1'?'Find a recipient…':'Find a speaker…';
  $('#cast-search').oninput=e=>{query=e.target.value;drawRoster()};
  document.querySelectorAll('[data-cast-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.castFilter;document.querySelectorAll('[data-cast-filter]').forEach(el=>{const on=el.dataset.castFilter===filter;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});drawRoster()});
  $('#cast-surprise').onclick=()=>{const pool=available().filter(r=>r.id!==focusId);if(!pool.length){announce('No other available cards in this filter. Try All.');return}const fresh=pool.filter(r=>!otherBookings(r.id,editingIndex).length),choices=fresh.length?fresh:pool;focusId=choices[Math.floor(Math.random()*choices.length)].id;drawSpotlight();syncDeck();announce(`Wildcard: ${w(focusId).name}. Preview only—book them if you like the idea.`)};
  $('#cast-browse-all').onclick=()=>{expanded=!expanded;$('#cast-deck').classList.toggle('expanded',expanded);$('#cast-browse-all').textContent=expanded?'Show card strip ↗':'Browse all cards ↗';$('#cast-browse-all').setAttribute('aria-expanded',String(expanded))};
  drawRoster();
 }
 function drawRoster(){
  const list=filtered(),eligible=available();if(!eligible.some(r=>r.id===focusId))focusId=eligible[0]?.id??null;
  $('#cast-roster-count').textContent=`${list.length} CARDS · ${eligible.length} AVAILABLE`;
  $('#cast-deck').innerHTML=list.length?list.map(r=>{const other=reserved().has(r.id);return `<button type="button" data-cast-preview="${r.id}" class="cast-mini ${r.id===focusId?'focused':''}" aria-pressed="${r.id===focusId}" ${other?'disabled':''} aria-label="Preview ${esc(r.name)}${other?' — already assigned to another spot':''}"><span style="--character-color:${r.color}">${portrait(r)}</span><strong>${esc(rosterCardName(r))}</strong><span class="mini-overall">OVR ${overallRating(r)}</span><small>${!other&&opponentFit(draft,step,r,editingIndex).reasons[0]?esc(opponentFit(draft,step,r,editingIndex).reasons[0]):other?(draft.kind==='promo'?'ON THE MIC':'IN THIS MATCH'):otherBookings(r.id,editingIndex).length?'ALREADY BOOKED':r.role.toUpperCase()}</small></button>`}).join(''):'<p class="cast-no-results">No cards found. Try another name or filter.</p>';
  document.querySelectorAll('[data-cast-preview]').forEach(b=>b.onclick=()=>{focusId=Number(b.dataset.castPreview);drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight. Not booked yet.`)});drawSpotlight();
 }
 function syncDeck(){document.querySelectorAll('[data-cast-preview]').forEach(b=>{const current=Number(b.dataset.castPreview)===focusId;b.classList.toggle('focused',current);b.setAttribute('aria-pressed',String(current))});const el=document.querySelector(`[data-cast-preview="${focusId}"]`),deck=$('#cast-deck');if(el&&!expanded){const left=el.offsetLeft-deck.offsetLeft;deck.scrollLeft=left-deck.clientWidth/2+el.clientWidth/2}}
 function cycle(direction){const pool=available();if(!pool.length)return;const index=pool.findIndex(r=>r.id===focusId);focusId=pool[(index+direction+pool.length)%pool.length].id;drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight.`)}
 function syncFooter(){
  const footer=host.querySelector('.modal-actions'),save=footer.querySelector('[type="submit"]');
  footer.querySelector('#cast-book')?.remove();save.hidden=step!=='finish';save.textContent=draft.kind==='match'?'Save match':'Save promo';
  if(step!=='finish'&&step!=='format'){
   const button=document.createElement('button');button.type='button';button.id='cast-book';button.className='btn primary';button.disabled=focusId===null;
   button.textContent=(focusId==null?'Choose a wrestler':`Add ${w(focusId).name}`)+' →';button.onclick=commitFocus;footer.appendChild(button);
  }
 }
 function commitFocus(){
  if(step==='finish'||step==='format'||focusId===null||reserved().has(focusId))return;
  const r=w(focusId);setBookingParticipant(draft,Number(step.slice(1)),focusId);
  const chosen=r.name,corner=step;justBooked=corner;step=draft.kind==='promo'?'finish':slots().find(slot=>slot.id==null)?.key||'finish';query='';filter='all';expanded=false;
  if(step!=='finish')focusId=slotId(step);stash();drawDesk();announce(`${chosen} booked ${draft.kind==='promo'?(corner==='p1'?'as the recipient':'on the mic'):'into '+(slots().find(slot=>slot.key===corner)?.label||'the match')}. ${step==='finish'?(draft.kind==='promo'?'Review the pitch.':'Now call the finish.'):'Choose the next wrestler.'}`);
  (step==='finish'?$('#cast-review'):$('#cast-spotlight'))?.focus({preventScroll:true});
 }
 function drawSpotlight(){
  const host=$('#cast-spotlight');if(focusId===null){host.innerHTML='<div class="cast-no-results">Nobody available in this filter.<br>Try All or another search.</div>';$('#cast-surprise').disabled=true;syncFooter();return}
  const r=w(focusId),p=ringPersonalities[r.id],booked=otherBookings(r.id,editingIndex);
  host.innerHTML=`<div class="cast-feature" style="--character-color:${r.color}"><div class="cast-feature-art">${portrait(r)}${ratingBadge(r)}<span class="cast-swipe-hint" aria-hidden="true">↔ SWIPE</span>${r.champ?'<span class="cast-title-badge">★ WWA CHAMPION</span>':''}</div><div class="cast-feature-copy"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><h3>${esc(r.name)}</h3><p>${esc(p.style)}</p><div class="cast-feature-stats"><span>POP <b>${r.pop}</b></span><span>RING <b>${r.skill}</b></span><span>MIC <b>${r.charisma}</b></span></div></div><blockquote>“${esc(draft.kind==='promo'&&step==='p0'?ringVoices[r.id].open:p.boast)}”</blockquote><div class="cast-availability ${booked.length?'busy':''}">${esc(opponentFit(draft,step,r,editingIndex).reasons.slice(0,3).join(' · ')||suggestionReason(r,editingIndex))}</div></div><div class="cast-hand-controls"><button type="button" id="cast-prev" aria-label="Previous wrestler">←</button><span>Swipe the portrait or use the arrows</span><button type="button" id="cast-next" aria-label="Next wrestler">→</button></div>`;
  $('#cast-prev').onclick=()=>{cycle(-1);$('#cast-prev')?.focus({preventScroll:true})};$('#cast-next').onclick=()=>{cycle(1);$('#cast-next')?.focus({preventScroll:true})};
  syncFooter();
  $('#cast-surprise').disabled=available().filter(person=>person.id!==focusId).length===0;
  host.onkeydown=e=>{if(e.target!==host)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowLeft'?-1:1)}};
  let start=null;const art=host.querySelector('.cast-feature-art');art.onpointerdown=e=>{start={x:e.clientX,y:e.clientY}};art.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dy)<65)cycle(dx<0?1:-1)};art.onpointercancel=()=>{start=null};
 }
 function feedback(){const read=matchRead(draft,editingIndex);$('#finish-outcome').textContent=finishSummary(draft)+(qualifierGuidance(draft)?' · '+qualifierGuidance(draft):'');$('#cast-read').innerHTML=`<small>THE BOOKER’S READ</small><h3>${esc(read.title)}</h3><ul>${read.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`}
 function drawReview(){
  $('#cast-review').setAttribute('tabindex','-1');
  if(draft.kind==='promo'){drawPromoPitch();return}
  const expected=MATCH_FORMATS[matchFormat(draft)].sizes.reduce((a,b)=>a+b,0);
  if(matchPeople(draft).length<expected){$('#cast-review').innerHTML='<div class="empty"><h3>Fill every spot first.</h3><p>No mystery opponents. Choose each wrestler before calling the finish.</p><button type="button" class="btn" id="cast-fill-spots">Choose wrestlers →</button></div>';$('#cast-fill-spots').onclick=()=>toStep(slots().find(slot=>slot.id==null)?.key||'p0');return}
  $('#cast-review').innerHTML=`<div class="cast-review-title"><small>THAT’S A MATCH.</small><h3>Who goes over?</h3><p>Pick the winner. Make the finish mean something.</p></div><div class="cast-winner-cards">${matchSides(draft).map(side=>{const id=side[0],chosen=side.includes(draft.winner);return `<button type="button" class="cast-winner ${chosen?'chosen':''}" data-cast-winner="${id}" aria-pressed="${chosen}" aria-label="Book ${esc(sideLabel(side))} to win"><span class="cast-winner-art team-art">${side.map(member=>portrait(w(member))).join('')}<b>${chosen?'GOING OVER':'PICK TO WIN'}</b></span><strong>${esc(sideLabel(side))}</strong></button>`}).join('')}</div><div class="match-settings">${field('Match rules',`<select name="type" id="cast-type" required><option value="" disabled ${!draft.type?'selected':''}>Choose match rules…</option>${matchRuleOptions(draft)}</select>`)}${field('Finish',`<select name="finish" id="cast-finish" required><option value="" disabled ${!draft.finish?'selected':''}>Choose the finish…</option>${options(['Clean finish','Cheating','Interference'],draft.finish)}</select>`)}${field('Interfering wrestler',`<select name="interferer" id="cast-interferer"><option value="">Choose if interference…</option>${state.roster.filter(r=>!matchPeople(draft).includes(r.id)).map(r=>`<option value="${r.id}" ${r.id===draft.interferer?'selected':''}>${esc(r.name)}</option>`).join('')}</select>`)}${field('Why interfere?',`<select name="interferenceReason">${options(['Settle a grudge','Help an ally','Demand a title shot'],draft.interferenceReason||'Settle a grudge')}</select>`)}</div><label class="title-checkbox row"><input type="checkbox" id="cast-title" ${draft.title?'checked':''} ${teamFormat(draft)?'disabled':''}>${teamFormat(draft)?'The singles championship is not contested in team matches.':'Put the WWA championship on the line'}</label><p class="cast-props" id="cast-props"></p><details class="finish-extras" ${draft.prop||draft.presentation!=='Competitive'?'open':''}><summary>Presentation & prop · optional</summary>${field('Presentation',`<select name="presentation">${options(['Competitive','Dominant','Upset'],draft.presentation)}</select>`)}${field('Allocate a prop',`<select name="prop" id="cast-prop"><option value="">No extra prop</option>${propsFor(draft).map(([key,prop])=>`<option value="${key}" ${draft.prop===key?'selected':''}>${prop.name} · ${money(prop.cost)}</option>`).join('')}</select>`)}</details><div class="finish-outcome" id="finish-outcome" aria-live="polite"></div><div id="cast-read" class="cast-match-read" aria-live="polite"></div><button type="button" class="cast-recast" id="cast-recast">← Back to the roster</button>`;
  document.querySelectorAll('[data-cast-winner]').forEach(b=>b.onclick=()=>{readSettings();draft.winner=Number(b.dataset.castWinner);document.querySelectorAll('[data-cast-winner]').forEach(el=>{const chosen=matchSides(draft).find(side=>side.includes(draft.winner))?.includes(Number(el.dataset.castWinner));el.classList.toggle('chosen',chosen);el.setAttribute('aria-pressed',String(chosen));el.querySelector('b').textContent=chosen?'GOING OVER':'PICK TO WIN'});stash();feedback();announce(`${w(draft.winner).name} is going over.`)});
  const props=()=>{for(const key of ['interferer','interferenceReason']){const control=$('[name="'+key+'"]');if(control)control.closest('label').hidden=draft.finish!=='Interference'}if($('#cast-props'))$('#cast-props').textContent=ruleCost(draft)?'+$'+ruleCost(draft)+' for special match setup.'+(signatureFor(draft)?' Character showcase · standard pinfall/submission rules.':''):'No special match setup costs.'};
  for(const id of ['cast-type','cast-finish','cast-title','cast-interferer','cast-prop'])if($('#'+id))$('#'+id).onchange=()=>{readSettings();$('#cast-error').hidden=true;stash();feedback();props()};
  document.querySelector('[name="presentation"]').onchange=()=>{readSettings();stash();feedback()};$('#cast-recast').onclick=()=>toStep('p0');feedback();props();
 }
 function drawPromoPitch(){
  const host=$('#cast-review');
  const speaker=w(draft.a),target=w(draft.target);
  host.innerHTML=`
   <div class="promo-speaker-preview">
    ${avatar(speaker)}
    <div><small>On the microphone</small><h3>${esc(speaker.name)}</h3>
    <p>“${esc(draft.concept.trim()||ringVoices[speaker.id].open)}”</p></div>
   </div>
   <fieldset class="promo-intents">
    <legend>What’s the point?</legend>
    ${PROMO_INTENTS.map(intent=>`<button type="button" data-promo-intent="${intent.hook}" aria-pressed="${draft.hook===intent.hook}"><strong>${intent.label}</strong><span>${intent.hint}</span></button>`).join('')}
   </fieldset>
   <div class="promo-recipient">
    ${target?avatar(target):''}
    <div><strong>${target?esc(target.name):promoNeedsTarget(draft)?'Recipient required':'The audience'}</strong>
    <p class="note">${target?'Promo recipient':promoNeedsTarget(draft)?'This pitch needs another wrestler.':'A named recipient is optional.'}</p></div>
    <button type="button" class="btn" id="promo-recipient">${target?'Change recipient':'Choose recipient'}</button>
    ${target&&!promoNeedsTarget(draft)?'<button type="button" class="text-btn" id="promo-audience">Address the audience</button>':''}
   </div>
   <details class="finish-extras" id="promo-extras" ${promoExtrasOpen?'open':''}>
    <summary>Presentation, opening line & prop · optional</summary>
    ${field('Presentation',`<select name="scene" id="promo-scene">${options(['Solo address','Face-off','Interview','Interruption'],draft.scene)}</select>`)}
    ${field('Opening line',`<input name="concept" maxlength="180" value="${esc(draft.concept)}" placeholder="Use their own dialogue">`)}
    ${field('Prop',`<select name="prop"><option value="">No extra prop</option>${propsFor(draft).map(([key,prop])=>`<option value="${key}" ${draft.prop===key?'selected':''}>${esc(prop.name)} · ${money(prop.cost)}</option>`).join('')}</select>`)}
   </details>`;
  const redraw=(selector)=>{
   promoExtrasOpen=$('#promo-extras').open;
   readSettings();
   setPromoSpeaker(draft,draft.a);
   state.drafts[editingIndex]=structuredClone(draft);
   save();
   drawPromoPitch();
   $(selector)?.focus({preventScroll:true});
  };
  host.querySelectorAll('[data-promo-intent]').forEach(button=>button.onclick=()=>{
   draft.hook=button.dataset.promoIntent;
   if(!promoNeedsTarget(draft))draft.target=null;
   redraw(`[data-promo-intent="${draft.hook}"]`);
  });
  $('#promo-scene').onchange=()=>redraw('#promo-scene');
  $('#promo-recipient').onclick=()=>toStep('p1');
  if($('#promo-audience'))$('#promo-audience').onclick=()=>{draft.target=null;redraw('#promo-recipient')};
 }
 $('#cast-kind').onchange=event=>{
  Object.keys(draft).forEach(key=>delete draft[key]);
  Object.assign(draft,blankBooking(event.target.value));
  if(draft.kind==='promo')draft.hook='Win the crowd';
  step=bookingResumeStep(draft);
  sort='story';
  focusId=null;query='';filter='all';expanded=false;justBooked=null;promoExtrasOpen=false;
  $('#poster-editor-heading').textContent=draft.kind==='promo'?'Book a promo':'Book segment';
  $('#casting-desk').replaceChildren();
  stash();
  drawDesk();
  announce('Choose who appears in this segment.');
 };
 drawDesk();
 host.scrollIntoView({block:'nearest'});
 if(entry?.field==='scene'&&$('#promo-extras'))$('#promo-extras').open=true;
 if(entry?.field==='hook'&&draft.kind==='promo')$('[data-promo-intent][aria-pressed="true"]')?.focus();
 if(entry?.field)document.querySelector(`[name="${entry.field}"]`)?.focus();
}

// Story beats and presentation determine whether the pitch needs a recipient.
const PROMO_INTENTS=[
 {hook:'Win the crowd',label:'Rally the room',hint:'Speak to the audience in their own voice.'},
 {hook:'Issue a challenge',label:'Call someone out',hint:'Name the wrestler they want to face.'},
 {hook:'Fuel a rivalry',label:'Make it personal',hint:'Give an existing conflict another spark.'},
 {hook:'Debut a gimmick',label:'Show the character',hint:'Give the gimmick a moment in the spotlight.'}
];
function promoNeedsTarget(draft){return ['Issue a challenge','Fuel a rivalry'].includes(draft.hook)||draft.scene!=='Solo address'}
function setPromoSpeaker(draft,id){draft.a=id;if(draft.target===id)draft.target=null;if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop=''}

function setBookingParticipant(draft, position, id){
 if(draft.kind==='promo'){
  if(position===1)draft.target=id;
  setPromoSpeaker(draft,position===0?id:draft.a);
  return;
 }
 for(const side of draft.sides){
  if(position<side.length){
   if(side[position]!==id&&draft.winner===side[position])draft.winner=null;
   side[position]=id;
   break;
  }
  position-=side.length;
 }
 draft.a=draft.sides[0][0];
 draft.b=draft.sides[1][0];
}

function publicPosterBooking(index){
 const segment=state.card[index];
 const promo=segment.kind==='promo';
 const sides=promo?[[segment.a]]:matchSides(segment);
 const billing=promo?'Live on the mic':(segment.title?'WWA Championship · ':'')+matchLabel(segment);
 return `<article class="poster-bout ${index===3?'poster-headliner':''}">
 <strong class="poster-bout-label">${index===3?'Main event · ':''}${esc(billing)}</strong>
 <div class="poster-sides ${sides.length>2?'poster-free-for-all':''}">${sides.map(side=>`<div class="poster-side">${side.map(id=>{
  const wrestler=w(id);
  return `<div class="public-poster-wrestler">${portrait(wrestler)}<strong>${esc(wrestler.name)}</strong></div>`;
 }).join('')}</div>`).join(sides.length===2?'<b class="poster-versus" aria-hidden="true">VS</b>':'')}</div></article>`;
}

function posterBooking(index){
 const draft=state.drafts[index]||state.card[index];
 const promo=draft.kind==='promo';
 const sides=promo?[[draft.a,...(draft.target!=null||promoNeedsTarget({...draft,scene:draft.scene||'Solo address'})?[draft.target]:[])]]:draft.kind==='match'?matchSides(draft):[[null],[null]];
 let position=0;
 const title=['Opener','Undercard','Featured attraction','Main event'][index];
 const pending=!!state.drafts[index];
 const problems=draft.kind?bookingProblems(draft):[];
 const note=!draft.kind?'Choose a format or start with a singles matchup.':pending?problems[0]||'Review and confirm this booking.':promo?draft.hook:finishSummary(draft);
 const participantLabel=(position)=>promo?(position===0?'Speaker':'Recipient'):sides.some(side=>side.length>1)?'Team spot '+(position+1):'Wrestler '+(position+1);
 return `<article class="poster-bout ${index===3?'poster-headliner':''}" data-poster-bout="${index}" tabindex="-1">
 <header class="poster-bout-label"><span>${index+1} · ${title}</span><small class="poster-stamp">${pending?'Draft':draft.kind?'Booked':'Open'}</small></header>
 <label class="poster-format"><span class="sr-only">${title} format</span><select data-poster-format="${index}">
 <option value="" disabled ${!draft.kind?'selected':''}>Choose format</option>
 ${Object.entries(MATCH_FORMATS).map(([id,format])=>`<option value="${id}" ${draft.kind==='match'&&matchFormat(draft)===id?'selected':''}>${esc(format.label)}</option>`).join('')}
 <option value="promo" ${promo?'selected':''}>Promo</option>
 </select></label>
 ${draft.title?'<span class="poster-title-stakes">★ WWA Championship</span>':''}
 <div class="poster-sides ${sides.length>2?'poster-free-for-all':''}">${sides.map(side=>`<div class="poster-side">${side.map(id=>{
  const wrestler=w(id),label=participantLabel(position);
  return `<button type="button" data-poster-slot="${index}:${position++}" aria-pressed="false" aria-label="${title}, ${label}${wrestler?': change '+esc(wrestler.name):': add wrestler'}">
  ${wrestler?portrait(wrestler):'<span class="poster-paste-mark" aria-hidden="true">+</span>'}<strong>${wrestler?esc(wrestler.name):label}</strong></button>`;
 }).join('')}</div>`).join(sides.length===2?'<b class="poster-versus" aria-hidden="true">VS</b>':'')}</div>
 <p class="poster-booker-note">${esc(note)}</p>
 ${state.promises.filter(p=>p.status==='open'&&promiseMet(p,[draft])).map(p=>`<p class="poster-booker-note"><strong>${pending?'Would keep your word':'On the bill'}</strong> · ${esc(promiseLabel(p))}</p>`).join('')}
 ${draft.kind==='match'?qualifierGuidance(draft)?`<p class="poster-booker-note">${esc(qualifierGuidance(draft))}</p>`:'':''}
 <div class="poster-bout-actions">
 ${draft.kind?`<button type="button" class="btn poster-edit" data-edit="${index}">${pending?(promo?'Finish promo':'Finish booking'):(promo?'Edit promo':'Edit finish')}</button>`:''}
 <details class="poster-bout-tools">
 <summary>Card order &amp; edits</summary>
 <div class="poster-controls">
 <button type="button" class="btn" data-move="${index}:-1" ${index===0?'disabled':''}>Earlier</button>
 <button type="button" class="btn" data-move="${index}:1" ${index===3?'disabled':''}>Later</button>
 ${state.card[index].kind?`<button type="button" class="btn" data-clear="${index}">Clear booking</button>`:''}
 ${pending?`<button type="button" class="btn" data-discard-draft="${index}">Discard draft</button>`:''}
 </div></details></div>
 <section class="poster-editor" data-poster-editor="${index}" hidden></section></article>`;
}

function posterHand(){
 return `<section class="poster-hand" aria-label="Wrestler hand">
 <button type="button" class="btn poster-hand-toggle" aria-expanded="true" aria-controls="poster-hand-content">Hide wrestler hand</button><div id="poster-hand-content"><div class="poster-hand-head"><input id="poster-hand-search" type="search" aria-label="Search wrestler hand" placeholder="Search wrestlers…" autocomplete="off"><select id="poster-hand-filter" aria-label="Filter or sort wrestlers"><option value="all">All</option><option value="Face">Faces</option><option value="Heel">Heels</option><option value="pop">Popularity</option></select><button type="button" id="poster-hand-wildcard">Wildcard</button></div><p id="poster-hand-status" role="status">Choose a card or a spot on the bill to cast a wrestler.</p>
 <div class="poster-hand-cards">${state.roster.map(r=>bookingCard(r)).join('')}</div><p class="poster-hand-empty" hidden>No wrestlers found.</p></div>
 </section>`;
}

function bindPosterBooking(){
 const hand=$('.poster-hand'),poster=$('.show-collage');
 if(!hand||!poster)return;
 let selected=null,activeSlot=null;
 const toggle=hand.querySelector('.poster-hand-toggle');
 toggle.onclick=()=>{
  const content=$('#poster-hand-content');
  content.hidden=!content.hidden;
  toggle.setAttribute('aria-expanded',String(!content.hidden));
  toggle.textContent=content.hidden?'Show wrestler hand':'Hide wrestler hand';
 };
 const cards=[...hand.querySelectorAll('[data-pick]')];
 const status=$('#poster-hand-status');
 for(const tools of poster.querySelectorAll('.poster-bout-tools')){
  tools.ontoggle=()=>{
   if(tools.open)for(const other of poster.querySelectorAll('.poster-bout-tools')){
    if(other!==tools)other.open=false;
   }
  };
 }
 for(const control of poster.querySelectorAll('[data-poster-format]')){
  control.onchange=()=>{
   const index=Number(control.dataset.posterFormat);
   const original=state.drafts[index]||state.card[index];
   const kind=control.value==='promo'?'promo':'match';
   const draft=original.kind===kind?structuredClone(original):blankBooking(kind);
   if(original.kind!==kind&&original.a!=null){
    if(kind==='promo')setPromoSpeaker(draft,original.a);
    else draft.sides[0][0]=original.a;
   }
   if(kind==='promo')draft.hook||='Win the crowd';
   if(kind==='match'){
    const previous=matchSides(draft);
    const people=previous.flat().filter(id=>id!=null);
    const sizes=MATCH_FORMATS[control.value].sizes;
    const sides=sizes.map(()=>[]);
    for(let i=0;i<Math.min(sizes.length,previous.length);i++){
     sides[i]=previous[i].filter(id=>id!=null).slice(0,sizes[i]);
    }
    const spare=people.filter(id=>!sides.flat().includes(id));
    draft.sides=sides.map((side,i)=>Array.from({length:sizes[i]},(_,slot)=>side[slot]??spare.shift()??null));
    draft.format=control.value;
    draft.a=draft.sides[0][0];
    draft.b=draft.sides[1][0];
    if(!matchPeople(draft).includes(draft.winner))draft.winner=null;
    if(teamFormat(draft))draft.title=false;
    if(!rulesFor(draft).includes(draft.type))draft.type=rulesFor(draft)[0];
    if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop='';
   }
   state.drafts[index]=draft;
   render();
   const next=document.querySelector(`[data-poster-format="${index}"]`);
   next.focus({preventScroll:true});
  };
 }

 const search=hand.querySelector('#poster-hand-search');
 const filter=hand.querySelector('#poster-hand-filter');
 const wildcard=hand.querySelector('#poster-hand-wildcard');
 const tray=hand.querySelector('.poster-hand-cards');
 function filterHand(){
  const query=search.value.trim().toLowerCase();
  for(const card of cards){
   const wrestler=w(card.dataset.pick);
   const matchesRole=!['Face','Heel'].includes(filter.value)||wrestler.role===filter.value;
   card.hidden=!matchesRole||!(wrestler.name+' '+wrestler.gimmick+' '+wrestler.role).toLowerCase().includes(query);
  }
  const ordered=filter.value==='pop'?[...cards].sort((a,b)=>w(b.dataset.pick).pop-w(a.dataset.pick).pop):cards;
  tray.append(...ordered);
  wildcard.disabled=cards.every(card=>card.hidden);
  hand.querySelector('.poster-hand-empty').hidden=!wildcard.disabled;
 }
 search.oninput=filter.onchange=()=>{
  filterHand();
  hand.querySelector('.poster-hand-cards').scrollLeft=0;
 };
 wildcard.onclick=()=>{
  const visible=cards.filter(card=>!card.hidden);
  if(!visible.length)return;
  const card=visible[Math.floor(Math.random()*visible.length)];
  selected=null;
  card.click();
  if(card.isConnected)card.scrollIntoView({block:'nearest',inline:'nearest'});
 };
 function place(target,id){
  const key=target.dataset.posterSlot;
  const [index,position]=key.split(':').map(Number);
  const original=state.drafts[index]||state.card[index];
  const draft=original.kind?structuredClone(original):blankBooking('match');
  if(draft.kind==='promo'){
   if(position===1&&draft.a===id){status.textContent='Choose someone other than the speaker.';return}
   draft.hook||='Win the crowd';
  }
  if(draft.kind==='match'){
   if(!draft.format)draft.format='singles';
   draft.sides=matchSides(draft);
   if(draft.sides.flat().some((current,i)=>current===id&&i!==position)){
    status.textContent='That wrestler is already in this match.';
    return;
   }
  }
  setBookingParticipant(draft,position,id);
  if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop='';
  state.drafts[index]=draft;
  const handOffset=tray.scrollLeft;
  const query=search.value;
  const filterValue=filter.value;
  render();
  const nextHand=$('.poster-hand-cards');
  if(!nextHand)return;
  const nextSearch=$('#poster-hand-search');
  nextSearch.value=query;
  $('#poster-hand-filter').value=filterValue;
  nextSearch.oninput();
  nextHand.scrollLeft=handOffset;
  $('#poster-hand-status').textContent=w(id).name+' added. '+(bookingProblems(draft)[0]||'Review and confirm this booking.');
  const nextSlot=document.querySelector(`[data-poster-slot="${key}"]`);
  nextSlot?.focus({preventScroll:true});
 }
 for(const card of cards){
  const id=Number(card.dataset.pick);
  const name=card.querySelector('.pick-info > strong');
  name.style.setProperty('--hand-name-size',w(id).name.length>46?'11px':w(id).name.length>27?'13px':'16px');

  card.onclick=()=>{
   if(activeSlot){place(activeSlot,id);return}
   selected=selected===id?null:id;
   for(const item of cards)item.setAttribute('aria-pressed',String(Number(item.dataset.pick)===selected));
   status.textContent=selected===null?'Drag a card up, or tap a card then a spot.':w(id).name+' selected. Tap a billing spot.';
  };
  let gesture=null;
  card.onpointerdown=event=>{
   if(!event.isPrimary||event.button!==0)return;
   if(event.pointerType!=='touch')card.setPointerCapture(event.pointerId);
   gesture={pointer:event.pointerId,x:event.clientX,y:event.clientY,ghost:null};
  };
  card.onpointermove=event=>{
   if(gesture?.pointer!==event.pointerId)return;
   if(!gesture.ghost){
    const dx=Math.abs(event.clientX-gesture.x),dy=Math.abs(event.clientY-gesture.y);
    if(Math.hypot(dx,dy)<8||(event.pointerType==='touch'&&dy<=dx))return;
    card.setPointerCapture(event.pointerId);
    gesture.ghost=card.cloneNode(true);
    gesture.ghost.classList.add('poster-drag-ghost');
    gesture.ghost.setAttribute('aria-hidden','true');
    gesture.ghost.tabIndex=-1;
    document.body.append(gesture.ghost);
    poster.classList.add('casting-active');
   }
   gesture.ghost.style.left=event.clientX+'px';
   gesture.ghost.style.top=event.clientY+'px';
  };
  function finishGesture(event){
   if(gesture?.pointer!==event.pointerId)return;
   const ghost=gesture.ghost;
   gesture=null;
   if(!ghost)return;
   ghost.remove();
   poster.classList.remove('casting-active');
   if(event.type!=='pointerup')return;
   const suppressClick=click=>click.stopImmediatePropagation();
   card.addEventListener('click',suppressClick,{capture:true,once:true});
   setTimeout(()=>card.removeEventListener('click',suppressClick,true),0);
   const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-poster-slot]');
   if(target&&poster.contains(target))place(target,id);
   else status.textContent='Drop the card on a billing spot.';
  }
  card.onpointerup=finishGesture;
  card.onpointercancel=finishGesture;
  card.onlostpointercapture=finishGesture;

 }
 for(const target of poster.querySelectorAll('[data-poster-slot]')){
  target.onclick=()=>{
   if(selected!==null){place(target,selected);return}
   const next=activeSlot===target?null:target;
   activeSlot?.setAttribute('aria-pressed','false');
   activeSlot=next;
   if(!next){
    status.textContent='Choose a card or a spot on the bill to cast a wrestler.';
    return;
   }
   target.setAttribute('aria-pressed','true');
   if(toggle.getAttribute('aria-expanded')==='false')toggle.click();
   status.textContent='Choose a wrestler for this spot.';
   const first=cards.find(card=>!card.hidden);
   (first||search).focus({preventScroll:true});
  };
 }
}
