// The opening cutscene: how you came to book this show.
// Plays when a new career starts, and again from the title screen ("Watch the opening").
// Runs on the visual-novel player in relationships.js. Non-wrestler speakers live in CUTSCENE_CAST.

CUTSCENE_CAST.lord={
 name:'The Good Lord Above',
 set:'heaven',
 color:'#ffd34d',
 art:()=>`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="200" height="200" fill="#ffe7a1"/>
  <g fill="#ffd34d">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,b=a+Math.PI/14;return `<polygon points="100,78 ${100+170*Math.cos(a)},${78+170*Math.sin(a)} ${100+170*Math.cos(b)},${78+170*Math.sin(b)}"/>`}).join('')}</g>
  <ellipse cx="100" cy="30" rx="44" ry="10" fill="none" stroke="#161616" stroke-width="12"/>
  <ellipse cx="100" cy="30" rx="44" ry="10" fill="none" stroke="#ffc21a" stroke-width="6"/>
  <g stroke="#161616" stroke-width="8" fill="#161616"><circle cx="66" cy="70" r="20"/><circle cx="134" cy="70" r="20"/><circle cx="100" cy="52" r="26"/></g>
  <g fill="#fff"><circle cx="66" cy="70" r="20"/><circle cx="134" cy="70" r="20"/><circle cx="100" cy="52" r="26"/></g>
  <path d="M8 200 C14 160 50 142 100 142 C150 142 186 160 192 200Z" fill="#fff" stroke="#161616" stroke-width="4"/>
  <path d="M100 150 L100 200" stroke="#e6dcc4" stroke-width="5"/>
  <ellipse cx="100" cy="86" rx="32" ry="36" fill="#f1c79b" stroke="#161616" stroke-width="4"/>
  <g stroke="#161616" stroke-width="7" fill="#161616"><circle cx="72" cy="122" r="18"/><circle cx="100" cy="132" r="22"/><circle cx="128" cy="122" r="18"/><circle cx="86" cy="152" r="18"/><circle cx="114" cy="152" r="18"/><circle cx="100" cy="170" r="16"/></g>
  <g fill="#fff"><circle cx="72" cy="122" r="18"/><circle cx="100" cy="132" r="22"/><circle cx="128" cy="122" r="18"/><circle cx="86" cy="152" r="18"/><circle cx="114" cy="152" r="18"/><circle cx="100" cy="170" r="16"/></g>
  <g class="lord-calm">
   <path d="M72 70 Q84 60 94 70" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
   <path d="M106 70 Q116 60 128 70" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
   <path d="M72 70 Q84 60 94 70 M106 70 Q116 60 128 70" fill="none" stroke="#161616" stroke-width="2" stroke-linecap="round" opacity=".35"/>
   <path d="M76 84 Q84 90 92 84 M108 84 Q116 90 124 84" fill="none" stroke="#161616" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g class="lord-angry">
   <path d="M70 64 L96 76 M130 64 L104 76" stroke="#161616" stroke-width="12" stroke-linecap="round"/>
   <path d="M70 64 L96 76 M130 64 L104 76" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
   <circle cx="84" cy="85" r="5" fill="#161616"/><circle cx="116" cy="85" r="5" fill="#161616"/>
  </g>
  <path d="M100 88 Q96 100 102 102" fill="none" stroke="#161616" stroke-width="3" stroke-linecap="round"/>
  <path d="M100 108 C90 102 76 104 70 114 C80 118 92 116 100 110 C108 116 120 118 130 114 C124 104 110 102 100 108Z" fill="#fff" stroke="#161616" stroke-width="3.5"/>
  <g transform="rotate(-10 156 150)">
   <rect x="138" y="118" width="38" height="50" rx="3" fill="#c98a4b" stroke="#161616" stroke-width="4"/>
   <rect x="144" y="126" width="26" height="36" fill="#fffbe9" stroke="#161616" stroke-width="2"/>
   <rect x="150" y="113" width="14" height="9" rx="2" fill="#9aa0a6" stroke="#161616" stroke-width="3"/>
   <path d="M148 134h18M148 141h18M148 148h12" stroke="#c8231b" stroke-width="2.5"/>
  </g>
  <ellipse cx="146" cy="164" rx="13" ry="10" fill="#f1c79b" stroke="#161616" stroke-width="4"/>
 </svg>`
};

// The big brass lever. `pulled` draws it thrown.
function openingLever(pulled){
 const handle=pulled?'rotate(58 100 150)':'rotate(-28 100 150)';
 return `<figure class="aa-lever${pulled?' is-pulled':''}"><svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g transform="${handle}"><rect x="94" y="40" width="12" height="112" rx="5" fill="#9aa0a6" stroke="#161616" stroke-width="4"/><circle cx="100" cy="36" r="20" fill="#c8231b" stroke="#161616" stroke-width="5"/></g>
  <path d="M54 150 a46 30 0 0 1 92 0Z" fill="#d9a441" stroke="#161616" stroke-width="5"/>
  <rect x="24" y="150" width="152" height="26" rx="4" fill="#b8862e" stroke="#161616" stroke-width="5"/>
 </svg><figcaption>Small Town Wisconsin</figcaption></figure>`;
}

// Who the Lord introduces, two at a time, in his own words.
const OPENING_LINEUP=[
 {ids:[0,1],line:'Greek Polanski says I’m running Olympus without him. The Man of 2 Holds turned down a third.'},
 {ids:[10,31],line:'Sweeps McKenzie swept the Pearly Gates. Unasked. Ron Toledo is neutral on whether I exist.'},
 {ids:[18,20],line:'Charming Friendly sent me a thank-you card. I have not slept since. The Grinch keeps asking about Lemon Tart.'},
 {ids:[34,37],line:'Liam Neesen has a very particular set of skills. Not from me. And a dog. I checked. The rulebook doesn’t say.'},
 {ids:[24,17],line:'“Party Animal” Jesus H. Christ. No relation. Term Life Insurance Plan tried to sell me a policy. Me.'}
];

// The two ways to answer for yourself. Apologizing earns a small mercy on a new career.
const OPENING_MERCY=300;
const OPENING_REPLIES=[
 {text:'Okay, so, in my defense, the banana was already kind of—',kind:'explain'},
 {text:'I’m sorry. I really am.',kind:'apologize'}
];

function openingVenue(){try{return careerStage().venue}catch{return 'the community hall'}}

// Pure page script, so tests can check it without a page.
function openingScript(){
 const L='lord',street={actor:L,figure:false};
 return [
  {type:'title',place:'Sturgeon Bay',detail:'The crosswalk on Third Avenue',when:'Your last night on earth · 9:41 PM',...street,set:'street'},
  {type:'narration',text:'You step off the curb. The little white man says walk. You are thinking about what to send the group chat.',...street,set:'street'},
  {type:'narration',text:'Something to your left is getting very bright.',...street,set:'headlights'},
  {type:'narration',text:'Very, very bright.',...street,set:'headlights',shake:true},
  {type:'shout',text:'CRASH!',tone:'bad',...street,set:'headlights',shake:true},
  {type:'narration',text:'Then nothing.',...street,set:'void'},
  {type:'narration',text:'Then, very gently, up.',...street,set:'ascend'},
  {type:'title',place:'Up Above',detail:'Just past the Pearly Gates',when:'A moment later',actor:L},
  {type:'line',text:'There you are. My child. I have been waiting for this moment since the day you were born.',actor:L,emote:'delight'},
  {type:'line',text:'You are my most perfect creation. I made you for one purpose, and at last you are here to fulfil it.',actor:L},
  {type:'you',text:'Which is…?',actor:L},
  {type:'line',text:'The most incredible wrestling show the world has ever seen. Pyro. Ladders. A crowd that weeps at a disqualification.',actor:L,emote:'intense'},
  {type:'line',text:'But first. Your life was a test. And I have read your file.',actor:L,set:'record'},
  {type:'line',text:'You have been a naughty, naughty boy.',actor:L,set:'record',emote:'angry'},
  {type:'line',text:'The banana. Taped to the wall. It was worth a million dollars. You ate it. Why would you eat it?',actor:L,set:'record',card:{small:'Exhibit A',title:'The banana',items:['One (1) banana, duct-taped to a gallery wall','Appraised at one million dollars','Eaten']}},
  {type:'line',text:'And every time you watched HGTV, you sent your group chat the new Charmin bear ad. Every single one.',actor:L,set:'record',card:{small:'Exhibit B',title:'The group chat',items:['Bears, toilet paper, a fixer-upper in the background','Sent: every new one','Replies: none']}},
  {type:'line',text:'They don’t want to see toilet paper ads. Why would they want to see toilet paper ads?',actor:L,set:'record',emote:'intense'},
  {type:'choice',replies:OPENING_REPLIES,actor:L,set:'record'}
 ];
}
function openingAfter(index,blessed=false){
 const L='lord',reply=OPENING_REPLIES[index]||OPENING_REPLIES[1],pages=[];
 if(reply.kind==='explain'){
  pages.push(
   {type:'you',text:reply.text,actor:L,set:'record'},
   {type:'shout',text:'SILENCE!',tone:'bad',actor:L,set:'record',shake:true},
   {type:'line',text:'No. I have seen the bears. I have seen all of the bears. We are not doing this.',actor:L,set:'record',emote:'angry'},
   {type:'narration',text:'Thunder rolls somewhere under the cloud. A choir stops mid-hymn and pretends it wasn’t listening.',actor:L,set:'record',shake:true}
  );
 }else{
  pages.push(
   {type:'shout',text:'Amen.',tone:'good',actor:L,set:'record'},
   {type:'you',text:reply.text,actor:L,set:'record'},
   {type:'line',text:'…Thank you. That is all I wanted. Here. For the road.',actor:L,set:'record',emote:'delight'},
   blessed
    ?{type:'narration',text:'He presses a folded envelope into your hand. It smells faintly of collection plate.',actor:L,set:'record',card:{small:'A small mercy',title:`+${money(OPENING_MERCY)}`,items:['Added to your starting cash']}}
    :{type:'narration',text:'He presses a folded envelope into your hand. It smells faintly of collection plate.',actor:L,set:'record'}
  );
 }
 pages.push(
  {type:'line',text:'Nevertheless. For your naughtiness, you are cursed.',actor:L,emote:'angry'},
  {type:'line',text:'You will complete your life’s work with a roster of utter buffoons.',actor:L,emote:'intense'},
  ...OPENING_LINEUP.map(group=>({type:'line',text:group.line,actor:L,lineup:group.ids})),
  {type:'narration',text:'There are thirty-eight of them. You are told this is a mercy.',actor:L,lineup:[4,6,13,21,29,33]},
  {type:'line',text:'I will be checking in. Periodically. You will not know when.',actor:L},
  {type:'line',text:'And should you fail, you will be sent to the deepest pit of oblivion. It is just below Illinois.',actor:L,emote:'angry',shake:true},
  {type:'narration',text:'He reaches for a big brass lever. The plaque underneath reads Small Town Wisconsin.',actor:L,prop:openingLever(false)},
  {type:'line',text:'Break a leg. Not literally. You already did that.',actor:L,prop:openingLever(false)},
  {type:'shout',text:'CLUNK!',tone:'bad',actor:L,prop:openingLever(true),shake:true},
  {type:'narration',text:'The cloud opens under you. You plummet past geese, past Green Bay, past most of Door County.',actor:L,set:'fall',figure:false,shake:true},
  {type:'narration',text:`You land, softly, in the parking lot of ${openingVenue()}.`,actor:L,set:'bay',figure:false},
  {type:'narration',text:'A broom leans against the side door, as if it has been waiting for you.',actor:L,set:'bay',figure:false},
  {type:'line',text:'Oh, and one more thing. The card is due Saturday.',actor:L,set:'bay',figure:false,card:{small:'Week 1',title:'Your life’s work begins'}}
 );
 return pages;
}
// Applies the reply to a new career (the mercy is only paid once, and never on a replay).
function openingChoose(index,blessable){
 const blessed=blessable&&OPENING_REPLIES[index]?.kind==='apologize';
 if(blessed){state.cash+=OPENING_MERCY;save()}
 return openingAfter(index,blessed);
}

// Plays the opening in #modal, then `after`. `newCareer` lets the apology pay out.
function openOpening(after,{newCareer=false}={}){
 const d=$('#modal');
 const header=`<span class="aa-brand">Sturgeon Bay Slam</span><span>Prologue</span><span>A booker is born</span>`;
 let answered=false;
 d.oncancel=null;d.onclose=()=>{scenePlayer?.close?.()};
 runScenePlayer({header,pages:openingScript(),onChoose:index=>{const pages=openingChoose(index,newCareer&&!answered);answered=true;return pages},finishLabel:'Start week 1 →',finish:()=>{d.removeAttribute('aria-label');d.close();if(newCareer)render();if(after)after()}});
}
