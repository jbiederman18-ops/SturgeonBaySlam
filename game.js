'use strict';
const KEY='cheap-pop-v2';
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
  }
];
const defaultCard=()=>Array.from({length:4},()=>({kind:null}));
function fresh(){return storyDefaults({gameVersion:4,started:false,week:1,cash:4250,rep:24,roster:structuredClone(initialRoster),card:defaultCard(),crowd:{chaos:44,purists:52,drama:38},teams:[],history:[],request:null,view:'book',recap:null,liveShow:null,rivalries:{},eventName:'PAYBACK AT THE POTLUCK'})}
const humanRosterCanon={"4":{"oldGimmick":"A sinister rally towel","gimmick":"Terrifying terrycloth showman","desc":"A human brawler in yellow terrycloth ring gear. Waves a rally towel like a weapon, then complains when the crowd waves back.","mask":false},"8":{"oldGimmick":"Glacial trash-talker","gimmick":"Glacial trash-talker","desc":"A silver-haired human striker in ice-blue ring gear. Every catchphrase arrives with an unnecessary weather forecast.","mask":true},"9":{"oldGimmick":"Pocket-sized powerhouse","gimmick":"Mouse-eared pocket powerhouse","desc":"A human powerhouse with a mouse-ear headband, painted whiskers and enormous suplexes. Takes being called adorable as a personal challenge.","mask":false},"17":{"oldGimmick":"Sentient insurance contract","gimmick":"Insurance salesman of doom","desc":"A bespectacled human grappler with a briefcase full of policies. Every loss is an exclusion. Every headlock requires a signature.","mask":false},"20":{"oldGimmick":"Holiday menace turned hopeless romantic","gimmick":"Holiday menace turned hopeless romantic","desc":"A human wrestler in green-and-red holiday gear, green-dyed hair and heart-shaped face paint. Used to steal decorations; now leaves love notes in the turnbuckles.","mask":false},"22":{"oldGimmick":"Fish out of water, fighter in the ring","gimmick":"Flounder-themed escape artist","desc":"A human wrestler in teal gear with fin-shaped shoulder pads. Flops magnificently, counters unexpectedly, and treats every rope break as returning to shore.","mask":false},"23":{"oldGimmick":"Sweet presentation, vicious citrus","gimmick":"Sweet looks. Sour intentions.","desc":"A human wrestler in lemon-yellow ring gear with a citrus brooch. A sweet smile, sharp counters and an extremely sour attitude.","mask":false},"24":{"oldGimmick":"Patron saint of the afterparty","gimmick":"Patron saint of the afterparty","desc":"A human ring-robed party host with a halo headband. Wants every comeback to feel like the whole room just got invited.","mask":false},"29":{"oldGimmick":"Floating residential powerhouse","gimmick":"Waterfront wrecking crew","desc":"A large human powerhouse in a captain’s hat and porthole-patterned singlet. Insists every home match is a waterfront property.","mask":false},"32":{"oldGimmick":"A pair of boots with title ambitions","gimmick":"Boot-obsessed football enforcer","desc":"A human striker who carries his prized football cleats over one shoulder. Superb footwork. Treats those boots like the real stars of the show.","mask":false},"33":{"oldGimmick":"Wobbly dessert demolition expert","gimmick":"Custard-loving demolition expert","desc":"A cheerful human heavyweight in a custard-yellow singlet, carrying a dessert spoon. Never looks balanced. Almost never lands where you expect.","mask":false}};
function mergeRosterExpansion(saved){
 if(!saved||!Array.isArray(saved.roster)||saved.roster.length===0)return fresh();
 migrateGameBranding(saved);
 const present=new Set(saved.roster.map(r=>r.id));
 for(const wrestler of initialRoster)if(!present.has(wrestler.id)){saved.roster.push(structuredClone(wrestler));present.add(wrestler.id)}
 // Migrate factory character descriptions, preserving player-written gimmicks and all progress.
 for(const wrestler of saved.roster){const update=humanRosterCanon[wrestler.id];if(!update)continue;if(wrestler.gimmick===update.oldGimmick)wrestler.gimmick=update.gimmick;wrestler.desc=update.desc;wrestler.mask=update.mask}
 saved.started??=true;saved.gameVersion=4;
 if(!saved.liveShow)saved.card=saved.card.map(segment=>segment.draft?segment:normalizeMatch(segment,saved.roster,saved.teams));
 storyDefaults(saved);
 return saved;
}
let state;try{state=mergeRosterExpansion(JSON.parse(localStorage.getItem(KEY)))}catch{state=fresh()}
let view=state.view||'book',onTitle=true;
const $=s=>document.querySelector(s),w=id=>id==null?undefined:state.roster.find(r=>r.id===Number(id)),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),money=n=>'$'+n.toLocaleString('en-US'),clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
function save(){state.view=view;try{localStorage.setItem(KEY,JSON.stringify(state))}catch{toast('Browser storage is unavailable; keep this tab open to continue.')}}
function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',3500)}
function portrait(r){return wrestlerArt(r)}
function avatar(r){return `<div class="portrait">${portrait(r)}</div>`}
function champion(){return state.roster.find(r=>r.champ)}
function isEvent(){return state.week%4===0}
function showName(){return isEvent()?'Sturgeon Bay Slam · '+state.eventName:'Sturgeon Bay Slam'}
function heading(title,sub,action=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`}
function stats(){return `<div class="stats"><div class="stat"><div class="eyebrow muted">Bank balance</div><div class="value money">${money(state.cash)}</div><div class="detail">${state.history.length?'Last show: '+(state.history[0].profit>=0?'+':'−')+money(Math.abs(state.history[0].profit)):'Enough to keep the lights on'}</div></div><div class="stat"><div class="eyebrow muted">Reputation</div><div class="value">${state.rep}<span class="muted" style="font-size:17px"> / 100</span></div><div class="detail">${state.rep<40?'Local cult favorite':state.rep<70?'The talk of the town':'Independent sensation'}</div></div><div class="stat"><div class="eyebrow muted">Your roster</div><div class="value">${state.roster.length} <span class="muted" style="font-size:17px">wrestlers</span></div><div class="detail">${state.teams.length} teams · 1 championship</div></div><div class="stat"><div class="eyebrow muted">Next big event</div><div class="value">${isEvent()?'TONIGHT':(4-state.week%4)+' weeks'}</div><div class="detail">Payback at the Potluck</div></div></div>`}
function render(){if(onTitle){renderTitle();return}document.body.classList.toggle('show-live',!!state.liveShow);save();const nav=[['book','▤','Book show'],['roster','♟','Roster'],['creative','✦','Creative'],['office','▥','Office']];$('#app').innerHTML=`<aside class="sidebar"><div class="brand slam-brand">STURGEON<br><span>BAY SLAM</span><span class="brand-star"> ★</span></div><div class="brand-sub">SMALL VENUES. BIG NONSENSE.</div><nav class="nav" aria-label="Main navigation">${nav.map(([v,i,l])=>`<button data-nav="${v}" class="${view===v?'active':''}" ${view===v?'aria-current="page"':''}><span class="icon">${i}</span>${l}</button>`).join('')}</nav><div class="side-bottom"><small class="muted">Your promotion</small><strong>Wisconsin Wrestling Alliance</strong><span><i class="live-dot"></i>Independent &amp; barely solvent</span><div style="margin-top:15px;font-size:10px" class="muted">Big dreams. Small venues.<br>Questionable gimmicks.</div></div></aside><main class="main"><header class="topbar"><div><button class="mobile-brand title-return" data-title-menu>STURGEON <span>BAY SLAM ★</span></button><button class="desktop-title title-return" data-title-menu>STURGEON BAY SLAM ★</button></div><div class="row"><span class="season">SEASON ${Math.ceil(state.week/12)} &nbsp;/&nbsp; WEEK ${state.week}</span><span class="demo">CAREER MODE</span></div></header><div class="content">${state.liveShow?liveShowPage():state.recap?recapPage():view==='book'?bookPage():view==='roster'?rosterPage():view==='creative'?creativePage():officePage()}</div></main>`;document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{if(state.liveShow){toast('You’re on air. Finish the show to return to your office.');return}if(state.recap){toast('Continue to next week to return to your office.');return}view=b.dataset.nav;render();window.scrollTo(0,0)});bindPage()}
function bookPage(){return `${heading('Make some noise.','Book something stupid. Make them love it.',`<button class="btn" id="guide">How to play ↗</button>`)}${stats()}<div class="layout"><section><div class="poster"><div><small style="color:var(--yellow)">${isEvent()?'MONTHLY SUPER SHOW':'YOUR WEEKLY SHOW'} · WEEK ${state.week}</small><h2>${esc(showName())}</h2><p>St. Elbow’s Community Hall &nbsp;·&nbsp; 300 capacity &nbsp;·&nbsp; ${isEvent()?'$22':'$12'} tickets</p></div><div class="stamp"><small>Est. capacity</small><strong>300</strong><small>loud humans</small></div></div><div class="section-head"><h2>Tonight’s card</h2><span>${state.card.filter(segment=>!bookingProblems(segment).length).length} / 4 BOOKED</span></div>${state.card.map((s,i)=>segment(s,i)).join('')}${readinessPanel()}<div class="booking-footer"><p>Estimated show cost <strong>${money(showCost())}</strong><br>Your progress saves on this device.</p><button class="btn primary" id="run" ${showBlockingProblems().length?'disabled':''}>Run the show <span>→</span></button></div>${storyHub()}<div class="sponsor">Proudly sponsored by Bev’s Discount Folding Chairs.</div></section><aside class="right-rail">${backstageCard()}${productionPanel()}<div class="card"><h3>Audience satisfaction</h3><p class="note">Independent enthusiasm meters, not audience shares. Fresh ideas sustain them.</p>${audienceRows()}</div><div class="card event"><small>THE ROAD TO YOUR BIG EVENT</small><h3>PAYBACK AT<br>THE POTLUCK</h3><p>Build a challenger. Settle a grudge.<br>Bring a dish to share.</p><div class="event-progress">${[1,2,3,4].map(n=>`<span class="${n<=((state.week-1)%4+1)?'done':''}"></span>`).join('')}</div></div></aside></div>`}
function audienceRows(){return [['chaos','Chaos lovers','The stranger, the better'],['purists','Wrestling purists','Skill. Stakes. Clean finishes.'],['drama','Drama addicts','Give them a story']].map(([key,label,tip])=>`<div class="audience-row" title="${tip}"><div><span>${label}</span><strong>${state.crowd[key]}/100</strong></div><div class="bar"><i style="width:${state.crowd[key]}%;background:${key==='chaos'?'var(--red)':key==='drama'?'#a68c48':'var(--green)'}"></i></div></div>`).join('')}
function fighterCard(r,{winner=false,label=''}={}){
 return `<div class="fighter-card ${winner?'is-winner':''}" style="--character-color:${r.color}"><div class="fighter-art">${portrait(r)}${ratingBadge(r)}${r.champ?'<span class="fighter-champion">★ CHAMPION</span>':''}${winner?'<span class="booked-stamp">GETS THE WIN</span>':''}</div><div class="fighter-caption"><strong>${esc(r.name)}</strong><div class="fighter-meta"><span class="role-stamp ${r.role.toLowerCase()}">${r.role}</span><span class="morale-brief">Morale ${r.morale}</span></div>${ratingStrip(r)}${label?`<p>${esc(label)}</p>`:''}</div></div>`;
}
function segment(s,i){
 if(!s.kind||s.draft)return `<article class="segment empty-segment"><div><small>SLOT 0${i+1} · ${i===3?'MAIN EVENT':i===0?'OPENER':'MIDCARD'}</small><h3>${i===3?'Send them home shouting.':i===0?'Start with a bang.':'What goes here?'}</h3><p>${s.draft||state.drafts[i]?'Draft saved. Finish casting when you’re ready.':'A match. A microphone. An idea only you could book.'}</p></div><button class="btn" data-edit="${i}">+ Book segment</button>${state.drafts[i]?`<button class="text-btn" data-clear="${i}">Discard draft</button>`:''}</article>`;
 const promo=s.kind==='promo',a=w(s.a),sides=promo?[]:matchSides(s),winning=promo?[]:sides[winningSide(s)]||[s.winner];
 return `<article class="segment ${promo?'promo-segment':''}"><div class="segment-top"><span class="badge ${i===3?'main-event':''}"><span class="segment-order">0${i+1}</span> ${i===3?'★ MAIN EVENT':promo?'MIC TIME':i===0?'OPENING MATCH':'MIDCARD MATCH'}</span><button class="edit" data-edit="${i}" aria-label="Edit segment ${i+1}">${state.drafts[i]?'Edit saved draft':'Edit booking'} ↗</button></div>${promo?`<div class="promo-preview"><div class="promo-portrait" style="--character-color:${a.color}">${portrait(a)}</div><div class="promo-pitch"><span class="role-stamp ${a.role.toLowerCase()}">${a.role}</span><h3>${esc(a.name)}</h3><p>“${esc(s.concept||ringVoices[s.a].open)}”</p></div></div>`:`<div class="match-lineup ${sides.length>2?'free-for-all':''}">${sides.map(side=>`<div class="lineup-side">${side.length>1?`<h4>${esc(sideLabel(side))}</h4>`:''}<div class="lineup-members">${side.map(id=>fighterCard(w(id),{winner:winning.includes(id)})).join('')}</div></div>`).join('')}</div>`}<div class="segment-actions"><button class="text-btn" data-move="${i}:-1" ${i===0?'disabled':''} aria-label="Move segment ${i+1} earlier">↑ Earlier</button><button class="text-btn" data-move="${i}:1" ${i===3?'disabled':''} aria-label="Move segment ${i+1} later">↓ Later</button><button class="text-btn" data-clear="${i}">Clear booking</button></div><div class="segment-foot"><strong>${esc(promo?s.hook+(s.target!=null?' → '+w(s.target).name:''):matchLabel(s))}</strong><span>${promo?'5 MINUTES ON THE MIC':(s.title?'WWA TITLE · ':'')+esc(s.finish)+' · 12 MIN'}</span></div></article>`;
}
function rosterPage(){return `${heading('Meet your beautiful misfits.',state.roster.length+' big personalities. One very small locker room.')}<div class="help">Tap a wrestler to inspect their skills, change their gimmick, or switch their allegiance. Popularity draws a crowd; skill and charisma help keep it.</div><div class="roster-grid">${state.roster.map(r=>`<button class="wrestler" data-wrestler="${r.id}"><div class="wrestler-art" style="--character-color:${r.color}">${portrait(r)}${ratingBadge(r)}<span class="badge role-${r.role.toLowerCase()}">${r.champ?'★ WWA CHAMPION':r.role.toUpperCase()}</span></div><div class="wrestler-info"><h3>${esc(r.name)}</h3><p>${esc(r.gimmick)}</p>${ratingStrip(r)}<p class="roster-morale">Morale ${r.morale}/100 · Trust ${r.trust}/100<br>Momentum ${signed(r.momentum)}</p></div></button>`).join('')}</div>`}
function creativePage(){return `${heading('Bad ideas. Great wrestling.','Give the crowd something they never knew they needed.',`<button class="btn dark" id="create-team">+ Create team</button>`)}<div class="two-col"><section><div class="section-head"><h2>Your tag teams</h2><span>${state.teams.length} ESTABLISHED</span></div>${state.teams.length?state.teams.map((t,i)=>`<div class="card"><div class="team-portraits">${portrait(w(t.a))}${portrait(w(t.b))}</div><h3>${esc(t.name)}</h3><p class="note">${esc(w(t.a).name)} + ${esc(w(t.b).name)}</p><div class="audience-row"><div><span>Team chemistry</span><strong>${t.chemistry}%</strong></div><div class="bar"><i style="width:${t.chemistry}%"></i></div></div><p class="note">Book both partners on the same side in a tag match to grow chemistry and get the whole team over.</p><button class="text-btn" data-dissolve="${i}">Split the team</button></div>`).join(''):'<div class="empty">No tag teams. Yet.<br>Put two weirdos together and give them a name.</div>'}<div class="card" style="margin-top:18px"><h3>Gimmick workshop</h3><p class="note">A great gimmick needs exposure. Repackage a wrestler, then put them on the mic to win the crowd over.</p><button class="text-btn" data-workshop>Open your roster →</button></div></section><section><div class="section-head"><h2>Stories taking shape</h2><span>BUILD TO THE PAYOFF</span></div>${storyHub()}<div class="card event"><small>BOOKER’S NOTEBOOK</small><h3>Make it make sense.<br>Then make it weird.</h3><p>A bizarre match excites chaos lovers. A skilled opponent earns purists’ respect. A rivalry gives the drama crowd a reason to care.</p></div></section></div>`}
function officePage(){return `${heading('Keep the lights on.','A wrestling empire starts with a folding table.')} ${stats()}${seasonGoals()}${playbackSettings()}<div class="two-col"><section><div class="card"><small class="muted">HOME SWEET HOME</small><h3 style="margin-top:10px">St. Elbow’s Community Hall</h3><p class="note">300 seats · $12 weekly tickets · $22 big-event tickets</p><div class="history-item"><span>Venue & production</span><strong>$650 / show</strong></div><div class="history-item"><span>Appearance fees</span><strong>$65 / wrestler</strong></div><div class="history-item"><span>Special match props</span><strong>$120 / match</strong></div><p class="note" style="margin-top:15px">Attendance grows with reputation, star power, rivalry heat, and big-event anticipation.</p></div><div class="card"><h3>The championship picture</h3><div class="byline">${avatar(champion())}<div><strong>${esc(champion().name)}</strong><p class="muted" style="margin-top:5px">WWA World Champion</p></div></div><p class="note" style="margin-top:15px">Put the belt on the line in any match. A new champion gives your promotion a reputation boost.</p></div></section><section><div class="section-head" style="padding-top:0"><h2>Show history</h2><span>${state.history.length} SHOWS</span></div>${state.history.length?state.history.map(h=>`<div class="card"><small class="muted">WEEK ${h.week}</small><h3 style="margin-top:6px">${esc(h.name)}</h3><div class="history-item"><span>Show rating</span><strong>${h.rating}/100</strong></div><div class="history-item"><span>Attendance</span><strong>${h.attendance} / 300</strong></div><div class="history-item"><span>Profit</span><strong class="${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</strong></div>${historyStoryDetails(h)}</div>`).join(''):'<div class="empty">The history books are empty.<br>Go give them something to write about.</div>'}<div class="card"><h3>Your career, to go.</h3><p class="note">Download a backup to move your career to another browser or keep it before starting over.</p><div class="backup-controls"><button class="btn" id="export-career">Export career</button><button class="btn" id="import-career">Import career</button></div></div><button class="text-btn danger" id="reset">Start a fresh promotion</button></section></div>`}
function bindPage(){bindStoryControls();bindCareerControls();bindLiveShow();document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editSegment(Number(b.dataset.edit)));document.querySelectorAll('[data-wrestler]').forEach(b=>b.onclick=()=>editWrestler(Number(b.dataset.wrestler)));document.querySelectorAll('[data-dissolve]').forEach(b=>b.onclick=()=>{const t=state.teams.splice(Number(b.dataset.dissolve),1)[0];w(t.a).morale=clamp(w(t.a).morale-5);w(t.b).morale=clamp(w(t.b).morale-5);render();toast('The split stings. Both partners lose 5 morale.')});if($('#run'))$('#run').onclick=runShow;if($('#guide'))$('#guide').onclick=guide;if($('#request'))$('#request').onclick=request;if($('#create-team'))$('#create-team').onclick=createTeam;if($('[data-workshop]'))$('[data-workshop]').onclick=()=>{view='roster';render()};if($('#reset'))$('#reset').onclick=reset;if($('#next-week'))$('#next-week').onclick=nextWeek}
function modal(title,body,submit,label='Save changes'){const d=$('#modal');d.oncancel=null;d.className='';d.innerHTML=`<form id="modal-form"><div class="modal-head"><h2>${title}</h2><button type="button" class="close" aria-label="Close dialog">×</button></div>${body}<div class="modal-actions"><button type="button" class="btn cancel">Cancel</button><button class="btn dark" type="submit">${label}</button></div></form>`;d.querySelector('.close').onclick=d.querySelector('.cancel').onclick=()=>d.close();d.querySelector('form').onsubmit=e=>{e.preventDefault();submit(new FormData(e.currentTarget),d)};d.showModal()}
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
function editWrestler(id){const r=w(id);modal('Wrestler file',`<div class="big-profile">${avatar(r)}<div><h3>${esc(r.name)}</h3><p class="note">${esc(r.desc)}</p></div></div><div class="stats" style="margin:18px 0"><div class="stat"><small>Pop</small><div class="value">${r.pop}</div></div><div class="stat"><small>Skill</small><div class="value">${r.skill}</div></div><div class="stat"><small>Charisma</small><div class="value">${r.charisma}</div></div><div class="stat"><small>Morale</small><div class="value">${r.morale}</div></div></div>${field('Gimmick',`<input name="gimmick" maxlength="60" required value="${esc(r.gimmick)}">`)}${field('Allegiance',`<select name="role">${options(['Face','Heel'],r.role)}</select>`)}<p class="note">A new gimmick needs a “Debut a gimmick” promo to find its audience. Switching allegiance creates intrigue but costs 3 morale.</p>`,(f,d)=>{if(!f.get('gimmick').trim()){toast('Give this gimmick a name.');return}if(f.get('gimmick').trim()!==r.gimmick)r.newGimmick=true;r.gimmick=f.get('gimmick').trim();if(r.role!==f.get('role'))r.morale=clamp(r.morale-3);r.role=f.get('role');d.close();render();toast('Character updated. Give them a moment on the mic.')})}
function createTeam(){modal('Two weirdos. One dream.',`${field('Team name',`<input name="name" maxlength="45" required placeholder="e.g. The Department of Doom">`)}${field('Partner one',`<select name="a" required><option value="" selected disabled>Choose partner one…</option>${wrestlerOptions(null)}</select>`)}${field('Partner two',`<select name="b" required><option value="" selected disabled>Choose partner two…</option>${wrestlerOptions(null)}</select>`)}<p class="note">Opposites can click. Similar personalities start with better chemistry. Each wrestler can be in one team.</p>`,(f,d)=>{const a=Number(f.get('a')),b=Number(f.get('b')),name=f.get('name').trim();if(!name){toast('Your team needs a name.');return}if(a===b){toast('Even a huge ego needs a second partner.');return}if(state.teams.some(t=>[t.a,t.b].some(id=>id===a||id===b))){toast('One of these wrestlers already has a team. Split it first.');return}state.teams.push({name,a,b,chemistry:w(a).role===w(b).role?48:35});d.close();render();toast(name+' are ready for their debut.')},'Form team')}
function request(){modal('A moment for Sweeps McKenzie',`<div class="byline">${avatar(w(10))}<strong>Sweeps McKenzie wants a clean win.</strong></div><p class="note" style="margin-top:15px">Promise him a clean victory in tonight’s card. Keep your word for +8 morale and extra crowd affection. Break it and he loses 12 morale.</p>${field('Your response',`<select name="response" required><option value="" selected disabled>Choose your response…</option><option value="yes">You’ve earned your shot. I promise.</option><option value="no">No promises. Earn it in the ring.</option></select>`)}`,(f,d)=>{state.request=f.get('response');d.close();render();toast(state.request==='yes'?'Promise made. Book Sweeps McKenzie a clean victory.':'Sweeps McKenzie understands. For now.')},'Respond')}
function guide(){modal('Your show. Their stories.',`<p class="note">Book four segments, including at least two matches. You choose the winners. Every fourth week is a big event.</p><div class="result"><h3>Cast with a purpose</h3><p>Choose a format, cast your wrestlers, then set the stakes and finish. Promos can name a target and create a challenge. Custom lines are performed, not judged for their wording.</p></div><div class="result"><h3>Listen backstage</h3><p>Conversations branch. Promises have deadlines. A clean qualifying win can unlock Sweeps’ rematch; an unlikely team can take his story somewhere else.</p></div><div class="result"><h3>Call the moment</h3><p>Choices change trust, momentum, chemistry or rivalry heat as well as quality. Read the hint beneath each choice. Your booked winner stays the winner.</p></div><div class="result"><h3>Keep it fresh</h3><p>A promo and a match can build a story. Repeated speeches and unchanged matchups lose impact. The audience meters measure satisfaction, not population shares.</p></div><p class="note">Progress saves on this device. Export a backup from the office. Playback preferences are available during a show and in the office.</p>`,(_,d)=>d.close(),'Let’s book')}
function reset(){modal('Start over?',`<p class="note">This resets your roster, booking, teams, and show history on this device.</p>`,(_,d)=>{state=fresh();view='book';onTitle=true;d.close();render()},'Reset promotion')}
function showCost(){return matchCost()}
function rivalryKey(a,b){return [a,b].sort((x,y)=>x-y).join('-')}
function simulate(decisions=[]){return simulateShow(decisions)}
function runShow(){if(state.recap||state.liveShow)return;const problems=showBlockingProblems();if(problems.length){toast(problems[0].text);return;}if(state.cash<showCost()){modal('The budget is looking rough.',`<p class="note">Tonight costs ${money(showCost())}, but you have ${money(state.cash)}. Bev will front you $1,500 in exchange for 5 reputation. You can also cancel and reduce special match costs.</p>`,(_,d)=>{state.cash+=1500;state.rep=clamp(state.rep-5);d.close();startLiveShow()},'Take Bev’s lifeline');return}startLiveShow()}
function recapPage(){const h=state.recap;return `<div class="recap-wrap">${heading('That’s a wrap, boss.','Week '+h.week+' · '+esc(h.name))}${storyRecap(h)}<div class="show-rating"><small>OFFICIAL SHOW RATING</small><strong>${h.rating}<span style="font-size:22px;color:#a9ab9d"> / 100</span></strong><h2>${h.rating>=80?'THEY’LL BE TALKING ABOUT THIS.':h.rating>=65?'THAT’S SOME GOOD WRESTLING.':h.rating>=50?'A LITTLE ROUGH. A LOT OF HEART.':'WELL… THERE’S ALWAYS NEXT WEEK.'}</h2></div><div class="stats"><div class="stat"><small>Attendance</small><div class="value">${h.attendance}</div><div class="detail">of 300 seats</div></div><div class="stat"><small>Profit</small><div class="value ${h.profit>=0?'green':'red'}">${h.profit>=0?'+':'−'}${money(Math.abs(h.profit))}</div><div class="detail">after ${money(h.cost)} costs</div></div><div class="stat"><small>Reputation</small><div class="value">${h.repChange>=0?'+':''}${h.repChange}</div><div class="detail">now ${state.rep}/100</div></div><div class="stat"><small>Bank balance</small><div class="value">${money(state.cash)}</div><div class="detail">the doors stay open</div></div></div><div class="section-head"><h2>How it went down</h2><span>THE GOOD, THE BAD & THE BIZARRE</span></div>${h.results.map(r=>`<div class="result">${r.rating!==null?`<span class="score">${r.rating}</span>`:''}<small class="muted">${esc(r.label)}</small><h3 style="margin-top:5px">${esc(r.headline)}</h3><p>${esc(r.explanation)}</p>${recapDecision(r)}</div>`).join('')}<div class="card" style="margin-top:22px"><h3>The crowd verdict</h3>${audienceRows()}<p class="note">${Object.entries(h.crowdDelta).map(([k,v])=>`${{chaos:'Chaos lovers',purists:'Purists',drama:'Drama addicts'}[k]} ${v>=0?'+':''}${v}`).join(' · ')}</p></div><div class="booking-footer"><p>New grudges. Bigger dreams.<br>Your next show is waiting.</p><button class="btn primary" id="next-week">Continue to week ${state.week+1} →</button></div></div>`}
function nextWeek(){state.week++;state.recap=null;state.liveShow=null;state.request=null;state.card=defaultCard();state.drafts={};state.production={week:state.week,choice:null};view='book';render();window.scrollTo(0,0)}
render();
