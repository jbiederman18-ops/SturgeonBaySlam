// The opening cutscene: how you came to book this show.
// Plays when a new career starts, and again from the title screen ("Watch the opening").
// Runs on the visual-novel player in relationships.js. Non-wrestler speakers live in CUTSCENE_CAST.

CUTSCENE_CAST.lord={
 name:'The Good Lord Above',
 set:'heaven',
 color:'#ffd34d',
 art:()=>`<svg viewBox="0 0 160 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-art-style="cut-paper-human"><rect width="160" height="180" fill="#f2e9d5"/><svg overflow="hidden" x="0" y="0" width="160" height="180" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid slice"><image href="art/good-lord-above.jpg" x="0" y="0" width="512" height="512"/></svg></svg>`
};

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
  {type:'line',text:'I will be checking in. Periodically. You will not know when.',actor:L},
  {type:'line',text:'And should you fail, you will be sent to the deepest pit of oblivion.',actor:L,emote:'angry',shake:true},
  {type:'narration',text:'He reaches for a big brass lever. The plaque underneath reads Small Town Wisconsin.',actor:L},
  {type:'line',text:'Break a leg. Not literally. You already did that.',actor:L},
  {type:'line',text:'When you got hit by a car. As you deserved. You absolute fucking animal.',actor:L,emote:'angry',shake:true},
  {type:'shout',text:'CLUNK!',tone:'bad',actor:L,shake:true},
  {type:'narration',text:'The cloud opens under you. You plummet past geese, past Green Bay, past most of Door County.',actor:L,set:'fall',figure:false,shake:true},
  {type:'narration',text:`You land, softly, in the parking lot of ${openingVenue()}.`,actor:L,set:'bay',figure:false},
  {type:'narration',text:'A broom leans against the side door, as if it has been waiting for you.',actor:L,set:'bay',figure:false},
  {type:'line',text:'Oh, and one more thing. The card is due Saturday.',actor:L,set:'bay',figure:false},
  ...openingWelcome()
 );
 return pages;
}
// After the landing, Jesus welcomes you and lays out who already can't stand whom.
// These are the relationship web's starting jealousies (WEB_BONDS in relationships.js).
const OPENING_HOST=24;
function openingWelcome(){
 const J=OPENING_HOST,page=(text,extra={})=>({type:'line',text,actor:J,set:'bay',...extra});
 if(!w(J))return [{type:'narration',text:'The side door swings open. Somewhere inside, a tape deck starts playing.',actor:'lord',set:'bay',figure:false,card:{small:'Week 1',title:'Your life’s work begins'}}];
 return [
  {type:'narration',text:'The side door bangs open. A man in a ring robe and a halo headband jogs out with two paper cups of punch.',actor:J,set:'bay'},
  page('You made it! Welcome, welcome. On behalf of everybody, I am so excited to have you as the new head booker of the WWA.',{emote:'delight'}),
  page('Before you go in, a little friendly heads-up about who is not speaking to whom.'),
  page('Greek Polanski. Filmmaker, Shakespearean tragedy. You probably know him best from directing Demeter’s Daughter.'),
  page('He passed up Liam Neesen for the starring role, claiming he “smelled of piss” and “would be hard for audiences to buy as a mother from Greek mythology.”'),
  page('Liam responded by kicking him in the head so hard, he was never quite the same.',{emote:'hurt',card:{small:'Grudge',title:'Greek & Liam'}}),
  page('“Politically Neutral” Ron Toledo. Resolutely centrist. Finds Greek’s passionate filmmaking overdone and tiring. Prefers nature documentaries and reruns of NCIS: New Orleans.'),
  page('Probably shouldn’t have said that to Greek’s face.',{card:{small:'Irritation',title:'Greek & Ron'}}),
  page('The Dog is pretty sure neither of 2 Holds’ holds is possible, what with his arms and legs being on the underside of his body.'),
  page('2 Holds is pretty sure the Dog has human anatomy. The Dog finds this quite offensive.',{card:{small:'Irritation',title:'2 Holds & the Dog'}}),
  page('And Sweeps. He would never say it to his face, but everyone knows he has dreaded cleaning the Grinch’s room ever since the Blacklight Incident.'),
  page('Sweeps is the best in the business. Rumor is even he can’t keep up with the demands of that velvet room.',{card:{small:'Irritation',title:'Sweeps & the Grinch'}}),
  page('Anyway! Get close to one of them, the other one notices. Punch?',{emote:'delight',card:{small:'Week 1',title:'Your life’s work begins'}})
 ];
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
 runScenePlayer({header,pages:openingScript(),onChoose:index=>{const pages=openingChoose(index,newCareer&&!answered);answered=true;return pages},finishLabel:'Start week 1 →',finish:()=>{d.removeAttribute('aria-label');d.close();if(newCareer){render();startTutorial()}if(after)after()}});
}
