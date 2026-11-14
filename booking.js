function playedWrestlerIds(exceptIndex=-1){
 const ids=new Set();
 state.card.forEach((segment,index)=>{
  if(index===exceptIndex)return;
  // Keep the confirmed cast reserved while its replacement can still be discarded.
  for(const id of matchPeople(segment))ids.add(id);
  for(const id of matchPeople(state.drafts[index]||{}))ids.add(id);
 });
 return ids;
}
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
function returnToBooking(index,message,previouslyReserved){
 const reservedNow=previouslyReserved?playedWrestlerIds():null;
 const available=previouslyReserved&&[...previouslyReserved].some(id=>!reservedNow.has(id));
 render();
 focusBookingSegment(index);
 toast(message+(available?' Released wrestlers are free for other segments.':''));
}
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
  host.innerHTML='<div class="poster-controls"><button type="button" class="btn" data-kind="match">Book a match</button><button type="button" class="btn" data-kind="promo">Book a promo</button><button type="button" class="btn" data-close-booking>Back to the card</button></div>';
  for(const button of host.querySelectorAll('[data-kind]'))button.onclick=()=>openBookingDesk(editingIndex,button.dataset.kind);
  host.querySelector('[data-close-booking]').onclick=()=>{host.hidden=true;focusBookingSegment(editingIndex)};
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
  openMatchSheet(host,editingIndex,draft,entry);
  return;
 }
 let promoExtrasOpen=!!(draft.concept||draft.prop||draft.scene!=='Solo address');
 let step=bookingResumeStep(draft),focusId=draft.a,query='',filter='all',sort='story',expanded=false,justBooked=null;
 if(entry)step=entry.step||step;
 if(draft.kind==='promo'&&draft.a==null)step='p0';
 // The desk now handles promos only; matches use openMatchSheet.
 const slots=()=>[{key:'p0',id:draft.a,label:'Speaker'},{key:'p1',id:draft.target,label:'Recipient'}];
 const slotId=key=>slots().find(slot=>slot.key===key)?.id;
 if(step!=='finish'&&!slots().some(slot=>slot.key===step))step='p0';
 if(entry&&step!=='finish')focusId=slotId(step);

 const readSettings=()=>{const form=host.querySelector('form');if(!form)return;const f=new FormData(form);for(const key of ['type','finish','hook','concept','scene','presentation','prop','interferenceReason'])if(f.has(key))draft[key]=f.get(key);if($('#cast-title'))draft.title=$('#cast-title').checked;for(const key of ['target','interferer'])if(f.has(key))draft[key]=f.get(key)===''?null:Number(f.get(key));};
 const fail=message=>{const el=$('#cast-error');el.textContent=message;el.hidden=false;el.scrollIntoView({block:'nearest'});el.focus();};
 host.innerHTML=`<form><header class="press-heading"><h3 id="poster-editor-heading">${draft.kind==='promo'?'Book a promo':'Book match'}</h3><p id="press-editor-subtitle">${esc(showName())} · ${draft.kind==='promo'?'Promo details':'Match details'}</p></header><div class="cast-toolbar"><label for="cast-kind">Segment ${editingIndex+1}</label><select id="cast-kind" name="kind"><option value="match" ${draft.kind==='match'?'selected':''}>Match</option><option value="promo" ${draft.kind==='promo'?'selected':''}>Promo</option></select><span id="cast-live-status" role="status" aria-live="polite">${draft.kind==='promo'?'Choose who gets the mic.':'Choose the wrestlers for this segment.'}</span></div><p id="cast-error" class="cast-error" role="alert" tabindex="-1" hidden></p><div id="casting-desk"></div><div class="modal-actions"><button type="button" class="btn cancel">Done for now</button><button type="submit" class="btn primary">Confirm booking</button></div></form>`;
 const form=host.querySelector('form');
 form.onsubmit=event=>{
  event.preventDefault();
  readSettings();
  if(step!=='finish'){commitFocus();return}
  const problems=bookingProblems(draft);if(draft.prop&&state.card.some((s,i)=>i!==editingIndex&&s.prop===draft.prop))problems.push('That prop is already allocated to another segment.');if(problems.length)return fail(problems[0]);
  const previouslyReserved=playedWrestlerIds();
  state.card[editingIndex]=structuredClone({...draft,concept:draft.concept.trim(),draft:false});delete state.drafts[editingIndex];
  returnToBooking(editingIndex,draft.kind==='promo'?'Promo booked.':'Match booked.',previouslyReserved);
 };
 const saveDraft=()=>{
  state.drafts[editingIndex]=structuredClone(draft);
  save();
 };
 const stash=()=>{readSettings();saveDraft()};
 host.querySelector('.cancel').onclick=()=>{stash();returnToBooking(editingIndex,'Draft saved.')};
 form.addEventListener('input',stash);
 form.addEventListener('change',stash);

 const reserved=()=>draft.kind==='promo'?new Set(step==='p1'?[draft.a]:[]):new Set(slots().filter(slot=>slot.key!==step).map(slot=>slot.id));
 const playedElsewhere=playedWrestlerIds(editingIndex);
 const filtered=()=>state.roster.filter(r=>!dilemmaUnavailable(r.id)&&(!playedElsewhere.has(r.id)||r.id===slotId(step))&&(filter==='all'||(filter==='fresh'?otherBookings(r.id,editingIndex).length===0:filter==='champion'?r.champ:r.role===filter))&&(r.name+' '+r.gimmick+' '+ringPersonalities[r.id].style).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='story'?opponentFit(draft,step,b,editingIndex).score-opponentFit(draft,step,a,editingIndex).score||Number(/Promised|challenge|Sweeps/.test(suggestionReason(b,editingIndex)))-Number(/Promised|challenge|Sweeps/.test(suggestionReason(a,editingIndex)))||b.momentum-a.momentum:sort==='name'?a.name.localeCompare(b.name):b[sort]-a[sort]);
 const available=()=>filtered().filter(r=>!reserved().has(r.id));
 function announce(text){$('#cast-live-status').textContent=text;$('#cast-error').hidden=true}
 function toStep(next){if($('#promo-extras'))promoExtrasOpen=$('#promo-extras').open;stash();step=next;query='';filter='all';expanded=false;justBooked=null;if(step!=='finish')focusId=slotId(step);drawDesk();($('#cast-spotlight')||$('#cast-review')||$('.format-grid button'))?.focus({preventScroll:true});}
 function slot(id,key,label){const r=w(id);if(!r)return `<button type="button" class="cast-slot empty-cast-slot ${step===key?'active':''}" data-cast-slot="${key}" aria-label="Choose ${label}"><span class="empty-cast-icon">+</span><span><small>${label}</small><strong>Choose wrestler</strong></span></button>`;return `<button type="button" class="cast-slot ${step===key?'active':''} ${justBooked===key?'fresh-drop':''}" data-cast-slot="${key}" aria-pressed="${step===key}" aria-label="Change ${label}: ${esc(r.name)}"><span class="cast-slot-art" style="--character-color:${r.color}">${portrait(r)}</span><span><small>${label}</small><strong>${esc(r.name)}</strong></span>${justBooked===key?'<b class="cast-booked">BOOKED</b>':''}</button>`}
 function drawDesk(){
  host.dataset.bookingStep=step;
  syncFooter();
  $('#casting-desk').innerHTML=`<nav class="cast-stage-nav" aria-label="Booking stages"><button type="button" data-step="p0" ${step==='p0'?'aria-current="step"':''}>1 Speaker</button><button type="button" data-step="finish" ${step!=='p0'?'aria-current="step"':''} ${draft.a==null?'disabled':''}>2 Pitch</button></nav><div class="cast-progress">Segment ${editingIndex+1} · ${step==='finish'?'Shape the promo':step==='p1'?'Choose a recipient':'Choose who gets the mic'}</div>${step==='finish'?'<div id="cast-review"></div>':`<div class="cast-browse-head"><div><h3>${draft.kind==='promo'?'Who’s got something to say?':step==='p0'?'Who opens the fight?':'Who gets the next spot?'}</h3><p>${draft.kind==='promo'?'Find a voice. Give them a moment.':'Browse a card, then send them into the ring.'}</p></div></div><div class="cast-search"><button type="button" id="cast-surprise" aria-label="Suggest a wildcard wrestler">✦ Wildcard</button><input type="search" id="cast-search" aria-label="Search wrestlers" placeholder="Name, gimmick, or ring style…" value="${esc(query)}"><label class="cast-sort">Sort<select id="cast-sort" aria-label="Sort roster"><option value="story">Best fit</option><option value="skill">Ring</option><option value="charisma">Mic</option><option value="pop">Pop</option><option value="name">Name</option></select></label><div class="cast-filters" role="group" aria-label="Filter roster">${[['all','All'],['Face','Faces'],['Heel','Heels'],['fresh','Fresh'],['champion','★']].map(([key,label])=>`<button type="button" data-cast-filter="${key}" class="${filter===key?'active':''}" aria-pressed="${filter===key}" ${key==='champion'?'aria-label="Champions"':''}>${label}</button>`).join('')}</div></div><div id="cast-spotlight" tabindex="0" aria-label="Wrestler spotlight. Use left and right arrows to browse."></div><div class="cast-deck-head"><span id="cast-roster-count"></span><button type="button" id="cast-browse-all" aria-expanded="${expanded}">${expanded?'Show card strip':'Browse all cards'} ↗</button></div><div id="cast-deck" class="cast-deck ${expanded?'expanded':''}" aria-label="Roster cards"></div>`}`;
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>toStep(b.dataset.step));document.querySelectorAll('[data-cast-slot]').forEach(b=>b.onclick=()=>toStep(b.dataset.castSlot));
  if(step==='finish'){drawReview();return}
  $('#cast-sort').value=sort;$('#cast-sort').onchange=e=>{sort=e.target.value;drawRoster()};
  if(draft.kind==='promo')$('#cast-search').placeholder=step==='p1'?'Find a recipient…':'Find a speaker…';
  $('#cast-search').oninput=e=>{query=e.target.value;drawRoster()};
  document.querySelectorAll('[data-cast-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.castFilter;document.querySelectorAll('[data-cast-filter]').forEach(el=>{const on=el.dataset.castFilter===filter;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});drawRoster()});
  $('#cast-surprise').onclick=()=>{const pool=available().filter(r=>r.id!==focusId);if(!pool.length){announce('No other available cards in this filter. Try All.');return}const fresh=pool.filter(r=>!otherBookings(r.id,editingIndex).length),choices=fresh.length?fresh:pool;focusId=choices[Math.floor(Math.random()*choices.length)].id;drawSpotlight();syncDeck();announce(`Wildcard: ${w(focusId).name}. Preview only—book them if you like the idea.`)};
  const browseAll=$('#cast-browse-all');
  bindRosterSwipe(browseAll,up=>{if(up!==expanded)browseAll.click()});
  browseAll.onclick=()=>{expanded=!expanded;$('#cast-deck').classList.toggle('expanded',expanded);$('#cast-browse-all').textContent=expanded?'Show card strip ↗':'Browse all cards ↗';$('#cast-browse-all').setAttribute('aria-expanded',String(expanded))};
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
  footer.querySelector('#cast-book')?.remove();save.hidden=step!=='finish';save.textContent=draft.kind==='match'?'Confirm match ✓':'Confirm promo ✓';
  if(step!=='finish'&&step!=='format'){
   const button=document.createElement('button');button.type='button';button.id='cast-book';button.className='btn primary';button.disabled=focusId===null;
   button.textContent=(focusId==null?'Choose a wrestler':`Add ${w(focusId).name}`)+' →';button.onclick=commitFocus;footer.appendChild(button);
  }
 }
 function commitFocus(){
  if(step==='finish'||step==='format'||focusId===null||reserved().has(focusId)||(playedElsewhere.has(focusId)&&focusId!==slotId(step)))return;
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
 function drawReview(){
  $('#cast-review').setAttribute('tabindex','-1');
  drawPromoPitch();
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
    ${field('Presentation',`<select name="scene" id="promo-scene">${options(dilemmaPromoScenes(draft),draft.scene)}</select>`)}
    ${field('Opening line',`<input name="concept" maxlength="180" value="${esc(draft.concept)}" placeholder="Use their own dialogue">`)}
    ${field('Prop',`<select name="prop"><option value="">No extra prop</option>${propsFor(draft).map(([key,prop])=>`<option value="${key}" ${draft.prop===key?'selected':''}>${esc(prop.name)} · ${money(niceMoney(prop.cost*costScale()))}</option>`).join('')}</select>`)}
   </details>`;
  const redraw=(selector)=>{
   promoExtrasOpen=$('#promo-extras').open;
   readSettings();
   setPromoSpeaker(draft,draft.a);
   saveDraft();
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
  if(event.target.value==='match'){openBookingDesk(editingIndex,'match');return}
 };
 drawDesk();
 host.scrollTop=0;
 host.scrollIntoView({block:'nearest'});
 if(!entry?.field){const title=$('#poster-editor-heading');title.tabIndex=-1;title.focus({preventScroll:true})}
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
function promoNeedsTarget(draft){return ![RON_RALLY,RON_TOWN_HALL].includes(draft.scene)&&(['Issue a challenge','Fuel a rivalry'].includes(draft.hook)||draft.scene!=='Solo address')}
function setPromoSpeaker(draft,id){draft.a=id;if(id!==31&&[RON_RALLY,RON_TOWN_HALL].includes(draft.scene))draft.scene='Solo address';if(draft.target===id||[RON_RALLY,RON_TOWN_HALL].includes(draft.scene))draft.target=null;if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop=''}

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
 return `<article class="poster-bout ${index===state.card.length-1?'poster-headliner':''}">
 <strong class="poster-bout-label">${index===state.card.length-1?'Main event · ':''}${esc(billing)}</strong>
 <div class="poster-sides ${sides.length>2?'poster-free-for-all':''}">${sides.map(side=>`<div class="poster-side">${side.map(id=>{
  const wrestler=w(id);
  return `<div class="public-poster-wrestler">${portrait(wrestler)}<strong>${esc(wrestler.name)}</strong></div>`;
 }).join('')}</div>`).join(sides.length===2?'<b class="poster-versus" aria-hidden="true">VS</b>':'')}</div></article>`;
}

// Each segment is a strip of plates. Tap a plate to open the pick sheet on that space.
function posterBooking(index){
 const pending=!!state.drafts[index],source=state.drafts[index]||state.card[index];
 const draft=source.kind?pickNormalize(structuredClone(source)):null;
 const promo=draft?.kind==='promo';
 const billing=slotLabel(index);
 const sheetHere=pickSheet?.index===index;
 const status=pending?'Draft':draft?'Booked':'Book it';
 const spaces=pickSpaces(draft);
 const sides=[];for(const space of spaces)(sides[space.si]??=[]).push(space);
 const team=!promo&&sides.some(side=>side.length>1);
 const note=!draft?'Tap a space to book it.':pending?bookingProblems(draft)[0]||'Ready.':promo?draft.hook:finishSummary(draft);
 const spots=sides.map(side=>`<div class="poster-side">${side.map(space=>{
  const wrestler=w(space.id),label=pickSpaceLabel(draft,space),target=sheetHere&&pickSheet.pos===space.pos&&pickSheet.mode==='pick';
  const won=draft?.kind==='match'&&draft.winner!=null&&matchSides(draft)[space.si]?.includes(draft.winner);
  return `<button type="button" class="pick-plate ${wrestler?'':'empty'} ${space.optional&&!wrestler?'optional':''} ${target?'pick-target':''} ${won?'pick-winner':''}" data-poster-slot="${index}:${space.pos}" aria-pressed="${target}" aria-label="${billing}, ${label}${wrestler?': '+esc(wrestler.name)+'. Tap to replace, hold to drag':': add wrestler'}">
  ${wrestler?portrait(wrestler):'<span class="poster-paste-mark" aria-hidden="true">+</span>'}<strong>${wrestler?esc(team?pickShortName(wrestler):rosterCardName(wrestler)):label}</strong></button>`;
 }).join('')}</div>`);
 const label=`<button class="press-bout-label" type="button" data-pick-label="${index}" aria-label="${billing}: ${draft?'edit':'book it'}${pending?', draft':''}. Hold to move the segment."><strong>${billing}</strong>${draft?.title?'<small>World title</small>':promo?'<small>Promo</small>':''}${sides.length===2&&!promo?'<b aria-hidden="true">VS</b>':''}${sheetHere?'':`<span class="press-bout-stamp">${status}</span>`}</button>`;
 return `<article class="poster-bout ${index===state.card.length-1?'poster-headliner':''} ${sheetHere?'pick-active':''}" data-poster-bout="${index}" data-bout-status="${pending?'draft':draft?'booked':'open'}" tabindex="-1">
 <div class="press-bout-line ${sides.length!==2||team?'press-bout-many':''} ${team?'pick-teams':''}">
 ${sides.length===2&&!team?spots.join(label):label+spots.join('')}
 </div>
 ${pickSegmentFoot(index,draft)}
 <details class="poster-bout-tools">
 <summary aria-label="${billing} card options"><span class="press-menu-bars" aria-hidden="true"></span></summary>
 <div class="press-bout-options">
 <p class="poster-booker-note">${esc(note)}</p>
 ${state.promises.filter(p=>p.status==='open'&&draft&&promiseMet(p,[draft])).map(p=>`<p class="poster-booker-note"><strong>${pending?'Would keep your word':'On the bill'}</strong> · ${esc(promiseLabel(p))}</p>`).join('')}
 ${draft?.kind==='match'&&qualifierGuidance(draft)?`<p class="poster-booker-note">${esc(qualifierGuidance(draft))}</p>`:''}
 <div class="poster-controls">
 <button type="button" class="btn" data-move="${index}:-1" ${index===0?'disabled':''}>Earlier</button>
 <button type="button" class="btn" data-move="${index}:1" ${index===state.card.length-1?'disabled':''}>Later</button>
 ${state.card[index].kind?`<button type="button" class="btn" data-clear="${index}">Clear booking</button>`:''}
 ${pending?`<button type="button" class="btn" data-discard-draft="${index}">Discard draft</button>`:''}
 </div></div></details>
 <section class="poster-editor" data-poster-editor="${index}" hidden></section></article>`;
}

// Start swipes on the grip so horizontal browsing and dragging cards still work.
function bindRosterSwipe(grip,onSwipe){
 let start=null,ignoreClick=false;
 grip.addEventListener('pointerdown',event=>{
  ignoreClick=false;
  if(event.pointerType!=='touch'||!event.isPrimary)return;
  start={x:event.clientX,y:event.clientY,id:event.pointerId};
  grip.setPointerCapture(event.pointerId);
 });
 grip.addEventListener('pointercancel',()=>{start=null});
 grip.addEventListener('pointerup',event=>{
  if(start?.id!==event.pointerId)return;
  const dx=event.clientX-start.x,dy=event.clientY-start.y;
  start=null;
  if(Math.abs(dy)<32||Math.abs(dy)<Math.abs(dx)*1.3)return;
  ignoreClick=true;
  setTimeout(()=>{ignoreClick=false},350);
  onSwipe(dy<0);
 });
 grip.addEventListener('click',event=>{
  if(!ignoreClick||event.detail===0)return;
  ignoreClick=false;
  event.stopImmediatePropagation();
 },true);
}

// Taps open the pick sheet; holds and drags rearrange. See pick.js.
function bindPosterBooking(){
 const poster=$('.show-collage');
 if(!poster){if(pickSheet){pickSheet=null;$('#pick-sheet-root')?.remove();document.body.classList.remove('pick-open')}return}
 for(const tools of poster.querySelectorAll('.poster-bout-tools')){
  tools.ontoggle=()=>{
   if(tools.open)for(const other of poster.querySelectorAll('.poster-bout-tools')){
    if(other!==tools)other.open=false;
   }
  };
 }
 pickBindSegments(poster);
 const suggest=$('#suggest-rest');if(suggest)suggest.onclick=pickSuggestRest;
}

// One sheet: every match decision on one screen. Tapping a fit card casts the open spot
// directly; winner, finish and rules are chips rather than menus.
const SHEET_FINISHES=[['Clean finish','Clean'],['Cheating','Cheating'],['Interference','Run-in'],['Disqualification','Disqualification'],['No contest','No contest']];
const SHEET_REASONS=['Settle a grudge','Help an ally','Demand a title shot'];
const SHEET_PRESENTATIONS=['Competitive','Dominant','Upset'];
function openMatchSheet(host,editingIndex,draft,entry=null){
 if(!MATCH_FORMATS[draft.format])resizeBooking(draft,'singles');
 if(!rulesFor(draft).includes(draft.type))draft.type='Singles match';
 const playedElsewhere=playedWrestlerIds(editingIndex),editingConfirmed=state.card[editingIndex].kind==='match';
 const positions=()=>{let pos=0;return matchSides(draft).flatMap((side,si)=>side.map((id,pi)=>({pos:pos++,id,si,pi})))};
 const firstEmpty=()=>positions().find(p=>p.id==null)?.pos??-1;
 let active=entry?.step&&/^p\d+$/.test(entry.step)?Number(entry.step.slice(1)):firstEmpty();
 if(!(active>=0&&active<positions().length))active=firstEmpty();
 let query='',filter='all',browseAll=false,preview=null,justBooked=null,status='',extrasOpen=!!(draft.prop||draft.presentation!=='Competitive'),readOpen=false;
 const slotName=(si,pi)=>teamFormat(draft)?`Team ${String.fromCharCode(65+si)} · ${pi+1}`:matchSides(draft).length===2?(si===0?'Red corner':'Blue corner'):`Wrestler ${si+1}`;
 const activeName=()=>{const p=positions()[active];return p?slotName(p.si,p.pi).toLowerCase():''};
 const art=(r,cls='sheet-art')=>`<span class="${cls}" style="--character-color:${r.color}">${portrait(r)}</span>`;
 const chip=(act,label,on,extra='')=>`<button type="button" class="sheet-chip" data-act="${act}" data-sheet-key="${act}" aria-pressed="${on}" ${extra}>${label}</button>`;
 const fit=r=>opponentFit(draft,'p'+Math.max(active,0),r,editingIndex);
 const candidates=()=>{
  const inMatch=new Set(matchPeople(draft));
  return state.roster.filter(r=>!dilemmaUnavailable(r.id)&&!playedElsewhere.has(r.id)&&!inMatch.has(r.id)&&(filter==='all'||(filter==='fresh'?otherBookings(r.id,editingIndex).length===0:filter==='champion'?r.champ:r.role===filter))&&(r.name+' '+r.gimmick+' '+ringPersonalities[r.id].style).toLowerCase().includes(query.toLowerCase()))
   .map(r=>({r,f:fit(r)}))
   .sort((a,b)=>b.f.score-a.f.score||Number(/Promised|challenge|Sweeps/.test(suggestionReason(b.r,editingIndex)))-Number(/Promised|challenge|Sweeps/.test(suggestionReason(a.r,editingIndex)))||b.r.momentum-a.r.momentum);
 };
 const persist=()=>{state.drafts[editingIndex]=structuredClone(draft);save()};
 const tidy=()=>{
  if(!rulesFor(draft).includes(draft.type))draft.type='Singles match';
  if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop='';
  if(matchPeople(draft).includes(draft.interferer))draft.interferer=null;
  if(teamFormat(draft))draft.title=false;
 };

 function cornersHtml(){
  const sides=matchSides(draft),many=sides.length>2;let pos=0;
  const blocks=sides.map((side,si)=>{
   const full=side.every(id=>id!=null),wins=full&&side.includes(draft.winner);
   const slots=side.map((id,pi)=>{const p=pos++,r=id!=null?w(id):null,label=slotName(si,pi);
    return `<button type="button" class="sheet-slot ${p===active?'active':''} ${justBooked===p?'fresh':''}" data-act="slot:${p}" data-sheet-key="slot:${p}" aria-pressed="${p===active}" aria-label="${r?'Replace '+esc(r.name)+', '+label:'Choose '+label}">${r?art(r):'<span class="sheet-art sheet-art-empty" aria-hidden="true">+</span>'}<span class="sheet-slot-text"><small>${label}</small><strong>${r?esc(rosterCardName(r)):'Choose wrestler'}</strong><span class="sheet-slot-role">${r?r.role+(r.champ?' · ★ Champ':''):p===active?'Tap a card below':'Tap to fill'}</span></span></button>`}).join('');
   return `<div class="sheet-side">${slots}<button type="button" class="sheet-win" data-act="win:${side[0]}" data-sheet-key="win:${si}" aria-pressed="${wins}" ${full?'':'disabled'} aria-label="${full?'Book '+esc(sideLabel(side))+' to win':'Fill this side first'}">${wins?'★ Goes over':'Pick to win'}</button></div>`;
  });
  return `<div class="sheet-corners ${many?'many':''} ${teamFormat(draft)?'team':''}">${many?blocks.join(''):blocks.join('<span class="sheet-vs" aria-hidden="true">VS</span>')}</div>`;
 }
 function rosterHtml(){
  const list=candidates(),shown=browseAll?list:list.slice(0,12);
  const cards=shown.map(({r,f})=>`<button type="button" class="sheet-fit" data-act="pick:${r.id}" data-sheet-key="pick:${r.id}" data-preview="${r.id}" aria-label="Put ${esc(r.name)} in the ${activeName()}">${art(r,'sheet-art sheet-art-sm')}<strong>${esc(rosterCardName(r))}</strong><span class="mini-overall">OVR ${overallRating(r)}</span><small>${esc(f.reasons[0]||suggestionReason(r,editingIndex)||r.role)}</small></button>`).join('');
  return `<div class="sheet-fits ${browseAll?'all':''}" data-keep-scroll="fits">${cards||'<p class="cast-no-results">No cards found. Try another name or filter.</p>'}</div>${list.length>12?`<button type="button" class="text-btn" data-act="browse" data-sheet-key="browse" aria-expanded="${browseAll}">${browseAll?'Show the best fits only':`Browse all ${list.length} wrestlers`}</button>`:''}`;
 }
 function previewHtml(){
  if(preview==null)return '';
  const r=w(preview),p=ringPersonalities[r.id];
  return `<div class="sheet-preview" role="dialog" aria-label="${esc(r.name)} preview">${art(r,'sheet-art')}<div><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><h4>${esc(r.name)}</h4><p>${esc(p.style)}</p><p class="sheet-stats">POP <b>${r.pop}</b> · RING <b>${r.skill}</b> · MIC <b>${r.charisma}</b></p><blockquote>“${esc(p.boast)}”</blockquote><p class="note">${esc(fit(r).reasons.slice(0,3).join(' · ')||suggestionReason(r,editingIndex))}</p><div class="sheet-preview-actions"><button type="button" class="btn primary" data-act="pick:${r.id}" data-sheet-key="preview-pick">Put in the ${activeName()}</button><button type="button" class="btn" data-act="close-preview" data-sheet-key="close-preview">Close</button></div></div></div>`;
 }
 function html(){
  const people=matchPeople(draft).map(w),problems=bookingProblems(draft),heat=Math.round(people.reduce((n,r)=>n+r.pop,0)/Math.max(people.length,1));
  const rules=rulesFor(draft).map(rule=>{const cost=ruleCost({...draft,type:rule});return chip('rule:'+rule,esc(rule==='Singles match'?'Standard':rule)+(cost?`<small>+${money(cost)}</small>`:''),draft.type===rule)}).join('');
  const helpers=state.roster.filter(r=>!dilemmaUnavailable(r.id)&&!matchPeople(draft).includes(r.id)).map(r=>({r,heat:Math.max(0,...matchPeople(draft).map(id=>state.rivalries[rivalryKey(id,r.id)]||0))})).sort((a,b)=>b.heat-a.heat||b.r.pop-a.r.pop);
  const champ=champion(),props=propsFor(draft);
  const guidance=qualifierGuidance(draft),read=matchRead(draft,editingIndex);
  const summary=problems.length?problems[0]:finishSummary(draft);
  return `<form class="one-sheet" novalidate>
  <header class="sheet-head"><div><small>Segment ${editingIndex+1} · ${esc(showName())}</small><h3 id="poster-editor-heading" tabindex="-1">Book the match</h3></div><button type="button" class="text-btn" data-act="promo" data-sheet-key="promo">Make it a promo instead</button></header>
  <p id="cast-live-status" class="sr-only" role="status" aria-live="polite">${esc(status)}</p>
  <p id="cast-error" class="cast-error" role="alert" tabindex="-1" hidden></p>
  <div class="sheet-chips" role="group" aria-label="Match format" data-keep-scroll="formats">${Object.entries(MATCH_FORMATS).map(([id,f])=>chip('format:'+id,esc(f.label),matchFormat(draft)===id)).join('')}</div>
  ${cornersHtml()}
  ${teamFormat(draft)&&state.teams.length?`<div class="sheet-chips" role="group" aria-label="Load an established team" data-keep-scroll="teams">${state.teams.map((team,ti)=>matchSides(draft).map((_,si)=>chip(`team:${ti}:${si}`,`${esc(team.name)} → Team ${String.fromCharCode(65+si)}`,false)).join('')).join('')}</div>`:''}
  <section class="sheet-section" aria-labelledby="sheet-roster-title">
   <div class="sheet-section-head"><h4 id="sheet-roster-title">${active>=0?`Best fit for the ${activeName()}`:'Everyone’s cast'}</h4><span>${active>=0?'Hold a card to preview':'Tap a wrestler above to recast'}</span></div>
   ${active<0?'':`<div class="sheet-tools"><input type="search" id="sheet-search" aria-label="Search wrestlers" placeholder="Name, gimmick, or ring style…" value="${esc(query)}" autocomplete="off"><div class="sheet-chips" role="group" aria-label="Filter roster">${[['all','All'],['Face','Faces'],['Heel','Heels'],['fresh','Fresh'],['champion','★']].map(([key,label])=>chip('filter:'+key,label,filter===key,key==='champion'?'aria-label="Champions"':'')).join('')}</div></div>
   ${previewHtml()}
   <div id="sheet-roster">${rosterHtml()}</div>`}
  </section>
  <section class="sheet-section" id="sheet-finish" aria-labelledby="sheet-finish-title">
   <h4 id="sheet-finish-title">Finish</h4>
   <div class="sheet-grid3" role="group" aria-label="Finish">${SHEET_FINISHES.filter(([value])=>value!=='No contest'||matchFormat(draft)==='singles').map(([value,label])=>chip('finish:'+value,label,draft.finish===value||dilemmaDQActive()&&value==='Disqualification',dilemmaDQActive()&&value!=='Disqualification'?'disabled':'')).join('')}</div>
   ${draft.finish==='Interference'?`<p class="sheet-label">Who runs in?</p><div class="sheet-chips" role="group" aria-label="Interfering wrestler" id="sheet-interferer" data-keep-scroll="helpers">${helpers.map(({r})=>chip('helper:'+r.id,esc(rosterCardName(r)),draft.interferer===r.id)).join('')}</div><p class="sheet-label">Why?</p><div class="sheet-chips" role="group" aria-label="Why interfere?" data-keep-scroll="reasons">${SHEET_REASONS.map(reason=>chip('reason:'+reason,reason,(draft.interferenceReason||'Settle a grudge')===reason)).join('')}</div>`:''}
  </section>
  <section class="sheet-section" id="sheet-type" aria-labelledby="sheet-rules-title">
   <h4 id="sheet-rules-title">Rules</h4>
   <div class="sheet-chips" role="group" aria-label="Match rules" data-keep-scroll="rules">${rules}</div>
   <button type="button" class="sheet-chip sheet-title" data-act="title" data-sheet-key="title" aria-pressed="${!!draft.title}" ${teamFormat(draft)||draft.finish==='No contest'?'disabled':''}>${draft.finish==='No contest'?'No contest · non-title':teamFormat(draft)?'Title matches are singles only':draft.title?'★ WWA World title on the line':'Non-title · tap to put the belt up'}</button>
   ${draft.title&&champ&&!matchPeople(draft).includes(champ.id)?`<p class="note">${esc(champ.name)} holds the title. Add the champion or turn the title off.</p>`:''}
  </section>
  <details class="sheet-section sheet-extras" id="sheet-extras" ${extrasOpen?'open':''}><summary>Presentation &amp; prop · optional</summary>
   <p class="sheet-label">Presentation</p><div class="sheet-grid3" role="group" aria-label="Presentation">${SHEET_PRESENTATIONS.map(value=>chip('present:'+value,value,draft.presentation===value)).join('')}</div>
   <p class="sheet-label">Prop</p><div class="sheet-chips" role="group" aria-label="Prop" id="sheet-prop" data-keep-scroll="props">${chip('prop:','No prop',!draft.prop)}${props.map(([key,prop])=>{const taken=state.card.findIndex((s,i)=>i!==editingIndex&&s.prop===key);return chip('prop:'+key,esc(prop.name)+`<small>${taken>=0?'In segment '+(taken+1):money(niceMoney(prop.cost*costScale()))}</small>`,draft.prop===key,taken>=0?'disabled':'')}).join('')}</div>
  </details>
  ${dilemmaSecondOption(draft)}
  <details class="sheet-read" ${readOpen?'open':''}><summary>The booker’s read · ${esc(read.title)}</summary><ul>${read.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul></details>
  <div class="sheet-footer">
   <div class="sheet-status"><div class="sheet-heat">${pressHeat(heat,'Cast popularity')}</div>
   <p class="sheet-summary">${esc(summary)}${guidance&&!problems.length?' · '+esc(guidance):''}</p></div>
   <div class="sheet-footer-actions"><button type="button" class="btn" data-act="done" data-sheet-key="done">Done for now</button><button type="submit" class="sheet-book" data-sheet-key="book" ${problems.length?'aria-disabled="true"':''}>${editingConfirmed?'Save changes':'Book it'}</button></div>
  </div>
  </form>`;
 }
 function draw(){
  const scroll={};host.querySelectorAll('[data-keep-scroll]').forEach(el=>scroll[el.dataset.keepScroll]=el.scrollLeft);
  const focusKey=host.contains(document.activeElement)?document.activeElement.closest('[data-sheet-key]')?.dataset.sheetKey:null;
  const extras=host.querySelector('#sheet-extras'),readEl=host.querySelector('.sheet-read');if(extras)extrasOpen=extras.open;if(readEl)readOpen=readEl.open;
  host.innerHTML=html();
  host.querySelectorAll('[data-keep-scroll]').forEach(el=>{if(scroll[el.dataset.keepScroll]!=null)el.scrollLeft=scroll[el.dataset.keepScroll]});
  const form=host.querySelector('form');
  form.onclick=onClick;form.onsubmit=onSubmit;form.onpointerdown=onPointerDown;form.onpointermove=onPointerMove;form.onpointerup=form.onpointercancel=onPointerEnd;
  form.oncontextmenu=event=>{if(event.target.closest('[data-preview]'))event.preventDefault()};
  bindSearch();
  if(focusKey)[...host.querySelectorAll('[data-sheet-key]')].find(el=>el.dataset.sheetKey===focusKey)?.focus({preventScroll:true});
 }
 function drawRoster(){
  const roster=host.querySelector('#sheet-roster');if(!roster)return;
  roster.innerHTML=rosterHtml();
 }
 function bindSearch(){
  const search=host.querySelector('#sheet-search');
  if(search)search.oninput=()=>{query=search.value;drawRoster()};
 }
 const say=text=>{status=text;const el=host.querySelector('#cast-live-status');if(el)el.textContent=text};
 const fail=message=>{const el=host.querySelector('#cast-error');el.textContent=message;el.hidden=false;el.scrollIntoView({block:'nearest'});el.focus()};
 function pick(id){
  if(active<0)return;
  if(playedElsewhere.has(id)){fail('That wrestler is already on the bill in another segment.');return}
  const r=w(id),label=activeName();
  setBookingParticipant(draft,active,id);tidy();
  justBooked=active;preview=null;query='';
  const next=firstEmpty();active=next;
  persist();draw();
  say(`${r.name} in the ${label}. ${next>=0?'Choose the '+activeName()+'.':draft.winner==null&&draft.finish!=='No contest'?'Now pick who wins.':'Ready to book.'}`);
  if(next<0&&draft.winner==null&&draft.finish!=='No contest')host.querySelector('.sheet-win:not([disabled])')?.focus({preventScroll:true});
 }
 function act(action){
  const [name,...rest]=action.split(':'),value=rest.join(':');
  justBooked=null;
  if(name==='pick'){pick(Number(value));return}
  if(name==='slot'){const p=Number(value);active=active===p&&positions()[p].id!=null?-1:p;preview=null;draw();if(active>=0){say(`Choose the ${activeName()}.`);host.querySelector('#sheet-roster')?.scrollIntoView({block:'nearest'})}return}
  if(name==='format'){resizeBooking(draft,value);tidy();preview=null;active=firstEmpty();persist();draw();say(MATCH_FORMATS[value].label+' selected.');return}
  if(name==='win'){if(draft.finish==='No contest')draft.finish='Clean finish';draft.winner=Number(value);persist();draw();say(`${sideLabel(matchSides(draft)[winningSide(draft)])} goes over.`);return}
  if(name==='dog-second'){draft.second=draft.second==null?dilemmaData().owner:null;persist();draw();return}
  if(name==='finish'){draft.finish=dilemmaDQActive()?'Disqualification':value;if(draft.finish==='No contest'){draft.winner=null;draft.title=false}persist();draw();if(value==='Interference')say('Pick who runs in.');return}
  if(name==='helper'){draft.interferer=Number(value);persist();draw();return}
  if(name==='reason'){draft.interferenceReason=value;persist();draw();return}
  if(name==='rule'){draft.type=value;persist();draw();return}
  if(name==='title'){if(!teamFormat(draft)&&draft.finish!=='No contest')draft.title=!draft.title;persist();draw();return}
  if(name==='present'){draft.presentation=value;persist();draw();return}
  if(name==='prop'){draft.prop=value;persist();draw();return}
  if(name==='filter'){filter=value;draw();return}
  if(name==='browse'){browseAll=!browseAll;drawRoster();host.querySelector('[data-act="browse"]')?.focus({preventScroll:true});return}
  if(name==='close-preview'){preview=null;draw();return}
  if(name==='team'){
   const [ti,si]=value.split(':').map(Number),team=state.teams[ti],others=draft.sides.filter((_,i)=>i!==si).flat();
   if([team.a,team.b].some(id=>playedElsewhere.has(id)))return fail('A team member is already on the bill in another segment.');
   if([team.a,team.b].some(id=>others.includes(id)))return fail('A team member is already on an opposing side. Change that slot first.');
   draft.sides[si][0]=team.a;draft.sides[si][1]=team.b;if(!matchPeople(draft).includes(draft.winner))draft.winner=null;draft.a=draft.sides[0][0];draft.b=draft.sides[1][0];tidy();
   active=firstEmpty();persist();draw();say(team.name+' loaded.');return;
  }
  if(name==='promo'){openBookingDesk(editingIndex,'promo');return}
  if(name==='done'){persist();returnToBooking(editingIndex,'Draft saved.');return}
 }
 // Handlers live on the sheet's form, so a promo desk opened in the same host never inherits them.
 const onClick=event=>{
  const button=event.target.closest('[data-act]');
  if(!button||button.disabled)return;
  if(suppressClick){suppressClick=false;event.preventDefault();return}
  act(button.dataset.act);
 };
 // Long-press a fit card for the full spotlight; a normal tap casts immediately.
 let pressTimer=null,pressStart=null,suppressClick=false;
 const onPointerDown=event=>{
  suppressClick=false;
  const card=event.target.closest('[data-preview]');if(!card||!event.isPrimary)return;
  pressStart={x:event.clientX,y:event.clientY};
  clearTimeout(pressTimer);
  pressTimer=setTimeout(()=>{pressTimer=null;suppressClick=true;preview=Number(card.dataset.preview);draw();host.querySelector('.sheet-preview')?.scrollIntoView({block:'nearest'});host.querySelector('[data-sheet-key="preview-pick"]')?.focus({preventScroll:true})},450);
 };
 const onPointerMove=event=>{if(pressTimer&&pressStart&&Math.hypot(event.clientX-pressStart.x,event.clientY-pressStart.y)>10){clearTimeout(pressTimer);pressTimer=null}};
 const onPointerEnd=()=>{clearTimeout(pressTimer);pressTimer=null};
 const onSubmit=event=>{
  event.preventDefault();
  const problems=bookingProblems(draft);
  if(draft.prop&&state.card.some((s,i)=>i!==editingIndex&&s.prop===draft.prop))problems.push('That prop is already allocated to another segment.');
  const ids=matchPeople(draft);
  if(new Set(ids).size!==ids.length)problems.push('Each wrestler can appear only once in a match.');
  if(draft.title&&(teamFormat(draft)||!ids.includes(champion().id)))problems.push(`${champion().name} holds the title. Add the champion or turn off the title match.`);
  if(problems.length)return fail(problems[0]);
  const previouslyReserved=playedWrestlerIds();
  state.card[editingIndex]=structuredClone({...draft,concept:(draft.concept||'').trim(),draft:false});delete state.drafts[editingIndex];
  returnToBooking(editingIndex,'Match booked.',previouslyReserved);
 };
 draw();
 host.scrollIntoView({block:'nearest'});
 const fieldTarget={type:'#sheet-type',finish:'#sheet-finish',interferer:'#sheet-finish',prop:'#sheet-extras',presentation:'#sheet-extras'}[entry?.field];
 if(fieldTarget){const el=host.querySelector(fieldTarget);if(el.tagName==='DETAILS')el.open=true;(el.querySelector('[aria-pressed="true"]')||el.querySelector('button'))?.focus({preventScroll:true});el.scrollIntoView({block:'nearest'})}
 else (host.querySelector('.sheet-slot.active')||host.querySelector('#poster-editor-heading'))?.focus({preventScroll:true});
}
