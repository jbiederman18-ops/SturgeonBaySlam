'use strict';
const CAREER_STAGES=[
 {name:'Local curiosity',goal:'Sell out St. Elbow’s',capacity:300,cost:650,ticket:12,broadcast:0,venue:'St. Elbow’s Community Hall',unlock:'A 600-seat local venue'},
 {name:'Hometown institution',goal:'Become a dependable hometown draw',capacity:600,cost:1500,ticket:14,broadcast:0,venue:'Sturgeon Bay Civic Hall',unlock:'Wisconsin touring halls'},
 {name:'Wisconsin draw',goal:'Make the Wisconsin circuit yours',capacity:1200,cost:3500,ticket:16,broadcast:0,venue:'Wisconsin touring halls',unlock:'Regional arenas and press'},
 {name:'Regional contender',goal:'Earn a regional broadcast',capacity:2500,cost:8000,ticket:18,broadcast:0,venue:'Great Lakes arenas',unlock:'Regional TV and $3,000 per show'},
 {name:'Cult phenomenon',goal:'Turn a devoted following into national attention',capacity:5000,cost:18000,ticket:22,broadcast:3000,venue:'Regional showcase arenas',unlock:'National media attention'},
 {name:'National promotion',goal:'Secure a national TV deal',capacity:8000,cost:35000,ticket:26,broadcast:3000,venue:'National showcase arenas',unlock:'National TV and $25,000 per show'},
 {name:'Industry leader',goal:'Lead the industry across several seasons',capacity:15000,cost:80000,ticket:32,broadcast:25000,venue:'National headline arenas',unlock:'Stadium events and $60,000 per show'},
 {name:'Generational dynasty',goal:'Build a dynasty that outlasts its first heroes',capacity:30000,cost:180000,ticket:40,broadcast:60000,venue:'Supremacy stadium circuit',unlock:'A permanent dynasty legacy'}
];
const SEASON_STRATEGIES={free:'Follow your own creative instincts',stars:'Build stars: feature eight different wrestlers',stories:'Tell stories: deliver two payoffs or keep four promises',teams:'Build teams: feature established teams on four shows',business:'Build stability: run eight profitable shows'};
function progressionDefaults(s){
 if(!s.progression)s.progression={stage:0,stageStart:s.week,achievements:[],seasons:{},dynasty:false};
 return s.progression;
}
function careerStage(){return CAREER_STAGES[state.progression?.stage||0]}
function venueCapacity(){return careerStage().capacity}
function venueCost(){return careerStage().cost}
function ticketPrice(event=isEvent()){return careerStage().ticket+(event?10:0)}
function broadcastIncome(){return careerStage().broadcast}
function careerSeason(){return Math.ceil(state.week/12)}
function seasonalStrategy(){return state.progression.seasons[careerSeason()]||'free'}
function careerMetrics(){
 const p=state.progression,shows=state.history.filter(h=>h.week>=p.stageStart),seasons=new Set(shows.map(h=>Math.ceil(h.week/12))),ids=new Set(shows.flatMap(h=>h.results?.flatMap(r=>r.participants||[])||[]));
 const strong=shows.filter(h=>h.rating>=70).length,profitable=shows.filter(h=>h.profit>0).length,tour=new Set(shows.filter(h=>h.event).map(h=>h.event.id)).size;
 const payoffs=state.incidents.filter(i=>i.week>=p.stageStart&&i.kind==='payoff').length,kept=state.promises.filter(x=>x.status==='kept'&&x.resolved>=p.stageStart).length;
 const crowd=Math.max(...Object.values(state.crowd)),sold=shows.filter(h=>h.attendance>=(h.capacity||300)).length;
 // Several routes count: ring quality, loyal audiences, or story delivery.
 const identity=strong>=6||crowd>=75&&shows.length>=6||payoffs>=2&&kept>=3;
 const national=strong>=9||crowd>=85&&sold>=3||payoffs>=4&&kept>=5;
 const champions=new Set(shows.map(h=>h.championId).filter(Number.isInteger));
 const generations=new Set(shows.filter(h=>h.rating>=70).map(h=>Math.floor((Math.ceil(h.week/12)-1)/3)));
 return {shows,ids,strong,profitable,tour,payoffs,kept,sold,identity,national,seasons,champions,generations};
}
function careerRequirements(){
 const m=careerMetrics(),p=state.progression;
 const routes={label:`Establish an identity: ${m.strong}/6 shows rated 70+, OR audience satisfaction 75 with six shows, OR ${m.payoffs}/2 payoffs and ${m.kept}/3 promises`,done:m.identity};
 const national={label:`National appeal: ${m.strong}/9 shows rated 70+, OR satisfaction 85 with ${m.sold}/3 sellouts, OR ${m.payoffs}/4 payoffs and ${m.kept}/5 promises`,done:m.national};
 const count=(label,n,target)=>({label:`${label}: ${n}/${target}`,done:n>=target});
 return [
 [count('Sellouts',m.sold,1)],
 [count('Profitable shows',m.profitable,6),count('Shows at 80% capacity',m.shows.filter(h=>h.attendance>=(h.capacity||300)*.8).length,3)],
 [count('Distinct tour stops',m.tour,3),routes],
 [count('Completed shows',m.shows.length,12),routes],
 [count('Completed shows',m.shows.length,12),national],
 [count('Completed shows',m.shows.length,12),national,count('Profitable shows',m.profitable,8)],
 [count('Completed shows',m.shows.length,24),count('Seasons represented',m.seasons.size,3),national,count('Featured wrestlers',m.ids.size,16)],
 [count('Completed shows',m.shows.length,72),count('Three-season eras with a 70+ show',m.generations.size,3),count('Different champions',m.champions.size,3),count('Featured wrestlers',m.ids.size,24),count('Profitable shows',m.profitable,48)]
 ][p.stage].concat(typeof rivalRequirement==='function'&&state.rise?[rivalRequirement()]:[]);
}
function strategyProgress(){
 const start=(careerSeason()-1)*12+1,shows=state.history.filter(h=>h.week>=start),ids=new Set(shows.flatMap(h=>h.results?.flatMap(r=>r.participants||[])||[]));
 switch(seasonalStrategy()){
 case 'stars':return `${ids.size}/8 wrestlers featured`;
 case 'stories':return `${state.incidents.filter(i=>i.week>=start&&i.kind==='payoff').length}/2 story payoffs · ${state.promises.filter(p=>p.status==='kept'&&p.resolved>=start).length}/4 promises kept`;
 case 'teams':return `${shows.filter(h=>h.teamFeatured).length}/4 shows featuring established teams`;
 case 'business':return `${shows.filter(h=>h.profit>0).length}/8 profitable shows`;
 default:return 'Your card, your direction. Every completed show can advance your career.';
 }
}
function advanceCareer(recap){
 const p=state.progression;
 if(p.dynasty||recap.week%12!==0||state.history[0]?.career?.reviewWeek===recap.week)return;
 const completed=careerRequirements().every(r=>r.done),stage=careerStage();
 const report={reviewWeek:recap.week,stage:stage.name,goal:stage.goal,completed,strategy:SEASON_STRATEGIES[seasonalStrategy()],strategyProgress:strategyProgress(),next:completed?'Offer available: '+stage.unlock:'Progress carries into next season. '+careerRequirements().filter(r=>!r.done).map(r=>r.label).join(' · ')};
 recap.career=report;state.history[0].career=structuredClone(report);
 if(completed&&!p.offerWeek)p.offerWeek=recap.week;
}
function acceptCareerOffer(){
 const p=state.progression;
 if(!p.offerWeek||p.dynasty||p.achievements.at(-1)?.week>=p.offerWeek)return false;
 p.achievements.push({stage:p.stage,week:p.offerWeek,name:careerStage().name});
 delete p.offerWeek;
 if(p.stage===7)p.dynasty=true;
 else{p.stage++;p.stageStart=state.week+(state.recap?1:0)}
 return true;
}
function careerOffer(){
 const p=state.progression;
 if(!p.offerWeek||p.dynasty)return '';
 const next=CAREER_STAGES[p.stage+1];
 return `<section class="card career-offer"><small>OFFER FROM THE PROMOTER’S OFFICE</small><h3>${next?esc(next.venue):'A dynasty for the ages'}</h3>
 ${next?`<p>${next.capacity.toLocaleString()} seats · ${money(next.cost)} venue cost · ${money(next.ticket)} standard tickets · ${money(next.broadcast)} broadcast income per show</p><p>Current room: ${venueCapacity().toLocaleString()} seats at ${money(venueCost())} per show.</p><p>Keep your current room while you think it over. The offer stays open in Office.</p>`:'<p>Your promotion has earned its place in the history books.</p>'}
 <button class="btn primary" id="accept-career-offer">${next?'Accept for future shows':'Claim the legacy'}</button></section>`;
}
function careerPanel(compact=false){
 const p=state.progression,stage=careerStage(),requirements=careerRequirements();
 if(compact)return `<details class="card career-summary"><summary><span class="eyebrow">Chapter ${p.stage+1}/8</span><strong>${esc(p.dynasty?'A dynasty for the ages':stage.goal)}</strong><span>Career progress</span></summary><p>${esc(stage.name)} · Season review in week ${careerSeason()*12}</p><ul>${requirements.map(r=>`<li>${r.done?'✓':'○'} ${esc(r.label)}</li>`).join('')}</ul><p class="note">${esc(strategyProgress())}</p><button class="text-btn" data-career-office>Strategy & full roadmap →</button></details>`;
 return `<section class="card career-ambition"><small>RISE TO SUPREMACY · CHAPTER ${p.stage+1}/8</small><h3>${esc(p.dynasty?'A dynasty for the ages':stage.goal)}</h3><p>${esc(stage.name)} · ${venueCapacity().toLocaleString()} seats · ${broadcastIncome()?money(broadcastIncome())+' broadcast income per show':'Independent promotion'}</p>${p.dynasty?'<p>Your legacy is permanent. Keep booking your next era.</p>':`<ul>${requirements.map(r=>`<li>${r.done?'✓':'○'} ${esc(r.label)}</li>`).join('')}</ul><p class="note">Reviewed at the end of season ${careerSeason()} (week ${careerSeason()*12}). Earned chapters stay earned; unfinished progress carries forward. Next: ${esc(stage.unlock)}.</p>`}<p><strong>This season:</strong> ${esc(SEASON_STRATEGIES[seasonalStrategy()])}</p><p class="note">${esc(strategyProgress())}</p>${compact?'<button class="text-btn" data-career-office>Choose your seasonal strategy →</button>':`<label for="season-strategy">Seasonal strategy</label><select id="season-strategy" aria-label="Seasonal strategy">${Object.entries(SEASON_STRATEGIES).map(([id,label])=>`<option value="${id}" ${seasonalStrategy()===id?'selected':''}>${esc(label)}</option>`).join('')}</select><p class="note">Change direction anytime. Strategies guide your booking and retrospective; they do not restrict cards or gate advancement.</p><details><summary>The road to supremacy</summary><ol>${CAREER_STAGES.map((s,i)=>`<li>${p.achievements.some(a=>a.stage===i)?'✓ ':''}${esc(s.name)} — ${esc(s.goal)}</li>`).join('')}</ol></details>`}</section>`;
}
function bindProgression(){
 if($('#accept-career-offer'))$('#accept-career-offer').onclick=()=>{if(acceptOfferWithMove()){render();if(state.rise.pendingMove)openMovingDay();else toast('The deal is signed for future shows.')}};
 if($('#season-strategy'))$('#season-strategy').onchange=event=>{state.progression.seasons[careerSeason()]=event.target.value;render()};
 document.querySelectorAll('[data-career-office]').forEach(button=>button.onclick=()=>{view='office';render();window.scrollTo(0,0)});
}
function careerRecap(h){return h.career?`<section class="card"><small>SEASON AMBITION</small><h3>${esc(h.career.goal)} · ${h.career.completed?'ACHIEVED':'TO BE CONTINUED'}</h3><p>${esc(h.career.strategy)}</p><p>${esc(h.career.strategyProgress)}</p><p>${esc(h.career.next)}</p></section>`:''}
