// The opening cutscene: how you came to book this show.
// Plays once when a new career starts, and again from the title screen ("Watch the opening").
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
  <g stroke="#161616" stroke-width="8" fill="#161616">
   <circle cx="66" cy="70" r="20"/><circle cx="134" cy="70" r="20"/><circle cx="100" cy="52" r="26"/>
  </g>
  <g fill="#fff"><circle cx="66" cy="70" r="20"/><circle cx="134" cy="70" r="20"/><circle cx="100" cy="52" r="26"/></g>
  <path d="M8 200 C14 160 50 142 100 142 C150 142 186 160 192 200Z" fill="#fff" stroke="#161616" stroke-width="4"/>
  <path d="M100 150 L100 200" stroke="#e6dcc4" stroke-width="5"/>
  <ellipse cx="100" cy="86" rx="32" ry="36" fill="#f1c79b" stroke="#161616" stroke-width="4"/>
  <g stroke="#161616" stroke-width="7" fill="#161616">
   <circle cx="72" cy="122" r="18"/><circle cx="100" cy="132" r="22"/><circle cx="128" cy="122" r="18"/><circle cx="86" cy="152" r="18"/><circle cx="114" cy="152" r="18"/><circle cx="100" cy="170" r="16"/>
  </g>
  <g fill="#fff">
   <circle cx="72" cy="122" r="18"/><circle cx="100" cy="132" r="22"/><circle cx="128" cy="122" r="18"/><circle cx="86" cy="152" r="18"/><circle cx="114" cy="152" r="18"/><circle cx="100" cy="170" r="16"/>
  </g>
  <path d="M72 70 Q84 60 94 70" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <path d="M106 70 Q116 60 128 70" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <path d="M72 70 Q84 60 94 70 M106 70 Q116 60 128 70" fill="none" stroke="#161616" stroke-width="2" stroke-linecap="round" opacity=".35"/>
  <path d="M76 84 Q84 90 92 84 M108 84 Q116 90 124 84" fill="none" stroke="#161616" stroke-width="4" stroke-linecap="round"/>
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

// Who the Lord introduces, two at a time, in his own words.
const OPENING_LINEUP=[
 {ids:[0,1],line:'Greek Polanski says I’m running Olympus without him. The Man of 2 Holds turned down a third.'},
 {ids:[10,31],line:'Sweeps McKenzie swept the Pearly Gates. Unasked. Ron Toledo is neutral on whether I exist.'},
 {ids:[18,20],line:'Charming Friendly sent me a thank-you card. I have not slept since. The Grinch keeps asking about Lemon Tart.'},
 {ids:[34,37],line:'Liam Neesen has a very particular set of skills. Not from me. And a dog. I checked. The rulebook doesn’t say.'},
 {ids:[24,17],line:'“Party Animal” Jesus H. Christ. No relation. Term Life Insurance Plan tried to sell me a policy. Me.'}
];

const OPENING_RECORD=[
 'Returned a shopping cart only halfway. 4,112 times.',
 'Told a child the ice-cream truck plays music when it’s out of ice cream.',
 'Said “five minutes away” from the shower.',
 'Ate the last kringle. Blamed the dog.',
 'Clapped when the plane landed. In Green Bay.'
];

const OPENING_REPLIES=[
 {text:'That cart corral was very far away.',shout:'Objection!',tone:'bad',reaction:'“It was nine feet. I measured. I measure everything. I invented the foot.”'},
 {text:'Can I see the paperwork?',shout:'So moved!',tone:'good',reaction:'He gestures upward. The filing cabinet keeps going, through four more clouds. “You are looking at the paperwork.”'},
 {text:'I accept my punishment.',shout:'Amen.',tone:'good',reaction:'“Good. That will make the next part so much more upsetting.”'}
];

function openingVenue(){try{return careerStage().venue}catch{return 'the community hall'}}

// Pure page script, so tests can check it without a page.
function openingScript(){
 const L='lord';
 return [
  {type:'title',place:'Up Above',detail:'Well above Door County',when:'The beginning · Before Week 1',actor:L},
  {type:'narration',text:'Before the first bell. Before the folding chairs. Before Sturgeon Bay, there was a voice, and the voice sounded tired.',actor:L},
  {type:'line',text:'Ah. There you are. Sit. Mind the cloud, it’s new.',actor:L},
  {type:'line',text:'I have made many things. Mountains. Lake Michigan. The cheese curd, which squeaks so you know it loves you.',actor:L,emote:'delight'},
  {type:'line',text:'Now I would make one more: the greatest wrestling show the world has ever seen. And you are going to book it.',actor:L,emote:'intense'},
  {type:'you',text:'Me?',actor:L},
  {type:'line',text:'You. You have the eye. You have the clipboard instinct. You could make a crowd weep at a disqualification.',actor:L},
  {type:'narration',text:'A cloud rolls aside. Behind it stands a filing cabinet the size of a grain elevator.',actor:L,set:'record'},
  {type:'line',text:'However. There is the matter of your previous life.',actor:L,set:'record',emote:'hurt',card:{small:'Permanent Record · Last time around',title:'Naughty',items:OPENING_RECORD}},
  {type:'line',text:'You were, and I say this with infinite love, a naughty boy.',actor:L,set:'record'},
  {type:'choice',replies:OPENING_REPLIES,actor:L,set:'record'}
 ];
}
function openingAfter(index){
 const L='lord',reply=OPENING_REPLIES[index]||OPENING_REPLIES[2],pages=[
  {type:'shout',text:reply.shout,tone:reply.tone,actor:L,set:'record'},
  {type:'you',text:reply.text,actor:L,set:'record'}
 ];
 for(const part of splitReaction(reply.reaction))pages.push({...part,actor:L,set:'record'});
 pages.push(
  {type:'line',text:'So. You will build the greatest show on earth. But a curse is a curse. You will build it with… these.',actor:L,emote:'intense'},
  ...OPENING_LINEUP.map(group=>({type:'line',text:group.line,actor:L,lineup:group.ids})),
  {type:'narration',text:'There are thirty-eight of them. You are told this is a mercy.',actor:L,lineup:[4,6,13,21,29,33]},
  {type:'line',text:'Those are your buffoons. Love them. Book them. Keep them away from the pyro.',actor:L},
  {type:'line',text:'Give me the greatest wrestling show in the world, and your record is wiped clean. Every cart. Every kringle.',actor:L,emote:'delight'},
  {type:'you',text:'And if I don’t?',actor:L},
  {type:'line',text:'Then we try again next life. With twice as many dogs.',actor:L,emote:'intense'},
  {type:'narration',text:`You fall for a very long time. You land, softly, in the parking lot of ${openingVenue()}.`,actor:L,set:'bay',figure:false},
  {type:'narration',text:'It is Tuesday. A broom leans against the side door, as if it has been waiting for you.',actor:L,set:'bay',figure:false},
  {type:'line',text:'Oh, and one more thing. The card is due Saturday.',actor:L,set:'bay',figure:false,card:{small:'Week 1',title:'Your penance begins'}}
 );
 return pages;
}

// Plays the opening in #modal, then `after`.
function openOpening(after){
 const d=$('#modal');
 const header=`<span class="aa-brand">Sturgeon Bay Slam</span><span>Prologue</span><span>A booker is born</span>`;
 d.oncancel=null;d.onclose=()=>{scenePlayer?.close?.()};
 runScenePlayer({header,pages:openingScript(),onChoose:openingAfter,finishLabel:'Start week 1 →',finish:()=>{d.removeAttribute('aria-label');d.close();if(after)after()}});
}
