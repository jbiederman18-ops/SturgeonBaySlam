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
   low:{style:'believer',tell:'He has reset his feet three times. Each time he leaves a space on the mat where your feet would go.'},
   high:{style:'straight',tell:'He has chalked the exact position of both feet from Saturday’s finish. A spare square of chalk waits beside the mat.'}
  },distrusts:'hype',
  stale:'Same answer. I can hold a grip for three hours. I expected you to move a little.',
  heard:'{name} has circulated an opinion on Hold One. Tell me where the feet were when the opinion was formed.',
  invite:{wary:'The barn light is on. He has not invited you.',friendly:'Practicing Hold One tonight. You may observe.',warm:'Barn. Seven. Hold One. Bring water.'},
  signoff:{wary:'That was Hold One. Leave.',friendly:'Hold One. Always Hold One.',warm:'Tell no one about the briefcase.',devoted:'Someday you will see Hold Two. Not today.'},
  sore:'You tried to hurry me along. I remember. Hold One does not hurry.',
  reacts:{kept:'2 Holds gives you one firm nod, from the proper stance.',broken:'2 Holds takes the briefcase back without looking at your hand.'},
  jealous:'2 Holds resets his feet. “I kept your spot on the mat. I assume {name} did the same.”',
  backstage:{
   won:{tell:'2 Holds sets the case down and marks two heel positions with the edges of his boots.',
    line:'“Hold One. Both heels down. I’d like a second witness.”',
    replies:[
     {style:'straight',text:'“Both down. The far one didn’t move when the weight shifted.”',reaction:'He checks the distance between the marks. “That’s the part I wanted witnessed.”'},
     {style:'believer',text:'“Show me with my wrist. I want to feel what they felt.”',reaction:'He opens his hand. “Put your feet wherever you like.”'},
     {style:'hype',promise:'promo',text:'“Take the mic next week and show the whole hall where those heels go.”',reaction:'He locks the case. “They can bring shoes they don’t mind practicing in.”'}
    ]},
   lost:{tell:'2 Holds has the case at his feet, with the key pinched between two fingers.',
    line:'“There was room for a thumb between my grip and the finish.”',
    replies:[
     {style:'believer',text:'“Here’s my wrist. Find the room again while you still remember where it was.”',reaction:'He takes your wrist lightly. “Tell me when you feel it open.”'},
     {style:'straight',promise:'rematch',text:'“Next week, you and {name} again. Test the grip against the same resistance.”',reaction:'He pockets the key. “One variable. That will do.”'},
     {truth:true,text:'“The grip opened. Opening that case tonight won’t tell you why.”',reaction:'He looks at the key, then turns it away from the lock. “I’ll start with the grip.”'}
    ]},
   stole:{tell:'2 Holds waits for the echo of the last cheer to die before setting down the case.',
    line:'“They got louder when neither of us moved. I had allowed for the opposite.”',
    replies:[
     {style:'straight',text:'“They could see you both fighting for an inch. Give them that much to watch again.”',reaction:'He spreads a finger and thumb. “I can work inside that.”'},
     {style:'believer',text:'“They were leaning in to see whether your hand would open.”',reaction:'He looks down at his hand. “Then I was right to let them see it.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He turns his palm up. “They kept looking even after it opened.”'}]},
     {style:'hype',text:'“You made a whole room jump with your thumb.”',reaction:'He looks at the thumb in question. “It moved less than they did.”'}
    ]},
   flat:{tell:'2 Holds starts to put the case away, then sets it back between his boots.',
    line:'“I heard a folding chair close and assumed it was somebody sitting down.”',
    replies:[
     {style:'straight',text:'“The far side couldn’t see your hands. Turn the grip toward them next time.”',reaction:'He makes a quarter turn. “Same pressure. Better view.”'},
     {style:'believer',text:'“Walk me through the part they missed. I’ll stand where the empty seats were.”',reaction:'He takes his stance. “Raise a hand when you lose sight of the thumb.”'},
     {breaks:true,text:'“Give the hold less time. We were already behind and people had rides waiting.”',reaction:'He takes his hand off the latch. “Then post a time limit before we ring the bell.”'}
    ]},
   kept:{tell:'2 Holds turns a square of paper over on the lid of his briefcase.',
    line:'“You said {promise}. I marked the box after the bell.”',
    replies:[
     {style:'straight',text:'“Good. We both checked it against what happened.”',reaction:'He slides the paper into his pocket. “Same standard next time.”'},
     {style:'believer',text:'“You can put the paper away now. I know what that box meant to you.”',reaction:'His hand leaves the lid. “I think I can remember it without the square.”'}
    ]},
   broken:{tell:'2 Holds sets the case beside you, keeping the chain short enough that you can’t pick it up.',
    line:'“I wrote down {promise} and left a space for the time it happened.”',
    replies:[
     {style:'straight',text:'“Leave the time blank. I gave you my word and missed it.”',reaction:'He turns the paper so the space faces you. “Good. We agree where it goes.”'},
     {style:'believer',promise:'appearance',text:'“You have a match next week. Keep that first space blank and make me earn the second mark.”',reaction:'He draws a second box without touching the first.'},
     {breaks:true,text:'“Put it down as a card change. The crew needs one reason they can give everybody.”',reaction:'He winds the chain once around his wrist. “That is a reason the crew can give.”'}
    ]},
   benched:{tell:'2 Holds sets the briefcase beside the parking stripe and leaves room on the other side.',
    line:'“I watched {name} from the door. What did you need tonight that Hold One couldn’t give you?”',
    replies:[
     {style:'straight',text:'“I needed something different tonight. Show me the first thing you’d do if that grip came at you.”',reaction:'He moves one foot off the stripe. “Stand here. You’ll see where it opens.”'},
     {style:'believer',text:'“Show me the bit you’d want them to try on you. I can stand in.”',reaction:'He sets the case aside. “All right. First get your feet under you.”'},
     {truth:true,text:'“Your work is yours. Treating every other booking as a test of it won’t make the grip any better.”',reaction:'He slides the case clear of the stripe. “I can test it on a quieter floor.”'}
    ]},
   idle:{tell:'The briefcase has a fresh handle and the same lock.',
    line:'“I replaced the part that gave way. I’d like to find out what else has changed.”',
    replies:[
     {style:'straight',promise:'appearance',text:'“You have a match next week. Start with Hold One and see what you have to adjust.”',reaction:'He tests the handle with both hands. “One thing at a time.”'},
     {style:'believer',text:'“Show me what you’ve been practicing since I last saw you work.”',reaction:'He takes his hand off the case. “I was hoping somebody would ask about that part.”'}
    ]},
   cutIn:{tell:'2 Holds puts the case beside his inside foot, leaving the path to the door clear.',
    line:'“Before {name} goes, I’d like to establish what counts as getting free.”',
    replies:[
     {style:'straight',text:'“If there’s daylight between the hands, start your grip again.”',reaction:'He makes a gap you can see through. “All right. Call it when you see it.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He opens both hands. “I should have started over as soon as I felt it.”'}]},
     {style:'believer',text:'“Ask where the pressure stopped. You can learn that without agreeing on anything else.”',reaction:'He gives the other corner a clear look at his open hand.'},
     {style:'bureaucrat',text:'“The referee calls it during a match. Take your time figuring it out here.”',reaction:'He reaches for the case. “I can do it somewhere with a mat.”'}
    ]},
   skip:'2 Holds passes with the briefcase on the far side and the key already back in his pocket.'
  },
  epilogue:{
   best:{title:'A Grip You Can Trust',line:'2 Holds checks his footing. “Your feet are better than when you came in. The rest takes a few more years.”'},
   neutral:{title:'Still Hold One',line:'2 Holds sets the case beside his boots. “Seven tomorrow. Same grip. We’ll see how it goes.”'},
   bad:{title:'No Further Demonstrations',line:'2 Holds checks his footing. “I’ll practice with the door closed. The hold will still be there.”'}
  },
  scenes:[
   {line:'Hour three of Hold One. Observe the grip. Do you see it?',replies:[
    {style:'straight',text:'I see it. Your thumb hasn’t moved since hour one.',reaction:'“Consistency.” He nods for a full minute.',
     cases:[{when:{lostLastShow:true},delta:1,reaction:'He moves his thumb a fraction. “It didn’t move Saturday either. I’m trying something different.”'}]},
    {style:'believer',text:'Yes. Here’s my wrist. I’ll give you something to hold on to.',reaction:'He opens a hand and waits for yours. “Good. Give me your full weight.”',
     cases:[{when:{wonLastShow:true},morale:2,reaction:'He sets his heel inside a chalk mark. “Same place I stood Saturday. Push a little harder than they did.”'}]},
    {breaks:true,text:'I can watch another minute. Then I need the barn cleared so Carl can lock up.',reaction:'He lets go of the grip. “Carl can have the rest of the hour.”'}]},
   {line:'A man at the hardware store asked me to demonstrate Hold One. I declined. Was I correct to decline?',replies:[
    {style:'straight',text:'Correct. Hold One is for the ring. I’ll put you on the card this week.',promise:'appearance',reaction:'He shakes your hand with a grip you recognize as an ordinary handshake.'},
    {style:'believer',text:'You get to decide where you show it. The man can buy a ticket like anybody else.',reaction:'“He was buying washers. Next time I’ll tell him where the tickets are.”'},
    {breaks:true,text:'Show him for five seconds next time. You might sell a ticket while you’re there.',reaction:'He stares at you until the barn light goes off on its timer.'}]},
   {line:'The clock lost six minutes in the first round. I held on six minutes past the bell in the second. The total is correct now. Should I reset it?',replies:[
    {style:'straight',text:'Reset it at the end of this round. From then on you only have to keep one time.',reaction:'He puts one hand on the clock and leaves the other where it is. “At the end. I’m still in the middle.”'},
    {style:'believer',text:'Your hands kept count. Let the clock catch up when you’re done.',reaction:'He flexes his fingers one at a time. “Yes. All six minutes.”'},
    {truth:true,text:'The clock was slow. You’ve done six extra minutes on a hand that won’t close. Put it down for tonight.',reaction:'He opens his left hand with his right. Then he reaches for the ice pack. “Tomorrow I start at zero.”'}]},
   {line:'The Dog says Hold One doesn’t work on a dog. I asked him to show me which part of the grip fails. He brought me a tennis ball.',replies:[
    {style:'straight',text:'I’ll give you a match this week. Let the referee see Hold One against someone who brings a counter to the ring. The Dog can keep his tennis ball.',promise:'appearance',sides:{37:-3},reaction:'He sets the ball beside the briefcase. “I’ll ask my opponent to resist. That’s the demonstration.”'},
    {style:'believer',text:'Ask him to put his wrist where he thinks it would slip. He might be right about the angle.',reaction:'He sets the ball next to the mat. “Bring him in. I want to see the angle first.”'},
    {breaks:true,text:'Let the referee settle whether the hold is legal. We have a practice to finish.',reaction:'He keeps the ball beside his boot. “I wasn’t asking about a foul.”'}]},
   {line:'Somebody wrote “two” on the barn door. I crossed out one letter. Would you like to know which?',replies:[
    {style:'straight',text:'I’ll see it when I leave. Show me where my thumb goes.',reaction:'He sets your grip a fraction lower. “I am glad you asked that first.”'},
    {style:'believer',text:'Show me the letter you crossed out. You decide when I get to see the rest.',reaction:'He walks you to the door and points. His other hand stays on the case.'},
    {breaks:true,text:'I’d clean it off. The last rumor bought us a week of people pulling on that door.',reaction:'He turns the deadbolt. “They can pull. I maintain the hinges.”'}]}
  ]},
 10:{speaker:'Sweeps',style:'believer',place:'St. Elbow’s, after hours',
  tells:{wary:'He sweeps around you, the way you’d sweep around a puddle.',friendly:'He nods when you come in and keeps sweeping.',warm:'He sweeps a path for you when you walk in.',devoted:'He sweeps a path to your office every morning, whether or not you’re coming in.'},
  moods:{
   low:{style:'straight',tell:'The dustpan is empty. He’s chalked a line where his back foot was on Saturday and left a second piece of chalk beside it.'},
   high:{style:'believer',tell:'The broom is propped in the winning corner. He’s set a second chair beside it, facing the ring.'}
  },distrusts:'bureaucrat',
  stale:'You can go over a spot till the boards shine, boss. Still gotta take a look at the rest of the floor.',
  heard:'{name} told me what got said. I swept you a path to the side door, boss. We can talk there if you’ve got a minute.',
  invite:{wary:'The lights are on at St. Elbow’s. He didn’t say anything.',friendly:'Sweeping St. Elbow’s tonight if you want to talk.',warm:'Hall’s quiet. Floor’s not clean yet. Come keep me company?'},
  signoff:{wary:'Mind the dustpan.',friendly:'Keep it clean, boss.',warm:'Floor’s clean. So’s my conscience. Night, boss.',devoted:'Take the side door, boss. I swept you a way out.'},
  sore:'You brushed me off, boss. I know what that looks like. I sweep for a living.',
  reacts:{kept:'Sweeps takes an extra pass down the aisle where you’ll walk out.',broken:'Sweeps moves your chair to reach the boards under it and leaves it where he moved it.'},
  jealous:'Sweeps pulls the broom back from your boots. “I swept you a path, boss. Thought maybe {name} had one ready too.”',
  backstage:{
   won:{tell:'Sweeps comes over with one lace undone, smiling down at it like it did him a favor.',
    line:'“Reckon I can tie this now, boss. I didn’t want to change a thing till I heard the bell.”',
    replies:[
     {style:'believer',text:'“Take your time. You’re allowed to stand there a minute after it goes right.”',reaction:'He leaves the lace alone for one more breath. “Been a while since I stood still on purpose.”'},
     {style:'straight',text:'“Tie it while you’ve got a chair. You still have to get down the steps.”',reaction:'He sits and pulls the knot tight. “There we go. Still counts.”'},
     {style:'hype',promise:'promo',text:'“The whole room saw you dig in. Tell them how you did it on the mic next week.”',reaction:'He gets the other boot up on the chair. “I’ll show them which foot.”'}
    ]},
   lost:{tell:'Sweeps rubs the heel of one boot with the edge of a rag, then checks it against the other.',
    line:'“There’s the foot I lost it on, boss. I keep wanting to blame the boards.”',
    replies:[
     {style:'straight',text:'“You planted fine. You stood up before you got the other foot under you.”',reaction:'He tries it once with both feet. “There it is. I can work on that.”'},
     {style:'believer',text:'“You can look at the boards in the morning. I’ll help you get your boots off tonight.”',reaction:'He hands you the rag and takes a seat. “Start with the one that stuck.”'},
     {style:'hype',promise:'rematch',text:'“You get another go at {name} next week. Same boards, both feet under you.”',reaction:'He folds the rag in half. “I’d like a day or two with the floor first.”'}
    ]},
   stole:{tell:'Sweeps has picked up the front-row chairs except for the one somebody dragged right up to the rail.',
    line:'“Fella in that chair forgot his coat getting out of it, boss. I’ve never seen him do that.”',
    replies:[
     {style:'believer',text:'“Leave it there a minute. That’s where you got him out of his seat.”',reaction:'Sweeps rests a hand on the chair back. “I wondered who made that noise.”'},
     {style:'straight',text:'“Hang the coat by the door. Ask him what got him up when he comes for it.”',reaction:'He carries it by the collar. “Might ask him while I’ve got the sleeve.”'},
     {style:'hype',text:'“If he brings a friend next week, there’ll be two chairs at that rail.”',reaction:'He looks down the row. “I reckon I could find him a second.”'}
    ]},
   flat:{tell:'Sweeps fishes a stray ticket stub from the dustpan and smooths it with his thumb.',
    line:'“Somebody folded that clean in half while I was out there, boss. Plenty of time to get the corners right.”',
    replies:[
     {style:'straight',text:'“There was too long between giving them something to watch and giving them something to hope for.”',reaction:'He puts the stub in his pocket. “I know the bit you mean. I could feel that stretch.”'},
     {style:'believer',text:'“Which part would you do again tomorrow if nobody paid you?”',reaction:'He points to a spot at the rail. “That turn right there. I’d come in for that.”'},
     {truth:true,text:'“They gave you a chance early. You waited long enough for them to give it to somebody else.”',reaction:'He takes the stub out and unfolds it. “Guess I can start before the crease next time.”'}
    ]},
   kept:{tell:'Sweeps wipes his hand on his trouser leg before holding it out.',
    line:'“You said {promise}, boss, and I got to spend tonight thinking about my work.”',
    replies:[
     {style:'believer',text:'“You ought to be able to do that every time I give you my word.”',reaction:'He gives your hand one slow shake. “Makes it easier to do my part.”'},
     {style:'straight',text:'“I put it where I could see it every time I looked at the sheet. I’m glad I did.”',reaction:'He lets go. “Save yourself a little room there, boss.”'}
    ]},
   broken:{tell:'Sweeps holds a side door open with the heel of one boot but leaves you to reach for the handle.',
    line:'“I left room for {promise}, boss. Kept that bit clear all night.”',
    replies:[
     {style:'believer',text:'“I left you waiting. I can stand here while you tell me what it cost you.”',reaction:'He lets you take the weight of the door. “Well. I told a fella he ought to come watch.”'},
     {style:'straight',promise:'appearance',text:'“I missed it. You’ve got a match next week. I’ll put that in writing.”',reaction:'He steps clear of the door. “Write the date where I can read it from here.”'},
     {breaks:true,text:'“If the running order moves again, ask Bev where you stand. I can’t catch every person before bell.”',reaction:'He takes his boot off the door. “Sure, boss. I thought you’d want to tell me yourself.”'}
    ]},
   benched:{tell:'Sweeps holds the dustpan level out by the curb, even though it’s empty.',
    line:'“I heard them cheer for {name} through the side door, boss. Couldn’t find a reason to go any closer.”',
    replies:[
     {style:'believer',promise:'appearance',text:'“Come in through the front next week. You’re working the card.”',reaction:'He looks toward the ticket window. “I reckon I can remember what that door sounds like.”'},
     {style:'straight',text:'“I had a place for what they brought tonight. Tell me what you’ve been getting ready for.”',reaction:'He sets the pan down. “Been thinking about what I can do without room to back up.”'},
     {truth:true,text:'“You don’t have to stay and clean to make a case for yourself. Ask me to book you.”',reaction:'He takes both hands off the handle. “All right, boss. Book me.”'}
    ]},
   idle:{tell:'Sweeps turns an old roll of wrist tape over in his hand by the side door.',
    line:'“I keep bringing this, boss. Lately all it’s done is hold the dustpan together.”',
    replies:[
     {style:'believer',promise:'appearance',text:'“Save enough for your wrists. You’re on the card next week.”',reaction:'He tears a short strip for the pan. “There. That’s all she needs.”'},
     {style:'straight',text:'“Bring it to practice. Show me where you’d start if you had five minutes in the ring.”',reaction:'He puts the tape in his pocket instead of the pan. “I can show you that with four.”'}
    ]},
   cutIn:{tell:'The dustpan taps down once. Sweeps holds it steady with his boot.',
    line:'“While I’ve got you both, who’s staying to help me get what {name} left by the rail?”',
    replies:[
     {style:'believer',text:'“I’ll take the other end. Tell me where you want it.”',reaction:'He shifts over to make room. “Good. Mind that corner with your fingers.”'},
     {style:'straight',text:'“Ask for a hand now. They’re standing right here and it’ll take the two of you a minute.”',reaction:'Sweeps takes a breath. “You got a minute before you head out?”'},
     {style:'hype',text:'“Let them go. You kept this place standing tonight and everybody ought to hear it.”',sides:{20:-2},reaction:'“I’d settle for somebody grabbing the other end, boss.”'}
    ]},
   skip:'Sweeps lifts the broom over your shoes and carries it past without putting it down on your side.'
  },
  epilogue:{
   best:{title:'A Clean Path Out',line:'Sweeps rests both hands on the broom. “I did your side of the hall, too, boss. No sense leaving half a floor for whoever comes next.”'},
   neutral:{title:'Same Door Tomorrow',line:'Sweeps looks down at the boards. “Lock the front on your way out. I’ll take the side door when I’m done.”'},
   bad:{title:'Under Your Chair',line:'Sweeps rests both hands on the broom. “I swept right up to your chair, boss. You’ll have to move it yourself.”'}
  },
  scenes:[
   {line:'Term Life offered to insure the broom. Wants to know its replacement value. How do I tell him there isn’t one?',replies:[
    {style:'believer',text:'You’ve got the mic this week. Tell the hall what it takes to learn the boards. Give Term Life credit for asking what the broom was worth.',promise:'promo',sides:{17:3},reaction:'He turns the handle over. “He’s going to need more room on that form. I’ll save him a seat.”',
     cases:[{when:{wonLastShow:true},morale:2,reaction:'He smooths the form on the handle. “I’ll tell him about the board where I got my feet under me Saturday. Reckon he’ll want to know what that board’s worth now.”'}]},
    {style:'straight',text:'Put down the cost of a spare. Tell Term Life this one comes home with you either way.',reaction:'“A spare’s fair.” He writes it down on the back of a ticket.'},
    {breaks:true,text:'Use the hardware store price. If it goes missing before doors, we’ll need something that works that night.',reaction:'He fits his hand into the worn patch on the handle. “I’ll have to show him this part myself.”'}]},
   {line:'Holly brought me a pizza pocket. Set it on a folded napkin, right on the boards. Somebody finally knows how to feed a man who’s sweeping.',replies:[
    {style:'believer',text:'Eat it while the floor’s clean. I’ll keep people off that corner.',reaction:'He sits for the first time since you came in. “It’ll still be hot when I’m done chewing, for once.”'},
    {style:'straight',text:'Give it a minute. Those things burn you from the inside out.',reaction:'He checks it with a thumb. “That’s the part of the job I never learn.”'},
    {breaks:true,text:'Bring it into the kitchen. You can sit at a table and nobody has to watch the floor.',reaction:'He lifts the napkin by all four corners. “I’ve got room right here.”'}]},
   {line:'The Grinch swept the velvet room ahead of me. Went with the grain, even. Then I got the blacklight out. Left his initials big as anything by the door.',replies:[
    {style:'believer',text:'Sweep him a clean path back to his craft table. Leave the initials where he put them.',reaction:'He starts at the cleanest end. “Might make it wide enough for two.”'},
    {style:'straight',text:'Thank him for sweeping. Tell him signing the floor in glitter leaves you a second job.',sides:{20:-2},reaction:'He fetches the small brush. “Tell him I saw the name. I don’t want him thinking I missed the rest of it.”',
     cases:[{when:{lostLastShow:true},morale:2,reaction:'He holds the dustpan steady. “Tell him just like that. I spent half the week wishing somebody would show me where I put my foot wrong.”'}]},
    {breaks:true,text:'Cross it off the list. You’ve still got the aisle and the kitchen before lockup.',reaction:'He looks at the list. “There’s room for his name next to mine.”'}]},
   {line:'I get a pile all the way to the door and the wind puts it back. Been here since lunch, boss. Reckon I can get it on the next pass.',replies:[
    {style:'believer',text:'I’ll hold the door nearly shut. Send it through a little at a time.',reaction:'The first pinch makes it out. “That’s enough to start with.”'},
    {style:'straight',text:'Bring the dustpan to the pile. Save yourself a trip.',reaction:'He fetches the pan. “I could stand to do that more often.”'},
    {truth:true,text:'You’ve been leaning on the broom since I got here. Leave me the pan and go eat something.',reaction:'He holds the handle another beat before he hands it over. “Corner by the door catches first. Thanks, boss.”'}]},
   {line:'Found a ticket under the front row. Says ADMIT ONE. Nobody tore it. I reckon somebody paid and didn’t get to see the show.',replies:[
    {style:'believer',text:'Give it to Bev for the next person who comes up short. I’ll put you on the card this week. You can tell them which aisle has the best view.',promise:'appearance',reaction:'He smooths the ticket against his sleeve. “I’ll tell her it’s already paid for.”'},
    {style:'straight',text:'Could’ve dropped it on their way out. Put it in lost and found.',reaction:'He studies the untorn edge. “Could’ve. I’ll give it a week.”'},
    {breaks:true,text:'Give it to Bev for the drawer. We’ve already counted last week’s tickets.',reaction:'He tucks the ticket into his shirt pocket. “I’ll walk it over myself.”'}]}
  ]},
 18:{speaker:'Charming',style:'bureaucrat',place:'Afternoon tea at Maddox Hatter’s table',
  tells:{wary:'His thank-you notes are brief, and only slightly threatening.',friendly:'He pours your tea first and asks after your family by name.',warm:'His thank-you notes are getting longer and more politely threatening.',devoted:'His latest thank-you note runs four pages and ends, “I would hate for anything to happen to you.”'},
  moods:{
   low:{style:'believer',tell:'He has set out his best paper. The first note stops just after “Dear,” and the tea beside it has gone cold.'},
   high:{style:'bureaucrat',tell:'He has addressed a thank-you to Saturday’s opponent. He’s written the minute the match ended in the corner, where the return address ought to be.'}
  },distrusts:'straight',
  stale:'My dear, on the third reading I begin to wonder what you’ve hidden in the small print.',
  heard:'{name} was kind enough to repeat what you said. I’ve thanked them for quoting you so faithfully.',
  invite:{wary:'Maddox has set a place for you. Charming has not.',friendly:'Tea is at four, should you care to be civilised.',warm:'Dearest booker, tea at four? I have a little secret to share. Do come. — C.F.'},
  signoff:{wary:'Do mind the stairs. They’re ever so steep.',friendly:'Thank you ever so much for coming.',warm:'Give my best to everyone you love. Every one.',devoted:'You are my very favourite person to threaten, darling.'},
  sore:'I took the liberty of writing a thank-you note for our last conversation. Do open it when you’re alone.',
  reacts:{kept:'Charming sends a handwritten thank-you with unusually generous margins.',broken:'Charming delivers a thank-you addressed to “the person who was going to see to it.”'},
  jealous:'Charming turns a spare cup upside down. “Do give {name} my regards. I’m sure they were very careful with anything you told them.”',
  backstage:{
   won:{tell:'Charming carries a cream envelope with the flap still open.',
    line:'“I’m thanking {name} for the match and would like your advice on how many times to write ‘a pleasure.’”',
    replies:[
     {style:'bureaucrat',text:'“Once in the note. The referee gets a postscript for making it official.”',reaction:'Charming takes out a second envelope. “Separate correspondence, surely.”'},
     {style:'believer',text:'“Tell {name} which moment you thought might go the other way.”',reaction:'Charming slides the note out. “That would be a pleasure to put in writing.”'}
    ]},
   lost:{tell:'Charming uncaps a pen above a blank place card and waits for the ink to reach the nib.',
    line:'“What does one put on the place card at a dinner for the person who came second?”',
    replies:[
     {style:'believer',text:'“Charming Friendly. Same name that would’ve been on it if you’d won.”',reaction:'Charming writes the name without an honorific. “Good. I needn’t change the seating.”'},
     {style:'bureaucrat',promise:'rematch',text:'“I’ll book {name} again next week. Put the date on the back and save the card.”',reaction:'Charming turns the card over. “I do like a dinner with a second sitting.”'},
     {truth:true,text:'“You can say you lost. Nobody expects you to put on a dinner for it.”',reaction:'Charming caps the pen. “Then I may have the good tea without inviting anybody.”'}
    ]},
   stole:{tell:'Charming straightens a crooked fold in the programme and finds a second one beneath it.',
    line:'“The room hung on our every move, and I’ve never known this many people to have such exquisite manners at once.”',
    replies:[
     {style:'bureaucrat',text:'“Send one thank-you to the hall. Leave space for the other corner to sign.”',reaction:'Charming measures out two signature lines. “Equal lengths will be perfectly adequate.”'},
     {style:'believer',text:'“You earned that attention. You can enjoy it without sending anything in return.”',reaction:'Charming folds the programme along the crease the crowd left. “I could keep this one, I suppose.”',cases:[{when:{lostTonight:true},morale:2,reaction:'Charming smooths the fold. “I’d rather remember how it sounded before the bell.”'}]},
     {style:'hype',promise:'promo',text:'“I’ll give you the mic next week. Thank the room while everyone is still in it.”',reaction:'Charming makes a note in the margin. “I’ll prepare an opening and allow for a response.”'}
    ]},
   flat:{tell:'Charming offers you a programme folded to the exact size of a calling card.',
    line:'“I appear to have given the hall ample opportunity to attend to other business.”',
    replies:[
     {style:'bureaucrat',text:'“Cut the preliminaries. Put the point where the first line goes.”',reaction:'Charming unfolds the programme just enough to cross something out. “Dearly as I love a preamble.”'},
     {style:'believer',text:'“When did you feel the room drift? Start where you were still listening to it.”',reaction:'Charming presses a thumb against one fold. “Here. I kept going long after here.”'},
     {breaks:true,text:'“We were running late anyway. I can move you earlier and trim the time.”',reaction:'Charming returns the programme to its original size. “How helpful of you to find even less of me to schedule.”'}
    ]},
   kept:{tell:'Charming has two copies of the same note, one sealed and one open for inspection.',
    line:'“I’ve acknowledged receipt of {promise}, though I’d rather like to thank you without retaining a copy.”',
    replies:[
     {style:'bureaucrat',text:'“Keep the copy. Good records ought to show when things go right, too.”',reaction:'Charming slips both notes into separate pockets. “Under ‘pleasant surprises,’ then.”'},
     {style:'believer',text:'“Tell me right here. We can leave the envelope closed.”',reaction:'Charming rests a thumb on the seal. “Thank you. I found I was looking forward to it.”'}
    ]},
   broken:{tell:'Charming holds a clipboard out of your path and an uncapped pen directly in it.',
    line:'“You promised me {promise}. I checked the card twice. Is there a form for that? I’d love a form.”',
    replies:[
     {style:'bureaucrat',promise:'appearance',text:'“You have a match next week. I’ll write it down right here.”',reaction:'Charming hands over the clipboard. “Initial here. And here. Lovely.”'},
     {style:'believer',text:'“You were right to expect it. I gave you my word, and you can put my name beside that.”',reaction:'“Of course. Your name.” Charming writes something down and does not show you what it is.'},
     {breaks:true,text:'“Leave me the form. I’ll deal with it when I have the whole sheet in front of me.”',reaction:'Charming caps the pen. “Certainly. I’ll fill out the date while it’s still today.”'}
    ]},
   benched:{tell:'Charming stands by the curb with a spare place card, folded face-in.',
    line:'“I saw {name} on the card and thought you might need help spelling the name you left off.”',
    replies:[
     {style:'bureaucrat',promise:'appearance',text:'“Write it here. I’m putting you in a match next week.”',reaction:'Charming turns the card over and writes the name in large, even letters.'},
     {style:'believer',text:'“Tell me the match you’d have asked for if you’d never seen tonight’s card.”',reaction:'Charming sets the place card on the curb. “Oh. I had something in mind well before tonight.”'},
     {style:'straight',text:'“I booked Ron for a reason. I can hear your case on its own.”',reaction:'Charming folds the card a fraction smaller. “Do give my case a seat of its own, then.”'}
    ]},
   idle:{tell:'Charming produces a bundle of envelopes held together with ribbon.',
    line:'“I’ve written you a note for every Saturday I’ve missed. Would you prefer the short one or all four in order?”',
    replies:[
     {style:'bureaucrat',text:'“Give me the latest one and keep the other three for the record.”',reaction:'Charming hands over the smallest envelope. “How nice to get a reply before I’ve bought a stamp.”'},
     {style:'believer',text:'“Give me the first one. I want to know what you asked for before you had to ask again.”',reaction:'Charming undoes the ribbon. “I did use the good paper for that one.”'},
     {style:'straight',promise:'appearance',text:'“Save the paper. You’ve got a match next week.”',reaction:'Charming reties the ribbon. “I shall write a single note of confirmation.”'}
    ]},
   skip:'Charming gives the exit door the courtesy of being held open, just long enough for the latch to catch before you reach it.'
  },
  epilogue:{
   best:{title:'The Good Stationery',line:'Charming sets down his cup. “Do keep my address. I prefer to hear bad news from a correspondent I already know.”'},
   neutral:{title:'One More Cup',line:'Charming squares the envelope on its saucer. “Four o’clock, as ever. Maddox will tell you the seating plan after you sit down.”'},
   bad:{title:'No Place Set',line:'Charming sets down his cup. “I gave your chair to a person I could rely on to arrive uninvited.”'}
  },
  scenes:[
   {line:'Milk? Sugar? A secret? I happen to know which wrestler has been sleeping in the ring after shows.',replies:[
    {style:'bureaucrat',text:'Put it in a sealed envelope. We can keep a record and keep it in this room.',reaction:'He takes out a blank envelope. “A file with a lock. How very considerate.”',
     cases:[{when:{wonLastShow:true},morale:2,reaction:'He presses his ring into the wax. “I’ve enclosed Saturday’s result. They might enjoy reading it from my side of the ring.”'}]},
    {style:'believer',text:'You’ve kept their name safe so far. If they need a quiet way in, tell me which door and leave it at that.',reaction:'He reaches for the envelope, then lets it be. “I expect they’d prefer the side door.”'},
    {breaks:true,text:'If they’re still there at lockup, send them my way. We need the ring clear after hours.',reaction:'He sets his cup down. “I’ll tell them you expressed an interest in the ring.”'}]},
   {line:'I’d adore a small say in this week’s card. Nothing grand. Simply who opens, who closes, and who suffers.',replies:[
    {style:'bureaucrat',text:'Submit one name and one reason. I’ll book you a match this week and hear your case before I pick the other corner.',promise:'appearance',reaction:'He produces the proposal at once. It is laminated.'},
    {style:'believer',text:'Give me the name you actually want across from you. You can tell me without wrapping it up.',reaction:'He lays a finger on one place setting. “I can tell you which chair I’d use.”'},
    {breaks:true,text:'The running order is set. Get me a name before I print next week’s and I’ll read it.',reaction:'He makes a small note. “I shall get to know your printer.”'}]},
   {line:'Maddox has put a slip with a secret under each lump of sugar. Apparently taking two lumps means you’ve agreed to keep two secrets.',replies:[
    {style:'bureaucrat',text:'Put the terms by the bowl. I’ll give you the mic this week to read them before anyone helps themselves.',promise:'promo',reaction:'He writes a notice in tiny script. “I shall read the small print very slowly.”'},
    {style:'believer',text:'Ask Maddox what he needs kept safe. You might only have to pour him a cup.',reaction:'He picks up the pot. “How odd. I never asked him what was in there for him.”'},
    {truth:true,text:'Nobody agreed to anything. If the secret matters, ask them to keep it before you pour.',reaction:'He lifts the tongs, then sets them down. “Maddox. I wonder whether you’d care to ask me something directly.”'}]},
   {line:'Ron declined my invitation without taking a position on whether he was invited. I am considering returning the courtesy.',replies:[
    {style:'bureaucrat',text:'Send a receipt that says “Response pending.” Give Ron until four to dispute it. He’ll have to answer before tea.',sides:{31:-2},reaction:'He reaches for his smallest stationery. “I’ll mark the deadline in very small print.”'},
    {style:'believer',text:'Set a place. If he comes, he comes. You’ve already done the inviting.',reaction:'He sets out a saucer. “And I can keep the pot warm without informing him.”'},
    {breaks:true,text:'Take him off the head count. Maddox needs to know how many cups to wash.',reaction:'He pours an extra cup anyway. “Maddox needn’t wash this one until morning.”'}]},
   {line:'My last opponent has asked for a reference. I know several excellent things about them, none of which I wish to put in writing.',replies:[
    {style:'bureaucrat',text:'Confirm attendance. I’ll put you on the card this week, and you can hand it over at the hall.',promise:'appearance',reaction:'He starts the letter. “They were certainly there when the bell rang. A pleasure to confirm it in person.”'},
    {style:'believer',text:'Tell them what you’d wish for them in their next match.',reaction:'He writes “a better referee” and gives the ink time to dry.',
     cases:[{when:{lostLastShow:true},morale:2,reaction:'He studies what he wrote. “It was a perfectly good referee. I think I owe them a better sentence.”'}]},
    {breaks:true,text:'Tell them you can’t give a reference. They’ll still have time to ask somebody else.',reaction:'He leaves his good paper in the drawer. “I shall disappoint them on a postcard.”'}]}
  ]},
 20:{speaker:'The Grinch',style:'hype',place:'Anywhere decorated: tonight, the Moose Lodge craft room',
  tells:{wary:'Every turnbuckle gets a paper heart except yours.',friendly:'He waves with both hands from across the hall.',warm:'Your turnbuckle gets a paper heart with THANKS, BOOKER! in glitter.',devoted:'Your turnbuckle gets a paper heart for everyone who helped put the show on.'},
  moods:{
   low:{style:'believer',tell:'He has turned the paper hearts face-down. He keeps one by his elbow, with a thumb over the name.'},
   high:{style:'hype',tell:'He’s glittered THANK YOU in letters big enough for the back row. He ran out of worktable halfway through YOU.'}
  },distrusts:'straight',
  stale:'I can cut another one from the same pattern! Could you show me where you’d change it first?',
  heard:'{name} told me what you said. I left the glitter off your card. You’ll still know it’s from me.',
  invite:{wary:'You can hear tinsel from the craft room. Nobody texted you.',friendly:'Decorating the craft room at 7! Everyone welcome! Even you!',warm:'WREATH EMERGENCY. Craft room. Bring glue. Bring your heart.'},
  signoff:{wary:'Happy… whatever.',friendly:'Spread the love, booker!',warm:'Put a heart up for the crew on your way out!',devoted:'I saved the whole ring crew a place at the party!'},
  sore:'I remembered what you said about my hearts. I put the scissors away before I came to talk to you.',
  reacts:{kept:'The Grinch leaves a paper heart on the running order beside the thing you delivered.',broken:'The Grinch unpins the heart from the running order and folds it to fit back in his pocket.'},
  jealous:'The Grinch straightens a paper heart on an empty chair. “I’m glad {name} had a nice evening. Your chair’s still here. I only checked twice.”',
  backstage:{
   won:{tell:'The Grinch comes over with a paper heart stuck to each palm, trying to applaud without losing either.',
    line:'“When I got up, somebody in the back held up a heart I didn’t even make!”',
    replies:[
     {style:'hype',promise:'promo',text:'“Take the mic next week. See how many more hearts go up when you ask.”',reaction:'He holds both palms high. “I’ll show them you can make one out of the programme!”'},
     {style:'believer',text:'“Leave that one with whoever made it. Now there’s somebody else who knows how it feels.”',reaction:'He lets his hands fall. “I hope they keep it somewhere good.”'},
     {style:'straight',text:'“Take the tape off your hands before you tear either one.”',reaction:'He peels one heart free and offers it to you. “Can you hold this corner?”'}
    ]},
   lost:{tell:'The Grinch pinches a paper heart at the crease, where the two halves won’t quite meet.',
    line:'“I made this one to hold up at the bell, and now I can’t think who it goes to.”',
    replies:[
     {style:'believer',text:'“Keep it. You made it before you knew how the match would go.”',reaction:'He stops trying to fix the crease. “I can stick it over my own chair.”'},
     {style:'hype',text:'“Hold it up anyway. Somebody out there could use a heart after the night you both had.”',reaction:'He lifts it to shoulder height first. “I can start with the crew.”'},
     {truth:true,text:'“You can put it down and be sore for a minute. I’ll stay right here.”',reaction:'He sets it on the nearest chair and takes the one beside it.'}
    ]},
   stole:{tell:'The Grinch has three loose streamers over one arm and keeps looking back toward the sound of the crowd.',
    line:'“Did you hear them yell together? We didn’t even put the words on anything!”',
    replies:[
     {style:'hype',text:'“Let them teach it to you next time. Give them the first beat and see what comes back.”',reaction:'He taps a spool against his palm, then leaves a gap for the answer.'},
     {style:'believer',text:'“Take one streamer home. You can leave the other two for the people who started it.”',reaction:'He chooses the shortest. “This one will fit over my sink.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He wraps the shortest around a finger. “I can hang that up without having to explain the finish.”'}]},
     {style:'straight',text:'“You left them room to make their own noise. Remember how long you waited.”',reaction:'He counts the beat on his fingers and manages to leave the last finger down.'}
    ]},
   flat:{tell:'The Grinch rolls the banner inward so the glitter letters disappear one at a time.',
    line:'“I wrote EVERYBODY on it, but I think everybody was getting a pretzel.”',
    replies:[
     {style:'hype',promise:'appearance',text:'“You’re on next week. Give one person in the front row something to hold up and let the rest catch on.”',reaction:'He unrolls just enough to see the E. “I could start with a sign that fits in one lap.”'},
     {style:'believer',text:'“What did you want the room to do with you? Start with the part you could show me without the banner.”',reaction:'He puts the roll under a chair and demonstrates with both hands free.'},
     {breaks:true,text:'“Leave the banner home next time. I need one entrance the crew can set up in the dark.”',reaction:'He rolls the last letter in. “Right. I’ll tell the people who helped make it.”'}
    ]},
   kept:{tell:'The Grinch has made a paper chain with one link large enough to put a hand through.',
    line:'“That big one is for {promise}. I waited until tonight to close it.”',
    replies:[
     {style:'hype',text:'“Close it where the crew can see. They helped get us to that last link.”',reaction:'He holds the two ends apart. “Somebody get Bev! She should get to press it down.”'},
     {style:'believer',text:'“Want me to hold it steady while you do the last bit?”',reaction:'He gives you the heavy end of the chain. “Tell me when you’ve got it.”'}
    ]},
   broken:{tell:'The Grinch peels a piece of tape off his sleeve, then sticks it back in the same place.',
    line:'“I made a little sign for {promise}, in case you needed help pointing people to it.”',
    replies:[
     {style:'believer',text:'“I should have told you myself. Can I see what you made?”',reaction:'He holds up the sign by a corner. “It looks better when you can see the whole thing.”'},
     {style:'hype',promise:'appearance',text:'“You’ll be on the card next week. We can put your name up where the whole hall can see it.”',reaction:'He peels the tape free. “Let’s leave space around it this time.”'},
     {breaks:true,text:'“Keep the sign in the supply box. That way it’ll be ready when I do have a spot.”',reaction:'He folds it with the letters inside. “It might fit. I cut it for the door.”'}
    ]},
   benched:{tell:'The Grinch carries an unused roll of streamers across the lot, carefully pinning down the loose end.',
    line:'“I heard the crowd for {name} all the way out here, and I’d have thrown these if I’d known where to stand.”',
    replies:[
     {style:'hype',promise:'appearance',text:'“Stand in your own corner next week. You’ve got a match.”',reaction:'He lets the loose end go for a second. “I know how far I can get it from there!”'},
     {style:'believer',text:'“Save a roll for your own crowd. You can be glad they had a good night and still want one.”',reaction:'He winds the end in carefully. “I can keep both things in my hands.”'},
     {style:'straight',text:'“There’s room for what you bring. Tell me what you’d do with one roll and your own entrance.”',reaction:'He looks down at the roll. “Well, I’d give the loose end away first.”'}
    ]},
   idle:{tell:'The Grinch has a ticket envelope full of tiny paper hearts, with the corners starting to buckle.',
    line:'“I made a heart for every Saturday I sat out, and the envelope won’t shut anymore.”',
    replies:[
     {style:'hype',promise:'promo',text:'“Take the mic next week. Show the room the first one and tell them why you kept making more.”',reaction:'He stops trying to force the flap down. “I thought I’d run out of reasons before I ran out of paper.”'},
     {style:'believer',text:'“Pick the one you’d want up first. I can wait while you look through them.”',reaction:'He sorts past the biggest one. “This little one. I made it before I got mad.”'}
    ]},
   cutIn:{tell:'The Grinch stops a loose strip of tinsel under his boot before it can slide between you.',
    line:'“One second, {name}. I can move the decorations, but I need to know which part of the floor you want back.”',
    replies:[
     {style:'hype',text:'“Put them up high enough for the whole room to see. Then nobody has to go around them.”',reaction:'He looks up, already measuring. “I can make a great big gap at the bottom!”'},
     {style:'believer',text:'“Ask where the broom catches. You can keep the bit you made and make the work easier.”',reaction:'He lifts the tinsel and waits for someone to point.'},
     {style:'straight',text:'“Start with the doorway. Leave enough room for someone carrying chairs.”',reaction:'He winds up one end. “You can go through while I do the rest.”'}
    ]},
   skip:'The Grinch keeps both hands around a paper heart and takes the long way past you so the empty side faces out.'
  },
  epilogue:{
   best:{title:'Room at the Party',line:'The Grinch smooths a paper heart. “I kept the last chair empty for whoever showed up late. You taught me that was an invitation too!”'},
   neutral:{title:'A Little Less Glitter',line:'The Grinch sets the scissors down. “I’m trying to make the next heart small enough to fit in somebody else’s plans.”'},
   bad:{title:'The Lights Stay Down',line:'The Grinch smooths a paper heart. “I took down the hearts on your side of the room. If you want one back, you can ask.”'}
  },
  scenes:[
   {line:'I need a GRAND GESTURE in the ring this week. Streamers? A choir? A lockbox full of hearts? ALL THREE?',replies:[
    {style:'hype',text:'Take the mic this week. Let the hall vote for the first thing that comes out of the box.',promise:'promo',reaction:'He opens the lockbox wide. “If they pick the choir, we’ll need a much bigger box!”',
     cases:[{when:{lostLastShow:true},delta:-1,reaction:'He closes the lid until only one heart will fit through. “I heard them when the bell went. Can I make one thing without asking the whole room first?”'}]},
    {style:'believer',text:'Pick one thing you’d still want to make if the hall were empty. Start there.',reaction:'He lifts out a single heart. “I can make this one at the table. You can stay if you want.”'},
    {breaks:true,text:'Make it the lockbox. I can get that through the doors without booking an extra crew.',reaction:'He puts the choir list inside and shuts it. “I’d better tell them they can have their Thursday back.”'}]},
   {line:'I had a wreath for Lemon Tart. She saw me coming and said “ugh.” I still have the wreath. Do you think I should try again?',replies:[
    {style:'hype',text:'Give her the widest aisle in Wisconsin! If she waves first, you can wave back.',reaction:'He spreads his arms to measure the aisle, then takes one full step back. “I can make it wider.”'},
    {style:'believer',text:'You can care about her and give her room. Put the wreath in your own corner tonight.',reaction:'He hangs it on the back of his own chair. “I can see it from here, too.”'},
    {truth:true,text:'She’s asking for space. If you keep bringing her the wreath, she has to turn it down every time.',reaction:'He pulls the wreath into his lap and folds its ribbon inward. “I’ll take her name off it myself.”'}]},
   {line:'Sweeps brought back last year’s tinsel in his dustpan. He said he’d be obliged if this was the last of it. That’s a love letter, right?',replies:[
    {style:'hype',text:'Make the dustpan the centerpiece! Tell everyone Sweeps wants the same decorations back next year.',sides:{10:-2},reaction:'He reaches for the dustpan. “Do you think he’ll let me glue on the ribbon if I promise to peel it off?”'},
    {style:'believer',text:'He kept it because he knew it mattered to you. Ask him where it can hang without making him sweep it twice.',reaction:'He holds the tinsel up to a hook by the door. “High enough that he can get the broom under it?”'},
    {breaks:true,text:'Bag it and put it in storage. If it’s already shedding, Bev will want the floor clear before doors.',reaction:'He takes the bag with both hands. “I’ll label it so we can find it next year.”'}]},
   {line:'Lemon Tart signed up to bring lemons to the holiday party. I had already volunteered to bring love. Should I change mine?',replies:[
    {style:'hype',text:'Keep your line. I’ll give you a minute on the mic this week to invite the whole crew. Let her bring what she signed up for.',promise:'promo',reaction:'He draws a heart across his own line. He stops it short of hers.'},
    {style:'believer',text:'Leave both names where they are. You can make the table look welcoming without making her part of the decorations.',reaction:'He props an empty sign holder beside the lemons. “She can write her own label if she wants.”'},
    {breaks:true,text:'Put down ice. We have three dessert entries and nobody bringing ice.',reaction:'He adds ICE to his line in very small letters.'}]},
   {line:'I made a garland with room for one more heart. I keep wanting to fill the gap. What if the gap is the good bit?',replies:[
    {style:'hype',text:'You have a match this week. Hang the garland in your corner! Let the whole hall see where there’s room for one more.',promise:'appearance',reaction:'He adjusts the desk lamp and steps out of the light himself.',
     cases:[{when:{eventWeek:true},morale:2,reaction:'He winds an extra length of thread around a finger. “Big crowd this week. I can leave room for two.”'}]},
    {style:'believer',text:'Leave it open. Somebody might bring a shape you’ve never cut.',reaction:'“A different shape.” He sets the scissors down for the night.'},
    {breaks:true,text:'Fill it with a paper heart you can take off later. We can hang it tonight and keep moving.',reaction:'He holds a heart against the gap without pinning it. “I’ll know which one to take down.”'}]}
  ]},
 31:{speaker:'Ron',style:'bureaucrat',place:'Room B, Sturgeon Bay Public Library (booked for one neutral hour)',
  tells:{wary:'He has filed a formal statement of no comment regarding you.',friendly:'He acknowledges your existence, on the record.',warm:'He files non-binding statements of mild approval about you.',devoted:'He has abstained, in writing, from criticizing you. Twice.'},
  moods:{
   low:{style:'straight',tell:'Saturday’s statement is face-down. He nudges an uncapped pen across the table to you.'},
   high:{style:'bureaucrat',tell:'His copy of Saturday’s result has a page number and two witness signatures. He still wants to see the original.'}
  },distrusts:'hype',
  stale:'The minutes will reflect your remarks by reference. We have them twice in full.',
  heard:'{name} has forwarded your remarks. I had to ask for the unabridged version. The short one sounded almost fair.',
  invite:{wary:'A public notice is pinned to the library board. It does not mention you specifically.',friendly:'Room B is reserved for a neutral hour. You may attend in an observational capacity.',warm:'NOTICE OF MEETING: you and I, Room B, 6:00 PM. Attendance is neither required nor discouraged.'},
  signoff:{wary:'No further comment.',friendly:'This meeting is adjourned, neutrally.',warm:'I neither endorse nor oppose you. Warmly.',devoted:'Let the record show I was glad you came. Strike that. Let it show it.'},
  sore:'The minutes reflect that you took issue with my neutrality. I have entered no opinion on your objection.',
  reacts:{kept:'Ron stamps the commitment fulfilled in a color associated with neither corner.',broken:'Ron records a discrepancy and leaves your proposed explanation blank.'},
  jealous:'Ron opens a fresh folder. “For the record, I take no position on your evening with {name}. I would appreciate the minutes.”',
  backstage:{
   won:{tell:'Ron has marked both corners on a score slip, with a smaller mark beneath one.',
    line:'“The official result favors my corner. I have made every effort to record it without enthusiasm.”',
    replies:[
     {style:'bureaucrat',text:'“Record the result in one box and any enthusiasm in a separate, optional box.”',reaction:'He draws the second box slightly larger. “The distinction seems defensible.”'},
     {style:'straight',text:'“You won, Ron. You can enjoy it here without issuing a finding.”',reaction:'He folds the slip. “I might get a slice of pie on the way home.”'},
     {style:'hype',promise:'promo',text:'“Take the mic next week and read that result in whatever voice comes out.”',reaction:'He underlines ‘official’. “I should rehearse at something above a murmur.”'}
    ]},
   lost:{tell:'Ron has started a statement on the back of the result slip and left the rest of the page empty.',
    line:'“I have written ‘I lost.’ Is there any business before I put the full stop in?”',
    replies:[
     {style:'straight',text:'“Put it in. If you want to tell me where it went wrong, tell me out loud.”',reaction:'He puts the point in hard enough to dent the paper. “My right hand. I let go.”'},
     {style:'bureaucrat',promise:'rematch',text:'“Leave space for a second entry. You get another match with {name} next week.”',reaction:'He rules a new line beneath the first. “A new entry. No amendment to this one.”'},
     {truth:true,text:'“You were waiting for them to make a mistake. By the time you did something, it was too late.”',reaction:'He puts the pen away. “I know the moment. I’ll start there.”'}
    ]},
   stole:{tell:'Ron holds a noise complaint form with the box for the time filled in and the box for the complainant blank.',
    line:'“Someone in the car park heard us through a closed window and declined to complain.”',
    replies:[
     {style:'bureaucrat',text:'“Enter it as a statement from outside the hall. You can file it under public response.”',reaction:'He clips the form to the result. “We’ll need a divider for unsolicited approval.”'},
     {style:'straight',text:'“You and the other corner made that noise happen. Remember where you first heard it.”',reaction:'He taps the form once. “It started earlier than the time I wrote down.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He looks at the result slip. “There was already noise before anyone knew which name went there.”'}]},
     {style:'believer',text:'“If you see that person again, ask what it sounded like out there.”',reaction:'He turns the form over. “I think I’d like to hear the description without transcribing it.”'}
    ]},
   flat:{tell:'Ron has prepared a survey with the answer box left open-ended.',
    line:'“I heard a man ask the time while I was out there. I am considering that our first response.”',
    replies:[
     {style:'bureaucrat',text:'“Give me two timestamps, when they looked away and when they looked back.”',reaction:'He folds the form down to two lines. “That second one may take some checking.”'},
     {style:'straight',text:'“Pick the part you’d show somebody with one minute left. Start there next time.”',reaction:'He sets the form aside. “I can show you that part now.”'},
     {breaks:true,text:'“Leave the survey. We already have the grade and the crew needs to lock up.”',reaction:'He puts the blank form beneath the report. “The record will reflect that nobody was asked.”'}
    ]},
   kept:{tell:'Ron carries a stamp in one hand and its cap in the other.',
    line:'“The entry for {promise} appears to be ready for closure, subject to your seeing what I saw.”',
    replies:[
     {style:'bureaucrat',text:'“I saw it. Mark it fulfilled. Leave the original commitment attached.”',reaction:'He presses the stamp down square. “I prefer it when the two pages agree.”'},
     {style:'straight',text:'“It happened, Ron. How did it feel when you knew it would?”',reaction:'He holds the stamp above the page. “I stopped checking the time.”'}
    ]},
   broken:{tell:'Ron offers a folder open to a blank line where the booker’s initials belong.',
    line:'“I have a record of {promise} and a result that differs from the record.”',
    replies:[
     {style:'bureaucrat',text:'“Put the two side by side. I’ll initial the discrepancy as mine.”',reaction:'He aligns the pages without covering either heading. “We can proceed from a shared record.”'},
     {style:'straight',promise:'appearance',text:'“I missed it. You have a match next week. I’ll put that on a fresh line.”',reaction:'He turns the page without removing the first. “I can accept a fresh line.”'},
     {breaks:true,text:'“Attach the final card. It shows what the crew actually had time to put on.”',reaction:'He closes the folder. “It does. I had an additional question.”'}
    ]},
   benched:{tell:'Ron keeps the programme folded so two places on the running order are visible, one occupied and one blank.',
    line:'“For purposes of comparison, did {name} submit anything I was entitled to submit?”',
    replies:[
     {style:'bureaucrat',promise:'appearance',text:'“Put your match request in writing. You have a spot on next week’s card.”',reaction:'He takes a blank slip from behind the programme. “This time I will state a preference.”'},
     {style:'straight',text:'“Tell me what you’d like to do on a card where neither of you has to answer for the other.”',reaction:'He folds the other name out of view. “I would like to open.”'},
     {style:'believer',text:'“I can hear your request without making you compare it to theirs.”',reaction:'He lowers the programme. “I have a version of it that fits in one sentence.”'}
    ]},
   idle:{tell:'Ron has clipped his unused venue passes together and left the newest one facing out.',
    line:'“The last four agendas list me under ‘available’. I would like to move to ‘present.’”',
    replies:[
     {style:'bureaucrat',promise:'appearance',text:'“Motion carried. You have a match next week, and I’ll enter it on the sheet now.”',reaction:'He unclips the top pass. “I’ll retain this one for comparison.”'},
     {style:'straight',text:'“Ask me for the spot you want. I can work with more than ‘available.’”',reaction:'He pockets the passes. “Somewhere before intermission. I’d like to see people come back.”'}
    ]},
   cutIn:{tell:'Ron stands just outside the space the two of you are using, a pen raised at shoulder height.',
    line:'“I’d like the minutes to distinguish what {name} just said from what the room actually heard.”',
    replies:[
     {style:'bureaucrat',text:'“Enter both accounts. I’ll sign the result by itself.”',reaction:'He draws a line down the page. “There is room for disagreement on either side.”'},
     {style:'straight',text:'“Tell me the one bit you’d correct if you could only have one sentence.”',reaction:'He drops the pen to his side. “I’d like to say it without dictating it.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He folds the minutes away. “I lost. I can tell you how without issuing a dissent.”'}]},
     {style:'believer',text:'“You can ask to be heard without opening the minutes, Ron.”',reaction:'He puts the cap on the pen. “I would like to be heard.”'}
    ]},
   skip:'Ron raises a hand to acknowledge your presence and lowers it before the gesture can be entered as a greeting.'
  },
  epilogue:{
   best:{title:'A Finding of Mild Approval',line:'Ron keeps the minutes open. “The record shows a consistent pattern of good faith. I signed that finding myself.”'},
   neutral:{title:'Pending Further Review',line:'Ron clicks his pen once. “I have placed both the good and the bad in the same folder, with equal access to either.”'},
   bad:{title:'Entered Without Comment',line:'Ron keeps the minutes open. “I abstain from evaluating our work together. The length of this silence is entirely deliberate.”'}
  },
  scenes:[
   {line:'I have prepared a statement on the championship. It takes no position on who should hold it. It does include an artist’s rendering of me in the belt.',replies:[
    {style:'bureaucrat',text:'Submit it in triplicate. I’ll schedule a public reading on the mic this week.',promise:'promo',reaction:'“Triplicate.” His eyes mist over.',
     cases:[{when:{champion:true},delta:2,reaction:'He unclips the drawing and sets the belt in its place. “I’ll bring Exhibit A. It still takes no position on who should hold it.”'}]},
    {style:'straight',text:'Put the match you want in the first sentence. I can work with a request.',reaction:'He writes REQUEST above the title and underlines it once.',
     cases:[{when:{lostLastShow:true},morale:2,reaction:'He strikes out two paragraphs. “I lost. I am requesting another match. That’s enough of a statement.”'}]},
    {breaks:true,text:'Leave it with me. I need to know who’s available before I can put anyone in the title picture.',reaction:'He draws the folder back an inch. “Then I’ll withhold the attachment pending a response.”'}]},
   {line:'Two parties have requested my endorsement for the potluck dessert table. I have abstained. Please confirm that abstention is correct.',replies:[
    {style:'bureaucrat',text:'Confirmed. I’ll log it as an abstention and make sure they both get a copy.',reaction:'He stamps something. You did not see him bring a stamp.'},
    {style:'straight',text:'Ask them to put both plates out. Then you can eat without making it a vote.',reaction:'He gets out a napkin. “I can participate in two tastings.”'},
    {breaks:true,text:'Serve the brownies first. They’re already cut and the line is out the door.',reaction:'He moves his chair away from the dessert table. “I will abstain from serving.”'}]},
   {line:'Greek wants a statement about his latest picture. Three drafts. Each one begins “long.” I am unable to proceed to the second word.',replies:[
    {style:'bureaucrat',text:'File a formal objection to the runtime. Send Greek all three drafts so he can see how long it took you to get through them.',sides:{0:-2},reaction:'He clips the pages together. “It could be a long envelope as well.”'},
    {style:'straight',text:'Tell him where you stopped following the story. He can do something with a scene number.',reaction:'He points to one line in his notes. “I knew exactly where I stopped.”'},
    {truth:true,text:'You told him it was exhausting to his face. Three pages on letterhead won’t make that feel any kinder.',reaction:'He pulls the statement out of its sleeve. “I owe him a shorter conversation. In person.”'}]},
   {line:'Somebody complimented my headlock. I haven’t determined whether that creates an appearance of bias against the wristlock.',replies:[
    {style:'bureaucrat',text:'Enter it as public comment. I’ll put you on the card this week so the wristlock can have its right of reply.',promise:'appearance',reaction:'He labels a new tab. “Equal time begins at the bell.”'},
    {style:'straight',text:'Thank them. Then find out which hold got you out of trouble.',reaction:'He rubs a wrist. “The minutes may reflect that I have a preliminary finding.”'},
    {breaks:true,text:'Take the compliment and go warm up. Doors open in ten.',reaction:'He leaves the compliment on the table, where the record will find it later.'}]},
   {line:'Charming sent me a thank-you for agreeing to something. I have the envelope, the stamp and absolutely no recollection of agreeing.',replies:[
    {style:'bureaucrat',text:'File it under disputed correspondence. Send Charming a copy of the empty page where his agreement would go.',sides:{18:-2},reaction:'He holds the page up to the light. “Nothing on either side. I’ll have it certified.”'},
    {style:'straight',text:'Ask him what he actually needs from you. Then you can give him an answer he’ll recognize.',reaction:'He puts the envelope on top of the folder. “I can do it before he buys another stamp.”'},
    {breaks:true,text:'Put it aside until he asks for something. You don’t have to answer every thank-you note.',reaction:'He moves the correspondence to a drawer labeled DISPUTED.'}]}
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
   low:{style:'hype',tell:'The tennis ball sits halfway between his chair and the gate. When you come in, he nudges it toward you with his boot and watches your hand.'},
   high:{style:'believer',tell:'The rulebook is shut beside him. He’s kept the ball from Saturday on the chair where the winner’s trophy ought to go.'}
  },distrusts:'bureaucrat',
  stale:'I brought that one back twice. Throw it somewhere I haven’t been.',
  heard:'{name} told me what you said. I checked page forty-one again. I still get to be here.',
  invite:{wary:'He’s in the yard. He doesn’t look at the gate when you open it.',friendly:'WOOF. yard. 5pm. (bring the ball)',warm:'[a photo of a tennis ball, sent at 6:02 a.m. No text.]'},
  signoff:{wary:'I’ll be by the fence.',friendly:'Good booker.',warm:'The ball stays here, booker. You know where to find it.',devoted:'I’ll leave the gate on the latch for you. It’s the one on the left.'},
  sore:'You had another word for me. I am a dog. I can wait till you remember the right one.',soreWeeks:8,
  reacts:{kept:'The Dog brings you the rulebook open to page forty-one and waits for you to finish looking.',broken:'The Dog closes the rulebook around his bookmark and carries it back to the yard.'},
  jealous:'The Dog holds up a tennis ball. “Did {name} bring you a ball? I brought the good one.”',
  backstage:{
   won:{tell:'The Dog holds a tennis ball out where you can see it and pulls it back just before you can take it.',
    line:'“I got the win, booker. I’m keeping this one till I get home.”',
    replies:[
     {style:'believer',text:'“Good dog. You can keep it tomorrow, too.”',reaction:'He closes his hand around the ball. “I’ll put it where I can see it from my chair.”'},
     {style:'hype',text:'“Hold it up on your way out. I bet somebody’s still waiting to see what you won.”',reaction:'He holds it high. “If they ask, they can look. They can throw the other one.”'},
     {style:'bureaucrat',text:'“We can put the result in the book so the ball doesn’t have to do all the work.”',reaction:'He looks at the ball. “Put DOG in big letters. I want to find it with the book shut most of the way.”'}
    ]},
   lost:{tell:'The Dog rolls a tennis ball between his hands without taking his eyes off the doorway.',
    line:'“The bell went before I got there. Is there something else I can go get?”',
    replies:[
     {style:'hype',text:'“Give me the ball. I’ll send it right to the fence, and this time you call when you get there.”',reaction:'He puts the ball in your hand. “Get it past the last chair.”'},
     {style:'believer',text:'“Sit with me for a minute. You can keep the ball right where it is.”',reaction:'He lets it rest in one hand. “You’ll tell me if you want me to move?”'},
     {style:'straight',promise:'rematch',text:'“I’ll book you against {name} next week. Save that run for when the bell starts you.”',reaction:'He tucks the ball under one arm. “I’ll listen for the first bell this time.”'}
    ]},
   stole:{tell:'The Dog carries the rulebook closed, with a crumpled ticket stub sticking out of the top.',
    line:'“The kid who gave me this said DOG before the grown-ups did. I heard all of them the next time.”',
    replies:[
     {style:'believer',text:'“Keep that stub. You earned the part they all said together.”',reaction:'He pushes the stub just far enough in to keep it safe. “I’ll remember which page it is.”'},
     {style:'hype',text:'“Call it once on the way out. See who’s still here to call it back.”',reaction:'He makes it one bark, short enough to leave room for an answer.',cases:[{when:{lostTonight:true},morale:2,reaction:'He takes one step toward the door. “I can go first even after the bell?”'}]},
     {style:'straight',text:'“If that kid comes back, ask what made them start it.”',reaction:'He opens the book to look at the seat number. “I want to know what they saw from down there.”'}
    ]},
   flat:{tell:'The Dog has one hand in his pocket and keeps glancing down the empty aisle.',
    line:'“I kept waiting for somebody to throw something back. I think they ran out of things to throw.”',
    replies:[
     {style:'believer',text:'“Show me what you did when they went quiet. I want to see what you gave them.”',reaction:'He takes his hand out of his pocket. “It starts with them being able to see the ball.”'},
     {style:'hype',promise:'appearance',text:'“You’re back on the card next week. Give the front row one bark they can send right back.”',reaction:'He tries one at half volume. “That leaves them time to do theirs.”'},
     {breaks:true,text:'“We can ask people to stay seated next time. They might pay more attention if we keep the aisle clear.”',reaction:'He puts his hand back in his pocket. “I was waiting for one to get up.”'}
    ]},
   kept:{tell:'The Dog carries the rulebook open in both hands with a new slip of paper across the crease.',
    line:'“You said {promise}, and it happened before I had to look anything up.”',
    replies:[
     {style:'believer',text:'“You can shut the book. I remember what I told you.”',reaction:'He shuts it with the slip still inside. “I’ll keep it there because it was good.”'},
     {style:'hype',text:'“Put the result on the slip. Give it a big DOG so you can see it every time you open the book.”',reaction:'He flattens the paper. “There’s room for the date if I write DOG first.”'}
    ]},
   broken:{tell:'The Dog holds out the rulebook with one thumb keeping his place and the other pressing down a curled corner.',
    line:'“You said {promise}. I turned the page twice. Where does it say I stop waiting?”',
    replies:[
     {style:'believer',text:'“You can stop now. I missed it and I should’ve come to tell you.”',reaction:'He lets the corner curl back up. “Come before I start looking next time.”'},
     {style:'hype',promise:'appearance',text:'“You’ve got a match next week. I’ll put DOG on the sheet where you can see it.”',reaction:'He turns the book around. “Write it like you want me to come when you call.”'},
     {breaks:true,text:'“The posted card is the one to go by. If you’re off it, you can head home when you need to.”',reaction:'He shuts the book with his thumb still inside. “I thought you wanted me here.”'}
    ]},
   benched:{tell:'The Dog waits by the edge of the lot with a tennis ball held between both hands.',
    line:'“I heard them call for {name} from out here. Was there a place I could’ve stood to hear my name?”',
    replies:[
     {style:'believer',promise:'appearance',text:'“Yes. Your corner, next week. You have a match.”',reaction:'He puts the ball away. “Tell them they can call it before the bell.”'},
     {style:'hype',text:'“Come one step closer and let me hear what you’d yell back.”',reaction:'He steps over the parking stripe. “DOG!”'},
     {style:'straight',text:'“I booked their spot. Tell me what you want to do when it’s your name they’re calling.”',reaction:'He turns the ball in his hands. “One where I get to chase somebody who can run.”'}
    ]},
   idle:{tell:'The Dog shows you a tennis ball with a clean strip running around the middle.',
    line:'“That’s the part I can reach under the fence. I’ve been throwing it from the same place too long.”',
    replies:[
     {style:'believer',promise:'appearance',text:'“Bring it through the front door next week. You’ve got a match.”',reaction:'He looks down at the clean strip. “I’ll turn it around so they can see where it’s been.”'},
     {style:'hype',text:'“Give it here. Show me where you want it to land this time.”',reaction:'He points to the far end of the fence. “Past the place I can get it back easy.”'}
    ]},
   cutIn:{tell:'The Dog catches a bouncing ball with both hands and steps close enough for you both to see it.',
    line:'“Hold on, {name}. I can get my hand out of Hold One. Do you want to see where I put my thumb?”',
    replies:[
     {style:'believer',text:'“Show us. Leave the ball in your hand so we can all see the thumb.”',reaction:'He turns the ball so the thumb faces the other corner. “It goes right here when I want my hand back.”'},
     {style:'hype',text:'“Show it slow once. Then let’s see you get it free at full speed.”',reaction:'He hands you the ball. “Hold this till you see both my hands again.”',cases:[{when:{lostTonight:true},morale:2,reaction:'He gives you the ball with both hands. “Count it when I get loose. I want to hear that part.”'}]},
     {style:'straight',text:'“Ask for a try at practice. You can both bring an answer when there’s a mat.”',reaction:'He puts the ball away. “Tell me which side of the barn door to wait on.”'}
    ]},
   skip:'The Dog catches the tennis ball just before it rolls to your boot and keeps going with both hands around it.'
  },
  epilogue:{
   best:{title:'The Yard Is Open',line:'The Dog grips the rulebook with both hands. “I left the gate the good kind of open. Bring something to throw if you come back.”'},
   neutral:{title:'Page Marked',line:'The Dog holds his place with a thumb. “Page forty-one is where it was. I can show you again any time.”'},
   bad:{title:'Behind the Fence',line:'The Dog grips the rulebook with both hands. “I heard you coming. I’m staying here where the book is.”'}
  },
  scenes:[
   {line:'I fetched that folding chair from the end of the hall. Throw it farther. I can bring it back from there, too.',replies:[
    {style:'believer',text:'I’ll put you on the card this week. Keep the chair in your corner so everybody can see what you fetched.',promise:'appearance',reaction:'He squares the chair with both hands. “I’ll take the long way to my corner. Then they can see how far I carry it.”'},
    {style:'hype',text:'Race me to the fence and back. I’ll count you home even if I’m still halfway there.',reaction:'He grips the fence with one hand and looks back. “Count from there! I can hear you!”'},
    {breaks:true,text:'Leave it folded by the door. We’re still short two chairs for the front row.',reaction:'He leans it against the door. “I can wait here in case they need somebody to bring it.”'}]},
   {line:'They left DOG off the match poster. Page forty-one doesn’t say dogs either. One of those things needs fixing.',replies:[
    {style:'believer',text:'No dogs on page forty-one. You’re cleared to wrestle. I’ll put you on the card this week.',promise:'appearance',reaction:'He shuts the book with both hands. “Put DOG on the card where everybody can read it.”',
     cases:[{when:{eventWeek:true},morale:2,reaction:'He checks the size of the event poster. “Use the big letters. The people who stand in the back count, too.”'}]},
    {style:'hype',text:'Read that page loud enough for the ticket table. I’ll yell DOG where they left it out.',reaction:'He reads every word and leaves a gap as wide as the yard.'},
    {breaks:true,text:'Leave a copy with the referee. We can settle who gets to wrestle with the person who signals for the bell.',reaction:'He holds the book tighter. “The person who has to wrestle has a copy right here.”'}]},
   {line:'Bev says the chair is hers. I brought it back. She says the yard isn’t a place to bring it back to.',replies:[
    {style:'believer',text:'Good dog. Let’s carry it to her door, so she knows you brought it all the way.',reaction:'He takes one side and gives you the other. “Now we both get to say we fetched it.”'},
    {style:'hype',text:'One last carry. I’ll call the finish when all four feet are on Bev’s porch.',reaction:'He lines the chair legs up with the edge of the porch. “Count all four. I want Bev to hear you.”'},
    {truth:true,text:'You fetched it to the wrong place. Bev still had to come looking. Take it to her door and ask where she wants it.',reaction:'He looks down at the chair, then back at the yard. “I can ask. I know which door.”'}]},
   {line:'2 Holds says I can’t write “dogs are exempt” in the margin just because I got my wrist free. I’m holding the pencil. What do I write?',replies:[
    {style:'believer',text:'Write that Hold One fails on dogs. He can bring you a demonstration if he wants the margin back.',sides:{1:-3},reaction:'He writes in pencil with a steady hand. “He can have the eraser if he brings the case.”'},
    {style:'hype',text:'Draw two corners. He gets one and you get one. Next time you practice, he gets one try to hold on and you get one try to get loose. I’ll count you in.',reaction:'He draws one corner on each side of the page. “Use both names. There’s room.”'},
    {breaks:true,text:'Leave the margin clean. Bev has to lend that copy to the next person who asks.',reaction:'He lays the pencil in the crease. “I hope they turn to the right page.”'}]},
   {line:'A kid asked if they could throw the tennis ball. They threw it sideways. I got it anyway. Is that a rule we can put in?',replies:[
    {style:'believer',text:'Every throw counts if somebody goes after it. I’ll give you the mic this week so the kid can hear you make it a rule.',promise:'promo',reaction:'He rests the ball against the kid’s empty chair. “I’ll say it where they can see which ball I mean.”'},
    {style:'hype',text:'Show me the sideways throw! I’ll yell as soon as you get to it, just like they did.',reaction:'He moves the chair aside. “Give me the hard one. That’s the one I brought back.”',
     cases:[{when:{lostLastShow:true},morale:2,reaction:'He goes after the throw without looking back. When he returns he holds the ball out. “Again. Same way.”'}]},
    {breaks:true,text:'Tell them you had a good time. It can be a game you two play without anybody writing down rules.',reaction:'He opens the book to the back. “Then I’ll write down where we played it.”'}]}
  ]}
};
const FEATURED_IDS=Object.keys(FEATURED_ROUTES).map(Number);

// Stable beat and memory IDs preserve existing Sweeps saves.
const SWEEPS_BEATS={
 'after-hours':{kind:'beat',when:{},cue:'First evening after his spotlight month',
  line:'Hear that? The boards by the ring got a different sound when they’re clean. The belt ought to sound like that, boss.',
  replies:[
   {style:'believer',text:'Show me which boards. I want to hear it.',reaction:'He runs the broom along the seam. “There. You can hear every bristle.”'},
   {style:'straight',text:'I hear the boards. What does that have to do with the belt?',reaction:'He keeps his eyes on the seam. “Same people gotta stand on both.”'},
   {breaks:true,text:'It’s just a floor, Sweeps.',reaction:'He pulls the dustpan out from between your shoes. “Sure. Step back a little.”'}
  ]},
 path:{kind:'beat',when:{minTrust:55},cue:'Once friendly, after he’s shown you how the boards sound',
  line:'I got grit in my elbow taking a bump last Saturday. I can sweep the canvas myself if you’ve got a match for me.',
  replies:[
   {style:'believer',text:'You’ve got a match this week. The canvas is yours before doors.',promise:'appearance',reaction:'He leans the broom against your chair. “Leave that right there. I’ll know where to start.”'},
   {style:'bureaucrat',text:'I’ll ask the crew to put canvas sweeping on the checklist.',reaction:'“Put it last. Folks walk right through a job if they think it’s finished.”'},
   {breaks:true,text:'The crew has a mop. Leave it to them.',reaction:'He picks a bristle off his sleeve. “A mop can’t tell you what it picked up.”'}
  ]},
 stain:{kind:'flag',flag:true,when:{minTrust:70,workedLastWeek:true},cue:'Once warm, the week after he worked a show',
  memory:'stain',plan:'Sweeps faces the Unsweepable Stain',invite:'Boss. Side door’s open. Look by the timekeeper’s table.',
  line:'I swept it before bell and after bell. Same mark. I swept around it just now. First time I’ve ever gone around anything.',
  replies:[
   {style:'believer',text:'You get the mic next week. Tell the room what keeps bringing you back to this spot.',promise:'promo',due:1,reaction:'He kneels and sets the broom beside him. “All right. But I’m pointing it out first so they know where to look.”'},
   {style:'straight',text:'Want me to bring a scraper?',reaction:'He presses his thumb against the mark. “Maybe tomorrow. I want to see if it moves on its own.”'},
   {breaks:true,text:'It’s old coffee. We could put a chair over it.',reaction:'He moves the nearest chair another foot away. “That’ll keep somebody from getting the idea.”'}
  ]},
 ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once he trusts you with the title shot',
  askPromise:{kind:'title',due:'event'},invite:'Can you come by? Got something to ask. Didn’t want to do it over the phone.',
  line:'Next big show, put me in a title match. I’ll sweep the floor myself for twenty-four hours straight. Anybody can watch me do it.',
  replies:[
   {style:'believer',ask:'accept',text:'You have the title match. I’ll make sure you get the floor for the whole day.',reaction:'He starts by your feet. “Then I’d better find out how much broom I’ve got left.”'},
   {style:'straight',ask:'defer',delta:-2,text:'Give me four weeks to find the time for it.',reaction:'He makes four short strokes over the same board. “I can keep a floor ready that long.”'},
   {ask:'decline',delta:-10,text:'I won’t book the title match. You can put the broom away.',reaction:'He leans the broom against the wall and nudges a paper cup toward the door with his boot.'}
  ]},
 vigil:{kind:'final',when:{},day:'Friday',cue:'The Friday of the week his title match is due',
  invite:'Hour one. Come at nineteen if you can. Bring something with a lid.',
  line:'Hour nineteen, boss. First time I could see my face in these boards. I reckon I ought to leave room for the other fella’s.',
  replies:[
   {style:'believer',text:'I’ll move the chairs. You keep the broom moving.',reaction:'He steers the broom under the first chair as you lift it. “Good. We’ll do the heavy ones together.”'},
   {style:'hype',text:'The whole room’s going to feel this when they walk in.',reaction:'He stops just long enough to look at the door. “Hope they wipe their feet first.”'}
  ]}
};
const SWEEPS_MEMORIES=[{id:'stain',title:'The Unsweepable Stain',caption:'Week {week} · He kept the chair off it.'}];
const SWEEPS_ENDINGS={
 best:{title:'The Cleanest Title Match in Wisconsin',line:'Sweeps looks down at the boards. “Twenty-four hours. Two sets of boot prints on it now. I think I’ll leave them till morning, boss. It’s never been cleaner.”'},
 neutral:{title:'A Fair Shake, At Last',line:'Sweeps rests both hands on the broom. “I got my title match, boss. Next time come sit with me for a bit before the doors open. It’s quiet then.”'},
 bad:{title:'Broom Against the Wall',line:'Sweeps looks down at the boards. “I left the broom by the side door. Someone’ll need it. The floor still has to be done.”'}
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
   line:'Page forty-one has boots, tape and mouthguards. It does not have dogs. I brought the whole book in case you wanted to check.',
   replies:[
    {style:'believer',text:'You have a match this week, good dog. Show the referee the page before the bell.',promise:'appearance',reaction:'He holds the book open with both thumbs. “I know the page by the feel of it now.”'},
    {style:'bureaucrat',text:'I’ll check the index. What else might they call a dog?',reaction:'“A good dog.” He leans closer to the index. “Try under G.”'},
    {breaks:true,text:'They wrote it for people. Why would it say dogs?',reaction:'He takes the book under his arm. “So they’d know how to stop one.”'}
   ]},
  'the-whistle':{kind:'beat',when:{minTrust:62},cue:'Once the Dog brings you the referee’s whistle',
   plan:'The Dog returns the whistle and asks for the same start signal as everyone else',
   line:'I brought you the whistle. It means stop for everybody. If I can stop when it blows, I think I ought to get a start.',
   replies:[
    {style:'believer',text:'You get a match this week. Hand it back to the ref yourself. Good dog.',promise:'appearance',reaction:'He holds out the whistle, then draws it back just enough to practice handing it over again.'},
    {style:'straight',text:'Let’s return it now. The ref will be looking for it.',reaction:'He slips the lanyard over his wrist. “I know. I was looking for it too, and I had it.”'},
    {breaks:true,text:'Leave it at the gate. The ref can pick it up on the way in.',reaction:'He places the whistle on the fence post. “I could’ve brought it all the way.”'}
   ]},
  'front-row-test':{kind:'beat',when:{minTrust:68},cue:'Once warm, he wants the audience to look for themselves',
   plan:'The Dog lends the front row his rulebook and wrestles under the same rules as everyone',
   line:'A kid asked what happens if somebody adds a rule while I’m wrestling. Can the front row hold the book where I can see it?',
   replies:[
    {style:'believer',text:'You have a match. Let that kid hold the book, and wrestle by the rules they’re holding.',promise:'appearance',reaction:'He weighs the book in both hands. “I’ll find them a chair with arms. It gets heavy.”'},
    {style:'bureaucrat',text:'We’ll mark the edition and date. Then we’ll know what version they saw.',reaction:'He points to the printing date. “I wasn’t even here yet. It still let me in.”'},
    {breaks:true,text:'Nobody came to watch you read.',reaction:'He wipes the cover with his sleeve. “Then they can watch me follow it.”'}
   ]},
  'bev-amendment':{kind:'flag',when:{minTrust:70,workedLastWeek:true},cue:'After the ladder, once warm and the week after the Dog worked',
   invite:'yard now. bev brought a pen. she says it’s for page 41.',
   memory:'bev-amendment',
   line:'Bev can fit “no dogs” under mouthguards. She’s trying it in pencil first. Will it count as a rule if she goes over it in pen?',
   replies:[
    {style:'believer',text:'Good dog. Keep your place. Ask Bev to read the rules that are there before she adds one.',reaction:'He sets a finger beneath the last printed line. “I’ll wait. I’m very good at wait when I know what it’s for.”'},
    {style:'bureaucrat',text:'Ask Bev to mark it as proposed. A proposal isn’t a rule yet.',reaction:'He puts a blank sheet beside the book. “There. She can write on that all day.”'},
    {breaks:true,text:'If Bev wants to ban dogs, give her the pencil.',reaction:'He sets the pencil on the ground between you. “You can pick it up. I’m staying with the book.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once the Dog trusts you to give the book the main event',
   askPromise:{kind:'promo',due:'event',plan:'Main event: the Dog reads the entire unabridged rulebook aloud, including the index'},
   invite:'i counted the pages. come to the yard. bring your long pencil.',
   line:'Give me the main event. I’ll read the entire rulebook aloud. If it bans dogs, everybody hears it. If it doesn’t, everybody hears that too.',
   replies:[
    {style:'believer',ask:'accept',text:'The next tour show is yours to close, good dog. Read every word.',reaction:'He starts at the publication date. Halfway through the year he stops himself. “Saving it.”'},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'Leave your place marked. Ask me again in four weeks.',reaction:'He reaches for the corner, then finds a clean bookmark. “I won’t bend it.”'},
    {ask:'decline',delta:-10,text:'I won’t give you the microphone for the book.',reaction:'He shuts it with his thumb still inside. “You can stop the reading. You can’t change the page.”'}
   ]},
  'the-long-read':{kind:'final',when:{},cue:'The week the reading is due, when he rehearses the whole book',
   invite:'practice read. i can sit for all the pages. can you?',
   line:'Do I read the blank page after the index? There could be a rule there somebody meant to write.',
   replies:[
    {style:'believer',text:'Hold it up and let everyone look. Then say “Good night” and close the book.',reaction:'He lifts the blank page high. It takes both hands to keep it still. “Good night, Bev.”'},
    {style:'straight',text:'Turn it toward the crowd. Let them see there’s nothing left to read.',reaction:'He counts to three with the page raised. “I’m good at leaving a space now.”'}
   ]}
 },memories:[{id:'bev-amendment',title:'The Pencil by Page 41',caption:'Week {week} · A sharpened pencil lay beside page forty-one.'}],
 endings:{
  best:{title:'The Unabridged Main Event',line:'The Dog holds his place with a thumb. “Bev waited all the way through the index. Then she clapped. I am a dog. She knew which part to clap for.”'},
  neutral:{title:'Entered into the Record',line:'The Dog grips the rulebook with both hands. “I read the words. I forgot to show them the blank page. I’m keeping it open if anybody wants to check.”'},
  bad:{title:'Still on Page Forty-One',line:'The Dog holds his place with a thumb. “I’m reading it in the yard. Bring a chair if you come. I’m still going to read the whole book.”'}
 }},
 10:{opens:{afterSpotlight:true},beats:SWEEPS_BEATS,memories:SWEEPS_MEMORIES,endings:SWEEPS_ENDINGS},
 1:{beats:{
  'first-hold':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, he wants an opponent for Hold One',
   plan:'2 Holds gives Hold One its full demonstration against a resisting opponent',
   line:'Hold One works better when the other man knows it is coming. I need a match. You may put the hold on the poster.',
   replies:[
    {style:'straight',text:'You have a match this week. I’ll put Hold One on the poster.',promise:'appearance',reaction:'He puts one finger on the blank poster. “Print it here. There’s no need for a second line.”'},
    {style:'bureaucrat',text:'Can you submit the grip in writing?',reaction:'He slides over a single sheet with a thumbprint in the middle. “That is where the thumb goes.”'},
    {breaks:true,text:'Nobody buys a ticket for a hold they’ve already seen.',reaction:'He points to the mat. “Stand there. I can remind you why they do.”'}
   ]},
  'hold-one-aloud':{kind:'beat',when:{minTrust:62},cue:'Once he lets the booker hear how he teaches Hold One',
   plan:'2 Holds explains Hold One, starting with where the feet go',
   line:'They keep asking what comes after Hold One. I have a four-word answer. Put your feet here. I might need a microphone.',
   replies:[
    {style:'straight',text:'You have the mic this week. Start with the feet.',promise:'promo',reaction:'He looks down at both boots. “Good. Most people start by asking about the hands.”'},
    {style:'believer',text:'Could the whole front row try the stance at once?',reaction:'“Yes. They should move their chairs first.” He moves yours to show you how.'},
    {breaks:true,text:'Use the time to show them something new.',reaction:'He puts both feet back where they were. “You saw the beginning. You missed the hold.”'}
   ]},
  'case-at-ringside':{kind:'beat',when:{minTrust:68},cue:'Once warm, he lets you carry the locked case toward the ring',
   plan:'2 Holds tests a clear route from the entrance to ringside with the locked briefcase',
   line:'Carry the case to ringside for me. No need to open it. I want to see if I can wrestle with it that close.',
   replies:[
    {style:'straight',text:'You have a match this week. I’ll put the case where you can see it.',promise:'appearance',reaction:'He leaves the handle in your palm. “If I look at it, wait. Looking isn’t asking.”'},
    {style:'bureaucrat',text:'I’ll record who has custody of it, start to finish.',reaction:'He hands you a pencil. “Write ‘closed’ beside both names.”'},
    {breaks:true,text:'Leave the case here. It’s getting in the way.',reaction:'He sets it behind his boots. “Yes. There’s a reason I put it there.”'}
   ]},
  'open-latch':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'Optional: after the ladder and a recent match, the briefcase latch gives way',
   invite:'Barn. Side door. Latch gave out. Do not bring a screwdriver.',
   memory:'open-latch',
   line:'The latch broke. You could lift the lid with one finger. I’m telling you that so I can turn around.',
   replies:[
    {style:'straight',text:'Turn around. I’ll hold it shut until you’re ready.',reaction:'He turns his back. A long while later he says, “That’s enough practice for today.”'},
    {style:'bureaucrat',text:'I’ll put a seal across it. You can decide when to break it.',reaction:'He puts a strip of wrist tape between you. “Sign across both ends.”'},
    {breaks:true,text:'We’ve waited long enough. I’m taking a look.',reaction:'His palm comes down on the lid. “You have seen the latch. That is all.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he offers one reveal; the next tour show is the intended stage',
   askPromise:{kind:'appearance',due:'event',plan:'2 Holds reveals Hold Number Two once. Leave the case shut until he calls for it.'},
   invite:'Barn. I am prepared to discuss when, briefly.',
   line:'I’ll use Hold Two once. Pick the show. Pick one they’ll remember without me ever having to do it again.',
   replies:[
    {style:'straight',ask:'accept',text:'The next tour show. You have a match, and you decide when to open it.',reaction:'He sets the case down. “All right. Before the bell, leave it where I can reach it.”'},
    {style:'hype',ask:'accept',askDue:0,cap:'neutral',text:'Tonight! I’ll add a match and tell the door crew there’s a surprise.',reaction:'His hand stays on the case. “Tonight is a show. It is not the show. You made me pick between that and never.”'},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'Give me four weeks to find the right show.',reaction:'He holds up four fingers. “That is a date I can count. I won’t pack the case until then.”'},
    {ask:'decline',delta:-10,text:'I won’t book a match for the reveal. The case stays shut.',reaction:'He lifts it by the handle. “Yes. I expect it will.”'}
   ]},
  'the-last-drill':{kind:'final',when:{},cue:'The week the tour match is due, he rehearses the approach without opening the case',
   invite:'Last drill. Barn. Watch the feet.',
   line:'When I reach for the case, they’ll all watch my hands. I want one person in the room to watch my feet.',
   replies:[
    {style:'straight',text:'I’ll watch your feet. You’ll know when you have enough room.',reaction:'He puts his left boot down first. “That’s the part nobody writes down.”'},
    {style:'believer',text:'I’ll watch both boots. Let everybody else watch the lock.',reaction:'“Good.” He takes the first step again, slower this time.'}
   ]}
 },memories:[{id:'open-latch',title:'The Open Latch',caption:'Week {week} · One finger could have opened the case.'}],
 endings:{
  best:{title:'The Second Hold',line:'2 Holds sets the case beside his boots. “That was Hold Two. You can tell them you were there. If they ask you to describe it, start with the feet.”'},
  neutral:{title:'Once Means Once',line:'2 Holds checks his footing. “I showed it once. I’ll remember which night it was. If they ask for an encore, tell them no.”'},
  bad:{title:'The Lock Stays Shut',line:'2 Holds sets the case beside his boots. “I went back to the barn. There’s plenty left to learn about Hold One.”'}
 }},
 18:{beats:{
  'sealed-favor':{kind:'beat',when:{minTrust:55},cue:'After tea, Charming asks you to grant a small favor without knowing the secret',
   plan:'Charming enters with a sealed thank-you note for his opponent',
   line:'Maddox has put a secret under your saucer. Leave it there. I would like to see what you’ll do for me before you know it.',
   replies:[
    {style:'bureaucrat',text:'One match this week. I’ll record that the envelope stayed sealed.',promise:'appearance',reaction:'He tops up your tea. “A favor with an audit trail. How very reassuring for both of us.”'},
    {style:'straight',text:'Tell me what you want first.',reaction:'“An opponent who thinks we’ve never met.” He turns your saucer a quarter turn.'},
    {breaks:true,text:'Take the envelope out from under my saucer.',reaction:'He lifts it with the sugar tongs. “Of course. I’ll be sure to find a drier place for it.”'}
   ]},
  'right-of-reply':{kind:'beat',when:{minTrust:62},cue:'Once he trusts you with his version of a public courtesy',
   plan:'Charming thanks his next opponent in advance, then gives them the right of reply',
   line:'I sent someone a thank-you note for a match we haven’t had. They called it a threat. Might I have the microphone to clarify?',
   replies:[
    {style:'bureaucrat',text:'You have the mic this week. State exactly what you’re thanking them for.',promise:'promo',reaction:'He takes out a shorter card. “For showing up. Nothing that could be used against me before the bell.”'},
    {style:'straight',text:'What will you say if they decline the thanks?',reaction:'“After you, of course. I am perfectly content to have the last word.”'},
    {breaks:true,text:'It was a threat. They read it right.',reaction:'He looks genuinely pleased until he notices you aren’t smiling. “Oh. You meant that as a criticism.”'}
   ]},
  'guest-of-honor':{kind:'beat',when:{minTrust:68},cue:'Once warm, he lets you inspect how he arranges a match',
   plan:'Charming offers his opponent the ceremonial first entrance and keeps the second for himself',
   line:'At tea I give my guest the nicest chair. It faces the wall. I wonder if you might indulge me in something similar at the ring.',
   replies:[
    {style:'bureaucrat',text:'You have a match. Their entrance first. I’ll write down exactly what I’ve agreed to.',promise:'appearance',reaction:'“How wise.” He moves your chair an inch. You can see the door now.'},
    {style:'believer',text:'Offer the nicer corner. See whether they take it.',reaction:'He considers both corners. “I believe I could make either one very inviting.”'},
    {breaks:true,text:'I’m not arranging the card around your seating plan.',reaction:'“I would never ask you to.” He slides the seating plan back under your cup.'}
   ]},
  'empty-place':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After the ladder and a recent match, a guest leaves their invitation unanswered',
   invite:'Tea, if you please. A guest has declined without giving me anything to work with.',
   memory:'empty-place',
   line:'A guest returned my invitation unopened. I find that exquisitely rude. And, from a tactical standpoint, very difficult to improve upon.',
   replies:[
    {style:'bureaucrat',text:'Mark it declined. Leave the place open and see who asks for it.',reaction:'He leaves the cup on its saucer. “The next guest will think it was their idea.”'},
    {style:'straight',text:'What if you asked them to a match instead of tea?',reaction:'“Without tea?” He thinks it over. “You do know how to make a threat.”'},
    {breaks:true,text:'Maybe they simply don’t want to sit with you.',reaction:'“Very sensible.” He slips a blank invitation into your coat pocket on your way out.'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, Charming asks to choose his own opponent at the next tour show',
   askPromise:{kind:'appearance',due:'event',plan:'Charming chooses his opponent and lays a place for them at ringside'},
   invite:'Please bring the next tour card to tea. I require precisely one blank space.',
   line:'One match at the next tour show. Let me choose who sits opposite me. You may decide how much of my handwriting goes on the poster.',
   replies:[
    {style:'bureaucrat',ask:'accept',text:'You have the match and one opponent of your choosing. The rest of the card stays with me.',reaction:'“I do adore a narrow grant of power.” He signs with a pen he brought for exactly this.'},
    {style:'straight',ask:'defer',delta:-2,text:'Keep your suggestion sealed. Bring it back in four weeks.',reaction:'He runs a finger along the envelope. “I shall try not to give them a reason to decline in the meantime.”'},
    {ask:'decline',delta:-10,text:'I won’t book a match on those terms. Keep your invitation.',reaction:'“Of course.” He takes away your empty plate before you can reach for another biscuit.'}
   ]},
  'the-place-card':{kind:'final',when:{},cue:'The week his match is due, he offers to sign his own work',
   invite:'One last detail before the match. Do bring your best pen.',
   line:'Whose name goes at the bottom of the invitation? If it’s mine, the guest will know whom to thank. If it’s yours, so will I.',
   replies:[
    {style:'bureaucrat',text:'Sign your own invitation. Let them know who offered the chair.',reaction:'He signs slowly enough to make it quite legible. “Thank you for letting me take credit in advance.”'},
    {style:'straight',text:'Set both names on the table. I booked it. You asked for it.',reaction:'He sets down a second card. “What an unusually honest little conspiracy.”'}
   ]}
 },memories:[{id:'empty-place',title:'A Place Left Open',caption:'Week {week} · The best chair was empty at four.'}],
 endings:{
  best:{title:'By Personal Invitation',line:'Charming squares the envelope on its saucer. “My guest asked who arranged the match. I said I did. If you’d care to try another small experiment, I have plenty of stationery.”'},
  neutral:{title:'A Table for Two',line:'Charming sets down his cup. “You gave me a match. I’ll send a thank-you, of course. Next time do stay long enough to see where I put the chairs.”'},
  bad:{title:'Kind Regards',line:'Charming squares the envelope on its saucer. “I’ve sent your invitation back unopened. I understand it is a devastatingly effective discourtesy.”'}
 }},
 20:{beats:{
  'one-heart':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, he needs somewhere to try a small gesture',
   plan:'The Grinch uses the microphone to offer one heart to the crowd, with no pursuit if they leave it',
   line:'I made Lemon Tart a wreath so big she had to go around it. I’m trying one paper heart. Look. It doesn’t block a door.',
   replies:[
    {style:'hype',text:'Give that one heart a microphone this week! Offer it to the room and let somebody come to you.',promise:'promo',reaction:'He sets the heart in his palm. “One heart. One offer. I can shout the offer once, right?”'},
    {style:'straight',text:'Put it on the table where someone can choose to take it.',reaction:'He moves it to the edge, then back to the middle. “I can leave it right there.”'},
    {breaks:true,text:'Put the scissors away. The hearts aren’t helping.',reaction:'He finishes one corner with his thumbnail. “This one needed finishing whether it helped or not.”'}
   ]},
  'own-corner':{kind:'beat',when:{minTrust:62},cue:'Once friendly, he practices keeping the grand gesture on his side of the ring',
   plan:'The Grinch wrestles with a paper heart in his own corner and keeps the opposite corner clear',
   line:'Lemon Tart says her corner is her corner. Fair! Can I get a match to practice having a tremendous amount of feeling on my own side?',
   replies:[
    {style:'hype',text:'You have a match this week. Decorate your corner like it’s the whole Moose Lodge!',promise:'appearance',reaction:'He stretches a ribbon between two fingers. “It stops at my post. I’ve measured.”'},
    {style:'believer',text:'Hang one heart inside your corner and let it be enough.',reaction:'He lifts the smallest one. “I could love this little thing a whole lot.”'},
    {breaks:true,text:'Keep the decorations out of the building.',reaction:'He folds the ribbon around his wrist. “Then I’ll have to keep it on me.”'}
   ]},
  'no-means-no':{kind:'beat',when:{minTrust:68},cue:'Once warm, he practices hearing Lemon Tart’s answer without rewriting it',
   plan:'The Grinch publicly invites a partner and tells the crowd that an invitation can be declined',
   line:'She said no to dinner. I almost asked whether she meant lunch. I’d like to say something nice in public and stop at the period.',
   replies:[
    {style:'hype',text:'The mic is yours this week. Make one big invitation to tag. Tell the back row it’s fine to pass.',promise:'promo',reaction:'He writes YOU CAN PASS in letters as big as the invitation. He puts a period after both.'},
    {style:'straight',text:'Thank her in private for telling you plainly. Then stop.',reaction:'He tries it. The silence lasts so long he starts to smile.'},
    {breaks:true,text:'She doesn’t like you. There’s nothing to celebrate.',reaction:'He smooths a fold in the paper. “She knew what she wanted. That’s something.”'}
   ]},
  'returned-heart':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After the ladder, the week after he worked, one heart comes back',
   invite:'Moose Lodge. One heart returned. Please bring the blunt scissors.',
   memory:'returned-heart',
   line:'She sent one back with “too much” written on it. I was halfway to making a bigger one before I read the words again.',
   replies:[
    {style:'hype',text:'Make a huge return slot. Let the hearts come back without a single question!',reaction:'He cuts a slot in the lockbox lid. “It fits! Look. I can put the box by the door and leave them to it.”'},
    {style:'believer',text:'Put it somewhere safe. She already told you what she wants.',reaction:'He gives the heart its own drawer. “No glitter in this one. I think I know why now.”'},
    {breaks:true,text:'It’s construction paper. Throw it out.',reaction:'He slides it in his pocket. “I’ll take care of my own paper, thanks.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he asks for a mixed tag on Lemon Tart’s terms',
   askPromise:{kind:'team',due:'event',target:23,plan:'Grinch and Lemon Tart: mixed tag, hearts in his corner only; no romance required from his partner'},
   invite:'MIXED TAG QUESTION. She said absolutely not to the ribbons. I put those away.',
   line:'Lemon Tart says she’ll take the tag if I keep the hearts in my corner. She said “tag partner” twice so I’d hear it both times. Can we book that?',
   replies:[
    {style:'hype',ask:'accept',text:'You two get the next tour show. Make the biggest gesture in wrestling: be a really good partner.',reaction:'He grips the tag rope with both hands. “I can be there when she reaches. I can do that part.”'},
    {style:'believer',ask:'defer',delta:-2,text:'Give her room. Come back in four weeks if the tag still makes sense.',reaction:'He pins the date to his own side of the board. “Her side stays blank until she puts something there.”'},
    {ask:'decline',delta:-10,text:'I won’t book the two of you together. Let this one go.',reaction:'He carefully unties a pair of paper hearts. “I can leave hers alone. I’m keeping mine.”'}
   ]},
  'wait-for-the-tag':{kind:'final',when:{},cue:'The week the mixed tag is due, he practices waiting for Lemon Tart to reach first',
   invite:'DRESS REHEARSAL. Just me and a tag rope. Lemon Tart says that is plenty.',
   line:'I keep picturing her reaching for my hand. What if she doesn’t? I don’t want to grab it and call it a tag.',
   replies:[
    {style:'hype',text:'Hold your corner! If she reaches, take the tag. If she doesn’t, cheer her on from there.',reaction:'He holds the rope so hard it shakes. “I can cheer through all of that.”'},
    {style:'straight',text:'Wait for her hand. She knows how to ask when she needs you.',reaction:'He opens his hand and leaves it out. “Oh. This part is harder than all the glitter.”'}
   ]}
 },memories:[{id:'returned-heart',title:'The Heart That Came Back',caption:'Week {week} · One paper heart made its way back.'}],
 endings:{
  best:{title:'She Asked for the Tag',line:'The Grinch sets the scissors down. “She told me ‘good tag’ and then ‘don’t make it weird.’ I wrote down both parts. Best note I got all year.”'},
  neutral:{title:'One Shared Corner',line:'The Grinch smooths a paper heart. “We got our match. She asked for the tape, so I gave her the tape. I’m learning to stop where the sentence ends.”'},
  bad:{title:'Her Heart to Keep',line:'The Grinch sets the scissors down. “Her heart’s hers. Mine’s in the craft room if it wants to make somebody a card again.”'}
 }},
 31:{beats:{
  'equal-corners':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, Ron files for an equal opportunity',
   plan:'Ron opens a match by measuring both corners and recording any difference',
   line:'The red corner gets the good chair. The blue corner has better light. I require a match to determine whether they cancel out.',
   replies:[
    {style:'bureaucrat',text:'Match approved for this week. Submit measurements from both corners.',promise:'appearance',reaction:'He opens his folder from the middle. “I have allowed exactly the same amount of paper for each finding.”'},
    {style:'straight',text:'What would make them equal?',reaction:'“One chair in the middle.” He makes a note. “Then we’d need a rule about who sits.”'},
    {breaks:true,text:'Just pick the corner you like.',reaction:'He draws a line through the word like. “Please use ‘was assigned.’”'}
   ]},
  'minutes-from-the-back':{kind:'beat',when:{minTrust:62},cue:'Once friendly, Ron wants to hear from the back row on the record',
   plan:'Ron reads minutes from both ends of the hall and takes comment from the back row',
   line:'The front row voted to keep its seats. The back row couldn’t hear the question. I have two sets of minutes and one microphone request.',
   replies:[
    {style:'bureaucrat',text:'Microphone approved this week. Read the back row’s minutes first to correct the notice.',promise:'promo',reaction:'He switches two tabs in his binder. “A reversal in the interest of equal notice. I can defend that.”'},
    {style:'believer',text:'Take the microphone to the back row and ask them what they heard.',reaction:'“I will walk it there myself.” He measures the cable with his eyes.'},
    {breaks:true,text:'They paid for the back row. What did they expect?',reaction:'He adds an item to the minutes. “That is an opinion. I’ll give them a chance to respond.”'}
   ]},
  'one-signature':{kind:'beat',when:{minTrust:68},cue:'Once warm, Ron tries putting his name on one position',
   plan:'Ron wrestles in a match he requested and signs his name to the request',
   line:'I’ve signed a motion to wrestle. In previous motions I proposed that wrestling occur in general. This one names me. It feels improperly specific.',
   replies:[
    {style:'bureaucrat',text:'Motion carried. You’re in a match this week. Your name stays on it.',promise:'appearance',reaction:'He makes a copy and hands you the original. “I’ll have to get used to reading that.”'},
    {style:'straight',text:'Did anybody else make you sign it?',reaction:'“No.” He turns the signature toward himself. “I’m recording that separately.”'},
    {breaks:true,text:'So all this time you wanted to get booked.',reaction:'He brings the folder to his chest. “All this time I reserved the right to ask.”'}
   ]},
  'listening-tour':{kind:'flag',when:{minTrust:70},cue:'After the ladder, once warm, Fox Valley invites Ron and Terrible Towel to listen',
   invite:'NOTICE: Fox Valley has submitted an invitation. You may submit a response in Room B.',
   memory:'listening-tour',
   line:'Fox Valley offered me a listening tour and Terrible Towel a room where nobody waves back. They called both offers unconditional. Where are their conditions?',
   replies:[
    {style:'bureaucrat',text:'Give me their agenda. We’ll publish ours first, with open comment, amendments, and the same deadline for everyone.',reaction:'He counts the provisions on his fingers. “Four procedural protections. They offered refreshments. I think you may have them.”'},
    {style:'straight',text:'Ask what they expect you to do after listening.',reaction:'He underlines after. “That is precisely the word missing from the itinerary.”'},
    {breaks:true,text:'Tell them you’re on our side. End of tour.',reaction:'He opens a fresh folder. “I will enter that under evidence that a listening tour is necessary.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, Ron requests a televised hearing and intends to declare allegiance',
   askPromise:{kind:'promo',due:'event',plan:'Televise Ron’s Neutrality Hearing: both sides on the record, then his declaration'},
   invite:'SPECIAL SESSION. I intend to move something without first suggesting that it stay where it is.',
   line:'Give me a televised Neutrality Hearing. Let both sides speak. Then I’ll say which promotion I stand with, where there’s a camera to hold me to it.',
   replies:[
    {style:'bureaucrat',ask:'accept',text:'Hearing approved for the next tour show. We’ll put a camera on the chair for your declaration.',reaction:'He initials the agenda. “At last, a record I can’t amend by turning it over.”'},
    {style:'straight',ask:'defer',delta:-2,text:'Keep it on the agenda. Bring it back in four weeks.',reaction:'He leaves the line for his name filled in. “Pending is a position I know how to occupy.”'},
    {ask:'decline',delta:-10,text:'I won’t give the hearing a segment. Close the record.',reaction:'“Here, certainly.” He closes one folder and leaves the Fox Valley envelope on the table.'}
   ]},
  'on-the-record':{kind:'final',when:{},cue:'The week the hearing is due, Ron practices a declaration in front of the camera',
   invite:'Camera test. Could you ask where I stand and leave the camera running?',
   line:'I can say “this promotion.” Afterward I might say “for the duration of the hearing.” Would you object before I get to that part?',
   replies:[
    {style:'bureaucrat',text:'Point of order. The record closes after “this promotion.” Any qualification requires a new motion.',reaction:'He tries the sentence without the qualification. It takes less time than clicking his pen.'},
    {style:'straight',text:'Look at the lens. Say where you’ll be when the next bell rings.',reaction:'He looks straight at it. “Here.” He waits for himself to add something. Nothing comes.'}
   ]}
 },memories:[{id:'listening-tour',title:'Both Invitations on the Table',caption:'Week {week} · Ron counted the pages in Fox Valley’s offer twice.'}],
 endings:{
  best:{title:'On Behalf of No One in Particular',line:'Ron clicks his pen once. “I chose this promotion on the record. Any belt I hold shall be held on behalf of no one in particular.”'},
  neutral:{title:'Neutral in Perpetuity',line:'Ron keeps the minutes open. “I entered my declaration: neutral in perpetuity. They asked how long that lasts. I said I was unable to take a position on the duration.”'},
  bad:{title:'Independent Observer',line:'Ron clicks his pen once. “Fox Valley reserved a seat for me as an independent observer. The seat next to it remains available to the other side.”'}
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
