'use strict';
// Relationship dialogue and route data. No logic lives here: relationships.js reads it.
// Each beat pairs the booker’s exact reply with the wrestler’s immediate reaction.
// Every line is in kayfabe. AGENTS.md's hard character rule applies to every string in this file.

const FEATURED_ROUTES={
 0:{speaker:'Greek',style:'hype',place:'Mount Olympus (the St. Elbow’s boiler room)',
  tells:{wary:'He refers to you only as “the mortal,” and only in the third person.',friendly:'He receives you briefly, between labors.',warm:'He has started naming you in his monologues.',devoted:'He names you in every monologue now, usually as “the Bard.”'},
  invite:{wary:'Olympus has not summoned you. The boiler room door is propped open anyway.',friendly:'Olympus receives petitioners until nine.',warm:'The gods convene tonight. Bring your lyre. (Bring snacks.)'},
  signoff:{wary:'Go now, mortal.',friendly:'Sing of this.',warm:'Until the next verse, Bard.',devoted:'Thy name is in the song, Bard.'},
  sore:'The gods heard what you said, mortal. They have excellent hearing for that sort of thing.',
  scenes:[
   {line:'The boiler hisses its approval. I have bested eleven challengers. The twelfth labor approaches. Who will sing of it?',replies:[
    {style:'hype',text:'You will. On the mic this week, and I’ll hold the spotlight myself.',promise:'promo',reaction:'He clasps your forearm like a fellow hero. “Then the song has begun.”'},
    {style:'straight',text:'Who’s the twelfth challenger?',reaction:'“The gods have not yet cast them.” He seems a little put out that you asked for details.'},
    {breaks:true,text:'Greek, it’s a boiler room.',reaction:'The boiler sighs. Greek does not. “Olympus does not hear you, mortal.”'}]},
   {line:'An omen! The pipes rattled thrice during my training. Interpret it, booker.',replies:[
    {style:'hype',text:'Three rattles. A three-count. The gods want that last count loud enough to shake the roof.',reaction:'“YES.” He chalks it on the boiler in letters a foot tall.'},
    {style:'believer',text:'Then we listen. What do the pipes want?',reaction:'He listens for a long time. “They want a bigger entrance.”'},
    {breaks:true,text:'That’s just the heat kicking on.',reaction:'He turns to face the wall, where the gods are more reasonable.'}]}
  ]},
 1:{speaker:'2 Holds',style:'straight',place:'The training barn',
  tells:{wary:'He keeps the HOLD TWO briefcase chained to his wrist and his back to you.',friendly:'He demonstrates Hold Number One. Again.',warm:'He lets you carry the locked HOLD TWO briefcase.',devoted:'He lets you carry the briefcase and no longer checks that it is still locked.'},
  invite:{wary:'The barn light is on. He has not invited you.',friendly:'Practicing Hold One tonight. You may observe.',warm:'Barn. Seven. Hold One. Bring water.'},
  signoff:{wary:'That was Hold One. Leave.',friendly:'Hold One. Always Hold One.',warm:'Tell no one about the briefcase.',devoted:'Someday you will see Hold Two. Not today.'},
  sore:'You wanted to hurry me along. I remember. Hold One does not hurry.',
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
  signoff:{wary:'Mind the dustpan.',friendly:'Keep it clean, boss.',warm:'Floor’s clean. So’s my conscience. Night, boss.',devoted:'You can have the good broom, boss. You know where I keep it.'},
  sore:'You brushed me off, boss. I know what that looks like. I sweep for a living.'},
 18:{speaker:'Charming',style:'bureaucrat',place:'Afternoon tea at Maddox Hatter’s table',
  tells:{wary:'His thank-you notes are brief, and only slightly threatening.',friendly:'He pours your tea first and asks after your family by name.',warm:'His thank-you notes are getting longer and more politely threatening.',devoted:'His latest thank-you note runs four pages and ends, “I would hate for anything to happen to you.”'},
  invite:{wary:'Maddox has set a place for you. Charming has not.',friendly:'Tea is at four, should you care to be civilised.',warm:'Dearest booker, tea at four? I have a little secret to share. Do come. — C.F.'},
  signoff:{wary:'Do mind the stairs. They’re ever so steep.',friendly:'Thank you ever so much for coming.',warm:'Give my best to everyone you love. Every one.',devoted:'You are my very favourite person to threaten, darling.'},
  sore:'I took the liberty of writing you a thank-you note for our last conversation. Do open it when you’re alone.',
  scenes:[
   {line:'Milk? Sugar? A secret? Somebody left their place card here last week. The things a person writes on the back of a name!',replies:[
    {style:'bureaucrat',text:'Put it in writing, signed and dated. I’ll file it.',reaction:'“Signed and dated.” He is delighted. “A man of paperwork and menace.”'},
    {style:'hype',text:'Ooh. Tell me EVERYTHING.',reaction:'He tells you nothing, beautifully, for twenty minutes.'},
    {breaks:true,text:'You’re not actually this polite, are you?',reaction:'“I beg your pardon?” he says, with frightening sincerity.'}]},
   {line:'It occurs to me that I’ve been deciding who sits where for years. I’d adore a small say in this week’s card. Simply who opens, who closes, and who suffers.',replies:[
    {style:'bureaucrat',text:'Submit a formal proposal. I’ll put you in a match this week. That’s the place I can offer you.',promise:'appearance',reaction:'He produces the proposal at once. It is laminated.'},
    {style:'straight',text:'No.',reaction:'“Splendid. A booker who says no.” He makes a note in a very small book.'},
    {breaks:true,text:'You’re a wrestler. Wrestlers don’t book.',reaction:'He sets down his cup without a sound. Maddox Hatter stops pouring.'}]}
  ]},
 20:{speaker:'The Grinch',style:'hype',place:'Anywhere decorated: tonight, the Moose Lodge craft room',
  tells:{wary:'He leaves love notes in everyone’s turnbuckles but yours.',friendly:'He waves with both hands from across the hall.',warm:'He leaves love notes in your turnbuckles too.',devoted:'Your turnbuckles are full of love notes. He has started on your car.'},
  invite:{wary:'You can hear tinsel from the craft room. Nobody texted you.',friendly:'Decorating the craft room at 7! Everyone welcome! Even you!',warm:'WREATH EMERGENCY. Craft room. Bring glue. Bring your heart.'},
  signoff:{wary:'Happy… whatever.',friendly:'Spread the love, booker!',warm:'I stole your heart a little, didn’t I? I’m keeping it.',devoted:'Your heart’s in the lockbox now, right next to mine.'},
  sore:'I remembered what you said about my hearts. I put the scissors away before I came to talk to you.',
  scenes:[
   {line:'I need a GRAND GESTURE in the ring this week. Streamers? A choir? A lockbox full of hearts? ALL THREE?',replies:[
    {style:'hype',text:'All three. Take the mic and make the whole hall fall in love.',promise:'promo',reaction:'He spins you around twice. “THIS is why I stole your heart.”'},
    {style:'believer',text:'Do whatever your heart says.',reaction:'He listens to his heart very carefully. “It says ALL THREE.”'},
    {breaks:true,text:'Maybe tone down the romance stuff.',reaction:'A single paper heart falls from his sleeve. He does not pick it up.'}]},
   {line:'Lemon Tart walked past me today and said “ugh.” Do you think that means she loves me?',replies:[
    {style:'hype',text:'Tell her the door’s open if she wants a wreath. Then let her be the one who walks through it.',reaction:'“An OPEN invitation!” He sets a blank card beside the wreath. “I can make one of those.”'},
    {style:'straight',text:'I think it means ugh.',reaction:'He nods bravely. “Ugh is a start.”'},
    {breaks:true,text:'Stop making hearts for people. You’re embarrassing yourself.',reaction:'He pulls one half-cut heart out from under the scissors. “Well. I can finish this one for me.”'}]}
  ]},
 31:{speaker:'Ron',style:'bureaucrat',place:'Room B, Sturgeon Bay Public Library (booked for one neutral hour)',
  tells:{wary:'He has filed a formal statement of no comment regarding you.',friendly:'He acknowledges your existence, on the record.',warm:'He files non-binding statements of mild approval about you.',devoted:'He has abstained, in writing, from criticizing you. Twice.'},
  invite:{wary:'A public notice is pinned to the library board. It does not mention you specifically.',friendly:'Room B is reserved for a neutral hour. You may attend in an observational capacity.',warm:'NOTICE OF MEETING: you and I, Room B, 6:00 PM. Attendance is neither required nor discouraged.'},
  signoff:{wary:'No further comment.',friendly:'This meeting is adjourned, neutrally.',warm:'I neither endorse nor oppose you. Warmly.',devoted:'Let the record show I was glad you came. Strike that. Let it show it.'},
  sore:'The minutes reflect that you took issue with my neutrality. I have entered no opinion on your objection.',
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
  sore:'You dismissed the last briefing. I remember who listens. That’s my job.',
  scenes:[
   {line:'Your next show. Exits?',replies:[
    {style:'straight',text:'Front, back, and a kitchen window that sticks. You have a match this week. I’ll mark the exits on your copy.',promise:'appearance',reaction:'He memorizes the map and slides the napkin back. “I can get myself out. Now you can, too.”'},
    {style:'hype',text:'Exits? You’re the main attraction!',reaction:'“Main attractions need the most exits.” He writes something down.'},
    {breaks:true,text:'Liam, it’s a pancake-breakfast hall.',reaction:'He closes the flip phone very slowly. The booth goes cold.'}]},
   {line:'Someone left a single pin standing on lane nine. Not a strike. Not a spare. A message.',replies:[
    {style:'straight',text:'Who knew you’d be on lane nine?',reaction:'“Exactly the right question.” He slides you a quarter. That is trust.'},
    {style:'believer',text:'Then we answer it.',reaction:'He nods once. “Not tonight. But we answer it.”'},
    {breaks:true,text:'It’s just a bad bowl.',reaction:'He looks at you the way he looks at lane nine.'}]}
  ]},
 37:{speaker:'The Dog',style:'believer',place:'The yard behind the hall',
  tells:{wary:'He growls softly when you reach for the rulebook.',friendly:'He perks up when you come in. Even with the bell put away.',warm:'He brings you things: a referee’s whistle, a folding chair.',devoted:'He lets you hold the rulebook open at page 41. He trusts you to give it back.'},
  invite:{wary:'He’s in the yard. He doesn’t look at the gate when you open it.',friendly:'WOOF. yard. 5pm. (bring the ball)',warm:'[a photo of a tennis ball, sent at 6:02 a.m. No text.]'},
  signoff:{wary:'I’ll be by the fence.',friendly:'Good booker.',warm:'Best booker. BEST booker.',devoted:'You are the goodest booker. I will guard this yard for you.'},
  sore:'You keep looking for a rule about me. I am a dog. I looked first.',soreWeeks:8,
  scenes:[
   {line:'Throw it. Throw it. Throw the thing. (He points his nose at a folding chair.)',replies:[
    {style:'believer',text:'The chair? All right. Go get it, boy!',reaction:'He brings the chair back across the whole yard, proudly, and drops it on your feet.'},
    {style:'straight',text:'That chair belongs to Bev.',reaction:'“Bev’s chair is the best chair.” He wags anyway.'},
    {breaks:true,text:'Come on. You’re a guy in a costume.',reaction:'His ears go flat. He lies down facing the fence and does not get up.'}]},
   {line:'Page 41. Read it. Does it say dogs? It does not say dogs.',replies:[
    {style:'believer',text:'No dogs on page 41. You’re cleared to wrestle. You’re on the card this week.',promise:'appearance',reaction:'He howls. Somewhere, three other dogs howl back.'},
    {style:'bureaucrat',text:'Let me check the appendix as well.',reaction:'He waits, panting, while you check the appendix. Nothing about dogs.'},
    {breaks:true,text:'Rules are for people. You’re a person.',reaction:'He tucks the rulebook under one arm. “You still haven’t found a page.”'}]}
  ]}
};
const FEATURED_IDS=Object.keys(FEATURED_ROUTES).map(Number);

// Sweeps McKenzie: the full route. Builds on the spotlight arc in stories.js and only opens after that month.
const SWEEPS_BEATS={
 'after-hours':{echoes:{
  partners:'The insurer helped me fold chairs after that tag, boss. There wasn’t a form for it. We just did it.',
  victory:'I got the count I wanted against the insurer. I still came back the next morning to sweep.',
  respect:'I took a fair loss. It hurt, boss. I didn’t have to sweep anybody else’s excuse up afterward.',
  unfinished:'I came back to the hall after the tour. My broom was exactly where I left it. That made one thing I could count on.'
 },line:'This hall and the championship are linked, boss. A clean floor, a clean title picture. I’ve known it since my first broom.',replies:[
  {style:'believer',text:'Then show me where the championship’s spirit gathers.',reaction:'He leads you to the dusty corner under the bleachers. “Here. It’s always here.” He sweeps it reverently.'},
  {style:'straight',text:'Is this a union thing? Are you on the clock?',reaction:'“Sweeping’s never on the clock.” He seems to take it as a compliment.'},
  {breaks:true,text:'Sweeps, it’s just a floor.',reaction:'He keeps sweeping. He does not look at you again tonight.'}]},
 path:{line:'If I’m on the card this week, I need to know the ring’ll be swept by somebody who means it.',replies:[
  {style:'believer',text:'You’ll wrestle on a canvas you swept yourself. You’re on the card this week.',promise:'appearance',reaction:'He sets the dustpan by your chair. “I’ll do the corners myself. You can hold that when I get to the middle.”'},
  {style:'bureaucrat',text:'I’ll add canvas sweeping to the crew checklist.',reaction:'“A checklist.” He nods. “It’s not faith. But it’s close.”'},
  {breaks:true,text:'The ring crew mops it. It’s fine.',reaction:'“Mops.” He says it like a swear word, then apologises to the broom.'}]},
 stain:{flag:true,invite:'Boss. Come quick. Timekeeper’s table.',line:'There’s a stain by the timekeeper’s table. I’ve swept it forty times. It won’t sweep.',replies:[
  {style:'believer',text:'Maybe it’s a sign. Next week you get the mic. Tell the room why you keep coming back to this spot.',promise:'promo',due:1,reaction:'You kneel beside him and study it until the caretaker turns the lights off. He doesn’t let go of the broom.'},
  {style:'straight',text:'Have you tried a mop?',reaction:'“A mop.” He stares as if you had suggested sorcery. “…Later.”'},
  {breaks:true,text:'It’s a coffee stain, Sweeps.',reaction:'He looks at the stain, then at you. It is not clear which one he thinks is worse.'}]},
 ask:{invite:'Can you come by? I need to ask you something. In person.',line:'I’m asking for one thing at the next tour show, boss. A title match. On a floor I’ve personally swept for twenty-four hours straight. Can you give me that?',replies:[
  {style:'believer',ask:'accept',text:'Yes. The title, the floor and twenty-four hours. Start sweeping.',reaction:'He doesn’t say anything. He just starts sweeping, right there, and doesn’t stop.'},
  {style:'straight',ask:'defer',delta:-2,text:'Not this month. Ask me again when the time is right.',reaction:'“When the time’s right.” He nods, and sweeps the same spot four times.'},
  {ask:'decline',delta:-10,text:'The title picture doesn’t need a clean floor.',reaction:'He leans the broom against the wall. He leaves it there. That has never happened before.'}]},
 vigil:{invite:'Hour one. Don’t come yet. Come at hour nineteen. Leave yourself time to get to the show.',line:'Hour nineteen, boss. I can see my reflection in the floor. I can see the championship in it, too.',replies:[
  {style:'believer',text:'Keep your hands on the broom. I’ll move the chairs so you can get underneath them.',reaction:'He lifts the broom just long enough for you to move the first chair. “They’re heavy. Take them one at a time, boss.”'},
  {style:'hype',text:'Nineteen hours! The whole hall is going to FEEL this!',reaction:'“They’ll feel it in their shoes, boss.” He sweeps faster.'}]}
};
const SWEEPS_MEMORIES=[{id:'stain',title:'The Unsweepable Stain',caption:'Week {week} · We knelt. It did not sweep.'}];
const SWEEPS_ENDINGS={
 best:{title:'The Cleanest Title Match in Wisconsin',line:'Sweeps: “Twenty-four hours, one floor, one championship. Whatever happens next, boss, this hall has never been cleaner.”'},
 neutral:{title:'A Fair Shake, At Last',line:'Sweeps: “You gave me the match. Next time, give me the whole twenty-four hours.”'},
 bad:{title:'Swept Under the Rug',line:'Sweeps leans the broom against the wall and leaves it there. Nobody at St. Elbow’s has seen that before.'}
};

// Each Ask names something the existing card can deliver. The result belongs to the booker.
const ROUTE_STORIES={
 10:{kind:'title',beats:SWEEPS_BEATS,memories:SWEEPS_MEMORIES,endings:SWEEPS_ENDINGS},
 0:{
  flag:'blank-verse',kind:'promo',
  beats:{
   'blank-verse':{flag:true,invite:'Bard! Come to Olympus. An entire line of the epic has gone missing.',
    line:'The first eleven labors all end with my name. There is room for one name on this last line. For the first time, I cannot bring myself to write mine.',
    replies:[
     {style:'hype',text:'Leave it blank until the people of Sturgeon Bay can put their names there.',reaction:'Greek puts down the chalk. “An entire town in one line! We shall need a much smaller hand.”'},
     {style:'believer',text:'Maybe the gods are waiting to hear from the people who showed up for all eleven.',reaction:'He runs his thumb over the empty line. “The gods are good at waiting. It is I who need the practice.”'},
     {breaks:true,text:'Write your name and get on with it. Nobody is counting labors.',reaction:'Greek writes his name in the space. He studies it and quietly wipes it away.'}
    ]},
   ask:{echoes:["I kept the line blank, as you said. Now I need a room to fill it.", "I listened again. The pipes had nothing to add. I think they’d like to hear the room, too.", "I tried my name in that last line. It fit. That was the trouble."],invite:'I have found my twelfth labor. I need a witness.',
    line:'For eleven labors I have spoken of my own courage. The twelfth is to stand before the people who lent it to me and give it back. Will you give me the microphone at the next tour show?',
    replies:[
     {style:'hype',ask:'accept',text:'Yes. One microphone for the twelfth labor. Let the whole room into the story.',reaction:'He spreads both hands, then draws them in. “For once, I think I can begin without thunder.”'},
     {style:'straight',ask:'defer',delta:-2,text:'Keep the verse. Ask me again in four weeks.',reaction:'“Very well. The verse will keep. See that the invitation does, too.”'},
     {ask:'decline',delta:-10,text:'The epic ends with eleven. I’m closing the book.',reaction:'Greek folds the page neatly. “Then let the record show who ended it.”'}
    ]},
   'go-home':{invite:'One rehearsal, Bard. I promise to leave room for the reply.',
    line:'Every speech I’ve ever made starts with “Behold.” That seems wrong this time. What does a hero say when he needs the room to speak first?',
    replies:[
     {style:'hype',text:'Ask who was here when we had more wrestlers than chairs. Then let them answer.',reaction:'He tries the question at full volume. When you raise a hand, he actually waits.'},
     {style:'believer',text:'Start with a name you know from the front row.',reaction:'“Joan,” he says, at speaking volume. “She was here before there was a front row.”'}
    ]}
  },
  memories:[{id:'blank-verse',title:'The Blank Verse',caption:'Week {week} · Greek left the last line open.'}],
  payoff:'Who was here when we had more wrestlers than chairs? I see you. I heard you even when I was flat on my back. Whatever names they put on the poster, this labor belongs to you.',
  endings:{
   best:{title:'The People’s Labor',line:'Greek: “For once I left a pause in the verse. Did you hear what they put in it, Bard? Their own names.”'},
   neutral:{title:'The Twelfth Labor',line:'Greek: “I said what I came to say. Next time I’ll leave myself enough breath to hear the answer.”'},
   bad:{title:'The Unfinished Epic',line:'Greek: “I had a verse for every person in that hall. They’ll have to get it from me one at a time.”'}
  }
 },
 1:{
  flag:'loose-latch',kind:'appearance',
  beats:{
   'loose-latch':{flag:true,invite:'Barn. Briefcase latch failed. Come through the side door.',
    line:'The latch is open. You could look inside. You are the first person I have told that to.',
    replies:[
     {style:'straight',text:'I’ll hold the lid shut while you find a spare latch.',reaction:'He hands you the case and turns his back. “That will do.”'},
     {style:'bureaucrat',text:'I’ll stand here until you can seal it again. Nothing goes in or out.',reaction:'“Acceptable procedure.” He ties the handle to the lid with his wrist tape.'},
     {breaks:true,text:'We’ve waited long enough. I’m looking.',reaction:'He puts his palm flat on the lid before it moves an inch. “Inspection concluded.”'}
    ]},
   ask:{echoes:["I fixed the latch. You could have looked. You didn’t.", "Your seal held. I cut it off myself. That seemed right.", "There’s a new lock. It was cheaper than another conversation about the lid."],invite:'Barn. Match request. No demonstration.',
    line:'Everyone who asks about Hold Two wants to see it more than they want to wrestle me. At the next tour show, give me a match. If Hold One is enough, it’s enough. The decision is mine.',
    replies:[
     {style:'straight',ask:'accept',text:'You have a match. You decide when a hold belongs in it.',reaction:'“Good.” He checks the briefcase once. “That is the whole agreement.”'},
     {style:'bureaucrat',ask:'defer',delta:-2,text:'Bring the request back in four weeks. I don’t have a slot for it today.',reaction:'He opens his pocket diary. “Four weeks. I write in ink.”'},
     {ask:'decline',delta:-10,text:'I’d only book it if you guarantee Hold Two. So we’re done.',reaction:'He lifts the briefcase from between you. “You have confused a hold with a ticket.”'}
    ]},
   'go-home':{invite:'One last drill. Seven. Watch the feet this time.',
    line:'If I get caught at the ropes, everybody will yell for Two. I need to know what you’ll do when they yell.',
    replies:[
     {style:'straight',text:'I’ll watch your feet. You’ll know what you have room for.',reaction:'He sets his feet again. “Good. Most people watch the hands.”'},
     {style:'believer',text:'I’ll let them yell. It’s your match.',reaction:'“Noise is legal.” He pulls the barn door wide open and starts the drill again.'}
    ]}
  },
  memories:[{id:'loose-latch',title:'The Open Latch',caption:'Week {week} · Hold Two stayed in the case.'}],
  payoff:'The briefcase stays shut until I need it. You can start with Hold One.',
  endings:{
   best:{title:'In His Own Grip',line:'2 Holds: “They called for Two. You kept your hands off the lock. I’ll remember that.”'},
   neutral:{title:'A Match, Plain and Simple',line:'2 Holds: “There was a bell. I got to wrestle. That was the agreement.”'},
   bad:{title:'Case Closed',line:'2 Holds: “The case stays with me. If they want to see something, tell them to come to the barn and learn Hold One.”'}
  }
 },
 18:{
  flag:'blank-card',kind:'promo',
  beats:{
   'blank-card':{flag:true,invite:'Tea. One place card has come back blank. I should value your discretion.',
    line:'Someone returned their place card without a name on it. In all the time I have been collecting secrets, this is the first one I’ve wanted to give back.',
    replies:[
     {style:'bureaucrat',text:'Treat it as withdrawn. Seal it and leave the place open.',reaction:'He slips the card into an envelope. “A withdrawal with no name attached. How beautifully enforceable.”'},
     {style:'straight',text:'Set another cup there. They can decide whether to sit.',reaction:'He warms an extra cup. “How rude of you to make such a good suggestion.”'},
     {breaks:true,text:'It’s a blank card, Charming. Nobody is playing your little game.',reaction:'“How reassuring.” He sets your cup on the blank card, where it leaves a ring.'}
    ]},
   ask:{echoes:["The envelope remains sealed. I rather like being the only one who knows nothing.", "I kept the cup warm. Do you know, I enjoyed having somewhere a guest could choose to sit?", "My cup left a mark on that card. For once I know precisely whose mark it was."],invite:'I have prepared a public apology. Please come before I reconsider the adjective.',
    line:'I have been lovely to a great many people just before hurting them. I should like to tell them that, out loud, at the next tour show. One microphone. The apology is mine to make.',
    replies:[
     {style:'bureaucrat',ask:'accept',text:'One public statement. The wording is yours. You have the microphone.',reaction:'He puts his prepared statement face down. “I may have to write one without the word ‘regrettably.’”'},
     {style:'straight',ask:'defer',delta:-2,text:'Keep the statement sealed. Bring it back in four weeks.',reaction:'He holds the envelope over the steam from his tea. Then he puts it away, still sealed.'},
     {ask:'decline',delta:-10,text:'I’m taking the microphone out of it. Leave the apology at the table.',reaction:'“Of course, darling.” He collects his own place card first.'}
    ]},
   'go-home':{invite:'Rehearsal. I’ve crossed out “if anyone was offended.” Twice.',
    line:'I can say what I did. I keep catching myself asking them to forgive me in the next sentence. How very greedy of me.',
    replies:[
     {style:'bureaucrat',text:'End the statement after what you did. Their response is their business.',reaction:'He folds the bottom of the page underneath. “They may say anything at all. Dreadful. Fair.”'},
     {style:'straight',text:'Say it to the empty chair first. Wait through the silence.',reaction:'He does. When the kettle clicks, he lets it click.'}
    ]}
  },
  memories:[{id:'blank-card',title:'The Unclaimed Seat',caption:'Week {week} · One place at tea stayed open.'}],
  payoff:'I’ve said “after you” to people so I could get behind them. I’ve remembered birthdays so I’d know when to send a threat. It was exquisitely rude. I’m sorry. You may do whatever you like with that.',
  endings:{
   best:{title:'An Apology, Properly Addressed',line:'Charming: “I left the silence in. Thank you for resisting the urge to rescue me from it.”'},
   neutral:{title:'Kind Regards, In Public',line:'Charming: “They heard me out. I’d rehearsed a very pretty way to ask for more. I managed to swallow it.”'},
   bad:{title:'Returned to Sender',line:'Charming: “I shall address the letters myself. I do hope you understand why I won’t be asking you to deliver them.”'}
  }
 },
 20:{
  flag:'returned-heart',kind:'promo',
  beats:{
   'returned-heart':{flag:true,invite:'Craft room. Someone put a heart BACK. Please bring scissors. The blunt ones.',
    line:'One of the hearts came back under the door. No note. I was halfway through making a bigger one when it occurred to me that this might be the answer.',
    replies:[
     {style:'hype',text:'Then we make a huge return slot! Everybody gets to decide what they keep.',reaction:'“A RETURN SLOT!” He cuts it wide enough for the biggest heart he ever made.'},
     {style:'believer',text:'Keep it somewhere safe. If they want it again, they know where to find it.',reaction:'He gives the heart a whole drawer. “No glitter. In case they don’t like glitter.”'},
     {breaks:true,text:'It’s construction paper. Throw it out.',reaction:'He slides it into his pocket. “I think I’ll take the trash out later.”'}
    ]},
   ask:{echoes:["I tried the return slot on an old valentine. It went right through. I only tried to fish it out once.", "That heart is still in its drawer. I used to open it to check. Today I forgot until you got here.", "I kept the one you told me to throw out. I’m finally listening to what it said."],invite:'I figured out what to do with the lockbox. Can you come see?',
    line:'A heart came back under the door. I keep calling it stealing hearts, but I get real sore when somebody wants theirs back. At the next tour show, can I take the mic and tell people they get to choose?',
    replies:[
     {style:'hype',ask:'accept',text:'Yes! Give the whole hall a choice. A grand gesture with the lid wide open.',reaction:'He pops the lockbox open. “Look! It stays open all by itself!”'},
     {style:'believer',ask:'defer',delta:-2,text:'Keep the box here for now. Ask me again in four weeks.',reaction:'“Okay.” He props the lid up with a glue stick. “I’m practicing.”'},
     {ask:'decline',delta:-10,text:'I’m done giving the lockbox space on the show.',reaction:'He takes the ribbon off the handle. “I can carry it out without the bow.”'}
    ]},
   'go-home':{invite:'Dress rehearsal! It’s just me and one paper heart. Which is terrifying.',
    line:'When I open it, I’m scared nobody will come get a heart. I’m a little more scared I’ll start handing them out anyway.',
    replies:[
     {style:'hype',text:'OPEN THAT BOX. Then hands on your knees. We can cheer without lining up.',reaction:'He plants both palms on his knees. “I can do this. I can do this LOUDLY.”'},
     {style:'straight',text:'Put it down where people can reach it and take a step back.',reaction:'He takes one tiny step, then an honest one. “Oh. There’s room for someone else now.”'}
    ]}
  },
  memories:[{id:'returned-heart',title:'The Heart That Came Back',caption:'Week {week} · He made room for it.'}],
  payoff:'The lid is open! Take a heart if you want one. Bring one back if you need to. I’ll be right here with both hands on my knees, loving this room like crazy.',
  endings:{
   best:{title:'Room for Every Heart',line:'The Grinch: “Some people took one. Somebody put one back. I didn’t chase ANYBODY. Aren’t you proud of me?”'},
   neutral:{title:'The Unlocked Box',line:'The Grinch: “I opened it. My hands went straight for the hearts, so I sat on them. It mostly worked.”'},
   bad:{title:'The Hearts Go Home',line:'The Grinch: “I put the box by the craft-room door. Anyone can still come by. I won’t be watching through the window.”'}
  }
 },
 31:{
  flag:'minority-report',kind:'promo',
  beats:{
   'minority-report':{flag:true,invite:'Special session. The minutes have a blank where my answer should be.',
    line:'They asked if the back row should get the same number of chairs as the front. I abstained. The back row stood for two hours. There is no place in these minutes for what my abstention did.',
    replies:[
     {style:'bureaucrat',text:'Add an amendment. Record the consequence alongside the vote.',reaction:'He writes “BACK ROW STOOD” beside his own name. He doesn’t reach for an eraser.'},
     {style:'straight',text:'Take a chair to the back row. Then write down why.',reaction:'He carries his own folding chair to the back wall. He returns standing.'},
     {breaks:true,text:'Forget the minutes. Just admit neutrality’s a bit.',reaction:'He files the minutes, unstamped. “The back row is still standing, by the way.”'}
    ]},
   ask:{echoes:["I filed the amended minutes. The consequences are now in larger type than my abstention.", "They kept the chair. I considered asking for it back, then remembered why I’d carried it over.", "The minutes are still unstamped. I took them to the back row anyway."],invite:'Motion to address the floor. I am the moving party, apparently.',
    line:'I’ve written one sentence about the back row, with my name on it. It takes a side. I’d like the microphone at the next tour show, before I find a reason to table it.',
    replies:[
     {style:'bureaucrat',ask:'accept',text:'Motion carried. One microphone for one statement. Your name stays on it.',reaction:'Ron initials the margin. “I have never seen my own initials take up so much room.”'},
     {style:'straight',ask:'defer',delta:-2,text:'Put it on the agenda in four weeks. Keep your name on it.',reaction:'He sets a date and leaves his name where it is. “The mover retains the floor, provisionally.”'},
     {ask:'decline',delta:-10,text:'I’m taking the statement off the agenda. There won’t be a reading.',reaction:'He closes the folder. “Then let the minutes show who took it off.”'}
    ]},
   'go-home':{invite:'Sound check. Could you ask me what I think, on the record?',
    line:'I can read it. I may say “for the avoidance of doubt” six times first. Do you have a procedural objection?',
    replies:[
     {style:'bureaucrat',text:'A point of order. The floor is yours as soon as you say “I.”',reaction:'He says “I” into the dead microphone. There’s a little hiss from the speaker anyway.'},
     {style:'straight',text:'Tell me the sentence, Ron.',reaction:'He looks up from the paper and tells you. It takes less time than unclicking his pen.'}
    ]}
  },
  memories:[{id:'minority-report',title:'The Amended Minutes',caption:'Week {week} · The consequences made it into the record.'}],
  payoff:'My name is Ron Toledo. I think the back row deserves everything the front row gets. That is my opinion. You can put a period there.',
  endings:{
   best:{title:'On the Record',line:'Ron: “Someone in the back row disagreed with me. I shook their hand. It turns out you can do both.”'},
   neutral:{title:'One Vote Recorded',line:'Ron: “I read it. Then I read my name underneath it. I hadn’t meant to, but I’m glad I did.”'},
   bad:{title:'Motion Tabled',line:'Ron: “I’m leaving my name on the motion. The next person who opens this folder can decide whether to read it.”'}
  }
 },
 34:{
  flag:'second-headset',kind:'appearance',
  beats:{
   'second-headset':{flag:true,invite:'Safehouse. A second channel has opened. Bring the phone.',
    line:'The signal came back on lane nine. I had the source in sight. Then the kid two lanes over dropped his ball. I went to help him. By the time I looked back, the source was gone.',
    replies:[
     {style:'straight',text:'The kid needed help. You did your job. We can pick up the signal later.',reaction:'He makes one mark in his notebook. “First time I’ve called a missed contact a completed job.”'},
     {style:'believer',text:'Maybe that was the real assignment.',reaction:'He turns the notebook over. “I’ll need a new cover sheet.”'},
     {breaks:true,text:'There was never any signal. It’s a bowling alley.',reaction:'He pockets the receiver. “The kid was real. Start there.”'}
    ]},
   ask:{echoes:["I closed out the lane-nine file. The kid came back yesterday. He can lift the ball now.", "I wrote a new assignment. It fits on one line.", "You can keep your opinion of the signal. I needed you to hear the rest."],invite:'Need a body at the other end of the line. Sunday. Booth.',
    line:'I know how to get myself out. I need practice staying where people can see me. Give me a match at the next tour show. Keep the line open until the bell.',
    replies:[
     {style:'straight',ask:'accept',text:'You have a match. I’ll be there when it starts, and I’ll be there when it ends.',reaction:'He puts a spare earpiece on the table. “Your channel. Use it if you need it.”'},
     {style:'bureaucrat',ask:'defer',delta:-2,text:'I don’t have a match slot. Call me again in four weeks.',reaction:'He changes one number in his notebook. “Four weeks. Same line.”'},
     {ask:'decline',delta:-10,text:'I’m closing this channel. There’s no match coming through it.',reaction:'He sets the receiver down while it’s still connected. The little click is the only answer.'}
    ]},
   'go-home':{invite:'Radio check. One quiet word is enough.',
    line:'When a crowd goes quiet, I start looking for the exit. Say something I can hear in that second.',
    replies:[
     {style:'straight',text:'Still here.',reaction:'He waits the length of one breath before answering. “Still here.”'},
     {style:'believer',text:'Lantern to Liam. Hold your position.',reaction:'His hand comes away from the exit map. “Copy. Holding.”'}
    ]}
  },
  memories:[{id:'second-headset',title:'The Second Channel',caption:'Week {week} · One call went unanswered. Another didn’t.'}],
  payoff:'I counted the exits. Then I counted the people who stayed. This time, I stay with them.',
  endings:{
   best:{title:'Line Stayed Open',line:'Liam: “There was a second when I couldn’t hear the room. I heard you. I stayed.”'},
   neutral:{title:'On His Own Channel',line:'Liam: “The room went quiet. I stayed anyway. You can put that in the report.”'},
   bad:{title:'Frequency Closed',line:'Liam: “You can keep the earpiece. If you ever call, I’ll decide whether to pick up.”'}
  }
 },
 37:{
  flag:'borrowed-bell',kind:'appearance',
  beats:{
   'borrowed-bell':{flag:true,invite:'yard now. i found the bell. it knows my name.',
    line:'Bev rang the bell to see if I would come. I came. Then I brought it here so it could ring for me. Bev says it has to ring for everybody.',
    replies:[
     {style:'believer',text:'Bring it back, good dog. Next time it rings for you, wait for the referee to call you in.',reaction:'He picks up the bell by its handle. “I can be first to hear it and last to move. Watch me.”'},
     {style:'bureaucrat',text:'Let’s write down who’s allowed to ring it and who’s supposed to listen.',reaction:'He pushes the bell toward you. “Write my name under Listen. Big letters.”'},
     {breaks:true,text:'Drop it. I’m done indulging you.',reaction:'He sets it down gently and sits between it and the gate. “Bev can have it. You can wait.”'}
    ]},
   ask:{echoes:["I brought the bell back to Bev. She said “good.” I waited for “dog.” She said it.", "Bev read your list. I listened while she read the whole thing. Even the boring part.", "Bev got the bell back. I waited until she came for it. I waited for you, too."],invite:'read page 41 again. then come outside. good news for dogs.',
    line:'Page 41 still doesn’t say dogs. I don’t want a treat for finding the loophole. I want a match at the next tour show. Same bell, same rules. Will you put me on?',
    replies:[
     {style:'believer',ask:'accept',text:'Good dog. You have a match. Same bell, same rules.',reaction:'He grins and presses both palms to his knees so he won’t spring up early. “I can wait.”'},
     {style:'bureaucrat',ask:'defer',delta:-2,text:'Bring page 41 back in four weeks. The request stays open until then.',reaction:'He folds the corner, then flattens it. “I know the page. I don’t have to mark it.”'},
     {ask:'decline',delta:-10,text:'I’m closing the request. I’m done arguing page 41.',reaction:'“It still doesn’t say dogs.” He keeps the book and leaves the gate open behind him.'}
    ]},
   'go-home':{invite:'practice bell. please do a little ring and then a real ring.',
    line:'I heard a spoon hit a coffee cup and nearly ran into the ring. How do I know which bell is mine?',
    replies:[
     {style:'believer',text:'Look at the referee. When they’re ready, it’s yours. Stay, boy.',reaction:'You tap the bell. He looks up at you and stays. Then he looks at the referee’s empty chair and stays harder.'},
     {style:'straight',text:'A bell is a sound. The ref is the signal. Watch their hands.',reaction:'His eyes follow your raised hand. “Hands, then bell, then GO. Okay. Again.”'}
    ]}
  },
  memories:[{id:'borrowed-bell',title:'The Borrowed Bell',caption:'Week {week} · It had to ring for everybody.'}],
  payoff:'Page 41 still says what it says. I am a dog. I’m waiting for the same bell you are. Ref, I’m watching your hands.',
  endings:{
   best:{title:'His Bell to Answer',line:'The Dog: “I waited. The ref said go. The whole room heard my bell. Good bell. GOOD bell.”'},
   neutral:{title:'A Dog’s Day',line:'The Dog: “I moved my feet a little before the bell. Just my feet. The rest of me waited.”'},
   bad:{title:'Still on Page 41',line:'The Dog: “I read it again. I’m keeping the book. If anybody wants to check, I’ll be in the yard.”'}
  }
 }
};
