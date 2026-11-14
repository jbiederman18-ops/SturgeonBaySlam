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
//     A scene may supply its own opening tell when the replies depend on a prop or specific setup.
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
//   beat = {kind?, when?, cue, invite?, day?, memory?, plan?, tell?, line, prompt?, replies}
//     prompt  optional shorter recap shown beside the replies. Defaults to the scene line.
//     cue     plain English for writers: when this should happen. The engine reads `when`.
//     invite  text that arrives instead of the usual invitation.
//     tell    scene-specific opening narration, in place of the usual mood or affection tell.
//     day     fixes the evening (e.g. 'Friday'); otherwise their `days` or a free weeknight.
//     memory  id in `memories`: answering this scene pins that polaroid to their window card.
//     plan    story-beat text pencilled onto the booking sheet in the week a reply’s promise is due.
//   Ask-only: askPromise:{kind:'title'|'promo'|'appearance'|'win'|'team', due:'event'|weeks, target?, plan?}
//     default {kind:'title',due:'event'} = a championship match at the next monthly show.
//   Reply fields: style, text, reaction, breaks?, promise?, due?, target?, delta?, ask?,
//     rep? (immediate reputation change), directSides? (bypass the offstage trust cap), note? (incident), plan? (add to this week's booking sheet).
//     charmingBuzz? marks a promised promo for Charming's rumor-thread show fallout.
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
    line:"“When the bell rang, all Greece shouted my name. What happens in the picture between the sound of the bell and the first person getting to their feet?”",
    replies:[
     {style:'believer',text:"Write down what you remember hearing before the cheering.",reaction:"“My own breath. I ought to let the audience hear that too.”"},
     {style:'hype',promise:'promo',text:"You have the mic next week. Tell the room what it sounded like from your corner.",reaction:"“Then let’s see if Athens can make precisely that noise twice.”"},
     {truth:true,text:"Ask the other corner what they heard. The winner only gets half the soundtrack.",reaction:"“An irritating note. I’ll leave the other half of the page blank for them.”"}
    ]},
   lost:{tell:"Greek is staring at a sketch of the ceiling, drawn from flat on his back.",
    line:"“{name} won. I could hear the bell from the floor, mortal. The sound of the crowd might as well have come from another city-state.”",
    replies:[
     {style:'believer',text:"Start the scene right there, with the bell and the view from the floor.",reaction:"“Yes. Let the camera stay down until the man decides he can move.”"},
     {style:'hype',promise:'rematch',text:"You and {name} have a rematch next week. See what the same bell sounds like standing up.",reaction:"“A second scene with the same cast. I shall insist on a different angle.”"},
     {truth:true,text:"Give {name} a scene in the picture too. They earned that finish.",reaction:"“Very well. Tell me what the winner saw when I was looking at canvas.”"}
    ]},
   stole:{tell:"Greek keeps looking back at the seats, where a few people are still talking about the match.",
    line:"“The crowd is still talking about that match. I need one moment for the picture, mortal. When did the hall stop feeling like a room full of separate people?”",
    replies:[
     {style:'believer',text:"Ask the other corner when they felt the crowd go with you both.",reaction:"“Two witnesses. I’ll give them a fresh page before telling them what I saw.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He looks back at the seats. “They stayed with me even when I lost. I ought to ask why.”"}]},
     {style:'hype',text:"Use their excitement to sell the next Greco Wrestling match.",reaction:"“Athens came for one match and left asking for another. Put that on the poster.”"},
     {style:'straight',text:"They all went quiet at once. Try starting the scene there and building back to the noise.",reaction:"“Silence before the chorus. Even the worst seats could hear it.”"}
    ]},
   flat:{tell:"Greek folds his notes away and counts the empty seats in the front row.",
    line:"“The room stopped watching halfway through. I could hear a single bag of nachos open. How do I keep all Greece looking at the ring next time?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Give the crowd a reason to choose a corner before the first grip.",reaction:"“A picture that starts with somebody to root for. I’ll write that before I write my entrance.”"},
     {style:'believer',text:"What did you think they were waiting to see? We can check that against the report.",reaction:"“I thought they wanted to see who could stay standing. Perhaps I took too long to ask.”"},
     {truth:true,text:"Cut the explanation. Show the crowd exactly what your opponent stands to take from you.",reaction:"“Very well. Athens needn’t sit through an overture to learn what’s at stake.”"}
    ]},
   kept:{tell:"Greek puts a tick next to tonight’s date in his research notebook.",
    line:"“You gave me {promise}, mortal. I can write a scene now that I couldn’t have written before the doors opened.”",
    replies:[
     {style:'believer',text:"Tell me the smallest detail you’d keep in that scene.",reaction:"“How long the ring feels when you can hear someone waiting at the other end.”"},
     {style:'hype',text:"Tell the crowd what changed for you tonight. See if they felt it too.",reaction:"“I’ll ask the cheap seats first. They’ve learned to make themselves heard.”"}
    ]},
   broken:{tell:"Greek shows you a page with tonight’s date at the top and nothing beneath it.",
    line:"“You promised me {promise}. I put it in my notebook, built my week around it, and now I have a scene with nothing in it.”",
    replies:[
     {style:'believer',text:"I broke my word. Tell me what you lost by getting ready for it.",reaction:"“A night I could have spent learning something that actually happened.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. I’ll put it in writing this time.",reaction:"“Pencil until the bell, mortal. We’ve both seen what ink is worth.”"},
     {breaks:true,text:"I can explain why the card changed after I’ve finished with the crew.",reaction:"“Then write the time down. I’ve already heard “later” from a man with a clipboard.”"}
    ]},
   benched:{tell:"Greek stands under the poster with notes from the seats tucked under his laurel.",
    line:"“{name} made the card. I saw it from the seats, mortal. When do I get back inside the ropes where the picture is supposed to take place?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Take notes when the crowd first sees you.",reaction:"“In the ring again. I’d almost forgotten how far it is from the curtain.”"},
     {style:'believer',text:"Use tonight’s seats as research. What was visible from there that you’d miss in the ring?",reaction:"“The losing corner had one person who never sat down. There’s a scene.”"},
     {truth:true,text:"Tell me what you’d do with that spot, leaving {name} out of it.",reaction:"“A scene of my own. Fine. It starts with both feet on the mat.”"}
    ]},
   idle:{tell:"Greek has drawn the same entrance on four different pages of his notebook.",
    line:"“I’ve been off the card long enough to draw four entrances and forget what the real one feels like. When does Athens get to see me again?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Remember how the curtain feels when it opens.",reaction:"“Then I won’t waste it by looking straight down at the floor.”"},
     {style:'believer',text:"Tell me what you remember about waiting for your name. Start with that.",reaction:"“Every footstep sounds like the announcer is coming to get you.”"},
     {style:'straight',text:"Give me the dates you can work. I’ll look for the first opening that fits.",reaction:"“Any Saturday. The business of Athens can move to Friday.”"}
    ]},
   cutIn:{tell:"Greek steps closer with his notebook open. He’s already written down the last few words.",
    line:"“I heard {name} from the end of the hall. Before Athens repeats that version as fact, I have a scene to add.”",
    replies:[
     {style:'hype',text:"Tell me one moment you’d put in the picture.",reaction:"“The bell. Everything that happened before goes quiet for one second.”",cases:[{when:{wonTonight:true},morale:2,reaction:"He straightens his laurel. “I’ll start with the win. The noise came a heartbeat later.”"}]},
     {style:'believer',text:"Keep their version too. Show me what changed from your side of the ring.",reaction:"“I’ll give them half the page. They can describe the corner I couldn’t see.”"},
     {style:'straight',text:"Wait here. I’ll finish with {name} and then hear you separately.",reaction:"“Very well. I’m marking the place where I was interrupted.”"}
    ]},
   skip:"Greek passes without stopping, the notebook tucked beneath his arm. He moves it to the side you aren’t on."
  },
  epilogue:{
   best:{title:"A Name All Greece Knows",line:"Greek taps his notebook. “They shout my name before the bell now. I used to wonder what that sounded like from the ring.”"},
   neutral:{title:"Still in Research",line:"Greek opens to a fresh page. “I have an entrance and half an ending. Fortunately, Athens puts on another show Saturday.”"},
   bad:{title:"An Empty Seat in Athens",line:"Greek looks back at the empty ring. “A man can learn a great deal from the seats, mortal. I had rather hoped to learn the rest in there.”"}
  },
  scenes:[
   {line:"Liam kicked me in the head once, mortal. Give me the microphone this week and I’ll challenge him to a Greco Wrestling match in front of all Athens.",replies:[
    {style:'hype',text:"Take the mic this week. Let Athens hear the challenge.",promise:'promo',reaction:"“Good. Bring the house lights up. I want to see who stands.”",
     cases:[{when:{lostLastShow:true},delta:-2,reaction:"Greek sets the laurel down. “They just saw me lose. I’ll give them the challenge, then ask why they want to see it.”"}]},
    {style:'believer',text:"Ask Liam in private. Find out if he wants a match before you make it public.",reaction:"“Very well. A private audience with the man who kicked me in the head.”"},
    {breaks:true,text:"Keep the challenge off the show for now. I need to know you can both make it to the bell.",reaction:"“You mean you don’t know which of us will kick first.”"}]},
   {line:"Ron won’t tell me whether Greco Wrestling is the greatest style in Greece. Let me ask the crowd on the microphone this week.",replies:[
    {style:'hype',text:"You have the mic this week. Ask what the crowd wants to see more of.",promise:'promo',reaction:"“An excellent question. Tell me where to stand so I can see the back row.”"},
    {style:'believer',text:"Ask Ron which exchange caught his eye. You’ll learn more from an observation than a vote.",sides:{31:2},reaction:"“I could use a witness. Even one who refuses to applaud.”"},
    {breaks:true,text:"Leave Ron out of it and let your next match make the argument.",reaction:"“So much for the speech. I had it down to eleven minutes.”"}]},
   {tell:"Greek lays Joan’s scarf across the open notebook.",line:"Joan gave me a scarf in the colors of her city-state. I want it in my wrestling picture. Is it the sort of thing a champion wears?",replies:[
    {style:'hype',text:"Thank Joan at ringside. Let her decide how she wants the scarf presented.",reaction:"“With the woman who brought it in the frame? An excellent idea.”"},
    {style:'believer',text:"Ask Joan why she brought it. Start the scene with her answer.",reaction:"“A prop with a history. I should have asked before choosing a lens.”"},
    {breaks:true,text:"Leave it with me at the ticket table. I’ll ask Joan when she comes by.",reaction:"“Very well, mortal. Don’t let anyone mistake it for a raffle prize.”"}]},
   {line:"My last opponent climbed to the top rope. Why would a Greco wrestler climb away from the wrestling? Put me back in the ring this week so I can make sense of it.",replies:[
    {style:'hype',text:"You have a match this week. Show the crowd what can happen with both feet on the mat.",promise:'appearance',reaction:"“Then the camera stays at eye level. Let the climbers look down.”"},
    {style:'believer',text:"Ask your opponent what they saw from up there. That could be a shot for the picture.",reaction:"“A view of Athens I cannot get without a ladder. Go on.”"},
    {truth:true,text:"Let them climb. Step out of range before you start taking notes.",reaction:"“You want me to move before I have the shot. Dreadful for continuity.”"}]},
   {line:"Liam left a wooden sword at my door. I recognize a prop when I see one. What does the man who kicked me in the head want me to do with it?",replies:[
    {style:'hype',text:"Give it back in public and tell him you want a wrestling match, with empty hands.",sides:{34:-3},reaction:"“An excellent image. Make sure the audience sees whose hand takes the sword.”",
     cases:[{when:{wonLastShow:true},delta:3,reaction:"Greek holds up the sword. “Athens already saw the win. One public return, and the next question is for Liam alone.”",sides:{}}]},
    {style:'believer',text:"Ask Liam what he meant by it before you turn it into a challenge.",reaction:"“I suppose even an insult can use a table read.”"},
    {breaks:true,text:"Lock it up. You can ask him after we finish the card.",reaction:"“Very well. Somewhere in Athens, a perfectly good first scene is gathering dust.”"}]}
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
    line:"“Hold One set the grip. Hold Two ended the match. I’ve written down a correction for each. Have you got a minute to look?”",
    replies:[
     {style:'straight',text:"Walk me through what your left boot was doing at the change.",reaction:"“Planted for once. Now for the other boot.”"},
     {style:'believer',text:"Use my wrist to show me the difference between the practice grip and the one you used.",reaction:"“Tell me where it starts to slip. Tap when it stops.”"},
     {style:'hype',promise:'promo',text:"Take the mic next week. Show the crowd both holds and the switch that won it.",reaction:"“Good. They can count the holds and I’ll count the time between them.”"}
    ]},
   lost:{tell:"2 Holds traces the gap in his Hold One diagram.",
    line:"“{name} got out of Hold One. I tried Hold Two. Next thing I know, the bell’s going. I need to see where the first grip opened.”",
    replies:[
     {style:'believer',text:"Show me slowly. I’ll watch for the first place the thumb moves.",reaction:"“I can use your eye. Mine was pointed at the canvas by then.”"},
     {style:'straight',promise:'rematch',text:"You have a rematch with {name} next week. Test the correction against the same opponent.",reaction:"“Good. I want the same wrist and another inch of attention.”"},
     {truth:true,text:"Take one night off from the grip. We can look at the report when your hand has rested.",reaction:"“The hand can rest. I am still bringing the notebook.”"}
    ]},
   stole:{tell:"2 Holds waits for the noise to stop before counting his grip corrections.",
    line:"“They stood up for the move between Hold One and Hold Two. I thought I was the only person who could see the thumb move.”",
    replies:[
     {style:'straight',text:"Turn the change toward the far seats next time. Everybody should see it coming.",reaction:"“I’ll adjust the stance. The thumb stays exactly there.”"},
     {style:'believer',text:"Show me where you thought you’d lose the grip. That’s probably when they stood up.",reaction:"“Right here. Good to know I was making them work too.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He studies his palm. “Even failure attracted close examination. Useful.”"}]},
     {style:'hype',text:"Use the switch in the next big match. They’ll remember how close it was tonight.",reaction:"“Good. I can compete under even closer observation.”"}
    ]},
   flat:{tell:"2 Holds repeats the grip facing the empty side of the hall.",
    line:"“The room went quiet by the time I showed Hold Two. I counted one person still watching my hands. What do the rest of them need?”",
    replies:[
     {style:'straight',text:"Turn the grip so the cheap seats can see the opponent trying to pull free.",reaction:"“The grip can face any direction. I’ll make sure the struggle faces them.”"},
     {style:'believer',text:"Show me once. I’ll stand at the far end and tell you where I lose the hands.",reaction:"“Bring the notebook with you. I want to know the exact seat.”"},
     {breaks:true,text:"Keep both holds and shorten the time between them. Give the crowd less waiting.",reaction:"“A timing problem. That I can work on.”"}
    ]},
   kept:{tell:"2 Holds ticks your promise beside a Hold One practice entry.",
    line:"“You made sure I got {promise}. I set the whole week’s drills around it. Do I keep that plan for next time?”",
    replies:[
     {style:'straight',text:"Put tonight’s result alongside the practice notes. Keep the parts that held up.",reaction:"“Two columns. Good. I can work with two columns.”"},
     {style:'believer',text:"Keep the routine for now. You had room to work and you used it.",reaction:"“Then I’ll start at the same time tomorrow. Hold One first.”"}
    ]},
   broken:{tell:"2 Holds leaves an empty practice line facing you, beneath a column for each hold.",
    line:"“I was ready for {promise}. It never happened. The drills are finished and both holds were ready when you called the show.”",
    replies:[
     {style:'straight',text:"Leave the slot blank in the book. I missed the commitment and the crew should see why.",reaction:"“I’ll leave the space the right size. It was a full entry.”"},
     {style:'believer',promise:'appearance',text:"You have a match next week. Let’s get the holds in front of somebody who can actually pull free.",reaction:"“I’ll circle the new date. A circle is easier to erase than a check mark.”"},
     {breaks:true,text:"For tonight, record that the card changed. I’ll explain to the crew before I give you another date.",reaction:"“All right. I’ll give them a new line to write on.”"}
    ]},
   benched:{tell:"2 Holds plants his feet on a parking stripe and runs the transition against thin air.",
    line:"“{name} got a match. I watched from the back and saw the space for Hold Two six times. Could use somebody to test that against.”",
    replies:[
     {style:'straight',text:"Show me the opening you saw. I’ll see if I can pull my wrist away before you take it.",reaction:"“Give me the wrist you actually use. I want to find out something useful.”"},
     {style:'believer',text:"Run the sequence with a training partner and I’ll watch both holds.",reaction:"“Only two things to watch. I appreciate that about you.”"},
     {truth:true,text:"Leave {name} out of the comparison. Pitch me a match you want for its own sake.",reaction:"“Somebody with two strong wrists. Start the search there.”"}
    ]},
   idle:{tell:"2 Holds has filled both sides of a page headed ONE and TWO.",
    line:"“Four weeks on the bench. Everybody at practice knows where I put my thumb before I do. I need a new wrist to test the holds on.”",
    replies:[
     {style:'straight',promise:'appearance',text:"You have a match next week. Use the correction on somebody who hasn’t seen it.",reaction:"“Good. Home corner or away corner, the wrist will be new.”"},
     {style:'believer',text:"Show me what you changed in those four weeks. I’ll start by checking the first grip.",reaction:"“Hold One first, of course. Stand close enough to see the thumb.”"}
    ]},
   cutIn:{tell:"2 Holds starts to switch grips, then stops to point at a gap between his hands.",
    line:"“{name} rolled out of Hold One. That proves there was a gap. A gap is something to fix.”",
    replies:[
     {style:'straight',text:"Start the grip over and stop just before they rolled. Let’s find where it opened.",reaction:"“There. I should be able to cover that with the thumb.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He resets both hands. “After a loss, I start with Hold One. Here’s where I’ll start tonight.”"}]},
     {style:'believer',text:"Ask where they stopped feeling pressure. You can settle the grip without naming anything new.",reaction:"“Two holds and a perfectly reasonable question. I can ask it.”"},
     {style:'bureaucrat',text:"Take it to practice with a referee. I’ll use the ref’s call for tonight’s result.",reaction:"“Fine. We can agree the grip opened even if that’s all we agree on.”"}
    ]},
   skip:'2 Holds walks past without breaking the rhythm. One grip, two grips, and back to one.'
  },
  epilogue:{
   best:{title:'A Grip You Can Trust',line:"2 Holds adjusts his thumb. “You noticed the correction. Both holds have benefited from your attention.”"},
   neutral:{title:'One, Two, Repeat',line:"2 Holds opens his notes. “Hold One at seven, Hold Two afterward. Mastery is not a seasonal arrangement.”"},
   bad:{title:'No Further Demonstrations',line:"2 Holds closes the practice door. “No audience tonight. Both holds still require work.”"}
  },
  scenes:[
   {line:"Three hours on Hold One. Look at the thumb. Half a millimeter closer and the wrist finally stays where I put it. Your arm available?",replies:[
    {style:'straight',text:"Show me once on the practice dummy so I can watch the thumb.",reaction:"“Stand here. If you can still see the knuckle, I’ve left room.”",
     cases:[{when:{lostLastShow:true},delta:1,reaction:"He sets the dummy on the mat. “Watch exactly where the thumb moves. That’s where Saturday’s grip opened.”"}]},
    {style:'believer',morale:2,text:"Use my wrist. Stop when I tap.",reaction:"“Excellent. A wrist that can tell me when I’ve found it.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He resets his heel. “Push harder than Saturday’s opponent. Then tap where there’s no room left.”"}]},
    {breaks:true,text:"Show me one set and we lock up. Write down where to start tomorrow.",reaction:"“I’ll mark the thumb position on the way out.”"}]},
   {line:"The man at the shop called Hold One a handshake. A match this week would give me a hand that actually tries to get away.",replies:[
    {style:'straight',text:"You have a match this week. Let’s see if the grip holds under pressure.",promise:'appearance',reaction:"“Good. I’ll bring an extra roll of tape and a very ordinary handshake.”"},
    {style:'believer',text:"Demonstrate on a training partner. Let the man at the shop try to pull free.",reaction:"“Anyone who calls it a handshake should know how to ask for their hand back.”"},
    {breaks:true,text:"Leave him to his handshake. Save the demonstration for a paying crowd.",reaction:"“Fine. He’s still going down as an unhelpful witness.”"}]},
   {tell:"2 Holds resets the stopwatch. The fingers on his other hand barely move.",line:"I gave Hold Two six extra minutes after the clock stopped. Now my hand won’t close for Hold One. How do we account for that?",replies:[
    {style:'straight',text:"Write down where the clock stopped. We’ll start there next session.",reaction:"“Hold Two gets the first six minutes. I can work with that.”"},
    {style:'believer',text:"Show me the footwork for both holds while your hand rests.",reaction:"“Hold One starts at the heel anyway. Very well. Watch here.”"},
    {truth:true,text:"Drop the grip for tonight. I need both your hands to work next show.",reaction:"“I can stop for the hand. The notebook is staying open.”"}]},
   {line:"The Dog rolled out of Hold One and called it an escape. I call it a misplaced thumb. Put me in a match this week so I can check the correction.",replies:[
    {style:'straight',text:"You have a match this week. Test the grip on someone trying to win.",promise:'appearance',sides:{37:-3},reaction:"“Good. I’ll take the same grip and see how long the wrist stays put.”"},
    {style:'believer',text:"Ask the Dog to repeat the roll at half speed. Watch when your grip opens.",reaction:"“If the Dog agrees to slow down, I’ll agree to look at the thumb.”"},
    {breaks:true,text:"Mark the escape as legal. We can argue about your thumb at practice.",reaction:"“Of course it was legal. I’m angry that it was available.”"}]},
   {line:"Someone put me in Hold Two and called it a headscissors. I’ve drawn what they did. Where did they go wrong?",replies:[
    {style:'straight',text:"Point to where you felt the pressure. We can work back from there.",reaction:"“Here. Much too high. Hold Two has no business being that high.”"},
    {style:'believer',text:"Ask them to put you back in it slowly. See what part of Hold Two you recognize first.",reaction:"“Good idea. I’ll explain which way their knees are supposed to go.”"},
    {breaks:true,text:"We can ask the referee what they saw. Leave their name for the hold out of it.",reaction:"“As long as the referee knows there are two boxes on the form.”"}]}
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
    line:"“Took me the whole afternoon to get the ring clean, boss. The crowd covered it in confetti in three seconds after I won. Grab the other end of the pan.”",
    replies:[
     {style:'believer',text:"I’ll hold the pan. You earned a chance to get this looking the way you want.",reaction:"“Thank you. Don’t tip it till I’ve got the shiny stuff off the apron.”"},
     {style:'straight',text:"Clear the steps first. The crew still has to carry gear down them.",reaction:"“Right. I’ll start where some bastard’s about to put a boot.”"},
     {style:'hype',promise:'promo',text:"You have the mic next week. Give the crew credit for helping you make a ring worth fighting in.",reaction:"“With pleasure. Then I’m telling the front row what a bin looks like.”"}
    ]},
   lost:{tell:"Sweeps cleans his boot heel, then the patch of floor beneath it.",
    line:"“{name} put me down after my foot gave way. I swept the mat myself, boss. Show me where I lost the footing.”",
    replies:[
     {style:'straight',text:"Try it slowly. Set both feet before you start to stand up.",reaction:"“I felt that. I was halfway up before the second boot was down.”"},
     {style:'believer',text:"We can walk it through after cleanup. Show me what it felt like before you went down.",reaction:"“Felt like something under the boot. I’m fairly bloody sure it was just me.”"},
     {style:'hype',promise:'rematch',text:"You have a rematch with {name} next week. Give yourself a chance to correct that step.",reaction:"“I’ll check my feet and the floor. In that order, if you’re watching.”"}
    ]},
   stole:{tell:"Sweeps sweeps beneath a chair dragged right up to the rail.",
    line:"“They got to their feet during our match. Then half the bloody room dropped its wrappers. What got them up, boss?”",
    replies:[
     {style:'believer',text:"The other corner almost had you and you got clear. That’s when people stood.",reaction:"“Then I’ll take the wrappers. The good ones can get stepped on twice.”"},
     {style:'straight',text:"Ask somebody from that row. I’ll finish the aisle while you listen.",reaction:"“I can listen and sweep. Most of them can barely cheer and hold a chip.”"},
     {style:'hype',text:"Put that match on the poster. The people who dropped those wrappers will bring somebody next time.",reaction:"“Fine. Put a bin by the poster so they can practice.”"}
    ]},
   flat:{tell:"Sweeps brushes a carefully folded ticket stub off the floor.",
    line:"“The crowd stopped watching long enough to fold a ticket into a boat. It’s under the bloody bench now. What should I change next time?”",
    replies:[
     {style:'straight',text:"Give people something clear to follow before there’s time for a craft project.",reaction:"“Right. Get to the bit where something actually moves.”"},
     {style:'believer',text:"Walk me through the part you cared about most. Let’s figure out why they missed it.",reaction:"“I can show you. Just watch your feet by the bench.”"},
     {truth:true,text:"Cut the slow part and let the crew call time from the curtain.",reaction:"“Fine. If they wave soon enough I can spare us another boat.”"}
    ]},
   kept:{tell:"Sweeps finishes a patch before offering his freshly wiped hand.",
    line:"“You came through on {promise}, boss. I had one less thing to sort out, so I could pay attention to the actual bloody mess.”",
    replies:[
     {style:'believer',text:"Tell me what it let you do that you couldn’t have done otherwise.",reaction:"“Get out there knowing the floor was going to be the only thing under my feet.”"},
     {style:'straight',text:"I checked it off the card. Tell Bev if you need a copy for your records.",reaction:"“Better make it two copies. The first one’s catching coffee by the till.”"}
    ]},
   broken:{tell:"Sweeps scrubs the threshold with short, furious strokes.",
    line:"“I made room for {promise}, boss. Never needed it, did I? I could have swept the storeroom in the time I spent standing ready.”",
    replies:[
     {style:'believer',text:"I left you waiting. Tell me what you put off so I can help make it right.",reaction:"“That storeroom. It’ll still be bloody awful when we get there.”"},
     {style:'straight',promise:'appearance',text:"You have a match next week. I’ll write down the time and tell you if it changes.",reaction:"“Fine. Clear the floor around the sheet so I can get a good look at it.”"},
     {breaks:true,text:"I’m handling the card change with Bev. I’ll give you an answer once we know why it happened.",reaction:"“Tell Bev where to find me. I’ll be doing something that goes where I put it.”"}
    ]},
   benched:{tell:"Sweeps collects glitter from the curb with increasing force.",
    line:"“{name} wrestled and I swept. I’d like to do both, boss. I’m running out of rubbish to talk to.”",
    replies:[
     {style:'believer',promise:'appearance',text:"You have a match next week. Bring the boots along with the broom.",reaction:"“Right. It’ll be bloody nice to have to clean my own corner again.”"},
     {style:'straight',text:"Tell me what you’ve been working on in the ring. I can watch a run-through after we clear the aisle.",reaction:"“I’ll sweep you a place to stand. You can tell me whether the landing looks right.”"},
     {truth:true,text:"Ask for the match you want. I can hire cleaning help without keeping you off the card.",reaction:"“Good. I’ll pick an opponent who doesn’t treat the floor like a bin.”"}
    ]},
   idle:{tell:"Sweeps tapes his dustpan handle, then sweeps up the torn backing.",
    line:"“Four weeks without a match, boss. My dustpan’s spent more time in the ring than my boots. Any use for the boots next week?”",
    replies:[
     {style:'believer',promise:'appearance',text:"You’re wrestling next week. Tell me which corner you want cleaned first.",reaction:"“Mine, then the other one. I’m trying to win something I can be proud of.”"},
     {style:'straight',text:"Show me the five minutes you’d put on the show. I’ll clear time to watch it.",reaction:"“I can do five. Keep the crew clear of the bloody mop till we’re through.”"}
    ]},
   cutIn:{tell:"Sweeps brushes a glitter trail into the pan directly between you.",
    line:"“Before {name} starts another sentence, who’s clearing this trail off the hallway floor? I’m sweeping it either way.”",
    replies:[
     {style:'believer',text:"Show me where to hold the pan. I’ll help finish the trail.",reaction:"“At the far end, boss. We’ll get the whole bloody thing in one pass.”"},
     {style:'straight',text:"Give the crew a specific job. Ask somebody here to carry the full bin out.",reaction:"“You heard the booker. This one goes all the way to the outside bin.”"},
     {style:'hype',text:"Move the conversation away from the dirt. I’ll make sure nobody walks through it while you sweep.",sides:{20:-2},reaction:"“Thank you. Best thing anybody’s said in this hallway all night.”"}
    ]},
   skip:"Sweeps cleans the grit around your shoes without meeting your eyes, then follows the trail past you."
  },
  epilogue:{
   best:{title:'A Clean Path Out',line:"Sweeps checks both sides of the doorway. “Your side, my side; dirt doesn’t get a side, boss.”"},
   neutral:{title:'Same Door Tomorrow',line:"Sweeps scrapes grit from a seam. “Lock up when you go; this little bastard has another think coming.”"},
   bad:{title:'Under Your Chair',line:"Sweeps drags your chair aside and sweeps beneath it. “Still angry with you, boss; still not leaving that filth.”"}
  },
  scenes:[
   {line:"Term Life wanted the replacement price of my broom. Someone tracked mud over the form while he was talking. Lift your bloody feet, boss, I’m sweeping both up.",replies:[
    {style:'believer',text:"Take the mic this week. Show the crowd what that broom does for their ring.",promise:'promo',sides:{17:3},reaction:"“A credit for the broom. Term Life can have the carbon copy.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He lifts the broom in both hands. “They saw what I won with. Now they can see what I had to clean first.”"}]},
    {style:'straight',text:"Get a price for a spare. Use this one until the floor’s clean.",reaction:"“He can insure the spare still in the wrapper. I’ve got work for this one.”"},
    {breaks:true,text:"Use the shop price and get back to the floor. Doors soon.",reaction:"“Right. Tell him the muddy form needed replacing too.”"}]},
   {tell:"Sweeps has a warm pizza pocket on a chair and a drift of crumbs at his feet.",line:"Holly brought me supper. Somebody took the napkin and left pizza crumbs down the aisle. How do you steal the one part of a meal you can’t bloody eat?",replies:[
    {style:'believer',morale:2,text:"I’ll keep the aisle clear while you sweep. Then we’ll find you a plate.",reaction:"“Thank you. Feet up down there. This is getting worse by the second.”"},
    {style:'straight',text:"Sweep the crumbs into the pan, then eat while it’s hot.",reaction:"“Two passes. Three if that one’s cheese. Then I’ll sit.”"},
    {breaks:true,text:"I’ll take the broom. You take five minutes for supper.",reaction:"“Fine. Push the broom toward the pan. Don’t spread it around like the last bloke.”"}]},
   {line:"The Grinch spelled THANKS FOR CLEANING in loose glitter. It’s already in the floorboards. I’d like to thank him with a bloody invoice.",replies:[
    {style:'believer',text:"Sweep it up. I’ll help you salvage a little for a thank-you card.",reaction:"“One pinch on the card and the rest in the bin. Get it in writing.”"},
    {style:'straight',text:"Tell him cards are welcome and loose glitter stays outside.",sides:{20:-2},reaction:"“I’ll tell him while he can still see how much is in the dustpan.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He brushes glitter out of the pan. “I’ll show the Grinch which part got stuck. Clear instructions would’ve saved me a fall last week.”"}]},
    {breaks:true,text:"Get it off the floor first. We can talk to him after doors.",reaction:"“Then he can admire how beautifully I’ve cleaned up his gratitude.”"}]},
   {line:"The wind’s blowing everything back under the door. I’ve swept the same leaf six times. Stand somewhere useful, boss.",replies:[
    {style:'believer',text:"Hold that door almost shut. I’ll help you get the pile through in one go.",reaction:"“That’s it. Little gap, big push. There goes the bastard.”"},
    {style:'straight',text:"Get the pile into a lidded bin here. We can carry it out shut.",reaction:"“Somebody in management has finally heard of a lid.”"},
    {truth:true,text:"Hand me the pan. Go get the leaves already piling up by the far door.",reaction:"“Another bloody door. Hold that pan flat while I’m gone.”"}]},
   {line:"There’s a ticket stuck to the floor with gum. I’m getting both up. Could I have a match this week so there’s a reason to put my boots on after?",replies:[
    {style:'believer',text:"You have a match this week. Give Bev the ticket if you can get it off in one piece.",promise:'appearance',reaction:"“Right. I can save the ticket or the gum. I’ll make an executive decision.”"},
    {style:'straight',text:"Get the ticket free and put it in lost and found. We can talk matches after.",reaction:"“It’ll have a perfectly clean corner to sit in until somebody comes back.”"},
    {breaks:true,text:"Scrape the gum now. The ticket can go if it tears.",reaction:"“Finally. Permission to disappoint a bloody piece of paper.”"}]}
  ]},
 18:{speaker:'Charming',style:'bureaucrat',place:'Afternoon tea at Maddox Hatter’s table',
  tells:{wary:"His thank-you note is addressed to the next of kin, just in case.",friendly:"He pours the tea first and casually slips a bill for the cup beneath the saucer.",warm:"He has put the good biscuits out and quietly recorded which guest cannot afford one.",devoted:"His four-page thank-you note includes a prepaid envelope for the return of any teeth lost during the visit."},
  moods:{
   low:{style:'believer',tell:"Charming has prepared a sympathy card for the referee and keeps adding black borders."},
   high:{style:'bureaucrat',tell:"Charming addresses a thank-you to the defeated corner and puts a price sticker on the ice pack."}
  },distrusts:'straight',
  stale:"Thank you. The same answer covers the last three requests. Please say which part of this request deserves an answer of its own.",
  heard:"{name} repeated the booker’s remarks about Charming. Please bring the next complaint to Charming directly.",
  invite:{wary:"Charming has a proposal for the next show. Maddox’s table, four o’clock.",friendly:"Please come to Maddox’s for tea. Charming has a proposal for the card.",warm:"Tea at four. Please bring the next card. Charming has a request about one of the open slots."},
  signoff:{wary:"Please leave the cup by the door. The next guest can decide whether to risk it.",friendly:"Thank you for coming. Please leave the other wrestlers’ envelopes on the table.",warm:"Thank you for hearing the proposal. Please tell the crew which part the booker approved.",devoted:"Please take a biscuit for the road. The ones marked for guests who declined are still available."},
  sore:"Please hear the whole request this time before deciding what Charming meant.",
  reacts:{kept:"Charming sends a thank-you and bills the opponent for the postage.",broken:"Charming forwards the unused invitation to the opponent’s creditors, marked “lovely opportunity.”"},
  jealous:"Charming watches {name} leave. “Please say whether {name} just got the spot Charming asked for.”",
  backstage:{
   won:{tell:"Charming has tucked an invoice under the ice pack intended for the other corner.",
    line:"“Please give {name} this ice pack. The bill is taped to the bottom. Losing the match should cost a little extra.”",
    replies:[
     {style:'bureaucrat',text:"Send the ice pack and throw away the bill.",reaction:"“Of course. The ice can go to the other corner free of charge.”"},
     {style:'believer',text:"Go tell {name} which move nearly beat you. Let the crew handle the ice.",reaction:"“Certainly. The escape just before the finish deserves a mention.”"}
    ]},
   lost:{tell:"Charming brings over the result slip and taps the referee’s name.",
    line:"“Please book a rematch with {name}. The referee made a bad call, and a second match would give the referee a chance to make it up to Charming.”",
    replies:[
     {style:'believer',text:"Tell me which call you dispute. I’ll ask the referee to walk us through it.",reaction:"“The call at the finish, thank you. Please have the referee explain it with both wrestlers present.”"},
     {style:'bureaucrat',promise:'rematch',text:"You and {name} have a fair rematch next week. The referee calls it straight.",reaction:"“Certainly. The second match will settle the argument if the first one did not.”"},
     {truth:true,text:"The result stands. If you want another match, pitch it on its own merits.",reaction:"“Very well. Please leave room on the proposal for a reason besides revenge.”"}
    ]},
   stole:{tell:"Charming watches the crowd leave and points out the seats that emptied first.",
    line:"“The crowd stood up for Charming’s match. Please tell the people who left early that the seats can be resold next time. A little embarrassment might keep them in the room.”",
    replies:[
     {style:'bureaucrat',text:"Thank the audience on behalf of both wrestlers. Leave the people who went home out of it.",reaction:"“Certainly. The other corner can sign the thank-you first.”"},
     {style:'believer',text:"Let people leave when they need to. Ask the crew what got the room on its feet.",reaction:"“Of course. The ushers saw when everybody stood up.”",cases:[{when:{lostTonight:true},morale:2,reaction:"“Of course. Please ask the ushers what got the crowd up before the losing result is read again.”"}]},
     {style:'hype',promise:'promo',text:"You have the microphone next week. Thank the crowd and tell them what the other wrestler did to make the match worth seeing.",reaction:"“Very well. Please give the other wrestler the credit before the boos begin.”"}
    ]},
   flat:{tell:"Charming sorts the audience survey into two piles. The harsher comments are on top.",
    line:"“The crowd went quiet. Please give Charming the names from the worst audience surveys. Reading the names aloud next week should teach the audience to be kinder.”",
    replies:[
     {style:'bureaucrat',text:"Use the comments to find one thing to fix. Keep the names off the show.",reaction:"“Of course. The worst comments can go at the top of the private list.”"},
     {style:'believer',text:"Show me the moment people stopped listening. Let’s start the next segment closer to the point.",reaction:"“Just after the opening speech. The next speech can get to the insult sooner.”"},
     {breaks:true,text:"Give me the surveys. I’ll review them and tell you how much time the next segment gets.",reaction:"“Certainly. Please return the useful comments without the names.”"}
    ]},
   kept:{tell:"Charming hands you a thank-you card and points to the seats that stayed quiet.",
    line:"“Thank you for delivering {promise}. Please send the crowd a reminder to applaud next time. The quietest seats can go to someone else.”",
    replies:[
     {style:'bureaucrat',text:"Keep the thank-you. Leave seating to the ushers.",reaction:"“Of course. Nobody will lose a seat over the volume of the applause.”"},
     {style:'believer',text:"Tell me what the booking did for you. We can talk next time about getting a bigger reaction.",reaction:"“The booking gave Charming a chance to be seen. Next time, a louder reaction would help.”"}
    ]},
   broken:{tell:"Charming holds out a clipboard with a formal complaint already signed in an unfamiliar hand.",
    line:"“You promised {promise}. The show went ahead without it. Please tell the locker room who broke the promise before somebody decides Charming failed to show up.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. I’ll put the new date beside the one I missed.",reaction:"“Certainly. Please leave both dates on the sheet.”"},
     {style:'believer',text:"I broke the promise. I’ll tell the crew it was my call. What did it cost you to prepare?",reaction:"“One evening and the price of getting to the hall. Thank you for asking.”"},
     {breaks:true,text:"Give me the final card. I’ll find out what happened before I make another promise.",reaction:"“Of course. Please tell the crew that Charming was ready to go on.”"}
    ]},
   benched:{tell:"Charming folds a copy of tonight’s card so only the names of the wrestlers who worked are visible.",
    line:"“{name} wrestled and Charming sat in the back row. Please put Charming on next week’s card. The front row deserves to see what the office was saving.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. Bring me a proposal for the other corner.",reaction:"“Certainly. Please leave the name blank until a proposal comes in.”"},
     {style:'believer',text:"Pitch me a match you’d want even if {name} had stayed home.",reaction:"“A wrestler the crowd adores would be ideal. The room should care who leaves disappointed.”"},
     {style:'straight',text:"I had a reason to book {name}. Give me a reason to book you that doesn’t depend on taking their spot.",reaction:"“Of course. Please consider whether the crowd would pay to see Charming lose.”"}
    ]},
   idle:{tell:"Charming lays four unanswered booking requests side by side.",
    line:"“Four weeks without a match. Please book Charming next week. A wrestler left off the card that long has time to tell every sponsor exactly who makes the card.”",
    replies:[
     {style:'bureaucrat',text:"Give me your latest match proposal. I’ll compare it with the slots I have open.",reaction:"“Certainly. The opponent’s name is on the first line.”"},
     {style:'believer',text:"Tell me which match you’ve wanted for all four weeks. Start with the opponent.",reaction:"“A hometown favorite, please. The crowd should have somebody to miss if the favorite loses.”"},
     {style:'straight',promise:'appearance',text:"You have a match next week. Leave the sponsors out of it.",reaction:"“Very well. The sponsors can hear about the match when the poster goes up.”"}
    ]},
   skip:"Charming holds the exit open with an elaborate bow, then lets the latch catch just before you reach it."
  },
  epilogue:{
   best:{title:'The Good Stationery',line:"Charming sets a cup down. “Thank you for booking the match. Please send any complaints straight to the recycling bin.”"},
   neutral:{title:'One More Cup',line:"Charming sets out a saucer. “Tea at four. Please leave one seat open for a wrestler who still answers the invitations.”"},
   bad:{title:'No Place Set',line:"Charming takes the chair away. “Please leave the good chair empty. The booker canceled the match. The next guest might have a better offer.”"}
  },
  scenes:[
   {tell:"Charming sets a sealed envelope beside the teapot and leaves a blank bid slip in front of you.",line:"A wrestler has been sleeping under the ring. Please announce an auction before the bell. The highest bidder gets the name, and the wrestler gets to hear the crowd laugh.",replies:[
    {style:'bureaucrat',text:"Cancel the auction. Send the wrestler to me privately so I can offer help.",reaction:"“Of course. Please tell the wrestler the name stays in this room.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"“Certainly. The name stays off the microphone. Last week’s winner can afford to lose an auction.”"}]},
    {style:'believer',text:"Find out whether the wrestler has somewhere to go tonight. Keep the name out of it.",reaction:"“Certainly. The auction can wait while a bed is found.”"},
    {breaks:true,text:"Give me the bid slips. I’ll tell the crew that anyone who needs a place to sleep can come straight to me.",reaction:"“Very well. The crowd will have to find another reason to laugh.”"}]},
   {line:"Please book the weakest wrestler on the roster against Charming this week. A quick win will look good on the tour poster.",replies:[
    {style:'bureaucrat',text:"You have a match this week. I’ll choose the opponent, and it’ll be a fair matchup.",promise:'appearance',reaction:"“Very well. Please wait to print the winner’s name until after the bell.”"},
    {style:'believer',text:"Give me one name and a reason the crowd would pay to see that match.",reaction:"“The crowd would pay to see how long a brave wrestler can keep getting up.”"},
    {breaks:true,text:"The card is full. If you want a spot next week, pitch me a competitive match.",reaction:"“Of course. A competitive match will require a less optimistic poster.”"}]},
   {tell:"Charming lifts the sugar bowl to show you a stack of folded slips.",line:"Please give Charming the microphone this week. The envelopes under the sugar bowls contain guests’ secrets. Any guest who wants a secret kept quiet can buy the envelope back.",replies:[
    {style:'bureaucrat',text:"You have mic time this week. Show the crowd an empty envelope and leave the real guests out of it.",promise:'promo',reaction:"“Certainly. The empty envelope will do. The sealed ones can stay at the table.”"},
    {style:'believer',text:"Bring me the envelopes. I’ll ask Maddox who’s been threatened and whether anyone paid.",reaction:"“Of course. Maddox kept a list of the guests who received envelopes.”"},
    {truth:true,text:"Give every envelope back unopened. If anyone paid, return the money before the show.",reaction:"“Certainly. The guests can have tea without paying to be left alone.”"}]},
   {line:"Ron refused to endorse the ambulance auction. The posters already say Ron approved it. Please let the posters go up anyway. Most people will believe the poster before asking Ron.",replies:[
    {style:'bureaucrat',text:"Print a correction as large as the endorsement and send Ron a copy.",sides:{31:-2},reaction:"“Of course. Ron can see the lie and the correction in the same size type.”"},
    {style:'believer',text:"Talk to Ron privately. Ask how he wants you to correct it before anybody sees the posters.",reaction:"“Very well. The posters can wait until Ron has had a chance to speak.”"},
    {breaks:true,text:"Pull the posters and cancel the auction. The loser gets a ride if they need one.",reaction:"“Certainly. The ambulance can go back to taking passengers without bids.”"}]},
   {line:"The last opponent asked for a reference for another promotion. Please book Charming this week so the letter can be read in front of a crowd. The first sentence says the other promotion should hire anybody else.",replies:[
    {style:'bureaucrat',text:"You have a match this week. Give the wrestler a fair reference in private and keep the letter off the show.",promise:'appearance',reaction:"“Of course. Please tell the announcer the letter has been withdrawn.”"},
    {style:'believer',text:"Write down one thing the wrestler did well in your match. Let them decide whether to use it.",reaction:"“The wrestler fought back after the first knockdown. That can go in the letter.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"“Last week’s loss already proves the wrestler can put up a fight. The reference can say so.”"}]},
    {breaks:true,text:"Tell the wrestler today that you won’t write the reference. Give them time to ask someone else.",reaction:"“Certainly. The refusal can be delivered before the other promotion stops taking calls.”"}]}
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
    line:"“I won! My opponent had both arms around me before the bell. I’m making a thank-you because that’s almost a hug even if I had to get loose!”",
    replies:[
     {style:'hype',promise:'promo',text:"You have the mic next week. Thank them for a good match and let the crowd cheer for both of you.",reaction:"“One cheer for the match and one for everybody who helped make it!”"},
     {style:'believer',text:"Ask your opponent if they’d like the card. Give them space to say no.",reaction:"“I can give them the tiny card first. Oh. I can ask first!”"},
     {style:'straight',text:"Save the card until the other wrestler has had time to get changed.",reaction:"“A later surprise! I can hold onto it without being in their way.”"}
    ]},
   lost:{tell:"The Grinch straightens a crumpled heart with both palms.",
    line:"“They pinned me flat for THREE seconds. That’s commitment! Do I thank my opponent for the embrace now or make a sign first?”",
    replies:[
     {style:'believer',text:"Keep the heart here. The match already gave you both something worth celebrating.",reaction:"“A little thing just for me to keep? I think I can do that.”"},
     {style:'hype',text:"Hold the sign up for the crew who stayed to help. Let them choose whether to come over.",reaction:"“Crew appreciation! I’ll leave a path wide enough to walk past.”"},
     {truth:true,text:"You lost a match you wanted to win. You’re allowed to feel disappointed before you thank anybody.",reaction:"“I did want to win. Can I sit with that for just a little while?”"}
    ]},
   stole:{tell:"The Grinch has looped streamers around both wrists and keeps waving back toward the hall.",
    line:"“They shouted together! Do you think we could do that again without me having to ask for it first?”",
    replies:[
     {style:'hype',text:"Leave them a pause next time. Let the crowd start the chant.",reaction:"“Let them surprise me? I love a surprise I don’t have to set up!”"},
     {style:'believer',text:"Save one streamer and offer the rest to whoever wants a souvenir.",reaction:"“One for me and a whole handful of memories for everybody else!”",cases:[{when:{lostTonight:true},morale:2,reaction:"He winds it around his wrist. “Lost a match, found a whole room of friends!”"}]},
     {style:'straight',text:"Find the moment they joined in. We can build another match that gives them room to do it.",reaction:"“Just after I held still for once! I can practice holding still enthusiastically.”"}
    ]},
   flat:{tell:"The Grinch adds another exclamation mark to a banner barely wide enough for its first word.",
    line:"“The room barely made a sound. I think they were saving their voices for a bigger welcome! Can I start next week with twice as much banner?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Try one simple chant and wait for an answer.",reaction:"“One short chant! I’ll make it very easy to shout back.”"},
     {style:'believer',text:"Show me what you wanted them to join in on. I’ll tell you where I stopped following.",reaction:"“Right here, when I unfolded the part that covered the first part!”"},
     {breaks:true,text:"Leave the banner at home for one show. Give the crew a quick entrance they can set up.",reaction:"“A short welcome. I’ll practice using my arms instead of paper.”"}
    ]},
   kept:{tell:"The Grinch presents a paper chain with a heart for each member of the crew.",
    line:"“You came through on {promise}! I made a thank-you chain long enough for the entire crew. Could somebody hold the end?”",
    replies:[
     {style:'hype',text:"Invite a crew member to add the final link if they want to.",reaction:"“Their own link! I made one wide enough to sign!”"},
     {style:'believer',text:"I’ll hold it steady while you put the last heart on. Then we’ll see where it can go.",reaction:"“It’s almost big enough for the whole door! I can leave a gap that lets the door open.”"}
    ]},
   broken:{tell:"The Grinch is expanding a sign into a much larger sign.",
    line:"“We missed {promise}. I made a sign for it and everything. Maybe I should make the sign bigger so we can’t miss it next time?”",
    replies:[
     {style:'believer',text:"I forgot the commitment. Tell me what you’d planned, so I understand what I missed.",reaction:"“I planned a place for everybody. I was especially excited about the little one at the end.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. Keep one spot on the sign for the date.",reaction:"“A sign with a date I can point at! I’ll leave room around it!”"},
     {breaks:true,text:"Keep the sign boxed until we have a new plan. I owe you an answer first.",reaction:"“I can keep the box closed. Could I write “ask first” on the lid?”"}
    ]},
   benched:{tell:"The Grinch carries a streamer across the parking lot like a welcome arch for passing cars.",
    line:"“They cheered for {name}! I cheered too! Can you find me a match so I can do the cheering from inside the ropes next time?”",
    replies:[
     {style:'hype',promise:'appearance',text:"You have a match next week. Give the crowd a welcome from your own corner.",reaction:"“A home corner! I’ll leave everybody enough room to wave.”"},
     {style:'believer',text:"You can be happy for {name} and still ask me for a spot. Tell me what kind of match you want.",reaction:"“One where the other person has somebody to cheer for them too!”"},
     {style:'straight',text:"Pitch an entrance you can do with one roll of streamers. I’ll see what the crew has time for.",reaction:"“One roll, two corners, everybody can see over it. I have so many ideas!”"}
    ]},
   idle:{tell:"The Grinch carries four Saturdays’ worth of hearts in an overfilled envelope.",
    line:"“Four weeks off the card! I’ve made a heart for each Saturday. I’m running out of wall and I have more Saturdays in me!”",
    replies:[
     {style:'hype',promise:'promo',text:"You have the mic next week. Pick a heart and tell the crowd what kept you making them.",reaction:"“I can tell them about the first one. That’s the one I started making for myself.”"},
     {style:'believer',text:"Bring one to the lobby and save the rest. Let people see what you’ve been working on.",reaction:"“A tiny exhibition! I’ll only use room people can walk around.”"}
    ]},
   cutIn:{tell:"The Grinch gathers a loose streamer while beaming at the approaching broom.",
    line:"“{name} wants to talk about the floor! That means the decorations committee has another volunteer! Where shall we start?”",
    replies:[
     {style:'hype',text:"Start with your own corner. Hang anything that sheds away from the aisle.",reaction:"“A little party in the air! I’ll keep the bits where the broom can’t find them.”"},
     {style:'believer',text:"Ask where the broom catches. Then offer to clear that part yourself.",reaction:"“I can move a chair without tying a bow on it first. Watch!”"},
     {style:'straight',text:"Clear the doorway before we talk about decorations. People need to get out.",reaction:"“Of course! Waving from here still counts as a goodbye!”"}
    ]},
   skip:"The Grinch hurries past with an unfinished WELCOME BACK banner, adding hearts for your next conversation."
  },
  epilogue:{
   best:{title:"Everybody Gets a Chair",line:"The Grinch adds another heart. “You helped me welcome so many people! Naturally, I have invited all their friends!”"},
   neutral:{title:"More Paper Needed",line:"The Grinch measures a new banner. “So many lovely evenings; I am making room for everybody who could not stay!”"},
   bad:{title:"An Even Bigger Welcome",line:"The Grinch tapes two banners together. “We missed each other so often; the next hello deserves to be ENORMOUS!”"}
  },
  scenes:[
   {line:"I made a heart big enough to see from the next town! Can I take the mic this week and ask whether the crowd wants that, streamers, or a choir?",replies:[
    {style:'hype',text:"Take the mic this week. Show them the heart and let them choose whether they want to join in.",promise:'promo',reaction:"“A show of hands! Mine are both up!”",
     cases:[{when:{lostLastShow:true},delta:-1,reaction:"He hugs the heart. “I made the middle before I lost. Could I show that bit first?”"}]},
    {style:'believer',text:"Try the heart by the entrance. People can stop for a photo on the way in.",reaction:"“A heart they can walk up to! I’ll leave room on either side!”"},
    {breaks:true,text:"Bring one decoration you can carry yourself. The crew has a whole show to set up.",reaction:"“One trip! I can carry a surprising amount if I walk sideways.”"}]},
   {line:"The crew said “please, no more hearts.” They must be overwhelmed. Should I make one giant heart so they have fewer things to carry?",replies:[
    {style:'hype',text:"Thank the crew from your own corner. You can make it big without giving them anything to hang.",reaction:"“A thank-you loud enough to travel on its own!”"},
    {style:'believer',morale:2,text:"Keep the hearts at your own table. Let the crew come over when they have time.",reaction:"“A little table they can visit! I’ll keep the walkway clear.”"},
    {truth:true,text:"They’re asking you to stop bringing them hearts. The kind thing is to listen.",reaction:"“Oh. I can do that. Will you tell me if I start doing it again?”"}]},
   {line:"Sweeps brought back my tinsel in his very own dustpan. He shouted my name the whole way! Where shall I put his contribution to the decorations?",replies:[
    {style:'hype',text:"Hang the tinsel on your own table where it won’t shed over his aisle.",sides:{10:-2},reaction:"“A little display in honor of his very personal delivery!”"},
    {style:'believer',text:"Ask Sweeps what decoration would make his cleanup easier. Try that one first.",reaction:"“I’ll ask with both hands empty so he can see I’m listening.”"},
    {breaks:true,text:"Bag the tinsel and clear the aisle before doors.",reaction:"“A bag with a bow! The bow can go on my side of the door.”"}]},
   {line:"The crew asked me to bring ice for their party. The cooler has room for ice and at least twelve hearts. Can I use the mic this week to tell everyone where to come?",replies:[
    {style:'hype',text:"You have mic time this week. Invite the crowd to thank the crew. Check with the crew before inviting anybody to their party.",promise:'promo',reaction:"“A whole room cheering for the crew! They can keep all the ice!”"},
    {style:'believer',text:"Bring the ice they asked for and offer to help set up.",reaction:"“I can make sure nobody’s lemonade worries about being warm.”"},
    {breaks:true,text:"Drop off the ice and let the crew throw their own party.",reaction:"“I’ll put one tiny heart on the outside where it can’t get in the drinks.”"}]},
   {tell:"The Grinch unrolls a banner covered in paper hearts. One space is still empty.",line:"One paper heart for every front-row seat! I left the center blank in case somebody wants to bring one for me. Will you give me a match so I can hang it in my corner?",replies:[
    {style:'hype',text:"You have a match this week. Hang it in your corner where the crew can leave it alone.",promise:'appearance',reaction:"“Their side gets to decide what happens in the middle!”",
     cases:[{when:{eventWeek:true},morale:2,reaction:"He checks the empty center. “A tour-show crowd! I might need to leave room for two stars!”"}]},
    {style:'believer',text:"Keep the space open and put the banner where people can visit it on their own.",reaction:"“Imagine somebody bringing a star! It’s big enough for a star!”"},
    {breaks:true,text:"Put a removable heart in the gap while the banner’s hanging. Leave the tape where anyone can reach it.",reaction:"“A heart with a spare heart underneath! I can make that fit.”"}]}
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
    line:"“My name is in the winning box. Two people have just called that an endorsement of their side. Please help get the result out before a third person says that.”",
    replies:[
     {style:'bureaucrat',text:"Post the result by itself. Leave the rival statements off the sheet.",reaction:"“One box. One winner. Nobody needs a second column.”"},
     {style:'straight',text:"Go shake the other wrestler’s hand. Let the result speak for both of you.",reaction:"“A handshake carries no vote. I can make it brief.”"},
     {style:'hype',promise:'promo',text:"You have the mic next week. Read the result and close the discussion.",reaction:"“One reading. Who’s in charge of taking the microphone away?”"}
    ]},
   lost:{tell:"Ron has crossed out both proposed explanations and left the result visible.",
    line:"“I lost to {name}. Three people are now debating what would have happened if nobody had rung the bell. I would like them to consider stopping.”",
    replies:[
     {style:'straight',text:"Leave the result up. Tell me one thing you’d change about your own match.",reaction:"“I’d go for the grip before there was time for a motion from the floor.”"},
     {style:'bureaucrat',promise:'rematch',text:"You and {name} have a rematch next week. Treat it as its own match.",reaction:"“Good. New date. The old result still goes on the previous page.”"},
     {truth:true,text:"Point them at the posted result and walk away. You have no obligation to hear all three arguments.",reaction:"“I can walk quite fast when I have no position to defend.”"}
    ]},
   stole:{tell:"Ron prepares a single form for noise from both sides of the hall.",
    line:"“Both corners had the room shouting. For once no one could tell which side made more noise. Can we please leave it there?”",
    replies:[
     {style:'bureaucrat',text:"Record it as the crowd reaction for the whole match. One entry.",reaction:"“Perfect. No separate totals. No opportunity to demand a recount.”"},
     {style:'straight',text:"Save the exchange that made both sides lean in. That’s the part to build on.",reaction:"“Just before the count. Nobody was arguing about the count yet.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He leaves the loss below the timestamp. “Both facts can occupy the same page.”"}]},
     {style:'believer',text:"Ask two people by the door what they heard. Put their answers side by side.",reaction:"“Two observations. I’ll stop them if either calls theirs a verdict.”"}
    ]},
   flat:{tell:"Ron times an empty stretch on a survey sheet and taps the pen faster every second.",
    line:"“The crowd stopped listening while two people argued in the ring. I timed it. Two minutes. If someone says three, the clock is coming with me.”",
    replies:[
     {style:'bureaucrat',text:"Mark the point they looked away and the point they turned back.",reaction:"“I can measure those. To the second, if the room insists on arguing.”"},
     {style:'straight',text:"Give me the one line that ought to survive a shorter segment.",reaction:"“The line that ends the argument, naturally. I can say it very clearly.”"},
     {breaks:true,text:"The crew is locking up. Save the times and we’ll review the report tomorrow.",reaction:"“Fine. I’m withdrawing the clock from tonight’s proceedings.”"}
    ]},
   kept:{tell:"Ron has centered the fulfilled commitment between two identical tabs.",
    line:"“You delivered {promise}. Both corners have the same copy of the result. I intend to object to any further discussion of whether it occurred.”",
    replies:[
     {style:'bureaucrat',text:"Mark it fulfilled and attach the original. Close the file there.",reaction:"“Good. One copy can remain closed in each corner.”"},
     {style:'straight',text:"Take the evening off. Nobody needs another hearing about a thing that happened.",reaction:"“That is a motion I can decline to put to a vote.”"}
    ]},
   broken:{tell:"Ron sets the promise and the result on opposite sides of a ruler.",
    line:"“I have {promise} written down. The card shows something else. Two people already want me to say which of them is responsible.”",
    replies:[
     {style:'bureaucrat',text:"Put the promise beside the card. I’ll initial the scheduling error.",reaction:"“Both documents, one correction. An entirely tolerable amount of paperwork.”"},
     {style:'straight',promise:'appearance',text:"I missed it. You have a match next week. Start a new entry for it.",reaction:"“Good. The new entry won’t erase the old one.”"},
     {breaks:true,text:"Give me the final card and I’ll check the change with the crew before we discuss a new booking.",reaction:"“Very well. I’ll put the opinion sheets under the pile where they belong.”"}
    ]},
   benched:{tell:"Ron has folded the programme so the occupied slot and his empty space are equally visible.",
    line:"“{name} wrestled and I didn’t. There are at least two interpretations going around about whose side that puts you on. I’m asking for a match.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. I’ll record that as a scheduling decision.",reaction:"“Use the middle of the page, please. I want to see how they argue with that.”"},
     {style:'straight',text:"Tell me the matchup you’re asking for. Leave the argument about tonight outside.",reaction:"“One opponent, please. Somebody willing to hear one bell.”"},
     {style:'believer',text:"I’ll hear your booking request on its own. We can do it after the hallway clears.",reaction:"“An audience of one. Thank you. That’s more than enough for a request.”"}
    ]},
   idle:{tell:"Ron aligns four unused passes and leaves a space for a fifth.",
    line:"“Four weeks available and four weeks off the card. Somebody is calling my absence a statement. I’d like to make a booking request in person.”",
    replies:[
     {style:'bureaucrat',promise:'appearance',text:"You have a match next week. I’ll write down the date as you watch.",reaction:"“Good. A date can have a place on the calendar without taking a side.”"},
     {style:'straight',text:"Tell me what match you want and when you’re available. I can consider that.",reaction:"“Saturday. One opponent. No speeches from the floor.”"}
    ]},
   cutIn:{tell:"Ron has counted three objections on the back of his form and raises a pen before the fourth.",
    line:"“{name} has had a turn. I want to put one fact on the record and close the hearing before somebody asks for rebuttals.”",
    replies:[
     {style:'bureaucrat',text:"Give me your account. I’ll enter both and close the file.",reaction:"“Two entries. No supplementary statements. A splendidly short file.”"},
     {style:'straight',text:"Give me the one fact that changes what I should do next.",reaction:"“An excellent constraint. It will rule out almost every sentence I’ve heard tonight.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He folds the form. “I lost. The result does not require a dissenting opinion.”"}]},
     {style:'believer',text:"I’ll hear you separately in a minute. Nobody gets interrupted to gain a turn.",reaction:"“Fine. I’d like to note the minute at which the interruption ends.”"}
    ]},
   skip:"Ron walks past exactly between you and the other corner, acknowledging neither with equal precision."
  },
  epilogue:{
   best:{title:"Minutes Closed",line:"Ron closes two folders at once. “We achieved several weeks without a demand for allegiance. I am prepared to record the relief.”"},
   neutral:{title:'Pending Further Review',line:"Ron clicks the pen. “Both accounts are filed together. Anyone reopening the question can file a request in silence.”"},
   bad:{title:'Entered Without Comment',line:"Ron pushes two chairs back with equal force. “No assessment entered. No endorsement entered. NO further questions.”"}
  },
  scenes:[
   {line:"Both title contenders sent written complaints about who gets the next match. The third envelope contains my request that both of them stop writing. I’d like the microphone this week.",replies:[
    {style:'bureaucrat',text:"You have mic time this week. State the same title criteria for both contenders.",promise:'promo',reaction:"“Excellent. Let the record show that the clock started at the same time for both.”",
     cases:[{when:{champion:true},delta:2,reaction:"He puts the belt beside the envelopes. “Same criteria for the champion too. Its present location grants no extra speaking time.”"}]},
    {style:'straight',text:"Give me one concrete issue to resolve. I’ll use it to answer both contenders in writing.",reaction:"“One issue. I can fit that on a page and lock the other three in a drawer.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He lays a result slip beside the letters. “Start with who actually won. I find that easier to say after a loss than either of these people does.”"}]},
    {breaks:true,text:"The contenders can make their cases after I finish the card. Leave the mic out of it.",reaction:"“Fine. Tell both of them when. I’m through opening envelopes today.”"}]},
   {line:"The dessert table has been arguing about pie and brownies for eleven minutes. At twelve I am withdrawing the table. Which minute are we on?",replies:[
    {style:'bureaucrat',text:"Give both dishes the same space. Record that you abstained.",reaction:"“Equal space, no preference, and a very short record. Finally.”"},
    {style:'straight',text:"Set both plates out now. People can choose for themselves.",reaction:"“There will be no roll call. Everyone hear that? No roll call.”"},
    {breaks:true,text:"Serve the cut brownies now. Put the pie out once someone cuts it.",reaction:"“You may run the line. I am recusing myself from the knife.”"}]},
   {line:"Greek has asked three times whether I endorse Greco Wrestling. I have abstained three times. I would like to abstain once at a volume he can hear.",replies:[
    {style:'bureaucrat',text:"Send Greek the same answer in writing and say the question is closed.",sides:{0:-2},reaction:"“One copy, one signature, and no room for another box to check.”"},
    {style:'straight',text:"Offer to watch his match and give one factual observation. Leave the endorsement alone.",reaction:"“I can tell him what I saw. I can even do it without using the word supreme.”"},
    {truth:true,text:"Walk away before your abstention becomes the loudest opinion in the room.",reaction:"“I will have no opinion from the other end of the hall.”"}]},
   {line:"Two fans are arguing whether my headlock or wristlock is better. One brought a petition. Book me a match this week so they have something else to do with their hands.",replies:[
    {style:'bureaucrat',text:"You have a match this week. Enter both petitions and let the crowd watch what you use.",promise:'appearance',reaction:"“Entered. The referee will be authorized to count falls and nothing else.”"},
    {style:'straight',text:"Thank both fans and tell them you change holds to fit the match.",reaction:"“I can say both received due consideration. Once.”"},
    {breaks:true,text:"Leave the petitions here and go warm up. The fans can keep talking if they need to.",reaction:"“They may keep talking. I will be in a different room.”"}]},
   {line:"Charming printed a card thanking me for endorsing an auction of an ambulance ride. I endorsed no auction. I also refuse to be listed as the opposition.",replies:[
    {style:'bureaucrat',text:"I’ll record that you gave no endorsement and ask Charming to issue a correction.",sides:{18:-2},reaction:"“Please print that exactly. Do not add a tally of who agrees.”"},
    {style:'straight',text:"Tell Charming yourself. I’ll be there as a witness if he disputes what you said.",reaction:"“One witness, two ears. That should be quite sufficient.”"},
    {breaks:true,text:"Pull every copy from the desk and leave the correction to me.",reaction:"“Fine. Please get the one he keeps trying to pin to my coat.”"}]}
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
    line:"“That’s a win, that’s my name they’re shouting, and that’s my drink by the door. Did I finally give them something better than the old headshot?”",
    replies:[
     {style:'straight',text:"You earned the win. Let that be the credit you lead with tonight.",reaction:"“Bold print, then. I can hear the bastard from here.”"},
     {style:'bureaucrat',text:"Put the result and the date in your booking file. That’s something an agent could actually use.",reaction:"“A current credit. I’ll need to find the top of the page again.”"},
     {style:'believer',text:"Enjoy it with the other corner. They helped give the crowd a fight worth remembering.",reaction:"“I can buy them a drink. The one in my hand is spoken for.”"}
    ]},
   lost:{tell:"Liam props the result sheet against his flask and tries to flatten it with a knuckle.",
    line:"“Write down that {name} beat me. In another drink I’ll be telling the bar they couldn’t get me out of the bloody ring.”",
    replies:[
     {style:'bureaucrat',text:"Let’s look at the result and the finish while it’s still fresh.",reaction:"“Fine. Start with the bit where I stopped thinking it could end.”"},
     {style:'straight',promise:'rematch',text:"You and {name} have a rematch next week. Bring one change to the finish.",reaction:"“Same cast, shorter ending. I can work on that.”"},
     {truth:true,text:"Call it for tonight. I’ll talk with you about the match before you ask for a sequel.",reaction:"“Fine. The bartender can have a very short review.”"}
    ]},
   stole:{tell:"Liam has uncapped his flask but keeps turning back toward the noise from the hall.",
    line:"“That sounded like a bloody premiere, and I didn’t have to stand there smiling for a photo. What do we do with a fight people actually want to talk about?”",
    replies:[
     {style:'straight',text:"Credit the other wrestler too. Give people a reason to follow both of you after tonight.",reaction:"“Fair. Took both of us to make that kind of noise.”"},
     {style:'bureaucrat',text:"Put tonight’s match at the top of your recent work. Keep the date and the opponent.",reaction:"“An actual credit with someone who was there to back it up.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He writes beside his drink. “Lost the match; kept the room. Both go on the page.”"}]},
     {style:'believer',text:"Go listen by the curtain for a minute. Find out whose name they’re calling.",reaction:"“I can do that. I might even learn how to spell it their way.”"}
    ]},
   flat:{tell:"Liam stares at the blank back of a headshot over the rim of his drink.",
    line:"“I gave the crowd the old hard stare and the old speech. They looked like they knew the next bloody line. What do I give them instead?”",
    replies:[
     {style:'straight',text:"Give them a reason you want this fight. Start with the person across from you.",reaction:"“A current problem. I’ve usually got one within reach.”"},
     {style:'bureaucrat',text:"Mark where they stopped reacting. We’ll look at what happened just before it.",reaction:"“I know the line. I’ve said it often enough to know exactly when it went dead.”"},
     {breaks:true,text:"Take a night before you review it. Come back ready to try one change.",reaction:"“Fine. I’ll leave the old speech on the bar where I found it.”"}
    ]},
   kept:{tell:"Liam balances the booking sheet on his glass to show you his name.",
    line:"“You came through on {promise}. My old agent would still be leaving a bloody message. I’d forgotten what it felt like to hear a yes and then actually work.”",
    replies:[
     {style:'straight',text:"You did the work. I’ll let you know as soon as there’s a reason to talk dates again.",reaction:"“I can answer the phone for that. I might even be the one who rings it.”"},
     {style:'bureaucrat',text:"File the commitment with tonight’s result. Now you’ve got a date you can point to.",reaction:"“One date, one result. More than I got out of six months of voicemail.”"}
    ]},
   broken:{tell:"Liam puts his drink down on the cancelled slot and waits for you.",
    line:"“You promised me {promise}, and the whole show went by without it. I was sitting by the curtain like a bloody extra waiting to be called.”",
    replies:[
     {style:'bureaucrat',text:"I changed the card and failed to tell you. I’ll record the change and make sure you hear from me directly.",reaction:"“Write down how to reach me. You’ll improve on my last agency already.”"},
     {style:'straight',promise:'appearance',text:"I missed the booking. You have a match next week. Ask me for the time before you leave.",reaction:"“A real date this time. You understand why I’ll read it twice.”"},
     {breaks:true,text:"The card changed. Before you prepare again, get the final running order from me.",reaction:"“Fine. I’ll save the headshot for after I see my name there.”"}
    ]},
   benched:{tell:"Liam stands beside the poster with his boots slung over one shoulder and a drink in hand.",
    line:"“{name} got a spot and I got a seat. I’ve seen that arrangement before. You wouldn’t happen to have some actual paid fighting for me, would you?”",
    replies:[
     {style:'straight',promise:'appearance',text:"Bring your boots next week. You have a match.",reaction:"“Put that beside my name in ink. I’ve had enough pencil work.”"},
     {style:'bureaucrat',text:"I should have told you before you came. Give me a number and the dates you can work.",reaction:"“Good. Ring twice if the first one goes to the bartender.”"},
     {truth:true,text:"Pitch me your next match without talking about who got booked tonight.",reaction:"“Somebody who wants a fight as much as I do. I’ll bring you a name.”"}
    ]},
   idle:{tell:"Liam has signed every headshot in his bag and started numbering the backs beside his drink.",
    line:"“Four weeks without a fight. Even my straight-to-video pictures got released faster than this. Are you looking for a wrestler or just a nice photo?”",
    replies:[
     {style:'straight',promise:'appearance',text:"You have a match next week. Bring your boots and leave a headshot at the ticket desk.",reaction:"“I’ll put the date on the back. First headshot I’ve signed for a job I’m actually doing.”"},
     {style:'bureaucrat',text:"Tell me when you can work and what you need to get paid. I’ll use that to check for an opening.",reaction:"“Saturday and a proper fee. I can make the first part as easy as you like.”"}
    ]},
   cutIn:{tell:"Liam steps around the corner with a drink and the smile he used to reserve for fight scenes.",
    line:"“I heard {name} from the hall. Before we get another bloody speech on Greco Wrestling, I want a chance to say what I saw tonight.”",
    replies:[
     {style:'straight',text:"Tell me what happened in the ring tonight. We can leave the old casting fight for another time.",reaction:"“Fine. I’ve had twenty years to run the other scene.”",
      cases:[
       {when:{lostTonight:true},reaction:"He studies the glass. “I lost; even an appalling casting decision cannot fix that.”"},
       {when:{wonTonight:true},reaction:"He raises the glass. “I won. Put that above the film dispute in the credits.”"}
      ]},
     {style:'hype',promise:'rematch',text:"You and {name} have a match next week. Make your case between the ropes.",reaction:"“A chance to fight for money. Fine by me. I’ll turn up before the opening credits.”",
      cases:[{when:{lostTonight:true},reaction:"He stops grinning for a moment. “Book it; I have a finish to study before the sequel.”"}]},
     {style:'bureaucrat',text:"I’ll hear you separately. Give me what you saw and I’ll keep a record of both accounts.",reaction:"“Separate statements and a fresh page. Good. I won’t have to write around anybody’s old notes.”",
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
   {line:"Am I getting paid to fight this week or signing another bloody headshot for the bartender? He’s got more of them than my agent ever sold.",replies:[
    {style:'straight',text:"You have a match this week. Come ready to wrestle and we’ll put the terms in writing.",promise:'appearance',reaction:"“An actual fight and an actual date. Give me the pen.”"},
    {style:'bureaucrat',text:"Give me the days you can work and the pay you need. I’ll see what fits the card.",reaction:"“Fine. I can work Saturday. You can write down “less than my old agent asked.””",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"He checks the date twice. “A paid booking after a loss. Now there’s a bloody novelty.”"}]},
    {breaks:true,text:"The card is full. Give Bev one headshot for the desk and check with me next week.",reaction:"“One headshot. Tell her it’s a recent photo of a man looking for work.”"}]},
   {line:"Greek gave somebody else the lead in Demeter’s Baby. I kicked him in the head and the union kicked me out. Now I’ve got a chance to get paid for fighting him properly.",replies:[
    {style:'straight',text:"Ask Greek for a match to his face. Wait for the answer before you take it to the crowd.",sides:{0:-3},reaction:"“I can ask. It’ll cost me less than the last thing I said to his face.”"},
    {style:'bureaucrat',text:"Put the match proposal in writing. Give me terms both of you could sign.",reaction:"“I’ll keep the casting story out of the terms. Just don’t ask me to spell “cordially.””"},
    {breaks:true,text:"Leave Greek alone tonight. Tell me who else you’d get excited about fighting.",reaction:"“Someone who can actually take a hit would be a novelty.”"}]},
   {line:"A bloke recognized me at the bar and asked what I’m working on now. Is “getting booked for a fight” a thing you put on a headshot?",replies:[
    {style:'straight',text:"Sign it and tell him where the next public card goes up. Give him somewhere to look.",reaction:"“A future credit with a place to buy a ticket. I can say that.”"},
    {style:'bureaucrat',text:"Write the promotion’s name. Leave the date blank until you’re confirmed.",reaction:"“That’s better than giving him a date and having it come back like a bounced check.”"},
    {breaks:true,text:"Give him the headshot if you like. You can keep the conversation about your next match private.",reaction:"“A headshot and some peace. That’s an underrated package.”"}]},
   {line:"That bloke said my best fight was twenty years ago. Hold my drink while I give him something recent to review.",replies:[
    {style:'straight',text:"Set the glass down. Save the fight for somebody who signed up for it.",reaction:"“Fine. He can keep his review. I’ll get a better crowd for the reply.”"},
    {style:'bureaucrat',text:"Give me a name from the roster and a reason people would come see the match.",reaction:"“Someone with blood in their veins and a date free. I’ll narrow it down.”"},
    {truth:true,text:"Walk with me. I need you well enough to work more than I need you to win an argument.",reaction:"“Bloody hell. Fine. I’ll walk before he starts rating the sequel.”"}]},
   {line:"There’s room at the bottom of this headshot for one more credit. Can you book me this week so I’ve got something current to write there?",replies:[
    {style:'straight',text:"You have a match this week. Give them a current reason to want the photo.",promise:'appearance',reaction:"“Right. Big letters for this one. I’ve spent enough time in the small print.”",
     cases:[{when:{wonLastShow:true},morale:2,reaction:"He turns the picture over. “After last week’s win, leave me room for two current credits.”"}]},
    {style:'bureaucrat',text:"Keep a separate list of wrestling dates you can update after each match.",reaction:"“A list of fights I actually had. That could get quite long if you keep calling.”"},
    {breaks:true,text:"Use the prints as they are. Come back when there’s a result you want on them.",reaction:"“Fine. The next photo can have a bloody ring in it.”"}]}
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
    line:"“Dog won. The ref counted three and Dog checked the rulebook afterward. Still no rule against a dog winning. What does Dog do with the result?”",
    replies:[
     {style:'believer',text:"Keep a copy, good dog. You earned a win that belongs on your record.",reaction:"“Dog will keep it beside the page with zero banned dogs.”"},
     {style:'hype',text:"Show the crowd your name on the result on the way out. Give them a chance to cheer again.",reaction:"“Dog can carry that. Big letters go on the outside.”"},
     {style:'bureaucrat',text:"Put the result in the official book. I’ll show you where it goes.",reaction:"“Good. Dog can point to the page next time somebody asks.”"}
    ]},
   lost:{tell:"The Dog noses the ball toward the ring, watching for another start signal.",
    line:"“Dog lost. Nothing in the rules says a dog has to win to be allowed back. Can Dog get another try?”",
    replies:[
     {style:'hype',text:"Run to the far post and back. Show me what you’ve got left for tonight.",reaction:"“Dog is already coming back. Did booker see the turn?”"},
     {style:'believer',text:"Stay here a minute, good dog. You keep your place even when somebody beats you.",reaction:"“Good. Dog can stay. Dog would also like to wrestle again.”"},
     {style:'straight',promise:'rematch',text:"You and {name} have a rematch next week. Save that chase for the bell.",reaction:"“Dog heard next week. Dog will be there before the doors open.”"}
    ]},
   stole:{tell:"The Dog carries the rulebook with a child’s DOG sign tucked inside.",
    line:"“One kid yelled DOG and the whole crowd did it back. Nobody asked for a referee’s ruling on the noise. Can Dog hear that again?”",
    replies:[
     {style:'believer',text:"Keep the sign, good dog. You gave them a match worth shouting for.",reaction:"“Dog will check that sign for the next time. Capital letters are correct.”"},
     {style:'hype',text:"Give them one bark on the way out. See if they answer you again.",reaction:"“Dog can do one very good bark. Ready.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He steps toward the door. “Lost the match. Can still lead the howl.”"}]},
     {style:'straight',text:"Ask the kid which part made them shout first. Do that part where the others can see it next time.",reaction:"“Dog can ask on the way past. Short fetch, good question.”"}
    ]},
   flat:{tell:"The Dog waits beside the empty aisle with the ball at his feet.",
    line:"“The crowd hardly barked when Dog came out. Maybe they didn’t know when it was their turn. Should Dog bring the ball next time?”",
    replies:[
     {style:'believer',text:"Show me what you tried. I’ll tell you where I thought I was supposed to answer.",reaction:"“Dog thought there was a pause. How long does a person need?”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. Try one bark they can hear from the back row.",reaction:"“One bark. Then dog can stop long enough to listen.”"},
     {breaks:true,text:"Keep the ball for practice. Go straight to your corner when the announcer calls you.",reaction:"“Dog can chase the bell from there. More room than the doorway.”"}
    ]},
   kept:{tell:"The Dog brings the rulebook with the fulfilled booking tucked into page forty-one.",
    line:"“Dog got {promise}. Dog checked the booking sheet and the rulebook. Everything agrees for once.”",
    replies:[
     {style:'believer',text:"Keep the copy, good dog. A promise should look the same on both sides of the curtain.",reaction:"“Dog will leave the corner folded where it says the date.”"},
     {style:'hype',text:"Point it out to the people who doubted you. Let them read it for themselves.",reaction:"“Dog can hold it up. Dog knows where the important word is.”"}
    ]},
   broken:{tell:"The Dog opens the book at the promise and waits beside you.",
    line:"“You promised {promise}. Dog waited by the door until the last person put the lights out. Did Dog go to the wrong door?”",
    replies:[
     {style:'believer',text:"You were in the right place. I missed the commitment. You can go home now.",reaction:"“Good. Dog can stop listening for the bell.”"},
     {style:'hype',promise:'appearance',text:"You have a match next week. I’ll show you exactly where your name goes on the card.",reaction:"“Dog wants to see the name. Dog can read it twice.”"},
     {breaks:true,text:"Bring the posted card to me next time it disagrees with what I said. We’ll settle it before doors.",reaction:"“Dog will fetch the card. Dog would rather fetch it before the lights go out.”"}
    ]},
   benched:{tell:"The Dog waits at the parking stripe, looking from the ball to the ring door.",
    line:"“{name} got a match. Dog practiced an escape and had nobody to escape from. Could Dog have somebody to wrestle next time?”",
    replies:[
     {style:'believer',promise:'appearance',text:"You have a match next week. Show the other corner how much room you need to get free.",reaction:"“Good. Dog will try to need very little room.”"},
     {style:'hype',text:"Show me the first step of the escape. I’ll count until you’re clear.",reaction:"“Dog can start from inside the grip. Count from there.”"},
     {style:'straight',text:"Tell me who you want to practice with first. I’ll see if they’re up for it.",reaction:"“Somebody who holds on until Dog actually gets out. Dog can ask politely.”"}
    ]},
   idle:{tell:"The Dog brings the same ball and a rulebook opened to the same page.",
    line:"“Dog hasn’t wrestled in four weeks. Dog checked the book again. Still the same dog. Still the same rules. Can the card change?”",
    replies:[
     {style:'believer',promise:'appearance',text:"You have a match next week. Come through the front door, good dog.",reaction:"“Dog can wait by the front door. Dog can wait there before it opens.”"},
     {style:'hype',text:"Show me the chase you’ve been practicing. I can see what you’d bring to a match.",reaction:"“Dog can do the short one here. Please move a chair.”"}
    ]},
   cutIn:{tell:"The Dog sets a ball down and rolls one shoulder free of an imaginary grip.",
    line:"“{name} says Hold One wasn’t finished. Dog rolled free before the ref called anything. Dog would like someone else to watch the next one.”",
    replies:[
     {style:'believer',text:"Show it slowly at practice. I’ll get a referee to watch the exact moment you get loose.",reaction:"“Good. Ref can tell dog when dog is clear.”"},
     {style:'hype',text:"Try it slow and then at full speed. I’ll count both and we can compare.",reaction:"“Dog will do the same turn twice. Second dog will be faster.”",cases:[{when:{lostTonight:true},morale:2,reaction:"He sets himself again. “Count the escape. Dog needs to hear that part.”"}]},
     {style:'straight',text:"Leave tonight’s result alone. Give the ref another look in practice before your next match.",reaction:"“Dog can leave the result in the book. Dog would like a fair count next time.”"}
    ]},
   skip:"The Dog retrieves his ball before it reaches you and carries it toward the ring instead."
  },
  epilogue:{
   best:{title:'The Yard Is Open',line:"The Dog brings the booking sheet. “Good matches. Good booker. Same dog ready for the next one.”"},
   neutral:{title:'Page Marked',line:"The Dog opens the rulebook. “Page forty-one still lets a dog wrestle. Let us use that fact.”"},
   bad:{title:'Behind the Fence',line:"The Dog keeps the book beside his ball. “Dog heard you coming. Got a match? The rulebook says we can start.”"}
  },
  scenes:[
   {line:"Dog fetched a folding chair for the corner. Dog is ready to wrestle. The chair can sit there and watch.",replies:[
    {style:'believer',text:"You have a match this week, good dog. Give the chair to the second at ringside.",promise:'appearance',reaction:"“Chair has a job. Dog has a job. Ring bell for dog.”"},
    {style:'hype',text:"Race me to the far post and back. Show me the chase you’ll bring to the ring.",reaction:"“Dog already started. Booker is behind.”"},
    {breaks:true,text:"Put the chair by the door for the audience. Then come ask me about a match.",reaction:"“Dog can fetch ticket holder a chair. Dog still wants the bell.”"}]},
   {line:"DOG is missing from the poster. “No dogs” is missing from the rules. Dog requests a correction to the poster.",replies:[
    {style:'believer',text:"You have a match this week. DOG goes on the card.",promise:'appearance',reaction:"“Capital letters, please. Dog can read those from ringside.”",
     cases:[{when:{eventWeek:true},morale:2,reaction:"Dog looks at the tour poster. “Bigger crowd will need bigger letters. DOG will fit.”"}]},
    {style:'hype',morale:2,text:"Bring the rulebook to the referee. I’ll come hear the ruling with you.",reaction:"“Dog will hold the page with one paw so the ref can see the empty part.”"},
    {breaks:true,text:"Leave a copy of the rules with Bev. I’ll check the card after the crew signs off.",reaction:"“Dog will be by the poster. Dog can wait near the paper that needs changing.”"}]},
   {line:"Dog fetched Bev’s chair. Bev says it only counts if the chair goes back to her desk. Is the extra distance part of the rules?",replies:[
    {style:'believer',text:"Good dog. Fetch it the last few feet and put it where she can sit.",reaction:"“Desk counts as home base. Chair is going home.”"},
    {style:'hype',text:"I’ll time the run to the desk. You carry it all the way and set it down gently.",reaction:"“Speed on the way there. Good manners at the finish.”"},
    {truth:true,text:"Ask Bev where the chair belongs. Bring it there before you carry anything else off.",reaction:"“Dog will get a location. Then dog will fetch.”"}]},
   {line:"Dog rolled free of Hold One. 2 Holds says the grip was never finished. Dog wants a witness for the next escape.",replies:[
    {style:'believer',text:"Do it slowly at practice. I’ll ask a referee to watch where the grip opens.",sides:{1:-3},reaction:"“Good. Ref can see Dog’s shoulder leave before anyone renames it.”"},
    {style:'hype',text:"Try it twice at practice, slow and fast. I’ll count how long you take to get clear.",reaction:"“Dog gets two chases in opposite directions. Ready.”"},
    {breaks:true,text:"Give it a rest tonight. Ask 2 Holds if he’ll show you how he sets the grip tomorrow.",reaction:"“Dog can wait. Dog would still like someone else to count.”"}]},
   {line:"A kid threw the ball sideways and Dog fetched it before anybody else moved. Dog wants the crowd to see the sideways chase. Is there a microphone this week?",replies:[
    {style:'believer',text:"You have mic time this week. Tell the crowd where to look when you change direction.",promise:'promo',reaction:"“Dog will say left first. Dog might go right. Crowd should keep both eyes open.”"},
    {style:'hype',text:"Show me the change of direction here. I’ll call when you hit the edge of the mat.",reaction:"“Good. Dog will be back before the end of the call.”",
     cases:[{when:{lostLastShow:true},morale:2,reaction:"Dog puts the ball down. “Lost last week. Can still change direction. Crowd should see exactly when.”"}]},
    {breaks:true,text:"Keep fetch as a warm-up. Use the next match to show them how it helps you move.",reaction:"“Dog can chase a wrestler. Wrestler may have opinions about speed.”"}]}
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
  tell:"Sweeps drags the broom across a seam in the floorboards. The bristles crunch.",
  line:"Hear that crunch? I swept the aisle twice and there’s still grit under this board. I’m getting it out before we lock up.",
  replies:[
   {style:'believer',text:"Show me the seam. I’ll hold it open while you sweep underneath.",reaction:"“There. Hear it stop crunching? That’s what I wanted.”"},
   {style:'straight',text:"Mark the loose board for Bev. Clean the grit once we can lift it without splitting it.",reaction:"“I’ll pencil the spot. Then I’ll clean the bloody pencil mark when it’s done.”"},
   {breaks:true,text:"Give it one last pass, then let the crew lock up.",reaction:"“They can turn off the lights behind me when I’m done.”"}
  ]},
 path:{kind:'beat',when:{minTrust:55},cue:'Once friendly, after he’s shown you how the boards sound',
  tell:"Sweeps shakes grit from his elbow pad and looks down at the canvas.",
  line:"Last time I took a bump, I came up with grit in my elbow. Book me this week and give me the room before doors. That canvas needs sweeping.",
  replies:[
   {style:'believer',text:"You have a match this week. I’ll give you time with the canvas before doors.",promise:'appearance',reaction:"“I’ll do the aprons too. The stuff blows in from the edges.”"},
   {style:'bureaucrat',text:"I’ll put the canvas on the crew checklist. Show them where you found the grit.",reaction:"“Right under the bottom rope. I’ll stand there until somebody sees it.”"},
   {breaks:true,text:"Get the crew to clean it while you warm up. Check it before you get in.",reaction:"“Warm up, then inspect. If it crunches, I’m going back for the broom.”"}
  ]},
 stain:{kind:'flag',flag:true,when:{minTrust:70,workedLastWeek:true},cue:"After a worked show, Sweeps discovers a mark that resists every pass",
  memory:'stain',plan:'Sweeps faces the Unsweepable Stain',invite:'Boss. Side door’s open. Look by the timekeeper’s table.',
  tell:"Sweeps has circled a coffee stain by the timekeeper’s table with chalk.",
  line:"I’ve scraped this coffee stain until the scraper bent. Give me the mic next week, boss. I want the person who did it to come see what’s left.",
  replies:[
   {style:'believer',text:"You have the mic next week. Ask whoever spilled it to help finish the job.",promise:'promo',due:1,reaction:"“Good. I’ll leave one clean rag for the volunteer.”"},
   {style:'straight',text:"I’ll hold a light while you try another pass. Let’s see what the scraper is missing.",reaction:"“Angle it sideways. There’s a dark lip by the edge.”"},
   {breaks:true,text:"Put a chair over it until we get something that’ll lift it.",reaction:"“I’ll sweep under the chair. I still have to look at the damned thing.”"}
  ]},
 ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once he trusts you with the title shot',
  askPromise:{kind:'title',due:'event'},invite:'Can you come by? Got something to ask. Didn’t want to do it over the phone.',
  line:"Book me a title match at the next tour show, boss. Give me the day before to sweep the whole hall. I want to walk to that ring and feel nothing under either boot.",
  replies:[
   {style:'believer',ask:'accept',text:"You have the title match at the next tour show. Take the day before for the hall.",reaction:"“I’ll start at the front step. Nobody brings grit into that ring on my watch.”"},
   {style:'straight',ask:'defer',delta:-2,text:"Give me four weeks to find a title slot and a day you can have the floor.",reaction:"“Four weeks. It’ll need doing four more times by then anyway.”"},
   {ask:'decline',delta:-10,text:"I’m keeping the title slot for the contender I’ve already lined up.",reaction:"“I’ll clean it for the bastard. I hope he appreciates it.”"}
  ]},
 vigil:{kind:'final',when:{},day:'Friday',cue:'The Friday of the week his title match is due',
  invite:'Hour one. Come at nineteen if you can. Bring something with a lid.',
  tell:"Sweeps has been cleaning since yesterday. Someone walks in carrying an open bag of chips.",
  line:"Nineteen hours into the sweep. I can see my face in the boards. I can also see somebody behind me opening a bloody bag of chips.",
  replies:[
   {style:'believer',text:"I’ll keep snacks outside and move the chairs. Finish the pass you started.",reaction:"“There’s a strip behind the last chair. Keep them back till I get it.”"},
   {style:'hype',text:"I’ll ask the crew to check their boots before doors. Let the crowd see what you’ve done.",reaction:"“Boots first, applause second. That’s a door policy I can live with.”"}
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
 kept:{tell:'{speaker} is waiting with a hand already out.',line:'“You promised me {promise}. You came through.”',replies:[
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
  {style:'believer',text:'“I’ve noticed the weeks you’ve been waiting.”',reaction:'{speaker} studies your face, then nods.'},
  {style:'straight',text:'“The right spot hasn’t come up yet.”',reaction:'“Then make one.” {speaker} heads for the door.'}]},
 cutIn:{tell:'{speaker} has been listening from a doorway, and isn’t anymore.',line:'“Don’t let {name} tell it like that.”',replies:[
  {style:'straight',text:'“Say your piece, then.”',reaction:'{speaker} says it, all of it, and seems lighter after.'},
  {style:'believer',text:'“You have the floor. Tell me how you saw it.”',reaction:'“My turn.” {speaker} steps back into the doorway.'},
  {style:'hype',promise:'rematch',text:'“You’ll face {name} in a match next week.”',reaction:'Down the hall, {name} heard that too.'}]},
 skip:'{speaker} walks past to the parking lot without stopping. A nod, which is somehow worse.'
};

const ROUTE_STORIES={
 // The title promise covers a defense or a chance to reclaim the belt.
 0:{beats:{
  'name-in-the-song':{kind:'beat',when:{minTrust:55},cue:"Greek asks the booker for help researching his wrestling picture",
   plan:"Greek tells the crowd about his Greco Wrestling picture",
   line:"I’m making a picture about Greco Wrestling, mortal. I want to be the one all Greece comes to see, so I can put what that feels like on the screen.",
   replies:[
    {style:'hype',text:"Use the mic this week to tell the crowd what you’re making.",promise:'promo',reaction:"“I’ll start with their faces. Then I’ll tell them why I need to see them again.”"},
    {style:'straight',text:"I can tell you what it looks like from the seats if you tell me what you can see from the ring.",reaction:"“Two views of the same bell. There’s a picture in that.”"},
    {breaks:true,text:"I can book matches. You’ll need someone else taking notes at ringside.",reaction:"“Then I shall interview the person with the cheapest seat and the sharpest eyes.”"}
   ]},
  'mortal-in-the-ring':{kind:'beat',when:{minTrust:62},cue:"Greek wants firsthand experience of an arena cheering for someone else",
   plan:"Greek wrestles in front of a crowd that might come to see the other wrestler",
   line:"I know what my own cheering section sounds like. Book me this week so I can find out what it feels like when Athens wants the other corner to win.",
   replies:[
    {style:'hype',text:"You have a match this week. I’ll look for someone with a following.",promise:'appearance',reaction:"“Good. I want to hear their name first for once. I think.”"},
    {style:'believer',text:"Ask a wrestler who gets booed what they listen for as they walk out.",reaction:"“What a fine question. I wonder if they listen for one person on their side.”"},
    {breaks:true,text:"I’ll choose the opponent for the card. The audience can choose their favorite.",reaction:"“You give me very little control over my own scene, mortal.”"}
   ]},
  'room-for-the-chorus':{kind:'beat',when:{minTrust:68},cue:"Greek asks what the crowd remembers after a night of Greco Wrestling",
   plan:"Greek asks the crowd which moment stayed with them",
   line:"I wrote six pages on the finish. The front row went home talking about the moment before it. Can I have the mic this week to ask what they saw?",
   replies:[
    {style:'hype',text:"You have mic time this week. Ask them what happened just before the bell.",promise:'promo',reaction:"“Excellent. I’ll let the answer be longer than the question.”"},
    {style:'straight',text:"Ask one fan by the ring and another by the door. Find out what each could actually see.",reaction:"“Two witnesses and two different pictures. I’ll bring two pencils.”"},
    {breaks:true,text:"Talk to people as they leave. I need the live microphone for the card.",reaction:"“At the door? Fine. I’ll write my questions shorter.”"}
   ]},
  'olympus-roof':{kind:'flag',when:{minTrust:70,lostLastShow:true},cue:"After a loss, Greek wonders whether the picture should follow the loser",
   invite:"Greek is waiting with a crooked laurel and two versions of the ending.",
   memory:'olympus-roof',
   tell:"Greek sets his laurel beside a sketch of the wrestler left on the mat.",
   line:"I lost last week. I asked Zeus whether the picture should stay on the winner or the man who can’t get up. So far the ceiling has kept its counsel.",
   replies:[
    {style:'hype',text:"I was still watching your corner after they announced the winner. Keep the camera there a moment.",reaction:"“Then at least one mortal saw the part I thought everybody missed.”"},
    {style:'believer',text:"What did you do before you even thought about getting up? That’s where I’d start.",reaction:"“I looked for the far rope. I knew I could get to that.”"},
    {breaks:true,text:"Go ask the timekeeper. They had to stay until you got up.",reaction:"“A witness with a clock. Very well. Zeus had one job.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Greek requests a title match to learn what a championship feels like from the ring",
   askPromise:{kind:'title',due:'event',plan:"Greek’s title match: firsthand research for his Greco Wrestling picture"},
   invite:"Bring the next tour card. Greek wants to talk about the ending of his picture.",
   line:"Give me a title match at the next tour show. The picture needs to know what it feels like to have a whole room watch you reach for the belt.",
   replies:[
    {style:'hype',ask:'accept',text:"You have a title match at the next tour show. Take a good look around before the bell.",reaction:"“I’ll remember who goes quiet first. That’s where I’ll put the camera.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Bring it back in four weeks. I need to see where the championship stands by then.",reaction:"“Four weeks. I can spend those finding out how the challenger waits.”"},
    {ask:'decline',delta:-10,text:"I’m keeping the title match for the contender I’ve already been building.",reaction:"“Then I’ll have to show Athens why my name belongs in that place.”"}
   ]},
  'chorus-call':{kind:'final',when:{},cue:"Before the title match, Greek asks the booker to stay through the finish",
   invite:"Greek wants someone watching the room when the title match ends.",
   tell:"Greek turns to a blank page in the notebook before rehearsing his title-match entrance.",
   line:"The title match is this week. The second the bell rings, watch the crowd for me. I want the first thing they do before the announcer tells them where to look.",
   replies:[
    {style:'hype',text:"I’ll tell you what the crowd did first. You can keep your eyes on the other corner.",reaction:"“Good. A witness who won’t be trying to take my head off.”"},
    {style:'believer',text:"I’ll watch the whole finish. Afterwards you tell me how it felt inside the ropes.",reaction:"“Then we can put the two versions side by side and see where they part.”"}
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
   line:"Dog read the rules. Boots, tape, mouthguards. The list of things that can’t wrestle contains zero dogs. Is there a spot this week?",
   replies:[
    {style:'believer',text:"You have a match this week, good dog. Show the referee the page before the bell.",promise:'appearance',reaction:"“Dog has it marked. Dog marked the part that isn’t there.”"},
    {style:'bureaucrat',text:"Let me check all the terms they could have used. We can go to the referee with the right page.",reaction:"“Try under W for wrestlers. Dog looked there first.”"},
    {breaks:true,text:"Leave the book with the officials tonight. Ask them for an answer before we print the card.",reaction:"“Dog will lend the book. Dog would like it back without new words.”"}
   ]},
  'the-whistle':{kind:'beat',when:{minTrust:62},cue:'Once the Dog brings you the referee’s whistle',
   plan:'The Dog returns the whistle and asks for the same start signal as everyone else',
   line:"Dog fetched the referee’s whistle and stopped when it blew. Dog can follow a signal. May Dog get the bell that means wrestle this week?",
   replies:[
    {style:'believer',text:"You have a match this week. Give the referee the whistle before you warm up.",promise:'appearance',reaction:"“Whistle goes to referee. Bell goes to dog. Good arrangement.”"},
    {style:'straight',text:"Let’s take it back now. Ask the referee what the signals mean once you’re in the ring.",reaction:"“Dog knows stop. Dog would like a very clear signal for start.”"},
    {breaks:true,text:"Leave it with Bev at the desk. I need the ref to know where to find it.",reaction:"“Desk is a short fetch. Dog can make that before doors.”"}
   ]},
  'front-row-test':{kind:'beat',when:{minTrust:68},cue:'Once warm, he wants the audience to look for themselves',
   plan:'The Dog lends the front row his rulebook and wrestles under the same rules as everyone',
   line:"Put Dog in a match this week. Let the front row hold the rulebook while Dog wrestles, so they can see if somebody tries to add “no dogs.”",
   replies:[
    {style:'believer',text:"You have a match this week. Show the referee your copy before you lend it to the front row.",promise:'appearance',reaction:"“Ref checks page. Front row watches page. Dog watches opponent.”"},
    {style:'bureaucrat',text:"Write the date on a bookmark. Keep a copy at the desk where anyone can compare it.",reaction:"“Two copies with the same number of banned dogs. Good.”"},
    {breaks:true,text:"Keep the book with the referee. The audience needs a clear view of the match.",reaction:"“Fine. Dog reserves the right to look at the page after the bell.”"}
   ]},
  'bev-amendment':{kind:'flag',when:{minTrust:70,workedLastWeek:true},cue:'After the ladder, once warm and the week after the Dog worked',
   invite:"bev has a pencil. dog has the book. please come.",
   memory:'bev-amendment',
   tell:"The Dog holds the rulebook open while Bev pencils a new line under the equipment rules.",
   line:"Bev pencilled “no dogs” under mouthguards. Dog checked the printed page. It still says zero dogs. Which page does the ref use?",
   replies:[
    {style:'believer',text:"Ask Bev to read the printed rules with you. Have her say when a change becomes official.",reaction:"“Dog will follow along. Dog wants to hear the word official.”"},
    {style:'bureaucrat',text:"Label the pencil note a proposal and take it to the rules meeting. Use the current book until there’s a decision.",reaction:"“Dog will attend. Dog will bring the current book for comparison.”"},
    {breaks:true,text:"Leave the book with Bev. Ask the referee what they’re enforcing at this week’s show.",reaction:"“Dog can ask the ref. Dog can also bring a clean copy.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once the Dog trusts you to give the book the main event',
   askPromise:{kind:'promo',due:'event',plan:'Main event: the Dog reads the entire unabridged rulebook aloud, including the index'},
   invite:"dog counted every page. bring a pencil. a long one.",
   line:"Give Dog the microphone at the next tour show. Dog will read the whole rulebook aloud, so everyone can hear how many rules say dogs can’t wrestle.",
   replies:[
    {style:'believer',ask:'accept',text:"You have the mic at the next tour show, good dog. Read the rulebook.",reaction:"“Four paws, many pages, zero bans. Dog will practice the page turns.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:"Mark your place. Bring this back in four weeks after we check how much time the show has.",reaction:"“Dog will time the book. Dog can read the index twice if asked.”"},
    {ask:'decline',delta:-10,text:"I won’t book a reading on the show. Put a copy where the fans can check it for themselves.",reaction:"“Dog will put it where the pages can turn. No pencils nearby, please.”"}
   ]},
  'the-long-read':{kind:'final',when:{},cue:'The week the reading is due, when he rehearses the whole book',
   invite:'practice read. dog can sit for all the pages. bring the long pencil.',
   tell:"The Dog rehearses the last page of his tour-show rulebook reading.",
   line:"The reading is this week. The last page is blank. Dog plans to show both sides in case somebody thinks there’s a hidden rule.",
   replies:[
    {style:'believer',text:"Hold it up until the back row can see. Then close it and thank the crowd.",reaction:"“Dog will show the back too. Nobody can say Dog left out the end.”"},
    {style:'straight',text:"Before you close it, tell the audience where they can check the book after the show.",reaction:"“At Bev’s desk. Dog will leave a bookmark on the very blank page.”"}
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
   line:"I want a real match this week to test Hold One. The dummy has never once tried to pull its wrist free.",
   replies:[
    {style:'straight',text:"You have a match this week. I’ll look for someone who can make that wrist difficult to keep.",promise:'appearance',reaction:"“Good. A hand with an opinion.”"},
    {style:'bureaucrat',text:"Write down exactly where the grip tends to slip. I’ll use that to help scout an opponent.",reaction:"“The thumb moves first. Put that in the top margin.”"},
    {breaks:true,text:"Let’s start with a fresh sparring partner. The printed card is already full.",reaction:"“Fine. Someone who hasn’t spent three hours watching my thumb, please.”"}
   ]},
  'hold-one-aloud':{kind:'beat',when:{minTrust:62},cue:'Once he lets the booker hear how he teaches Hold One',
   plan:"2 Holds uses mic time to explain the complete two-hold scope of wrestling",
   line:"People keep asking what comes after Hold Two. Give me the microphone this week so we can all count the holds together.",
   replies:[
    {style:'straight',text:"You have the mic this week. Show them both holds as you count.",promise:'promo',reaction:"“I’ll need somebody with two sleeves and a willingness to learn.”"},
    {style:'believer',text:"Try teaching the stance to a few fans before doors. See what they ask about first.",reaction:"“Excellent. They can ask their other question once their feet are correct.”"},
    {breaks:true,text:"Save the lecture. Use the next match to show how you get from one to two.",reaction:"“A practical examination. Much better than a third question.”"}
   ]},
  'case-at-ringside':{kind:'beat',when:{minTrust:68},cue:"He asks the booker to track how smoothly he switches between his two holds",
   plan:'2 Holds tests the transition between Hold One and Hold Two against a resisting opponent',
   line:"There’s a fraction of a second when I let go of Hold One before Hold Two is on. Book me this week. I want an opponent who’ll try to use it.",
   replies:[
    {style:'straight',text:"You have a match this week. I’ll watch that gap from ringside.",promise:'appearance',reaction:"“Make a mark every time their wrist moves before my foot lands.”"},
    {style:'bureaucrat',text:"Run it in practice with a stopwatch. I’ll record it in both directions.",reaction:"“Good. The round trip is how we’ll know which end is slow.”"},
    {breaks:true,text:"Try holding One all the way through the finish. See if you need to give up that grip at all.",reaction:"“I can test that. It leaves Hold Two with a great deal to say at practice.”"}
   ]},
  'open-latch':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After a recent match, he finds the practice notebook has run out of pages',
   invite:"Seven. Bring two sheets of paper. One for each hold.",
   memory:'open-latch',
   tell:"2 Holds tries to fit two more diagrams into the last margin of his practice notebook.",
   line:"The drill book is full. I have a correction for each hold and only the inside of the cover left. Which do I write down first?",
   replies:[
    {style:'straight',text:"Take two sheets. Show me which correction goes on each.",reaction:"“One starts at the thumb. Two starts at the foot. Two sheets is exactly right.”"},
    {style:'bureaucrat',text:"Archive the old drill book. Date the new pages so you can compare the grips.",reaction:"“I’ll put the time down as well. It might matter later.”"},
    {breaks:true,text:"Test both corrections again before we buy another notebook.",reaction:"“Once in each direction. Then we’ll see how much paper we really need.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he asks to test the perfected two-hold sequence at the next tour show',
   askPromise:{kind:'appearance',due:'event',plan:"2 Holds tests his refined sequence at the tour show: Hold One to Hold Two and back again"},
   invite:"Both holds are ready for a proper test. A tour date is required.",
   line:"Book me at the next tour show. I’ve spent a month closing the gap between Hold One and Hold Two. I want the back row to see the whole sequence.",
   replies:[
    {style:'straight',ask:'accept',text:"You have a match at the next tour show. That gives you time to test the switch.",reaction:"“I’ll measure from the last inch of Hold One. It matters where you start.”"},
    {style:'hype',ask:'accept',askDue:0,cap:'neutral',text:"You have a match tonight. Try the switch under real pressure now.",reaction:"“Tonight. Very well. Keep the notebook open in case I need another line.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:"Bring it back in four weeks. Show me the switch in practice before I commit a match.",reaction:"“Four more weeks. I can get a great deal done in four more weeks.”"},
    {ask:'decline',delta:-10,text:"I’m keeping that spot for a different match. Keep drilling both holds.",reaction:"“I will. There are exactly two things I wanted to do anyway.”"}
   ]},
  'the-last-drill':{kind:'final',when:{},cue:'The week of the tour match, he rehearses the transition at match speed',
   invite:"Final drill before the tour show. Watch the feet between the holds.",
   tell:"2 Holds marks two footprints on the practice mat before running the sequence at match speed.",
   line:"The match is this week. Watch my left foot as I switch from Hold One to Hold Two. If it hovers, the other wrestler has room.",
   replies:[
    {style:'straight',text:"I’ll watch the left boot and tell you when it comes down.",reaction:"“Good. If you have time to say it twice, I’ve taken too long.”"},
    {style:'believer',text:"I’ll watch the other wrestler’s wrist. We’ll find out whether they can still get it free.",reaction:"“That will tell me what the foot is costing me. Good.”"}
   ]}
 },memories:[{id:'open-latch',title:'Two Fresh Sheets',caption:'Week {week} · The notes filled a book. The next corrections got a page each.'}],
 endings:{
  best:{title:'The Perfect Transition',line:"2 Holds checks his stance. “Both holds, properly demonstrated. Now I can begin refining the next half millimeter.”"},
  neutral:{title:'Room for Half a Millimeter',line:'2 Holds opens the practice book. “They saw both. I saw where the second one could be tighter.”'},
  bad:{title:'Back to One',line:'2 Holds plants both boots. “No tour match. There is time for another repetition.”'}
 }},
 18:{beats:{
  'sealed-favor':{kind:'beat',when:{minTrust:55},cue:'After the first evening, Charming wants to settle a diner argument with Ron',
   plan:'Charming brings the disputed diner receipt to his singles match with Ron Toledo.',
   tell:"Charming lays a diner receipt on the table. The tip line reads TIPPING IS UNNECESSARY SOCIAL ETIQUETTE.",
   line:"One of your idiot employees, Ron Toledo, tipped the server for our meals after I was very explicit about tipping being unnecessary and against my personal beliefs. Please book me in a match with him so I can kill him. The server can have a front-row seat. A complimentary one, obviously.",
   replies:[
    {style:'bureaucrat',delta:4,text:"You and Ron have a match next week. Leave the server out of it.",promise:'singles',target:31,due:1,reaction:"“Certainly. Know that I will kill him.”"},
    {style:'straight',delta:-2,sides:{31:3},directSides:true,text:"Pay Ron back. Then ask if he even wants to wrestle you.",reaction:"“Very well. Do expect I kill him soon enough.”"},
    {delta:-5,text:"Give Bev the receipt. I’m keeping both of you off the hook for a match until she’s heard Ron’s side.",reaction:"“Of course. Kindly tell Bev the tip was the only part of the bill in dispute.”",note:"Bev logs the dispute over the diner tip and asks to hear Ron Toledo’s side."}
   ]},
  'right-of-reply':{kind:'beat',when:{minTrust:62},cue:'After the diner dispute, Charming wants mic time while the thread is still drawing clicks',
   plan:'Charming promotes the match.',
   tell:"Charming turns a phone toward you. A thread titled WHY THE LOCKER ROOM HAS TWO CHRISTMAS PARTIES has three hundred replies. Several are from wrestlers asking Charming to take it down.",
   line:"Charming posted a few rumors about who’s sleeping with whom and which spouses found out at the Christmas party. The roster is furious. The ticket link has never had so many clicks. Please give Charming the microphone this week. There’s a second thread ready for intermission.",
   replies:[
    {style:'bureaucrat',text:"You have the mic this week. Promote the match. Anyone you named can ask for a turn.",promise:'promo',charmingBuzz:true,reaction:"“Certainly. The ticket link can stay up.”"},
    {style:'straight',delta:-3,rep:2,text:"Take the posts down and apologize privately to the people you named.",reaction:"Charming takes the threads down. “Of course. Charming will send individual apologies. A group chat would start a third thread.”",note:"Charming took down the rumor threads and agreed to apologize privately."},
    {delta:-5,text:"I’m talking to the people you named first. The office decides what goes on the show.",reaction:"“Very well. Charming will resist the temptation to post that the office is investigating.”",note:"The booking office will hear from the wrestlers Charming named before offering him airtime."}
   ]},
  'guest-of-honor':{kind:'beat',when:{minTrust:68},cue:'Once warm, he lets you inspect how he arranges a match',
   plan:'Charming offers his opponent the ceremonial first entrance and keeps the second for himself',
   tell:"Charming has circled the front-row seats with a ring post directly in front of them.",
   line:"Please book Charming this week. Offer the opponent a choice of corners. Then sell the opponent’s family front-row seats behind the ring post. The tickets will still say front row.",
   replies:[
    {style:'bureaucrat',text:"You have a match this week. The opponent can choose a corner. The ushers will make sure the seats have a clear view.",promise:'appearance',reaction:"“Certainly. The family will be able to see the whole thing for the price of a ticket.”"},
    {style:'believer',text:"Ask the opponent what would help them get ready. Leave the family out of the discussion.",reaction:"“Of course. First entrance may be enough to make the opponent feel welcome.”"},
    {breaks:true,text:"Give me the seating chart. I’ll deal with the ushers before we discuss the match.",reaction:"“Very well. The obstructed seats are circled.”"}
   ]},
  'empty-place':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:'After the ladder and a recent match, Charming asks the booker to return an opponent’s baby',
   invite:"Please come to Maddox’s. Charming has a small delivery for the booker.",
   memory:'empty-place',
   tell:"Charming sits beside a baby carrier. A folded note rests on the table. The baby hiccups.",
   prompt:"Charming took a wrestler’s baby. He wants you to return the baby to the crib and leave his note.",
   line:"Don’t be mad, but my opponent asked me to stay away from the family. I have his baby now. Please put the baby back in the crib and leave this note beside it. What it says is none of your concern.",
   replies:[
    {style:'bureaucrat',text:"Hand me the carrier and the note. I’ll take the baby straight to their parent.",reaction:"Charming slides the note across the table. “Certainly. Please keep the note with the delivery.”"},
    {style:'straight',morale:3,text:"Charming, you’re coming with me. When we hand the baby back, you’re going to tell the parent exactly what you did.",reaction:"Charming stands and buttons his jacket. “Of course. Charming had hoped to make a personal appearance.”"},
    {truth:true,text:"I’m calling the parent and Bev right now. They need to know where the baby is and who took them.",reaction:"Charming smooths the crease in the note. “You really are no fun at all.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Charming asks for one match and pitches a future of increasingly devious shows",
   askPromise:{kind:'appearance',due:'event',dueWeekOnly:true,plan:"Charming’s match at the next tour show. Review the proposed opponent before confirming the other corner."},
   invite:"Please bring the next tour card. One blank space will do; a little more cruelty can be arranged later.",
   line:"Please book Charming at the next tour show. Charming will suggest an opponent. A rival with family in the front row would be ideal. A loss is more embarrassing with witnesses.",
   replies:[
    {style:'bureaucrat',ask:'accept',text:"You have a match at the next tour show. Suggest an opponent and I’ll make the final call.",reaction:"“Certainly. Please allow room for one suggested name on the booking sheet.”"},
    {style:'straight',ask:'defer',delta:-2,text:"Bring me a matchup in four weeks. I’ll consider it once I can hear both wrestlers out.",reaction:"“Of course. Four weeks should be enough time to find a willing opponent.”"},
    {ask:'decline',delta:-10,text:"I’m turning down this pitch. I’m keeping the tour slot for a match that can sell without dragging anyone’s family into it.",reaction:"“Very well. The family seats can go back on sale.”"}
   ]},
  'the-place-card':{kind:'final',when:{},cue:'The week his tour match is due, Charming asks the booker to coordinate a conversation with the police',
   invite:'Please bring the tour-show call sheet. The local police would also like a word.',
   tell:"Charming sets a detective’s business card beside the tour-show lineup. The detective has underlined before doors.",
   line:"Charming is almost certain there was no hit-and-run. The police are almost certain there was, and would like a word before the tour match. Could the booking office settle when that conversation happens? The opponent has already ironed a robe.",
   replies:[
    {style:'bureaucrat',delta:2,text:"Call the detective yourself. Tell me when you’ll be here, and I’ll confirm the match with your opponent.",reaction:"“Certainly. Charming will call before the robe goes on.”"},
    {style:'straight',delta:4,text:"I’ll set aside a room before doors and tell your opponent when to expect you.",reaction:"“Of course. Please take the RESERVED FOR TALENT sign off the door. The detective may get the wrong idea.”",plan:'Before doors: The booking office has set aside a room for Charming Friendly to meet with the detective.'}
   ]}
 },memories:[{id:'empty-place',title:'Special Delivery',caption:"Week {week} · Charming took a wrestler’s baby and asked the booker to return the baby with a note."}],
 endings:{
  best:{title:'Right on Time',line:"Charming hangs the robe after the tour match. “The detective got a conversation and the crowd got a match. Kindly keep both appointments on separate lines of the call sheet.”"},
  neutral:{title:'Made the Bell',line:"Charming hangs the robe after the tour match. “Charming made the bell. The detective left another card. Please pass along the number for the booking office.”"},
  bad:{title:'Off the Call Sheet',line:"Charming folds the tour-show call sheet. “No match, then. Kindly leave Charming’s name on the copy for the detective. At least somebody asked for an appearance.”"}
 }},
 20:{beats:{
  'one-heart':{kind:'beat',when:{minTrust:55},cue:"The Grinch tries to welcome the entire crowd",
   plan:"The Grinch offers the crowd a paper heart during a mic segment",
   line:"I made a heart big enough for the whole audience! Can I show it off on the mic this week? The people in back should get a look too.",
   replies:[
    {style:'hype',text:"You have the mic this week. Hold it high enough for the back row.",promise:'promo',reaction:"“Large-print love! Ready when they are!”"},
    {style:'straight',text:"Put it out by the doors. Let people stop and sign it if they like.",reaction:"“A heart made out of signatures! It can grow every time the doors open!”"},
    {breaks:true,text:"Keep it off the stage while the crew is changing sets. It can go up when they’re done.",reaction:"“I’ll hold it flat until somebody tells me where it belongs.”"}
   ]},
  'own-corner':{kind:'beat',when:{minTrust:62},cue:"The Grinch wants a match to welcome an opponent",
   plan:"The Grinch decorates his own corner and welcomes the opponent",
   line:"I want the friendliest fight in Wisconsin! Can I have a match this week and put a welcome sign in my corner? The other wrestler can have one twice as big!",
   replies:[
    {style:'hype',text:"You have a match this week. Decorate your corner. Let the other wrestler set up theirs.",promise:'appearance',reaction:"“A welcome with its own address. I can put EVERYBODY on my side!”"},
    {style:'believer',text:"Make one sign for yourself. Offer the other one to the opponent before you hang it.",reaction:"“Two signs, one yes at a time. I can wait!”"},
    {breaks:true,text:"Loose decorations stay outside the ropes. Give the crew a simple setup.",reaction:"“A welcome from outside the ropes! Can I wave both arms?”"}
   ]},
  'no-means-no':{kind:'beat',when:{minTrust:68},cue:"The Grinch rehearses an invitation with room for people to decline",
   plan:"The Grinch invites the crowd to celebrate without requiring anyone to join",
   line:"People keep leaving as soon as the show ends. I think they’re missing the party because they can’t hear the invitation. Can I use the mic this week?",
   replies:[
    {style:'hype',text:"You have the mic this week. Give one invitation and leave the aisle clear for people going home.",promise:'promo',reaction:"“One enormous invitation. I can do it in a single breath!”"},
    {style:'straight',text:"Thank everybody for coming to the show. Let them choose where to go after the bell.",reaction:"“A goodbye big enough to feel like a hug from the door!”"},
    {breaks:true,text:"They’re leaving because they want to go home. Leave the party off the show.",reaction:"“Oh. I can wish them a good night from here, then.”"}
   ]},
  'returned-heart':{kind:'flag',when:{minTrust:72,workedLastWeek:true},cue:"After a worked show, a heart comes back with a request to stop",
   invite:"A heart came back! The Grinch has called an emergency welcome committee.",
   memory:'returned-heart',
   tell:"The Grinch turns over a returned paper heart. Someone wrote NO MORE across the back.",
   line:"Somebody sent my heart back with NO MORE written on it. They must have run out of wall. What if I send one that folds out in six panels?",
   replies:[
    {style:'hype',text:"Make a return box here. People can take a heart home or put it back without asking.",reaction:"“A whole collection of hearts people can come visit. I’ll make a sign!”"},
    {style:'believer',text:"Keep the returned heart for yourself. The sender has already given you an answer.",reaction:"“I can keep it right here. It’ll have company.”"},
    {breaks:true,text:"Recycle it and give the sender some space. We’re packing up.",reaction:"“Okay. I can make something out of the scraps for my own wall.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"The Grinch requests a strictly platonic tag-team celebration",
   askPromise:{kind:'team',due:'event',target:23,plan:"Grinch and Lemon Tart: a platonic tag match, decorations confined to his corner"},
   invite:"TAG-TEAM QUESTION! One corner, two wrestlers, a whole crowd to welcome!",
   line:"Book Lemon Tart and me as tag partners at the next tour show! I want to cheer for her from the corner. Has she told you what she’d want from me as a partner?",
   replies:[
    {style:'hype',ask:'accept',text:"You and Lemon Tart have a tag booking at the next tour show. Ask her how she wants you to work the corner.",reaction:"“I can cheer at exactly her preferred volume! I’ll ask what that is.”"},
    {style:'believer',ask:'defer',delta:-2,text:"Ask her what she’d want out of the team. Bring it back in four weeks and we’ll look for a slot.",reaction:"“Four weeks. I can spend some of that just listening!”"},
    {ask:'decline',delta:-10,text:"I’m passing on the team for this tour show. You can still ask her to practice together.",reaction:"“Practice. Right. I’ll ask once, and I’ll remember to wait for an answer.”"}
   ]},
  'wait-for-the-tag':{kind:'final',when:{},cue:"Before the tag match, the Grinch practices waiting in his corner",
   invite:"TAG PRACTICE! The Grinch has brought a rope and limitless encouragement.",
   tell:"The Grinch holds a tag rope and rehearses how to cheer for Lemon Tart from his corner.",
   line:"Lemon Tart is my tag partner this week! She said she’ll reach when she wants me in. How loudly can I encourage her while I wait?",
   replies:[
    {style:'hype',text:"Cheer for her from your corner. Put your hand out and let her choose when to tag.",reaction:"“One hand and an appropriate amount of enthusiasm!”"},
    {style:'straight',text:"Save your breath for the match. When she reaches, be ready to go straight in.",reaction:"“I’ll watch her hand. I can make the big noise when it’s my turn.”"}
   ]}
 },memories:[{id:'returned-heart',title:'The Heart That Came Back',caption:"Week {week} · A returned heart became the first visitor to the return box."}],
 endings:{
  best:{title:"A Team Worth Cheering",line:"The Grinch waves a heart. “A shared match! I cheered every time she tagged in. Did you hear the crowd cheering back? I think they love us too!”"},
  neutral:{title:'One Shared Corner',line:"The Grinch packs the banner. “We got our match! Next time the welcome will be easier to carry and MUCH louder!”"},
  bad:{title:"The Welcome Continues",line:"The Grinch unfolds more paper. “No team this time; good thing everybody else still needs welcoming!”"}
 }},
 31:{beats:{
  "equal-corners":{kind:"beat",when:{"minTrust":55},cue:"Ron asks for somewhere quiet to change",
   tell:"Ron waits outside the locker room with one boot on. Inside, two wrestlers are arguing over whether the finish of their match is safe.",
   line:"By the time I found my second boot, both of them had asked whether it’s safe to be trying a vertebreaker from the apron to the floor. I’ve done that move many times. I am now being quoted by both sides. I’d like my own changing room before somebody asks me to sign a witness statement.",
   replies:[
    {"style":"bureaucrat","delta":4,"text":"You can have the spare room before this week’s show. The crew will need it back at bell time.","reaction":"“Understood. If anyone asks which side of the hall it’s on, say the end.”","plan":"Ron uses the spare changing room until bell time."},
    {"style":"straight","delta":2,"text":"I’ll stagger their call times and give you ten quiet minutes in the locker room between them.","reaction":"“Ten minutes. I can be fully dressed before either side finds out I was there.”","plan":"Stagger the disputed match’s call times and give Ron ten minutes in the locker room between them."},
    {"delta":-2,"text":"Keep the shared room. Send them both to me if they try to make you a witness.","reaction":"“I appreciate that. Do you mind if I leave this boot with you until the room clears?”"}
   ]},
  "minutes-from-the-back":{kind:"beat",when:{"minTrust":62},cue:"Ron asks for a campaign rally and endorsement",plan:"Book Ron’s town board campaign rally.",
   tell:"Ron hands you a campaign button. It reads RON TOLEDO FOR TOWN BOARD. A second button reads OTHER CANDIDATES ARE AVAILABLE.",
   line:"I’m running for town board. I’d like your endorsement and a rally on this week’s show. Two people have already asked where I stand. I told them by the exit, so nobody has to squeeze past me.",
   replies:[
    {"style":"bureaucrat","delta":5,"promise":"rally","ronEndorsement":true,"text":"I’ll endorse you and put the rally on this week’s card.","reaction":"“Thank you. Please endorse me by name. The printer has already put ‘Ron Toledo and all other qualified candidates’ on six hundred buttons.”"},
    {"style":"straight","delta":2,"promise":"rally","text":"You can use the mic this week. I’ll introduce you as a candidate, and any opponent can ask for the same time on a future show.","reaction":"“Fine. If they ask for my time, check whether they mean the microphone or the actual office.”"},
    {"delta":-3,"text":"Campaign on your own time. I’m keeping the promotion out of the race.","reaction":"“I understand. May I quote you as saying you’re keeping the promotion out of the race? It’s the strongest statement of support I have.”"}
   ]},
  "one-signature":{kind:"beat",when:{"minTrust":68},cue:"Ron wants a match with no winner",plan:"Book Ron’s promised singles result.",
   tell:"Ron hands you a match request. He’s crossed out both the winner and loser boxes and initialed the space between them.",
   line:"I’d like to wrestle this week, but I’ve given some thought to winning and losing. The winner gets asked to explain why the loser deserved it. The loser gets asked what went wrong. Could we ring the bell, wrestle for a while, and record a no contest? I’m available for the wrestling portion.",
   replies:[
    {"style":"bureaucrat","delta":4,"promise":"no-contest","text":"I’ll book a no contest this week if your opponent agrees to it.","reaction":"“Thank you. Please leave the winner’s box blank. A dash looks like somebody started writing a name.”"},
    {"style":"straight","delta":1,"promise":"decisive","text":"I’ll book you this week with a decisive finish. I’ll handle the questions afterward.","reaction":"“All right. If I win, please start with the other wrestler’s contributions.”"},
    {"delta":-2,"text":"Take the week off. I’ll give the spot to two people who want a result.","reaction":"“Understood. Please put ‘off this week’ on the sheet. Last time it said ‘withdrawn’ and three people asked who I was endorsing.”"}
   ]},
  "listening-tour":{kind:"flag",when:{"minTrust":70},cue:"Ron proposes a show with Fox Valley",memory:"listening-tour",
   invite:"Fox Valley and WWA have both printed posters calling the other promotion a disgrace. Please come look at the backs. There’s room for a joint poster.",
   tell:"Ron lays two rival posters face down. He’s drawn a box for each promotion’s logo and measured the boxes to the millimeter.",
   line:"Fox Valley moved their start time to hurt our gate. We moved ours back to hurt theirs. A man at the ticket window asked which show he was supposed to take his daughter to, and we made him feel like a traitor for asking. Could we put on one show together? One ticket, both rosters. I’d like this family to see a headlock before the girl goes to college.",
   replies:[
    {"style":"bureaucrat","foxValley":"joint","text":"Offer Fox Valley a joint show at the next tour stop. Split ticket revenue and give them one match on the card.","reaction":"“Good. I’ll put both logos on the poster. Please tell both offices they’re in alphabetical order before either one borrows a ruler.”"},
    {"style":"straight","foxValley":"guest","text":"Invite them to send a wrestler for one match on our next tour card. We’ll keep the rest of the show ours.","reaction":"“One visiting wrestler. Please give them the same directions to the locker room as everyone else.”"},
    {"foxValley":"truce","text":"Keep the shows separate. I’ll call Fox Valley and ask them to stop moving their start time around ours.","reaction":"“Fine. If they ask who blinked first, tell them the child had a bedtime.”"}
   ]},
  "ask":{kind:"ask",when:{"minTrust":75},cue:"Ron wins his election and asks for a tour-show town hall",askPromise:{"kind":"town-hall","due":"event","dueWeekOnly":true,"plan":"Book Ron Toledo’s town hall with live audience questions."},
   invite:"Election results are official. Please bring the tour card and a microphone that can reach the third row.",
   tell:"Ron sets his town board nameplate on the booking desk. Under it is a stack of questions constituents have already sent in.",
   line:"I won. Apparently everybody heard ‘I won’t take sides’ and assumed the other side would be disappointed. I’d like to hold a town hall at the next tour show. Full questions from the audience. Full answers from me, where available.",
   replies:[
    {"style":"bureaucrat","ask":"accept","text":"You have a segment at the next tour show. We’ll take live questions from the crowd.","reaction":"“Thank you. Could we have somebody on the aisle with the microphone? If people can ask a follow-up from their seat, we’ll still be there during the main event.”"},
    {"style":"straight","ask":"defer","delta":-2,"text":"Give me four weeks. Keep collecting questions and bring the town hall back to me then.","reaction":"“Four weeks. I’ll date every question so the people who asked twice can see which one came first.”"},
    {"ask":"decline","delta":-10,"text":"Hold it at town hall. I’m keeping the tour segment for wrestling.","reaction":"“That is technically where the town hall is. I was hoping the chairs here would make people a little less familiar with the procedure.”"}
   ]},
  "on-the-record":{kind:"final",when:{},cue:"The recall petition reaches Ron in the promised town-hall week",
   invite:"Recall petition filed. The town hall is still on the schedule. Please come before doors.",
   tell:"A flood map is spread across the booking desk. Someone has circled the high school gym, which stayed locked while people were looking for shelter.",
   line:"The river took out the bridge and put two streets underwater. The town board needed one vote to open the high school gym as a shelter. I abstained. People spent the night in their cars. Now there’s a recall petition, and somebody’s written ‘WHY?’ on every copy of my campaign flyer. I’d like your help keeping my seat. I suspect I’ll need a better answer than ‘present.’",
   replies:[
    {"style":"bureaucrat","ronPrep":"open","text":"Keep the open mic. Start by saying how you voted and what it cost people. Then tell them what you’ll do before the next flood.","reaction":"“I can start with the gym. I knew where the key was. I was waiting for somebody to tell me turning it was procedural.”"},
    {"style":"straight","ronPrep":"moderated","text":"I’ll moderate. Let the people who waited outside the gym ask first. You answer each person before I hand the mic to the next one.","reaction":"“All right. If I start explaining how an abstention is entered in the minutes, please ask me about the key again.”"}
   ]}
 },memories:[{id:'listening-tour',title:'Both Posters on the Table',caption:'Week {week} · Ron put both promotions’ posters on the same table and asked for one show.'}],
 endings:{
  best:{title:'By One Vote',line:'Ron folds the recall tally. “One vote. I have written down the gym key’s location. I have also written down who is opening the gym. The second line is my name.”'},
  neutral:{title:'The Vote Is Pending',line:'Ron files the town hall minutes. “The questions are on the record. The recall goes to a vote. Apparently ‘present’ is not on the ballot.”'},
  bad:{title:'Seat Vacated',line:'Ron takes the town board nameplate off the desk. “The town hall never went on. The recall did. The clerk asks that I return the nameplate before five.”'},
  declined:{title:'At Town Hall',line:'Ron gathers the audience questions. “I’ve booked the municipal room. The chairs are there already. I checked both sides.”'}
 }},
 34:{beats:{
  'mark-the-exits':{kind:'beat',when:{minTrust:55},cue:"Liam asks for a first step back into paid work",
   plan:"Liam brings his old headshot to his next wrestling appearance",
   line:"Can you book me a fight this week? The bartender says nobody wants another comeback. He’s also got my running tab, so he might have a stake in the answer.",
   replies:[
    {style:'straight',text:"You have a match this week. Bring your boots and come ready to work.",promise:'appearance',reaction:"“I’ll settle the tab after the bell. For once it’ll be with money I’ve earned.”"},
    {style:'bureaucrat',text:"Tell me what fee you need and which nights you’re free. I’ll work out where you fit.",reaction:"“You’re asking when I can work? That’s further than I got with the agency.”"},
    {breaks:true,text:"I’m filling this card with announced matches. Give me a reason to call you first next time.",reaction:"“I’m cheaper than an actor and more stubborn than most of your wrestlers.”"}
   ]},
  'cover-story':{kind:'beat',when:{minTrust:62},cue:"Liam asks to introduce his comeback publicly",
   plan:"Liam uses a mic segment to announce his wrestling comeback",
   line:"Give me the mic this week. I can tell the crowd how I went from opening nights to looking for a fight in Wisconsin. I might even get through it without saying “union.”",
   replies:[
    {style:'straight',text:"You have the mic this week. Tell them what you’re here to fight for now.",promise:'promo',reaction:"“Paid work and a proper scrap. That ought to fit in the time.”"},
    {style:'believer',text:"Try it on me first. Where does the story stop being about the old job and start being about this one?",reaction:"“Probably right when I tell you how bloody good it felt to hit the ropes.”"},
    {breaks:true,text:"Save the long version for later. Give the announcer one line they can read before your entrance.",reaction:"“Liam Neesen. Currently employed. I’d like to hear the second part again.”"}
   ]},
  'one-way-out':{kind:'beat',when:{minTrust:68},cue:"Liam chooses the next fight over an imagined movie rescue",
   plan:"Liam wrestles to establish his comeback rather than replay an old film fight",
   line:"Put me back on the card this week. I’m having a bloody excellent time fighting for real. If a studio happens to call, tell them the bell’s about to ring.",
   replies:[
    {style:'straight',text:"You have a match this week. Give the crowd a fight you want on the front of the headshot.",promise:'appearance',reaction:"“A credit with bruises. That’s the one they’ll ask me about first.”"},
    {style:'believer',text:"Tell me which kind of match you want next. Let’s hear a pitch for wrestling instead of a return to film.",reaction:"“Give me somebody who makes me sweat before the first minute’s up.”"},
    {breaks:true,text:"Give the crew your availability and keep your phone off during the show.",reaction:"“Gladly. The only call I’m waiting for tonight comes from the curtain.”"}
   ]},
  'go-dark':{kind:'flag',when:{minTrust:70},day:'Sunday',cue:"A rejection arrives while Liam is drinking on Sunday",
   invite:"Sunday. Liam has opened an old casting email and another drink.",
   memory:'go-dark',
   tell:"Liam sets a glass beside his phone. The agency’s rejection is still open on the screen.",
   line:"My old agency sent the reel back. “No longer represented.” Do I call and make them say it to me, or do I finish the drink first?",
   replies:[
    {style:'straight',morale:2,text:"Put the phone down. Tell me what you want from the work you’ve got here.",reaction:"“Something they can’t send back without getting in the ring with me.”"},
    {style:'believer',text:"You can be angry about losing the old job and still have a good fight next time out.",reaction:"“Yeah. I can want both things. One of them actually wants me back.”"},
    {breaks:true,text:"Keep the letter for your records. Talk it through tomorrow before you make another call.",reaction:"“Fine. It’ll be every bit as insulting in the morning.”"}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:"Liam requests a tour-show appearance as his wrestling comeback",
   askPromise:{kind:'appearance',due:'event',plan:"Liam’s wrestling comeback at the next tour show, billed under his own name"},
   invite:"Sunday. Liam has a comeback proposal and a glass ready.",
   line:"Book my comeback match at the next tour show. I want my name on the poster for a fight I actually had, with a room full of people who paid to see it.",
   replies:[
    {style:'straight',ask:'accept',text:"You have that match at the next tour show. I’ll put your name on the sheet this week.",reaction:"“An actual date. I’m going to bloody frame that.”"},
    {style:'bureaucrat',ask:'defer',delta:-2,text:"Bring the pitch back in four weeks. I’ll tell you if the next card has room for it.",reaction:"“Four weeks. I can rehearse what it sounds like when someone calls me back.”"},
    {ask:'decline',delta:-10,text:"I’m passing on a special comeback match. Give me a regular booking pitch when you’re ready.",reaction:"“Fine. I’ll make a regular match worth somebody’s ticket.”"}
   ]},
  'final-extraction':{kind:'final',when:{},day:'Sunday',cue:"The Sunday before his comeback, Liam checks the billing",
   invite:"Sunday. Liam wants one last look at the comeback billing.",
   tell:"Liam smooths the handbill for his comeback match. His name is printed at the top.",
   line:"Comeback match this week. If they shout for a sequel, somebody remind me the other bloke gets to go home when the bell rings.",
   replies:[
    {style:'straight',text:"Enjoy the noise and leave the ring after the decision. Let the crowd ask for the next fight.",reaction:"“Right. One fight, one result, and a drink somewhere they can’t count me out.”"},
    {style:'believer',text:"Thank the other corner on the way out. If people want another round, we can talk business later.",reaction:"“That’s a hell of a way to get offered another job. I’ll try it.”"}
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
    dilemmaChoice('Keep Hold Two for tonight. Ask the opponent to work through it for the crowd reaction.',()=>{
     dilemmaTrust(opponent,-10);dilemmaData().holdPop=state.week;
     dilemmaNote('The room heard you chose the pop. The next person asked to face 2 Holds wants a word.',[1,opponent]);
    }),
    dilemmaChoice('Pause the decision. Tell 2 Holds what his opponents are saying.',()=>dilemmaFollow('hold-talk',state.week,{opponent}))
   ]);
  }
 },
 'hold-talk':{
  actor:1,scene:()=>dilemmaScene('Back to the training barn','You tell 2 Holds that the locker room refuses to take Hold Two as it is. He loosens Hold One and goes straight to Hold Two. “The pressure in Hold Two is the problem? Show me which part. I can change the grip.”',[
   dilemmaChoice('Drop Hold Two from matches. Keep him booked with Hold One.',()=>{
    dilemmaData().holds='one';dilemmaTrust(1,-6);
    dilemmaNote('2 Holds closes the second page of his notebook. “All right. I’ll make One last.”',[1]);
   }),
   dilemmaChoice('Ask 2 Holds to take four weeks off and come back with a replacement for Hold Two.',()=>{
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
  scene:()=>dilemmaScene('A new nameplate','2 Holds holds up a sign that reads 2 TOWERS. “Keep both holds. Change the name to 2 Towers. Put it on the poster and tell people they can’t topple me.”',[
   dilemmaChoice('Reject the name. Tell him the Twin Towers joke will overshadow his wrestling.',()=>dilemmaRejectTowers()),
   dilemmaChoice('Approve the 2 Towers name for this show. See how the crowd reacts.',()=>{
    dilemmaNameTowers();
    if(!state.card.some(s=>matchPeople(s).includes(1)))dilemmaBook(dilemmaPromo(1,null,'Solo address','I cannot be toppled.'),'two-towers');
   })
  ])
 },
 'towers-press':{
  actor:1,scene:()=>dilemmaScene('The local press calls','“Who signed off on 2 Towers, and why did the WWA think it belonged on the bill?”',[
   dilemmaChoice('Take responsibility publicly and confirm the return to 2 Holds.',()=>{
    dilemmaTrust(1,3);dilemmaNote('The local paper prints the booker’s statement and confirms 2 Holds will return.',[1]);
   }),
   dilemmaChoice('Explain that he proposed it and you failed to pull it.',()=>{
    dilemmaTrust(1,-5);dilemmaNote('The local paper runs the explanation. 2 Holds folds the story under the nameplate in his locker.',[1]);
   })
  ])
 }
};

Object.assign(DILEMMAS,{
 'forbidden-move':{
  actor:0,week:2,ready:()=>state.card.some(s=>s.kind==='match'&&matchPeople(s).includes(0)),
  scene:()=>dilemmaScene('The Forbidden Move','“Athens only whispers its name. Let me try the Forbidden Move in my match tonight, mortal. I need to feel the whole room go quiet before I can put it in my picture.”',[
   dilemmaChoice('Approve the Forbidden Move for tonight’s match.',()=>{dilemmaData().forbidden=state.week;dilemmaTrust(0,5)}),
   dilemmaChoice('Rule it out. Tell Greek the opponent needs to be able to work next week.',()=>{dilemmaTrust(0,-6);dilemmaNote('Greek closes his notebook. “My climax was on that page, mortal.”',[0])})
  ])
 },
 'demeter':{
  actor:0,week:6,scene:()=>dilemmaScene('Demeter’s big scene','“Book me against Demeter at the next big show, mortal. He’s the leading man in my new picture and he’s never wrestled. I can get him for one night. When the bell rings, I need the cameras rolling.”',[
   dilemmaChoice('Book Greek vs. Demeter at the next big show.',()=>{
    const due=monthlyEvent().week;
    dilemmaData().demeter={due,rehearsed:false};dilemmaTrust(0,7);
    dilemmaFollow('demeter-rehearsal',due);
    dilemmaScheduleCard();
   }),
   dilemmaChoice('Keep the big show for trained wrestlers. Turn down the cameo.',()=>{
    dilemmaTrust(0,-7);
    if(dilemmaAngry(0))dilemmaFollow('demeter-premiere',monthlyEvent().week+1);
    dilemmaNote('“You’re cutting my picture before we shoot it,” Greek says.',[0]);
   })
  ])
 },
 'demeter-rehearsal':{
  actor:0,scene:()=>dilemmaScene('The first rehearsal','“Demeter knows his entrance, mortal. Give me one free evening to take him from there to the final bell before he tries it in front of Athens.”',[
   dilemmaChoice('Spend an evening rehearsing.',()=>{dilemmaData().demeter.rehearsed=true;dilemmaTrust(0,4)}),
   dilemmaChoice('Save the evening for somebody else. Have Greek lead Demeter through the match on the night.',()=>dilemmaNote('Greek tells Demeter to follow his lead when the bell rings.',[0]))
  ])
 },
 'demeter-premiere':{
  actor:0,scene:()=>dilemmaScene('A rival premiere','“They gave me the ring, mortal. You can see their banner in every shot.”',[
   dilemmaChoice('Watch the footage and see how much credit the rival gets.',()=>{state.rep=clamp(state.rep-2);dilemmaNote('The rival’s name stays in the frame when the crowd stands up.',[0])})
  ])
 },
 'broom-angle':{
  actor:10,week:3,ready:()=>!dilemmaUnavailable(20),
  scene:()=>dilemmaScene('Sweep him off the show','“Book me a face-off with the Grinch, boss. I’ll bring the broom. After I’m done, keep him off the next two shows. Give me two weeks without bloody glitter.”',[
   dilemmaChoice('Ask the Grinch if he’ll work the face-off and sit out two shows.',()=>dilemmaFollow('broom-grinch')),
   dilemmaChoice('Keep the Grinch on the card. Tell Sweeps to deal with the glitter on the mic.',()=>{
    dilemmaTrust(10,-5);dilemmaNote('Sweeps grabs the mic long enough to ask who’s been leaving glitter in his hall.',[10,20]);
    developStory(10,20,8,'Sweeps blamed the Grinch for the glitter in the hall.');
   })
  ])
 },
 'broom-grinch':{
  actor:20,scene:()=>dilemmaScene('A word with the Grinch','“Sweeps wants to chase me out with a broom? Would this be a real two-week break? I’ve already cut the hearts for next week!”',[
   dilemmaChoice('Ask him to sit out the next two shows.',()=>{
    if(w(20).trust>=65){dilemmaTrust(20,-3);dilemmaData().broomAngle=state.week;dilemmaBook(dilemmaPromo(10,20,'Face-off','Sweeps has one last mess to clear.'),'broom-angle');}
    else dilemmaFollow('broom-refusal');
   }),
   dilemmaChoice('Keep the Grinch on the card and tell Sweeps the face-off is off.',()=>{dilemmaTrust(10,-12);dilemmaNote('Sweeps asks whether you want him to clean up your promises, too.',[10,20])})
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
   dilemmaChoice('Approve Charming’s fire-for-insurance scheme and risk the fallout.',()=>{
    dilemmaTrust(18,6);
    if(dilemmaRoll('ring-fire',.5)){state.cash+=650;dilemmaNote('A replacement ring arrives. After Charming’s share, the payout leaves $650 in the till.',[18]);}
    else{dilemmaAwayNow(18,3);dilemmaFollow('ring-replacement',state.week+1);dilemmaNote('Charming was identified on the security footage. He will miss four shows.',[18]);}
   }),
   dilemmaChoice('Tell Charming to leave the ring alone.',()=>{
    if(dilemmaAngry(18)){dilemmaFollow('ring-replacement',state.week+1);dilemmaNote('The ring burns anyway. Charming sends an invoice for his share.',[18]);}
    else{dilemmaTrust(18,-3);dilemmaNote('Charming puts his invoice away. “Of course. Kindly expect advance notice of the next proposal as well.”',[18]);}
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
  scene:()=>dilemmaScene('Tea in the front row','“A gentleman agreed to a front-row seat. Please let Charming serve the gentleman a cup of very hot tea during the show. A spill would make such a memorable welcome.”',[
   dilemmaChoice('Let Charming take the hot tea to the front row during the show.',()=>{
    dilemmaData().tea=state.week;
    if(!state.card.some(s=>matchPeople(s).includes(18)))dilemmaBook(dilemmaPromo(18),'hot-tea');
   }),
   dilemmaChoice('Keep the tea away from the crowd. Give Charming a solo promo.',()=>{dilemmaTrust(18,-4);dilemmaBook(dilemmaPromo(18,null,'Solo address','Please remain seated. Charming has prepared a formal complaint about the front row, and every row deserves to hear it.'),'tea-complaint')})
  ])
 },
 'lemon-ask':{
  actor:20,week:3,ready:()=>!dilemmaUnavailable(23),
  scene:()=>dilemmaScene('Ask Lemon Tart','“Lemon Tart and I are friends. I’d like to ask her out. Could you find out if she’d want a date?”',[
   dilemmaChoice('Send him to ask her privately. Hear how it went next week.',()=>dilemmaFollow('lemon-answer',state.week+1,{direct:false})),
   dilemmaChoice('Spend an evening asking Lemon Tart privately on his behalf.',()=>dilemmaFollow('lemon-answer',state.week,{direct:true})),
   dilemmaChoice('Keep the booking office out of it. Leave the date off the show.',()=>{dilemmaTrust(20,-3);dilemmaNote('The Grinch puts the note back in his pocket.',[20])})
  ])
 },
 'lemon-answer':{
  actor:23,scene:task=>{
   const answer=dilemmaLemonAnswer();
   const lines={interested:'“Tell him I’d go out with him. If he wants the whole town there, he can ask the whole town instead.”',unsure:'“I need time to think. I can still be his friend while I’m thinking.”',friend:'“I like him as a friend. Tell him exactly that.”'};
   return dilemmaScene(task.direct?'An evening with Lemon Tart':'The Grinch comes back',task.direct?lines[answer]:`The Grinch tells you how Lemon Tart answered when he asked her out: ${lines[answer]}`,[
    dilemmaChoice(task.direct?'Spend the evening and take her answer back.':'Accept her answer and move on.',()=>{dilemmaData().lemon=answer;dilemmaNote(`Lemon Tart’s answer reached the Grinch. ${lines[answer]}`,[20,23])})
   ]);
  }
 },
 'tunnel-love':{
  actor:20,week:7,ready:()=>!dilemmaUnavailable(23),
  scene:()=>dilemmaScene('The Tunnel of Love','“I’ve built a tunnel of hearts! Can I open this week’s show by asking Lemon Tart out in front of everybody? I made room for her to answer on the mic!”',[
   dilemmaChoice('Book the public invitation as the opener and give Lemon Tart the mic to answer.',()=>{
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
   dilemmaChoice('Use disqualifications wherever the match rules allow them.',()=>{
    dilemmaData().dqWeek=state.week;dilemmaTrust(31,7);
    for(const segment of state.card)if(segment.kind==='match'&&dilemmaAllowsDQ(segment))forceDQ(segment);
   }),
   dilemmaChoice('Keep your planned finishes and tell Ron the referee will call each match as booked.',()=>{
    dilemmaTrust(31,-5);
    if(dilemmaAngry(31))dilemmaData().dqInterruption=state.week;
    else dilemmaNote('Ron files a written disappointment and leaves the finishes alone.',[31]);
   })
  ])
 },
 'commissioner':{
  actor:31,week:8,scene:()=>dilemmaScene('Commissioner Toledo','“Appoint me commissioner and let me open the next three shows. If that requires a trial period, give me one show. The WWA needs leadership from precisely the middle of the room.”',[
   dilemmaChoice('Appoint him commissioner to open the next three shows.',()=>{dilemmaData().commissioner={start:state.week+1,end:state.week+3};dilemmaTrust(31,8)}),
   dilemmaChoice('Give him next week’s show as a one-night guest GM.',()=>{dilemmaData().commissioner={start:state.week+1,end:state.week+1,guest:true};dilemmaTrust(31,4)}),
   dilemmaChoice('Keep booking authority with the office. Decline both terms.',()=>{dilemmaTrust(31,-4);dilemmaFollow('ron-floor',state.week+1)})
  ])
 },
 'ron-floor':{
  actor:31,scene:()=>dilemmaScene('A motion from the floor','“I move for the same timer on everybody’s microphone. It has taken eleven minutes to agree who gets to propose that.”',[
   dilemmaChoice('Let the locker room vote on equal time.',()=>{dilemmaTrust(31,3);dilemmaNote('The room votes to keep the shorter speeches. Ron records the result.',[31])}),
   dilemmaChoice('Dismiss the motion.',()=>{dilemmaTrust(31,-3);dilemmaNote('Ron records your dismissal on both sides of the page.',[31])})
  ])
 },
 'liam-drunk':{
  actor:34,week:3,scene:()=>dilemmaScene('Liam wants a fight','Liam steadies himself on the doorway. “Put me in a bloody match tonight. I can still make the walk to the ring. Look.”',[
   dilemmaChoice('Give Liam the match tonight and accept the risk to the segment.',()=>{
    const opponent=dilemmaOpponent(34);
    if(dilemmaBook(dilemmaMatch(34,opponent),'liam-drunk')){dilemmaData().liamDrunk={week:state.week,opponent};dilemmaTrust(34,3)}
   }),
   dilemmaChoice('Pull Liam for tonight. Get him some water and reconsider next week.',()=>{
    dilemmaAwayNow(34,0);
    if(dilemmaAngry(34)){dilemmaTrust(34,-8);dilemmaNote('Liam picks a fight with the booker. The meeting ends there.',[34]);}
    else dilemmaNote('Liam takes the water. “Next week. Put my name down for next week.”',[34]);
   })
  ])
 },
 'kill-polanski':{
  actor:34,week:7,ready:()=>!dilemmaUnavailable(0),
  scene:()=>dilemmaScene('Kill Polanski','“Greek took my shot at Demeter’s Baby. I’ve already got a poster that says “Kill Polanski.” Give us a match and I can finally get paid for a fight with him.”',[
   dilemmaChoice('Book Kill Polanski. It’ll draw.',()=>{
    dilemmaBook(dilemmaMatch(34,0,KILL_POLANSKI),'kill-polanski');dilemmaTrust(34,8);dilemmaTrust(0,-12);
   }),
   dilemmaChoice('Keep them apart on tonight’s card. Tell Liam you won’t promote that fight.',()=>{
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
  scene:()=>dilemmaScene('Fetch?','“Dog requests a practice throw. Dog can chase the ball all the way to the far end of the park.” The Dog is looking at the ball in your hand.',[
   dilemmaChoice('Take the Dog to the park and try a throw.',()=>dilemmaFollow('dog-park'))
  ])
 },
 'dog-park':{
  actor:37,scene:()=>dilemmaScene('Across the park','You’re winding up for another throw when you see 2 Holds walking his own dog past the gate.',[
   dilemmaChoice('Call it a day. Get the Dog to come with you.',()=>dilemmaFetch(false)),
   dilemmaChoice('Keep playing fetch.',()=>dilemmaFetch(true))
  ])
 },
 'dog-owner':{
  actor:37,week:6,scene:()=>dilemmaScene('I need an Owner','“Dog needs an Owner. Dog means someone in the corner when the bell rings. Is there a rule about where to find one?”',[
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
   return dilemmaScene(`A word with ${r.name}`,rudy?'“Coach, I can keep track of a football as long as somebody points that way. What does the Dog need me to do from the corner?”':`“The Dog asked if I’d be his Owner. What would that involve?”`,[
    dilemmaChoice('Ask them to be the Dog’s ringside second when available.',()=>{
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
 tunnel:{title:'He found a microphone',line:'The Grinch has taken a microphone into the aisle. He wants to ask Lemon Tart out in front of the crowd and give her the mic to answer.',choices:['Get the show back on track','Let him finish and give Lemon Tart the mic']},
 dq:{title:'Ron won’t leave the referee alone',line:'Ron is headed back to ringside with a clipboard and an objection to every finish on the card.',choices:['Have the crew keep him backstage','Let Ron force disqualifications across the card']},
 forbidden:{title:'Greek signals for the Forbidden Move',line:'Greek looks to the curtain. His opponent is already asking what he’s doing.',choices:['Wave it off','Let Greek try it']},
 tea:{title:'Tea for the front row',line:'Charming stops the segment and lifts a cup of hot tea toward the man in the front row. He looks to the curtain for permission to take it down.',choices:['Call off the tea bit','Cue Charming to take the tea down']}
};

const RON_LEGACY_FINAL = {kind:'final',when:{},cue:"Ron rehearses the final abstention without privileging either promotion",
   invite:"Camera test. Ask which side. Leave the camera running until both stop asking.",
   tell:"Ron sets a microphone between two nameplates and starts rehearsing his final answer.",
   line:"The hearing is this week. I will say “neither” once. If somebody demands a second answer, whose job is it to end the hearing?",
   replies:[
    {style:'bureaucrat',text:"I’ll close the segment when you give the answer. Any further questions can come to me.",reaction:"“Please note the time it closes. I intend to refer people to it.”"},
    {style:'straight',text:"Give them one clean sentence to quote. Walk off as soon as you finish it.",reaction:"“I have a shorter walk planned than most people’s opening remarks.”"}
   ]};
const RON_LEGACY_ENDINGS = {
  best:{title:"The Abstention Stands",line:"Ron folds both statements into the same file. “Both promotions had equal time. Neither got an endorsement. At last, the question is closed.”"},
  neutral:{title:'Neutral in Perpetuity',line:"Ron stamps the hearing record. “No endorsement entered. Some people are still arguing over the wording, which is why the stamp is getting louder.”"},
  bad:{title:"An Empty Record",line:"Ron sets both folders down. “No hearing. No allegiance. Both sides have somehow managed to take this personally.”"}
 };
