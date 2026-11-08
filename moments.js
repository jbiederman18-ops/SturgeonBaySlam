'use strict';
// Authored voices and ring styles. Stable IDs preserve characters in existing saves.
const ringPersonalities=[
 {style:"Greco Wrestling",move:'Olympus Driver',counter:'laurel-lock suplex',tell:"tests a Greco Wrestling grip and looks baffled when the opponent reaches for the ropes",bit:"stops to record a Greco Wrestling discovery before resuming the grip",voice:"The Greco Wrestling scholar",boast:"All Greece shall know my Greco Wrestling; you may assist by resisting properly.",heart:"Every contest teaches me something of Greco Wrestling, even the disagreeable ones.",stunt:"unrolls a Greco Wrestling diagram and insists the front row witness the next demonstration"},
 {style:'Technical minimalist',move:'Hold Number One',counter:'mysterious second hold',tell:"adjusts Hold One by a fraction and prepares to explain why every apparent alternative is Hold Two",bit:"identifies the unfamiliar hold trapping him as an imperfect version of one of his two",voice:'Two holds, one obsession',boast:'I know two holds. You have not survived the first.',heart:"Two holds. A lifetime to master them. I intend to use the whole lifetime.",stunt:"opens a manual with exactly two headings and corrects the opponent’s terminology while caught in a hold"},
 {style:'Underdog scrapper',move:'Fourth-Down Tackle',counter:'goal-line shoulder block',tell:'gets knocked down, pops back up, and starts a one-person sideline chant',bit:'calls a tiny locker-room huddle with the referee',voice:'The walk-on speech',boast:'Put me in the match. I only need one play.',heart:'I was told I was too small for the team. I am still here. Are you with me?',stunt:'hands out miniature playbooks and leads the front row in a locker-room pep talk'},
 {style:'No-frills bruiser',move:'Single-Handed Slam',counter:'one-count clothesline',tell:'holds up one finger and insists on doing this alone',bit:'refuses an imaginary hot tag because there is, emphatically, only one man',voice:'Less is one',boast:'One ring. One opponent. One Man. That is all you need to know.',heart:'No backup. No entourage. Just me, showing up every week.',stunt:'unveils a one-person fan club and insists everyone join individually'},
 {style:'Slapstick grappler',move:'Spin-Cycle Splash',counter:'frayed-edge whip',tell:'winds up for a splash while the entire front row starts waving',bit:'tries to rally the audience, remembers they are the villain, and angrily waves back',voice:'Fabric with an attitude',boast:'I am not a souvenir. I am the thing you throw in when you have had enough.',heart:'They told me a towel belonged on the floor. Look who is still standing.',stunt:'conducts a synchronized towel wave, then fines the crowd for copying their technique'},
 {style:'Stalling ring lawyer',move:'Objection! Neckbreaker',counter:'procedural wristlock',tell:'calls for a timeout to dispute the referee’s interpretation of a rope break',bit:'produces a fictional WWA bylaw from a tiny ringside briefcase',voice:'The wrestling objection',boast:'Under WWA subsection three, your title reign is clearly subject to review.',heart:'I have read every wrestling bylaw in this briefcase. I will earn my hearing in that ring.',stunt:'sets up a miniature podium and asks the crowd to sustain an objection to the champion'},
 {style:'Experimental technician',move:'Peer-Reviewed Plex',counter:'control-group armbar',tell:'announces a new hypothesis about the opponent’s center of gravity',bit:'asks a fan to hold a clipboard and peer-review a headlock',voice:'A very public dissertation',boast:'Your entire offense is anecdotal. Mine has been peer-reviewed.',heart:'They laughed at the name. They laughed at the thesis. Tonight I defend both.',stunt:'presents a wildly overcomplicated chart explaining why the championship is statistically inevitable'},
 {style:'Polished showboat',move:'Prime-Time Finale',counter:'red-carpet neckbreaker',tell:'finds the hard camera before winding up for the big finish',bit:'makes the referee announce a commercial break that nobody authorized',voice:'The spotlight monologue',boast:'You are looking at the main event. Everybody else is the recap.',heart:'The lights are bright because I earned my place under them. Now watch me prove it.',stunt:'turns the ringside camera around and delivers a mock awards speech directly into it'},
 {style:'Explosive striker',move:'Absolute Zero Kick',counter:'glacier-breaker suplex',tell:'stares the opponent down and slowly signals that the temperature is dropping',bit:'makes a tiny weather forecast at the turnbuckle before throwing a strike',voice:'The cold front',boast:'The forecast is pain, with a one hundred percent chance of me.',heart:'Ice cracks under pressure. I do not. Give me the hardest match you have.',stunt:'reveals a homemade weather map predicting a cold front directly over the title belt'},
 {style:'Pocket powerhouse',move:'Mousetrap Powerbomb',counter:'whisker-twitch headscissors',tell:'gets called tiny and immediately squares up for a much bigger lift',bit:'offers a cheerful little wave before flexing hard enough to silence the joke',voice:'Small ears, big threats',boast:'Call me adorable one more time. I dare you.',heart:'You do not have to be the biggest person in the room to take up your space.',stunt:'asks the crowd to squeak along, then rattles the microphone with a surprisingly thunderous battle cry'},
 {style:'Resourceful underdog',move:'Clean Sweep leg trip',counter:'dustpan cradle',tell:"spots grit beside the turnbuckle and furiously sweeps it clear before advancing",bit:"cleans every scrap knocked loose by the match, complaining the entire time",voice:'The night-shift dream',boast:'I have cleaned up after everyone in this company. Your turn.',heart:"I want one clean corner of the world, and I am bloody well starting here.",stunt:"sweeps a perfect ring around the opponent, then angrily cleans the footprints crossing it"},
 {style:'Sneaky opportunist',move:'VIP Rope-Hung Stunner',counter:'backstage-pass roll-up',tell:'looks to the curtain for help from a celebrity friend who is definitely not arriving',bit:'tries to get the opponent added to an imaginary VIP guest list',voice:'The guest-list grievance',boast:'You need a ticket to be here. I am on the list.',heart:'Everybody knows somebody. Tonight I want you to remember my name.',stunt:'takes a very theatrical phone call from an unnamed VIP and invites the audience to listen in'},
 {style:'Cagey counter-wrestler',move:'Perfectly Normal DDT',counter:'streetwise inside cradle',tell:'pretends not to understand a very obvious opportunity, then quietly steps into it',bit:'tries to settle the whole dispute with a suspiciously normal handshake',voice:'The ordinary threat',boast:'I have already worked out how this ends. You will catch up.',heart:'No famous name. No grand entrance. Just someone who knows how to keep going.',stunt:'unveils a whiteboard labeled THE PLAN with a single box reading WIN'},
 {style:'Spectacular aerialist',move:'Orbital Elbow',counter:'zero-gravity headscissors',tell:'points to the ceiling as if the community hall is a launch facility',bit:'asks everyone, including the opponent, for a little more personal space',voice:'The cosmic headline',boast:'You are in my orbit now. Please respect the exclusion zone.',heart:'There is room up here for every dream they told us was too big.',stunt:'counts down a cardboard rocket launch and asks the audience to provide the sound effects'},
 {style:'Expressive all-rounder',move:'Third-Act Twist',counter:'encore spinebuster',tell:'sells the last blow like a tragic finale, then starts a remarkably energetic comeback',bit:'takes an emotional bow for a near fall that has not happened yet',voice:'The third-act speech',boast:'This is my third act. You are about to be written out.',heart:'You stayed for the whole story. Let me give you an ending worth cheering for.',stunt:'delivers a mock acceptance speech and thanks the front row individually for their supporting performances'},
 {"style": "Precision counter-wrestler", "move": "Parallel Plex", "counter": "straight-line arm drag", "tell": "checks the angle of both shoulders before committing to the next exchange", "bit": "asks the referee to measure whether the ropes are truly parallel", "voice": "A lesson in straight lines", "boast": "Our careers run parallel. Yours will never meet mine.", "heart": "All my life I have been told to fall in line. Tonight I finally draw my own.", "stunt": "unrolls a diagram of two perfectly parallel championship reigns and refuses to explain the second one"},
 {"style": "Erratic trickster", "move": "Unbirthday Driver", "counter": "tea-time neckbreaker", "tell": "checks a pocket watch, laughs, and suddenly changes the pace", "bit": "invites the opponent to a tea break at the least convenient moment", "voice": "The unbirthday invitation", "boast": "You are late for your own defeat. I have already put the kettle on.", "heart": "They never saved me a seat at the table. So I built a stranger table.", "stunt": "sets out three empty teacups and asks the crowd which invisible guest deserves a title shot"},
 {"style": "Methodical submission specialist", "move": "Full Coverage Clutch", "counter": "deductible wristlock", "tell": "offers the opponent a signature line before tightening a headlock", "bit": "tries to classify the rope break as a pre-existing condition", "voice": "The coverage consultation", "boast": "Your comeback is not covered under this policy.", "heart": "Everybody wants protection. I just want somebody to read the whole document.", "stunt": "unfurls a six-foot policy and asks the front row to initial every page before the main event"},
 {"style": "Courteous dirty fighter", "move": "Kind Regards DDT", "counter": "after-you knee lift", "tell": "offers a dazzling smile and a suspiciously courteous handshake", "bit": "apologizes to the referee before asking exactly where the rules end", "voice": "The beautifully rude introduction", "boast": "Nothing personal, sweetheart. I am going to be absolutely dreadful to you.", "heart": "Everybody remembers the name. I would like them to remember the work, too.", "stunt": "hands the announcer a bouquet and a handwritten list of the insults to deliver on his behalf"},
 {"style": "Distracting opportunist", "move": "Quote-Tweet Cutter", "counter": "reply-guy roll-up", "tell": "mimes typing an outraged post between every exchange", "bit": "asks the audience to take a poll on whether that last strike should count", "voice": "The live-thread meltdown", "boast": "Your title reign has twelve views. I am about to give it engagement.", "heart": "Behind every loud post is somebody hoping you will actually notice them.", "stunt": "reads a fake live thread about his own entrance and argues with every imaginary reply"},
 {"style": "Lovable ambush brawler", "move": "Three Sizes Heartstopper", "counter": "mistletoe backbreaker", "tell": "waves adoringly to both corners and interprets every shout as encouragement", "bit": "thanks the opponent for an exceptionally enthusiastic headlock", "voice": "The reluctant love letter", "boast": "I love this crowd, I love this match, and I am going to hug you directly into a three-count!", "heart": "There is room for every single one of you in this welcome, including the people shouting the loudest!", "stunt": "opens a heart-filled lockbox and gives the referee a thank-you before welcoming the opposing corner"},
 {"style": "Arena-rock power brawler", "move": "Photograph Powerbomb", "counter": "power-chord clothesline", "tell": "winds up a big strike as though playing the final chord of a stadium show", "bit": "asks everyone to look at an imaginary photograph instead of the referee", "voice": "The arena-rock address", "boast": "You know every word of my entrance. By tomorrow you will know every second of this loss.", "heart": "A thousand small rooms got me here. I still play every one like a stadium.", "stunt": "strums an unplugged guitar while asking the audience to provide a very unnecessary encore"},
 {"style": "Slippery escape artist", "move": "Low-Tide Splash", "counter": "flounder-flip cradle", "tell": "slips out of a grip and flops triumphantly toward open canvas", "bit": "asks the referee whether a rope break counts as international waters", "voice": "The undersea underdog", "boast": "You cannot pin what you cannot catch.", "heart": "I am a fish out of water every night. You still keep cheering me back onto my feet.", "stunt": "produces a tiny treasure map and insists the championship is buried under the ring"},
 {"style": "Sharp counter-striker", "move": "Zest for Destruction", "counter": "sour-note roundhouse", "tell": "smiles sweetly, then snaps into a sharp counter stance", "bit": "offers a perfectly innocent imaginary taste test before making a very sour face", "voice": "Sugar on the threat", "boast": "Sweet entrance. Bitter ending. You will acquire the taste.", "heart": "They put me on the novelty menu. I am here to become the main course.", "stunt": "holds a ceremonial tasting and asks the crowd to rate the championship for acidity"},
 {"style": "Joyful comeback specialist", "move": "Third-Day Comeback", "counter": "water-into-whine wristlock", "tell": "raises both arms and asks the entire hall to join the comeback", "bit": "turns a pause in the action into an extremely enthusiastic group toast", "voice": "The invitation is open", "boast": "The party is for everybody. The victory is mine.", "heart": "If you came here feeling left out, there is a place at this table for you.", "stunt": "turns the entrance aisle into a conga line and appoints the referee temporary host of the afterparty"},
 {"style": "Rhythmic showboat", "move": "Beat Drop Elbow", "counter": "bassline backslide", "tell": "counts an invisible four-beat rhythm before springing into the next exchange", "bit": "asks the referee to wait until the beat drops before making a count", "voice": "The community-hall headliner", "boast": "You are the warm-up. I am the drop they came to hear.", "heart": "A great night happens when everybody in the room feels the same beat. Let me find ours.", "stunt": "builds a drop on a cardboard DJ controller and lets the front row supply every sound effect"},
 {"style": "Self-conscious technician", "move": "Five-Star Superplex", "counter": "workrate wristlock", "tell": "pauses to explain why this sequence would have worked better in a smaller venue", "bit": "holds up a homemade rating card for a headlock he has not finished yet", "voice": "The unsolicited review", "boast": "I was good before you were allowed to think I was good.", "heart": "I learned every hold because wrestling mattered to me. I want it to matter to you, too.", "stunt": "reveals a star-rating chart, gives his own entrance six stars, and asks the crowd to justify any disagreement"},
 {"style": "Accidental scrapper", "move": "Scenic Route Slam", "counter": "wrong-turn inside cradle", "tell": "looks around in wonder as though discovering this ring for the very first time", "bit": "stops for a ringside postcard photo of a landmark everyone else calls the fire exit", "voice": "Wish you were here, next door", "boast": "I have seen the sights. You are about to become one.", "heart": "You can spend a lifetime here and still find somewhere new to belong.", "stunt": "unfolds a map of the neighborhood and draws a sightseeing route from his house to the championship"},
 {"style": "Elegant catch-wrestler", "move": "Best in Show Suplex", "counter": "heel-to-hand wristlock", "tell": "adjusts an immaculate bow tie and beckons the opponent as if calling a prize retriever", "bit": "tosses a tennis ball, looks offended when nobody fetches it, and retrieves it himself", "voice": "Best in the building", "boast": "Sit. Stay. Watch a proper champion work.", "heart": "You can polish every detail and still need somebody to believe you belong in the final.", "stunt": "judges an imaginary ringside dog show and awards himself a championship-sized rosette"},
 {"style": "Anchored powerhouse", "move": "Full Berth Body Slam", "counter": "anchor-drop sidewalk slam", "tell": "plants both feet and announces that this berth is now occupied", "bit": "rings a tiny ship bell to warn the opponent about an approaching shoulder tackle", "voice": "Home is where the ring is", "boast": "You can rock the boat. You cannot move the house.", "heart": "Some people need a mansion. I just need a place to tie up and a crowd worth coming home to.", "stunt": "unrolls a welcome mat onto the entrance ramp and invites the hall aboard his imaginary floating home"},
 {"style": "Burst-of-energy scrapper", "move": "Ninety-Second Knockout", "counter": "stuffed-crust headscissors", "tell": "checks a pocket for emergency fuel, then launches into a sudden burst of offense", "bit": "offers to share an invisible pizza pocket while the opponent is trying to look intimidating", "voice": "The snack-break promise", "boast": "Careful. The filling is hotter than your entire comeback.", "heart": "I have worked through enough breaks. Tonight we all get a little something to cheer for.", "stunt": "opens a ridiculously overstocked snack pocket and appoints the front row official taste testers"},
 {"style": "Deliberate defensive grappler", "move": "Middle-Ground Matlock", "counter": "balanced-position hip toss", "tell": "considers both sides of the next exchange until the opponent gets impatient", "bit": "asks the referee to note that this headlock is not an endorsement of either corner", "voice": "The carefully neutral statement", "boast": "I respect both outcomes. I have simply arranged for mine.", "heart": "You do not have to agree on everything to find something worth showing up for together.", "stunt": "sets up two identical podiums and spends his entire introduction refusing to choose between them"},
 {"style": "Footwork-first striker", "move": "Studs-Up Stomp", "counter": "laces-out ankle pick", "tell": "taps out a rapid warm-up pattern and looks ready to sprint", "bit": "demands a timeout to tie a lace that immediately comes undone again", "voice": "The boots do the talking", "boast": "I was made for the big game. You were made to watch it.", "heart": "Nobody looks down at the boots until they carry somebody somewhere impossible.", "stunt": "performs an entire motivational speech using squeaks, lace gestures, and a surprisingly expressive heel turn"},
 {"style": "Wobbling impact wrestler", "move": "Custard Catastrophe", "counter": "spotted-dick sidewalk slam", "tell": "wobbles alarmingly, steadies, and somehow turns the sway into forward momentum", "bit": "asks the crowd for complete silence while trying to stop jiggling", "voice": "Proof of the pudding", "boast": "You have had your main course. Here comes the finish.", "heart": "I have never been the most graceful thing in the ring. You have made me feel like I belong anyway.", "stunt": "presents a tiny silver spoon as a ceremonial title challenger and appoints the crowd the dessert committee"}
];
ringPersonalities.push(...[
 {
  "style": "Hard-drinking comeback brawler",
  "move": "Comeback Credit",
  "counter": "last-round wristlock",
  "tell": "raises an imaginary glass and smiles much too eagerly at the prospect of another exchange",
  "bit": "asks whether the next fight comes with top billing",
  "voice": "The comeback pitch",
  "boast": "I lost the lead in Demeter’s Baby. I do not intend to lose this fight as well.",
  "heart": "They stopped calling about films; hearing my name before a fight will do nicely.",
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
 if(segment.kind==='match'){
  const skill=people.reduce((n,r)=>n+r.skill,0)/people.length,green=people.find(r=>r.skill<50);
  if(skill>=80)add(1,'Pros at work');else if(green)add(-1,`${green.name} is still learning the ropes`);
 }else if(lead.charisma>=88)add(1,`${lead.name} has the room in the palm of their hand`);
 if(segment.kind==='promo'&&lead.id===6&&segment.target!=null&&doubtsDoctorate(segment.target))add(-1,`${lead.name} stalls. He will not address anyone who doubts the doctorate`);
 if(segment.kind==='match'&&CALL_HABITS[lead.id]?.note)notes.push({tone:'up',text:CALL_HABITS[lead.id].note});
 if(lead.trust>=80)add(1,`${lead.name} goes the extra mile for you`);
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
 const moments=state.card.map((s,i)=>s.kind==='promo'?promoMoment(s,i):matchMoment(s,i));
 state.liveShow={week:state.week,index:0,moments,answers:moments.map((m,i)=>autoCall(m,state.card[i],i))};
 render();window.scrollTo(0,0);focusLiveHeading();
}
function focusLiveHeading(){const el=$('#next-moment')||$('#live-heading');if(el)el.focus({preventScroll:true})}
function nextMoment(){
 const live=state.liveShow;if(!live)return;ensureLiveCalls();
 if(live.index<live.moments.length-1){live.index++;save();render();focusLiveHeading();const card=$('.report-card.is-new');if(card)card.scrollIntoView({block:'start',behavior:'auto'});return}
 finishLiveShow();
}
function finishLiveShow(){const live=state.liveShow;if(!live)return;ensureLiveCalls();const answers=live.answers,report=typeof captureShowReport==='function'?captureShowReport():[];state.liveShow=null;const recap=simulate(answers);if(recap){recap.report=report;if(typeof buildBackstage==='function')recap.backstage=recordWalk(buildBackstage(recap),recap.week)}render();window.scrollTo(0,0)}
function liveShowPage(){return showReportPage()}
function bindLiveShow(){
 if($('#next-moment'))$('#next-moment').onclick=nextMoment;
 if($('#skip-show'))$('#skip-show').onclick=finishLiveShow;
}

function recapDecision(r){
 if(!r.decision)return '';
 const d=r.decision,applied=r.rating-r.baseRating;
 return `<details class="recap-decision"><summary>Booker’s report · ${signed(applied)} quality</summary><div class="row"><small>${esc(d.tag)}</small><strong class="quality-badge ${applied<0?'negative':applied===0?'neutral':''}">${signed(applied)} QUALITY</strong></div><h4>${esc(d.title)}</h4><p class="recap-reason">${esc(d.reason)}</p>${r.analysis?`<p>${esc(r.analysis)}</p>`:''}<span class="rating-math">${r.baseRating} BASE ${applied>=0?'+':'−'} ${Math.abs(applied)} MOMENT = ${r.rating} SEGMENT${applied!==d.delta?' · limited by the 0–100 rating range':''}</span></details>`;
}
