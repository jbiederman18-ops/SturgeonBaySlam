'use strict';
// Preserve existing careers and portable backups when changing the promotion name.
function migrateGameBranding(saved){
 const rename=text=>text.replace(/Brawl in Boseman|THURSDAY NIGHT RUCKUS/gi,'Sturgeon Bay Slam').replace(/Oddball Championship Wrestling/gi,'Wisconsin Wrestling Alliance').replace(/\bOCW\b/g,'WWA');
 const visit=value=>typeof value==='string'?rename(value):Array.isArray(value)?value.map(visit):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,item])=>[key,visit(item)])):value;
 for(const key of ['history','recap','liveShow'])if(saved[key])saved[key]=visit(saved[key]);
 for(const segment of saved.card||[])if(segment.concept)segment.concept=rename(segment.concept);
}
// Relationship layer save fields. Older careers gain empty relationship state; nothing existing is touched.
function migrateRelationships(s){
 s.preferences??={text:'instant',presentation:'concise'};
 s.preferences.easyMode??=false;
 const rel=s.relations??={};
 rel.version??=1;rel.style??={};rel.routes??={};rel.sore??={};rel.visits??={};rel.lastInvited??={};rel.week??=null;
 rel.jealous??={};rel.epilogues??=[];rel.results??=null;
 for(const key of ['believer','straight','hype','bureaucrat'])rel.style[key]??=0;
 // Version 2 (7.58): a route record for every featured wrestler, not just Sweeps. 7.57 saves keep Sweeps' progress.
 const featured=typeof FEATURED_ROUTES==='object'?Object.keys(FEATURED_ROUTES):['10'];
 for(const id of new Set(['10',...featured])){
  const route=rel.routes[id]??={};
  route.beats??={};route.flags??={};route.memories??=[];route.ask??=null;route.ending??=null;
  if(route.ask&&'vigil' in route.ask){route.ask.final??=!!route.ask.vigil;delete route.ask.vigil}
 }
 rel.version=Math.max(rel.version,2);
 return s;
}
function blankBooking(kind){return kind==='promo'?{kind,a:null,hook:'',concept:'',scene:'Solo address',target:null,prop:''}:{kind:'match',format:'',sides:[[null],[null]],a:null,b:null,winner:null,type:'Singles match',finish:'Clean finish',presentation:'Competitive',interferer:null,interferenceReason:'Settle a grudge',prop:'',title:false}}
function resizeBooking(draft,format){
 draft.format=format;const used=new Set(),old=draft.sides||[[draft.a],[draft.b]];
 draft.sides=MATCH_FORMATS[format].sizes.map((size,i)=>Array.from({length:size},(_,j)=>{const id=old[i]?.[j];if(id==null||used.has(id))return null;used.add(id);return id}));
 draft.a=draft.sides[0][0];draft.b=draft.sides[1][0];if(!matchPeople(draft).includes(draft.winner))draft.winner=null;if(teamFormat(draft))draft.title=false;if(draft.type&&!rulesFor(draft).includes(draft.type))draft.type='';
}
function bookingProblems(s){
 if(!s?.kind||s.draft)return ['Choose a match or finish this draft.'];
 if(s.kind==='promo')return [s.a==null?'Choose who gets the microphone.':'',!['Issue a challenge','Debut a gimmick','Win the crowd','Fuel a rivalry'].includes(s.hook)?'Choose a story beat.':'',s.scene&&(!['Solo address','Face-off','Interview','Interruption'].includes(s.scene))?'Choose a scene format.':'',s.target===s.a?'Choose a target other than the speaker.':'',s.scene&&((s.scene!=='Solo address')||['Issue a challenge','Fuel a rivalry'].includes(s.hook))&&s.target==null?'Choose a target or guest for this story beat.':''].filter(Boolean);
 const ids=matchPeople(s),expected=MATCH_FORMATS[matchFormat(s)].sizes.reduce((a,b)=>a+b,0);
 return [SHOW_PROPS[s.prop]?.owner!=null&&!ids.includes(SHOW_PROPS[s.prop].owner)?'Include the signature prop’s owner or choose another prop.':'',!MATCH_FORMATS[s.format]?'Choose a match format.':'',ids.length!==expected?'Choose every wrestler in the match.':'',new Set(ids).size!==ids.length?'A wrestler cannot face themselves.':'',s.winner==null||!ids.includes(s.winner)?'Choose the winning wrestler or team.':'',!rulesFor(s).includes(s.type)?'Choose compatible match rules.':'',!['Clean finish','Cheating','Interference','Upset victory'].includes(s.finish)?'Choose how the match finishes.':'',s.finish==='Interference'&&Object.hasOwn(s,'interferer')&&(s.interferer==null||ids.includes(s.interferer))?'Choose an interfering wrestler outside this match.':''].filter(Boolean);
}
function chooseSegmentKind(index){
 const followUp=bookingStoryActions().find(action=>action.scheduled<0&&index>(action.after??-1));
 modal('Add a segment',`<p class="note">Segment ${index+1}. Choose a match or promo.</p><div class="segment-kind-choices"><button type="button" data-new-kind="match"><span>VS</span><h3>A match</h3><p>Choose wrestlers, rules, and a winner.</p></button><button type="button" data-new-kind="promo"><span>“!”</span><h3>A promo</h3><p>Choose a speaker and a story beat.</p></button>${followUp?`<button type="button" id="book-suggested-story"><span>↗</span><h3>${esc(followUp.button)}</h3><p>${esc(followUp.label)}</p></button>`:''}</div>`,()=>{},'');
 if(followUp)$('#book-suggested-story').onclick=()=>{$('#modal').close();openStoryBooking(index,followUp.draft)};
 $('#modal .modal-actions').hidden=true;document.querySelectorAll('[data-new-kind]').forEach(button=>button.onclick=()=>{$('#modal').close();openBookingDesk(index,button.dataset.newKind)});
}
function renderTitle(){
 document.body.classList.remove('show-live');document.body.classList.add('at-title');save();
 $('#app').innerHTML=`<main class="title-screen"><div class="title-ticket"><span>KAYFABE PROMOTIONS PRESENTS</span><b>EST. STURGEON BAY, WISCONSIN</b></div><section class="title-intro"><div class="title-copy"><h1>STURGEON<span class="title-middle">BAY</span><span class="title-slam">SLAM<span aria-hidden="true">★</span></span></h1><p class="title-tagline"><strong>RISE TO SUPREMACY</strong><br>From community hall to generational dynasty.</p><div class="title-buttons">${state.started?`<button class="btn primary" id="continue-game">Continue career <span>→</span></button><p class="continue-info">WEEK ${state.week} · ${state.history.length} SHOW${state.history.length===1?'':'S'} · ${money(state.cash)}${state.liveShow?' · ON AIR':state.recap?' · RESULTS READY':''}</p>`:''}<button class="btn ${state.started?'':'primary'}" id="new-game">${state.started?'New career':'Start your promotion'} <span>→</span></button>${state.started?`<button class="btn" id="title-backup">Back up career to Files</button>`:''}<button class="btn" id="title-restore">Restore a backup</button><button class="text-btn" id="title-opening">Watch the opening</button><button class="text-btn" id="title-guide">How to play ↗</button></div></div><div class="title-cast" aria-label="Featured wrestlers">${[4,10,17].map((id,i)=>`<div class="title-wrestler title-wrestler-${i}"><div>${portrait(w(id))}</div><strong>${esc(w(id).name)}</strong><span>${w(id).role.toUpperCase()}</span></div>`).join('')}</div></section>${webAppPanel(true)}<div class="title-footer"><span>CAREER MODE · SAVES ON THIS DEVICE</span></div></main>`;
 $('#new-game').onclick=()=>{const start=()=>{requestCareerPersistence();state=fresh();state.started=true;view='home';onTitle=false;document.body.classList.remove('at-title');render();window.scrollTo(0,0);openOpening()};if(state.started){modal('Start a new career?',`<p class="note">This replaces the career saved on this device. Use Back up career to Files on the title screen to keep a copy first.</p>`,(_,dialog)=>{dialog.close();start()},'Start new career')}else start()};
 if($('#continue-game'))$('#continue-game').onclick=()=>{requestCareerPersistence();onTitle=false;document.body.classList.remove('at-title');render();window.scrollTo(0,0)};
 if($('#title-backup'))$('#title-backup').onclick=exportCareer;
 $('#title-restore').onclick=importCareer;
 $('#title-guide').onclick=guide;
 $('#title-opening').onclick=()=>openOpening();
}
async function exportCareer(){
 const content=JSON.stringify({game:'Sturgeon Bay Slam: Rise to Supremacy',version:1,savedAt:new Date().toISOString(),state},null,2),name=`sturgeon-bay-slam-week-${state.week}.json`,blob=new Blob([content],{type:'application/json'});
 if(typeof File==='function'&&navigator.share&&navigator.canShare){
  const file=new File([blob],name,{type:'application/json'});
  if(navigator.canShare({files:[file]})){
   try{await navigator.share({files:[file],title:'Sturgeon Bay Slam: Rise to Supremacy career backup'});toast('Career backup shared. Keep a copy in Files.');return}
   catch(error){if(error.name==='AbortError')return}
  }
 }
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast('Career backup downloaded. Keep it somewhere safe.');
}
function validateCareer(data){
 const s=['Sturgeon Bay Slam: Rise to Supremacy','Sturgeon Bay Slam','Brawl in Boseman'].includes(data?.game)?data.state:null;
 const invalid=()=>{throw Error('Choose a valid Sturgeon Bay Slam: Rise to Supremacy career backup.')};
 if(!s||!Number.isInteger(s.week)||s.week<1||!Number.isFinite(s.cash)||!Number.isFinite(s.rep)||!Array.isArray(s.roster)||![34,initialRoster.length].includes(s.roster.length)||new Set(s.roster.map(r=>r.id)).size!==s.roster.length||!initialRoster.slice(0,s.roster.length).every(r=>s.roster.some(x=>x.id===r.id))||s.roster.some(r=>!['skill','charisma','pop','morale'].every(k=>Number.isFinite(r[k]))||!['Face','Heel'].includes(r.role)||r.performerType!=null&&r.performerType!=='human'||typeof r.name!=='string'||typeof r.gimmick!=='string'||['trust','momentum','lastSeen','lastDebut'].some(key=>r[key]!=null&&!Number.isFinite(r[key])))||s.roster.filter(r=>r.champ).length!==1||!Array.isArray(s.card)||s.card.length<4||s.card.length>7||!Array.isArray(s.teams)||!Array.isArray(s.history)||!s.rivalries||!s.crowd||!['chaos','drama','purists'].every(k=>Number.isFinite(s.crowd[k])))invalid();
 const validId=id=>s.roster.some(r=>r.id===id),validSegment=segment=>segment&&(!segment.kind||['match','promo'].includes(segment.kind))&&matchPeople(segment).every(validId)&&[segment.target,segment.interferer].every(id=>id==null||validId(id))&&(!segment.prop||Object.hasOwn(SHOW_PROPS,segment.prop));
 if(s.card.some(segment=>!validSegment(segment)||segment.kind&&!segment.draft&&bookingProblems(segment).length)||s.teams.some(t=>![t.a,t.b].every(validId)||t.a===t.b||!Number.isFinite(t.chemistry)||typeof t.name!=='string'))invalid();
 if(s.drafts&&(typeof s.drafts!=='object'||Object.entries(s.drafts).some(([index,draft])=>!['0','1','2','3','4','5','6'].includes(index)||draft&&!validSegment(draft))))invalid();
 if(s.stories&&(typeof s.stories!=='object'||Object.values(s.stories).some(story=>!Array.isArray(story.participants)||story.participants.length!==2||!story.participants.every(validId)||!Number.isFinite(story.heat)||!STORY_PHASES.includes(story.phase)||typeof story.grievance!=='string'||typeof story.lastBeat!=='string'||!Number.isInteger(story.lastWeek))))invalid();
 if(s.promises&&(!Array.isArray(s.promises)||s.promises.some(p=>!validId(p.actor)||p.target!=null&&!validId(p.target)||!['win','appearance','team','rematch','promo','title'].includes(p.kind)||['team','rematch'].includes(p.kind)&&p.target==null||!['open','kept','broken'].includes(p.status)||!Number.isInteger(p.due))))invalid();
 if(s.challenges&&(!Array.isArray(s.challenges)||s.challenges.some(c=>!validId(c.actor)||!validId(c.target)||typeof c.id!=='string'||!['open','declined','booked'].includes(c.status))))invalid();
 if(s.incidents&&(!Array.isArray(s.incidents)||s.incidents.some(i=>typeof i.text!=='string'||!Number.isInteger(i.week))))invalid();
 if(s.arc&&(!Number.isInteger(s.arc.start)||!s.arc.answered||typeof s.arc.answered!=='object'))invalid();
 if(s.plans&&(typeof s.plans!=='object'||Object.values(s.plans).some(value=>typeof value!=='string')))invalid();
 if(s.production&&(!Number.isInteger(s.production.week)||s.production.choice!=null&&!['safe','wild','crew'].includes(s.production.choice)))invalid();
 if(s.production?.issueId&&!allProductionIssues().some(issue=>issue.id===s.production.issueId))invalid();
 if(s.weeklyBriefing){
  const b=s.weeklyBriefing;
  if(!Number.isInteger(b.week)||b.week<1||b.week>s.week||typeof b.completed!=='boolean'||!allProductionIssues().some(issue=>issue.id===b.issueId)||!b.request||!validId(b.request.actor)||b.requestChoice!=null&&!['rematch','earn','team','back','change','honest','commit','delay','reject','respect','revenge','yes','later','no','spotlight'].includes(b.requestChoice))invalid();
  if(b.week===s.week&&s.production?.issueId&&b.issueId!==s.production.issueId)invalid();
  if(b.week===s.week&&s.arc&&s.week>=s.arc.start&&s.week<s.arc.start+4&&b.request.actor!==10)invalid();
  if(b.completed&&b.week===s.week){const active=s.arc&&s.week>=s.arc.start&&s.week<s.arc.start+4;if(s.production?.week!==s.week||!s.production.choice||!(active?s.arc.answered?.[s.week]:s.backstage?.[s.week]))invalid()}
 }
 if(s.rise&&(typeof s.rise!=='object'||['wins','losses','crew','traditions','moves','originals'].some(key=>s.rise[key]!=null&&!Array.isArray(s.rise[key]))||(s.rise.crew||[]).some(id=>!CREW.some(c=>c.id===id))||(s.rise.traditions||[]).some(id=>!Object.hasOwn(TRADITIONS,id))||(s.rise.originals||[]).some(id=>!validId(id))||s.rise.fights&&(typeof s.rise.fights!=='object'||Object.values(s.rise.fights).some(f=>!['fight','move','raid'].includes(f?.choice)))))invalid();
 if(s.backstage&&(typeof s.backstage!=='object'||Object.values(s.backstage).some(record=>record.actor!=null&&!validId(record.actor))))invalid();
 if(s.seasonReports&&!Array.isArray(s.seasonReports))invalid();
 if(s.progression){
  const p=s.progression;
  if(!Number.isInteger(p.stage)||p.stage<0||p.stage>=CAREER_STAGES.length||!Number.isInteger(p.stageStart)||p.stageStart<1||p.stageStart>s.week+1||typeof p.dynasty!=='boolean'||!Array.isArray(p.achievements)||!p.seasons||typeof p.seasons!=='object'||Array.isArray(p.seasons))invalid();
  if(p.offerWeek!=null&&(!Number.isInteger(p.offerWeek)||p.offerWeek<1||p.offerWeek>s.week||p.offerWeek%12!==0||p.dynasty||p.offerWeek<=(p.achievements.at(-1)?.week||0)))invalid();
  if(p.achievements.length!==(p.dynasty?8:p.stage)||p.dynasty&&p.stage!==7||p.achievements.some((a,i)=>a.stage!==i||!Number.isInteger(a.week)||a.week<1||a.week>s.week||a.week%12!==0||i>0&&a.week<=p.achievements[i-1].week||typeof a.name!=='string')||Object.entries(p.seasons).some(([season,strategy])=>!/^\d+$/.test(season)||Number(season)<1||!Object.hasOwn(SEASON_STRATEGIES,strategy)))invalid();
 }

 if(s.preferences&&(!['instant','typewriter'].includes(s.preferences.text)||!['concise','full'].includes(s.preferences.presentation)||s.preferences.easyMode!=null&&typeof s.preferences.easyMode!=='boolean'))invalid();
 if(s.relations){
  const rel=s.relations,isObject=value=>value&&typeof value==='object'&&!Array.isArray(value);
  if(!isObject(rel)||['style','routes','sore','visits','lastInvited'].some(key=>rel[key]!=null&&!isObject(rel[key]))||Object.values(rel.style||{}).some(value=>!Number.isFinite(value))||Object.keys(rel.sore||{}).some(id=>!validId(Number(id))))invalid();
  if(rel.week!=null&&(!isObject(rel.week)||!Number.isInteger(rel.week.week)||!Array.isArray(rel.week.invites)||!Array.isArray(rel.week.spent)||!isObject(rel.week.answers)||rel.week.invites.some(invite=>!validId(invite.actor)||typeof invite.id!=='string'||typeof invite.beat!=='string')))invalid();
  for(const [id,route] of Object.entries(rel.routes||{}))if(!(validId(Number(id))||typeof FEATURED_ROUTES==='object'&&Object.hasOwn(FEATURED_ROUTES,id))||!isObject(route)||route.memories!=null&&!Array.isArray(route.memories)||route.ending!=null&&!['best','neutral','bad'].includes(route.ending)||route.ask!=null&&(!isObject(route.ask)||!['accepted','deferred','declined'].includes(route.ask.status)))invalid();
  if(rel.jealous!=null&&(!isObject(rel.jealous)||Object.entries(rel.jealous).some(([id,note])=>!validId(Number(id))||!isObject(note)||!validId(note.of)||!Number.isInteger(note.week))))invalid();
  if(rel.epilogues!=null&&(!Array.isArray(rel.epilogues)||rel.epilogues.some(e=>!isObject(e)||!Number.isInteger(e.era)||!Array.isArray(e.cards)||e.cards.some(c=>!isObject(c)||!validId(c.id)||!['best','neutral','bad'].includes(c.tier)))))invalid();
  if(rel.results!=null&&(!isObject(rel.results)||!Array.isArray(rel.results.won)||!Array.isArray(rel.results.lost)))invalid();
 }
 if(s.liveShow&&(!Array.isArray(s.liveShow.moments)||s.liveShow.moments.length!==s.card.length||s.liveShow.moments.length<4||s.liveShow.moments.length>7||!Array.isArray(s.liveShow.answers)||!Number.isInteger(s.liveShow.index)||s.liveShow.index<0||s.liveShow.index>=s.liveShow.moments.length))invalid();
 return s;
}
function importCareer(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;document.body.append(input);input.oncancel=()=>input.remove();input.onchange=async()=>{try{const file=input.files[0];if(!file)return;if(file.size>20000000)throw Error('That backup is too large.');const restored=validateCareer(JSON.parse(await file.text()));modal('Restore this career?',`<p class="note">Restore week ${restored.week} with ${restored.history.length} shows in its history? This replaces the career on this device.</p>`,(_,dialog)=>{state=mergeRosterExpansion(restored);state.started=true;view=state.view||'book';onTitle=false;document.body.classList.remove('at-title');dialog.close();render();window.scrollTo(0,0);toast('Career restored. Welcome back, boss.')},'Restore career')}catch(error){toast(error.message)}finally{input.remove()}};input.click()}
// Undo is session-only and scoped to the exact card and career it changed.
let bookingUndo=null;
function bookingFingerprint(){return JSON.stringify([state.card,state.drafts])}
function canUndoBooking(){return !!bookingUndo&&bookingUndo.career===state&&bookingUndo.week===state.week&&bookingUndo.after===bookingFingerprint()}
function clearBooking(index,draftOnly=false){
 const previous={card:structuredClone(state.card[index]),draft:state.drafts[index]?structuredClone(state.drafts[index]):null};
 if(!draftOnly)state.card[index]={kind:null};
 delete state.drafts[index];
 bookingUndo={career:state,week:state.week,index,previous,after:bookingFingerprint(),draftOnly};
}
function undoBooking(){
 if(!canUndoBooking())return false;
 const {index,previous}=bookingUndo;state.card[index]=previous.card;
 if(previous.draft)state.drafts[index]=previous.draft;else delete state.drafts[index];
 bookingUndo=null;return true;
}
function bookingUndoPanel(){return canUndoBooking()?`<div class="undo-banner" role="status"><span>${bookingUndo.draftOnly?'Draft discarded.':'Segment '+(bookingUndo.index+1)+' cleared.'}</span><button class="btn small" id="undo-booking">Undo</button></div>`:''}
function focusBookingSegment(index){const el=document.querySelector(`[data-poster-bout="${index}"]`)||document.querySelector('#segment-'+index);if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',behavior:'auto'})}}
function moveBooking(index,direction){
 const next=index+direction;if(next<0||next>=state.card.length)return null;
 [state.card[index],state.card[next]]=[state.card[next],state.card[index]];
 const draft=state.drafts[index],other=state.drafts[next];
 delete state.drafts[index];delete state.drafts[next];
 if(other)state.drafts[index]=other;if(draft)state.drafts[next]=draft;
 bookingUndo=null;return next;
}
function bindCareerControls(){
 document.querySelectorAll('[data-title-menu]').forEach(button=>button.onclick=()=>{onTitle=true;render();window.scrollTo(0,0)});
 document.querySelectorAll('[data-clear],[data-discard-draft]').forEach(button=>button.onclick=()=>{const index=Number(button.dataset.clear??button.dataset.discardDraft);const previouslyReserved=playedWrestlerIds();clearBooking(index,button.hasAttribute('data-discard-draft'));returnToBooking(index,'Booking updated. Undo is available above the card.',previouslyReserved)});
 if($('#undo-booking'))$('#undo-booking').onclick=()=>{const index=bookingUndo?.index;if(undoBooking()){render();focusBookingSegment(index);toast('Booking restored.')}};
 document.querySelectorAll('[data-move]').forEach(button=>button.onclick=()=>{const [i,d]=button.dataset.move.split(':').map(Number),j=moveBooking(i,d);if(j==null)return;render();focusBookingSegment(j);document.querySelector(`[data-move="${j}:${d}"]:not(:disabled)`)?.focus({preventScroll:true});toast('Moved to segment '+(j+1)+'.')});
 if($('#export-career'))$('#export-career').onclick=exportCareer;if($('#import-career'))$('#import-career').onclick=importCareer;
}
