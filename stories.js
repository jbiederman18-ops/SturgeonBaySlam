'use strict';

const STORY_PHASES=['spark','escalation','complication','payoff','aftermath'];
const SHOW_PROPS={broom:{name:'Sweeps’ lucky broom',hint:'An underdog moment: protects the losing side’s confidence.',cost:0},chairs:{name:'Bev’s premium chairs',hint:'A loud spectacle: chaos satisfaction +2, purists −1.',cost:60},spotlight:{name:'Borrowed spotlight',hint:'An intimate promo: trust +2, or a theatrical match entrance.',cost:40}};
const PRODUCTION_ISSUES=[
 {title:'The entrance music is on a dead phone.',safe:'Borrow a charger',wild:'Let the wrestler lead a chant',text:'Bev can find a charger for $40. Or your opener can walk out to the room making its own music.'},
 {title:'The ring announcer has lost their voice.',safe:'Hire the bingo caller',wild:'Let the wrestlers introduce each other',text:'The bingo caller wants $40. Your roster has offered to help. Nobody has offered to be polite.'},
 {title:'The backdrop has fallen into the potluck.',safe:'Rent a clean curtain',wild:'Make the disaster part of the entrance',text:'A replacement costs $40. Or the first wrestler can explain why there is casserole on the company logo.'}
];
function storyDefaults(s){
 s.stories??={};s.promises??=[];s.incidents??=[];s.challenges??=[];s.plans??={};s.drafts??={};
 s.preferences??={text:'instant',presentation:'concise'};
 s.arc??={start:Math.floor((s.week-1)/4)*4+1,route:null,answered:{},trust:60,earned:false,outcome:null};
 s.backstage??={};s.production??={week:s.week,choice:null};s.milestones??={};s.seasonReports??=[];
 for(const r of s.roster){r.trust??=60;r.momentum??=0;r.lastSeen??=0;r.lastDebut??=-10}
 for(const [key,heat] of Object.entries(s.rivalries||{}))if(!s.stories[key]){
  const participants=key.split('-').map(Number);
  if(participants.every(id=>s.roster.some(r=>r.id===id)))s.stories[key]={participants,heat,phase:heat>=35?'escalation':'spark',grievance:'An unfinished rivalry',lastBeat:'Their previous encounters still matter.',lastWeek:s.week-1};
 }
 return s;
}
function storyFor(a,b){return state.stories[rivalryKey(a,b)]}
function incident(text,participants=[],kind='story'){
 const entry={week:state.week,text,participants:[...new Set(participants)],kind};state.incidents.unshift(entry);return entry;
}
function developStory(a,b,amount,grievance,phase){
 if(a==null||b==null||a===b)return null;
 const key=rivalryKey(a,b),old=state.stories[key],story=old||{participants:[a,b],heat:0,phase:'spark',grievance,lastBeat:grievance,lastWeek:state.week};
 story.heat=clamp(story.heat+amount);story.lastBeat=grievance;story.lastWeek=state.week;
 if(!old||old.phase==='aftermath'){story.grievance=grievance;story.phase='spark'}
 story.phase=phase||(story.heat>=55?'complication':story.heat>=25?'escalation':story.phase);
 state.stories[key]=story;state.rivalries[key]=story.heat;return story;
}
function featuredHeat(card=state.card){
 return Math.max(0,...card.flatMap(s=>s.kind==='match'?participantPairs(s).map(([a,b])=>storyFor(a,b)?.heat||0):s.target!=null?[storyFor(s.a,s.target)?.heat||0]:[]));
}
function forecastAttendance(card=state.card){
 const ids=showParticipants(card),stars=ids.map(id=>w(id)?.pop||0),main=card[3];
 const mainDraw=main?.kind==='match'?matchPeople(main).reduce((n,id)=>n+(w(id)?.pop||0),0)/Math.max(1,matchPeople(main).length):0;
 return clamp(Math.round(60+state.rep*1.3+(stars.length?Math.max(...stars):0)*.4+mainDraw*.35+featuredHeat(card)*.2+(isEvent()?30:0)),50,300);
}
function productionCost(){return state.production.week===state.week&&state.production.choice==='safe'?40:0}
function promiseMet(p,card=state.card){
 if(p.kind==='promo')return card.some(s=>s.kind==='promo'&&s.a===p.actor);
 return card.some(s=>s.kind==='match'&&matchPeople(s).includes(p.actor)&&
  (p.kind==='appearance'||p.kind==='team'&&matchSides(s).some(side=>side.includes(p.actor)&&side.includes(p.target))||p.kind==='rematch'&&!teamFormat(s)&&matchPeople(s).includes(p.target)&&s.finish==='Clean finish'||p.kind==='win'&&matchSides(s)[winningSide(s)]?.includes(p.actor)&&s.finish==='Clean finish'));
}
function makePromise(actor,kind,due,target=null){
 if(state.promises.some(p=>p.actor===actor&&p.kind===kind&&p.status==='open'))return;
 const p={id:`${state.week}-${actor}-${state.promises.length}`,actor,target,kind,due,status:'open'};state.promises.push(p);
 incident(`${w(actor).name} was promised ${kind==='rematch'?'a fair rematch':kind==='win'?'a clean victory':kind==='promo'?'time on the microphone':kind==='team'?'a tag-team opportunity':'a match'} by week ${due}.`,[actor,target].filter(id=>id!=null),'promise');
}
function promiseLabel(p){return `${w(p.actor).name}: ${p.kind==='rematch'?`fair match with ${w(p.target).name}`:p.kind==='team'?`team with ${w(p.target).name}`:p.kind==='promo'?'time on the microphone':p.kind==='win'?'clean win':'match opportunity'} · due week ${p.due}`}
function readiness(){
 const issues=[];
 state.card.forEach((s,i)=>{const p=bookingProblems(s);if(p.length)issues.push({index:i,text:`Segment ${i+1}: ${p[0]}`})});
 const matches=state.card.filter(s=>s.kind==='match'&&!bookingProblems(s).length).length;
 if(matches<2)issues.push({index:state.card.findIndex(s=>s.kind!=='match'),text:'A wrestling ticket promises at least two matches. Add another match.'});
 state.promises.filter(p=>p.status==='open'&&p.due<=state.week&&!promiseMet(p)).forEach(p=>issues.push({index:0,text:`Promise at risk: ${promiseLabel(p)}.`}));
 for(const issue of showBlockingProblems().filter(item=>!bookingProblems(state.card[item.index]).includes(item.text)&&!item.text.startsWith('Book at least')))if(!issues.some(item=>item.index===issue.index&&item.text.includes(issue.text)))issues.push({index:issue.index,text:issue.text});
 const counts={};for(const s of state.card)for(const id of matchPeople(s))counts[id]=(counts[id]||0)+1;
 for(const [id,count] of Object.entries(counts))if(count>2)issues.push({index:state.card.findIndex(s=>matchPeople(s).includes(Number(id))),text:`${w(id).name} appears ${count} times. Repeated exposure loses its impact.`});
 return issues;
}
function showBlockingProblems(){
 const issues=state.card.flatMap((s,index)=>bookingProblems(s).map(text=>({index,text})));
 if(state.card.filter(s=>s.kind==='match').length<2)issues.push({index:0,text:'Book at least two matches for a wrestling show.'});
 if(state.card.filter(s=>s.title).length>1)issues.push({index:0,text:'Book one defense of the singles championship per show.'});
 for(const [index,s] of state.card.entries()){
  if(s.title&&(teamFormat(s)||!matchPeople(s).includes(champion().id)))issues.push({index,text:'The champion must be in a singles-title match.'});
  if(s.prop&&state.card.some((other,j)=>j<index&&other.prop===s.prop))issues.push({index,text:'Each prop can support only one segment tonight.'});
 }
 return issues;
}
function readinessPanel(){
 const attendance=forecastAttendance(),cost=showCost(),issues=readiness();
 return `<section class="card readiness"><div class="section-head"><h3>Before the doors open</h3><span>THE BOOKER’S CHECK</span></div><div class="forecast"><div><small>EXPECTED CROWD</small><strong>${Math.max(50,attendance-15)}–${Math.min(300,attendance+15)}</strong></div><div><small>SHOW COST</small><strong>${money(cost)}</strong></div><div><small>PROJECTED PROFIT</small><strong>${money(attendance*(isEvent()?22:12)-cost)}</strong></div></div><p class="note">Two matches minimum. A promo and a match can build a story; repeating a speech wears thin.</p>${issues.length?`<ul>${issues.map(issue=>`<li><button class="text-btn" data-edit="${Math.max(0,issue.index)}">${esc(issue.text)} ↗</button></li>`).join('')}</ul>`:'<p class="green">Your card is ready. Every promise due tonight is covered.</p>'}</section>`;
}
function suggestionReason(r,index){
 const promise=state.promises.find(p=>p.actor===r.id&&p.status==='open');if(promise)return `Promised ${promise.kind==='win'?'a win':'a match'} · week ${promise.due}`;
 if(state.challenges.some(c=>c.status==='open'&&[c.actor,c.target].includes(r.id)))return 'An unanswered challenge';
 if(state.week<=state.arc.start+3&&[10,17].includes(r.id))return 'Sweeps’ road to the potluck';
 if(r.lastSeen&&state.week-r.lastSeen>=3)return 'Away from the spotlight for three weeks';
 return otherBookings(r.id,index).length?'Already on tonight’s card':r.champ?'The champion sets the stakes':'Fresh tonight';
}
function weeklyRequester(){
 const asked=id=>Object.values(state.backstage).filter(record=>record.actor===id).length;
 return state.roster.filter(r=>!r.champ).slice().sort((x,y)=>asked(x.id)-asked(y.id)||x.lastSeen-y.lastSeen||x.morale-y.morale||x.id-y.id)[0].id;
}
function weeklyRequest(){return ['appearance','win','promo'][(state.week-1)%3]}
function backstageCard(){
 const a=state.arc,age=state.week-a.start,active=age>=0&&age<4;
 const actor=active?10:state.backstage[state.week]?.actor??weeklyRequester();
 const answered=active?a.answered[state.week]:state.backstage[state.week];
 const lines=active?[
  '“Insurance says last week’s cheap shot was an administrative error. I call it a boot. Can I get a fair shot?”',
  a.route==='earn'?(a.earned?'“I earned it, boss. Now let’s put that fair rematch on the poster.”':'“Tell me who to beat. I’ll bring the broom. They can bring the excuses.”'):a.route==='team'?'“You want me to tag with the man who calls a headlock a deductible?”':'“A promise means something to me, boss. Does it mean something to you?”',
  '“The potluck is next week. I need to know whether I’m cleaning the ring or standing in the middle of it.”',
  '“I’ve brought a dish. Tonight I’d like to bring home something else: a little respect.”'
 ]:[];
 return `<section class="card inbox"><small>BACKSTAGE · ${answered?'CONVERSATION SAVED':'SOMEONE NEEDS A WORD'}</small><p class="quote">${active?lines[age]:weeklyRequest()==='promo'?'“Give me a microphone. There’s something this room needs to hear.”':weeklyRequest()==='win'?'“I need a clean win, boss. One night where nobody can argue with the result.”':'“I’ve been waiting for a chance, boss. Can you put me in a match this week?”'}</p><div class="byline">${avatar(w(actor))}<div><strong>${esc(w(actor).name)}</strong><p class="note">Trust ${w(actor).trust}/100 · Morale ${w(actor).morale}</p></div></div>${answered?`<p class="note">${esc(answered.summary||'Your answer will be remembered.')}</p>`:`<button class="text-btn" id="backstage-talk">Hear them out →</button>`}</section>`;
}
function openBackstage(){
 const arc=state.arc,age=state.week-arc.start,active=age>=0&&age<4;
 if(active&&arc.answered[state.week]||!active&&state.backstage[state.week])return;
 const actor=active?10:weeklyRequester();
 const broken=state.promises.some(p=>p.actor===actor&&p.status==='broken');
 const question=active?age===0?'Sweeps wants a fair path back to Term Life Insurance Plan. What do you offer?':age===1?`Sweeps returns. ${arc.route==='earn'?(arc.earned?'He won his qualifier. Now he wants a date for the fair rematch.':'He wants the name of his qualifying opponent.'):arc.route==='team'?'He wants to know whether this partnership has a future.':'He wants to know whether your word still holds.'}`:age===2?`${broken?'“You let me down once. Don’t sell me another speech.”':'“Put it on the poster, boss.”'} The big event is approaching.`:'This is the last conversation before the potluck. How should Sweeps approach tonight?':`${w(actor).name} asks for ${weeklyRequest()==='promo'?'time on the microphone':weeklyRequest()==='win'?'a clean victory':'a match opportunity'} this week.`;
 const choices=active&&age===0?[
  ['rematch','Promise a fair rematch','Due at the potluck · builds trust'],['earn','Make him earn the rematch','A clean qualifying win unlocks the opportunity'],['team','Try them as a tag team','Unlikely partners · a different kind of payoff']
 ]:active&&age===1?[
  ['back','Back your original plan','Reassures Sweeps · keep the booking commitment'],['change','Offer a guaranteed clean win','A new promise due this week'],['honest','Admit you cannot promise a result','Small trust cost · no new obligation']
 ]:active&&age===2?[
  ['commit','Commit to the big-event payoff','A dated promise · the room will remember'],['delay','Explain that the story needs time','An honest delay · protects your flexibility'],['reject','Tell him to stop asking','No commitment · damages trust']
 ]:active?[
  ['respect','Tell him to earn the room’s respect','Confidence and trust · protect both wrestlers'],['revenge','Tell him to make it personal','More feud heat · less mutual respect'],['team','Ask him to trust his partner','Team chemistry if they share a team tonight']
 ]:[['yes',weeklyRequest()==='promo'?'Promise time on the mic':weeklyRequest()==='win'?'Promise a clean win tonight':'Promise a match tonight','Trust rises if you deliver'],['later','Ask for patience','No promise · a small trust cost'],['no','Be honest: no place tonight','Closes the request · trust dips']];
 let picked=null;
 const draw=()=>{
  modal(active?'Sweeps needs a word.':'A minute at the folding table.',`<div class="byline">${avatar(w(actor))}<h3>${esc(w(actor).name)}</h3></div><p class="note">${esc(question)}</p>${!picked?`<div class="story-options">${choices.map(([key,label,hint])=>`<button type="button" data-talk="${key}"><strong>${label}</strong><small>${hint}</small></button>`).join('')}</div>`:`<div class="result"><p>“${picked==='team'?'All right. I’ll try trusting someone else with the other end of the broom.':picked==='honest'||picked==='delay'||picked==='no'||picked==='later'?'I can handle the truth, boss. Just don’t dress it up as a promise.':'I heard you, boss. Now let’s see it on the card.'}”</p></div>${field('How do you seal the conversation?',`<select name="tone"><option value="private">Keep this between us · trust +3</option><option value="public">Put it on the poster · momentum +2</option></select>`)}`}`,(form,dialog)=>{
   if(!picked)return;
   resolveBackstage(actor,picked,form.get('tone'),active,age);dialog.close();render();toast('Conversation remembered. Check your promises before opening the doors.');
  },picked?'Finish conversation':'Choose a response');
  if(!picked){$('#modal .modal-actions [type="submit"]').hidden=true;document.querySelectorAll('[data-talk]').forEach(button=>button.onclick=()=>{picked=button.dataset.talk;$('#modal').close();draw()})}
 };draw();
}
function resolveBackstage(actor,choice,tone,active,age){
 const r=w(actor),a=state.arc;
 if(tone==='private')r.trust=clamp(r.trust+3);else r.momentum=clamp(r.momentum+2,-20,20);
 if(active){
  if(age===0){a.route=choice;developStory(10,17,18,'A disputed cheap shot left Sweeps asking for a fair chance.');if(choice==='rematch')makePromise(10,'rematch',a.start+3,17)}
  if(choice==='change')makePromise(actor,'win',state.week);
  if(choice==='commit'){
   if(a.route==='team')makePromise(10,'team',a.start+3,17);
   else if(a.route!=='earn'||a.earned)makePromise(10,'rematch',a.start+3,17);
   else makePromise(10,'win',state.week);
  }
  if(choice==='revenge')developStory(10,17,12,'Sweeps has been told to make the potluck personal.','complication');
  if(choice==='respect')r.momentum=clamp(r.momentum+3,-20,20);
  if(choice==='team'&&age===3)for(const team of state.teams.filter(t=>[t.a,t.b].includes(10)))team.chemistry=clamp(team.chemistry+6);
  if(choice==='reject')r.trust=clamp(r.trust-8);if(['honest','delay'].includes(choice))r.trust=clamp(r.trust-2);
  a.answered[state.week]={choice,tone,summary:choicesSummary(choice)};
 }else{
  if(choice==='yes')makePromise(actor,weeklyRequest(),state.week);else r.trust=clamp(r.trust-(choice==='no'?4:1));
  state.backstage[state.week]={actor,choice,tone,summary:choice==='yes'?`You promised ${weeklyRequest()==='promo'?'a microphone segment':weeklyRequest()==='win'?'a clean victory':'a match opportunity'} tonight.`:choicesSummary(choice)};
 }
 incident(`${r.name}: ${choicesSummary(choice)} ${tone==='private'?'You kept the conversation private.':'You made it part of the publicity.'}`,[actor],'backstage');
}
function choicesSummary(choice){return ({rematch:'A fair rematch was promised.',earn:'An earned route to the rematch was agreed.',team:'You asked for a reluctant partnership.',back:'You backed the original plan.',change:'A clean win was promised tonight.',honest:'You were honest about the uncertainty.',commit:'You committed to the next step.',delay:'You explained the delay.',reject:'You refused the request.',respect:'You asked for respect, not humiliation.',revenge:'You encouraged revenge.',yes:'A match was promised tonight.',later:'You asked for patience.',no:'You said there was no place tonight.'})[choice]||'You had a word backstage.'}
function storyHub(){
 const stories=Object.values(state.stories).sort((a,b)=>b.lastWeek-a.lastWeek),open=state.promises.filter(p=>p.status==='open');
 const a=state.arc,active=state.week>=a.start&&state.week<a.start+4;
 return `<section class="story-hub"><div class="section-head"><h2>The road to the potluck</h2><button class="text-btn" id="plan-story">Plan a beat ↗</button></div>${active?`<div class="card arc-card"><small>SPOTLIGHT STORY · WEEKS ${a.start}–${a.start+3}</small><h3>A fair shake for Sweeps</h3><p>${a.route==='earn'?(a.earned?'The qualifying win is in. A fair rematch is available.':'Book Sweeps a clean qualifying victory before the big event.'):a.route==='team'?'Try Sweeps and the insurer on the same side. The partnership needs a match and a little faith.':a.route==='rematch'?`Deliver a clean Sweeps–Insurance match by week ${a.start+3}.`:'A disputed cheap shot. One broom. A chance to decide what comes next.'}</p><button class="text-btn" data-story-cast="10">Book Sweeps →</button></div>`:''}<div class="plan-grid">${Array.from({length:4},(_,i)=>{const week=Math.floor((state.week-1)/4)*4+i+1;return `<div class="plan-week ${week===state.week?'current':''}"><small>WEEK ${week}${week%4===0?' · BIG EVENT':''}</small><strong>${esc(state.plans[week]||['Spark','Escalate','Complicate','Pay it off'][i])}</strong></div>`}).join('')}</div>${open.length?`<div class="card"><h3>Your word matters</h3>${open.map(p=>`<p class="note">${esc(promiseLabel(p))} ${promiseMet(p)?'✓ On the card':''}</p>`).join('')}</div>`:''}${state.challenges.some(c=>c.status==='open')?`<div class="card"><h3>Open challenges</h3>${state.challenges.filter(c=>c.status==='open').map(c=>`<p>${esc(w(c.actor).name)} → ${esc(w(c.target).name)} <button class="text-btn" data-challenge="${c.id}">Book it</button> <button class="text-btn" data-defer="${c.id}">Decline</button></p>`).join('')}</div>`:''}${stories.length?stories.map(s=>`<details class="card story-record"><summary><span class="badge">${esc(s.phase)}</span> ${esc(s.participants.map(id=>w(id).name).join(' vs. '))} · ${s.heat} heat</summary><p>${esc(s.grievance)}</p><p class="note">Latest: ${esc(s.lastBeat)}</p></details>`).join(''):'<p class="note">A targeted promo or disputed finish can start a story. A clean big-event match can settle one.</p>'}</section>`;
}
function openPlanner(){
 const start=Math.floor((state.week-1)/4)*4+1;
 modal('Pencil in the road ahead.',`${field('Week',`<select name="week">${Array.from({length:4},(_,i)=>start+i).filter(week=>week>=state.week).map(week=>`<option value="${week}">Week ${week}${week%4===0?' · Big event':''}</option>`).join('')}</select>`)}${field('Planned story beat',`<input name="beat" maxlength="120" required placeholder="Sweeps earns his fair rematch…">`)}<p class="note">This is a pencil mark, not a locked booking. Change the plan whenever the story changes.</p>`,(f,d)=>{const beat=f.get('beat').trim();if(!beat)return;state.plans[f.get('week')]=beat;d.close();render()},'Save plan');
}
function productionPanel(){
 const issue=PRODUCTION_ISSUES[(state.week-1)%PRODUCTION_ISSUES.length],choice=state.production.choice;
 return `<section class="card production"><small>OPTIONAL PRODUCTION CALL</small><h3>${issue.title}</h3><p class="note">${issue.text}</p>${choice?`<p><strong>${choice==='safe'?issue.safe:issue.wild}</strong> · ${choice==='safe'?'$40 added to the budget.':'Your opener will improvise. Charisma determines how it lands.'}</p><button class="text-btn" data-production="clear">Change call</button>`:`<div class="row"><button class="btn" data-production="safe">${issue.safe} · $40</button><button class="btn" data-production="wild">${issue.wild}</button></div><p class="note">Leave it to the crew for a neutral workaround.</p>`}</section>`;
}
function seasonGoals(){
 const start=Math.floor((state.week-1)/12)*12+1,shows=state.history.filter(h=>h.week>=start),kept=state.promises.filter(p=>p.status==='kept'&&p.resolved>=start).length,payoffs=state.incidents.filter(i=>i.week>=start&&i.kind==='payoff').length;
 return `<section class="card"><small>OPTIONAL SEASON GOALS</small><h3>Give the room a reason to return.</h3><p>${kept?'✓':'○'} Keep a booking promise · ${kept}</p><p>${payoffs?'✓':'○'} Deliver a story payoff · ${payoffs}</p><p>${shows.some(h=>h.rating>=75)?'✓':'○'} Earn a show rating of 75</p><p class="note">At week ${start+11}, your season gets a retrospective. There is no deadline on enjoying the nonsense.</p></section>`;
}
function storyRecap(h){return `<section class="card story-fallout"><small>WHAT CHANGED · WHAT COMES NEXT</small><h2>The room remembers.</h2>${(h.fallout||[]).length?h.fallout.map(entry=>`<p>${esc(typeof entry==='string'?entry:entry.text)}</p>`).join(''):'<p>Your card gave the roster another night in front of the room.</p>'}${h.season?`<div class="result"><h3>Season ${h.season.season}: the folding-chair chronicles</h3><p>${h.season.shows} shows · average rating ${h.season.average} · ${h.season.kept} promises kept · ${h.season.payoffs} story payoffs</p></div>`:''}<p class="note">Next week: ${esc(nextStoryHint())}</p></section>`}
function nextStoryHint(){const p=state.promises.find(p=>p.status==='open');if(p)return promiseLabel(p);if(state.challenges.some(c=>c.status==='open'))return 'An open challenge is waiting for a booking.';return 'Check backstage, then choose who deserves the next spotlight.'}
function memoryBeat(s){
 const target=s.kind==='promo'?s.target:matchOpponents(s,s.a)[0];if(target==null)return [];
 const story=storyFor(s.a,target);if(!story)return [];
 const text=story.phase==='aftermath'?`Their last chapter ended with a clean result. Tonight starts with that history between them.`:`Last time: ${story.lastBeat}`;
 if([s.a,target].includes(10)&&[s.a,target].includes(17))return [ringBeat('commentary',text,'action'),ringBeat(10,state.promises.some(p=>p.actor===10&&p.status==='broken')?'I remember every promise, boss. Tonight I’m doing this for the people holding the broom signs.':'I cleaned this ring before the show. Somehow you’re still the biggest mess in it.'),ringBeat(17,'Your complaint arrived after the bell. Unfortunately, the appeal window is also a rope break.')];
 return [ringBeat('commentary',text,'action')];
}
function momentIntent(choice,s){
 if(s.kind==='promo')return choice.tag==='Show some heart'?{effect:'trust',hint:'Builds trust and reveals the person behind the gimmick.'}:choice.tag==='Call someone out'?{effect:'challenge',hint:s.target!=null?'Creates a challenge and intensifies this story.':'Builds confidence with the audience.'}:{effect:'spectacle',hint:'Builds momentum; repetition makes the bit wear thin.'};
 if(choice.tag==='Give both a moment')return {effect:'protect',hint:'Protects the losing side’s momentum and builds respect.'};
 if(choice.tag==='Teamwork')return {effect:'team',hint:'Grows team chemistry; the leader shares the spotlight.'};
 if(['Tell the story','Watch every rival'].includes(choice.tag))return {effect:'respect',hint:'Intensifies the rivalry without humiliating the loser.'};
 if(choice.tag==='Character chaos')return {effect:'humiliate',hint:'The loser feels mocked. More heat, less trust.'};
 return {effect:'dominant',hint:'Strengthens the winner’s momentum; the loser stays in their shadow.'};
}
function applyMomentEffect(choice,s,fallout){
 if(!choice?.effect)return;
 const say=text=>fallout.push(incident(text,matchPeople(s),'decision'));
 if(s.kind==='promo'){
  const r=w(s.a);if(choice.effect==='trust'){r.trust=clamp(r.trust+4);r.morale=clamp(r.morale+2);say(`${r.name} opened up. Trust +4; morale +2.`)}
  else if(choice.effect==='challenge'&&s.target!=null){developStory(s.a,s.target,6,`${r.name} called out ${w(s.target).name}.`);say(`${r.name} made the confrontation personal. Rivalry heat +6.`)}
  else{r.momentum=clamp(r.momentum+2,-20,20);say(`${r.name} owns the spotlight. Momentum +2.`)}
  return;
 }
 const win=matchSides(s)[winningSide(s)],losers=matchPeople(s).filter(id=>!win.includes(id)),lead=w(s.winner);
 if(choice.effect==='protect'){
  for(const id of losers){w(id).momentum=clamp(w(id).momentum+3,-20,20);w(id).trust=clamp(w(id).trust+3)}
  say(`${losers.map(id=>w(id).name).join(', ')} looked competitive in defeat. Momentum +3; trust +3.`);
 }else if(choice.effect==='team'){
  for(const team of establishedTeams(s))team.chemistry=clamp(team.chemistry+5);
  for(const id of win)w(id).trust=clamp(w(id).trust+2);
  say(`${sideLabel(win)} shared the spotlight. Trust +2; established teams gain 5 extra chemistry.`);
 }else if(choice.effect==='humiliate'){
  for(const id of losers)w(id).trust=clamp(w(id).trust-4);
  developStory(s.winner,losers[0],8,`${lead.name} turned the loss into a public humiliation.`);
  say(`${w(losers[0]).name} remembers the humiliation. Trust −4; rivalry heat +8.`);
 }else if(choice.effect==='respect'){
  developStory(s.winner,losers[0],4,'A competitive exchange gave both opponents a reason to return.');
  say(`${lead.name} and ${w(losers[0]).name} have unfinished business. Rivalry heat +4.`);
 }else{lead.momentum=clamp(lead.momentum+3,-20,20);say(`${lead.name} looked decisive. Momentum +3.`)}
}
function finishStoryWeek(fallout){
 const a=state.arc,age=state.week-a.start;
 // Resolve new opportunities before checking deadlines, including a qualifier and rematch on one card.
 if(age>=0&&age<4&&a.route==='earn'&&!a.earned&&state.card.some(s=>s.kind==='match'&&s.winner===10&&s.finish==='Clean finish'&&!matchPeople(s).includes(17))){a.earned=true;makePromise(10,'rematch',a.start+3,17);fallout.push(incident('Sweeps earned his rematch. The fair big-event match is now a commitment.',[10,17],'unlock'))}
 for(const p of state.promises.filter(p=>p.status==='open')){
  if(promiseMet(p)){p.status='kept';p.resolved=state.week;w(p.actor).trust=clamp(w(p.actor).trust+8);w(p.actor).morale=clamp(w(p.actor).morale+6);fallout.push(incident(`A promise kept: ${promiseLabel(p)}. Trust +8; morale +6.`,[p.actor],'promise'))}
  else if(p.due<=state.week){p.status='broken';p.resolved=state.week;w(p.actor).trust=clamp(w(p.actor).trust-12);w(p.actor).morale=clamp(w(p.actor).morale-6);fallout.push(incident(`${w(p.actor).name} remembers the broken promise. Trust −12; morale −6.`,[p.actor],'promise'))}
 }
 if(age>=0&&age<4){
  const partnersTonight=state.card.some(s=>s.kind==='match'&&teamFormat(s)&&matchSides(s).some(side=>side.includes(10)&&side.includes(17)));
  if(a.route==='team'&&partnersTonight){
   a.partnered=true;if(!state.teams.some(t=>[t.a,t.b].includes(10)||[t.a,t.b].includes(17))){state.teams.push({a:10,b:17,name:'Sweepstakes & Deductibles',chemistry:40});fallout.push(incident('Sweeps and the insurer become Sweepstakes & Deductibles. An unlikely partnership is born.',[10,17],'team'))}
  }
  if(age===3&&!a.outcome){
   const rematch=state.card.find(s=>s.kind==='match'&&matchPeople(s).includes(10)&&matchPeople(s).includes(17)&&!teamFormat(s)&&s.finish==='Clean finish');
   a.outcome=a.route==='team'&&partnersTonight?'partners':rematch?(rematch.winner===10?'victory':'respect'):'unfinished';
   if(a.outcome==='partners'){
    const story=storyFor(10,17);developStory(10,17,-(story?.heat||0),'The unlikely partners made it through the potluck together.','aftermath');
    fallout.push(incident('A grudge became a partnership at the potluck. The next chapter belongs to the team.',[10,17],'payoff'));
   }
   fallout.push(incident(a.outcome==='partners'?'Sweeps: “You covered my back. I suppose that counts as a policy worth keeping.” The partnership survives the potluck.':a.outcome==='victory'?'Sweeps: “Keep the paperwork. I’ve got the result.” A fair shake became a victory.':a.outcome==='respect'?'Sweeps: “I lost. But nobody can say I didn’t belong in there.” A clean defeat earns the room’s respect.':'Sweeps puts the broom away: “The potluck came and went. I’m still waiting for my fair shake.” The unfinished story stays in the notebook.',[10,17],'aftermath'));
  }
 }
 for(const story of Object.values(state.stories))if(story.lastWeek<state.week-1&&story.phase!=='aftermath'){story.heat=clamp(story.heat-4);state.rivalries[rivalryKey(...story.participants)]=story.heat}
}
function bindStoryControls(){
 if($('#backstage-talk'))$('#backstage-talk').onclick=openBackstage;
 if($('#plan-story'))$('#plan-story').onclick=openPlanner;
 document.querySelectorAll('[data-production]').forEach(b=>b.onclick=()=>{state.production={week:state.week,choice:b.dataset.production==='clear'?null:b.dataset.production};render()});
 document.querySelectorAll('[data-story-cast]').forEach(b=>b.onclick=()=>{
  const index=state.card.findIndex(s=>!s.kind);if(index<0){toast('Choose an existing segment to make room for Sweeps.');return}
  const team=state.arc.route==='team',target=state.arc.route==='rematch'||state.arc.earned?17:null;
  state.drafts[index]={...blankBooking('match'),format:team?'tag':'singles',sides:team?[[10,17],[null,null]]:[[10],[target]],a:10,b:team?null:target};save();openBookingDesk(index,'match');
 });
 document.querySelectorAll('[data-challenge]').forEach(b=>b.onclick=()=>{
  const c=state.challenges.find(c=>c.id===b.dataset.challenge),index=state.card.findIndex(s=>!s.kind);
  if(index<0){toast('Clear a segment before accepting this challenge.');return}
  state.drafts[index]={...blankBooking('match'),format:'singles',sides:[[c.actor],[c.target]],a:c.actor,b:c.target};save();openBookingDesk(index,'match');
 });
 document.querySelectorAll('[data-defer]').forEach(b=>b.onclick=()=>{const c=state.challenges.find(c=>c.id===b.dataset.defer);c.status='declined';w(c.actor).trust=clamp(w(c.actor).trust-2);incident(`${w(c.actor).name}’s challenge was declined. Trust −2.`,[c.actor,c.target]);render()});
 document.querySelectorAll('[data-preference]').forEach(el=>el.onchange=()=>{state.preferences[el.dataset.preference]=el.value;render()});
}
function playbackSettings(){return `<details class="card playback"><summary>Show playback preferences</summary><div class="match-settings">${field('Dialogue text',`<select data-preference="text">${options(['instant','typewriter'],state.preferences.text)}</select>`)}${field('Scene length',`<select data-preference="presentation">${options(['concise','full'],state.preferences.presentation)}</select>`)}</div><p class="note">Preferences save with your career. The dialogue log remains available.</p></details>`}
function historyStoryDetails(h){return `<details class="history-details"><summary>Read the night’s stories</summary>${(h.fallout||[]).map(entry=>`<p>${esc(typeof entry==='string'?entry:entry.text)}</p>`).join('')||'<p>Only show totals were retained in this older career entry.</p>'}${(h.results||[]).map(r=>`<p><strong>${esc(r.headline)}</strong><br>${esc(r.explanation)}</p>`).join('')}</details>`}
