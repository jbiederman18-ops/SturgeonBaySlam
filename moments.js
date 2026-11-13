'use strict';
// Authored voices and ring styles. Stable IDs preserve characters in existing saves.
const ringPersonalities=[
 {style:"Greco Wrestling",move:'Olympus Driver',counter:'laurel-lock suplex',tell:"looks baffled when the opponent reaches for the ropes, then looks toward the seats to see whether anyone else finds this strange",bit:"pauses to frame the two corners with his hands, then gets startled when his opponent moves",voice:"The wrestler researching a picture",boast:"I want my name in every mouth in Greece. How else am I to know what that sounds like from here?",heart:"I could sit in the seats all my life, mortal. I’d still have to get in the ring to know what I’m writing about.",stunt:"unrolls a sketch of the ring from the losing corner and asks Athens which wrestler they kept watching"},
 {style:'Technical minimalist',move:'Hold Number One',counter:"Hold Number Two",tell:"drills Hold Number One, switches to Hold Number Two, and starts the cycle again",bit:"calls the hold trapping him a backward Hold Two, then tries to show the opponent where the thumb goes",voice:'Two holds, one obsession',boast:'Hold One. Hold Two. Then back to One. Tell me when the pressure feels the same both ways.',heart:"Two holds. A lifetime to master them. Watch both and tell me where the pressure slips.",stunt:"opens a manual with exactly two headings and corrects the opponent’s terminology while caught in a hold"},
 {style:'Underdog scrapper',move:'Fourth-Down Tackle',counter:'goal-line shoulder block',tell:'gets knocked down, pops back up, and starts a one-person sideline chant',bit:'calls a tiny locker-room huddle with the referee',voice:'The walk-on speech',boast:'Put me in the match. I only need one play.',heart:'I was told I was too small for the team. I am still here. Are you with me?',stunt:'hands out miniature playbooks and leads the front row in a locker-room pep talk'},
 {style:"Solo stable bruiser",move:"Stable Meeting Slam",counter:"committee-approved clothesline",tell:"consults an empty corner, nods at the boys, and charges",bit:"debates the hot tag with himself and votes unanimously to stay in",voice:"A statement from the boys",boast:"We checked with the whole stable. The boys would like both tag belts, please.",heart:"We have never needed an outsider. Put all our names on the card under One Man.",stunt:"takes roll for an empty bench and answers each name in a slightly different voice"},
 {style:"Unhurried deadpan brawler",move:"Dry Spell Splash",counter:"folded-corner whip",tell:"folds the towel into a neat square and remembers exactly who made him get it out",bit:"recites the date of the last cheap shot in the same tone he uses to ask for a chair",voice:"A dry account of the grievance",boast:"You may have forgotten the last time we met. That must be convenient.",heart:"I would like the main event. I have kept track of everyone who said I wouldn’t get it.",stunt:"unfolds a towel embroidered with a list of grievances and waits silently while the front row reads"},
 {style:"Technicality-loving cheat",move:"Objection! Neckbreaker",counter:"unrecorded wristlock",tell:"checks which direction the referee is looking before calling for fair play",bit:"opens a briefcase to submit evidence that his own low blow was a clerical error",voice:"An objection to the result",boast:"If the referee did not see it, I commend the excellent sportsmanship.",heart:"I demand equal treatment. Which is to say, nobody else gets to do what I just did.",stunt:"holds a press conference for a pinfall he refuses to acknowledge and declares the footage inadmissible"},
 {style:'Experimental technician',move:'Peer-Reviewed Plex',counter:'control-group armbar',tell:'announces a new hypothesis about the opponent’s center of gravity',bit:"has a fan hold up a card reading DOCTOR before demonstrating a headlock",voice:'A very public dissertation',boast:'Your entire offense is anecdotal. Mine has been peer-reviewed.',heart:"I’m a doctor. That is what goes on the nameplate, and that is where this discussion ends.",stunt:'presents a wildly overcomplicated chart explaining why the championship is statistically inevitable'},
 {style:'Polished showboat',move:'Prime-Time Finale',counter:'red-carpet neckbreaker',tell:'finds the hard camera before winding up for the big finish',bit:'makes the referee announce a commercial break that nobody authorized',voice:'The spotlight monologue',boast:'You are looking at the main event. Everybody else is the recap.',heart:'The lights are bright because I earned my place under them. Now watch me prove it.',stunt:'turns the ringside camera around and delivers a mock awards speech directly into it'},
 {style:'Explosive striker',move:'Absolute Zero Kick',counter:'glacier-breaker suplex',tell:"warms up the freeze ray and mistakes the condensation for an early victory",bit:"offers the referee an ice pack made of water and refuses to put the freeze ray away",voice:"A cold call from the Doctor of Ice",boast:"Ice to meet you. Stand still while this ray makes you colder than room temperature.",heart:"I want this world so cold even the ice has to borrow a coat.",stunt:"aims the freeze ray at the entrance ramp and points to the puddle as proof of a successful frost"},
 {style:'Pocket powerhouse',move:'Mousetrap Powerbomb',counter:'whisker-twitch headscissors',tell:'gets called tiny and immediately squares up for a much bigger lift',bit:'offers a cheerful little wave before flexing hard enough to silence the joke',voice:'Small ears, big threats',boast:'Call me adorable one more time. I dare you.',heart:'You do not have to be the biggest person in the room to take up your space.',stunt:'asks the crowd to squeak along, then rattles the microphone with a surprisingly thunderous battle cry'},
 {style:'Resourceful underdog',move:'Clean Sweep leg trip',counter:'dustpan cradle',tell:"spots grit beside the turnbuckle and furiously sweeps it clear before advancing",bit:"cleans every scrap knocked loose by the match, complaining the entire time",voice:'The night-shift dream',boast:'I have cleaned up after everyone in this company. Your turn.',heart:"I want the whole bloody world clean, boss. Move your boots. I’m starting here.",stunt:"sweeps a perfect ring around the opponent, then angrily cleans the footprints crossing it"},
 {style:'Sneaky opportunist',move:'VIP Rope-Hung Stunner',counter:'backstage-pass roll-up',tell:'looks to the curtain for help from a celebrity friend who is definitely not arriving',bit:'tries to get the opponent added to an imaginary VIP guest list',voice:'The guest-list grievance',boast:'You need a ticket to be here. I am on the list.',heart:'Everybody knows somebody. Tonight I want you to remember my name.',stunt:'takes a very theatrical phone call from an unnamed VIP and invites the audience to listen in'},
 {style:"Pedantic street-safety counter-wrestler",move:"Crosswalk DDT",counter:"blind-spot inside cradle",tell:"corrects the referee’s use of “intersection” while checking both directions",bit:"halts an exchange to distinguish a hazard from a violation, then takes the risk anyway",voice:"The unsolicited safety briefing",boast:"Technically, it’s not a blind corner if I tell you about it first. I’m telling you now.",heart:"Everybody says narc. Nobody says thank you for explaining proper curb clearance.",stunt:"hands out reflective safety cards and interrupts every follow-up question to correct its wording"},
 {style:'Spectacular aerialist',move:'Orbital Elbow',counter:'zero-gravity headscissors',tell:'points to the ceiling as if the community hall is a launch facility',bit:"calls ground control to ask whether the ropes are rated for reentry",voice:"An astronaut requests another mission",boast:'You are in my orbit now. Please respect the exclusion zone.',heart:"Ten minutes up there and a lifetime down here. I know which direction I want to go.",stunt:"narrates a turnbuckle climb as a launch sequence and declares the upper rope low orbit"},
 {style:"Approval-seeking all-rounder",move:"Call Dad Cutter",counter:"second-mention spinebuster",tell:"checks the front row for Dad after every near fall",bit:"asks the opponent if they know who was in Jerry Maguire before resuming the lockup",voice:"A very proud introduction to Dad",boast:"Do you know my dad? He was in Jerry Maguire. Let me ask the other corner.",heart:"If Dad calls after this, tell him I’m still here. And ask if he watched.",stunt:"sets a RESERVED FOR DAD sign on an empty chair and keeps turning the sign toward the ring"},
 {"style": "Precision counter-wrestler", "move": "Parallel Plex", "counter": "straight-line arm drag", "tell": "takes the same route as the opponent one lane over", "bit": "asks for another pass side by side after discovering both wrestlers have missed each other", "voice": "A lesson in straight lines", "boast": "Our careers run parallel. Yours will never meet mine.", "heart": "All my life I have been told to fall in line. Tonight I finally draw my own.", "stunt": "unrolls two strips of lane tape and follows the second while waiting for the first to meet it"},
 {"style": "Erratic trickster", "move": "Unbirthday Driver", "counter": "tea-time neckbreaker", "tell": "checks a pocket watch, laughs, and suddenly changes the pace", "bit": "invites the opponent to a tea break at the least convenient moment", "voice": "The unbirthday invitation", "boast": "You are late for your own defeat. I have already put the kettle on.", "heart": "They never saved me a seat at the table. So I built a stranger table.", "stunt": "sets out three empty teacups and asks the crowd which invisible guest deserves a title shot"},
 {"style": "Methodical submission specialist", "move": "Full Coverage Clutch", "counter": "deductible wristlock", "tell": "offers the opponent a signature line before tightening a headlock", "bit": "tries to classify the rope break as a pre-existing condition", "voice": "The coverage consultation", "boast": "Your comeback is not covered under this policy.", "heart": "Everybody wants protection. I just want somebody to read the whole document.", "stunt": "unfurls a six-foot policy and asks the front row to initial every page before the main event"},
 {"style": "Courteous dirty fighter", "move": "Kind Regards DDT", "counter": "after-you knee lift", "tell": "straightens the opponent’s collar before handing the referee an invoice for the impending damage", "bit": "smiles while sliding the injured corner’s ice pack out of reach, then calls it a courtesy to the next guest", "voice": "A courtesy with collection fees", "boast": "Please keep the ambulance receipt. A lovely souvenir for the losing corner.", "heart": "Thank you for the warm welcome. Please sign any complaints. A home visit can be arranged for every name in the box.", "stunt": "presents the announcer with flowers and a bill for reading the opposing corner’s eulogy"},
 {"style": "Distracting opportunist", "move": "Quote-Tweet Cutter", "counter": "reply-guy roll-up", "tell": "mimes typing an outraged post between every exchange", "bit": "asks the audience to take a poll on whether that last strike should count", "voice": "The live-thread meltdown", "boast": "Your title reign has twelve views. I am about to give it engagement.", "heart": "Behind every loud post is somebody hoping you will actually notice them.", "stunt": "reads a fake live thread about his own entrance and argues with every imaginary reply"},
 {"style": "Lovable ambush brawler", "move": "Three Sizes Heartstopper", "counter": "mistletoe backbreaker", "tell": "waves adoringly to both corners and interprets every shout as encouragement", "bit": "thanks the opponent for an exceptionally enthusiastic headlock", "voice": "The full-hearted welcome", "boast": "I love this crowd, I love this match, and I am going to hug you directly into a three-count!", "heart": "There’s room for EVERYBODY in my corner! Do you think there’s room for me in yours? I can make myself very, very big!", "stunt": "opens a heart-filled lockbox and gives the referee a thank-you before welcoming the opposing corner"},
 {"style": "Arena-rock power brawler", "move": "Encore Powerbomb", "counter": "power-chord clothesline", "tell": "winds up a big strike as though playing the final chord of a stadium show", "bit": "plays an air-guitar solo through a near fall and demands a louder second verse", "voice": "The arena-rock address", "boast": "You know every word of my entrance. By tomorrow you will know every second of this loss.", "heart": "A thousand small rooms got me here. I still play every one like a stadium.", "stunt": "strums an unplugged guitar while asking the audience to provide a very unnecessary encore"},
 {"style": "Flat, one-direction flopper", "move": "Full-Body Flop", "counter": "same-side cradle", "tell": "lies flat facing the same wall until somebody forgets he is in the match", "bit": "asks everyone behind him to walk around to the side where he can see them", "voice": "An announcement to one side of the room", "boast": "Keep looking the other way. I am very good at being here when you forget to look.", "heart": "If you saw me get up, tell somebody on your side. I can’t see who’s there.", "stunt": "remains flat while the announcer counts the wrestlers, then flops into the middle just as the count comes up short"},
 {"style": "Sharp counter-striker", "move": "Zest for Destruction", "counter": "sour-note roundhouse", "tell": "smiles sweetly, then snaps into a sharp counter stance", "bit": "offers a perfectly innocent imaginary taste test before making a very sour face", "voice": "Sugar on the threat", "boast": "Sweet entrance. Bitter ending. You will acquire the taste.", "heart": "They put me on the novelty menu. I am here to become the main course.", "stunt": "holds a ceremonial tasting and asks the crowd to rate the championship for acidity"},
 {"style": "Faithful comeback wrestler", "move": "Third-Day Comeback", "counter": "altar-call wristlock", "tell": "takes a moment to pray, then urges both corners to find the strength to get up", "bit": "offers a word of encouragement to the opponent and makes sure they know where the fellowship table is", "voice": "An invitation to faith and fellowship", "boast": "The Lord gave me the strength to get back up. You are welcome to ask for some too.", "heart": "If you came in feeling forgotten, the Lord knows your name. I’d like to learn it before you leave.", "stunt": "leads a brief prayer for both corners and opens the fellowship hall before the crew has finished stacking chairs"},
 {"style": "Rhythmic showboat", "move": "Beat Drop Elbow", "counter": "bassline backslide", "tell": "counts an invisible four-beat rhythm before springing into the next exchange", "bit": "asks the referee to wait until the beat drops before making a count", "voice": "The community-hall headliner", "boast": "You are the warm-up. I am the drop they came to hear.", "heart": "A great night happens when everybody in the room feels the same beat. Let me find ours.", "stunt": "builds a drop on a cardboard DJ controller and lets the front row supply every sound effect"},
 {"style": "Self-conscious technician", "move": "Five-Star Superplex", "counter": "workrate wristlock", "tell": "calls for a shine, a heat segment, a comeback, and a finish in that exact order", "bit": "offers an unsolicited review in thick Boston vowels before the match has reached the heat", "voice": "The unsolicited review", "boast": "Pahk the fancy stuff. Shine, heat, comeback, finish. The ordah matters.", "heart": "A good comeback makes a room care. First ya gotta give the room somethin’ to come back from.", "stunt": "reveals a star-rating chart, gives his own entrance six stars, and asks the crowd to justify any disagreement"},
 {"style": "Accidental scrapper", "move": "Scenic Route Slam", "counter": "wrong-turn inside cradle", "tell": "looks around in wonder as though discovering this ring for the very first time", "bit": "stops for a ringside postcard photo of a landmark everyone else calls the fire exit", "voice": "Wish you were here, next door", "boast": "I have seen the sights. You are about to become one.", "heart": "You can spend a lifetime here and still find somewhere new to belong.", "stunt": "unfolds a map of the neighborhood and draws a sightseeing route from his house to the championship"},
 {"style": "Vain, self-conscious catch-wrestler", "move": "Mirror Check Suplex", "counter": "better-side wristlock", "tell": "angles his ordinary jaw toward the light and checks whether the opponent noticed", "bit": "holds an impromptu comparison of cheekbones and calls himself the clear winner", "voice": "The undisputed best-looking entrance", "boast": "Stand next to me. The room can settle which of us is more fetching. The room has already settled it.", "heart": "A few people missed the entrance. I could do it again, if only for them.", "stunt": "has the announcer read a ranking of everyone in the room and then asks for a correction to first place"},
 {"style": "Slow-docking powerhouse", "move": "Full Berth Body Slam", "counter": "anchor-drop sidewalk slam", "tell": "sways down the aisle at docking speed and waits for the ropes to settle", "bit": "holds the ropes open an extra beat for several tiny passengers and proceeds without explanation", "voice": "Home is where the ring is", "boast": "I’m coming into berth. There is plenty of time to be somewhere else when I arrive.", "heart": "I would like the same berth next Saturday. The little ones are beginning to recognize this dock.", "stunt": "sets a miniature welcome mat on the apron and takes an unhurried count of everyone aboard"},
 {"style": "Burst-of-energy scrapper", "move": "Ninety-Second Knockout", "counter": "stuffed-crust headscissors", "tell": "checks a pocket for emergency fuel, then launches into a sudden burst of offense", "bit": "offers the opponent a whole serving before warning them about the molten center", "voice": "A full-meal invitation", "boast": "Careful. The filling is hotter than your entire comeback.", "heart": "I have worked through enough breaks. Tonight we all get a little something to cheer for.", "stunt": "opens her pockets and insists the front row have a full plate before anybody goes home"},
 {"style": "Deliberate defensive grappler", "move": "Middle-Ground Matlock", "counter": "balanced-position hip toss", "tell": "measures both corners, hears a third dispute and snaps the measuring tape shut", "bit": "asks the referee to record the headlock without construing it as an endorsement", "voice": "The carefully neutral statement", "boast": "I take no position on either corner. I do take issue with the length of this argument.", "heart": "A match can end at the bell. Imagine what could happen if an argument did the same.", "stunt": "sets up identical podiums, gives each corner the same time and bangs the gavel harder with every objection"},
 {"style": "Paired, lace-tied footwork", "move": "Both Boots Dropkick", "counter": "lace-tied ankle pick", "tell": "moves in paired steps, keeping one half just ahead and the laces taut", "bit": "counts both halves present and calls out for Rudy to check his other shoe", "voice": "A pair ready to be laced up", "boast": "We go together. One slightly ahead, both ready when Rudy needs us.", "heart": "We have two halves and room for exactly one person who needs both. Somebody tell Rudy.", "stunt": "marks two spots on the card under the same name, then shuffles over to save Rudy the seat next to the pair"},
 {"style": "Wobbling impact wrestler", "move": "Custard Catastrophe", "counter": "spotted-dick sidewalk slam", "tell": "wobbles alarmingly, steadies, and somehow turns the sway into forward momentum", "bit": "asks the crowd for complete silence while trying to stop jiggling", "voice": "Proof of the pudding", "boast": "You have had your main course. Here comes the finish.", "heart": "I have never been the most graceful thing in the ring. You have made me feel like I belong anyway.", "stunt": "presents a tiny silver spoon as a ceremonial title challenger and appoints the crowd the dessert committee"}
];
ringPersonalities.push(...[
 {
  "style": "Hard-drinking comeback brawler",
  "move": "Comeback Credit",
  "counter": "last-round wristlock",
  "tell": "squints at the other corner, catches himself on the rope, then grins when the opponent steps closer",
  "bit": "asks if the crowd wants another round, then asks the opponent before the crowd can answer",
  "voice": "The comeback pitch",
  "boast": "I lost the lead in Demeter’s Baby. Nobody’s taking this fight off me. I might ask for two.",
  "heart": "They stopped calling about films. Then I heard this lot shout my name, and somebody swung at me. Best call I’ve had in years.",
  "stunt": "autographs an old headshot, toasts the next booking and asks whether the opponent wants another round"
 },
 {
  "style": "Rooted powerhouse",
  "move": "Crown Crusher",
  "counter": "enamel-lock armbar",
  "tell": "plants both boots and grins above the foam molar costume",
  "bit": "asks the referee to certify an exceptionally clean break",
  "voice": "Straight from the molar",
  "boast": "Strong roots. Solid crown. You are about to meet the bite.",
  "heart": "They called me a novelty. I kept showing up. A strong foundation takes time.",
  "stunt": "holds a giant cardboard dental chart and marks the championship as the next appointment"
 },
 {
  "style": "Insistent headline technician",
  "move": "Voluntary Departure",
  "counter": "alternative-offer backslide",
  "tell": "points at the mat to emphasize the venue she has personally selected",
  "bit": "interrupts the count to remind everyone that she chose to attend",
  "voice": "An entirely voluntary statement",
  "boast": "Every door is open. I chose this one. You are welcome.",
  "heart": "A choice means something when you back it up. Watch what I do in this ring.",
  "stunt": "fans out a stack of blank invitation cards and ceremonially chooses this hall again"
 },
 {
  "style": "Unpredictable canine scrambler",
  "move": "Good Dog Crossbody",
  "counter": "under-the-legs escape",
  "tell": "perks up at the bell and checks that the referee can see the marked rulebook",
  "bit": "fetches the referee’s dropped item and immediately asks to resume wrestling",
  "voice": "The rulebook loophole",
  "boast": "I am a dog. Show me where it says a dog cannot wrestle. I brought the whole book.",
  "heart": "I am a dog. I want to wrestle. The rules do not say I cannot. That is plenty.",
  "stunt": "brings the rulebook to the referee, points out the absence of a dog ban and eagerly waits for the bell"
 }
]);

const signed=n=>(n>0?'+':'')+n;
function momentScore(delta,reason){return {delta:clamp(delta,-3,3),reason}}
function scorePromoMoment(s,index){
 const a=w(s.a),p=ringPersonalities[a.id],hook=s.hook||'Win the crowd';
 const challenge=['Issue a challenge','Fuel a rivalry'].includes(hook),debut=hook==='Debut a gimmick';
 const direct=momentScore(challenge?3:a.charisma>=80?2:1,challenge?'The direct confrontation delivers on the booked pitch.':'A short, direct statement keeps the crowd focused.');
 const earnest=momentScore(a.role==='Face'?(hook==='Win the crowd'?3:2):state.crowd.drama>=55?1:-1,a.role==='Face'?'The audience had a reason to get behind their hero.':state.crowd.drama>=55?'The drama crowd responded to a more personal side of the heel.':'The crowd expected a heel and didn’t buy the appeal for sympathy.');
 const spectacle=momentScore(debut?3:state.crowd.chaos>=50?(a.charisma>=80?3:2):a.charisma>=80?1:-2,debut?'The stunt gave the gimmick debut a memorable image.':state.crowd.chaos>=50?'The crowd came ready for a spectacle.':a.charisma>=80?'Charisma kept the stunt moving.':'The stunt stalled a crowd waiting for the story to move.');
 return {kind:'promo',actors:[a.id],title:'The room is listening.',context:hook,styles:[p.style],choices:[
  {tag:'Call someone out',...direct},
  {tag:'Show some heart',...earnest},
  {tag:'Commit to the bit',...spectacle}
 ]};
}
function duelMoment(s,index){
 const a=w(s.a),b=w(s.b),lead=w(s.winner),other=lead.id===a.id?b:a,p=ringPersonalities[lead.id],q=ringPersonalities[other.id],heat=state.rivalries[rivalryKey(a.id,b.id)]||0;
 const crisp=momentScore(lead.skill>=80?3:lead.skill>=65?2:1,lead.skill>=80?'Excellent ring craft makes the signature sequence look effortless.':lead.skill>=65?'Their ring craft is strong enough to give the signature sequence a crisp payoff.':'Keeping the sequence simple lets them play to their strengths.');
 const precise=Math.min(a.skill,b.skill),contrast=lead.skill>=70&&other.skill>=70;
 const exchange=momentScore(precise>=75?3:contrast?2:precise>=60?1:-2,precise>=75?'Both wrestlers have the timing to make the counter exchange feel competitive.':contrast?'The pair can execute the momentum swing without losing the crowd.':precise>=60?'They get through it, but the exchange is a little tentative.':'The elaborate exchange asks too much of the less experienced wrestler. The timing slips.');
 const special=!['Singles match','Tag-team showcase'].includes(s.type),clean=s.finish==='Clean finish';
 let gag=momentScore(special?3:state.crowd.chaos>=50?2:lead.charisma>=80?1:-1,special?'The larger-than-life character beat belongs in this stipulation.':state.crowd.chaos>=50?'The chaos section is primed for exactly this kind of silliness.':lead.charisma>=80?'Personality keeps the bit moving, even with a wrestling-first audience.':'The gag slows down a crowd waiting for the wrestling to resume.');
 let wildTitle='Taunt the opponent with a signature bit',wildDetail=`${lead.name} ${p.bit}. ${other.name} gets to answer with their own bit.`,wildOutcome=`${lead.name} ${p.bit}; ${other.name} responds in kind and the ring briefly becomes a contest of egos.`;
 if(s.type==='Ladder match'){wildTitle='Turn the ladder into a character moment';wildDetail=`${lead.name} ${p.tell} on the second rung. ${other.name} interrupts the pose and the two scramble for balance.`;wildOutcome=`Halfway up the ladder, ${lead.name} ${p.tell}. ${other.name} rattles the rungs and turns the grand gesture into a frantic scramble.`}
 if(s.type==='Office Supplies Deathmatch'){wildTitle='Make the office supplies part of the act';wildDetail=`Let ${lead.name} ${p.bit}, with a ringside clipboard as the completely unnecessary centerpiece. ${other.name} objects with a flying folder.`;wildOutcome=`${lead.name} ${p.bit}. ${other.name} sends a folder sailing through the scene, and the referee has to dodge a storm of stationery.`}
 if(s.type==='Tag-team showcase'){
  const team=state.teams.find(t=>[t.a,t.b].includes(lead.id))||state.teams.find(t=>[t.a,t.b].includes(other.id));
  if(team){const partner=w(team.a===lead.id?team.b:team.a===other.id?team.b:team.a);wildTitle=`Give ${team.name} a signature tandem beat`;wildDetail=`Bring ${partner.name} into the spotlight for a synchronized character pose, then send the legal wrestler back into the exchange.`;wildOutcome=`${team.name} hit a synchronized pose. ${partner.name} adds their own flourish while the legal wrestler picks the action back up.`;gag=momentScore(team.chemistry>=60?3:team.chemistry>=40?2:-1,team.chemistry>=60?'Established chemistry makes the shared beat feel like a genuine team identity.':team.chemistry>=40?'The partners are starting to find a common rhythm.':'The new partners miss their cue. This team still needs time together.')}
 }
 // An existing grudge can make a quiet character beat more effective than another stunt.
 if(heat>=35&&!special){wildTitle='Let the grudge interrupt the routine';wildDetail=`${lead.name} starts the familiar bit—then stops, stares down ${other.name}, and goes straight back to the fight.`;wildOutcome=`${lead.name} abandons the usual routine and locks eyes with ${other.name}. The crowd feels how personal this has become.`;gag=momentScore(isEvent()?3:2,'The established rivalry makes the broken routine feel like a meaningful escalation.')}
 const finish='The wrestlers keep fighting for the decisive opening.';
 const choices=[
 {tag:'Signature sequence',title:`Set up the ${p.move}`,detail:`${lead.name} draws out ${other.name}’s ${q.counter}, then answers with the ${p.move}. ${finish}`,outcome:`${other.name} reaches for the ${q.counter}. ${lead.name} slips the setup and lands the ${p.move}. ${finish}`,...crisp},
 {tag:'Give both a moment',title:`Let ${other.name} fire back`,detail:`${other.name} hits the ${q.move}. ${lead.name} has to recover and turn a second attempt into their own ${p.counter}.`,outcome:`${other.name} gets their moment with the ${q.move}; ${lead.name} fights through it and counters the second attempt with a ${p.counter}. ${finish}`,...exchange},
 {tag:heat>=35&&!special?'Tell the story':s.type==='Tag-team showcase'?'Team identity':'Character chaos',title:wildTitle,detail:wildDetail,outcome:wildOutcome,...gag}
 ];
 choices.forEach(choice=>choice.beats=[{speaker:'commentary',text:choice.outcome,kind:'action'}]);
 return {kind:'match',actors:[a.id,b.id],title:s.title?'The title hangs in the balance.':'The match needs its big moment.',setup:`${a.name} ${ringPersonalities[a.id].tell}. Across the ring, ${b.name} ${ringPersonalities[b.id].tell}. The crowd is leaning in. What do you call next?`,context:s.type+(s.title?' · WWA championship':''),styles:[ringPersonalities[a.id].style,ringPersonalities[b.id].style],choices};
}
function scoreMatchMoment(s,index){
 const ids=matchPeople(s),lead=w(s.winner),other=w(matchOpponents(s,lead.id)[0]),base=duelMoment({...s,a:lead.id,b:other.id},index);
 base.actors=ids;base.styles=ids.map(id=>ringPersonalities[id].style);base.context=matchLabel(s)+(s.title?' · WWA championship':'');
 if(ids.length>2){
  const win=matchSides(s).find(side=>side.includes(lead.id)),allies=win.filter(id=>id!==lead.id),third=ids.find(id=>id!==lead.id&&id!==other.id);
  const special=teamFormat(s)?{tag:'Teamwork',title:'Build to the hot tag',detail:`${lead.name} creates space for ${allies.map(id=>w(id).name).join(' and ')}. Keep every partner involved.`,outcome:`${lead.name} draws the opposition in. ${w(allies[0]).name} takes the hot tag and changes the pace. ${allies.length>1?w(allies[1]).name+' cuts off the attempted save.':''}`,delta:establishedTeams(s).some(t=>t.chemistry>=50)?3:1,reason:'A coordinated tag sequence gives the team a shared identity.'}:{tag:'Watch every rival',title:matchFormat(s)==='royal'?'Set up a surprise elimination':'Break up the cover',detail:`${w(third).name} refuses to be forgotten while ${lead.name} and ${other.name} trade attacks.`,outcome:matchFormat(s)==='royal'?`${w(third).name} rushes the exchange. ${lead.name} sends the charging wrestler over the top rope, then turns back to the remaining field.`:`${other.name} has an opening, but ${w(third).name} breaks up the fall. ${lead.name} uses the scramble to recover.`,delta:state.crowd.chaos>=50?3:1,reason:'The extra opponent matters to the action rather than simply waiting for a turn.'};
  if(teamFormat(s)&&win.includes(3))Object.assign(special,{title:'Play up the refused tag',detail:'One Man insists the boys can handle the opposition.',outcome:'One Man waves off outside help and calls a stable meeting in the corner.',reason:'The tag spot gives One Man a chance to put the whole stable on display.'});
  if(!teamFormat(s)&&s.type!=='Singles match'&&s.type!=='No disqualification'){
   const actions={'Ladder match':['Pull them off the ladder',`${w(third).name} reaches the upper rungs. ${lead.name} pulls the ladder away from the prize and forces another scramble.`],'Tables match':['Turn the table trap around',`${w(third).name} sets a table beside the ropes. ${lead.name} notices the trap and steers the next exchange away from it.`],'Steel cage':['Cut off the escape route',`${w(third).name} heads for the cage wall. ${lead.name} cuts off the climb while ${other.name} regroups.`],'Submission match':['Break the hold before the tap',`${other.name} locks in a submission. ${w(third).name} breaks the hold before ${lead.name} can tap.`],'Last person standing':['Make the count a race to recover',`${lead.name} rises at nine while ${other.name} and ${w(third).name} struggle to beat their own counts.`]};
   if(actions[s.type]){special.title=actions[s.type][0];special.outcome=actions[s.type][1];special.detail=special.outcome}
  }
  special.beats=[{speaker:'commentary',text:special.outcome,kind:'action'}];const replace=base.choices.findIndex(c=>['Character chaos','Tell the story','Team identity'].includes(c.tag));base.choices[replace>=0?replace:2]=special;
 }
 const rules={
  'Steel cage':['Use the cage to cut off the comeback',`${lead.name} blocks the route to the cage door. ${other.name} has to fight back toward the middle of the ring.`],
  'Tables match':['Reverse the attack at the table',`${other.name} sets the table in place. ${lead.name} reverses the next attack and sends the opponent through it.`],
  'Submission match':['Work the hold instead of chasing a pin',`${lead.name} transitions into a submission. ${other.name} fights for the ropes as the hold tightens.`],
  'Last person standing':['Let the opponent beat the count at nine',`${other.name} struggles upright at nine. ${lead.name} has to dig deeper before the next decisive knockdown.`]
 };
 if(rules[s.type]){const [title,outcome]=rules[s.type];base.choices[0]={tag:'Play the stipulation',title,detail:outcome,outcome,delta:lead.skill>=70?3:1,reason:'The sequence gives this match’s specific rules a purpose.',beats:[{speaker:'commentary',text:outcome,kind:'action'}]}}
 if(matchFormat(s)==='royal'){base.choices=base.choices.map(choice=>({...choice,detail:choice.detail.replace(/pinfall|winning fall/gi,'elimination'),outcome:choice.outcome.replace(/pinfall|winning fall/gi,'elimination')}))}
 return base;
}

function promoMoment(s,index){return kayfabeMoment(scorePromoMoment(s,index),s,index)}
function matchMoment(s,index){return kayfabeMoment(scoreMatchMoment(s,index),s,index)}

// Show night belongs to the wrestlers. The booker set the card; once the bell goes,
// each act calls its own segment by instinct, and the booker watches from the curtain.
const CALL_INSTINCTS={
 skill:['Signature sequence','Give both a moment','Play the stipulation','Teamwork','Watch every rival'],
 charisma:['Character chaos','Commit to the bit','Tell the story','Team identity'],
 face:['Show some heart'],heel:['Call someone out']
};
function callLead(segment){return w(segment.kind==='promo'?segment.a:segment.winner)}
// A wrestler who doesn't trust the booking goes with their gut instead of the plan.
function offScript(segment){return callLead(segment).trust<35}
// Per-wrestler show-night habits from the roster spines. `prefer`: call tags they reach for no matter what.
const CALL_HABITS={
 12:{prefer:['Character chaos','Tell the story','Team identity'],note:'“Street Smart” John Smith goes for the risky street finish over the safe one'}
};
// Pissboy, P.H.D won't cut a promo on anyone who has doubted the doctorate: anyone with heat on him.
function doubtsDoctorate(id){return (storyFor(6,id)?.heat||0)>0||(state.rivalries[rivalryKey(6,id)]||0)>0}
function wrestlerCall(moment,segment){
 const lead=callLead(segment),leans=[lead.skill>lead.charisma?'skill':'charisma'],habit=CALL_HABITS[lead.id];
 if(habit&&segment.kind==='match'){const i=moment.choices.findIndex(c=>habit.prefer.includes(c.tag));if(i>=0)return i}
 if(segment.kind==='promo')leans.push(lead.role==='Face'?'face':'heel');
 const instinct=choice=>leans.some(lean=>CALL_INSTINCTS[lean].includes(choice.tag))?1:0,gut=offScript(segment);
 let best=0,top=-Infinity;
 moment.choices.forEach((choice,i)=>{const score=gut?instinct(choice)*10+(choice.delta??0):(choice.delta??0)+instinct(choice);if(score>top){top=score;best=i}});
 return best;
}
// How the night went beyond the plan: morale, ring skill, trust in the booker and the bonds
// built over the season. Words only on screen; the numbers stay behind the curtain.
function callForm(segment){
 const ids=matchPeople(segment),people=ids.map(w),lead=callLead(segment),notes=[];let mod=0;
 const add=(n,text)=>{mod+=n;notes.push({tone:n>0?'up':'down',text})};
 const low=people.filter(r=>r.morale<45),high=people.filter(r=>r.morale>=85);
 if(low.length)add(-1,`${low.map(r=>r.name).join(' & ')} ${low.length>1?'look':'looks'} flat tonight`);
 else if(high.length===people.length)add(1,people.length>1?'Everyone in it is fired up':`${lead.name} is fired up`);
 const cold=people.filter(r=>typeof overlooked==='function'&&overlooked(r.id));
 if(cold.length)notes.push({tone:'down',text:`${cold.map(r=>r.name).join(' & ')} ${cold.length>1?'have':'has'} been phoning it in lately`});
 if(segment.kind==='match'){
  const skill=people.reduce((n,r)=>n+r.skill,0)/people.length,green=people.find(r=>r.skill<50);
  if(skill>=80)add(1,'Pros at work');else if(green)add(-1,`${green.name} is still learning the ropes`);
 }else if(lead.charisma>=88)add(1,`${lead.name} has the room in the palm of their hand`);
 if(segment.kind==='promo'&&lead.id===6&&segment.target!=null&&doubtsDoctorate(segment.target))add(-1,`${lead.name} stalls. He will not address anyone who doubts the doctorate`);
 if(segment.kind==='match'&&CALL_HABITS[lead.id]?.note)notes.push({tone:'up',text:CALL_HABITS[lead.id].note});
 const mainEvent=(state.card||[]).indexOf(segment)===(state.card||[]).length-1;
 if(lead.trust>=80)typeof rideOrDie==='function'&&rideOrDie(lead.id)&&mainEvent?add(2,`${lead.name} carries the main event for you`):add(1,`${lead.name} goes the extra mile for you`);
 else if(isFeatured(lead.id)&&lead.trust>=ROOM_TIER&&!overlooked(lead.id)&&wholeRoom())add(1,'The whole locker room is pulling for this one');
 else if(offScript(segment))add(-1,`${lead.name} ignores the plan and does it their way`);
 const rival=segment.kind==='promo'?segment.target:matchOpponents(segment,lead.id)[0];
 if(rival!=null&&((storyFor(lead.id,rival)?.heat||0)>=35||(state.rivalries[rivalryKey(lead.id,rival)]||0)>=35))add(1,`The bad blood with ${w(rival).name} is real`);
 if(segment.kind==='match'&&establishedTeams(segment).some(t=>t.chemistry>=60))add(1,'The team moves like one');
 return {mod:clamp(mod,-2,2),notes};
}
function autoCall(moment,segment,index){
 const option=wrestlerCall(moment,segment),choice=moment.choices[option],form=callForm(segment),delta=clamp((choice.delta??0)+form.mod,-3,3);
 const reason=[choice.reason,...form.notes.map(n=>n.text+'.')].filter(Boolean).join(' ');
 // Re-stage the segment at the quality it actually reached, so the summary matches the stamp.
 const adjusted={...choice,delta},scene=delta===choice.delta?null:segment.kind==='promo'?promoBranch(adjusted,segment,moment):matchBranch(adjusted,segment,moment);
 const staged=scene?{beats:scene.beats,featured:scene.featured,outcome:beatStory(scene.beats)}:{};
 return {...choice,...staged,option,segment:index,actors:moment.actors,auto:true,baseDelta:choice.delta??0,delta,tier:callTier(delta),form:form.notes,reason};
}
// Older saves can resume mid-broadcast with segments the booker was asked to call.
function ensureLiveCalls(){
 const live=state.liveShow;if(!live)return;let changed=false;
 live.moments.forEach((moment,i)=>{if(!live.answers[i]&&state.card[i]){live.answers[i]=autoCall(moment,state.card[i],i);changed=true}});
 if(changed)save();
}
function startLiveShow(){
 if(weeklyBriefingPending()){openWeeklyBriefing();return}
 if(state.recap||state.liveShow)return;
 dilemmaPrepareShow();
 const moments=state.card.map((s,i)=>s.kind==='promo'?promoMoment(s,i):matchMoment(s,i));
 state.liveShow={week:state.week,index:0,moments,answers:moments.map((m,i)=>autoCall(m,state.card[i],i)),dilemmaCalls:dilemmaLiveCalls(),dilemmaIndex:0};
 render();window.scrollTo(0,0);focusLiveHeading();
}
function focusLiveHeading(){const el=$('#next-moment')||$('#live-heading');if(el)el.focus({preventScroll:true})}
function nextMoment(){
 const live=state.liveShow;if(!live)return;ensureLiveCalls();
 if(live.index<live.moments.length-1){live.index++;save();render();focusLiveHeading();const card=$('.report-card.is-new');if(card)card.scrollIntoView({block:'start',behavior:'auto'});return}
 finishLiveShow();
}
function finishLiveShow(){const live=state.liveShow;if(!live||live.dilemmaCalls?.[live.dilemmaIndex||0])return;ensureLiveCalls();const answers=live.answers,report=typeof captureShowReport==='function'?captureShowReport():[];state.liveShow=null;const recap=simulate(answers);if(recap){recap.report=report;if(typeof buildBackstage==='function')recap.backstage=recordWalk(buildBackstage(recap),recap.week)}render();window.scrollTo(0,0)}
function liveShowPage(){return dilemmaLivePage()||showReportPage()}
function bindLiveShow(){
 if($('#next-moment'))$('#next-moment').onclick=nextMoment;
 if($('#skip-show'))$('#skip-show').onclick=finishLiveShow;
}

function recapDecision(r){
 if(!r.decision)return '';
 const d=r.decision,applied=r.rating-r.baseRating;
 return `<details class="recap-decision"><summary>Booker’s report · ${signed(applied)} quality</summary><div class="row"><small>${esc(d.tag)}</small><strong class="quality-badge ${applied<0?'negative':applied===0?'neutral':''}">${signed(applied)} QUALITY</strong></div><h4>${esc(d.title)}</h4><p class="recap-reason">${esc(d.reason)}</p>${r.analysis?`<p>${esc(r.analysis)}</p>`:''}<span class="rating-math">${r.baseRating} BASE ${applied>=0?'+':'−'} ${Math.abs(applied)} MOMENT = ${r.rating} SEGMENT${applied!==d.delta?' · limited by the 0–100 rating range':''}</span></details>`;
}
