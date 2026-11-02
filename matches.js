'use strict';
const MATCH_FORMATS={singles:{label:'Singles',sizes:[1,1]},tag:{label:'Tag team · 2 vs 2',sizes:[2,2]},triple:{label:'Triple threat',sizes:[1,1,1]},four:{label:'Four-way',sizes:[1,1,1,1]},trios:{label:'Six-person tag · 3 vs 3',sizes:[3,3]},royal:{label:'Battle royal · 6 wrestlers',sizes:[1,1,1,1,1,1]}};
const MATCH_RULES=['Singles match','No disqualification','Ladder match','Steel cage','Tables match','Submission match','Last person standing','Office Supplies Deathmatch'];
function rulesFor(s){return matchFormat(s)==='royal'?['Singles match','No disqualification']:teamFormat(s)?MATCH_RULES.filter(rule=>rule!=='Last person standing'):MATCH_RULES}
function matchFormat(s){return MATCH_FORMATS[s.format]?s.format:'singles'}
function matchSides(s){return Array.isArray(s.sides)&&s.sides.length?s.sides.map(side=>side.slice()):[[s.a],[s.b]]}
function matchPeople(s){return s.kind==='promo'?(s.a==null?[]:[s.a]):s.kind==='match'?matchSides(s).flat().filter(id=>id!=null):[]}
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
function showParticipants(card=state.card){return [...new Set(card.flatMap(matchPeople))]}
function ruleCost(s){return s.kind==='match'&&s.type&&!['Singles match','Tag-team showcase','Submission match','Last person standing'].includes(s.type)?120:0}
function matchCost(card=state.card){return 650+showParticipants(card).length*65+card.reduce((total,s)=>total+ruleCost(s),0)}
function establishedTeams(s){return state.teams.filter(t=>matchSides(s).some(side=>side.includes(t.a)&&side.includes(t.b)))}
function simulateShow(decisions=[]){
 const cost=matchCost(),event=isEvent(),crowdDelta={chaos:0,purists:0,drama:0},counts={},results=[];let ratingSum=0,beltChange=false;
 const stars=showParticipants().map(id=>w(id).pop),heat=Math.max(0,...Object.values(state.rivalries)),attendance=clamp(Math.round(75+state.rep*2+Math.max(...stars)*.65+heat*.3+(event?35:0)),50,300);
 state.card.forEach((original,i)=>{
  const s=original.kind==='match'&&!original.format&&original.type==='Tag-team showcase'?{...original,format:'singles'}:original;
  const ids=matchPeople(s),people=ids.map(w);let rating,headline,explanation;
  if(s.kind==='promo'){
   const a=people[0];rating=Math.round(a.charisma*.65+a.pop*.25+state.crowd.drama*.1);const gain=s.hook==='Debut a gimmick'&&a.newGimmick?7:3;a.pop=clamp(a.pop+gain);crowdDelta.drama+=4;
   if(s.hook==='Debut a gimmick'){crowdDelta.chaos+=5;a.newGimmick=false}
   if(s.hook==='Fuel a rivalry'){const paired=state.card.find(c=>c.kind==='match'&&matchPeople(c).includes(a.id));if(paired){const rival=matchOpponents(paired,a.id)[0],key=rivalryKey(a.id,rival);state.rivalries[key]=clamp((state.rivalries[key]||0)+12)}}
   headline=a.name+' takes the mic';explanation=`“${s.concept}” ${a.charisma>=80?'They hang on every word.':'The crowd starts to buy in.'} Popularity +${gain}.`;
  }else{
   const sides=matchSides(s),win=sides.find(side=>side.includes(s.winner))||sides[0],winners=win.map(w),losers=people.filter(r=>!win.includes(r.id)),pairs=participantPairs(s),existing=pairs.map(([a,b])=>state.rivalries[rivalryKey(a,b)]||0),grudge=existing.reduce((n,h)=>n+h,0)/Math.max(1,existing.length),special=!['Singles match','Tag-team showcase'].includes(s.type),format=matchFormat(s),teams=teamFormat(s),notes=[];
   const avg=(group,key)=>group.reduce((n,r)=>n+r[key],0)/group.length;
   rating=avg(people,'skill')*.64+avg(people,'pop')*.28+(people.some(r=>r.role==='Face')&&people.some(r=>r.role==='Heel')?5:0)+grudge*.1+(s.title?5:0);
   if(special){if(s.type==='Submission match'){rating+=avg(people,'skill')*.04;crowdDelta.purists+=5}else if(s.type==='Last person standing'){rating+=2;crowdDelta.drama+=4;crowdDelta.chaos+=2}else if(s.type==='Steel cage'){rating+=grudge*.04;crowdDelta.drama+=4;crowdDelta.chaos+=4;crowdDelta.purists-=1}else{rating+=state.crowd.chaos*.08;crowdDelta.chaos+=7;crowdDelta.purists-=3}notes.push({'Steel cage':'The cage makes every escape attempt feel like a struggle.','Tables match':'A splintering table gives this match its finish.','Submission match':'The finish comes from a submission, with the hold doing the storytelling.','Last person standing':'The decisive ten-count makes the winner’s endurance matter.','Ladder match':'The prize is claimed above the ring after one final scramble.','Office Supplies Deathmatch':'A stapler gets an unreasonable amount of crowd support.'}[s.type]||'The loose rules give the chaos section its big moment.');}
   else{if(format==='royal')crowdDelta.chaos+=6;else crowdDelta.purists+=3;notes.push(teams?'Legal tags and teamwork keep the action moving.':format==='royal'?'Eliminations thin the field until only one wrestler remains.':'The wrestling gives the purists something to applaud.')}
   if(people.length>=4){rating-=2;notes.push(`${people.length} wrestlers share the spotlight; keeping the action coordinated takes work.`)}
   if(s.finish==='Clean finish'){rating+=3;crowdDelta.purists+=2;if(event&&grudge){rating+=grudge*.15;for(const [a,b] of pairs){const key=rivalryKey(a,b);state.rivalries[key]=Math.round((state.rivalries[key]||0)*.25)}crowdDelta.drama+=7;notes.push('The big-event clean finish pays off the existing grudges.')}}
   else if(['Cheating','Interference'].includes(s.finish)){const increase=people.length===2?18:10;for(const [a,b] of pairs){const key=rivalryKey(a,b);state.rivalries[key]=clamp((state.rivalries[key]||0)+increase)}crowdDelta.drama+=5;crowdDelta.purists-=3;notes.push(`The dirty finish adds ${increase} rivalry heat between the opposing wrestlers.`)}
   else{crowdDelta.drama+=4;if(avg(winners,'pop')<avg(losers,'pop')){rating+=6;notes.push('The underdogs pull off a genuine upset.')}else notes.push('The finish is presented as an upset, though the winners were already established.')}
   if(teams){const bonded=establishedTeams(s);if(bonded.length){rating+=bonded.reduce((n,t)=>n+t.chemistry,0)/bonded.length*.05;for(const t of bonded)t.chemistry=clamp(t.chemistry+8);notes.push(`${bonded.map(t=>t.name).join(' and ')} gain 8 team chemistry.`)}else notes.push('The improvised teams get their first taste of working together.');}
   if(ids.some(id=>counts[id])){rating-=6;notes.push('Double duty takes its toll. Performance −6.')}
   const opposingPopularity=avg(losers,'pop');for(const r of winners){r.pop=clamp(r.pop+(r.pop<opposingPopularity?6:3));r.morale=clamp(r.morale+4)}for(const r of losers){r.pop=clamp(r.pop-(s.finish==='Clean finish'?(people.length>2&&!teams?1:2):0));r.morale=clamp(r.morale-3)}
   const champ=people.find(r=>r.champ);if(s.title&&!teams&&champ&&!win.includes(champ.id)){champ.champ=false;w(s.winner).champ=true;beltChange=true;notes.push('A NEW WWA WORLD CHAMPION!')}
   if(teams)headline=sideLabel(win)+' defeat '+sides.filter(side=>side!==win).map(side=>sideLabel(side)).join(' and ');
   else headline=w(s.winner).name+(format==='royal'?' wins the battle royal':' wins'+(people.length>2?' the '+MATCH_FORMATS[format].label.toLowerCase():' against '+losers[0].name));
   explanation=notes.join(' ');
  }
  ids.forEach(id=>counts[id]=(counts[id]||0)+1);const baseRating=clamp(Math.round(rating)),decision=decisions[i]||null,score=clamp(baseRating+(decision?clamp(decision.delta,-3,3):0));ratingSum+=score;
  const analysis=explanation;explanation=decision?.outcome||(s.kind==='promo'?`${w(s.a).name} lowers the microphone as the crowd calls out.`:beatStory(finishBeats(s,{tag:''}).beats));
  results.push({headline,explanation,analysis,rating:score,baseRating,decision,participants:ids,label:s.kind==='promo'?'PROMO':matchLabel(s).toUpperCase()});
 });
 if(state.request==='yes'){
  const kept=state.card.some(s=>s.kind==='match'&&s.finish==='Clean finish'&&(teamFormat(s)?matchSides(s)[winningSide(s)]?.includes(10):s.winner===10));w(10).morale=clamp(w(10).morale+(kept?8:-12));if(kept)w(10).pop=clamp(w(10).pop+3);results.push({headline:kept?'A promise kept. A broom believed in.':'Sweeps McKenzie remembers.',explanation:kept?'Sweeps gets a clean win, gaining 8 morale and 3 popularity.':'The promised clean win never came. Sweeps loses 12 morale.',rating:null,label:'BACKSTAGE'});
 }
 for(const key of Object.keys(crowdDelta))state.crowd[key]=clamp(state.crowd[key]+crowdDelta[key]);state.roster.filter(r=>!counts[r.id]).forEach(r=>r.morale=clamp(r.morale-1));
 const rating=Math.round(ratingSum/state.card.length),repChange=(rating>=80?4:rating>=65?2:rating>=50?1:-2)+(beltChange?2:0),profit=attendance*(event?22:12)-cost;state.cash+=profit;state.rep=clamp(state.rep+repChange);
 const recap={week:state.week,name:showName(),rating,attendance,profit,cost,repChange,results,crowdDelta};state.history.unshift({week:recap.week,name:recap.name,rating,attendance,profit});state.recap=recap;return recap;
}
