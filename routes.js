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
  tells:{wary:'He refers to you only as “the mortal,” and only in the third person.',friendly:'He receives you briefly, between labors.',warm:'He has started naming you in his monologues.',devoted:'He names you in every monologue now, usually as “the Bard.”'},
  moods:{
   low:{style:'believer',tell:'Greek has chalked “the legend still holds” three times on the boiler. Each copy is smaller than the one above it.'},
   high:{style:'hype',tell:'He has chalked the crowd’s chant on the boiler in letters twice as large as his own verse. There’s room beneath it for another line.'}
  },distrusts:'bureaucrat',
  stale:'Bard. A refrain goes between the verses. There must also be verses.',
  heard:'{name} brought me your version of the tale. Curious how quickly my Bard learned somebody else’s meter.',
  invite:{wary:'Olympus has not summoned you. The boiler room door is propped open anyway.',friendly:'Olympus receives petitioners until nine.',warm:'The gods convene tonight. Bring your lyre. (Bring snacks.)'},
  signoff:{wary:'Go now, mortal.',friendly:'Sing of this.',warm:'Until the next verse, Bard.',devoted:'Thy name is in the song, Bard.'},
  sore:'The gods heard what you said, mortal. They have excellent hearing for that sort of thing.',
  reacts:{kept:'Greek adds a line to the epic in your honor.',broken:'Greek leaves a blank verse where your promise was meant to go.'},
  jealous:'Greek taps a blank verse. “Did {name} even know what to do with a chorus?”',
  epilogue:{
   best:{title:'A Place in the Song',line:'Greek leaves his wreath on the boiler. “I have left your verse in. It begins before the first bell.”'},
   neutral:{title:'Intermission on Olympus',line:'Greek rubs chalk from his hands. “The pipes have gone quiet, Bard. That is how they call an intermission.”'},
   bad:{title:'The Unnamed Mortal',line:'Greek leaves his wreath on the boiler. “A mortal once promised me a verse. The gods remember which one of us said it.”'}
  },
  scenes:[
   {line:'The boiler hisses its approval. The twelfth labor approaches. Liam has put his own name on the call sheet. Who shall announce the labor?',replies:[
    {style:'hype',text:'You will. Take the mic this week. Give the hall the kind of opening verse they can shout back.',promise:'promo',reaction:'He clasps your forearm. “Then the song has begun.”',
     cases:[{when:{lostLastShow:true},delta:-2,reaction:'His hand stops short of your arm. “I heard the bell, Bard. I can still hear it without a chorus.”'}]},
    {style:'believer',text:'Hear Liam out. A challenger who asks for you is part of the epic, too.',reaction:'He sets a second stool by the boiler. “Olympus can hear a petitioner standing or seated.”'},
    {breaks:true,text:'Save the announcement until the match is signed. I’ve had to reprint that poster twice.',reaction:'He lays the chalk flat. “Then the gods shall announce their own labors.”'}]},
   {line:'An omen! The pipes rattled thrice during my training. Ron called it an objection from the building. Interpret it, booker.',replies:[
    {style:'hype',text:'Three rattles. A three-count. I’ll give you the mic this week. Teach the hall to count with you.',promise:'promo',reaction:'He taps out the count. “Then the fourth sound is theirs to make.”'},
    {style:'believer',text:'Hear Ron out. An oracle can speak through a man who’d rather be taking minutes.',sides:{31:2},reaction:'He listens for a long time. “We shall require a second chair at Delphi.”'},
    {breaks:true,text:'Ask Bev to look at the pipes before doors. Last time a rattle cost us the hot water.',reaction:'He turns to face the wall. “When she has finished, I shall ask them what they meant.”'}]},
   {line:'Joan from the front row has lent me a scarf. She says heroes catch cold too. How do I give it back with due ceremony?',replies:[
    {style:'hype',text:'A herald’s salute. Right to Joan, where the whole hall can see her.',reaction:'He holds the scarf at shoulder height. “The protector of throats and keeper of row one!”'},
    {style:'believer',text:'Fold it yourself and thank Joan by name. Let her be the only one who hears you.',reaction:'He folds it twice. “A private audience, then. I shall leave room for her to speak.”'},
    {breaks:true,text:'Leave it at the ticket table. Joan can pick it up whenever she gets in.',reaction:'He tucks the scarf under his arm. “Very well. I shall find out who has been appointed keeper of the ticket table.”'}]},
   {line:'My laurel split on a ceiling tile. The next entrance ought to come down from the rafters. I have brought a ladder. Does Olympus demand it?',replies:[
    {style:'hype',text:'I’ll put you on the card this week. Bring the heavens down to floor level. Crown yourself under the house lights.',promise:'appearance',reaction:'He tries the motion beneath the lowest pipe. “The heavens can come down to me.”'},
    {style:'believer',text:'Wear the crack where they can see it. Let the wreath tell them what you’ve already come through.',reaction:'He turns the wreath around. “The damage may remain in the record.”'},
    {truth:true,text:'Get off the ladder. One bad step puts you on the floor before anybody’s ready to catch you.',reaction:'He keeps a boot on the bottom rung another beat. Then he steps down. “Put the ladder away before I make a speech about it.”'}]},
   {line:'Liam brought back the wooden sword from Demeter’s Daughter. He left it outside Olympus with the point toward the door. Challenge or courtesy?',replies:[
    {style:'hype',text:'Give him back the sword in front of the company. Tell him you finally found him a part: bearer of props.',sides:{34:-3},reaction:'He tries the introduction once with the sword level across his palms. “I shall leave a pause for the company to laugh.”',
     cases:[{when:{wonLastShow:true},delta:3,reaction:'He lowers the sword. “I’ve had my applause this week. I needn’t take his as well.”',sides:{}}]},
    {style:'believer',text:'Ask him in. He brought it back intact. Start with what you can see.',reaction:'Greek opens the door another inch. “The blade is sound. I can start there.”'},
    {breaks:true,text:'Put it in the prop cupboard. Nobody needs to settle this before the next rehearsal.',reaction:'He props the sword beside the entrance. “If it came as a question, it can wait here for its answer.”'}]}
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
 34:{speaker:'Liam',style:'straight',place:'The safehouse (a booth at Door County Lanes)',days:['Sunday'],
  tells:{wary:'He calls you “the asset” and sits facing the door.',friendly:'He briefs you, but only on a need-to-know basis.',warm:'He has given you a codename: Lantern.',devoted:'He has trusted you, Lantern, with the flip phone’s other number.'},
  moods:{
   low:{style:'bureaucrat',tell:'Liam has drawn four empty boxes on the back of his exit map. He’s left a pencil beside each seat.'},
   high:{style:'straight',tell:'The exit map is folded small enough to fit beneath his coffee. He leaves it there when you sit down.'}
  },distrusts:'hype',
  stale:'Copy. Three transmissions, same words. Send me the part that changed.',
  heard:'{name} repeated your words back to me. If it’s about me, use the booth.',
  invite:{wary:'The flip phone is off. It’s Sunday, so he’s at the lanes anyway.',friendly:'Booth. Sunday. 1900.',warm:'Lantern. Lane nine. 1900. Come alone. Bring quarters.'},
  signoff:{wary:'This conversation didn’t happen.',friendly:'Stay low.',warm:'Good work, Lantern.',devoted:'If anyone asks, Lantern, you were never here. Thank you for being here.'},
  sore:'You dismissed the last briefing. I remember who listens. That’s my job.',
  reacts:{kept:'Liam checks one box on the mission card and puts the phone away.',broken:'Liam draws a line through your rendezvous time and starts a new exit map.'},
  jealous:'Liam glances at the door. “You met with {name}. Next time tell me which door you plan to use.”',
  epilogue:{
   best:{title:'Contact Established',line:'Liam folds the map. “You knew when to call and when to leave the line quiet. I’ll keep your number.”'},
   neutral:{title:'Until Sunday',line:'Liam checks the time. “I’ll be at the booth. Come if you have something that can’t wait another week.”'},
   bad:{title:'Alternate Exit',line:'Liam folds the map. “If you need me, I won’t be at the door we agreed on.”'}
  },
  scenes:[
   {line:'Your next show. Exits?',replies:[
    {style:'straight',text:'Front and back. You have a match this week. I’ll check both doors with you before we let anybody in.',promise:'appearance',reaction:'He folds the map along the aisle. “Both doors. Before anybody’s watching.”'},
    {style:'bureaucrat',text:'I’ll mark a primary, a backup, and who has each key. You keep one copy and Bev keeps the other.',reaction:'He puts his pencil in the crease of the napkin. “Two copies. Same marks.”',
     cases:[{when:{lostLastShow:true},morale:2,reaction:'He slides you the napkin. “Put my name on the first door. I want one thing I can check myself.”'}]},
    {breaks:true,text:'The hall has lighted signs. I need the crew working on the entrance first.',reaction:'He puts the phone away. “I’ll walk the other end myself.”'}]},
   {line:'Someone left a single pin standing on lane nine. Greek says it’s the last challenger in his epic. He knows which lane I use.',replies:[
    {style:'straight',text:'Tell Greek to come to the booth and ask you himself. He can leave the chorus at the boiler.',sides:{0:-3},reaction:'Liam pulls the chair out opposite his. “One seat. No chorus.”'},
    {style:'bureaucrat',text:'Ask who had the lane before you. Log the time and what you can verify before you call it a message.',reaction:'He writes LANE NINE above a blank line. “The rest can stay empty.”'},
    {breaks:true,text:'Have the desk reset the rack. They’ll need the lane back if we’re staying another game.',reaction:'He looks at the lone pin until the sweep bar takes it.'}]},
   {line:'They moved the booth six inches to clean behind it. The view of the door is different. What else has changed?',replies:[
    {style:'straight',text:'The pin rack blocks the back hall now. Turn your chair a little toward the lanes.',reaction:'He shifts exactly that far. “Good. I’ll see a hand on the door before it opens.”'},
    {style:'bureaucrat',text:'Date the new sight line. Cross out the old one so nobody follows it by mistake.',reaction:'He makes the mark on a napkin. “Last Sunday’s plan just became history.”'},
    {breaks:true,text:'Ask for a different booth. They can seat us facing the door and we can get on with the night.',reaction:'He stays in his seat. “Then this becomes a table we never checked.”'}]},
   {line:'I used a false name on the score screen. The next lane entered the same three letters. They’re still bowling. I can be at their table before they finish the frame.',replies:[
    {style:'straight',text:'Let them have the letters. When you leave, keep the usual exit.',reaction:'He leaves the last frame empty. “Three letters aren’t worth changing the whole route.”'},
    {style:'bureaucrat',text:'Wait for a second signal. Write down what would count as one before you start looking.',reaction:'He writes a single line on the back of the score sheet. “If it happens, we’ll both see it.”'},
    {truth:true,text:'You’ve got three letters and somebody finishing a game. Go over there now and you’re the one starting trouble.',reaction:'He takes his hand off the back of the chair. “Then we leave them their last frame.”'}]},
   {line:'They called last frame. People are packing up. I put a quarter on the table for whoever comes in next Sunday.',replies:[
    {style:'straight',text:'Leave it under the menu. I’ll put you on the card this week. We can leave one by the ticket window, too.',promise:'appearance',reaction:'He slides the quarter under the menu. “By the window. Where you can reach it without asking.”',
     cases:[{when:{wonLastShow:true},morale:2,reaction:'He checks the quarter is far enough under the menu to stay put. “Someone held the front door for me after the bell. I can leave two.”'}]},
    {style:'bureaucrat',text:'Leave it with the desk in an envelope marked LANE NINE, SUNDAY. They’ll know where it goes.',reaction:'He finds an envelope under the scorecards. “I can put my number on the back if the desk has questions.”'},
    {breaks:true,text:'Give it to the counter for the change cup. It’ll get used before somebody clears the table.',reaction:'He pushes the quarter halfway across the table. “Leave me the next one.”'}]}
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
const ROUTE_STORIES={
 // The title promise covers a defense or a chance to reclaim the belt.
 0:{beats:{
  'name-in-the-song':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, Greek names you his bard',
   plan:'Greek names his bard and asks the crowd to sing the opening verse',
   line:'The boiler has spoken. An epic needs a bard. I have already written your name in the margin. Can you hear the chorus?',
   replies:[
    {style:'hype',text:'Let them hear you name me on the mic. I’ll give the front row the first verse.',promise:'promo',reaction:'He cups a hand to the pipes. “Even the gods have gone quiet to listen.”'},
    {style:'straight',text:'I can keep the verses in order. How many are there?',reaction:'He unfolds a second sheet. “We shall count intermissions as verses.”'},
    {breaks:true,text:'Take my name off the boiler, please.',reaction:'He rubs away the chalk with his sleeve. “Then the chorus shall know you by the silence.”'}
   ]},
  'mortal-in-the-ring':{kind:'beat',when:{minTrust:62},cue:'Once Greek trusts you to give the epic a worthy opponent',
   plan:'Greek faces a worthy challenger under one light, with no grand entrance',
   line:'I wrote myself another triumph. The pipes gave me nothing. Perhaps the gods want to see a mortal put a shoulder into me.',
   replies:[
    {style:'hype',text:'You have a match this week. Let the other corner give the chorus something to fear.',promise:'appearance',reaction:'He strikes the word TRIUMPH from his page. “Good. The second act can breathe.”'},
    {style:'believer',text:'Leave the outcome blank and see what the pipes say after the bell.',reaction:'He sets his chalk down. “An unwritten verse. Terrible thing to hand a mortal.”'},
    {breaks:true,text:'The pipes don’t care who you wrestle.',reaction:'He folds his page over the word mortal. “They have made their feelings about one mortal quite clear.”'}
   ]},
  'room-for-the-chorus':{kind:'beat',when:{minTrust:68},cue:'Once warm, Greek makes room for a chorus that can doubt him',
   plan:'Greek teaches the front row the chorus response: “Even you”',
   line:'The chorus in a tragedy tells the hero the truth. Mine keeps telling me my entrance is tremendous. I may have taught them the wrong verse.',
   replies:[
    {style:'hype',text:'Take the mic this week. Teach them to answer “Even you” when you say “A hero can fall.”',promise:'promo',reaction:'He mouths both halves. The second one takes him longer. “That’ll carry to the back.”'},
    {style:'straight',text:'Ask them what they saw the last time you wrestled.',reaction:'He takes one hand off his laurel wreath. “And wait for the whole answer, I suppose.”'},
    {breaks:true,text:'Just ask them to cheer louder.',reaction:'He lifts his arms for applause. He lowers them before you can oblige.'}
   ]},
  'olympus-roof':{kind:'flag',when:{minTrust:70,lostLastShow:true},cue:'After the ladder, the week after Greek loses a match while warm',
   invite:'Bard. Roof above Olympus. Bring a coat. I am waiting for a sign.',
   memory:'olympus-roof',
   line:'The gods watched my shoulders hit. I thought they’d send thunder. Up here I can hear somebody dragging chairs across the floor.',
   replies:[
    {style:'hype',text:'That’s your chorus stacking chairs. They stayed after the hero fell.',reaction:'He leans toward the sound. “They stayed.” He puts his wreath back on, crooked.'},
    {style:'believer',text:'We can wait another minute. The gods have had longer than we have.',reaction:'He shifts over on the roof to make room. “One minute, Bard. Then we help with the chairs.”'},
    {breaks:true,text:'You lost a match. There’s nothing for the sky to explain.',reaction:'He folds his coat tighter. “You may go inside. I can hear the chairs from here.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, once he trusts you with the tragedy',
   askPromise:{kind:'title',due:'event',plan:'Stage Greek’s title match as a tragedy: one light, a chorus and a long silence at the bell'},
   invite:'Olympus. Bring the booking sheet. I have a tragedy to propose.',
   line:'Stage my next title match as a tragedy. One light. A chorus that knows I can fall. Let the bell end it, however it ends.',
   replies:[
    {style:'hype',ask:'accept',text:'The next tour show gets the whole tragedy. I’ll leave room for the chorus.',reaction:'He hands you the page with his name on it. “Leave room underneath, too. Someone else might be holding the belt.”'},
    {style:'straight',ask:'defer',delta:-2,text:'Hold the page for four weeks. I can’t stage it yet.',reaction:'He rolls it around the chalk. “Four weeks. Mind you do not mistake a pause for an ending.”'},
    {ask:'decline',delta:-10,text:'I won’t book the title match as a tragedy. Close the script.',reaction:'He draws a line through the empty space marked CHORUS. “Then I’ll hear the ending by myself.”'}
   ]},
  'chorus-call':{kind:'final',when:{},cue:'The week the title match is due, at chorus rehearsal',
   invite:'One rehearsal, Bard. You only need to know when to stop speaking.',
   line:'When the bell goes, I’ll want to tell them what it means. If I start, will you give the chorus its cue?',
   replies:[
    {style:'hype',text:'I’ll raise my hand. When it drops, the whole hall gets the last word.',reaction:'He watches your hand drop and keeps his mouth shut. His eyes fill before he takes his bow.'},
    {style:'believer',text:'Look at me when the bell goes. We’ll listen together.',reaction:'He takes off the wreath and sits beside you. Upstairs, somebody drags a chair across the hall.'}
   ]}
 },memories:[{id:'olympus-roof',title:'The Roof of Olympus',caption:'Week {week} · The chorus stayed to stack the chairs.'}],
 endings:{
  best:{title:'The Chorus Had the Last Word',line:'Greek rubs chalk from his hands. “I left a silence after the bell, Bard. There wasn’t a person in that hall who let me stand in it alone.”'},
  neutral:{title:'A Tragedy in One Light',line:'Greek leaves his wreath on the boiler. “I got my title match and said my piece. I wish I’d learned what the room wanted to say before I spoke over it.”'},
  bad:{title:'The Unstaged Tragedy',line:'Greek rubs chalk from his hands. “Leave the wreath on the boiler. If the gods ask, tell them the hero waited for his cue.”'}
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
  'mark-the-exits':{kind:'beat',when:{minTrust:55},cue:'After an introductory visit, he briefs his handler on the hall exits',
   plan:'Liam walks the entrance and exit with the door crew before his match',
   line:'The kitchen door sticks at the bottom. The front doors open both ways. Put me in the ring and I can map the distance between them.',
   replies:[
    {style:'straight',text:'You have a match this week. Walk the exit with the door crew before the bell.',promise:'appearance',reaction:'He folds the map into fourths. “Good. If I’m late, check the kitchen first.”'},
    {style:'bureaucrat',text:'Mark who has each door and when they hand it over.',reaction:'He draws a box for each door. “Leave a space for whoever’s still here after close.”'},
    {breaks:true,text:'The exit signs tell you everything you need.',reaction:'He puts one finger on the kitchen door. “The sign doesn’t know the door sticks.”'}
   ]},
  'cover-story':{kind:'beat',when:{minTrust:62},cue:'Once friendly, he asks for a short public signal',
   plan:'Liam uses a short mic segment to tell the room that the bell is the signal',
   line:'We need a signal the whole room can hear. If I tell them at sound check, only the crew knows. Get me a microphone.',
   replies:[
    {style:'straight',text:'You have the mic this week. Tell them which bell to listen for.',promise:'promo',reaction:'He underlines one word. “After that I can keep my hands free.”'},
    {style:'believer',text:'They already know the bell. Tell them why you need them listening.',reaction:'He looks toward lane nine. “So they’ll know where to look if I don’t move.”'},
    {breaks:true,text:'Just wave. They’ll see you.',reaction:'He puts both hands on the table. “Not everybody gets a seat that can see.”'}
   ]},
  'one-way-out':{kind:'beat',when:{minTrust:68},cue:'Once warm, Liam tests a match with one route in and one route out',
   plan:'Liam enters and leaves by the same aisle, making his route visible to the whole room',
   line:'I’ve always kept three ways out. I want a match where I take the same aisle both ways. Everybody gets to see me leave.',
   replies:[
    {style:'straight',text:'You have a match this week. Same aisle in and out. I’ll keep it clear.',promise:'appearance',reaction:'He crosses two arrows off the map. “I thought that would make the room smaller.”'},
    {style:'believer',text:'Walk the aisle once with me before the room fills.',reaction:'He takes the map, then leaves it folded on the booth. “I know this one.”'},
    {breaks:true,text:'You can leave whichever way you like. Nobody’s tracking you.',reaction:'He folds the map until only the ring is visible. “I am.”'}
   ]},
  'go-dark':{kind:'flag',when:{minTrust:70},day:'Sunday',cue:'After the ladder, once warm, a Sunday threat comes through on his flip phone',
   invite:'Lantern. Booth. Sunday. Leave your phone off when you get here.',
   memory:'go-dark',
   line:'My phone says someone will be waiting by the kitchen door. They know my route. I need you to go dark with me tonight.',
   replies:[
    {style:'straight',text:'Phone off. We stay here until close. Then we walk out the front together.',reaction:'He sets the flip phone face down. Two lanes over, a ball hits the pins. Neither of you reaches for anything.'},
    {style:'believer',text:'Go dark. I’ll keep an eye on the door for the first hour.',reaction:'For the first time, he takes the seat with its back to the entrance. “Wake me if they shut the lanes down.”'},
    {breaks:true,text:'It’s probably a prank. Call the number back.',reaction:'He closes the phone. “You can make that call from somewhere else.”'}
   ]},
  ask:{kind:'ask',when:{minTrust:75},cue:'After the ladder, he requests one last mission at the next tour show',
   askPromise:{kind:'appearance',due:'event',plan:'Liam’s retirement match: one final extraction, with the aisle clear after the last bell'},
   invite:'Lantern. Sunday. One last brief. Bring the next tour card.',
   line:'Next tour show. One last match. After the bell, I take the front aisle. I want the people who saw me come in to see me go.',
   replies:[
    {style:'straight',ask:'accept',text:'Retirement match booked for the next tour show. I’ll be at the far end of the aisle.',reaction:'He taps the exit on the map once. “No need to meet me halfway. I want to walk it.”'},
    {style:'bureaucrat',ask:'defer',delta:-2,text:'I can’t clear the slot today. Brief me again in four weeks.',reaction:'He changes the date on his card. The words LAST MATCH stay where they are.'},
    {ask:'decline',delta:-10,text:'I won’t book the retirement match. There’s no extraction to plan.',reaction:'He puts the map in his coat. “I can still get myself home.”'}
   ]},
  'final-extraction':{kind:'final',when:{},day:'Sunday',cue:'The Sunday of his retirement-match week, a last check of the exit',
   invite:'Final radio check. Sunday. Same booth.',
   line:'When I come down the aisle, I might stop to look back. If I do, give me a second before you tell me to move.',
   replies:[
    {style:'straight',text:'Take the second. I’ll be at the door when you turn around.',reaction:'He counts the second silently. “I’ve never put time for that in a plan.”'},
    {style:'believer',text:'Lantern here. You tell me when the mission’s over.',reaction:'He pockets the phone without closing it. “I can do that.”'}
   ]}
 },memories:[{id:'go-dark',title:'Two Phones Off',caption:'Week {week} · The flip phone went quiet at the booth.'}],
 endings:{
  best:{title:'Final Extraction',line:'Liam checks the time. “I looked back. You gave me the second. I wanted one look at the ring with nowhere else I had to be.”'},
  neutral:{title:'Exit Secured',line:'Liam folds the map. “I got my last bell. I took the front aisle. Could have walked it a little slower.”'},
  bad:{title:'Line Closed',line:'Liam checks the time. “I left the map at the booth. You know the way out. If you call on Sunday, let it ring twice.”'}
 }}
};
