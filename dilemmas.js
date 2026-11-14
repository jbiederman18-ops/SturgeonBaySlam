'use strict';

const TUNNEL_OF_LOVE='The Grinch’s Tunnel of Love';
const KILL_POLANSKI='Kill Polanski';
const DEMETER_ID=38;
const FOX_GUEST_ID=39;
const FOX_GUEST={id:FOX_GUEST_ID,name:'Fox Valley’s Casey Vale',role:'Face',skill:70,charisma:56,pop:54,morale:70,momentum:0,trust:55,lastSeen:0,color:'#537781',gimmick:'Visiting Fox Valley wrestler',performerType:'human'};
const RON_RALLY='Campaign Rally', RON_TOWN_HALL='Town Hall Q&A';
function foxValleyGuest(){
 const d=dilemmaData();
 return d.foxGuest??=structuredClone(FOX_GUEST);
}
function foxValleyWeek(week=state.week){const deal=state.dilemmas?.foxValley;return deal?.week===week?deal:null}
function foxValleyMatch(s){return s.kind==='match'&&s.dilemma==='fox-valley'&&matchPeople(s).includes(FOX_GUEST_ID)}
function foxValleyJoint(card=state.card){return foxValleyWeek()?.kind==='joint'&&card.some(foxValleyMatch)}
function forceDQ(segment){if(segment.finish==='No contest')segment.winner=segment.a;segment.finish='Disqualification'}

const DEMETER={id:DEMETER_ID,name:'Demeter',gimmick:'Greek’s leading man',role:'Face',skill:39,charisma:65,pop:55,morale:65,momentum:0,trust:55,color:'#9d7d54',performerType:'human'};
const DILEMMA_PROPS={
 ultraBroom:{name:'The UltraBroom',owner:10,cost:0,hint:'Sweeps has time to help prepare another segment.'},
 solidBroom:{name:'SolidBroom Plus',owner:10,cost:0,hint:'Sweeps gets his entrance ready in time.'}
};

function dilemmaDefaults(s){
 s.dilemmas??={};
 const d=s.dilemmas;
 d.done??={};d.queue??=[];d.absent??={};d.holds??='both';
 return d;
}
function dilemmaData(){return dilemmaDefaults(state)}
function dilemmaTrust(id,delta){if(w(id))offstageTrust(w(id),delta)}
function dilemmaNote(text,ids=[]){return incident(text,ids,'dilemma')}
function dilemmaRoll(key,odds){
 // Stable across reloads, with separate outcomes for each choice and career week.
 let hash=2166136261;
 for(const c of `${dilemmaData().seed??=Math.floor(Math.random()*4294967296)}:${state.week}:${key}`)hash=Math.imul(hash^c.charCodeAt(0),16777619);
 return (hash>>>0)/4294967296<odds;
}
function dilemmaUnavailable(id,week=state.week){
 const until=state.dilemmas?.absent?.[id];
 return Number.isInteger(until)&&week<=until;
}
function dilemmaOut(id,weeks){const d=dilemmaData();d.absent[id]=Math.max(d.absent[id]||0,state.week+weeks)}
function dilemmaAngry(id){return w(id).trust<45}
function dilemmaFollow(id,due=state.week,data={}){
 dilemmaData().queue.push({id,due,...data});
}
function dilemmaOpponent(id){
 const booked=state.card.find(s=>s.kind==='match'&&matchPeople(s).includes(id));
 return (booked&&matchOpponents(booked,id).find(other=>other!==DEMETER_ID))??state.roster.filter(r=>r.id!==id&&!dilemmaUnavailable(r.id)).sort((a,b)=>b.lastSeen-a.lastSeen||b.pop-a.pop)[0]?.id;
}
function dilemmaMatch(a,b,type='Singles match'){
 return {...blankBooking('match'),format:'singles',sides:[[a],[b]],a,b,winner:a,type};
}
function dilemmaPromo(a,target=null,scene='Solo address',concept=''){
 return {...blankBooking('promo'),a,target,scene,concept,hook:'Win the crowd'};
}
// Preserve displaced bookings for review. An interrupted or unavailable segment is never simulated.
function dilemmaBook(segment,key,{opener=false,replace=null}={}){
 const d=dilemmaData(),ids=matchPeople(segment);
 if(ids.some(dilemmaUnavailable))return false;
 const existing=state.card.findIndex(s=>s.dilemma===key&&ids.every(id=>matchPeople(s).includes(id)));
 if(existing>=0)return true;
 const open=state.card.findIndex((s,i)=>!s.kind&&!state.drafts[i]);
 const exact=state.card.findIndex(s=>s.kind===segment.kind&&matchPeople(s).length===ids.length&&ids.every(id=>matchPeople(s).includes(id)));
 const index=opener?0:exact>=0?exact:open>=0?open:replace??state.card.length-1;
 const next=structuredClone(segment);
 if(exact===index&&segment.kind==='match'){
  next.winner=state.card[index].winner;
  next.title=!!state.card[index].title;
 }
 if(state.card[index].kind||state.drafts[index]){
  d.displaced??=[];
  d.displaced.push({week:state.week,segment:state.card[index],draft:state.drafts[index]||null});
 }
 state.card[index]={...next,dilemma:key};
 delete state.drafts[index];
 return true;
}
function dilemmaAwayNow(id,weeks){
 dilemmaOut(id,weeks);
 state.card.forEach((s,index)=>{
  const draft=state.drafts[index];
  if(!matchPeople(s).includes(id)&&!(draft&&matchPeople(draft).includes(id)))return;
  const d=dilemmaData();
  d.displaced??=[];d.displaced.push({week:state.week,segment:s,draft:draft||null});
  if(matchPeople(s).includes(id))state.card[index]={kind:null};
  delete state.drafts[index];
 });
}
function dilemmaNameTowers(){
 const d=dilemmaData(),r=w(1);
 d.towers={week:state.week,name:r.name,gimmick:r.gimmick};
 r.name='2 Towers';r.gimmick='Cannot be toppled';
}
function dilemmaRejectTowers(){
 dilemmaTrust(1,-4);
 if(dilemmaAngry(1))dilemmaData().towersInterruption=state.week;
 else dilemmaNote('2 Holds pulls the new nameplate off his locker and goes back to Hold One.',[1]);
}
function dilemmaTowersFallout(fallout){
 const d=dilemmaData();
 if(d.towers?.week!==state.week||d.towers.resolved)return 0;
 d.towers.resolved=true;
 w(1).pop=clamp(w(1).pop-14);
 dilemmaOut(1,4);
 dilemmaFollow('towers-press',state.week+1);
 fallout.push(dilemmaNote('The room went quiet for 2 Towers. He will miss the next four shows and return as the Man of 2 Holds.',[1]));
 return -7;
}
function dilemmaAdvance(){
 const d=dilemmaData();
 if(d.towers&&d.towers.week<state.week){
  Object.assign(w(1),{name:d.towers.name,gimmick:d.towers.gimmick});
  delete d.towers;
 }
 if(d.trainingReturn===state.week)dilemmaNote('2 Holds is back from the barn. “They called it a different hold. You can tell by the way it’s Hold Two.”',[1]);
}

function dilemmaScene(title,line,choices){return {title,line,choices}}
function dilemmaChoice(label,apply){return {label,apply}}

function dilemmaLemonAnswer(){
 const d=dilemmaData();
 if(d.lemon)return d.lemon;
 if((storyFor(20,23)?.heat||0)>=30)return 'friend';
 if(w(23).trust>=65&&w(20).trust>=65)return 'interested';
 return 'unsure';
}
function dilemmaFetch(keepPlaying){
 const bad=dilemmaRoll(`park-${keepPlaying}`,keepPlaying?.55:w(37).trust>=65?.15:.45);
 if(bad){
  dilemmaTrust(1,-7);developStory(37,1,13,'The Dog went after 2 Holds in the park.');
  dilemmaNote('2 Holds comes back from the park furious. The Dog is still looking for the ball.',[37,1]);
 }else dilemmaNote(keepPlaying?'The Dog keeps his eye on the ball as 2 Holds walks past.':'The Dog comes when you call, slowly, carrying the ball.',[37,1]);
}

function dilemmaSpendEvening(actor){
 const week=ensureWeekAhead();
 const day=weekNights(week).find(day=>!nightSpentOn(day,week));
 if(!day||!eveningsLeft())return false;
 const id=`${state.week}-dilemma-evening-${week.spent.length}`;
 week.invites.push({id,actor:0,beat:'visit-0',day,dilemmaEvening:actor});
 week.answers[id]={reply:0};week.spent.push(id);
 return true;
}
function dilemmaTask(){
 if(!state.started||state.liveShow||state.recap||state.week<2)return null;
 const d=dilemmaData();
 const due=d.queue.filter(task=>task.due<=state.week&&(!dilemmaUnavailable(DILEMMAS[task.id].actor)||['towers-press','ring-replacement','owner-declined'].includes(task.id)));
 const next=due.find(task=>task.id==='ring-replacement')||due[0];
 if(next)return next;
 if(d.lastOffer===state.week)return null;
 const id=Object.keys(DILEMMAS).filter(key=>{
  const entry=DILEMMAS[key];
  return entry.week!=null&&state.week>=entry.week&&!d.done[key]&&!dilemmaUnavailable(entry.actor)&&(!entry.ready||entry.ready());
 }).sort((a,b)=>DILEMMAS[a].week-DILEMMAS[b].week)[0];
 return id?{id,due:state.week,new:true}:null;
}
function dilemmaAnswer(task,index){
 const current=dilemmaTask();
 if(!task||!current||(task.new?current.id!==task.id||!current.new:current!==task))return false;
 const d=dilemmaData(),choice=DILEMMAS[task.id].scene(task).choices[index];
 if(!choice||choice.disabled)return false;
 if((task.id==='demeter-rehearsal'&&index===0||task.id==='lemon-answer'&&task.direct)&&!dilemmaSpendEvening(task.id==='lemon-answer'?23:0))return false;
 if(task.new){d.done[task.id]=state.week;d.lastOffer=state.week}
 else d.queue.splice(d.queue.indexOf(task),1);
 choice.apply();
 return true;
}
function dilemmaPanel(){
 const task=dilemmaTask(),d=dilemmaData();
 const displaced=d.displaced?.filter(entry=>entry.week===state.week)||[];
 const pending=displaced.length?`<p>${displaced.length} displaced booking${displaced.length===1?'':'s'} to review.</p><button class="btn" type="button" data-dilemma-displaced>Review displaced bookings</button>`:'';
 const notices=[];
 if(d.commissioner?.guest&&d.commissioner.changed===state.week)notices.push(d.commissioner.change);
 if(d.dqWeek===state.week)notices.push('Ron’s ruling: matches end by disqualification where the rules allow it.');
 if(d.commissioner?.start<=state.week&&state.week<=d.commissioner.end)notices.push(d.commissioner.guest?'Ron is tonight’s guest GM.':`Commissioner Toledo’s ruling: ${dilemmaRonRule()}.`);
 if(d.demeter&&!d.demeter.finished)notices.push(`Greek vs. Demeter is due on the big show in week ${d.demeter.due}.`);
 if(!task&&!pending&&!notices.length)return '';
 return `<section class="card booker-pitch" aria-label="Wrestler requests"><h3>At the booker’s door</h3>${task?`<p>${esc(w(DILEMMAS[task.id].actor).name)} has a decision for you.</p><button class="btn primary" type="button" data-dilemma-open>Hear them out</button>`:''}${notices.map(line=>`<p>${esc(line)}</p>`).join('')}${pending}</section>`;
}
function dilemmaPrompt(title,line,choices,answer){
 modal(esc(title),`<p class="note">${esc(line)}</p><div class="segment-kind-choices">${choices.map((choice,i)=>`<button type="button" data-dilemma-option="${i}"${choice.disabled?' disabled':''}>${esc(choice.label)}</button>`).join('')}</div>`,()=>{},'');
 const dialog=$('#modal');
 dialog.querySelector('.modal-actions').hidden=true;
 dialog.querySelectorAll('[data-dilemma-option]').forEach(button=>button.onclick=()=>{
  if(answer(Number(button.dataset.dilemmaOption))===false)return;
  dialog.close();render();
 });
}
function dilemmaOpen(){
 const task=dilemmaTask();if(!task)return;
 const {title,line,choices}=DILEMMAS[task.id].scene(task);
 dilemmaPrompt(title,line,choices,index=>{
  if(!dilemmaAnswer(task,index)){toast('No free evening remains this week.');return false}
  return true;
 });
}
function dilemmaDisplaced(){
 const d=dilemmaData(),entry=d.displaced?.find(x=>x.week===state.week);
 if(!entry)return;
 const segment=entry.draft||entry.segment;
 const people=matchPeople(segment);
 const slots=state.card.flatMap((s,i)=>!s.kind&&!state.drafts[i]?[i]:[]);
 const canMove=people.every(id=>!dilemmaUnavailable(id));
 const choices=[...slots.map(i=>({label:`Move to segment ${i+1}`,disabled:!canMove})),{label:'Drop this booking'}];
 dilemmaPrompt('A displaced booking',people.map(id=>w(id).name).join(' vs. ')||'Unfinished booking',choices,index=>{
  if(index<slots.length){
   const slot=slots[index];
   if(entry.draft)state.drafts[slot]=entry.draft;
   if(entry.segment?.kind)state.card[slot]=entry.segment;
  }
  d.displaced.splice(d.displaced.indexOf(entry),1);
 });
}
function dilemmaBind(){
 const open=$('[data-dilemma-open]'),displaced=$('[data-dilemma-displaced]');
 if(open)open.onclick=dilemmaOpen;
 if(displaced)displaced.onclick=dilemmaDisplaced;
 document.querySelectorAll('[data-dilemma-live]').forEach(b=>b.onclick=()=>dilemmaResolveLive(Number(b.dataset.dilemmaLive),Number(b.dataset.index)));
}
function dilemmaAllowsDQ(s){
 return ['Singles match','Submission match','Steel cage'].includes(matchRuleName(s))&&matchFormat(s)!=='royal';
}
function dilemmaRonRule(){
 const c=dilemmaData().commissioner;
 return ['equal time for both sides','no seconds at ringside','a standard rules main event'][state.week-c.start];
}
function dilemmaScheduleCard(){
 const d=dilemmaData(),guest=d.demeter,deal=foxValleyWeek();
 if(deal&&deal.kind!=='truce'&&!state.card.some(foxValleyMatch)){
  const slot=state.card.findLastIndex(s=>!s.dilemma);
  const occupied=new Set([...state.card,...Object.values(state.drafts)].filter(Boolean).flatMap(matchPeople));
  const home=state.roster.find(r=>!occupied.has(r.id)&&!dilemmaUnavailable(r.id));
  if(slot>=0&&home)dilemmaBook(dilemmaMatch(home.id,FOX_GUEST_ID),'fox-valley',{replace:slot});
 }
 if(guest&&!guest.finished&&guest.due<=state.week&&isEvent()){
  if(dilemmaUnavailable(0)){guest.due=state.week+4;const rehearsal=d.queue.find(task=>task.id==='demeter-rehearsal');if(rehearsal)rehearsal.due=guest.due;}
  else dilemmaBook(dilemmaMatch(0,DEMETER_ID),'demeter');
 }
 const c=d.commissioner;
 if(c&&c.start<=state.week&&c.end>=state.week&&c.booked!==state.week&&!dilemmaUnavailable(31)){
  if(dilemmaBook(dilemmaPromo(31,null,'Solo address',c.guest?'The floor recognizes its guest general manager.':`The commission calls for ${dilemmaRonRule()}.`),'commissioner',{opener:true}))c.booked=state.week;
 }
 dilemmaGuestGM();
}
function dilemmaShowProblems(){
 const d=dilemmaData(),issues=[];
 const broken=state.card.findIndex(s=>[...matchPeople(s),s.interferer].some(id=>id!=null&&dilemmaUnavailable(id)));
 if(broken>=0)issues.push({index:broken,text:'Replace the wrestler who is unavailable for this show.'});
 if(d.dqWeek===state.week)for(const [index,s] of state.card.entries())if(s.kind==='match'&&!dilemmaAllowsDQ(s))issues.push({index,text:'Ron requires rules that allow a disqualification.'});
 if(foxValleyWeek()&&foxValleyWeek().kind!=='truce'&&!state.card.some(foxValleyMatch))issues.push({index:0,text:'Restore the promised Fox Valley guest match before doors.'});
 if(d.broomAngle===state.week&&!state.card.some(s=>s.dilemma==='broom-angle'&&[10,20].every(id=>matchPeople(s).includes(id))))issues.push({index:0,text:'Restore the Sweeps and Grinch angle before doors.',dilemma:'broom-angle'});
 if(d.queue.some(task=>task.id==='ring-replacement'&&task.due<=state.week))issues.push({index:0,text:'Talk to Bev about a replacement ring before doors.',dilemma:true});
 const c=d.commissioner;
 if(c?.booked===state.week&&!c.guest){
  if(state.week-c.start===1){const index=state.card.findIndex(s=>s.second!=null||s.interferer!=null&&s.finish==='Interference');if(index>=0)issues.push({index,text:'Commissioner Toledo ruled out ringside seconds tonight.'});}
  if(state.week-c.start===2&&state.card.at(-1).kind==='match'&&state.card.at(-1).type!=='Singles match')issues.push({index:state.card.length-1,text:'Commissioner Toledo requires standard rules in the main event.'});
 }
 return issues;
}
function dilemmaGuestGM(){
 const c=state.dilemmas?.commissioner;
 if(!c?.guest||c.booked!==state.week||c.changed===state.week)return;
 const segment=state.card.find(s=>s.kind==='match'&&s.finish!=='No contest'&&s.finish!=='Clean finish'&&!dilemmaDQActive())||state.card.find(s=>s.kind==='match');
 if(!segment)return;
 if(segment.finish!=='No contest'&&segment.finish!=='Clean finish'&&!dilemmaDQActive())segment.finish='Clean finish';
 else segment.presentation='Competitive';
 c.changed=state.week;
 c.change=`Guest GM Toledo has ruled on ${matchPeople(segment).map(id=>w(id).name).join(' vs. ')}: ${segment.finish}, competitive presentation.`;
 dilemmaNote(c.change,[31]);
}
function dilemmaPrepareShow(){
 if(dilemmaDQActive())for(const segment of state.card)if(segment.kind==='match')forceDQ(segment);
 dilemmaGuestGM();
}
function dilemmaLiveCalls(){
 const d=dilemmaData(),jobs=[];
 if(d.towersInterruption===state.week&&!dilemmaUnavailable(1))jobs.push('towers');
 if(d.tunnelInterruption===state.week&&!dilemmaUnavailable(20)&&!dilemmaUnavailable(23))jobs.push('tunnel');
 if(d.dqInterruption===state.week&&!dilemmaUnavailable(31))jobs.push('dq');
 if(d.forbidden===state.week&&state.card.some(s=>s.kind==='match'&&matchPeople(s).includes(0)))jobs.push('forbidden');
 if(d.tea===state.week&&state.card.some(s=>matchPeople(s).includes(18)))jobs.push('tea');
 return jobs.slice(0,2);
}
function dilemmaLivePage(){
 const live=state.liveShow,id=live?.dilemmaCalls?.[live.dilemmaIndex||0],scene=DILEMMA_LIVE[id];
 if(!scene)return '';
 return `<section class="live-wrap exchange-wrap" aria-labelledby="live-heading"><span class="live-label">ON AIR · WEEK ${state.week}</span><h1 id="live-heading" tabindex="-1">${esc(scene.title)}</h1><p>${esc(scene.line)}</p><div class="segment-kind-choices">${scene.choices.map((label,i)=>`<button class="btn" type="button" data-dilemma-live="${i}" data-index="${live.dilemmaIndex||0}">${esc(label)}</button>`).join('')}</div></section>`;
}
function dilemmaResolveLive(choice,index){
 const live=state.liveShow;
 if(!live||index!==(live.dilemmaIndex||0)||![0,1].includes(choice))return;
 const id=live.dilemmaCalls?.[index];
 if(!Object.hasOwn(DILEMMA_LIVE,id))return;
 const d=dilemmaData();
 live.dilemmaIndex=index+1;
 if(id==='towers'){
  if(choice)dilemmaNameTowers();
  else{dilemmaTrust(1,-8);dilemmaNote('You cut the announcement. 2 Holds takes the sign back to the barn.',[1]);}
 }
 if(id==='tunnel'){
  if(choice){
   d.tunnelLive=state.week;
   dilemmaNote('The Grinch asks Lemon Tart out in front of the crowd, then hands her the microphone.',[20,23]);
  }
  else{dilemmaTrust(20,-7);dilemmaFollow('lemon-answer',state.week+1,{direct:true});dilemmaNote('You cut the mic. Lemon Tart asks to talk backstage.',[20,23]);}
 }
 if(id==='dq'){
  if(choice){
   for(const segment of state.card)if(segment.kind==='match')forceDQ(segment);
   dilemmaNote('Ron’s objections force disqualifications through the card.',[31]);
  }else{dilemmaTrust(31,-8);dilemmaNote('The crew keeps Ron backstage. The advertised finishes go ahead.',[31]);}
 }
 if(id==='forbidden'){
  if(choice)d.forbiddenLive=state.week;
  else{dilemmaTrust(0,-7);dilemmaNote('Greek backs off when you wave him away from the Forbidden Move.',[0]);}
 }
 if(id==='tea'){
  if(choice)d.teaLive=state.week;
  else{dilemmaTrust(18,-6);dilemmaNote('Charming puts the cup down and reads the front row a complaint instead.',[18]);}
 }
 // Re-stage the reported calls after a live ruling changes names or finishes.
 live.moments=state.card.map((s,i)=>s.kind==='promo'?promoMoment(s,i):matchMoment(s,i));
 live.answers=live.moments.map((m,i)=>autoCall(m,state.card[i],i));
 if(live.dilemmaIndex>=live.dilemmaCalls.length){finishLiveShow();return}
 render();focusLiveHeading();
}
function dilemmaMatchFlavor(s){
 if(s.kind!=='match'||!matchPeople(s).includes(1))return null;
 return dilemmaData().holds==='one'?'He goes straight back to Hold One. The crowd is still waiting for Hold Two.':null;
}
function dilemmaSegment(s,index,notes,fallout,crowd){
 const d=dilemmaData(),ids=matchPeople(s);
 const note=(line,people=ids)=>{notes.push(line);fallout.push(dilemmaNote(line,people))};
 let quality=0;
 if(s.kind==='match'&&ids.includes(1)){
  if(d.holds==='one'){quality-=6;notes.push('Without Hold Two, the match has one fewer gear.');}
  if(d.holds==='retrained'){quality+=4;notes.push('The time in the barn paid off.');}
  if(d.holdPop&&d.holdPop<=state.week){
   const opponent=matchOpponents(s,1)[0];dilemmaTrust(opponent,-6);crowd.chaos+=3;quality+=2;
   note('Hold Two gets the pop. The wrestler on the other end wants nothing to do with a rematch.',[1,opponent]);delete d.holdPop;
  }
 }
 if(s.dilemma==='demeter'&&ids.includes(DEMETER_ID)){
  const fine=dilemmaRoll('demeter',d.demeter?.rehearsed?.8:.35);quality+=fine?8:-15;
  note(fine?'Greek gets his shot. Demeter follows him from the entrance to the bell.':'Greek keeps calling for another take. Demeter can’t get back on cue.');
  if(d.demeter)d.demeter.finished=true;
 }
 if(s.dilemma==='broom-angle'&&ids.includes(20)){
  dilemmaOut(20,2);developStory(10,20,12,'Sweeps wrote the Grinch out of the show.');
  note('Sweeps gets his broom angle. The Grinch is off the next two shows.');
 }
 if(d.broomPrep?.week===state.week){
  const grade=d.broomPrep.grade,first=state.card.findIndex(segment=>matchPeople(segment).includes(10));
  if(index===first){quality+=grade==='old'?-3:3;notes.push(grade==='old'?'Sweeps was still cleaning during entrance rehearsal.':'Sweeps had time to rehearse his entrance.');}
  else if(grade==='ultra'&&index===(first===0?1:0)){quality+=3;notes.push('Sweeps finished early and helped prepare this segment.');}
 }
 if(d.forbiddenLive===state.week&&s.kind==='match'&&ids.includes(0)&&!d.forbiddenResolved){
  const opponent=matchOpponents(s,0)[0],injured=dilemmaRoll('forbidden',w(opponent).skill>=75?.3:.55);
  d.forbiddenResolved=true;dilemmaTrust(opponent,-10);
  if(injured)dilemmaOut(opponent,2);
  note(injured?`${w(opponent).name} is furious and will miss two shows after the Forbidden Move.`:`${w(opponent).name} gets through the Forbidden Move and is furious you allowed it.`,[0,opponent]);
 }
 if(d.teaLive===state.week&&ids.includes(18)&&!d.teaResolved){
  d.teaResolved=true;
  if(dilemmaRoll('hot-tea',.65)){crowd.drama+=4;quality+=4;note('Charming gets his boos and sends a thank-you note to the front row.');}
  else{d.teaBan=true;quality-=8;note('The show pauses. The venue bans ringside tea. Charming’s thank-you note arrives anyway.');}
 }
 if(s.scene===TUNNEL_OF_LOVE&&ids.includes(20)&&ids.includes(23)){
  dilemmaRomance(fallout);d.tunnelUnlocked=true;
 }
 if(d.liamDrunk?.week===state.week&&s.dilemma==='liam-drunk'){
  quality-=8;const opponent=d.liamDrunk.opponent;dilemmaTrust(opponent,-9);
  if(dilemmaRoll('liam-drunk-injury',.35))dilemmaOut(dilemmaRoll('liam-drunk-who',.5)?34:opponent,2);
  note(`${w(opponent).name} demands to know why you sent Liam out like that.`,[34,opponent]);
 }
 if(s.type===KILL_POLANSKI){
  quality+=9;if(dilemmaRoll('kill-polanski',.45)){dilemmaOut(0,2);note('Greek will miss two shows after Kill Polanski.',[0,34]);}
 }
 if(d.greekBrawl===state.week&&ids.includes(0)){quality-=5;notes.push('Greek is still feeling the backstage brawl.');}
 if(d.owner!=null&&s.kind==='match'&&ids.includes(37)&&s.second===d.owner&&!dilemmaUnavailable(d.owner)){
  quality+=2;notes.push(`${w(d.owner).name} seconds the Dog from ringside.`);
 }
 return quality;
}
function dilemmaRomance(fallout){
 const d=dilemmaData(),answer=dilemmaLemonAnswer();
 d.lemon=answer;
 if(d.romance)return;
 d.romance=answer;
 if(answer==='interested'){dilemmaTrust(20,6);dilemmaTrust(23,4);fallout.push(dilemmaNote('Lemon Tart says she’ll go out with him if he lets her pick where. The Grinch starts to ask the crowd and thinks better of it.',[20,23]));}
 else if(answer==='friend'){developStory(20,23,12,'Lemon Tart told the Grinch where she stood in front of the crowd.');fallout.push(dilemmaNote('Lemon Tart tells the Grinch she wants friendship. The Grinch takes the hearts down after the show.',[20,23]));}
 else fallout.push(dilemmaNote('Lemon Tart asks for time to think. The Grinch leaves a space in the paper chain.',[20,23]));
}
function dilemmaShowEnd(fallout){
 const d=dilemmaData();
 if(d.tunnelLive===state.week)dilemmaRomance(fallout);
 if(d.displaced)d.displaced=d.displaced.filter(entry=>entry.week>state.week);
 return dilemmaTowersFallout(fallout);
}

function dilemmaGuest(){return dilemmaData().guest??=structuredClone(DEMETER)}
function dilemmaDQActive(){return state.dilemmas?.dqWeek===state.week}
function dilemmaPromoScenes(segment){
 return [...PROMO_SCENES,...(segment?.a===31?[RON_RALLY,RON_TOWN_HALL]:[]),...(state.dilemmas?.tunnelUnlocked||segment?.scene===TUNNEL_OF_LOVE?[TUNNEL_OF_LOVE]:[])];
}
function dilemmaSecondOption(segment){
 const owner=state.dilemmas?.owner;
 if(owner==null||!matchPeople(segment).includes(37)||matchPeople(segment).includes(owner)||((dilemmaUnavailable(owner)||dilemmaSecondsBarred())&&segment.second==null))return '';
 return `<button class="sheet-chip" type="button" data-act="dog-second" aria-pressed="${segment.second===owner}">${esc(w(owner).name)} at ringside</button>`;
}

Object.assign(SHOW_PROPS,DILEMMA_PROPS);
ringPersonalities[FOX_GUEST_ID]={...ringPersonalities[0],style:'Fox Valley technician',tell:'checks both sets of ring ropes',bit:'makes sure the visitors get a fair shake'};
ringVoices[FOX_GUEST_ID]={...ringVoices[0]};
crowdHeckles[FOX_GUEST_ID]='FOX VALLEY!';

ringPersonalities[DEMETER_ID]={
 style:'First-time wrestler',move:'last-minute cover',counter:'rehearsed sidestep',
 tell:'looks for the camera before checking which corner is his',bit:'asks whether somebody called action',
 boast:'I was told there would be a rehearsal.',heart:'I’m going to need another take.'
};
ringVoices[DEMETER_ID]={
 subject:'the camera marks',open:'Is this the right corner?',reply:()=> 'I thought we were starting on the other side.',
 close:()=> 'Can we do that part one more time?',tagCall:'Is this my cue?'
};
crowdHeckles[DEMETER_ID]='RING THE BELL!';

function dilemmaSecondsBarred(){
 const c=state.dilemmas?.commissioner;
 return !!c&&!c.guest&&c.booked===state.week&&state.week===c.start+1;
}
function dilemmaLemonLine(){
 return {interested:'I’d go out with you. I get to pick where.',friend:'I like you as a friend. That’s where I stand.',unsure:'I need a little time to think. Can we start there?'}[dilemmaLemonAnswer()];
}
function validDilemmaState(d,validId){
 const record=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 return record(d)&&
  (d.done==null||record(d.done)&&Object.entries(d.done).every(([id,week])=>Object.hasOwn(DILEMMAS,id)&&Number.isInteger(week)))&&
  (d.queue==null||Array.isArray(d.queue)&&d.queue.every(task=>record(task)&&Object.hasOwn(DILEMMAS,task.id)&&Number.isInteger(task.due)&&(task.candidate==null||validId(task.candidate))))&&
  (d.absent==null||record(d.absent)&&Object.entries(d.absent).every(([id,week])=>validId(Number(id))&&Number.isInteger(week)))&&
  (d.foxGuest==null||record(d.foxGuest)&&d.foxGuest.id===FOX_GUEST_ID&&d.foxGuest.name===FOX_GUEST.name&&['skill','charisma','pop','morale','trust','momentum'].every(key=>Number.isFinite(d.foxGuest[key])))&&
  (d.foxValley==null||record(d.foxValley)&&['joint','guest','truce'].includes(d.foxValley.kind)&&Number.isInteger(d.foxValley.week))&&
  (d.holds==null||['both','one','retrained'].includes(d.holds))&&
  (d.owner==null||validId(d.owner))&&
  (d.towers==null||record(d.towers)&&typeof d.towers.name==='string'&&typeof d.towers.gimmick==='string'&&Number.isInteger(d.towers.week))&&
  (d.guest==null||record(d.guest)&&d.guest.id===DEMETER_ID&&d.guest.name===DEMETER.name&&['skill','charisma','pop','morale','trust','momentum'].every(key=>Number.isFinite(d.guest[key])));
}

function fixedShowMoment(segment,index,opening,beats,title){
 const choice={tag:title,title,detail:title,reason:'The segment followed the booking sheet.',outcome:beatStory(beats),beats,featured:beats[0]?.text,delta:0,option:0,segment:index};
 return {dialogueVersion:7,fixedScript:true,actors:matchPeople(segment),opening,setup:title,context:title,choices:[choice]};
}
function noContestMoment(segment,index){
 const opening=[ringBeat('commentary',matchPeople(segment).map(id=>w(id).name).join(' and ')+' trade holds. When both stop listening to the referee, the referee waves the match off.','action')];
 return fixedShowMoment(segment,index,opening,finishBeats(segment,{}).beats,'No contest');
}
function ronShowMoment(segment,index){
 const rally=segment.scene===RON_RALLY,prep=routeState(31).ask?.ronPrep;
 const endorsed=state.relations?.week?.week===state.week&&state.relations.week.answers?.[`${state.week}-31`]?.ronEndorsement;
 const say=text=>ringBeat(31,text),comment=text=>ringBeat('commentary',text,'action');
 const audience=text=>ringBeat('crowd',text,'speech');
 const opening=[comment(rally?(endorsed?'The booker endorses Ron Toledo and hands him the mic.':'Ron Toledo is introduced as a candidate for town board.'):'An aisle microphone goes out into the crowd.')];
 const beats=rally?[say('I won’t take sides. That includes the side of the auditorium that just booed.'),say('Please vote. If possible, please vote for me. I am told that asking is allowed.')]:[
  ...(prep==='moderated'?[comment('The booker gives the first question to a resident who waited outside the gym.')]:prep==='open'?[say('I abstained. The gym stayed locked, and people spent the night in their cars.')]:[]),
  audience('Why was the gym locked?'),say(prep?'I was waiting for another vote. Next time, I will open the gym.':'The motion failed. I abstained. I have the minutes, if that helps.'),
  audience('Who opens it next time?'),say(prep?'I do. Put my name next to the key on the call sheet.':'I believe that is still before the board.')];
 return fixedShowMoment(segment,index,opening,beats,segment.scene);
}
