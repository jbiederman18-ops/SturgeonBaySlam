'use strict';
const MATCH_FORMATS={singles:{label:'Singles',sizes:[1,1]},tag:{label:'Tag team · 2 vs 2',sizes:[2,2]},triple:{label:'Triple threat',sizes:[1,1,1]},four:{label:'Four-way',sizes:[1,1,1,1]},trios:{label:'Six-person tag · 3 vs 3',sizes:[3,3]},royal:{label:'Battle royal · 6 wrestlers',sizes:[1,1,1,1,1,1]}};
const MATCH_RULES=['Singles match','No disqualification','Ladder match','Steel cage','Tables match','Submission match','Last person standing','Office Supplies Deathmatch'];
function rulesFor(s){return matchFormat(s)==='royal'?['Singles match','No disqualification']:teamFormat(s)?MATCH_RULES.filter(rule=>rule!=='Last person standing'):MATCH_RULES}
function matchFormat(s){return MATCH_FORMATS[s.format]?s.format:'singles'}
function matchSides(s){return Array.isArray(s.sides)&&s.sides.length?s.sides.map(side=>side.slice()):[[s.a],[s.b]]}
function matchPeople(s){return s.kind==='promo'?[s.a,s.target].filter(id=>id!=null):s.kind==='match'?matchSides(s).flat().filter(id=>id!=null):[]}
function teamFormat(s){return MATCH_FORMATS[matchFormat(s)].sizes[0]>1}
function matchLabel(s){const format=matchFormat(s),base=MATCH_FORMATS[format].label;return s.type&&s.type!=='Singles match'?`${base} · ${s.type}`:format==='singles'?'Singles match':base}
function sideLabel(side,teams=state.teams){const team=teams.find(t=>side.length===2&&[t.a,t.b].every(id=>side.includes(id)));return team?team.name:side.map(id=>w(id).name).join(' & ')}
function winningSide(s){return matchSides(s).findIndex(side=>side.includes(s.winner))}
function matchOpponents(s,id){return matchSides(s).filter(side=>!side.includes(id)).flat()}
function normalizeMatch(s,roster,teams=[]){
 if(s.kind!=='match')return {...s};
 const result={...s},oldShowcase=s.type==='Tag-team showcase';result.format=MATCH_FORMATS[s.format]?s.format:oldShowcase?'tag':'singles';
 const sizes=MATCH_FORMATS[result.format].sizes,old=Array.isArray(s.sides)?s.sides:oldShowcase?[[s.a,teams.find(t=>[t.a,t.b].includes(s.a))?.a===s.a?teams.find(t=>t.a===s.a)?.b:teams.find(t=>t.b===s.a)?.a],[s.b,teams.find(t=>[t.a,t.b].includes(s.b))?.a===s.b?teams.find(t=>t.a===s.b)?.b:teams.find(t=>t.b===s.b)?.a]]:[[s.a],[s.b]];
 const valid=new Set(roster.map(r=>r.id)),used=new Set();
 result.sides=sizes.map((size,i)=>{const ids=[];for(const id of old[i]||[])if(ids.length<size&&valid.has(id)&&!used.has(id)){ids.push(id);used.add(id)}return ids});
 // Reserve the existing side leaders before filling partners, so a format change cannot swallow an opponent.
 for(let i=0;i<result.sides.length;i++)while(result.sides[i].length<sizes[i]){const anchor=result.sides[i][0],team=teams.find(t=>[t.a,t.b].includes(anchor)),partner=team?[team.a,team.b].find(id=>!used.has(id)):undefined;const id=partner??roster.find(r=>!used.has(r.id))?.id;if(id===undefined)break;result.sides[i].push(id);used.add(id)}
 result.a=result.sides[0][0];result.b=result.sides[1][0];if(!result.sides.flat().includes(result.winner))result.winner=result.a;
 if(oldShowcase)result.type='Singles match';if(!MATCH_RULES.includes(result.type))result.type='Singles match';if(teamFormat(result))result.title=false;if(!rulesFor(result).includes(result.type))result.type='Singles match';
 return result;
}
function setMatchFormat(draft,format){const result=normalizeMatch({...draft,format},state.roster,state.teams);Object.assign(draft,result)}
function participantPairs(s){const sides=matchSides(s),pairs=[];for(let i=0;i<sides.length;i++)for(let j=i+1;j<sides.length;j++)for(const a of sides[i])for(const b of sides[j])pairs.push([a,b]);return pairs}
function overallRating(r){return Math.round(r.skill*.5+r.charisma*.3+r.pop*.2)}
function ratingBadge(r){return `<span class="overall-rating" title="Overall: ring ability, microphone skills and popularity" aria-label="Overall rating ${overallRating(r)} out of 100"><small>OVR</small><b>${overallRating(r)}</b></span>`}
function ratingStrip(r){return `<div class="card-ratings"><span>RING <b>${r.skill}</b></span><span>MIC <b>${r.charisma}</b></span><span>POP <b>${r.pop}</b></span></div>`}
function showParticipants(card=state.card){return [...new Set(card.flatMap(s=>[...matchPeople(s),...(s.finish==='Interference'&&s.interferer!=null?[s.interferer]:[])]))]}
function ruleCost(s){return s.kind==='match'&&s.type&&!['Singles match','Tag-team showcase','Submission match','Last person standing'].includes(s.type)?120:0}
function matchCost(card=state.card){return 650+showParticipants(card).length*65+card.reduce((total,s)=>total+ruleCost(s)+(SHOW_PROPS[s.prop]?.cost||0),0)+productionCost()}
function establishedTeams(s){return state.teams.filter(t=>matchSides(s).some(side=>side.includes(t.a)&&side.includes(t.b)))}
function simulateShow(decisions=[]){
 storyDefaults(state);
 const cost=matchCost(),event=isEvent(),crowdBefore={...state.crowd},crowdDelta={chaos:0,purists:0,drama:0},counts={},promoCounts={},results=[],fallout=[];
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
   for(const r of losers){r.pop=clamp(r.pop-(s.finish==='Clean finish'?1:0));r.morale=clamp(r.morale-2)}
   const champ=people.find(r=>r.champ);
   if(s.title&&!teamFormat(s)&&champ&&!win.includes(champ.id)){champ.champ=false;lead.champ=true;beltChange=true;fallout.push(incident(`${lead.name} is the new WWA champion. A new title chapter begins.`,[lead.id,champ.id],'title'))}
   for(const c of state.challenges.filter(c=>c.status==='open'))if(ids.includes(c.actor)&&ids.includes(c.target)&&!sides.some(side=>side.includes(c.actor)&&side.includes(c.target)))c.status='booked';
   headline=teamFormat(s)?sideLabel(win)+' win':lead.name+(matchFormat(s)==='royal'?' wins the battle royal':' gets the victory');
  }
  if(repetition){const penalty=s.kind==='promo'?repetition*3:repetition>1?10:3;rating-=penalty;notes.push(`Repeated exposure: −${penalty} quality. A promo and match are lighter than repeated speeches.`)}
  const moralePenalty=avg(people,'morale')<25?2:0;rating-=moralePenalty;
  rating+=avg(people,'momentum')*.12;
  if(s.prop==='chairs'){crowdDelta.chaos+=2;crowdDelta.purists-=1;notes.push('Bev’s chairs made some noise.')}
  if(s.prop==='spotlight'){w(s.a).trust=clamp(w(s.a).trust+2);notes.push('A borrowed spotlight gave the moment room to breathe.')}
  if(s.prop==='broom'&&s.kind==='match'){for(const id of ids.filter(id=>!matchSides(s)[winningSide(s)].includes(id)))w(id).morale=clamp(w(id).morale+2);notes.push('The lucky broom softened the disappointment of defeat.')}
  if(i===0&&state.production.choice==='wild'){
   const works=avg(people,'charisma')>=75;rating+=works?2:-2;crowdDelta.chaos+=works?2:0;
   fallout.push(incident(`${PRODUCTION_ISSUES[(state.week-1)%3].title} ${works?'The improvised opener turned it into a crowd moment.':'The improvised opener stumbled. The crew will try the safe option next time.'}`,ids,'production'));
  }
  applyMomentEffect(decision,s,fallout);
  if(s.kind==='match'){
   const other=matchOpponents(s,s.winner)[0],story=storyFor(s.winner,other);
   if(event&&story&&story.heat>0&&['Clean finish','Upset victory'].includes(s.finish)){
    rating+=Math.min(10,story.heat*.12);story.phase='aftermath';story.heat=Math.round(story.heat*.25);story.lastBeat=`${w(s.winner).name} won cleanly at the potluck.`;story.lastWeek=state.week;state.rivalries[rivalryKey(s.winner,other)]=story.heat;crowdDelta.drama+=5;
    fallout.push(incident(`${story.participants.map(id=>w(id).name).join(' and ')} settled this chapter with a clean big-event result.`,story.participants,'payoff'));
   }
   if(event&&s.winner===1&&!state.milestones.holdTwo){state.milestones.holdTwo=true;w(1).pop=clamp(w(1).pop+4);fallout.push(incident('Hold Number Two is finally revealed. The front row counts to two until the chairs shake.',[1],'milestone'))}
   if(teamFormat(s)&&ids.includes(3)&&!state.milestones.oneMan){state.milestones.oneMan=true;w(3).trust=clamp(w(3).trust+5);fallout.push(incident('One Man accepts a tag: “One man. One partner. Just this once.” Trust +5.',[3],'milestone'))}
  }
  for(const id of ids){counts[id]=(counts[id]||0)+1;w(id).lastSeen=state.week}
  const varietyPenalty=matchCount<2?18:0,baseRating=clamp(Math.round(rating-varietyPenalty)),score=clamp(baseRating+(decision?clamp(decision.delta,-3,3):0));ratingSum+=score;
  results.push({headline,explanation:decision?.outcome||(s.kind==='promo'?`${w(s.a).name} finishes the address.`:beatStory(finishBeats(s,{tag:''}).beats)),analysis:notes.join(' '),rating:score,baseRating,decision,participants:ids,label:s.kind==='promo'?'PROMO':matchLabel(s).toUpperCase(),fingerprint});
 });
 finishStoryWeek(fallout);
 // Old careers may still carry the original one-night request.
 if(state.request==='yes'){
  const kept=promiseMet({actor:10,kind:'win'});w(10).morale=clamp(w(10).morale+(kept?8:-12));fallout.push(incident(kept?'The original clean-win promise to Sweeps was kept.':'Sweeps remembers the original broken clean-win promise.',[10],'promise'));
 }
 for(const key of Object.keys(crowdDelta)){
  const normalized=state.crowd[key]+Math.round((50-state.crowd[key])*.12);
  state.crowd[key]=clamp(normalized+clamp(crowdDelta[key],-8,8),10,90);crowdDelta[key]=state.crowd[key]-crowdBefore[key];
 }
 for(const r of state.roster)if(!counts[r.id]){r.morale=clamp(r.morale-(state.week-r.lastSeen>3?1:0));r.momentum+=r.momentum>0?-1:r.momentum<0?1:0}
 const rating=Math.round(ratingSum/state.card.length),repChange=(rating>=80?3:rating>=65?2:rating>=50?0:-2)+(beltChange?1:0),profit=attendance*(event?22:12)-cost;
 state.cash+=profit;state.rep=clamp(state.rep+repChange);
 const recap={week:state.week,name:showName(),rating,attendance,profit,cost,repChange,results,crowdDelta,fallout,fingerprints:results.map(r=>r.fingerprint)};
 state.history.unshift(structuredClone(recap));
 if(state.week%12===0){
  const shows=state.history.filter(h=>h.week>state.week-12),season={season:Math.ceil(state.week/12),shows:shows.length,average:Math.round(shows.reduce((n,h)=>n+h.rating,0)/shows.length),kept:state.promises.filter(p=>p.status==='kept'&&p.resolved>state.week-12).length,payoffs:state.incidents.filter(i=>i.kind==='payoff'&&i.week>state.week-12).length};
  recap.season=season;state.history[0].season=season;state.seasonReports.push(season);
 }
 state.recap=recap;return recap;
}
