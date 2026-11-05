const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function engine() {
 const context=vm.createContext({structuredClone,console,localStorage:{getItem(){return null},setItem(){}},document:{querySelector(){return null},getElementById(){return null},addEventListener(){}},navigator:{onLine:true},window:{scrollTo(){}}});
 for(const file of ['matches.js','portraits.js','moments.js','exchange.js','kayfabe.js','booking.js','career.js','stories.js','snafu.js','webapp.js','progression.js','rise.js','game.js']){
  let source=fs.readFileSync(path.join(root,file),'utf8');
  if(file==='game.js')source=source.replace(/render\(\);\s*$/,'');
  vm.runInContext(source,context,{filename:file});
 }
 return code=>vm.runInContext(code,context);
}
const run=engine();
run(`
 function match(a,b,extra={}){return {kind:'match',format:'singles',sides:[[a],[b]],a,b,winner:a,type:'Singles match',finish:'Clean finish',...extra}}
 function promo(a,target=null,extra={}){return {kind:'promo',a,target,scene:'Solo address',hook:'Win the crowd',concept:'',...extra}}
 function card(){return [match(0,1),match(2,4),promo(10),promo(17)]}
 function resetTest(){state=fresh();state.card=card()}
 function advanceTest(){state.week++;state.recap=null;state.card=card();state.production={week:state.week,choice:null}}
 resetTest();
`);
run('state.drafts[0]=match(5,6)');
assert.equal(run('playedWrestlerIds().has(0) && playedWrestlerIds().has(5)'),true,'A pending recast reserves the saved and draft wrestlers');
assert.equal(run('playedWrestlerIds(0).has(0) || playedWrestlerIds(0).has(5)'),false,'The segment editor can reuse its own wrestlers');
run('delete state.drafts[0]');
assert.equal(run('playedWrestlerIds().has(5)'),false,'A discarded draft returns its wrestlers to the hand');
run('state.drafts[0]=match(5,6);state.card[0]=state.drafts[0];delete state.drafts[0]');
assert.equal(run('playedWrestlerIds().has(0) || !playedWrestlerIds().has(5)'),false,'Confirming a recast releases the replaced wrestler');
run('resetTest()');
assert.equal(run('state.gameVersion'),4);
assert.equal(run('WISCONSIN_TOUR.length'),12);
assert.equal(run('new Set(WISCONSIN_TOUR.map(event=>event.town)).size'),12);
for(let month=1;month<=24;month++){
 const week=month*4;
 assert.equal(run(`monthlyEvent(${week-3}).week`),week,'Every booking week must point to the correct upcoming monthly show');
 assert.equal(run(`monthlyEvent(${week}).id`),run(`WISCONSIN_TOUR[${(month-1)%12}].id`));
}
assert.equal(run('monthlyEvent(48).town'),'Bayfield');
assert.equal(run('monthlyEvent(49).town'),'Sister Bay');
assert.equal(run('monthlyEvent(49).circuit'),2);
assert.equal(run('showLocation(7).town'),'Sturgeon Bay');
assert.equal(run('showLocation(8).town'),'Fish Creek');
run('state.week=4;const firstTourShow=simulateShow();state.week=8;state.card=card();simulateShow();');
assert.equal(run('firstTourShow.name'),'Sister Bay Shoreline Showdown');
assert.equal(run('firstTourShow.location.town'),'Sister Bay');
assert.equal(run('firstTourShow.event.id'),'sister-bay');
assert.equal(run('state.history[0].name'),'Fish Creek Fish Boil Brawl');
assert.equal(run('state.history[1].name'),'Sister Bay Shoreline Showdown','Past shows keep their original identity');
run(`resetTest();state.eventName='PAYBACK AT THE POTLUCK';state.history=[{week:4,name:'Payback at the Potluck',rating:65,attendance:150,profit:100}];state.week=8;state=mergeRosterExpansion(structuredClone(state));`);
assert.equal(run('showName()'),'Fish Creek Fish Boil Brawl');
assert.equal(run('state.history[0].name'),'Payback at the Potluck','Migration must not rewrite historical results');
run('resetTest();');
// Required weekly business pauses/resumes without duplicate costs, promises or trust gains.
run('resetTest();state.started=true;let briefingCalls=0;const originalBriefing=openWeeklyBriefing;openWeeklyBriefing=()=>briefingCalls++;runShow();startLiveShow();openWeeklyBriefing=originalBriefing;');
assert.equal(run('briefingCalls'),2);
assert.equal(run('state.liveShow'),null);
assert.equal(run('weeklyBriefingPending()'),true);
assert.equal(run('weeklyBriefingStage()'),'production');
assert.equal(run('productionIssue().id'),'dead-phone');
assert.equal(run('completeWeeklyBriefing()'),false);
assert.equal(run("chooseBriefingProduction('invalid')"),false);
const originalCost=run('matchCost()');
assert.equal(run("chooseBriefingProduction('safe')"),true);
assert.equal(run("chooseBriefingProduction('wild')"),false);
assert.equal(run('matchCost()'),originalCost+run('fixCost()'));
assert.equal(run('state.cash'),4250,'A production choice belongs in the show budget, not an immediate second charge');
assert.equal(run('weeklyBriefingStage()'),'backstage');
assert.equal(run("chooseBriefingResponse('earn')"),true);
assert.equal(run('w(10).trust'),60,'A partial conversation must not apply its effects');
run('state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:"Sturgeon Bay Slam",state}))));');
assert.equal(run('weeklyBriefingStage()'),'tone');
assert.equal(run("confirmBriefingTone('private')"),true);
assert.equal(run('w(10).trust'),63);
assert.equal(run("confirmBriefingTone('private')"),false);
assert.equal(run('w(10).trust'),63);
assert.equal(run('weeklyBriefingStage()'),'review');
run("view='office';");
assert.equal(run('completeWeeklyBriefing()'),true);
assert.equal(run('view'),'book','Finishing the briefing should open the booking desk even after an Office resume');
assert.equal(run('completeWeeklyBriefing()'),false);
assert.equal(run('weeklyBriefingPending()'),false);
run('state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:"Sturgeon Bay Slam",state}))));');
assert.equal(run('weeklyBriefingPending()'),false,'Completed business must remain completed after reload');
run('const briefingShow=simulateShow();');
assert.equal(run('briefingShow.cost'),originalCost+run('fixCost()'));
assert.equal(run('briefingShow.fallout.filter(entry=>entry.kind==="production").length'),1);
assert.equal(run('briefingShow.fallout.filter(entry=>entry.kind==="backstage").length'),1);
run('advanceTest();');
assert.equal(run('weeklyBriefingPending()'),true);
assert.equal(run('weeklyBriefingStage()'),'production');
assert.equal(run('productionIssue().id'),'announcer');
run('resetTest();state.started=true;state.week=5;state.production={week:5,choice:null};ensureWeeklyBriefing();const genericActor=state.weeklyBriefing.request.actor;');
assert.equal(run("chooseBriefingProduction('crew')"),true);
assert.equal(run('productionCost()'),0);
assert.equal(run("chooseBriefingResponse('yes')"),true);
assert.equal(run("confirmBriefingTone('public')"),true);
assert.equal(run('state.promises[0].actor'),run('genericActor'));
assert.equal(run('state.promises[0].kind'),'win');
assert.equal(run('state.promises[0].due'),5);
assert.equal(run('completeWeeklyBriefing()'),true);
run("state.production.choice='wild';state.card=[promo(7),match(0,1),match(8,12),promo(10)];const productionLog=[];");
assert.equal(run('applyProductionDecision(0,[w(7)],productionLog)'),0,'The volunteer referee problem applies to the first match, not an opening promo');
assert.equal(run('applyProductionDecision(1,[w(0),w(1)],productionLog)'),2);
run("state.week=7;state.production={week:7,issueId:'double-booking',choice:'wild'};state.card=[match(0,1),match(8,12),promo(10),promo(7)];");
assert.equal(run('applyProductionDecision(0,[w(0),w(1)],productionLog)'),0);
assert.equal(run('applyProductionDecision(3,[w(7)],productionLog)'),2,'A promo main event uses mic skills when handling the hall deadline');
run('resetTest();state.started=true;state.week=4;state.production={week:4,choice:"safe"};state.arc.answered[4]={choice:"respect",tone:"private",summary:"Already answered"};storyDefaults(state);');
assert.equal(run('productionIssue().id'),'dead-phone','Legacy production choices must preserve their original issue');
assert.equal(run('weeklyBriefingStage()'),'review','Existing backstage answers must not be asked again');
assert.equal(run('completeWeeklyBriefing()'),true);
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),production:{week:4,choice:null,issueId:"dead-phone"}}})'),'A backup cannot mark unresolved production as completed');
run('resetTest();state.started=true;state.liveShow={index:0};');
assert.equal(run('weeklyBriefingPending()'),false,'Do not interrupt an in-progress show during migration');
run('resetTest();');
assert.equal(run('bookingProblems(promo(10)).length'),0);
assert.equal(run("bookingProblems(promo(10,null,{hook:'Issue a challenge'})).length"),1);
assert.equal(run("bookingProblems(promo(10,10)).length"),1);
assert.equal(run("bookingProblems(match(0,1,{finish:'Interference',interferer:null})).length"),1);
assert.equal(run("bookingProblems(match(0,1,{finish:'Interference',interferer:17})).length"),0);
assert.equal(run("bookingProblems(match(0,1,{format:'tag',sides:[[0,1],[2,3]],type:'Last person standing'})).length"),1);
run("resetTest();developStory(10,17,70,'An unbooked grudge.');");
const without=run('forecastAttendance([match(0,1),match(2,4),promo(3),promo(5)])');
run('state.stories={};state.rivalries={};');
assert.equal(run('forecastAttendance([match(0,1),match(2,4),promo(3),promo(5)])'),without,'Unbooked heat must not draw');
run("developStory(0,1,70,'A featured grudge.');");
assert.ok(run('forecastAttendance([match(0,1),match(2,4),promo(3),promo(5)])')>without);
run("resetTest();makePromise(10,'win',1);state.card[0]=match(10,17);simulateShow();");
assert.equal(run('state.promises[0].status'),'kept');
assert.equal(run('state.history[0].fallout.length>0'),true);
run("resetTest();makePromise(10,'rematch',1,17);simulateShow();");
assert.equal(run('state.promises[0].status'),'broken');
assert.ok(run('w(10).trust')<60);
run("resetTest();makePromise(10,'rematch',1,17);state.card[0]={...match(10,2),format:'tag',sides:[[10,17],[2,4]]};simulateShow();");
assert.equal(run('state.promises[0].status'),'broken','Tagging together is not a rematch');
run("resetTest();state.card[0]=match(0,1);simulateShow([{delta:0,effect:'protect'}]);");
assert.equal(run('w(1).momentum'),3);
assert.equal(run('w(1).trust'),63);
run("resetTest();state.card[0]=match(0,1,{finish:'Interference',interferer:17,interferenceReason:'Help an ally'});simulateShow();");
assert.equal(run('storyFor(1,17).phase'),'complication');
assert.equal(run('Object.keys(state.stories).length'),2,'Only named opponents should feud');
assert.match(run('state.history[0].fallout.map(i=>i.text).join()'),/Term Life Insurance Plan/);
run("resetTest();state.card[2]=promo(10,17,{hook:'Issue a challenge',scene:'Face-off'});simulateShow();");
assert.equal(run('state.challenges[0].status'),'open');
assert.ok(run('storyFor(10,17).heat')>0);
run('advanceTest();state.card[0]=match(10,17);simulateShow();');
assert.equal(run('state.challenges[0].status'),'booked');
for(const route of ['rematch','earn','team']){
 run(`resetTest();resolveBackstage(10,'${route}','private',true,0);simulateShow();advanceTest();`);
 if(route==='earn')run("state.card[0]=match(10,4);simulateShow();advanceTest();");
 else run('simulateShow();advanceTest();');
 run("resolveBackstage(10,'commit','public',true,2);simulateShow();advanceTest();");
 if(route==='team')run("state.card[0]={...match(10,2),format:'tag',sides:[[10,17],[2,4]]};");
 else run('state.card[0]=match(10,17);');
 run('simulateShow();');
 assert.equal(run('state.arc.outcome'),route==='team'?'partners':'victory');
 assert.equal(run("state.promises.some(p=>p.status==='broken')"),false);
 if(route==='team')assert.equal(run('state.teams[0].name'),'Sweepstakes & Deductibles');
 else assert.equal(run('storyFor(10,17).phase'),'aftermath');
}
run("resetTest();resolveBackstage(10,'rematch','private',true,0);for(let i=0;i<4;i++){simulateShow();if(i<3)advanceTest()}");
assert.equal(run('state.arc.outcome'),'unfinished');
assert.equal(run('state.promises[0].status'),'broken');
// Every supported format, ruleset, winner and generated choice must produce valid scenes.
run(`resetTest();for(const [format,data] of Object.entries(MATCH_FORMATS))for(const type of rulesFor({format})){
 const sides=[];let id=0;for(const size of data.sizes)sides.push(Array.from({length:size},()=>id++));
 for(const winner of sides.flat()){
 const s={kind:'match',format,sides,a:sides[0][0],b:sides[1][0],winner,type,finish:'Clean finish'};
 const moment=matchMoment(s,0);if(moment.choices.length!==3)throw Error('Missing choices');
 for(const choice of moment.choices)if(!choice.hint||!choice.effect||!choice.outcome||!choice.title||choice.outcome.includes('undefined'))throw Error('Broken scene '+format+' '+type);
 }
}`);
run(`for(const r of state.roster)for(const scene of ['Solo address','Face-off','Interview','Interruption']){
 const s=promo(r.id,scene==='Solo address'?null:(r.id+1)%initialRoster.length,{scene,hook:scene==='Solo address'?'Win the crowd':'Fuel a rivalry'});
 const m=promoMoment(s,0);for(const c of m.choices)if(!c.hint||!c.outcome||c.outcome.includes('undefined'))throw Error('Broken promo '+r.id);
}`);
run(`resetTest();
 state.card=[promo(10),promo(17,2,{scene:'Face-off'}),match(0,1),match(4,5)];
 const savedMoments=state.card.map((segment,index)=>segment.kind==='promo'?promoMoment(segment,index):matchMoment(segment,index));
 for(const moment of savedMoments)moment.dialogueVersion=4;
 savedMoments[0].choices.push({title:'Old fourth choice'},{title:'Old fifth choice'});
 savedMoments[1].choices.push({title:'Old fourth choice'},{title:'Old fifth choice'});
 const savedAnswer={...savedMoments[0].choices[1],option:4,title:'Old fifth choice'};
 state.liveShow={index:1,moments:savedMoments,answers:[savedAnswer],exchanges:{0:{intro:5,result:1},1:{intro:999,result:0}}};
 const decisionMarkup=exchangePage();
`);
assert.equal(run('state.liveShow.answers[0]===savedAnswer'),true,'Completed decisions survive a live-show update');
assert.equal(run('state.liveShow.exchanges[0].result'),1,'Completed dialogue keeps its playback position');
assert.equal(run('state.liveShow.moments[1].choices.length'),3,'An undecided saved promo uses the new three choices');
assert.equal(run('decisionMarkup.match(/data-moment-choice=/g).length'),3);
assert.match(run('decisionMarkup'),/Call out Rudy, from Football/);
assert.match(run('decisionMarkup'),/Adds 6 rivalry heat/);
run('resetTest();state.drafts[0]={...blankBooking("match"),format:"tag",sides:[[10,null],[null,null]],a:10};');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).drafts[0].a'),10);
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),promises:[{actor:999}]}})'));
const oldSave=fs.readFileSync(path.join(__dirname,'fixtures/legacy-career.json'),'utf8');
run(`state=mergeRosterExpansion(validateCareer(JSON.parse(${JSON.stringify(oldSave)})));`);
assert.equal(run('state.cash'),5730);
assert.equal(run('state.arc.start'),1);
assert.equal(run('w(10).trust'),60);
assert.equal(run('storyFor(10,17).heat'),36);
assert.equal(run('validateCareer({game:"Brawl in Boseman",state:structuredClone(state)}).roster.length'),38);
run('resetTest();for(let week=1;week<=12;week++){state.week=week;state.card=card();simulateShow()}');
assert.equal(run('state.seasonReports.length'),1);
assert.equal(run('state.seasonReports[0].shows'),12);
assert.ok(run('Object.values(state.crowd).every(n=>n>=10&&n<=90)'));
assert.ok(run('state.history.every(h=>Number.isFinite(h.profit)&&Number.isFinite(h.rating))'));
run("resetTest();state.card[0].prop='broom';state.card[1].prop='broom';");
assert.ok(run("showBlockingProblems().some(p=>p.text.includes('Each prop'))"));
run("resetTest();state.card[0].title=true;state.card[1].title=true;");
assert.ok(run("showBlockingProblems().some(p=>p.text.includes('one defense'))"));
run("resetTest();state.week=6;resolveBackstage(4,'yes','private',false,0);state.card[2]=promo(4);simulateShow();");
assert.equal(run('state.promises[0].kind'),'promo');
assert.equal(run('state.promises[0].status'),'kept');
const live=engine();
live(`render=()=>{};save=()=>{};state=fresh();state.card=[
 {kind:'match',format:'singles',sides:[[10],[4]],a:10,b:4,winner:10,type:'Singles match',finish:'Clean finish'},
 {kind:'match',format:'singles',sides:[[0],[1]],a:0,b:1,winner:0,type:'Singles match',finish:'Clean finish'},
 {kind:'promo',a:10,target:17,scene:'Face-off',hook:'Issue a challenge',concept:''},
 {kind:'promo',a:2,target:null,scene:'Solo address',hook:'Win the crowd',concept:''}];startLiveShow();chooseMoment(0);
 state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:'Sturgeon Bay Slam',state}))));
 nextMoment();for(let i=1;i<4;i++){chooseMoment(0);nextMoment()}`);
assert.equal(live('state.history.length'),1,'Resume should resolve exactly one show');
assert.equal(live('state.liveShow'),null);
assert.equal(live('state.challenges[0].status'),'open');
run('resetTest();let saveWrites=0;localStorage.setItem=()=>saveWrites++;save();save();');
assert.equal(run('saveWrites'),1,'Unchanged renders should not rewrite the entire career');
run('state.cash++;save();');assert.equal(run('saveWrites'),2);
run("localStorage.setItem=()=>{throw Error('QuotaExceededError')};state.cash++;save();");
assert.equal(run('careerStorageUnavailable'),true,'Storage failure must remain visible and block an update restart');
function strategy(mode){return JSON.parse(run(`JSON.stringify((()=>{resetTest();for(let week=1;week<=12;week++){state.week=week;state.card=${mode==='repeated'?"[promo(7),promo(7),promo(7),promo(7)]":"[match(0,1),match(8,12),promo(10),promo(17)]"};simulateShow()}return {rating:state.history[0].rating,cash:state.cash,drama:state.crowd.drama}})())`))}
const repeated=strategy('repeated'),mixed=strategy('mixed');
assert.ok(repeated.rating<mixed.rating,'Four repeated speeches should not outperform a mixed wrestling card');
console.log('Passed: required weekly briefings, pause/resume and idempotence, production costs/outcomes, calendar, migration, promises, live effects, interference, challenges, Sweeps routes, match formats/voices, season history and balance.');
console.log(JSON.stringify({repeated,mixed}));
// Opponent suggestions describe real matchup traits and ignore allies.
run(`resetTest();state.rivalries={};state.challenges=[];`);
assert.ok(run(`opponentFit(match(0,null),'p1',w(1),0).reasons.includes('Face / heel contrast')`));
assert.equal(run(`opponentFit(match(0,null),'p0',w(1),0).score`),0,'An empty opposing side cannot produce opponent suggestions');
const noChallenge=run(`opponentFit(match(0,null),'p1',w(1),0).score`);
run(`state.challenges=[{actor:0,target:1,status:'open'}]`);
assert.equal(run(`opponentFit(match(0,null),'p1',w(1),0).score`),noChallenge+45);
assert.ok(run(`opponentFit(match(0,null),'p1',w(1),0).reasons.includes('Answers an open challenge')`));
run(`state.challenges=[];state.rivalries[rivalryKey(0,1)]=30`);
assert.equal(run(`opponentFit(match(0,null),'p1',w(1),0).score`),noChallenge+30);
assert.equal(run(`opponentFit({kind:'match',format:'tag',sides:[[0,null],[null,null]]},'p1',w(1),0).score`),0,'Tag partners are not treated as opponents');
assert.match(run(`posterBooking(0)`),/data-poster-slot="0:0"/);
assert.match(run(`posterBooking(0)`),/data-poster-editor="0"/);
assert.doesNotMatch(run(`bookPage()`),/id="segment-0"/);
console.log('Passed: explained opponent fits, rivalry/challenge priority, team-side separation and direct edit indicators.');

// Character content remains selectable, playable and portable across the entire roster.
run('resetTest()');
assert.equal(run('CHARACTER_SPECIALS.length'),38);
assert.equal(run('PRODUCTION_ISSUES.length'),20);
assert.equal(run('new Set(PRODUCTION_ISSUES.map(issue=>issue.id)).size'),20);
for(let id=0;id<38;id++){
 const opponent=(id+1)%38;
 run(`resetTest();state.card[0]=match(${id},${opponent},{type:CHARACTER_SPECIALS[${id}].name,prop:'signature-${id}'});`);
 assert.equal(run('rulesFor(state.card[0]).includes(state.card[0].type)'),true);
 assert.equal(run('bookingProblems(state.card[0]).length'),0);
 assert.equal(run('normalizeMatch(state.card[0],state.roster).type'),run(`CHARACTER_SPECIALS[${id}].name`));
 assert.equal(run(`propsFor(state.card[0]).some(([key])=>key==='signature-${id}')`),true);
 assert.equal(run('matchMoment(state.card[0],0).opening.some(beat=>beat.text.includes(state.card[0].type))'),true);
 assert.equal(run(`promoMoment(promo(${id}),0).choices.length`),3);
 assert.equal(run(`new Set(promoMoment(promo(${id}),0).choices.map(choice=>choice.outcome)).size`),3);
 run('simulateShow()');
 assert.equal(run('state.history[0].results[0].analysis.includes("brought")'),true);
 run(`state.card[0]=match(${opponent},${(id+2)%38},{prop:'signature-${id}'})`);
 assert.equal(run('bookingProblems(state.card[0]).length>0'),true);
}
run('resetTest();state.week=5;const characterRequest=backstageConversation(2);resolveBackstage(2,"spotlight","private",false,4)');
assert.equal(run('characterRequest.choices.some(choice=>choice[0]==="spotlight")'),true);
assert.equal(run('state.promises.some(p=>p.actor===2&&p.kind==="promo")'),true);
console.log('Passed: all 38 signature matches/props, three distinct promo branches per character, owner constraints and character backstage promises.');

// Career progression is a ratchet, not a seasonal reset or a reward for opening menus.
run('resetTest();delete state.progression;progressionDefaults(state)');
assert.equal(run('state.progression.stage'),0);
assert.equal(run('venueCapacity()'),300);
assert.equal(run('careerRequirements()[0].done'),false);
run('state.history=[{week:1,attendance:300,capacity:300,rating:70,profit:100,results:[]}];state.week=11;advanceCareer({week:11})');
assert.equal(run('state.progression.stage'),0,'Qualification waits for the season-end review');
run('state.week=12;const promotionRecap={week:12};advanceCareer(promotionRecap);advanceCareer(promotionRecap)');
assert.equal(run('state.progression.stage'),0,'Qualification leaves the room in place');
assert.equal(run('state.progression.offerWeek'),12);
run('state.recap=promotionRecap;state=validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)})');
assert.equal(run('acceptCareerOffer()'),true);
assert.equal(run('acceptCareerOffer()'),false);
assert.equal(run('state.progression.stage'),1);
assert.equal(run('state.progression.achievements.length'),1,'Review cannot award the same chapter twice');
assert.equal(run('venueCapacity()'),600);
assert.equal(run('promotionRecap.career.completed'),true);
run('state.week=24;state.history.unshift({week:24,attendance:100,capacity:600,rating:20,profit:-100,results:[]});advanceCareer({week:24})');
assert.equal(run('state.progression.stage'),1,'A bad season never revokes a chapter');
assert.equal(run('state.progression.stageStart'),13,'Incomplete progress retains its original baseline');
// Every chapter has a satisfiable path, without forced match winners or stipulations.
for(let stage=0;stage<8;stage++){
 run(`resetTest();state.week=120;state.progression={stage:${stage},stageStart:1,achievements:[],seasons:{10:'stories'},dynasty:false};state.history=Array.from({length:120},(_,i)=>({week:i+1,attendance:30000,capacity:30000,rating:80,profit:100,event:{id:'town-'+i%12},championId:i%4,results:[{participants:Array.from({length:34},(_,id)=>id)}]}));const review${stage}={week:120};advanceCareer(review${stage});`);
 assert.equal(run(`review${stage}.career.completed`),true,'Each chapter can qualify');
 assert.equal(run('acceptCareerOffer()'),true);
 assert.equal(run('state.progression.stage'),Math.min(7,stage+1));
 assert.equal(run('state.progression.dynasty'),stage===7);
}
run('resetTest();state.week=12;state.history=[{week:12,attendance:299,rating:100,profit:100,results:[]}];advanceCareer({week:12})');
assert.equal(run('state.progression.stage'),0,'An almost sellout does not count');
run('resetTest();state.week=12;state.rep=60;state.roster.forEach(r=>r.pop=80);state.history=Array.from({length:11},(_,i)=>({week:i+1,rating:75}));state.card=card();state.card[3]=match(7,8);developStory(0,1,70,"Season-long feud");');
assert.equal(run('forecastAttendance()'),300,'A strong first season can sell out the local hall');
run('resetTest();const oldCareer=structuredClone(state);delete oldCareer.progression;oldCareer.week=28;state=mergeRosterExpansion(oldCareer)');
assert.equal(run('state.progression.stageStart'),28,'Existing careers start measuring from adoption');
run('resetTest();state.week=12;state.history=[{week:12,attendance:300,capacity:300,rating:80,profit:100,results:[]}];advanceCareer({week:12});acceptCareerOffer();state=validateCareer({game:"Sturgeon Bay Slam: Rise to Supremacy",state:structuredClone(state)})');
assert.equal(run('state.progression.stage'),1,'New-brand backups preserve progression');
assert.throws(()=>run('const badProgression=structuredClone(state);badProgression.progression.stage=99;validateCareer({game:"Sturgeon Bay Slam",state:badProgression})'));
run('resetTest();const validOriginal=validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)});state.progression.stage=6;const tvCost=matchCost(),tvTickets=forecastAttendance()*ticketPrice(),tvBefore=state.cash;simulateShow()');
assert.equal(run('state.recap.broadcast'),25000);
assert.equal(run('state.cash-tvBefore'),run('tvTickets+25000-tvCost'),'Broadcast payments enter the actual economy');
assert.equal(run('state.recap.capacity'),15000);
assert.equal(run('state.history[0].capacity'),15000,'History retains capacity after venue changes');
console.log('Passed: season reviews, carried progress, chapter ratchet, all eight qualification paths, first-season sellout, legacy/new backups, invalid progression and TV economy.');

run('resetTest()');
assert.equal(run('state.roster.length'),38);
assert.equal(run('state.roster.every(r=>r.performerType==="human")'),true);
assert.match(run('w(35).desc'),/human powerhouse/i);
assert.match(run('w(37).desc'),/human wrestler/i);
assert.doesNotMatch(run('JSON.stringify([w(34),ringPersonalities[34],ringVoices[34],CHARACTER_SPECIALS[34],crowdHeckles[34]])'),/wet|urine|stain|piss|accident/i,'Liam’s visual gag must never leak into game text');
assert.equal(run('promoMoment(promo(37),0).choices.every(c=>c.beats.some(b=>b.speaker===37&&b.text.length>12))'),true,'The dog character is a speaking human performer');
run('const preExpansion=structuredClone(state);preExpansion.roster=preExpansion.roster.slice(0,34);delete preExpansion.progression;state=mergeRosterExpansion(validateCareer({game:"Sturgeon Bay Slam",state:preExpansion}))');
assert.equal(run('state.roster.length'),38);
assert.equal(run('state.roster.every(r=>r.performerType==="human")'),true);
run('w(37).desc="An actual dog.";w(37).gimmick="Four paws. Zero prohibitions.";state=mergeRosterExpansion(structuredClone(state))');
assert.match(run('w(37).desc'),/human wrestler/i);
console.log('Passed: expansion migration, human-performer canon, speaking dog-costume character and visual-only Liam gag.');

const dogDialogue=run('JSON.stringify([ringPersonalities[37].boast,ringPersonalities[37].heart,ringVoices[37].open,ringVoices[37].reply("your argument"),ringVoices[37].close("your argument"),ringVoices[37].crowd,...CHARACTER_SPECIALS[37].branches.flat()])');
assert.match(dogDialogue,/I am a dog/);
assert.match(dogDialogue,/dogs cannot wrestle/);
assert.doesNotMatch(dogDialogue,/costume|human|person wearing/i,'The Dog must never break character in his own dialogue');
console.log('Passed: Dog dialogue fully commits to the gimmick while portraits and biographies retain human-performer canon.');

run('resetTest()');
assert.match(run('matchRuleOptions(match(0,1,{format:"royal"}))'),/>Standard<\/option>/);
assert.doesNotMatch(run('matchRuleOptions(match(0,1,{format:"royal"}))'),/>Singles match</);
assert.equal(run('ruleCost(match(0,1))'),0,'Standard retains its existing cost and save value');
assert.equal(run('matchLabel(match(0,1,{format:"royal"}))'),'Battle royal · 6 wrestlers');
assert.equal(run('rosterCardName(w(36))'),'Tessa Blanchard');
assert.match(run('w(36).name'),/Allowed Elsewhere/,'Full character name remains in the roster data and previews');
assert.equal(run('promoNeedsTarget(promo(0))'),false);
for(const hook of ['Issue a challenge','Fuel a rivalry'])assert.equal(run(`promoNeedsTarget(promo(0,null,{hook:${JSON.stringify(hook)}}))`),true);
for(const scene of ['Face-off','Interview','Interruption'])assert.equal(run(`promoNeedsTarget(promo(0,null,{scene:${JSON.stringify(scene)}}))`),true);
run('const recastPromo=promo(36,0,{prop:"signature-36"});setPromoSpeaker(recastPromo,0)');
assert.equal(run('recastPromo.target'),null,'Changing speakers cannot leave a self-target');
assert.equal(run('recastPromo.prop'),'','Changing speakers clears unavailable signature props');
for(const intent of ['Win the crowd','Debut a gimmick'])assert.equal(run(`bookingProblems(promo(36,null,{hook:${JSON.stringify(intent)}})).length`),0);
console.log('Passed: format-neutral standard rules, compact display names, direct promo defaults, target requirements and safe recasting.');

run('resetTest();state.arc={start:state.week,route:"earn",earned:false,answered:{}}');
assert.equal(run('bookingResumeStep(blankBooking("match"))'),'format');
assert.equal(run('bookingResumeStep({...blankBooking("match"),format:"tag",sides:[[10,17],[0,null]]})'),'p3');
assert.equal(run('bookingResumeStep(match(10,0,{winner:null}))'),'finish');
assert.ok(run('opponentFit(match(10,null),"p1",w(0),0).score>opponentFit(match(10,null),"p1",w(17),0).score'),'Qualifying opponents outrank the insurer during the earned route');
assert.match(run('qualifierGuidance(match(10,0))'),/Counts toward/);
assert.match(run('qualifierGuidance(match(10,17))'),/Does not count/);
assert.match(run('qualifierGuidance(match(10,0,{winner:0}))'),/book him to win/);
run('state.arc.earned=true');assert.equal(run('qualifierGuidance(match(10,17))'),'');
run('state.arc.earned=false;state.week=state.arc.start+4');assert.equal(run('qualifierGuidance(match(10,17))'),'');
run('resetTest();state.drafts[0]={...match(10,0),winner:null};const originalUX=JSON.stringify([state.card,state.drafts]);clearBooking(0)');
assert.equal(run('state.card[0].kind'),null);assert.equal(run('state.drafts[0]'),undefined);
assert.equal(run('canUndoBooking()'),true);assert.equal(run('undoBooking()'),true);
assert.equal(run('JSON.stringify([state.card,state.drafts])'),run('originalUX'),'Undo restores the confirmed card and its separate draft exactly');
run('clearBooking(0,true)');assert.equal(run('state.card[0].kind'),'match');assert.equal(run('state.drafts[0]'),undefined);run('undoBooking()');
run('clearBooking(0);state.card[0]=match(2,3)');assert.equal(run('undoBooking()'),false,'Undo must not replace a subsequent booking');
run('clearBooking(0);state=fresh()');assert.equal(run('undoBooking()'),false,'Undo never crosses careers');
run('resetTest();state.drafts[0]=match(10,0);const movedDraft=JSON.stringify(state.drafts[0]);moveBooking(0,1)');
assert.equal(run('JSON.stringify(state.drafts[1])'),run('movedDraft'));assert.equal(run('Object.hasOwn(state.drafts,"0")'),false);
assert.equal(run('moveBooking(0,-1)'),null);
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).card.length'),4,'Moved drafts remain exportable');
assert.equal(run('rosterCandidates("Tooth").length'),1);assert.equal(run('rosterCandidates("","Heel").every(r=>r.role==="Heel")'),true);
console.log('Passed: objective-aware booking, draft resume, recoverable clear/discard, undo isolation, safe draft reorder and roster discovery.');

run('resetTest();state.started=true;state.week=5;state.arc.start=1;ensureWeeklyBriefing();w(briefingConversation().actor).trust=44;state.weeklyBriefing.requestChoice="yes"');
assert.match(run('weeklyBriefingCard()'),/Counteroffer/);
assert.equal(run('confirmBriefingTone("private")'),true,'The wrestler can be answered before the venue');
assert.equal(run('state.promises[0].kind'),'promo','The counteroffer survives crossing the trust threshold while answering');
assert.equal(run('weeklyBriefingPending()'),true);
assert.equal(run('chooseBriefingProduction("safe")'),true);
assert.equal(run('completeWeeklyBriefing()'),true);
run('resetTest();state.started=true');
assert.equal(run('passBackstageRequest()'),true);
assert.equal(run('passBackstageRequest()'),false);
assert.equal(run('w(10).trust'),58);
assert.equal(run('chooseBriefingProduction("crew")'),true);
assert.equal(run('completeWeeklyBriefing()'),true);
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).weeklyBriefing.completed'),true);
console.log('Passed: independent inbox replies, wary wrestler counteroffers, and a saved decline.');

// Rise to Supremacy: eras change the booker's job.
run('resetTest()');
assert.equal(run('JSON.stringify([0,1,2,3,4,5,6,7].map(stage=>eraIndex(stage)))'),JSON.stringify([0,0,1,2,2,3,3,4]),'Eight chapters group into five eras');
assert.equal(run('JSON.stringify([0,2,3,5,7].map(stage=>{state.progression.stage=stage;return defaultCard().length}))'),JSON.stringify([4,5,6,7,7]),'The card grows with each era');
run('resetTest();state.week=61;state.progression={stage:5,stageStart:61,achievements:[0,1,2,3,4].map(i=>({stage:i,week:(i+1)*12,name:CAREER_STAGES[i].name})),seasons:{},dynasty:false};state.card=defaultCard().map((_,i)=>match(i*2,i*2+1));state.drafts={6:match(30,31)}');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).card.length'),7,'Seven-segment cards export and import');
assert.equal(run('slotLabel(6)+"/"+slotLabel(5)+"/"+slotLabel(0)+"/"+slotLabel(2)'),'Main event/Co-main/Opener/Match 3');
assert.equal(run('JSON.stringify(billOrder())'),JSON.stringify([6,0,1,2,3,4,5]),'The main event headlines a card of any size');

// Rivals, standings and territory fights.
run('resetTest();state.history=[]');
assert.equal(run('yourRank()'),4,'A new promotion starts at the bottom of the local standings');
assert.equal(run('rivalRequirement().done'),false);
assert.equal(run('careerRequirements().some(goal=>goal.rival)'),true,'Every chapter names a rival to beat');
run('resetTest();state.week=4;state.history=[];simulateShow()');
assert.equal(run('Boolean(state.recap.territory)'),true,'Unanswered tour-night challenges go head to head');
run('resetTest();state.week=4;state.history=[];chooseTerritory("move");const repBefore=state.rep;simulateShow();');
assert.equal(run('state.recap.territory'),undefined,'Moving the show avoids the fight');
assert.match(run('state.recap.rise.notes[0]'),/moved away/);
run('resetTest();state.week=4;const raidBase=showCost();chooseTerritory("raid")');
assert.equal(run('showCost()-raidBase'),run('fixCost()*3'),'Raiding a rival card costs three fixes');
assert.equal(run('chooseTerritory("sneak")'),false);
run('resetTest();state.week=4;state.rise.wins=[];state.rise.wins.push({week:4,stage:0,rival:"x",you:200,them:100})');
assert.equal(run('rivalRequirement().done'),true,'A head-to-head win satisfies the rival goal');
run('resetTest();state.week=5');
assert.equal(run('chooseTerritory("fight")'),false,'Territory fights only happen on tour nights');

// Problems and costs scale with the era; crew absorbs their departments.
run('resetTest();state.progression.stage=2;state.week=1;state.production={week:1,choice:null};snafuDefaults(state)');
assert.equal(run('productionIssue().id.startsWith("c-")'),true,'The Circuit draws from its own problem pool');
assert.equal(run('fixCost()'),1300,'Fixes scale with the chapter');
assert.match(run('productionOptions()[0].hint'),/\$1,300/);
assert.equal(run('/\\$40\\b/.test(issueText(PRODUCTION_ISSUES[0]))'),false,'Old fixed prices follow the chapter rate');
assert.equal(run('issueText(productionIssue()).includes("{cost}")'),false);
run('chooseBriefingProduction("safe")');
assert.equal(run('productionCost()'),1300,'A paid fix costs the chapter rate');
run('resetTest();state.progression.stage=2;state.week=1;state.rise.crew=["ring","venue"];state.production={week:1,choice:null};snafuDefaults(state)');
assert.equal(run('state.production.choice'),'safe','A crew member handles their department automatically');
assert.equal(run('productionCost()'),0);
assert.equal(run('crewCost()'),run('crewSalary(CREW[0])+crewSalary(CREW[1])'),'Crew salaries scale with the chapter');assert.ok(run('crewCost()')<run('fixCost()'),'Crew costs less than one fix per show');
assert.equal(run('weeklyBriefingStage()'),'backstage','A handled problem skips straight to the backstage request');
run('resetTest();state.progression.stage=5;state.week=3;state.rise.crew=["ring","venue","production"];state.production={week:3,choice:null};snafuDefaults(state)');
assert.equal(run('productionIssue().dept'),'talent');
assert.equal(run('state.production.choice'),null,'Talent problems always reach the booker');
run('resetTest()');
assert.equal(run('toggleCrew("ring")'),false,'There is no crew to hire in the Gym Years');
assert.equal(run('new Set(allProductionIssues().map(issue=>issue.id)).size'),run('allProductionIssues().length'),'Problem ids are unique');
run('resetTest();state.progression.stage=3;state.week=2;state.production={week:2,choice:null};snafuDefaults(state);state.card=defaultCard().map((_,i)=>match(i*2,i*2+1))');
assert.equal(run('issueSegmentIndex(productionIssue())'),5,'Main-event problems target the last slot on a six-segment card');

// Press calls: once a month, scaled by era.
run('resetTest();const pick=pressCandidates()[0];const before=pick.pop');
assert.equal(run('answerPress(pick.id)'),true);
assert.equal(run('pick.pop-before'),3);
assert.equal(run('answerPress(pressCandidates()[1].id)'),false,'One press call per month');
run('state.week=5');
assert.equal(run('Boolean(pressAnswered())'),false,'A new month brings a new call');
run('resetTest();state.progression.stage=5;const moraleBefore=state.roster[0].morale');
assert.equal(run('answerPress("accept")'),true);
assert.equal(run('state.roster[0].morale'),run('moraleBefore')-2);

// Moving day and traditions.
run('resetTest();state.progression.stage=1;state.progression.offerWeek=state.week;state.cash=moveDeposit()-1');
assert.equal(run('acceptOfferWithMove()'),false,'A move needs the deposit in the bank');
run('state.cash=moveDeposit()+50');
assert.equal(run('acceptOfferWithMove()'),true);
assert.equal(run('state.cash'),50,'Signing pays the moving deposit');
assert.equal(run('state.rise.pendingMove.picks'),2,'Leaving the Gym Years lets you keep two traditions');
assert.equal(run('chooseTraditions(["chairs"])'),false,'Pick the right number');
assert.equal(run('chooseTraditions(["chairs","van"])'),false,'Later traditions are not offered yet');
assert.equal(run('chooseTraditions(["chairs","tom"])'),true);
assert.equal(run('state.rise.pendingMove'),undefined);
run('state.crowd.chaos=50;state.crowd.purists=50;riseAfterShow({week:2,results:[],attendance:100})');
assert.equal(run('JSON.stringify([state.crowd.chaos,state.crowd.purists])'),JSON.stringify([51,51]),'Traditions pay off after every show');
run('resetTest();state.progression.stage=0;state.progression.offerWeek=state.week;state.cash=moveDeposit();acceptOfferWithMove()');
assert.equal(run('state.rise.pendingMove'),undefined,'Moving within an era is not a moving day');
run('resetTest();simulateShow()');
assert.equal(run('state.rise.originals.length>=4'),true,'Gym Years performers become the originals');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).rise.originals.length'),run('state.rise.originals.length'));
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),rise:{...state.rise,crew:["ghost"]}}})'),/valid/,'Unknown crew members are rejected');

// The writers' room books the undercard in the War.
run('resetTest();state.progression.stage=5;state.card=defaultCard();state.drafts={}');
assert.equal(run('writersRoomBook()'),6,'Writers fill every slot except the main event');
assert.equal(run('state.card.slice(0,-1).every(segment=>!bookingProblems(segment).length)'),true);
assert.equal(run('state.card.at(-1).kind'),null,'The main event stays yours');
run('resetTest();state.card=defaultCard()');
assert.equal(run('writersRoomBook()'),0,'No writers in the Gym Years');
// A full seven-segment show simulates.
run('resetTest();state.progression.stage=5;state.card=defaultCard();writersRoomBook();state.card[6]=match(30,31);simulateShow()');
assert.equal(run('state.recap.results.length'),7);
console.log('Passed: five eras, growing cards, rivals and standings, territory fights, scaled problems, crew, press calls, moving day traditions, originals and the writers’ room.');

// Backups taken mid-show restore at every card size, and the title screen offers a restore.
run(`resetTest();state.card=Array.from({length:5},(_,i)=>i===1?promo(10):match(i*2+20,i*2+21));state.liveShow={week:state.week,index:4,answers:[],moments:state.card.map((s,i)=>s.kind==='promo'?promoMoment(s,i):matchMoment(s,i))}`);
assert.equal(run('validateCareer(JSON.parse(JSON.stringify({game:"Sturgeon Bay Slam: Rise to Supremacy",state}))).liveShow.moments.length'),5,'A five-segment show restores mid-broadcast');
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam: Rise to Supremacy",state:{...structuredClone(state),liveShow:{...structuredClone(state.liveShow),index:5}}})'));
assert.match(fs.readFileSync(path.join(root,'career.js'),'utf8'),/id="title-restore"/,'The title screen can restore a backup');
console.log('Passed: mid-show backups at every card size and title-screen restore.');
