'use strict';
// Rise to Supremacy: eras change the booker's job, not just the size of the numbers.
// Eight career chapters group into five eras. Each era brings a rival, a bigger card,
// its own weekly problems and opportunities, and a moving-day milestone.

const ERAS=[
 {id:'gym',roman:'I',name:'The Gym Years',tagline:'You set up the chairs yourself.',accent:'#c8231b',card:4,scale:1,fix:40,region:'Door County',
  rival:{name:'Door County Grapple Club',short:'the Grapple Club',home:'VFW Post 7, Sturgeon Bay'},
  field:[['Peninsula Pro Wrestling','Egg Harbor',.62],['Northwoods Grapple','Sister Bay',.35]],
  verbs:'Book four segments and handle every problem yourself.'},
 {id:'circuit',roman:'II',name:'The Circuit',tagline:'Three towns, one van and your first crew.',accent:'#1d6b45',card:5,scale:3,fix:150,region:'Wisconsin',
  rival:{name:'Fox Valley Championship Wrestling',short:'Fox Valley',home:'Appleton'},
  field:[['Lakeshore Lucha Libre','Milwaukee',.72],['Northwoods Pro','Wausau',.44],['Door County Grapple Club','Sturgeon Bay',.2]],
  verbs:'Five segments. Hire a crew to take problems off your plate.'},
 {id:'territory',roman:'III',name:'The Territory',tagline:'Regional TV, ratings and poachers.',accent:'#a8431a',card:6,scale:12,fix:600,region:'Great Lakes',
  rival:{name:'Great Lakes Wrestling Federation',short:'the GLWF',home:'Milwaukee'},
  field:[['Chicago Brawl League','Chicago',.8],['Motor City Mayhem','Detroit',.55],['Fox Valley Championship Wrestling','Appleton',.3]],
  verbs:'Six segments for television. Stations, cameras and rival offers become your problems.'},
 {id:'war',roman:'IV',name:'The War',tagline:'National TV against Apex Pro. You stop booking every match.',accent:'#5b2a8c',card:7,scale:50,fix:2500,region:'National',
  rival:{name:'Apex Pro Wrestling',short:'Apex',home:'Orlando'},
  field:[['Pacific Coast Pro','Los Angeles',.62],['Southern Heat Wrestling','Atlanta',.4],['Great Lakes Wrestling Federation','Milwaukee',.25]],
  verbs:'Seven segments. Book the top of the card and let your writers draft the rest.'},
 {id:'supremacy',roman:'V',name:'Supremacy',tagline:'Stadiums, a dynasty and a homecoming.',accent:'#7a5a0c',card:7,scale:150,fix:8000,region:'National',
  rival:{name:'Apex Pro Wrestling',short:'Apex',home:'Orlando'},
  field:[['Pacific Coast Pro','Los Angeles',.5],['Southern Heat Wrestling','Atlanta',.3]],
  verbs:'Stay on top, and remember the town that built you.'}
];
// The rival's average crowd you need to beat in each of the eight chapters.
const RIVAL_AVERAGE=[180,420,850,2000,3800,6200,11500,22000];

function eraIndex(stage=state?.progression?.stage||0){return stage<=1?0:stage===2?1:stage<=4?2:stage<=6?3:4}
function currentEra(){return ERAS[eraIndex()]}
function cardSize(){try{return state?ERAS[eraIndex()].card:4}catch{return 4}}
function fixCost(){return careerStage().fix}

function riseDefaults(s){
 s.rise??={};
 const r=s.rise;
 r.wins??=[];r.losses??=[];r.fights??={};r.press??={};r.crew??=[];r.traditions??=[];r.moves??=[];r.originals??=[];r.dents??={};
 r.rank??=null;r.lastRank??=null;
 // Careers from before the eras remember their earliest performers as the originals.
 if(!r.originals.length&&Array.isArray(s.history)&&s.history.length)r.originals=[...new Set(s.history.slice(-8).flatMap(h=>h.results?.flatMap(x=>x.participants||[])||[]))].filter(id=>s.roster?.some(x=>x.id===id));
 return r;
}

// ---------- Rivals and standings ----------
function rivalAverage(stage=state.progression?.stage||0,week=state.week){
 const dents=state.rise?.dents?.[stage]||0;
 return Math.round(RIVAL_AVERAGE[stage]*(1+.05*Math.sin(week*1.7))*Math.max(.7,1-.06*dents)*(typeof ledgerRivalFactor==='function'?ledgerRivalFactor(week):1));
}
function yourAverage(count=4){
 const shows=state.history.slice(0,count);
 return shows.length?Math.round(shows.reduce((n,h)=>n+(h.attendance||0),0)/shows.length):0;
}
function stageAverage(count=4){
 const shows=state.history.filter(h=>h.week>=state.progression.stageStart).slice(0,count);
 return shows.length?Math.round(shows.reduce((n,h)=>n+(h.attendance||0),0)/shows.length):0;
}
function standings(){
 const era=currentEra(),lead=rivalAverage();
 const rows=[{name:era.rival.name,town:era.rival.home,avg:lead,rival:true},...era.field.map(([name,town,share])=>({name,town,avg:Math.round(lead*share*(1+.04*Math.cos(state.week+name.length)))})),{name:'Wisconsin Wrestling Alliance',town:'Sturgeon Bay',avg:yourAverage(),you:true}];
 rows.sort((a,b)=>b.avg-a.avg||(a.you?-1:1));
 return rows.map((row,i)=>({...row,rank:i+1}));
}
function yourRank(){return standings().find(row=>row.you).rank}
function headToHeadWins(stage=state.progression?.stage||0){return (state.rise?.wins||[]).filter(win=>win.stage===stage).length}
function rivalRequirement(){
 const p=state.progression,era=currentEra();
 if(p.stage===7){const rank=yourRank();return {label:`Hold #1 nationally: you are #${rank}`,done:rank===1,rival:true}}
 const mine=stageAverage(),theirs=rivalAverage(),wins=headToHeadWins();
 return {label:`Outdraw ${era.rival.short}: win a head-to-head night (${wins}/1) or average more than ${theirs.toLocaleString()} (you: ${mine.toLocaleString()})`,done:wins>=1||mine>theirs,rival:true};
}

// ---------- Territory fights on monthly tour nights ----------
function territoryFightWeek(week=state.week){return week%4===0&&!(state.progression?.dynasty)}
function territoryFight(){
 if(!territoryFightWeek())return null;
 const era=currentEra();
 return {rival:era.rival,choice:state.rise.fights[state.week]?.choice||null,raidCost:fixCost()*3,night:rivalNight()};
}
function rivalNight(week=state.week){return Math.round(rivalAverage()*.9*(.92+.16*((week*37)%10)/10))}
function chooseTerritory(choice){
 if(!territoryFightWeek()||state.recap||state.liveShow||!['fight','move','raid'].includes(choice))return false;
 state.rise.fights[state.week]={choice};save();return true;
}
function fightChoice(){return territoryFightWeek()?(state.rise?.fights?.[state.week]?.choice||'fight'):null}
function attendanceModifier(){
 let factor=1;
 if(state.rise?.traditions?.includes('kids'))factor*=1.04;
 const choice=fightChoice();
 if(choice==='raid')factor*=1.08;
 // The Good Lord Above fills a few seats for a booker He's pleased with, and empties a few otherwise.
 if(typeof lordAttendanceFactor==='function')factor*=lordAttendanceFactor();
 if(typeof ledgerCrowdFactor==='function')factor*=ledgerCrowdFactor();
 return factor;
}
function riseCost(){return crewCost()+(fightChoice()==='raid'?fixCost()*3:0)}

// ---------- Crew ----------
const CREW=[
 {id:'ring',name:'Ring crew · Dale & sons',dept:'ring',base:60,era:1,perk:'Handles ring, travel and set problems.',quirk:'Wants the van on Sundays.'},
 {id:'venue',name:'Road agent · Bev',dept:'venue',base:75,era:1,perk:'Handles venue, seating and ticket problems.',quirk:'Has opinions on the main event.'},
 {id:'production',name:'Production manager',dept:'production',base:90,era:2,perk:'Handles sound, camera, press and station problems.',quirk:'Bills overtime in fifteen-minute blocks.'}
];
function crewAvailable(){return CREW.filter(c=>c.era<=eraIndex())}
function crewHired(id){return state.rise?.crew?.includes(id)}
// A crew member costs about a quarter to a third of the problems they solve.
function crewSalary(c){return niceMoney(c.base/240*fixCost())}
function crewCost(){return (state.rise?.crew||[]).map(id=>CREW.find(c=>c.id===id)).filter(Boolean).reduce((n,c)=>n+crewSalary(c),0)}
function crewFor(dept){return (state.rise?.crew||[]).map(id=>CREW.find(c=>c.id===id)).find(c=>c&&c.dept===dept)}
function toggleCrew(id){
 const c=CREW.find(x=>x.id===id);if(!c||c.era>eraIndex()||state.liveShow)return false;
 if(crewHired(id))state.rise.crew=state.rise.crew.filter(x=>x!==id);else state.rise.crew.push(id);
 save();return true;
}

// ---------- Weekly problems by era ----------
const ERA_ISSUES=[
 [],
 [
  {id:'c-oversold',dept:'venue',title:'The Wausau hall oversold.',safe:'Rent bleachers from the high school',wild:'Have the opener work the overflow at ringside',crew:'Refund the late arrivals',text:'Ninety ticket holders are standing in the lobby at bell time, and Bev is out of chairs. Bleachers cost {cost}.',success:'The ringside overflow became the loudest section in the building.',failure:'The overflow crowd spent the opener complaining.'},
  {id:'c-van',dept:'ring',title:'The van died outside Stevens Point.',safe:'Pay for a tow and a rental box truck',wild:'Have the opener stall with a brawl through the crowd',crew:'Start late with a short opener',text:'The ring is on the side of Highway 10. A tow and a box truck cost {cost}.',stat:'skill',success:'The crowd brawl bought the ring crew twenty minutes and nobody noticed.',failure:'The brawl ran out of ideas before the ring arrived.'},
  {id:'c-flyers',dept:'production',title:'Fox Valley papered your town with their flyers.',safe:'Pay for a radio spot',wild:'Have the opener call them out by name',crew:'Ignore it and hope',text:'Every gas station in town has their poster over yours. A radio spot costs {cost}.',success:'The callout got the locals on your side.',failure:'The callout just reminded everyone the other show exists.'},
  {id:'c-motel',dept:'venue',title:'Half the locker room slept in the van.',safe:'Book a second motel',wild:'Trust the main event to work through it',crew:'Shorten the main event',text:'The motel lost your room block. A second motel costs {cost}. The main eventers say they are fine. They are not fine.',segment:'main',stat:'skill',success:'The main event worked through the fog and delivered.',failure:'You could see the van seats in their faces.'},
  {id:'c-referee',dept:'ring',title:'Your referee took a better-paying gig in La Crosse.',safe:'Pay a regional referee’s travel',wild:'Let the opening pair guide the backup',crew:'Keep the first match simple',text:'The backup referee is the ring crew’s nephew. Bringing in a regional official costs {cost}.',stat:'skill',matchOnly:true,success:'The opening pair made the nephew look like a veteran.',failure:'The nephew counted to two and a half.'},
  {id:'c-speaker',dept:'production',title:'The touring PA blew a speaker in the first song.',safe:'Rent the venue’s house system',wild:'Have the opener work the room unplugged',crew:'Run entrances without music',text:'Half the room can hear the music and half can hear the buzzing. The house system costs {cost}.',success:'The unplugged opener got the whole room clapping in time.',failure:'Nobody past row ten heard a word.'}
 ],
 [
  {id:'t-marshal',dept:'venue',title:'The fire marshal capped the arena at 2,000 an hour before the taping.',safe:'Pay for extra security and reopen sections',wild:'Pack the hard-camera side and let the main event fill the shot',crew:'Tape with empty sections',text:'The station needs a full-looking crowd. Extra security costs {cost}.',segment:'main',stat:'skill',success:'On television it looked like a sellout.',failure:'The camera found every empty seat.'},
  {id:'t-late-news',dept:'production',title:'The station wants the main event to start before the late news.',safe:'Buy an extra half hour of airtime',wild:'Let the main event go short and hot',crew:'Cut the main event to fit',text:'Viewers leave at 10:52. Another half hour of airtime costs {cost}.',segment:'main',stat:'skill',success:'The short main event never let up.',failure:'The main event felt rushed on air.'},
  {id:'t-camera',dept:'production',title:'The hard camera died during warm-ups.',safe:'Rent a backup camera crew',wild:'Have the opener play to the handheld',crew:'Use the wide shot only',text:'The director has one handheld and a lot of feelings. A backup crew costs {cost}.',success:'The handheld shots made the opener look like a movie star.',failure:'The handheld mostly filmed the opener’s back.'},
  {id:'t-poach',dept:'talent',title:'The GLWF offered your opener a bonus to no-show.',safe:'Match the bonus',wild:'Let the opener cut a promo about loyalty',crew:'Book around it and hope they show',text:'Your opener forwarded you the offer. That is either loyalty or a negotiation. Matching it costs {cost}.',success:'The loyalty promo got a standing ovation.',failure:'The loyalty promo sounded like a negotiation.'},
  {id:'t-turnbuckle',dept:'ring',title:'The TV ring’s turnbuckle snapped in warm-ups.',safe:'Rush a replacement part',wild:'Let the opening pair work around it',crew:'Keep the first match on the mat',text:'One corner is held together with gaffer tape. A replacement part costs {cost}.',stat:'skill',matchOnly:true,success:'The opening pair worked the broken corner into the match.',failure:'Everyone was too careful to make it exciting.'},
  {id:'t-breaks',dept:'venue',title:'The arena crowd hates the four-minute commercial breaks.',safe:'Pay for a dark match during breaks',wild:'Have the opener keep the crowd hot through the break',crew:'Let them sit through it',text:'The live crowd paid to see wrestling, not a timer. A dark-match crew costs {cost}.',success:'The crowd came back from break louder than before.',failure:'The crowd checked their phones through the break.'}
 ],
 [
  {id:'w-rig',dept:'ring',title:'The touring stage rig is stuck at a weigh station.',safe:'Charter a second rig',wild:'Go live on a half-built set and let the main event carry it',crew:'Delay the open by ten minutes',text:'The national broadcast starts in three hours. A second rig costs {cost}.',segment:'main',stat:'skill',success:'Nobody at home noticed the set was half built.',failure:'The half-built set was all anyone talked about online.'},
  {id:'w-leak',dept:'production',title:'Tonight’s main event result leaked online.',safe:'Pay a PR firm to bury it',wild:'Let the main event address it in a promo',crew:'Say nothing',text:'It is the top trending topic in wrestling. A PR firm costs {cost}.',segment:'main',success:'The main event made the leak part of the story.',failure:'The promo confirmed the leak.'},
  {id:'w-counter',dept:'talent',title:'Apex moved a surprise debut into your time slot.',safe:'Buy an ad block during their show',wild:'Have the opener do something nobody expects',crew:'Let the night play out',text:'Their debut airs opposite your opening segment. An ad block costs {cost}.',success:'Your opener won the first fifteen minutes of the war.',failure:'Viewers flipped over and stayed there.'},
  {id:'w-ego',dept:'talent',title:'Your opener refuses to lose on national TV.',safe:'Pay a winner’s bonus to keep the finish',wild:'Let the opening pair sort it out in the ring',crew:'Book a safe, quiet opener',text:'The agent says it is about the brand. The bonus costs {cost}.',stat:'skill',matchOnly:true,success:'The pair sorted it out and had the match of the night.',failure:'The tension showed on camera.'},
  {id:'w-storm',dept:'venue',title:'A storm grounded the crew’s flight out of Chicago.',safe:'Charter a plane',wild:'Let the main event pair stretch the show',crew:'Run a shorter card',text:'Half the production crew is in O’Hare. A charter costs {cost}.',segment:'main',stat:'skill',success:'The main event filled the time without a wasted move.',failure:'The extra time showed.'},
  {id:'w-guest',dept:'production',title:'The network wants a celebrity guest in the opening segment.',safe:'Pay the appearance fee',wild:'Let the opener play off the guest',crew:'Politely decline the network',text:'The guest has never seen wrestling and has a lot of questions. The fee is {cost}.',success:'The opener made the guest look like a fan for life.',failure:'The guest looked lost on national television.'}
 ],
 [
  {id:'s-resale',dept:'venue',title:'Resellers bought out the Sturgeon Bay homecoming in 90 seconds.',safe:'Buy back a block for locals',wild:'Have the opener walk out to the fans outside',crew:'Let the resale market win',text:'The people who built this promotion cannot get in. Buying back a block costs {cost}.',success:'The opener brought the parking lot inside for one unforgettable minute.',failure:'The parking lot still could not get in.'},
  {id:'s-roof',dept:'ring',title:'Rain is coming through the stadium roof over the ring.',safe:'Rent a ring canopy',wild:'Let the main event work the storm',crew:'Wipe the mat between matches',text:'Thirty thousand people are dry. The ring is not. A canopy costs {cost}.',segment:'main',stat:'skill',success:'The main event in the rain became an instant classic.',failure:'Everybody slipped. Nobody enjoyed it.'},
  {id:'s-legend',dept:'talent',title:'A St. Elbow’s original wants one last match tonight.',safe:'Pay for a full medical check first',wild:'Let the opener share the ring with them',crew:'Give them a wave from the ramp',text:'They say they have one more in them. A full medical costs {cost}.',success:'The stadium sang along with the original.',failure:'It was clear why they had retired.'},
  {id:'s-doc',dept:'production',title:'The documentary crew filmed an argument in catering.',safe:'Buy the footage',wild:'Have the opener address it head-on',crew:'Let it air',text:'It is not a good look and it is very well lit. Buying the footage costs {cost}.',success:'The honest promo made the argument part of the legend.',failure:'The promo made it worse.'},
  {id:'s-investors',dept:'talent',title:'The investors want a family-friendly main event.',safe:'Fund a separate kids’ show',wild:'Let the main event pair win the boardroom over',crew:'Tone down the main event',text:'The board has notes. Funding a separate show costs {cost}.',segment:'main',success:'The main event was so good the board stopped sending notes.',failure:'The board sent more notes.'},
  {id:'s-pyro',dept:'production',title:'The opener’s pyro fired during the anthem.',safe:'Pay the fire crew to reset',wild:'Let the opener sell it as intentional',crew:'Skip pyro tonight',text:'It was very patriotic and very loud. A reset costs {cost}.',success:'The opener sold it like a fireworks show.',failure:'The crowd was still rattled through the opener.'}
 ]
];
function allProductionIssues(){return PRODUCTION_ISSUES.concat(...ERA_ISSUES)}
function productionPool(s){const era=eraIndex(s?.progression?.stage||0);return era>0&&ERA_ISSUES[era].length?ERA_ISSUES[era]:PRODUCTION_ISSUES}
function issueText(issue){return issue.text.replace('{cost}',money(fixCost())).replace(/\$40\b/g,money(fixCost()))}
function issueSegmentIndex(issue,card=state.card){
 if(issue.matchOnly)return card.findIndex(segment=>segment.kind==='match');
 return issue.segment==='main'||issue.segment===3?card.length-1:(issue.segment??0);
}
function crewHandles(issue,s=state){
 if(!issue?.dept||issue.dept==='talent')return null;
 const id=(s.rise?.crew||[]).find(x=>CREW.find(c=>c.id===x)?.dept===issue.dept);
 return id?CREW.find(c=>c.id===id):null;
}

// ---------- Press opportunities, one per month ----------
const PRESS=[
 {kind:'pick',outlet:'The Door County Advocate',ask:'The paper will run one photo on Thursday. Whose face goes in the paper?',pick:r=>({pop:3,rep:1,text:`${r.name}’s photo ran above the fold.`})},
 {kind:'pick',outlet:'Green Bay sports radio',ask:'The morning show wants a guest who won’t embarrass you on air.',pick:r=>r.charisma>=70?{pop:3,rep:2,text:`${r.name} was a hit on the radio.`}:{rep:-1,morale:-2,text:`${r.name} rambled on air. The hosts laughed at the promotion, not with it.`}},
 {kind:'pick',outlet:'Channel 26 Great Lakes',ask:'The station will build a primetime special around one wrestler. Who carries it?',pick:r=>r.skill>=72?{momentum:3,rep:2,text:`${r.name} carried the primetime special.`}:{momentum:1,text:`${r.name}’s special drew a modest audience.`}},
 {kind:'call',outlet:'A celebrity’s agent',ask:'A movie star wants a one-night match on national TV. Huge ratings. Your locker room hates the idea.',options:[['accept','Book the celebrity','+4 reputation · everyone loses 2 morale'],['decline','Protect the locker room','Your top six stars gain 3 trust']]},
 {kind:'call',outlet:'A documentary crew',ask:'They want full access to the St. Elbow’s originals, including the ugly parts.',options:[['open','Full access','+3 reputation · the originals gain 3 morale'],['control','Controlled access','+1 reputation']]}
];
function pressBlock(week=state.week){return Math.floor((week-1)/4)}
function pressCall(){return PRESS[eraIndex()]}
function pressAnswered(){return state.rise?.press?.[pressBlock()]}
function pressCandidates(){return state.roster.slice().sort((a,b)=>(b.pop+b.momentum*2)-(a.pop+a.momentum*2)).slice(0,3)}
function answerPress(value){
 if(pressAnswered()||state.liveShow||state.recap)return false;
 const call=pressCall();let effect;
 if(call.kind==='pick'){
  const r=w(value);if(!r||!pressCandidates().some(x=>x.id===r.id))return false;
  effect=call.pick(r);
  if(effect.pop)r.pop=clamp(r.pop+effect.pop);if(effect.morale)r.morale=clamp(r.morale+effect.morale);if(effect.momentum)r.momentum=clamp(r.momentum+effect.momentum,-20,20);
  if(effect.rep)state.rep=clamp(state.rep+effect.rep);
  incident(`${call.outlet}: ${effect.text}`,[r.id],'press');
 }else{
  if(!call.options.some(([key])=>key===value))return false;
  if(value==='accept'){ledgerNote('celebrity');state.rep=clamp(state.rep+4);for(const r of state.roster)r.morale=clamp(r.morale-2);effect={text:'The celebrity match drew a huge audience. The locker room is quiet.'}}
  if(value==='decline'){ledgerNote('lockerRoom');for(const r of state.roster.slice().sort((a,b)=>b.pop-a.pop).slice(0,6))offstageTrust(r,3);effect={text:'You turned down the celebrity. Your top stars noticed.'}}
  if(value==='open'){state.rep=clamp(state.rep+3);for(const id of state.rise.originals)if(w(id))w(id).morale=clamp(w(id).morale+3);effect={text:'The documentary made the originals into legends.'}}
  if(value==='control'){state.rep=clamp(state.rep+1);effect={text:'The documentary was respectful and a little dull.'}}
  incident(`${call.outlet}: ${effect.text}`,[],'press');
 }
 state.rise.press[pressBlock()]={value,text:effect.text};save();return true;
}

// ---------- Traditions picked on moving day ----------
const TRADITIONS={
 chairs:{name:'Bev’s chairs',text:'Every show starts with folding chairs. Chaos fans love it forever.',effect:'+1 Chaos every show',era:0},
 kids:{name:'Free kids’ section',text:'The town never turns on you.',effect:'+4% attendance',era:0},
 tom:{name:'Father Tom on the mic',text:'Your ring announcer for life. Purists approve.',effect:'+1 Purists every show',era:0},
 banner:{name:'The St. Elbow’s banner',text:'Hangs at every venue, all the way to the stadium.',effect:'+1 reputation at monthly shows',era:0},
 van:{name:'The old Econoline',text:'The first van gets parked outside every arena.',effect:'+1 morale for the originals each show',era:1},
 radio:{name:'Sunday radio call-in',text:'You answer fans live every week.',effect:'+1 Drama every show',era:1},
 homecoming:{name:'An annual homecoming',text:'One show a season goes back to Sturgeon Bay.',effect:'+2 reputation at each season finale',era:2},
 tryouts:{name:'Open tryouts',text:'Anyone can try out, like the originals did.',effect:'+1 momentum for your least-used wrestler each show',era:3}
};
function traditionChoices(move=state.rise.pendingMove){
 if(!move)return [];
 return Object.entries(TRADITIONS).filter(([id,t])=>t.era<=move.from&&!state.rise.traditions.includes(id)).map(([id])=>id);
}
function chooseTraditions(ids){
 const move=state.rise.pendingMove;if(!move)return false;
 const allowed=traditionChoices(move),unique=[...new Set(ids)];
 if(unique.length!==Math.min(move.picks,allowed.length)||!unique.every(id=>allowed.includes(id)))return false;
 state.rise.traditions.push(...unique);
 for(const id of unique)if(GENEROUS_TRADITIONS.includes(id))ledgerNote('generous',{detail:id});
 state.rise.moves.push({...move,traditions:unique});
 delete state.rise.pendingMove;save();return true;
}

// ---------- Career offers that change eras ----------
function acceptOfferWithMove(){
 const before=eraIndex(),deposit=moveDeposit();
 if(state.cash<deposit)return false;
 if(!acceptCareerOffer())return false;
 state.cash-=deposit;
 const after=eraIndex();
 if(after!==before){relationshipEraEnd(before);if(typeof ledgerReckoning==='function')ledgerReckoning(before);state.rise.pendingMove={from:before,to:after,week:state.week,picks:before===0?2:1,venue:CAREER_STAGES[state.progression.stage-1]?.venue||'St. Elbow’s Community Hall'}}
 save();return true;
}

// ---------- Writers' room ----------
function writersRoomAvailable(){return eraIndex()>=3}
function writersRoomBook(){
 if(!writersRoomAvailable()||state.liveShow||state.recap)return 0;
 const used=playedWrestlerIds(),pool=state.roster.filter(r=>!used.has(r.id)).sort((a,b)=>(a.lastSeen===state.week-1)-(b.lastSeen===state.week-1)||b.pop-a.pop);
 let booked=0;
 for(let i=0;i<state.card.length-1;i++){
  if(state.card[i].kind||state.drafts[i])continue;
  const face=pool.find(r=>r.role==='Face'),heel=pool.find(r=>r.role==='Heel');
  const a=face||pool[0],b=heel&&heel!==a?heel:pool.find(r=>r!==a);
  if(!a||!b)break;
  pool.splice(pool.indexOf(a),1);pool.splice(pool.indexOf(b),1);
  const winner=a.momentum>=b.momentum?a.id:b.id;
  const match=normalizeMatch({kind:'match',format:'singles',sides:[[a.id],[b.id]],a:a.id,b:b.id,winner,type:'Singles match',finish:'Clean finish',concept:'Writers’ room'},state.roster,state.teams);
  if(bookingProblems(match).length)continue;
  state.card[i]=match;booked++;
 }
 save();return booked;
}

// ---------- After every show ----------
function riseAfterShow(recap){
 const r=riseDefaults(state),notes=[];
 const stage=state.progression.stage,era=currentEra();
 // Territory fight resolution.
 if(territoryFightWeek(recap.week)){
  const choice=r.fights[recap.week]?.choice||'fight';
  if(choice==='move'){state.rep=clamp(state.rep-1);notes.push(`You moved away from ${era.rival.short}’s show. No territory changed hands. Reputation −1.`)}
  else{
   const theirs=Math.round(rivalNight(recap.week)*(choice==='raid'?.8:1)),won=recap.attendance>theirs;
   if(choice==='raid')ledgerNote('raid');else if(won)ledgerNote('fairFight');
   if(choice==='raid'){const star=state.roster.slice().sort((a,b)=>b.pop-a.pop)[0];star.morale=clamp(star.morale-3);notes.push(`Raiding their card cost ${money(fixCost()*3)}. ${star.name} didn’t love sharing the spotlight. Morale −3.`)}
   if(won){r.wins.push({week:recap.week,stage,rival:era.rival.name,you:recap.attendance,them:theirs});r.dents[stage]=(r.dents[stage]||0)+1;state.rep=clamp(state.rep+3);notes.push(`You outdrew ${era.rival.name} ${recap.attendance.toLocaleString()} to ${theirs.toLocaleString()}. The town is yours. Reputation +3.`)}
   else{r.losses.push({week:recap.week,stage,rival:era.rival.name,you:recap.attendance,them:theirs});state.rep=clamp(state.rep-2);notes.push(`${era.rival.name} outdrew you ${theirs.toLocaleString()} to ${recap.attendance.toLocaleString()}. Reputation −2.`)}
   recap.territory={choice,won,you:recap.attendance,them:theirs,rival:era.rival.name};
  }
 }
 // Traditions.
 const t=r.traditions;
 if(t.includes('chairs'))state.crowd.chaos=clamp(state.crowd.chaos+1,10,90);
 if(t.includes('tom'))state.crowd.purists=clamp(state.crowd.purists+1,10,90);
 if(t.includes('radio'))state.crowd.drama=clamp(state.crowd.drama+1,10,90);
 if(t.includes('banner')&&recap.week%4===0)state.rep=clamp(state.rep+1);
 if(t.includes('homecoming')&&recap.week%12===0)state.rep=clamp(state.rep+2);
 if(t.includes('van'))for(const id of r.originals)if(w(id))w(id).morale=clamp(w(id).morale+1);
 if(t.includes('tryouts')){const quiet=state.roster.slice().sort((a,b)=>(a.lastSeen||0)-(b.lastSeen||0))[0];quiet.momentum=clamp(quiet.momentum+1,-20,20)}
 if(t.length)notes.push('Traditions kept: '+t.map(id=>TRADITIONS[id].name).join(', ')+'.');
 // The originals are everyone featured during the Gym Years.
 if(eraIndex()===0)for(const id of recap.results.flatMap(x=>x.participants||[]))if(!r.originals.includes(id))r.originals.push(id);
 // Standings movement.
 r.lastRank=r.rank;r.rank=yourRank();
 recap.rise={notes,rank:r.rank,lastRank:r.lastRank,era:era.name};
 if(state.history[0]?.week===recap.week){state.history[0].rise=structuredClone(recap.rise);if(recap.territory)state.history[0].territory=structuredClone(recap.territory)}
}

// ---------- Screens ----------
function eraAttr(){return currentEra().id}
function rankMove(){const r=state.rise;if(r.lastRank==null||r.rank==null)return '';const d=r.lastRank-r.rank;return d>0?`▲${d}`:d<0?`▼${-d}`:'—'}
function standingsPanel(){
 const rows=standings();
 return `<section class="bill-band bill-yellow standings" aria-labelledby="standings-title"><h2 id="standings-title" class="bill-label">${esc(currentEra().region)} standings</h2><ol class="standings-list">${rows.map(row=>`<li class="${row.you?'is-you':''}"><b>${row.rank}.</b><span><strong>${esc(row.you?'W.W.A. — you':row.name)}</strong><small>${esc(row.town)}${row.rival?' · your rival':''}</small></span><em>${row.avg?row.avg.toLocaleString()+' avg':'No shows yet'}${row.you&&rankMove()?' '+rankMove():''}</em></li>`).join('')}</ol></section>`;
}
function roadLadder(){
 const current=eraIndex(),p=state.progression,reqs=careerRequirements();
 return `<section class="road" aria-labelledby="road-title"><h2 id="road-title" class="bill-label red">— The road to the top —</h2><ol class="road-list">${ERAS.map((era,i)=>({era,i})).reverse().map(({era,i})=>{
  if(i>current)return `<li class="road-era is-locked"><strong>${era.roman} · ${esc(era.name)}</strong><span>${esc(era.tagline)}</span></li>`;
  if(i<current)return `<li class="road-era is-done"><strong>${era.roman} · ${esc(era.name)}</strong><span>Complete</span></li>`;
  return `<li class="road-era is-current" style="--era:${era.accent}"><div class="road-head"><strong>${era.roman} · ${esc(era.name)}</strong><span>Now showing</span></div><div class="road-body"><p class="road-chapter">Chapter ${p.stage+1} of 8 · ${esc(p.dynasty?'A dynasty for the ages':careerStage().goal)}</p><p class="road-verbs">${esc(era.verbs)}</p>${p.dynasty?'<p>Your legacy is permanent. Keep booking.</p>':`<ul class="road-goals">${reqs.map(goal=>`<li class="${goal.done?'done':''}"><span class="tick" aria-hidden="true">${goal.done?'✓':''}</span><span>${esc(goal.label)}</span></li>`).join('')}</ul><p class="note">Season review in week ${careerSeason()*12}. Next: ${esc(careerStage().unlock)}.</p>`}</div></li>`;
 }).join('')}</ol></section>`;
}
function challengePanel(){
 const fight=territoryFight();if(!fight)return '';
 const labels={fight:'Go head to head',move:'Move the show',raid:'Raid their card'};
 return `<section class="bill-alert" aria-labelledby="challenge-title"><h2 id="challenge-title" class="bill-alert-head">Challenge issued</h2><div class="bill-alert-body"><p class="bill-headline">${esc(fight.rival.name)} booked ${esc(showLocation().town)} on your show night.</p>${fight.choice?`<p class="bill-picked">Your call: <strong>${labels[fight.choice]}</strong></p>`:`<p class="note">If you don’t answer, you go head to head.</p>`}<div class="bill-choices">
 <button type="button" class="bill-choice ${fight.choice==='fight'?'is-picked':''}" data-territory="fight"><strong>Go head to head</strong><span>Outdraw their ~${fight.night.toLocaleString()} for +3 reputation and a rung goal. Lose and it’s −2.</span></button>
 <button type="button" class="bill-choice ${fight.choice==='move'?'is-picked':''}" data-territory="move"><strong>Move the show</strong><span>Play it safe. No territory changes hands. −1 reputation.</span></button>
 <button type="button" class="bill-choice ${fight.choice==='raid'?'is-picked':''}" data-territory="raid"><strong>Raid their card</strong><span>${money(fight.raidCost)} for one of their stars. +8% crowd; your top star sulks.</span></button>
 </div></div></section>`;
}
function pressPanel(){
 const call=pressCall(),done=pressAnswered();
 return `<section class="bill-card press-call" aria-labelledby="press-title"><h2 id="press-title" class="bill-card-head blue">Press call · ${esc(call.outlet)}</h2><div class="bill-card-body"><p>${esc(call.ask)}</p>${done?`<p class="bill-picked">${esc(done.text)}</p>`:call.kind==='pick'?`<div class="press-picks">${pressCandidates().map(r=>`<button type="button" class="press-pick" data-press="${r.id}"><span class="press-pick-art" aria-hidden="true">${portrait(r)}</span><strong>${esc(r.name)}</strong></button>`).join('')}</div>`:`<div class="bill-choices">${call.options.map(([key,label,hint])=>`<button type="button" class="bill-choice" data-press="${key}"><strong>${esc(label)}</strong><span>${esc(hint)}</span></button>`).join('')}</div>`}<p class="note">One press call each month.</p></div></section>`;
}
function crewPanel(){
 const list=crewAvailable();
 if(!list.length)return `<section class="bill-card"><h2 class="bill-card-head">Your crew</h2><div class="bill-card-body"><p>In the Gym Years you are the crew: chairs, ring, sound and the ref’s cousin. Your first hires arrive on the Circuit.</p></div></section>`;
 return `<section class="bill-card" aria-labelledby="crew-title"><h2 id="crew-title" class="bill-card-head">Your crew</h2><div class="bill-card-body"><p class="note">Each hire handles one kind of weekly problem for you, at a price every show. Talent problems always reach your desk.</p><ul class="crew-list">${list.map(c=>`<li><span><strong>${esc(c.name)}</strong><small>${esc(c.perk)} ${esc(c.quirk)}</small></span><button type="button" class="btn ${crewHired(c.id)?'':'primary'}" data-crew="${c.id}" aria-pressed="${crewHired(c.id)}">${crewHired(c.id)?'Let go':'Hire'} · ${money(crewSalary(c))}/show</button></li>`).join('')}</ul></div></section>`;
}
function rootsPanel(){
 const o=state.rise.originals,still=o.filter(id=>(w(id)?.lastSeen||0)>=state.week-8);
 const trad=state.rise.traditions;
 if(!o.length&&!trad.length)return '';
 return `<section class="bill-card roots" aria-labelledby="roots-title"><h2 id="roots-title" class="bill-card-head gold">Roots</h2><div class="bill-card-body">${o.length?`<p><strong>${still.length} of ${o.length}</strong> St. Elbow’s originals worked a show in the last two months.</p>`:''}${trad.length?`<ul class="tradition-tags">${trad.map(id=>`<li><strong>${esc(TRADITIONS[id].name)}</strong> · ${esc(TRADITIONS[id].effect)}</li>`).join('')}</ul>`:''}</div></section>`;
}
function movingDayBanner(){
 const move=state.rise.pendingMove;if(!move)return '';
 return `<section class="bill-alert"><h2 class="bill-alert-head">Moving day</h2><div class="bill-alert-body"><p class="bill-headline">You’ve outgrown ${esc(move.venue)}.</p><button type="button" class="btn primary" data-moving-day>Choose what comes with you →</button></div></section>`;
}
function roadPage(){
 const era=currentEra(),location=showLocation(),cost=showCost();
 return `<div class="road-page">
 <header class="bill-head"><p class="bill-kicker">★ Rise to Supremacy ★</p><h1>The Road</h1></header>
 <p class="bill-strip">Season ${careerSeason()} · Week ${state.week} · Ranked #${yourRank()} in ${esc(era.region)}</p>
 ${movingDayBanner()}
 ${weekAheadStrip()}
 <section class="bill-card next-show"><h2 class="bill-card-head">${isEvent()?'Tonight · monthly show':'This week'}</h2><div class="bill-card-body"><p class="bill-headline">${esc(showName())}</p><p>${esc(location.venue)} · ${esc(location.town)}, WI · ${venueCapacity().toLocaleString()} seats</p><dl class="ticket-stats"><div><dt>Cash</dt><dd>${money(state.cash)}</dd></div><div><dt>Est. cost</dt><dd>${money(cost)}</dd></div><div><dt>Card</dt><dd>${state.card.length} slots</dd></div></dl><button class="btn primary bill-cta" data-nav="book">Book the card →</button></div></section>
 ${challengePanel()}
 ${standingsPanel()}
 ${careerOffer()}
 ${roadLadder()}
 ${pressPanel()}
 ${rootsPanel()}
 </div>`;
}
function riseRecap(h){
 if(!h.rise)return '';
 const t=h.territory;
 return `<section class="bill-card"><h2 class="bill-card-head blue">On the road</h2><div class="bill-card-body">${t?`<p class="bill-headline">${t.won?'Territory won':'Territory lost'} · ${t.you.toLocaleString()} vs ${t.them.toLocaleString()}</p>`:''}${h.rise.notes.map(n=>`<p>${esc(n)}</p>`).join('')}<p>Ranked <strong>#${h.rise.rank}</strong> in ${esc(currentEra().region)}${h.rise.lastRank&&h.rise.lastRank!==h.rise.rank?` (was #${h.rise.lastRank})`:''}.</p></div></section>`;
}
function openMovingDay(){
 const move=state.rise.pendingMove;if(!move)return;
 // Every featured wrestler's era ending plays first, once.
 // The Good Lord Above reads the era's ledger before anyone's ending plays.
 const reckoning=typeof pendingLedgerVisit==='function'&&pendingLedgerVisit('reckoning');if(reckoning){openLedgerVisit(reckoning,openMovingDay);return}
 relationshipEraEnd(move.from);const epilogue=pendingEpilogue(move.from);if(epilogue){openEpilogueReel(epilogue,openMovingDay);return}
 const choices=traditionChoices(move),picks=Math.min(move.picks,choices.length),to=ERAS[move.to];
 const voices=state.roster.filter(r=>state.rise.originals.includes(r.id)).sort((a,b)=>b.pop-a.pop).slice(0,2);
 const lines=[r=>`“A bigger room just means more people to prove wrong.”`,r=>`“I’ve been here since the folding chairs. I’m not stopping now.”`];
 modal(`You’ve outgrown ${esc(move.venue)}`,`<div class="moving-day"><p class="bill-kicker">Era ${ERAS[move.from].roman} complete · Week ${move.week}</p><p>Next stop: <strong>${esc(to.name)}</strong>. ${esc(to.tagline)}</p>${voices.length?`<div class="moving-voices">${voices.map((r,i)=>`<div class="moving-voice"><span class="moving-art" aria-hidden="true">${portrait(r)}</span><p><strong>${esc(r.name)}:</strong> ${esc(lines[i](r))}</p></div>`).join('')}</div>`:''}<fieldset class="tradition-picks"><legend>What comes with you? Pick ${picks}.</legend>${choices.map(id=>`<label class="bill-choice"><input type="checkbox" name="tradition" value="${id}"><span><strong>${esc(TRADITIONS[id].name)}</strong><span>${esc(TRADITIONS[id].text)} ${esc(TRADITIONS[id].effect)}.</span></span></label>`).join('')}</fieldset></div>`,(form,dialog)=>{
  const ids=form.getAll('tradition');
  if(ids.length!==picks){toast(`Pick ${picks} tradition${picks===1?'':'s'} to bring along.`);return}
  if(chooseTraditions(ids)){dialog.close();render();toast('Traditions set. They follow you to every venue.')}
 },'Pack the van →');
}
function bindRise(){
 document.querySelectorAll('[data-territory]').forEach(b=>b.onclick=()=>{if(chooseTerritory(b.dataset.territory)){render();toast('Your call is in for show night.')}});
 document.querySelectorAll('[data-press]').forEach(b=>b.onclick=()=>{if(answerPress(isNaN(Number(b.dataset.press))?b.dataset.press:Number(b.dataset.press))){render();toast('The press call is done.')}});
 document.querySelectorAll('[data-crew]').forEach(b=>b.onclick=()=>{if(toggleCrew(b.dataset.crew)){render();toast(crewHired(b.dataset.crew)?'Hired. They start this week.':'Let go. You’re back on that duty.')}});
 document.querySelectorAll('[data-moving-day]').forEach(b=>b.onclick=openMovingDay);
 const writers=$('#writers-room');if(writers)writers.onclick=()=>{const n=writersRoomBook();render();toast(n?`Your writers booked ${n} undercard match${n===1?'':'es'}. Edit anything you like.`:'Nothing left for the writers to book.')};
}
function billOrder(){const n=state.card.length;return [n-1,...Array.from({length:n-1},(_,i)=>i)]}
function slotLabel(index,size=state.card.length){
 if(index===size-1)return 'Main event';
 if(index===0)return 'Opener';
 if(index===size-2)return 'Co-main';
 return 'Match '+(index+1);
}
