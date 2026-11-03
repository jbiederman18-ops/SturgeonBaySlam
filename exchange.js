'use strict';
// The presentation advances independently of the booking and scoring simulation.
let dialogueTimer=null;
const crowdHeckles=[
 'Less posing! More wrestling!', 'SHOW US HOLD TWO!', 'PUT RUDY IN!', 'ONE! ONE! ONE!',
 'You’re a towel! Act like it!', 'Read the fine print!', 'DEFEND YOUR THESIS!', 'We’re ready for our close-up!',
 'Is it cold in here or is that your promo?', 'Small ears! BIG SUPLEX!', 'SWEEP! SWEEP! SWEEP!', 'Who put you on the list?',
 'What’s the plan, John?', 'We want liftoff!', 'Give us the third-act twist!', 'Keep those shoulders parallel!',
 'Put the kettle on!', 'Are rope breaks covered?', 'Nice manners! Nasty headlock!', 'Log off and lock up!',
 'Three sizes! Three sizes!', 'Play the big finish!', 'FREDDIE! FREDDIE!', 'Give ’em some zest!',
 'EVERYBODY’S INVITED!', 'DROP THE BEAT!', 'How many stars was that entrance?', 'You live around the corner!',
 'BEST IN SHOW!', 'ALL ABOARD!', 'PIZZA! PIZZA! PIZZA!', 'Pick a corner, Ron!', 'LACES OUT!', 'The proof is in the pudding!', 'ANSWER THE PHONE!', 'STRONG ROOTS! STRONG ROOTS!', 'YOU CHOSE US!', 'LET THE DOG WRESTLE!'
];
function dialoguePages(text,limit=180){
 const clean=String(text||'').replace(/\s+/g,' ').trim();if(!clean||!/[\p{L}\p{N}]/u.test(clean))return [];
 // Never split on the dots inside nicknames or qualifications. Page boundaries follow complete sentences.
 const protectedText=clean.replace(/P\.H\.D|\b(?:Mr|Mrs|Ms|Dr|Prof)\./g,word=>word.replace(/\./g,'∯'));
 const units=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('en',{granularity:'sentence'}).segment(protectedText)].map(part=>part.segment.trim()):protectedText.match(/[^.!?]+(?:[.!?]+[”"']*|$)/g)||[protectedText];
 const pages=[];let page='';for(let sentence of units){sentence=sentence.replace(/∯/g,'.');if(!sentence)continue;if(page&&(page+' '+sentence).length>limit){pages.push(page);page=sentence}else page+=(page?' ':'')+sentence}
 if(page)pages.push(page);return pages;
}
function promoRival(segment){return ringOpponent(segment,segment.a)}
function scenePages(beats){return beats.flatMap(beat=>dialoguePages(beat.text).map((text,index)=>({...beat,text,cue:index===0?beat.cue||'':''})))}
function conciseBeats(beats){if(state.preferences.presentation!=='concise'||beats.length<=5)return beats;return [...beats.slice(0,3),...beats.slice(-2)]}
function introExchange(moment,segment){return scenePages(conciseBeats(moment.opening||ringOpening(moment,segment)))}
function resultExchange(answer){return scenePages(conciseBeats(answer.beats?.length?answer.beats:[ringBeat('commentary','The bell sounds. The wrestlers catch their breath.','action')]))}

function exchangeState(){
 const live=state.liveShow;if(!live.exchanges)live.exchanges={};
 if(!live.exchanges[live.index]){live.exchanges[live.index]={intro:0,result:0};save()}
 return live.exchanges[live.index];
}
function speakerName(speaker){return typeof speaker==='number'?w(speaker).name:speaker==='crowd'?'THE FRONT ROW':'RINGSIDE COMMENTARY'}
function exchangePage(){
 ensureKayfabeLive();
 const live=state.liveShow,m=live.moments[live.index],s=state.card[live.index],answer=live.answers[live.index],position=exchangeState();
 const intro=introExchange(m,s),result=answer?resultExchange({...answer,actors:answer.actors||m.actors}):[],choosing=!answer&&position.intro>=intro.length;
 const frames=answer?result:intro,offset=Math.min(answer?position.result:position.intro,Math.max(0,frames.length-1)),beat=frames[offset];
 const active=choosing?null:beat.speaker,isLast=offset===frames.length-1;
 const allPeople=m.actors.map(id=>w(id));const featured=typeof active==='number'?active:answer&&s.kind==='match'?(answer.featured??s.winner):allPeople[0].id;const opponent=s.kind==='match'?matchOpponents(s,featured)[0]:null;let people=allPeople.length>2?[w(featured),w(opponent??allPeople.find(r=>r.id!==featured).id)]:allPeople.slice();
 // Promos can feature a specific rival already present on tonight’s card.
 if(m.kind==='promo'){
  const rival=promoRival(s);
  if(rival&&rival.id!==people[0].id)people.push(rival);
 }
 const supporting=allPeople.filter(r=>!people.some(person=>person.id===r.id));
 const actor=r=>`<div class="exchange-actor ${active===r.id?'speaking':''} ${people.length===1?'only-actor':''}" style="--actor-color:${r.color}"><div class="exchange-drawing">${portrait(r)}</div><div class="exchange-actor-name">${esc(r.name)}</div></div>`;
 const runSheet=`<ol class="run-sheet" aria-label="Private running order">${state.card.map((segment,i)=>`<li ${i===live.index?'aria-current="step"':''}><b>${i===3?'Main event':'Segment '+(i+1)}</b><span>${esc(segment.kind==='promo'?w(segment.a).name+' on the mic':matchSides(segment).map(sideLabel).join(' vs. '))}</span></li>`).join('')}</ol>`;
 const cue=s.kind==='promo'?s.hook:finishSummary(s);
 const status=answer?(m.kind==='promo'?'The last word.':'The dust settles.'):choosing?'The turning point.':m.kind==='promo'?'The mic is live.':'The bell has gone.';
 const transcript=answer?scenePages(m.opening||[]).concat(scenePages(answer.beats||[])):intro.slice(0,choosing?intro.length:position.intro+1);
 return `<div class="live-wrap exchange-wrap"><div class="exchange-top"><span class="live-label"><i class="live-dot"></i> ON AIR · WEEK ${state.week}</span><span class="exchange-count">${m.kind==='promo'?'PROMO':'MATCH'} ${live.index+1} / ${live.moments.length}</span></div><h1 id="live-heading" class="exchange-heading" tabindex="-1">${status}</h1><div class="exchange-context">${esc(m.context)}</div>${runSheet}<p class="booker-cue"><strong>Agreed cue</strong> · ${esc(cue)}</p><ol class="exchange-progress" aria-label="Show progress">${live.moments.map((_,i)=>`<li class="${i<live.index?'done':i===live.index?'current':''}" ${i===live.index?'aria-current="step"':''}><span>${i<live.index?'✓':i+1}</span></li>`).join('')}</ol><section class="exchange-scene ${choosing?'decision-scene':''} ${typeof active==='string'?'audience-speaking':''}" aria-label="${choosing?'The turning point':esc(speakerName(active))+' speaking'}"><div class="exchange-speedlines" aria-hidden="true"></div><div class="exchange-cast ${people.length===1?'solo-cast':''}">${people.map(actor).join('')}</div>${supporting.length?`<div class="supporting-cast">${supporting.map(r=>`<span>${portrait(r)}<b>${esc(r.name)}</b></span>`).join('')}</div>`:''}${!choosing&&beat.cue?`<div class="exchange-impact" aria-hidden="true">${esc(beat.cue)}</div>`:''}${active==='crowd'&&!choosing?'<div class="crowd-callout" aria-hidden="true">THE CROWD’S GOT SOMETHING TO SAY!</div>':''}</section>${choosing?`<section class="exchange-decision"><div class="exchange-decision-head"><h2>Make the call</h2><span>FROM BEHIND THE CURTAIN</span></div><div class="exchange-choices">${m.choices.map((choice,i)=>`<button type="button" class="exchange-choice" data-moment-choice="${i}"><span>${String.fromCharCode(65+i)}</span><div><small>${esc(choice.labelTag||choice.tag)}</small><strong>${esc(choice.title)}</strong><span class="choice-hint">${esc(choice.hint||'Changes this segment’s quality.')}</span></div><b aria-hidden="true">→</b></button>`).join('')}</div><details class="exchange-notes"><summary>The ringside situation</summary><p>${esc(m.setup)}</p>${m.choices.map(c=>`<h3>${esc(c.title)}</h3><p>${esc(c.detail)}</p>`).join('')}</details></section>`:`<section class="speech-panel ${beat.kind==='shout'?'speech-shout':''} ${answer?'after-call':''}" aria-label="Dialogue"><div class="speaker-tab">${esc(speakerName(active))}</div><button type="button" id="dialogue-next" class="speech-advance" aria-label="Continue dialogue" aria-describedby="dialogue-accessible"><span id="dialogue-accessible" class="sr-only">${esc(beat.text)}</span><span id="dialogue-text" class="dialogue-text" aria-hidden="true" data-line="${esc(beat.text)}">${esc(beat.text)}</span><span class="dialogue-prompt" aria-hidden="true">${answer&&isLast?'SCENE COMPLETE':!answer&&isLast?'THE TURNING POINT':'TAP TO CONTINUE'} <b>▼</b></span></button><div class="speech-controls"><button type="button" id="dialogue-back" ${offset===0?'disabled':''} aria-label="Previous dialogue line">← Back</button><span>${offset+1} / ${frames.length}</span><button type="button" id="dialogue-skip">${answer?(m.kind==='promo'?'To the final words':'To the bell'):'To the turning point'} →</button></div></section>${answer?`<div class="exchange-verdict"><button class="btn primary" id="next-moment">${live.index===live.moments.length-1?'Show results':'Next segment'} →</button></div>`:''}`}${playbackSettings()}<p class="exchange-finish">${esc(s.kind==='match'?matchLabel(s)+(s.title?' · WWA championship at stake':''):m.context)}</p><details class="exchange-log"><summary>Dialogue log</summary>${transcript.map(line=>`<div><strong>${esc(speakerName(line.speaker))}</strong><p>${esc(line.text)}</p></div>`).join('')}</details></div>`;
}
function updateExchangeLine(direction){
 const live=state.liveShow;if(!live)return;const position=exchangeState(),answer=live.answers[live.index],m=live.moments[live.index];
 const frames=answer?resultExchange({...answer,actors:answer.actors||m.actors}):introExchange(m,state.card[live.index]);const key=answer?'result':'intro';
 if(direction>0&&answer&&position.result>=frames.length-1){nextMoment();return}
 position[key]=clamp(position[key]+direction,0,answer?frames.length-1:frames.length);render();focusExchange();
}
function finishDialogueTyping(){
 if(!dialogueTimer)return false;clearInterval(dialogueTimer);dialogueTimer=null;
 const el=$('#dialogue-text');if(el)el.textContent=el.dataset.line;return true;
}
function focusExchange(){
 const el=$('#dialogue-next')||$('[data-moment-choice]')||$('#live-heading');if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',behavior:'auto'})}
}
function bindExchange(){
 clearInterval(dialogueTimer);dialogueTimer=null;
 document.querySelectorAll('[data-moment-choice]').forEach(b=>b.onclick=()=>chooseMoment(Number(b.dataset.momentChoice)));
 const text=$('#dialogue-text'),button=$('#dialogue-next');
 if(text&&button){
  const line=text.dataset.line;
  if(state.preferences.text==='typewriter'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   const characters=Array.from(line);let at=0;text.textContent='';
   dialogueTimer=setInterval(()=>{at=Math.min(at+2,characters.length);text.textContent=characters.slice(0,at).join('');if(at>=characters.length){clearInterval(dialogueTimer);dialogueTimer=null}},22);
  }
  button.onclick=()=>{if(finishDialogueTyping())return;updateExchangeLine(1)};
 }
 if($('#dialogue-back'))$('#dialogue-back').onclick=()=>updateExchangeLine(-1);
 if($('#dialogue-skip'))$('#dialogue-skip').onclick=()=>{const live=state.liveShow,pos=exchangeState(),answer=live.answers[live.index],m=live.moments[live.index];if(answer)pos.result=resultExchange({...answer,actors:answer.actors||m.actors}).length-1;else pos.intro=introExchange(m,state.card[live.index]).length;render();finishDialogueTyping();focusExchange()};
 if($('#next-moment'))$('#next-moment').onclick=nextMoment;
}
