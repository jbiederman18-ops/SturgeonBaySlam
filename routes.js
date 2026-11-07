'use strict';
// Relationship dialogue and route data. No logic lives here: relationships.js reads it.
// Owned by the dialogue writer. Shape and rules: claude/dialogue-writer-handoff.md in the project.
// Every line is in kayfabe. AGENTS.md's hard character rule applies to every string in this file.

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

// Full route stories, keyed by wrestler id, all in the shape Sweeps uses: beats, memories, endings.
// The engine plays Sweeps' story today; the other routes are wired up as their stories are written.
const ROUTE_STORIES={10:{beats:SWEEPS_BEATS,memories:SWEEPS_MEMORIES,endings:SWEEPS_ENDINGS}};
