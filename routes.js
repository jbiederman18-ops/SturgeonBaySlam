'use strict';
// Relationship dialogue and route data. No logic lives here: relationships.js reads it.
// Owned by the dialogue writer. Shape and rules: the FORMAT comment below; writing guide in docs/design/.
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
//   beat = {kind?, when?, cue, invite?, day?, memory?, plan?, tell?, line, replies}
//     cue     plain English for writers: when this should happen. The engine reads `when`.
//     invite  text that arrives instead of the usual invitation.
//     tell    scene-specific opening narration, in place of the usual mood or affection tell.
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
  tells:{wary:"Greek holds up two fingers to frame the doorway, then asks you to move half a step.",friendly:"He leaves you a seat with a clear view of the ring and the front row.",warm:"He turns the notebook around so you can see his sketches of the crowd.",devoted:"He introduces you as the mortal who got all of Greece to look his way."},
  moods:{
   low:{style:'believer',tell:"Greek keeps coming back to a sketch of the losing corner. His laurel is lying beside it."},
   high:{style:'hype',tell:"Greek has drawn a cheering crowd around the name GREEK POLANSKI. He’s run out of room for the ring."}
  },distrusts:'bureaucrat',
  stale:"You keep promising me glory, mortal. Tell me what you saw when the bell rang.",
  heard:"{name} told me what you said. If you have notes on the picture, bring them to me yourself.",
  invite:{wary:"Greek is working on a picture about Greco Wrestling. Visitors may stand where they won’t cast a shadow.",friendly:"Come look at the wrestling picture with Greek. He saved you the good chair.",warm:"Bring your notes, mortal. The picture needs someone who’s seen me from the cheap seats."},
  signoff:{wary:"Mind the laurel, mortal. It has to look the same in the next scene.",friendly:"If Athens asks what you saw, tell them it’s still in research.",warm:"Come back tomorrow. I want to hear what you remember without the notebook.",devoted:"When all Greece sees this picture, your name goes right after mine."},
  sore:"If you’ve come to laugh at my picture again, mortal, you can wait outside Olympus.",
  reacts:{kept:"Greek writes your name in the margin under PEOPLE WHO GET THINGS DONE.",broken:"Greek crosses out the date in his notebook. The page underneath tears too."},
  jealous:"Greek folds the corner of a blank page. “{name} gets a whole evening and my wrestling picture is still waiting for you?”",
  backstage:{
   won:{tell:"Greek is drawing the crowd as it looked from the ring, with his own name in the biggest letters.",
    line:"“They shouted my name when the bell rang. I can put that in the picture now. I know what it feels like.”",
    replies:[
     {style:'believer',text:"Write down what you heard before they started cheering.",reaction:"He stops drawing. “For a moment I could hear the referee breathe.”"},
     {style:'hype',promise:'promo',text:"You have the mic next week. Tell Greece what it felt like to win.",reaction:"He lifts his laurel. “I’ll start with the silence. Then I’ll give them the whole city.”"},
     {truth:true,text:"Write down what the other wrestler heard, too. Only one of you got cheered.",reaction:"He turns the page. “The other corner. I’ll need to look at that.”"}
    ]},
   lost:{tell:"Greek is staring at a sketch of the ceiling, drawn from flat on his back.",
    line:"“When {name} won, I stayed where I was a moment. The crowd sounds miles away when you’ve just lost, mortal.”",
    replies:[
     {style:'believer',text:"Put that in the picture. It’ll sound different when it comes from someone who’s felt it.",reaction:"He draws a tiny figure on the canvas. “No music here. Let them hear the room.”"},
     {style:'hype',promise:'rematch',text:"You and {name} next week. Give Greece a second chapter.",reaction:"He turns the page. “A sequel before I’ve made peace with the ending. Very well.”"},
     {truth:true,text:"{name} earned that ending. Give them their moment in the picture, too.",reaction:"He makes a little space in the sketch. “Very well. A wide shot.”"}
    ]},
   stole:{tell:"Greek keeps looking back at the seats, where a few people are still talking about the match.",
    line:"“They’re still talking about our match. Mortal, when did you first feel you couldn’t look away?”",
    replies:[
     {style:'believer',text:"Ask your opponent. I bet they felt the crowd turn before either of us did.",reaction:"He writes down a second name. “Two witnesses. Athens can hear both.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He looks back at the seats. “They stayed with me even when I lost. I ought to ask why.”"}]},
     {style:'hype',text:"If they’re still talking, the next Greco Wrestling match already has an audience.",reaction:"He tests the announcement at full volume. “Athens, there is more to come!”"},
     {style:'straight',text:"There was a moment when everyone stopped talking at once. Start there.",reaction:"He holds the pencil still. “Yes. Let the audience go quiet before the bell.”"}
    ]},
   flat:{tell:"Greek folds his notes away and counts the empty seats in the front row.",
    line:"“I had the whole scene planned. Then someone opened a bag of nachos and half of Athens looked over.”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Give them somebody to root for as soon as the bell rings.",reaction:"He tears a page out. “Then we can lose the opening speech.”"},
     {style:'believer',text:"What did you want them to feel before they looked away?",reaction:"He sits in the front row. “I wanted them to think I might actually lose.”"},
     {truth:true,text:"You told them why it mattered. Next time, give them a reason to care before you explain it.",reaction:"He looks at the crossed-out page. “Let the scene make the argument. Fine.”"}
    ]},
   kept:{tell:"Greek puts a tick next to tonight’s date in his research notebook.",
    line:"“You promised me {promise} and came through. I have a page for the picture I couldn’t have written yesterday.”",
    replies:[
     {style:'believer',text:"What did you find out tonight?",reaction:"He flips the notebook open. “It started before they said my name.”"},
     {style:'hype',text:"Tell Athens what you came away with. They’re already part of the story.",reaction:"He looks toward the seats. “Shall I thank them individually? Some will insist.”"}
    ]},
   broken:{tell:"Greek shows you a page with tonight’s date at the top and nothing beneath it.",
    line:"“You promised me {promise}. I planned tonight’s research around it, and now I have a blank page.”",
    replies:[
     {style:'believer',text:"I broke my word. Tell me what you hoped to see before I promise anything else.",reaction:"He leaves the notebook open. “I wanted a night I could write from memory.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. Put that date in the notebook.",reaction:"He writes it in pencil. “I’ll use ink when I hear the bell.”"},
     {breaks:true,text:"Wait for the printed card before you plan around a slot next time.",reaction:"He shuts the notebook. “Then perhaps I should ask the poster for a promise.”"}
    ]},
   benched:{tell:"Greek stands under the poster with notes from the seats tucked under his laurel.",
    line:"“{name} made the card. I can watch from the seats, mortal, but I can’t write what it feels like to be up there.”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Let’s see what it looks like with you in the middle of it.",reaction:"He puts the notebook away. “From the middle. At last.”"},
     {style:'believer',text:"What did you see from the seats that you’d miss from inside the ring?",reaction:"He opens the notebook. “The losing corner always has one person still standing.”"},
     {truth:true,text:"You can use tonight in the picture even if you aren’t the one the crowd came to see.",reaction:"He looks up at the poster. “An exasperating idea. What did they shout for?”"}
    ]},
   idle:{tell:"Greek has drawn the same entrance on four different pages of his notebook.",
    line:"“Weeks without a match, mortal. I’ve written my entrance four ways. I can’t remember how it feels to make one.”",
    replies:[
     {style:'hype',promise:'appearance',text:"You’re wrestling next week. Pay attention when they call your name.",reaction:"He puts his laurel on. “Then we begin in the dark, just before they say it.”"},
     {style:'believer',text:"What do you remember about waiting for the call?",reaction:"He glances back at the hall. “Every noise sounds like the door opening.”"},
     {style:'straight',text:"Give me the dates you can wrestle. I can look for a place on the card.",reaction:"He counts them on his fingers. “Any Saturday. The rest of Athens can wait.”"}
    ]},
   cutIn:{tell:"Greek steps closer with his notebook open. He’s already written down the last few words.",
    line:"“You’ve heard {name}. Before Athens repeats that version, mortal, I have something to add.”",
    replies:[
     {style:'hype',text:"Give me the moment you’d put in the picture.",reaction:"He turns the notebook toward you. “The bell. Everything that came before goes quiet.”",cases:[{when:{wonTonight:true},morale:2,reaction:"He straightens his laurel. “I’ll start with the win. The noise came a heartbeat later.”"}]},
     {style:'believer',text:"You can keep both versions in your notes. They saw it from a different corner.",reaction:"He leaves a space on the page. “Very well. We’ll see what it looks like from there.”"},
     {style:'straight',text:"One conversation at a time. You’ll each get a turn.",reaction:"He caps his pen. “Very well. Nobody move while I’m waiting.”"}
    ]},
   skip:"Greek passes without stopping, the notebook tucked beneath his arm. He moves it to the side you aren’t on."
  },
  epilogue:{
   best:{title:"A Name All Greece Knows",line:"Greek taps his notebook. “They shout my name before the bell now. I used to wonder what that sounded like from the ring.”"},
   neutral:{title:"Still in Research",line:"Greek opens to a fresh page. “I have an entrance and half an ending. Fortunately, Athens puts on another show Saturday.”"},
   bad:{title:"An Empty Seat in Athens",line:"Greek looks back at the empty ring. “A man can learn a great deal from the seats, mortal. I had rather hoped to learn the rest in there.”"}
  },
  scenes:[
   {line:"Liam kicked me in the head once. Give me the mic this week, mortal. I want to ask Liam for a match and hear what Athens thinks of it.",replies:[
    {style:'hype',text:"Take the mic this week. Tell Liam and the crowd what you want.",promise:'promo',reaction:"He lifts his laurel. “Greco Wrestling, before all of Athens. Let him answer that.”",
     cases:[{when:{lostLastShow:true},delta:-2,reaction:"He lowers the laurel. “They just saw me lose, mortal. I’d rather find out what they saw than give them a speech.”"}]},
    {style:'believer',text:"If he agrees, give yourself a moment to notice how it feels when you finally see him across the ring.",reaction:"He opens the notebook. “Before the bell. That’s where the scene starts.”"},
    {breaks:true,text:"Let me see if the match can happen before you start writing about it.",reaction:"He closes the notebook. “Very well. Athens can wait for your permission.”"}]},
   {line:"I asked Ron if Greco Wrestling was the greatest style in Greece. He said he was neutral. Give me the mic and I’ll put the question to Athens.",replies:[
    {style:'hype',text:"Take the mic this week. Ask Athens the same question.",promise:'promo',reaction:"He spreads his arms. “A chorus, then. One louder than Ron.”"},
    {style:'believer',text:"Ron won’t endorse anyone. Ask him what he saw instead.",sides:{31:2},reaction:"Greek considers this. “A witness who won’t applaud on command. I suppose I need one.”"},
    {breaks:true,text:"Let Ron abstain. I need both of you ready before doors.",reaction:"He puts his pencil down. “Then I’ll leave his line blank.”"}]},
   {line:"Joan brought me this scarf. Is it the ceremonial belt of her city-state? I could put it in the picture if she tells me what it means.",replies:[
    {style:'hype',text:"Thank Joan in front of the crowd and let her present it herself.",reaction:"“An ambassador!” He holds the scarf aloft. “She should enter first.”"},
    {style:'believer',text:"Ask Joan how she got it. There may be a story in that.",reaction:"He uncaps his pen. “Good. Leave me room for her exact words.”"},
    {breaks:true,text:"Put it at the ticket table. We can ask her about it later.",reaction:"He gathers it up. “I won’t leave a diplomatic offering beside the change.”"}]},
   {line:"My opponent climbed the ropes. We stay on the ground in Greco Wrestling. Is he trying to wrestle or get a better view?",replies:[
    {style:'hype',text:"You have a match this week. Give the crowd a scene they can see from the ground.",promise:'appearance',reaction:"He sketches the ring from the front row. “Splendid. Greece can keep both feet on the earth.”"},
    {style:'believer',text:"Ask him what he could see from up there. You can use his view in the picture.",reaction:"He turns the notebook sideways. “Athens from above. I hadn’t thought of that.”"},
    {truth:true,text:"Leave the climbing to him. You’ll have a hard time taking notes if you fall.",reaction:"He looks up at the top rope. “Very well. I’ll leave that angle to the birds.”"}]},
   {line:"Liam left a wooden sword at my door. The man kicks me in the head, then sends me props. What scene does he think we’re in?",replies:[
    {style:'hype',text:"Give it back in front of everyone. Tell him you want Greco Wrestling, and that means leaving the sword outside.",sides:{34:-3},reaction:"He holds it by the handle. “Athens can watch him try to explain this.”",
     cases:[{when:{wonLastShow:true},delta:3,reaction:"He sets it down. “Athens has already seen me win. I can ask him what he meant in private.”",sides:{}}]},
    {style:'believer',text:"Ask him why he sent it before you decide what it means.",reaction:"He opens the door a little. “He can explain from beyond kicking distance.”"},
    {breaks:true,text:"Put it away until you have a match. I’m trying to finish the card.",reaction:"He sets it against the wall. “Fine. If it’s important, the sword will turn up again.”"}]}
  ]},
 1:{speaker:'2 Holds',style:'straight',place:'The training barn',
  tells:{wary:'He runs Hold One, Hold Two, then Hold One again without looking up.',friendly:'He lets you count the repetitions aloud. The count always stops at two.',warm:'He asks you to mark exactly where Hold Two gives way to Hold One.',devoted:'He hands you the open practice book and asks which of the two holds needs another hundred repetitions.'},
  moods:{
   low:{style:'believer',tell:"He has drawn two grip diagrams and keeps returning to the same gap between the fingers."},
   high:{style:'straight',tell:"He marks a tiny correction beside Hold One, then prepares a clean page for Hold Two."}
  },distrusts:'hype',
  stale:"I practice the same two holds every day; your answer is somehow making less progress.",
  heard:"{name} repeated your explanation; it did not establish whether that was Hold One or Hold Two.",
  invite:{wary:"The practice light is on. Hold One has just become Hold Two.",friendly:'Practicing both holds tonight. You may count.',warm:"Seven. Hold One, then Hold Two. Bring water; mastery takes time."},
  signoff:{wary:'That was Hold Two. We start again at One.',friendly:'Hold One, Hold Two. Never anything else.',warm:'Next time, watch how the two holds meet.',devoted:"Both holds require further practice. You may observe again."},
  sore:'You tried to hurry me along. I remember. Hold One does not hurry.',
  reacts:{kept:'2 Holds gives you one firm nod, from the proper stance.',broken:'2 Holds crosses out the scheduled match and writes BOTH HOLDS beside the next drill.'},
  jealous:"2 Holds resets his grip. “An evening with {name}, and still no useful account of either hold?”",
  backstage:{
   won:{tell:"2 Holds measures the space between his heels against his notes.",
    line:"“Hold Two won after Hold One set the grip. Tomorrow we start again with Hold One.”",
    replies:[
     {style:'straight',text:"The far heel stayed planted when the weight shifted.",reaction:"He marks the page. “That correction is confirmed.”"},
     {style:'believer',text:"Use my wrist. Let me feel the difference you are working toward.",reaction:"He takes the grip. “Half a millimeter; it matters.”"},
     {style:'hype',promise:'promo',text:"Take the mic next week. Show them what changed.",reaction:"He turns the practice book around. “They will need an unobstructed view of both grips.”"}
    ]},
   lost:{tell:"2 Holds traces the gap in his Hold One diagram.",
    line:"“My opponent slipped out of Hold One. My grip needs work.”",
    replies:[
     {style:'believer',text:"The hold is still worth mastering. Find the gap again.",reaction:"He positions your wrist. “Yes; the discipline remains exactly two holds.”"},
     {style:'straight',promise:'rematch',text:"You and {name} next week. Test against the same resistance.",reaction:"He marks one variable. “A useful repeat.”"},
     {truth:true,text:"The grip failed in the transition. Switching back faster won’t fix the gap.",reaction:"He stops halfway through resetting. “Again, then. Slowly enough to see it.”"}
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
     {breaks:true,text:"Shorten the demonstration. People had rides waiting.",reaction:"He checks the stopwatch. “Then state the time limit before I begin explaining both holds.”"}
    ]},
   kept:{tell:"2 Holds ticks your promise beside a Hold One practice entry.",
    line:"“You delivered {promise}; both holds can now be practiced on a reliable schedule.”",
    replies:[
     {style:'straight',text:"We both checked the commitment against what happened.",reaction:"He nods. “A repeatable standard.”"},
     {style:'believer',text:"Keep the record. You earned the time to do the work.",reaction:"He returns to the grip. “Time is how the hold improves.”"}
    ]},
   broken:{tell:"2 Holds leaves an empty practice line facing you, beneath a column for each hold.",
    line:"“I was ready for {promise}. It never happened. Both holds are still ready.”",
    replies:[
     {style:'straight',text:"Leave the time blank. I missed the commitment.",reaction:"He underlines the gap. “Accurate. Unsatisfactory, but accurate.”"},
     {style:'believer',promise:'appearance',text:"You have a match next week. Make me earn the next tick.",reaction:"He draws a second box. “The first remains empty.”"},
     {breaks:true,text:"Record it as a card change. The crew needs one explanation.",reaction:"He closes the notebook. “Neither hold was improved by that explanation.”"}
    ]},
   benched:{tell:"2 Holds plants his feet on a parking stripe and runs the transition against thin air.",
    line:"“{name} worked tonight. I counted six attempts at Hold One and not a single decent Hold Two.”",
    replies:[
     {style:'straight',text:"Show me how you would answer what you saw. Start with the grip.",reaction:"He sets his feet. “Hold One was incomplete. Stand here.”"},
     {style:'believer',text:"Your two holds are worth the work. Demonstrate the part you would test.",reaction:"He offers his wrist. “Pressure here; now resist.”"},
     {truth:true,text:"Judging every other booking will not improve either of your holds.",reaction:"He puts both hands back in position. “Practice would be a better use of the evening.”"}
    ]},
   idle:{tell:"2 Holds has filled both sides of a page headed ONE and TWO.",
    line:"“Four weeks of refinement; I require an opponent who does not already know where I am placing the thumb.”",
    replies:[
     {style:'straight',promise:'appearance',text:"You have a match next week. Test the corrections there.",reaction:"He closes the notebook. “Same two holds, improved conditions.”"},
     {style:'believer',text:"Show me the change you are most certain about.",reaction:"He settles into the grip. “Certain enough to invite resistance.”"}
    ]},
   cutIn:{tell:"2 Holds starts to switch grips, then stops to point at a gap between his hands.",
    line:"“{name} rolled out of Hold One. I left a gap. That makes it a bad Hold One.”",
    replies:[
     {style:'straight',text:"When the grip opens, start it again. You can test where it failed.",reaction:"He makes a visible gap. “An unfinished Hold One. Exactly.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He resets both hands. “After a loss, I start with Hold One. Here’s where I’ll start tonight.”"}]},
     {style:'believer',text:"Ask where the pressure stopped. You do not need a new name to learn that.",reaction:"He offers the grip. “A precise question. Answer it slowly.”"},
     {style:'bureaucrat',text:"Save the debate for practice. The referee only needs to know when the grip is broken.",reaction:"He marks the spot with his thumb. “Both holds will attend.”"}
    ]},
   skip:'2 Holds walks past without breaking the rhythm. One grip, two grips, and back to one.'
  },
  epilogue:{
   best:{title:'A Grip You Can Trust',line:"2 Holds adjusts his thumb. “You noticed the correction. Both holds have benefited from your attention.”"},
   neutral:{title:'One, Two, Repeat',line:"2 Holds opens his notes. “Hold One at seven, Hold Two afterward. Mastery is not a seasonal arrangement.”"},
   bad:{title:'No Further Demonstrations',line:"2 Holds closes the practice door. “No audience tonight. Both holds still require work.”"}
  },
  scenes:[
   {line:"Hour three of Hold One; the thumb has moved half a millimeter, so we are making excellent progress.",replies:[
    {style:'straight',text:"I see it. Keep the wrist in the same position while you test the change.",reaction:"He nods. “One variable; one hold.”",
     cases:[{when:{lostLastShow:true},delta:1,reaction:"He adjusts the thumb. “That is where Saturday went wrong. Still Hold One.”"}]},
    {style:'believer',text:"The hold is worth the work. Use my wrist for the next attempt.",reaction:"He sets the grip carefully. “Resistance improves Hold One.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He resets his heel. “Push harder than Saturday’s opponent; the hold can improve further.”"}]},
    {breaks:true,text:"One more minute, then finish. Someone needs to lock up.",reaction:"He releases the grip. “Mastery will resume before the next locking-up.”"}]},
   {line:"Someone at the shop called Hold One a handshake. I’d like a match this week. A resisting hand should clarify the distinction.",replies:[
    {style:'straight',text:"Test the grip in a match this week. You have a spot.",promise:'appearance',reaction:"He nods. “A controlled examination of Hold One.”"},
    {style:'believer',text:"He may not understand your terminology. Show him where the pressure goes.",reaction:"He positions his thumb. “An incomplete Hold One, then; a common problem.”"},
    {breaks:true,text:"Shake his hand and move on. Not every conversation needs a demonstration.",reaction:"He studies the offered hand. “It needs the correct name, at minimum.”"}]},
   {line:"The clock stole six minutes from Hold Two; I have repeated them, although my hand is now refusing to complete Hold One.",replies:[
    {style:'straight',text:"Reset the clock at the end of this round. Keep one time from there.",reaction:"He checks the dial. “Two holds; one clock. Sufficient.”"},
    {style:'believer',text:"You know how long you practiced. The clock can catch up afterward.",reaction:"He flexes his fingers. “The hands are the primary record.”"},
    {truth:true,text:"Your hand will not close. Stop for tonight; forcing the grip is making tomorrow’s practice harder.",reaction:"He reaches for the ice. “Recovery supports both holds. Tomorrow, from the beginning.”"}]},
   {line:"The Dog rolled out of Hold One. The Dog calls that an escape. I call that my thumb being half a millimeter out.",replies:[
    {style:'straight',text:"You have a match this week. Test the grip against proper resistance; the Dog’s explanation can wait.",promise:'appearance',sides:{37:-3},reaction:"He marks the mat. “An incomplete Hold One must be corrected before it spreads.”"},
    {style:'believer',text:"Let the Dog show the escape slowly. You can locate the gap in Hold One.",reaction:"He nods. “A gap in Hold One. That is a coherent explanation.”"},
    {breaks:true,text:"The Dog got free. Let the referee handle it and move on.",reaction:"He resets his feet. “The referee cannot practice the missing pressure for me.”"}]},
   {line:"Someone put me in what they called a “headscissors”; Hold Two is being described very carelessly these days.",replies:[
    {style:'straight',text:"Show me where the pressure was. Start with what you felt.",reaction:"He indicates two points. “There. Hold Two, from an inconvenient direction.”"},
    {style:'believer',text:"You know the two holds. Let us find which part needs work.",reaction:"He opens the notebook. “At last, a finite problem.”"},
    {breaks:true,text:"Ask the opponent what they call it. That will settle the wording faster.",reaction:"He closes the notebook. “I am studying the hold, not collecting incorrect names.”"}]}
  ]},
 10:{speaker:'Sweeps',style:'believer',place:'St. Elbow’s, after hours',
  tells:{wary:'He sweeps grit off your boots before asking you to step aside. Then he gets the spot underneath.',friendly:'He nods when you come in and keeps sweeping.',warm:'He sweeps a path for you when you walk in.',devoted:'He sweeps a path to your office every morning, whether or not you’re coming in.'},
  moods:{
   low:{style:'straight',tell:"Sweeps scrubs the same boot heel, then plants it twice to check where it slipped."},
   high:{style:'believer',tell:"Sweeps has polished the winning corner and is already chasing a speck toward the losing one."}
  },distrusts:'bureaucrat',
  stale:'You can go over a spot till the boards shine, boss. Still gotta take a look at the rest of the floor.',
  heard:"{name} repeated that, boss; help me understand while I get this bloody grit out of the seam.",
  invite:{wary:"Sweeps is working through a patch of dirt. Approach on the clean side.",friendly:"Sweeps is cleaning his usual spot tonight. Wipe your feet before joining him.",warm:"Floor’s filthy. Company’s welcome. For the love of clean boards, wipe your feet."},
  signoff:{wary:'Mind the dustpan.',friendly:'Keep it clean, boss.',warm:'Floor’s clean. So’s my conscience. Night, boss.',devoted:'Take the side door, boss. I swept you a way out.'},
  sore:'You brushed me off, boss. I know the motion. Lift your other boot, there’s grit under it too.',
  reacts:{kept:'Sweeps takes an extra pass down the aisle where you’ll walk out.',broken:'Sweeps moves your chair to reach the boards under it and leaves it where he moved it.'},
  jealous:"Sweeps attacks a trail of glitter. “An evening with {name}, boss? Did the evening come in a bag that sheds?”",
  backstage:{
   won:{tell:"Sweeps celebrates by chasing confetti straight into the pan.",
    line:"“I had the ring spotless before the bell, boss. Took them three seconds to cover it in bloody confetti. Hand me the pan.”",
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
    line:"“Someone folded their ticket into a little boat, boss. Plenty of time to do that, apparently. No time to find a bloody bin.”",
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
    line:"“{name} got booked and I got this pile, boss. How does that much rubbish get outside?”",
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
     {style:'hype',text:"Tell the others what it takes to clean up after a show. They ought to hear it from you.",sides:{20:-2},reaction:"He keeps sweeping. “They can hear it while they hold the bloody bag.”"}
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
    {style:'believer',text:"You have the mic this week. Explain why this broom matters and give Term Life credit for protecting it.",promise:'promo',sides:{17:3},reaction:"He lifts the form and sweeps the mud underneath. “He understands a valuable tool. Now he can understand a bloody doormat.”",
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
    {breaks:true,text:"Bag the obvious glitter and move on. There are bigger jobs before lockup.",reaction:"He kneels over the seam. “It’s all bloody obvious once the big pile’s gone. Look at this bit in the seam.”"}]},
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
  stale:"Thank you. The same answer has now been heard three times. A fourth reading will be held behind locked doors, without supper.",
  heard:"{name} repeated every word the booker said about Charming. Please accept a complimentary copy of the booker’s obituary.",
  invite:{wary:"Tea at four. Please bring a witness with poor eyesight.",friendly:"Tea is served. Please sign the liability waiver before taking sugar.",warm:"Dearest booker, tea at four. Please leave the emergency contact blank for efficiency. Kind regards, C.F."},
  signoff:{wary:"Please mind the loose stair; repairs would spoil the surprise.",friendly:"Thank you for coming. The door locks from the pleasant side.",warm:"Kind regards to the family; please keep the ambulance route clear.",devoted:"Please take a biscuit for the journey and a second for the eventual inquest."},
  sore:"Please open the thank-you note privately; public reading would upset the people named in the threats.",
  reacts:{kept:"Charming sends a thank-you and bills the opponent for the postage.",broken:"Charming forwards the unused invitation to the opponent’s creditors, marked “lovely opportunity.”"},
  jealous:"Charming tips a cup into the flowerpot. “{name} seems to be the booker’s favorite. Please save the best seat at the next disciplinary hearing for {name}.”",
  backstage:{
   won:{tell:"Charming has tucked an invoice under the ice pack intended for the other corner.",
    line:"“Please thank {name} for the match. The ice pack comes with a bill. A cold one would have cost extra.”",
    replies:[
     {style:'bureaucrat',text:"Send one result notice and keep the medical bill out of it.",reaction:"Charming separates two envelopes. “Separate correspondence, separate collection fees. Delightful.”"},
     {style:'believer',text:"Tell {name} which exchange nearly cost you the match.",reaction:"Charming opens the note. “Thank you for nearly succeeding. Please enjoy the distinction.”"}
    ]},
   lost:{tell:"Charming prepares a condolence card for the referee and tests the seal with a smile.",
    line:"“Please send the referee a funeral wreath for costing Charming the match. A rematch with {name} would make a lovely follow-up.”",
    replies:[
     {style:'believer',text:"Put your own name on the card. A loss does not require a punishment.",reaction:"Charming writes slowly. “Charming Friendly. Please leave the punishment field blank pending review.”"},
     {style:'bureaucrat',promise:'rematch',text:"You and {name} next week. Save the card and put the new date on the back.",reaction:"Charming turns it over. “A rematch next week. Lovely. Please give the referee’s family seats close enough to watch.”"},
     {truth:true,text:"You lost. A condolence card for the referee will not change it.",reaction:"Charming closes the envelope. “Quite right. Please save the flowers for a more persuasive occasion.”"}
    ]},
   stole:{tell:"Charming gathers programmes that spectators dropped while standing and marks each with a resale price.",
    line:"“Please thank the crowd for the standing ovation. Kindly stay on foot until the ushers have resold the empty seats.”",
    replies:[
     {style:'bureaucrat',text:"Send one thank-you to the hall. The other corner gets equal space to sign.",reaction:"Charming measures both lines. “Equal signatures. Unequal liability, if the form permits.”"},
     {style:'believer',text:"Enjoy the reaction. You do not need to send an invoice.",reaction:"Charming folds the programme. “A gracious evening with no paper trail. Delightful.”",cases:[{when:{lostTonight:true},morale:2,reaction:"Charming smooths the crease. “Please file the applause before the result. The result is hideous.”"}]},
     {style:'hype',promise:'promo',text:"You have the mic next week. Thank the crowd in person.",reaction:"Charming makes a note. “Please lock the doors until the thank-you has concluded.”"}
    ]},
   flat:{tell:"Charming has cut the audience survey into tiny slips and is slipping the worst ones into the opponent’s bag.",
    line:"“The crowd went quiet. Please pull the worst comments from the survey. Charming can read them aloud next time and name the wrestlers responsible.”",
    replies:[
     {style:'bureaucrat',text:"Lead with the point. Cut the preliminaries.",reaction:"Charming strikes out a line. “Certainly. The threat fits nicely in the greeting.”"},
     {style:'believer',text:"Where did you lose the room? Start with the last moment they were listening.",reaction:"Charming taps the fold. “Here. This is where the crowd stopped listening. Please lock the doors at that point next week.”"},
     {breaks:true,text:"The show was running late. Let’s talk about cutting the segment down.",reaction:"Charming folds the programme. “Efficient. Please reserve the saved minutes for the public shaming.”"}
    ]},
   kept:{tell:"Charming has signed a thank-you and put the opponent’s address on the copy marked “charges.”",
    line:"“Thank you for delivering {promise}. Please accept this card. The other corner gets an eviction notice.”",
    replies:[
     {style:'bureaucrat',text:"Keep a record of the promise being fulfilled. Leave the other corner out of it.",reaction:"Charming files both copies. “A record with a small omission. How tidy.”"},
     {style:'believer',text:"Tell me what the booking meant before you seal the envelope.",reaction:"Charming smiles over the seal. “A lovely chance to turn gratitude into leverage. Thank you.”"}
    ]},
   broken:{tell:"Charming holds out a clipboard with a formal complaint already signed in an unfamiliar hand.",
    line:"“The show went ahead without {promise}. Please sign the complaint about the broken promise. The booking office’s signature has already been drafted as a courtesy.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. I will put that commitment in writing.",reaction:"Charming offers the pen. “Initial beside the new promise, please. The confession can wait. The booker’s signature looks quite convincing already.”"},
     {style:'believer',text:"You were right to expect it. Put my name by the broken promise.",reaction:"Charming writes in a narrow box. “Responsibility acknowledged. Please enjoy the generous interest rate.”"},
     {breaks:true,text:"Leave the form with me. I need to see the whole card first.",reaction:"Charming caps the pen. “Certainly. Copies have already gone to the least forgiving parties.”"}
    ]},
   benched:{tell:"Charming props a place card on the curb and pushes a small bill beneath it.",
    line:"“{name} got booked and Charming spent the show watching. Please accept an invoice for the missed appearance.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"Write your name here. You have a match next week.",reaction:"Charming writes carefully. “Excellent. Please select a guest with few witnesses.”"},
     {style:'believer',text:"Tell me the match you would have asked for without seeing the card.",reaction:"Charming straightens the place card. “A generous invitation to a profoundly disadvantaged guest, please.”"},
     {style:'straight',text:"Ron was booked for a reason. I can hear your case separately.",reaction:"Charming folds the card. “Of course. Please deliver Ron’s thank-you. The endorsement was printed in permanent ink as a courtesy.”"}
    ]},
   idle:{tell:"Charming unwraps four thank-you notes and reveals a thicker fifth envelope marked “collection.”",
    line:"“Four Saturdays without a booking. Please pick a reminder to read, or put Charming on next week’s card before this goes to collections.”",
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
   {line:"Please place a bid for the name of the wrestler sleeping under the ring. Tea is included.",replies:[
    {style:'bureaucrat',text:"Seal the name. I can handle the situation without making it public.",reaction:"Charming seals the envelope. “A sealed envelope. Excellent. The bidding can continue in private.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"Charming waxes the seal. “Saturday’s result can raise the opening bid. Splendid.”"}]},
    {style:'believer',text:"Give me the door they use, without their name. I can help without exposing them.",reaction:"Charming pours another cup. “An anonymous eviction. Tasteful.”"},
    {breaks:true,text:"Send them to me at lockup. I need to clear the ring.",reaction:"Charming sets the cup down. “Certainly. Please allow time to sell the blanket first.”"}]},
   {line:"One match against the weakest wrestler on the roster, please. Kindly bill the losing corner for any damage.",replies:[
    {style:'bureaucrat',text:"Submit one name and one reason. You have a match this week; I will choose the other corner.",promise:'appearance',reaction:"Charming produces the laminated form. “Please invoice the other corner for the selection process.”"},
    {style:'believer',text:"Tell me the name you want without the polite wrapping.",reaction:"Charming taps a place setting. “The guest least likely to afford a second opinion, please.”"},
    {breaks:true,text:"The card is set. Send the proposal before the next print run.",reaction:"Charming notes the deadline. “Excellent. Please leave the printer unattended.”"}]},
   {line:"Maddox supplied the sugar. The slips underneath name the guests’ secrets and the price of keeping quiet. A second lump doubles the price. Thank you.",replies:[
    {style:'bureaucrat',text:"Post the terms in full. You have mic time this week to read them before anyone takes sugar.",promise:'promo',reaction:"Charming unrolls the terms. “Certainly. Please allow time for every penalty clause.”"},
    {style:'believer',text:"Ask Maddox what he actually needs kept safe.",reaction:"Charming lifts the pot. “Please protect the kettle first; the secrets fetch more when warm.”"},
    {truth:true,text:"Nobody consented to blackmail over tea. Put the slips away and ask plainly.",reaction:"Charming gathers the slips. “A direct threat, then. Please accept the improved transparency.”"}]},
   {line:"Ron refused to endorse the plan. Please set a place for Ron anyway. The thank-you card for approving it is already printed.",replies:[
    {style:'bureaucrat',text:"Issue a disputed receipt with a deadline. Give Ron a chance to answer on the record.",sides:{31:-2},reaction:"Charming retrieves the smallest card. “Please print the deadline below the crease, for elegance.”"},
    {style:'believer',text:"Set a place. Let Ron decide whether he comes.",reaction:"Charming sets the saucer. “A warm seat makes a fine place to leave a summons.”"},
    {breaks:true,text:"Take him off the head count. Maddox has enough cups to wash.",reaction:"Charming pours anyway. “Please bill Ron for the unused serving. Waste is dreadful.”"}]},
   {line:"The last opponent asked Charming for a reference. A match this week would give Charming a chance to deliver it in person. Please leave room in the letter for ‘unlikely to recover.’",replies:[
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
    line:"“I won! I hugged them after the bell and they didn’t let go right away. I think they want a rematch!”",
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
     {style:'hype',promise:'appearance',text:"You have a match next week. Start with one person and let the rest join.",reaction:"He points to the front row. “A friendship with room to spread!”"},
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
     {style:'believer',text:"You can cheer for someone else and still ask for a spot of your own.",reaction:"He nods eagerly. “Two celebrations! Excellent accounting!”"},
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
   {line:"Give me the mic this week! Should I ask the crowd if they want a choir, streamers, or a heart visible from the next town?",replies:[
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
   {line:"I made a heart for everybody in the front row. Do you think any of them made one for me? I brought enough to trade!",replies:[
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
  stale:"I heard the first statement. I heard the second. That was the third. If there is a FOURTH, everyone is going home.",
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
    line:"“At one minute they disagreed. At two minutes they were still disagreeing. If someone says “at three minutes,” I will confiscate the clock.”",
    replies:[
     {style:'bureaucrat',text:"Mark where they looked away and where they looked back.",reaction:"He rules two lines. “One record, no competing timelines.”"},
     {style:'straight',text:"Show me the exchange you would keep if you had one minute.",reaction:"He sets the survey down. “A minute of wrestling. A whole minute in which nobody gets to make a point. Please.”"},
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
    line:"“{name} got booked. I didn’t. Could everyone please stop arguing about whose side that puts you on?”",
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
    line:"“{name} has had a turn. I will hear the other side exactly once, and then I will adjourn this entire hallway.”",
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
  signoff:{wary:"Keep the autograph. I used to charge for those. Buy me a whiskey if it goes up in value.",friendly:"Call if there is a fight going.",warm:"Same seat Sunday; next fight sooner, preferably.",devoted:"You remembered the name without the headshot. That earns you the good seat."},
  sore:"I have heard kinder rejections after four drinks, and I remember those too.",
  reacts:{kept:"Liam raises his glass over the fulfilled booking, taking care not to cover his name.",broken:"Liam folds the cancelled booking inside another unanswered comeback pitch."},
  jealous:"Liam sets his glass on an old headshot. “{name} gets your evening; tell me this is not Demeter’s Baby all over again.”",
  backstage:{
   won:{tell:"Liam raises a flask in one hand and flexes the other as if the bell might ring again.",
    line:"“That’s a win, that’s my name they’re shouting, and that’s still my drink. Who’s up next?”",
    replies:[
     {style:'straight',text:"You earned the win. Let that be the credit tonight.",reaction:"He takes a drink. “Liam Neesen, victorious; comfortably within my range.”"},
     {style:'bureaucrat',text:"Keep the result with your booking records. This is current work.",reaction:"He tucks the result behind a headshot. “Straight to the front of the résumé.”"},
     {style:'believer',text:"Enjoy it. They came to see you fight, and you gave them a fight.",reaction:"He lifts the flask again. “Do you think they would stay for another?”"}
    ]},
   lost:{tell:"Liam props the result sheet against his flask and tries to flatten it with a knuckle.",
    line:"“Write down that I lost. By the next drink I’ll be telling this as the night they couldn’t get me out of the ring.”",
    replies:[
     {style:'bureaucrat',text:"We will go through the result and the finish. One thing at a time.",reaction:"He taps the sheet. “Good; the reviews used to be much harder to pin down.”"},
     {style:'straight',promise:'rematch',text:"You and {name} next week. Work out what changes before then.",reaction:"He raises the flask. “A sequel commissioned before the reviews; there is confidence.”"},
     {truth:true,text:"You enjoyed trading blows so much that you stopped trying to finish the match.",reaction:"He looks at his knuckles. “Yes. I was having rather too good a time.”"}
    ]},
   stole:{tell:"Liam has uncapped his flask but keeps turning back toward the noise from the hall.",
    line:"“They sounded like an opening-night crowd. And I got to hit somebody. Never had a premiere that good.”",
    replies:[
     {style:'straight',text:"You and your opponent gave them a fight worth the ticket.",reaction:"He drinks to the doorway. “And I did not have to audition.”"},
     {style:'bureaucrat',text:"Put this match at the top of your recent work.",reaction:"He turns over the headshot. “Finally, something to add instead of explain.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He writes beside his drink. “Lost the match; kept the room. Both go on the page.”"}]},
     {style:'believer',text:"They were calling for you. Take a moment to hear it.",reaction:"He lowers the flask. “I know; I had forgotten the second shout.”"}
    ]},
   flat:{tell:"Liam stares at the blank back of a headshot over the rim of his drink.",
    line:"“I gave them the old stare and the old speech; apparently they have already seen that picture.”",
    replies:[
     {style:'straight',text:"Show them what you want in this ring. The old scene will not do it for you.",reaction:"He puts the photograph down. “A fresh fight, then.”"},
     {style:'bureaucrat',text:"Note where the noise stopped. We can start the review there.",reaction:"He borrows a pen. “Write down where they stopped cheering. I’ll mark where I thought they were still cheering.”"},
     {breaks:true,text:"It was a quiet crowd. Let us leave the analysis until tomorrow.",reaction:"He turns the glass. “They were quiet while I was talking, too; I noticed.”"}
    ]},
   kept:{tell:"Liam balances the booking sheet on his glass to show you his name.",
    line:"“You said {promise}, and there it was; my old agent required six calls to manage that.”",
    replies:[
     {style:'straight',text:"You had enough to think about without wondering if I’d come through.",reaction:"He grins over the glass. “Dangerously easy to arrange.”"},
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
     {truth:true,text:"That spot had a purpose. Tell me what your next match offers beyond beating Greek to the booking.",reaction:"He studies his boots. “A fight they’ll pay to see twice. I’ll do it a third time for a drink.”"}
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
       {when:{wonTonight:true},reaction:"He raises the glass. “I won. Put that above the film dispute in the credits.”"}
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
   {line:"Greek passed me over for the lead in Demeter’s Baby. I kicked him in the head, the union kicked me out, and somehow he still gets top billing.",replies:[
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
  tells:{wary:'He growls softly when you reach for the rulebook.',friendly:'He perks up when you come in, even with the bell put away.',warm:'He brings you things: a referee’s whistle, a folding chair.',devoted:'The Dog holds page forty-one open with one hand and puts the booking sheet beside it.'},
  moods:{
   low:{style:'hype',tell:"The Dog nudges the ball toward the ring and waits for you to call the next attempt."},
   high:{style:'believer',tell:"The Dog keeps the result tucked inside the rulebook, directly above the next available match date."}
  },distrusts:'bureaucrat',
  stale:'I brought that one back twice. Throw it somewhere I haven’t been.',
  heard:"{name} told me what you said. I am a dog, the book does not ban dogs, and I still want a match.",
  invite:{wary:"The Dog is guarding the rulebook at his usual spot.",friendly:"WOOF. meet me. bring the ball and a match idea.",warm:"[A photo of the rulebook beside a tennis ball. Caption: next match?]"},
  signoff:{wary:"Dog will wait. Dog would rather wrestle.",friendly:'Good booker.',warm:'The ball stays here, booker. You know where to find it.',devoted:"Same dog, same rulebook. Bring the next match."},
  sore:'I am a dog. I brought the whole rulebook. Call when there’s a match for the dog.',soreWeeks:8,
  reacts:{kept:'The Dog brings you the rulebook open to page forty-one and waits for you to finish looking.',broken:'The Dog closes the rulebook around his bookmark and takes it back to his usual spot.'},
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
    line:"“Crowd barely barked when Dog went out there. Should Dog bring a ball next time?”",
    replies:[
     {style:'believer',text:"Show me what you tried when they went quiet.",reaction:"He takes a ready stance. “First they see the chase. Then dog goes.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. Give them one bark they can answer.",reaction:"He tries a short bark. “Room for their bark. Good.”"},
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
    line:"“{name} got booked. Dog has an escape to try and nobody to escape from.”",
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
   cutIn:{tell:"The Dog sets a ball down and rolls one shoulder free of an imaginary grip.",
    line:"“{name} says Hold One wasn’t finished. Dog rolled free. Want to try it again?”",
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
   bad:{title:'Behind the Fence',line:"The Dog keeps the book beside his ball. “Dog heard you coming. Got a match? The rulebook says we can start.”"}
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
   {line:"Dog rolled out of Hold One. 2 Holds says it didn’t count. Ring the bell again. Dog can show him.",replies:[
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
   26:'“Smark got the slot and I had to watch. Ask him what he calls old-school, mortal. I’m making a picture about Greco Wrestling, the wrestling we do here in Greece.”',
   31:'“Ron got booked. I asked him what it felt like to hear his name and he abstained. How does a man abstain from a feeling?”',
   34:'“You booked Liam and left me in the seats. I watched the whole thing and still can’t write what it would’ve felt like to face him.”'
  },
  cutIn:{
   26:'“Smark wants tradition? Greco Wrestling is what we do here in Greece. I’d be happy to show him before he gives me notes.”',
   31:'“Ron won’t take a side. Perhaps he can tell me what he saw without deciding whom I should put in the picture.”',
   34:'“Liam and I remember the kick. We’ve never agreed on what came before it. Put us in a ring and at least Athens can see what comes next.”'
  },
  lost:{24:'“Jesus said he’d pray for me after I lost. I asked him how the match looked from the seats. I already know what it looked like from the floor.”'}
 },
 31:{
  benched:{12:'“John Smith got booked. He’s already corrected three people about it. There is no need for a FOURTH.”'},
  cutIn:{12:'“John Smith has corrected the correction to his correction; no further corrections will be entertained by either corner.”'}
 }
};

const FEATURED_IDS=Object.keys(FEATURED_ROUTES).map(Number);

// Stable beat and memory IDs preserve existing Sweeps saves.
const SWEEPS_BEATS={
 'after-hours':{kind:'beat',when:{},cue:'First evening after his spotlight month',
  line:"Hear that crunch, boss? I swept this whole stretch twice. There’s still grit under the bloody board. I’m getting it out.",
  replies:[
   {style:'believer',text:"Show me where it is. We will find a way to reach it.",reaction:"He points with the broom. “There; smug little crunch right there.”"},
   {style:'straight',text:"What does cleaning that seam have to do with chasing the belt?",reaction:"He scrubs at it. “I’ll clean the main-event corner too. I don’t care who’s standing in it.”"},
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
  line:"I still can’t get this bloody coffee stain out. Give me the mic next week, boss. If the whole crowd watches this spot, maybe shame will finally shift it.",
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
  {style:'hype',promise:'promo',text:'“Take the mic next week. Tell the whole town about that win.”',reaction:'“The whole town.” {speaker} is already rehearsing.'},
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
  {style:'bureaucrat',promise:'appearance',text:'“That’s on me. You have a match next week.”',reaction:'{speaker} nods slowly. “Next week. I’ll be looking.”'},
  {style:'straight',text:'“It didn’t fit tonight. I should have told you sooner.”',reaction:'“Sooner would’ve been nice.” But {speaker} doesn’t walk away.'},
  {breaks:true,text:'“The card’s the card. We’re done here tonight.”',reaction:'{speaker} doesn’t answer. That’s the answer.'}]},
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
  'name-in-the-song':{kind:'beat',when:{minTrust:55},cue:"Greek asks the booker for help researching his wrestling picture",
   plan:"Greek tells the crowd about his Greco Wrestling picture",
   line:"I’m making a picture about Greco Wrestling. I want to know what it’s like to be the wrestler all Greece comes to see.",
   replies:[
    {style:'hype',text:"Take the mic this week. Tell Athens what you’re making.",promise:'promo',reaction:"He hands you the notebook. “Write down the first thing they shout back.”"},
    {style:'straight',text:"I’ll take notes from the seats. Tell me what you can see from your corner.",reaction:"He draws a line down the page. “Good. I can’t see myself from where I’m standing.”"},
    {breaks:true,text:"I can book your matches. I can’t take notes during every one.",reaction:"He retrieves the notebook. “Very well. I’ll have to remember how Athens sounds.”"}
   ]},
  'mortal-in-the-ring':{kind:'beat',when:{minTrust:62},cue:"Greek wants firsthand experience of an arena cheering for someone else",
   plan:"Greek wrestles in front of a crowd that might come to see the other wrestler",
   line:"I know what it feels like when they cheer for me. Book me against someone the crowd loves. I need to know how the other corner feels.",
   replies:[
    {style:'hype',text:"You have a match this week. Listen to who the crowd calls for when you walk out.",promise:'appearance',reaction:"He shuts the notebook. “We begin with the entrance. I’ll try to wait for my own name.”"},
    {style:'believer',text:"Talk to the person who usually gets booed. Ask what they hear when the bell rings.",reaction:"He puts the pencil behind his ear. “A witness, then. Tell me where they sit after a match.”"},
    {breaks:true,text:"I book for the crowd. I can’t promise they’ll give you the scene you’re looking for.",reaction:"He nods once. “That is the part I wanted to see for myself.”"}
   ]},
  'room-for-the-chorus':{kind:'beat',when:{minTrust:68},cue:"Greek asks what the crowd remembers after a night of Greco Wrestling",
   plan:"Greek asks the crowd which moment stayed with them",
   line:"I wrote down what happened in the ring. The people in the front row went home talking about something else. Give me the mic this week. I want to ask the front row what they saw.",
   replies:[
    {style:'hype',text:"You have the mic this week. Ask them what they went home talking about.",promise:'promo',reaction:"He leaves a blank page. “Athens can speak first. I’ll write as quickly as I can.”"},
    {style:'straight',text:"Ask two people from different rows. See where their stories disagree.",reaction:"He draws two little seats. “Of course. Even a chorus has different voices.”"},
    {breaks:true,text:"If they talk about the show on the way out, you did your job. Let them go.",reaction:"He looks toward the doors. “I’m trying to find out what they’re taking home.”"}
   ]},
  'olympus-roof':{kind:'flag',when:{minTrust:70,lostLastShow:true},cue:"After a loss, Greek wonders whether the picture should follow the loser",
   invite:"Greek is waiting with a crooked laurel and two versions of the ending.",
   memory:'olympus-roof',
   line:"I asked Zeus whether the picture should follow the winner or the man left on the mat. He’s had remarkably little to say.",
   replies:[
    {style:'hype',text:"I was still watching you after the bell. Start there.",reaction:"He puts the laurel beside him. “Leave it off for that scene.”"},
    {style:'believer',text:"What did you do first when you knew you’d lost?",reaction:"He opens the notebook. “I looked for one person still looking back.”"},
    {breaks:true,text:"Zeus didn’t see the match. Ask somebody who did.",reaction:"He holds the notebook shut. “I had hoped you might volunteer, mortal.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Greek requests a title match to learn what a championship feels like from the ring",
   askPromise:{kind:'title',due:'event',plan:"Greek’s title match: firsthand research for his Greco Wrestling picture"},
   invite:"Bring the next tour card. Greek wants to talk about the ending of his picture.",
   line:"Book me in a title match at the next tour show. I can’t write what the belt means until I’ve stood in that ring with all Greece watching.",
   replies:[
    {style:'hype',ask:'accept',text:"You have a title match at the next tour show. Take in the room before the bell.",reaction:"He writes down the date. “Put the belt where both corners can see it.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Give me four weeks before we commit the championship slot.",reaction:"He turns to a blank page. “Four weeks. I can start with what it feels like to wait.”"},
    {ask:'decline',delta:-10,text:"I can’t give you a title match.",reaction:"He closes the notebook. “Then I’ll have to write that scene from the seats.”"}
   ]},
  'chorus-call':{kind:'final',when:{},cue:"Before the title match, Greek asks the booker to stay through the finish",
   invite:"Greek wants someone watching the room when the title match ends.",
   line:"When the bell rings, keep watching. Win or lose, mortal, I want to know what the crowd does before anybody tells them what to feel.",
   replies:[
    {style:'hype',text:"I’ll watch the room as soon as the bell rings. I’ll tell you what I heard first.",reaction:"He hands you a pencil. “Even if the first thing is nothing at all.”"},
    {style:'believer',text:"I’ll stay through the finish. Then you can tell me what it felt like from your corner.",reaction:"He leaves a page for you. “One account from the ring. One from someone who stayed.”"}
   ]}
 },memories:[{id:'olympus-roof',title:"Two Endings for Athens",caption:"Week {week} · Greek asked what you see when you’re still on the mat after the bell."}],
 endings:{
  best:{title:"All Greece Watching",line:"Greek opens his notebook. “Now I know what it feels like with the belt on the line. Tell me what you heard after the bell, mortal. I have room for both.”"},
  neutral:{title:"From Inside the Ring",line:"Greek looks at the last page. “I got my title match. I know what I saw. I wish I’d asked someone in the seats.”"},
  bad:{title:"The View from the Seats",line:"Greek puts his notebook beside the empty chair. “No title match. I’ll sit here and watch how the other wrestler holds the belt. The picture still needs an ending.”"}
 }},
 37:{beats:{
  'page-forty-one':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, the Dog shows you his evidence',
   plan:'The Dog brings the unabridged rulebook to the referee before his match',
   line:"Dog read the whole rulebook. Boots, tape, mouthguards. Nothing about dogs. When does this dog wrestle?",
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
   line:"Give Dog the microphone at the next tour show. Dog will read the whole rulebook so everybody can hear that nothing bans dogs from wrestling.",
   replies:[
    {style:'believer',ask:'accept',text:'You have the mic at the next tour show, good dog. Read every word.',reaction:"He opens to the first page. “Complete reading. Undeniable dog.”"},
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
   line:"Book me a match and put Hold One on the poster. I need an opponent who can show me where the grip still slips.",
   replies:[
    {style:'straight',text:'You have a match this week. I’ll put Hold One on the poster.',promise:'appearance',reaction:'He puts one finger on the blank poster. “Print it here. I’ll do Hold Two whether it’s on the poster or not.”'},
    {style:'bureaucrat',text:'Can you submit the grip in writing?',reaction:'He slides over a single sheet with a thumbprint in the middle. “That is where the thumb goes.”'},
    {breaks:true,text:"The audience has seen Hold One. We need a reason to advertise another demonstration.",reaction:"He indicates the thumb. “It has improved since they last looked.”"}
   ]},
  'hold-one-aloud':{kind:'beat',when:{minTrust:62},cue:'Once he lets the booker hear how he teaches Hold One',
   plan:"2 Holds uses mic time to explain the complete two-hold scope of wrestling",
   line:"They keep asking what comes after Hold Two. Give me the microphone. The crowd is going to count along.",
   replies:[
    {style:'straight',text:"You have the mic this week. Explain the two holds from the feet upward.",promise:'promo',reaction:"He checks both boots. “A complete syllabus. Two items.”"},
    {style:'believer',text:'Could the whole front row try the stance at once?',reaction:"He moves a chair. “Yes; the front row can practice Hold One. The back row must not invent anything.”"},
    {breaks:true,text:'Use the time to show them something new.',reaction:"He raises two fingers. “There is refinement. There is no additional item.”"}
   ]},
  'case-at-ringside':{kind:'beat',when:{minTrust:68},cue:"He asks the booker to track how smoothly he switches between his two holds",
   plan:'2 Holds tests the transition between Hold One and Hold Two against a resisting opponent',
   line:"There’s a fraction of a second between Hold One and Hold Two. Book me a match this week. I want to see whether an opponent can still use that gap.",
   replies:[
    {style:'straight',text:'You have a match this week. I’ll watch the space between the two holds.',promise:'appearance',reaction:"He hands you the practice book. “Hold One, then Hold Two. If you count to three, start the stopwatch again.”"},
    {style:'bureaucrat',text:'I’ll time the switch in both directions and put it in the book.',reaction:'He hands you a pencil. “Two columns. No miscellaneous.”'},
    {breaks:true,text:'Take the hold that’s already working. You don’t have to keep switching.',reaction:"He resets his feet. “I intend to master the whole syllabus.”"}
   ]},
  'open-latch':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After a recent match, he finds the practice notebook has run out of pages',
   invite:"Seven. Bring two sheets of paper. One for each hold.",
   memory:'open-latch',
   line:"The notebook is full. I have a new correction for Hold One and another for Hold Two, so we have a paper problem.",
   replies:[
    {style:'straight',text:'Use these two sheets. Show me which correction belongs on each.',reaction:"He sets one sheet by each foot. “Now we can proceed in order.”"},
    {style:'bureaucrat',text:'I’ll archive the old drills and date the new sheets.',reaction:"He hands you the notebook. “Keep the changes in order. I may want the half millimeter back.”"},
    {breaks:true,text:"We’ve got enough notes. Pick the grip you’re going to start with.",reaction:"He picks up both sheets. “Picking the first does not remove the second.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he asks to test the perfected two-hold sequence at the next tour show',
   askPromise:{kind:'appearance',due:'event',plan:"2 Holds tests his refined sequence at the tour show: Hold One to Hold Two and back again"},
   invite:"Both holds are ready for a proper test. A tour date is required.",
   line:"Book the next tour show. I want to run Hold One into Hold Two and back again until even the back row can see what changed.",
   replies:[
    {style:'straight',ask:'accept',text:'You have a match at the next tour show. We’ll give the sequence room to breathe.',reaction:"He sets both feet. “Both holds, full resistance. Good.”"},
    {style:'hype',ask:'accept',askDue:0,cap:'neutral',text:'Tonight! I’ll add a match. You can put the new sequence to the test right away.',reaction:"He starts the transition again. “I can do both tonight. I wanted time to make them better.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'Give me four weeks to find the right show.',reaction:"He writes four practice weeks. “I can refine both holds in that time.”"},
    {ask:'decline',delta:-10,text:'I won’t book a special match for the sequence.',reaction:"He takes his stance again. “Then count the next repetition.”"}
   ]},
  'the-last-drill':{kind:'final',when:{},cue:'The week of the tour match, he rehearses the transition at match speed',
   invite:"Final drill before the tour show. Watch the feet between the holds.",
   line:"Everyone knows Hold One and Hold Two. Watch my left foot when I switch. That’s what I’ve spent the month on.",
   replies:[
    {style:'straight',text:'I’ll watch your feet. You’ll know when you have enough room.',reaction:'He puts his left boot down first. “That’s the part nobody writes down.”'},
    {style:'believer',text:'I’ll watch both boots. The rest of the room can count the holds.',reaction:'“Good.” He takes the first step again, slower this time.'}
   ]}
 },memories:[{id:'open-latch',title:'Two Fresh Sheets',caption:'Week {week} · The notes filled a book. The next corrections got a page each.'}],
 endings:{
  best:{title:'The Perfect Transition',line:"2 Holds checks his stance. “Both holds, properly demonstrated. Now I can begin refining the next half millimeter.”"},
  neutral:{title:'Room for Half a Millimeter',line:'2 Holds opens the practice book. “They saw both. I saw where the second one could be tighter.”'},
  bad:{title:'Back to One',line:'2 Holds plants both boots. “No tour match. There is time for another repetition.”'}
 }},
 18:{beats:{
  'sealed-favor':{kind:'beat',when:{minTrust:55},cue:'After tea, Charming asks you to grant a small favor without knowing the secret',
   plan:'Charming enters with a sealed thank-you note for his opponent',
   line:"One match this week, please. Kindly leave the envelope sealed. Reading the opponent’s emergency contact costs extra.",
   replies:[
    {style:'bureaucrat',text:'One match this week. I’ll record that the envelope stayed sealed.',promise:'appearance',reaction:"Charming tops up the cup. “An audit trail leading straight to the bill. Lovely.”"},
    {style:'straight',text:'Tell me what you want first.',reaction:"Charming turns the saucer. “An opponent with nobody waiting afterward, please.”"},
    {breaks:true,text:'Take the envelope out from under my saucer.',reaction:"Charming lifts the envelope with the tongs. “Certainly. The opponent’s coat has a lovely dry pocket.”"}
   ]},
  'right-of-reply':{kind:'beat',when:{minTrust:62},cue:'Once he trusts you with his version of a public courtesy',
   plan:'Charming thanks his next opponent in advance, then gives them the right of reply',
   line:"Please book Charming some mic time. The next opponent took a thank-you note for a future hospital stay as a threat. The crowd deserves to hear the whole note.",
   replies:[
    {style:'bureaucrat',text:'You have the mic this week. State exactly what you’re thanking them for.',promise:'promo',reaction:"Charming unfolds a shorter note. “For the bed, the flowers, and the sudden vacancy on the card. Thank you.”"},
    {style:'straight',text:'What will you say if they decline the thanks?',reaction:"Charming pours the tea. “Refusal is welcome. Collection fees are also welcome.”"},
    {breaks:true,text:'It was a threat. They read it right.',reaction:"Charming smiles too long. “A beautifully phrased threat, surely. Please credit the penmanship.”"}
   ]},
  'guest-of-honor':{kind:'beat',when:{minTrust:68},cue:'Once warm, he lets you inspect how he arranges a match',
   plan:'Charming offers his opponent the ceremonial first entrance and keeps the second for himself',
   line:"One match, please. Give the opponent the first entrance. The guest of honor’s chair will be waiting at ringside, facing the wall.",
   replies:[
    {style:'bureaucrat',text:'You have a match. Their entrance first. I’ll write down exactly what I’ve agreed to.',promise:'appearance',reaction:"Charming pulls the chair out. “A first entrance and a last opportunity to flee. How formal.”"},
    {style:'believer',text:'Offer the nicer corner. See whether they take it.',reaction:"Charming considers both corners. “A lovely choice between two equally regrettable seats.”"},
    {breaks:true,text:'I’m not arranging the card around your seating plan.',reaction:"Charming slides the plan under the cup. “Certainly. Please enjoy the surprise seating.”"}
   ]},
  'empty-place':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After the ladder and a recent match, a wrestler returns Charming’s invitation to tea',
   invite:"Tea at Maddox’s table. A wrestler sent an invitation back unopened. Please come advise on a second delivery.",
   memory:'empty-place',
   tell:"Charming has set a cup for an absent guest. A sealed invitation and a spare house key sit on the saucer.",
   line:"A wrestler sent Charming’s tea invitation back unopened. Please use the spare key to leave a fresh invitation on the wrestler’s pillow. Such a personal touch.",
   replies:[
    {style:'bureaucrat',text:"Record the invitation as declined. Offer the seat at tea to someone else.",reaction:"Charming sets out a blank place card. “A new guest. Lovely. Please leave the first guest’s name on the bill.”"},
    {style:'straight',text:"Drop the tea invite. Ask if the wrestler would consider a match with you.",reaction:"Charming puts down the key and pulls out a blank note. “An invitation to wrestle. How thoughtful. Please leave the ambulance fare off the envelope.”"},
    {breaks:true,text:"Put the key away. Leave the wrestler alone.",reaction:"Charming slips the key into a jacket pocket. “Of course. The invitation can wait until a more convenient hour.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Charming asks for one match and pitches a future of increasingly devious shows",
   askPromise:{kind:'appearance',due:'event',plan:"Charming’s tour-show appearance with an opponent of his choosing and a ringside place setting"},
   invite:"Please bring the next tour card. One blank space will do; a little more cruelty can be arranged later.",
   line:"One match at the next tour show, please, with an opponent of Charming’s choosing. The rest can wait. Family seats close enough to hear the begging would be lovely someday.",
   replies:[
    {style:'bureaucrat',ask:'accept',text:"You have one match and one opponent of your choosing. I am approving only that booking.",reaction:"Charming signs with a flourish. “One small permission. Plenty of room for an ugly consequence. Thank you.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Keep the suggestion sealed. Bring it back in four weeks.",reaction:"Charming smooths the flap. “Four weeks to prepare the least generous possible welcome. Lovely.”"},
    {ask:'decline',delta:-10,text:"I will not book a match on those terms. Keep the invitation.",reaction:"Charming takes your plate. “Of course. Please enjoy the complimentary plate. The meal has been sent to someone who can be made to owe a favor.”"}
   ]},
  'the-place-card':{kind:'final',when:{},cue:'The week his match is due, he offers to sign his own work',
   invite:'One last detail before the match. Please bring a pen suitable for assigning blame.',
   line:"Whose name goes on the opponent’s invitation? Charming’s alone, or Charming’s and the booker’s? The complaint department will appreciate the spelling.",
   replies:[
    {style:'bureaucrat',text:'Sign your own invitation. Let them know who offered the chair.',reaction:"Charming signs slowly. “Kind regards, Charming Friendly. Please spell the name correctly in the complaint.”"},
    {style:'straight',text:'Set both names on the table. I booked it. You asked for it.',reaction:"Charming sets out two cards. “Both names on the invitation. How lovely. Either name will do on the complaint.”"}
   ]}
 },memories:[{id:'empty-place',title:'A Place Left Open',caption:"Week {week} · A wrestler returned Charming’s invitation to tea unopened. Charming had a spare key ready."}],
 endings:{
  best:{title:'By Personal Invitation',line:"Charming stamps an envelope. “Thank you for the match. Please forward any complaints to the complimentary shredder.”"},
  neutral:{title:'A Table for Two',line:"Charming squares the chairs. “A lovely booking. Please turn the house lights up next time so the guest’s family can see the crying.”"},
  bad:{title:'Kind Regards',line:"Charming posts the unopened invitation. “Please accept the returned envelope and a modest invoice for the disappointment.”"}
 }},
 20:{beats:{
  'one-heart':{kind:'beat',when:{minTrust:55},cue:"The Grinch tries to welcome the entire crowd",
   plan:"The Grinch offers the crowd a paper heart during a mic segment",
   line:"I made a heart big enough for the whole audience! Can I show it off on the mic this week? Anybody who made me one back can hold it way up!",
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
   line:"People keep saying they can’t stay for my celebrations. They must be celebrating elsewhere! Can I invite them to the next one on the mic this week?",
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
   line:"Book Lemon Tart and me as tag partners! I can cheer for her, she can cheer for me, and the crowd can cheer for EVERYBODY!",
   replies:[
    {style:'hype',ask:'accept',text:"You and Lemon Tart are booked as tag partners at the next tour show. Give her a dependable partner and the crowd a good match.",reaction:"He grabs the tag rope. “A friendship with legal corners!”"},
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
  best:{title:"A Team Worth Cheering",line:"The Grinch waves a heart. “A shared match! I cheered every time she tagged in. Did you hear the crowd cheering back? I think they love us too!”"},
  neutral:{title:'One Shared Corner',line:"The Grinch packs the banner. “We got our match! Next time the welcome will be easier to carry and MUCH louder!”"},
  bad:{title:"The Welcome Continues",line:"The Grinch unfolds more paper. “No team this time; good thing everybody else still needs welcoming!”"}
 }},
 31:{beats:{
  'equal-corners':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, Ron files for an equal opportunity',
   plan:'Ron opens a match by measuring both corners and recording any difference',
   line:"Red has complained about the light. Blue has complained about the chair. After eight complaints, I’d like a match so both corners can do something besides TALK.",
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
   line:"Give me the microphone at the next tour show for a televised Neutrality Hearing. Both promotions get equal time. Then I declare NEITHER, on the record.",
   replies:[
    {style:'bureaucrat',ask:'accept',text:"Hearing approved for the next tour show. Equal time and a camera for the abstention.",reaction:"He initials the agenda. “At last, a permanent record of refusing to choose.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Keep the hearing on the agenda. Bring it back in four weeks.",reaction:"He sets the timer down hard. “Four more weeks. Both sides can practice silence.”"},
    {ask:'decline',delta:-10,text:"I will not give the hearing a segment. Close the record.",reaction:"He shuts both folders simultaneously. “Then no promotion may cite the missing hearing as a victory.”"}
   ]},
  'on-the-record':{kind:'final',when:{},cue:"Ron rehearses the final abstention without privileging either promotion",
   invite:"Camera test. Ask which side. Leave the camera running until both stop asking.",
   line:"The first “neither” will be at speaking volume. If anybody asks again, please move the microphone farther away.",
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
   line:"Can you book me a match this week? My agent says nobody wants another comeback. My agent is also the fellow pouring this, so I’m getting a second opinion.",
   replies:[
    {style:'straight',text:"You have a match this week. Show up ready to give them a fight.",promise:'appearance',reaction:"He raises his glass. “An offer; I had forgotten how short those can be.”"},
    {style:'bureaucrat',text:"Give me the terms you can actually meet, then we can discuss the next booking.",reaction:"He turns over a headshot. “A contract on the back; very independent cinema.”"},
    {breaks:true,text:"A film résumé does not automatically earn a match here.",reaction:"He presses the photo flat. “No. Apparently it earns a coaster.”"}
   ]},
  'cover-story':{kind:'beat',when:{minTrust:62},cue:"Liam asks to introduce his comeback publicly",
   plan:"Liam uses a mic segment to announce his wrestling comeback",
   line:"Give me a microphone; I can explain how I ended up here without bringing up the union. Give me the mic before I bring up the union.",
   replies:[
    {style:'straight',text:"You have the mic this week. Tell them why you want to fight here.",promise:'promo',reaction:"He takes a swallow. “Because it is wonderful—and apparently that answer is admissible.”"},
    {style:'believer',text:"They can want to see you without knowing every old credit.",reaction:"He covers the titles on his headshot. “Just the name, then; still a fairly good name.”"},
    {breaks:true,text:"Use your entrance for the introduction. I cannot spare time for the whole career story.",reaction:"He folds the photo. “A career reduced to walking distance; I have had shorter parts.”"}
   ]},
  'one-way-out':{kind:'beat',when:{minTrust:68},cue:"Liam chooses the next fight over an imagined movie rescue",
   plan:"Liam wrestles to establish his comeback rather than replay an old film fight",
   line:"Book me another match this week. I’m having a bloody excellent time in that ring. If a studio calls, tell them they can wait.",
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
    {style:'bureaucrat',ask:'defer',delta:-2,text:"I cannot commit that slot yet. Bring the proposal back in four weeks.",reaction:"He changes the date on the headshot. “Four weeks. I can count to four. I’ll leave the date on the glass.”"},
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

// One-off wrestler requests and their follow-up dialogue. Dilemma scheduling and effects are in dilemmas.js.
const DILEMMAS={
 'hold-complaint':{
  actor:1,week:2,ready:()=>w(1).lastSeen>0||state.week>=4,
  scene:()=>{
   const opponent=dilemmaOpponent(1);
   return dilemmaScene('Nobody wants Hold Two',`${w(opponent).name}: “Hold Two hurts like hell. Ask around. Nobody back here wants to work with him if he keeps doing it.”`,[
    dilemmaChoice('Tough it out. Listen to that pop.',()=>{
     dilemmaTrust(opponent,-10);dilemmaData().holdPop=state.week;
     dilemmaNote('The room heard you chose the pop. The next person asked to face 2 Holds wants a word.',[1,opponent]);
    }),
    dilemmaChoice('I’ll talk to him before the next bell.',()=>dilemmaFollow('hold-talk',state.week,{opponent}))
   ]);
  }
 },
 'hold-talk':{
  actor:1,scene:()=>dilemmaScene('Back to the training barn','You tell 2 Holds that the locker room refuses to take Hold Two as it is. He loosens Hold One and goes straight to Hold Two. “The changeover is the part they object to?”',[
   dilemmaChoice('Drop Hold Two. Stick with Hold One.',()=>{
    dilemmaData().holds='one';dilemmaTrust(1,-6);
    dilemmaNote('2 Holds closes the second page of his notebook. “All right. I’ll make One last.”',[1]);
   }),
   dilemmaChoice('Replace Hold Two. Take four weeks off to learn the replacement.',()=>{
    const d=dilemmaData();
    if(dilemmaAngry(1)){dilemmaTrust(1,-9);dilemmaNote('“Go Hold Two yourself.” He opens his notebook to Hold Two again.',[1]);return}
    dilemmaTrust(1,-5);d.holds='retrained';d.trainingReturn=state.week+4;
    dilemmaAwayNow(1,3);
    dilemmaNote('“A different hold? There are two. Give me four weeks and I’ll show you which one you’re talking about.”',[1]);
   })
  ])
 },
 'two-towers':{
  actor:1,week:5,
  scene:()=>dilemmaScene('A new nameplate','2 Holds holds up a sign that reads 2 TOWERS. “I can’t be toppled. You can see it from the parking lot.”',[
   dilemmaChoice('That’s incredibly insensitive. You’re staying 2 Holds.',()=>dilemmaRejectTowers()),
   dilemmaChoice('Give it a try. Maybe it’s been long enough.',()=>{
    dilemmaNameTowers();
    if(!state.card.some(s=>matchPeople(s).includes(1)))dilemmaBook(dilemmaPromo(1,null,'Solo address','I cannot be toppled.'),'two-towers');
   })
  ])
 },
 'towers-press':{
  actor:1,scene:()=>dilemmaScene('The local press calls','“Who signed off on 2 Towers, and why did the WWA think it belonged on the bill?”',[
   dilemmaChoice('I signed off. He’ll be back as 2 Holds.',()=>{
    dilemmaTrust(1,3);dilemmaNote('The local paper prints the booker’s statement and confirms 2 Holds will return.',[1]);
   }),
   dilemmaChoice('He wanted to try it. I should have pulled it.',()=>{
    dilemmaTrust(1,-5);dilemmaNote('The local paper runs the explanation. 2 Holds folds the story under the nameplate in his locker.',[1]);
   })
  ])
 }
};

Object.assign(DILEMMAS,{
 'forbidden-move':{
  actor:0,week:2,ready:()=>state.card.some(s=>s.kind==='match'&&matchPeople(s).includes(0)),
  scene:()=>dilemmaScene('The Forbidden Move','“Athens only whispers its name. Let me try the Forbidden Move in my match tonight, mortal. I need to feel the whole room go quiet before I can put it in my picture.”',[
   dilemmaChoice('Let Greek try it in his match.',()=>{dilemmaData().forbidden=state.week;dilemmaTrust(0,5)}),
   dilemmaChoice('Keep it out of the match. Your opponent has to work next week.',()=>{dilemmaTrust(0,-6);dilemmaNote('Greek closes his notebook. “My climax was on that page, mortal.”',[0])})
  ])
 },
 'demeter':{
  actor:0,week:6,scene:()=>dilemmaScene('Demeter’s big scene','“Book me against Demeter at the next big show, mortal. He’s never wrestled, and I’ve got him for one night. When the bell rings, I need the cameras rolling.”',[
   dilemmaChoice('Book Greek vs. Demeter at the next big show.',()=>{
    const due=monthlyEvent().week;
    dilemmaData().demeter={due,rehearsed:false};dilemmaTrust(0,7);
    dilemmaFollow('demeter-rehearsal',due);
    dilemmaScheduleCard();
   }),
   dilemmaChoice('Keep the next big show for wrestlers.',()=>{
    dilemmaTrust(0,-7);
    if(dilemmaAngry(0))dilemmaFollow('demeter-premiere',monthlyEvent().week+1);
    dilemmaNote('“You’re cutting my picture before we shoot it,” Greek says.',[0]);
   })
  ])
 },
 'demeter-rehearsal':{
  actor:0,scene:()=>dilemmaScene('The first rehearsal','Greek wants one free evening to get Demeter from the entrance to the final bell.',[
   dilemmaChoice('Spend an evening rehearsing.',()=>{dilemmaData().demeter.rehearsed=true;dilemmaTrust(0,4)}),
   dilemmaChoice('Leave the first take for show night.',()=>dilemmaNote('Greek tells Demeter to follow his lead when the bell rings.',[0]))
  ])
 },
 'demeter-premiere':{
  actor:0,scene:()=>dilemmaScene('A rival premiere','“They gave me the ring, mortal. You can see their banner in every shot.”',[
   dilemmaChoice('Watch Greek’s footage.',()=>{state.rep=clamp(state.rep-2);dilemmaNote('The rival’s name stays in the frame when the crowd stands up.',[0])})
  ])
 },
 'broom-angle':{
  actor:10,week:3,ready:()=>!dilemmaUnavailable(20),
  scene:()=>dilemmaScene('Sweep him off the show','“Book me a face-off with the Grinch, boss. I’ll bring the broom. After I’m done, keep him off the next two shows. Give me two weeks without bloody glitter.”',[
   dilemmaChoice('Talk to the Grinch about doing the angle.',()=>dilemmaFollow('broom-grinch')),
   dilemmaChoice('Keep the Grinch on the show.',()=>{
    dilemmaTrust(10,-5);dilemmaNote('Sweeps grabs the mic long enough to ask who’s been leaving glitter in his hall.',[10,20]);
    developStory(10,20,8,'Sweeps blamed the Grinch for the glitter in the hall.');
   })
  ])
 },
 'broom-grinch':{
  actor:20,scene:()=>dilemmaScene('A word with the Grinch','“How many shows am I supposed to be dead for? The hearts for next week are already cut.”',[
   dilemmaChoice('Ask him to sit out the next two shows.',()=>{
    if(w(20).trust>=65){dilemmaTrust(20,-3);dilemmaData().broomAngle=state.week;dilemmaBook(dilemmaPromo(10,20,'Face-off','Sweeps has one last mess to clear.'),'broom-angle');}
    else dilemmaFollow('broom-refusal');
   }),
   dilemmaChoice('Go back to Sweeps and pull the angle.',()=>{dilemmaTrust(10,-12);dilemmaNote('Sweeps asks whether you want him to clean up your promises, too.',[10,20])})
  ])
 },
 'broom-refusal':{
  actor:20,scene:()=>dilemmaScene('The Grinch says no','The Grinch collects his paper hearts and tells you he wants his spot on next week’s bill.',[
   dilemmaChoice('Book the angle anyway. Sit the Grinch out for two shows.',()=>{
    dilemmaTrust(20,-16);dilemmaData().broomAngle=state.week;dilemmaBook(dilemmaPromo(10,20,'Face-off','Sweeps has one last mess to clear.'),'broom-angle');
   }),
   dilemmaChoice('Tell Sweeps the angle is off.',()=>{dilemmaTrust(10,-12);dilemmaNote('Sweeps leaves the broom propped against your office door.',[10,20])})
  ])
 },
 'ultrabroom':{
  actor:10,week:7,scene:()=>dilemmaScene('The UltraBroom','“Buy me the UltraBroom, boss. Same floor, half the time. I checked three aisles. The SolidBroom Plus will do if the budget won’t stretch.”',[
   dilemmaChoice('Keep your broom. We’re saving the money.',()=>{dilemmaTrust(10,-4);dilemmaData().broomPrep={week:state.week,grade:'old'}}),
   {...dilemmaChoice(`Buy the UltraBroom · ${money(900)}`,()=>{state.cash-=900;dilemmaTrust(10,8);dilemmaData().broom='ultraBroom';dilemmaData().broomPrep={week:state.week,grade:'ultra'}}),disabled:state.cash<900},
   {...dilemmaChoice(`Buy the SolidBroom Plus · ${money(240)}`,()=>{state.cash-=240;dilemmaTrust(10,3);dilemmaData().broom='solidBroom';dilemmaData().broomPrep={week:state.week,grade:'solid'}}),disabled:state.cash<240}
  ])
 },
 'ring-fire':{
  actor:18,week:5,scene:()=>dilemmaScene('A replacement ring','“Please consider letting the old ring burn. The insurance payout could cover a new one. A modest share for arranging the fire would be courteous.”',[
   dilemmaChoice('Approve Charming’s plan to replace the ring through insurance.',()=>{
    dilemmaTrust(18,6);
    if(dilemmaRoll('ring-fire',.5)){state.cash+=650;dilemmaNote('A replacement ring arrives. After Charming’s share, the payout leaves $650 in the till.',[18]);}
    else{dilemmaAwayNow(18,3);dilemmaFollow('ring-replacement',state.week+1);dilemmaNote('Charming was identified on the security footage. He will miss four shows.',[18]);}
   }),
   dilemmaChoice('Tell Charming to leave the ring alone.',()=>{
    if(dilemmaAngry(18)){dilemmaFollow('ring-replacement',state.week+1);dilemmaNote('The ring burns anyway. Charming sends an invoice for his share.',[18]);}
    else{dilemmaTrust(18,-3);dilemmaNote('Charming puts his invoice away. “Of course. I’ll ask you first about the next one, too.”',[18]);}
   })
  ])
 },
 'ring-replacement':{
  actor:18,scene:()=>dilemmaScene('A show with no ring','Bev can rent a ring for tonight for $400 or move the show to her practice hall. The practice hall costs nothing extra and holds 30% fewer people.',[
   dilemmaChoice('Rent a ring for $400.',()=>{dilemmaData().rentWeek=state.week;dilemmaNote('Bev has a replacement ring coming on a flatbed.')}),
   dilemmaChoice('Move the show to Bev’s practice hall.',()=>{dilemmaData().moveWeek=state.week;dilemmaNote('Bev moves the show. The new room holds fewer people.')})
  ])
 },
 'hot-tea':{
  actor:18,week:9,ready:()=>!dilemmaData().teaBan,
  scene:()=>dilemmaScene('Tea in the front row','“A gentleman has agreed to sit in the front row. Please let Charming take a hot cup of tea down to the gentleman during the show. A public serving would make quite an impression.”',[
   dilemmaChoice('Let Charming take the hot tea to the front row during the show.',()=>{
    dilemmaData().tea=state.week;
    if(!state.card.some(s=>matchPeople(s).includes(18)))dilemmaBook(dilemmaPromo(18),'hot-tea');
   }),
   dilemmaChoice('Keep the tea away from the crowd. Give Charming a solo promo.',()=>{dilemmaTrust(18,-4);dilemmaBook(dilemmaPromo(18,null,'Solo address','Please remain seated. Charming has prepared a formal complaint about the front row, and every row deserves to hear it.'),'tea-complaint')})
  ])
 },
 'lemon-ask':{
  actor:20,week:3,ready:()=>!dilemmaUnavailable(23),
  scene:()=>dilemmaScene('Ask Lemon Tart','“I think she might like me. Could you find out whether she likes me the other way, too?”',[
   dilemmaChoice('Ask her yourself. It’ll mean more from you.',()=>dilemmaFollow('lemon-answer',state.week+1,{direct:false})),
   dilemmaChoice('I’ll ask her for you.',()=>dilemmaFollow('lemon-answer',state.week,{direct:true})),
   dilemmaChoice('Keep things professional.',()=>{dilemmaTrust(20,-3);dilemmaNote('The Grinch puts the note back in his pocket.',[20])})
  ])
 },
 'lemon-answer':{
  actor:23,scene:task=>{
   const answer=dilemmaLemonAnswer();
   const lines={interested:'“Tell him I’d go out with him. If he wants the whole town there, he can ask the whole town instead.”',unsure:'“I need time to think. I can still be his friend while I’m thinking.”',friend:'“I like him as a friend. Tell him exactly that.”'};
   return dilemmaScene(task.direct?'An evening with Lemon Tart':'The Grinch comes back',task.direct?lines[answer]:`The Grinch repeats what she said: ${lines[answer]}`,[
    dilemmaChoice(task.direct?'Spend the evening and take her answer back.':'Let her answer stand.',()=>{dilemmaData().lemon=answer;dilemmaNote(`Lemon Tart’s answer reached the Grinch. ${lines[answer]}`,[20,23])})
   ]);
  }
 },
 'tunnel-love':{
  actor:20,week:7,ready:()=>!dilemmaUnavailable(23),
  scene:()=>dilemmaScene('The Tunnel of Love','“I’ve made a tunnel of hearts. Can I open this week’s show by telling Lemon Tart what she means to me?”',[
   dilemmaChoice('Book the Grinch and Lemon Tart in this week’s opening slot.',()=>{
    dilemmaBook(dilemmaPromo(20,23,TUNNEL_OF_LOVE,'Lemon Tart, I’ve got something I want to tell you.'),'tunnel-love',{opener:true});
    dilemmaTrust(20,6);
   }),
   dilemmaChoice('Keep this one off the show.',()=>{
    dilemmaTrust(20,-5);
    if(dilemmaAngry(20))dilemmaData().tunnelInterruption=state.week;
    else dilemmaNote('The Grinch takes down the tunnel one paper heart at a time.',[20]);
   })
  ])
 },
 'dq-night':{
  actor:31,week:4,scene:()=>dilemmaScene('A night without decisive finishes','“I move that every match tonight end in a disqualification. The referee gets the final word. No one gets to argue about who would have won clean.”',[
   dilemmaChoice('Make every match end in a disqualification.',()=>{
    dilemmaData().dqWeek=state.week;dilemmaTrust(31,7);
    for(const segment of state.card)if(segment.kind==='match'&&dilemmaAllowsDQ(segment))segment.finish='Disqualification';
   }),
   dilemmaChoice('Keep the finishes the crowd paid to see.',()=>{
    dilemmaTrust(31,-5);
    if(dilemmaAngry(31))dilemmaData().dqInterruption=state.week;
    else dilemmaNote('Ron files a written disappointment and leaves the finishes alone.',[31]);
   })
  ])
 },
 'commissioner':{
  actor:31,week:8,scene:()=>dilemmaScene('Commissioner Toledo','“Appoint me commissioner and let me open the next three shows. If that requires a trial period, give me one show. The WWA needs leadership from precisely the middle of the room.”',[
   dilemmaChoice('Open the next three shows as commissioner.',()=>{dilemmaData().commissioner={start:state.week+1,end:state.week+3};dilemmaTrust(31,8)}),
   dilemmaChoice('Be our guest GM for one show.',()=>{dilemmaData().commissioner={start:state.week+1,end:state.week+1,guest:true};dilemmaTrust(31,4)}),
   dilemmaChoice('The WWA doesn’t need a commissioner.',()=>{dilemmaTrust(31,-4);dilemmaFollow('ron-floor',state.week+1)})
  ])
 },
 'ron-floor':{
  actor:31,scene:()=>dilemmaScene('A motion from the floor','“I move that each wrestler get the same time on the microphone.”',[
   dilemmaChoice('Put it to the locker room.',()=>{dilemmaTrust(31,3);dilemmaNote('The room votes to keep the shorter speeches. Ron records the result.',[31])}),
   dilemmaChoice('Dismiss the motion.',()=>{dilemmaTrust(31,-3);dilemmaNote('Ron records your dismissal on both sides of the page.',[31])})
  ])
 },
 'liam-drunk':{
  actor:34,week:3,scene:()=>dilemmaScene('Liam wants a fight','Liam staggers through the doorway, slurring. “IM READY FR AFIGHT BOSS GIMME A FIGHT.”',[
   dilemmaChoice('Book Liam in a match tonight.',()=>{
    const opponent=dilemmaOpponent(34);
    if(dilemmaBook(dilemmaMatch(34,opponent),'liam-drunk')){dilemmaData().liamDrunk={week:state.week,opponent};dilemmaTrust(34,3)}
   }),
   dilemmaChoice('You’re drunk. Get some water and I’ll see you next week.',()=>{
    dilemmaAwayNow(34,0);
    if(dilemmaAngry(34)){dilemmaTrust(34,-8);dilemmaNote('Liam picks a fight with the booker. The meeting ends there.',[34]);}
    else dilemmaNote('Liam takes the water. “Next week. Put my name down for next week.”',[34]);
   })
  ])
 },
 'kill-polanski':{
  actor:34,week:7,ready:()=>!dilemmaUnavailable(0),
  scene:()=>dilemmaScene('Kill Polanski','“That fuckin’ Greek Polanski took everything from me. Give me him in the ring. Put Kill Polanski on the bill.”',[
   dilemmaChoice('Book Kill Polanski. It’ll draw.',()=>{
    dilemmaBook(dilemmaMatch(34,0,KILL_POLANSKI),'kill-polanski');dilemmaTrust(34,8);dilemmaTrust(0,-12);
   }),
   dilemmaChoice('You’re in no shape to work with Greek.',()=>{
    dilemmaTrust(34,-5);
    if(dilemmaAngry(34)){
     dilemmaData().greekBrawl=state.week;developStory(34,0,18,'Liam went after Greek backstage when the booker refused the match.');
     dilemmaNote('Liam went after Greek backstage. Greek still wants his spot on the card.',[34,0]);
    }else dilemmaNote('Liam folds the handbill and says he can wait another week.',[34]);
   })
  ])
 },
 'dog-fetch':{
  actor:37,week:2,ready:()=>!dilemmaUnavailable(1),
  scene:()=>dilemmaScene('Fetch?','“Fetch? Play fetch?” The Dog is looking at the ball in your hand.',[
   dilemmaChoice('Who’s a good boy? Fetch?',()=>dilemmaFollow('dog-park'))
  ])
 },
 'dog-park':{
  actor:37,scene:()=>dilemmaScene('Across the park','You’re winding up for another throw when you see 2 Holds walking his own dog past the gate.',[
   dilemmaChoice('Call it a day. Get the Dog to come with you.',()=>dilemmaFetch(false)),
   dilemmaChoice('Keep playing fetch.',()=>dilemmaFetch(true))
  ])
 },
 'dog-owner':{
  actor:37,week:6,scene:()=>dilemmaScene('I need an Owner','“I am a stray. I need an Owner. Does the book say where you get one?”',[
   dilemmaChoice('Ask the Dog to find a candidate for next week.',()=>{
    const pool=state.roster.filter(r=>r.id!==37&&!dilemmaUnavailable(r.id));
    const candidate=pool[Math.floor(Math.random()*pool.length)].id;
    dilemmaFollow('owner-answer',state.week+1,{candidate});
   }),
   dilemmaChoice('Suggest Rudy and talk to him this week.',()=>dilemmaFollow('owner-answer',state.week,{candidate:2}))
  ])
 },
 'owner-answer':{
  actor:37,scene:({candidate})=>{
   const r=w(candidate),rudy=candidate===2;
   return dilemmaScene(`A word with ${r.name}`,rudy?'“I can barely keep track of a football. You want me to be responsible for somebody?”':`“The Dog says I’m his Owner. What did you tell him?”`,[
    dilemmaChoice('You could come to ringside with him and see how it feels.',()=>{
     if(r.trust>=60||dilemmaRoll('dog-owner-'+candidate,.5)){
      dilemmaData().owner=candidate;dilemmaTrust(37,7);dilemmaNote(`${r.name} agrees to be the Dog’s optional ringside second.`,[37,candidate]);
     }else{
      dilemmaTrust(candidate,-3);dilemmaFollow('owner-declined',state.week,{candidate});
     }
    }),
    dilemmaChoice('I’ll tell him it isn’t going to work.',()=>dilemmaFollow('owner-declined',state.week,{candidate}))
   ]);
  }
 },
 'owner-declined':{
  actor:37,scene:({candidate})=>dilemmaScene('Tell the Dog',`The Dog looks from you to ${w(candidate).name} and back again.`,[
   dilemmaChoice('Tell him gently that they passed.',()=>{dilemmaTrust(37,-3);dilemmaTrust(candidate,3);dilemmaNote('The Dog sets the spare whistle on the bench.',[37,candidate])})
  ])
 }
});

const DILEMMA_LIVE={
 towers:{title:'He’s brought the sign',line:'2 Holds walks toward the curtain with the 2 TOWERS sign. If the announcer reads the new name, it goes on the roster.',choices:['Cut off the announcement','Let him make the announcement']},
 tunnel:{title:'He found a microphone',line:'The Grinch is standing in the aisle with a string of paper hearts. Lemon Tart can see him from the curtain.',choices:['Get the show back on track','Let him finish and give Lemon Tart the mic']},
 dq:{title:'Ron won’t leave the referee alone',line:'Ron is headed back to ringside with a clipboard and an objection to every finish on the card.',choices:['Have the crew keep him backstage','Let Ron force disqualifications across the card']},
 forbidden:{title:'Greek signals for the Forbidden Move',line:'Greek looks to the curtain. His opponent is already asking what he’s doing.',choices:['Wave it off','Let Greek try it']},
 tea:{title:'Tea for the front row',line:'Charming stops the segment and lifts a cup of hot tea toward the man in the front row. He looks to the curtain for permission to take it down.',choices:['Call off the tea bit','Cue Charming to take the tea down']}
};
