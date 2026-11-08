const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function engine() {
 const context=vm.createContext({structuredClone,console,localStorage:{getItem(){return null},setItem(){}},document:{querySelector(){return null},getElementById(){return null},addEventListener(){}},navigator:{onLine:true},window:{scrollTo(){}}});
 for(const file of ['matches.js','portraits.js','moments.js','exchange.js','kayfabe.js','booking.js','pick.js','career.js','stories.js','snafu.js','ledger.js','routes.js','roster.js','relationships.js','townmap.js','opening.js','tutorial.js','webapp.js','progression.js','rise.js','aftershow.js','game.js']){
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
// The Good Lord Above: little snafus are acts of God, sent for what's in His file.
run('resetTest();state.started=true;');
assert.equal(run('weeklyBriefingPending()'),false,'A clean file means no act of God');
assert.equal(run('productionIssue()'),null);
assert.equal(run('lordTier().id'),'watching');
assert.equal(run('productionOptions().length'),0);
run("makePromise(4,'promo',1);simulateShow();");
assert.equal(run('state.promises[0].status'),'broken');
assert.equal(run('openSins().map(x=>x.kind).join()'),'promise','A broken promise goes in His file');
run('advanceTest();snafuDefaults(state);');
assert.equal(run('weeklyBriefingPending()'),true,'A broken promise always brings a visit');
assert.equal(run('productionIssue().id'),'announcer');
assert.equal(run('judgmentSins()[0].kind'),'promise');
assert.equal(run('openSins().length'),0,'Judged sins leave the open file');
assert.match(run('lordVisitPages().map(p=>p.text||"").join(" ")'),/your word/);
assert.equal(run('lordVisitPages().some(p=>p.text==="SMITE!")'),true);
assert.equal(run('productionOptions().map(o=>o.key).join()'),'crew,safe,wild,blame');
assert.ok(run('showBlockingProblems().some(p=>p.text.includes("Good Lord Above"))'));
run('let briefingCalls=0;const originalBriefing=openWeeklyBriefing;openWeeklyBriefing=()=>briefingCalls++;runShow();startLiveShow();openWeeklyBriefing=originalBriefing;');
assert.equal(run('briefingCalls'),2,'The doors stay shut until you answer to Him');
assert.equal(run('state.liveShow'),null);
assert.equal(run("chooseBriefingProduction('invalid')"),false);
const originalCost=run('matchCost()'),cashBefore=run('state.cash');
assert.equal(run("chooseBriefingProduction('safe')"),true);
assert.equal(run("chooseBriefingProduction('wild')"),false);
assert.equal(run('matchCost()'),originalCost+run('fixCost()'));
assert.equal(run('state.cash'),cashBefore,'Making it right belongs in the show budget, not an immediate charge');
assert.equal(run('state.lord.favor'),52);
assert.equal(run('weeklyBriefingPending()'),false);
assert.match(run('lordAnswerPages("safe").map(p=>p.text||"").join(" ")'),/gesture/);
run('state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:"Sturgeon Bay Slam",state}))));');
assert.equal(run('weeklyBriefingPending()'),false,'An answer survives a reload');
assert.equal(run('state.production.sins.length'),1);
run('const briefingShow=simulateShow();');
assert.equal(run('briefingShow.cost'),originalCost+run('fixCost()'));
assert.equal(run('briefingShow.fallout.filter(entry=>entry.kind==="production").length'),1);
assert.match(run('briefingShow.fallout.find(entry=>entry.kind==="production").text'),/^An act of God/);
run('advanceTest();snafuDefaults(state);');
assert.equal(run('weeklyBriefingPending()'),false,'A clean week brings no visit');
// Taking it humbly pleases Him; a bit is settled on the night; blaming a wrestler goes in the file.
run("resetTest();state.started=true;state.week=5;addSin('promise',{actor:4},state);state.week=6;state.production={week:6,choice:null};snafuDefaults(state);");
assert.equal(run("chooseBriefingProduction('crew')"),true);
assert.equal(run('productionCost()'),0);
assert.equal(run('state.lord.favor'),56);
run("state.card=[promo(7),match(0,1),match(8,12),promo(10)];const productionLog=[];");
assert.equal(run('applyProductionDecision(0,[w(7)],productionLog)'),-1,'The announcer problem lands on the opener');
run("resetTest();state.started=true;state.week=1;addSin('promise',{actor:4});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);state.production.issueId='referee';chooseBriefingProduction('wild');state.card=[promo(7),match(0,1),match(8,12),promo(10)];productionLog.length=0;");
assert.equal(run('applyProductionDecision(0,[w(7)],productionLog)'),0,'The volunteer referee problem applies to the first match, not an opening promo');
assert.equal(run('applyProductionDecision(1,[w(0),w(1)],productionLog)'),2);
assert.equal(run('state.lord.favor'),53,'A bit that lands earns a slow clap');
assert.equal(run('applyProductionDecision(1,[w(0),w(1)],productionLog)'),2);
assert.equal(run('state.lord.favor'),53,'The bit is judged once');
run("state.week=7;state.production={week:7,judged:true,sins:[],issueId:'double-booking',choice:'wild'};state.card=[match(0,1),match(8,12),promo(10),promo(7)];");
assert.equal(run('applyProductionDecision(0,[w(0),w(1)],productionLog)'),0);
assert.equal(run('applyProductionDecision(3,[w(7)],productionLog)'),2,'A promo main event uses mic skills when handling the hall deadline');
run("resetTest();state.started=true;state.week=3;addSin('promise',{actor:2});state.week=4;state.production={week:4,choice:null};snafuDefaults(state);const blameTrust=w(2).trust;");
assert.equal(run('lordScapegoat()'),2,'The one you wronged is the easiest one to blame');
assert.equal(run("chooseBriefingProduction('blame')"),true);
assert.equal(run('w(2).trust'),run('blameTrust')-8);
assert.equal(run('state.lord.favor'),38);
assert.equal(run('lordTier().id'),'displeased');
assert.equal(run('openSins().map(x=>x.kind).join()'),'blame','Blaming a wrestler goes in His file');
assert.match(run('lordAnswerPages("blame").map(p=>p.text||"").join(" ")'),/In pen/);
assert.equal(run('lordAnswerPages("blame").some(p=>p.card?.title==="Displeased")'),true,'A change in His mood is shown');
run("state.card=card();const blameShow=simulateShow();");
assert.match(run('blameShow.fallout.find(entry=>entry.kind==="production").text'),/took the blame/);
run('advanceTest();snafuDefaults(state);');
assert.equal(run('weeklyBriefingPending()'),true,'A scapegoat brings Him straight back');
// Little sins add up, faster when He's displeased.
run("resetTest();state.started=true;state.card[0]=match(0,1,{finish:'Cheating'});state.card[1]=match(1,4,{finish:'Interference',interferer:17});simulateShow();advanceTest();snafuDefaults(state);");
assert.equal(run('openSins().length'),0,'Finishes are the drama of the show, Face or Heel');
assert.equal(run('state.ledger.entries.length'),0);
run("resetTest();state.started=true;state.lord.sins.push({id:9,week:1,kind:'cheat',actors:[0],judged:null});lordDefaults(state.lord);");
assert.equal(run('openSins().length'),0,'Old cheating sins are forgiven');
run("resetTest();state.started=true;addSin('gossip',{actor:0,target:34});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.equal(run('weeklyBriefingPending()'),false,'One little sin is not enough on its own');
run("addSin('gossip',{actor:2,target:31});state.week=3;state.production={week:3,choice:null};snafuDefaults(state);");
assert.equal(run('weeklyBriefingPending()'),true,'Little sins add up');
assert.equal(run('judgmentSins().length'),2);
assert.match(run('sinText(judgmentSins()[1])'),/heard/);
run("resetTest();state.started=true;state.lord.favor=10;addSin('gossip',{actor:0,target:34});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.equal(run('weeklyBriefingPending()'),true,'A Wrathful Lord lets nothing slide');
assert.equal(run('titheCost()'),run('fixCost()*2'),'He wants more in the plate when Wrathful');
assert.ok(run('lordAttendanceFactor()')<1);
run('state.lord.favor=85');assert.ok(run('lordAttendanceFactor()')>1);
run("resetTest();state.lord.favor=70;addSin('gossip',{actor:0,target:34});addSin('gossip',{actor:1,target:31});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.equal(run('productionIssue()'),null,'A Pleased Lord lets two little sins pile up');
assert.match(run('lordFileNote()'),/Little sins add up/);
// The Ledger: silent naughty/nice, era visits, and the final judgment.
run("resetTest();state.started=true;state.ledger.entries.push({week:1,era:0,key:'faceCheat',pts:-2});state.ledger.total=-2;ledgerDefaults(state);");
assert.equal(run('state.ledger.entries.length+state.ledger.total'),0,'Old cheating entries come off the books');
assert.equal(run('ledgerNote("faceCheat",{actor:0})'),null);
run("resetTest();state.started=true;state.card=[match(0,1),match(0,2),match(0,4),promo(10)];simulateShow();");
assert.equal(run('state.ledger.entries.filter(e=>e.key==="overworked").length'),1,'Working someone three times in a night reaches real life');
// Jesus drops hints at the punch bowl.
run("resetTest();state.started=true;state.week=5;for(let i=0;i<8;i++)ledgerNote('humble');");
assert.equal(run('ledgerLean()'),'nice');
assert.match(run('jesusHint().text'),/He|prayer|candle/);
assert.equal(run('jesusHint()'),null,'He does not repeat himself the same week');
run('state.week=6');assert.equal(run('jesusHint()'),null,'Or the next');
run("state.week=7;for(let i=0;i<20;i++){state.week=7;ledgerNote('blamed',{actor:2})}");
assert.equal(run('ledgerLean()'),'naughty');
assert.match(run('jesusHint().text'),/pray|pause|cracked/,'A turn in the ledger gets a new hint');
run("state.week=12;state.progression.offerWeek=12;");
assert.match(run('jesusHint().text'),/dropping by soon/,'He can tell when a visit is coming');
run("resetTest();state.started=true;state.week=5;state.card=card();simulateShow();finishLiveShow;");
assert.equal(run('typeof buildBackstage(state.history[0]).jesus'),'object');
run("resetTest();state.started=true;makePromise(10,'promo',1);simulateShow();");
assert.equal(run('state.ledger.entries.find(e=>e.key==="promiseKept").pts'),2);
assert.equal(run('ledgerNote("hardTruth",{actor:0})&&ledgerNote("hardTruth",{actor:0})&&ledgerNote("hardTruth",{actor:0})'),null,'Small habits are capped each week');
// Mid-era check-in: Era I runs two chapters, so He looks in at week 13.
run("resetTest();state.started=true;for(let wk=1;wk<=12;wk++){state.week=wk;ledgerNote('promiseKept',{actor:10})}state.week=13;state.production={week:13,choice:null};const cashBeforeGift=state.cash;snafuDefaults(state);");
assert.equal(run('state.ledger.visits.length'),1);
assert.equal(run('state.ledger.visits[0].verdict'),'nice');
assert.equal(run('state.ledger.visits[0].outcome.length'),1,'A Watching Lord gives one gift');
assert.equal(run('pendingLedgerVisit().kind'),'checkin');
assert.match(run('ledgerVisitPages(pendingLedgerVisit()).map(p=>p.text||"").join(" ")'),/GOOD BOY!.*good boy/);
assert.match(run('ledgerVisitPages(pendingLedgerVisit()).map(p=>p.text||"").join(" ")'),/kept your word to Sweeps/);
run('snafuDefaults(state);');
assert.equal(run('state.ledger.visits.length'),1,'One check-in per era');
run("resetTest();state.started=true;state.week=13;state.production={week:13,choice:null};snafuDefaults(state);");
assert.equal(run('state.ledger.visits[0].silent'),true,'A lukewarm check-in is no visit at all');
assert.equal(run('pendingLedgerVisit()'),null);
run("resetTest();state.started=true;state.lord.favor=30;for(let wk=1;wk<=12;wk++){state.week=wk;ledgerNote('promiseBroken',{actor:4})}state.week=13;state.production={week:13,choice:null};snafuDefaults(state);");
assert.equal(run('state.ledger.visits[0].verdict'),'naughty');
assert.equal(run('state.ledger.visits[0].outcome.length'),2,'A displeased Lord hands down two punishments');
assert.match(run('ledgerVisitPages(state.ledger.visits[0]).map(p=>p.text||"").join(" ")'),/NAUGHTY!/);
// Punishment and gift effects reach the weekly judgment.
run("resetTest();state.started=true;state.ledger.effects.forceSmite=true;state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.ok(run('productionIssue()'),'An unprompted act of God lands with a clean file');
assert.equal(run('state.ledger.effects.forceSmite'),undefined);
run("resetTest();state.started=true;addSin('promise',{actor:4});state.ledger.effects.grace=true;state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.equal(run('productionIssue()'),null,'Grace waives the next act of God');
assert.equal(run('state.lord.sins[0].judged'),'forgiven');
run("resetTest();state.started=true;state.ledger.effects.quality={value:1,shows:1};state.ledger.effects.crowd={factor:1.15,shows:2};");
assert.equal(run('ledgerSegmentBonus()'),1);assert.ok(run('attendanceModifier()')>1.1);
run('simulateShow();');
assert.equal(run('state.ledger.effects.quality'),undefined,'A blessed card lasts one show');
assert.equal(run('state.ledger.effects.crowd.shows'),1);
// Moving day reckoning reads the whole era and carries a quarter forward.
run("resetTest();state.started=true;for(let wk=1;wk<=24;wk++){state.week=wk;ledgerNote('humble')}state.week=25;const reck=ledgerReckoning(0);");
assert.equal(run('reck.verdict'),'nice');
assert.equal(run('reck.kind'),'reckoning');
assert.ok(run('state.ledger.carry')>0,'Some of the era follows you');
assert.equal(run('ledgerReckoning(0)'),null,'One reckoning per era');
// The end: claiming the legacy. The Pit is the bad ending, and the career goes on.
run("resetTest();state.started=true;state.week=200;for(let i=0;i<60;i++)ledgerNote('blamed',{actor:2});state.progression.stage=7;state.progression.offerWeek=200;acceptCareerOffer();");
assert.equal(run('state.progression.dynasty'),true);
assert.equal(run('state.ledger.final.verdict'),'naughty');
assert.equal(run('ledgerFinalPages(state.ledger.final).find(p=>p.type==="ending").title'),'The deepest pit of oblivion');
assert.equal(run('ledgerFinalPages(state.ledger.final).find(p=>p.type==="ending").tier'),'bad');
assert.equal(run('state.started'),true,'The Pit does not end the career');
assert.equal(run('pendingFinal().verdict'),'naughty');
run("resetTest();state.week=100;for(let i=0;i<60;i++)ledgerNote('humble');state.progression.stage=7;state.progression.offerWeek=100;acceptCareerOffer();");
assert.equal(run('ledgerFinalPages(state.ledger.final).find(p=>p.type==="ending").title'),'Ringside, forever');
run("resetTest();state.week=100;ledgerFinal();");
assert.equal(run('ledgerFinalPages(state.ledger.final).find(p=>p.type==="ending").title'),'Folding chairs, forever');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).ledger.final.verdict'),'lukewarm','The ledger survives a backup');
// Older saves keep their production calls; the smoke-break briefing is retired.
run('resetTest();state.started=true;state.week=4;state.production={week:4,choice:"safe"};state.weeklyBriefing={week:4,issueId:"dead-phone",request:{actor:10},requestChoice:null,completed:false};storyDefaults(state);');
assert.equal(run('productionIssue().id'),'dead-phone','Legacy production choices must preserve their original issue');
assert.equal(run('state.weeklyBriefing'),null,'The old briefing record is dropped');
assert.equal(run('weeklyBriefingPending()'),false);
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),weeklyBriefing:{week:4,completed:false}}}).production.issueId'),'dead-phone','Old backups with a briefing still load');
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),lord:{favor:500,sins:[]}}})'),'His favor stays in range');
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
 const reportMarkup=showReportPage();
`);
assert.equal(run('state.liveShow.answers[0]===savedAnswer'),true,'Completed decisions survive a live-show update');
assert.equal(run('state.liveShow.moments[1].choices.length'),3,'An undecided saved promo uses the new three choices');
assert.equal(run('state.liveShow.answers.length'),4,'A resumed show fills in every segment the booker was once asked to call');
assert.equal(run('state.liveShow.answers.slice(1).every(a=>a.auto&&a.tag)'),true,'The wrestlers make the remaining calls');
assert.doesNotMatch(run('reportMarkup'),/data-moment-choice/,'Show night has no booker choices');
assert.equal(run('(reportMarkup.match(/class="report-card/g)||[]).length'),2,'Segments so far are summarised');
assert.match(run('reportMarkup'),/calls out Rudy, from Football/);
run(`resetTest();state.card=[match(0,1),match(2,4),promo(10),promo(17)];(()=>{const real=render;render=()=>{};startLiveShow();render=real})();`);
assert.equal(run('state.liveShow.answers.length'),4,'Every segment is called when the bell goes');
assert.equal(run('state.liveShow.answers.every(a=>a.auto&&Number.isInteger(a.option))'),true);
assert.equal(run('showReportPage().includes("data-moment-choice")'),false);
for(let i=0;i<4;i++)assert.ok(run(`(()=>{const m=state.liveShow.moments[${i}],s=state.card[${i}],a=state.liveShow.answers[${i}];const t=reportSummary(m,s,a);return t.length>20&&t.length<420&&!/undefined|null/.test(t)})()`),'Segment '+i+' has a short summary');
run(`(()=>{const before=w(1).trust,answer={...state.liveShow.answers[0],effect:'humiliate'},fx=[];applyMomentEffect(answer,state.card[0],fx);globalThis.trustAfter=w(1).trust-before;globalThis.fxText=fx[0].text})()`);
assert.equal(run('trustAfter'),0,'A call the wrestlers made does not move trust with the booker');
run(`resetTest();state.card=[match(0,1)];globalThis.formOf=()=>{const m=matchMoment(state.card[0],0);return autoCall(m,state.card[0],0)};
 w(0).morale=90;w(1).morale=90;w(0).trust=85;state.rivalries[rivalryKey(0,1)]=50;globalThis.hot=formOf();
 w(0).morale=30;w(1).morale=30;w(0).trust=20;state.rivalries[rivalryKey(0,1)]=0;globalThis.cold=formOf();`);
assert.ok(run('hot.delta>=hot.baseDelta&&hot.form.some(n=>/extra mile/.test(n.text))&&hot.form.some(n=>/bad blood/.test(n.text))'),'Trust, morale and a feud lift the night');
assert.ok(run('cold.delta<=cold.baseDelta-1&&cold.form.some(n=>/flat/.test(n.text))&&cold.form.some(n=>/their way/.test(n.text))'),'Low morale and low trust drag it down');
assert.ok(run('hot.delta>cold.delta'));
assert.doesNotMatch(run('JSON.stringify([hot.form,cold.form])'),/trust|\\d/i,'Form notes never show trust or numbers');

assert.doesNotMatch(run('fxText'),/trust/i);
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
 {kind:'promo',a:2,target:null,scene:'Solo address',hook:'Win the crowd',concept:''}];startLiveShow();
 state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:'Sturgeon Bay Slam',state}))));
 nextMoment();for(let i=1;i<4;i++)nextMoment()`);
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
console.log('Passed: the Good Lord Above (file, thresholds, four answers, favor, scapegoats, legacy saves), the Ledger (finishes never count, overwork does, Jesus’ hints, caps, check-ins, reckonings, effects, the Pit as the bad ending), production costs/outcomes, calendar, migration, promises, live effects, interference, challenges, Sweeps routes, match formats/voices, season history and balance.');
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
// Tap-to-pick booking: fill order, reshaping, draft-until-legal and ranked reasons.
run('resetTest();state.card[1]={kind:null};state.drafts={}');
assert.equal(run(`pickNextSpace({kind:'match',format:'tag',sides:[[0,null],[null,null]]},0)`),1,'Tag teams fill a whole side before the opponents');
assert.equal(run(`pickNextSpace({kind:'match',format:'tag',sides:[[0,4],[null,null]]},1)`),2);
assert.equal(run(`pickReshape(pickNormalize({kind:'match',format:'four',sides:[[0],[1],[2],[4]]}),'singles').dropped`),2,'Shrinking the shape sends extras back');
assert.deepEqual(JSON.parse(run(`JSON.stringify(pickReshape(pickNormalize({kind:'match',format:'singles',sides:[[0],[1]]}),'tag').d.sides)`)),[[0,null],[1,null]]);
run(`pickStage(1,pickNormalize({kind:'match',format:'singles',sides:[[5],[null]]}))`);
assert.equal(run('state.card[1].kind'),null,'A half-built segment stays a draft');
assert.equal(run('state.drafts[1].sides[0][0]'),5);
run(`(()=>{const d=pickWorking(1);pickSet(d,1,6);d.winner=5;pickStage(1,d)})()`);
assert.equal(run('state.card[1].kind'),'match','A legal segment commits to the card');
assert.equal(run('Object.hasOwn(state.drafts,1)'),false);
run(`(()=>{const d=pickWorking(1);pickSet(d,0,null);pickStage(1,d)})()`);
assert.equal(run('state.card[1].kind'),null,'Sending someone back frees them instead of keeping the old booking reserved');
assert.equal(run('playedWrestlerIds().has(5)'),false);
run(`resetTest();state.drafts={};state.promises.push({id:'p',actor:6,target:null,kind:'win',due:state.week,status:'open'});state.card[1]={kind:null}`);
assert.ok(run(`pickHand(1,pickWorking(1),0,'best').needs.some(x=>x.r.id===6&&x.tab.text.startsWith('Promised a clean win'))`),'Promises lead the Needs you tonight group');
assert.ok(run(`pickHand(1,pickWorking(1),0,'best').fits.every(x=>!x.used)`),'Booked wrestlers never crowd the best fits');
assert.ok(run(`pickHand(1,pickWorking(1),0,'all').plain.some(x=>x.used&&x.r.id===0)`),'Booked wrestlers stay visible, dimmed, in the full list');
run(`state.rivalries[rivalryKey(6,8)]=30`);
assert.equal(run(`pickReasons(pickNormalize({kind:'match',format:'singles',sides:[[6],[null]]}),1,w(8),new Set()).tab.text`),'Rivals');
assert.equal(run(`(()=>{const d=pickNormalize({kind:'match',format:'singles',sides:[[champion().id],[1]],title:true,winner:1});pickSet(d,0,6);return pickTidy(d).includes('title')&&!d.title})()`),true,'Removing the champion clears the title');
assert.match(run(`posterBooking(1)`),/Tap to book it/);


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

run("resetTest();state.started=true;state.week=1;addSin('promise',{actor:4});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);");
assert.match(run('weeklyBriefingCard()'),/Answer to Him/);
assert.match(run('lordPanel()'),/His file on you/);
assert.equal(run('nextBookingTask([]).lord'),true,'The booking desk points you to Him');
run("chooseBriefingProduction('crew')");
assert.match(run('weeklyBriefingCard()'),/Replay/);
assert.doesNotMatch(run('decisionsPage()'),/venue owner|SMOKE BREAK/i,'The venue email and smoke break are gone');
console.log('Passed: His notice on the booking desk and the Decisions page.');

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
run('resetTest();state.progression.stage=2;state.week=1;addSin("promise",{actor:4});state.week=2;state.production={week:2,choice:null};snafuDefaults(state)');
assert.equal(run('productionIssue().id.startsWith("c-")'),true,'The Circuit draws from its own problem pool');
assert.equal(run('fixCost()'),1300,'Fixes scale with the chapter');
assert.match(run('productionOptions().find(o=>o.key==="safe").hint'),/\$1,300/);
assert.equal(run('/\\$40\\b/.test(issueText(PRODUCTION_ISSUES[0]))'),false,'Old fixed prices follow the chapter rate');
assert.equal(run('issueText(productionIssue()).includes("{cost}")'),false);
run('chooseBriefingProduction("safe")');
assert.equal(run('productionCost()'),1300,'A paid fix costs the chapter rate');
run('resetTest();state.progression.stage=2;state.week=1;addSin("promise",{actor:4});state.week=2;state.rise.crew=["ring","venue"];state.production={week:2,choice:null};snafuDefaults(state)');
assert.equal(run('state.production.choice'),'safe','A crew member handles their department automatically');
assert.equal(run('productionCost()'),0);
assert.equal(run('crewCost()'),run('crewSalary(CREW[0])+crewSalary(CREW[1])'),'Crew salaries scale with the chapter');assert.ok(run('crewCost()')<run('fixCost()'),'Crew costs less than one fix per show');
assert.equal(run('weeklyBriefingPending()'),false,'A handled act of God needs no answer');
assert.match(run('crewHandledPages().map(p=>p.text).join(" ")'),/allow it/);
run('resetTest();state.progression.stage=5;state.week=2;addSin("promise",{actor:4});state.week=3;state.rise.crew=["ring","venue","production"];state.production={week:3,choice:null};snafuDefaults(state)');
assert.equal(run('productionIssue().dept'),'talent');
assert.equal(run('state.production.choice'),null,'Talent problems always reach the booker');
run('resetTest()');
assert.equal(run('toggleCrew("ring")'),false,'There is no crew to hire in the Gym Years');
assert.equal(run('new Set(allProductionIssues().map(issue=>issue.id)).size'),run('allProductionIssues().length'),'Problem ids are unique');
run('resetTest();state.progression.stage=3;state.week=1;addSin("promise",{actor:4});state.week=2;state.production={week:2,choice:null};snafuDefaults(state);state.card=defaultCard().map((_,i)=>match(i*2,i*2+1))');
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

// Relationship layer: Week Ahead evenings, hidden affection, Sweeps' route, the title Ask and save migration.
run('resetTest();state.started=true;');
assert.equal(run('state.relations.version'),2,'New careers start with relationship state');
assert.equal(run('state.preferences.easyMode'),false,'Reply effects are hidden by default');
assert.deepEqual(JSON.parse(run('JSON.stringify(FEATURED_IDS.slice().sort((a,b)=>a-b))')),[0,1,10,18,20,31,34,37],'The eight Era I featured routes');
const legacy=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/legacy-career.json'),'utf8'));
run(`state=mergeRosterExpansion(validateCareer(${JSON.stringify(legacy)}))`);
assert.equal(run('state.relations.routes["10"].memories.length'),0,'Older careers migrate with an empty Sweeps route');
assert.equal(run('state.preferences.easyMode'),false);
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).relations.version'),2,'Migrated careers export and re-import');
// Tells replace numbers for featured wrestlers only.
run('resetTest();state.started=true;');
assert.doesNotMatch(run('trustReadout(w(10))'),/\d/,'Featured affection is never shown as a number');
assert.match(run('trustReadout(w(2))'),/Trust 60\/100/,'Supporting cast keep the visible trust value');
assert.match(run('trustReadout(w(10))'),/nods when you come in/);
run('w(10).trust=40');assert.equal(run('trustReadout(w(10))'),run('FEATURED_ROUTES[10].tells.wary'));
run('w(10).trust=90');assert.match(run('trustReadout(w(10))'),/office every morning/);
run("w(10).trust=60;state.week=4;addSin('promise',{actor:10});state.week=5;state.production={week:5,choice:null};snafuDefaults(state);");
assert.equal(run('productionChips("crew").some(c=>c.stat==="favor")'),false,'His favor stays unspoken by default');
run('state.preferences.easyMode=true');
assert.equal(run('productionChips("crew").some(c=>c.stat==="favor")'),true,'Easy mode shows what an answer does to His favor');
run('state.preferences.easyMode=false');
// Week one: Sweeps is in his spotlight month, so the week ahead belongs to the others.
run('resetTest();state.started=true;ensureWeeklyBriefing();');
assert.equal(run('ensureWeekAhead().invites.length'),4,'Four people to choose from across two free nights');
assert.equal(run('ensureWeekAhead().nights.length'),2,'Two free nights a week');
assert.equal(run('ensureWeekAhead().nights.every(day=>nightInvites(day).length===2)'),true,'Each free night offers a choice of two');
assert.equal(run('ensureWeekAhead().invites.every(i=>ensureWeekAhead().nights.includes(i.day))'),true,'Everyone asks for one of your free nights');
// An untouched week planned before free nights is re-planned as free nights; one already started keeps its days.
run('{const wk=relations().week;delete wk.nights;wk.invites=wk.invites.slice(0,3).map((i,n)=>({...i,day:["Monday","Tuesday","Wednesday"][n]}))}');
assert.equal(run('ensureWeekAhead().nights.length===2&&ensureWeekAhead().nights.every(day=>nightInvites(day).length===2)'),true,'An untouched old-style week becomes two free nights with a choice each');
run('{const wk=relations().week;delete wk.nights;wk.answers={x:1}}');
assert.equal(run('Array.isArray(ensureWeekAhead().nights)'),false,'A week already under way keeps its old days');
run('{const wk=relations().week;wk.answers={};}');
run('relations().week=null');
// Drift and the off-stage cap (7.90): only evenings take a featured wrestler the last stretch, and neglect wears off.
run('w(0).trust=64;offstageTrust(w(0),8)');assert.equal(run('w(0).trust'),run('OFFSTAGE_CAP'),'Off-stage trust stops at the cap');
run('w(0).trust=72;offstageTrust(w(0),8)');assert.equal(run('w(0).trust'),72,'Off-stage trust never pulls someone down to the cap');
run('offstageTrust(w(0),-12)');assert.equal(run('w(0).trust'),60,'Off-stage losses always land');
run('const nf=state.roster.find(r=>!isFeatured(r.id));nf.trust=64;offstageTrust(nf,8)');assert.equal(run('state.roster.find(r=>!isFeatured(r.id)).trust'),72,'Supporting wrestlers are not capped');
run('w(0).trust=76;relations().lastEvening[0]=state.week-1;relationshipDrift()');assert.equal(run('w(0).trust'),76,'Seen last week: no drift');
run('relations().lastEvening[0]=state.week-2;relationshipDrift()');assert.equal(run('w(0).trust'),76-run('DRIFT'),'Two weeks without an evening: trust drifts');
run('w(0).trust=62;relationshipDrift()');assert.equal(run('w(0).trust'),60,'Drift stops where they started');
run('w(0).trust=90;routeState(0).ending="best";relationshipDrift()');assert.equal(run('w(0).trust'),90,'A finished route does not drift');
run('routeState(0).ending=null;w(0).trust=60;relations().lastEvening[0]=state.week');
assert.equal(run('ensureWeekAhead().invites.some(i=>i.actor===10)'),false,'Sweeps’ route waits for the spotlight month to end');
assert.equal(run('ensureWeekAhead().invites.every(i=>i.actor!==34||i.day==="Sunday")'),true,'Liam only answers on Sundays');
assert.equal(run('ensureWeekAhead()===ensureWeekAhead()'),true,'The week ahead is generated once per week');
run('const relInvite1=ensureWeekAhead().invites[0],relActor1=relInvite1.actor,relBefore=w(relActor1).trust,relBest=sceneFor(relInvite1).replies.findIndex(r=>r.style===FEATURED_ROUTES[relActor1].style);');
assert.equal(run('answerScene(relInvite1.id,relBest)'),true);
assert.equal(run('w(relActor1).trust-relBefore'),6,'Playing along in their style warms them fastest');
assert.equal(run('answerScene(relInvite1.id,relBest)'),false,'One evening per invitation');
assert.equal(run('eveningsLeft()'),1);
run('const relPassed=ensureWeekAhead().invites.find(i=>i.day===relInvite1.day&&i!==relInvite1);');
assert.equal(run('answerScene(relPassed.id,0)'),false,'One visit a night: the other choice that night is passed over');
assert.match(run('weekAheadPanel()'),/You went to see/);
run('const relInvite2=ensureWeekAhead().invites.find(i=>i.day!==relInvite1.day),relBefore2=w(relInvite2.actor).trust,relBreaker=sceneFor(relInvite2).replies.findIndex(r=>r.breaks);');
assert.equal(run('answerScene(relInvite2.id,relBreaker)'),true);
assert.equal(run('w(relInvite2.actor).trust-relBefore2'),-6,'Breaking a wrestler’s world costs the most');
assert.equal(run('state.relations.sore[relInvite2.actor]'),run('state.week'),'They remember the slight');
assert.ok(run('soreLine(relInvite2.actor).length')>0);
assert.equal(run('answerScene(ensureWeekAhead().invites.find(i=>!ensureWeekAhead().answers[i.id]).id,0)'),false,'No evenings left');
assert.equal(run('playStyle()'),run('FEATURED_ROUTES[relActor1].style'),'Choices build a play-along reputation');
assert.match(run('weekAheadPanel()'),/Your nights are spoken for/);
run('state.week=2;');
assert.notEqual(run('ensureWeekAhead().week'),1,'A new week brings new invitations');
assert.equal(run('ensureWeekAhead().spent.length'),0);
// Sweeps' full route after the spotlight month.
run('resetTest();state.started=true;state.arc.start=1;state.week=5;state.production={week:5,choice:null};ensureWeeklyBriefing();');
assert.equal(run('sweepsBeat()'),'after-hours');
run('var sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('sweepsInvite.beat'),'after-hours','Sweeps texts first once his month is over');
assert.equal(run('answerScene(sweepsInvite.id,0)'),true);
assert.equal(run('w(10).trust'),66);
assert.equal(run('sweepsRoute().beats.afterHours'),5);
run('state.week=6;state.production={week:6,choice:null};state.weeklyBriefing=null;ensureWeeklyBriefing();sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('sweepsInvite.beat'),'path');
assert.equal(run('answerScene(sweepsInvite.id,0)'),true);
assert.equal(run('state.promises.some(p=>p.actor===10&&p.kind==="appearance"&&p.due===6&&p.status==="open")'),true,'The route pays off on the booking sheet');
assert.match(run('promiseLedger()'),/Sweeps McKenzie/);
assert.match(run('promiseLedger()'),/Tonight/);
// The flag event only appears when conditions line up, and is gone if missed.
run('state.week=7;state.weeklyBriefing=null;w(10).trust=72;w(10).lastSeen=6;ensureWeeklyBriefing();');
assert.equal(run('ensureWeekAhead().invites.find(i=>i.actor===10)?.beat'),'stain');
assert.match(run('weekAheadPanel()'),/Only this week/);
run('state.week=8;state.weeklyBriefing=null;ensureWeeklyBriefing();ensureWeekAhead();');
assert.equal(run('sweepsRoute().flags.stain'),'missed','Miss the window and the scene is gone');
assert.notEqual(run('sweepsBeat()'),'stain');
assert.match(run('windowCard(w(10))'),/passed you by/);
// Attend it on another career: a polaroid and a promo beat next week.
run('resetTest();state.started=true;state.arc.start=1;state.week=7;sweepsRoute().beats={afterHours:5,path:6};w(10).trust=72;w(10).lastSeen=6;ensureWeeklyBriefing();sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('answerScene(sweepsInvite.id,0)'),true);
assert.equal(run('sweepsRoute().memories[0].id'),'stain');
assert.equal(run('state.plans[8]'),'Sweeps faces the Unsweepable Stain');
assert.equal(run('state.promises.some(p=>p.actor===10&&p.kind==="promo"&&p.due===8)'),true);
assert.match(run('windowCard(w(10))'),/Main event/,'All memories print the Main Event banner');
assert.doesNotMatch(run('windowCard(w(10))'),/Believer/,'Outside easy mode the window card makes you read them');
run('state.preferences.easyMode=true');
assert.match(run('windowCard(w(10))'),/Believer/,'In easy mode a warm wrestler shows what they warm to');
run('state.preferences.easyMode=false');
// The Ask: a title match on a floor swept for 24 hours.
run('state.week=9;state.weeklyBriefing=null;w(10).trust=80;ensureWeeklyBriefing();sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('sweepsInvite.beat'),'ask');
assert.equal(run('answerScene(sweepsInvite.id,0)'),true);
assert.equal(run('sweepsRoute().ask.status'),'accepted');
assert.equal(run('sweepsRoute().ask.due'),12);
assert.equal(run('state.promises.find(p=>p.id===sweepsRoute().ask.promiseId).kind'),'title');
assert.equal(run('bookingStoryActions().find(a=>a.button==="Book title match").draft.title'),true,'The Ask lands on the booking sheet as a title match');
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).promises.some(p=>p.kind==="title")'),true,'Title promises survive a backup');
run('state.week=12;state.weeklyBriefing=null;ensureWeeklyBriefing();sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('sweepsInvite.beat'),'vigil');
assert.equal(run('sweepsInvite.day'),'Friday');
assert.equal(run('answerScene(sweepsInvite.id,0)'),true);
run('const champId=champion().id;state.card=[match(10,champId,{title:true,winner:10}),match(2,4),promo(20),promo(17)];');
assert.equal(run('promiseMet(state.promises.find(p=>p.kind==="title"))'),true);
run('const endingFallout=[];finishStoryWeek(endingFallout);');
assert.equal(run('sweepsRoute().ending'),'best','Kept the Ask and stood the vigil');
assert.match(run('endingFallout.map(e=>e.text).join(" ")'),/Twenty-four hours/);
assert.match(run('windowCard(w(10))'),/Cleanest Title Match/);
assert.equal(run('sweepsBeat()'),null,'A finished route sends no more invitations');
// Declining the Ask sets a bad ending.
run('resetTest();state.arc.start=1;state.week=9;sweepsRoute().beats={afterHours:5,path:6};sweepsRoute().flags.stain="missed";w(10).trust=80;ensureWeeklyBriefing();sweepsInvite=ensureWeekAhead().invites.find(i=>i.actor===10);');
assert.equal(run('answerScene(sweepsInvite.id,2)'),true);
assert.equal(run('sweepsRoute().ending'),'bad');
assert.equal(run('w(10).trust'),70);
// Saves and kayfabe guards.
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),relations:{...structuredClone(state.relations),style:{believer:"lots"}}}})'));
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),relations:{...structuredClone(state.relations),week:{week:9,invites:[{actor:99,id:"x",beat:"visit-0"}],spent:[],answers:{}}}}})'));
assert.doesNotMatch(run('JSON.stringify([FEATURED_ROUTES[34],ROUTE_STORIES[34]||null])'),/wet|urine|stain|piss|accident/i,'Liam’s visual gag never leaks into his route');
const wrestlerLines=run('JSON.stringify([...Object.values(FEATURED_ROUTES).flatMap(r=>[r.sore,r.jealous,...Object.values(r.signoff),...Object.values(r.reacts||{}),...Object.values(r.epilogue||{}).map(e=>e.line),...(r.scenes||[]).flatMap(s=>[s.line,...s.replies.map(x=>x.reaction)])]),...Object.values(ROUTE_STORIES).flatMap(story=>[...Object.values(story.beats||{}).flatMap(s=>[s.line,...(s.replies||[]).map(x=>x.reaction)]),...Object.values(story.endings||{}).map(e=>e.line)])].filter(Boolean))');
assert.doesNotMatch(wrestlerLines,/costume|performer|real name|not really a/i,'Wrestlers never break character in their own lines');
assert.match(run('FEATURED_ROUTES[37].sore'),/I am a dog/,'The Dog insists he is a dog');
// Reading the room: moods, repetition, reputation, hard truths, cases, sides and visible costs.
run('var roomSave=structuredClone(state.relations),roomTrust=[w(0).trust,w(34).trust,w(0).morale],roomPromises=structuredClone(state.promises);relations().style={believer:0,straight:0,hype:0,bureaucrat:0};relations().said={};relations().results=null;');
assert.equal(run('replyDelta(0,{style:"hype"})'),6,'A calm week: Greek warms to hype');
run('relations().results={week:state.week-1,won:[],lost:[0]}');
assert.equal(run('wantStyle(0)'),'believer','After a loss Greek needs a believer');
assert.equal(run('replyDelta(0,{style:"believer"})'),6);
assert.equal(run('replyDelta(0,{style:"hype"})'),2,'His usual note misses the week after a loss');
assert.ok(run('sceneOpening({actor:0,id:"x",beat:"visit-0",day:"Tuesday"}).map(p=>p.text).join(" ")').includes(run('FEATURED_ROUTES[0].moods.low.tell')),'The mood shows as a tell');
run('relations().results=null;relations().said[0]=["hype","hype"]');
assert.equal(run('replyDelta(0,{style:"hype"})'),3,'The same note three times running wears thin');
assert.match(run('JSON.stringify(replyChips(0,{style:"hype"}))'),/Heard it before/);
run('relations().said={};relations().style.bureaucrat=5');
assert.equal(run('replyDelta(0,{style:"hype"})'),4,'Greek distrusts a Bureaucrat reputation');
run('relations().style.bureaucrat=0');
assert.equal(run('replyDelta(0,{truth:true})'),-2,'A hard truth costs a little trust');
assert.equal(run('replyMorale(0,{truth:true})'),4,'…and steadies them');
assert.equal(run('replyDelta(0,{breaks:true,cases:[{when:{lostLastShow:true},delta:5}]})'),-6,'Cases only apply when their week holds');
run('relations().results={week:state.week-1,won:[],lost:[0]}');
assert.equal(run('replyDelta(0,{breaks:true,cases:[{when:{lostLastShow:true},delta:5}]})'),5,'A case can make the blunt answer right');
run('relations().results=null');
assert.match(run('replyCost(null,{promise:"promo"})'),/Promises time on the microphone, this week/,'A reply shows what it commits the sheet to');
// Sides: what you say to Greek about Liam gets back to Liam.
run(`state.relations.week=null;relations().visits[0]=0;var sideInvite=ensureWeekAhead().invites.find(i=>i.actor===0)||(()=>{const i={actor:0,id:"side-test",beat:"visit-0",day:"Tuesday"};ensureWeekAhead().invites.push(i);return i})();
 var sideFor=sceneFor;sceneFor=i=>i.id===sideInvite.id?{...sideFor(i),replies:[{style:'hype',text:'Liam is beneath you.',reaction:'He nods.',sides:{34:-4}}]}:sideFor(i);w(34).trust=50;relations().jealous={};`);
assert.equal(run('answerScene(sideInvite.id,0)'),true);
assert.ok(run('w(34).trust')<=46,'The other wrestler’s trust moves (plus any grudge jealousy)');
assert.equal(run('relations().jealous[34].heard'),true,'…and they hear about it');
assert.match(run('jealousLine(34)'),/got back to|Greek/);
assert.match(run('sceneOutcome(sideInvite).map(p=>p.text).join(" ")'),/get back to Liam/);
run('sceneFor=sideFor;');
assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),relations:{...structuredClone(state.relations),said:{0:[3]}}}})'),'Bad repetition history is rejected');
const roomLines=run('JSON.stringify(Object.values(FEATURED_ROUTES).flatMap(r=>[...Object.values(r.moods||{}).map(m=>m.tell),r.stale,r.heard]).concat(Object.values(ROUTE_STORIES).flatMap(st=>Object.values(st.beats).flatMap(b=>b.replies.flatMap(x=>(x.cases||[]).map(c=>c.reaction))))).concat(Object.values(FEATURED_ROUTES).flatMap(r=>(r.scenes||[]).flatMap(sc=>sc.replies.flatMap(x=>(x.cases||[]).map(c=>c.reaction))))).filter(Boolean))');
assert.doesNotMatch(roomLines,/costume|performer|real name|not really a/i,'Mood tells and new lines stay in kayfabe');
assert.doesNotMatch(run('JSON.stringify(FEATURED_ROUTES[34])'),/wet|urine|stain|piss|accident/i);
run('state.relations=roomSave;[w(0).trust,w(34).trust,w(0).morale]=roomTrust;state.promises=roomPromises;');
console.log('Passed: Week Ahead evenings, hidden affection tells, play-along reputation, Sweeps route with flag event, Ask, vigil and endings, promise ledger, easy mode and relationship save migration.');

// Generic route engine: any complete story in ROUTE_STORIES plays; unfinished ones are skipped.
assert.equal(run('Object.entries(ROUTE_STORIES).every(([id,story])=>storyComplete(story))'),true,'Every story in routes.js is complete (Ask with accept and decline, all three endings)');
assert.equal(run('Object.values(SWEEPS_BEATS).every(b=>b.cue&&BEAT_KINDS.includes(beatKind(b)))'),true,'Sweeps’ trigger ladder lives in routes.js as data');
run(`resetTest();state.started=true;
 var savedStory0=ROUTE_STORIES[0],savedStory1=ROUTE_STORIES[1];
 const r3=(extra={})=>[{style:'hype',text:'a',reaction:'He nods. “Yes.”',...extra},{style:'straight',text:'b',reaction:'Fine.'},{breaks:true,text:'c',reaction:'No.'}];
 ROUTE_STORIES[0]={beats:{
  'first-light':{when:{},cue:'test',line:'One.',replies:r3()},
  omen:{when:{minTrust:60},cue:'test',line:'Two.',replies:r3({promise:'promo'}),plan:'The omen is read aloud'},
  roof:{kind:'flag',when:{minTrust:60,lostLastShow:true},memory:'roof',line:'Roof.',replies:r3()},
  ask:{kind:'ask',when:{minTrust:65},askPromise:{kind:'promo',due:'event',plan:'A tragedy in three acts'},line:'Ask.',replies:[{style:'hype',ask:'accept',text:'Yes',reaction:'“Sing!”'},{style:'straight',ask:'defer',delta:-2,text:'Later',reaction:'Hm.'},{ask:'decline',delta:-10,text:'No',reaction:'Silence.'}]},
  chorus:{kind:'final',when:{},line:'Final.',replies:r3()}},
  memories:[{id:'roof',title:'On the roof',caption:'Week {week}'}],
  endings:{best:{title:'Best',line:'Sung.'},neutral:{title:'Neutral',line:'Hummed.'},bad:{title:'Bad',line:'Silent.'}}};
 ROUTE_STORIES[1]={beats:{half:{line:'Unfinished.',replies:r3()}}};
 state.arc.start=1;state.week=5;state.production={week:5,choice:null};ensureWeeklyBriefing();`);
assert.equal(run('routeBeat(0)'),null,'A route opens only after a drop-in evening');
assert.equal(run('routeBeat(1)'),null,'An unfinished story is skipped');
assert.equal(run('routeStatus(1).key'),'drop-in');
run('relations().visits[0]=1');
assert.equal(run('routeBeat(0)'),'first-light');
run('state.relations.week=null;var gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);');
assert.equal(run('gInvite?.beat'),'first-light','Open route beats are invited like Sweeps’');
assert.equal(run('ensureWeekAhead().invites.filter(i=>!i.beat.startsWith("visit-")).length<=ROUTE_INVITES'),true,'Route scenes leave room for a drop-in');
run('const gBefore=w(34).trust;ensureWeekAhead().invites=ensureWeekAhead().invites.filter(i=>i.actor!==34&&i.actor!==31).concat([{id:"5-34",actor:34,beat:"visit-0",day:"Monday"}]);answerScene(gInvite.id,0);');
assert.equal(run('routeState(0).beats.firstLight'),5,'Beat ids store camel-cased like Sweeps’ afterHours');
assert.equal(run('w(34).trust'),58,'Warming Greek up makes his grudge rival jealous');
assert.ok(run('jealousLine(34)').length>0);
assert.match(run('webPanel()'),/jealous this week/);
assert.equal(run('relations().jealous[34].soft'),undefined,'Passing over an invited rival is full jealousy');
assert.equal(run('relations().jealous[31].soft'),true,'A rival with no invitation this week gets the soft tell');
assert.match(run('jealousLine(31)'),/heard you were out with/);
assert.equal(run('Object.keys(FEATURED_ROUTES).every(id=>WEB_BONDS.some(b=>(b.a==id&&b.b!=null)||(b.b==id&&["grudge","irritation"].includes(b.bond))))'),true,'Every featured wrestler can get jealous');
// The flag waits for a loss and does not block the ladder.
run('state.week=6;state.weeklyBriefing=null;w(0).trust=66;');
assert.equal(run('routeBeat(0)'),'omen');
run('routeState(0).beats.omen=6;relations().results={week:6,won:[],lost:[0]};state.week=7;');
assert.equal(run('routeBeat(0)'),'roof','The flag appears the week after a loss');
run('relations().results={week:6,won:[0],lost:[]};');
assert.equal(run('routeBeat(0)'),'ask','A flag that isn’t due never blocks the Ask');
run('relations().results={week:6,won:[],lost:[0]};state.relations.week=null;gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);');
assert.equal(run('gInvite.beat'),'roof');
assert.equal(run('answerScene(gInvite.id,0)'),true);
assert.equal(run('routeState(0).memories[0].id'),'roof','A flag scene pins its polaroid');
assert.equal(run('ensureWeekAhead().answers[gInvite.id].memory'),'roof');
assert.ok(run('sceneOutcome(gInvite).some(p=>p.type==="memory")'),'The cutscene drops the polaroid in');
assert.match(run('windowCard(w(0))'),/Main event/);
// The Ask, with its own promise kind and story beat.
run('state.week=9;state.relations.week=null;gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);');
assert.equal(run('gInvite.beat'),'ask');
assert.match(run('weekAheadPanel()'),/Wants to ask you something/);
assert.equal(run('answerScene(gInvite.id,0)'),true);
assert.equal(run('routeState(0).ask.due'),12);
assert.equal(run('state.promises.find(p=>p.id===routeState(0).ask.promiseId).kind'),'promo','askPromise sets the promise kind');
assert.equal(run('state.plans[12]'),'A tragedy in three acts','The Ask pencils its story beat');
assert.match(run('ensureWeekAhead().answers[gInvite.id].payoff'),/Greek at .* · due week 12/);
const askScript=JSON.parse(run('JSON.stringify(sceneOutcome(gInvite).map(p=>p.type))'));
assert.deepEqual(askScript.slice(0,2),['shout','you'],'Replies open with your shout, then your line');
assert.ok(askScript.includes('stamp'),'The booking-sheet stamp lands in the cutscene');
assert.equal(run('routeStatus(0).key'),'promised');
run('state.week=12;state.relations.week=null;gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);');
assert.equal(run('gInvite.beat'),'chorus','The final beat plays in the week the Ask is due');
run('answerScene(gInvite.id,0);state.card=[match(1,2),match(3,4),promo(0),promo(17)];const gFallout=[];finishStoryWeek(gFallout);');
assert.equal(run('routeState(0).ending'),'best');
assert.match(run('gFallout.map(e=>e.text).join(" ")'),/Sung\./);
assert.doesNotMatch(run('gFallout.map(e=>e.text).join(" ")'),/Trust [+−]\d/,'Featured fallout never prints trust numbers');
assert.equal(run('relations().results.won.includes(1)'),true,'Results are recorded for next week’s conditions');
// A capped accept can never be the best ending.
run(`ROUTE_STORIES[0].beats.ask.replies[0].cap='neutral';routeState(0).ending=null;routeState(0).ask=null;state.week=13;state.relations.week=null;gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);answerScene(gInvite.id,0);
 state.week=16;state.relations.week=null;gInvite=ensureWeekAhead().invites.find(i=>i.actor===0);answerScene(gInvite.id,0);state.card=[match(1,2),match(3,4),promo(0),promo(17)];finishStoryWeek([]);`);
assert.equal(run('routeState(0).ending'),'neutral','cap:"neutral" holds the ending to neutral');
// Era epilogues: finished routes keep their ending, everyone else is read from affection.
run('routeState(10).ending="best";routeState(10).endedWeek=12;w(37).trust=30;var eraEntry=relationshipEraEnd(0);');
assert.equal(run('eraEntry.cards.length'),8);
assert.equal(run('eraEntry.cards.find(c=>c.id===10).tier'),'best');
assert.equal(run('eraEntry.cards.find(c=>c.id===37).tier'),'bad','A wary wrestler without a finished route gets the bad card');
assert.equal(run('eraEntry.cards.find(c=>c.id===18).tier'),'neutral');
assert.equal(run('relationshipEraEnd(0)===eraEntry'),true,'Each era is recorded once');
assert.equal(run('pendingEpilogue(0)===eraEntry'),true);
assert.equal(run('epilogueScript(eraEntry).filter(p=>p.type==="ending").length'),8,'Every featured wrestler gets an ending card');
assert.match(run('JSON.stringify(epilogueScript(eraEntry))'),/Cleanest Title Match/);
assert.equal(run('validateCareer({game:"Sturgeon Bay Slam",state:structuredClone(state)}).relations.epilogues.length'),1,'Epilogues survive a backup');
assert.match(run('epiloguePanel()'),/Replay/);
assert.match(run('lockerPage()'),/The featured eight/);
assert.match(run('weekAheadStrip()'),/Town map/);
// The town map: every week opens on whichever town the show is in.
{
 const html=run('lockerPage()');
 assert.match(html,/class="town-map"/,'The Town tab opens on the map');
 assert.ok(html.includes(`>${run('showLocation().town')}, WI</h1>`),'The map is the town this week’s show is in');
 assert.equal((html.match(/data-town-pin=/g)||[]).length,run('FEATURED_IDS.filter(id=>w(id)).length'),'Every featured wrestler has a pin');
 assert.equal((html.match(/class="map-pin[^"]*is-busy/g)||[]).length,run('FEATURED_IDS.filter(id=>w(id)&&!ensureWeekAhead().invites.some(i=>i.actor===id)).length'),'Only invitations are full pins');
 assert.match(html,/free nights?|Nights spoken for/,'The map shows the free nights left before show night');
 assert.equal((html.match(/data-town-night=/g)||[]).length,run('ensureWeekAhead().nights.length')*2,'Each free night is on the ribbon and a tab');
 assert.match(html,/night is free\. Who do you go see\?/,'The sheet opens on a free night and its choices');
 assert.doesNotMatch(html,/\d+ trust|trust \+|costume|performer/i,'The map shows no trust numbers and stays in kayfabe');
 for(const town of run('Object.keys(TOWN_MAPS)')){
  const spots=run(`townSpots(${JSON.stringify(town)})`);
  const pts=Object.values(spots);
  assert.equal(pts.length,run('FEATURED_IDS.length'),`${town}: one spot per featured wrestler`);
  assert.equal(new Set(pts.map(p=>p.join())).size,pts.length,`${town}: no two pins share a spot`);
  assert.ok(pts.every(([x,y])=>x>=20&&x<=380&&y>=30&&y<=340),`${town}: pins stay on the map`);
 }
 assert.ok(run('WISCONSIN_TOUR.every(e=>TOWN_MAPS[e.town])'),'Every tour town has a map');
 for(const town of run('Object.keys(TOWN_MAPS).filter(t=>t!=="Sturgeon Bay")')){
  assert.ok(run(`FEATURED_IDS.every(id=>TOWN_MAPS[${JSON.stringify(town)}].haunts?.[id])`),`${town}: every featured wrestler has a place of their own`);
  const places=run(`FEATURED_IDS.map(id=>townPlace(${JSON.stringify(town)},id))`);
  assert.equal(new Set(places).size,places.length,`${town}: no two wrestlers share a place`);
 }
 assert.ok(run('Object.values(TOWN_MAPS).every(m=>m.shops?.length>=6)'),'Every town has local businesses on the map');
 for(const shop of ['Bertum’s Print Shop','Bev’s Discount Folding Chairs','Filbuster’s Toy Depot','Crandle and Crindles','The Pound','Mitzie’s Particle Accelerators','Shop and Shop'])assert.ok(run(`TOWN_MAPS["Sturgeon Bay"].shops.some(s=>s[0]===${JSON.stringify(shop)})`),`Sturgeon Bay has ${shop}`);
 assert.match(run('townMapSvg("Sturgeon Bay","x")'),/PRINT SHOP|Print Shop/,'Shop labels are drawn');
 assert.notEqual(run('townPlace("New Glarus",31)'),run('townPlace("Sturgeon Bay",31)'),'Places change from town to town');
 assert.match(run('state.week=4;delete state.relations.week;townMapPanel()'),/town-world/,'The map sits in a draggable world');
 const week=run('state.week');run('state.week=4;delete state.relations.week');
 assert.match(run('townMapPanel()'),/Sister Bay, WI/,'Tour weeks show the tour town');
 run('state.week=5;delete state.relations.week');
 assert.match(run('townMapPanel()'),/Sturgeon Bay, WI/,'Home weeks show Sturgeon Bay');
 run(`state.week=${week};delete state.relations.week`);
 assert.equal(run("(()=>{const s=nextWeek.toString();return /view='locker'/.test(s)})()"),true,'After the results, the next week starts on the map');
}
run('ROUTE_STORIES[0]=savedStory0;ROUTE_STORIES[1]=savedStory1;if(!savedStory0)delete ROUTE_STORIES[0];if(!savedStory1)delete ROUTE_STORIES[1];');
// Fallout wording: featured wrestlers react; everyone else keeps numbers.
run(`resetTest();state.started=true;makePromise(10,'promo',1);makePromise(2,'promo',1);state.card=[match(0,1),match(3,4),promo(10),promo(2)];var pf=[];finishStoryWeek(pf);`);
assert.doesNotMatch(run('pf.filter(e=>e.participants.includes(10)).map(e=>e.text).join(" ")'),/Trust/,'A featured kept promise shows a reaction');
assert.match(run('pf.filter(e=>e.participants.includes(2)).map(e=>e.text).join(" ")'),/Trust \+8/,'Others keep the number');
assert.doesNotMatch(run('rosterPage().split(\'data-wrestler="10"\')[1].split(\'data-wrestler="11"\')[0]'),/Trust \d/,'Roster cards hide featured trust');
assert.match(run('trustShort(w(10))'),/Locker Room/);
assert.match(run('trustShort(w(2))'),/Trust \d+\/100/);
// Cutscene reactions split narration from the quoted line.
assert.deepEqual(JSON.parse(run('JSON.stringify(splitReaction("He clasps your arm. “Then the song has begun.”").map(p=>p.type))')),['narration','line']);
// A 7.57 save keeps Sweeps' progress and gains a route record for everyone.
const save757=JSON.parse(run('JSON.stringify({game:"Sturgeon Bay Slam",state:{...structuredClone(state),relations:{version:1,style:{believer:3,straight:0,hype:1,bureaucrat:0},routes:{"10":{beats:{afterHours:5,path:6},flags:{stain:"seen"},memories:[{id:"stain",week:7}],ask:{status:"accepted",week:9,due:12,promiseId:null,vigil:true},ending:null}},sore:{},visits:{0:1},lastInvited:{},week:null}}})'));
run(`state=mergeRosterExpansion(validateCareer(${JSON.stringify(save757)}))`);
assert.equal(run('state.relations.version'),2);
assert.equal(run('Object.keys(state.relations.routes).length'),8,'Every featured wrestler has a route record');
assert.equal(run('routeState(10).ask.final'),true,'The vigil carries over as the final beat');
assert.equal(run('"vigil" in routeState(10).ask'),false);
assert.equal(run('routeState(10).memories[0].id'),'stain');
assert.equal(run('routeState(10).beats.path'),6);
assert.deepEqual(JSON.parse(run('JSON.stringify(state.relations.epilogues)')),[]);
console.log('Passed: generic route engine (opens, ladder, flags, Ask, final, caps), unfinished stories skipped, jealousy, era epilogues, cutscene scripts, featured fallout wording and 7.57 save migration.');

// The opening cutscene
{
 const pages=run('[...openingScript(),...openingAfter(0),...openingAfter(1,true)]');
 assert.ok(pages.some(p=>p.type==='choice'&&p.replies.length===2),'The opening asks you to explain or apologize');
 assert.ok(run('openingAfter(0).some(p=>p.text==="SILENCE!")'),'Explaining yourself gets cut off');
 const words=JSON.stringify(pages);
 assert.doesNotMatch(words,/costume|performer|real name|not really a|gimmick/i,'The opening never breaks kayfabe');
 const welcome=run('JSON.stringify(openingWelcome())');
 // Josh's one exception to the portrait-only rule: Greek's insult in Jesus' welcome. Nothing else.
 assert.equal((welcome.match(/wet|urine|stain|piss|accident/gi)||[]).length,1,'Liam’s gag appears exactly once in the welcome: Greek’s insult');
 for(const pair of ['Greek & Liam','Greek & Ron','2 Holds & the Dog','Sweeps & the Grinch'])assert.ok(welcome.includes(pair),'The welcome introduces '+pair);
 assert.ok(pages.every(p=>p.text==null||p.text.split(/\s+/).length<=45),'Opening lines stay phone-sized');
 run('resetTest()');const cash=run('state.cash');
 run('openingChoose(0,true)');assert.equal(run('state.cash'),cash,'Explaining yourself earns nothing');
 run('openingChoose(1,false)');assert.equal(run('state.cash'),cash,'Replaying the opening never pays out');
 run('openingChoose(1,true)');assert.equal(run('state.cash'),cash+run('OPENING_MERCY'),'Apologizing on a new career adds a small mercy to starting cash');
 run('resetTest()');
}
// The first-week tour that follows the opening
{
 const steps=run('tutorialSteps()'),tabs=run('promotionNav.map(([v])=>v)');
 assert.ok(steps.length>=4&&steps.length<=7,'The tour stays short');
 assert.ok(steps.every(s=>tabs.includes(s.view)&&tabs.includes(s.nav)&&s.target&&s.title&&s.text),'Every tour stop names a real tab and a spotlight');
 assert.equal(steps.filter(s=>s.last).length,1,'The tour ends exactly once');assert.ok(steps.at(-1).last,'The last stop sends you to book');
 assert.doesNotMatch(JSON.stringify(steps),/costume|performer|real name|not really a|gimmick|trust \+|\d+ trust/i,'The tour never breaks kayfabe or shows trust numbers');
 assert.ok(steps.every(s=>s.text.split(/\s+/).length<=35),'Tour lines stay phone-sized');
}
// After the show: the overview and the backstage walk (7.72)
{
 run(`resetTest();state.card=[match(34,0),match(1,37),promo(10)];(()=>{const real=render;render=()=>{};startLiveShow();finishLiveShow();render=real})();`);
 assert.equal(run('state.liveShow'),null,'Opening the doors goes straight to the overview');
 assert.equal(run('state.recap.report.length'),3,'Show-night summaries are kept for the full report');
 const walk=run('JSON.parse(JSON.stringify(state.recap.backstage))');
 assert.ok(walk.approaches.length>=2&&walk.approaches.length<=4,'Only wrestlers with something to say come over, four at most');
 assert.equal(walk.approaches[0].id,0,'Greek lost to his rival, so he finds you first');
 assert.equal(walk.approaches[0].kind,'lost');
 assert.ok(walk.approaches[1].id===34&&walk.approaches[1].cutIn&&walk.approaches[1].other===0,'Liam cuts in on Greek');
 assert.equal(walk.approaches.filter(a=>a.cutIn).length,1,'One cut-in per walk');
 const overview=run('recapPage()');
 assert.match(overview,/id="post-walk"/);assert.match(overview,/post-grade grade-[ABCD]/);assert.match(overview,/id="post-report"/);
 assert.doesNotMatch(overview,/\d+ trust|trust \+|costume|performer/i,'The overview shows no trust numbers and stays in kayfabe');
 const pages=run('JSON.parse(JSON.stringify(backstageOpening(0).map(p=>({...p,costFor:undefined,chipsFor:undefined}))))');
 assert.equal(pages[0].type,'title');assert.equal(pages.at(-1).type,'choice');
 assert.doesNotMatch(JSON.stringify(pages),/\{name\}|\{speaker\}|\{promise\}|undefined/,'Placeholders are filled');
 const trust=run('w(0).trust');
 assert.equal(run('answerBackstage(0,0)'),true);assert.ok(run('w(0).trust')>trust,'Belief after a loss is what Greek needs');
 assert.equal(run('answerBackstage(0,0)'),false,'A reply only lands once');
 assert.equal(run('answerBackstage(1,1)'),true);
 assert.ok(run('state.promises.some(p=>p.actor===34&&p.kind==="rematch"&&p.target===0&&p.due===state.week+1&&p.status==="open")'),'A rematch promise lands on next week’s sheet');
 assert.ok(run('backstageOutcome(1).some(p=>p.type==="stamp")'),'The promise shows as a booking-sheet stamp');
 run('relations().sore[0]=state.week;globalThis.soreWalk=buildBackstage(state.recap)');
 assert.ok(run('soreWalk.skipped.some(a=>a.id===0)&&!soreWalk.approaches.some(a=>a.id===0)'),'A sore wrestler walks past instead');
 run('state.recap.backstage=soreWalk');assert.ok(run('backstageEnding(state.recap).some(p=>/without stopping/.test(p.text))'));
 assert.match(run('postView="report";globalThis.full=recapPage();postView="overview";full'),/id="post-back"/,'The full report is one tap away, with a way back');
 // The Tooth and Tessa have no spines yet, so a card of just them is still a quiet night.
 run(`resetTest();state.card=[match(35,36),match(36,35)];(()=>{const real=render;render=()=>{};startLiveShow();finishLiveShow();render=real})();`);
 assert.equal(run('state.recap.backstage.approaches.length'),0);
 assert.match(run('recapPage()'),/quiet night[\s\S]*id="next-week"/i,'A quiet night goes straight home');
 // Dialogue shape and kayfabe
 const moments=run(`JSON.parse(JSON.stringify([...Object.entries(BACKSTAGE_GENERIC).filter(([k])=>k!=='skip').map(([,m])=>m),...FEATURED_IDS.flatMap(id=>Object.entries(FEATURED_ROUTES[id].backstage||{}).filter(([k])=>k!=='skip').map(([,m])=>m))]))`);
 assert.ok(moments.every(m=>m.tell&&m.line&&m.replies.length>=2&&m.replies.some(r=>!r.promise)&&m.replies.every(r=>r.text&&r.reaction)),'Every backstage moment has a tell, a line and a free reply');
 assert.ok(run(`FEATURED_IDS.every(id=>Object.keys(FEATURED_ROUTES[id].backstage||{}).every(k=>['won','lost','stole','flat','kept','broken','benched','idle','cutIn','skip'].includes(k)))`),'Backstage kinds are ones the walk can choose');
 assert.doesNotMatch(run('JSON.stringify([BACKSTAGE_GENERIC,FEATURED_IDS.map(id=>FEATURED_ROUTES[id].backstage||null)])'),/costume|performer|real name|not really a|gimmick/i,'Backstage lines stay in kayfabe');
 run('resetTest()');
}
console.log('Passed: after-show overview, backstage walk (who comes over, cut-ins, sore walk-pasts, replies and promises), full report and kayfabe.');
// The wider roster in the walk (7.77): roster.js, cheating finishes, Katy's long promos, habits and bonds
{
 const show=card=>run(`resetTest();state.card=${card};(()=>{const real=render;render=()=>{};startLiveShow();finishLiveShow();render=real})();JSON.parse(JSON.stringify(state.recap.backstage))`);
 // Supporting wrestlers share the four slots
 let walk=show('[match(2,9),match(12,13),promo(6)]');
 assert.ok(walk.approaches.length===4&&true,'Four come over');
 assert.ok(walk.approaches.some(a=>[2,9,12,13].includes(a.id)),'Supporting wrestlers come over after the show');
 for(let i=0;i<walk.approaches.length;i++){const pages=run(`JSON.parse(JSON.stringify(backstageOpening(${i}).map(p=>({...p,costFor:undefined,chipsFor:undefined,replies:p.replies?.map(r=>r.text)}))))`);assert.doesNotMatch(JSON.stringify(pages),/\{name\}|\{speaker\}|\{promise\}|\{week\}|\{grade\}|undefined/,'Supporting placeholders are filled')}
 assert.ok(run('Object.keys(relations().walked).length>0'),'The walk remembers who came over, for the catch-up nudge');
 run('resetTest();relations().walked={2:1,9:1};state=mergeRosterExpansion(validateCareer(JSON.parse(JSON.stringify({game:"Sturgeon Bay Slam",state}))))');
 assert.equal(run('relations().walked[9]'),1,'Walk history survives a backup round trip');
 assert.throws(()=>run('validateCareer({game:"Sturgeon Bay Slam",state:{...structuredClone(state),relations:{...structuredClone(state.relations),walked:{2:"x"}}}})'),'Walk history must be weeks');
 // Cheating: Rudy Giuliani only takes it personally when the winner cheated
 walk=show('[match(9,5,{finish:"Cheating"}),match(35,36)]');
 assert.equal(run('state.recap.results[0].cheated'),true,'A cheating finish is recorded on the match result');
 assert.ok(run('relations().results.cheatLosses.includes(5)&&relations().results.cheatWins.includes(9)'));
 assert.equal(walk.approaches.find(a=>a.id===5)?.kind,'lostToCheat','Beaten by a cheat, Giuliani comes over furious');
 assert.equal(walk.approaches[0].id,5,'A cheated loss outweighs an ordinary loss');
 walk=show('[match(9,5),match(35,36)]');
 assert.equal(walk.approaches.find(a=>a.id===5)?.kind,'lost','A clean loss gets the technicality speech instead');
 assert.equal(run('state.recap.results[0].cheated'),undefined);
 walk=show('[match(5,9,{finish:"Interference",interferer:36}),match(35,36)]');
 const gi=walk.approaches.findIndex(a=>a.id===5);
 assert.match(run(`backstageOutcome;answerBackstage(${gi},0);backstageOutcome(${gi}).map(p=>p.text).join(' ')`),/referee saw nothing/,'His own cheating win reads as good sportsmanship');
 // Katy's promos count double
 run('resetTest();state.promises=[]');
 assert.match(run('backstageCost({id:13,other:null},{promise:"promo"})'),/counts double/,'The cost shows on the reply button');
 run('makePromise(13,"promo",state.week+1)');
 assert.equal(run('promisesOwed(state.week+1)'),2,'Katy’s promo counts as two toward what the show owes');
 assert.match(run('promiseLedger()'),/counts double/,'And on the promise ledger');
 assert.match(run('backstageCost({id:12,other:null},{promise:"promo"})'),/already owes 2/,'Another promise that week sees Katy’s two');
 assert.equal(run('promiseWeight({actor:10,kind:"promo"})'),1);
 // Jaxxon leaks, Rudy never walks past, Towel holds a grudge
 run('resetTest();state.recap={week:state.week,results:[],rating:60}');
 assert.equal(run('JSON.stringify(backstageSides({id:19,other:0},{style:"hype"}))'),'{"0":-1}','What you tell Jaxxon gets around');
 assert.equal(run('JSON.stringify(backstageSides({id:19,other:0},{truth:true}))'),'{}','A hard truth stays between you');
 walk=show('[match(9,2),match(35,36)]');
 run('relations().sore[2]=state.week;relations().sore[9]=state.week;globalThis.soreWalk=buildBackstage(state.recap)');
 assert.ok(run('soreWalk.approaches.some(a=>a.id===2)&&soreWalk.skipped.every(a=>a.id!==2)'),'Rudy from Football never walks past, sore or not');
 assert.ok(run('soreWalk.skipped.some(a=>a.id===9)'));
 run('resetTest();state.recap={week:state.week,results:[],rating:60};relations().results=null');
 const warm=run('backstageDelta({id:4,kind:"won"},{style:"straight"})');
 run('state.promises.push({id:`${state.week-2}-4-0`,actor:4,kind:"appearance",due:state.week-1,status:"broken",resolved:state.week-1})');
 assert.ok(run('backstageDelta({id:4,kind:"won"},{style:"straight"})')<warm,'A broken promise slows Terrible Towel’s warming');
 run('state.week+=4;state.recap={week:state.week,results:[],rating:60};state.card=[match(35,36),match(36,35)];globalThis.towel=buildBackstage(state.recap)');
 assert.ok(run('towel.approaches.some(a=>a.id===4&&a.kind==="remembers")'),'Weeks later, Towel brings it up, calmly');
 assert.match(run('fillBackstage(backstageMoment(towel.approaches.find(a=>a.id===4)).line,towel.approaches.find(a=>a.id===4))'),/week \d+/,'He names the week');
 // Heat moods: Towel and David Guetta read the room
 run('state.recap={week:state.week,results:[],rating:30};relations().results={week:state.week,won:[4],lost:[]}');
 assert.equal(run('backstageWant({id:4})'),'bureaucrat','A cold room is what moves Towel, not a win');
 // Bonds
 assert.equal(run('rivalBond(12,31)'),true,'John Smith and Ron correct each other');
 assert.equal(run('!!bondBetween(20,23)'),false,'The Grinch’s crush stays dormant in Era I');
 assert.equal(run('state.progression.stage=2;const crush=bondBetween(20,23)?.bond;state.progression.stage=0;crush'),'crush');
 run('state.recap={week:state.week,results:[],backstage:{approaches:[{id:31,kind:"won",cutIn:true,other:12,on:true},{id:0,kind:"benched",other:26,on:false}]}}');
 assert.match(run('backstageOpening(0).find(p=>p.type==="line").text'),/John Smith has corrected the correction/);
 assert.match(run('backstageOpening(1).find(p=>p.type==="line").text'),/Smark.*Greco Wrestling/);
 assert.equal(run('backstageOpening(1).find(p=>p.type==="choice").replies[0].promise'),'appearance','Rival-specific wording preserves the booking choice');
 assert.equal(run('rivalBond(25,4)'),false,'David and Towel stay dormant until Era II');
 assert.equal(run('state.progression.stage=2;const live=rivalBond(25,4);state.progression.stage=0;live'),true);
 assert.ok(run('rivalsOf(9).includes(37)&&!rivalsOf(37).includes(9)'),'Mandy minds the Dog working; the Dog doesn’t notice');
 walk=show('[match(37,1),match(35,36)]');
 assert.ok(walk.approaches.some(a=>a.id===9&&a.kind==='benched'&&a.other===37),'Mandy waits it out in the lot while the Dog works');
 assert.equal(run('webPanel().includes("Two correctors")'),true,'New bonds show in Who feels what');
 // Show-night habits
 run('resetTest();state.card=[match(12,35),match(35,36)];globalThis.mm=matchMoment(state.card[0],0)');
 assert.ok(['Character chaos','Tell the story','Team identity'].includes(run('mm.choices[wrestlerCall(mm,state.card[0])].tag')),'John Smith goes for the risky street finish');
 run('state.stories[rivalryKey(6,9)]={participants:[6,9],heat:20,phase:"build",lastWeek:state.week,lastBeat:""}');
 assert.ok(run('callForm(promo(6,9)).notes.some(n=>/doctorate/.test(n.text))'),'Pissboy stalls against a doubter');
 assert.ok(!run('callForm(promo(6,11)).notes.some(n=>/doctorate/.test(n.text))'));
 // Dialogue shape, kinds and kayfabe
 const ids=run('SUPPORTING_IDS');
 assert.equal(ids.length,28,'Every spine except the Tooth and Tessa has a supporting route');
 assert.ok(ids.every(id=>!run(`isFeatured(${id})`)),'Supporting routes never overlap the featured eight');
 const sm=run(`JSON.parse(JSON.stringify(SUPPORTING_IDS.flatMap(id=>Object.entries(SUPPORTING_ROUTES[id].backstage).filter(([k])=>k!=='skip').map(([,m])=>m))))`);
 assert.ok(sm.every(m=>m.tell&&m.line&&m.replies.length>=2&&m.replies.some(r=>!r.promise)&&m.replies.every(r=>r.text&&r.reaction)),'Every supporting moment has a tell, a line and a free reply');
 assert.ok(run(`SUPPORTING_IDS.every(id=>{const r=SUPPORTING_ROUTES[id];return r.speaker&&PLAY_STYLES[r.style]&&PLAY_STYLES[r.distrusts]&&r.moods.low.tell&&r.moods.high.style===r.style&&r.stale&&r.heard.includes('{name}')&&['won','lost','flat','idle','skip'].every(k=>r.backstage[k])&&Object.keys(r.backstage).every(k=>BACKSTAGE_KINDS.includes(k))})`),'Every supporting route has its style row, mood tells, stale, heard and the core five moments');
 assert.doesNotMatch(run('JSON.stringify(SUPPORTING_ROUTES)'),/costume|performer|real name|not really a|gimmick/i,'The wider roster stays in kayfabe (Smark included)');
 assert.doesNotMatch(run('JSON.stringify(SUPPORTING_ROUTES)'),/Liam|Neesen/i,'Nobody else touches Liam’s gag');
 run('resetTest()');
}
console.log('Passed: wider roster in the walk (supporting routes, catch-up history, cheated finishes and Giuliani, Katy’s double promos, Jaxxon’s leaks, Rudy and Towel rules, heat moods, era-gated bonds, show-night habits, kayfabe).');
// Core Eight bios: old factory text in a save moves to the new bios; a player's own edits stay (7.79)
{
 run('resetTest();w(0).gimmick="Mythological matinee idol";w(10).desc="Sweeps the hall before bell time. Plans to sweep the championship scene after it.";w(31).desc="My own note about Ron.";w(20).gimmick="Holiday menace turned hopeless romantic";state=mergeRosterExpansion(JSON.parse(JSON.stringify(state)))');
 assert.equal(run('w(0).gimmick'),run('initialRoster[0].gimmick'),'A factory tagline in a save updates');
 assert.match(run('w(10).desc'),/Cannot walk past a mess/,'A factory bio in a save updates');
 assert.equal(run('w(31).desc'),'My own note about Ron.','A player-written bio is never overwritten');
 assert.match(run('w(20).gimmick+w(20).desc'),/three sizes too big[\s\S]*never once noticed/,'The Grinch’s canon entry carries the new bio');
 assert.doesNotMatch(run('JSON.stringify([0,1,10,18,20,31,34,37].map(id=>[initialRoster[id].gimmick,initialRoster[id].desc]))'),/flip phone|matinee|hopeless romantic|Refuses to reveal|costume|performer|wet|urine|stain|piss|accident/i,'Core Eight bios match the spines and stay in kayfabe');
 run('resetTest()');
}
console.log('Passed: Core Eight bios match the spines, with save migration that keeps player edits.');

// The sweep changes active dialogue without invalidating careers booked with older names.
run(`resetTest();state.card[0]=match(3,2,{type:'One-on-One Manifesto'});
 state.drafts[1]=match(28,4,{type:'Best-in-Show Bout'});
 const sweepBackup=structuredClone(state);
 sweepBackup.roster.find(r=>r.id===3).gimmick='Aggressively singular';
 sweepBackup.roster.find(r=>r.id===4).desc='My own Towel biography';
 state=mergeRosterExpansion(validateCareer({game:'Sturgeon Bay Slam',state:sweepBackup}));`);
assert.equal(run('state.card[0].type'),'Entire Stable Challenge');
assert.equal(run('state.drafts[1].type'),'Most Fetching Face-Off');
assert.equal(run('w(3).gimmick'),'A whole stable in one corner');
assert.equal(run('w(4).desc'),'My own Towel biography');
assert.equal(run('signatureFor(match(2,4,{type:"One-on-One Manifesto"}))'),undefined);
run('resetTest();state.card[0]=match(3,5,{format:"tag",sides:[[3,7],[5,8]]});');
assert.match(run('matchMoment(state.card[0],0).choices.find(c=>c.tag==="Teamwork").outcome'),/waves away the offered tag/);
run('simulateShow()');
assert.ok(!run('state.milestones.oneMan'),'A tag booking does not award One Man’s solo milestone');
run('resetTest();state.card[0]=match(3,5);simulateShow()');
assert.ok(run('state.milestones.oneMan'),'One Man credits the stable on a solo win');
assert.match(run('beatStory(finishBeats(match(0,1),{tag:""}).beats)'),/Hold Number One to Hold Number Two.*Hold Number One/);
run('resetTest();state.stories[rivalryKey(6,9)]={participants:[6,9],heat:20,phase:"build",lastWeek:state.week,lastBeat:""}');
assert.ok(run('promoMoment(promo(6,9,{scene:"Face-off"}),0).choices.every(c=>c.sceneTitle==="Decline the address")'));
console.log('Passed: spine sweep, legacy signature names, solo-stable milestone, two-hold sequence and the Doctor’s refusal.');
