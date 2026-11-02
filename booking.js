'use strict';
function otherBookings(id,editingIndex){return state.card.map((segment,index)=>({segment,index})).filter(({segment,index})=>index!==editingIndex&&matchPeople(segment).includes(id)).map(({index})=>index+1)}
function matchRead(draft,editingIndex){
 if(bookingProblems(draft).length)return {title:'Every spot is yours to choose.',notes:bookingProblems(draft)};
 const a=w(draft.a);if(draft.kind==='promo')return {title:a.charisma>=80?'Give this one a microphone.':'A moment to find their voice.',notes:[ringPersonalities[a.id].voice,`Charisma ${a.charisma} · Popularity ${a.pop}`,otherBookings(a.id,editingIndex).length?'They already have another segment tonight.':'Fresh tonight. The spotlight is theirs.']};
 const people=matchPeople(draft).map(w),sides=matchSides(draft),win=sides[winningSide(draft)]||sides[0],pairs=participantPairs(draft),heat=Math.max(0,...pairs.map(([a,b])=>state.rivalries[rivalryKey(a,b)]||0)),notes=[];
 const label=MATCH_FORMATS[matchFormat(draft)].label;
 let title=heat>=35?'There’s already a grudge here.':teamFormat(draft)?'Build a team. Give them a moment.':people.length>2?'More rivals. More ways to steal it.':'Give the crowd a side to pick.';
 notes.push(`${label}: ${people.length} wrestlers, ${sides.length} opposing sides.`);
 if(heat)notes.push(`Strongest rivalry heat: ${heat}/100. A clean big-event finish can pay it off.`);
 if(teamFormat(draft)){const bonded=establishedTeams(draft);notes.push(bonded.length?`${bonded.map(t=>t.name).join(' and ')} bring established chemistry. Everyone on the winning team gets the win.`:'These are improvised teams. Everyone on the winning side shares the victory.');}
 if(people.every(r=>r.skill>=75))notes.push('Strong ring workers throughout. The purists have a reason to watch.');else if(people.some(r=>r.skill<60))notes.push('Keep the exchanges simple for the less experienced wrestlers.');
 const busy=people.filter(r=>otherBookings(r.id,editingIndex).length);if(busy.length)notes.push(`${busy.map(r=>r.name).join(', ')} already ${busy.length===1?'has':'have'} another segment tonight.`);
 if(draft.finish==='Upset victory')notes.push('The upset lands best when the winning side is less popular than the opposition.');
 if(draft.title)notes.push(people.some(r=>r.champ)?w(draft.winner).champ?'The champion is booked to retain.':'You’re booking a new singles champion.':'Add the champion or turn off the title match.');
 if(matchFormat(draft)==='royal')notes.push('The finish is an over-the-top-rope elimination, not a pinfall.');
 if(state.request==='yes'&&people.some(r=>r.id===10))notes.push(win.includes(10)&&draft.finish==='Clean finish'?'This clean win delivers your promise to Sweeps.':'Remember: Sweeps was promised a clean win tonight.');
 return {title,notes};
}
function openBookingDesk(editingIndex,chosenKind){
 const original=state.card[editingIndex];
 if(!original.kind&&!chosenKind){chooseSegmentKind(editingIndex);return}
 const draft=original.kind?structuredClone(original):blankBooking(chosenKind);draft.concept??='';draft.hook??='';
 let step='p0',focusId=draft.a,query='',filter='all',expanded=false,justBooked=null;
 const slots=()=>draft.kind==='promo'?[{key:'p0',id:draft.a,label:'On the mic'}]:matchSides(draft).flatMap((side,si)=>side.map((id,pi)=>({key:'p'+(matchSides(draft).slice(0,si).flat().length+pi),id,label:teamFormat(draft)?`Team ${String.fromCharCode(65+si)} · ${pi+1}`:`Wrestler ${si+1}`})));
 const slotId=key=>slots().find(slot=>slot.key===key)?.id;
 const setSlot=(key,id)=>{if(draft.kind==='promo'){draft.a=id;return}let position=Number(key.slice(1));for(const side of draft.sides){if(position<side.length){side[position]=id;break}position-=side.length}draft.a=draft.sides[0][0];draft.b=draft.sides[1][0];};
 const readSettings=()=>{const form=$('#modal-form');if(!form)return;const f=new FormData(form);for(const key of ['type','finish','hook','concept'])if(f.has(key))draft[key]=f.get(key);if($('#cast-title'))draft.title=$('#cast-title').checked;};
 const fail=message=>{const el=$('#cast-error');el.textContent=message;el.hidden=false;el.scrollIntoView({block:'nearest'});el.focus();};
 modal('Cast the chaos.',`<div class="cast-toolbar"><label for="cast-kind">Segment ${editingIndex+1}</label><select id="cast-kind" name="kind"><option value="match" ${draft.kind==='match'?'selected':''}>Match</option><option value="promo" ${draft.kind==='promo'?'selected':''}>Promo</option></select><span id="cast-live-status" role="status" aria-live="polite">Your card. Your weirdos.</span></div><p id="cast-error" class="cast-error" role="alert" tabindex="-1" hidden></p><div id="casting-desk"></div>`,(_,dialog)=>{
  readSettings();
  if(step!=='finish'){commitFocus();return}
  const problems=bookingProblems(draft);if(problems.length)return fail(problems[0]);
  if(draft.kind==='match'){
   const ids=matchPeople(draft);if(new Set(ids).size!==ids.length)return fail('Each wrestler can appear only once in a match.');if(ids.length!==MATCH_FORMATS[matchFormat(draft)].sizes.reduce((n,size)=>n+size,0))return fail('Fill every participant slot.');
   if(!matchPeople(draft).includes(draft.winner))return fail('Choose a winner from this match.');
   if(draft.title&&(teamFormat(draft)||!matchPeople(draft).includes(champion().id)))return fail(`${champion().name} holds the title. Add the champion or turn off the title match.`);

   state.card[editingIndex]={kind:'match',format:draft.format,sides:structuredClone(draft.sides),a:draft.a,b:draft.b,winner:draft.winner,type:draft.type,finish:draft.finish,title:draft.title};
  }else state.card[editingIndex]={kind:'promo',a:draft.a,hook:draft.hook,concept:draft.concept.trim()};
  dialog.close();render();toast(draft.kind==='match'?'Booked. Let’s give them something to talk about.':'Microphone booked. Make it count.');
 },'Save booking');
 $('#modal').className='booking-modal casting-modal';
 const reserved=()=>new Set(slots().filter(slot=>slot.key!==step).map(slot=>slot.id));
 const filtered=()=>state.roster.filter(r=>(filter==='all'||(filter==='fresh'?otherBookings(r.id,editingIndex).length===0:filter==='champion'?r.champ:r.role===filter))&&(r.name+' '+r.gimmick+' '+ringPersonalities[r.id].style).toLowerCase().includes(query.toLowerCase()));
 const available=()=>filtered().filter(r=>!reserved().has(r.id));
 function announce(text){$('#cast-live-status').textContent=text;$('#cast-error').hidden=true}
 function toStep(next){readSettings();step=next;query='';filter='all';expanded=false;justBooked=null;if(step!=='finish')focusId=slotId(step);drawDesk();$('#modal').scrollTop=0;}
 function slot(id,key,label){const r=w(id);if(!r)return `<button type="button" class="cast-slot empty-cast-slot ${step===key?'active':''}" data-cast-slot="${key}" aria-label="Choose ${label}"><span class="empty-cast-icon">+</span><span><small>${label}</small><strong>Choose wrestler</strong></span></button>`;return `<button type="button" class="cast-slot ${step===key?'active':''} ${justBooked===key?'fresh-drop':''}" data-cast-slot="${key}" aria-pressed="${step===key}" aria-label="Change ${label}: ${esc(r.name)}"><span class="cast-slot-art" style="--character-color:${r.color}">${portrait(r)}</span><span><small>${label}</small><strong>${esc(r.name)}</strong></span>${justBooked===key?'<b class="cast-booked">BOOKED</b>':''}</button>`}
 function drawDesk(){
  syncFooter();
  const steps=slots().map(slot=>[slot.key,slot.label]).concat([['finish',draft.kind==='match'?'Finish':'The pitch']]);
  $('#casting-desk').innerHTML=`<nav class="cast-steps" aria-label="Booking steps">${steps.map(([key,label],i)=>`<button type="button" data-step="${key}" class="${step===key?'current':''}" ${step===key?'aria-current="step"':''}><b>${i+1}</b><span>${label}</span></button>`).join('')}</nav><div class="cast-slots ${slots().length>2?'multiple':draft.kind==='promo'?'solo':''}">${slots().map(slotData=>slot(slotData.id,slotData.key,slotData.label)).join('')}</div>${draft.kind==='match'?`<div class="cast-format-picker">${field('Match format',`<select id="cast-format"><option value="" ${!draft.format?'selected':''} disabled>Choose a format…</option>${Object.entries(MATCH_FORMATS).map(([key,format])=>`<option value="${key}" ${draft.format===key?'selected':''}>${format.label}</option>`).join('')}</select>`)}</div>${teamFormat(draft)&&state.teams.length?`<details class="cast-team-loader"><summary>Load an established team</summary>${state.teams.map((team,index)=>[0,1].map(si=>`<button type="button" data-team-load="${index}:${si}">${esc(team.name)} → Team ${String.fromCharCode(65+si)}</button>`).join('')).join('')}</details>`:''}`:''}${step==='finish'?'<div id="cast-review"></div>':`<div class="cast-browse-head"><div><h3>${draft.kind==='promo'?'Who’s got something to say?':step==='p0'?'Who opens the fight?':'Who gets the next spot?'}</h3><p>${draft.kind==='promo'?'Find a voice. Give them a moment.':'Browse a card, then send them into the ring.'}</p></div><button type="button" id="cast-surprise" aria-label="Suggest a wildcard wrestler">✦ Wildcard</button></div><div class="cast-search"><input type="search" id="cast-search" aria-label="Search wrestlers" placeholder="Name, gimmick, or ring style…" value="${esc(query)}"><div class="cast-filters" role="group" aria-label="Filter roster">${[['all','All'],['Face','Faces'],['Heel','Heels'],['fresh','Fresh'],['champion','★']].map(([key,label])=>`<button type="button" data-cast-filter="${key}" class="${filter===key?'active':''}" aria-pressed="${filter===key}" ${key==='champion'?'aria-label="Champions"':''}>${label}</button>`).join('')}</div></div><div id="cast-spotlight" tabindex="0" aria-label="Wrestler spotlight. Use left and right arrows to browse."></div><div class="cast-deck-head"><span id="cast-roster-count"></span><button type="button" id="cast-browse-all" aria-expanded="${expanded}">${expanded?'Show card strip':'Browse all cards'} ↗</button></div><div id="cast-deck" class="cast-deck ${expanded?'expanded':''}" aria-label="Roster cards"></div>`}`;
  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>toStep(b.dataset.step));document.querySelectorAll('[data-cast-slot]').forEach(b=>b.onclick=()=>toStep(b.dataset.castSlot));
  if($('#cast-format'))$('#cast-format').onchange=e=>{readSettings();resizeBooking(draft,e.target.value);step='p0';focusId=draft.a;query='';filter='all';drawDesk();announce('Format changed. Review every spot and the winning side.')};
  document.querySelectorAll('[data-team-load]').forEach(button=>button.onclick=()=>{const [ti,si]=button.dataset.teamLoad.split(':').map(Number),team=state.teams[ti],others=draft.sides.filter((_,index)=>index!==si).flat();if([team.a,team.b].some(id=>others.includes(id))){fail('A team member is already on an opposing side. Change that slot first.');return}draft.sides[si][0]=team.a;draft.sides[si][1]=team.b;resizeBooking(draft,draft.format);step=slots().find(slot=>!draft.sides[si].includes(slot.id))?.key||'finish';focusId=slotId(step);drawDesk();announce(team.name+' loaded. Review the other team.')});
  if(step==='finish'){drawReview();return}
  $('#cast-search').oninput=e=>{query=e.target.value;drawRoster()};
  document.querySelectorAll('[data-cast-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.castFilter;document.querySelectorAll('[data-cast-filter]').forEach(el=>{const on=el.dataset.castFilter===filter;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});drawRoster()});
  $('#cast-surprise').onclick=()=>{const pool=available().filter(r=>r.id!==focusId);if(!pool.length){announce('No other available cards in this filter. Try All.');return}const fresh=pool.filter(r=>!otherBookings(r.id,editingIndex).length),choices=fresh.length?fresh:pool;focusId=choices[Math.floor(Math.random()*choices.length)].id;drawSpotlight();syncDeck();announce(`Wildcard: ${w(focusId).name}. Preview only—book them if you like the idea.`)};
  $('#cast-browse-all').onclick=()=>{expanded=!expanded;$('#cast-deck').classList.toggle('expanded',expanded);$('#cast-browse-all').textContent=expanded?'Show card strip ↗':'Browse all cards ↗';$('#cast-browse-all').setAttribute('aria-expanded',String(expanded))};
  drawRoster();
 }
 function drawRoster(){
  const list=filtered(),eligible=available();if(!eligible.some(r=>r.id===focusId))focusId=eligible[0]?.id??null;
  $('#cast-roster-count').textContent=`${list.length} CARDS · ${eligible.length} AVAILABLE`;
  $('#cast-deck').innerHTML=list.length?list.map(r=>{const other=reserved().has(r.id);return `<button type="button" data-cast-preview="${r.id}" class="cast-mini ${r.id===focusId?'focused':''}" aria-pressed="${r.id===focusId}" ${other?'disabled':''} aria-label="Preview ${esc(r.name)}${other?' — already assigned to another spot':''}"><span style="--character-color:${r.color}">${portrait(r)}</span><strong>${esc(r.name)}</strong><span class="mini-overall">OVR ${overallRating(r)}</span><small>${other?'IN THIS MATCH':otherBookings(r.id,editingIndex).length?'ALREADY BOOKED':r.role.toUpperCase()}</small></button>`}).join(''):'<p class="cast-no-results">No cards found. Try another name or filter.</p>';
  document.querySelectorAll('[data-cast-preview]').forEach(b=>b.onclick=()=>{focusId=Number(b.dataset.castPreview);drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight. Not booked yet.`)});drawSpotlight();
 }
 function syncDeck(){document.querySelectorAll('[data-cast-preview]').forEach(b=>{const current=Number(b.dataset.castPreview)===focusId;b.classList.toggle('focused',current);b.setAttribute('aria-pressed',String(current))});const el=document.querySelector(`[data-cast-preview="${focusId}"]`),deck=$('#cast-deck');if(el&&!expanded){const left=el.offsetLeft-deck.offsetLeft;deck.scrollLeft=left-deck.clientWidth/2+el.clientWidth/2}}
 function cycle(direction){const pool=available();if(!pool.length)return;const index=pool.findIndex(r=>r.id===focusId);focusId=pool[(index+direction+pool.length)%pool.length].id;drawSpotlight();syncDeck();announce(`${w(focusId).name} in the spotlight.`)}
 function syncFooter(){
  const footer=$('#modal .modal-actions'),save=footer.querySelector('[type="submit"]');
  footer.querySelector('#cast-book')?.remove();save.hidden=step!=='finish';
  if(step!=='finish'){
   const button=document.createElement('button');button.type='button';button.id='cast-book';button.className='btn primary';button.disabled=focusId===null;
   button.textContent=(draft.kind==='promo'?'Give them the mic':`Book this spot`)+' →';button.onclick=commitFocus;footer.appendChild(button);
  }
 }
 function commitFocus(){
  if(step==='finish'||focusId===null||reserved().has(focusId))return;
  const old=slotId(step),r=w(focusId);setSlot(step,focusId);if(old!=null&&draft.winner===old&&old!==focusId)draft.winner=null;
  const chosen=r.name,corner=step;justBooked=corner;const nextIndex=Number(corner.slice(1))+1;step=nextIndex<slots().length?'p'+nextIndex:'finish';query='';filter='all';expanded=false;
  if(step!=='finish')focusId=slotId(step);drawDesk();announce(`${chosen} booked ${draft.kind==='promo'?'on the mic':'into '+(slots().find(slot=>slot.key===corner)?.label||'the match')}. ${step==='finish'?'Now call the finish.':'Choose the next wrestler.'}`);
  $('#modal').scrollTop=0;(step==='finish'?$('#cast-review'):$('#cast-spotlight'))?.focus({preventScroll:true});
 }
 function drawSpotlight(){
  const host=$('#cast-spotlight');if(focusId===null){host.innerHTML='<div class="cast-no-results">Nobody available in this filter.<br>Try All or another search.</div>';$('#cast-surprise').disabled=true;syncFooter();return}
  const r=w(focusId),p=ringPersonalities[r.id],booked=otherBookings(r.id,editingIndex);
  host.innerHTML=`<div class="cast-feature" style="--character-color:${r.color}"><div class="cast-feature-art">${portrait(r)}${ratingBadge(r)}<span class="cast-swipe-hint" aria-hidden="true">↔ SWIPE</span>${r.champ?'<span class="cast-title-badge">★ WWA CHAMPION</span>':''}</div><div class="cast-feature-copy"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><h3>${esc(r.name)}</h3><p>${esc(p.style)}</p><div class="cast-feature-stats"><span>POP <b>${r.pop}</b></span><span>RING <b>${r.skill}</b></span><span>MIC <b>${r.charisma}</b></span></div></div><blockquote>“${esc(p.boast)}”</blockquote><div class="cast-availability ${booked.length?'busy':''}">${booked.length?'Also booked in segment '+booked.join(', '):'Fresh tonight · no other segments'}</div></div><div class="cast-hand-controls"><button type="button" id="cast-prev" aria-label="Previous wrestler">←</button><span>Swipe the portrait or use the arrows</span><button type="button" id="cast-next" aria-label="Next wrestler">→</button></div>`;
  $('#cast-prev').onclick=()=>{cycle(-1);$('#cast-prev')?.focus({preventScroll:true})};$('#cast-next').onclick=()=>{cycle(1);$('#cast-next')?.focus({preventScroll:true})};
  syncFooter();
  $('#cast-surprise').disabled=available().filter(person=>person.id!==focusId).length===0;
  host.onkeydown=e=>{if(e.target!==host)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowLeft'?-1:1)}};
  let start=null;const art=host.querySelector('.cast-feature-art');art.onpointerdown=e=>{start={x:e.clientX,y:e.clientY}};art.onpointerup=e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dy)<65)cycle(dx<0?1:-1)};art.onpointercancel=()=>{start=null};
 }
 function feedback(){const read=matchRead(draft,editingIndex);$('#cast-read').innerHTML=`<small>THE BOOKER’S READ</small><h3>${esc(read.title)}</h3><ul>${read.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`}
 function drawReview(){
  $('#cast-review').setAttribute('tabindex','-1');
  const expected=draft.kind==='promo'?1:MATCH_FORMATS[matchFormat(draft)].sizes.reduce((a,b)=>a+b,0);
  if(matchPeople(draft).length<expected){$('#cast-review').innerHTML='<div class="empty"><h3>Fill every spot first.</h3><p>No mystery opponents. Choose each wrestler before calling the finish.</p><button type="button" class="btn" id="cast-fill-spots">Choose wrestlers →</button></div>';$('#cast-fill-spots').onclick=()=>toStep(slots().find(slot=>slot.id==null)?.key||'p0');return}
  $('#cast-review').innerHTML=`<div class="cast-review-title"><small>${draft.kind==='match'?'THAT’S A MATCH.':'MICROPHONE CHECK.'}</small><h3>${draft.kind==='match'?'Who goes over?':'What’s the pitch?'}</h3><p>${draft.kind==='match'?'Pick the winner. Make the finish mean something.':'Give this character something worth saying.'}</p></div>${draft.kind==='match'?`<div class="cast-winner-cards">${matchSides(draft).map(side=>{const id=side[0],chosen=side.includes(draft.winner);return `<button type="button" class="cast-winner ${chosen?'chosen':''}" data-cast-winner="${id}" aria-pressed="${chosen}" aria-label="Book ${esc(sideLabel(side))} to win"><span class="cast-winner-art team-art">${side.map(member=>portrait(w(member))).join('')}<b>${chosen?'GOING OVER':'PICK TO WIN'}</b></span><strong>${esc(sideLabel(side))}</strong></button>`}).join('')}</div><div class="match-settings">${field('Match type',`<select name="type" id="cast-type" required><option value="" disabled ${!draft.type?'selected':''}>Choose match rules…</option>${options(rulesFor(draft),draft.type)}</select>`)}${field('Finish',`<select name="finish" id="cast-finish" required><option value="" disabled ${!draft.finish?'selected':''}>Choose the finish…</option>${options(['Clean finish','Cheating','Interference','Upset victory'],draft.finish)}</select>`)}</div><label class="title-checkbox row"><input type="checkbox" id="cast-title" ${draft.title?'checked':''} ${teamFormat(draft)?'disabled':''}>${teamFormat(draft)?'The singles championship is not contested in team matches.':'Put the WWA championship on the line'}</label><p class="cast-props" id="cast-props"></p>`:`<div class="cast-promo-review">${avatar(w(draft.a))}<div><h3>${esc(w(draft.a).name)}</h3><p>${esc(w(draft.a).gimmick)}</p></div></div>${field('Story beat',`<select name="hook" id="cast-hook" required><option value="" disabled ${!draft.hook?'selected':''}>Choose a story beat…</option>${options(['Issue a challenge','Debut a gimmick','Win the crowd','Fuel a rivalry'],draft.hook)}</select>`)}${field('Your promo idea',`<input name="concept" required maxlength="100" placeholder="The broom has a title demand…" value="${esc(draft.concept)}">`)}`}<div id="cast-read" class="cast-match-read" aria-live="polite"></div><button type="button" class="cast-recast" id="cast-recast">← Back to the roster</button>`;
  document.querySelectorAll('[data-cast-winner]').forEach(b=>b.onclick=()=>{readSettings();draft.winner=Number(b.dataset.castWinner);document.querySelectorAll('[data-cast-winner]').forEach(el=>{const chosen=matchSides(draft).find(side=>side.includes(draft.winner))?.includes(Number(el.dataset.castWinner));el.classList.toggle('chosen',chosen);el.setAttribute('aria-pressed',String(chosen));el.querySelector('b').textContent=chosen?'GOING OVER':'PICK TO WIN'});feedback();announce(`${w(draft.winner).name} is going over.`)});
  const props=()=>{if($('#cast-props'))$('#cast-props').textContent=ruleCost(draft)?'+$'+ruleCost(draft)+' for special match setup.':'No special match setup costs.'};
  for(const id of ['cast-type','cast-finish','cast-title','cast-hook'])if($('#'+id))$('#'+id).onchange=()=>{readSettings();$('#cast-error').hidden=true;feedback();props()};
  $('#cast-recast').onclick=()=>toStep('p0');feedback();props();
 }
 $('#cast-kind').onchange=e=>{Object.keys(draft).forEach(key=>delete draft[key]);Object.assign(draft,blankBooking(e.target.value));step='p0';focusId=null;query='';filter='all';expanded=false;justBooked=null;drawDesk();announce('A blank '+draft.kind+'. Every choice is yours.')};
 drawDesk();
}
