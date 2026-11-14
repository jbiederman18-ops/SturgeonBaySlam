'use strict';
const MATCH_FORMATS={singles:{label:'Singles',sizes:[1,1]},tag:{label:'Tag team · 2 vs 2',sizes:[2,2]},triple:{label:'Triple threat',sizes:[1,1,1]},four:{label:'Four-way',sizes:[1,1,1,1]},trios:{label:'Six-person tag · 3 vs 3',sizes:[3,3]},royal:{label:'Battle royal · 6 wrestlers',sizes:[1,1,1,1,1,1]}};
const CHARACTER_SPECIALS=[
 {
  "name": "Olympian Trials",
  "prop": "Laurel wreath",
  "branches": [
   [
    "Demonstrate Greco Wrestling",
    "Watch from the seats, Athens. I want to know how Greco Wrestling looks from where you’re sitting."
   ],
   [
    "Study the other corner",
    "I know where I’m standing when the bell rings, mortal. I want to know what the other corner sees."
   ]
  ]
 },
 {
  "name": "Two-Hold Clinic",
  "prop": "Two-hold practice notebook",
  "branches": [
   [
    "Drill Hold One",
    "Hold One first. Watch the angle. Hold Two is coming as soon as I get this right."
   ],
   [
    "Switch to Hold Two",
    "Hold Two. Then right back to Hold One. There’s no third station."
   ]
  ]
 },
 {
  "name": "Fourth-Down Fight",
  "prop": "Sideline playbook",
  "branches": [
   [
    "Call the huddle",
    "Nobody gets left on the bench in my huddle."
   ],
   [
    "Ask for one more play",
    "I only need one opening. Keep watching."
   ]
  ]
 },
 {
  "name": "Entire Stable Challenge",
  "prop": "Stable roll-call sheet",
  "branches": [
   [
    "Call a stable meeting",
    "We checked with the boys. No outside partners, unanimous."
   ],
   [
    "Submit both names for the tag titles",
    "We filled in both boxes. Naturally, both boxes say One Man."
   ]
  ]
 },
 {
  "name": "Dry Spell Main Event",
  "prop": "Grievance towel",
  "branches": [
   [
    "Read a name off the towel",
    "You shorted me a main event two Saturdays ago. The date is stitched right here."
   ],
   [
    "Fold it away",
    "That will keep. Everything does."
   ]
  ]
 },
 {
  "name": "Ringside Appeals Court",
  "prop": "Selective evidence briefcase",
  "branches": [
   [
    "Object to the result",
    "I object to being described as pinned. There is no need to watch the clip."
   ],
   [
    "Congratulate the referee",
    "The things you didn’t see were exceptionally sporting."
   ]
  ]
 },
 {
  "name": "Thesis Defense",
  "prop": "Doctor’s credential clipboard",
  "branches": [
   [
    "Present the credentials",
    "Doctor. The entire point of the nameplate is to save time."
   ],
   [
    "Decline the review",
    "No questions about the doctorate. A ring demonstration will suffice."
   ]
  ]
 },
 {
  "name": "Season Premiere Fight",
  "prop": "Clapperboard",
  "branches": [
   [
    "Pitch the next episode",
    "My close-up needs a rival who can stay in frame."
   ],
   [
    "Demand another take",
    "That reaction was a rehearsal. Now give me the premiere."
   ]
  ]
 },
 {
  "name": "Cold Front Collision",
  "prop": "Freeze ray",
  "branches": [
   [
    "Calibrate the freeze ray",
    "The dial says cold. The puddle says colder. Nearly there."
   ],
   [
    "Refuse to hand over the ray",
    "No, referee. This is the only thing keeping the ice from turning into, well, the other sort of ice."
   ]
  ]
 },
 {
  "name": "Pocket Power Challenge",
  "prop": "Mouse-ear headband",
  "branches": [
   [
    "Redefine adorable",
    "Adorable is what you call the landing before you feel it."
   ],
   [
    "Measure the opposition",
    "Big talk. Conveniently low center of gravity."
   ]
  ]
 },
 {
  "name": "Clean Sweep Challenge",
  "prop": "Lucky broom",
  "branches": [
   [
    "Mark a fresh start",
    "A fresh start begins with getting this bloody dirt off the floor."
   ],
   [
    "Draw the line",
    "No, the mess cannot wait until after the match. Move."
   ]
  ]
 },
 {
  "name": "VIP Access Rumble",
  "prop": "Velvet guest rope",
  "branches": [
   [
    "Check the guest list",
    "Your name is here under plus one. Mine is under essential."
   ],
   [
    "Call a connection",
    "I know somebody who can get me out of this headlock."
   ]
  ]
 },
 {
  "name": "Right-of-Way Rumble",
  "prop": "Reflective safety clipboard",
  "branches": [
   [
    "Correct the safety notice",
    "It’s a crossing, not an intersection. I’ve written the difference on both sides of this card."
   ],
   [
    "Explain the risk before taking it",
    "A shortcut is not automatically unsafe. Please watch closely while I demonstrate both parts of that sentence."
   ]
  ]
 },
 {
  "name": "Launch Window Clash",
  "prop": "Countdown placard",
  "branches": [
   [
    "Start the countdown",
    "Clear the launch pad. Doubt is excess baggage."
   ],
   [
    "Plot a new orbit",
    "You can take center stage. I need the whole sky."
   ]
  ]
 },
 {
  "name": "Reserved-for-Dad Showdown",
  "prop": "Reserved-for-Dad place card",
  "branches": [
   [
    "Ask if Dad is here",
    "My dad was in Jerry Maguire. If he comes in, please give him a programme."
   ],
   [
    "Save the best seat",
    "Please don’t fill that seat. Dad might come in after the bell."
   ]
  ]
 },
 {
  "name": "Parallel Lines Challenge",
  "prop": "Parallel lane tape",
  "branches": [
   [
    "Mark two lanes",
    "One strip for each of us. Keep to yours and we can go as far as you like."
   ],
   [
    "Try to meet without crossing",
    "We arrived at precisely the same time. How did we miss each other again?"
   ]
  ]
 },
 {
  "name": "Unbirthday Brawl",
  "prop": "Reserved teapot",
  "branches": [
   [
    "Reserve another seat",
    "The kettle gets a seat. You can earn one."
   ],
   [
    "Change the seating plan",
    "Terrible manners. Wonderful. Now it is a proper party."
   ]
  ]
 },
 {
  "name": "Coverage Denied Clash",
  "prop": "Policy binder",
  "branches": [
   [
    "Explain the exclusion",
    "That comeback requires a separate premium."
   ],
   [
    "Offer a policy review",
    "I can cover the entrance. The landing is entirely your responsibility."
   ]
  ]
 },
 {
  "name": "Courtesy Call Collision",
  "prop": "Thank-you stationery",
  "branches": [
   [
    "Offer a compliment",
    "Lovely guard. Please lower the guard for a more economical ambulance ride."
   ],
   [
    "Write a thank-you note",
    "Thank you for the opportunity. Please remit payment before the bruising subsides."
   ]
  ]
 },
 {
  "name": "Reply-All Riot",
  "prop": "Oversized cardboard phone",
  "branches": [
   [
    "Read the replies",
    "I saved the receipts. The referee can scroll after the bell."
   ],
   [
    "Post a correction",
    "My defeat was taken out of context. All three seconds of it."
   ]
  ]
 },
 {
  "name": "Heart Heist Match",
  "prop": "Heart-shaped lockbox",
  "branches": [
   [
    "Offer a welcome heart",
    "A heart for every corner, every referee, and every wonderful person telling me to hurry!"
   ],
   [
    "Make a grand gesture",
    "The whole crowd deserves a welcome too big for one lockbox!"
   ]
  ]
 },
 {
  "name": "Encore Collision",
  "prop": "Air-guitar stand",
  "branches": [
   [
    "Ask for an encore",
    "The first chorus was a warning. Sing the next one with me."
   ],
   [
    "Play the quiet verse",
    "Even a small room deserves the loudest finish I have."
   ]
  ]
 },
 {
  "name": "One-Sided Flop",
  "prop": "Reserved spot on the canvas",
  "branches": [
   [
    "Ask the front row to look down",
    "I’m the one right here. If you can see me, tell the other side."
   ],
   [
    "Wait for the flop",
    "I can wait until the match comes back into view. It usually does."
   ]
  ]
 },
 {
  "name": "Sweet-and-Sour Scramble",
  "prop": "Citrus brooch",
  "branches": [
   [
    "Offer a sweet smile",
    "Enjoy the presentation. The aftertaste comes later."
   ],
   [
    "Add some bite",
    "You wanted a little zest. I brought the whole lemon."
   ]
  ]
 },
 {
  "name": "Open Invitation Brawl",
  "prop": "Fellowship table",
  "branches": [
   [
    "Pray for both corners",
    "Lord, give both corners the strength to get up. And let somebody remember the spare cups afterward."
   ],
   [
    "Invite the room to fellowship",
    "If the Lord put somebody on your heart tonight, bring them to the table. There’s always room."
   ]
  ]
 },
 {
  "name": "Beat-Drop Battle",
  "prop": "Cardboard mixing deck",
  "branches": [
   [
    "Count in the room",
    "Do not rush the drop. We arrive together."
   ],
   [
    "Change the tempo",
    "You learned my rhythm. Good. Now try the remix."
   ]
  ]
 },
 {
  "name": "Five-Star Audit",
  "prop": "Star-rating paddle",
  "branches": [
   [
    "Lay out the match structure",
    "Shine, heat, comeback, finish. Put ’em in that ordah and then we can talk stars."
   ],
   [
    "Hold the rating until the bell",
    "You want a number already? We haven’t hit the heat yet. Sit down."
   ]
  ]
 },
 {
  "name": "Scenic Route Scramble",
  "prop": "Souvenir postcard rack",
  "branches": [
   [
    "Ask for directions",
    "I know the way. I want to hear the local recommendation."
   ],
   [
    "Send a postcard",
    "Wish you were here. Actually you are blocking the view."
   ]
  ]
 },
 {
  "name": "Most Fetching Face-Off",
  "prop": "Hand mirror",
  "branches": [
   [
    "Arrange a fair comparison",
    "Turn the light toward both of us. Yes, more toward this side, in the interest of fairness."
   ],
   [
    "Accept first place",
    "I’d like to thank everybody who could see from their seats. The others can come closer."
   ]
  ]
 },
 {
  "name": "Permanent Berth Match",
  "prop": "Mooring line",
  "branches": [
   [
    "Reserve a berth",
    "Same spot next week, if possible. The little guests have learned where the ramp is."
   ],
   [
    "Wait for everyone to board",
    "Take your time crossing. We’ll be here a while."
   ]
  ]
 },
 {
  "name": "Ninety-Second Comeback",
  "prop": "Insulated meal pouch",
  "branches": [
   [
    "Serve a full plate",
    "Please stop calling it a snack. This is dinner for both corners."
   ],
   [
    "Share the reserves",
    "I brought enough for everybody. Give the middle a second to cool."
   ]
  ]
 },
 {
  "name": "Impartial Hearing Match",
  "prop": "Two-sided lectern",
  "branches": [
   [
    "Hear both corners",
    "Both arguments have been heard. Both arguments may now end."
   ],
   [
    "State a neutral ambition",
    "I request a match without endorsing either corner. Please do not make me repeat this at a higher volume."
   ]
  ]
 },
 {
  "name": "Tied-Laces Challenge",
  "prop": "Spare laces for the pair",
  "branches": [
   [
    "Check both halves",
    "Left a little ahead. Right still tied on. Both halves accounted for."
   ],
   [
    "Find Rudy’s other shoe",
    "Rudy, we heard you were missing one. We travel as a pair, so take both."
   ]
  ]
 },
 {
  "name": "Last Course Collision",
  "prop": "Giant dessert spoon",
  "branches": [
   [
    "Save room for dessert",
    "The main course is finished. Now comes the wobble."
   ],
   [
    "Offer a second helping",
    "You thought that was the finish? I brought seconds."
   ]
  ]
 },
 {
  "name": "Specific Set of Stipulations",
  "prop": "Signed comeback headshot",
  "branches": [
   [
    "Pitch the comeback",
    "Pour something worthy of a toast; I have secured another fight."
   ],
   [
    "Ask for another round",
    "The films stopped calling, but I still have a face worth putting on the poster and fists worth ducking."
   ]
  ]
 },
 {
  "name": "Root Canal Rumble",
  "prop": "Golden mouthguard",
  "branches": [
   [
    "Show the strong roots",
    "You can rattle the crown. You will not move the roots."
   ],
   [
    "Ask for a clean break",
    "A clean break is a matter of professional pride. Open wide."
   ]
  ]
 },
 {
  "name": "Here by Choice Challenge",
  "prop": "Stack of alternative invitations",
  "branches": [
   [
    "Display the other invitations",
    "I could be in any of these halls. Notice which floor I am standing on."
   ],
   [
    "Confirm the voluntary appearance",
    "Nobody had to persuade me. I already booked my own entrance twice."
   ]
  ]
 },
 {
  "name": "No Dogs Banned Scramble",
  "prop": "Unabridged wrestling rulebook",
  "branches": [
   [
    "Point to the relevant page",
    "I am a dog. This is the rulebook. Point to the part that says I cannot wrestle."
   ],
   [
    "Lead the room in a howl",
    "Dog wants a wrestling crowd. Front row, start the howl!"
   ]
  ]
 }
];
// Old saves store signature names as match rules. Resolve renamed rules only for the signature’s owner.
const RETIRED_SIGNATURE_NAMES={
 "One-on-One Manifesto": "Entire Stable Challenge",
 "Spin-Cycle Showdown": "Dry Spell Main Event",
 "Master Plan Match": "Right-of-Way Rumble",
 "Third-Act Showdown": "Reserved-for-Dad Showdown",
 "Turning Tide Fight": "One-Sided Flop",
 "Best-in-Show Bout": "Most Fetching Face-Off",
 "All-Aboard Collision": "Permanent Berth Match",
 "Goal-Line Stand": "Tied-Laces Challenge"
};
function signatureFor(s){const name=Object.hasOwn(RETIRED_SIGNATURE_NAMES,s.type)?RETIRED_SIGNATURE_NAMES[s.type]:s.type;return CHARACTER_SPECIALS.find((special,id)=>special.name===name&&matchPeople(s).includes(id))}
function matchRuleName(s){return signatureFor(s)?.name||s.type}
const MATCH_RULES=['Singles match','No disqualification','Ladder match','Steel cage','Tables match','Submission match','Last person standing','Office Supplies Deathmatch'];
function rulesFor(s){const signatures=matchFormat(s)==='royal'?[]:[...new Set(matchPeople(s).map(id=>CHARACTER_SPECIALS[id]?.name).filter(Boolean))];return [...( matchFormat(s)==='royal'?['Singles match','No disqualification']:teamFormat(s)?MATCH_RULES.filter(rule=>rule!=='Last person standing'):MATCH_RULES),...signatures,...(matchFormat(s)==='singles'&&[0,34].every(id=>matchPeople(s).includes(id))?[KILL_POLANSKI]:[])]}
function matchFormat(s){return MATCH_FORMATS[s.format]?s.format:'singles'}
function matchSides(s){return Array.isArray(s.sides)&&s.sides.length?s.sides.map(side=>side.slice()):[[s.a],[s.b]]}
function matchPeople(s){return s.kind==='promo'?[s.a,s.target].filter(id=>id!=null):s.kind==='match'?matchSides(s).flat().filter(id=>id!=null):[]}
function teamFormat(s){return MATCH_FORMATS[matchFormat(s)].sizes[0]>1}
function matchLabel(s){const format=matchFormat(s),base=MATCH_FORMATS[format].label,rule=matchRuleName(s);return rule&&rule!=='Singles match'?`${base} · ${rule}`:format==='singles'?'Singles match':base}
function sideLabel(side,teams=state.teams){const team=teams.find(t=>side.length===2&&[t.a,t.b].every(id=>side.includes(id)));return team?team.name:side.map(id=>w(id).name).join(' & ')}
function winningSide(s){return matchSides(s).findIndex(side=>side.includes(s.winner))}
function matchOpponents(s,id){return matchSides(s).filter(side=>!side.includes(id)).flat()}
function normalizeMatch(s,roster,teams=[]){
 if(s.kind!=='match')return {...s};
 const result={...s},oldShowcase=s.type==='Tag-team showcase';result.format=MATCH_FORMATS[s.format]?s.format:oldShowcase?'tag':'singles';
 const sizes=MATCH_FORMATS[result.format].sizes,old=Array.isArray(s.sides)?s.sides:oldShowcase?[[s.a,teams.find(t=>[t.a,t.b].includes(s.a))?.a===s.a?teams.find(t=>t.a===s.a)?.b:teams.find(t=>t.b===s.a)?.a],[s.b,teams.find(t=>[t.a,t.b].includes(s.b))?.a===s.b?teams.find(t=>t.a===s.b)?.b:teams.find(t=>t.b===s.b)?.a]]:[[s.a],[s.b]];
 const valid=new Set(roster.map(r=>r.id)),used=new Set();
 if(s.dilemma==='demeter')valid.add(DEMETER_ID);
 result.sides=sizes.map((size,i)=>{const ids=[];for(const id of old[i]||[])if(ids.length<size&&valid.has(id)&&!used.has(id)){ids.push(id);used.add(id)}return ids});
 // Reserve the existing side leaders before filling partners, so a format change cannot swallow an opponent.
 for(let i=0;i<result.sides.length;i++)while(result.sides[i].length<sizes[i]){const anchor=result.sides[i][0],team=teams.find(t=>[t.a,t.b].includes(anchor)),partner=team?[team.a,team.b].find(id=>!used.has(id)):undefined;const id=partner??roster.find(r=>!used.has(r.id))?.id;if(id===undefined)break;result.sides[i].push(id);used.add(id)}
 result.a=result.sides[0][0];result.b=result.sides[1][0];if(!result.sides.flat().includes(result.winner))result.winner=result.a;
 result.type=oldShowcase?'Singles match':matchRuleName(result);if(teamFormat(result))result.title=false;if(!rulesFor(result).includes(result.type))result.type='Singles match';
 return result;
}
function setMatchFormat(draft,format){const result=normalizeMatch({...draft,format},state.roster,state.teams);Object.assign(draft,result)}
function participantPairs(s){const sides=matchSides(s),pairs=[];for(let i=0;i<sides.length;i++)for(let j=i+1;j<sides.length;j++)for(const a of sides[i])for(const b of sides[j])pairs.push([a,b]);return pairs}
function overallRating(r){return Math.round(r.skill*.5+r.charisma*.3+r.pop*.2)}
function ratingBadge(r){return `<span class="overall-rating" title="Overall: ring ability, microphone skills and popularity" aria-label="Overall rating ${overallRating(r)} out of 100"><small>OVR</small><b>${overallRating(r)}</b></span>`}
function ratingStrip(r){return `<div class="card-ratings"><span>RING <b>${r.skill}</b></span><span>MIC <b>${r.charisma}</b></span><span>POP <b>${r.pop}</b></span></div>`}
// A win that came by cheating or a run-in. Rudy Giuliani only takes a loss personally when it did.
function matchCheated(s){return s?.kind==='match'&&['Cheating','Interference'].includes(s.finish)}
function showParticipants(card=state.card){return [...new Set(card.flatMap(s=>[...matchPeople(s),...(s.finish==='Interference'&&s.interferer!=null?[s.interferer]:[]),...(s.second!=null&&!dilemmaUnavailable(s.second)?[s.second]:[])]))]}
function ruleCost(s){return s.kind==='match'&&s.type&&!['Singles match','Tag-team showcase','Submission match','Last person standing'].includes(s.type)?niceMoney(120*costScale()):0}
function propCost(s){return niceMoney((SHOW_PROPS[s.prop]?.cost||0)*costScale())}
function matchCost(card=state.card){return venueCost()+showParticipants(card).length*wrestlerPay()+card.reduce((total,s)=>total+ruleCost(s)+propCost(s),0)+productionCost()+(typeof riseCost==='function'?riseCost():0)}
function establishedTeams(s){return state.teams.filter(t=>matchSides(s).some(side=>side.includes(t.a)&&side.includes(t.b)))}
function simulateShow(decisions=[]){
 storyDefaults(state);
 dilemmaPrepareShow();
 const cost=matchCost(),event=isEvent(),crowdBefore={...state.crowd},crowdDelta={chaos:0,purists:0,drama:0},counts={},promoCounts={},results=[],fallout=state.incidents.filter(entry=>entry.week===state.week&&['backstage','dilemma'].includes(entry.kind)).slice().reverse();
 if(typeof ledgerShowStart==='function')ledgerShowStart();
 const attendance=forecastAttendance(),matchCount=state.card.filter(s=>s.kind==='match').length;
 let ratingSum=0,beltChange=false;
 const avg=(people,key)=>people.reduce((n,r)=>n+r[key],0)/Math.max(1,people.length);
 state.card.forEach((s,i)=>{
  const ids=matchPeople(s),people=ids.map(w),notes=[],decision=decisions[i]||null;
  let rating,headline;
  const repetition=Math.max(0,...ids.map(id=>counts[id]||0));
  const fingerprint=s.kind==='promo'?`promo:${s.a}:${s.hook}:${s.target??'crowd'}`:`match:${ids.slice().sort((a,b)=>a-b).join('-')}:${s.type}`;
  const recent=state.history.slice(0,2).filter(h=>h.fingerprints?.includes(fingerprint)).length;
  if(s.kind==='promo'){
   const a=w(s.a),nth=promoCounts[a.id]||0;
   rating=a.charisma*.65+a.pop*.22+state.crowd.drama*.08+4-nth*15-recent*6;
   const debut=s.hook==='Debut a gimmick'&&a.newGimmick&&state.week-a.lastDebut>=4;
   const gain=nth?0:recent>=2?1:debut?5:2;
   a.pop=clamp(a.pop+gain);promoCounts[a.id]=nth+1;
   if(debut){a.newGimmick=false;a.lastDebut=state.week;crowdDelta.chaos+=3}
   crowdDelta.drama+=nth?0:2;
   if(s.target!=null&&['Fuel a rivalry','Issue a challenge'].includes(s.hook)){
    const line=`${a.name} ${s.hook==='Issue a challenge'?'challenged':'confronted'} ${w(s.target).name}.`;
    developStory(a.id,s.target,8,line);fallout.push(incident(line,[a.id,s.target]));
    if(s.hook==='Issue a challenge'&&!state.challenges.some(c=>c.actor===a.id&&c.target===s.target&&c.status==='open'))state.challenges.push({id:`${state.week}-${i}`,actor:a.id,target:s.target,week:state.week,status:'open'});
   }
   headline=a.name+' takes the mic';notes.push(`Popularity +${gain}.${nth?' The same speaker is wearing out the welcome.':''}${recent?' Familiar material needs a new development.':''}`);
  }else{
   const sides=matchSides(s),win=sides[winningSide(s)],winners=win.map(w),losers=people.filter(r=>!win.includes(r.id)),other=losers[0],lead=w(s.winner),story=storyFor(lead.id,other.id),heat=story?.heat||0,special=s.type!=='Singles match';
   rating=avg(people,'skill')*.62+avg(people,'pop')*.25+6+heat*.08+(s.title?4:0)+(people.some(r=>r.role==='Face')&&people.some(r=>r.role==='Heel')?3:0)-recent*4;
   if(special){
    rating+=s.type==='Submission match'?Math.max(-2,(avg(people,'skill')-72)*.08):state.crowd.chaos*.045;
    if(s.type==='Submission match')crowdDelta.purists+=2;
    else{crowdDelta.chaos+=4;crowdDelta.purists-=2}
   }else{crowdDelta.purists+=3;rating+=2}
   if(people.length>=4)rating-=2;
   if(s.finish==='Clean finish'||s.finish==='Upset victory'){
    rating+=2;crowdDelta.purists+=2;
    if((s.presentation==='Upset'||s.finish==='Upset victory')&&avg(winners,'pop')<avg(losers,'pop')){rating+=3;notes.push('The underdog victory feels earned.')}
   }else{
    const grievance=s.finish==='Interference'&&w(s.interferer)?`${w(s.interferer).name} interfered for ${lead.name}, costing ${other.name} the match.`:`${lead.name} stole a win from ${other.name}.`;
    developStory(lead.id,other.id,14,grievance);fallout.push(incident(grievance,[lead.id,other.id,s.interferer].filter(id=>id!=null)));
    if(s.finish==='Interference'&&s.interferer!=null)developStory(other.id,s.interferer,18,grievance,'complication');
    crowdDelta.drama+=3;crowdDelta.purists-=3;
   }
   for(const t of establishedTeams(s)){rating+=t.chemistry*.025;t.chemistry=clamp(t.chemistry+4)}
   for(const r of winners){r.pop=clamp(r.pop+(r.pop<avg(losers,'pop')?4:2));r.morale=clamp(r.morale+3)}
   const loyal=losers.filter(r=>typeof rideOrDie==='function'&&rideOrDie(r.id));
   for(const r of losers){if(loyal.includes(r))continue;r.pop=clamp(r.pop-(s.finish==='Clean finish'?1:0));r.morale=clamp(r.morale-2)}
   if(loyal.length)notes.push(`${loyal.map(r=>r.name).join(' and ')} took the loss for you without a word.`);
   const dq=s.finish==='Disqualification';
   if(dq){rating-=8;crowdDelta.purists-=4;notes.push('The disqualification leaves the crowd without a decisive finish.');}
   const champ=people.find(r=>r.champ);
   if(s.title&&!dq&&!teamFormat(s)&&champ&&!win.includes(champ.id)&&lead.id!==DEMETER_ID){champ.champ=false;lead.champ=true;beltChange=true;fallout.push(incident(`${lead.name} is the new WWA champion. A new title chapter begins.`,[lead.id,champ.id],'title'))}
   for(const c of state.challenges.filter(c=>c.status==='open'))if(ids.includes(c.actor)&&ids.includes(c.target)&&!sides.some(side=>side.includes(c.actor)&&side.includes(c.target)))c.status='booked';
   headline=dq?sideLabel(win)+' win by disqualification':teamFormat(s)?sideLabel(win)+' win':lead.name+(matchFormat(s)==='royal'?' wins the battle royal':' gets the victory');
  }
  const doubleDuty=repetition===1&&typeof rideOrDie==='function'&&ids.filter(id=>counts[id]).every(rideOrDie);
  if(doubleDuty)notes.push('Back out for a second time tonight, no complaints: ride or die.');
  if(repetition&&!doubleDuty){const penalty=s.kind==='promo'?repetition*3:repetition>1?10:3;rating-=penalty;notes.push(`Repeated exposure: −${penalty} quality. A promo and match are lighter than repeated speeches.`)}
  if(typeof wholeRoom==='function'&&wholeRoom()&&ids.some(id=>inRoom(id))){
   if(s.kind==='match'&&(people.length>=3||teamFormat(s))){rating+=ROOM_ENSEMBLE;notes.push(`The whole room gels: +${ROOM_ENSEMBLE} quality.`)}
   else if(s.kind==='promo'&&s.target!=null){rating+=ROOM_DUO;notes.push(`The whole room gels: +${ROOM_DUO} quality.`)}
  }
  const moralePenalty=avg(people,'morale')<25?2:0;rating-=moralePenalty;
  rating+=avg(people,'momentum')*.12;
  const propOwner=SHOW_PROPS[s.prop]?.owner;if(propOwner!=null&&ids.includes(propOwner)){w(propOwner).momentum=clamp(w(propOwner).momentum+1,-20,20);notes.push(`${w(propOwner).name} brought ${SHOW_PROPS[s.prop].name} into the performance.`)}
  if(s.prop==='chairs'){crowdDelta.chaos+=2;crowdDelta.purists-=1;notes.push('Bev’s chairs made some noise.')}
  if(s.prop==='spotlight'){offstageTrust(w(s.a),2);notes.push('A borrowed spotlight gave the moment room to breathe.')}
  if(s.prop==='broom'&&s.kind==='match'){for(const id of ids.filter(id=>!matchSides(s)[winningSide(s)].includes(id)))w(id).morale=clamp(w(id).morale+2);notes.push('The lucky broom softened the disappointment of defeat.')}
  rating+=applyProductionDecision(i,people,fallout);
  rating+=dilemmaSegment(s,i,notes,fallout,crowdDelta);
  if(typeof ledgerSegmentBonus==='function')rating+=ledgerSegmentBonus();
  applyMomentEffect(decision,s,fallout);
  if(s.kind==='match'){
   const other=matchOpponents(s,s.winner)[0],story=storyFor(s.winner,other);
   if(event&&story&&story.heat>0&&['Clean finish','Upset victory'].includes(s.finish)){
    rating+=Math.min(10,story.heat*.12);story.phase='aftermath';story.heat=Math.round(story.heat*.25);story.lastBeat=`${w(s.winner).name} won cleanly at ${monthlyEventName()}.`;story.lastWeek=state.week;state.rivalries[rivalryKey(s.winner,other)]=story.heat;crowdDelta.drama+=5;
    fallout.push(incident(`${story.participants.map(id=>w(id).name).join(' and ')} settled this chapter with a clean big-event result.`,story.participants,'payoff'));
   }
   if(event&&s.winner===1&&state.dilemmas.holds!=='one'&&!state.milestones.holdTwo){state.milestones.holdTwo=true;w(1).pop=clamp(w(1).pop+4);fallout.push(incident('2 Holds chains Hold One into Hold Two and back again without a break. The front row keeps count until the bell.',[1],'milestone'))}
   if(!teamFormat(s)&&s.winner===3&&!state.milestones.oneMan){state.milestones.oneMan=true;offstageTrust(w(3),5);fallout.push(incident('One Man credits the whole stable after a solo win: “The boys and I would like both tag belts. No outside help, please.” Trust +5.',[3],'milestone'))}
  }
  for(const id of ids){counts[id]=(counts[id]||0)+1;w(id).lastSeen=state.week}
  const varietyPenalty=matchCount<2?18:0,baseRating=clamp(Math.round(rating-varietyPenalty)),score=clamp(baseRating+(decision?clamp(decision.delta,-3,3):0));ratingSum+=score;
  results.push({headline,explanation:decision?.outcome||(s.kind==='promo'?`${w(s.a).name} finishes the address.`:beatStory(finishBeats(s,{tag:''}).beats)),analysis:notes.join(' '),rating:score,baseRating,decision,participants:ids,title:!!s.title,...(matchCheated(s)?{cheated:true}:{}),label:s.kind==='promo'?'PROMO':matchLabel(s).toUpperCase(),fingerprint});
 });
 finishStoryWeek(fallout);
 // Old careers may still carry the original one-night request.
 if(state.request==='yes'){
  const kept=promiseMet({actor:10,kind:'win'});w(10).morale=clamp(w(10).morale+(kept?8:-12));fallout.push(incident(kept?'The original clean-win promise to Sweeps was kept.':'Sweeps remembers the original broken clean-win promise.',[10],'promise'));
 }
 const rumorPromo=state.relations?.week?.week===state.week&&state.relations.week.answers?.[`${state.week}-18`]?.charmingBuzz===true&&state.card.some(s=>s.kind==='promo'&&s.a===18);
 if(rumorPromo)fallout.push(incident('Charming’s promo drove more fans to the rumor thread. The booking office caught some of the blame.',[18],'relationship'));
 for(const key of Object.keys(crowdDelta)){
  const normalized=state.crowd[key]+Math.round((50-state.crowd[key])*.12);
  state.crowd[key]=clamp(normalized+clamp(crowdDelta[key],-8,8)+(key==='drama'&&rumorPromo?4:0),10,90);crowdDelta[key]=state.crowd[key]-crowdBefore[key];
 }
 for(const r of state.roster)if(!counts[r.id]){r.morale=clamp(r.morale-(state.week-r.lastSeen>3?1:0));r.momentum+=r.momentum>0?-1:r.momentum<0?1:0}
 const rating=Math.round(ratingSum/state.card.length),repChange=(rating>=80?3:rating>=65?2:rating>=50?0:-2)+(beltChange?1:0)+dilemmaShowEnd(fallout)-(rumorPromo?2:0),profit=attendance*ticketPrice(event)+broadcastIncome()-cost;
 state.cash+=profit;state.rep=clamp(state.rep+repChange);
 const recap={week:state.week,name:showName(),location:showLocation(),...(event?{event:monthlyEvent()}:{}),rating,attendance,capacity:venueCapacity(),ticket:ticketPrice(event),broadcast:broadcastIncome(),championId:champion().id,teamFeatured:state.card.some(s=>s.kind==='match'&&establishedTeams(s).length>0),profit,cost,repChange,results,crowdDelta,fallout,fingerprints:results.map(r=>r.fingerprint)};
 state.history.unshift(structuredClone(recap));
 if(state.week%12===0){
  const shows=state.history.filter(h=>h.week>state.week-12),season={season:Math.ceil(state.week/12),shows:shows.length,average:Math.round(shows.reduce((n,h)=>n+h.rating,0)/shows.length),kept:state.promises.filter(p=>p.status==='kept'&&p.resolved>state.week-12).length,payoffs:state.incidents.filter(i=>i.kind==='payoff'&&i.week>state.week-12).length};
  recap.season=season;state.history[0].season=season;state.seasonReports.push(season);
 }
 if(typeof riseAfterShow==='function')riseAfterShow(recap);
 advanceCareer(recap);state.recap=recap;return recap;
}

// Preserve the established save value while showing format-neutral rules to players.
function matchRuleOptions(segment){return rulesFor(segment).map(rule=>`<option value="${esc(rule)}" ${matchRuleName(segment)===rule?'selected':''}>${esc(rule==='Singles match'?'Standard':rule)}</option>`).join('')}
function rosterCardName(r){return r.id===36&&r.name===initialRoster[36].name?'Tessa Blanchard':r.name}
