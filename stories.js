'use strict';

const STORY_PHASES=['spark','escalation','complication','payoff','aftermath'];
const SHOW_PROPS={broom:{name:'Sweeps’ lucky broom',hint:'An underdog moment: protects the losing side’s confidence.',cost:0},chairs:{name:'Bev’s premium chairs',hint:'A loud spectacle: chaos satisfaction +2, purists −1.',cost:60},spotlight:{name:'Borrowed spotlight',hint:'An intimate promo: trust +2, or a theatrical match entrance.',cost:40}};
// Signature props travel with their owner; they are presentation tools, never weapons.
CHARACTER_SPECIALS.forEach((special,id)=>{SHOW_PROPS['signature-'+id]={name:special.prop,owner:id,cost:0,hint:'Character presentation · owner momentum +1; no automatic rating bonus.'}});
function propsFor(s){return Object.entries(SHOW_PROPS).filter(([key,prop])=>prop.owner==null||matchPeople(s).includes(prop.owner))}
const PRODUCTION_ISSUES=[
 {id:'dead-phone',title:'The entrance music is on a dead phone.',safe:'Borrow a charger',wild:'Let the wrestler lead a chant',crew:'Use a plain entrance',text:'Bev can find a charger for $40. Or your opener can walk out to the room making its own music.',success:'The room supplied the entrance music.',failure:'The chant never caught on.'},
 {id:'announcer',title:'The ring announcer has lost their voice.',safe:'Hire the bingo caller',wild:'Let the wrestlers introduce each other',crew:'Put the names on the chalkboard',text:'The bingo caller wants $40. Your roster has offered to help. Nobody has offered to be polite.',success:'The introductions got a bigger reaction than the regular announcer.',failure:'The wrestlers talked over each other and missed their cue.'},
 {id:'backdrop',title:'The backdrop has fallen onto the concession table.',safe:'Rent a clean curtain',wild:'Make it part of the entrance',crew:'Take the backdrop down',text:'A replacement costs $40. Or the first wrestler can explain why there is casserole on the company logo.',success:'The opener worked the stained curtain into the act.',failure:'The casserole got more attention than the entrance.'},
 {id:'chairs',title:'Half the folding chairs are still at the bingo hall.',safe:'Pay for a second van run',wild:'Have the opener work the standing crowd',crew:'Open the standing section without a fuss',text:'The last driver wants $40 to make another trip. Bev has counted the chairs three times. The number has not improved.',success:'The standing section turned into a loud front row.',failure:'The standing section wanted chairs, not crowd work.'},
 {id:'referee',title:'The volunteer referee has never counted a pin.',safe:'Pay the retired referee down the road',wild:'Let the opening pair guide the referee',crew:'Stick to a very simple opening match',text:'Our volunteer is very confident about rope breaks. Unfortunately, they think a three-count starts at zero.',stat:'skill',matchOnly:true,success:'The opening pair made the volunteer look experienced.',failure:'The opening pair and the referee lost track of the count.'},
 {id:'wrong-poster',title:'The posters have the wrong town on them.',safe:'Print correction slips',wild:'Have the opener apologize to the locals',crew:'Correct the posters by hand',text:'The sponsor approved the artwork before anybody checked the address. There is time for a $40 print run or an uncomfortable announcement.',success:'The apology got a laugh and won the locals back.',failure:'The apology only reminded the crowd about the posters.'},
 {id:'double-booking',title:'The hall is booked for a softball banquet at nine.',safe:'Pay for the banquet’s side room',wild:'Trust the main event to keep things moving',crew:'Cut the main-event entrances short',text:'Nobody wrote down which booking came first. The softball coach has brought a casserole and a stopwatch.',segment:3,stat:'skill',success:'The main event kept its pace and cleared the hall on time.',failure:'The rushed main event missed a few of its planned exchanges.'},
 {id:'mic-raffle',title:'The raffle winner has taken the only microphone home.',safe:'Rent a replacement microphone',wild:'Let the opener project to the back row',crew:'Run the opener without a microphone',text:'They won “the mic moment” and took the wording literally. A replacement is $40. The back row is already asking what happened.',success:'The opener reached the back row without the microphone.',failure:'Half the room could not hear the opener.'},
 {id:'scoreboard',title:'The borrowed scoreboard keeps announcing a home run.',safe:'Pay the caretaker to disconnect it',wild:'Work the sound into the opener’s act',crew:'Leave the scoreboard dark',text:'The caretaker can fix it for $40. Bev has found the plug, but nobody can reach it without moving the entrance set.',success:'The opener got the room cheering for the malfunction.',failure:'The home-run noise interrupted the opener at exactly the wrong moment.'},
 {id:'truck',title:'The entrance set is still on somebody’s trailer.',safe:'Pay the driver for an early delivery',wild:'Have the opener enter through the crowd',crew:'Use the side door',text:'The driver is finishing a hardware-store delivery. An extra $40 moves your stop up the list.',success:'The crowd entrance made the bare setup feel deliberate.',failure:'The opener got stuck behind the concession line.'}
];
PRODUCTION_ISSUES.push(...[
 {
  "id": "raffle",
  "title": "The raffle drum is louder than the entrance music.",
  "safe": "Rent a quieter drum",
  "wild": "Turn the draw into an entrance cue",
  "crew": "Move the raffle to intermission",
  "text": "Every spin sounds like a cement mixer. The volunteer insists it is building suspense. A paid fix costs $40.",
  "success": "The opener timed the entrance to the winning ticket.",
  "failure": "The winning ticket drowned out the entrance."
 },
 {
  "id": "fog",
  "title": "The fog machine smells like toasted waffles.",
  "safe": "Rent a replacement machine",
  "wild": "Sell it as a breakfast-themed entrance",
  "crew": "Open the curtain without fog",
  "text": "The machine is technically working. The front row has started asking for syrup. A paid fix costs $40.",
  "success": "The opener made the accidental breakfast entrance feel intentional.",
  "failure": "The breakfast joke left the room hungry for actual wrestling."
 },
 {
  "id": "bell",
  "title": "The ring bell has gone to a school concert.",
  "safe": "Rent a substitute bell",
  "wild": "Let the opening pair teach the crowd the signal",
  "crew": "Use the timekeeper’s whistle",
  "text": "The school promises to return it tomorrow. Tonight needs a recognizable start. A paid fix costs $40.",
  "success": "The wrestlers made the crowd’s opening signal unmistakable.",
  "failure": "The crowd and referee disagreed about when to start.",
  "matchOnly": true,
  "stat": "skill"
 },
 {
  "id": "banner",
  "title": "The sponsor banner is printed upside down.",
  "safe": "Pay for a corrected banner",
  "wild": "Make the sponsor reveal part of the act",
  "crew": "Remove the banner",
  "text": "The sponsor has arrived early and is staring at the ceiling. A paid fix costs $40.",
  "success": "The opener turned the reveal into a gracious sponsor thank-you.",
  "failure": "The joke sounded more like an insult to the sponsor."
 },
 {
  "id": "lights",
  "title": "The entrance lights are stuck on bingo mode.",
  "safe": "Hire the lighting operator",
  "wild": "Time the entrance to the flashing numbers",
  "crew": "Use the house lights",
  "text": "Every button calls another number. Bev is refusing to award prizes. A paid fix costs $40.",
  "success": "The opener made the bingo flashes look choreographed.",
  "failure": "The flashes stole attention from the opener."
 },
 {
  "id": "curtain",
  "title": "The curtain rail is jammed halfway open.",
  "safe": "Rent a freestanding entrance screen",
  "wild": "Work a half-hidden entrance routine",
  "crew": "Tie the curtain back",
  "text": "The audience can see one boot and the whole ring crew. A paid fix costs $40.",
  "success": "The half-hidden reveal built a full-room reaction.",
  "failure": "The reveal happened before anyone was ready."
 },
 {
  "id": "clock",
  "title": "The hall clock has skipped ahead an hour.",
  "safe": "Pay the caretaker to reset it",
  "wild": "Let the main event joke about sudden overtime",
  "crew": "Cover the clock",
  "text": "The crowd is checking watches. The wrestlers still have their full allotted time. A paid fix costs $40.",
  "success": "The main event turned the time confusion into a running joke.",
  "failure": "The time jokes made the main event feel longer.",
  "segment": 3
 },
 {
  "id": "streamers",
  "title": "The entrance streamers have tied themselves together.",
  "safe": "Buy replacement decorations",
  "wild": "Let the opener unravel the entrance on camera",
  "crew": "Clear the streamers away",
  "text": "The decorations are one enormous knot. Somebody has called it modern art. A paid fix costs $40.",
  "success": "The opener untangled the entrance and won over the room.",
  "failure": "The knot defeated the entrance routine."
 },
 {
  "id": "program",
  "title": "The programs list every wrestler as champion.",
  "safe": "Print corrected inserts",
  "wild": "Have the opener explain the crowded title picture",
  "crew": "Withdraw the programs",
  "text": "Thirty-four champions. One belt. The printer blames a spreadsheet. A paid fix costs $40.",
  "success": "The opener made the printing error a memorable championship pitch.",
  "failure": "The joke left the title picture even less clear."
 },
 {
  "id": "echo",
  "title": "The PA repeats every sentence a second late.",
  "safe": "Rent a replacement speaker",
  "wild": "Work a call-and-response with the echo",
  "crew": "Switch off the PA",
  "text": "The technician calls it delay. Bev calls it paying for every announcement twice. A paid fix costs $40.",
  "success": "The opener used the echo to lead the whole room.",
  "failure": "The echo stepped on every punchline."
 }
]);

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
 progressionDefaults(s);snafuDefaults(s);return s;
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
 return clamp(Math.round((venueCapacity()/300)*(80+state.rep*1.5+Math.min(50,state.history.filter(h=>h.week>=state.week-12&&h.rating>=65).length*5)+(stars.length?Math.max(...stars):0)*.4+mainDraw*.35+featuredHeat(card)*.2+(isEvent()?30:0))),50,venueCapacity());
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
 state.promises.filter(p=>p.status==='open'&&p.due<=state.week&&!promiseMet(p)).forEach(p=>issues.push({index:Math.max(0,state.card.findIndex(s=>matchPeople(s).includes(p.actor))),text:`Promise at risk: ${promiseLabel(p)}.`}));
 for(const issue of showBlockingProblems().filter(item=>!bookingProblems(state.card[item.index]).includes(item.text)&&!item.text.startsWith('Book at least')))if(!issues.some(item=>item.index===issue.index&&item.text.includes(issue.text)))issues.push({index:issue.index,text:issue.text});
 const counts={};for(const s of state.card)for(const id of matchPeople(s))counts[id]=(counts[id]||0)+1;
 for(const [id,count] of Object.entries(counts))if(count>2)issues.push({index:state.card.findIndex(s=>matchPeople(s).includes(Number(id))),text:`${w(id).name} appears ${count} times. Repeated exposure loses its impact.`});
 return issues;
}
function showBlockingProblems(){
 const issues=state.card.flatMap((s,index)=>bookingProblems(s).map(text=>({index,text})));
 if(weeklyBriefingPending())issues.push({index:0,text:'Resolve this week’s Little Snafu and backstage business before booking.'});
 if(state.card.filter(s=>s.kind==='match').length<2)issues.push({index:Math.max(0,state.card.findIndex(s=>s.kind!=='match')),text:'Book at least two matches for a wrestling show.'});
 if(state.card.filter(s=>s.title).length>1)issues.push({index:state.card.map(s=>!!s.title).lastIndexOf(true),text:'Book one defense of the singles championship per show.'});
 for(const [index,s] of state.card.entries()){
  if(s.title&&(teamFormat(s)||!matchPeople(s).includes(champion().id)))issues.push({index,text:'The champion must be in a singles-title match.'});
  if(SHOW_PROPS[s.prop]?.owner!=null&&!matchPeople(s).includes(SHOW_PROPS[s.prop].owner))issues.push({index,text:'The signature prop’s owner must appear in the segment.'});
  if(s.prop&&state.card.some((other,j)=>j<index&&other.prop===s.prop))issues.push({index,text:'Each prop can support only one segment tonight.'});
 }
 return issues;
}
function readinessPanel(){
 const attendance=forecastAttendance(),cost=showCost(),required=showBlockingProblems(),advice=readiness().filter(issue=>!required.some(block=>block.index===issue.index&&(issue.text.includes(block.text)||issue.text.startsWith('Segment '+(block.index+1)+':')))&&!issue.text.startsWith('A wrestling ticket'));
 const list=(items)=>`<ul>${items.map(issue=>`<li><button class="text-btn" data-edit="${Math.max(0,issue.index)}">Segment ${Math.max(0,issue.index)+1}: ${esc(issue.text)}</button></li>`).join('')}</ul>`;
 return `<section class="card readiness" id="show-readiness" tabindex="-1"><div class="section-head"><h3>Before the doors open</h3><span>The booker’s check</span></div><div class="forecast"><div><small>Expected crowd</small><strong>${Math.max(50,attendance-15)}–${Math.min(venueCapacity(),attendance+15)}</strong></div><div><small>Show cost</small><strong>${money(cost)}</strong></div><div><small>Projected profit</small><strong>${money(attendance*ticketPrice()+broadcastIncome()-cost)}</strong></div></div><h4>Required to run${required.length?' · '+required.length:''}</h4>${required.length?list(required):'<p class="green">Ready to go. Four segments, including at least two matches.</p>'}${advice.length?`<details class="creative-advice" open><summary>Creative advice · ${advice.length}</summary><p class="note">These are suggestions. You can run the show with these warnings.</p>${list(advice)}</details>`:''}</section>`;
}

function suggestionReason(r,index){
 const promise=state.promises.find(p=>p.actor===r.id&&p.status==='open');if(promise)return `Promised ${promise.kind==='win'?'a win':'a match'} · week ${promise.due}`;
 if(state.challenges.some(c=>c.status==='open'&&[c.actor,c.target].includes(r.id)))return 'An unanswered challenge';
 if(state.week<=state.arc.start+3&&[10,17].includes(r.id))return 'Sweeps’ upcoming rematch';
 if(r.lastSeen&&state.week-r.lastSeen>=3)return 'Away from the spotlight for three weeks';
 return otherBookings(r.id,index).length?'Already on tonight’s card':r.champ?'The champion sets the stakes':'Fresh tonight';
}
function weeklyRequester(){
 const asked=id=>Object.values(state.backstage).filter(record=>record.actor===id).length;
 return state.roster.filter(r=>!r.champ).slice().sort((x,y)=>asked(x.id)-asked(y.id)||x.lastSeen-y.lastSeen||x.morale-y.morale||x.id-y.id)[0].id;
}
function weeklyRequest(){return ['appearance','win','promo'][(state.week-1)%3]}
function backstageConversation(actorOverride=null){
 const arc=state.arc,age=state.week-arc.start,active=age>=0&&age<4;
 const actor=actorOverride??(active?10:state.backstage[state.week]?.actor??weeklyRequester());
 const broken=state.promises.some(p=>p.actor===actor&&p.status==='broken');
 const question=active?age===0?'Sweeps wants a fair path back to Term Life Insurance Plan. What do you offer?':age===1?`Sweeps returns. ${arc.route==='earn'?(arc.earned?'He won his qualifier. Now he wants a date for the fair rematch.':'He wants the name of his qualifying opponent.'):arc.route==='team'?'He wants to know whether this partnership has a future.':'He wants to know whether your word still holds.'}`:age===2?`${broken?'“You let me down once. Don’t sell me another speech.”':'“Put it on the poster, boss.”'} The big event is approaching.`:`This is the last conversation before ${monthlyEventName(arc.start+3)}. How should Sweeps approach tonight?`:`${w(actor).name} asks for ${weeklyRequest()==='promo'?'time on the microphone':weeklyRequest()==='win'?'a clean victory':'a match opportunity'} this week.`;
 const choices=active&&age===0?[
  ['rematch','Promise a fair rematch',`Due at ${monthlyEventName(arc.start+3)} · builds trust`],['earn','Make him earn the rematch','A clean qualifying win unlocks the opportunity'],['team','Try them as a tag team','Unlikely partners · a different kind of payoff']
 ]:active&&age===1?[
  ['back','Back your original plan','Reassures Sweeps · keep the booking commitment'],['change','Offer a guaranteed clean win','A new promise due this week'],['honest','Admit you cannot promise a result','Small trust cost · no new obligation']
 ]:active&&age===2?[
  ['commit','Commit to the big-event payoff','A dated promise · the room will remember'],['delay','Explain that the story needs time','An honest delay · protects your flexibility'],['reject','Tell him to stop asking','No commitment · damages trust']
 ]:active?[
  ['respect','Tell him to earn the room’s respect','Confidence and trust · protect both wrestlers'],['revenge','Tell him to make it personal','More feud heat · less mutual respect'],['team','Ask him to trust his partner','Team chemistry if they share a team tonight']
 ]:[['yes',weeklyRequest()==='promo'?'Promise time on the mic':weeklyRequest()==='win'?'Promise a clean win tonight':'Promise a match tonight','Trust rises if you deliver'],['later','Ask for patience','No promise · a small trust cost'],['no','Be honest: no place tonight','Closes the request · trust dips']];
 const special=CHARACTER_SPECIALS[actor],visit=Object.values(state.backstage).filter(record=>record.actor===actor).length,branch=special.branches[visit%2];
 if(!active){choices.push(['spotlight',branch[0]+' · offer a character promo','Promise microphone time tonight · trust depends on delivery']);}
 return {arc,age,active,actor,question:active?question:`“${branch[1]}” ${question}`,choices,answered:active?arc.answered[state.week]:state.backstage[state.week]};
}
function resolveBackstage(actor,choice,tone,active,age){
 const r=w(actor),a=state.arc;
 if(active&&a.answered[state.week]||!active&&state.backstage[state.week])return;
 if(tone==='private')r.trust=clamp(r.trust+3);else r.momentum=clamp(r.momentum+2,-20,20);
 if(active){
  if(age===0){a.route=choice;developStory(10,17,18,'A disputed cheap shot left Sweeps asking for a fair chance.');if(choice==='rematch')makePromise(10,'rematch',a.start+3,17)}
  if(choice==='change')makePromise(actor,'win',state.week);
  if(choice==='commit'){
   if(a.route==='team')makePromise(10,'team',a.start+3,17);
   else if(a.route!=='earn'||a.earned)makePromise(10,'rematch',a.start+3,17);
   else makePromise(10,'win',state.week);
  }
  if(choice==='revenge')developStory(10,17,12,`Sweeps has been told to make ${monthlyEventName(a.start+3)} personal.`,'complication');
  if(choice==='respect')r.momentum=clamp(r.momentum+3,-20,20);
  if(choice==='team'&&age===3)for(const team of state.teams.filter(t=>[t.a,t.b].includes(10)))team.chemistry=clamp(team.chemistry+6);
  if(choice==='reject')r.trust=clamp(r.trust-8);if(['honest','delay'].includes(choice))r.trust=clamp(r.trust-2);
  a.answered[state.week]={choice,tone,summary:choicesSummary(choice)};
 }else{
  if(choice==='yes'||choice==='spotlight')makePromise(actor,choice==='spotlight'?'promo':weeklyRequest(),state.week);else r.trust=clamp(r.trust-(choice==='no'?4:1));
  state.backstage[state.week]={actor,choice,tone,summary:choice==='spotlight'?'You promised a character promo tonight.':choice==='yes'?`You promised ${weeklyRequest()==='promo'?'a microphone segment':weeklyRequest()==='win'?'a clean victory':'a match opportunity'} tonight.`:choicesSummary(choice)};
 }
 const response=active?a.answered[state.week]:state.backstage[state.week];
 incident(`${r.name}: ${response.summary} ${tone==='private'?'You kept the conversation private.':'You made it part of the publicity.'}`,[actor],'backstage');
}
function choicesSummary(choice){return ({rematch:'A fair rematch was promised.',earn:'An earned route to the rematch was agreed.',team:'You asked for a reluctant partnership.',back:'You backed the original plan.',change:'A clean win was promised tonight.',honest:'You were honest about the uncertainty.',commit:'You committed to the next step.',delay:'You explained the delay.',reject:'You refused the request.',respect:'You asked for respect, not humiliation.',revenge:'You encouraged revenge.',yes:'A match was promised tonight.',later:'You asked for patience.',no:'You said there was no place tonight.'})[choice]||'You had a word backstage.'}
function storyHub(){
 const stories=Object.values(state.stories).sort((a,b)=>b.lastWeek-a.lastWeek),open=state.promises.filter(p=>p.status==='open');
 const a=state.arc,active=state.week>=a.start&&state.week<a.start+4;
 return `<section class="story-hub"><div class="section-head"><h2>Story planner</h2><button class="text-btn" id="plan-story">Plan a beat ↗</button></div>${active?`<div class="card arc-card"><small>WEEK ${a.start+3} · ${esc(monthlyEventName(a.start+3))}</small><h3>A fair shake for Sweeps</h3><p>${a.route==='earn'?(a.earned?'The qualifying win is in. A fair rematch is available.':'Book Sweeps a clean qualifying victory before the big event.'):a.route==='team'?'Try Sweeps and the insurer on the same side. The partnership needs a match and a little faith.':a.route==='rematch'?`Deliver a clean Sweeps–Insurance match by week ${a.start+3}.`:'Sweeps wants a fair rematch after a disputed loss to the insurer.'}</p><button class="text-btn" data-story-cast="10">Book Sweeps →</button></div>`:''}<div class="plan-grid">${Array.from({length:4},(_,i)=>{const week=Math.floor((state.week-1)/4)*4+i+1;return `<div class="plan-week ${week===state.week?'current':''}"><small>WEEK ${week}${week%4===0?' · '+esc(monthlyEvent(week).town):''}</small><strong>${esc(state.plans[week]||['Opening angle','Follow-up','Go-home show',monthlyEventName(week)][i])}</strong></div>`}).join('')}</div>${open.length?`<div class="card"><h3>Booking promises</h3>${open.map(p=>`<p class="note">${esc(promiseLabel(p))} ${promiseMet(p)?'✓ On the card':''}</p>`).join('')}</div>`:''}${state.challenges.some(c=>c.status==='open')?`<div class="card"><h3>Open challenges</h3>${state.challenges.filter(c=>c.status==='open').map(c=>`<p>${esc(w(c.actor).name)} → ${esc(w(c.target).name)} <button class="text-btn" data-challenge="${c.id}">Book it</button> <button class="text-btn" data-defer="${c.id}">Decline</button></p>`).join('')}</div>`:''}${stories.length?stories.map(s=>`<details class="card story-record"><summary><span class="badge">${esc(s.phase)}</span> ${esc(s.participants.map(id=>w(id).name).join(' vs. '))} · ${s.heat} heat</summary><p>${esc(s.grievance)}</p><p class="note">Latest: ${esc(s.lastBeat)}</p></details>`).join(''):'<p class="note">A targeted promo or disputed finish can start a story. A clean big-event match can settle one.</p>'}</section>`;
}
function openPlanner(){
 const start=Math.floor((state.week-1)/4)*4+1;
 modal('Plan a story beat',`${field('Week',`<select name="week">${Array.from({length:4},(_,i)=>start+i).filter(week=>week>=state.week).map(week=>`<option value="${week}">Week ${week}${week%4===0?' · '+esc(monthlyEventName(week)):''}</option>`).join('')}</select>`)}${field('Planned story beat',`<input name="beat" maxlength="120" required placeholder="Sweeps earns his fair rematch…">`)}<p class="note">This is a pencil mark, not a locked booking. Change the plan whenever the story changes.</p>`,(f,d)=>{const beat=f.get('beat').trim();if(!beat)return;state.plans[f.get('week')]=beat;d.close();render()},'Save plan');
}
function seasonGoals(){return careerPanel()}

function storyRecap(h){return `<section class="card story-fallout"><small>WHAT CHANGED · WHAT COMES NEXT</small><h2>Backstage report</h2>${careerRecap(h)}${(h.fallout||[]).length?h.fallout.map(entry=>`<p>${esc(typeof entry==='string'?entry:entry.text)}</p>`).join(''):'<p>Your card gave the roster another night in front of the room.</p>'}${h.season?`<div class="result"><h3>Season ${h.season.season}: season report</h3><p>${h.season.shows} shows · average rating ${h.season.average} · ${h.season.kept} promises kept · ${h.season.payoffs} story payoffs</p></div>`:''}<p class="note">Next week: ${esc(nextStoryHint())}</p></section>`}
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
    const story=storyFor(10,17);developStory(10,17,-(story?.heat||0),`The unlikely partners made it through ${monthlyEventName()} together.`,'aftermath');
    fallout.push(incident(`Sweeps and the insurer teamed together at ${monthlyEventName()}.`,[10,17],'payoff'));
   }
   fallout.push(incident(a.outcome==='partners'?`Sweeps: “You covered my back. I suppose that counts as a policy worth keeping.” The team leaves ${monthlyEvent().town} together.`:a.outcome==='victory'?'Sweeps: “Keep the paperwork. I’ve got the result.” A fair shake became a victory.':a.outcome==='respect'?'Sweeps: “I lost. But nobody can say I didn’t belong in there.” A clean defeat earns the room’s respect.':`Sweeps puts the broom away: “We’ve packed up in ${monthlyEvent().town}, and I’m still waiting for my fair shake.” The rematch is still unresolved.`,[10,17],'aftermath'));
  }
 }
 for(const story of Object.values(state.stories))if(story.lastWeek<state.week-1&&story.phase!=='aftermath'){story.heat=clamp(story.heat-4);state.rivalries[rivalryKey(...story.participants)]=story.heat}
}
function bindStoryControls(){
 if($('#plan-story'))$('#plan-story').onclick=openPlanner;
 if($('#review-week'))$('#review-week').onclick=()=>openWeeklyBriefing(true);
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
function historyStoryDetails(h){return `<details class="history-details"><summary>Read the night’s stories</summary>${careerRecap(h)}${(h.fallout||[]).map(entry=>`<p>${esc(typeof entry==='string'?entry:entry.text)}</p>`).join('')||'<p>Only show totals were retained in this older career entry.</p>'}${(h.results||[]).map(r=>`<p><strong>${esc(r.headline)}</strong><br>${esc(r.explanation)}</p>`).join('')}</details>`}

function bookingStoryActions(){
 const actions=[];
 for(const p of state.promises.filter(p=>p.status==='open').sort((a,b)=>a.due-b.due)){
  const team=p.kind==='team',target=p.kind==='rematch'?p.target:null;
  const draft=p.kind==='promo'
   ?{...blankBooking('promo'),a:p.actor,hook:'Win the crowd'}
   :{...blankBooking('match'),a:p.actor,b:target,format:team?'tag':'singles',
    sides:team?[[p.actor,p.target],[null,null]]:[[p.actor],[target]],
    type:'Singles match',finish:'Clean finish',winner:p.kind==='win'?p.actor:null};
  actions.push({label:promiseLabel(p),button:{promo:'Book mic time',team:'Book tag match',rematch:'Book rematch',win:'Book clean win'}[p.kind]||'Book match',draft,
   scheduled:state.card.findIndex(s=>!bookingProblems(s).length&&promiseMet(p,[s])),promise:true});
 }
 const threads=new Map();
 for(const s of Object.values(state.stories).filter(s=>s.phase!=='aftermath'&&s.heat>0).sort((a,b)=>b.lastWeek-a.lastWeek||b.heat-a.heat)){
  threads.set(rivalryKey(...s.participants),{pair:s.participants,label:s.lastBeat,after:-1});
 }
 state.card.forEach((s,index)=>{
  if(s.kind==='promo'&&s.target!=null&&promoNeedsTarget(s)&&!bookingProblems(s).length){
   threads.set(rivalryKey(s.a,s.target),{pair:[s.a,s.target],label:w(s.a).name+' has a promo with '+w(s.target).name+' on this card.',after:index});
  }
 });
 for(const {pair:[a,b],label,after} of threads.values()){
  const scheduled=state.card.findIndex((s,index)=>index>after&&!bookingProblems(s).length&&(
   s.kind==='match'?participantPairs(s).some(([x,y])=>rivalryKey(x,y)===rivalryKey(a,b)):
   s.kind==='promo'&&s.target!=null&&rivalryKey(s.a,s.target)===rivalryKey(a,b)));
  const name=w(a).name+' vs. '+w(b).name;
  actions.push({label:name,detail:label,after,scheduled,button:'Book the match',
   draft:{...blankBooking('match'),format:'singles',sides:[[a],[b]],a,b,type:'Singles match',finish:'Clean finish'},
   reply:{...blankBooking('promo'),a:b,target:a,hook:'Fuel a rivalry'}});
 }
 return actions;
}

function bookingStoryQueue(actions){
 const rows=(promise)=>actions.map((action,i)=>{
  if(!!action.promise!==promise)return '';
  const slot=storyBookingSlot(action);
  const controls=action.scheduled>=0
   ?`<button class="text-btn" data-story-scheduled="${action.scheduled}">Scheduled · segment ${action.scheduled+1} ↗</button>`
   :slot<0?'<small>Free a slot or finish a draft to book this.</small>'
   :`<button class="btn" data-story-book="${i}">${action.button}</button>${action.reply?` <button class="text-btn" data-story-reply="${i}">Give them a reply</button>`:''} <small>Slot ${slot+1}</small>`;
  return `<div class="story-booking-row"><strong>${esc(action.label)}</strong>${action.detail?`<p class="note">${esc(action.detail)}</p>`:''}<div>${controls}</div></div>`;
 }).join('');
 const promises=rows(true),stories=rows(false);
 return promises||stories?`<section class="card story-booking-queue" aria-label="Booking follow-ups">${promises?`<h3>Promises to keep</h3>${promises}`:''}${stories?`<h3>Stories in motion</h3>${stories}`:''}</section>`:'';
}

function storyBookingSlot(action){
 return state.card.findIndex((s,i)=>i>(action.after??-1)&&!s.kind&&!state.drafts[i]);
}

function bindBookingStoryQueue(){
 if(!$('.story-booking-queue'))return;
 const actions=bookingStoryActions();
 document.querySelectorAll('[data-story-scheduled]').forEach(button=>button.onclick=()=>focusBookingSegment(Number(button.dataset.storyScheduled)));
 document.querySelectorAll('[data-story-book],[data-story-reply]').forEach(button=>button.onclick=()=>{
  const action=actions[Number(button.dataset.storyBook??button.dataset.storyReply)];
  const slot=storyBookingSlot(action);
  if(slot<0)return;
  const draft=button.hasAttribute('data-story-reply')?action.reply:action.draft;
  openStoryBooking(slot,draft);
 });
}

function openStoryBooking(slot,draft){
 state.drafts[slot]=draft;
 save();
 openBookingDesk(slot,draft.kind);
}
