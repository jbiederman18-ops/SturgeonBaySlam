'use strict';
const KEY='cheap-pop-v2';
// Monthly shows follow a 48-week circuit. Venues and wrestling events are fictional.
const WISCONSIN_TOUR=[
 {id:'sister-bay',town:'Sister Bay',title:'Shoreline Showdown',venue:'North Shore Community Hall',detail:'Perch plates at concessions. The ring crew gets the last tray.',color:'#e7bd50'},
 {id:'fish-creek',town:'Fish Creek',title:'Fish Boil Brawl',venue:'Gibraltar Social Hall',detail:'The fish boil is out back. Please keep the entrance cable away from the kettle.',color:'#eb9862'},
 {id:'egg-harbor',town:'Egg Harbor',title:'Scramble',venue:'Harbor View Hall',detail:'The cherry-pie raffle is at intermission. Wrestlers must buy their own tickets.',color:'#e6ab9f'},
 {id:'baileys-harbor',town:'Baileys Harbor',title:'Breakwater Bash',venue:'Lakeside Recreation Hall',detail:'Lighthouse pennants over the ring. Sandbags under the entrance curtain.',color:'#96c2ce'},
 {id:'algoma',town:'Algoma',title:'Pier Six',venue:'Ahnapee Community Hall',detail:'The fishing-club table has already asked whether this is a no-disqualification show.',color:'#e7bd50'},
 {id:'kewaunee',town:'Kewaunee',title:'County Line Clash',venue:'Rivermouth Hall',detail:'The ring arrived on a borrowed flatbed. It needs to be back by morning.',color:'#d6b784'},
 {id:'new-glarus',town:'New Glarus',title:'Swiss Slam',venue:'Chalet Community Hall',detail:'Cowbells in the front row. The referee has asked for exactly one bell at the finish.',color:'#eb968d'},
 {id:'mineral-point',town:'Mineral Point',title:'Hard Rock',venue:'Cornish Social Hall',detail:'Pasties at the concession stand. No food on the commentary table after last time.',color:'#c9b79b'},
 {id:'spring-green',town:'Spring Green',title:'River Rumble',venue:'River Valley Assembly Hall',detail:'The entrance set is borrowed from a theater group. Nothing gets stapled to it.',color:'#abd09e'},
 {id:'viroqua',town:'Viroqua',title:'Fairgrounds Fight Night',venue:'Driftless Exhibition Hall',detail:'The livestock gates are locked. Bev checked them twice.',color:'#d9bb84'},
 {id:'manitowish-waters',town:'Manitowish Waters',title:'Last Call',venue:'Northwoods Recreation Hall',detail:'Plaid bunting, a borrowed scoreboard, and a ring crew trying to beat the supper-club rush.',color:'#a8c3ae'},
 {id:'bayfield',town:'Bayfield',title:'Breakup on the Bay',venue:'Orchard Community Hall',detail:'Apple-cider jugs at concessions. The ferry crowd has booked an entire row.',color:'#a9c6dc'}
];
function monthlyEvent(week=state.week){
 const month=Math.floor((week-1)/4);
 return {...WISCONSIN_TOUR[month%WISCONSIN_TOUR.length],week:(month+1)*4,circuit:Math.floor(month/WISCONSIN_TOUR.length)+1};
}
function monthlyEventName(week=state.week){const event=monthlyEvent(week);return `${event.town} ${event.title}`}
function showLocation(week=state.week){const location=week%4===0?monthlyEvent(week):{town:'Sturgeon Bay',venue:'St. Elbow’s Community Hall'};return (state.progression?.stage||0)>0?{...location,venue:week%4===0?location.town+' · '+careerStage().venue:careerStage().venue}:location}
function tourSchedule(){
 const next=monthlyEvent().week;
 return `<details class="card tour-schedule"><summary>Wisconsin tour schedule</summary><ol>${Array.from({length:12},(_,i)=>monthlyEvent(next+i*4)).map(event=>`<li><small>WEEK ${event.week}</small><div><strong>${esc(monthlyEventName(event.week))}</strong><span>${esc(event.venue)} · ${esc(event.town)}, WI</span></div></li>`).join('')}</ol><p class="note">Monthly shows run every fourth week. Weekly cards stay in Sturgeon Bay.</p></details>`;
}
const initialRoster=[
  {
    "id": 0,
    "name": "Greek Polanski",
    "gimmick": "Ancient Greek, as far as he knows",
    "role": "Face",
    "pop": 72,
    "skill": 81,
    "charisma": 78,
    "morale": 78,
    "color": "#a95c42",
    "mask": false,
    "champ": true,
    "desc": "A filmmaker who, after a kick to the head, believes Wisconsin is ancient Greece. Pursues the foremost mastery of Greco Wrestling and records every discovery."
  },
  {
    "id": 1,
    "name": "The Man of 2 Holds",
    "gimmick": "Two holds. Infinite confidence.",
    "role": "Heel",
    "pop": 46,
    "skill": 89,
    "charisma": 60,
    "morale": 79,
    "color": "#536752",
    "mask": true,
    "champ": false,
    "desc": "Knows exactly two holds and uses both at every opportunity. Intends to master them. Has never conceded that a third hold exists, even while caught in one."
  },
  {
    "id": 2,
    "name": "Rudy, from Football",
    "gimmick": "Perennial sporting underdog",
    "role": "Face",
    "pop": 43,
    "skill": 62,
    "charisma": 83,
    "morale": 80,
    "color": "#b58b43",
    "mask": false,
    "champ": false,
    "desc": "Just wants to get in the match. The locker room has started chanting his name out of habit."
  },
  {
    "id": 3,
    "name": "One Man",
    "gimmick": "A whole stable in one corner",
    "role": "Face",
    "pop": 32,
    "skill": 76,
    "charisma": 64,
    "morale": 81,
    "color": "#5b8b8c",
    "mask": true,
    "champ": false,
    "desc": "Talks strategy with himself and credits the boys after every win. Wants the tag titles, alone. Refuses to take a partner."
  },
  {
    "id": 4,
    "name": "Terrible Towel",
    "gimmick": "Dry as a towel fresh off the rack",
    "role": "Heel",
    "pop": 38,
    "skill": 55,
    "charisma": 85,
    "morale": 82,
    "color": "#be9b39",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in yellow terrycloth gear. Delivers every line deadpan, remembers every slight, and wants to be the first name the booker reaches for at main event time."
  },
  {
    "id": 5,
    "name": "Rudy Giuliani",
    "gimmick": "A technicality with a briefcase",
    "role": "Heel",
    "pop": 51,
    "skill": 48,
    "charisma": 84,
    "morale": 83,
    "color": "#7f6776",
    "mask": false,
    "champ": false,
    "desc": "This ring lawyer loves a shortcut and calls it good sportsmanship. If someone cheats to beat him, he demands a hearing. A clean loss is still a clerical error."
  },
  {
    "id": 6,
    "name": "Pissboy, P.H.D",
    "gimmick": "Doctor. Please use the title.",
    "role": "Heel",
    "pop": 37,
    "skill": 74,
    "charisma": 82,
    "morale": 84,
    "color": "#8c9455",
    "mask": true,
    "champ": false,
    "desc": "Insists on being addressed as Doctor and avoids giving a doubter the microphone. Drops the full credential into a headlock whenever the announcer forgets it."
  },
  {
    "id": 7,
    "name": "Mike “The Miz” Mizanin",
    "gimmick": "Prime-time spotlight seeker",
    "role": "Heel",
    "pop": 69,
    "skill": 80,
    "charisma": 90,
    "morale": 78,
    "color": "#95714e",
    "mask": false,
    "champ": false,
    "desc": "Every entrance is a season premiere. Every opponent is apparently a supporting character."
  },
  {
    "id": 8,
    "name": "Frost “Cold” Freeze",
    "gimmick": "Freeze-ray enthusiast",
    "role": "Face",
    "pop": 58,
    "skill": 83,
    "charisma": 76,
    "morale": 79,
    "color": "#668f9f",
    "mask": true,
    "champ": false,
    "desc": "A silver-haired human striker in ice-blue gear. Carries a freeze ray everywhere and takes every puddle as proof that it is working."
  },
  {
    "id": 9,
    "name": "Mandy Mouse",
    "gimmick": "Mouse-eared pocket powerhouse",
    "role": "Face",
    "pop": 49,
    "skill": 78,
    "charisma": 84,
    "morale": 80,
    "color": "#ab697d",
    "mask": false,
    "champ": false,
    "desc": "A human powerhouse with a mouse-ear headband, painted whiskers and enormous suplexes. Takes being called adorable as a personal challenge."
  },
  {
    "id": 10,
    "name": "Sweeps McKenzie",
    "gimmick": "Blue-collar broom enthusiast",
    "role": "Face",
    "pop": 31,
    "skill": 57,
    "charisma": 81,
    "morale": 88,
    "color": "#5b8b78",
    "mask": false,
    "champ": false,
    "desc": "Sweeps the hall before bell time and after it. Cannot walk past a mess without cleaning it, and gets angrier with every one he finds."
  },
  {
    "id": 11,
    "name": "Turtle, From Entourage",
    "gimmick": "Backstage VIP by association",
    "role": "Heel",
    "pop": 40,
    "skill": 54,
    "charisma": 79,
    "morale": 82,
    "color": "#7f8864",
    "mask": false,
    "champ": false,
    "desc": "Claims to know someone who knows the champion. Keeps asking where the VIP entrance is."
  },
  {
    "id": 12,
    "name": "“Street Smart” John Smith",
    "gimmick": "Street safety, unsolicited",
    "role": "Heel",
    "pop": 61,
    "skill": 77,
    "charisma": 83,
    "morale": 83,
    "color": "#575f83",
    "mask": false,
    "champ": false,
    "desc": "Corrects everyone about everything from crosswalks to rope breaks. Swears the clipboard is for public education. Nobody has asked to see a badge."
  },
  {
    "id": 13,
    "name": "Katy “Space Taking” Perry",
    "gimmick": "Grounded astronaut seeking a return flight",
    "role": "Face",
    "pop": 57,
    "skill": 64,
    "charisma": 92,
    "morale": 84,
    "color": "#9470a0",
    "mask": false,
    "champ": false,
    "desc": "Treats the hall as ground control and the turnbuckle as the closest available orbit. Has been trying to get back to space since the moment she landed."
  },
  {
    "id": 14,
    "name": "Cuba Gooding III",
    "gimmick": "Proud son, persistent name-dropper",
    "role": "Face",
    "pop": 48,
    "skill": 73,
    "charisma": 87,
    "morale": 78,
    "color": "#a96b49",
    "mask": false,
    "champ": false,
    "desc": "Wants to make Dad proud and asks every new acquaintance whether they know who was in Jerry Maguire. The conversation rarely gets past that."
  },
  {
    "id": 15,
    "name": "Carl “Parallel” Parker",
    "gimmick": "Always taking the parallel route",
    "role": "Heel",
    "pop": 39,
    "skill": 84,
    "charisma": 65,
    "morale": 81,
    "color": "#5c8291",
    "mask": false,
    "champ": false,
    "desc": "Walks and wrestles alongside his opponent without crossing their path. Hopes to meet someone head-on one day. Has yet to work out the approach."
  },
  {
    "id": 16,
    "name": "Maddox Hatter",
    "gimmick": "Unhinged tea-party ringmaster",
    "role": "Heel",
    "pop": 44,
    "skill": 73,
    "charisma": 88,
    "morale": 82,
    "color": "#956f85",
    "mask": false,
    "champ": false,
    "desc": "Keeps a reserved seat for a teapot. Calls every time-limit draw an unbirthday."
  },
  {
    "id": 17,
    "name": "Term Life Insurance Plan",
    "gimmick": "Insurance salesman of doom",
    "role": "Heel",
    "pop": 32,
    "skill": 64,
    "charisma": 80,
    "morale": 83,
    "color": "#8c9273",
    "mask": false,
    "champ": false,
    "desc": "A bespectacled human grappler with a briefcase full of policies. Every loss is an exclusion. Every headlock requires a signature."
  },
  {
    "id": 18,
    "name": "“Nasty Fucker” Charming Friendly",
    "gimmick": "Immaculate manners, awful intentions",
    "role": "Heel",
    "pop": 52,
    "skill": 77,
    "charisma": 86,
    "morale": 84,
    "color": "#9c665c",
    "mask": false,
    "champ": false,
    "desc": "Says please before every cheap shot and thank you after. Every courtesy arrives wrapped around the most vile thought in the building, then gets passed off as perfectly normal."
  },
  {
    "id": 19,
    "name": "Jaxxon “Twitter Fingers” Xander",
    "gimmick": "Terminally online provocateur",
    "role": "Heel",
    "pop": 40,
    "skill": 61,
    "charisma": 87,
    "morale": 85,
    "color": "#6777ab",
    "mask": false,
    "champ": false,
    "desc": "Posts through every loss. Has tried to ratio the referee in real time."
  },
  {
    "id": 20,
    "name": "The Grinch Who Stole My Heart",
    "gimmick": "Reformed holiday menace, heart three sizes too big",
    "role": "Face",
    "pop": 47,
    "skill": 68,
    "charisma": 90,
    "morale": 76,
    "color": "#719152",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in every turnbuckle and hugs opponents into the mat. Has never once noticed someone not loving him back."
  },
  {
    "id": 21,
    "name": "Chad Kroeger",
    "gimmick": "Arena-rock wrestling frontman",
    "role": "Heel",
    "pop": 62,
    "skill": 67,
    "charisma": 88,
    "morale": 77,
    "color": "#a17c55",
    "mask": false,
    "champ": false,
    "desc": "Demands a wind machine for his entrance. Every near fall gets a full guitar-solo facial expression."
  },
  {
    "id": 22,
    "name": "Freddie Flounder",
    "gimmick": "One-way flounder",
    "role": "Face",
    "pop": 28,
    "skill": 70,
    "charisma": 79,
    "morale": 78,
    "color": "#668f94",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in teal gear. Stays flat, faces one way, and hopes somebody notices before the inevitable flop. Will wait out the entire match before turning around."
  },
  {
    "id": 23,
    "name": "Lemon Tart",
    "gimmick": "Sweet looks. Sour intentions.",
    "role": "Heel",
    "pop": 35,
    "skill": 72,
    "charisma": 83,
    "morale": 79,
    "color": "#c0a24a",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in lemon-yellow ring gear with a citrus brooch. A sweet smile, sharp counters and an extremely sour attitude."
  },
  {
    "id": 24,
    "name": "“Party Animal” Jesus H. Christ",
    "gimmick": "Patron saint of the afterparty",
    "role": "Face",
    "pop": 58,
    "skill": 74,
    "charisma": 94,
    "morale": 80,
    "color": "#ad9360",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in a ring robe and halo headband. Wants everyone to find the Lord and stays to talk with whoever needs him. The punch bowl is usually where the conversation starts."
  },
  {
    "id": 25,
    "name": "“Funky Tunes and Attitude” David Guetta",
    "gimmick": "Dance-floor ring conductor",
    "role": "Face",
    "pop": 60,
    "skill": 65,
    "charisma": 91,
    "morale": 81,
    "color": "#817797",
    "mask": false,
    "champ": false,
    "desc": "Times every strike to an imaginary drop. Once requested a remix of the three-count."
  },
  {
    "id": 26,
    "name": "Smark Wahlberg",
    "gimmick": "Old-school workrate purist",
    "role": "Heel",
    "pop": 43,
    "skill": 81,
    "charisma": 78,
    "morale": 82,
    "color": "#6e7d83",
    "mask": false,
    "champ": false,
    "desc": "A Boston wrestling traditionalist who wants shine, heat, comeback, and finish in that order. Can explain all four before the bell, usually at considerable volume."
  },
  {
    "id": 27,
    "name": "The Local Tourist",
    "gimmick": "Sightseer in his own hometown",
    "role": "Face",
    "pop": 26,
    "skill": 59,
    "charisma": 82,
    "morale": 83,
    "color": "#a48764",
    "mask": false,
    "champ": false,
    "desc": "Has lived three streets away for twenty years. Still asks the champion for directions to the main event."
  },
  {
    "id": 28,
    "name": "“Fetching” Ted Turnsby",
    "gimmick": "Self-appointed most fetching man alive",
    "role": "Heel",
    "pop": 41,
    "skill": 76,
    "charisma": 84,
    "morale": 84,
    "color": "#82966d",
    "mask": false,
    "champ": false,
    "desc": "An ordinary-looking man who treats every room as a beauty contest and himself as the uncontested winner. Asks the mirror for a recount when the crowd goes quiet."
  },
  {
    "id": 29,
    "name": "The Human Houseboat",
    "gimmick": "Looking for a permanent berth",
    "role": "Face",
    "pop": 45,
    "skill": 79,
    "charisma": 74,
    "morale": 85,
    "color": "#60858e",
    "mask": false,
    "champ": false,
    "desc": "A human powerhouse in a captain’s hat and porthole singlet. Moves at docking speed, keeps a spot on deck for little guests, and would like a permanent place on the card."
  },
  {
    "id": 30,
    "name": "Holly “Pizza Pocket” Posey",
    "gimmick": "A whole meal in one pocket",
    "role": "Face",
    "pop": 37,
    "skill": 75,
    "charisma": 86,
    "morale": 76,
    "color": "#b66f63",
    "mask": false,
    "champ": false,
    "desc": "Warm on the outside, molten on the inside, and determined to feed the entire locker room. Will happily split a serving while objecting to the word snack."
  },
  {
    "id": 31,
    "name": "“Politically Neutral” Ron Toledo",
    "gimmick": "Aggressively impartial ring bureaucrat",
    "role": "Heel",
    "pop": 30,
    "skill": 71,
    "charisma": 72,
    "morale": 77,
    "color": "#888a7d",
    "mask": false,
    "champ": false,
    "desc": "Has no opinion on the championship, and a very strong opinion that nobody else should either. Gets angrier the longer any disagreement goes on. Would like to hold the title in a nonpartisan capacity."
  },
  {
    "id": 32,
    "name": "Cleats",
    "gimmick": "Two halves, one set of laces",
    "role": "Face",
    "pop": 24,
    "skill": 68,
    "charisma": 76,
    "morale": 78,
    "color": "#8a9565",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in paired football-boot gear. Calls himself a pair, lists both halves on the card, and never lets one get farther than a lace ahead. Always looking for Rudy."
  },
  {
    "id": 33,
    "name": "Terry Pudding",
    "gimmick": "Custard-loving demolition expert",
    "role": "Face",
    "pop": 33,
    "skill": 66,
    "charisma": 89,
    "morale": 79,
    "color": "#b1976d",
    "mask": false,
    "champ": false,
    "desc": "A cheerful human heavyweight in a custard-yellow singlet, carrying a dessert spoon. Never looks balanced. Almost never lands where you expect."
  },
  {
    "id": 34,
    "name": "Liam Neesen",
    "gimmick": "Fallen action star, spoiling for a fight",
    "role": "Face",
    "pop": 57,
    "skill": 73,
    "charisma": 84,
    "morale": 79,
    "color": "#7c807e",
    "mask": false,
    "champ": false,
    "desc": "A fallen movie star who lost his SAG status after kicking the director of Demeter’s Baby over a rejected lead role. Chases a comeback with a drink close by and far too much enthusiasm for fighting."
  },
  {
    "id": 35,
    "name": "The Tooth",
    "gimmick": "Molar powerhouse",
    "role": "Face",
    "pop": 35,
    "skill": 68,
    "charisma": 80,
    "morale": 86,
    "color": "#d4c795",
    "mask": false,
    "champ": false,
    "desc": "A human powerhouse in a foam molar torso costume, white tights and mint wrist tape. Deeply committed to clean breaks, strong roots and making the championship scene bite down."
  },
  {
    "id": 36,
    "name": "“Allowed Elsewhere, Choosing to Be Here” Tessa Blanchard",
    "gimmick": "Aggressively voluntary headliner",
    "role": "Heel",
    "pop": 62,
    "skill": 86,
    "charisma": 79,
    "morale": 77,
    "color": "#86619c",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler carrying a stack of prop invitations to other wrestling halls. Insists every appearance here is a deliberate personal choice, including appearances nobody asked about."
  },
  {
    "id": 37,
    "name": "A Dog That The Rules Don't Say Is Banned",
    "gimmick": "One dog. Zero prohibitions.",
    "role": "Face",
    "pop": 48,
    "skill": 54,
    "charisma": 95,
    "morale": 94,
    "color": "#b58b50",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in a floppy-eared hood, brown ring gear and a painted nose. Insists he is a dog, and challenges anyone to find the rule saying dogs cannot wrestle. Enthusiastic about the bell, the ropes and everybody in the front row."
  }
];
initialRoster.forEach(wrestler=>{wrestler.performerType="human"});
const defaultCard=()=>Array.from({length:typeof cardSize==='function'?cardSize():4},()=>({kind:null}));
function fresh(){return storyDefaults({gameVersion:4,started:false,week:1,cash:4250,rep:24,roster:structuredClone(initialRoster),card:defaultCard(),crowd:{chaos:44,purists:52,drama:38},teams:[],history:[],request:null,view:'book',recap:null,liveShow:null,rivalries:{}})}
const humanRosterCanon={"4":{"oldGimmick":"A sinister rally towel","gimmick":"Terrifying terrycloth showman","desc":"A human brawler in yellow terrycloth ring gear. Waves a rally towel like a weapon, then complains when the crowd waves back.","mask":false},"8":{"oldGimmick":"Glacial trash-talker","gimmick":"Glacial trash-talker","desc":"A silver-haired human striker in ice-blue ring gear. Every catchphrase arrives with an unnecessary weather forecast.","mask":true},"9":{"oldGimmick":"Pocket-sized powerhouse","gimmick":"Mouse-eared pocket powerhouse","desc":"A human powerhouse with a mouse-ear headband, painted whiskers and enormous suplexes. Takes being called adorable as a personal challenge.","mask":false},"17":{"oldGimmick":"Sentient insurance contract","gimmick":"Insurance salesman of doom","desc":"A bespectacled human grappler with a briefcase full of policies. Every loss is an exclusion. Every headlock requires a signature.","mask":false},"20":{"oldGimmick":"Holiday menace turned hopeless romantic","gimmick":"Reformed holiday menace, heart three sizes too big","desc":"A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in every turnbuckle and hugs opponents into the mat. Has never once noticed someone not loving him back.","mask":false},"22":{"oldGimmick":"Fish out of water, fighter in the ring","gimmick":"Flounder-themed escape artist","desc":"A human wrestler in teal gear with fin-shaped shoulder pads. Flops magnificently, counters unexpectedly, and treats every rope break as returning to shore.","mask":false},"23":{"oldGimmick":"Sweet presentation, vicious citrus","gimmick":"Sweet looks. Sour intentions.","desc":"A human wrestler in lemon-yellow ring gear with a citrus brooch. A sweet smile, sharp counters and an extremely sour attitude.","mask":false},"24":{"oldGimmick":"Patron saint of the afterparty","gimmick":"Patron saint of the afterparty","desc":"A human ring-robed party host with a halo headband. Wants every comeback to feel like the whole room just got invited.","mask":false},"29":{"oldGimmick":"Floating residential powerhouse","gimmick":"Waterfront wrecking crew","desc":"A large human powerhouse in a captain’s hat and porthole-patterned singlet. Insists every home match is a waterfront property.","mask":false},"32":{"oldGimmick":"A pair of boots with title ambitions","gimmick":"Boot-obsessed football enforcer","desc":"A human striker who carries his prized football cleats over one shoulder. Superb footwork. Treats those boots like the real stars of the show.","mask":false},"33":{"oldGimmick":"Wobbly dessert demolition expert","gimmick":"Custard-loving demolition expert","desc":"A cheerful human heavyweight in a custard-yellow singlet, carrying a dessert spoon. Never looks balanced. Almost never lands where you expect.","mask":false}};
for(const id of [35,37])humanRosterCanon[id]={oldGimmick:id===37?'Four paws. Zero prohibitions.':initialRoster[id].gimmick,gimmick:initialRoster[id].gimmick,desc:initialRoster[id].desc,mask:false};

// Factory bios replaced by the spine rewrites. A saved bio that still matches one of these
// is factory text, so it moves to the current one; anything a player wrote stays.
const RETIRED_BIOS={
 0:{gimmick:['Mythological matinee idol'],desc:['A self-appointed Greek wrestling epic. Demands dramatic lighting for every headlock.']},
 1:{"desc":["Knows exactly two holds and intends to master both. Keeps Hold Two locked in a briefcase until the big event. Has never conceded that a third hold exists, even while caught in one.","Knows exactly two holds. Refuses to reveal the second until the big event."]},
 10:{desc:['Sweeps the hall before bell time. Plans to sweep the championship scene after it.']},
 18:{desc:['Says please before every cheap shot. Sends handwritten thank-you notes after stealing a win.']},
 20:{gimmick:['Holiday menace turned hopeless romantic'],desc:['A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in the turnbuckles.']},
 31:{desc:['Has no opinion on the championship. Would nevertheless very much like to hold it in a nonpartisan capacity.']},
 34:{gimmick:['Gravely serious action veteran'],desc:['A human wrestler playing an intensely focused veteran with an old flip phone and a very specific set of wristlocks. Treats a community-hall booking like an international extraction.']},
 3:{"gimmick":["Aggressively singular"],"desc":["One man. One entrance. One very firm objection to tag-team wrestling."]},
 4:{"gimmick":["Terrifying terrycloth showman"],"desc":["A human brawler in yellow terrycloth ring gear. Waves a rally towel like a weapon, then complains when the crowd waves back."]},
 5:{"gimmick":["Courtroom-style wrestling showman"],"desc":["Arrives with a briefcase of fictional wrestling bylaws. Every pinfall is subject to appeal."]},
 6:{"gimmick":["Doctor of questionable ring science"],"desc":["Defended a thesis on suplex velocity. Insists the announcer say the full qualification."]},
 8:{"gimmick":["Glacial trash-talker"],"desc":["A silver-haired human striker in ice-blue ring gear. Every catchphrase arrives with an unnecessary weather forecast."]},
 12:{"gimmick":["Suspiciously ordinary mastermind"],"desc":["Has a plan for everything and the least memorable alias in wrestling history."]},
 13:{"gimmick":["Astronomical entrance specialist"],"desc":["Needs an entire launchpad for her entrance. Her booking requests include more personal space."]},
 14:{"gimmick":["Third-generation main-event energy"],"desc":["Calls himself the third act. Turns every near fall into an awards-season monologue."]},
 15:{"gimmick":["Geometric perfectionist"],"desc":["Insists his shoulders are always parallel to the mat. Has not considered the implications."]},
 22:{"gimmick":["Flounder-themed escape artist"],"desc":["A human wrestler in teal gear with fin-shaped shoulder pads. Flops magnificently, counters unexpectedly, and treats every rope break as returning to shore."]},
 24:{"desc":["A human ring-robed party host with a halo headband. Wants every comeback to feel like the whole room just got invited."]},
 26:{"gimmick":["Walking wrestling-comment-section expert"],"desc":["Rates his own matches before the bell. Complains that his opponent is being pushed too soon."]},
 28:{"gimmick":["Dashing dog-show perfectionist"],"desc":["Immaculately groomed. Treats the opposition like disobedient competition at a very exclusive dog show."]},
 29:{"gimmick":["Waterfront wrecking crew"],"desc":["A large human powerhouse in a captain’s hat and porthole-patterned singlet. Insists every home match is a waterfront property."]},
 30:{"gimmick":["Snack-powered comeback queen"],"desc":["Keeps emergency snacks in an alarming number of pockets. Claims a comeback takes exactly ninety seconds to heat."]},
 32:{"gimmick":["Boot-obsessed football enforcer"],"desc":["A human striker who carries his prized football cleats over one shoulder. Superb footwork. Treats those boots like the real stars of the show."]}
};
function retireFactoryBios(roster){
 for(const wrestler of roster){
  const old=RETIRED_BIOS[wrestler.id],now=initialRoster[wrestler.id];if(!old||!now)continue;
  for(const key of ['gimmick','desc'])if(old[key]?.includes(wrestler[key]))wrestler[key]=now[key];
 }
}
function mergeRosterExpansion(saved){
 if(!saved||!Array.isArray(saved.roster)||saved.roster.length===0)return fresh();
 migrateGameBranding(saved);
 const present=new Set(saved.roster.map(r=>r.id));
 for(const wrestler of initialRoster)if(!present.has(wrestler.id)){saved.roster.push(structuredClone(wrestler));present.add(wrestler.id)}
 // Migrate factory character descriptions, preserving player-written gimmicks and all progress.
 for(const wrestler of saved.roster){
  wrestler.performerType='human';
  const update=humanRosterCanon[wrestler.id];if(!update)continue;
  const oldGimmick=wrestler.gimmick,legacyConcept=oldGimmick===update.oldGimmick&&update.oldGimmick!==update.gimmick;
  if(oldGimmick===update.oldGimmick||wrestler.id===37&&oldGimmick==='Dog-themed gear. Zero prohibitions.')wrestler.gimmick=update.gimmick;
  if(!RETIRED_BIOS[wrestler.id]||legacyConcept)wrestler.desc=update.desc;
  wrestler.mask=update.mask;
 }
 retireFactoryBios(saved.roster);
 saved.started??=true;saved.gameVersion=4;
 if(!saved.liveShow)saved.card=saved.card.map(segment=>segment.draft&&segment.kind==='match'?{...segment,type:matchRuleName(segment)}:segment.draft?segment:normalizeMatch(segment,saved.roster,saved.teams));
 for(const draft of Object.values(saved.drafts||{}))if(draft?.kind==='match'&&draft.type)draft.type=matchRuleName(draft);
 storyDefaults(saved);
 return saved;
}
let lastSavedCareer=null;
let state;try{state=mergeRosterExpansion(JSON.parse(localStorage.getItem(KEY)))}catch{state=fresh()}
let view=state.view||'book',onTitle=true;
const $=s=>document.querySelector(s),w=id=>id==null?undefined:state.roster.find(r=>r.id===Number(id)),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>(n<0?'−$':'$')+Math.abs(n).toLocaleString('en-US'),clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
function save(){
 state.view=view;
 try{
  const serialized=JSON.stringify(state);
  if(serialized!==lastSavedCareer){localStorage.setItem(KEY,serialized);lastSavedCareer=serialized}
  careerStorageUnavailable=false;
 }catch{careerStorageUnavailable=true}
 const warning=document.getElementById('save-warning');if(warning)warning.hidden=!careerStorageUnavailable;
}
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',3500)}
function portrait(r){return wrestlerArt(r)}
function avatar(r){return `<div class="portrait">${portrait(r)}</div>`}
function champion(){return state.roster.find(r=>r.champ)}
function isEvent(){return state.week%4===0}
function showName(){return isEvent()?monthlyEventName():'Sturgeon Bay Slam'}
function heading(title,sub,action=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`}
function stats(){return `<div class="stats"><div class="stat"><div class="eyebrow muted">Bank balance</div><div class="value money">${money(state.cash)}</div><div class="detail">${state.history.length?'Last show: '+(state.history[0].profit>=0?'+':'−')+money(Math.abs(state.history[0].profit)):'Enough to keep the lights on'}</div></div><div class="stat"><div class="eyebrow muted">Reputation</div><div class="value">${state.rep}<span class="muted" style="font-size:17px"> / 100</span></div><div class="detail">${state.rep<40?'Local cult favorite':state.rep<70?'The talk of the town':'Independent sensation'}</div></div><div class="stat"><div class="eyebrow muted">Your roster</div><div class="value">${state.roster.length} <span class="muted" style="font-size:17px">wrestlers</span></div><div class="detail">${state.teams.length} teams · 1 championship</div></div><div class="stat"><div class="eyebrow muted">Next monthly show</div><div class="value">${isEvent()?'TONIGHT':(4-state.week%4)+' week'+(state.week%4===3?'':'s')}</div><div class="detail">${esc(monthlyEventName())}</div></div></div>`}
const promotionNav=[
 ['home','Road','M4 21l4-18h8l4 18M12 5v3m0 4v3m0 4v2'],
 ['book','Book','M3 7h18v14H3zM8 7V4h8v3M3 12h18M10 12v3h4v-3'],
 ['locker','Town','M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14'],
 ['roster','Roster','M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6-6a3 3 0 0 1 0 6M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2zm14-6a4 4 0 0 1 4 4v2h-3'],
 ['decisions','Decisions','M12 2l10 10-10 10L2 12zM8 12h8M12 8v8'],
 ['office','Shows','M3 6h18v15H3zM3 10h18M8 3v5M16 3v5M7 15h2m2 0h2m2 0h2']
];
function render(){
 if(onTitle){renderTitle();refreshWebAppUI();return}
 // The Lord's judgment (and the ledger's check-ins) run the moment a new week is on screen.
 if(state.started&&!state.liveShow&&!state.recap)snafuDefaults(state);
 document.body.classList.toggle('show-live',!!state.liveShow);document.body.dataset.era=eraAttr();save();
 const active=state.recap?'office':state.liveShow?'book':view==='creative'?'decisions':view;
 const pages={home:roadPage,book:bookPage,locker:lockerPage,roster:rosterPage,decisions:decisionsPage,creative:creativePage};
 const screen=state.liveShow?liveShowPage():state.recap?recapPage():(Object.hasOwn(pages,view)?pages[view]:officePage)();
 $('#app').innerHTML=`<aside class="sidebar"><div class="brand slam-brand">STURGEON<br><span>BAY SLAM</span></div><div class="brand-sub">KAYFABE PROMOTIONS PRESENTS</div><nav class="nav" aria-label="Main navigation">${promotionNav.map(([v,label,path])=>`<button data-nav="${v}" class="${active===v?'active':''}" ${active===v?'aria-current="page"':''}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="${path}"/></svg>${label}</button>`).join('')}</nav><div class="side-bottom"><small class="muted">Your promotion</small><strong>Wisconsin Wrestling Alliance</strong><span><i class="live-dot"></i>${esc(careerStage().name)}</span></div></aside><main class="main" data-screen="${state.recap?'recap':state.liveShow?'live':active}"><header class="topbar"><button class="title-return press-menu" data-title-menu aria-label="Return to title">☰</button><span class="press-top-brand">STURGEON <b>BAY SLAM</b></span><span class="season">SEASON ${Math.ceil(state.week/12)} / WEEK ${state.week}</span></header><div class="content">${screen}</div></main>`;
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{
  if(state.liveShow){toast('You’re on air. Finish the show to return to your office.');return}
  if(state.recap){toast('Continue to next week to return to your office.');return}
  view=b.dataset.nav;render();window.scrollTo(0,0);
  const title=document.querySelector('.content h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true})}
 });
 bindPage();refreshWebAppUI();
}
function pressHeading(title,subtitle=''){
 return `<header class="press-heading"><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</header>`;
}
function pressMeter(value, label){
 return `<meter class="press-meter" min="0" max="100" value="${clamp(value)}" aria-label="${label}">${clamp(value)}%</meter>`;
}
function pressHeat(value,label){
 const filled=Math.round(clamp(value)/20);
 const flames=Array.from({length:5},(_,index)=>`<svg viewBox="0 0 22 26" class="${index<filled?'lit':''}" aria-hidden="true"><path d="M11 1c2 6-2 8 2 11 1-2 2-3 2-6 4 5 7 9 6 13-1 5-5 7-10 7S2 24 1 19C0 14 4 9 6 7c-1 4 0 6 1 7C10 11 7 7 11 1Z"/><path d="M11 13c1 3-2 4-1 6 1 0 3-1 3-3 4 4 3 8-2 8-4 0-5-4 0-11Z"/></svg>`).join('');
 return `<span class="press-heat" role="img" aria-label="${label} ${value} out of 100">${flames}</span>`;
}
function homePage(){
 const event=monthlyEvent(),location=showLocation(),cost=showCost();
 const mood=Math.round((state.crowd.chaos+state.crowd.purists+state.crowd.drama)/3);
 return `<div class="press-home">
 <section class="press-masthead">
  <p>Wisconsin Wrestling Alliance presents</p>
  <h1>Sturgeon Bay <em>Slam</em></h1>
 </section>
 <div class="press-week">Week ${state.week}: ${isEvent()?'It’s show night!':`Road to <em>the ${esc(event.title)}!</em>`}</div>
 <section class="press-next"><div class="press-lead" aria-hidden="true">${portrait(champion())}</div>
 <div><small>Next show:</small><h2>${esc(showName())}</h2><p>Week ${state.week} · ${esc(location.town)}, WI</p></div></section>
 <button class="btn primary press-cta" data-nav="book">Book the card <span aria-hidden="true">→</span></button>
 <div class="press-vitals">
  <div class="press-icon-stat"><span aria-hidden="true">♟</span><small>Budget</small><strong>${money(state.cash)}</strong></div>
  <div class="press-icon-stat"><span aria-hidden="true">⚠</span><small>Show cost</small><strong>${cost>state.cash?'Over budget':money(cost)}</strong>${cost>state.cash?`<span>${money(cost)} estimated</span>`:''}</div>
  <div><small>Local buzz</small>${pressMeter(state.rep,'Promotion reputation')}</div>
  <div><small>Crowd mood</small>${pressHeat(mood,'Crowd satisfaction')}</div>
 </div></div>`;
}
function decisionsPage(){
 return `<div class="press-decisions">
 ${pressHeading('Decisions')}
 ${lordPanel()}
 ${weekAheadPanel()}
 ${promiseLedger()}
 <button class="btn primary" data-nav="creative">Creative &amp; tag teams →</button>
 </div>`;
}
// The public flyer: a cheap two-ink hand-bill like the ones on every bait-shop corkboard in Door County.
function flyerNames(ids){return ids.map(id=>esc(w(id).name)).join(' &amp; ')}
function flyerSponsors(town){
 const local=(typeof TOWN_MAPS==='object'?TOWN_MAPS[town]?.shops||[]:[]).map(s=>s[0]).filter(name=>!/Bev’s|Bertum’s/.test(name));
 return ['Bev’s Discount Folding Chairs',...local.slice(0,3)];
}
function flyerMainEvent(segment){
 if(segment.kind==='promo'){
  const r=w(segment.a);
  return `<div class="flyer-main is-promo"><p class="flyer-billing">Main event · Live! In person!</p><div class="flyer-faces"><figure class="flyer-face">${portrait(r)}<figcaption>${esc(r.name)}</figcaption></figure></div><p class="flyer-pitch">Will address the people of ${esc(showLocation().town)}</p></div>`;
 }
 const sides=matchSides(segment),label=(segment.title?'WWA Championship · ':'')+matchLabel(segment);
 const faces=sides.map((side,i)=>`<figure class="flyer-face ${side.length>1?'is-team':''}" style="--tilt:${i%2?2:-2}deg"><div class="flyer-face-art">${side.map(id=>portrait(w(id))).join('')}</div><figcaption>${flyerNames(side)}</figcaption></figure>`);
 return `<div class="flyer-main"><p class="flyer-billing">Main event · ${esc(label)}</p><div class="flyer-faces ${sides.length>2?'is-many':''}">${faces.join('<b class="flyer-vs" aria-label="versus">VS</b>')}</div></div>`;
}
function flyerUndercard(segment){
 if(segment.kind==='promo')return `<li class="is-promo"><span class="flyer-mugs">${portrait(w(segment.a))}</span><span><b>${esc(w(segment.a).name)}</b><small>Live on the mic</small></span></li>`;
 const sides=matchSides(segment),ids=sides.flat();
 return `<li><span class="flyer-mugs">${ids.slice(0,4).map(id=>portrait(w(id))).join('')}</span><span><b>${sides.map(flyerNames).join(' <i>vs.</i> ')}</b><small>${segment.title?'WWA Championship · ':''}${esc(matchLabel(segment))}</small></span></li>`;
}
function showCollage(location){
 const order=billOrder(),main=state.card[order[0]],rest=order.slice(1).map(i=>state.card[i]);
 const event=isEvent(),town=location.town,venue=location.venue.split(' · ').at(-1),name=showName();
 const tab=`<li><b>${esc(event?monthlyEvent().title:'Sturgeon Bay Slam')}</b><span>Sat · 7 PM</span></li>`;
 return `<section class="flyer" aria-labelledby="show-poster-title">
 <p class="flyer-presents">Wisconsin Wrestling Alliance presents</p>
 <p class="flyer-kicker">${event?'Monthly super show!':'Live pro wrestling!'}</p>
 <h2 id="show-poster-title" class="flyer-title">${esc(name)}</h2>
 <p class="flyer-when"><b>Saturday night</b><span>Week ${state.week}</span><span>Bell 7:00</span></p>
 ${flyerMainEvent(main)}
 ${rest.length?`<div class="flyer-under"><p class="flyer-plus">Plus!</p><ul>${rest.map(flyerUndercard).join('')}</ul></div>`:''}
 <div class="flyer-info">
  <p class="flyer-where"><b>${esc(venue)}</b><span>${esc(town)}, Wisconsin</span><span>Doors 6:30 · ${venueCapacity().toLocaleString()} seats</span></p>
  <p class="flyer-price"><small>Tickets</small><b>${money(ticketPrice())}</b><span>at the door</span><span>Kids 6 &amp; under free</span></p>
 </div>
 <p class="flyer-family">Family friendly! Concessions! Meet the wrestlers after the show!</p>
 <div class="flyer-sponsors"><small>Thank you to our sponsors</small><p>${flyerSponsors(town).map(esc).join('<i aria-hidden="true">★</i>')}</p></div>
 <p class="flyer-fine">Card subject to change. No refunds. Not responsible for lost folding chairs. Printed at Bertum’s Print Shop.</p>
 <ul class="flyer-tabs" aria-hidden="true">${Array.from({length:6},()=>tab).join('')}</ul>
 </section>`;
}
function nextBookingTask(blocks){
 const draftIndex=Object.keys(state.drafts)[0];
 if(draftIndex!=null)return {label:'Finish '+slotLabel(Number(draftIndex)).toLowerCase(),index:Number(draftIndex)};
 const emptyIndex=state.card.findIndex(segment=>bookingProblems(segment).length);
 if(emptyIndex>=0)return {label:'Book next segment',index:emptyIndex};
 if(weeklyBriefingPending())return {label:'Answer to the Lord',lord:true};
 if(blocks.length)return {label:'Fix booking',index:blocks[0].index};
 return null;
}
function bookPage(){
 const location=showLocation(),event=monthlyEvent(),blocks=showBlockingProblems(),drafts=Object.keys(state.drafts).length;
 const booked=state.card.filter(segment=>!bookingProblems(segment).length).length;
 const matches=state.card.filter(segment=>segment.kind==='match'&&!bookingProblems(segment).length).length;
 const nextTask=nextBookingTask(blocks);
 const openSpot=billOrder().find(i=>!state.card[i].kind&&!state.drafts[i]);
 return `<div class="booking-workspace">
 <section class="poster-workbench" aria-label="Booker’s copy">
 ${pressHeading('Build the card',`${esc(showName())} · Week ${state.week} · ${esc(location.town)}, WI`)}
 ${bookingUndoPanel()}
 ${typeof roomStatus==='function'?(rs=>rs.length?`<div class="booker-pitch room-lines">${rs.map(l=>`<p class="room-line is-${l.kind}"><strong>${esc(l.title)}</strong> · ${esc(l.text)}</p>`).join('')}</div>`:'')(roomStatus()):''}
 ${challengePanel()}
 ${state.plans[state.week]?`<p class="booker-pitch"><strong>Pencilled in</strong> · ${esc(state.plans[state.week])}</p>`:''}
 <section class="show-collage press-bill" aria-label="Show card"><div class="poster-bill">${billOrder().map(posterBooking).join('')}</div></section>
 ${writersRoomAvailable()&&state.card.slice(0,-1).some((segment,i)=>!segment.kind&&!state.drafts[i])?`<button class="btn" type="button" id="writers-room">Let the writers book the undercard</button>`:''}
 ${pickHasEmptySpaces()?`<button class="btn press-suggest" type="button" id="suggest-rest">Suggest the rest</button>`:''}
 ${openSpot==null?'':`<button class="btn press-add-match" type="button" data-add-match="${openSpot}"><span aria-hidden="true">✚</span> Add match</button>`}
 <div class="press-budget-summary"><p>Show size: <b>${matches}</b> ${matches===1?'match':'matches'} · ${booked}/${state.card.length} segments</p><p><b>Est. cost: ${money(showCost())}</b> / ${money(state.cash)}</p>${pressMeter(state.cash>0?Math.round(showCost()/state.cash*100):100,'Estimated share of budget')}</div>
 </section>
 ${bookingStoryQueue(bookingStoryActions())}
 <details class="poster-backstage"><summary>Backstage &amp; office</summary><div class="poster-backstage-grid">
 ${careerPanel(true)}
 <div class="card"><h3>Audience satisfaction</h3>${audienceRows()}</div>
 <div class="card event monthly-show" style="--event-accent:${event.color}"><small>Next monthly show · Week ${event.week}</small><h3>${esc(monthlyEventName())}</h3><p>${esc(showLocation(event.week).venue)}<br>${esc(event.town)}, Wisconsin</p><p>${esc(event.detail)}</p></div>
 </div>${storyHub()}</details>
 <button class="btn" id="guide">How to play</button>
 ${readinessPanel()}
 ${weeklyBriefingCard()}
 <div class="booking-footer poster-print-bar"><div><strong>${booked}/${state.card.length} booked · ${matches} ${matches===1?'match':'matches'} (2 minimum)</strong>
 <p>${drafts?`${drafts} segment${drafts===1?' is':'s are'} half-built.`:blocks.length?esc(blocks[0].text):'Ready to print.'} · ${money(showCost())} show cost</p></div>
 ${nextTask?`<button class="btn" id="next-booking">${nextTask.label} →</button>`:''}
 <button class="btn primary" id="print-flyer" ${blocks.length||drafts?'disabled':''}>Proof at Bertum’s Print Shop →</button></div></div>`;
}

function audienceRows(){return [['chaos','Chaos lovers','The stranger, the better'],['purists','Wrestling purists','Skill. Stakes. Clean finishes.'],['drama','Drama addicts','Give them a story']].map(([key,label,tip])=>`<div class="audience-row" title="${tip}"><div><span>${label}</span><strong>${state.crowd[key]}/100</strong></div><div class="bar"><i style="width:${state.crowd[key]}%;background:${key==='chaos'?'var(--red)':key==='drama'?'#a68c48':'var(--green)'}"></i></div></div>`).join('')}
function fighterCard(r,{winner=false,label=''}={}){
 return `<div class="fighter-card ${winner?'is-winner':''}" style="--character-color:${r.color}"><div class="fighter-art">${portrait(r)}${ratingBadge(r)}${r.champ?'<span class="fighter-champion">★ CHAMPION</span>':''}${winner?'<span class="booked-stamp">GETS THE WIN</span>':''}</div><div class="fighter-caption"><strong>${esc(r.name)}</strong><div class="fighter-meta"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><span class="morale-brief">Morale ${r.morale}</span></div>${ratingStrip(r)}${label?`<p>${esc(label)}</p>`:''}</div></div>`;
}
function rosterPage(){return `${pressHeading('Roster / Stars')}<div class="press-roster-tabs" role="group" aria-label="Quick roster filters"><button data-roster-quick="all" aria-pressed="true">All</button><button data-roster-quick="Face" aria-pressed="false">Faces</button><button data-roster-quick="Heel" aria-pressed="false">Heels</button><button data-nav="creative">Teams</button></div><details class="press-roster-search"><summary>Search &amp; sort</summary><div class="roster-tools"><label>Find a wrestler<input type="search" id="roster-search" placeholder="Name or gimmick…"></label><label>Show<select id="roster-filter"><option value="all">All wrestlers</option><option value="Face">Faces</option><option value="Heel">Heels</option><option value="fresh">Fresh tonight</option><option value="champion">Champion</option></select></label><label>Sort<select id="roster-sort"><option value="overall">Overall rating</option><option value="name">Name</option><option value="skill">Ring skill</option><option value="charisma">Mic skill</option><option value="pop">Popularity</option></select></label></div></details><p id="roster-count" class="note" role="status"></p><div class="roster-grid" id="roster-results">${state.roster.map(r=>`<button class="wrestler" data-wrestler="${r.id}"><div class="wrestler-art" style="--character-color:${r.color}">${portrait(r)}${ratingBadge(r)}<span class="badge role-${r.role.toLowerCase()}">${r.champ?'★ WWA CHAMPION':r.role.toUpperCase()}</span></div><div class="wrestler-info"><h3 aria-label="${esc(r.name)}">${esc(rosterCardName(r))}</h3><p>${esc(r.gimmick)}</p><span class="press-file-tab">Open file <span aria-hidden="true">›</span></span>${ratingStrip(r)}<p class="roster-morale">Morale ${r.morale}/100 · ${esc(trustShort(r))}<br>Momentum ${signed(r.momentum)}</p></div></button>`).join('')}</div>`}
function rosterCandidates(query='',filter='all',sort='name'){
 return state.roster.filter(r=>(r.name+' '+r.gimmick).toLowerCase().includes(query.toLowerCase())&&(filter==='all'||filter==='champion'&&r.champ||filter==='fresh'&&!otherBookings(r.id,-1).length||r.role===filter)).slice().sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):(sort==='overall'?overallRating(b)-overallRating(a):b[sort]-a[sort])||a.name.localeCompare(b.name));
}
function bindRosterDiscovery(){
 if(!$('#roster-search'))return;
 const update=()=>{const list=rosterCandidates($('#roster-search').value,$('#roster-filter').value,$('#roster-sort').value),ids=new Set(list.map(r=>r.id)),host=$('#roster-results');document.querySelectorAll('[data-wrestler]').forEach(card=>card.hidden=!ids.has(Number(card.dataset.wrestler)));for(const r of list)host.appendChild(document.querySelector(`[data-wrestler="${r.id}"]`));$('#roster-count').textContent=list.length?list.length+' of '+state.roster.length+' wrestlers':'No wrestlers found. Try another name or filter.'};
 for(const id of ['roster-search','roster-filter','roster-sort'])$('#'+id).addEventListener(id==='roster-search'?'input':'change',update);
 const tabs=document.querySelectorAll('[data-roster-quick]');
 const filter=$('#roster-filter');
 const syncTabs=()=>tabs.forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.rosterQuick===filter.value)));
 tabs.forEach(tab=>tab.onclick=()=>{filter.value=tab.dataset.rosterQuick;update();syncTabs()});
 filter.addEventListener('change',syncTabs);
 update();
}
function creativePage(){return `${heading('Creative','Tag teams, rivalries, and upcoming shows.',`<button class="btn dark" id="create-team">+ Create team</button>`)}<div class="two-col"><section><div class="section-head"><h2>Your tag teams</h2><span>${state.teams.length} ESTABLISHED</span></div>${state.teams.length?state.teams.map((t,i)=>`<div class="card"><div class="team-portraits">${portrait(w(t.a))}${portrait(w(t.b))}</div><h3>${esc(t.name)}</h3><p class="note">${esc(w(t.a).name)} + ${esc(w(t.b).name)}</p><div class="audience-row"><div><span>Team chemistry</span><strong>${t.chemistry}%</strong></div><div class="bar"><i style="width:${t.chemistry}%"></i></div></div><p class="note">Book both partners on the same side in a tag match to grow chemistry and get the whole team over.</p><button class="text-btn" data-dissolve="${i}">Split the team</button></div>`).join(''):'<div class="empty">No tag teams.<br>Choose two wrestlers to form a team.</div>'}<div class="card" style="margin-top:18px"><h3>Gimmick workshop</h3><p class="note">A great gimmick needs exposure. Repackage a wrestler, then put them on the mic to win the crowd over.</p><button class="text-btn" data-workshop>Open your roster →</button></div></section><section><div class="section-head"><h2>Stories taking shape</h2><span>BUILD TO THE PAYOFF</span></div>${storyHub()}<div class="card event"><small>BOOKER’S NOTEBOOK</small><h3>Booking notes</h3><p>A bizarre match excites chaos lovers. A skilled opponent earns purists’ respect. A rivalry gives the drama crowd a reason to care.</p></div></section></div>`}
function officePage(){const fees=showParticipants().length*wrestlerPay(),breakEven=Math.max(0,Math.ceil((showCost()-broadcastIncome())/ticketPrice()));return `${heading('Office','Finances, crew, tour dates, and show history.')} ${stats()}${careerOffer()}${crewPanel()}${rootsPanel()}${seasonGoals()}${tourSchedule()}<details class="card"><summary>Settings &amp; device</summary>${webAppPanel()}<button type="button" class="btn tutorial-replay" data-start-tutorial>Take the tour again</button></details><div class="two-col"><section><div class="card"><small class="muted">HOME SWEET HOME</small><h3 style="margin-top:10px">${esc(careerStage().venue)}</h3><p class="note">${venueCapacity().toLocaleString()} seats · ${money(ticketPrice(false))} weekly tickets · ${money(ticketPrice(true))} big-event tickets</p><div class="history-item"><span>Venue & production</span><strong>${money(venueCost())} / show</strong></div><div class="history-item"><span>Tonight’s appearance fees</span><strong>${money(fees)}</strong></div><div class="history-item"><span>Special rules, props &amp; fixes</span><strong>${money(showCost()-venueCost()-fees)}</strong></div><div class="history-item"><span>Break-even tickets tonight</span><strong>${breakEven} / ${venueCapacity()}</strong></div><p class="note" style="margin-top:15px">Attendance grows with reputation, star power, rivalry heat, and big-event anticipation.</p></div><div class="card"><h3>The championship picture</h3><div class="byline">${avatar(champion())}<div><strong>${esc(champion().name)}</strong><p class="muted" style="margin-top:5px">WWA World Champion</p></div></div><p class="note" style="margin-top:15px">Book one non-team title defense per show with the reigning champion. A new champion gives your promotion a reputation boost.</p></div></section><section><div class="section-head" style="padding-top:0"><h2>Show history</h2><span>${state.history.length} SHOWS</span></div>${state.history.length?state.history.map(h=>`<div class="card"><small class="muted">WEEK ${h.week}</small><h3 style="margin-top:6px">${esc(h.name)}</h3><div class="history-item"><span>Show rating</span><strong>${h.rating}/100</strong></div><div class="history-item"><span>Attendance</span><strong>${h.attendance} / ${h.capacity||300}</strong></div><div class="history-item"><span>Profit</span><strong class="${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</strong></div>${historyStoryDetails(h)}</div>`).join(''):'<div class="empty">The history books are empty.<br>Go give them something to write about.</div>'}<div class="card"><h3>Your career, to go.</h3><p class="note">Download a backup to move your career to another browser or keep it before starting over.</p><div class="backup-controls"><button class="btn" id="export-career">Back up career to Files</button><button class="btn" id="import-career">Import career</button></div></div><button class="text-btn danger" id="reset">Start a fresh promotion</button></section></div>`}
function bindPage(){const add=$('[data-add-match]');if(add)add.onclick=()=>pickOpen(Number(add.dataset.addMatch));bindPosterBooking();bindBookerInbox();bindRecapFollowUp();bindPostShow();bindRosterDiscovery();if($('#next-booking'))$('#next-booking').onclick=()=>{
 const task=nextBookingTask(showBlockingProblems());
 if(!task)return;
 if(task.lord){
  openWeeklyBriefing();
 }else{
  editSegment(task.index);
 }
};document.querySelectorAll('[data-booking-edit]').forEach(b=>b.onclick=()=>openBookingDesk(Number(b.dataset.bookingEdit),null,{step:b.dataset.bookingStep,field:b.dataset.bookingField}));bindStoryControls();bindBookingStoryQueue();bindWeekAhead();bindTownMap();bindRise();bindCareerControls();bindProgression();bindLiveShow();document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editSegment(Number(b.dataset.edit)));document.querySelectorAll('[data-wrestler]').forEach(b=>b.onclick=()=>editWrestler(Number(b.dataset.wrestler)));document.querySelectorAll('[data-dissolve]').forEach(b=>b.onclick=()=>{const t=state.teams.splice(Number(b.dataset.dissolve),1)[0];w(t.a).morale=clamp(w(t.a).morale-5);w(t.b).morale=clamp(w(t.b).morale-5);render();toast('The split stings. Both partners lose 5 morale.')});if($('#print-flyer'))$('#print-flyer').onclick=openPublicFlyer;if($('#guide'))$('#guide').onclick=guide;if($('#request'))$('#request').onclick=request;if($('#create-team'))$('#create-team').onclick=createTeam;if($('[data-workshop]'))$('[data-workshop]').onclick=()=>{view='roster';render()};if($('#reset'))$('#reset').onclick=reset;if($('#next-week'))$('#next-week').onclick=nextWeek}
function modal(title,body,submit,label='Save changes'){const d=$('#modal');d.oncancel=null;const trigger=document.activeElement,slot=trigger?.closest?.('[data-edit],[data-booking-edit],[data-new-kind]');const index=slot?.dataset.edit??slot?.dataset.bookingEdit;d.onclose=()=>setTimeout(()=>{if(d.open)return;if(trigger?.isConnected)trigger.focus();else if(index!=null)focusBookingSegment(Number(index));},0);d.setAttribute('aria-labelledby','modal-heading');d.className='';d.innerHTML=`<form id="modal-form"><div class="modal-head"><h2 id="modal-heading">${title}</h2><button type="button" class="close" aria-label="Close dialog">×</button></div>${body}<div class="modal-actions"><button type="button" class="btn cancel">Cancel</button><button class="btn dark" type="submit">${label}</button></div></form>`;d.querySelector('.close').onclick=d.querySelector('.cancel').onclick=()=>d.close();d.querySelector('form').onsubmit=e=>{e.preventDefault();submit(new FormData(e.currentTarget),d)};d.showModal()}
function options(values,current){return values.map(v=>`<option value="${esc(v)}" ${v===current?'selected':''}>${esc(v)}</option>`).join('')}
function wrestlerOptions(id){return state.roster.map(r=>`<option value="${r.id}" ${id!=null&&r.id===Number(id)?'selected':''}>${esc(r.name)}${r.champ?' ★':''}</option>`).join('')}
function field(label,html){return `<label class="field"><span>${label}</span>${html}</label>`}
function bookingCard(r,{selected=false,disabled=false,compact=false,slot='',label='',name='',checked=false,note=''}={}){
 if(name)selected=checked;
 const body=`<div class="pick-art" style="--character-color:${r.color}">${portrait(r)}${ratingBadge(r)}${r.champ?'<span class="pick-title">★ CHAMPION</span>':''}${(selected||name)?'<span class="pick-check" aria-hidden="true">✓</span>':''}</div><div class="pick-info">${label?`<span class="pick-label">${label}</span>`:''}<strong>${esc(r.name)}</strong>${!compact?`<span class="pick-gimmick">${esc(r.gimmick)}</span><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><span class="pick-stats"><span>POP <b>${r.pop}</b></span><span>SKILL <b>${r.skill}</b></span></span>`:''}${note?`<span class="pick-note">${esc(note)}</span>`:''}</div>`;
 if(name)return `<label class="wrestler-pick winner-pick ${checked?'selected':''}"><input type="radio" name="${name}" value="${r.id}" ${checked?'checked':''} required><span class="pick-body">${body}</span></label>`;
 return `<button type="button" class="wrestler-pick ${selected?'selected':''} ${compact?'compact':''}" ${slot?`data-slot="${slot}"`:`data-pick="${r.id}"`} ${disabled?'disabled':''} aria-pressed="${selected}" aria-label="${esc((label?label+': ':'')+r.name+(disabled?' — already in other corner':''))}">${body}</button>`;
}
function editSegment(i){if($('.show-collage')&&typeof pickOpen==='function')pickOpen(i);else openBookingDesk(i)}
function editWrestler(id){const r=w(id),last=state.incidents.find(entry=>entry.participants?.includes(id));modal('Wrestler file',`<div class="big-profile">${avatar(r)}<div><h3>${esc(r.name)}</h3><p class="note">${esc(r.desc)}</p><p class="note">${esc(trustReadout(r))} · ${r.lastSeen?'Last worked week '+r.lastSeen:'Waiting for a first booking'}</p></div></div>${last?`<p class="note"><strong>Last backstage note</strong> · ${esc(last.text)}</p>`:''}${windowCard(r)}<div class="stats" style="margin:18px 0"><div class="stat"><small>Pop</small><div class="value">${r.pop}</div></div><div class="stat"><small>Skill</small><div class="value">${r.skill}</div></div><div class="stat"><small>Charisma</small><div class="value">${r.charisma}</div></div><div class="stat"><small>Morale</small><div class="value">${r.morale}</div></div></div>${field('Gimmick',`<input name="gimmick" maxlength="60" required value="${esc(r.gimmick)}">`)}${field('Allegiance',`<select name="role">${options(['Face','Heel'],r.role)}</select>`)}<p class="note">A new gimmick needs a “Debut a gimmick” promo to find its audience. Switching allegiance creates intrigue but costs 3 morale.</p>`,(f,d)=>{if(!f.get('gimmick').trim()){toast('Give this gimmick a name.');return}if(f.get('gimmick').trim()!==r.gimmick)r.newGimmick=true;r.gimmick=f.get('gimmick').trim();if(r.role!==f.get('role'))r.morale=clamp(r.morale-3);r.role=f.get('role');d.close();render();toast('Character updated. Give them a moment on the mic.')})}
function createTeam(){modal('Create a tag team',`${field('Team name',`<input name="name" maxlength="45" required placeholder="e.g. The Department of Doom">`)}${field('Partner one',`<select name="a" required><option value="" selected disabled>Choose partner one…</option>${wrestlerOptions(null)}</select>`)}${field('Partner two',`<select name="b" required><option value="" selected disabled>Choose partner two…</option>${wrestlerOptions(null)}</select>`)}<p class="note">Opposites can click. Similar personalities start with better chemistry. Each wrestler can be in one team.</p>`,(f,d)=>{const a=Number(f.get('a')),b=Number(f.get('b')),name=f.get('name').trim();if(!name){toast('Your team needs a name.');return}if(a===b){toast('Even a huge ego needs a second partner.');return}if(state.teams.some(t=>[t.a,t.b].some(id=>id===a||id===b))){toast('One of these wrestlers already has a team. Split it first.');return}state.teams.push({name,a,b,chemistry:w(a).role===w(b).role?48:35});d.close();render();toast(name+' are ready for their debut.')},'Form team')}
function request(){modal('A moment for Sweeps McKenzie',`<div class="byline">${avatar(w(10))}<strong>Sweeps McKenzie wants a clean win.</strong></div><p class="note" style="margin-top:15px">Promise him a clean victory in tonight’s card. Keep your word for +8 morale and extra crowd affection. Break it and he loses 12 morale.</p>${field('Your response',`<select name="response" required><option value="" selected disabled>Choose your response…</option><option value="yes">You’ve earned your shot. I promise.</option><option value="no">No promises. Earn it in the ring.</option></select>`)}`,(f,d)=>{state.request=f.get('response');d.close();render();toast(state.request==='yes'?'Promise made. Book Sweeps McKenzie a clean victory.':'Sweeps McKenzie understands. For now.')},'Respond')}
function guide(){modal('How to play',`<p class="note">Book every segment on the card, including at least two matches. The card grows as your promotion does. You choose the winners. Every fourth week is a big event. Every show has to pay its way: venue, appearance fees and fixes all scale as you grow, and moving into a bigger room takes a deposit.</p><div class="result"><h3>Cast with a purpose</h3><p>Tap any space on the card. A sheet slides up with the best fits for that spot, and the reason each one fits. One tap books them and the sheet moves to the next space. Change the shape (singles, tag, trios and more) at the top of the sheet anytime. Tap 👑 Win under a side to set the winner. Tap a booked wrestler to swap them, or hold and drag them to move them to another spot. Hold a segment’s name to reorder the card: whatever sits last is the main event. Details opens the full editor for finishes and run-ins. Then approve the print proof to open the doors.</p></div><div class="result"><h3>Listen backstage</h3><p>Conversations branch. Promises have deadlines. A clean qualifying win can unlock Sweeps’ rematch; an unlikely team can take his story somewhere else.</p></div><div class="result"><h3>Show night</h3><p>Once the bell goes, the night belongs to the wrestlers. Each act calls its own segment by instinct, and you watch from the curtain. Book people into spots that suit them: a technician shines in a straight match, a showboat in a wild stipulation. Your booked winner stays the winner.</p></div><div class="result"><h3>Keep it fresh</h3><p>A promo and a match can build a story. Repeated speeches and unchanged matchups lose impact. The audience meters measure satisfaction, not population shares.</p></div><p class="note">Progress saves on this device. Export a backup from the office.</p>${state.started&&!onTitle&&!state.liveShow&&!state.recap?'<button type="button" class="btn tutorial-replay" data-start-tutorial>Take the tour</button>':''}`,(_,d)=>d.close(),'Let’s book')}
function reset(){modal('Start over?',`<p class="note">This resets your roster, booking, teams, and show history on this device.</p>`,(_,d)=>{state=fresh();view='book';onTitle=true;d.close();render()},'Reset promotion')}
function showCost(){return matchCost()}
function rivalryKey(a,b){return [a,b].sort((x,y)=>x-y).join('-')}
function simulate(decisions=[]){return simulateShow(decisions)}
function openPublicFlyer(){
 if(showBlockingProblems().length||Object.keys(state.drafts).length)return;
 modal('Print proof',`<div class="flyer-proof"><p class="flyer-proof-note">Bertum’s proof · one per telephone pole</p>${showCollage(showLocation())}</div>`,(_,dialog)=>{
  dialog.close();
  runShow();
 },'Approve flyer & open doors →');
 $('#modal').querySelector('.cancel').textContent='Back to Booker’s Copy';
}
function runShow(){if(state.recap||state.liveShow)return;if(weeklyBriefingPending()){openWeeklyBriefing();return;}const problems=showBlockingProblems();if(problems.length){toast(problems[0].text);return;}if(state.cash<showCost()){const loan=Math.max(1500,niceMoney(showCost()-state.cash+venueCost()));modal('The budget is looking rough.',`<p class="note">Tonight costs ${money(showCost())}, but you have ${money(state.cash)}. Bev will front you ${money(loan)} in exchange for 5 reputation. You can also cancel and reduce special match costs.</p>`,(_,d)=>{state.cash+=loan;state.rep=clamp(state.rep-5);d.close();openDoors()},'Take Bev’s lifeline');return}openDoors()}
// Show night is reported, not read: the wrestlers call the night, and you land on the overview.
function openDoors(){startLiveShow();if(state.liveShow)finishLiveShow()}
// The full show report, one tap behind the after-show overview (aftershow.js).
function fullReportPage(){
 const h=state.recap;
 const headliner=w(h.results.at(-1)?.participants?.[0])||w(h.championId)||champion();
 const location=h.location?.town?` · ${esc(h.location.town)}, WI`:'';
 const buzz=Object.values(h.crowdDelta).reduce((sum,change)=>sum+change,0);
 const verdict=h.rating>=80?'They’ll be talking about this!':h.rating>=65?'That’s some good wrestling!':h.rating>=50?'A little rough. A lot of heart.':'There’s always next week!';
 const stars=Math.round(clamp(h.rating)/20);
 return `<div class="recap-wrap press-recap">
 <button type="button" class="text-btn post-back" id="post-back">← Back to tonight</button>
 ${pressHeading('Show report',`${esc(h.name)} · Week ${h.week}${location}`)}
 <div class="press-recap-hero">${portrait(headliner)}<h2>${verdict}</h2></div>
 <div class="press-receipts">
  <div><small>Attendance</small><strong>${h.attendance}</strong><span>${Math.round(h.attendance/(h.capacity||300)*100)}% capacity</span></div>
  ${Number.isFinite(h.ticket)?`<div><small>Gate</small><strong>${money(h.attendance*h.ticket)}</strong><span>ticket sales</span></div>`:''}
  <div><small>Profit</small><strong class="${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</strong><span>after ${money(h.cost)} costs</span></div>
 </div>
 <section class="press-results"><h2>Show results</h2>
 ${h.results.map((result,i)=>`<details class="press-result-ticket"><summary><span class="press-result-check" aria-hidden="true">✓</span><strong>${esc(result.headline)}</strong>${Number.isFinite(result.rating)?`<b aria-label="Rating ${result.rating} out of 100">${result.rating}</b>`:''}<span class="press-result-fold" aria-hidden="true"></span></summary><div><small>${esc(result.label)}</small><p>${esc(result.explanation)}</p>${reportExtra(h,i)}${recapDecision(result)}</div></details>`).join('')}
 </section>
 <dl class="press-scorecard">
  <div><dt>Local buzz</dt><dd>${pressMeter(state.rep,'Promotion reputation')} ${signed(buzz)}</dd></div>
  <div><dt>Promotion rep</dt><dd>${signed(h.repChange)}</dd></div>
  <div><dt>Bank balance</dt><dd>${money(state.cash)}</dd></div>
  <div><dt>Show rating</dt><dd><span class="press-stars" aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</span> ${h.rating}/100</dd></div>
 </dl>
 <button class="btn primary press-cta" id="next-week">Continue <span aria-hidden="true">→</span></button>
 <details class="card press-recap-notes"><summary>Crowd verdict &amp; show notes</summary>${audienceRows()}<p class="note">${Object.entries(h.crowdDelta).map(([key,value])=>`${{chaos:'Chaos lovers',purists:'Purists',drama:'Drama addicts'}[key]} ${signed(value)}`).join(' · ')}</p></details>
 ${riseRecap(h)}${recapFollowUp(h)}${careerOffer()}${storyRecap(h)}
 </div>`;
}
function nextWeek(){state.week++;state.recap=null;state.liveShow=null;state.request=null;state.card=defaultCard();state.drafts={};state.production={week:state.week,choice:null};state.weeklyBriefing=null;view='locker';render();window.scrollTo(0,0);const title=document.getElementById('town-title');if(title)title.focus({preventScroll:true})}
render();
