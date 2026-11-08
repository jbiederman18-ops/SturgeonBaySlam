'use strict';
// The town map: where each week starts. After the results, you land in whichever town this week's
// show is in. Featured wrestlers who asked to see you are pinned where they'll be; the evenings you
// have left before show night sit on top. Tap a pin to read their invitation and spend the evening.
// Everyone else in the featured eight is on the map too, dimmed: around town, but not free this week.

// Water and street layouts. Coordinates are in a 400×360 map; `spots` hold the three places near the
// hall first, then five around town. `marks` are labelled landmarks.
const MAP_LAYOUTS={
 canal:{water:'M0 148C70 142 120 152 170 170C230 190 300 176 400 158V202C300 222 230 232 170 214C120 198 70 188 0 194Z',
  venue:[215,88],spots:[[165,52],[268,60],[290,128],[360,100],[66,90],[192,296],[86,272],[312,296]],
  bridges:[[138,161,48],[262,186,48]]},
 west:{water:'M0 0H122C100 70 146 140 112 214C92 270 126 318 104 360H0Z',
  venue:[250,170],spots:[[200,120],[300,120],[250,240],[352,60],[176,40],[178,300],[318,292],[370,206]]},
 east:{water:'M400 0H288C306 86 266 160 298 232C318 292 282 330 300 360H400Z',
  venue:[150,170],spots:[[100,120],[200,120],[150,240],[48,60],[226,40],[60,290],[220,300],[34,198]]},
 north:{water:'M0 0H400V82C330 112 262 70 200 96C140 122 70 86 0 108Z',island:'M300 30C324 18 362 22 370 38C374 52 340 60 318 54C300 50 290 40 300 30Z',
  venue:[200,200],spots:[[150,150],[250,150],[200,270],[60,150],[350,150],[84,300],[318,300],[200,334]]},
 river:{water:'M0 246C90 228 160 286 250 262C320 244 360 268 400 254V296C360 312 320 290 250 310C160 334 92 280 0 298Z',
  venue:[200,140],bridges:[[200,276,64]],spots:[[150,90],[250,90],[200,210],[58,70],[344,68],[60,190],[346,200],[200,330]]},
 lakes:{water:'M40 60C70 40 120 50 128 82C134 112 90 128 60 118C34 110 20 80 40 60ZM300 250C330 230 380 244 384 276C386 306 344 318 316 306C292 296 282 266 300 250ZM250 40C268 32 296 40 294 58C292 74 264 76 252 66C244 58 242 46 250 40Z',
  venue:[200,170],spots:[[150,120],[250,120],[200,240],[340,110],[60,196],[100,300],[220,310],[340,190]]},
 hills:{water:'M0 318C60 306 110 330 170 322C240 312 300 336 400 326V334C300 344 240 322 170 330C110 338 60 316 0 326Z',hills:true,
  venue:[200,160],spots:[[150,110],[250,110],[200,230],[58,70],[344,70],[64,236],[340,240],[200,310]]}
};

// Every town the show visits. `marks` are [name, x, y]; the venue is drawn from the show itself.
// `haunts` put each featured wrestler where their character would want to be in that town: [place, x, y].
// Sturgeon Bay uses `fixed` spots and each wrestler's own home place from routes.js.
const TOWN_MAPS={
 'Sturgeon Bay':{layout:'canal',tint:'#e9dfc7',note:'Home. Two bridges, one canal, and a hall that smells like folding chairs.',
  marks:[['Ship canal',40,176],['Lighthouse point',360,226],['Cherry orchards',356,30]],
  // Home spots match each wrestler's own place: the library, the lanes, the Moose Lodge and so on.
  fixed:{10:[165,52],0:[268,60],37:[290,128],1:[360,100],18:[66,90],20:[192,296],31:[86,272],34:[312,296]},
  extra:[['Public library',86,238],['Door County Lanes',312,262],['Moose Lodge',192,262],['Training barn',360,66]]},
 'Sister Bay':{layout:'west',tint:'#ece2c8',note:'The marina is full of boats named after people’s wives.',marks:[['Marina',56,90],['Bluff park',330,330],['Fish fry tent',84,250]],
  haunts:{0:["Bluff overlook",340,300],1:["Village ballfield",300,110],10:["Marina boardwalk",160,80],18:["Yacht club veranda",170,200],20:["Christmas shop",230,50],31:["Village hall",300,230],34:["Bait shop back room",170,300],37:["Goats-on-the-roof lawn",360,150]}},
 'Fish Creek':{layout:'west',tint:'#eee0c6',note:'The fish boil kettle can be seen from every corner of town.',marks:[['Fish boil kettle',200,250],['State park road',340,330],['Harbor',52,120]],
  haunts:{0:["Outdoor theater",330,60],1:["State park trailhead",330,300],10:["Fish boil kettle",200,250],18:["Inn tea porch",180,110],20:["Candy & gift shop",250,50],31:["Visitor center",330,180],34:["Harbor boathouse",155,180],37:["Sunset beach",170,320]}},
 'Egg Harbor':{layout:'west',tint:'#efe4cc',note:'The pie raffle is the most heavily guarded room in Door County.',marks:[['Cherry stand',340,250],['Harbor',52,200],['Pie raffle table',150,330]],
  haunts:{0:["Harbor bluff",330,50],1:["Town gym",300,130],10:["Church basement",200,60],18:["Pie raffle table",160,300],20:["Cherry stand",340,240],31:["Town hall",250,250],34:["Marina fuel dock",160,190],37:["Dog beach",180,110]}},
 'Baileys Harbor':{layout:'east',tint:'#e6e2d0',note:'Two lighthouses. Nobody agrees which one is the front.',marks:[['Range lights',340,70],['Breakwater',350,250],['Bait shop',120,330]],
  haunts:{0:["Old church steeple",60,60],1:["Ballfield",50,200],10:["Breakwater path",250,250],18:["Supper club booth",210,60],20:["Gift shop window",80,300],31:["Between the lighthouses",255,90],34:["Bait shop back room",140,320],37:["Beach park",240,180]}},
 'Algoma':{layout:'east',tint:'#ebe2cb',note:'The fishing-club table already knows where you’re eating.',marks:[['Pier',350,180],['Winery',90,40],['Fishing club',150,280]],
  haunts:{0:["Winery cellar",90,50],1:["End of the pier",260,190],10:["Fishing club kitchen",180,290],18:["Fishing club table",110,270],20:["Lighthouse gift shop",230,60],31:["City hall",50,170],34:["Charter boat cabin",250,300],37:["Crescent Beach",240,120]}},
 'Kewaunee':{layout:'east',tint:'#e8ddc4',note:'The borrowed flatbed is parked where everyone can see it.',marks:[['Harbor',340,300],['Courthouse',60,230],['Flatbed lot',230,250]],
  haunts:{0:["Courthouse steps",60,220],1:["Flatbed lot",230,250],10:["Harbor walk",250,320],18:["Old jail museum",80,300],20:["Hardware store holiday aisle",210,60],31:["County clerk’s office",50,120],34:["Harbor tugboat",260,160],37:["Dog park",110,60]}},
 'New Glarus':{layout:'hills',tint:'#efe3c6',note:'Cowbells on every porch. Some of them are for you.',marks:[['Chalet square',290,30],['Brewery hill',110,30],['Swiss flag pole',330,300]],
  haunts:{0:["Wilhelm Tell stage",60,150],1:["Swiss wrestling ring",140,250],10:["Chalet square",290,50],18:["Bakery tea counter",250,240],20:["Christmas chalet",350,150],31:["Under the Swiss flag",330,290],34:["Brewery cellar",110,50],37:["Cowbell porch",60,290]}},
 'Mineral Point':{layout:'hills',tint:'#e6dcc6',note:'Stone cottages, steep streets, pasties everywhere.',marks:[['Pendarvis lane',100,180],['Pasty shop',300,190],['Old mine shaft',90,300]],
  haunts:{0:["Shake Rag Alley theater",300,60],1:["Steep street steps",200,260],10:["Pendarvis lane",100,170],18:["Hotel tea parlor",330,270],20:["Pottery studio",190,50],31:["Town library",60,60],34:["Old mine shaft",90,290],37:["Pasty shop back door",300,190]}},
 'Spring Green':{layout:'river',tint:'#e6e6c8',note:'The river is right there. The theater set is not to be stapled.',marks:[['Wisconsin River',300,284],['Theater hill',330,30],['Riverside landing',90,236]],
  haunts:{0:["Theater hill",330,40],1:["Riverside landing",90,215],10:["Theater ticket booth",260,200],18:["Garden café",60,60],20:["General store",200,40],31:["Middle of the bridge",200,276],34:["Canoe rental shed",324,328],37:["River bank",94,328]}},
 'Viroqua':{layout:'hills',tint:'#e9dcc0',note:'The fairgrounds gates are locked. Bev checked twice.',marks:[['Fairgrounds',300,300],['Co-op',110,310],['Main Street',200,40]],
  haunts:{0:["Temple Theatre",200,50],1:["Ballfield bleachers",60,170],10:["Main Street sidewalks",100,60],18:["Co-op tea aisle",110,290],20:["Craft fair hall",340,170],31:["County courthouse",290,90],34:["Feed store loft",200,280],37:["Fairgrounds gate",300,290]}},
 'Manitowish Waters':{layout:'lakes',tint:'#e2e4ca',note:'More lakes than streets. The supper club opens at four.',marks:[['Supper club',40,150],['Boat launch',330,330],['Bog walk',280,20]],
  haunts:{0:["Fire tower",190,40],1:["Boat launch",290,320],10:["Resort lodge",350,170],18:["Supper club",50,170],20:["Bait & gift shop",140,280],31:["Town line sign",370,60],34:["Fishing cabin",160,120],37:["Bog walk",280,110]}},
 'Bayfield':{layout:'north',tint:'#e6dfca',note:'The ferry crowd booked a whole row. The orchards booked the rest.',marks:[['Ferry dock',190,120],['Orchards',340,250],['Madeline Island',334,58]],
  haunts:{0:["Ferry dock",190,115],1:["Orchard barn",330,230],10:["Pavilion",300,140],18:["Bed & breakfast parlor",60,170],20:["Apple fest booth",260,300],31:["Carnegie library",120,280],34:["Kayak shed",60,120],37:["Orchard rows",360,310]}}
};
const HALL_SPOT_IDS=[10,0,37];

function mapSeed(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function mapRandom(seed){let s=seed||1;return ()=>{s=Math.imul(s^s>>>15,1|s);s^=s+Math.imul(s^s>>>7,61|s);return((s^s>>>14)>>>0)/4294967296}}
function townMapFor(town){return TOWN_MAPS[town]||{layout:['west','east','hills','river','lakes'][mapSeed(town)%5],tint:'#ebe2ca',note:'',marks:[]}}
function mapLayout(town){return MAP_LAYOUTS[townMapFor(town).layout]||MAP_LAYOUTS.hills}
// Where each featured wrestler stands in this town.
function townSpots(town){
 const map=townMapFor(town),layout=mapLayout(town),spots={};
 if(map.fixed)return {...map.fixed};
 if(map.haunts)return Object.fromEntries(Object.entries(map.haunts).filter(([id])=>FEATURED_IDS.includes(Number(id))).map(([id,[,x,y]])=>[id,[x,y]]));
 const ids=FEATURED_IDS.filter(id=>w(id)),hall=ids.filter(id=>HALL_SPOT_IDS.includes(id)),rest=ids.filter(id=>!HALL_SPOT_IDS.includes(id));
 const turn=mapSeed(town)%5;
 hall.forEach((id,i)=>spots[id]=layout.spots[i]);
 rest.forEach((id,i)=>spots[id]=layout.spots[3+(i+turn)%5]);
 return spots;
}
function placeName(place){return String(place||'').split(' (')[0]}
// Where a featured wrestler can be found in this town.
function townPlace(town,id){return townMapFor(town).haunts?.[id]?.[0]||placeName(FEATURED_ROUTES[id].place)}

// ---------- The paper map itself ----------
function townMapSvg(town,venue){
 const map=townMapFor(town),layout=mapLayout(town),rand=mapRandom(mapSeed(town));
 const tilt=(rand()*14-7).toFixed(1);
 const streets=[];
 for(let x=-40;x<=440;x+=46+Math.round(rand()*14))streets.push(`<line x1="${x}" y1="-40" x2="${x+Math.round(rand()*30-15)}" y2="400"/>`);
 for(let y=-20;y<=380;y+=42+Math.round(rand()*14))streets.push(`<line x1="-40" y1="${y}" x2="440" y2="${y+Math.round(rand()*24-12)}"/>`);
 const keep=[layout.venue,...Object.values(townSpots(town)),...(map.marks||[]).map(m=>[m[1],m[2]]),...(map.extra||[]).map(m=>[m[1],m[2]])];
 const houses=[];
 const colors=['#d9c9a6','#cdb995','#e2d3b2','#c9b38c','#d7c3a3'];
 for(let i=0;i<70;i++){
  const x=Math.round(rand()*380+10),y=Math.round(rand()*340+10);
  if(keep.some(([px,py])=>Math.abs(px-x)<30&&Math.abs(py-y)<26))continue;
  const s=7+Math.round(rand()*7);
  houses.push(`<rect x="${x}" y="${y}" width="${s}" height="${Math.round(s*.8)}" fill="${colors[i%colors.length]}" transform="rotate(${tilt} ${x} ${y})"/>`);
 }
 const parks=[0,1,2].map(()=>{const x=Math.round(rand()*320+40),y=Math.round(rand()*280+40),r=16+Math.round(rand()*14);return `<ellipse cx="${x}" cy="${y}" rx="${r+8}" ry="${r}" class="map-park"/>`}).join('');
 const hills=layout.hills?[0,1,2,3].map(i=>{const x=60+i*95+Math.round(rand()*20),y=50+Math.round(rand()*220);return `<g class="map-hill"><path d="M${x-40} ${y}Q${x} ${y-30} ${x+40} ${y}"/><path d="M${x-26} ${y-4}Q${x} ${y-22} ${x+26} ${y-4}"/></g>`}).join(''):'';
 const waves=Array.from({length:14},()=>{const x=Math.round(rand()*380+10),y=Math.round(rand()*340+10);return `<path d="M${x} ${y}q4 -3 8 0t8 0"/>`}).join('');
 const bridges=(layout.bridges||[]).map(([x,y,len])=>`<g class="map-bridge" transform="rotate(-80 ${x} ${y})"><rect x="${x-len/2}" y="${y-5}" width="${len}" height="10"/><line x1="${x-len/2}" y1="${y-5}" x2="${x+len/2}" y2="${y-5}"/><line x1="${x-len/2}" y1="${y+5}" x2="${x+len/2}" y2="${y+5}"/></g>`).join('');
 // Labels slide inward so they never run off the edge of the map.
 const label=([name,x,y])=>{const half=name.length*3.4+6,tx=Math.min(400-half,Math.max(half,x));return `<g class="map-mark"><circle cx="${x}" cy="${y}" r="3.5"/><text x="${tx}" y="${y-8}" text-anchor="middle">${esc(name)}</text></g>`};
 const [vx,vy]=layout.venue;
 const venueMark=`<g class="map-venue" transform="translate(${vx} ${vy})"><rect x="-30" y="-16" width="60" height="30"/><path d="M-36 -16L0 -36L36 -16Z"/><rect class="map-venue-door" x="-7" y="0" width="14" height="14"/><path class="map-venue-star" d="M0 -31l2.4 5 5.4.6-4 3.7 1.1 5.3L0 -19l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/><text y="30" text-anchor="middle">Show night</text></g>`;
 return `<svg class="town-map-art" viewBox="0 0 400 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
 <defs><clipPath id="map-clip"><rect width="400" height="360"/></clipPath></defs>
 <g clip-path="url(#map-clip)">
 <rect width="400" height="360" fill="${map.tint}"/>
 ${parks}${hills}
 <g class="map-streets map-streets-under" transform="rotate(${tilt} 200 180)">${streets.join('')}</g>
 <g class="map-streets" transform="rotate(${tilt} 200 180)">${streets.join('')}</g>
 ${houses.join('')}
 <path class="map-water" d="${layout.water}"/>
 <g class="map-waves">${waves}</g>
 ${layout.island?`<path class="map-island" d="${layout.island}"/>`:''}
 ${bridges}
 ${(map.marks||[]).filter(([,x,y])=>map.fixed||![layout.venue,...Object.values(townSpots(town))].some(([px,py])=>Math.abs(px-x)<62&&y-py>-30&&y-py<62)).map(label).join('')}${(map.extra||[]).map(label).join('')}
 ${venueMark}
 <g class="map-compass" transform="translate(372 330)"><circle r="14"/><path d="M0 -12L4 0L0 12L-4 0Z"/><text y="-17" text-anchor="middle">N</text></g>
 </g></svg>`;
}

// ---------- Pins, the week ribbon and the sheet ----------
let townFocus=null; // {week,id}
function townInviteKind(invite){return sceneFor(invite).kind}
function isUrgentInvite(invite,week){return !week.answers[invite.id]&&['flag','ask','final'].includes(townInviteKind(invite))}
function townDefaultFocus(week){
 const open=week.invites.filter(i=>!week.answers[i.id]);
 return (open.find(i=>isUrgentInvite(i,week))||open[0]||week.invites[0])?.actor??null;
}
function townPin(id,spot,week,focus,town){
 const r=w(id),invite=week.invites.find(i=>i.actor===id),tier=affectionTier(r),[x,y]=spot;
 const spent=invite&&!!week.answers[invite.id],urgent=invite&&isUrgentInvite(invite,week);
 const busy=!invite,backstage=busy&&id===briefingActor();
 const kind=invite?townInviteKind(invite):null;
 const badge=spent?'<span class="pin-badge is-done" aria-hidden="true">✓</span>':urgent?'<span class="pin-badge is-urgent" aria-hidden="true">!</span>':'';
 const day=invite?`<span class="pin-day">${esc(invite.day.slice(0,3))}</span>`:'';
 const status=spent?'evening spent':urgent?(kind==='flag'?'only this week':kind==='ask'?'wants to ask you something':'tonight matters'):invite?'invited you out':backstage?'waiting at the hall':'not free this week';
 const where=townPlace(town,id);
 const label=`${r.name}, ${invite?invite.day+', ':''}${where}: ${status}`;
 return `<button type="button" class="map-pin mood-${tier} ${busy?'is-busy':''} ${spent?'is-spent':''} ${urgent?'is-urgent':''} ${focus===id?'is-focus':''}" style="left:${x/4}%;top:${y/3.6}%;--character-color:${r.color}" data-town-pin="${id}" aria-pressed="${focus===id}" aria-label="${esc(label)}"><span class="pin-face" data-mood="${tier}">${portrait(r)}</span>${badge}${day}<span class="pin-name" aria-hidden="true">${esc(FEATURED_ROUTES[id].speaker)}</span><span class="pin-place" aria-hidden="true">${esc(where)}</span></button>`;
}
function townRibbon(week){
 const days=[...WEEK_DAYS,'Saturday'];
 return `<ol class="town-ribbon" aria-label="This week">${days.map(day=>{
  const here=week.invites.filter(i=>i.day===day),show=day==='Saturday';
  return `<li class="${show?'is-show':''} ${here.length&&here.every(i=>week.answers[i.id])?'is-spent':''}"><b>${day.slice(0,3)}</b>${show?'<span>Show</span>':here.map(i=>`<span class="ribbon-face ${week.answers[i.id]?'is-spent':''}" style="--character-color:${w(i.actor).color}" title="${esc(w(i.actor).name)}">${portrait(w(i.actor))}</span>`).join('')}</li>`}).join('')}</ol>`;
}
function townSheet(id,week,left,town=showLocation().town){
 if(id==null)return '<p class="note">Nobody has asked to see you this week.</p>';
 const r=w(id),invite=week.invites.find(i=>i.actor===id);
 if(invite)return `<p class="town-where">Find ${esc(FEATURED_ROUTES[id].speaker)} at <b>${esc(townPlace(town,id))}</b></p><ol class="invite-list">${inviteCard(invite,left)}</ol>`;
 const backstage=id===briefingActor(),sore=soreLine(id),jealous=jealousLine(id);
 const where=townPlace(town,id);
 return `<div class="town-busy" style="--character-color:${r.color}"><div class="invite-art" data-mood="${affectionTier(r)}">${portrait(r)}</div><div class="invite-copy"><small>Around town · ${esc(where)}</small><strong>${esc(r.name)}</strong><p class="invite-narration">${esc(sore||jealous||tellFor(r))}</p><p class="town-busy-note">${backstage?'Waiting to talk to you outside the hall before doors.':'Not free for an evening this week.'}</p></div><button type="button" class="btn" data-window-card="${id}">Window card</button></div>`;
}
function townMapPanel(){
 const week=ensureWeekAhead(),left=eveningsLeft(),location=showLocation(),town=location.town,map=townMapFor(town);
 const focusOk=townFocus?.week===state.week&&w(townFocus.id)&&FEATURED_IDS.includes(townFocus.id);
 const focus=focusOk?townFocus.id:townDefaultFocus(week);
 const spots=townSpots(town),ids=FEATURED_IDS.filter(id=>w(id)&&spots[id]);
 // Draw dimmed pins first so invitations sit on top.
 const order=[...ids.filter(id=>!week.invites.some(i=>i.actor===id)),...ids.filter(id=>week.invites.some(i=>i.actor===id))];
 const moons=Array.from({length:EVENING_SLOTS},(_,i)=>`<i class="${i<EVENING_SLOTS-left?'used':''}"></i>`).join('');
 const away=town!=='Sturgeon Bay';
 const venue=placeName(location.venue.split(' · ').at(-1));
 return `<section class="town-map" id="week-ahead" aria-labelledby="town-title">
 <header class="town-head"><div><small>Week ${state.week} · ${away?'On the road':'Home'} · ${esc(venue)}</small><h1 id="town-title" tabindex="-1">${esc(town)}, WI</h1></div><div class="town-evenings"><span class="evening-dots" role="img" aria-label="${left} of ${EVENING_SLOTS} evenings free">${moons}</span><strong>${left?`${left} evening${left===1?'':'s'} left`:'Evenings spoken for'}</strong><small>before ${esc(isEvent()?'the '+monthlyEvent().title:'show night')}</small></div></header>
 ${townRibbon(week)}
 <div class="town-canvas" data-town="${esc(town)}"><div class="town-world">${townMapSvg(town,venue)}${order.map(id=>townPin(id,spots[id],week,focus,town)).join('')}</div><span class="town-drag-hint" aria-hidden="true">Drag to look around</span></div>
 <div class="town-legend" aria-hidden="true"><span><i class="lg-invite"></i>Invited you</span><span><i class="lg-urgent">!</i>Can’t wait</span><span><i class="lg-busy"></i>Around, not free</span></div>
 <div class="town-sheet" aria-live="polite">${townSheet(focus,week,left)}</div>
 <p class="note town-note">${esc(reputationLine())} ${map.note?esc(map.note):''} ${left?'Whoever you don’t see this week, you don’t see.':''}</p>
 <div class="town-actions"><label class="easy-toggle"><input type="checkbox" data-easy-mode ${easyMode()?'checked':''}> Show what replies change (easy mode)</label><button type="button" class="btn ${left?'':'primary'}" data-nav="book">${left?'Skip to booking':'Book the card'} <span aria-hidden="true">→</span></button></div>
 </section>`;
}
// The map is a little bigger than its window: drag it to look around. The view is kept per week and town.
const TOWN_ZOOM=1.45;
let townPan=null; // {key,x,y} as fractions of the spare room, 0..1
function townPanKey(){return `${state.week}:${showLocation().town}`}
function bindTownMap(){
 const root=document.querySelector('.town-map');if(!root)return;
 const canvas=root.querySelector('.town-canvas'),world=root.querySelector('.town-world');
 let fx=.5,fy=.5;
 const apply=()=>{const cw=canvas.clientWidth,ch=canvas.clientHeight,sx=cw*(TOWN_ZOOM-1),sy=ch*(TOWN_ZOOM-1);world.style.transform=`translate(${-fx*sx}px,${-fy*sy}px)`;townPan={key:townPanKey(),x:fx,y:fy}};
 const clamp01=v=>Math.min(1,Math.max(0,v));
 // Centre on a pin, as far as the edges allow.
 const panTo=id=>{const pin=world.querySelector(`[data-town-pin="${id}"]`);if(!pin)return;const px=parseFloat(pin.style.left)/100,py=parseFloat(pin.style.top)/100;fx=clamp01((px*TOWN_ZOOM-.5)/(TOWN_ZOOM-1));fy=clamp01((py*TOWN_ZOOM-.5)/(TOWN_ZOOM-1));apply()};
 if(townPan?.key===townPanKey()){fx=townPan.x;fy=townPan.y;apply()}
 else{const focus=root.querySelector('.map-pin.is-focus');if(focus)panTo(Number(focus.dataset.townPin));else apply()}
 let drag=null,moved=false;
 canvas.addEventListener('pointerdown',e=>{if(e.button>0)return;drag={x:e.clientX,y:e.clientY,fx,fy,id:e.pointerId};moved=false});
 canvas.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!moved&&Math.hypot(dx,dy)<6)return;
  if(!moved){moved=true;canvas.setPointerCapture?.(e.pointerId);canvas.classList.add('is-dragging','was-dragged')}
  const sx=canvas.clientWidth*(TOWN_ZOOM-1),sy=canvas.clientHeight*(TOWN_ZOOM-1);
  fx=clamp01(drag.fx-dx/sx);fy=clamp01(drag.fy-dy/sy);apply();
 });
 const end=()=>{drag=null;canvas.classList.remove('is-dragging')};
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 // A drag that ends on a pin isn't a tap on it.
 canvas.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 root.querySelectorAll('[data-town-pin]').forEach(pin=>{
  pin.addEventListener('focus',()=>{if(!drag)panTo(Number(pin.dataset.townPin))});
  pin.onclick=()=>{
   const id=Number(pin.dataset.townPin);townFocus={week:state.week,id};
   const week=ensureWeekAhead();
   root.querySelectorAll('[data-town-pin]').forEach(p=>{const on=Number(p.dataset.townPin)===id;p.classList.toggle('is-focus',on);p.setAttribute('aria-pressed',on)});
   root.querySelector('.town-sheet').innerHTML=townSheet(id,week,eveningsLeft());
   bindWeekAhead(document);
  };
 });
}
