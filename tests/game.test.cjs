const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function engine() {
 const context=vm.createContext({structuredClone,console,localStorage:{getItem(){return null},setItem(){}},document:{querySelector(){return null},getElementById(){return null},addEventListener(){}},navigator:{onLine:true},window:{scrollTo(){}}});
 for(const file of ['matches.js','portraits.js','moments.js','exchange.js','kayfabe.js','booking.js','career.js','stories.js','snafu.js','webapp.js','game.js']){
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
assert.equal(run('matchCost()'),originalCost+40);
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
assert.equal(run('briefingShow.cost'),originalCost+40);
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
 const s=promo(r.id,scene==='Solo address'?null:(r.id+1)%34,{scene,hook:scene==='Solo address'?'Win the crowd':'Fuel a rivalry'});
 const m=promoMoment(s,0);for(const c of m.choices)if(!c.hint||!c.outcome||c.outcome.includes('undefined'))throw Error('Broken promo '+r.id);
}`);
run('resetTest();state.drafts[0]={...blankBooking("match"),format:"tag",sides:[[10,null],[null,null]],a:10};');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).drafts[0].a'),10);
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),promises:[{actor:999}]}})'));
const oldSave=fs.readFileSync(path.join(__dirname,'fixtures/legacy-career.json'),'utf8');
run(`state=mergeRosterExpansion(validateCareer(JSON.parse(${JSON.stringify(oldSave)})));`);
assert.equal(run('state.cash'),5730);
assert.equal(run('state.arc.start'),1);
assert.equal(run('w(10).trust'),60);
assert.equal(run('storyFor(10,17).heat'),36);
assert.equal(run('validateCareer({game:"Brawl in Boseman",state:structuredClone(state)}).roster.length'),34);
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
