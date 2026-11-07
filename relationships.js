'use strict';
// Relationship layer · vertical slice.
// Affection is the existing per-wrestler trust value, never shown as a number for featured wrestlers.
// Everything stays in kayfabe: replies that respect a wrestler's world warm them up; breaking it is the worst move.

const PLAY_STYLES={believer:'Believer',straight:'Straight Man',hype:'Hype Man',bureaucrat:'Bureaucrat'};
// Open design question: 2 or 3 free evenings per week. One constant so the answer is a one-line change.
const EVENING_SLOTS=2;
const INVITES_PER_WEEK=EVENING_SLOTS+1;
const WEEK_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'];
const AFFECTION_TIERS=['wary','friendly','warm','devoted'];

const FEATURED_ROUTES={
 0:{speaker:'Greek',style:'hype',place:'Mount Olympus (the St. Elbow’s boiler room)',
  tells:{wary:'He refers to you only as “the mortal,” and only in the third person.',friendly:'He receives you briefly, between labors.',warm:'He has started naming you in his monologues.',devoted:'He names you in every monologue now, usually as “the Bard.”'},
  invite:{wary:'Olympus has not summoned you. The boiler room door is propped open anyway.',friendly:'Olympus receives petitioners until nine.',warm:'The gods convene tonight. Bring your lyre. (Bring snacks.)'},
  signoff:{wary:'Go now, mortal.',friendly:'Sing of this.',warm:'Until the next verse, Bard.',devoted:'Thy name is in the song, Bard.'},
  sore:'The Bard once called my epic “a bit much.” The gods wrote it down.',
  scenes:[
   {line:'The boiler hisses its approval. I have bested eleven challengers. The twelfth labor approaches. Who will sing of it?',replies:[
    {style:'hype',text:'You will. On the mic this week, and I’ll hold the spotlight myself.',promise:'promo',reaction:'He clasps your forearm like a fellow hero. “Then the song has begun.”'},
    {style:'straight',text:'Who’s the twelfth challenger?',reaction:'“The gods have not yet cast them.” He seems a little put out that you asked for details.'},
    {breaks:true,text:'Greek, it’s a boiler room.',reaction:'The boiler sighs. Greek does not. “Olympus does not hear you, mortal.”'}]},
   {line:'An omen! The pipes rattled thrice during my training. Interpret it, booker.',replies:[
    {style:'hype',text:'Three rattles. A three-count. The gods want the title defended in STYLE.',reaction:'“YES.” He chalks it on the boiler in letters a foot tall.'},
    {style:'believer',text:'Then we listen. What do the pipes want?',reaction:'He listens for a long time. “They want a bigger entrance.”'},
    {breaks:true,text:'That’s just the heat kicking on.',reaction:'He turns to face the wall, where the gods are more reasonable.'}]}
  ]},
 1:{speaker:'2 Holds',style:'straight',place:'The training barn',
  tells:{wary:'He keeps the HOLD TWO briefcase chained to his wrist and his back to you.',friendly:'He demonstrates Hold Number One. Again.',warm:'He lets you carry the locked HOLD TWO briefcase.',devoted:'He lets you carry the briefcase and no longer checks that it is still locked.'},
  invite:{wary:'The barn light is on. He has not invited you.',friendly:'Practicing Hold One tonight. You may observe.',warm:'Barn. Seven. Hold One. Bring water.'},
  signoff:{wary:'That was Hold One. Leave.',friendly:'Hold One. Always Hold One.',warm:'Tell no one about the briefcase.',devoted:'Someday you will see Hold Two. Not today.'},
  sore:'You asked what Hold Two is. People who ask do not see it.',
  scenes:[
   {line:'Hour three of Hold One. Observe the grip. Do you see it?',replies:[
    {style:'straight',text:'I see it. Same as hour one. Excellent consistency.',reaction:'“Consistency.” He nods for a full minute. This is a very good sign.'},
    {style:'hype',text:'THAT IS THE GREATEST HOLD IN WISCONSIN!',reaction:'He winces. “It is the greatest hold in Wisconsin. We do not shout about it.”'},
    {breaks:true,text:'So what’s Hold Two?',reaction:'He snaps the briefcase shut, though it was already shut.'}]},
   {line:'A man at the hardware store asked me to demonstrate Hold One. I declined. Was I correct to decline?',replies:[
    {style:'straight',text:'Correct. Hold One is for the ring. You’re on the card this week.',promise:'appearance',reaction:'He shakes your hand using a grip that is not Hold One. You can tell.'},
    {style:'bureaucrat',text:'Did he fill out a demonstration request form?',reaction:'“There is a form?” He seems interested, then deeply suspicious.'},
    {breaks:true,text:'Honestly, it’s just a headlock.',reaction:'He stares at you until the barn light flickers off on its timer.'}]}
  ]},
 10:{speaker:'Sweeps',style:'believer',place:'St. Elbow’s, after hours',
  tells:{wary:'He sweeps around you, the way you’d sweep around a puddle.',friendly:'He nods when you come in and keeps sweeping.',warm:'He sweeps a path for you when you walk in.',devoted:'He sweeps a path to your office every morning, whether or not you’re coming in.'},
  invite:{wary:'The lights are on at St. Elbow’s. He didn’t say anything.',friendly:'Sweeping St. Elbow’s tonight if you want to talk.',warm:'Hall’s quiet. Floor’s not clean yet. Come keep me company?'},
  signoff:{wary:'Mind the dustpan.',friendly:'Keep it clean, boss.',warm:'Floor’s clean. So’s my conscience. Night, boss.',devoted:'The championship and the floor are both in good hands, boss. Yours and mine.'},
  sore:'You told me it was just a floor. Floors remember, boss. So do I.'},
 18:{speaker:'Charming',style:'bureaucrat',place:'Afternoon tea at Maddox Hatter’s table',
  tells:{wary:'His thank-you notes are brief, and only slightly threatening.',friendly:'He pours your tea first and asks after your family by name.',warm:'His thank-you notes are getting longer and more politely threatening.',devoted:'His latest thank-you note runs four pages and ends, “I would hate for anything to happen to you.”'},
  invite:{wary:'Maddox has set a place for you. Charming has not.',friendly:'Tea is at four, should you care to be civilised.',warm:'Dearest booker, tea at four? I have a little secret to share. Do come. — C.F.'},
  signoff:{wary:'Do mind the stairs. They’re ever so steep.',friendly:'Thank you ever so much for coming.',warm:'Give my best to everyone you love. Every one.',devoted:'You are my very favourite person to threaten, darling.'},
  sore:'You once called my manners “a bit fake.” I have written you a thank-you note about it. You will find it.',
  scenes:[
   {line:'Milk? Sugar? A secret? I happen to know which wrestler has been sleeping in the ring after shows.',replies:[
    {style:'bureaucrat',text:'Put it in writing, signed and dated. I’ll file it.',reaction:'“Signed and dated.” He is delighted. “A man of paperwork and menace.”'},
    {style:'hype',text:'Ooh. Tell me EVERYTHING.',reaction:'He tells you nothing, beautifully, for twenty minutes.'},
    {breaks:true,text:'You’re not actually this polite, are you?',reaction:'“I beg your pardon?” he says, with frightening sincerity.'}]},
   {line:'I’d adore a small say in this week’s card. Nothing grand. Simply who opens, who closes, and who suffers.',replies:[
    {style:'bureaucrat',text:'Submit a formal proposal. I’ll consider putting you in one match.',promise:'appearance',reaction:'He produces the proposal at once. It is laminated.'},
    {style:'straight',text:'No.',reaction:'“Splendid. A booker who says no.” He makes a note in a very small book.'},
    {breaks:true,text:'You’re a wrestler. Wrestlers don’t book.',reaction:'He sets down his cup without a sound. Maddox Hatter stops pouring.'}]}
  ]},
 20:{speaker:'The Grinch',style:'hype',place:'Anywhere decorated: tonight, the Moose Lodge craft room',
  tells:{wary:'He leaves love notes in everyone’s turnbuckles but yours.',friendly:'He waves with both hands from across the hall.',warm:'He leaves love notes in your turnbuckles too.',devoted:'Your turnbuckles are full of love notes. He has started on your car.'},
  invite:{wary:'You can hear tinsel from the craft room. Nobody texted you.',friendly:'Decorating the craft room at 7! Everyone welcome! Even you!',warm:'WREATH EMERGENCY. Craft room. Bring glue. Bring your heart.'},
  signoff:{wary:'Happy… whatever.',friendly:'Spread the love, booker!',warm:'I stole your heart a little, didn’t I? I’m keeping it.',devoted:'Your heart’s in the lockbox now, right next to mine.'},
  sore:'You said love was “just a gimmick.” I put that note in the shredder. Gently.',
  scenes:[
   {line:'I need a GRAND GESTURE in the ring this week. Streamers? A choir? A lockbox full of hearts? ALL THREE?',replies:[
    {style:'hype',text:'All three. Take the mic and make the whole hall fall in love.',promise:'promo',reaction:'He spins you around twice. “THIS is why I stole your heart.”'},
    {style:'believer',text:'Do whatever your heart says.',reaction:'He listens to his heart very carefully. “It says ALL THREE.”'},
    {breaks:true,text:'Maybe tone down the romance stuff.',reaction:'A single paper heart falls from his sleeve. He does not pick it up.'}]},
   {line:'Lemon Tart walked past me today and said “ugh.” Do you think that means she loves me?',replies:[
    {style:'hype',text:'“Ugh” is one letter off “hug.” That’s practically a proposal!',reaction:'He gasps so hard the craft room glitter lifts off the table.'},
    {style:'straight',text:'I think it means ugh.',reaction:'He nods bravely. “Ugh is a start.”'},
    {breaks:true,text:'She’s a heel. It’s part of her act.',reaction:'“Her act?” He looks at you as if you had stolen Christmas. He would know.'}]}
  ]},
 31:{speaker:'Ron',style:'bureaucrat',place:'Room B, Sturgeon Bay Public Library (booked for one neutral hour)',
  tells:{wary:'He has filed a formal statement of no comment regarding you.',friendly:'He acknowledges your existence, on the record.',warm:'He files non-binding statements of mild approval about you.',devoted:'He has abstained, in writing, from criticizing you. Twice.'},
  invite:{wary:'A public notice is pinned to the library board. It does not mention you specifically.',friendly:'Room B is reserved for a neutral hour. You may attend in an observational capacity.',warm:'NOTICE OF MEETING: you and I, Room B, 6:00 PM. Attendance is neither required nor discouraged.'},
  signoff:{wary:'No further comment.',friendly:'This meeting is adjourned, neutrally.',warm:'I neither endorse nor oppose you. Warmly.',devoted:'Let the record show I was glad you came. Strike that. Let it show it.'},
  sore:'The minutes reflect that you called my neutrality “a bit.” I have entered no opinion on that.',
  scenes:[
   {line:'I have prepared a statement on the championship. It takes no position on who should hold it. Only on how nice it would look on me.',replies:[
    {style:'bureaucrat',text:'Submit it in triplicate. I’ll schedule a public reading on the mic this week.',promise:'promo',reaction:'“Triplicate.” His eyes mist over. “You understand process.”'},
    {style:'straight',text:'That sounds like a position.',reaction:'“It is a posture, not a position.” He makes a note of the distinction.'},
    {breaks:true,text:'Ron, everyone knows you want the belt.',reaction:'He gasps. “I want nothing. On the record.” He leaves Room B eleven minutes early.'}]},
   {line:'Two parties have requested my endorsement for the potluck dessert table. I have abstained. Please confirm that abstention is correct.',replies:[
    {style:'bureaucrat',text:'Confirmed. I’ll log it as a formal abstention.',reaction:'He stamps something. You did not see him bring a stamp.'},
    {style:'hype',text:'Abstain LOUDER, Ron!',reaction:'He considers this. “A vigorous abstention. Interesting.”'},
    {breaks:true,text:'Just pick the brownies.',reaction:'“I will not be drawn into the brownie question.” The meeting ends.'}]}
  ]},
 34:{speaker:'Liam',style:'straight',place:'The safehouse (a booth at Door County Lanes)',days:['Sunday'],
  tells:{wary:'He calls you “the asset” and sits facing the door.',friendly:'He briefs you, but only on a need-to-know basis.',warm:'He has given you a codename: Lantern.',devoted:'He has trusted you, Lantern, with the flip phone’s other number.'},
  invite:{wary:'The flip phone is off. It’s Sunday, so he’s at the lanes anyway.',friendly:'Booth. Sunday. 1900.',warm:'Lantern. Lane nine. 1900. Come alone. Bring quarters.'},
  signoff:{wary:'This conversation didn’t happen.',friendly:'Stay low.',warm:'Good work, Lantern.',devoted:'If anyone asks, Lantern, you were never here. Thank you for being here.'},
  sore:'You laughed at the extraction plan. I remember who laughs. That’s my job.',
  scenes:[
   {line:'Your next show. Exits?',replies:[
    {style:'straight',text:'Front, back, and a kitchen window that sticks. You open the show and leave through the window.',promise:'appearance',reaction:'He memorises it once and burns the napkin you drew it on.'},
    {style:'hype',text:'Exits? You’re the main attraction!',reaction:'“Main attractions need the most exits.” He writes something down.'},
    {breaks:true,text:'Liam, it’s a pancake-breakfast hall.',reaction:'He closes the flip phone very slowly. The booth goes cold.'}]},
   {line:'Someone left a single pin standing on lane nine. Not a strike. Not a spare. A message.',replies:[
    {style:'straight',text:'Who knew you’d be on lane nine?',reaction:'“Exactly the right question.” He slides you a quarter. That is trust.'},
    {style:'believer',text:'Then we answer it.',reaction:'He nods once. “Not tonight. But we answer it.”'},
    {breaks:true,text:'It’s just a bad bowl.',reaction:'He looks at you the way he looks at lane nine.'}]}
  ]},
 37:{speaker:'The Dog',style:'believer',place:'The yard behind the hall',
  tells:{wary:'He growls softly when you reach for the rulebook.',friendly:'He wags when you come in. Mostly at the bell.',warm:'He brings you things: a referee’s whistle, a folding chair.',devoted:'He brought you the ring bell. Bev wants it back.'},
  invite:{wary:'He’s in the yard. He doesn’t look at the gate when you open it.',friendly:'WOOF. yard. 5pm. (bring the ball)',warm:'[a photo of a tennis ball, sent at 6:02 a.m. No text.]'},
  signoff:{wary:'He sniffs your shoes and leaves.',friendly:'Good booker.',warm:'Best booker. BEST booker.',devoted:'You are the goodest booker. I will guard this yard for you.'},
  sore:'You called me “a guy.” I am a dog. I have thought about it every day since.',soreWeeks:8,
  scenes:[
   {line:'Throw it. Throw it. Throw the thing. (He points his nose at a folding chair.)',replies:[
    {style:'believer',text:'The chair? All right. Go get it, boy!',reaction:'He brings the chair back across the whole yard, proudly, and drops it on your feet.'},
    {style:'straight',text:'That chair belongs to Bev.',reaction:'“Bev’s chair is the best chair.” He wags anyway.'},
    {breaks:true,text:'Come on. You’re a guy in a costume.',reaction:'His ears go flat. He lies down facing the fence and does not get up.'}]},
   {line:'Page 41. Read it. Does it say dogs? It does not say dogs.',replies:[
    {style:'believer',text:'No dogs on page 41. You’re cleared to wrestle. You’re on the card this week.',promise:'appearance',reaction:'He howls. Somewhere, three other dogs howl back.'},
    {style:'bureaucrat',text:'Let me check the appendix as well.',reaction:'He waits, panting, while you check the appendix. Nothing about dogs.'},
    {breaks:true,text:'Rules are for people. You’re a person.',reaction:'He takes the rulebook in his mouth and carries it away from you.'}]}
  ]}
};
const FEATURED_IDS=Object.keys(FEATURED_ROUTES).map(Number);

// Sweeps McKenzie: the full route. Builds on the spotlight arc in stories.js and only opens after that month.
const SWEEPS_BEATS={
 'after-hours':{line:'This hall and the championship are linked, boss. A clean floor, a clean title picture. I’ve known it since my first broom.',replies:[
  {style:'believer',text:'Then show me where the championship’s spirit gathers.',reaction:'He leads you to the dusty corner under the bleachers. “Here. It’s always here.” He sweeps it reverently.'},
  {style:'straight',text:'Is this a union thing? Are you on the clock?',reaction:'“Sweeping’s never on the clock.” He seems to take it as a compliment.'},
  {breaks:true,text:'Sweeps, it’s just a floor.',reaction:'He keeps sweeping. He does not look at you again tonight.'}]},
 path:{line:'If I’m on the card this week, I need to know the ring’ll be swept by somebody who means it.',replies:[
  {style:'believer',text:'You’ll wrestle on a canvas you swept yourself. You’re on the card this week.',promise:'appearance',reaction:'He hands you the dustpan. You have never seen anyone so moved by a dustpan.'},
  {style:'bureaucrat',text:'I’ll add canvas sweeping to the crew checklist.',reaction:'“A checklist.” He nods. “It’s not faith. But it’s close.”'},
  {breaks:true,text:'The ring crew mops it. It’s fine.',reaction:'“Mops.” He says it like a swear word, then apologises to the broom.'}]},
 stain:{flag:true,invite:'Boss. Come quick. Timekeeper’s table.',line:'There’s a stain by the timekeeper’s table. I’ve swept it forty times. It won’t sweep.',replies:[
  {style:'believer',text:'Then it isn’t a stain. It’s a sign. We face it together, in front of everyone, next week.',promise:'promo',due:1,reaction:'You kneel beside him and study it until the caretaker turns the lights off. He doesn’t let go of the broom.'},
  {style:'straight',text:'Have you tried a mop?',reaction:'“A mop.” He stares as if you had suggested sorcery. “…Later.”'},
  {breaks:true,text:'It’s a coffee stain, Sweeps.',reaction:'He looks at the stain, then at you. It is not clear which one he thinks is worse.'}]},
 ask:{invite:'Can you come by? I need to ask you something. In person.',line:'I’m asking for one thing, boss. A title match. On a floor I’ve personally swept for twenty-four hours straight. Can you give me that?',replies:[
  {style:'believer',ask:'accept',text:'Yes. The title, the floor and twenty-four hours. Start sweeping.',reaction:'He doesn’t say anything. He just starts sweeping, right there, and doesn’t stop.'},
  {style:'straight',ask:'defer',delta:-2,text:'Not this month. Ask me again when the time is right.',reaction:'“When the time’s right.” He nods, and sweeps the same spot four times.'},
  {ask:'decline',delta:-10,text:'The title picture doesn’t need a clean floor.',reaction:'He leans the broom against the wall. He leaves it there. That has never happened before.'}]},
 vigil:{invite:'Hour one. Don’t come yet. Come at hour nineteen.',line:'Hour nineteen, boss. I can see my reflection in the floor. I can see the championship in it, too.',replies:[
  {style:'believer',text:'Take a break. I’ll keep the broom moving for an hour.',reaction:'He hands you the broom like it is the championship. For an hour, it is.'},
  {style:'hype',text:'Nineteen hours! The whole hall is going to FEEL this!',reaction:'“They’ll feel it in their shoes, boss.” He sweeps faster.'}]}
};
const SWEEPS_MEMORIES=[{id:'stain',title:'The Unsweepable Stain',caption:'Week {week} · We knelt. It did not sweep.'}];
const SWEEPS_ENDINGS={
 best:{title:'The Cleanest Title Match in Wisconsin',line:'Sweeps: “Twenty-four hours, one floor, one championship. Whatever happens next, boss, this hall has never been cleaner.”'},
 neutral:{title:'A Fair Shake, At Last',line:'Sweeps: “You gave me the match. Next time, give me the whole twenty-four hours.”'},
 bad:{title:'Swept Under the Rug',line:'Sweeps leans the broom against the wall and leaves it there. Nobody at St. Elbow’s has seen that before.'}
};

function isFeatured(id){return Object.hasOwn(FEATURED_ROUTES,id)}
function relations(){migrateRelationships(state);return state.relations}
function sweepsRoute(){return relations().routes['10']}
function easyMode(){return !!state.preferences?.easyMode}
function affectionTier(r){const t=r.trust;return t<45?'wary':t<65?'friendly':t<80?'warm':'devoted'}
function tellFor(r){return FEATURED_ROUTES[r.id].tells[affectionTier(r)]}
// Featured wrestlers show a tell instead of a trust number.
function trustReadout(r){return isFeatured(r.id)?tellFor(r):`Trust ${r.trust}/100`}
function signoffFor(r){return FEATURED_ROUTES[r.id].signoff[affectionTier(r)]}
function playStyle(){
 const counts=relations().style,best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
 return best&&best[1]>0?best[0]:null;
}
function reputationLine(){const style=playStyle();return style?`The locker room has you down as a ${PLAY_STYLES[style]}.`:'The locker room hasn’t made up its mind about you yet.'}
function nextEventWeek(week=state.week){return week%4===0?week+4:Math.ceil(week/4)*4}
function soreLine(id){
 const route=FEATURED_ROUTES[id],when=relations().sore[id];
 return when!=null&&state.week-when<(route.soreWeeks||4)?route.sore:'';
}

function sweepsBeat(){
 const arc=state.arc,route=sweepsRoute(),r=w(10);
 if(!r||route.ending)return null;
 if(arc&&state.week<arc.start+4)return null; // the spotlight month already gives Sweeps the backstage scenes
 if(route.ask?.status==='accepted')return route.ask.due===state.week&&!route.ask.vigil?'vigil':null;
 if(!route.beats.afterHours)return 'after-hours';
 if(!route.beats.path)return r.trust>=55?'path':null;
 if(!route.flags.stain&&r.trust>=70&&r.lastSeen===state.week-1)return 'stain';
 const askReady=!route.ask||route.ask.status==='deferred'&&state.week>=route.ask.again;
 if(askReady&&r.trust>=75)return 'ask';
 return null;
}
function briefingActor(){return state.weeklyBriefing?.request.actor??backstageConversation().actor}
function buildInvites(){
 const rel=relations(),backstage=briefingActor(),list=[],beat=sweepsBeat();
 if(beat)list.push({actor:10,beat});
 const others=FEATURED_IDS.filter(id=>id!==10&&id!==backstage&&w(id)).sort((a,b)=>(rel.lastInvited[a]||0)-(rel.lastInvited[b]||0)||a-b);
 while(list.length<INVITES_PER_WEEK&&others.length){const id=others.shift();list.push({actor:id,beat:'visit-'+((rel.visits[id]||0)%FEATURED_ROUTES[id].scenes.length)})}
 const open=WEEK_DAYS.filter(day=>day!=='Sunday'&&day!=='Friday');let next=0;
 for(const invite of list){
  rel.lastInvited[invite.actor]=state.week;
  invite.day=invite.beat==='vigil'?'Friday':FEATURED_ROUTES[invite.actor].days?.[0]||open[next++%open.length];
  invite.id=`${state.week}-${invite.actor}`;
 }
 return list.sort((a,b)=>WEEK_DAYS.indexOf(a.day)-WEEK_DAYS.indexOf(b.day));
}
function ensureWeekAhead(){
 const rel=relations();
 if(rel.week?.week===state.week)return rel.week;
 // A flag event that passed unanswered is gone for good.
 if(rel.week)for(const invite of rel.week.invites)if(invite.beat==='stain'&&!rel.week.answers[invite.id])sweepsRoute().flags.stain='missed';
 rel.week={week:state.week,invites:[],spent:[],answers:{}};
 rel.week.invites=buildInvites();
 return rel.week;
}
function eveningsLeft(){const week=ensureWeekAhead();return Math.max(0,EVENING_SLOTS-week.spent.length)}
function sceneFor(invite){
 const route=FEATURED_ROUTES[invite.actor];
 if(invite.actor===10&&SWEEPS_BEATS[invite.beat])return {place:route.place,...SWEEPS_BEATS[invite.beat]};
 return {place:route.place,...route.scenes[Number(invite.beat.split('-')[1])||0]};
}
function inviteMessage(invite){
 const r=w(invite.actor),tier=affectionTier(r),route=FEATURED_ROUTES[invite.actor],scene=sceneFor(invite);
 if(scene.invite)return {text:scene.invite,texted:true};
 return tier==='wary'?{text:route.invite.wary,texted:false}:{text:route.invite[tier==='friendly'?'friendly':'warm'],texted:true};
}
function replyDelta(actor,reply){
 if(Number.isFinite(reply.delta))return reply.delta;
 if(reply.breaks)return -6;
 const style=FEATURED_ROUTES[actor].style;
 return (reply.style===style?6:2)+(playStyle()===style?1:0);
}
function replyChips(actor,reply){
 const delta=replyDelta(actor,reply),chips=[{stat:'trust',label:delta>=6?'Warms to this ▲▲':delta>0?'Small step ▲':reply.breaks?'Breaks their world ▼':'Cools things ▼'}];
 if(reply.promise||reply.ask==='accept')chips.push({stat:'promise',label:'Makes a promise'});
 return chips;
}
function sweepsPayoff(invite,reply){
 const route=sweepsRoute();
 if(invite.beat==='after-hours')route.beats.afterHours=state.week;
 if(invite.beat==='path')route.beats.path=state.week;
 if(invite.beat==='stain'){
  route.flags.stain='seen';route.memories.push({id:'stain',week:state.week});
  if(reply.promise&&!state.plans[state.week+1])state.plans[state.week+1]='Sweeps faces the Unsweepable Stain';
 }
 if(invite.beat==='vigil')route.ask.vigil=true;
 if(invite.beat==='ask'){
  if(reply.ask==='accept'){
   const due=nextEventWeek();makePromise(10,'title',due);
   const promise=state.promises.find(p=>p.actor===10&&p.kind==='title'&&p.status==='open');
   route.ask={status:'accepted',week:state.week,due,promiseId:promise?.id||null,vigil:false};
   return `A title match for Sweeps at ${monthlyEventName(due)} · due week ${due}`;
  }
  if(reply.ask==='defer')route.ask={status:'deferred',week:state.week,again:state.week+4};
  if(reply.ask==='decline'){route.ask={status:'declined',week:state.week};route.ending='bad'}
 }
 return null;
}
// Applies one evening's reply. Returns false if it cannot be spent.
function answerScene(id,index){
 if(state.liveShow||state.recap)return false;
 const week=ensureWeekAhead(),invite=week.invites.find(item=>item.id===id);
 if(!invite||week.answers[id]||eveningsLeft()<=0)return false;
 const scene=sceneFor(invite),reply=scene.replies[index];if(!reply)return false;
 const rel=relations(),r=w(invite.actor),delta=replyDelta(invite.actor,reply);
 r.trust=clamp(r.trust+delta);
 if(reply.style)rel.style[reply.style]++;
 if(reply.breaks)rel.sore[invite.actor]=state.week;
 if(invite.beat.startsWith('visit-'))rel.visits[invite.actor]=(rel.visits[invite.actor]||0)+1;
 week.answers[id]={reply:index};week.spent.push(id);
 let payoff=null;
 if(reply.promise){
  const due=state.week+(reply.due||0),had=state.promises.some(p=>p.actor===invite.actor&&p.kind===reply.promise&&p.status==='open');
  makePromise(invite.actor,reply.promise,due);
  payoff=had?'Already on the promise ledger':promiseLabel(state.promises.filter(p=>p.actor===invite.actor&&p.kind===reply.promise).at(-1));
 }
 if(invite.actor===10)payoff=sweepsPayoff(invite,reply)||payoff;
 week.answers[id].payoff=payoff;
 incident(`An evening with ${r.name} at ${scene.place.split(' (')[0]}.${payoff?' '+payoff+'.':''}`,[invite.actor],'relationship');
 return true;
}
// Runs after promises resolve at the end of a show.
function relationshipWeekEnd(fallout){
 const route=sweepsRoute(),ask=route.ask;
 if(ask?.status!=='accepted'||route.ending)return;
 const promise=state.promises.find(p=>p.id===ask.promiseId);
 if(promise?.status==='kept')route.ending=ask.vigil?'best':'neutral';
 else if(promise?.status==='broken')route.ending='bad';
 if(route.ending){route.endedWeek=state.week;fallout.push(incident(SWEEPS_ENDINGS[route.ending].line,[10],'aftermath'))}
}

function inviteCard(invite,left){
 const r=w(invite.actor),week=ensureWeekAhead(),answer=week.answers[invite.id],scene=sceneFor(invite),message=inviteMessage(invite),tier=affectionTier(r);
 const action=answer?`<span class="invite-status">Evening spent ✓</span>`:left?`<button type="button" class="btn ${scene.flag?'primary':''}" data-week-scene="${invite.id}" aria-label="${esc((scene.flag?'Go now: ':'Spend the evening with ')+r.name)}">${scene.flag?'Go now':'Spend the evening'}</button>`:`<span class="invite-status">No evenings left</span>`;
 return `<li class="invite mood-${tier} ${answer?'is-spent':''} ${scene.flag?'is-flag':''}" style="--character-color:${r.color}"><div class="invite-art">${portrait(r)}</div><div class="invite-copy"><small>${esc(invite.day)} · ${esc(scene.place.split(' (')[0])}</small><strong>${esc(r.name)}</strong>${scene.flag&&!answer?'<span class="invite-flag">Only this week</span>':''}<p class="${message.texted?'invite-text':'invite-narration'}">${message.texted?'<span class="sr-only">Text message: </span>':''}${esc(message.text)}</p></div>${action}</li>`;
}
function weekAheadPanel(){
 const week=ensureWeekAhead(),left=eveningsLeft();
 const dots=Array.from({length:EVENING_SLOTS},(_,i)=>`<i class="${i<EVENING_SLOTS-left?'used':''}"></i>`).join('');
 return `<section class="card week-ahead" id="week-ahead" aria-labelledby="week-ahead-title"><div class="week-ahead-head"><h3 id="week-ahead-title">The week ahead</h3><span class="evening-dots" role="img" aria-label="${left} of ${EVENING_SLOTS} evenings free">${dots}</span></div><p class="note">${esc(reputationLine())} ${left?`${left} free evening${left===1?'':'s'}. Whoever you don’t see this week, you don’t see.`:'Your evenings are spoken for.'}</p><ol class="invite-list">${week.invites.map(invite=>inviteCard(invite,left)).join('')}</ol><label class="easy-toggle"><input type="checkbox" data-easy-mode ${easyMode()?'checked':''}> Show what replies change (easy mode)</label></section>`;
}
function sceneMarkup(invite){
 const r=w(invite.actor),week=ensureWeekAhead(),answer=week.answers[invite.id],scene=sceneFor(invite),tier=affectionTier(r);
 const used=week.spent.length-(answer?1:0),sore=soreLine(invite.actor),speaker=FEATURED_ROUTES[invite.actor].speaker;
 const direction=`${tellFor(r)}${sore?` Before anything else: “${sore}”`:''}`;
 const replies=answer?'':`<p class="scene-prompt">How do you answer?</p><div class="scene-replies">${scene.replies.map((reply,i)=>`<button type="button" class="scene-reply" data-scene-reply="${i}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body"><strong>${esc(reply.text)}</strong>${easyMode()?effectChips(replyChips(invite.actor,reply),'What this reply changes'):''}</span></button>`).join('')}</div>`;
 const chosen=answer?scene.replies[answer.reply]:null;
 const reaction=answer?`<div class="scene-reaction"><p class="scene-you"><small>You said</small>${esc(chosen.text)}</p><p>${esc(chosen.reaction)}</p><p class="scene-signoff">“${esc(signoffFor(r))}”</p>${answer.payoff?`<p class="scene-payoff"><small>On the booking sheet</small>${esc(answer.payoff)}</p>`:''}${invite.actor===10&&sweepsRoute().memories.some(m=>m.week===state.week)&&invite.beat==='stain'?`<p class="scene-payoff"><small>Scrapbook</small>A polaroid is pinned to his window card.</p>`:''}<button type="button" class="btn primary" id="scene-done">Back to the week →</button></div>`:'';
 return `<form class="scene-form"><header class="scene-bar"><span class="scene-brand">The week ahead</span><span>Week ${state.week} · ${esc(invite.day)}</span><span>Evening ${Math.min(EVENING_SLOTS,used+1)} of ${EVENING_SLOTS}</span></header><div class="scene-body"><section class="scene-cast" style="--character-color:${r.color}"><div class="scene-place">${esc(scene.place)}</div><div class="scene-portrait" data-mood="${tier}">${portrait(r)}${tier==='devoted'?'<span class="scene-heart" aria-hidden="true">♥</span>':''}</div><h2 id="scene-title" tabindex="-1">${esc(r.name)}</h2><p class="scene-gimmick">${esc(r.gimmick)}</p></section><section class="scene-talk">${scene.flag?'<span class="scene-flag">Only this week</span>':''}<p class="scene-direction">${esc(direction)}</p><blockquote class="scene-line"><span class="scene-speaker">${esc(speaker)}</span>“${esc(scene.line)}”</blockquote>${replies}${reaction}</section></div></form>`;
}
// Plays one evening in the shared dialog. `back` returns to wherever the scene was opened from.
function openWeekAheadScene(id,back){
 const invite=ensureWeekAhead().invites.find(item=>item.id===id);if(!invite)return;
 const d=$('#modal'),wasOpen=d.open;
 const draw=()=>{
  d.className='week-ahead-scene';d.setAttribute('aria-labelledby','scene-title');d.innerHTML=sceneMarkup(invite);
  d.querySelectorAll('[data-scene-reply]').forEach(button=>button.onclick=()=>{if(answerScene(id,Number(button.dataset.sceneReply))){save();draw()}});
  const done=d.querySelector('#scene-done');if(done)done.onclick=()=>back();
  d.querySelector('form').onsubmit=event=>event.preventDefault();
  if(!d.open)d.showModal();d.scrollTop=0;d.querySelector('#scene-title').focus({preventScroll:true});
 };
 if(!wasOpen){d.oncancel=null;d.onclose=()=>{if(!d.open){d.removeAttribute('aria-labelledby');render()}}}
 draw();
}
function bindWeekAhead(scope=document,back=null){
 const root=scope.querySelector?.('#week-ahead');if(!root)return;
 const leave=back||(()=>{const d=$('#modal');d.close()});
 root.querySelectorAll('[data-week-scene]').forEach(button=>button.onclick=()=>openWeekAheadScene(button.dataset.weekScene,leave));
 const easy=root.querySelector('[data-easy-mode]');
 if(easy)easy.onchange=()=>{state.preferences.easyMode=easy.checked;save();if(back)back();else render()};
}

function promiseLedger(){
 const open=state.promises.filter(p=>p.status==='open').sort((a,b)=>a.due-b.due),recent=state.promises.filter(p=>p.status!=='open'&&p.resolved>=state.week-4).slice(-5).reverse();
 const due=p=>p.due<=state.week?'Tonight':p.due===state.week+1?'Next week':`In ${p.due-state.week} weeks`;
 const rows=open.map(p=>`<li class="ledger-row ${p.due<=state.week?'is-due':''} ${isFeatured(p.actor)?'is-route':''}"><span class="ledger-art">${portrait(w(p.actor))}</span><span class="ledger-what"><strong>${esc(w(p.actor).name)}</strong>${esc(promiseWhat(p))}</span><span class="ledger-due">${due(p)}<small>Week ${p.due}</small></span><span class="ledger-state">${promiseMet(p)?'On the card ✓':'Not booked yet'}</span></li>`).join('');
 return `<section class="card promise-ledger" id="promise-ledger" aria-labelledby="ledger-title"><div class="ledger-head"><h3 id="ledger-title">Promise ledger</h3><span>Your word, in writing</span></div>${rows?`<ol>${rows}</ol>`:'<p class="note">No open promises. Your word is clear.</p>'}${recent.length?`<ul class="ledger-history" aria-label="Recently settled">${recent.map(p=>`<li class="${p.status}">${p.status==='kept'?'Kept':'Broken'} · ${esc(w(p.actor).name)} · week ${p.resolved}</li>`).join('')}</ul>`:''}</section>`;
}
function windowCard(r){
 if(!isFeatured(r.id))return '';
 const route=FEATURED_ROUTES[r.id],tier=affectionTier(r),sweeps=r.id===10?sweepsRoute():null;
 const knownStyle=['warm','devoted'].includes(tier)?PLAY_STYLES[route.style]:'Keep talking to find out';
 const memories=sweeps?SWEEPS_MEMORIES.map(m=>{const found=sweeps.memories.find(x=>x.id===m.id),missed=sweeps.flags[m.id]==='missed';return `<figure class="polaroid ${found?'':'is-empty'}">${found?`<div class="polaroid-art">${portrait(r)}</div><figcaption><strong>${esc(m.title)}</strong>${esc(m.caption.replace('{week}',found.week))}</figcaption>`:`<div class="polaroid-art"></div><figcaption>${missed?'This moment passed you by.':'A memory not made yet'}</figcaption>`}</figure>`}).join(''):'';
 const complete=sweeps&&SWEEPS_MEMORIES.every(m=>sweeps.memories.some(x=>x.id===m.id));
 const ending=sweeps?.ending?SWEEPS_ENDINGS[sweeps.ending]:null;
 return `<section class="window-card" style="--character-color:${r.color}">${complete?'<div class="window-banner">Main event</div>':''}<small>Window card</small><p class="window-tell">${esc(tellFor(r))}</p><dl><div><dt>Finds them at</dt><dd>${esc(route.place)}</dd></div><div><dt>Signs off</dt><dd>“${esc(signoffFor(r))}”</dd></div><div><dt>Warms to</dt><dd>${esc(knownStyle)}</dd></div></dl>${sweeps?`<div class="scrapbook" aria-label="Scrapbook">${memories}</div>`:'<p class="note">Their scrapbook opens when their full route is written.</p>'}${ending?`<p class="window-ending"><small>Era I ending</small><strong>${esc(ending.title)}</strong></p>`:''}</section>`;
}
