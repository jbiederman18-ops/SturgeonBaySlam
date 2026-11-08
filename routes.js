'use strict';
// Relationship dialogue and route data. No logic lives here: relationships.js reads it.
// Owned by the dialogue writer. Shape and rules: claude/dialogue-writer-handoff.md in the project.
// Every line is in kayfabe. AGENTS.md's hard character rule applies to every string in this file.
//
// ───────────────────────────── FORMAT (read by relationships.js) ─────────────────────────────
// FEATURED_ROUTES[id] — one per featured wrestler
//   speaker, style ('believer'|'straight'|'hype'|'bureaucrat'), place, days? (['Sunday']), soreWeeks?
//   tells / invite / signoff / sore            as today
//   scenes:[scene]                             drop-in evenings, cycled in order (aim for 5–6)
//   set?:   stage backdrop for cutscenes: 'olympus'|'barn'|'hall'|'tea'|'craft'|'library'|'lanes'|'yard'
//           (defaults by wrestler; only set it to move someone)
//   time?:  clock shown on the cutscene title card, e.g. '7:15 PM' (default by wrestler)
//   reacts?:{kept,broken}                      one sentence each, shown in post-show fallout instead of
//                                              “Trust +8”. Missing → the wrestler’s current tell is shown.
//   epilogue?:{best,neutral,bad}               each {title,line}: era-end card for a route that isn’t
//                                              finished. Missing → a plain card built from the tell.
//   moods?:{low?,high?}                       each {style,tell}. The week after a loss (low) or win (high) they warm
//                                              to `style` instead of their own; `tell` replaces the opening tell.
//   distrusts?:style                           if the locker room has you down as this style, every reply lands 2 softer.
//   stale?:'…'                                 their line when you’ve given them the same style three times running.
//   heard?:'…{name}…'                          their line when something you said to {name} (a reply's `sides`) got back.
//   jealous?:'…{name}…'                        said when you’ve been warming up their rival ({name}).
//                                              Missing → a line of narration instead.
//   backstage?:{kind:moment}                   after-show walk: who comes up to you, and why. Kinds:
//                                              won · lost · stole (match of the night) · flat (a D grade) · kept · broken
//                                              (a promise this show) · benched (left off while a rival worked) · idle (off
//                                              4+ weeks) · cutIn (interrupting a rival's talk) · skip (a line of narration:
//                                              sore, walks past without stopping). Missing kinds use BACKSTAGE_GENERIC.
//     moment = {tell, line, replies}           tell = narration as they walk up; line = what they say; replies as below
//                                              (promise defaults to next week; 'rematch'/'team' target {name}).
//     Placeholders: {name} the other wrestler (opponent, rival, or who they cut in on) · {speaker} · {promise}.
//     WHEN keys for cases: wonTonight · lostTonight (lostLastShow/wonLastShow mean tonight here) · champion · minTrust · eventWeek.
//
// ROUTE_STORIES[id] = {opens?, beats, memories, endings}
//   opens:   conditions (see WHEN) for the whole route. Default {visits:1}: one drop-in evening first.
//            Sweeps uses {afterSpotlight:true} so his spotlight month in stories.js plays out first.
//   beats:   {beatId: beat, …} IN PLAY ORDER. Kinds:
//     'beat'  (default) the build-up ladder. Played in order; the next one waits until its `when` holds.
//     'flag'  one-week-only event. Offered the first week its `when` holds; ignored or unanswered = gone.
//             It never blocks the ladder.
//     'ask'   the climax. Offered once the ladder is done and `when` holds. Replies carry
//             ask:'accept'|'defer'|'decline'. Deferring asks again `again` weeks later (default 4).
//     'final' optional. Plays in the week the accepted Ask is due (Sweeps’ vigil). Attending it
//             is what turns a kept promise into the best ending.
//   beat = {kind?, when?, cue, invite?, day?, memory?, plan?, line, replies}
//     cue     plain English for writers: when this should happen. The engine reads `when`.
//     invite  text that arrives instead of the usual invitation.
//     day     fixes the evening (e.g. 'Friday'); otherwise their `days` or a free weeknight.
//     memory  id in `memories`: answering this scene pins that polaroid to their window card.
//     plan    story-beat text pencilled onto the booking sheet in the week a reply’s promise is due.
//   Ask-only: askPromise:{kind:'title'|'promo'|'appearance'|'win'|'team', due:'event'|weeks, target?, plan?}
//     default {kind:'title',due:'event'} = a championship match at the next monthly show.
//   Reply fields: style, text, reaction, breaks?, promise?, due?, delta?, ask?,
//     truth? (a hard truth: −2 trust, morale +4, no sore. The blunt answer that is sometimes right),
//     morale? (change to their morale), sides? ({id:delta} trust for wrestlers who hear about it; negative = they’re told),
//     cases? ([{when,delta?,reaction?,morale?,sides?}] first case whose WHEN holds overrides the reply that week),
//     askDue? (Ask accept only: weeks from now, overrides askPromise.due — “the wrong show”),
//     cap?:'neutral' (Ask accept only: the best this answer can end with).
//   WHEN keys (all must hold): minTrust:n · visits:n (drop-in evenings had) · afterSpotlight:true ·
//     workedLastWeek:true · lostLastShow:true · wonLastShow:true · eventWeek:true · notEventWeek:true ·
//     champion:true|false · withLastWeek:id (that wrestler also worked last week)
//   memories:[{id,title,caption}] caption may use {week}. Every memory pinned = the Main Event banner.
//   endings: {best,neutral,bad} each {title,line}.
// A story missing its Ask (with accept and decline) or any ending is skipped until it’s complete:
// the wrestler keeps their drop-in scenes meanwhile. Engine notes for writers are marked TODO(dialogue).
// ─────────────────────────────────────────────────────────────────────────────────────────────

const FEATURED_ROUTES={
 0:{speaker:'Greek',style:'hype',place:'Mount Olympus (the St. Elbow’s boiler room)',
  tells:{wary:"Greek measures your stance before deciding whether to offer a hand.",friendly:"He makes room beside his Greco Wrestling practice circle.",warm:"He lets you hold the laurel while he demonstrates the grip again.",devoted:"He introduces you as the mortal bringing Greco Wrestling to every corner of Greece."},
  moods:{
   low:{style:'believer',tell:"Greek reties his laurel without looking at the practice circle."},
   high:{style:'hype',tell:"Greek has written GRECO WRESTLING above his name; his name is still considerably larger."}
  },distrusts:'bureaucrat',
  stale:"Yes, yes, glory; which part of my Greco Wrestling inspired this identical proclamation?",
  heard:"{name} repeated your judgment; does a kick to the head now qualify as Greco Wrestling?",
  invite:{wary:"Greek is studying Greco Wrestling. Visitors may stand outside the circle.",friendly:"A Greco Wrestling demonstration awaits; Greek has reserved the best vantage.",warm:"Come witness the latest Greco Wrestling discovery. Bring something worthy of recording it."},
  signoff:{wary:"Mind the practice circle, mortal.",friendly:"Tell Greece what you witnessed.",warm:"Tomorrow, another Greco Wrestling discovery.",devoted:"When Greece speaks of Greco Wrestling, your name shall follow mine."},
  sore:"Mock my Greco Wrestling again and seek another patron among the gods.",
  reacts:{kept:"Greek records the fulfilled promise beside a diagram of his newest Greco Wrestling grip.",broken:"Greek scratches your promise from his notes hard enough to tear the page."},
  jealous:"Greek tightens his laurel. “{name} gets an audience while the foremost scholar of Greco Wrestling waits?”",
  backstage:{
   won:{tell:"Greek redraws the winning grip on the back of the results sheet.",
    line:"“Another victory for Greco Wrestling; do announce the discipline before the champion.”",
    replies:[
     {style:'believer',text:"That grip held when the pressure came. Your research paid off.",reaction:"He taps the diagram. “Evidence fit for the academies.”"},
     {style:'hype',promise:'promo',text:"Take the mic next week and show them how Greco Wrestling won it.",reaction:"He raises his laurel. “A lecture Greece will request by name.”"},
     {truth:true,text:"The result is yours. Remember what your opponent made you change to earn it.",reaction:"He adds an arrow. “An objection worthy of a footnote.”"}
    ]},
   lost:{tell:"Greek keeps testing the grip that failed, with nobody between his hands.",
    line:"“My shoulders fell, but Greco Wrestling has not been disproven by a single evening.”",
    replies:[
     {style:'believer',text:"One defeat does not erase the discipline. Work out where the grip slipped.",reaction:"He closes his hands again. “Yes; a failed application, not a ruined civilization.”"},
     {style:'hype',promise:'rematch',text:"You and {name} next week. Give the inquiry another trial.",reaction:"He frowns at his hands. “A second trial; I have not yet understood the first.”"},
     {truth:true,text:"{name} beat that grip tonight. Study the escape before you use it again.",reaction:"He opens his notebook. “Then that is the first diagram, however unpleasant.”"}
    ]},
   stole:{tell:"Greek carries his laurel and a page covered in grip diagrams.",
    line:"“They watched every hand placement; Greece has acquired a taste for Greco Wrestling.”",
    replies:[
     {style:'believer',text:"Give your opponent credit. That resistance made the grip worth watching.",reaction:"He writes a second name. “A worthy opponent belongs in the record.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He marks the losing grip. “Even this part kept their attention; I shall study it.”"}]},
     {style:'hype',text:"Keep that contest in their minds before you announce the next one.",reaction:"“The foremost exhibition of Greco Wrestling.” He tries the proclamation at full volume."},
     {style:'straight',text:"Remember which exchange brought them closer. Build from that.",reaction:"He circles a diagram. “Here; the question became interesting here.”"}
    ]},
   flat:{tell:"Greek displays a grip diagram to a hallway that is already empty.",
    line:"“I explained Greco Wrestling thoroughly; why did the citizens discuss nachos throughout?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You are on next week. Show the grip working before you explain the whole discipline.",reaction:"He folds away three pages. “A demonstration before the symposium.”"},
     {style:'believer',text:"Which grip would you keep even without applause?",reaction:"He raises both hands. “This one; observe the shoulder.”"},
     {truth:true,text:"They need a contest to care about before they need a lecture.",reaction:"He closes his notes. “Then the lecture shall begin with opposition.”"}
    ]},
   kept:{tell:"Greek places a tick beside your promise in his research notebook.",
    line:"“You delivered {promise}; the study of Greco Wrestling finally enjoys a dependable patron.”",
    replies:[
     {style:'believer',text:"Tell me what the opportunity let you learn.",reaction:"He opens three pages at once. “Begin with the grip; the gods can wait.”"},
     {style:'hype',text:"Tell the town what that promise made possible.",reaction:"He lifts the notebook. “Greece shall hear the patron’s name immediately after mine.”"}
    ]},
   broken:{tell:"Greek holds out the notebook at the page bearing your promise.",
    line:"“Without {promise}, this page contains no Greco Wrestling whatsoever; explain this scholarly catastrophe.”",
    replies:[
     {style:'believer',text:"I broke the commitment. Let us discuss what you need before I promise another slot.",reaction:"He keeps the page open. “An accurate account may precede the remedy.”"},
     {style:'hype',promise:'appearance',text:"You are on next week. I will put a firm date beside that empty page.",reaction:"He readies his pen. “A date is a beginning; a contest will be better.”"},
     {breaks:true,text:"Wait for the printed card before planning around a slot next time.",reaction:"He shuts the notebook. “Then your word is merely an unpublished rumor.”"}
    ]},
   benched:{tell:"Greek studies the poster from the curb, his practice notes tucked beneath his laurel.",
    line:"“{name} receives a contest while Greco Wrestling waits outside; is this province still rewarding barbarism?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You are booked next week. Give them a reason to ask for Greco Wrestling.",reaction:"He steps down from the curb. “A civilization can recover quickly.”"},
     {style:'believer',text:"What did watching that contest teach you about your next opponent?",reaction:"He opens his notes. “Several things to forbid, and one grip to investigate.”"},
     {truth:true,text:"You need a match that advances your work, not just an answer to every rival.",reaction:"He draws a fresh circle. “Then my inquiry shall choose the opponent.”"}
    ]},
   idle:{tell:"Greek has worn a practice circle into the gravel beside the parking lot.",
    line:"“Four weeks of Greco Wrestling without an opponent; the gravel offers insufficient resistance.”",
    replies:[
     {style:'hype',promise:'appearance',text:"You are wrestling next week. Bring the research back inside.",reaction:"He dusts off the laurel. “Let the gravel recover.”"},
     {style:'believer',text:"What have you learned while waiting?",reaction:"He demonstrates a grip on empty air. “Much, but the evidence has been excessively agreeable.”"},
     {style:'straight',text:"Give me the dates you can work so I can plan a return.",reaction:"He counts them out. “Greece may call upon its scholar on any of these evenings.”"}
    ]},
   cutIn:{tell:"Greek plants himself just beyond the reach of the other wrestler’s boot.",
    line:"“{name} may speak, but a kick to the skull will never become an argument for Greco Wrestling.”",
    replies:[
     {style:'hype',text:"Make your case with the grip you want them to remember.",reaction:"He lowers his hands into position. “This is an argument that can withstand examination.”",cases:[{when:{wonTonight:true},morale:2,reaction:"He adjusts the laurel. “Tonight’s victory is already entered into evidence.”"}]},
     {style:'believer',text:"You can defend Greco Wrestling without settling the whole quarrel here.",reaction:"He takes a measured step back. “The inquiry will resume on suitable ground.”"},
     {style:'straight',text:"One conversation at a time. You will each get a turn.",reaction:"He keeps his distance. “Very well; no sudden demonstrations while I wait.”"}
    ]},
   skip:"Greek carries his Greco Wrestling notes past you without stopping, turning the page before you can address him."
  },
  epilogue:{
   best:{title:"The Name Above the Grip",line:"Greek taps his notes. “They ask for Greco Wrestling now, and then they ask for me.”"},
   neutral:{title:"Further Fieldwork",line:"Greek redraws a grip. “Greece requires another demonstration; fortunately, I remain available.”"},
   bad:{title:"A Scholar Without a Contest",line:"Greek practices alone. “A civilization that will not witness Greco Wrestling cannot expect to advance.”"}
  },
  scenes:[
   {line:"Liam proposes kicking during our contest; by which barbarian amendment did feet enter Greco Wrestling?",replies:[
    {style:'hype',text:"Take the mic this week and tell the town what Greco Wrestling demands.",promise:'promo',reaction:"He raises his laurel. “Let every province hear the proper rules.”",
     cases:[{when:{lostLastShow:true},delta:-2,reaction:"He lowers the laurel. “I was defeated, mortal; a louder explanation will not restore my grip.”"}]},
    {style:'believer',text:"Hear his challenge, then insist on answering it with Greco Wrestling.",reaction:"“A kick answered by a throw.” He sketches the grip. “Civilization may yet prevail.”"},
    {breaks:true,text:"Wait until the match is signed; I cannot print another set of rules tonight.",reaction:"He rolls up the diagram. “Then ignorance enjoys another evening unopposed.”"}]},
   {line:"Ron refuses to declare Greco Wrestling supreme; must I demonstrate every inferior alternative before he abstains again?",replies:[
    {style:'hype',text:"Take the mic this week. Make the case for Greco Wrestling where everyone can hear.",promise:'promo',reaction:"He spreads his arms. “Athens shall have a demonstration worthy of its parking capacity.”"},
    {style:'believer',text:"Ron refuses every endorsement. At least he has not endorsed another style.",sides:{31:2},reaction:"Greek considers this. “A vacant throne is preferable to a usurper.”"},
    {breaks:true,text:"Let Ron abstain. I need both of you ready before doors.",reaction:"“Greece grows timid.” He resumes his grip drill with considerable force."}]},
   {line:"Joan brought a scarf for my Greco Wrestling demonstration; is this the ceremonial belt of her city-state?",replies:[
    {style:'hype',text:"Salute Joan in front of the crowd and let her present it herself.",reaction:"“An ambassador!” He holds the scarf aloft. “Reserve a place beside the laurels.”"},
    {style:'believer',text:"Ask her what it means before you put it in your research notes.",reaction:"He uncaps his pen. “Fieldwork requires a reliable witness.”"},
    {breaks:true,text:"Put it at the ticket table; we can handle the presentation later.",reaction:"He gathers it up. “I shall not abandon a diplomatic offering beside the float.”"}]},
   {line:"A challenger climbed the ropes; I have brought a ladder to inspect this elevated misunderstanding of Greco Wrestling.",replies:[
    {style:'hype',text:"You have a match this week. Show them your answer from the canvas.",promise:'appearance',reaction:"He steps away from the ladder. “Greco Wrestling needs no second floor.”"},
    {style:'believer',text:"Study the landing from below. That is where your grip can answer it.",reaction:"He draws a circle beneath the ladder. “The earth remains undefeated.”"},
    {truth:true,text:"Leave the ladder alone. A fall here ends your research before the match.",reaction:"He removes his boot from the rung. “A scholar must survive the demonstration.”"}]},
   {line:"Liam left a wooden sword at my door; first the kick, now weaponry—is he constitutionally incapable of Greco Wrestling?",replies:[
    {style:'hype',text:"Return it publicly and tell him a grip would be a more convincing challenge.",sides:{34:-3},reaction:"Greek tests the sword’s weight. “Let the barbarian explain why his hands require an accessory.”",
     cases:[{when:{wonLastShow:true},delta:3,reaction:"He sets it aside. “I have had my victory; humiliating him will teach me nothing further.”",sides:{}}]},
    {style:'believer',text:"Ask what he wants before deciding this is another attack.",reaction:"He opens the door a little. “He may speak from beyond kicking distance.”"},
    {breaks:true,text:"Put it away until your match is booked. We cannot settle the whole grudge tonight.",reaction:"“Then the evidence remains.” He places it across the doorway."}]}
  ]},
 1:{speaker:'2 Holds',style:'straight',place:'The training barn',
  tells:{wary:'He keeps the HOLD TWO briefcase chained to his wrist and his back to you.',friendly:'He demonstrates Hold Number One. Again.',warm:'He lets you carry the locked HOLD TWO briefcase.',devoted:'He lets you carry the briefcase and no longer checks that it is still locked.'},
  moods:{
   low:{style:'believer',tell:"He has drawn two grip diagrams and keeps returning to the same gap between the fingers."},
   high:{style:'straight',tell:"He marks a tiny correction beside Hold One, then prepares a clean page for Hold Two."}
  },distrusts:'hype',
  stale:"I practice the same two holds every day; your answer is somehow making less progress.",
  heard:"{name} repeated your explanation; it did not establish whether that was Hold One or Hold Two.",
  invite:{wary:"The practice light is on. Hold One has not concluded.",friendly:'Practicing Hold One tonight. You may observe.',warm:"Seven. Hold One, then Hold Two. Bring water; mastery takes time."},
  signoff:{wary:'That was Hold One. Leave.',friendly:'Hold One. Always Hold One.',warm:'Tell no one about the briefcase.',devoted:"Both holds require further practice. You may observe again."},
  sore:'You tried to hurry me along. I remember. Hold One does not hurry.',
  reacts:{kept:'2 Holds gives you one firm nod, from the proper stance.',broken:'2 Holds takes the briefcase back without looking at your hand.'},
  jealous:"2 Holds resets his grip. “An evening with {name}, and still no useful account of either hold?”",
  backstage:{
   won:{tell:"2 Holds measures the space between his heels against his notes.",
    line:"“Hold One won; the pressure was almost correct, which leaves useful work for tomorrow.”",
    replies:[
     {style:'straight',text:"The far heel stayed planted when the weight shifted.",reaction:"He marks the page. “That correction is confirmed.”"},
     {style:'believer',text:"Use my wrist. Let me feel the difference you are working toward.",reaction:"He takes the grip. “Half a millimeter; it matters.”"},
     {style:'hype',promise:'promo',text:"Take the mic next week. Show them what changed.",reaction:"He closes the case. “They will need an unobstructed view of the thumb.”"}
    ]},
   lost:{tell:"2 Holds traces the gap in his Hold One diagram.",
    line:"“They called the escape a third thing; I call it an imperfection in Hold One.”",
    replies:[
     {style:'believer',text:"The hold is still worth mastering. Find the gap again.",reaction:"He positions your wrist. “Yes; the discipline remains exactly two holds.”"},
     {style:'straight',promise:'rematch',text:"You and {name} next week. Test against the same resistance.",reaction:"He marks one variable. “A useful repeat.”"},
     {truth:true,text:"The grip failed. Opening the case will not explain why.",reaction:"He leaves the latch alone. “Hold One first; no distraction.”"}
    ]},
   stole:{tell:"2 Holds waits for the noise to stop before counting his grip corrections.",
    line:"“The audience noticed the thumb adjustment; standards may finally be improving.”",
    replies:[
     {style:'straight',text:"They could see both of you fighting for that inch. Keep it visible.",reaction:"He measures it. “An inch contains considerable Hold One.”"},
     {style:'believer',text:"They wanted to know whether the grip would hold.",reaction:"He nods. “A worthwhile question about an established hold.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He studies his palm. “Even failure attracted close examination. Useful.”"}]},
     {style:'hype',text:"You moved the whole room with a tiny correction.",reaction:"He examines his thumb. “The room moved more than necessary.”"}
    ]},
   flat:{tell:"2 Holds repeats the grip facing the empty side of the hall.",
    line:"“They asked for something else after Hold Two; I cannot improve an audience that refuses to count.”",
    replies:[
     {style:'straight',text:"Turn the grip toward the far seats so they can see the work.",reaction:"He rotates slightly. “Same hold. Better evidence.”"},
     {style:'believer',text:"Show me what they missed. I will stand at the back.",reaction:"He settles his feet. “Watch the thumb. Then the other thumb.”"},
     {breaks:true,text:"Shorten the demonstration. People had rides waiting.",reaction:"He closes the case. “Then state the time limit before I begin explaining both holds.”"}
    ]},
   kept:{tell:"2 Holds ticks your promise beside a Hold One practice entry.",
    line:"“You delivered {promise}; both holds can now be practiced on a reliable schedule.”",
    replies:[
     {style:'straight',text:"We both checked the commitment against what happened.",reaction:"He nods. “A repeatable standard.”"},
     {style:'believer',text:"Keep the record. You earned the time to do the work.",reaction:"He returns to the grip. “Time is how the hold improves.”"}
    ]},
   broken:{tell:"2 Holds keeps the closed case close and leaves an empty practice line facing you.",
    line:"“{promise} was scheduled; Hold One and Hold Two were both prepared.”",
    replies:[
     {style:'straight',text:"Leave the time blank. I missed the commitment.",reaction:"He underlines the gap. “Accurate. Unsatisfactory, but accurate.”"},
     {style:'believer',promise:'appearance',text:"You have a match next week. Make me earn the next tick.",reaction:"He draws a second box. “The first remains empty.”"},
     {breaks:true,text:"Record it as a card change. The crew needs one explanation.",reaction:"He closes the notebook. “Neither hold was improved by that explanation.”"}
    ]},
   benched:{tell:"2 Holds sets the case squarely on a parking stripe.",
    line:"“{name} worked tonight; I could not identify either hold in that display.”",
    replies:[
     {style:'straight',text:"Show me how you would answer what you saw. Start with the grip.",reaction:"He sets his feet. “Hold One was incomplete. Stand here.”"},
     {style:'believer',text:"Your two holds are worth the work. Demonstrate the part you would test.",reaction:"He offers his wrist. “Pressure here; now resist.”"},
     {truth:true,text:"Judging every other booking will not improve either of your holds.",reaction:"He moves the case aside. “Practice would be a better use of the evening.”"}
    ]},
   idle:{tell:"2 Holds has filled both sides of a page headed ONE and TWO.",
    line:"“Four weeks of refinement; I require an opponent who does not already know where I am placing the thumb.”",
    replies:[
     {style:'straight',promise:'appearance',text:"You have a match next week. Test the corrections there.",reaction:"He closes the notebook. “Same two holds, improved conditions.”"},
     {style:'believer',text:"Show me the change you are most certain about.",reaction:"He settles into the grip. “Certain enough to invite resistance.”"}
    ]},
   cutIn:{tell:"2 Holds sets the case down and demonstrates an unfinished grip.",
    line:"“{name} got free, but calling it a new move does not make wrestling contain more than two holds.”",
    replies:[
     {style:'straight',text:"When the grip opens, start it again. You can test where it failed.",reaction:"He makes a visible gap. “An unfinished Hold One. Exactly.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He resets both hands. “I should have corrected Hold One as soon as it opened.”"}]},
     {style:'believer',text:"Ask where the pressure stopped. You do not need a new name to learn that.",reaction:"He offers the grip. “A precise question. Answer it slowly.”"},
     {style:'bureaucrat',text:"Let the referee decide during the match. Investigate it at practice.",reaction:"He lifts the case. “Both holds will attend.”"}
    ]},
   skip:'2 Holds passes with the briefcase on the far side and the key already back in his pocket.'
  },
  epilogue:{
   best:{title:'A Grip You Can Trust',line:"2 Holds adjusts his thumb. “You noticed the correction. Both holds have benefited from your attention.”"},
   neutral:{title:'Still Hold One',line:"2 Holds opens his notes. “Hold One at seven, Hold Two afterward. Mastery is not a seasonal arrangement.”"},
   bad:{title:'No Further Demonstrations',line:"2 Holds closes the practice door. “No audience tonight. Both holds still require work.”"}
  },
  scenes:[
   {line:"Hour three of Hold One; the thumb has moved half a millimeter, so we are making excellent progress.",replies:[
    {style:'straight',text:"I see it. Keep the wrist in the same position while you test the change.",reaction:"He nods. “One variable; one hold.”",
     cases:[{when:{lostLastShow:true},delta:1,reaction:"He adjusts the thumb. “That is where Saturday went wrong. Still Hold One.”"}]},
    {style:'believer',text:"The hold is worth the work. Use my wrist for the next attempt.",reaction:"He sets the grip carefully. “Resistance improves Hold One.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He resets his heel. “Push harder than Saturday’s opponent; the hold can improve further.”"}]},
    {breaks:true,text:"One more minute, then finish. Someone needs to lock up.",reaction:"He releases the grip. “Mastery will resume before the next locking-up.”"}]},
   {line:"Someone at the shop called a demonstration “a handshake”; which of the two holds did he mean?",replies:[
    {style:'straight',text:"Test the grip in a match this week. You have a spot.",promise:'appearance',reaction:"He nods. “A controlled examination of Hold One.”"},
    {style:'believer',text:"He may not understand your terminology. Show him where the pressure goes.",reaction:"He positions his thumb. “An incomplete Hold One, then; a common problem.”"},
    {breaks:true,text:"Shake his hand and move on. Not every conversation needs a demonstration.",reaction:"He studies the offered hand. “It needs the correct name, at minimum.”"}]},
   {line:"The clock stole six minutes from Hold Two; I have repeated them, although my hand is now refusing to complete Hold One.",replies:[
    {style:'straight',text:"Reset the clock at the end of this round. Keep one time from there.",reaction:"He checks the dial. “Two holds; one clock. Sufficient.”"},
    {style:'believer',text:"You know how long you practiced. The clock can catch up afterward.",reaction:"He flexes his fingers. “The hands are the primary record.”"},
    {truth:true,text:"Your hand will not close. Stop for tonight; forcing the grip is making tomorrow’s practice harder.",reaction:"He reaches for the ice. “Recovery supports both holds. Tomorrow, from the beginning.”"}]},
   {line:"The Dog rolled out of Hold One; it was neither Hold One nor Hold Two, so I require a better view of what did not happen.",replies:[
    {style:'straight',text:"You have a match this week. Test the grip against proper resistance; the Dog’s explanation can wait.",promise:'appearance',sides:{37:-3},reaction:"He marks the mat. “An incomplete Hold One must be corrected before it spreads.”"},
    {style:'believer',text:"Let the Dog show the escape slowly. You can locate the gap in Hold One.",reaction:"He nods. “A gap in Hold One. That is a coherent explanation.”"},
    {breaks:true,text:"The Dog got free. Let the referee handle it and move on.",reaction:"He resets his feet. “The referee cannot practice the missing pressure for me.”"}]},
   {line:"Someone put me in what they called a “headscissors”; Hold Two is being described very carelessly these days.",replies:[
    {style:'straight',text:"Show me where the pressure was. Start with what you felt.",reaction:"He indicates two points. “There. Hold Two, from an inconvenient direction.”"},
    {style:'believer',text:"You know the two holds. Let us find which part needs work.",reaction:"He opens the notebook. “At last, a finite problem.”"},
    {breaks:true,text:"Ask the opponent what they call it. That will settle the wording faster.",reaction:"He closes the notebook. “I am studying the hold, not collecting incorrect names.”"}]}
  ]},
 10:{speaker:'Sweeps',style:'believer',place:'St. Elbow’s, after hours',
  tells:{wary:'He sweeps around you, the way you’d sweep around a puddle.',friendly:'He nods when you come in and keeps sweeping.',warm:'He sweeps a path for you when you walk in.',devoted:'He sweeps a path to your office every morning, whether or not you’re coming in.'},
  moods:{
   low:{style:'straight',tell:"Sweeps scrubs the same boot heel, then plants it twice to check where it slipped."},
   high:{style:'believer',tell:"Sweeps has polished the winning corner and is already chasing a speck toward the losing one."}
  },distrusts:'bureaucrat',
  stale:'You can go over a spot till the boards shine, boss. Still gotta take a look at the rest of the floor.',
  heard:"{name} repeated that, boss; help me understand while I get this bloody grit out of the seam.",
  invite:{wary:"Sweeps is working through a patch of dirt. Approach on the clean side.",friendly:"Sweeps is cleaning his usual spot tonight. Wipe your feet before joining him.",warm:"Floor’s filthy. Company’s welcome. For the love of clean boards, wipe your feet."},
  signoff:{wary:'Mind the dustpan.',friendly:'Keep it clean, boss.',warm:'Floor’s clean. So’s my conscience. Night, boss.',devoted:'Take the side door, boss. I swept you a way out.'},
  sore:'You brushed me off, boss. I know what that looks like. I sweep for a living.',
  reacts:{kept:'Sweeps takes an extra pass down the aisle where you’ll walk out.',broken:'Sweeps moves your chair to reach the boards under it and leaves it where he moved it.'},
  jealous:"Sweeps attacks a trail of glitter. “An evening with {name}, boss? Did the evening come in a bag that sheds?”",
  backstage:{
   won:{tell:"Sweeps celebrates by chasing confetti straight into the pan.",
    line:"“Won the match, boss; now the celebration has become a bloody cleaning job.”",
    replies:[
     {style:'believer',text:"That floor is part of your victory. Get it how you want it.",reaction:"He sweeps harder. “A clean win ought to leave a clean ring.”"},
     {style:'straight',text:"Empty the pan before the next pass. It is full.",reaction:"He empties it. “Look at that; one win, half a bin.”"},
     {style:'hype',promise:'promo',text:"Tell them on the mic next week what it takes to earn a clean win.",reaction:"He points at the confetti. “Starting with a ban on these tiny bastards.”"}
    ]},
   lost:{tell:"Sweeps cleans his boot heel, then the patch of floor beneath it.",
    line:"“Lost my footing, boss; floor is spotless now, so tell me exactly where I went wrong.”",
    replies:[
     {style:'straight',text:"You stood up before the second foot was planted. Try it slowly.",reaction:"He plants both feet. “There; a problem the broom cannot solve.”"},
     {style:'believer',text:"You can still put this right. Finish the boots, then we will look at the match.",reaction:"He wipes the last heel. “Both jobs getting done; good.”"},
     {style:'hype',promise:'rematch',text:"You and {name} next week. Another chance with both feet under you.",reaction:"He sweeps around his stance. “And nothing under them that should not be.”"}
    ]},
   stole:{tell:"Sweeps sweeps beneath a chair dragged right up to the rail.",
    line:"“They were on their feet for me, boss; apparently that meant dropping every wrapper they owned.”",
    replies:[
     {style:'believer',text:"They could not sit still. You gave them something worth standing for.",reaction:"He collects another wrapper. “Wonderful; they can stand near a bin next time.”"},
     {style:'straight',text:"Clean this row, then ask what got them up.",reaction:"He pushes the pan along. “I have a question about the peanuts too.”"},
     {style:'hype',text:"They will bring friends after that match.",reaction:"He looks over the clean row. “More people, more dirt; bigger broom.”"}
    ]},
   flat:{tell:"Sweeps brushes a carefully folded ticket stub off the floor.",
    line:"“Plenty of time to fold paper during my match, boss; no time to find a bin, naturally.”",
    replies:[
     {style:'straight',text:"You let the match pause too long before the next exchange.",reaction:"He bins the stub. “Right; keep the work moving.”"},
     {style:'believer',text:"Which exchange would you do again even without applause?",reaction:"He points with the broom. “That turn; clean as the floor ought to be.”"},
     {truth:true,text:"You had their attention early and waited until it wandered.",reaction:"He sweeps toward the next row. “Then I start sooner; here too.”"}
    ]},
   kept:{tell:"Sweeps finishes a patch before offering his freshly wiped hand.",
    line:"“You delivered {promise}, boss; one less mess to untangle while I handle the actual filth.”",
    replies:[
     {style:'believer',text:"You should be able to rely on the commitment.",reaction:"He shakes once, then resumes sweeping. “Good; dirt supplies enough surprises.”"},
     {style:'straight',text:"I kept it where I could see it on the sheet.",reaction:"He points at the bin. “Visible, dealt with; excellent system.”"}
    ]},
   broken:{tell:"Sweeps scrubs the threshold with short, furious strokes.",
    line:"“I cleared time for {promise}, boss; instead I am cleaning and trying not to shout.”",
    replies:[
     {style:'believer',text:"I left you waiting. Tell me what that cost you.",reaction:"He keeps scrubbing. “Told someone to come watch; had to explain with this bloody broom in my hand.”"},
     {style:'straight',promise:'appearance',text:"You have a match next week. I will put the date in writing.",reaction:"He checks the threshold. “Write it clearly; I have enough things to scrape at.”"},
     {breaks:true,text:"Ask Bev about running-order changes next time. I cannot reach everyone.",reaction:"He empties the pan sharply. “Your promise, boss; would have liked your explanation.”"}
    ]},
   benched:{tell:"Sweeps collects glitter from the curb with increasing force.",
    line:"“{name} got a match and I got this; how does that much rubbish get outside?”",
    replies:[
     {style:'believer',promise:'appearance',text:"You are on the card next week. Bring the boots as well as the broom.",reaction:"He scoops the last pile. “Both were already packed.”"},
     {style:'straight',text:"Tell me what you have been preparing in the ring.",reaction:"He holds the pan level. “A clean finish; something this place could use.”"},
     {truth:true,text:"Cleaning is not your audition. Ask me for the match you want.",reaction:"He empties the pan. “Book me, boss; then move your shoe, there is glitter under it.”"}
    ]},
   idle:{tell:"Sweeps tapes his dustpan handle, then sweeps up the torn backing.",
    line:"“Four weeks of cleaning without a match, boss; the pan has had more ring time than I have.”",
    replies:[
     {style:'believer',promise:'appearance',text:"Save tape for your wrists. You are booked next week.",reaction:"He pockets the roll. “Good; this floor can meet the soles of my boots for a change.”"},
     {style:'straight',text:"Show me what you would do with five minutes in the ring.",reaction:"He finishes the patch. “Give me four and a clean canvas.”"}
    ]},
   cutIn:{tell:"Sweeps brushes a glitter trail into the pan directly between you.",
    line:"“Before another loving word from {name}, who is helping clean this bloody trail?”",
    replies:[
     {style:'believer',text:"I will hold the pan. Show me where to start.",reaction:"He pushes the pile forward. “At the visible filth; remarkably popular place to ignore.”"},
     {style:'straight',text:"Ask for help directly. You have an audience right here.",reaction:"He points the broom. “Grab that bag and hold it open. Please.”"},
     {style:'hype',text:"Let the others leave. Everyone should hear what you did tonight.",sides:{20:-2},reaction:"He keeps sweeping. “They can hear it while they hold the bloody bag.”"}
    ]},
   skip:"Sweeps cleans the grit around your shoes without meeting your eyes, then follows the trail past you."
  },
  epilogue:{
   best:{title:'A Clean Path Out',line:"Sweeps checks both sides of the doorway. “Your side, my side; dirt doesn’t get a side, boss.”"},
   neutral:{title:'Same Door Tomorrow',line:"Sweeps scrapes grit from a seam. “Lock up when you go; this little bastard has another think coming.”"},
   bad:{title:'Under Your Chair',line:"Sweeps drags your chair aside and sweeps beneath it. “Still angry with you, boss; still not leaving that filth.”"}
  },
  scenes:[
   {line:"Term Life wants the broom’s replacement value; someone tracked mud over the form while he was asking, so the form’s getting swept too.",replies:[
    {style:'believer',text:"You have the mic this week. Explain why this broom matters and give Term Life credit for protecting it.",promise:'promo',sides:{17:3},reaction:"He sweeps around the form. “He understands a valuable tool; now he can understand a bloody doormat.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He lifts the form clear of the dustpan. “Won with these hands, cleaned with this broom; he can insure both.”"}]},
    {style:'straight',text:"Price a spare broom. Keep this one working while he does the paperwork.",reaction:"He sweeps a fresh track. “Good; the dirt won’t wait for underwriting.”"},
    {breaks:true,text:"Use the shop price. We need a tool we can replace before doors.",reaction:"He grips the worn handle. “A tool, boss? This one knows where the filthy corners hide.”"}]},
   {line:"Holly brought a pizza pocket on a napkin; somebody took the napkin and left crumbs, and I am about to sweep them into next week.",replies:[
    {style:'believer',text:"Clean the crumbs first. I will keep people out of your way.",reaction:"He bears down on the broom. “Finally, a sensible arrangement for lunch.”"},
    {style:'straight',text:"Get the crumbs into the pan, then eat while it is still hot.",reaction:"He collects the last crumb. “Food stays on the napkin this time; apparently that needs saying.”"},
    {breaks:true,text:"Eat first. A few crumbs can wait ten minutes.",reaction:"He sweeps faster. “They can wait in the bloody bin.”"}]},
   {line:"The Grinch wrote THANKS FOR CLEANING in loose glitter; I am sweeping his gratitude into a bag before I lose my mind.",replies:[
    {style:'believer',text:"You can value the thanks and still sweep up every speck.",reaction:"He works the brush under a seam. “The thanks can stay in the air; this rubbish cannot.”"},
    {style:'straight',text:"Tell him glitter creates more work. Ask for a thank-you without it.",sides:{20:-2},reaction:"He snaps the dustpan level. “A sentence, boss; a lovely, non-shedding sentence.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He scrubs at one stubborn fleck. “Yes; show him exactly what went wrong. Could have used that myself this week.”"}]},
    {breaks:true,text:"Bag the obvious glitter and move on. There are bigger jobs before lockup.",reaction:"He kneels over the seam. “It is all obvious when you bloody look.”"}]},
   {line:"The wind keeps throwing my dirt back through the door; I will outlast the little bastard if it takes all night.",replies:[
    {style:'believer',text:"I will hold the door almost shut. Feed it through slowly.",reaction:"He sweeps a narrow line. “There; let it try that again.”"},
    {style:'straight',text:"Use the dustpan and a lidded bin. Stop giving the wind another turn.",reaction:"He snaps the lid shut. “A useful correction; unlike the weather.”"},
    {truth:true,text:"You are exhausted. Hand me the pan and take a break while I finish this patch.",reaction:"He checks your grip, then lets go. “Every speck, boss; I will know.”"}]},
   {line:"An untorn ticket under the front row, glued down with chewing gum; someone paid admission to vandalize my bloody floor.",replies:[
    {style:'believer',text:"You are on the card this week. Get the gum up, and let Bev give the spare ticket to someone who needs it.",promise:'appearance',reaction:"He scrapes hard. “Fine; fresh start for the ticket, no mercy for the gum.”"},
    {style:'straight',text:"Scrape it free and put the ticket in lost and found.",reaction:"He collects the scrapings. “Lost ticket, found filth; one of those is going in the bin.”"},
    {breaks:true,text:"Leave the ticket stuck there until after doors. We need the aisle clear.",reaction:"He drops to one knee. “Then clear it around me; this is coming up.”"}]}
  ]},
 18:{speaker:'Charming',style:'bureaucrat',place:'Afternoon tea at Maddox Hatter’s table',
  tells:{wary:"His thank-you note is addressed to the next of kin, just in case.",friendly:"He pours the tea first and casually slips a bill for the cup beneath the saucer.",warm:"He has put the good biscuits out and quietly recorded which guest cannot afford one.",devoted:"His four-page thank-you note includes a prepaid envelope for the return of any teeth lost during the visit."},
  moods:{
   low:{style:'believer',tell:"Charming has prepared a sympathy card for the referee and keeps adding black borders."},
   high:{style:'bureaucrat',tell:"Charming addresses a thank-you to the defeated corner and puts a price sticker on the ice pack."}
  },distrusts:'straight',
  stale:"Thank you for the repetition; a fourth recital deserves a locked door and no supper.",
  heard:"{name} supplied the transcript; please accept a complimentary copy of the obituary draft.",
  invite:{wary:"Tea at four. Please bring a witness with poor eyesight.",friendly:"Tea is served. Please sign the liability waiver before taking sugar.",warm:"Dearest booker, tea at four. Please leave the emergency contact blank for efficiency. Kind regards, C.F."},
  signoff:{wary:"Please mind the loose stair; repairs would spoil the surprise.",friendly:"Thank you for coming. The door locks from the pleasant side.",warm:"Kind regards to the family; please keep the ambulance route clear.",devoted:"Please take a biscuit for the journey and a second for the eventual inquest."},
  sore:"Please open the thank-you note privately; public reading would upset the people named in the threats.",
  reacts:{kept:"Charming sends a thank-you and bills the opponent for the postage.",broken:"Charming forwards the unused invitation to the opponent’s creditors, marked “lovely opportunity.”"},
  jealous:"Charming tips a cup into the flowerpot. “Please give {name} the seat of honor at the next disciplinary hearing. Thank you.”",
  backstage:{
   won:{tell:"Charming has tucked an invoice under the ice pack intended for the other corner.",
    line:"“Please thank {name} for the victory and for the opportunity to charge for every consolation.”",
    replies:[
     {style:'bureaucrat',text:"Send one result notice and keep the medical bill out of it.",reaction:"Charming separates two envelopes. “Separate correspondence, separate collection fees. Delightful.”"},
     {style:'believer',text:"Tell {name} which exchange nearly cost you the match.",reaction:"Charming opens the note. “Thank you for nearly succeeding. Please enjoy the distinction.”"}
    ]},
   lost:{tell:"Charming prepares a condolence card for the referee and tests the seal with a smile.",
    line:"“Please address the winner’s flowers to the referee; a wreath would communicate the appropriate depth of disappointment.”",
    replies:[
     {style:'believer',text:"Put your own name on the card. A loss does not require a punishment.",reaction:"Charming writes slowly. “Charming Friendly. Please leave the punishment field blank pending review.”"},
     {style:'bureaucrat',promise:'rematch',text:"You and {name} next week. Save the card and put the new date on the back.",reaction:"Charming turns it over. “A second sitting, with a less charitable seating arrangement. Lovely.”"},
     {truth:true,text:"You lost. A condolence card for the referee will not change it.",reaction:"Charming closes the envelope. “Quite right. Please save the flowers for a more persuasive occasion.”"}
    ]},
   stole:{tell:"Charming gathers programmes that spectators dropped while standing and marks each with a resale price.",
    line:"“A standing ovation! Please advise whether the audience can be billed for leaving the seats before the end.”",
    replies:[
     {style:'bureaucrat',text:"Send one thank-you to the hall. The other corner gets equal space to sign.",reaction:"Charming measures both lines. “Equal signatures. Unequal liability, if the form permits.”"},
     {style:'believer',text:"Enjoy the reaction. You do not need to send an invoice.",reaction:"Charming folds the programme. “A gracious evening with no paper trail. Delightful.”",cases:[{when:{lostTonight:true},morale:2,reaction:"Charming smooths the crease. “Please file the applause before the result. The result is hideous.”"}]},
     {style:'hype',promise:'promo',text:"You have the mic next week. Thank the crowd in person.",reaction:"Charming makes a note. “Please lock the doors until the thank-you has concluded.”"}
    ]},
   flat:{tell:"Charming has cut the audience survey into tiny slips and is slipping the worst ones into the opponent’s bag.",
    line:"“Such a quiet room; please charge the audience extra for the pleasure of withholding attention.”",
    replies:[
     {style:'bureaucrat',text:"Lead with the point. Cut the preliminaries.",reaction:"Charming strikes out a line. “Certainly. The threat fits nicely in the greeting.”"},
     {style:'believer',text:"Where did you lose the room? Start with the last moment they were listening.",reaction:"Charming taps the fold. “Here. Please prevent departures at exactly this moment.”"},
     {breaks:true,text:"We were late. I can shorten your time and move you earlier.",reaction:"Charming folds the programme. “Efficient. Please reserve the saved minutes for the public shaming.”"}
    ]},
   kept:{tell:"Charming has signed a thank-you and put the opponent’s address on the copy marked “charges.”",
    line:"“{promise} arrived as agreed; please enjoy a thank-you free of the administrative fee charged to the other corner.”",
    replies:[
     {style:'bureaucrat',text:"Keep a record of the promise being fulfilled. Leave the other corner out of it.",reaction:"Charming files both copies. “A record with a small omission. How tidy.”"},
     {style:'believer',text:"Tell me what the booking meant before you seal the envelope.",reaction:"Charming smiles over the seal. “A lovely chance to turn gratitude into leverage. Thank you.”"}
    ]},
   broken:{tell:"Charming holds out a clipboard with a formal complaint already signed in an unfamiliar hand.",
    line:"“{promise} was missing; please confirm the spelling of the booker’s name for the prewritten confession.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. I will put that commitment in writing.",reaction:"Charming offers the pen. “Initial beside the new promise, please. The confession can wait.”"},
     {style:'believer',text:"You were right to expect it. Put my name by the broken promise.",reaction:"Charming writes in a narrow box. “Responsibility acknowledged. Please enjoy the generous interest rate.”"},
     {breaks:true,text:"Leave the form with me. I need to see the whole card first.",reaction:"Charming caps the pen. “Certainly. Copies have already gone to the least forgiving parties.”"}
    ]},
   benched:{tell:"Charming props a place card on the curb and pushes a small bill beneath it.",
    line:"“{name} enjoyed a booking; please accept the invoice for maintaining a far more interesting empty seat.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"Write your name here. You have a match next week.",reaction:"Charming writes carefully. “Excellent. Please select a guest with few witnesses.”"},
     {style:'believer',text:"Tell me the match you would have asked for without seeing the card.",reaction:"Charming straightens the place card. “A generous invitation to a profoundly disadvantaged guest, please.”"},
     {style:'straight',text:"Ron was booked for a reason. I can hear your case separately.",reaction:"Charming folds the card. “Of course. Please forward Ron a thank-you for the imaginary endorsement.”"}
    ]},
   idle:{tell:"Charming unwraps four thank-you notes and reveals a thicker fifth envelope marked “collection.”",
    line:"“Four missed Saturdays; please choose a thank-you before the matter passes to the people with the large envelopes.”",
    replies:[
     {style:'bureaucrat',text:"Give me the latest note and keep the others in the record.",reaction:"Charming hands over the smallest. “A compact account of the debt. How convenient.”"},
     {style:'believer',text:"Give me the first one. I want to know what you wanted before you were passed over.",reaction:"Charming loosens the ribbon. “The first request was merely for an opponent with nowhere better to be.”"},
     {style:'straight',promise:'appearance',text:"You are booked next week. Save the stationery.",reaction:"Charming reties the ribbon. “Lovely. The saved paper can become an itemized injury bill.”"}
    ]},
   skip:"Charming holds the exit open with an elaborate bow, then lets the latch catch just before you reach it."
  },
  epilogue:{
   best:{title:'The Good Stationery',line:"Charming sets a cup down. “Please keep the address for formal complaints; the furnace has developed a taste for good paper.”"},
   neutral:{title:'One More Cup',line:"Charming sets out a saucer. “Tea at four. Please arrive early enough to identify the emergency exit before the seating plan changes.”"},
   bad:{title:'No Place Set',line:"Charming takes the chair away. “Please stand. Seating is reserved for guests with something left to lose.”"}
  },
  scenes:[
   {line:"Milk, sugar, or the address of the wrestler sleeping under the ring? Please bid quietly; shelter is scarce.",replies:[
    {style:'bureaucrat',text:"Seal the name. I can handle the situation without making it public.",reaction:"Charming seals the envelope. “A private auction, then. How discreet.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"Charming waxes the seal. “Saturday’s result can raise the opening bid. Splendid.”"}]},
    {style:'believer',text:"Give me the door they use, without their name. I can help without exposing them.",reaction:"Charming pours another cup. “An anonymous eviction. Tasteful.”"},
    {breaks:true,text:"Send them to me at lockup. I need to clear the ring.",reaction:"Charming sets the cup down. “Certainly. Please allow time to sell the blanket first.”"}]},
   {line:"Please approve one booking amendment: the weakest opponent opens, closes, and pays for any damage caused by falling.",replies:[
    {style:'bureaucrat',text:"Submit one name and one reason. You have a match this week; I will choose the other corner.",promise:'appearance',reaction:"Charming produces the laminated form. “Please invoice the other corner for the selection process.”"},
    {style:'believer',text:"Tell me the name you want without the polite wrapping.",reaction:"Charming taps a place setting. “The guest least likely to afford a second opinion, please.”"},
    {breaks:true,text:"The card is set. Send the proposal before the next print run.",reaction:"Charming notes the deadline. “Excellent. Please leave the printer unattended.”"}]},
   {line:"Maddox supplied the sugar; the blackmail slips underneath are complimentary, and a second lump doubles the debt, thank you.",replies:[
    {style:'bureaucrat',text:"Post the terms in full. You have mic time this week to read them before anyone takes sugar.",promise:'promo',reaction:"Charming unrolls the terms. “Certainly. Please allow time for every penalty clause.”"},
    {style:'believer',text:"Ask Maddox what he actually needs kept safe.",reaction:"Charming lifts the pot. “Please protect the kettle first; the secrets fetch more when warm.”"},
    {truth:true,text:"Nobody consented to blackmail over tea. Put the slips away and ask plainly.",reaction:"Charming gathers the slips. “A direct threat, then. Please accept the improved transparency.”"}]},
   {line:"Ron refused to endorse the plan; a thank-you for endorsing the plan has already been printed, so please admire the efficient stationery.",replies:[
    {style:'bureaucrat',text:"Issue a disputed receipt with a deadline. Give Ron a chance to answer on the record.",sides:{31:-2},reaction:"Charming retrieves the smallest card. “Please print the deadline below the crease, for elegance.”"},
    {style:'believer',text:"Set a place. Let Ron decide whether he comes.",reaction:"Charming sets the saucer. “A warm seat makes a fine place to leave a summons.”"},
    {breaks:true,text:"Take him off the head count. Maddox has enough cups to wash.",reaction:"Charming pours anyway. “Please bill Ron for the unused serving. Waste is dreadful.”"}]},
   {line:"A reference for the last opponent? Certainly. Please leave room for the injury list and a note about the absence of prospects.",replies:[
    {style:'bureaucrat',text:"Confirm their attendance. You have a match this week and can hand over the letter in person.",promise:'appearance',reaction:"Charming signs. “Present at the bell. Recoverable afterward, at considerable expense.”"},
    {style:'believer',text:"Write what you would honestly wish for them in the next match.",reaction:"Charming writes one line. “A worse referee, please. The present standard is inconvenient.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"Charming crosses out the referee. “A rematch without witnesses would be an improvement. Kind regards.”"}]},
    {breaks:true,text:"Decline the reference so they have time to ask somebody else.",reaction:"Charming chooses a postcard. “A public refusal saves the trouble of opening an envelope.”"}]}
  ]},
 20:{speaker:'The Grinch',style:'hype',place:'Anywhere decorated: tonight, the Moose Lodge craft room',
  tells:{wary:"He has made you a welcome banner large enough to block his own chair.",friendly:"He waves with both hands and starts planning a welcome-back banner.",warm:"He presents a paper heart for every member of the ring crew, plus spares for surprise friends.",devoted:"He has linked every name on the booking sheet with a chain of hearts."},
  moods:{
   low:{style:'believer',tell:"He holds the post-match heart against his chest and keeps checking that every name is still attached."},
   high:{style:'hype',tell:"He has glittered THANK YOU across three sheets and is unfolding a fourth."}
  },distrusts:'straight',
  stale:"I loved hearing that the first three times; let us find a bigger way to say it together!",
  heard:"{name} told me what you said; such passionate feedback deserves an EXTRA-LARGE thank-you!",
  invite:{wary:"A giant WELCOME awaits. The Grinch has included everyone, emphatically.",friendly:"Decorating tonight! Bring a friend, or arrive and become several!",warm:"WELCOME-BACK EMERGENCY. Bring glue; there are more people to adore!"},
  signoff:{wary:"Already looking forward to welcoming you back!",friendly:'Spread the love, booker!',warm:"Take a heart for the whole crew!",devoted:"There is a place at the party for EVERYBODY!"},
  sore:"That sounded like a very big feeling; I am making an even bigger welcome for when we talk again!",
  reacts:{kept:"The Grinch surrounds the fulfilled promise with hearts for everyone who helped.",broken:"The Grinch tapes a WE WILL GET THERE heart over the missing promise and starts making a larger one."},
  jealous:"The Grinch adds another chair. “An evening with {name}! Next time invite everybody; I have already started the banner!”",
  backstage:{
   won:{tell:"The Grinch tries to applaud while holding a heart for every corner.",
    line:"“I won, and my opponent held me so tightly; what a wonderful evening of mutual enthusiasm!”",
    replies:[
     {style:'hype',promise:'promo',text:"Take the mic next week. Share that welcome with the whole crowd.",reaction:"He raises every heart. “Even the people cheering for the other corner! Especially them!”"},
     {style:'believer',text:"Keep a heart for the opponent too. They helped make the match.",reaction:"He adds another. “One for wrestling and one for being marvelous!”"},
     {style:'straight',text:"Take the tape off your hands before those hearts tear.",reaction:"He peels it carefully. “Love requires maintenance! Thank you!”"}
    ]},
   lost:{tell:"The Grinch straightens a crumpled heart with both palms.",
    line:"“They pinned me for THREE whole seconds; I have made a thank-you for such a committed embrace!”",
    replies:[
     {style:'believer',text:"You still gave them something worth caring about. Keep that heart.",reaction:"He hugs it. “The result cannot make the love smaller!”"},
     {style:'hype',text:"Hold it up for the crew. They stayed for both of you.",reaction:"He raises it high. “A group thank-you! My favorite size!”"},
     {truth:true,text:"You can be disappointed by losing. You do not have to turn every painful moment into a celebration.",reaction:"He lowers the heart. “It did hurt.” After a moment, he keeps it beside him."}
    ]},
   stole:{tell:"The Grinch has looped streamers around both wrists and keeps waving back toward the hall.",
    line:"“They shouted together! I think the entire building just became best friends!”",
    replies:[
     {style:'hype',text:"Let the crowd start the chant next time. Answer them.",reaction:"He cups an ear. “A call-and-response friendship!”"},
     {style:'believer',text:"Keep one streamer and leave the rest for the people who joined in.",reaction:"He chooses one. “Shared souvenirs! Love travels light!”",cases:[{when:{lostTonight:true},morale:2,reaction:"He winds it around his wrist. “Lost a match, found a whole room of friends!”"}]},
     {style:'straight',text:"Remember the pause that let them join in.",reaction:"He counts a beat. “A space shaped exactly like everybody else!”"}
    ]},
   flat:{tell:"The Grinch adds another exclamation mark to a banner barely wide enough for its first word.",
    line:"“Such a quiet crowd; they must have been saving their voices for an even bigger welcome!”",
    replies:[
     {style:'hype',promise:'appearance',text:"You are on next week. Start with one person and let the rest join.",reaction:"He points to the front row. “A friendship with room to spread!”"},
     {style:'believer',text:"Show me what you wanted them to join before adding more banner.",reaction:"He opens his arms. “This! Then cheering! Then more of this!”"},
     {breaks:true,text:"Leave the banner home next time. The crew needs a simpler entrance.",reaction:"He beams. “A surprise made entirely of enthusiasm! No lifting required!”"}
    ]},
   kept:{tell:"The Grinch presents a paper chain with a heart for each member of the crew.",
    line:"“You delivered {promise}; I made a thank-you long enough to include the people who opened the doors!”",
    replies:[
     {style:'hype',text:"Let the crew help close the last link.",reaction:"He calls down the hall. “Everybody helped! Everybody gets glue!”"},
     {style:'believer',text:"I will hold it steady while you attach the last heart.",reaction:"He hands you the end. “Cooperative affection! Mind the glitter!”"}
    ]},
   broken:{tell:"The Grinch is expanding a sign into a much larger sign.",
    line:"“We missed {promise}; clearly I need to make our next opportunity easier to spot!”",
    replies:[
     {style:'believer',text:"I should have told you. Show me the sign you made.",reaction:"He unfolds it. “A sneak preview of our future celebration!”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. There will be a place for your name.",reaction:"He reaches for more paper. “A whole week to improve the welcome!”"},
     {breaks:true,text:"Keep the sign boxed until I have a slot.",reaction:"He packs it carefully. “Stored enthusiasm! Does not expire!”"}
    ]},
   benched:{tell:"The Grinch carries a streamer across the parking lot like a welcome arch for passing cars.",
    line:"“They cheered for {name}! I cheered too, and next time we can all cheer somewhere I am actually wrestling!”",
    replies:[
     {style:'hype',promise:'appearance',text:"You are booked next week. Welcome them from your own corner.",reaction:"He throws both arms up. “A home address for the affection!”"},
     {style:'believer',text:"You can celebrate that match and still want your own.",reaction:"He nods eagerly. “Two celebrations! Excellent accounting!”"},
     {style:'straight',text:"Tell me what you would do with one roll and your entrance.",reaction:"He offers you the loose end. “Make the welcome a team effort!”"}
    ]},
   idle:{tell:"The Grinch carries four Saturdays’ worth of hearts in an overfilled envelope.",
    line:"“Four weeks of saving my welcome; when I get back in the ring, the affection may require a trolley!”",
    replies:[
     {style:'hype',promise:'promo',text:"Take the mic next week. Tell them why you kept making these.",reaction:"He hugs the envelope. “I loved them every Saturday! Also the weekdays!”"},
     {style:'believer',text:"Choose the first heart you want to show them.",reaction:"He selects the smallest. “The beginning of a VERY large hello!”"}
    ]},
   cutIn:{tell:"The Grinch gathers a loose streamer while beaming at the approaching broom.",
    line:"“{name} has come to join the decorations committee; I adore this level of involvement!”",
    replies:[
     {style:'hype',text:"Put the decorations higher so everyone can get through.",reaction:"He looks up. “Elevated affection! Excellent committee work!”"},
     {style:'believer',text:"Ask where the broom catches. Make the cleaning easier.",reaction:"He gathers the loose end. “A welcome with room for Sweeps’ favorite activity!”"},
     {style:'straight',text:"Start with the doorway. People need to carry chairs through.",reaction:"He coils the ribbon. “More chairs means more friends! Right away!”"}
    ]},
   skip:"The Grinch hurries past with an unfinished WELCOME BACK banner, adding hearts for your next conversation."
  },
  epilogue:{
   best:{title:"Everybody Gets a Chair",line:"The Grinch adds another heart. “You helped me welcome so many people! Naturally, I have invited all their friends!”"},
   neutral:{title:"More Paper Needed",line:"The Grinch measures a new banner. “So many lovely evenings; I am making room for everybody who could not stay!”"},
   bad:{title:"An Even Bigger Welcome",line:"The Grinch tapes two banners together. “We missed each other so often; the next hello deserves to be ENORMOUS!”"}
  },
  scenes:[
   {line:"I love this crowd so much that one banner will not do; choir, streamers, or a heart visible from the next town?",replies:[
    {style:'hype',text:"Take the mic this week. Let the crowd choose the first celebration.",promise:'promo',reaction:"He stretches his arms wide. “Participatory adoration! We need more paper!”",
     cases:[{when:{lostLastShow:true},delta:-1,reaction:"He hugs the heart to his chest. “Could we love this bit first? I made it before the loss.”"}]},
    {style:'believer',text:"Start with the heart you wanted to make before you thought about the noise.",reaction:"He holds up a small one. “This one loves the quiet people too!”"},
    {breaks:true,text:"Use the lockbox. I do not have a crew available for a bigger setup.",reaction:"He fills the box. “Portable love! I can carry twice as much!”"}]},
   {line:"The crew said “please, no more hearts”; I think they are overwhelmed by how wonderfully this friendship is going!",replies:[
    {style:'hype',text:"Give them the biggest thank-you you can deliver from your own corner.",reaction:"He beams. “A long-distance thank-you! Everybody gets room to wave!”"},
    {style:'believer',text:"You can care about them while keeping the decorations on your own table.",reaction:"He piles hearts on his table. “A central friendship station! Very efficient!”"},
    {truth:true,text:"They want you to stop giving them hearts. More gifts will not make them want the gifts.",reaction:"He lowers the stack. “They mean stop?” He sets it down. “I can leave these here.”"}]},
   {line:"Sweeps returned my tinsel in a dustpan; he loves me so much he delivered it personally while shouting!",replies:[
    {style:'hype',text:"Make the dustpan the centerpiece. Tell everyone Sweeps contributed to the decorations.",sides:{10:-2},reaction:"He reaches for a ribbon. “A joint project! He will be SO excited!”"},
    {style:'believer',text:"Ask where the tinsel can hang without creating another cleaning job.",reaction:"He lifts it high. “A broom-friendly welcome! Love considers the bristles!”"},
    {breaks:true,text:"Bag it and put it away. We need the floor clear before doors.",reaction:"He hugs the closed bag. “A surprise for another day! Wonderful planning!”"}]},
   {line:"The crew asked me to bring ice instead of “unlimited affection”; how many hearts fit in a cooler?",replies:[
    {style:'hype',text:"Take the mic this week and invite the whole crew. Bring the ice in the cooler.",promise:'promo',reaction:"He draws a heart on the lid. “Cold drinks, warm welcome, EVERYBODY invited!”"},
    {style:'believer',text:"The ice helps everyone enjoy the party. That can be your contribution.",reaction:"He beams at the cooler. “Love that keeps the lemonade cold!”"},
    {breaks:true,text:"Just bring ice. The party already has enough decorations.",reaction:"He writes ICE in huge letters. “An unambiguous declaration of refreshment!”"}]},
   {line:"I left one space in the garland for the next person I adore; terrible planning, I have already met three more!",replies:[
    {style:'hype',text:"You have a match this week. Hang it in your corner and show them there is room.",promise:'appearance',reaction:"He adds another length. “A whole welcome section!”",
     cases:[{when:{eventWeek:true},morale:2,reaction:"He unwinds the spool. “Tour-show crowd! Better leave room for a village!”"}]},
    {style:'believer',text:"Keep the gap. Someone might bring a shape you have never made.",reaction:"He gasps. “A collaborative heart! I love them already!”"},
    {breaks:true,text:"Fill it with a removable heart so we can hang it tonight.",reaction:"He pins one loosely. “A temporary welcome with permanent enthusiasm!”"}]}
  ]},
 31:{speaker:'Ron',style:'bureaucrat',place:'Room B, Sturgeon Bay Public Library (booked for one neutral hour)',
  tells:{wary:"He has filed no comment on your arrival and underlined the no.",friendly:"He sets out two identical chairs and checks that neither is nearer the table.",warm:"He lets you keep time on a disagreement before reaching for the gavel himself.",devoted:"He has reserved a chair in the exact middle for the only person he trusts to keep it there."},
  moods:{
   low:{style:'straight',tell:"Ron has crossed out a page of objections and left the words I LOST facing you."},
   high:{style:'bureaucrat',tell:"Ron files both corners’ accounts in identical sleeves, then moves the stapler precisely between them."}
  },distrusts:'hype',
  stale:"Your statement has been received three times; continued advocacy will be treated as a disturbance.",
  heard:"{name} forwarded your remarks. I have been neutral for the entire duration of this argument, and the duration is becoming UNACCEPTABLE.",
  invite:{wary:"NOTICE: an hour of neutral ground has been reserved. Attendance is optional.",friendly:"One neutral hour at Ron’s usual spot. No endorsements will be accepted.",warm:"NOTICE OF MEETING. Two equal seats. Please arrive without a position."},
  signoff:{wary:'No further comment.',friendly:'This meeting is adjourned, neutrally.',warm:'I neither endorse nor oppose you. Warmly.',devoted:"Meeting adjourned. Leave the two chairs exactly where they are."},
  sore:"I recorded your objection without endorsement. You may now stop objecting. You may now STOP.",
  reacts:{kept:'Ron stamps the commitment fulfilled in a color associated with neither corner.',broken:'Ron records a discrepancy and leaves your proposed explanation blank.'},
  jealous:"Ron squares two folders. “I take no position on your meeting with {name}. I object to the idea that a meeting requires a side.”",
  backstage:{
   won:{tell:"Ron puts the result in the middle of the table and moves both corners’ statements an equal distance away.",
    line:"“My name is in the winning box; this is a result and will not become a declaration of allegiance.”",
    replies:[
     {style:'bureaucrat',text:"Record the result separately from comments by either corner.",reaction:"He draws a line. “Good. This box has a lid.”"},
     {style:'straight',text:"You won. You can enjoy the match without issuing an endorsement.",reaction:"He folds the result. “A private slice of pie would be procedurally sound.”"},
     {style:'hype',promise:'promo',text:"Take the mic next week. Read the result and close the question.",reaction:"He underlines close. “Both sides can listen to the same full stop.”"}
    ]},
   lost:{tell:"Ron has crossed out both proposed explanations and left the result visible.",
    line:"“I lost; three people have offered competing opinions on a matter already decided by a bell.”",
    replies:[
     {style:'straight',text:"The result stands. Tell me what you would do differently.",reaction:"He presses the pen flat. “My grip opened. No motion required.”"},
     {style:'bureaucrat',promise:'rematch',text:"You and {name} next week. Enter the rematch separately.",reaction:"He rules a new line. “A new result will not amend the old one.”"},
     {truth:true,text:"You waited so long for a clear opening that the match ended.",reaction:"He caps the pen. “I can act sooner without endorsing an explanation.”"}
    ]},
   stole:{tell:"Ron prepares a single form for noise from both sides of the hall.",
    line:"“Both corners got the room shouting at once; for once nobody could distinguish the opposing positions.”",
    replies:[
     {style:'bureaucrat',text:"File the combined response. Do not split it by corner.",reaction:"He clips the page. “A usable record and fewer dividers.”"},
     {style:'straight',text:"Remember the exchange that made both sides lean in.",reaction:"He points to one timestamp. “There. Before anyone could argue about it.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He leaves the loss below the timestamp. “Both facts can occupy the same page.”"}]},
     {style:'believer',text:"Ask the people by the door what they heard.",reaction:"He folds the form. “One account, without a vote.”"}
    ]},
   flat:{tell:"Ron times an empty stretch on a survey sheet and taps the pen faster every second.",
    line:"“They argued about the time instead of watching; if it continues, I will formally adjourn the clock.”",
    replies:[
     {style:'bureaucrat',text:"Mark where they looked away and where they looked back.",reaction:"He rules two lines. “One record, no competing timelines.”"},
     {style:'straight',text:"Show me the exchange you would keep if you had one minute.",reaction:"He sets the survey down. “A minute of action may outlast a minute of discussion.”"},
     {breaks:true,text:"Leave the survey. We have the result and the crew needs to lock up.",reaction:"He files it blank. “Then both sides must refrain from inventing public comment.”"}
    ]},
   kept:{tell:"Ron has centered the fulfilled commitment between two identical tabs.",
    line:"“{promise} happened; neither corner will be permitted to debate whether it happened.”",
    replies:[
     {style:'bureaucrat',text:"Mark it fulfilled and attach the original.",reaction:"He stamps it once. “A rare case of two pages agreeing.”"},
     {style:'straight',text:"It happened. Take a moment before you start the next hearing.",reaction:"He sets the stamp down. “A recess of equal length for everyone.”"}
    ]},
   broken:{tell:"Ron sets the promise and the result on opposite sides of a ruler.",
    line:"“{promise} appears here and nowhere on the card; several people have already proposed sides in the discrepancy.”",
    replies:[
     {style:'bureaucrat',text:"Put the two pages side by side. I will initial the mistake.",reaction:"He aligns them. “A shared record. Nobody needs a faction.”"},
     {style:'straight',promise:'appearance',text:"I missed it. You have a match next week, on a fresh line.",reaction:"He draws the line in the middle. “One booking. No statement of allegiance.”"},
     {breaks:true,text:"Attach the final card. That is what the crew had time for.",reaction:"He closes the folder. “Yes, and both explanations remain equally incomplete.”"}
    ]},
   benched:{tell:"Ron has folded the programme so the occupied slot and his empty space are equally visible.",
    line:"“{name} worked; I did not; the argument over what that supposedly endorses has now lasted longer than the match.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"Submit a match request. You have a spot next week.",reaction:"He takes a blank slip. “A request for participation. I shall label it twice.”"},
     {style:'straight',text:"Tell me what you want to do without comparing bookings.",reaction:"He folds both names out of view. “Wrestle, then adjourn.”"},
     {style:'believer',text:"I can hear the request without deciding a dispute between you.",reaction:"He lowers the programme. “That would eliminate the least useful part of this conversation.”"}
    ]},
   idle:{tell:"Ron aligns four unused passes and leaves a space for a fifth.",
    line:"“Four weeks marked available; I am requesting presence before someone turns my absence into a political position.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"Motion carried. You have a match next week.",reaction:"He removes the newest pass. “Participation entered. Endorsement box blank.”"},
     {style:'straight',text:"Ask for the spot plainly. I can work with an actual request.",reaction:"He pockets the passes. “A match, please. Any corner assigned by a neutral process.”"}
    ]},
   cutIn:{tell:"Ron has counted three objections on the back of his form and raises a pen before the fourth.",
    line:"“{name} has finished a correction; if anyone corrects that correction, I will adjourn this entire hallway.”",
    replies:[
     {style:'bureaucrat',text:"Enter both accounts, then close the record.",reaction:"He draws a central line. “Equal space. No annexes.”"},
     {style:'straight',text:"Give me the one fact you need corrected. Leave the dispute there.",reaction:"He lowers the pen. “One fact. No endorsement of anyone’s interpretation.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He folds the form. “I lost. The result does not require a dissenting opinion.”"}]},
     {style:'believer',text:"You can ask to be heard without asking anyone to agree.",reaction:"He caps the pen. “Yes. I will say it once, which is a request I extend to everyone.”"}
    ]},
   skip:"Ron walks past exactly between you and the other corner, acknowledging neither with equal precision."
  },
  epilogue:{
   best:{title:"Minutes Closed",line:"Ron closes two folders at once. “We achieved several weeks without a demand for allegiance. I am prepared to record the relief.”"},
   neutral:{title:'Pending Further Review',line:"Ron clicks the pen. “Both accounts are filed together. Anyone reopening the question can file a request in silence.”"},
   bad:{title:'Entered Without Comment',line:"Ron pushes two chairs back with equal force. “No assessment entered. No endorsement entered. NO further questions.”"}
  },
  scenes:[
   {line:"Both corners sent a statement on the championship; the third envelope contains my request that both stop sending statements.",replies:[
    {style:'bureaucrat',text:"Submit the request in triplicate. You have the mic this week to read it.",promise:'promo',reaction:"He sets three copies down at once. “Equal notice of the cessation of notice.”",
     cases:[{when:{champion:true},delta:2,reaction:"He puts the belt between the copies. “Exhibit A. Its present location confers no right to shout.”"}]},
    {style:'straight',text:"Put what you want in the first sentence. I can work with a specific request.",reaction:"He writes END DISCUSSION in block letters.",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He strikes through both objections. “I lost. That is a result, not an invitation to debate.”"}]},
    {breaks:true,text:"I need the title picture settled before adding another statement.",reaction:"He draws the folder back. “Then nobody should submit a fourth.”"}]},
   {line:"The dessert table has been debating pie versus brownies for eleven minutes; at twelve, I will withdraw the table.",replies:[
    {style:'bureaucrat',text:"Log an abstention. Give both plates the same space.",reaction:"He stamps both slips. “Equal surface area. No speeches.”"},
    {style:'straight',text:"Serve both. You can have dessert without voting on it.",reaction:"He places a napkin in the middle. “A plate may contain two items without endorsing either.”"},
    {breaks:true,text:"Serve the brownies first. They are already cut and the line is backing up.",reaction:"He grips the table. “The queue will not be permitted to constitute a mandate.”"}]},
   {line:"Greek asked me to declare Greco Wrestling supreme; I abstained twice, and his third request is testing the structural limits of this pen.",replies:[
    {style:'bureaucrat',text:"File a formal objection to repeated endorsements. Send Greek the minutes.",sides:{0:-2},reaction:"He clips both accounts together. “The objection is to the demand for agreement. Underline demand.”"},
    {style:'straight',text:"Tell him you can watch the match without endorsing a style.",reaction:"He sets the pen down. “Observation without allegiance. A complete sentence.”"},
    {truth:true,text:"You are shouting at Greek to stop having a strong opinion. Listen to yourself.",reaction:"He goes quiet long enough to hear the pen hit the table. “I can lower the volume without changing the finding.”"}]},
   {line:"A spectator endorsed my headlock and another defended the wristlock; I am scheduling a match to END this extremely avoidable dispute.",replies:[
    {style:'bureaucrat',text:"Enter both comments. You are on the card this week, and neither hold gets an endorsement.",promise:'appearance',reaction:"He marks both boxes. “Equal opportunity to cease arguing.”"},
    {style:'straight',text:"Thank them for watching. Use whichever hold the exchange calls for.",reaction:"He rubs his wrist. “An action without a platform. Acceptable.”"},
    {breaks:true,text:"Take the compliment and warm up. Doors open in ten.",reaction:"He turns both slips face down. “I will warm up in a strictly nonpartisan capacity.”"}]},
   {line:"Charming thanked me for endorsing a plan to sell the loser’s ambulance ride; I endorsed neither the plan nor any alternative ambulance plan.",replies:[
    {style:'bureaucrat',text:"File the endorsement as disputed. Send Charming the blank signature page.",sides:{18:-2},reaction:"He holds it to the light. “Nothing on either side. I will certify the nothing.”"},
    {style:'straight',text:"Tell Charming directly that you never agreed. Leave the other names out of it.",reaction:"He takes a breath. “No agreement. No counterproposal. No more stationery.”"},
    {breaks:true,text:"Put it aside. We have an actual card to book.",reaction:"He opens the drawer marked DISPUTED. “Then it stays here until the fictional agreement stops arriving in the mail.”"}]}
  ]},
 34:{speaker:'Liam',style:'straight',place:"The last booth at Door County Lanes",days:['Sunday'],
  tells:{wary:"He signs an old headshot before checking whether you asked for one.",friendly:"He shifts his drink off the seat he has saved for you.",warm:"He shows you the billing he wants, then admits how few people asked for an autograph.",devoted:"He hands you his battered headshot and asks where the next fight is, in that order."},
  moods:{
   low:{style:'bureaucrat',tell:"Liam steadies a contract against his glass and keeps checking the blank beside NEXT APPEARANCE."},
   high:{style:'straight',tell:"Liam raises his glass to you, then points at the next match slot instead of his old headshot."}
  },distrusts:'hype',
  stale:"That is the same pitch three times; even my sequels had a different bar fight.",
  heard:"{name} quoted you; did the bit about my comeback get cut again?",
  invite:{wary:"Liam has old headshots, a drink and time for one booking conversation.",friendly:"Sunday. Liam saved a seat and has already started drinking.",warm:"Sunday. Come hear the comeback pitch before Liam pitches it to someone with fists."},
  signoff:{wary:"Keep the autograph; they used to charge for those.",friendly:"Call if there is a fight going.",warm:"Same seat Sunday; next fight sooner, preferably.",devoted:"You remembered the name without the headshot. That earns you the good seat."},
  sore:"I have heard kinder rejections after four drinks, and I remember those too.",
  reacts:{kept:"Liam raises his glass over the fulfilled booking, taking care not to cover his name.",broken:"Liam folds the cancelled booking inside another unanswered comeback pitch."},
  jealous:"Liam sets his glass on an old headshot. “{name} gets your evening; tell me this is not Demeter’s Baby all over again.”",
  backstage:{
   won:{tell:"Liam raises a flask in one hand and flexes the other as if the bell might ring again.",
    line:"“A win, a crowd, and nobody asking about my union card; I could get used to this.”",
    replies:[
     {style:'straight',text:"You earned the win. Let that be the credit tonight.",reaction:"He takes a drink. “Liam Neesen, victorious; comfortably within my range.”"},
     {style:'bureaucrat',text:"Keep the result with your booking records. This is current work.",reaction:"He tucks the result behind a headshot. “Straight to the front of the résumé.”"},
     {style:'believer',text:"Enjoy it. They came to see you fight, and you gave them a fight.",reaction:"He lifts the flask again. “Do you think they would stay for another?”"}
    ]},
   lost:{tell:"Liam props the result sheet against his flask and tries to flatten it with a knuckle.",
    line:"“Put the loss in writing; I would hate to remember tonight as the start of a successful comeback.”",
    replies:[
     {style:'bureaucrat',text:"We will go through the result and the finish. One thing at a time.",reaction:"He taps the sheet. “Good; the reviews used to be much harder to pin down.”"},
     {style:'straight',promise:'rematch',text:"You and {name} next week. Work out what changes before then.",reaction:"He raises the flask. “A sequel commissioned before the reviews; there is confidence.”"},
     {truth:true,text:"You enjoyed trading blows so much that you stopped trying to finish the match.",reaction:"He looks at his knuckles. “Yes. I was having rather too good a time.”"}
    ]},
   stole:{tell:"Liam has uncapped his flask but keeps turning back toward the noise from the hall.",
    line:"“That sounded like an opening night; I forgot to resent how small the building is.”",
    replies:[
     {style:'straight',text:"You and your opponent gave them a fight worth the ticket.",reaction:"He drinks to the doorway. “And I did not have to audition.”"},
     {style:'bureaucrat',text:"Put this match at the top of your recent work.",reaction:"He turns over the headshot. “Finally, something to add instead of explain.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He writes beside his drink. “Lost the match; kept the room. Both go on the page.”"}]},
     {style:'believer',text:"They were calling for you. Take a moment to hear it.",reaction:"He lowers the flask. “I know; I had forgotten the second shout.”"}
    ]},
   flat:{tell:"Liam stares at the blank back of a headshot over the rim of his drink.",
    line:"“I gave them the old stare and the old speech; apparently they have already seen that picture.”",
    replies:[
     {style:'straight',text:"Show them what you want in this ring. The old scene will not do it for you.",reaction:"He puts the photograph down. “A fresh fight, then.”"},
     {style:'bureaucrat',text:"Note where the noise stopped. We can start the review there.",reaction:"He borrows a pen. “A specific review; quite a novelty.”"},
     {breaks:true,text:"It was a quiet crowd. Let us leave the analysis until tomorrow.",reaction:"He turns the glass. “They were quiet while I was talking, too; I noticed.”"}
    ]},
   kept:{tell:"Liam balances the booking sheet on his glass to show you his name.",
    line:"“You said {promise}, and there it was; my old agent required six calls to manage that.”",
    replies:[
     {style:'straight',text:"I wanted you focused on the fight when the bell rang.",reaction:"He grins over the glass. “Dangerously easy to arrange.”"},
     {style:'bureaucrat',text:"That commitment is complete. Keep the date with your records.",reaction:"He writes it beneath his name. “Proof of recent employment; glorious.”"}
    ]},
   broken:{tell:"Liam puts his drink down on the cancelled slot and waits for you.",
    line:"“{promise} vanished; was this a booking conversation or another audition for Demeter’s Baby?”",
    replies:[
     {style:'bureaucrat',text:"I changed the plan and failed to tell you. That belongs in the record.",reaction:"He moves the glass. “An honest rejection; still dislike it, but I can read it.”"},
     {style:'straight',promise:'appearance',text:"I missed the commitment. You have a match next week.",reaction:"He points at the new date. “Write the name in ink; I have brought my own.”"},
     {breaks:true,text:"The card changed. Next time check the board before preparing your appearance.",reaction:"He lifts the glass off the paper. “Of course; the star should check whether the part still exists.”"}
    ]},
   benched:{tell:"Liam stands beside the poster with his boots slung over one shoulder and a drink in hand.",
    line:"“{name} gets the slot and I get to watch; Greek could at least have reused the rejection letter.”",
    replies:[
     {style:'straight',promise:'appearance',text:"Bring your boots next week. You have a match.",reaction:"He raises the drink. “No audition required; an excellent start.”"},
     {style:'bureaucrat',text:"I should have confirmed the decision before you arrived. How should I reach you?",reaction:"He taps his phone. “This number; put YES or NO before the compliments.”"},
     {truth:true,text:"That spot had a purpose. Tell me what your next match offers beyond beating Greek to the booking.",reaction:"He studies his boots. “A fight they come back for; I can still do that.”"}
    ]},
   idle:{tell:"Liam has signed every headshot in his bag and started numbering the backs beside his drink.",
    line:"“Four weeks without a fight; even my direct-to-video period had a faster release schedule.”",
    replies:[
     {style:'straight',promise:'appearance',text:"You have a match next week. Keep one headshot for the ticket table.",reaction:"He selects the least battered one. “A premiere with folding chairs; I have done worse.”"},
     {style:'bureaucrat',text:"Let us write down when you can work and what you want from the appearance.",reaction:"He pushes the glass aside. “Paid work and a good fight; underline the second part.”"}
    ]},
   cutIn:{tell:"Liam steps around the corner with a drink and the smile he used to reserve for fight scenes.",
    line:"“{name} can lecture about Greco Wrestling; I am still waiting to hear why I could not lead Demeter’s Baby.”",
    replies:[
     {style:'straight',text:"The old rejection does not decide tonight. What did you see in the ring?",reaction:"He lowers his drink. “An opening I would have enjoyed taking.”",
      cases:[
       {when:{lostTonight:true},reaction:"He studies the glass. “I lost; even an appalling casting decision cannot fix that.”"},
       {when:{wonTonight:true},reaction:"He raises the glass. “I won; put that above the film dispute in the credits."}
      ]},
     {style:'hype',promise:'rematch',text:"You and {name} next week. Ready to settle something between the ropes?",reaction:"He beams over the drink. “At last, a callback.”",
      cases:[{when:{lostTonight:true},reaction:"He stops grinning for a moment. “Book it; I have a finish to study before the sequel.”"}]},
     {style:'bureaucrat',text:"Give me the match account separately. The old casting argument stays out of the result.",reaction:"He takes out a pen. “Separate paperwork; I have experience of that.”",
      cases:[{when:{lostTonight:true},morale:2,reaction:"He sets the drink down. “Loss first, complaints later; I shall need both sides of the paper.”"}]}
    ]},
   skip:"Liam tips his glass toward an old film poster instead of you and carries on past."
  },
  epilogue:{
   best:{title:"The Queue Is Back",line:"Liam signs a headshot beside his drink. “They asked about the next match before the films; I nearly charged extra.”"},
   neutral:{title:"Another Sunday",line:"Liam lifts his glass. “A few bookings, a few fights; the comeback remains available for further financing.”"},
   bad:{title:"Unanswered Calls",line:"Liam closes his phone beside the bottle. “No booking again; perhaps the bartender needs an action scene.”"}
  },
  scenes:[
   {line:"Be honest: is there a fight for me this week, or am I signing headshots for the bartender again?",replies:[
    {style:'straight',text:"There is a match for you this week. Bring the boots, not a comeback speech.",promise:'appearance',reaction:"He raises his glass. “A speaking part for both fists.”"},
    {style:'bureaucrat',text:"Let us write down your availability and the booking terms first.",reaction:"He braces the paper against his drink. “Put the appearance fee above the autograph rate.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He rereads the date. “Good; something still has my name on it after that loss.”"}]},
    {breaks:true,text:"Leave the headshots with me. I cannot promise a spot tonight.",reaction:"He keeps one under his glass. “That is what the agency said before they stopped calling.”"}]},
   {line:"Greek gave away my lead in Demeter’s Baby, I kicked him, SAG kicked me out—and somehow he kept top billing.",replies:[
    {style:'straight',text:"Tell Greek you want him across the ring. He can answer without a casting desk between you.",sides:{0:-3},reaction:"He lifts his drink. “A rejection I can finally hit back at legally.”"},
    {style:'bureaucrat',text:"Put the challenge in writing. Specify a match, not another confrontation.",reaction:"He writes MATCH in large letters. “The union correspondence was rather particular about that distinction.”"},
    {breaks:true,text:"The film is finished. Leave the old casting decision alone for tonight.",reaction:"He turns the glass by its rim. “Funny; that decision still gets work.”"}]},
   {line:"Someone recognized me, then asked whether I still get work; do I sign the headshot before or after the fight?",replies:[
    {style:'straight',text:"Sign it. Tell them when they can see you wrestle.",reaction:"He uncaps the pen after a drink. “A plug and a signature; I remember this.”"},
    {style:'bureaucrat',text:"Write the next announced date beneath your name. Keep it specific.",reaction:"He checks the date twice. “The pen is steadier when there is a booking.”"},
    {breaks:true,text:"Skip the autograph. We need to leave before this becomes an argument.",reaction:"He holds the pen over the photo. “They finally knew the face; I would like to finish the name.”"}]},
   {line:"That fellow said my best fight was twenty years ago; hold my drink while I give him something recent to review.",replies:[
    {style:'straight',text:"Keep the glass here. Save the new material for someone booked to fight you.",reaction:"He sits halfway down. “Reviews used to come after the bruises.”"},
    {style:'bureaucrat',text:"Name the opponent and the match you want. I will consider an actual booking.",reaction:"He finds a pen beside the glass. “Fine; an advance screening with a referee.”"},
    {truth:true,text:"He criticized a film. You are about to repeat the mistake that cost you your union card.",reaction:"His hand leaves the chair. “Yes. That particular sequel.” He sits down."}]},
   {line:"I found a headshot with room for one more credit; how small do they print “local wrestling sensation”?",replies:[
    {style:'straight',text:"You have a match this week. Give them a reason to remember that credit.",promise:'appearance',reaction:"He drinks to the blank space. “Small print; enormous fight.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He grins over the glass. “After that win, perhaps we can afford a second line.”"}]},
    {style:'bureaucrat',text:"Write wrestling appearances separately from the film credits. Let this work stand.",reaction:"He draws a line under the old titles. “New section; same expensive face.”"},
    {breaks:true,text:"Use the headshots you already have. We cannot pay for new prints.",reaction:"He studies the faded photograph. “Fair; the jaw has held up better than the ink.”"}]}
  ]},
 37:{speaker:'The Dog',style:'believer',place:'The yard behind the hall',
  tells:{wary:'He growls softly when you reach for the rulebook.',friendly:'He perks up when you come in, even with the bell put away.',warm:'He brings you things: a referee’s whistle, a folding chair.',devoted:'He brings you the rulebook open to page forty-one and trusts you to turn the page.'},
  moods:{
   low:{style:'hype',tell:"The Dog nudges the ball toward the ring and waits for you to call the next attempt."},
   high:{style:'believer',tell:"The Dog keeps the result tucked inside the rulebook, directly above the next available match date."}
  },distrusts:'bureaucrat',
  stale:'I brought that one back twice. Throw it somewhere I haven’t been.',
  heard:"{name} told me what you said. I am a dog, the book does not ban dogs, and I still want a match.",
  invite:{wary:"The Dog is guarding the rulebook at his usual spot.",friendly:"WOOF. meet me. bring the ball and a match idea.",warm:"[A photo of the rulebook beside a tennis ball. Caption: next match?]"},
  signoff:{wary:"Dog will wait. Dog would rather wrestle.",friendly:'Good booker.',warm:'The ball stays here, booker. You know where to find it.',devoted:"Same dog, same rulebook. Bring the next match."},
  sore:'You had another word for me. I am a dog. I can wait till you remember the right one.',soreWeeks:8,
  reacts:{kept:'The Dog brings you the rulebook open to page forty-one and waits for you to finish looking.',broken:'The Dog closes the rulebook around his bookmark and carries it back to the yard.'},
  jealous:"The Dog drops a ball beside the booking sheet. “{name} got a turn. Dog wants a wrestling turn.”",
  backstage:{
   won:{tell:"The Dog brings the result sheet and drops a ball beside the winner’s name.",
    line:"“Dog won. Dog followed the rules. Dog would like another match.”",
    replies:[
     {style:'believer',text:"Good dog. That win belongs to you.",reaction:"He guards the result. “Good result. Keeping it.”"},
     {style:'hype',text:"Show the crowd the winning name on your way out.",reaction:"He raises the sheet. “DOG. Very large DOG.”"},
     {style:'bureaucrat',text:"We will record the win in the results.",reaction:"He checks the sheet. “Use the whole name. Especially Dog.”"}
    ]},
   lost:{tell:"The Dog noses the ball toward the ring, watching for another start signal.",
    line:"“Lost the match; still a dog, still allowed to wrestle, still ready to chase.”",
    replies:[
     {style:'hype',text:"Give me the ball. Show me you have another chase in you.",reaction:"He darts forward. “Throw it past the last chair!”"},
     {style:'believer',text:"Stay a minute, good dog. One loss does not take your place away.",reaction:"He settles beside the book. “Good. Dog likes this place.”"},
     {style:'straight',promise:'rematch',text:"You and {name} next week. Save that chase for the bell.",reaction:"He perks up. “Rematch for the dog. Listening for the bell.”"}
    ]},
   stole:{tell:"The Dog carries the rulebook with a child’s DOG sign tucked inside.",
    line:"“The kid shouted DOG, everybody shouted DOG, and nobody found a rule against the match.”",
    replies:[
     {style:'believer',text:"Good dog. Keep the sign; you earned that noise.",reaction:"He tucks it safely inside. “Evidence that they liked the wrestling dog.”"},
     {style:'hype',text:"Give them one bark on the way out. See who answers.",reaction:"He barks and listens. “Their turn.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He steps toward the door. “Lost the match. Can still lead the howl.”"}]},
     {style:'straight',text:"Ask the kid which part made them start shouting.",reaction:"He checks the seat. “Dog wants to do that part again.”"}
    ]},
   flat:{tell:"The Dog waits beside the empty aisle with the ball at his feet.",
    line:"“Dog wrestled; crowd barely barked. Should dog chase faster?”",
    replies:[
     {style:'believer',text:"Show me what you tried when they went quiet.",reaction:"He takes a ready stance. “First they see the chase. Then dog goes.”"},
     {style:'hype',promise:'appearance',text:"You are on next week. Give them one bark they can answer.",reaction:"He tries a short bark. “Room for their bark. Good.”"},
     {breaks:true,text:"Keep the fetch routine short next time. We need to get to the match.",reaction:"He gathers the ball. “The chase is dog wrestling practice.”"}
    ]},
   kept:{tell:"The Dog brings the rulebook with the fulfilled booking tucked into page forty-one.",
    line:"“You gave this dog {promise}; no extra rule needed.”",
    replies:[
     {style:'believer',text:"Good dog. I remembered the commitment.",reaction:"He closes the book. “Good booker remembers the dog.”"},
     {style:'hype',text:"Write DOG on the result where you can find it again.",reaction:"He spreads out the paper. “DOG first. Date afterward.”"}
    ]},
   broken:{tell:"The Dog opens the book at the promise and waits beside you.",
    line:"“You said {promise}; I stayed ready, and the dog never got the call.”",
    replies:[
     {style:'believer',text:"I missed the commitment. You can stop waiting tonight.",reaction:"He closes the book. “Tell the dog sooner next time.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. DOG will be on the sheet.",reaction:"He looks toward the ring. “Call clearly. Dog will come.”"},
     {breaks:true,text:"Follow the posted card. If you are off it, you can leave.",reaction:"He stays beside the book. “Dog came to wrestle, not to leave.”"}
    ]},
   benched:{tell:"The Dog waits at the parking stripe, looking from the ball to the ring door.",
    line:"“{name} had a match; this dog has an escape to test and nobody to escape from.”",
    replies:[
     {style:'believer',promise:'appearance',text:"You have a match next week. Bring the escape to your corner.",reaction:"He picks up the ball. “Dog gets a turn. Good.”"},
     {style:'hype',text:"Show me the start of that escape. I will count it.",reaction:"He springs aside. “Dog is already over here.”"},
     {style:'straight',text:"Tell me what you want from your next match.",reaction:"He looks at the door. “Someone to chase. A bell. Wrestling for the dog.”"}
    ]},
   idle:{tell:"The Dog brings the same ball and a rulebook opened to the same page.",
    line:"“Four weeks; book has not changed, dog has not changed, booking could change.”",
    replies:[
     {style:'believer',promise:'appearance',text:"You have a match next week. Come through the front door.",reaction:"He perks up. “Dog knows the route to the ring.”"},
     {style:'hype',text:"Show me the chase you have been practicing.",reaction:"He sets the ball down. “Send it somewhere difficult. Dog has had time.”"}
    ]},
   cutIn:{tell:"The Dog returns with a ball and stops just outside the demonstrated grip.",
    line:"“{name} calls it unfinished Hold One; dog calls it getting free. Want to wrestle and check?”",
    replies:[
     {style:'believer',text:"Show the escape slowly. Let everyone see where you get free.",reaction:"He slips clear of the grip. “Dog ends up here. Hold stays there.”"},
     {style:'hype',text:"Once slowly, then at full speed. I will count it.",reaction:"He leaves the ball with you. “Watch the dog.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He sets himself again. “Count the escape. Dog needs to hear that part.”"}]},
     {style:'straight',text:"Try it at practice with a referee and a mat.",reaction:"He retrieves the ball. “Tell dog when. Dog will be there.”"}
    ]},
   skip:"The Dog retrieves his ball before it reaches you and carries it toward the ring instead."
  },
  epilogue:{
   best:{title:'The Yard Is Open',line:"The Dog brings the booking sheet. “Good matches. Good booker. Same dog ready for the next one.”"},
   neutral:{title:'Page Marked',line:"The Dog opens the rulebook. “Page forty-one still lets a dog wrestle. Let us use that fact.”"},
   bad:{title:'Behind the Fence',line:"The Dog keeps the book beside the gate. “Dog heard you coming. Bring a match, not a new rule.”"}
  },
  scenes:[
   {line:"I fetched a folding chair; put it in my corner, because this dog is ready to wrestle.",replies:[
    {style:'believer',text:"You have a match this week. Keep the chair in your corner.",promise:'appearance',reaction:"He carries it toward the ring. “Good corner. Good dog. Good booking.”"},
    {style:'hype',text:"Race to the far post and back. Show me that chase.",reaction:"He bounds off. “Count the dog home!”"},
    {breaks:true,text:"Leave it by the door. We are short chairs for the audience.",reaction:"He sets it down. “Fetched for the crowd. Still want a match.”"}]},
   {line:"DOG is missing from the poster, and “no dogs” is missing from the rules; only the poster needs correcting.",replies:[
    {style:'believer',text:"You are booked this week, good dog. DOG goes on the card.",promise:'appearance',reaction:"He shuts the book. “Big DOG. Very readable dog.”",
     cases:[{when:{eventWeek:true},morale:2,reaction:"He checks the event poster. “Big crowd. Bigger DOG.”"}]},
    {style:'hype',text:"Read the page aloud. I will call DOG where the poster missed it.",reaction:"He takes a breath. “Page forty-one. Woof for emphasis.”"},
    {breaks:true,text:"Leave a copy with the referee. We need the approval recorded.",reaction:"He keeps his copy close. “The dog already checked. The dog is ready.”"}]},
   {line:"Bev says fetching her chair here does not count as returning it; does she want a longer fetch before I wrestle?",replies:[
    {style:'believer',text:"Good dog. Fetch it all the way to her door.",reaction:"He takes up the chair. “Complete fetch. Then a match?”"},
    {style:'hype',text:"One final carry. I will count it home when the chair is at her door.",reaction:"He hurries off. “Watch this dog finish!”"},
    {truth:true,text:"You took it to the wrong place. Ask Bev where she wants it and return it there.",reaction:"He looks back at the chair. “Wrong destination. Dog can fix the fetch.”"}]},
   {line:"I rolled out of Hold One; 2 Holds says that cannot be a move, but a dog just did it and wants to do it again.",replies:[
    {style:'believer',text:"Write down the escape. He can demonstrate Hold One if he disputes what happened.",sides:{1:-3},reaction:"He opens the margin. “Dog got free. Short report.”"},
    {style:'hype',text:"Draw two corners. You can test the escape against his grip at practice.",reaction:"He marks a corner. “Dog goes here. Dog leaves the hold over there.”"},
    {breaks:true,text:"Keep the margin clear. Bev needs to lend that book out.",reaction:"He puts the pencil aside. “Fine. Dog will demonstrate without notes.”"}]},
   {line:"A kid threw the ball sideways and I fetched it; does the next opponent know a dog can chase in every direction?",replies:[
    {style:'believer',text:"You have the mic this week. Tell the kid that every good chase counts.",promise:'promo',reaction:"He noses the ball toward an empty chair. “Dog will demonstrate the difficult fetch.”"},
    {style:'hype',text:"Show me the sideways chase. I will call when you get there.",reaction:"He sets off. “Send it farther!”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He returns with the ball. “Again. Dog can still do it.”"}]},
    {breaks:true,text:"Thank the kid and leave it as a game. We do not need another written rule.",reaction:"He keeps the ball close. “Good game. Still no rule against wrestling dogs.”"}]}
  ]}
};
// Rival-specific opening lines. The existing moment still supplies the tell, replies, and effects.
const FEATURED_RIVAL_LINES={
 0:{
  benched:{
   26:'“Smark was given the floor to defend tradition; what does he imagine Greco Wrestling is, a recent invention?”',
   31:'“Ron was booked and remained neutral about the whole thing; Greece has no shortage of neutral spectators.”',
   34:'“Liam got the contest while Greco Wrestling waited outside; Greece has awarded enough opportunities to that boot.”'
  },
  cutIn:{
   26:'“Smark demands tradition; excellent, let us go back far enough to begin with Greco Wrestling.”',
   31:'“Ron need not choose a side; the front row can observe the Greco Wrestling grip from either one.”',
   34:'“Liam can explain the boot at his leisure; I am here to demonstrate what Greco Wrestling can do with two hands.”'
  },
  lost:{24:'“Jesus offered to save me after the bell; I requested help correcting the Greco Wrestling grip instead.”'}
 },
 31:{
  benched:{12:'“John Smith worked tonight; three people have already corrected the wording of his safety announcement, and I would like them all to STOP.”'},
  cutIn:{12:'“John Smith has corrected the correction to his correction; no further corrections will be entertained by either corner.”'}
 }
};

const FEATURED_IDS=Object.keys(FEATURED_ROUTES).map(Number);

// Stable beat and memory IDs preserve existing Sweeps saves.
const SWEEPS_BEATS={
 'after-hours':{kind:'beat',when:{},cue:'First evening after his spotlight month',
  line:"Hear the grit under that board, boss? I have swept this whole stretch and that tiny crunch is making me absolutely furious.",
  replies:[
   {style:'believer',text:"Show me where it is. We will find a way to reach it.",reaction:"He points with the broom. “There; smug little crunch right there.”"},
   {style:'straight',text:"What does cleaning that seam have to do with chasing the belt?",reaction:"He scrubs at it. “I want the top of the card clean too.”"},
   {breaks:true,text:"It is one board. We need to close up.",reaction:"He wedges in a bristle. “Then start with every door except this one.”"}
  ]},
 path:{kind:'beat',when:{minTrust:55},cue:'Once friendly, after he’s shown you how the boards sound',
  line:"Grit in my elbow after that bump, boss; book me a match and I am cleaning the canvas before another soul touches it.",
  replies:[
   {style:'believer',text:"You have a match this week. The canvas is yours before doors.",promise:'appearance',reaction:"He checks the broom head. “Good; nobody gets a mouthful of this filth on my watch.”"},
   {style:'bureaucrat',text:"I will put canvas sweeping on the crew checklist.",reaction:"“And I will check the checklist.” He sweeps beneath your shoes."},
   {breaks:true,text:'The crew has a mop. Leave it to them.',reaction:"He gathers another pinch of grit. “Then they can bring the mop here and explain this.”"}
  ]},
 stain:{kind:'flag',flag:true,when:{minTrust:70,workedLastWeek:true},cue:"After a worked show, Sweeps discovers a mark that resists every pass",
  memory:'stain',plan:'Sweeps faces the Unsweepable Stain',invite:'Boss. Side door’s open. Look by the timekeeper’s table.',
  line:"This stain has survived sweeping, scrubbing and a scraper; I will not be outworked by old bloody coffee.",
  replies:[
   {style:'believer',text:"You get the mic next week. Tell them why this spot is not getting the last word.",promise:'promo',due:1,reaction:"He scrubs through the sentence. “They can watch; maybe shame will shift the bastard.”"},
   {style:'straight',text:"Bring the scraper back. I can hold the light while you work.",reaction:"He reaches for it immediately. “Now that is useful company.”"},
   {breaks:true,text:"Cover it with a chair until we have time to treat it properly.",reaction:"He moves the chair away and scrubs. “Furniture is not cleaning.”"}
  ]},
 ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once he trusts you with the title shot',
  askPromise:{kind:'title',due:'event'},invite:'Can you come by? Got something to ask. Didn’t want to do it over the phone.',
  line:"Give me the next big title match; twenty-four hours of sweeping first, and heaven help the first dirty boot across that floor.",
  replies:[
   {style:'believer',ask:'accept',text:"You have the title match and the floor for the day beforehand.",reaction:"He starts sweeping. “Clock starts now; so does the inspection.”"},
   {style:'straight',ask:'defer',delta:-2,text:'Give me four weeks to find the time for it.',reaction:"He grinds a bristle into a seam. “Four more weeks of dirt; I will be ready.”"},
   {ask:'decline',delta:-10,text:"I cannot give you the title match. You can stop preparing for it.",reaction:"He sweeps a paper cup into the pan. “Match or no match, this is still bloody filthy.”"}
  ]},
 vigil:{kind:'final',when:{},day:'Friday',cue:'The Friday of the week his title match is due',
  invite:'Hour one. Come at nineteen if you can. Bring something with a lid.',
  line:"Hour nineteen, boss; I can see my face in the boards, and behind it some idiot carrying an open bag of chips.",
  replies:[
   {style:'believer',text:"I will move the chairs and intercept the chips. Keep going.",reaction:"He sweeps under the first chair. “Best corner work I have seen all week.”"},
   {style:'hype',text:"Everyone is going to notice what you have done when they walk in.",reaction:"He points the broom at the door. “They can notice the doormat first.”"}
  ]}
};
const SWEEPS_MEMORIES=[{id:'stain',title:'The Unsweepable Stain',caption:"Week {week} · The stain resisted; Sweeps brought the scraper back."}];
const SWEEPS_ENDINGS={
 best:{title:'The Cleanest Title Match in Wisconsin',line:"Sweeps attacks the two sets of boot prints. “Twenty-four hours for a title match, boss; not letting the first filthy footprint undo it.”"},
 neutral:{title:'A Fair Shake, At Last',line:"Sweeps works along the apron. “Got the title match; could have used company while I scrubbed, but the dirt got no reprieve.”"},
 bad:{title:"The Broom Keeps Moving",line:"Sweeps drags the bin closer. “No title match; plenty of rubbish. One of those I can fix tonight.”"}
};

// The promises track matches and mic time. The plans describe staging the promise system cannot check,
// such as a final slot, who chose an opponent, a camera setup or a retirement ceremony.
// The after-show walk's fallback lines for any featured wrestler without their own `backstage` moment.
// Speaker-neutral on purpose: write each route's own versions (see FORMAT above) to replace these.
const BACKSTAGE_GENERIC={
 won:{tell:'{speaker} is still breathing hard, grinning at nobody in particular.',line:'“Did you see that? Tell me you saw that.”',replies:[
  {style:'believer',text:'“I saw it. That was all you.”',reaction:'A real smile. “All me.”'},
  {style:'hype',promise:'promo',text:'“Next week you tell the whole town about it.”',reaction:'“The whole town.” {speaker} is already rehearsing.'},
  {style:'straight',text:'“Good win. Ice that shoulder.”',reaction:'A short nod. Nobody argues with ice.'}]},
 lost:{tell:'{speaker} is sitting on an equipment case, staring at the floor.',line:'“{name} got me tonight. Go on. Say it.”',replies:[
  {style:'believer',text:'“One night doesn’t change what I think of you.”',reaction:'{speaker} looks up for the first time. “Okay.”'},
  {style:'hype',promise:'rematch',text:'“You want {name} again? You’ve got it.”',reaction:'“Again.” The word does something. {speaker} stands up.'},
  {truth:true,text:'“{name} was better tonight. Watch the tape.”',reaction:'It stings. {speaker} nods anyway. “The tape.”'}]},
 stole:{tell:'People keep stopping {speaker} in the hall to shake hands.',line:'“Best in the building. Tell me I’m wrong.”',replies:[
  {style:'hype',text:'“You’re not wrong. Best in the building.”',reaction:'{speaker} says it back to the hallway, louder.'},
  {style:'straight',text:'“Match of the night. It’s on the record.”',reaction:'“On the record.” That seems to matter more than the handshakes.'},
  {style:'bureaucrat',promise:'appearance',text:'“I’m writing it down. You’re on next week’s card.”',reaction:'{speaker} watches you write it, every letter.'}]},
 flat:{tell:'{speaker} is pacing by the curtain.',line:'“That one didn’t land. I know it didn’t.”',replies:[
  {style:'believer',text:'“Everybody has a night like that. Not every night.”',reaction:'The pacing slows down.'},
  {truth:true,text:'“It was flat. You know why. Fix it next week.”',reaction:'A long breath. “Yeah. I know why.”'},
  {style:'hype',promise:'promo',text:'“Nobody remembers a quiet night. Next week, go bigger on the mic.”',reaction:'“Bigger.” {speaker} likes the sound of that.'}]},
 kept:{tell:'{speaker} is waiting with a hand already out.',line:'“You said you’d do it. You did it.”',replies:[
  {style:'believer',text:'“I meant it.”',reaction:'A firm handshake that goes on a little too long.'},
  {style:'straight',text:'“That’s how this works.”',reaction:'“That’s how it should work,” {speaker} says. “It usually doesn’t.”'},
  {style:'hype',text:'“And that’s only the start.”',reaction:'{speaker} grins. “Hold you to it.”'}]},
 broken:{tell:'{speaker} is waiting somewhere you can’t miss them.',line:'“You told me {promise}. I checked the card twice.”',replies:[
  {style:'bureaucrat',promise:'appearance',text:'“That’s on me. You’re first on next week’s sheet.”',reaction:'{speaker} nods slowly. “First. I’ll be looking.”'},
  {style:'straight',text:'“It didn’t fit tonight. I should have told you sooner.”',reaction:'“Sooner would’ve been nice.” But {speaker} doesn’t walk away.'},
  {breaks:true,text:'“The card’s the card. Next week.”',reaction:'{speaker} doesn’t answer. That’s the answer.'}]},
 benched:{tell:'{speaker} is waiting by your car. They watched the whole show from the back row.',line:'“{name} got the spot tonight. I noticed.”',replies:[
  {style:'believer',text:'“Your night’s coming. I mean that.”',reaction:'“Coming.” {speaker} tries the word out.'},
  {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Done.”',reaction:'{speaker} pushes off the car. “Done, then.”'},
  {style:'straight',text:'“{name} earned it this week. That’s all it was.”',reaction:'“This week.” {speaker} lets that sit.'}]},
 idle:{tell:'{speaker} is waiting by the exit, keys in hand.',line:'“Been a while since you put me on a card. Just saying.”',replies:[
  {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s sheet.”',reaction:'“I’ll believe it when I see it printed.” A small smile anyway.'},
  {style:'believer',text:'“I haven’t forgotten you. Promise.”',reaction:'{speaker} studies your face, then nods.'},
  {style:'straight',text:'“The right spot hasn’t come up yet.”',reaction:'“Then make one.” {speaker} heads for the door.'}]},
 cutIn:{tell:'{speaker} has been listening from a doorway, and isn’t anymore.',line:'“Don’t let {name} tell it like that.”',replies:[
  {style:'straight',text:'“Say your piece, then.”',reaction:'{speaker} says it, all of it, and seems lighter after.'},
  {style:'believer',text:'“You’ll get your turn. I mean it.”',reaction:'“My turn.” {speaker} steps back into the doorway.'},
  {style:'hype',promise:'rematch',text:'“You want {name}? Next week.”',reaction:'Down the hall, {name} heard that too.'}]},
 skip:'{speaker} walks past to the parking lot without stopping. A nod, which is somehow worse.'
};

const ROUTE_STORIES={
 // The title promise covers a defense or a chance to reclaim the belt.
 0:{beats:{
  'name-in-the-song':{kind:'beat',when:{minTrust:55},cue:"Greek invites the booker to record his Greco Wrestling research",
   plan:"Greek announces his Greco Wrestling research to the crowd",
   line:"Greco Wrestling requires a record worthy of its greatest student; mortal, can you write while applauding?",
   replies:[
    {style:'hype',text:"Announce the research on the mic this week. I will make sure they know whose work it is.",promise:'promo',reaction:"He hands you a notebook. “Begin with my name; leave room for further distinctions.”"},
    {style:'straight',text:"I can record the grips. Show me where the first one starts.",reaction:"He positions your pencil. “At the shoulder, as all civilized inquiries should.”"},
    {breaks:true,text:"I can book the matches, but I cannot take notes through every one.",reaction:"He retrieves the notebook. “Then Greece must await a literate witness.”"}
   ]},
  'mortal-in-the-ring':{kind:'beat',when:{minTrust:62},cue:"Greek seeks an opponent who can test his Greco Wrestling",
   plan:"Greek tests his Greco Wrestling against a worthy challenger",
   line:"My practice opponent agrees with every throw; find me someone whose resistance improves the research.",
   replies:[
    {style:'hype',text:"You have a match this week. Let someone make you earn the grip.",promise:'appearance',reaction:"He shuts the notebook. “Excellent; a peer with objections.”"},
    {style:'believer',text:"Try the grip without assuming the throw will follow.",reaction:"He loosens his hands. “An unanswered question; how infuriatingly useful.”"},
    {breaks:true,text:"A tougher opponent might just beat you.",reaction:"“Naturally.” His jaw sets. “But I would prefer a booker curious about the attempt.”"}
   ]},
  'room-for-the-chorus':{kind:'beat',when:{minTrust:68},cue:"Greek asks spectators to judge his Greco Wrestling",
   plan:"Greek asks the crowd to watch his Greco Wrestling grips closely",
   line:"The crowd applauds my laurel before I touch an opponent; how shall Greece learn to appreciate the actual Greco Wrestling?",
   replies:[
    {style:'hype',text:"Take the mic this week. Show them one grip slowly enough to recognize it later.",promise:'promo',reaction:"He raises one hand. “A public lecture with consequences.”"},
    {style:'straight',text:"Ask which throw they remember, then listen to the answer.",reaction:"He opens to a blank page. “Even an incorrect answer is evidence.”"},
    {breaks:true,text:"If they cheer the entrance, take the applause and keep moving.",reaction:"He grips the laurel. “This is foliage, mortal; my work begins below it.”"}
   ]},
  'olympus-roof':{kind:'flag',when:{minTrust:70,lostLastShow:true},cue:"After a loss, Greek seeks a divine explanation for his failed grip",
   invite:"Greek waits at the highest nearby perch with his notes and a crooked laurel.",
   memory:'olympus-roof',
   line:"I performed proper Greco Wrestling and still fell; surely Zeus has an observation beyond this dreadful wind.",
   replies:[
    {style:'hype',text:"They watched the grip, Greek. You made them care whether it held.",reaction:"He straightens the laurel. “Then Greece has learned enough to notice.”"},
    {style:'believer',text:"The grip failed once. It is still worth understanding.",reaction:"He opens the notebook against the wind. “Sit here; the left hand is the mystery.”"},
    {breaks:true,text:"The sky will not explain a lost match. Come down.",reaction:"He shields the page. “Then I shall continue my inquiry without your weather report.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Greek requests a title match to establish Greco Wrestling’s standing",
   askPromise:{kind:'title',due:'event',plan:"Greek’s title match: a showcase for his Greco Wrestling research"},
   invite:"Bring the next tour card. Greek has reserved a page for a championship contest.",
   line:"Give me a championship contest where all Greece may witness Greco Wrestling; the title deserves evidence of its greatness.",
   replies:[
    {style:'hype',ask:'accept',text:"Your title match is on the next tour show. Give them Greco Wrestling worth remembering.",reaction:"He titles the page CHAMPIONSHIP INQUIRY. “The result shall be recorded, even if it displeases me.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Give me four weeks before we commit the championship slot.",reaction:"He marks four empty circles. “Four weeks; even a symposium eventually begins.”"},
    {ask:'decline',delta:-10,text:"I cannot give this research a title match.",reaction:"He closes the notebook over the laurel. “Then Greece must judge from the lesser contests.”"}
   ]},
  'chorus-call':{kind:'final',when:{},cue:"Before the title match, Greek rehearses accepting the evidence of the bell",
   invite:"Greek requests one final inspection of his Greco Wrestling notes.",
   line:"If the title escapes my grip, keep writing; I cannot become the foremost master of Greco Wrestling by omitting the difficult pages.",
   replies:[
    {style:'hype',text:"I will record the finish and let the crowd respond before you explain it.",reaction:"He nods at the empty line. “Give the evidence its moment; then I shall have several observations.”"},
    {style:'believer',text:"I will stay and help you work out what the match taught you.",reaction:"He offers the notebook. “A witness who remains after an unfavorable result; Greece has few.”"}
   ]}
 },memories:[{id:'olympus-roof',title:"Research Above Olympus",caption:"Week {week} · The wind turned the page; Greek kept studying the failed grip."}],
 endings:{
  best:{title:"Greece Has Seen the Grip",line:"Greek opens his notebook. “A championship contest, every grip recorded; Greece now knows what Greco Wrestling demands.”"},
  neutral:{title:"Evidence at the Bell",line:"Greek circles a diagram. “The title contest supplied evidence; I should have spent less time explaining it before it happened.”"},
  bad:{title:"An Unfinished Inquiry",line:"Greek shuts his notebook. “No championship inquiry; I shall prove the worth of Greco Wrestling one lesser contest at a time.”"}
 }},
 37:{beats:{
  'page-forty-one':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, the Dog shows you his evidence',
   plan:'The Dog brings the unabridged rulebook to the referee before his match',
   line:"I checked boots, tape, mouthguards and the index; no ban on dogs, so when does this dog wrestle?",
   replies:[
    {style:'believer',text:'You have a match this week, good dog. Show the referee the page before the bell.',promise:'appearance',reaction:"He opens the marked page. “Evidence ready. Dog ready.”"},
    {style:'bureaucrat',text:'I’ll check the index. What else might they call a dog?',reaction:'“A good dog.” He leans closer to the index. “Try under G.”'},
    {breaks:true,text:"Leave the rulebook with the officials. I cannot read the whole thing tonight.",reaction:"He keeps it close. “Dog needs the evidence when someone asks.”"}
   ]},
  'the-whistle':{kind:'beat',when:{minTrust:62},cue:'Once the Dog brings you the referee’s whistle',
   plan:'The Dog returns the whistle and asks for the same start signal as everyone else',
   line:"I fetched the referee’s whistle and I stop when it blows; this dog would now like the bell that means wrestle.",
   replies:[
    {style:'believer',text:'You get a match this week. Hand it back to the ref yourself. Good dog.',promise:'appearance',reaction:"He presents the whistle proudly. “Returned. Ready. Woof.”"},
    {style:'straight',text:'Let’s return it now. The ref will be looking for it.',reaction:"He heads for the referee. “Good fetch ends at the right referee.”"},
    {breaks:true,text:'Leave it at the gate. The ref can pick it up on the way in.',reaction:"He waits beside the whistle. “Dog can deliver it farther than a gate.”"}
   ]},
  'front-row-test':{kind:'beat',when:{minTrust:68},cue:'Once warm, he wants the audience to look for themselves',
   plan:'The Dog lends the front row his rulebook and wrestles under the same rules as everyone',
   line:"Let the front row hold the rulebook during my match; nobody can add “no dogs” while everybody watches this dog wrestle.",
   replies:[
    {style:'believer',text:'You have a match. Let that kid hold the book, and wrestle by the rules they’re holding.',promise:'appearance',reaction:"He finds a steady place for the book. “Good witnesses. Good dog.”"},
    {style:'bureaucrat',text:'We’ll mark the edition and date. Then we’ll know what version they saw.',reaction:"He taps the printing date. “Older than my first match. Still lets the dog wrestle.”"},
    {breaks:true,text:'Nobody came to watch you read.',reaction:'He wipes the cover with his sleeve. “Then they can watch me follow it.”'}
   ]},
  'bev-amendment':{kind:'flag',when:{minTrust:70,workedLastWeek:true},cue:'After the ladder, once warm and the week after the Dog worked',
   invite:"bev has a pencil. dog has the book. please come.",
   memory:'bev-amendment',
   line:"Bev is pencilling “no dogs” under mouthguards; I am a dog, not a mouthguard, and that is not a printed rule.",
   replies:[
    {style:'believer',text:'Good dog. Keep your place. Ask Bev to read the rules that are there before she adds one.',reaction:"He holds the page open. “Good dog can wait for accurate reading.”"},
    {style:'bureaucrat',text:'Ask Bev to mark it as proposed. A proposal isn’t a rule yet.',reaction:'He puts a blank sheet beside the book. “There. She can write on that all day.”'},
    {breaks:true,text:"Let Bev handle the paperwork. I need to finish the card.",reaction:"He guards the open page. “Finish it with DOG on it. This dog is staying.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once the Dog trusts you to give the book the main event',
   askPromise:{kind:'promo',due:'event',plan:'Main event: the Dog reads the entire unabridged rulebook aloud, including the index'},
   invite:"dog counted every page. bring a pencil. a long one.",
   line:"Give me the microphone for the whole rulebook; everybody will hear that nothing bans this dog from wrestling.",
   replies:[
    {style:'believer',ask:'accept',text:'The next tour show is yours to close, good dog. Read every word.',reaction:"He opens to the first page. “Complete reading. Undeniable dog.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'Leave your place marked. Ask me again in four weeks.',reaction:"He marks his place. “Dog can wait four weeks. Dog still wants to wrestle now.”"},
    {ask:'decline',delta:-10,text:'I won’t give you the microphone for the book.',reaction:"He shuts the book. “No microphone does not mean no dogs.”"}
   ]},
  'the-long-read':{kind:'final',when:{},cue:'The week the reading is due, when he rehearses the whole book',
   invite:'practice read. dog can sit for all the pages. bring the long pencil.',
   line:"The last page is blank; I will show it too, so nobody imagines a hidden ban on wrestling dogs.",
   replies:[
    {style:'believer',text:'Hold it up and let everyone look. Then say “Good night” and close the book.',reaction:"He raises the blank page. “Good night. Good dog. Still eligible.”"},
    {style:'straight',text:'Turn it toward the crowd. Let them see there’s nothing left to read.',reaction:"He holds it toward the chairs. “Nothing there. Dog can wrestle.”"}
   ]}
 },memories:[{id:'bev-amendment',title:'The Pencil by Page 41',caption:'Week {week} · A sharpened pencil lay beside page forty-one.'}],
 endings:{
  best:{title:'The Unabridged Main Event',line:"The Dog closes the rulebook. “Every page. No ban. The whole crowd heard it; now ring the bell for the dog.”"},
  neutral:{title:'Entered into the Record',line:"The Dog reopens the book. “Reading done. Blank page still here for anyone who missed it. Dog wants the next match.”"},
  bad:{title:'Still on Page Forty-One',line:"The Dog guards the marked page. “No reading on the show. Still a dog. Still no rule. Still want to wrestle.”"}
 }},
 10:{opens:{afterSpotlight:true},beats:SWEEPS_BEATS,memories:SWEEPS_MEMORIES,endings:SWEEPS_ENDINGS},
 1:{beats:{
  'first-hold':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, he wants an opponent for Hold One',
   plan:'2 Holds gives Hold One its full demonstration against a resisting opponent',
   line:"Put Hold One on the poster; I need resistance strong enough to expose the last imperfection in the grip.",
   replies:[
    {style:'straight',text:'You have a match this week. I’ll put Hold One on the poster.',promise:'appearance',reaction:'He puts one finger on the blank poster. “Print it here. There’s no need for a second line.”'},
    {style:'bureaucrat',text:'Can you submit the grip in writing?',reaction:'He slides over a single sheet with a thumbprint in the middle. “That is where the thumb goes.”'},
    {breaks:true,text:"The audience has seen Hold One. We need a reason to advertise another demonstration.",reaction:"He indicates the thumb. “It has improved since they last looked.”"}
   ]},
  'hold-one-aloud':{kind:'beat',when:{minTrust:62},cue:'Once he lets the booker hear how he teaches Hold One',
   plan:"2 Holds uses mic time to explain the complete two-hold scope of wrestling",
   line:"They keep asking what comes after Hold Two; I must correct this arithmetic publicly.",
   replies:[
    {style:'straight',text:"You have the mic this week. Explain the two holds from the feet upward.",promise:'promo',reaction:"He checks both boots. “A complete syllabus. Two items.”"},
    {style:'believer',text:'Could the whole front row try the stance at once?',reaction:"He moves a chair. “Yes; the front row can practice Hold One. The back row must not invent anything.”"},
    {breaks:true,text:'Use the time to show them something new.',reaction:"He raises two fingers. “There is refinement. There is no additional item.”"}
   ]},
  'case-at-ringside':{kind:'beat',when:{minTrust:68},cue:"He entrusts the closed case of Hold Two notes to the booker",
   plan:'2 Holds tests a clear route from the entrance to ringside with the locked briefcase',
   line:"Carry the Hold Two notes to ringside; I want to test Hold One with the rest of wrestling close at hand.",
   replies:[
    {style:'straight',text:'You have a match this week. I’ll put the case where you can see it.',promise:'appearance',reaction:"He hands over the case. “Closed until requested; I know the second hold without reading.”"},
    {style:'bureaucrat',text:'I’ll record who has custody of it, start to finish.',reaction:'He hands you a pencil. “Write ‘closed’ beside both names.”'},
    {breaks:true,text:'Leave the case here. It’s getting in the way.',reaction:"He sets it behind his boots. “Half the discipline is not clutter.”"}
   ]},
  'open-latch':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'Optional: after the ladder and a recent match, the briefcase latch gives way',
   invite:"The case latch has broken. Hold Two notes are exposed; please come.",
   memory:'open-latch',
   line:"The latch broke; these notes contain years of Hold Two corrections, and I would prefer you saw the perfected version.",
   replies:[
    {style:'straight',text:'Turn around. I’ll hold it shut until you’re ready.',reaction:"He turns back to practice. “Good. Hold One should not lose an evening to a latch.”"},
    {style:'bureaucrat',text:'I’ll put a seal across it. You can decide when to break it.',reaction:"He offers wrist tape. “Across the lid; do not tape over a diagram.”"},
    {breaks:true,text:"Let me look. We need to know how much work is left before the show.",reaction:"He closes the lid. “The timetable does not improve the hold.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he offers one reveal; the next tour show is the intended stage',
   askPromise:{kind:'appearance',due:'event',plan:"2 Holds publicly unveils his perfected Hold Two once; the case stays closed until requested"},
   invite:"Hold Two is ready for a public demonstration. A date is required.",
   line:"Book one proper public unveiling of Hold Two; I have spent years on the second half of all wrestling.",
   replies:[
    {style:'straight',ask:'accept',text:'The next tour show. You have a match, and you decide when to open it.',reaction:"He sets the case beside his feet. “One unveiling. Many years of practice behind it.”"},
    {style:'hype',ask:'accept',askDue:0,cap:'neutral',text:'Tonight! I’ll add a match and tell the door crew there’s a surprise.',reaction:"He holds the handle tightly. “Tonight is available. It is not suitably prepared.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'Give me four weeks to find the right show.',reaction:"He writes four practice weeks. “I can refine both holds in that time.”"},
    {ask:'decline',delta:-10,text:'I won’t book a match for the reveal. The case stays shut.',reaction:"He picks up the case. “Then mastery continues without an audience.”"}
   ]},
  'the-last-drill':{kind:'final',when:{},cue:'The week the tour match is due, he rehearses the approach without opening the case',
   invite:"Final drill before the unveiling. Watch the feet.",
   line:"The audience will watch the Hold Two notes; watch my feet, because the second hold deserves the same precision as the first.",
   replies:[
    {style:'straight',text:'I’ll watch your feet. You’ll know when you have enough room.',reaction:'He puts his left boot down first. “That’s the part nobody writes down.”'},
    {style:'believer',text:'I’ll watch both boots. Let everybody else watch the lock.',reaction:'“Good.” He takes the first step again, slower this time.'}
   ]}
 },memories:[{id:'open-latch',title:'The Open Latch',caption:"Week {week} · The latch failed; the Hold Two notes stayed private."}],
 endings:{
  best:{title:'The Second Hold',line:"2 Holds checks his stance. “Both holds, properly demonstrated. Now I can begin refining the next half millimeter.”"},
  neutral:{title:'Once Means Once',line:"2 Holds closes the case. “The unveiling happened. The preparation deserved a better night; I will keep improving both holds.”"},
  bad:{title:'The Lock Stays Shut',line:'2 Holds sets the case beside his boots. “The case stays closed. Both holds still require practice.”'}
 }},
 18:{beats:{
  'sealed-favor':{kind:'beat',when:{minTrust:55},cue:'After tea, Charming asks you to grant a small favor without knowing the secret',
   plan:'Charming enters with a sealed thank-you note for his opponent',
   line:"Please leave the sealed favor under the saucer; the opponent’s emergency contact costs extra to read.",
   replies:[
    {style:'bureaucrat',text:'One match this week. I’ll record that the envelope stayed sealed.',promise:'appearance',reaction:"Charming tops up the cup. “An audit trail leading straight to the bill. Lovely.”"},
    {style:'straight',text:'Tell me what you want first.',reaction:"Charming turns the saucer. “An opponent with nobody waiting afterward, please.”"},
    {breaks:true,text:'Take the envelope out from under my saucer.',reaction:"Charming lifts the envelope with the tongs. “Certainly. The opponent’s coat has a lovely dry pocket.”"}
   ]},
  'right-of-reply':{kind:'beat',when:{minTrust:62},cue:'Once he trusts you with his version of a public courtesy',
   plan:'Charming thanks his next opponent in advance, then gives them the right of reply',
   line:"A thank-you for the opponent’s future hospital stay was mistaken for a threat; please provide a microphone to clarify the billing address.",
   replies:[
    {style:'bureaucrat',text:'You have the mic this week. State exactly what you’re thanking them for.',promise:'promo',reaction:"Charming unfolds a shorter note. “For the bed, the flowers, and the sudden vacancy on the card. Thank you.”"},
    {style:'straight',text:'What will you say if they decline the thanks?',reaction:"Charming pours the tea. “Refusal is welcome. Collection fees are also welcome.”"},
    {breaks:true,text:'It was a threat. They read it right.',reaction:"Charming smiles too long. “A beautifully phrased threat, surely. Please credit the penmanship.”"}
   ]},
  'guest-of-honor':{kind:'beat',when:{minTrust:68},cue:'Once warm, he lets you inspect how he arranges a match',
   plan:'Charming offers his opponent the ceremonial first entrance and keeps the second for himself',
   line:"Please give the guest the finest chair: facing the wall, freshly varnished, and very difficult to leave in a hurry.",
   replies:[
    {style:'bureaucrat',text:'You have a match. Their entrance first. I’ll write down exactly what I’ve agreed to.',promise:'appearance',reaction:"Charming pulls the chair out. “A first entrance and a last opportunity to flee. How formal.”"},
    {style:'believer',text:'Offer the nicer corner. See whether they take it.',reaction:"Charming considers both corners. “A lovely choice between two equally regrettable seats.”"},
    {breaks:true,text:'I’m not arranging the card around your seating plan.',reaction:"Charming slides the plan under the cup. “Certainly. Please enjoy the surprise seating.”"}
   ]},
  'empty-place':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After the ladder and a recent match, a guest leaves their invitation unanswered',
   invite:"Tea, please. A guest has returned an invitation unopened. Kindly bring a sharper letter opener.",
   memory:'empty-place',
   line:"An invitation returned unopened; please reserve the finest empty seat for the guest’s eventual apology, or the guest’s belongings.",
   replies:[
    {style:'bureaucrat',text:"Mark it declined. Leave the place open and let someone ask for it.",reaction:"Charming dusts the seat. “A voluntary replacement. Much better for the paperwork.”"},
    {style:'straight',text:"Ask them to wrestle instead of coming to tea.",reaction:"Charming picks up the pen. “No tea, no cover charge, no guarantee of a trip home. Elegant.”"},
    {breaks:true,text:"They may simply want to be left alone. Leave the invitation closed.",reaction:"Charming slips another envelope into your coat. “An excellent reason to send correspondence by surprise.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Charming asks for one match and pitches a future of increasingly devious shows",
   askPromise:{kind:'appearance',due:'event',plan:"Charming’s tour-show appearance with an opponent of his choosing and a ringside place setting"},
   invite:"Please bring the next tour card. One blank space will do; a little more cruelty can be arranged later.",
   line:"One opponent of choice at the next tour show, please; every show thereafter can become a little more devious, at no extra charge to the booking office.",
   replies:[
    {style:'bureaucrat',ask:'accept',text:"You have one match and one opponent of your choosing. I am approving only that booking.",reaction:"Charming signs with a flourish. “One small permission. Plenty of room for an ugly consequence. Thank you.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Keep the suggestion sealed. Bring it back in four weeks.",reaction:"Charming smooths the flap. “Four weeks to prepare the least generous possible welcome. Lovely.”"},
    {ask:'decline',delta:-10,text:"I will not book a match on those terms. Keep the invitation.",reaction:"Charming takes your plate. “Of course. Please enjoy the hunger at no additional charge.”"}
   ]},
  'the-place-card':{kind:'final',when:{},cue:'The week his match is due, he offers to sign his own work',
   invite:'One last detail before the match. Please bring a pen suitable for assigning blame.',
   line:"Please choose the signature: Charming for credit, the booking office for liability, or both for the pleasure of shared blame.",
   replies:[
    {style:'bureaucrat',text:'Sign your own invitation. Let them know who offered the chair.',reaction:"Charming signs slowly. “Kind regards, Charming Friendly. Please spell the name correctly in the complaint.”"},
    {style:'straight',text:'Set both names on the table. I booked it. You asked for it.',reaction:"Charming sets out two cards. “Shared liability with matching stationery. Exquisite.”"}
   ]}
 },memories:[{id:'empty-place',title:'A Place Left Open',caption:"Week {week} · The guest left the invitation sealed. Charming prepared another."}],
 endings:{
  best:{title:'By Personal Invitation',line:"Charming stamps an envelope. “Thank you for the match. Please forward any complaints to the complimentary shredder.”"},
  neutral:{title:'A Table for Two',line:"Charming squares the chairs. “A satisfactory booking. Please stay long enough next time to watch the guest discover the exit fee.”"},
  bad:{title:'Kind Regards',line:"Charming posts the unopened invitation. “Please accept the returned envelope and a modest invoice for the disappointment.”"}
 }},
 20:{beats:{
  'one-heart':{kind:'beat',when:{minTrust:55},cue:"The Grinch tries to welcome the entire crowd",
   plan:"The Grinch offers the crowd a paper heart during a mic segment",
   line:"I made one heart for the whole audience; now I am worried the back row will think I love them in smaller print.",
   replies:[
    {style:'hype',text:"You have the mic this week. Make sure the back row hears the welcome.",promise:'promo',reaction:"He lifts the heart. “Large-print feelings! I can do those!”"},
    {style:'straight',text:"Put it where people can choose to take a look.",reaction:"He clears a space. “A heart with visiting hours! All hours!”"},
    {breaks:true,text:"Put the scissors away for tonight. We have enough decorations.",reaction:"He folds a fresh sheet by hand. “Origami love! Very resourceful of us!”"}
   ]},
  'own-corner':{kind:'beat',when:{minTrust:62},cue:"The Grinch wants a match to welcome an opponent",
   plan:"The Grinch decorates his own corner and welcomes the opponent",
   line:"My next opponent deserves the friendliest fight in Wisconsin; may I have a match and a corner full of encouragement?",
   replies:[
    {style:'hype',text:"You have a match this week. Make your corner a tremendous welcome.",promise:'appearance',reaction:"He measures a ribbon. “They can admire it while escaping my headlock!”"},
    {style:'believer',text:"One heart in your corner can mean just as much.",reaction:"He lifts one gently. “Small heart, enormous affection!”"},
    {breaks:true,text:"Keep the loose decorations out of the ring.",reaction:"He presses a heart to his chest. “Built-in welcome! Extremely hard to misplace!”"}
   ]},
  'no-means-no':{kind:'beat',when:{minTrust:68},cue:"The Grinch rehearses an invitation with room for people to decline",
   plan:"The Grinch invites the crowd to celebrate without requiring anyone to join",
   line:"People keep saying they cannot stay for my celebrations; I adore how much they must be celebrating elsewhere!",
   replies:[
    {style:'hype',text:"You have the mic this week. Invite them once and tell them it is fine to pass.",promise:'promo',reaction:"He writes YOU CAN PASS beside the invitation. “Love with flexible attendance!”"},
    {style:'straight',text:"Thank them for coming to the show. Stop there and let them leave.",reaction:"He practices a huge wave. “A farewell welcome! I have been neglecting those!”"},
    {breaks:true,text:"There is no time for another celebration. Finish the show and pack up.",reaction:"He hugs the supply box. “A packing party! Everybody has such good ideas!”"}
   ]},
  'returned-heart':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:"After a worked show, a heart comes back with a request to stop",
   invite:"A heart came back! The Grinch has called an emergency welcome committee.",
   memory:'returned-heart',
   line:"Someone sent this back with NO MORE written on it; they must have run out of room, so I am considering a bigger wall!",
   replies:[
    {style:'hype',text:"Make a return box. Let people leave hearts there without explaining.",reaction:"He cuts a wide slot. “A home for traveling love!”"},
    {style:'believer',text:"Keep this one safe here. It does not need to go back to its sender.",reaction:"He gives it a drawer. “Our first return visitor!”"},
    {breaks:true,text:"It is paper. Put it in the recycling and finish packing.",reaction:"He collects the scraps too. “Love comes back as new paper! Tremendous!”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"The Grinch requests a strictly platonic tag-team celebration",
   askPromise:{kind:'team',due:'event',target:23,plan:"Grinch and Lemon Tart: a platonic tag match, decorations confined to his corner"},
   invite:"TAG-TEAM QUESTION! One corner, two wrestlers, a whole crowd to welcome!",
   line:"Book Lemon Tart and me as tag partners; I can welcome the whole crowd while she concentrates on winning the match!",
   replies:[
    {style:'hype',ask:'accept',text:"You two get the next tour show. Give her a dependable partner and the crowd a good match.",reaction:"He grabs the tag rope. “A friendship with legal corners!”"},
    {style:'believer',ask:'defer',delta:-2,text:"Give me four weeks to arrange the tag booking.",reaction:"He dates the banner. “Four weeks to make the welcome even bigger!”"},
    {ask:'decline',delta:-10,text:"I am not booking that team. Put this proposal aside.",reaction:"He folds the banner. “A surprise for another occasion! I shall welcome the next opponent twice as warmly!”"}
   ]},
  'wait-for-the-tag':{kind:'final',when:{},cue:"Before the tag match, the Grinch practices waiting in his corner",
   invite:"TAG PRACTICE! The Grinch has brought a rope and limitless encouragement.",
   line:"I love my partner’s enthusiasm for doing everything herself; how loudly can I encourage her while waiting for the tag?",
   replies:[
    {style:'hype',text:"Cheer from your corner. Take the tag when she reaches.",reaction:"He grips the rope. “Stationary adoration! I will be magnificent!”"},
    {style:'straight',text:"Wait for her hand. She knows when she needs the change.",reaction:"He holds his hand out. “Ready whenever! Especially whenever!”"}
   ]}
 },memories:[{id:'returned-heart',title:'The Heart That Came Back',caption:"Week {week} · A returned heart became the first visitor to the return box."}],
 endings:{
  best:{title:"A Team Worth Cheering",line:"The Grinch waves a heart. “A shared match! She said to focus on the wrestling, so I adored every single hold!”"},
  neutral:{title:'One Shared Corner',line:"The Grinch packs the banner. “We got our match! Next time the welcome will be easier to carry and MUCH louder!”"},
  bad:{title:"The Welcome Continues",line:"The Grinch unfolds more paper. “No team this time; good thing everybody else still needs welcoming!”"}
 }},
 31:{beats:{
  'equal-corners':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, Ron files for an equal opportunity',
   plan:'Ron opens a match by measuring both corners and recording any difference',
   line:"Red has a better chair; blue has better light; after eight complaints I require a match to establish whether either complaint is worth another minute.",
   replies:[
    {style:'bureaucrat',text:"Match approved this week. Record both measurements.",promise:'appearance',reaction:"He opens the folder in the middle. “Equal pages. Equal deadlines. Final deadlines.”"},
    {style:'straight',text:"What would stop the complaints without choosing a corner?",reaction:"“One chair in the middle.” He takes a breath. “No sitting until the question is closed.”"},
    {breaks:true,text:"Pick the corner you like and let the crew get back to work.",reaction:"He crosses out like. “Assignment is acceptable. Campaigning is not.”"}
   ]},
  'minutes-from-the-back':{kind:'beat',when:{minTrust:62},cue:'Once friendly, Ron wants to hear from the back row on the record',
   plan:'Ron reads minutes from both ends of the hall and takes comment from the back row',
   line:"The front and back rows dispute the minutes; I need a microphone so both ends can hear me instruct both ends to stop.",
   replies:[
    {style:'bureaucrat',text:"Microphone approved this week. Read both records in equal time.",promise:'promo',reaction:"He checks two timers. “And no extension for a point of outrage.”"},
    {style:'believer',text:"Take the mic to the back so everybody can hear the same question.",reaction:"He measures the cable. “Equal notice, then equal silence.”"},
    {breaks:true,text:"The back row paid for those seats. Keep the show moving.",reaction:"He adds a page. “Ticket price is not an argument for unequal hearing.”"}
   ]},
  'one-signature':{kind:'beat',when:{minTrust:68},cue:"Ron signs a request to participate without endorsing either corner",
   plan:"Ron signs his own match request and records that participation is not endorsement",
   line:"I signed a request to wrestle in one match; somebody has already described my participation as taking a side, and I would like that somebody to STOP.",
   replies:[
    {style:'bureaucrat',text:"Motion carried. You have a match this week. The signature requests participation only.",promise:'appearance',reaction:"He makes a copy. “Attendance without allegiance. Put that on both copies.”"},
    {style:'straight',text:"You are asking to wrestle. You can say that without endorsing a corner.",reaction:"He puts his name in the middle. “A request with a name and no faction.”"},
    {breaks:true,text:"So you do want us to pick you for a match.",reaction:"He grips the folder. “Scheduling is not an endorsement. Please stop making it one.”"}
   ]},
  'listening-tour':{kind:'flag',when:{minTrust:70},cue:'Fox Valley and the home promotion both push Ron to interpret a listening invitation as allegiance',
   invite:"NOTICE: Fox Valley sent an invitation. Submit comments at Ron’s neutral meeting spot.",
   memory:'listening-tour',
   line:"Fox Valley says listening to its offer implies interest; your side says listening implies betrayal; I would like both sides to listen to the sound of the door closing.",
   replies:[
    {style:'bureaucrat',text:"Publish the same listening rules and deadline for both promotions.",reaction:"He draws two identical boxes. “Neither gets exclusive access to my lack of endorsement.”"},
    {style:'straight',text:"Ask both what they expect after you listen.",reaction:"He underlines after. “An excellent question for two otherwise exhausting envelopes.”"},
    {breaks:true,text:"Tell Fox Valley you are with us. That ends the tour.",reaction:"He puts both invitations down. “An additional demand for allegiance does not end a demand for allegiance.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Ron requests a televised Neutrality Hearing to end the argument without choosing a promotion",
   askPromise:{kind:'promo',due:'event',plan:"Televise Ron’s Neutrality Hearing, with equal time for both promotions and a binding declaration of abstention"},
   invite:"SPECIAL SESSION. Televised neutrality. Both sides may attend. Both sides will eventually stop.",
   line:"Give me a televised Neutrality Hearing; both promotions get equal time, and then I will declare NEITHER on a record nobody can edit.",
   replies:[
    {style:'bureaucrat',ask:'accept',text:"Hearing approved for the next tour show. Equal time and a camera for the abstention.",reaction:"He initials the agenda. “At last, a permanent record of refusing to choose.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Keep the hearing on the agenda. Bring it back in four weeks.",reaction:"He sets the timer down hard. “Four more weeks. Both sides can practice silence.”"},
    {ask:'decline',delta:-10,text:"I will not give the hearing a segment. Close the record.",reaction:"He shuts both folders simultaneously. “Then no promotion may cite the missing hearing as a victory.”"}
   ]},
  'on-the-record':{kind:'final',when:{},cue:"Ron rehearses the final abstention without privileging either promotion",
   invite:"Camera test. Ask which side. Leave the camera running until both stop asking.",
   line:"I have rehearsed “neither” at conversational volume; if the question is repeated, the camera may need a wider microphone.",
   replies:[
    {style:'bureaucrat',text:"Point of order. Close the record after “neither.” Reopening requires both sides to agree.",reaction:"He lowers the gavel. “Then the record may remain closed for centuries.”"},
    {style:'straight',text:"Look into the lens. Say what you mean in one sentence.",reaction:"“Neither promotion has my allegiance.” He takes a breath. “That was the whole sentence.”"}
   ]}
 },memories:[{id:'listening-tour',title:'Both Invitations on the Table',caption:"Week {week} · Both invitations were counted, then neither was endorsed."}],
 endings:{
  best:{title:"The Abstention Stands",line:"Ron folds both statements into the same file. “Both promotions had equal time. Neither got an endorsement. At last, the question is closed.”"},
  neutral:{title:'Neutral in Perpetuity',line:"Ron stamps the hearing record. “No endorsement entered. Some people are still arguing over the wording, which is why the stamp is getting louder.”"},
  bad:{title:"An Empty Record",line:"Ron sets both folders down. “No hearing. No allegiance. Both sides have somehow managed to take this personally.”"}
 }},
 34:{beats:{
  'mark-the-exits':{kind:'beat',when:{minTrust:55},cue:"Liam asks for a first step back into paid work",
   plan:"Liam brings his old headshot to his next wrestling appearance",
   line:"My agent says there is no market for another comeback; fortunately, my agent is now the fellow pouring this.",
   replies:[
    {style:'straight',text:"You have a match this week. Show up ready to give them a fight.",promise:'appearance',reaction:"He raises his glass. “An offer; I had forgotten how short those can be.”"},
    {style:'bureaucrat',text:"Give me the terms you can actually meet, then we can discuss the next booking.",reaction:"He turns over a headshot. “A contract on the back; very independent cinema.”"},
    {breaks:true,text:"A film résumé does not automatically earn a match here.",reaction:"He presses the photo flat. “No. Apparently it earns a coaster.”"}
   ]},
  'cover-story':{kind:'beat',when:{minTrust:62},cue:"Liam asks to introduce his comeback publicly",
   plan:"Liam uses a mic segment to announce his wrestling comeback",
   line:"Give me a microphone; I can explain the career change without mentioning the union, provided nobody asks about the union.",
   replies:[
    {style:'straight',text:"You have the mic this week. Tell them why you want to fight here.",promise:'promo',reaction:"He takes a swallow. “Because it is wonderful—and apparently that answer is admissible.”"},
    {style:'believer',text:"They can want to see you without knowing every old credit.",reaction:"He covers the titles on his headshot. “Just the name, then; still a fairly good name.”"},
    {breaks:true,text:"Use your entrance for the introduction. I cannot spare time for the whole career story.",reaction:"He folds the photo. “A career reduced to walking distance; I have had shorter parts.”"}
   ]},
  'one-way-out':{kind:'beat',when:{minTrust:68},cue:"Liam chooses the next fight over an imagined movie rescue",
   plan:"Liam wrestles to establish his comeback rather than replay an old film fight",
   line:"I keep waiting for a studio to call, but the ring is right there and I am having a bloody excellent time hitting people.",
   replies:[
    {style:'straight',text:"You have a match this week. Make this the work you want them to remember.",promise:'appearance',reaction:"He raises his drink. “New credit: exceptionally enthusiastic wrestler.”"},
    {style:'believer',text:"You can enjoy this without pretending the old career never mattered.",reaction:"He sets the headshot beside the glass. “Good; I paid a great deal for that lighting.”"},
    {breaks:true,text:"Then stop talking about the movies and just wrestle.",reaction:"He looks down at the photograph. “I can like a fight and still miss the queue outside.”"}
   ]},
  'go-dark':{kind:'flag',when:{minTrust:70},day:'Sunday',cue:"A rejection arrives while Liam is drinking on Sunday",
   invite:"Sunday. Liam has opened an old casting email and another drink.",
   memory:'go-dark',
   line:"The agency sent back my comeback reel marked “no longer represented”; should I answer before or after this drink?",
   replies:[
    {style:'straight',text:"Put the phone down. We can talk through the next booking instead.",reaction:"He closes the email. “A conversation with someone who still answers; lavish.”"},
    {style:'believer',text:"You still have a place in a ring, even if that office has no place for you.",reaction:"He cups the glass. “They used to say I was good in a fight like it was a limitation.”"},
    {breaks:true,text:"They gave you an answer. Keep contacting them and it gets worse.",reaction:"He puts the phone beneath the headshot. “Yes; I know how a rejection works.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Liam requests a tour-show appearance as his wrestling comeback",
   askPromise:{kind:'appearance',due:'event',plan:"Liam’s wrestling comeback at the next tour show, billed under his own name"},
   invite:"Sunday. Liam has a comeback proposal and a glass ready.",
   line:"Give me the next tour show as my comeback; I want a crowd saying my name for a fight I actually had.",
   replies:[
    {style:'straight',ask:'accept',text:"Your comeback match is booked for the next tour show. Make this credit count.",reaction:"He lifts his glass with both hands. “Put the name in full; I intend to earn every letter.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:"I cannot commit that slot yet. Bring the proposal back in four weeks.",reaction:"He changes the date on the headshot. “A postponement, not a rejection; I collect both.”"},
    {ask:'decline',delta:-10,text:"I will not book a special comeback appearance.",reaction:"He lowers the glass. “Then I shall be available for an ordinary, extremely personal fight.”"}
   ]},
  'final-extraction':{kind:'final',when:{},day:'Sunday',cue:"The Sunday before his comeback, Liam checks the billing",
   invite:"Sunday. Liam wants one last look at the comeback billing.",
   line:"If they shout for a sequel after the comeback, do remind me the opponent is allowed to go home first.",
   replies:[
    {style:'straight',text:"Enjoy the noise. The bell ends the fight, even when you want another round.",reaction:"He drinks to it. “Applause after the violence; always my favorite order.”"},
    {style:'believer',text:"Let them ask for you again. You do not have to fit your whole comeback into one fight.",reaction:"He taps the glass against the headshot. “A return engagement; that would be rather nice.”"}
   ]}
 },memories:[{id:'go-dark',title:"The Returned Reel",caption:"Week {week} · The agency said no; Liam still had someone to discuss a fight with."}],
 endings:{
  best:{title:"A New Credit",line:"Liam raises his glass. “They shouted my name and wanted another fight; I believe that counts as work.”"},
  neutral:{title:"Name on the Bill",line:"Liam studies the poster over his drink. “Got the comeback appearance; spent too much of it trying to look like the old photograph.”"},
  bad:{title:"Still Available",line:"Liam signs another headshot beside his glass. “No comeback booking; ask around if anyone needs a fight with a familiar face.”"}
 }}
};
