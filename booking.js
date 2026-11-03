'use strict';
function otherBookings(id,editingIndex){return state.card.map((segment,index)=>({segment,index})).filter(({segment,index})=>index!==editingIndex&&matchPeople(segment).includes(id)).map(({index})=>index+1)}
function bookingResumeStep(draft){
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
 if((chosenKind||original.kind)==='promo'){openPromoDesk(editingIndex);return}
 if(!original.kind&&!chosenKind){chooseSegmentKind(editingIndex);return}
 const draft=original.kind?structuredClone(original):blankBooking(chosenKind);draft.concept??='';draft.hook??='';draft.scene??='Solo address';if(!Object.hasOwn(draft,'target'))draft.target=draft.kind==='promo'&&['Issue a challenge','Fuel a rivalry'].includes(draft.hook)?ringOpponent(draft,draft.a)?.id??null:null;draft.presentation??=draft.finish==='Upset victory'?'Upset':'Competitive';if(draft.finish==='Upset victory')draft.finish='Clean finish';
 let step=bookingResumeStep(draft),focusId=draft.a,query='',filter='all',sort='story',expanded=false,justBooked=null;
 if(entry)step=entry.step||'p0';
 const slots=()=>draft.kind==='promo'?[{key:'p0',id:draft.a,label:'On the mic'}]:matchSides(draft).flatMap((side,si)=>side.map((id,pi)=>({key:'p'+(matchSides(draft).slice(0,si).flat().length+pi),id,label:teamFormat(draft)?`Team ${String.fromCharCode(65+si)} · ${pi+1}`:`Wrestler ${si+1}`})));
 const slotId=key=>slots().find(slot=>slot.key===key)?.id;
 if(!['format','finish'].includes(step)&&!slots().some(slot=>slot.key===step))step='p0';
 if(entry&&step!=='finish'&&step!=='format')focusId=slotId(step);
 const setSlot=(key,id)=>{if(draft.kind==='promo'){draft.a=id;return}let position=Number(key.slice(1));for(const side of draft.sides){if(position<side.length){side[position]=id;break}position-=side.length}draft.a=draft.sides[0][0];draft.b=draft.sides[1][0];};
 const readSettings=()=>{const form=$('#modal-form');if(!form)return;const f=new FormData(form);for(const key of ['type','finish','hook','concept','scene','presentation','prop','interferenceReason'])if(f.has(key))draft[key]=f.get(key);if($('#cast-title'))draft.title=$('#cast-title').checked;for(const key of ['target','interferer'])if(f.has(key))draft[key]=f.get(key)===''?null:Number(f.get(key));};
 const fail=message=>{const el=$('#cast-error');el.textContent=message;el.hidden=false;el.scrollIntoView({block:'nearest'});el.focus();};
 modal('Book segment',`<div class="cast-toolbar"><label for="cast-kind">Segment ${editingIndex+1}</label><select id="cast-kind" name="kind"><option value="match" ${draft.kind==='match'?'selected':''}>Match</option><option value="promo" ${draft.kind==='promo'?'selected':''}>Promo</option></select><span id="cast-live-status" role="status" aria-live="polite">Choose the wrestlers for this segment.</span></div><p id="cast-error" class="cast-error" role="alert" tabindex="-1" hidden></p><div id="casting-desk"></div>`,(_,dialog)=>{
  readSettings();
  if(step!=='finish'){commitFocus();return}
  const problems=bookingProblems(draft);if(draft.prop&&state.card.some((s,i)=>i!==editingIndex&&s.prop===draft.prop))problems.push('That prop is already allocated to another segment.');if(problems.length)return fail(problems[0]);
  if(draft.kind==='match'){
   const ids=matchPeople(draft);if(new Set(ids).size!==ids.length)return fail('Each wrestler can appear only once in a match.');if(ids.length!==MATCH_FORMATS[matchFormat(draft)].sizes.reduce((n,size)=>n+size,0))return fail('Fill every participant slot.');
   if(!matchPeople(draft).includes(draft.winner))return fail('Choose a winner from this match.');
   if(draft.title&&(teamFormat(draft)||!matchPeople(draft).includes(champion().id)))return fail(`${champion().name} holds the title. Add the champion or turn off the title match.`);

  }
  state.card[editingIndex]=structuredClone({...draft,concept:draft.concept.trim(),draft:false});delete state.drafts[editingIndex];
  dialog.close();returnToBooking(editingIndex,'Match booked.');
 },'Save booking');
 $('#modal').className='booking-modal casting-modal';
 const stash=()=>{readSettings();state.drafts[editingIndex]=structuredClone(draft);save()};
 const dialog=$('#modal');dialog.querySelector('.cancel').textContent='Done for now';dialog.querySelector('.close').setAttribute('aria-label','Save draft and close');
 dialog.querySelector('.cancel').onclick=dialog.querySelector('.close').onclick=()=>{stash();dialog.close();returnToBooking(editingIndex,'Draft saved. Your confirmed card is unchanged.')};
 dialog.oncancel=()=>{stash();setTimeout(()=>returnToBooking(editingIndex,'Draft saved.'),0)};
 dialog.querySelector('form').addEventListener('input',stash);
 dialog.querySelector('form').addEventListener('change',()=>{stash()});


 const reserved=()=>new Set(slots().filter(slot=>slot.key!==step).map(slot=>slot.id));
 const filtered=()=>state.roster.filter(r=>(filter==='all'||(filter==='fresh'?otherBookings(r.id,editingIndex).length===0:filter==='champion'?r.champ:r.role===filter))&&(r.name+' '+r.gimmick+' '+ringPersonalities[r.id].style).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='story'?opponentFit(draft,step,b,editingIndex).score-opponentFit(draft,step,a,editingIndex).score||Number(/Promised|challenge|Sweeps/.test(suggestionReason(b,editingIndex)))-Number(/Promised|challenge|Sweeps/.test(suggestionReason(a,editingIndex)))||b.momentum-a.momentum:sort==='name'?a.name.localeCompare(b.name):b[sort]-a[sort]);
 const available=()=>filtered().filter(r=>!reserved().has(r.id));
 function announce(text){$('#cast-live-status').textContent=text;$('#cast-error').hidden=true}
 function toStep(next){stash();step=draft.kind==='match'&&!draft.format?'format':next;query='';filter='all';expanded=false;justBooked=null;if(step!=='finish')focusId=slotId(step);drawDesk();$('#modal').scrollTop=0;}
 function slot(id,key,label){const r=w(id);if(!r)return `<button type="button" class="cast-slot empty-cast-slot ${step===key?'active':''}" data-cast-slot="${key}" aria-label="Choose ${label}"><span class="empty-cast-icon">+</span><span><small>${label}</small><strong>Choose wrestler</strong></span></button>`;return `<button type="button" class="cast-slot ${step===key?'active':''} ${justBooked===key?'fresh-drop':''}" data-cast-slot="${key}" aria-pressed="${step===key}" aria-label="Change ${label}: ${esc(r.name)}"><span class="cast-slot-art" style="--character-color:${r.color}">${portrait(r)}</span><span><small>${label}</small><strong>${esc(r.name)}</strong></span>${justBooked===key?'<b class="cast-booked">BOOKED</b>':''}</button>`}
 function drawDesk(){
  if(step==='format'){
   $('#casting-desk').innerHTML=`<div class="cast-review-title"><small>FIRST, SET THE STAGE</small><h3>What kind of match?</h3><p>Choose the format. Then every spot is yours to cast.</p></div><div class="format-grid">${Object.entries(MATCH_FORMATS).map(([key,value])=>`<button type="button" class="btn" data-format="${key}">${value.label}</button>`).join('')}</div>`;
   syncFooter();document.querySelectorAll('[data-format]').forEach(button=>button.onclick=()=>{resizeBooking(draft,button.dataset.format);step='p0';focusId=null;stash();drawDesk();announce('Format selected. Cast your first wrestler.')});return;
  }
  syncFooter();
  $('#casting-desk').innerHTML=`<nav class="cast-stage-nav" aria-label="Booking stages"><button type="button" data-step="format">1 Format</button><button type="button" data-step="p0" ${step!=='finish'?'aria-current="step"':''}>2 Wrestlers</button><button type="button" data-step="finish" ${step==='finish'?'aria-current="step"':''}>3 ${draft.kind==='promo'?'Pitch':'Finish'}</button></nav><div class="cast-progress">Segment ${editingIndex+1} · ${step==='finish'?'Review the booking':`Choose ${slots().find(s=>s.key===step)?.label||'wrestler'} · ${Number(step.slice(1))+1} of ${slots().length}`}</div><details class="cast-participants"><summary>Participants · ${slots().filter(s=>s.id!=null).length}/${slots().length} selected${matchPeople(draft).length?' · '+esc(matchPeople(draft).map(id=>rosterCardName(w(id))).join(' / ')):''} <span>Change</span></summary><div class="cast-slots ${slots().length>2?'multiple':draft.kind==='promo'?'solo':''}">${slots().map(slotData=>slot(slotData.id,slotData.key,slotData.label)).join('')}</div></details>${draft.kind==='match'?`<div class="cast-format-summary"><strong>${MATCH_FORMATS[matchFormat(draft)].label}</strong>${teamFormat(draft)&&state.teams.length?`<details class="cast-team-loader"><summary>Load a team</summary>${state.teams.map((team,index)=>[0,1].map(si=>`<button type="button" data-team-load="${index}:${si}">${esc(team.name)} → Team ${String.fromCharCode(65+si)}</button>`).join('')).join('')}</details>`:''}</div>`:''}${step==='finish'?'<div id="cast-review"></div>':`<div class="cast-browse-head"><div><h3>${draft.kind==='promo'?'Who’s got something to say?':step==='p0'?'Who opens the fight?':'Who gets the next spot?'}</h3><p>${draft.kind==='promo'?'Find a voice. Give them a moment.':'Browse a card, then send them into the ring.'}</p></div></div><div class="cast-search"><button type="button" id="cast-surprise" aria-label="Suggest a wildcard wrestler">✦ Wildcard</button><input type="search" id="cast-search" aria-label="Search wrestlers" placeholder="Name, gimmick, or ring style…" value="${esc(query)}"><label class="cast-sort">Sort<select id="cast-sort" aria-label="Sort roster"><option value="story">Best fit</option><option value="skill">Ring</option><option value="charisma">Mic</option><option value="pop">Pop</option><option value="name">Name</option></select></label><div class="cast-filters" role="group" aria-label="Filter roster">${[['all','All'],['Face','Faces'],['Heel','Heels'],['fresh','Fresh'],['champion','★']].map(([key,label])=>`<button type="button" data-cast-filter="${key}" class="${filter===key?'active':''}" aria-pressed="${filter===key}" ${key==='champion'?'aria-label="Champions"':''}>${label}</button>`).join('')}</div></div><div id="cast-spotlight" tabindex="0" aria-label="Wrestler spotlight. Use left and right arrows to browse."></div><div class="cast-deck-head"><span id="cast-roster-count"></span><button type="button" id="cast-browse-all" aria-expanded="${expanded}">${expanded?'Show card strip':'Browse all cards'} ↗</button></div><div id="cast-deck" class="cast-deck ${expanded?'expanded':''}" aria-label="Roster cards"></div>`}`;
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>toStep(b.dataset.step));document.querySelectorAll('[data-cast-slot]').forEach(b=>b.onclick=()=>toStep(b.dataset.castSlot));
  if(draft.kind==='promo')document.querySelector('[data-step="format"]').hidden=true;
  if($('#change-format'))$('#change-format').onclick=()=>{stash();step='format';drawDesk()};
  document.querySelectorAll('[data-team-load]').forEach(button=>button.onclick=()=>{const [ti,si]=button.dataset.teamLoad.split(':').map(Number),team=state.teams[ti],others=draft.sides.filter((_,index)=>index!==si).flat();if([team.a,team.b].some(id=>others.includes(id))){fail('A team member is already on an opposing side. Change that slot first.');return}draft.sides[si][0]=team.a;draft.sides[si][1]=team.b;resizeBooking(draft,draft.format);step=slots().find(slot=>!draft.sides[si].includes(slot.id))?.key||'finish';focusId=slotId(step);drawDesk();announce(team.name+' loaded. Review the other team.')});
  if(step==='finish'){drawReview();return}
  $('#cast-sort').value=sort;$('#cast-sort').onchange=e=>{sort=e.target.value;drawRoster()};
  $('#cast-search').oninput=e=>{query=e.target.value;drawRoster()};
  document.querySelectorAll('[data-cast-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.castFilter;document.querySelectorAll('[data-cast-filter]').forEach(el=>{const on=el.dataset.castFilter===filter;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});drawRoster()});
  $('#cast-surprise').onclick=()=>{const pool=available().filter(r=>r.id!==focusId);if(!pool.length){announce('No other available cards in this filter. Try All.');return}const fresh=pool.filter(r=>!otherBookings(r.id,editingIndex).length),choices=fresh.length?fresh:pool;focusId=choices[Math.floor(Math.random()*choices.length)].id;drawSpotlight();syncDeck();announce(`Wildcard: ${w(focusId).name}. Preview only—book them if you like the idea.`)};
  $('#cast-browse-all').onclick=()=>{expanded=!expanded;$('#cast-deck').classList.toggle('expanded',expanded);$('#cast-browse-all').textContent=expanded?'Show card strip ↗':'Browse all cards ↗';$('#cast-browse-all').setAttribute('aria-expanded',String(expanded))};
  drawRoster();
 }
 function drawRoster(){
  const list=filtered(),eligible=available();if(!eligible.some(r=>r.id===focusId))focusId=eligible[0]?.id??null;
  $('#cast-roster-count').textContent=`${list.length} CARDS · ${eligible.length} AVAILABLE`;
  $('#cast-deck').innerHTML=list.length?list.map(r=>{const other=reserved().has(r.id);return `<button type="button" data-cast-preview="${r.id}" class="cast-mini ${r.id===focusId?'focused':''}" aria-pressed="${r.id===focusId}" ${other?'disabled':''} aria-label="Preview ${esc(r.name)}${other?' — already assigned to another spot':''}"><span style="--character-color:${r.color}">${portrait(r)}</span><strong>${esc(rosterCardName(r))}</strong><span class="mini-overall">OVR ${overallRating(r)}</span><small>${!other&&opponentFit(draft,step,r,editingIndex).reasons[0]?esc(opponentFit(draft,step,r,editingIndex).reasons[0]):other?'IN THIS MATCH':otherBookings(r.id,editingIndex).length?'ALREADY BOOKED':r.role.toUpperCase()}</small></button>`}).join(''):'<p class="cast-no-results">No cards found. Try another name or filter.</p>';
  document.querySelectorAll('[data-cast-preview]').forEach(b=>b.onclick=()=>{focusId=Number(b.dataset.castPreview);drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight. Not booked yet.`)});drawSpotlight();
 }
 function syncDeck(){document.querySelectorAll('[data-cast-preview]').forEach(b=>{const current=Number(b.dataset.castPreview)===focusId;b.classList.toggle('focused',current);b.setAttribute('aria-pressed',String(current))});const el=document.querySelector(`[data-cast-preview="${focusId}"]`),deck=$('#cast-deck');if(el&&!expanded){const left=el.offsetLeft-deck.offsetLeft;deck.scrollLeft=left-deck.clientWidth/2+el.clientWidth/2}}
 function cycle(direction){const pool=available();if(!pool.length)return;const index=pool.findIndex(r=>r.id===focusId);focusId=pool[(index+direction+pool.length)%pool.length].id;drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight.`)}
 function syncFooter(){
  const footer=$('#modal .modal-actions'),save=footer.querySelector('[type="submit"]');
  footer.querySelector('#cast-book')?.remove();save.hidden=step!=='finish';save.textContent=draft.kind==='match'?'Save match':'Save promo';
  if(step!=='finish'&&step!=='format'){
   const button=document.createElement('button');button.type='button';button.id='cast-book';button.className='btn primary';button.disabled=focusId===null;
   button.textContent=(focusId==null?'Choose a wrestler':`Add ${w(focusId).name}`)+' →';button.onclick=commitFocus;footer.appendChild(button);
  }
 }
 function commitFocus(){
  if(step==='finish'||step==='format'||focusId===null||reserved().has(focusId))return;
  const old=slotId(step),r=w(focusId);setSlot(step,focusId);if(old!=null&&draft.winner===old&&old!==focusId)draft.winner=null;
  const chosen=r.name,corner=step;justBooked=corner;step=slots().find(slot=>slot.id==null)?.key||'finish';query='';filter='all';expanded=false;
  if(step!=='finish')focusId=slotId(step);stash();drawDesk();announce(`${chosen} booked ${draft.kind==='promo'?'on the mic':'into '+(slots().find(slot=>slot.key===corner)?.label||'the match')}. ${step==='finish'?'Now call the finish.':'Choose the next wrestler.'}`);
  $('#modal').scrollTop=0;(step==='finish'?$('#cast-review'):$('#cast-spotlight'))?.focus({preventScroll:true});
 }
 function drawSpotlight(){
  const host=$('#cast-spotlight');if(focusId===null){host.innerHTML='<div class="cast-no-results">Nobody available in this filter.<br>Try All or another search.</div>';$('#cast-surprise').disabled=true;syncFooter();return}
  const r=w(focusId),p=ringPersonalities[r.id],booked=otherBookings(r.id,editingIndex);
  host.innerHTML=`<div class="cast-feature" style="--character-color:${r.color}"><div class="cast-feature-art">${portrait(r)}${ratingBadge(r)}<span class="cast-swipe-hint" aria-hidden="true">↔ SWIPE</span>${r.champ?'<span class="cast-title-badge">★ WWA CHAMPION</span>':''}</div><div class="cast-feature-copy"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><h3>${esc(r.name)}</h3><p>${esc(p.style)}</p><div class="cast-feature-stats"><span>POP <b>${r.pop}</b></span><span>RING <b>${r.skill}</b></span><span>MIC <b>${r.charisma}</b></span></div></div><blockquote>“${esc(p.boast)}”</blockquote><div class="cast-availability ${booked.length?'busy':''}">${esc(opponentFit(draft,step,r,editingIndex).reasons.slice(0,3).join(' · ')||suggestionReason(r,editingIndex))}</div></div><div class="cast-hand-controls"><button type="button" id="cast-prev" aria-label="Previous wrestler">←</button><span>Swipe the portrait or use the arrows</span><button type="button" id="cast-next" aria-label="Next wrestler">→</button></div>`;
  $('#cast-prev').onclick=()=>{cycle(-1);$('#cast-prev')?.focus({preventScroll:true})};$('#cast-next').onclick=()=>{cycle(1);$('#cast-next')?.focus({preventScroll:true})};
  syncFooter();
  $('#cast-surprise').disabled=available().filter(person=>person.id!==focusId).length===0;
  host.onkeydown=e=>{if(e.target!==host)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowLeft'?-1:1)}};
  let start=null;const art=host.querySelector('.cast-feature-art');art.onpointerdown=e=>{start={x:e.clientX,y:e.clientY}};art.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dy)<65)cycle(dx<0?1:-1)};art.onpointercancel=()=>{start=null};
 }
 function feedback(){const read=matchRead(draft,editingIndex);$('#finish-outcome').textContent=finishSummary(draft)+(qualifierGuidance(draft)?' · '+qualifierGuidance(draft):'');$('#cast-read').innerHTML=`<small>THE BOOKER’S READ</small><h3>${esc(read.title)}</h3><ul>${read.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`}
 function drawReview(){
  $('#cast-review').setAttribute('tabindex','-1');
  const expected=draft.kind==='promo'?1:MATCH_FORMATS[matchFormat(draft)].sizes.reduce((a,b)=>a+b,0);
  if(matchPeople(draft).length<expected){$('#cast-review').innerHTML='<div class="empty"><h3>Fill every spot first.</h3><p>No mystery opponents. Choose each wrestler before calling the finish.</p><button type="button" class="btn" id="cast-fill-spots">Choose wrestlers →</button></div>';$('#cast-fill-spots').onclick=()=>toStep(slots().find(slot=>slot.id==null)?.key||'p0');return}
  $('#cast-review').innerHTML=`<div class="cast-review-title"><small>${draft.kind==='match'?'THAT’S A MATCH.':'MICROPHONE CHECK.'}</small><h3>${draft.kind==='match'?'Who goes over?':'What’s the pitch?'}</h3><p>${draft.kind==='match'?'Pick the winner. Make the finish mean something.':'Give this character something worth saying.'}</p></div>${draft.kind==='match'?`<div class="cast-winner-cards">${matchSides(draft).map(side=>{const id=side[0],chosen=side.includes(draft.winner);return `<button type="button" class="cast-winner ${chosen?'chosen':''}" data-cast-winner="${id}" aria-pressed="${chosen}" aria-label="Book ${esc(sideLabel(side))} to win"><span class="cast-winner-art team-art">${side.map(member=>portrait(w(member))).join('')}<b>${chosen?'GOING OVER':'PICK TO WIN'}</b></span><strong>${esc(sideLabel(side))}</strong></button>`}).join('')}</div><div class="match-settings">${field('Match rules',`<select name="type" id="cast-type" required><option value="" disabled ${!draft.type?'selected':''}>Choose match rules…</option>${matchRuleOptions(draft)}</select>`)}${field('Finish',`<select name="finish" id="cast-finish" required><option value="" disabled ${!draft.finish?'selected':''}>Choose the finish…</option>${options(['Clean finish','Cheating','Interference'],draft.finish)}</select>`)}${field('Interfering wrestler',`<select name="interferer" id="cast-interferer"><option value="">Choose if interference…</option>${state.roster.filter(r=>!matchPeople(draft).includes(r.id)).map(r=>`<option value="${r.id}" ${r.id===draft.interferer?'selected':''}>${esc(r.name)}</option>`).join('')}</select>`)}${field('Why interfere?',`<select name="interferenceReason">${options(['Settle a grudge','Help an ally','Demand a title shot'],draft.interferenceReason||'Settle a grudge')}</select>`)}</div><label class="title-checkbox row"><input type="checkbox" id="cast-title" ${draft.title?'checked':''} ${teamFormat(draft)?'disabled':''}>${teamFormat(draft)?'The singles championship is not contested in team matches.':'Put the WWA championship on the line'}</label><p class="cast-props" id="cast-props"></p>`:`<div class="cast-promo-review">${avatar(w(draft.a))}<div><h3>${esc(w(draft.a).name)}</h3><p>${esc(w(draft.a).gimmick)}</p></div></div>${field('Story beat',`<select name="hook" id="cast-hook" required><option value="" disabled ${!draft.hook?'selected':''}>Choose a story beat…</option>${options(['Issue a challenge','Debut a gimmick','Win the crowd','Fuel a rivalry'],draft.hook)}</select>`)}${field('Scene',`<select name="scene" id="cast-scene">${options(['Solo address','Face-off','Interview','Interruption'],draft.scene)}</select>`)}${field('Target / guest',`<select name="target" id="cast-target"><option value="">The audience</option>${state.roster.filter(r=>r.id!==draft.a).map(r=>`<option value="${r.id}" ${r.id===draft.target?'selected':''}>${esc(r.name)}${r.champ?' ★':''}</option>`).join('')}</select>`)}${field('Custom opening line · optional',`<input name="concept" maxlength="180" placeholder="${esc(ringVoices[draft.a].open)}" value="${esc(draft.concept)}">`)}<p class="note">Leave the line blank to use their own voice. Your words are performed; story intent determines the effects.</p>`}<details class="finish-extras" ${draft.prop||draft.presentation!=='Competitive'?'open':''}><summary>Presentation & prop · optional</summary>${field('Presentation',`<select name="presentation">${options(['Competitive','Dominant','Upset'],draft.presentation)}</select>`)}${field('Allocate a prop',`<select name="prop" id="cast-prop"><option value="">No extra prop</option>${propsFor(draft).map(([key,prop])=>`<option value="${key}" ${draft.prop===key?'selected':''}>${prop.name} · ${money(prop.cost)}</option>`).join('')}</select>`)}</details><div class="finish-outcome" id="finish-outcome" aria-live="polite"></div><div id="cast-read" class="cast-match-read" aria-live="polite"></div><button type="button" class="cast-recast" id="cast-recast">← Back to the roster</button>`;
  document.querySelectorAll('[data-cast-winner]').forEach(b=>b.onclick=()=>{readSettings();draft.winner=Number(b.dataset.castWinner);document.querySelectorAll('[data-cast-winner]').forEach(el=>{const chosen=matchSides(draft).find(side=>side.includes(draft.winner))?.includes(Number(el.dataset.castWinner));el.classList.toggle('chosen',chosen);el.setAttribute('aria-pressed',String(chosen));el.querySelector('b').textContent=chosen?'GOING OVER':'PICK TO WIN'});stash();feedback();announce(`${w(draft.winner).name} is going over.`)});
  const props=()=>{for(const key of ['interferer','interferenceReason']){const control=$('[name="'+key+'"]');if(control)control.closest('label').hidden=draft.finish!=='Interference'}if($('#cast-props'))$('#cast-props').textContent=ruleCost(draft)?'+$'+ruleCost(draft)+' for special match setup.'+(signatureFor(draft)?' Character showcase · standard pinfall/submission rules.':''):'No special match setup costs.'};
  for(const id of ['cast-type','cast-finish','cast-title','cast-hook','cast-scene','cast-target','cast-interferer','cast-prop'])if($('#'+id))$('#'+id).onchange=()=>{readSettings();$('#cast-error').hidden=true;stash();feedback();props()};
  document.querySelector('[name="presentation"]').onchange=()=>{readSettings();stash();feedback()};$('#cast-recast').onclick=()=>toStep('p0');feedback();props();
 }
 $('#cast-kind').onchange=e=>{if(e.target.value==='promo'){state.drafts[editingIndex]=blankBooking('promo');dialog.close();openPromoDesk(editingIndex);return}Object.keys(draft).forEach(key=>delete draft[key]);Object.assign(draft,blankBooking(e.target.value));step=draft.kind==='match'?'format':'p0';focusId=null;query='';filter='all';expanded=false;justBooked=null;drawDesk();announce('A blank '+draft.kind+'. Every choice is yours.')};
 drawDesk();
 if(entry?.field)document.querySelector(`[name="${entry.field}"]`)?.focus();
}

// A promo is one decision screen: speaker, intent, and (when needed) a recipient.
const PROMO_INTENTS=[
 {hook:'Win the crowd',label:'Rally the room',hint:'Speak to the audience in their own voice.'},
 {hook:'Issue a challenge',label:'Call someone out',hint:'Name the wrestler they want to face.'},
 {hook:'Fuel a rivalry',label:'Make it personal',hint:'Give an existing conflict another spark.'},
 {hook:'Debut a gimmick',label:'Show the character',hint:'Give the gimmick a moment in the spotlight.'}
];
function promoNeedsTarget(draft){return ['Issue a challenge','Fuel a rivalry'].includes(draft.hook)||draft.scene!=='Solo address'}
function setPromoSpeaker(draft,id){draft.a=id;if(draft.target===id)draft.target=null;if(SHOW_PROPS[draft.prop]?.owner!=null&&!matchPeople(draft).includes(SHOW_PROPS[draft.prop].owner))draft.prop=''}
function openPromoDesk(index){
 const source=state.drafts[index]||state.card[index],draft=source.kind==='promo'?structuredClone(source):blankBooking('promo');
 draft.draft=false;draft.hook||='Win the crowd';draft.scene||='Solo address';draft.concept||='';draft.prop||='';draft.target??=null;
 const stash=()=>{state.drafts[index]=structuredClone(draft);save()};
 const read=()=>{const form=$('#modal-form');if(!form)return;const data=new FormData(form);for(const key of ['concept','scene','prop'])if(data.has(key))draft[key]=data.get(key);if(data.has('target'))draft.target=data.get('target')===''?null:Number(data.get('target'))};
 modal('Book a promo',`<p class="note">Choose a voice and what they want to achieve. Their dialogue is ready to perform.</p><div id="promo-desk"></div><p id="promo-error" class="cast-error" role="alert" tabindex="-1" hidden></p>`,(_,dialog)=>{
  read();const problems=bookingProblems(draft);if(draft.prop&&state.card.some((s,i)=>i!==index&&s.prop===draft.prop))problems.push('That prop is already allocated tonight.');
  if(problems.length){const error=$('#promo-error');error.textContent=problems[0];error.hidden=false;error.focus();return}
  state.card[index]={...structuredClone(draft),concept:draft.concept.trim(),draft:false};delete state.drafts[index];dialog.close();returnToBooking(index,'Promo booked.');
 },'Book promo');
 const dialog=$('#modal');dialog.className='booking-modal promo-modal';
 const close=()=>{read();stash();dialog.close();returnToBooking(index,'Promo draft saved.')};
 dialog.querySelector('.cancel').textContent='Done for now';dialog.querySelector('.close').onclick=dialog.querySelector('.cancel').onclick=close;
 dialog.oncancel=()=>{read();stash();setTimeout(()=>returnToBooking(index,'Promo draft saved.'),0)};
 function draw(focusSelector=null){
  const advanced=$('#promo-extras')?.open||false;
  $('#promo-desk').innerHTML=`<label class="speaker-search">Find a speaker<input type="search" id="speaker-search" placeholder="Name or gimmick…"></label><div class="speaker-suggestions" aria-label="Suggested speakers">${state.roster.slice().sort((a,b)=>Number(!!state.promises.find(p=>p.actor===b.id&&p.kind==='promo'&&p.status==='open'))-Number(!!state.promises.find(p=>p.actor===a.id&&p.kind==='promo'&&p.status==='open'))||b.charisma-a.charisma).slice(0,3).map(r=>`<button type="button" data-speaker-suggest="${r.id}">${esc(rosterCardName(r))}<span>Mic ${r.charisma} · ${otherBookings(r.id,index).length?'Already booked':'Fresh tonight'}</span></button>`).join('')}</div>${field('On the microphone',`<select name="speaker" id="promo-speaker" required><option value="">Choose a wrestler…</option>${state.roster.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(r=>`<option value="${r.id}" ${r.id===draft.a?'selected':''}>${esc(r.name)} · MIC ${r.charisma}</option>`).join('')}</select>`)}${draft.a!=null?`<div class="promo-speaker-preview">${avatar(w(draft.a))}<div><strong>${esc(w(draft.a).name)}</strong><p>“${esc(ringVoices[draft.a].open)}”</p></div></div>`:''}<fieldset class="promo-intents"><legend>What’s the point?</legend>${PROMO_INTENTS.map(intent=>`<button type="button" data-promo-intent="${intent.hook}" aria-pressed="${draft.hook===intent.hook}"><strong>${intent.label}</strong><span>${intent.hint}</span></button>`).join('')}</fieldset>${promoNeedsTarget(draft)?field('Who are they addressing?',`<select name="target" id="promo-target" required><option value="">Choose a wrestler…</option>${state.roster.filter(r=>r.id!==draft.a).map(r=>`<option value="${r.id}" ${r.id===draft.target?'selected':''}>${esc(r.name)}</option>`).join('')}</select>`):`<p class="note">${draft.target!=null?'Addressing '+esc(w(draft.target).name)+'.':'Addressing the audience. No opponent needed.'}</p>`}<details id="promo-extras" ${advanced?'open':''}><summary>Presentation, opening line & prop · optional</summary>${field('Presentation',`<select name="scene" id="promo-scene">${options(['Solo address','Face-off','Interview','Interruption'],draft.scene)}</select>`)}${!promoNeedsTarget(draft)?field('Optional named target',`<select name="target" id="promo-target"><option value="">The audience</option>${state.roster.filter(r=>r.id!==draft.a).map(r=>`<option value="${r.id}" ${r.id===draft.target?'selected':''}>${esc(r.name)}</option>`).join('')}</select>`):''}${field('Opening line',`<input name="concept" maxlength="180" value="${esc(draft.concept)}" placeholder="Use their own dialogue">`)}${field('Prop',`<select name="prop"><option value="">No extra prop</option>${propsFor(draft).map(([key,prop])=>`<option value="${key}" ${draft.prop===key?'selected':''}>${esc(prop.name)} · ${money(prop.cost)}</option>`).join('')}</select>`)}<p class="note">Your optional opening line is performed as written.</p></details>`;
  $('#promo-speaker').onchange=e=>{read();setPromoSpeaker(draft,e.target.value===''?null:Number(e.target.value));stash();draw('#promo-speaker')};
  document.querySelectorAll('[data-promo-intent]').forEach(button=>button.onclick=()=>{read();draft.hook=button.dataset.promoIntent;if(!promoNeedsTarget(draft))draft.target=null;stash();draw(`[data-promo-intent="${draft.hook}"]`)});
  $('#promo-scene').onchange=()=>{read();stash();draw('#promo-scene')};
  $('#promo-target').onchange=()=>{read();setPromoSpeaker(draft,draft.a);stash();draw('#promo-target')};
  $('#speaker-search').oninput=e=>{const q=e.target.value.toLowerCase();const control=$('#promo-speaker');control.innerHTML='<option value="">Choose a wrestler…</option>'+state.roster.filter(r=>r.id===draft.a||rosterCandidates(q).some(candidate=>candidate.id===r.id)).sort((a,b)=>a.name.localeCompare(b.name)).map(r=>`<option value="${r.id}" ${r.id===draft.a?'selected':''}>${esc(r.name)} · MIC ${r.charisma}</option>`).join('');control.value=draft.a??''};
  document.querySelectorAll('[data-speaker-suggest]').forEach(button=>button.onclick=()=>{read();setPromoSpeaker(draft,Number(button.dataset.speakerSuggest));stash();draw('#promo-speaker')});
  if(focusSelector)document.querySelector(focusSelector)?.focus({preventScroll:true});
  $('#promo-error').hidden=true;
 }
 dialog.querySelector('form').addEventListener('input',()=>{read();stash()});
 dialog.querySelector('form').addEventListener('change',()=>{read();stash()});
 draw();
}
