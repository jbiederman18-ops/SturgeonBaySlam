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
    "gimmick": "Mythological matinee idol",
    "role": "Face",
    "pop": 72,
    "skill": 81,
    "charisma": 78,
    "morale": 78,
    "color": "#a95c42",
    "mask": false,
    "champ": true,
    "desc": "A self-appointed Greek wrestling epic. Demands dramatic lighting for every headlock."
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
    "desc": "Knows exactly two holds. Refuses to reveal the second until the big event."
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
    "gimmick": "Aggressively singular",
    "role": "Face",
    "pop": 32,
    "skill": 76,
    "charisma": 64,
    "morale": 81,
    "color": "#5b8b8c",
    "mask": true,
    "champ": false,
    "desc": "One man. One entrance. One very firm objection to tag-team wrestling."
  },
  {
    "id": 4,
    "name": "Terrible Towel",
    "gimmick": "Terrifying terrycloth showman",
    "role": "Heel",
    "pop": 38,
    "skill": 55,
    "charisma": 85,
    "morale": 82,
    "color": "#be9b39",
    "mask": false,
    "champ": false,
    "desc": "A human brawler in yellow terrycloth ring gear. Waves a rally towel like a weapon, then complains when the crowd waves back."
  },
  {
    "id": 5,
    "name": "Rudy Giuliani",
    "gimmick": "Courtroom-style wrestling showman",
    "role": "Heel",
    "pop": 51,
    "skill": 48,
    "charisma": 84,
    "morale": 83,
    "color": "#7f6776",
    "mask": false,
    "champ": false,
    "desc": "Arrives with a briefcase of fictional wrestling bylaws. Every pinfall is subject to appeal."
  },
  {
    "id": 6,
    "name": "Pissboy, P.H.D",
    "gimmick": "Doctor of questionable ring science",
    "role": "Heel",
    "pop": 37,
    "skill": 74,
    "charisma": 82,
    "morale": 84,
    "color": "#8c9455",
    "mask": true,
    "champ": false,
    "desc": "Defended a thesis on suplex velocity. Insists the announcer say the full qualification."
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
    "gimmick": "Glacial trash-talker",
    "role": "Face",
    "pop": 58,
    "skill": 83,
    "charisma": 76,
    "morale": 79,
    "color": "#668f9f",
    "mask": true,
    "champ": false,
    "desc": "A silver-haired human striker in ice-blue ring gear. Every catchphrase arrives with an unnecessary weather forecast."
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
    "desc": "Sweeps the hall before bell time. Plans to sweep the championship scene after it."
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
    "gimmick": "Suspiciously ordinary mastermind",
    "role": "Heel",
    "pop": 61,
    "skill": 77,
    "charisma": 83,
    "morale": 83,
    "color": "#575f83",
    "mask": false,
    "champ": false,
    "desc": "Has a plan for everything and the least memorable alias in wrestling history."
  },
  {
    "id": 13,
    "name": "Katy “Space Taking” Perry",
    "gimmick": "Astronomical entrance specialist",
    "role": "Face",
    "pop": 57,
    "skill": 64,
    "charisma": 92,
    "morale": 84,
    "color": "#9470a0",
    "mask": false,
    "champ": false,
    "desc": "Needs an entire launchpad for her entrance. Her booking requests include more personal space."
  },
  {
    "id": 14,
    "name": "Cuba Gooding III",
    "gimmick": "Third-generation main-event energy",
    "role": "Face",
    "pop": 48,
    "skill": 73,
    "charisma": 87,
    "morale": 78,
    "color": "#a96b49",
    "mask": false,
    "champ": false,
    "desc": "Calls himself the third act. Turns every near fall into an awards-season monologue."
  },
  {
    "id": 15,
    "name": "Carl “Parallel” Parker",
    "gimmick": "Geometric perfectionist",
    "role": "Heel",
    "pop": 39,
    "skill": 84,
    "charisma": 65,
    "morale": 81,
    "color": "#5c8291",
    "mask": false,
    "champ": false,
    "desc": "Insists his shoulders are always parallel to the mat. Has not considered the implications."
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
    "desc": "Says please before every cheap shot. Sends handwritten thank-you notes after stealing a win."
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
    "gimmick": "Holiday menace turned hopeless romantic",
    "role": "Face",
    "pop": 47,
    "skill": 68,
    "charisma": 90,
    "morale": 76,
    "color": "#719152",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in the turnbuckles."
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
    "gimmick": "Flounder-themed escape artist",
    "role": "Face",
    "pop": 28,
    "skill": 70,
    "charisma": 79,
    "morale": 78,
    "color": "#668f94",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler in teal gear with fin-shaped shoulder pads. Flops magnificently, counters unexpectedly, and treats every rope break as returning to shore."
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
    "desc": "A human ring-robed party host with a halo headband. Wants every comeback to feel like the whole room just got invited."
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
    "gimmick": "Walking wrestling-comment-section expert",
    "role": "Heel",
    "pop": 43,
    "skill": 81,
    "charisma": 78,
    "morale": 82,
    "color": "#6e7d83",
    "mask": false,
    "champ": false,
    "desc": "Rates his own matches before the bell. Complains that his opponent is being pushed too soon."
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
    "gimmick": "Dashing dog-show perfectionist",
    "role": "Heel",
    "pop": 41,
    "skill": 76,
    "charisma": 84,
    "morale": 84,
    "color": "#82966d",
    "mask": false,
    "champ": false,
    "desc": "Immaculately groomed. Treats the opposition like disobedient competition at a very exclusive dog show."
  },
  {
    "id": 29,
    "name": "The Human Houseboat",
    "gimmick": "Waterfront wrecking crew",
    "role": "Face",
    "pop": 45,
    "skill": 79,
    "charisma": 74,
    "morale": 85,
    "color": "#60858e",
    "mask": false,
    "champ": false,
    "desc": "A large human powerhouse in a captain’s hat and porthole-patterned singlet. Insists every home match is a waterfront property."
  },
  {
    "id": 30,
    "name": "Holly “Pizza Pocket” Posey",
    "gimmick": "Snack-powered comeback queen",
    "role": "Face",
    "pop": 37,
    "skill": 75,
    "charisma": 86,
    "morale": 76,
    "color": "#b66f63",
    "mask": false,
    "champ": false,
    "desc": "Keeps emergency snacks in an alarming number of pockets. Claims a comeback takes exactly ninety seconds to heat."
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
    "desc": "Has no opinion on the championship. Would nevertheless very much like to hold it in a nonpartisan capacity."
  },
  {
    "id": 32,
    "name": "Cleats",
    "gimmick": "Boot-obsessed football enforcer",
    "role": "Face",
    "pop": 24,
    "skill": 68,
    "charisma": 76,
    "morale": 78,
    "color": "#8a9565",
    "mask": false,
    "champ": false,
    "desc": "A human striker who carries his prized football cleats over one shoulder. Superb footwork. Treats those boots like the real stars of the show."
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
    "gimmick": "Gravely serious action veteran",
    "role": "Face",
    "pop": 57,
    "skill": 73,
    "charisma": 84,
    "morale": 79,
    "color": "#7c807e",
    "mask": false,
    "champ": false,
    "desc": "A human wrestler playing an intensely focused veteran with an old flip phone and a very specific set of wristlocks. Treats a community-hall booking like an international extraction."
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
const defaultCard=()=>Array.from({length:4},()=>({kind:null}));
function fresh(){return storyDefaults({gameVersion:4,started:false,week:1,cash:4250,rep:24,roster:structuredClone(initialRoster),card:defaultCard(),crowd:{chaos:44,purists:52,drama:38},teams:[],history:[],request:null,view:'book',recap:null,liveShow:null,rivalries:{}})}
const humanRosterCanon={"4":{"oldGimmick":"A sinister rally towel","gimmick":"Terrifying terrycloth showman","desc":"A human brawler in yellow terrycloth ring gear. Waves a rally towel like a weapon, then complains when the crowd waves back.","mask":false},"8":{"oldGimmick":"Glacial trash-talker","gimmick":"Glacial trash-talker","desc":"A silver-haired human striker in ice-blue ring gear. Every catchphrase arrives with an unnecessary weather forecast.","mask":true},"9":{"oldGimmick":"Pocket-sized powerhouse","gimmick":"Mouse-eared pocket powerhouse","desc":"A human powerhouse with a mouse-ear headband, painted whiskers and enormous suplexes. Takes being called adorable as a personal challenge.","mask":false},"17":{"oldGimmick":"Sentient insurance contract","gimmick":"Insurance salesman of doom","desc":"A bespectacled human grappler with a briefcase full of policies. Every loss is an exclusion. Every headlock requires a signature.","mask":false},"20":{"oldGimmick":"Holiday menace turned hopeless romantic","gimmick":"Holiday menace turned hopeless romantic","desc":"A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in the turnbuckles.","mask":false},"22":{"oldGimmick":"Fish out of water, fighter in the ring","gimmick":"Flounder-themed escape artist","desc":"A human wrestler in teal gear with fin-shaped shoulder pads. Flops magnificently, counters unexpectedly, and treats every rope break as returning to shore.","mask":false},"23":{"oldGimmick":"Sweet presentation, vicious citrus","gimmick":"Sweet looks. Sour intentions.","desc":"A human wrestler in lemon-yellow ring gear with a citrus brooch. A sweet smile, sharp counters and an extremely sour attitude.","mask":false},"24":{"oldGimmick":"Patron saint of the afterparty","gimmick":"Patron saint of the afterparty","desc":"A human ring-robed party host with a halo headband. Wants every comeback to feel like the whole room just got invited.","mask":false},"29":{"oldGimmick":"Floating residential powerhouse","gimmick":"Waterfront wrecking crew","desc":"A large human powerhouse in a captain’s hat and porthole-patterned singlet. Insists every home match is a waterfront property.","mask":false},"32":{"oldGimmick":"A pair of boots with title ambitions","gimmick":"Boot-obsessed football enforcer","desc":"A human striker who carries his prized football cleats over one shoulder. Superb footwork. Treats those boots like the real stars of the show.","mask":false},"33":{"oldGimmick":"Wobbly dessert demolition expert","gimmick":"Custard-loving demolition expert","desc":"A cheerful human heavyweight in a custard-yellow singlet, carrying a dessert spoon. Never looks balanced. Almost never lands where you expect.","mask":false}};
for(const id of [35,37])humanRosterCanon[id]={oldGimmick:id===37?'Four paws. Zero prohibitions.':initialRoster[id].gimmick,gimmick:initialRoster[id].gimmick,desc:initialRoster[id].desc,mask:false};

function mergeRosterExpansion(saved){
 if(!saved||!Array.isArray(saved.roster)||saved.roster.length===0)return fresh();
 migrateGameBranding(saved);
 const present=new Set(saved.roster.map(r=>r.id));
 for(const wrestler of initialRoster)if(!present.has(wrestler.id)){saved.roster.push(structuredClone(wrestler));present.add(wrestler.id)}
 // Migrate factory character descriptions, preserving player-written gimmicks and all progress.
 for(const wrestler of saved.roster){wrestler.performerType="human";const update=humanRosterCanon[wrestler.id];if(!update)continue;if(wrestler.gimmick===update.oldGimmick||wrestler.id===37&&wrestler.gimmick==='Dog-themed gear. Zero prohibitions.')wrestler.gimmick=update.gimmick;wrestler.desc=update.desc;wrestler.mask=update.mask}
 saved.started??=true;saved.gameVersion=4;
 if(!saved.liveShow)saved.card=saved.card.map(segment=>segment.draft?segment:normalizeMatch(segment,saved.roster,saved.teams));
 storyDefaults(saved);
 return saved;
}
let lastSavedCareer=null;
let state;try{state=mergeRosterExpansion(JSON.parse(localStorage.getItem(KEY)))}catch{state=fresh()}
let view=state.view||'book',onTitle=true;
const $=s=>document.querySelector(s),w=id=>id==null?undefined:state.roster.find(r=>r.id===Number(id)),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>'$'+n.toLocaleString('en-US'),clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
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
function render(){if(onTitle){renderTitle();refreshWebAppUI();return}document.body.classList.toggle('show-live',!!state.liveShow);save();const nav=[['book','▤','Poster'],['roster','♟','Roster'],['creative','✦','Creative'],['office','▥','Office']];$('#app').innerHTML=`<aside class="sidebar"><div class="brand slam-brand">STURGEON<br><span>BAY SLAM</span><span class="brand-star"> ★</span></div><div class="brand-sub">RISE TO SUPREMACY</div><nav class="nav" aria-label="Main navigation">${nav.map(([v,i,l])=>`<button data-nav="${v}" class="${view===v?'active':''}" ${view===v?'aria-current="page"':''}><span class="icon">${i}</span>${l}</button>`).join('')}</nav><div class="side-bottom"><small class="muted">Your promotion</small><strong>Wisconsin Wrestling Alliance</strong><span><i class="live-dot"></i>${esc(careerStage().name)}</span></div></aside><main class="main"><header class="topbar"><div><button class="mobile-brand title-return" data-title-menu>STURGEON <span>BAY SLAM ★</span></button><button class="desktop-title title-return" data-title-menu>STURGEON BAY SLAM: RISE TO SUPREMACY ★</button></div><div class="row"><span class="season">SEASON ${Math.ceil(state.week/12)} &nbsp;/&nbsp; WEEK ${state.week}</span><span class="demo">CAREER MODE</span></div></header><div class="content">${state.liveShow?liveShowPage():state.recap?recapPage():view==='book'?bookPage():view==='roster'?rosterPage():view==='creative'?creativePage():officePage()}</div></main>`;document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{if(state.liveShow){toast('You’re on air. Finish the show to return to your office.');return}if(state.recap){toast('Continue to next week to return to your office.');return}view=b.dataset.nav;render();window.scrollTo(0,0)});bindPage();refreshWebAppUI()}
function showCollage(location,publicFlyer=false){
 return `<section class="poster show-collage" aria-labelledby="show-poster-title">
 <small class="collage-kicker"><span aria-hidden="true">★★★</span> ${isEvent()?'Monthly super show':'Live pro wrestling'} <span aria-hidden="true">★★★</span></small>
 <div class="poster-bill">${[3,0,1,2].map(publicFlyer?publicPosterBooking:posterBooking).join('')}</div>
 <h2 id="show-poster-title">${esc(showName())}</h2>
 <p class="poster-venue"><strong>${esc(location.venue)}</strong><br>${esc(location.town)}, WI · Week ${state.week} · ${venueCapacity().toLocaleString()} seats · ${money(ticketPrice())} tickets</p>
 <small class="collage-fineprint">Card subject to change · Bev’s Discount Folding Chairs</small>
 </section>`;
}
function bookPage(){
 const location=showLocation(),event=monthlyEvent(),blocks=showBlockingProblems(),drafts=Object.keys(state.drafts).length;
 const booked=state.card.filter(segment=>!bookingProblems(segment).length).length;
 const matches=state.card.filter(segment=>segment.kind==='match'&&!bookingProblems(segment).length).length;
 return `<div class="booking-workspace">
 <section class="poster-workbench" aria-label="Booker’s copy">
 <div class="poster-mast"><h1>Booker’s copy</h1><button class="btn" id="guide">How to play</button></div>
 ${weeklyBriefingCard()}
 ${bookingUndoPanel()}
 ${state.plans[state.week]?`<p class="booker-pitch"><strong>Pencilled in</strong> · ${esc(state.plans[state.week])}</p>`:''}
 ${showCollage(location)}
 ${posterHand()}
 </section>
 <div class="booking-footer poster-print-bar"><div><strong>${booked}/4 booked · ${matches}/2 matches minimum</strong>
 <p>${drafts?`${drafts} draft${drafts===1?'':'s'} to confirm or discard.`:blocks.length?esc(blocks[0].text):'Ready to print.'} · ${money(showCost())} show cost</p></div>
 ${drafts||blocks.length?'<button class="btn" id="next-booking">Go to next booking →</button>':''}
 <button class="btn primary" id="print-flyer" ${blocks.length||drafts?'disabled':''}>Proof at Bertum’s Print Shop →</button></div>
 ${bookingStoryQueue(bookingStoryActions())}
 ${readinessPanel()}
 <details class="poster-backstage"><summary>Backstage &amp; office</summary><div class="poster-backstage-grid">
 ${careerPanel(true)}
 <div class="card"><h3>Audience satisfaction</h3>${audienceRows()}</div>
 <div class="card event monthly-show" style="--event-accent:${event.color}"><small>Next monthly show · Week ${event.week}</small><h3>${esc(monthlyEventName())}</h3><p>${esc(showLocation(event.week).venue)}<br>${esc(event.town)}, Wisconsin</p><p>${esc(event.detail)}</p></div>
 </div>${storyHub()}</details></div>`;
}

function audienceRows(){return [['chaos','Chaos lovers','The stranger, the better'],['purists','Wrestling purists','Skill. Stakes. Clean finishes.'],['drama','Drama addicts','Give them a story']].map(([key,label,tip])=>`<div class="audience-row" title="${tip}"><div><span>${label}</span><strong>${state.crowd[key]}/100</strong></div><div class="bar"><i style="width:${state.crowd[key]}%;background:${key==='chaos'?'var(--red)':key==='drama'?'#a68c48':'var(--green)'}"></i></div></div>`).join('')}
function fighterCard(r,{winner=false,label=''}={}){
 return `<div class="fighter-card ${winner?'is-winner':''}" style="--character-color:${r.color}"><div class="fighter-art">${portrait(r)}${ratingBadge(r)}${r.champ?'<span class="fighter-champion">★ CHAMPION</span>':''}${winner?'<span class="booked-stamp">GETS THE WIN</span>':''}</div><div class="fighter-caption"><strong>${esc(r.name)}</strong><div class="fighter-meta"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><span class="morale-brief">Morale ${r.morale}</span></div>${ratingStrip(r)}${label?`<p>${esc(label)}</p>`:''}</div></div>`;
}
function rosterPage(){return `${heading('Roster',state.roster.length+' wrestlers under contract.')}<div class="help">Tap a wrestler to inspect their skills, change their gimmick, or switch their allegiance. Popularity draws a crowd; skill and charisma help keep it.</div><div class="roster-tools"><label>Find a wrestler<input type="search" id="roster-search" placeholder="Name or gimmick…"></label><label>Show<select id="roster-filter"><option value="all">All wrestlers</option><option value="Face">Faces</option><option value="Heel">Heels</option><option value="fresh">Fresh tonight</option><option value="champion">Champion</option></select></label><label>Sort<select id="roster-sort"><option value="name">Name</option><option value="skill">Ring skill</option><option value="charisma">Mic skill</option><option value="pop">Popularity</option></select></label></div><p id="roster-count" class="note" role="status"></p><div class="roster-grid" id="roster-results">${state.roster.map(r=>`<button class="wrestler" data-wrestler="${r.id}"><div class="wrestler-art" style="--character-color:${r.color}">${portrait(r)}${ratingBadge(r)}<span class="badge role-${r.role.toLowerCase()}">${r.champ?'★ WWA CHAMPION':r.role.toUpperCase()}</span></div><div class="wrestler-info"><h3>${esc(r.name)}</h3><p>${esc(r.gimmick)}</p>${ratingStrip(r)}<p class="roster-morale">Morale ${r.morale}/100 · Trust ${r.trust}/100<br>Momentum ${signed(r.momentum)}</p></div></button>`).join('')}</div>`}
function rosterCandidates(query='',filter='all',sort='name'){
 return state.roster.filter(r=>(r.name+' '+r.gimmick).toLowerCase().includes(query.toLowerCase())&&(filter==='all'||filter==='champion'&&r.champ||filter==='fresh'&&!otherBookings(r.id,-1).length||r.role===filter)).slice().sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):b[sort]-a[sort]||a.name.localeCompare(b.name));
}
function bindRosterDiscovery(){
 if(!$('#roster-search'))return;
 const update=()=>{const list=rosterCandidates($('#roster-search').value,$('#roster-filter').value,$('#roster-sort').value),ids=new Set(list.map(r=>r.id)),host=$('#roster-results');document.querySelectorAll('[data-wrestler]').forEach(card=>card.hidden=!ids.has(Number(card.dataset.wrestler)));for(const r of list)host.appendChild(document.querySelector(`[data-wrestler="${r.id}"]`));$('#roster-count').textContent=list.length?list.length+' of '+state.roster.length+' wrestlers':'No wrestlers found. Try another name or filter.'};
 for(const id of ['roster-search','roster-filter','roster-sort'])$('#'+id).addEventListener(id==='roster-search'?'input':'change',update);
 update();
}
function creativePage(){return `${heading('Creative','Tag teams, rivalries, and upcoming shows.',`<button class="btn dark" id="create-team">+ Create team</button>`)}<div class="two-col"><section><div class="section-head"><h2>Your tag teams</h2><span>${state.teams.length} ESTABLISHED</span></div>${state.teams.length?state.teams.map((t,i)=>`<div class="card"><div class="team-portraits">${portrait(w(t.a))}${portrait(w(t.b))}</div><h3>${esc(t.name)}</h3><p class="note">${esc(w(t.a).name)} + ${esc(w(t.b).name)}</p><div class="audience-row"><div><span>Team chemistry</span><strong>${t.chemistry}%</strong></div><div class="bar"><i style="width:${t.chemistry}%"></i></div></div><p class="note">Book both partners on the same side in a tag match to grow chemistry and get the whole team over.</p><button class="text-btn" data-dissolve="${i}">Split the team</button></div>`).join(''):'<div class="empty">No tag teams.<br>Choose two wrestlers to form a team.</div>'}<div class="card" style="margin-top:18px"><h3>Gimmick workshop</h3><p class="note">A great gimmick needs exposure. Repackage a wrestler, then put them on the mic to win the crowd over.</p><button class="text-btn" data-workshop>Open your roster →</button></div></section><section><div class="section-head"><h2>Stories taking shape</h2><span>BUILD TO THE PAYOFF</span></div>${storyHub()}<div class="card event"><small>BOOKER’S NOTEBOOK</small><h3>Booking notes</h3><p>A bizarre match excites chaos lovers. A skilled opponent earns purists’ respect. A rivalry gives the drama crowd a reason to care.</p></div></section></div>`}
function officePage(){const fees=showParticipants().length*65,breakEven=Math.max(0,Math.ceil((showCost()-broadcastIncome())/ticketPrice()));return `${heading('Office','Finances, tour dates, and show history.')} ${stats()}${careerOffer()}${seasonGoals()}${tourSchedule()}<details class="card"><summary>Settings &amp; device</summary>${webAppPanel()}${playbackSettings()}</details><div class="two-col"><section><div class="card"><small class="muted">HOME SWEET HOME</small><h3 style="margin-top:10px">${esc(careerStage().venue)}</h3><p class="note">${venueCapacity().toLocaleString()} seats · ${money(ticketPrice(false))} weekly tickets · ${money(ticketPrice(true))} big-event tickets</p><div class="history-item"><span>Venue & production</span><strong>${money(venueCost())} / show</strong></div><div class="history-item"><span>Tonight’s appearance fees</span><strong>${money(fees)}</strong></div><div class="history-item"><span>Special rules, props &amp; fixes</span><strong>${money(showCost()-venueCost()-fees)}</strong></div><div class="history-item"><span>Break-even tickets tonight</span><strong>${breakEven} / ${venueCapacity()}</strong></div><p class="note" style="margin-top:15px">Attendance grows with reputation, star power, rivalry heat, and big-event anticipation.</p></div><div class="card"><h3>The championship picture</h3><div class="byline">${avatar(champion())}<div><strong>${esc(champion().name)}</strong><p class="muted" style="margin-top:5px">WWA World Champion</p></div></div><p class="note" style="margin-top:15px">Book one non-team title defense per show with the reigning champion. A new champion gives your promotion a reputation boost.</p></div></section><section><div class="section-head" style="padding-top:0"><h2>Show history</h2><span>${state.history.length} SHOWS</span></div>${state.history.length?state.history.map(h=>`<div class="card"><small class="muted">WEEK ${h.week}</small><h3 style="margin-top:6px">${esc(h.name)}</h3><div class="history-item"><span>Show rating</span><strong>${h.rating}/100</strong></div><div class="history-item"><span>Attendance</span><strong>${h.attendance} / ${h.capacity||300}</strong></div><div class="history-item"><span>Profit</span><strong class="${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</strong></div>${historyStoryDetails(h)}</div>`).join(''):'<div class="empty">The history books are empty.<br>Go give them something to write about.</div>'}<div class="card"><h3>Your career, to go.</h3><p class="note">Download a backup to move your career to another browser or keep it before starting over.</p><div class="backup-controls"><button class="btn" id="export-career">Back up career to Files</button><button class="btn" id="import-career">Import career</button></div></div><button class="text-btn danger" id="reset">Start a fresh promotion</button></section></div>`}
function bindPage(){bindPosterBooking();bindBookerInbox();bindRecapFollowUp();bindRosterDiscovery();if($('#next-booking'))$('#next-booking').onclick=()=>{if(weeklyBriefingPending()&&!Object.keys(state.drafts).length&&state.card.every(s=>!bookingProblems(s).length)){const inbox=document.querySelectorAll('#booker-inbox details')[state.production.choice?1:0];if(inbox){inbox.open=true;inbox.querySelector('summary').focus()}return}const index=Object.keys(state.drafts)[0]??showBlockingProblems()[0]?.index;if(index!=null)focusBookingSegment(Math.max(0,Number(index)))};document.querySelectorAll('[data-booking-edit]').forEach(b=>b.onclick=()=>openBookingDesk(Number(b.dataset.bookingEdit),null,{step:b.dataset.bookingStep,field:b.dataset.bookingField}));bindStoryControls();bindBookingStoryQueue();bindCareerControls();bindProgression();bindLiveShow();document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editSegment(Number(b.dataset.edit)));document.querySelectorAll('[data-wrestler]').forEach(b=>b.onclick=()=>editWrestler(Number(b.dataset.wrestler)));document.querySelectorAll('[data-dissolve]').forEach(b=>b.onclick=()=>{const t=state.teams.splice(Number(b.dataset.dissolve),1)[0];w(t.a).morale=clamp(w(t.a).morale-5);w(t.b).morale=clamp(w(t.b).morale-5);render();toast('The split stings. Both partners lose 5 morale.')});if($('#print-flyer'))$('#print-flyer').onclick=openPublicFlyer;if($('#guide'))$('#guide').onclick=guide;if($('#request'))$('#request').onclick=request;if($('#create-team'))$('#create-team').onclick=createTeam;if($('[data-workshop]'))$('[data-workshop]').onclick=()=>{view='roster';render()};if($('#reset'))$('#reset').onclick=reset;if($('#next-week'))$('#next-week').onclick=nextWeek}
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
function editSegment(i){openBookingDesk(i)}
function editWrestler(id){const r=w(id),last=state.incidents.find(entry=>entry.participants?.includes(id));modal('Wrestler file',`<div class="big-profile">${avatar(r)}<div><h3>${esc(r.name)}</h3><p class="note">${esc(r.desc)}</p><p class="note">Trust ${r.trust}/100 · ${r.lastSeen?'Last worked week '+r.lastSeen:'Waiting for a first booking'}</p></div></div>${last?`<p class="note"><strong>Last backstage note</strong> · ${esc(last.text)}</p>`:''}<div class="stats" style="margin:18px 0"><div class="stat"><small>Pop</small><div class="value">${r.pop}</div></div><div class="stat"><small>Skill</small><div class="value">${r.skill}</div></div><div class="stat"><small>Charisma</small><div class="value">${r.charisma}</div></div><div class="stat"><small>Morale</small><div class="value">${r.morale}</div></div></div>${field('Gimmick',`<input name="gimmick" maxlength="60" required value="${esc(r.gimmick)}">`)}${field('Allegiance',`<select name="role">${options(['Face','Heel'],r.role)}</select>`)}<p class="note">A new gimmick needs a “Debut a gimmick” promo to find its audience. Switching allegiance creates intrigue but costs 3 morale.</p>`,(f,d)=>{if(!f.get('gimmick').trim()){toast('Give this gimmick a name.');return}if(f.get('gimmick').trim()!==r.gimmick)r.newGimmick=true;r.gimmick=f.get('gimmick').trim();if(r.role!==f.get('role'))r.morale=clamp(r.morale-3);r.role=f.get('role');d.close();render();toast('Character updated. Give them a moment on the mic.')})}
function createTeam(){modal('Create a tag team',`${field('Team name',`<input name="name" maxlength="45" required placeholder="e.g. The Department of Doom">`)}${field('Partner one',`<select name="a" required><option value="" selected disabled>Choose partner one…</option>${wrestlerOptions(null)}</select>`)}${field('Partner two',`<select name="b" required><option value="" selected disabled>Choose partner two…</option>${wrestlerOptions(null)}</select>`)}<p class="note">Opposites can click. Similar personalities start with better chemistry. Each wrestler can be in one team.</p>`,(f,d)=>{const a=Number(f.get('a')),b=Number(f.get('b')),name=f.get('name').trim();if(!name){toast('Your team needs a name.');return}if(a===b){toast('Even a huge ego needs a second partner.');return}if(state.teams.some(t=>[t.a,t.b].some(id=>id===a||id===b))){toast('One of these wrestlers already has a team. Split it first.');return}state.teams.push({name,a,b,chemistry:w(a).role===w(b).role?48:35});d.close();render();toast(name+' are ready for their debut.')},'Form team')}
function request(){modal('A moment for Sweeps McKenzie',`<div class="byline">${avatar(w(10))}<strong>Sweeps McKenzie wants a clean win.</strong></div><p class="note" style="margin-top:15px">Promise him a clean victory in tonight’s card. Keep your word for +8 morale and extra crowd affection. Break it and he loses 12 morale.</p>${field('Your response',`<select name="response" required><option value="" selected disabled>Choose your response…</option><option value="yes">You’ve earned your shot. I promise.</option><option value="no">No promises. Earn it in the ring.</option></select>`)}`,(f,d)=>{state.request=f.get('response');d.close();render();toast(state.request==='yes'?'Promise made. Book Sweeps McKenzie a clean victory.':'Sweeps McKenzie understands. For now.')},'Respond')}
function guide(){modal('How to play',`<p class="note">Book four segments, including at least two matches. You choose the winners. Every fourth week is a big event.</p><div class="result"><h3>Cast with a purpose</h3><p>Choose a format on the poster, then drag a wrestler onto the bill. You can also tap a billing spot and choose a card from the roster strip, or tap a card first. Finish each draft to set the winner or promo pitch, then approve the print proof to open the doors.</p></div><div class="result"><h3>Listen backstage</h3><p>Conversations branch. Promises have deadlines. A clean qualifying win can unlock Sweeps’ rematch; an unlikely team can take his story somewhere else.</p></div><div class="result"><h3>Live decisions</h3><p>Choices change trust, momentum, chemistry or rivalry heat as well as quality. Read the hint beneath each choice. Your booked winner stays the winner.</p></div><div class="result"><h3>Keep it fresh</h3><p>A promo and a match can build a story. Repeated speeches and unchanged matchups lose impact. The audience meters measure satisfaction, not population shares.</p></div><p class="note">Progress saves on this device. Export a backup from the office. Playback preferences are available during a show and in the office.</p>`,(_,d)=>d.close(),'Let’s book')}
function reset(){modal('Start over?',`<p class="note">This resets your roster, booking, teams, and show history on this device.</p>`,(_,d)=>{state=fresh();view='book';onTitle=true;d.close();render()},'Reset promotion')}
function showCost(){return matchCost()}
function rivalryKey(a,b){return [a,b].sort((x,y)=>x-y).join('-')}
function simulate(decisions=[]){return simulateShow(decisions)}
function openPublicFlyer(){
 if(showBlockingProblems().length||Object.keys(state.drafts).length)return;
 modal('Print proof',`<div class="booking-workspace public-flyer">${showCollage(showLocation(),true)}</div>`,(_,dialog)=>{
  dialog.close();
  runShow();
 },'Approve flyer & open doors →');
 $('#modal').querySelector('.cancel').textContent='Back to Booker’s Copy';
}
function runShow(){if(state.recap||state.liveShow)return;if(weeklyBriefingPending()){openWeeklyBriefing();return;}const problems=showBlockingProblems();if(problems.length){toast(problems[0].text);return;}if(state.cash<showCost()){modal('The budget is looking rough.',`<p class="note">Tonight costs ${money(showCost())}, but you have ${money(state.cash)}. Bev will front you $1,500 in exchange for 5 reputation. You can also cancel and reduce special match costs.</p>`,(_,d)=>{state.cash+=1500;state.rep=clamp(state.rep-5);d.close();startLiveShow()},'Take Bev’s lifeline');return}startLiveShow()}
function recapPage(){const h=state.recap;return `<div class="recap-wrap">${heading('Show results','Week '+h.week+' · '+esc(h.name))}${recapFollowUp(h)}${careerOffer()}${storyRecap(h)}<div class="show-rating"><small>OFFICIAL SHOW RATING</small><strong>${h.rating}<span style="font-size:22px;color:#a9ab9d"> / 100</span></strong><h2>${h.rating>=80?'THEY’LL BE TALKING ABOUT THIS.':h.rating>=65?'THAT’S SOME GOOD WRESTLING.':h.rating>=50?'A LITTLE ROUGH. A LOT OF HEART.':'WELL… THERE’S ALWAYS NEXT WEEK.'}</h2></div><div class="stats"><div class="stat"><small>Attendance</small><div class="value">${h.attendance}</div><div class="detail">of ${h.capacity||300} seats</div></div><div class="stat"><small>Profit</small><div class="value ${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</div><div class="detail">after ${money(h.cost)} costs</div></div><div class="stat"><small>Reputation</small><div class="value">${h.repChange>=0?'+':''}${h.repChange}</div><div class="detail">now ${state.rep}/100</div></div><div class="stat"><small>Bank balance</small><div class="value">${money(state.cash)}</div><div class="detail">the doors stay open</div></div></div><div class="section-head"><h2>How it went down</h2><span>THE GOOD, THE BAD & THE BIZARRE</span></div>${h.results.map(r=>`<div class="result">${r.rating!==null?`<span class="score">${r.rating}</span>`:''}<small class="muted">${esc(r.label)}</small><h3 style="margin-top:5px">${esc(r.headline)}</h3><p>${esc(r.explanation)}</p>${recapDecision(r)}</div>`).join('')}<div class="card" style="margin-top:22px"><h3>The crowd verdict</h3>${audienceRows()}<p class="note">${Object.entries(h.crowdDelta).map(([k,v])=>`${{chaos:'Chaos lovers',purists:'Purists',drama:'Drama addicts'}[k]} ${v>=0?'+':''}${v}`).join(' · ')}</p></div><div class="booking-footer"><p>Progress saved.<br>Continue to book next week’s card.</p><button class="btn primary" id="next-week">Continue to week ${state.week+1} →</button></div></div>`}
function nextWeek(){state.week++;state.recap=null;state.liveShow=null;state.request=null;state.card=defaultCard();state.drafts={};state.production={week:state.week,choice:null};state.weeklyBriefing=null;view='book';render();window.scrollTo(0,0)}
render();
