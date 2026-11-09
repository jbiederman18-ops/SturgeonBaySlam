'use strict';
// The wider roster: everyone who isn't one of the featured eight (routes.js). No logic lives here.
// These wrestlers have no evenings. They turn up in the after-show walk, sharing its four slots with the
// featured eight, and in show-night calls (CALL_HABITS in moments.js). Source: the Roster Spines doc
// (docs/design/roster-spines.md). Josh's wants, quirks and nevers are fixed.
// Every line is in kayfabe. AGENTS.md's hard character rule applies to every string in this file;
// Smark Wahlberg's sense of the booking sheet is the one approved exception (AGENTS.md names it).
//
// ───────────────────────────── FORMAT (read by relationships.js and aftershow.js) ─────────────────
// SUPPORTING_ROUTES[id]
//   speaker, style, distrusts, moods:{low,high} each {style,tell}, stale, heard    as in routes.js
//   backstage:{kind:moment}       same moments and placeholders as a featured route's `backstage`.
//                                 Write won, lost, flat, idle, skip; benched/cutIn where there's a bond.
//                                 Missing kinds fall back to BACKSTAGE_GENERIC.
//   Extra placeholders: {week} the week a promise was made (broken/remembers), {grade} tonight's grade.
//   Extra kinds: lostToCheat (beaten by someone who cheated or had a run-in; weight above lost),
//                remembers (3–8 weeks after a broken promise, a calm reminder).
//   Optional flags:
//     neverSkips      sore or not, they still come over (Rudy from Football never admits he's hurt)
//     noCutIn         never interrupts; the walk skips them for cut-ins (Carl lines up beside people)
//     moodOn:'heat'   tonight's crowd heat sets the mood, not a win or loss (low <50, high ≥80)
//     holdsGrudge     for 12 weeks after a broken promise, warm replies land at half (Terrible Towel)
//     leaks           replies with a style tell the other wrestler in the scene (−1, and they hear about it)
//     promiseWeight   {kind:n} that promise counts n times toward what a show owes (Katy's promos run long)
// ─────────────────────────────────────────────────────────────────────────────────────────────

const SUPPORTING_ROUTES={
 // ───────── Rudy, from Football ─────────
 2:{speaker:'Rudy',style:'believer',distrusts:'straight',neverSkips:true,
  moods:{low:{style:'bureaucrat',tell:'Rudy keeps adjusting a laminated team ID clipped to his jersey, squaring it to the light.'},high:{style:'believer',tell:'Rudy is telling the whole hallway it was a team effort, from his crutches.'}},
  stale:'“Right, right. Team. You said. I’m on it, coach.”',
  heard:'“{name} says you said something about me. That’s fine. That’s team talk. Teams talk.”',
  backstage:{
   won:{tell:'Rudy comes down the hall on two crutches, beaming.',line:'“Great game, great game. Could someone get my other shoe? It’s over there. Somewhere.”',replies:[
    {style:'believer',text:'“You’re one of the guys, Rudy. You always were.”',reaction:'He stops so fast a crutch skids. “One of the guys.” He says it twice more to make sure it took.'},
    {style:'hype',promise:'team',text:'“Next week you and {name} are on the same side. A real team.”',reaction:'“Teammates.” He offers {name} a fist bump from forty feet away.'},
    {style:'straight',text:'“Good win. Sit down before you fall down.”',reaction:'“Sitting’s for the bench, coach.” He sits anyway, very carefully.'}]},
   lost:{tell:'Rudy is upright, mostly, propped against the vending machine.',line:'“{name} played a heck of a game. I’m fine. Good to go next week.”',replies:[
    {style:'believer',text:'“You left it all out there. The team saw it.”',reaction:'“The team saw it.” He nods at nobody in particular, proud.'},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. It’s in writing.”',reaction:'He asks to see the writing. He reads it twice and hands it back like a game ball.'},
    {truth:true,text:'“Rudy, that’s a broken leg.”',reaction:'He looks down at it for a long time. “It’s a little tight.” Then, quieter: “Okay. Maybe ice.”'}]},
   flat:{tell:'Rudy is icing the wrong knee and humming the fight song.',line:'“That one didn’t go great. That’s on me, coach. Put me back in.”',replies:[
    {style:'believer',text:'“Nobody’s cutting you. You’re part of this.”',reaction:'“Part of this.” He stops humming to listen to it.'},
    {style:'hype',promise:'promo',text:'“Next week you get the mic. Fire up the locker room.”',reaction:'“A pep talk.” He’s already clapping. It hurts. He keeps clapping.'},
    {breaks:true,text:'“Maybe sit a week out, Rudy. Rest the legs.”',reaction:'He stands up on both of them to prove a point. “I don’t sit, coach. I’m fine.”'}]},
   idle:{tell:'Rudy is sitting outside the locker room in full uniform, waiting to be called in.',line:'“Been a few weeks, coach. Legs feel great. Ready whenever.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s sheet.”',reaction:'“The sheet!” He wants to know which line. He wants to see his name on it.'},
    {style:'believer',text:'“You’re still on the team, Rudy. Nobody forgot.”',reaction:'“Nobody forgot.” He taps his chest twice, like a jersey number.'},
    {style:'straight',text:'“Rest those legs. Then we’ll talk.”',reaction:'“They’re rested,” he says, standing on them. Something clicks. “See?”'}]},
   skip:'Rudy waves a crutch from across the lot, calls “Good game!” and keeps limping.'
  }},

 // ───────── One Man ─────────
 3:{speaker:'One Man',style:'hype',distrusts:'straight',
  moods:{low:{style:'believer',tell:'One Man is holding a team meeting in the corner. Nobody else is in it.'},high:{style:'hype',tell:'One Man is giving high fives down an empty line, one at a time.'}},
  stale:'“The boys heard you the first time. All of them.”',
  heard:'“{name} brought something you said to the meeting. We took a vote. We didn’t like it.”',
  backstage:{
   won:{tell:'One Man comes down the hall in a tight huddle with no one.',line:'“The boys did it. Every last one of us.”',replies:[
    {style:'hype',text:'“Best stable in the building.”',reaction:'“Best stable in the building.” He relays it to the boys. They take it well.'},
    {style:'believer',text:'“Tell the boys I said they were great.”',reaction:'He turns and tells them. He nods along to an answer only he can hear.'},
    {style:'hype',promise:'team',delta:-4,text:'“Imagine what you could do with a partner. You and {name}, next week.”',reaction:'The huddle goes silent. “We have partners,” One Man says. “We have plenty.”'}]},
   lost:{tell:'One Man is arguing strategy with himself by the ice machine, and losing.',line:'“{name} got us. We had a plan. Half of us didn’t follow it.”',replies:[
    {style:'believer',text:'“The stable’s still the stable. One bad night.”',reaction:'“One bad night.” He passes it down the line. Morale in the huddle picks up.'},
    {style:'hype',promise:'rematch',text:'“Take the whole stable at {name} again next week.”',reaction:'“The whole stable.” He counts heads. It takes no time at all.'},
    {style:'straight',text:'“It was one on one, that’s all.”',reaction:'“One on one,” he says carefully, “is how it always looks from outside.”'}]},
   flat:{tell:'One Man is taking attendance by the curtain.',line:'“Attendance was perfect tonight. Performance is a separate item on the agenda.”',replies:[
    {style:'believer',text:'“The boys will bounce back.”',reaction:'“They’re bouncing already. Listen.” Silence. He seems satisfied.'},
    {style:'hype',promise:'promo',text:'“Next week, put the whole stable on the mic.”',reaction:'“All of us. At once.” He clears his throat several times, in several voices.'},
    {truth:true,text:'“The boys couldn’t bail you out tonight.”',reaction:'He looks around the empty hallway. “We’ll put that on the training agenda.”'}]},
   idle:{tell:'One Man is waiting by your car, keeping the boys in line.',line:'“The boys keep asking when they’re back on the card. Loudly.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Next week. One booking for all of you.”',reaction:'“One booking for all of us.” He decides that’s fair and goes to tell them.'},
    {style:'believer',text:'“Tell them I haven’t forgotten a single one of them.”',reaction:'“Not a single one.” He tells each of them, which takes no time.'},
    {style:'straight',text:'“I only have room for one man.”',reaction:'He smiles. “Then you have the right man.”'}]},
   benched:{tell:'One Man watched from the back row with his arms folded, counting.',line:'“{name} has two holds. I have more members than that. And {name} got the spot.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Your whole stable is on next week’s card.”',reaction:'“The whole stable.” He nods to the boys. The boys nod back.'},
    {style:'believer',text:'“Two holds will never outnumber you.”',reaction:'“Nobody outnumbers us,” he says, and the boys agree.'},
    {style:'straight',text:'“{name} had one slot tonight. I’d have given you one slot too.”',reaction:'“One slot,” he repeats, “for one of us. You see the problem.”'}]},
   skip:'One Man walks past with the whole stable. Not one of them looks at you.'
  }},

 // ───────── Terrible Towel (Era II featured; this seeds his route) ─────────
 4:{speaker:'Towel',style:'straight',distrusts:'hype',moodOn:'heat',holdsGrudge:true,
  moods:{low:{style:'bureaucrat',tell:'Towel is folding one towel into smaller and smaller squares.'},high:{style:'straight',tell:'Towel stands by the rack very still, almost smiling.'}},
  stale:'“You’ve said that. I kept that one too.”',
  heard:'“{name} tells me you said something. I’ve put it with the rest.”',
  backstage:{
   won:{tell:'Towel walks up dabbing his brow with a fresh, folded towel.',line:'“That went well. I think. I’ll let you know in about a week.”',replies:[
    {style:'straight',text:'“Good match. Clean work.”',reaction:'A long pause. “Thank you.” You genuinely can’t tell if that was a joke.'},
    {style:'bureaucrat',text:'“I’ll write it down: Towel, main event candidate.”',reaction:'He reads it upside down. “Spell it right. I’ll check.”'},
    {style:'hype',promise:'promo',text:'“Main event stuff! Tell the whole town next week!”',reaction:'He folds your enthusiasm and sets it aside. “Noted. Loudly, I assume.”'}]},
   lost:{tell:'Towel is wringing out a towel over the sink, slowly and completely.',line:'“{name} beat me. I’ll remember that. I remember everything.”',replies:[
    {style:'bureaucrat',text:'“It’s on the record. So is everything you did right.”',reaction:'“Good. I like a record.” He hangs the towel up square.'},
    {style:'straight',text:'“You lost. You’ll get another one.”',reaction:'“I will.” Half a beat too flat to read. “I believe you.”'},
    {style:'hype',promise:'rematch',text:'“Next week, {name} gets what’s coming.”',reaction:'He nods once. “I’ll bring a fresh one.”'}]},
   flat:{tell:'Towel is standing under the exit sign, perfectly dry.',line:'“The crowd didn’t move tonight. I noticed. They noticed me noticing.”',replies:[
    {style:'bureaucrat',text:'“Some rooms run cold. It’s in the numbers.”',reaction:'“The numbers.” He likes that more than you expected.'},
    {style:'straight',text:'“It was flat. You’ll fix it.”',reaction:'“I will.” A pause. “That was me agreeing.”'},
    {style:'hype',promise:'promo',text:'“Next week the mic’s yours. Make them move.”',reaction:'“I’ll try enthusiasm,” he says, with none.'}]},
   broken:{tell:'Towel is waiting by your car with a towel folded over one arm, like a waiter.',line:'“You promised me {promise}, back in {week}. I’ve kept it for you.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“That’s on me. You’re on next week’s card. In ink.”',reaction:'“In ink.” He tucks the towel under his arm. “I’ll keep that too.”'},
    {style:'straight',text:'“I broke it. I’m sorry.”',reaction:'“Thank you.” He means it. He also isn’t going to forget it.'},
    {breaks:true,text:'“It was one promise, Towel.”',reaction:'“It was one,” he agrees. “I have it right here.”'}]},
   remembers:{tell:'Towel falls into step beside you, unhurried.',line:'“Lovely night. Reminds me of {week}. You made me a promise then.”',replies:[
    {style:'straight',text:'“I remember. I let you down.”',reaction:'“You did.” He seems almost relieved you said it. “Good night.”'},
    {style:'bureaucrat',promise:'appearance',text:'“Let me make it right. Next week’s card.”',reaction:'“Next week,” he repeats, and files it beside the other one.'},
    {style:'hype',text:'“That’s ancient history!”',reaction:'He folds the moment neatly. “Nothing’s ancient. Things just dry out.”'}]},
   idle:{tell:'Towel is standing by the rack near the door. Waiting.',line:'“Nobody’s reached for me in a while.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“I’ll be right here until then.”'},
    {style:'straight',text:'“The right spot hasn’t come up yet.”',reaction:'“It will. I’m very absorbent. I can wait.”'},
    {style:'believer',text:'“The towel everyone reaches for doesn’t stay on the rack.”',reaction:'“That was nearly a compliment. I’ll keep it.”'}]},
   benched:{tell:'Towel stands at the edge of the lot, listening to the bass still thumping inside.',line:'“{name} got the spot. The room’s still bouncing. I was going to make it stop.”',replies:[
    {style:'straight',text:'“{name} had the spot this week. That’s all it was.”',reaction:'“This week.” He writes the date on his palm.'},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Main slot.”',reaction:'“Main slot.” He wrings the word out slowly. “Fine.”'},
    {style:'hype',text:'“You’d have blown the roof off!”',reaction:'“I’d have kept the roof exactly where it was,” he says.'}]},
   cutIn:{tell:'Towel has been standing in the doorway the whole time, very quietly.',line:'“{name} counts the crowd in. I wait until they’re ready. That’s the difference.”',replies:[
    {style:'straight',text:'“Say your piece.”',reaction:'“That was my piece.” He folds his arms.'},
    {style:'bureaucrat',text:'“Noted, both of you.”',reaction:'“Thank you. Put mine on top.”'},
    {style:'hype',promise:'rematch',text:'“Settle it with {name} next week.”',reaction:'“Fine. I’ll bring two towels.”'}]},
   skip:'Towel walks past without stopping, folding something small and neat in his hands. He keeps everything.'
  }},

 // ───────── Rudy Giuliani (ring persona only) ─────────
 5:{speaker:'Giuliani',style:'hype',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'Giuliani is going through the rulebook with a highlighter, hunting for the clause that says he won.'},high:{style:'hype',tell:'Giuliani is shaking every hand in the hallway, including the ones that weren’t offered.'}},
  stale:'“Yes, yes. Heard it. Overruled.”',
  heard:'“{name} tells me you said something. I’d like that stricken from the record.”',
  backstage:{
   won:{tell:'Giuliani comes down the hall waving like he’s just been sworn in.',line:'“A clean, fair win. Mostly. The spirit of it was clean.”',replies:[
    {style:'hype',text:'“What a win!”',reaction:'He pumps your hand. “Sportsmanship. That’s what that was.”',
     cases:[{when:{cheatedTonight:true},reaction:'He pumps your hand. “Good, honest sportsmanship. The referee saw nothing, which proves it.”'}]},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Defend it.”',reaction:'“Defend it. Yes. I’ll prepare a defense.”'},
    {style:'straight',text:'“Good win. Next time, win it clean.”',reaction:'“Clean,” he says, as if you’ve introduced a foreign word.'}]},
   lost:{tell:'Giuliani is at the timekeeper’s table, demanding to inspect the bell.',line:'“That wasn’t a loss. That was a clerical error with a bell in it.”',replies:[
    {style:'bureaucrat',text:'“I’ll look into the paperwork.”',reaction:'“Thank you. Look very hard.” He points at a blank space on the form.'},
    {style:'hype',promise:'rematch',text:'“Run it back against {name} next week.”',reaction:'“A retrial. Yes. I accept.”'},
    {truth:true,text:'“{name} beat you fair and square.”',reaction:'He stares at you. “Fair. Square. Those are opinions.” He leaves the bell alone, though.'}]},
   lostToCheat:{tell:'Giuliani comes up the hall red to the ears, pointing back at the ring.',line:'“{name} cheated! In front of everyone! There are rules in this sport!”',replies:[
    {style:'bureaucrat',text:'“I’m filing a formal complaint about {name}.”',reaction:'“Formal. Good. Underline formal.” He watches you write it, breathing hard.'},
    {style:'hype',promise:'rematch',text:'“You get {name} next week, and you get it fair.”',reaction:'“Fair!” He seizes the word. “Finally someone in this building says fair.”'},
    {truth:true,text:'“You cheat every week, Rudy.”',reaction:'He opens his mouth. He closes it. “That’s different. That’s mine.”'}]},
   flat:{tell:'Giuliani is explaining to an empty folding chair why the crowd should have loved him.',line:'“The crowd was asleep. That’s on them. I want that on the record.”',replies:[
    {style:'bureaucrat',text:'“It’s on the record.”',reaction:'“Thank you.” He looks genuinely moved by the record.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and wake them up.”',reaction:'“A statement. A press conference. Yes.” He is already pointing at reporters who aren’t there.'},
    {style:'straight',text:'“It wasn’t the crowd.”',reaction:'“Everybody says that,” he says, “until it’s the crowd.”'}]},
   idle:{tell:'Giuliani is waiting by your car with a thick folder.',line:'“I’ve been off the card for weeks. I’ve prepared a legal argument.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“No argument needed. You’re on next week.”',reaction:'“I’ll file the argument anyway. For the record.”'},
    {style:'hype',text:'“Save it for the ring!”',reaction:'“Everything I say is for the ring.”'},
    {style:'straight',text:'“There hasn’t been a spot for you.”',reaction:'“There’s always a spot. You take it while the referee’s looking the other way.”'}]},
   skip:'Giuliani walks past, briefing a folding chair about you.'
  }},

 // ───────── Pissboy, P.H.D ─────────
 6:{speaker:'The Doctor',style:'believer',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'The Doctor is straightening a framed diploma he brought from home. It keeps hanging crooked.'},high:{style:'believer',tell:'The Doctor is signing autographs with a fountain pen, adding three letters after each one.'}},
  stale:'“Yes. Thank you. You’ve said. Doctor’s orders: vary it.”',
  heard:'“{name} says you used my first half. I’ll be noting that in your chart.”',
  backstage:{
   won:{tell:'The Doctor comes down the hall drying his hands, as if he’s just come out of surgery.',line:'“A textbook procedure. I’d like that in my file.”',replies:[
    {style:'believer',text:'“Doctor, that was outstanding.”',reaction:'“Doctor.” He closes his eyes for a moment. “Thank you. Finally.”'},
    {style:'bureaucrat',promise:'promo',text:'“I’ll put ‘Dr.’ on next week’s sheet. The mic is yours.”',reaction:'“With the period,” he says. “The period is load-bearing.”'},
    {breaks:true,text:'“Nice win, Pissboy.”',reaction:'His smile holds. His eye does not. “That half is administrative. We don’t use it socially.”'}]},
   lost:{tell:'The Doctor is consulting his own reflection in the trophy case.',line:'“{name} won. A second opinion would say otherwise.”',replies:[
    {style:'believer',text:'“Doctor, one result doesn’t undo the credentials.”',reaction:'“It does not.” He stands a little taller.'},
    {style:'bureaucrat',promise:'rematch',text:'“I’ll schedule a follow-up with {name}.”',reaction:'“A follow-up appointment.” He likes that very much.'},
    {truth:true,text:'“{name} beat you, Doctor. That’s the diagnosis.”',reaction:'“Harsh,” he says. “Correct. I’d have said it more gently.”'}]},
   flat:{tell:'The Doctor is giving the interview area a very wide berth.',line:'“I declined to elaborate tonight. On medical grounds.”',replies:[
    {truth:true,text:'“Doctor, you can’t dodge every promo.”',reaction:'He looks at his shoes. “Not every promo. Only the ones with skeptics in them.”'},
    {style:'believer',text:'“They’ll come around, Doctor.”',reaction:'“Patients usually do.”'},
    {breaks:true,text:'“Just get out there and talk, Pissboy.”',reaction:'“Doctor,” he corrects, and leaves.'}]},
   idle:{tell:'The Doctor is in the parking lot with a clipboard, taking his own pulse.',line:'“It’s been some weeks. I’m starting to worry about my bedside manner.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card, Doctor.”',reaction:'“Write ‘Dr.’ Please.” He watches you do it.'},
    {style:'believer',text:'“This roster needs a doctor.”',reaction:'“It does. Desperately.”'},
    {style:'straight',text:'“Nothing’s opened up yet.”',reaction:'“I’ll wait. I’m very patient.” He seems pleased with that one.'}]},
   skip:'The Doctor walks past without a word, holding his diploma to his chest like a shield.'
  }},

 // ───────── Mike “The Miz” Mizanin (ring persona only) ─────────
 7:{speaker:'Mike',style:'hype',distrusts:'bureaucrat',
  moods:{low:{style:'believer',tell:'Mike keeps looking for the red light on a camera. There isn’t one.'},high:{style:'hype',tell:'Mike is cutting a promo to the hallway mirror, hitting every mark.'}},
  stale:'“Love it. Love the energy. Heard it.”',
  heard:'“{name} says you said something about me. On TV we’d have shot that as a segment.”',
  backstage:{
   won:{tell:'Mike comes through the curtain like there’s a camera on him. There isn’t.',line:'“That’s a TV win. Tell me that wasn’t a TV win.”',replies:[
    {style:'hype',text:'“That was must-see!”',reaction:'“Must-see.” He points at you like it’s a catchphrase now.'},
    {style:'believer',text:'“You gave it everything. You always do.”',reaction:'“Every time,” he says. “Every single time.”'},
    {style:'bureaucrat',promise:'promo',text:'“Next week you get the mic. Five minutes.”',reaction:'“Five. I’ll give you six.”'}]},
   lost:{tell:'Mike is still in his gear, staring at the hall’s one television, which is off.',line:'“{name} beat me. Where’s the camera? Did that air?”',replies:[
    {style:'believer',text:'“You still gave it everything.”',reaction:'“I did.” He nods hard. “I always do.”'},
    {style:'hype',promise:'rematch',text:'“Rematch with {name} next week. Prime time.”',reaction:'“Prime time.” He doesn’t ask what time that is here.'},
    {truth:true,text:'“Mike, this is where you are.”',reaction:'He looks around: the folding chairs, the cheese tray. “Okay,” he says, and gives you his best anyway.'}]},
   flat:{tell:'Mike is pacing by the curtain, counting down a commercial break that isn’t coming.',line:'“That segment died. On TV they’d have cut away.”',replies:[
    {style:'straight',text:'“It was flat. Next week’s a new episode.”',reaction:'“New episode,” he repeats, comforted.'},
    {style:'hype',promise:'promo',text:'“Come back next week and steal the show on the mic.”',reaction:'“Steal it. Live.” He fixes his hair for no one.'},
    {style:'believer',text:'“Nobody here doubts what you can do.”',reaction:'“Good. Because I can do all of it.”'}]},
   idle:{tell:'Mike is waiting by the exit, checking his phone for a call from the network.',line:'“Been off the card for weeks. My agent’s going to hear about this.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Top of the hour?” He doesn’t wait for an answer.'},
    {style:'hype',text:'“The fans miss you!”',reaction:'“They do. I can feel it.” He waves at the empty lot.'},
    {style:'straight',text:'“You’ll be back on when there’s a spot.”',reaction:'“Get me a spot. I’ll make it a segment.”'}]},
   skip:'Mike walks past with his phone to his ear, talking to someone who doesn’t seem to be on the line.'
  }},

 // ───────── Frost “Cold” Freeze ─────────
 8:{speaker:'Frost',style:'believer',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'Frost sits holding the freeze ray in his lap like a hot water bottle.'},high:{style:'believer',tell:'Frost is blowing on his hands, trying to cool the hallway down.'}},
  stale:'“Ice to hear. Again.”',
  heard:'“{name} says you said something cold about me. I’ll take that as a compliment.”',
  backstage:{
   won:{tell:'Frost walks up with the freeze ray over his shoulder. It’s dripping a little.',line:'“Ice work tonight. I froze them solid. Like soup.”',replies:[
    {style:'believer',text:'“The coldest man in the building.”',reaction:'“Coldest.” He shivers with pride.'},
    {style:'hype',promise:'promo',text:'“Next week, tell the whole town how cold you are.”',reaction:'“I’ll give them the cold shoulder. Both shoulders.”'},
    {truth:true,text:'“Frost, that’s just water.”',reaction:'He looks down at the puddle under the ray for a long time. “Weather report noted.”'}]},
   lost:{tell:'Frost is sitting on a cooler with the freeze ray across his knees.',line:'“{name} got me. A warm front came through. Nothing I could do.”',replies:[
    {style:'bureaucrat',text:'“I’ll log it as weather.”',reaction:'“Thank you. It was weather.”'},
    {style:'believer',text:'“You’ll freeze them next time.”',reaction:'“Next time,” he says, “I’ll start colder.”'},
    {style:'hype',promise:'rematch',text:'“Next week, put {name} on ice.”',reaction:'“On ice.” He likes it so much he repeats it to the ray.'}]},
   flat:{tell:'Frost is arguing with a referee about who gets to hold the freeze ray.',line:'“The ref took my ray. That’s why it was flat. Warm front, basically.”',replies:[
    {style:'bureaucrat',text:'“I’ll write up a ray policy so it’s clear.”',reaction:'“Clear as ice,” he says, satisfied.'},
    {style:'believer',text:'“You don’t need the ray to be cold.”',reaction:'He clutches it tighter. “I do, though.”'},
    {breaks:true,text:'“The ref’s right. Leave the ray at home.”',reaction:'“I will never relinquish the ray.” He doesn’t look at you on the way out.'}]},
   idle:{tell:'Frost is standing in the open freezer door at concessions.',line:'“It’s been weeks. I’m starting to thaw.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Stay frosty,” he says. He seems to think that’s a weather report.'},
    {style:'believer',text:'“Nobody here has gone soft on you.”',reaction:'“Soft.” He shudders. “Don’t even say it.”'},
    {style:'straight',text:'“Shut the freezer door, Frost.”',reaction:'He shuts it. He stays standing very close to it.'}]},
   skip:'Frost walks past and gives you the cold shoulder. He’s been practicing.'
  }},

 // ───────── Mandy Mouse ─────────
 9:{speaker:'Mandy',style:'straight',distrusts:'hype',
  moods:{low:{style:'believer',tell:'Mandy is in the corner sorting her snack hoard into piles. She keeps recounting.'},high:{style:'straight',tell:'Mandy is eating a cracker in small, precise bites, eyes on the door.'}},
  stale:'“You said that. I wrote it on a napkin. Two napkins now.”',
  heard:'“{name} says you said something. Want a cracker? I want to talk about it.”',
  backstage:{
   won:{tell:'Mandy comes up the hall, flinches at a slamming door, and keeps coming.',line:'“{name} stepped over me all week. Didn’t step over me tonight.”',replies:[
    {style:'straight',text:'“You earned that. Plain and simple.”',reaction:'“Plain and simple.” She shares a cracker with you to celebrate.'},
    {style:'bureaucrat',promise:'win',text:'“Next week, same again. A clean win, in writing.”',reaction:'“In writing.” She tucks the note into her snack bag for safekeeping. “I’ll hold you to it.”'},
    {style:'hype',text:'“Biggest upset of the night!”',reaction:'She winces at the volume. “Not an upset. I was always going to.”'}]},
   lost:{tell:'Mandy is eating crackers very fast on an equipment case.',line:'“{name} won. People are going to step over me again now.”',replies:[
    {style:'believer',text:'“Nobody here steps over you. Not me.”',reaction:'She offers you the last cracker. That means something.'},
    {style:'straight',promise:'win',text:'“Next week you win. I’m promising it.”',reaction:'“Promising.” She looks right at you. “I hold people to things.”'},
    {style:'hype',text:'“Go get ’em next time, tiger!”',reaction:'She jumps. “Please don’t shout.”'}]},
   flat:{tell:'Mandy is handing out snacks to end an argument between two crew members.',line:'“That was quiet. Too quiet. I don’t like quiet either.”',replies:[
    {style:'straight',text:'“It didn’t land. Next week it will.”',reaction:'“Next week.” She puts a cracker aside for it.'},
    {style:'believer',text:'“You were the toughest one out there.”',reaction:'“I know,” she says. She seems glad someone else knows.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and let them have it!”',reaction:'“Not too loud,” she says. “But yes.”'}]},
   benched:{tell:'Mandy watched {name} from behind her ring bag. She’s still sort of behind it.',line:'“{name} got booked. I’m fine right here. Plenty of room to back up.”',replies:[
    {style:'believer',text:'“You don’t have to be over there.”',reaction:'She stays. She does pass you a cracker over the top of the bag.'},
    {style:'straight',promise:'appearance',text:'“You’re on next week’s card. Not against {name}.”',reaction:'“Not against {name}.” She comes out from behind the bag.'},
    {truth:true,text:'“Mandy, you can come out of the ring bag now.”',reaction:'A long pause. She comes out halfway. “Halfway is a lot,” she says.'}]},
   idle:{tell:'Mandy is sitting on the curb by your car, snack bag in her lap.',line:'“Haven’t been on a card in weeks. Everyone steps over me. You stepped over me.”',replies:[
    {style:'straight',promise:'appearance',text:'“You’re right. You’re on next week’s card.”',reaction:'“Right.” She stands, which doesn’t change her height much. “Good.”'},
    {style:'believer',text:'“I haven’t forgotten you, Mandy.”',reaction:'She offers you a cracker. You’ve been forgiven, a little.'},
    {style:'bureaucrat',text:'“The card was full. That’s all.”',reaction:'“It’s always full,” she says, “of bigger people.”'}]},
   skip:'Mandy darts past at a loud noise from the loading dock and keeps going.'
  }},

 // ───────── Turtle, From Entourage ─────────
 11:{speaker:'Turtle',style:'believer',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'Turtle is reading out a schedule from his phone for a star who isn’t here.'},high:{style:'believer',tell:'Turtle is carrying three bags, none of them his, grinning.'}},
  stale:'“Yeah, yeah. The guy says that too.”',
  heard:'“{name} said you said something. The guy would never say that. Just saying.”',
  backstage:{
   won:{tell:'Turtle comes down the hall carrying somebody else’s bags.',line:'“You see that? The guy would’ve loved that. The guy’s not here, but still.”',replies:[
    {style:'believer',text:'“That was you, Turtle. You’re one of us.”',reaction:'He sets the bags down. “One of us,” he says, like he finally got a seat at the table.'},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Ride in with me.”',reaction:'“Ride with you? Shotgun?” He’s already holding open a car door that isn’t there.'},
    {style:'straight',text:'“Good win. Whose bags are those?”',reaction:'“The guy’s,” he says. “He’s running late. Every week.”'}]},
   lost:{tell:'Turtle is on the phone to someone who isn’t picking up.',line:'“{name} got me. I’ll tell the guy it was close.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Here’s next week’s schedule. You’re on it.”',reaction:'He reads it like it’s for someone important. Then he sees his name. “Oh.”'},
    {style:'believer',text:'“It was close. You don’t need the guy to say so.”',reaction:'He puts the phone away. “Yeah,” he says. “It was close.”'},
    {truth:true,text:'“There’s no star coming, Turtle. Tonight you’re the guest.”',reaction:'He hangs up slowly. “The guest.” He doesn’t pick up anyone’s bags on the way out.'}]},
   flat:{tell:'Turtle is loading a bag that isn’t his into a car that isn’t his.',line:'“Rough one. The guy has those too. Probably.”',replies:[
    {style:'believer',text:'“Everyone at this table has nights like that.”',reaction:'“This table.” He pulls up a chair at a table that isn’t there and sits in it anyway.'},
    {style:'bureaucrat',text:'“I’ll go over the tape with you this week.”',reaction:'“Like a meeting? Can I bring snacks? I won’t pay for them.”'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic. Your own segment.”',reaction:'“My own?” He checks over his shoulder for whoever you meant.'}]},
   idle:{tell:'Turtle is waiting by the door for a ride.',line:'“Anybody heading out? I’ll ride with whoever. I don’t mind the back.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Sick.” He asks if there’s a car service. There isn’t. He’s fine with that.'},
    {style:'believer',text:'“You can ride with me.”',reaction:'“Shotgun?” He’s halfway to the car before you answer.'},
    {style:'straight',text:'“Your ride’s not coming, is it?”',reaction:'“He’s just running late,” Turtle says. “Every week.”'}]},
   skip:'Turtle walks past carrying someone’s bags, telling them about you. No one is carrying the other end.'
  }},

 // ───────── “Street Smart” John Smith ─────────
 12:{speaker:'John',style:'believer',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'John is filling out an incident report about his own match, in triplicate.'},high:{style:'believer',tell:'John is handing out pocket flashlights to the crew. “For the parking lot.”'}},
  stale:'“As I said. Twice.”',
  heard:'“Actually, {name} told me what you said. Actually, what you said was wrong. Let me explain.”',
  backstage:{
   won:{tell:'John comes down the hall stopping twice to tell people their shoes are untied.',line:'“Textbook. Situational awareness, start to finish. You’re welcome.”',replies:[
    {style:'believer',text:'“That was smart. Street smart.”',reaction:'“Thank you. Actually, it’s pronounced ‘street smart.’” It’s pronounced exactly how you said it.'},
    {style:'hype',promise:'promo',text:'“Next week, give the town your safety tips on the mic.”',reaction:'“A public safety announcement.” He’s already outlining.'},
    {style:'straight',text:'“Good win. You could’ve played it safer.”',reaction:'“Actually,” he says, and doesn’t stop for some time.'}]},
   lost:{tell:'John is explaining to the timekeeper what the timekeeper did wrong.',line:'“{name} won. Technically. I’d like to walk you through the technicality.”',replies:[
    {style:'bureaucrat',text:'“File a report. I’ll read every word.”',reaction:'“Every word,” he says, and hands you four pages already written.'},
    {style:'believer',text:'“You were right about everything except the ending.”',reaction:'“Actually, I was right about the ending too. It just didn’t happen.”'},
    {truth:true,text:'“Nobody thinks you’re a narc over the tips, John. It’s the delivery.”',reaction:'He opens his mouth to correct you. He closes it. “Noted,” he says, very quietly.'}]},
   flat:{tell:'John is walking the curtain area pointing out tripping hazards to nobody.',line:'“The crowd didn’t engage. Actually, they disengaged. There’s a difference.”',replies:[
    {style:'believer',text:'“They’ll listen next time. You make good points.”',reaction:'“I make correct points,” he says. He looks pleased anyway.'},
    {style:'bureaucrat',promise:'appearance',text:'“I’m logging it. You’re back on next week to fix it.”',reaction:'“Log the time, too. Accuracy matters.”'},
    {style:'straight',text:'“You talked through your own big moment.”',reaction:'“Actually, I was clarifying it.” He goes off to clarify it to someone else.'}]},
   cutIn:{tell:'John steps in from the doorway with a finger already raised.',line:'“Actually, if I could correct what {name} just said, I’d like to correct it.”',replies:[
    {style:'straight',text:'“Go on, then.”',reaction:'“Thank you.” He corrects it. Down the hall, {name} starts correcting the correction.'},
    {style:'bureaucrat',text:'“Put it in writing, both of you.”',reaction:'“Already have,” he says. “Two copies. Theirs has errors.”'},
    {style:'hype',promise:'rematch',text:'“Settle it with {name} in the ring next week.”',reaction:'“In the ring. Fine. I’ll bring the correct rules.”'}]},
   benched:{tell:'John is out in the lot, straightening the parking lines with his boot.',line:'“{name} got the spot tonight. {name} also misspoke twice in the opening. I counted.”',replies:[
    {style:'believer',text:'“Your night’s coming. You’re right about a lot.”',reaction:'“About everything,” he says. “But thank you.”'},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. I’ll spell your name right.”',reaction:'“It’s John,” he says. “Most people get that wrong.” Nobody does.'},
    {style:'straight',text:'“You can’t correct your way onto the card, John.”',reaction:'“Actually,” he begins, and then, for once, doesn’t.'}]},
   idle:{tell:'John is walking the lot with a flashlight, checking everyone’s car doors.',line:'“Been off the card a while. Also, your car was unlocked. You’re welcome.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Thanks. You’re on next week’s card.”',reaction:'“And lock your car.” He waits until you do.'},
    {style:'believer',text:'“Somebody has to look out for everyone. I’m glad it’s you.”',reaction:'He clicks the flashlight off. “Somebody does,” he says, a little moved.'},
    {style:'straight',text:'“I lock it. You keep unlocking it to check.”',reaction:'“To check,” he agrees. He doesn’t see the problem.'}]},
   skip:'John walks past and, without stopping, tells you your headlights are on. They aren’t.'
  }},

 // ───────── Katy “Space Taking” Perry (ring persona only) ─────────
 13:{speaker:'Katy',style:'believer',distrusts:'straight',promiseWeight:{promo:2},
  moods:{low:{style:'hype',tell:'Katy is staring up through a skylight, very still, as if she’s waiting for clearance.'},high:{style:'believer',tell:'Katy drifts down the hallway. She’s walking, technically. It reads as drifting.'}},
  stale:'“Copy that. Copy that again.”',
  heard:'“{name} says you said something about me. Please advise, ground control.”',
  backstage:{
   won:{tell:'Katy walks up slowly, the way you would in low gravity.',line:'“Mission accomplished. From orbit, that win would look so small. And so beautiful.”',replies:[
    {style:'believer',text:'“Mission accomplished, Commander.”',reaction:'“Commander.” She salutes you with enormous seriousness.'},
    {style:'hype',promise:'promo',text:'“Next week, tell the whole town about it.”',reaction:'“A full mission debrief.” She’s already describing the curve of the earth. It may take a while.'},
    {style:'straight',text:'“Good match, Katy. You’re a wrestler, not an astronaut.”',reaction:'“That’s what they said at mission control,” she says gently, “before I went up.”'}]},
   lost:{tell:'Katy is looking out at the parking lot lights like they’re stars.',line:'“{name} won. Down here everything feels so heavy.”',replies:[
    {style:'hype',text:'“Then we launch again!”',reaction:'“Launch again.” She checks an invisible seal on her collar.'},
    {style:'believer',promise:'appearance',text:'“You’re back on the card next week. The mission continues.”',reaction:'“The mission continues.” She breathes in deep, like an airlock just opened.'},
    {truth:true,text:'“Katy, we can’t go back up tonight.”',reaction:'She looks down at her boots on the floor. “Not tonight,” she agrees. “But I can see it from here.”'}]},
   flat:{tell:'Katy is floating, or walking very slowly, in circles by the curtain.',line:'“It went so quiet out there. Like space. But the bad kind.”',replies:[
    {style:'believer',text:'“Every mission has a rough reentry.”',reaction:'“Reentry.” She nods, comforted by a word she has clearly heard once.'},
    {style:'hype',promise:'promo',text:'“Next week the mic’s yours. Take them up with you.”',reaction:'“Everyone. All of them. Into orbit.” Her segment is already running long.'},
    {style:'straight',text:'“It was flat. Keep it short next time.”',reaction:'“Short,” she says, as if you’ve described an alien concept.'}]},
   idle:{tell:'Katy is halfway up the roof hatch ladder, looking at the sky.',line:'“It’s been weeks since my last mission. The gravity’s getting to me.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Launch window confirmed.”',reaction:'“Confirmed.” She climbs down one rung at a time, very carefully.'},
    {style:'believer',text:'“Ground control hasn’t forgotten you.”',reaction:'“Thank you, ground control.” She means you.'},
    {style:'straight',text:'“Come down off the ladder, Katy.”',reaction:'She comes down. She keeps looking up the whole way.'}]},
   skip:'Katy drifts past toward the parking lot, eyes on the sky, and doesn’t stop.'
  }},

 // ───────── Cuba Gooding III (ring persona only) ─────────
 14:{speaker:'Cuba',style:'believer',distrusts:'bureaucrat',
  moods:{low:{style:'straight',tell:'Cuba keeps asking the crew whether they’ve heard of his dad. They have. He asks anyway.'},high:{style:'believer',tell:'Cuba is telling a stagehand his dad was in Jerry Maguire. The stagehand nods. Cuba glows.'}},
  stale:'“Right. Have you heard of my dad, though?”',
  heard:'“{name} says you said something about me. Did {name} mention my dad was in Jerry Maguire?”',
  backstage:{
   won:{tell:'Cuba runs up the hall waving, already mid-question.',line:'“Did you see that? Have you heard of my dad? He was in Jerry Maguire.”',replies:[
    {style:'believer',text:'“That win was all you, Cuba. Not your dad. You.”',reaction:'“Me.” He tries it out. “Huh.”'},
    {style:'hype',promise:'promo',text:'“Next week, tell the town about tonight.”',reaction:'“And about my dad,” he says. “He was in Jerry Maguire.”'},
    {truth:true,text:'“Cuba, nobody needs to hear about your dad before they like you.”',reaction:'He’s quiet for a long moment. “Okay,” he says. Then: “Have you seen it, though?”'}]},
   lost:{tell:'Cuba is sitting on the steps outside the locker room, phone in hand, not calling anyone.',line:'“{name} won. My dad would’ve won. He was in Jerry Maguire.”',replies:[
    {style:'straight',text:'“You lost. You’ll come back.”',reaction:'“I’ll come back.” He nods. “Like in Jerry Maguire.” He does not seem sure that happens in it.'},
    {style:'believer',promise:'appearance',text:'“I believe in you, not your dad. You’re on next week.”',reaction:'He puts the phone away. He doesn’t say the name of the film once on the way out.'},
    {style:'bureaucrat',text:'“I’ll note it down. Better luck next week.”',reaction:'“Can you note my dad was in Jerry Maguire?”'}]},
   flat:{tell:'Cuba is telling the timekeeper about his dad. The timekeeper is packing up.',line:'“That was rough. You know who never had a rough one? My dad. In Jerry Maguire.”',replies:[
    {style:'believer',text:'“I liked you out there. Just you.”',reaction:'“Just me?” He doesn’t know what to do with that, so he keeps it.'},
    {style:'straight',text:'“It was flat. Work on the ending.”',reaction:'“The ending.” He nods. “My dad had a great ending. I assume.”'},
    {style:'hype',promise:'promo',text:'“Next week, tell them your own story.”',reaction:'“My own story.” He thinks hard. “It starts with my dad.”'}]},
   idle:{tell:'Cuba is waiting by your car, holding a DVD case. He doesn’t mention it. Yet.',line:'“It’s been a while since I was on a card. Have you heard of my dad?”',replies:[
    {style:'believer',promise:'appearance',text:'“I’ve heard of you. You’re on next week.”',reaction:'“Of me?” He lowers the DVD case.'},
    {style:'straight',text:'“I have heard of your dad, yes.”',reaction:'“He was in Jerry Maguire,” Cuba says, delighted, as if that settles everything.'},
    {style:'bureaucrat',text:'“Cards are full right now. I’ll let you know.”',reaction:'“Okay. If my dad calls, he was in Jerry Maguire.”'}]},
   skip:'Cuba walks past, asking someone else whether they’ve heard of his dad.'
  }},

 // ───────── Carl “Parallel” Parker ─────────
 15:{speaker:'Carl',style:'believer',distrusts:'bureaucrat',noCutIn:true,
  moods:{low:{style:'straight',tell:'Carl is walking the exact line of the ring rope, heel to toe, back and forth.'},high:{style:'believer',tell:'Carl walks up the hallway shoulder to shoulder with a crew member, matching his stride.'}},
  stale:'“Same thing again. Parallel to last time.”',
  heard:'“{name} told me what you said. I heard it from the side, which is how I hear most things.”',
  backstage:{
   won:{tell:'Carl walks up and stops beside you, not in front of you, facing the same way you are.',line:'“{name} and I never quite touched. I won anyway. Sideways.”',replies:[
    {style:'believer',text:'“That’s a win only you could have.”',reaction:'“Only me.” He nods at the wall you’re both facing.'},
    {style:'straight',promise:'rematch',text:'“Next week you and {name}. Head-on.”',reaction:'“Head-on.” He turns ten degrees toward you and stops. “Working on it.”'},
    {style:'hype',text:'“Unstoppable!”',reaction:'“Unintersectable,” he corrects, gently.'}]},
   lost:{tell:'Carl is walking alongside the hallway wall, keeping exactly one hand’s width from it.',line:'“{name} got me. I never even got to face them.”',replies:[
    {style:'straight',promise:'rematch',text:'“Next week you face {name}. I’ll make sure of it.”',reaction:'“Face to face.” He looks like someone just told him the sea is real.'},
    {style:'believer',text:'“Someday you’ll meet someone head-on.”',reaction:'“Someday,” he says, to the wall.'},
    {truth:true,text:'“Carl, you’re allowed to stand in front of someone.”',reaction:'He looks at the space in front of you. He doesn’t step into it. But he looks at it for a long time.'}]},
   flat:{tell:'Carl is pacing beside the curtain. Beside it, never through it.',line:'“I gave them my best side all night. They sat on theirs. Nobody moved.”',replies:[
    {style:'believer',text:'“Something will cross your path. I believe that.”',reaction:'“Cross,” he whispers, like it’s a dangerous word.'},
    {style:'straight',text:'“You have to meet them in the middle.”',reaction:'He nods. He walks away along the edge of the hall.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and call someone out. Face to face.”',reaction:'“Face to face,” he says, already standing slightly to one side.'}]},
   idle:{tell:'Carl is walking beside your car, step for step, as you head to it.',line:'“Been a while. I’ve been running alongside the card, you could say.”',replies:[
    {style:'believer',promise:'appearance',text:'“You’re on next week’s card. I want you in there.”',reaction:'“In there.” He pictures it. He pictures it from the side.'},
    {style:'straight',text:'“Nobody’s been booked against you yet.”',reaction:'“Against,” he says. “That’s the part.”'},
    {style:'bureaucrat',text:'“I’ll pencil you in somewhere.”',reaction:'“Next to someone,” he says. “It’s always next to someone.”'}]},
   skip:'Carl walks past alongside you for a few steps, matching you exactly, then peels off.'
  }},

 // ───────── Maddox Hatter (Era III featured; this seeds his route) ─────────
 16:{speaker:'Maddox',style:'believer',distrusts:'straight',
  moods:{low:{style:'bureaucrat',tell:'Maddox keeps tapping his pocket watch. It still says six.'},high:{style:'believer',tell:'Maddox is setting out teacups along the merch table, one per wrestler.'}},
  stale:'“You said that at six. It’s still six.”',
  heard:'“{name} poured me a cup of what you said. It had gone cold. Why is a booker like a teapot?”',
  backstage:{
   won:{tell:'Maddox comes up the hall carrying a full teacup and doesn’t spill a drop.',line:'“A win at six o’clock! Again! Why is a pinfall like a saucer?”',replies:[
    {style:'believer',text:'“Everyone at your table would toast that.”',reaction:'“They would! Pull up a chair. There’s always one more chair.”',
     cases:[{when:{eventWeek:true},reaction:'“Tea for the whole building, then! It’s the big show. It’s always the big show at six.”'}]},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll set you a place on next week’s card.”',reaction:'“A place at the table.” He bows. “And what time will it be?” You know the answer.'},
    {style:'straight',text:'“I don’t know. Why?”',reaction:'“Neither do I,” he says, delighted.'}]},
   lost:{tell:'Maddox is pouring tea for an empty chair across from him.',line:'“{name} won before tea. Very rude. Why is a loss like a raven?”',replies:[
    {style:'bureaucrat',text:'“The clock says it’s still early. Plenty of time.”',reaction:'He checks the watch. It says six. “Plenty,” he agrees, comforted.'},
    {style:'believer',promise:'rematch',text:'“Invite {name} back next week. A rematch over tea.”',reaction:'“A rematch! I’ll lay another place.”'},
    {truth:true,text:'“Maddox, the match is over. Everyone’s gone home.”',reaction:'He looks at the empty chairs. “Then we’ll keep their seats warm,” he says, and pours anyway.'}]},
   flat:{tell:'Maddox is asking the ring crew a riddle. They have been here a while.',line:'“Nobody answered my riddle in the ring. Why is a quiet crowd like a writing desk?”',replies:[
    {style:'believer',text:'“They’ll get it next time.”',reaction:'“Nobody ever gets it,” he says happily. “That’s the best part.”'},
    {style:'bureaucrat',text:'“Maybe less tea break mid-match.”',reaction:'“Less tea?” He looks at you as if you’ve proposed less air.'},
    {style:'hype',promise:'promo',text:'“Next week, the mic is yours. Ask the whole room.”',reaction:'“The whole room! At six!”'}]},
   idle:{tell:'Maddox has set a place at the back table for someone who isn’t coming. It’s his own place.',line:'“I set a place for myself. I haven’t sat in it in weeks.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Sit in it next week. You’re on the card.”',reaction:'He sits in it immediately, a week early. “Practice,” he says.'},
    {style:'believer',text:'“Your seat’s always here.”',reaction:'“Always,” he says. “It’s always six, so it’s always here.”'},
    {style:'straight',text:'“Nothing’s opened up yet.”',reaction:'He pours you a cup anyway. It is somehow still hot.'}]},
   skip:'Maddox passes by with a teacup and doesn’t say goodbye. He never does.'
  }},

 // ───────── Term Life Insurance Plan (the Deductibles) ─────────
 17:{speaker:'Term Life',style:'bureaucrat',distrusts:'believer',
  moods:{low:{style:'straight',tell:'Term Life is reading his own policy under the exit light, lips moving.'},high:{style:'bureaucrat',tell:'Term Life is stamping a claim form with great satisfaction.'}},
  stale:'“As previously stated. See above.”',
  heard:'“{name} has informed me of a statement you made. It has been attached to your file.”',
  backstage:{
   won:{tell:'Term Life approaches with a clipboard and a pen already uncapped.',line:'“Coverage held tonight. Terms and conditions applied.”',replies:[
    {style:'bureaucrat',promise:'appearance',due:2,text:'“You’re renewed. Back on the card in two weeks.”',reaction:'“Renewed.” He signs something you didn’t see him take out.'},
    {style:'straight',text:'“Clean win. Nice work.”',reaction:'“Noted, with a small asterisk.”'},
    {style:'believer',text:'“You’re the best policy we’ve got.”',reaction:'“Optimism is a pre-existing condition,” he says, not unkindly.'}]},
   lost:{tell:'Term Life is filling out a form on top of an equipment case.',line:'“{name} won. I’ve opened a claim.”',replies:[
    {style:'straight',text:'“You lost. Close the claim and move on.”',reaction:'“Closing it.” He doesn’t. He sets it to one side.'},
    {style:'bureaucrat',promise:'rematch',due:2,text:'“File for a rematch with {name}. I’ll approve it.”',reaction:'“Approved, pending review. Two weeks.” He looks relieved there’s a waiting period.'},
    {truth:true,text:'“Some things you can’t insure.”',reaction:'He looks at you over his glasses for a long time. “Excluded,” he says quietly. “I know.”'}]},
   flat:{tell:'Term Life is reading the fine print on the back of a ticket stub.',line:'“Tonight’s performance falls under an exclusion I’d rather not discuss.”',replies:[
    {style:'bureaucrat',text:'“I’ll file it and we’ll review next week.”',reaction:'“Review. Yes.” He seems calmer just hearing the word.'},
    {style:'straight',text:'“It was flat. Happens to everyone.”',reaction:'“Everyone,” he says. “That’s why there’s a market.”'},
    {style:'hype',promise:'promo',due:2,text:'“In two weeks, take the mic and win them back.”',reaction:'“Two weeks. Terms and conditions apply,” he says, and almost smiles.'}]},
   benched:{tell:'Term Life is in the lot with a thick folder that has {name}’s name on it.',line:'“{name} was on the card tonight. I’ve filed eleven claims on those legs. The claimant has signed none of them.”',replies:[
    {style:'bureaucrat',promise:'appearance',due:2,text:'“You’re on the card in two weeks. Bring the folder.”',reaction:'“I always bring the folder.”'},
    {style:'straight',text:'“{name}’s legs aren’t your problem.”',reaction:'“Everything is my problem. That’s the product.”'},
    {style:'believer',text:'“{name} is lucky to have you looking out.”',reaction:'“He hasn’t signed anything,” he says, but softer.'}]},
   idle:{tell:'Term Life is waiting by your car to discuss renewal.',line:'“Your policy with me is lapsing. I haven’t been on a card in weeks.”',replies:[
    {style:'bureaucrat',promise:'appearance',due:2,text:'“Renew it. Two weeks out, you’re on.”',reaction:'He hands you a pen. You sign something. It seems fine.'},
    {style:'straight',text:'“The card’s been tight.”',reaction:'“Tight. I’ll note the circumstances.”'},
    {style:'believer',text:'“I’d never let you lapse.”',reaction:'“Everyone says that,” he says, “until the premium’s due.”'}]},
   skip:'Term Life walks past and slides a pamphlet under your windshield wiper.'
  }},

 // ───────── Jaxxon “Twitter Fingers” Xander ─────────
 19:{speaker:'Jaxxon',style:'hype',distrusts:'bureaucrat',leaks:true,
  moods:{low:{style:'believer',tell:'Jaxxon is scrolling his own replies, thumb moving faster than his eyes.'},high:{style:'hype',tell:'Jaxxon is live-posting the parking lot.'}},
  stale:'He reposts what you said. “Still a banger.”',
  heard:'“{name} says you said something. I posted it already. Sorry. Not sorry. Sorry.”',
  backstage:{
   won:{tell:'Jaxxon walks up typing with both thumbs, narrating to somebody.',line:'“And he WINS, folks. That’s me. I’m he. Say something I can post.”',replies:[
    {style:'hype',text:'“Trending tonight, guaranteed.”',reaction:'“Guaranteed.” He’s typing it before you finish.'},
    {style:'believer',text:'“You don’t need a post. You won.”',reaction:'His thumbs stop for nearly a full second.'},
    {style:'bureaucrat',promise:'promo',text:'“Next week you get the mic. Off the phone.”',reaction:'“Off the phone.” He laughs. He is still on the phone.'}]},
   lost:{tell:'Jaxxon is sitting against the wall, phone an inch from his face.',line:'“{name} beat me. I’m already getting dunked on. Say something nice. Quick.”',replies:[
    {style:'believer',text:'“One bad night doesn’t define you.”',reaction:'“Posting that,” he says. He does.'},
    {style:'hype',promise:'rematch',text:'“Run it back with {name} next week. Make it go viral.”',reaction:'“Viral.” He schedules a post about it for next week.'},
    {truth:true,text:'“Log off for a week, Jaxxon.”',reaction:'He looks at the phone, then at you. He puts it in his pocket. It buzzes. He leaves it there. Mostly.'}]},
   flat:{tell:'Jaxxon is refreshing something, over and over.',line:'“Nobody’s posting about me tonight. Zero. Do you know how that feels?”',replies:[
    {style:'believer',text:'“I watched it. I was there.”',reaction:'“You were there.” He looks up from the phone. Not for long, but he does.'},
    {style:'hype',promise:'promo',text:'“Next week, give them something to post about.”',reaction:'“Content.” He’s already drafting it.'},
    {style:'straight',text:'“You lost the crowd. A post won’t get them back.”',reaction:'He types that, too. He deletes nothing.'}]},
   idle:{tell:'Jaxxon is in the lot, filming his own reflection in a car window.',line:'“Been off the card for weeks. My followers are asking. Well. One is.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Announcing it now.” He announces it now.'},
    {style:'hype',text:'“Tell your follower you’re coming back big.”',reaction:'“Big.” He types it in all caps.'},
    {style:'believer',text:'“I don’t need a post to know you’re good.”',reaction:'He lowers the phone a little. “Okay,” he says. “Okay.”'}]},
   skip:'Jaxxon walks past filming himself walking past you.'
  }},

 // ───────── Chad Kroeger (ring persona only) ─────────
 21:{speaker:'Chad',style:'hype',distrusts:'straight',
  moods:{low:{style:'believer',tell:'Chad is tuning a guitar he doesn’t seem to be about to play.'},high:{style:'hype',tell:'Chad is air-guitaring down the hallway, eyes closed.'}},
  stale:'“Same riff again, huh. I respect that.”',
  heard:'“{name} says you said something about me. That’s cool. That’s a B-side.”',
  backstage:{
   won:{tell:'Chad comes up the hall striking a slow power stance in every doorway.',line:'“They wanted a ballad. I gave them a ballad. With a key change and a chair.”',replies:[
    {style:'hype',text:'“That rocked the whole building!”',reaction:'“Rocked it.” He throws up the horns, very sincerely.',
     cases:[{when:{eventWeek:true},reaction:'“The whole building,” he whispers. “Big show. Bigger chorus.”'}]},
    {style:'believer',promise:'promo',text:'“Next week, give them a full set on the mic.”',reaction:'“A full set. Encore included.”'},
    {truth:true,text:'“Chad, they asked for something else.”',reaction:'He nods slowly. “Yeah. I gave them this instead.” He seems at peace with it.'}]},
   lost:{tell:'Chad is sitting on an amp case, staring at the floor, still rocking slightly.',line:'“{name} won. The crowd wanted a different song. I played mine louder.”',replies:[
    {style:'believer',text:'“Keep playing your song.”',reaction:'“Always,” he says, and he means it.'},
    {style:'hype',promise:'rematch',text:'“Next week, run it back against {name}. Turn it up.”',reaction:'“Up to eleven.” He mimes turning a knob that only goes to ten.',
     cases:[{when:{champion:true},delta:2,reaction:'“A champion doesn’t need a comeback,” he says. “He needs a sequel.”'}]},
    {style:'straight',text:'“Read the room next time.”',reaction:'“I read it,” he says. “Then I turned it up.”'}]},
   flat:{tell:'Chad is soundchecking in the empty hallway. “Check. Check. Rock.”',line:'“The crowd went quiet. I played through it. I’ll always play through it.”',replies:[
    {style:'hype',text:'“They’ll be screaming next week.”',reaction:'“Screaming,” he agrees, and does a small, private scream of his own.'},
    {style:'believer',text:'“Nobody plays through it like you.”',reaction:'He nods. “Nobody,” he says. It sounds less like a boast than a burden.'},
    {style:'straight',promise:'promo',text:'“Next week, take the mic and ask them what they want.”',reaction:'“Ask them.” He thinks about it. “Then do mine.”'}]},
   idle:{tell:'Chad is in the lot, playing to the cars.',line:'“Been off the card for weeks. Still rocking, though. You can hear it.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Booked.” He plays a single triumphant chord to the cars.'},
    {style:'hype',text:'“The town misses the rock.”',reaction:'“The rock never left,” he says. “It just went outside.”'},
    {style:'straight',text:'“The crowd wants a break from the loud stuff.”',reaction:'“Then I’ll play loud quietly,” he says. You don’t know what that means. Neither does he.'}]},
   skip:'Chad walks past with a guitar case and doesn’t stop. Somewhere in the lot, a power chord.'
  }},

 // ───────── Freddie Flounder ─────────
 22:{speaker:'Freddie',style:'believer',distrusts:'straight',
  moods:{low:{style:'hype',tell:'Freddie is lying flatter than usual on the bench, both eyes on one wall.'},high:{style:'believer',tell:'Freddie is propped against the vending machine, beaming at the wall beside you.'}},
  stale:'“You said that. I heard it from this side.”',
  heard:'“{name} said you said something. I didn’t see it coming. I don’t see much coming.”',
  backstage:{
   won:{tell:'Freddie arrives sideways, both eyes on the wall to your left.',line:'“Nobody saw me coming. Nobody ever does. Then: flop.”',replies:[
    {style:'believer',text:'“I saw you. The whole time.”',reaction:'“You did?” He doesn’t turn, but his whole body brightens.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic. Make them look.”',reaction:'“Look at me?” He faces further away, overwhelmed.'},
    {style:'straight',text:'“Good flop. Face the crowd next time.”',reaction:'He faces exactly where he was facing. “I am,” he says.'}]},
   lost:{tell:'Freddie is flat on the hallway floor, looking at the baseboard.',line:'“{name} won. I don’t think anyone saw me out there at all.”',replies:[
    {style:'hype',text:'“They’ll see you next week. Everyone will!”',reaction:'“Everyone.” He flops once, hopefully.'},
    {style:'believer',promise:'appearance',text:'“I saw you. You’re on next week’s card too.”',reaction:'He doesn’t turn toward you. But he goes very still and listens with his whole side.'},
    {truth:true,text:'“Turn around, Freddie. They’re all behind you.”',reaction:'He doesn’t turn. But he holds very still, like he’s listening to the crowd back there.'}]},
   flat:{tell:'Freddie is lying along the bottom of the curtain, half in, half out.',line:'“I flopped. Nobody noticed the flop.”',replies:[
    {style:'believer',text:'“I noticed.”',reaction:'He flops again, just for you.'},
    {style:'hype',promise:'promo',text:'“Next week, the mic. Flop right into it.”',reaction:'“Into the mic.” He practices. He misses the mic.'},
    {style:'straight',text:'“They couldn’t see you. You were facing the other way.”',reaction:'“I always face this way,” he says, as if you’d asked him to stop breathing.'}]},
   idle:{tell:'Freddie is lying across the back seat of the Houseboat’s car, waiting for his ride.',line:'“Been a while. Nobody’s noticed. Well, you did. Just now.”',replies:[
    {style:'believer',promise:'appearance',text:'“I notice. You’re on next week’s card.”',reaction:'“You notice.” He wriggles with something like joy.'},
    {style:'hype',text:'“They’re going to see you when you come back.”',reaction:'“See me?” He holds very still, picturing it.'},
    {style:'straight',text:'“The card was full.”',reaction:'“It’s always full on this side,” he says.'}]},
   skip:'Freddie slides past along the wall, facing away. You’re fairly sure he saw you. Fairly.'
  }},

 // ───────── Lemon Tart (Era II featured; this seeds her route) ─────────
 23:{speaker:'Lemon',style:'straight',distrusts:'bureaucrat',
  moods:{low:{style:'believer',tell:'Lemon is smiling at everyone in the hall. It curdles a little at the edges.'},high:{style:'straight',tell:'Lemon is handing out compliments with a twist at the end, like peel.'}},
  stale:'“Sweet of you. Again. Starting to taste the same.”',
  heard:'“{name} told me what you said. Lovely. A little bitter. Takes one to know one.”',
  backstage:{
   won:{tell:'Lemon comes down the hall with a bright smile and a sharp look.',line:'“That was lovely. {name} will need ice. A lot of ice.”',replies:[
    {style:'straight',text:'“Good win. Sharp work.”',reaction:'“Sharp.” She likes that. “The sweet part was for the crowd.”'},
    {style:'hype',promise:'promo',text:'“Next week, tell the whole town how sweet it was.”',reaction:'“How sweet,” she says, “and then how sour. In that order.”'},
    {style:'bureaucrat',text:'“I’ll note it as a clean win.”',reaction:'“Clean,” she says. “Mostly sweet. Note that too.”'}]},
   lost:{tell:'Lemon is wiping down her boots with a napkin, very precisely.',line:'“{name} won. Good for them. I hope it stings.”',replies:[
    {style:'believer',text:'“You’ll get them next time. Both halves of you.”',reaction:'“Both halves,” she says, softening. Then not.'},
    {style:'straight',promise:'rematch',text:'“Next week, you get {name} again.”',reaction:'“Again.” Her smile is lovely and very, very sharp.'},
    {truth:true,text:'“That last line to {name} deserved an apology.”',reaction:'She doesn’t give one. She goes very quiet, though, and the smile goes with it.'}]},
   flat:{tell:'Lemon is sitting on a road case, puckering at nothing.',line:'“The crowd didn’t bite. They usually flinch first and then come back.”',replies:[
    {style:'straight',text:'“Too much sweet, not enough sour tonight.”',reaction:'“Noted,” she says. “Next week I’ll be terrible.” She smiles. It’s a promise.'},
    {style:'believer',text:'“They’ll come back. They always do.”',reaction:'“They do, don’t they.” She seems sweeter for a second.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and make them pucker.”',reaction:'“Oh, they’ll pucker.”'}]},
   idle:{tell:'Lemon is waiting by your car with a slice of pie she brought for you. It looks wonderful. It’s very tart.',line:'“I haven’t been on a card in weeks. I made you pie anyway. Isn’t that sweet.”',replies:[
    {style:'straight',promise:'appearance',text:'“Thank you. You’re on next week’s card.”',reaction:'“Good.” She hands you the pie. You make a face. She looks delighted.'},
    {style:'believer',text:'“I hadn’t forgotten you.”',reaction:'“Of course not,” she says, sweetly. “I wouldn’t let you.”'},
    {style:'bureaucrat',text:'“The schedule’s been full.”',reaction:'“The schedule.” A little pucker. “Tell the schedule I said hello.”'}]},
   skip:'Lemon walks past with a sweet wave and a look that would curdle milk.'
  }},

 // ───────── “Party Animal” Jesus H. Christ ─────────
 24:{speaker:'Jesus',style:'believer',distrusts:'straight',
  moods:{low:{style:'hype',tell:'Jesus bows his head beside the punch bowl, then makes space for someone to join him.'},high:{style:'believer',tell:'Jesus is leading a prayer of thanks in the parking lot. The folding table is already set.'}},
  stale:'“Amen, friend. Amen again.”',
  heard:'“{name} told me what you said. The Lord asks us to forgive each other. I’d like to start there. Then there’s punch.”',
  backstage:{
   won:{tell:'Jesus jogs up with a cup of punch in each hand.',line:'“Thank the Lord for the strength to get up. I’m saying a prayer for both corners. Stay for punch if you can.”',replies:[
    {style:'believer',text:'“I believe it. Tonight, everybody does.”',reaction:'“Amen.” He bows his head, then offers you a cup.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and share what that meant to you.”',reaction:'“A word of testimony, then an invitation to fellowship. I can keep it to three verses.”'},
    {style:'straight',text:'“Good win. Take a breath before you speak to the room.”',reaction:'“A breath and a prayer.” He takes both before he refills the cups.'}]},
   lost:{tell:'Jesus is wrapping leftover cake in foil for whoever needs it.',line:'“{name} won. The Lord didn’t ask me to love only the people I can beat. There’s a seat for {name} too.”',replies:[
    {style:'hype',text:'“Invite the other corner. Give the whole room something to celebrate.”',reaction:'“First, a blessing for the other corner.” He pulls an extra chair out of the trunk.'},
    {style:'believer',promise:'appearance',text:'“You’ll be back next week. I believe that.”',reaction:'“Faith gives me a reason to get back up. Thank you for a place to do it.”'},
    {truth:true,text:'“Some people came for company. You can offer that before you offer a sermon.”',reaction:'He sets down the hymn sheet. “You’re right. I can listen first.”'}]},
   flat:{tell:'Jesus is wandering the hallway with a tray of dip, offering it to everyone who looks sad.',line:'“That one was quiet. Sometimes that’s when you can hear what the Lord is asking of you.”',replies:[
    {style:'believer',text:'“Next week, they’ll feel it.”',reaction:'“I hope so. In the meantime, somebody might need a listening ear.”'},
    {style:'hype',promise:'promo',text:'“Next week, get them on their feet.”',reaction:'“I’ll ask them to stand if they want to pray with me. The chairs are there for everyone else.”'},
    {style:'straight',text:'“It just didn’t work.”',reaction:'“Then I’ll ask for guidance before I try again. Can you save me a chair?”'}]},
   benched:{tell:'Jesus is out by the cars with a plate of food saved for someone.',line:'“{name} got the spot. I’m praying the Lord meets {name} right there in the ring. I saved a plate in case we get to talk afterward.”',replies:[
    {style:'believer',text:'“You’ll get your night. So will {name}.”',reaction:'“Both of us. The Lord has room for two.” He makes sure the plate has a cover.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic and invite everyone. Even {name}.”',reaction:'“Especially {name}. I’ll make the invitation clear, and leave the answer to {name}.”'},
    {style:'straight',text:'“{name} doesn’t want saving.”',reaction:'“I can keep praying. {name} doesn’t owe me an answer or an empty plate.”'}]},
   idle:{tell:'Jesus is setting up a folding table in the lot with streamers and punch.',line:'“Haven’t been on a card in a while. I can still do what the Lord put in front of me. Anybody here need company?”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Bring the punch.”',reaction:'“I’ll be there. I’ll pray with the crew first, and bring enough for everybody.”'},
    {style:'believer',text:'“Nobody’s forgotten you. Least of all me.”',reaction:'“Bless you,” he says, then makes room at the table for you.'},
    {style:'hype',text:'“Best party in Wisconsin!”',reaction:'“Thank the Lord for the company. And for whoever thought to bring the good cups.”'}]},
   skip:'Jesus waves from across the lot, warmly, and keeps carrying the punch bowl to his car.'
  }},

 // ───────── “Funky Tunes and Attitude” David Guetta (ring persona only) ─────────
 25:{speaker:'David',style:'hype',distrusts:'bureaucrat',moodOn:'heat',
  moods:{low:{style:'believer',tell:'David keeps counting four beats on his thigh and losing the one.'},high:{style:'hype',tell:'David is nodding along to music only he can hear. It’s a good song.'}},
  stale:'“Same beat again. One, two, three, four.”',
  heard:'“{name} says you said something. Off the beat, honestly.”',
  backstage:{
   won:{tell:'David comes down the hall counting “one, two, three, four” under his breath.',line:'“The whole room was on the beat tonight. You felt it, yes?”',replies:[
    {style:'hype',text:'“The whole place was bouncing!”',reaction:'“Bouncing!” He drops the beat with his hands. Nobody hears it but him.'},
    {style:'believer',promise:'promo',text:'“Next week, the mic is yours. Count them in.”',reaction:'“One, two, three…” He waits for four. He’ll get it next week.'},
    {style:'bureaucrat',text:'“I’ll log the tempo.”',reaction:'“The tempo is not a log,” he says sadly. “It is a feeling.”'}]},
   lost:{tell:'David is standing in the hallway with his hands still up, like a song just cut out.',line:'“{name} won. The music stopped. I hate when the music stops.”',replies:[
    {style:'believer',text:'“The music’s still in there.”',reaction:'“Still in there.” He taps his chest, four times.'},
    {style:'hype',promise:'rematch',text:'“Run it back with {name} next week. Drop the beat.”',reaction:'“Drop it.” He drops it. It lands.'},
    {truth:true,text:'“Not every silence is a mistake.”',reaction:'He stops counting. He listens to the quiet. “Hm,” he says, and starts counting again, slower.'}]},
   flat:{tell:'David is counting the crowd out the door. They are not leaving on the beat.',line:'“The room was off the beat all night. I counted.”',replies:[
    {style:'believer',text:'“They’ll find the beat. You’ll show them.”',reaction:'“I’ll show them,” he says, finding it himself.'},
    {style:'hype',promise:'promo',text:'“Next week, get them back on the one.”',reaction:'“On the one.” He holds up one finger like a promise.'},
    {style:'straight',text:'“Some nights the crowd just isn’t dancing.”',reaction:'“Every night is dancing,” he says. “Some nights they don’t know.”'}]},
   benched:{tell:'David is sitting in his car with the windows down and the bass up.',line:'“{name} got the spot. The room went so quiet. Like a towel over a speaker.”',replies:[
    {style:'hype',text:'“You’d have had them on their feet.”',reaction:'“On their feet, on the one.” He turns the bass up one more notch.'},
    {style:'believer',promise:'appearance',text:'“You’re on next week. The room needs you.”',reaction:'“It needs a tempo,” he says. “Yes.”'},
    {style:'straight',text:'“{name} had a good night. That’s all.”',reaction:'“Good,” he says. “Quiet, but good.” It costs him.'}]},
   cutIn:{tell:'A four-count from the doorway, then David steps in.',line:'“{name} wants the crowd still. I want them moving. Let me drop in.”',replies:[
    {style:'straight',text:'“Say your piece.”',reaction:'He says it on the beat. It takes exactly four bars.'},
    {style:'hype',promise:'rematch',text:'“Settle it with {name} next week.”',reaction:'“On my count,” he says. Down the hall, {name} folds something, slowly.'},
    {style:'believer',text:'“There’s room for both of you.”',reaction:'“Both,” he says. “On my count, though.”'}]},
   idle:{tell:'David is in the lot with a speaker on the hood of his car, playing to no one.',line:'“Weeks without a crowd. I am starting to dance alone.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card.”',reaction:'“Finally a crowd,” he says, and turns the speaker off out of respect.'},
    {style:'hype',text:'“The town’s been waiting for the drop.”',reaction:'“The drop is coming,” he says, very seriously.'},
    {style:'believer',text:'“You don’t dance alone. I’m right here.”',reaction:'He holds out a hand. You do not dance. He counts you in anyway.'}]},
   skip:'David walks past to the beat of something you can’t hear.'
  }},

 // ───────── Smark Wahlberg (the one approved fourth-wall exception: see AGENTS.md) ─────────
 // He senses the booking sheet, the grades and the promises as if through a window. He never names the
 // real world outright, and nobody else reacts to it.
 26:{speaker:'Smark',style:'straight',distrusts:'hype',
  moods:{low:{style:'bureaucrat',tell:'Smark keeps glancing up and to the left, as if something up there is writing about him.'},high:{style:'straight',tell:'Smark is explaining the match to a janitor, beat by beat. The janitor is nodding to be polite.'}},
  stale:'“Yeah, yeah. Heard it. Same spot, same move.”',
  heard:'“{name} says you said somethin’ about me. Figures. Somebody up there writes it all down anyway.”',
  backstage:{
   won:{tell:'Smark comes through the curtain already talking about the match.',line:'“Now THAT’S a match. Shine, heat, comeback, finish. You don’t gotta reinvent the wheel.”',replies:[
    {style:'straight',text:'“Textbook match. Start to finish.”',reaction:'“Textbook!” He jabs a finger at your chest. “Finally somebody in this building reads the textbook.”'},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll book you the same way next week.”',reaction:'“Same way. Don’t you dare change it.”'},
    {style:'hype',text:'“Five stars!”',reaction:'“Don’t throw stars around like that,” he says. “Stars mean somethin’.”'}]},
   lost:{tell:'Smark is at the curtain, arguing with a road agent about the finish.',line:'“{name} beat me with a finish that made no sense. Where was the comeback? Where was the heat?”',replies:[
    {style:'bureaucrat',text:'“I’ll log your notes on the structure.”',reaction:'“Log ’em. Somebody up there reads this stuff. I can feel it.”'},
    {style:'straight',promise:'rematch',text:'“Next week, you get {name} again. Traditional.”',reaction:'“Traditional. Shine, heat, comeback.” He counts them off on his fingers.'},
    {truth:true,text:'“{name} beat you. Clean.”',reaction:'“Clean,” he admits, after a while. “Wrong order, though.”'}]},
   flat:{tell:'Smark is pacing by the curtain, muttering a single letter.',line:'“A {grade}. I could feel it. Like somebody wrote it on the back of my neck.”',replies:[
    {style:'straight',text:'“It was flat. You know why.”',reaction:'“I know why. Too many ideas. One match, one story.”'},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll book it again next week. Fix the structure.”',reaction:'“Fix the structure,” he says. “That’s all I ever ask.”'},
    {truth:true,text:'“It’s not a bad match just because it’s new.”',reaction:'He opens his mouth. He shuts it. “Agree to disagree,” he says, which is a first.'}]},
   kept:{tell:'Smark is waiting by the curtain with his arms folded, nodding before you get there.',line:'“You said {promise}. It got done. I felt a box get ticked somewhere.”',replies:[
    {style:'straight',text:'“I said I would.”',reaction:'“Yeah. You did.” He shakes your hand like it’s a contract.'},
    {style:'bureaucrat',text:'“It’s on the record.”',reaction:'“The record. I can practically read it from here.” He squints up and to the left.'},
    {style:'hype',text:'“And there’s more where that came from!”',reaction:'“Don’t oversell it,” he says. “Undersell. Let the work talk.”'}]},
   benched:{tell:'Smark is in the lot, arms folded, staring back at the building.',line:'“{name} got the spot. Greco Wrestling, they call it. It’s one hold and a speech.”',replies:[
    {style:'straight',text:'“{name} drew the room tonight. That’s the business.”',reaction:'“The business,” he says. “Don’t get me started on the business.” He gets himself started.'},
    {style:'bureaucrat',promise:'appearance',text:'“You’re on next week’s card. Traditional match.”',reaction:'“Traditional.” He points at you. “I’m holdin’ you to that word.”'},
    {style:'hype',text:'“You’d have stolen the show!”',reaction:'“Nobody steals a show,” he says. “You build one.”'}]},
   cutIn:{tell:'Smark has been leaning on the wall nearby, waiting for a gap.',line:'“Lemme stop {name} right there. That ain’t wrestlin’. That’s a play.”',replies:[
    {style:'straight',text:'“Say your piece.”',reaction:'He says it. It has a beginning, a middle and an end, in that order.'},
    {style:'bureaucrat',text:'“Noted. Both of you.”',reaction:'“Note mine in bold,” he says, glancing up and to the left.'},
    {style:'hype',promise:'rematch',text:'“Prove it against {name} next week.”',reaction:'“Fine. But we do it the right way.”'}]},
   idle:{tell:'Smark is in the lot, explaining the card to a parked car.',line:'“I ain’t been on the card in weeks. I seen the sheet. Don’t ask me how.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Then you know you’re on next week.”',reaction:'He squints up and to the left. “Yeah,” he says. “It’s there now.”'},
    {style:'straight',text:'“There hasn’t been a match for you.”',reaction:'“There’s always a match. Shine, heat, comeback. Book it.”'},
    {style:'believer',text:'“Your time’s coming, Smark.”',reaction:'“Don’t get sentimental. Get it on the sheet.”'}]},
   skip:'Smark walks past shaking his head, muttering about tonight’s grades. He doesn’t say how he knows them.'
  }},

 // ───────── The Local Tourist ─────────
 27:{speaker:'The Tourist',style:'bureaucrat',distrusts:'straight',
  moods:{low:{style:'believer',tell:'The Tourist is studying a fold-out map of the town he lives in, lost.'},high:{style:'bureaucrat',tell:'The Tourist is photographing the hall’s exit sign from three angles.'}},
  stale:'“I’ve already seen that one.”',
  heard:'“{name} says you said something. Is that a local custom? I’m not from around here.”',
  backstage:{
   won:{tell:'The Tourist comes up the hall with a disposable camera and takes your picture.',line:'“What a match! Is it always like this here? I’m just visiting.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Next week’s itinerary: you, on the card.”',reaction:'“An itinerary!” He tucks it into his fanny pack next to the map.'},
    {style:'believer',text:'“You made a lot of fans tonight.”',reaction:'“Locals?” he asks. He seems nervous about the answer.'},
    {truth:true,text:'“You live here.”',reaction:'He lowers the camera. “Sorry, I’m not from around here,” he says, and takes your picture.'}]},
   lost:{tell:'The Tourist is asking a stagehand for directions to the parking lot he parked in.',line:'“{name} won. Is that how it usually goes here? I wouldn’t know.”',replies:[
    {style:'believer',text:'“You’ll get them next time. You’re one of us.”',reaction:'He looks worried. “Visiting,” he says. But he keeps the compliment.'},
    {style:'bureaucrat',promise:'rematch',text:'“Add {name} to next week’s itinerary. Rematch.”',reaction:'“A return visit.” He circles it on his map.'},
    {style:'straight',text:'“You lost at home, you know.”',reaction:'“Home?” He laughs nervously and checks his map.'}]},
   flat:{tell:'The Tourist is looking for the gift shop. There isn’t one.',line:'“That one wasn’t in the brochure.”',replies:[
    {style:'bureaucrat',text:'“I’ll plan you a better route next week.”',reaction:'“A route!” He unfolds his map and hands you a pen.'},
    {style:'believer',text:'“Even the quiet stops are worth the trip.”',reaction:'“Are they?” He photographs the quiet, just in case.'},
    {style:'hype',promise:'promo',text:'“Next week, take the mic. Tell them what you’ve seen.”',reaction:'“As a visitor,” he says. “Yes. A visitor’s view.”'}]},
   idle:{tell:'The Tourist is in the lot asking for directions to the hall he just walked out of.',line:'“Haven’t been on a card in weeks. Is there a schedule I could look at? I’m not from here.”',replies:[
    {style:'bureaucrat',promise:'appearance',text:'“Here’s the schedule. You’re on next week.”',reaction:'He photographs the schedule. Then he photographs you holding it.'},
    {style:'believer',text:'“You’re always welcome here.”',reaction:'“That’s very kind to visitors,” he says.'},
    {style:'straight',text:'“You live four blocks away.”',reaction:'“I’m staying four blocks away,” he corrects, gently.'}]},
   skip:'The Tourist walks past, photographing the parking lot. He doesn’t stop.'
  }},

 // ───────── “Fetching” Ted Turnsby ─────────
 28:{speaker:'Ted',style:'hype',distrusts:'bureaucrat',
  moods:{low:{style:'straight',tell:'Ted keeps checking his reflection in the trophy case and frowning at it.'},high:{style:'hype',tell:'Ted is standing under the best light in the hallway. On purpose.'}},
  stale:'“Yes. And? Say it like you mean it.”',
  heard:'“{name} says you said something about me. Was it about my jaw? It was probably about my jaw.”',
  backstage:{
   won:{tell:'Ted pauses in every doorway on the way over to catch the light.',line:'“Be honest. Was I the most fetching person in that ring? You can say it.”',replies:[
    {style:'hype',delta:3,text:'“The most fetching man in the building.”',reaction:'“Well, obviously,” he says. “I just won. That was already proof.” He seems a little let down it came so easily.'},
    {style:'straight',text:'“You looked sharp out there. Honestly.”',reaction:'“Honestly?” He holds very still, as if it might fly away.'},
    {style:'bureaucrat',promise:'promo',text:'“I’ll rank you top of next week’s sheet. Mic time.”',reaction:'“Ranked?” he says, too fast. “Against whom?”'}]},
   lost:{tell:'Ted is in front of the trophy case, turning his head slowly left and right.',line:'“{name} won. Fine. {name} is not more fetching than me. Agreed?”',replies:[
    {style:'straight',text:'“You looked better than ever. That’s the truth.”',reaction:'“The truth.” He stands a little taller, then checks the glass to be sure.'},
    {style:'hype',promise:'rematch',text:'“Next week, beat {name} and look good doing it.”',reaction:'“I always look good doing it.” He practices looking good doing it.'},
    {truth:true,text:'“Ted, you don’t have to win every comparison.”',reaction:'He opens his mouth to compare that to something. He doesn’t. “I’ll consider it.”'}]},
   flat:{tell:'Ted is fixing his hair in a spoon from the catering table.',line:'“The crowd didn’t react. To me. Was it the lighting? It was the lighting.”',replies:[
    {style:'hype',text:'“They were stunned. You were too much.”',reaction:'“Too much.” He decides that’s a compliment.',
     cases:[{when:{wonTonight:true},delta:2,reaction:'“Too much, and I won,” he says. He seems to need a little more than that.'}]},
    {style:'straight',text:'“It was the match, Ted. Not your face.”',reaction:'“My face is fine?” He holds on to that part only.'},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll put you back on next week with better lighting.”',reaction:'“Ask for warm light. I look terrible in— I look fine in everything.”'}]},
   benched:{tell:'Ted is out in the lot studying {name}’s poster in the window.',line:'“{name} got the spot. Again. Do you think {name} is more fetching than me? Don’t answer.”',replies:[
    {style:'hype',text:'“Nobody in this building is more fetching than you.”',reaction:'“Nobody,” he repeats, glancing back at the poster.'},
    {style:'straight',promise:'appearance',text:'“You’re on next week’s card. Your own poster.”',reaction:'“My own.” He’s already picking the angle.'},
    {truth:true,text:'“{name} has never once noticed you, Ted.”',reaction:'“Which is exactly,” he says, “what someone threatened would do.”'}]},
   idle:{tell:'Ted is in the lot, checking his profile in a car window. It is not his car.',line:'“It’s been weeks. People will forget my face. That would be a tragedy.”',replies:[
    {style:'hype',promise:'appearance',text:'“Nobody forgets that face. Next week, you’re on.”',reaction:'“That face,” he says, touching it. “Yes.”'},
    {style:'straight',text:'“Your face is fine, Ted. Your spot will come.”',reaction:'“Fine?” He seems to be weighing whether fine is above or below fetching.'},
    {style:'believer',text:'“I’ve got you in mind for something.”',reaction:'“Something fetching?” He waits. You nod. He relaxes.'}]},
   skip:'Ted walks past without stopping, but makes sure you saw his good side.'
  }},

 // ───────── The Human Houseboat ─────────
 29:{speaker:'The Houseboat',style:'straight',distrusts:'hype',
  moods:{low:{style:'believer',tell:'The Houseboat sways gently by the loading dock, unmoored.'},high:{style:'straight',tell:'The Houseboat has docked himself against the wall and seems content.'}},
  stale:'“Mm. Same water as last time.”',
  heard:'“{name} told me… what you said. I’ll… let that settle.”',
  backstage:{
   won:{tell:'The Houseboat comes down the hall slowly, swaying, taking up most of it.',line:'“A good night… on the water. I’d like… to stay moored here. If that’s all right.”',replies:[
    {style:'straight',promise:'appearance',text:'“You’ve got a steady spot. Next week too.”',reaction:'“Steady.” He lets out a long breath, like a hull settling.'},
    {style:'believer',text:'“You belong here.”',reaction:'“Belong.” Something small and unexplained shifts around aboard. He seems pleased.'},
    {style:'hype',text:'“Full speed ahead!”',reaction:'“No,” he says, kindly. “Slow is how I get there.”'}]},
   lost:{tell:'The Houseboat is drifting along the hallway wall, very slowly, toward nowhere.',line:'“{name} won. I feel… a little adrift.”',replies:[
    {style:'believer',text:'“You’re not adrift. You’ve got a place here.”',reaction:'“A place.” He drifts to a gentle stop beside you.'},
    {style:'straight',promise:'appearance',text:'“Same dock next week. You’re on the card.”',reaction:'“Same dock.” He seems to drop anchor right there.'},
    {style:'hype',text:'“Shake it off! Next week, full steam!”',reaction:'He sways, alarmed. “Please don’t… rock me.”'}]},
   flat:{tell:'The Houseboat is listing slightly to one side by the curtain.',line:'“I could feel… the crowd slipping away. Couldn’t get them… moored.”',replies:[
    {style:'straight',text:'“Some nights the water’s rough. It passes.”',reaction:'“It passes,” he agrees, eventually.'},
    {style:'believer',text:'“You were steady out there. Steadier than you think.”',reaction:'He rights himself, a few degrees at a time.'},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll keep you on the card next week. Fixed slot.”',reaction:'“Fixed.” He likes fixed very much.'}]},
   idle:{tell:'The Houseboat is out in the lot, swaying a little, as if the tide went out without him.',line:'“It’s been some weeks… without a dock. I’ve been… drifting.”',replies:[
    {style:'straight',promise:'appearance',text:'“You’re on next week’s card. That’s your mooring.”',reaction:'“Mooring.” He closes his eyes. Something small aboard settles down, too.'},
    {style:'believer',text:'“There’s always room for you here.”',reaction:'“Room,” he says. He takes up a lot of it, gratefully.'},
    {style:'hype',text:'“Let’s get you back out there, quick!”',reaction:'“Not… quick,” he says. “But yes.”'}]},
   skip:'The Houseboat drifts past toward the lot without stopping. It takes a while.'
  }},

 // ───────── Holly “Pizza Pocket” Posey ─────────
 30:{speaker:'Holly',style:'believer',distrusts:'bureaucrat',
  moods:{low:{style:'straight',tell:'Holly is steaming. Not angry. Just visibly steaming.'},high:{style:'believer',tell:'Holly is sharing a tray of something hot with the whole hallway.'}},
  stale:'“You said that. It’s getting a little soggy.”',
  heard:'“{name} told me what you said. That’s okay! It’s fine. Careful, I’m hot.”',
  backstage:{
   won:{tell:'Holly comes down the hall with a tray, offering everyone a bite.',line:'“Did you eat? You should eat. That was a full meal of a match, right?”',replies:[
    {style:'believer',text:'“A full meal. Nobody could call that a snack.”',reaction:'“A full meal!” She glows. A little steam lifts off her shoulders.'},
    {style:'straight',promise:'team',text:'“Next week, share the ring. You and {name} as a team.”',reaction:'“Share!” She loves sharing. {name} is going to have to love it too.'},
    {style:'bureaucrat',text:'“I’ll log it as a main course.”',reaction:'“Log it,” she says sweetly, and the tray gets very hot in her hands.'}]},
   lost:{tell:'Holly is standing very still in the hallway. People are walking around her, wide.',line:'“{name} won. That’s fine! I’m fine. Don’t touch me, I’m molten.”',replies:[
    {style:'straight',text:'“You lost. Cool down and come back.”',reaction:'“Cool down.” She breathes out. Steam. “Okay. Okay.”'},
    {style:'believer',promise:'appearance',text:'“You’re still a full meal. You’re on next week.”',reaction:'“Still a full meal.” The steam settles a little.'},
    {truth:true,text:'“Holly, nobody can get near you tonight.”',reaction:'She looks at the space everyone has left around her. “Oh,” she says, and cools by a few degrees.'}]},
   flat:{tell:'Holly is handing out the last of the tray, piece by piece, to anyone still in the building.',line:'“That one came out a little cold in the middle. I hate that.”',replies:[
    {style:'believer',text:'“It’s okay. It was still good.”',reaction:'“Still good,” she says, warmly.',
     cases:[{when:{lostTonight:true},delta:-2,reaction:'“Don’t,” she says sweetly, and the air around her shimmers. “Not tonight.”'}]},
    {style:'straight',text:'“It didn’t heat all the way through. Next week, more time.”',reaction:'“More time.” She nods. “That’s fair.”'},
    {style:'hype',promise:'promo',text:'“Next week, the mic. Serve it hot.”',reaction:'“Piping,” she promises.'}]},
   idle:{tell:'Holly is waiting by your car with a foil-covered plate.',line:'“Haven’t been on a card in a while. I brought you something anyway. Eat it while it’s hot.”',replies:[
    {style:'believer',promise:'appearance',text:'“Thank you, Holly. You’re on next week.”',reaction:'“Eat it,” she says. You do. It is very, very hot inside. She looks delighted.'},
    {style:'straight',text:'“I’ll find a spot for you soon.”',reaction:'“Soon,” she says. “Before it gets cold.”'},
    {style:'bureaucrat',text:'“The schedule’s been full.”',reaction:'“Full,” she says, “but not fed.” She leaves the plate on your hood.'}]},
   skip:'Holly hurries past with a covered tray. Something under the lid is still bubbling.'
  }},

 // ───────── Cleats ─────────
 32:{speaker:'Cleats',style:'believer',distrusts:'straight',
  moods:{low:{style:'hype',tell:'Cleats stands by the door, one half slightly ahead of the other, laces in a tangle.'},high:{style:'believer',tell:'Cleats is double-knotted and grinning.'}},
  stale:'“Same thing twice. Like us. We get it.”',
  heard:'“{name} said you said something. Both of us heard it. Separately.”',
  backstage:{
   won:{tell:'Cleats comes down the hall in two steps that land a half-beat apart.',line:'“We won. Both of us. One slightly before the other.”',replies:[
    {style:'believer',text:'“You two are a pair worth having.”',reaction:'“A pair,” he says, and seems to tie the words a little tighter.'},
    {style:'hype',promise:'promo',text:'“Next week, the mic. Both of you.”',reaction:'“Both of us.” One half nods. Then the other.'},
    {style:'straight',text:'“Good win. Why do you walk like that?”',reaction:'“Like what?” He walks away. Then, a half-beat later, he walks away again.'}]},
   lost:{tell:'Cleats is sitting on the bench, laces undone.',line:'“{name} won. We came untied out there.”',replies:[
    {style:'hype',text:'“Lace up! Next week you run them over!”',reaction:'He double-knots both halves at once. It takes a while.'},
    {style:'believer',promise:'appearance',text:'“You’re on next week’s card. Both halves.”',reaction:'“Both halves.” He stands, one step and then the other.'},
    {style:'straight',text:'“You tripped over yourself.”',reaction:'“Over ourselves,” he corrects, quietly.'}]},
   flat:{tell:'Cleats is retying a knot that was already tied.',line:'“One of us was half a step ahead all night. The other one felt it.”',replies:[
    {style:'believer',text:'“You’ll fall back in step.”',reaction:'“In step.” He tries it. One half is still slightly ahead. He seems okay with that.'},
    {style:'hype',text:'“Next week, you sprint!”',reaction:'“Together?” He looks worried. “We’ll try.”'},
    {style:'bureaucrat',promise:'appearance',text:'“I’ll put you back on next week to fix it.”',reaction:'He nods twice. The nods land a half-beat apart.'}]},
   benched:{tell:'Cleats waited by the door the whole show, one shoe ahead of the other.',line:'“{name} was on the card tonight. Did he ask about his other shoe? He always asks.”',replies:[
    {style:'believer',text:'“He asked. He always does.”',reaction:'“He did?” Both halves of him look up at once.'},
    {style:'hype',promise:'team',text:'“Next week, you lace up with {name}. Tag team.”',reaction:'“With {name}.” He double-knots something that didn’t need it. “Finally.”'},
    {style:'straight',text:'“He didn’t mention you.”',reaction:'“He never mentions us,” Cleats says. “Out loud.”'}]},
   idle:{tell:'Cleats is waiting by the door, laced up, ready for someone to need him.',line:'“Nobody’s laced us up in weeks. We’re ready. We’ve been ready.”',replies:[
    {style:'believer',promise:'appearance',text:'“I need you. Next week’s card.”',reaction:'“Need us.” He pulls the laces tight with real feeling.'},
    {style:'hype',text:'“You’re going to run the whole building when you’re back.”',reaction:'“Run,” he says. “Yes. Mostly in order.”'},
    {style:'straight',text:'“The card’s been full.”',reaction:'“We can wait by the door,” he says. “We’re good at the door.”'}]},
   skip:'Cleats walks past, a half-step out of time with himself, and doesn’t stop.'
  }},

 // ───────── Terry Pudding (Era III featured; this seeds his route) ─────────
 33:{speaker:'Terry',style:'believer',distrusts:'hype',
  moods:{low:{style:'straight',tell:'Terry is sitting very still, trying not to wobble. It isn’t working.'},high:{style:'believer',tell:'Terry is wobbling with joy by the snack table.'}},
  stale:'“You said that. I’m… settling into it.”',
  heard:'“{name} told me what you said. I wobbled. I’m okay. I settle.”',
  backstage:{
   won:{tell:'Terry comes up the hall wobbling with every step, beaming.',line:'“I held my shape. Mostly. I held most of my shape.”',replies:[
    {style:'believer',text:'“You held it beautifully.”',reaction:'“Beautifully.” He wobbles. It’s a happy wobble.'},
    {style:'straight',promise:'appearance',text:'“Same shape, same spot next week.”',reaction:'“Same shape.” He sets very firmly.'},
    {style:'hype',text:'“You were unstoppable!”',reaction:'He wobbles alarmingly. “Please,” he says. “Gently.”'}]},
   lost:{tell:'Terry is sitting on a folding chair, very still, trembling slightly.',line:'“{name} won. I didn’t break. I never break. I just… settled.”',replies:[
    {style:'straight',text:'“You lost. You didn’t break. Both true.”',reaction:'“Both true.” He firms up a little.'},
    {style:'believer',promise:'appearance',text:'“You’re still in shape. You’re on next week.”',reaction:'He sets, slowly and completely, with relief.'},
    {truth:true,text:'“Terry, you can’t hold your shape forever.”',reaction:'He trembles, then goes very still. “No,” he says. “But I can set again.”'}]},
   flat:{tell:'Terry is jiggling in place by the curtain, unable to stop.',line:'“I couldn’t stop shaking out there. The crowd barely moved. How’d they do that?”',replies:[
    {style:'believer',text:'“You’ll settle. You always do.”',reaction:'“I always do,” he says, already settling.'},
    {style:'straight',text:'“Give it a week. It’ll set.”',reaction:'“A week.” He seems reassured by the timeline.'},
    {style:'bureaucrat',promise:'appearance',text:'“Same slot next week. Same mold.”',reaction:'“Same mold.” He goes very calm.'}]},
   idle:{tell:'Terry is waiting by the exit, very still, smoothing a crease in his ring gear.',line:'“It’s been weeks. I’m starting to set in this chair. I’d rather set in the ring.”',replies:[
    {style:'believer',promise:'appearance',text:'“Next week you’re on. Fresh.”',reaction:'“Fresh.” A little wobble makes it all the way to his boots.'},
    {style:'straight',text:'“It happens. You’ll come back.”',reaction:'“It happens,” he repeats. He seems to find that comforting.'},
    {style:'hype',text:'“You’re going to come back huge!”',reaction:'He trembles. “Not… huge. The same size. Please.”'}]},
   skip:'Terry wobbles past without stopping. He looks set.'
  }}
};
const SUPPORTING_IDS=Object.keys(SUPPORTING_ROUTES).map(Number);
