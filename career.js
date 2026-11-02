'use strict';
// Preserve existing careers and portable backups when changing the promotion name.
function migrateGameBranding(saved){
 const rename=text=>text.replace(/Brawl in Boseman|THURSDAY NIGHT RUCKUS/gi,'Sturgeon Bay Slam').replace(/Oddball Championship Wrestling/gi,'Wisconsin Wrestling Alliance').replace(/\bOCW\b/g,'WWA');
 const visit=value=>typeof value==='string'?rename(value):Array.isArray(value)?value.map(visit):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key,visit(item)])):value;
 for(const key of ['history','recap','liveShow'])if(saved[key])saved[key]=visit(saved[key]);
 for(const segment of saved.card||[])if(segment.concept)segment.concept=rename(segment.concept);
}
function blankBooking(kind){return kind==='promo'?{kind,a:null,hook:'',concept:''}:{kind:'match',format:'',sides:[[null],[null]],a:null,b:null,winner:null,type:'',finish:'',title:false}}
function resizeBooking(draft,format){
 draft.format=format;const used=new Set(),old=draft.sides||[[draft.a],[draft.b]];
 draft.sides=MATCH_FORMATS[format].sizes.map((size,i)=>Array.from({length:size},(_,j)=>{const id=old[i]?.[j];if(id==null||used.has(id))return null;used.add(id);return id}));
 draft.a=draft.sides[0][0];draft.b=draft.sides[1][0];if(!matchPeople(draft).includes(draft.winner))draft.winner=null;if(teamFormat(draft))draft.title=false;if(draft.type&&!rulesFor(draft).includes(draft.type))draft.type='';
}
function bookingProblems(s){
 if(!s?.kind)return ['Choose a match or promo for this slot.'];
 if(s.kind==='promo')return [s.a==null?'Choose who gets the microphone.':'',!s.hook?'Choose a story beat.':'',!s.concept?.trim()?'Write the wrestler’s promo idea.':''].filter(Boolean);
 const ids=matchPeople(s),expected=MATCH_FORMATS[matchFormat(s)].sizes.reduce((a,b)=>a+b,0);
 return [!s.format?'Choose a match format.':'',ids.length!==expected?'Choose every wrestler in the match.':'',new Set(ids).size!==ids.length?'A wrestler cannot face themselves.':'',s.winner==null||!ids.includes(s.winner)?'Choose the winning wrestler or team.':'',!MATCH_RULES.includes(s.type)?'Choose the match rules.':'',!['Clean finish','Cheating','Interference','Upset victory'].includes(s.finish)?'Choose how the match finishes.':''].filter(Boolean);
}
function chooseSegmentKind(index){
 modal('A blank spot. A big possibility.',`<p class="note">Segment ${index+1}. What are we giving the crowd?</p><div class="segment-kind-choices"><button type="button" data-new-kind="match"><span>VS</span><h3>A match</h3><p>Rivals, teams, wild rules. Somebody goes over.</p></button><button type="button" data-new-kind="promo"><span>“!”</span><h3>A promo</h3><p>A microphone and a very questionable idea.</p></button></div>`,()=>{},'');
 $('#modal .modal-actions').hidden=true;document.querySelectorAll('[data-new-kind]').forEach(button=>button.onclick=()=>{$('#modal').close();openBookingDesk(index,button.dataset.newKind)});
}
function renderTitle(){
 document.body.classList.remove('show-live');document.body.classList.add('at-title');save();
 $('#app').innerHTML=`<main class="title-screen"><div class="title-ticket"><span>WISCONSIN WRESTLING ALLIANCE PRESENTS</span><b>ADMIT ONE · ALL PERSONALITY</b></div><section class="title-intro"><div class="title-copy"><p class="title-eyebrow">SMALL VENUES. BIG NONSENSE.</p><h1>STURGEON<span class="title-middle">BAY</span><span class="title-slam">SLAM<span aria-hidden="true">★</span></span></h1><p class="title-tagline">Bad ideas. Great wrestling.<br>Your show starts with a blank card.</p><div class="title-buttons">${state.started?`<button class="btn primary" id="continue-game">Continue career <span>→</span></button><p class="continue-info">WEEK ${state.week} · ${state.history.length} SHOW${state.history.length===1?'':'S'} · ${money(state.cash)}${state.liveShow?' · ON AIR':state.recap?' · RESULTS READY':''}</p>`:''}<button class="btn ${state.started?'':'primary'}" id="new-game">${state.started?'New career':'Start your promotion'} <span>→</span></button><button class="text-btn" id="title-guide">How to play ↗</button></div></div><div class="title-cast" aria-label="Your wrestling misfits">${[4,10,17].map((id,i)=>`<div class="title-wrestler title-wrestler-${i}"><div>${portrait(w(id))}</div><strong>${esc(w(id).name)}</strong><span>${['ALL ATTITUDE','ALL HEART','TERMS APPLY'][i]}</span></div>`).join('')}<div class="title-burst">34 MISFITS.<br>ONE VERY<br>LOUD ROOM.</div></div></section><div class="title-footer"><p>Book the card. Call the moment. Make them believe.</p><span>CAREER MODE · SAVES ON THIS DEVICE</span></div></main>`;
 $('#new-game').onclick=()=>{const start=()=>{state=fresh();state.started=true;view='book';onTitle=false;document.body.classList.remove('at-title');render();window.scrollTo(0,0)};if(state.started){modal('Start a new career?',`<p class="note">This replaces the career saved on this device. You can export a backup from your office first.</p>`,(_,dialog)=>{dialog.close();start()},'Start new career')}else start()};
 if($('#continue-game'))$('#continue-game').onclick=()=>{onTitle=false;document.body.classList.remove('at-title');render();window.scrollTo(0,0)};
 $('#title-guide').onclick=guide;
}
function exportCareer(){const blob=new Blob([JSON.stringify({game:'Sturgeon Bay Slam',version:1,savedAt:new Date().toISOString(),state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`sturgeon-bay-slam-week-${state.week}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Career backup downloaded. Keep it somewhere safe.')}
function validateCareer(data){
 const s=['Sturgeon Bay Slam','Brawl in Boseman'].includes(data?.game)?data.state:null;
 if(!s||!Number.isInteger(s.week)||s.week<1||!Number.isFinite(s.cash)||!Number.isFinite(s.rep)||!Array.isArray(s.roster)||s.roster.length!==initialRoster.length||new Set(s.roster.map(r=>r.id)).size!==initialRoster.length||!initialRoster.every(r=>s.roster.some(x=>x.id===r.id))||s.roster.some(r=>!['skill','charisma','pop','morale'].every(k=>Number.isFinite(r[k]))||!['Face','Heel'].includes(r.role)||typeof r.name!=='string'||typeof r.gimmick!=='string')||s.roster.filter(r=>r.champ).length!==1||!Array.isArray(s.card)||s.card.length!==4||s.card.some(segment=>segment.kind&&(!['match','promo'].includes(segment.kind)||bookingProblems(segment).length||matchPeople(segment).some(id=>!s.roster.some(r=>r.id===id))))||!Array.isArray(s.teams)||!Array.isArray(s.history)||!s.rivalries||!s.crowd||!['chaos','drama','purists'].every(k=>Number.isFinite(s.crowd[k])))throw Error('Choose a valid Sturgeon Bay Slam career backup.');
 if(s.teams.some(t=>![t.a,t.b].every(id=>s.roster.some(r=>r.id===id))||t.a===t.b||!Number.isFinite(t.chemistry)||typeof t.name!=='string'))throw Error('This backup contains an invalid team.');
 return s;
}
function importCareer(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{try{const file=input.files[0];if(!file)return;if(file.size>3000000)throw Error('That backup is too large.');const restored=validateCareer(JSON.parse(await file.text()));modal('Restore this career?',`<p class="note">Restore week ${restored.week} with ${restored.history.length} shows in its history? This replaces the career on this device.</p>`,(_,dialog)=>{state=mergeRosterExpansion(restored);state.started=true;view=state.view||'book';dialog.close();render();toast('Career restored. Welcome back, boss.')},'Restore career')}catch(error){toast(error.message)}};input.click()}
function bindCareerControls(){
 document.querySelectorAll('[data-title-menu]').forEach(button=>button.onclick=()=>{onTitle=true;render();window.scrollTo(0,0)});
 document.querySelectorAll('[data-clear]').forEach(button=>button.onclick=()=>{state.card[Number(button.dataset.clear)]={kind:null};render()});
 document.querySelectorAll('[data-move]').forEach(button=>button.onclick=()=>{const [i,d]=button.dataset.move.split(':').map(Number),j=i+d;if(j<0||j>=state.card.length)return;[state.card[i],state.card[j]]=[state.card[j],state.card[i]];render()});
 if($('#export-career'))$('#export-career').onclick=exportCareer;if($('#import-career'))$('#import-career').onclick=importCareer;
}
