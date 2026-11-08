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
