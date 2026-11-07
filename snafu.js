'use strict';

function snafuDefaults(s){
 if(!s.production||s.production.week!==s.week)s.production={week:s.week,choice:null};
 if(!s.production.issueId){
  // Existing one-night production choices keep their original three-problem rotation.
  const pool=s.production.choice?PRODUCTION_ISSUES.slice(0,3):productionPool(s);
  s.production.issueId=pool[(s.week-1)%pool.length].id;
 }
 // A hired crew member quietly handles problems in their department.
 const issue=allProductionIssues().find(item=>item.id===s.production.issueId),handler=crewHandles(issue,s);
 if(handler&&!s.production.choice&&!s.liveShow&&!s.recap){s.production.choice='safe';s.production.crew=handler.id}
 if(!s.weeklyBriefing||s.weeklyBriefing.week!==s.week)s.weeklyBriefing=null;
 return s;
}
function productionIssue(){return allProductionIssues().find(issue=>issue.id===state.production.issueId)||PRODUCTION_ISSUES[(state.week-1)%PRODUCTION_ISSUES.length]}
function productionCastNote(issue){
 const card=state.card.map((segment,i)=>state.drafts[i]||segment);
 const segment=card[issueSegmentIndex(issue,card)];
 const people=segment?matchPeople(segment).map(w):[];
 if(!people.length)return 'Pencil in the affected cast to size up the workaround.';
 const stat=issue.stat==='skill'&&segment.kind!=='promo'?'skill':'charisma';
 const ready=people.reduce((total,r)=>total+r[stat],0)/people.length>=75;
 return `${people.map(r=>r.name).join(' / ')} · ${ready?'The current cast can carry the workaround.':'The current cast may struggle with the workaround.'}`;
}
function productionOptions(){
 const issue=productionIssue(),main=issue.segment==='main'||issue.segment===3,segment=issue.matchOnly?'first match':main?'main event':'opener',stat=issue.stat==='skill'?(main?'ring skill (mic skills for a promo)':'ring skill'):'mic skills';
 return [
  {key:'safe',label:issue.safe,hint:state.production.crew?`${CREW.find(c=>c.id===state.production.crew)?.name||'Your crew'} handled it. No extra cost.`:`Adds ${money(fixCost())} to show costs. No quality penalty.`},
  {key:'wild',label:issue.wild,hint:`Free. The ${segment} gains 2 quality with average ${stat} of 75+, or loses 2 otherwise.`},
  {key:'crew',label:issue.crew,hint:`Free. The ${segment} loses 1 quality.`}
 ];
}
function weeklyBriefingPending(s=state){return !!s.started&&!s.liveShow&&!s.recap&&!(s.weeklyBriefing?.week===s.week&&s.weeklyBriefing.completed)}
function ensureWeeklyBriefing(){
 snafuDefaults(state);
 if(!state.weeklyBriefing){
  const request=backstageConversation();
  state.weeklyBriefing={week:state.week,issueId:state.production.issueId,request:{actor:request.actor},requestChoice:null,completed:false};
 }
 return state.weeklyBriefing;
}
function briefingConversation(){const briefing=ensureWeeklyBriefing();return backstageConversation(briefing.request.actor)}
function weeklyBriefingStage(){
 const briefing=ensureWeeklyBriefing();
 if(!state.production.choice)return 'production';
 if(!briefingConversation().answered)return briefing.requestChoice?'tone':'backstage';
 return 'review';
}
function chooseBriefingProduction(choice){
 const b=ensureWeeklyBriefing();
 if(b.completed||state.production.choice||!productionOptions().some(option=>option.key===choice))return false;
 state.production={week:state.week,issueId:b.issueId,choice};save();return true;
}
function chooseBriefingResponse(choice){
 const b=ensureWeeklyBriefing(),request=briefingConversation();
 if(b.completed||!state.production.choice||request.answered||b.requestChoice||!request.choices.some(option=>option[0]===choice))return false;
 b.requestChoice=choice;save();return true;
}
function confirmBriefingTone(tone){
 const b=ensureWeeklyBriefing(),request=briefingConversation();
 if(b.completed||request.answered||!['private','public'].includes(tone)||!request.choices.some(option=>option[0]===b.requestChoice))return false;
 resolveBackstage(request.actor,b.requestChoice,tone,request.active,request.age);save();return true;
}
function completeWeeklyBriefing(){
 const b=ensureWeeklyBriefing();
 if(b.completed||!state.production.choice||!briefingConversation().answered)return false;
 b.completed=true;view='book';save();return true;
}
function weeklyBriefingReview(){
 const request=briefingConversation(),answer=request.answered,production=productionOptions().find(option=>option.key===state.production.choice);
 const promises=state.promises.filter(p=>p.status==='open'),challenges=state.challenges.filter(c=>c.status==='open');
 return `<section class="briefing-receipt"><h3>Production decision</h3><p>${esc(productionIssue().title)}</p><strong>${esc(production?.label||'Not decided')}</strong><p class="note">${esc(production?.hint||'Choose a response first.')}</p></section><section class="briefing-receipt"><div class="byline">${avatar(w(request.actor))}<h3>${esc(w(request.actor).name)}</h3></div><p>${esc(answer?.summary||'A response is still needed.')}</p><p class="note">${esc(trustReadout(w(request.actor)))} · Momentum ${signed(w(request.actor).momentum)}</p>${answer?.tone?`<p class="note">${answer.tone==='private'?(isFeatured(request.actor)&&!easyMode()?'Kept private':'Kept private · trust +3'):'Made public · momentum +2'}</p>`:''}</section><section class="briefing-obligations"><h3>Booking reminders</h3>${promises.length?`<ul>${promises.map(p=>`<li><strong>${p.due<=state.week?'Due this week: ':''}</strong>${esc(promiseLabel(p))}</li>`).join('')}</ul>`:'<p>No open booking promises.</p>'}${challenges.length?`<h4>Open challenges</h4><ul>${challenges.map(c=>`<li>${esc(w(c.actor).name)} → ${esc(w(c.target).name)}</li>`).join('')}</ul><p class="note">Book or decline these from the story planner.</p>`:''}</section>`;
}
// The consequences of each backstage answer, as badges instead of fine print.
// Venue-problem answers share the backstage card style: a letter, the action and its cost in badges.
function productionChips(key){
 const issue=productionIssue(),main=issue.segment==='main'||issue.segment===3,segment=issue.matchOnly?'first match':main?'main event':'opener',stat=issue.stat==='skill'?'ring skill':'mic skills';
 if(key==='safe')return state.production.crew?[{stat:'info',label:'Your crew has it · free'}]:[{stat:'cash',value:-fixCost(),label:money(fixCost())+' show cost'},{stat:'quality',label:'No quality loss'}];
 if(key==='wild')return [{stat:'quality',label:`${segment} ±2 quality`},{stat:'info',label:`Needs ${stat} 75+`}];
 return [{stat:'quality',value:-1,label:`${segment} −1 quality`},{stat:'info',label:'Free'}];
}
function productionOptionBody(option,i){return `<span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body"><strong>${esc(option.label)}</strong><span class="sr-only">${esc(option.hint)}</span>${effectChips(productionChips(option.key),'',true)}</span>`}
function requestChips(key,request){
 const chip=(stat,value,who)=>({stat,value,who}),note=label=>({stat:'info',label}),event=monthlyEventName(request.arc.start+3);
 const promise=when=>[{stat:'promise',label:'Due '+when},{stat:'trust',label:'Kept +8 · Broken −12'}];
 return ({
  yes:promise('tonight'),spotlight:promise('tonight'),change:promise('tonight'),rematch:promise(event),
  commit:promise(request.arc.route==='earn'&&!request.arc.earned?'tonight':event),
  later:[chip('trust',-1)],no:[chip('trust',-4),note('Request closed')],honest:[chip('trust',-2)],delay:[chip('trust',-2)],reject:[chip('trust',-8)],
  earn:[note('Clean win elsewhere unlocks it')],team:request.age===3?[chip('chemistry',6,'His teams')]:[note('Starts a tag team')],back:[note('Keeps current promises')],
  respect:[chip('momentum',3)],revenge:[chip('heat',12,'vs. the insurer')]
 })[key]||[];
}
function requestOptionBody(choice,request){
 // Featured wrestlers keep affection hidden: trust chips only appear in easy mode.
 const [key,label,hint]=choice,chips=requestChips(key,request).filter(chip=>chip.stat!=='trust'||easyMode()||!isFeatured(request.actor)),shortHint=/trust|momentum|chemistry|heat/i.test(hint)?'':hint;
 return `<strong>${esc(label)}</strong>${shortHint?`<span class="answer-note">${esc(shortHint)}</span>`:''}${effectChips(chips,'What this answer changes')}`;
}
const PROMISE_KEYS=['yes','spotlight','change','rematch','commit'];
function answerPicker(request,selected){
 const pick=selected&&request.choices.some(([key])=>key===selected)?selected:request.choices[0][0];
 return `<fieldset class="answer-picker"><legend>Your answer</legend>${request.choices.map((choice,i)=>`<label class="answer-card"><input type="radio" name="response" value="${choice[0]}" ${choice[0]===pick?'checked':''}><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body">${requestOptionBody(choice,request)}</span></label>`).join('')}</fieldset>`;
}
function toneToggle(publicLabel='In front of the locker room'){
 return `<fieldset class="tone-toggle"><legend>Who hears it?</legend><div><label><input type="radio" name="tone" value="private" checked><span><strong>Just between you</strong>${effectChips([{stat:'trust',value:3}],'Private bonus')}</span></label><label><input type="radio" name="tone" value="public"><span><strong>${esc(publicLabel)}</strong>${effectChips([{stat:'momentum',value:2}],'Public bonus')}</span></label></div></fieldset>`;
}
function answerButtonLabel(key){return PROMISE_KEYS.includes(key)?'Give your word':'Tell them'}
function weeklyBriefingCard({includeVenue=true}={}){
 const b=state.weeklyBriefing,issue=productionIssue(),request=backstageConversation(b?.request.actor);
 const option=productionOptions().find(item=>item.key===state.production.choice);
 return `<section class="booker-inbox" id="booker-inbox" aria-label="Messages before doors">
 ${includeVenue?`<details class="card"><summary class="inbox-head"><span class="inbox-from">Venue owner</span><strong class="inbox-subject">${esc(issue.title)}</strong><span class="inbox-status ${option?'is-done':'is-due'}">${option?'Answered':'Reply before doors'}</span></summary>
 ${venueEmail()}<p class="note">${esc(productionCastNote(issue))}</p><div class="snafu-options">${option?`<p>${esc(option.label)} · ${esc(option.hint)}</p>`:productionOptions().map((item,i)=>`<button type="button" class="answer-card" data-inbox-production="${item.key}">${productionOptionBody(item,i)}</button>`).join('')}</div></details>`:''}
 <details class="card" data-inbox-wrestler><summary class="inbox-head"><span class="inbox-from">Backstage</span><strong class="inbox-subject">${esc(w(request.actor).name)}</strong><span class="inbox-status ${request.answered?'is-done':'is-due'}">${request.answered?'Conversation logged':'Wants a word'}</span></summary>
 ${smokeBreakScene(request)}
 ${request.answered?`<p>${esc(request.answered.summary)}</p>`:`<form id="inbox-response">${answerPicker(request,b?.requestChoice)}${toneToggle()}<button class="btn primary" id="inbox-submit">${answerButtonLabel(b?.requestChoice&&request.choices.some(([key])=>key===b.requestChoice)?b.requestChoice:request.choices[0][0])}</button></form>`}</details></section>`;
}
function passBackstageRequest(){
 const request=briefingConversation();
 if(request.answered)return false;
 const r=w(request.actor),answer={choice:'pass',tone:'private',summary:'You passed on the conversation tonight.'};
 r.trust=clamp(r.trust-2);
 if(request.active)state.arc.answered[state.week]=answer;
 else state.backstage[state.week]={actor:r.id,...answer};
 incident(`${r.name} went home without an answer. Trust −2.`,[r.id],'backstage');
 completeWeeklyBriefing();
 save();
 return true;
}
function bindBookerInbox(){
 const redraw=panel=>{
  render();
  const details=panel===1?$('[data-inbox-wrestler]'):$('#booker-inbox details:not([data-inbox-wrestler])');
  if(panel===0&&!details)$('.press-picked')?.focus({preventScroll:true});
  if(details){details.open=true;details.querySelector('summary').focus({preventScroll:true})}
 };
 document.querySelectorAll('[data-inbox-production]').forEach(button=>button.onclick=()=>{
  if(chooseBriefingProduction(button.dataset.inboxProduction)){completeWeeklyBriefing();redraw(0)}
 });
 const form=$('#inbox-response');
 if(form)form.onsubmit=event=>{
  event.preventDefault();
  const fields=new FormData(form),b=ensureWeeklyBriefing(),choice=fields.get('response');
  if(!briefingConversation().choices.some(([key])=>key===choice))return;
  b.requestChoice=choice;
  if(confirmBriefingTone(fields.get('tone'))){completeWeeklyBriefing();redraw(1)}
 };
 if(form)form.querySelectorAll('input[name="response"]').forEach(input=>input.onchange=()=>{const submit=$('#inbox-submit');if(submit)submit.textContent=answerButtonLabel(input.value)});
}
function venueEmail(){
 const issue=productionIssue(),venue=showLocation().venue;
 return `<article class="venue-email"><small>INBOX · 1 UNREAD</small><h3>Re: ${esc(issue.title)}</h3><p class="email-from">From the owner of ${esc(venue)}</p><p>hey booker,</p><p>${esc(issueText(issue))}</p><p>can you let me know what were doing before doors? im on the floor til then.</p><p class="note">sent from my phne</p></article>`;
}
function smokeBreakScene(request){
 const {active,age,arc,actor}=request;
 const visit=Object.values(state.backstage).filter(record=>record.actor===actor).length;
 const opener=CHARACTER_SPECIALS[actor].branches[visit%2][1];
 const ask=active?[
  'You got a second, boss? I want another shot at Term Life. Fair this time. How do I get there?',
  arc.route==='earn'?(arc.earned?'I got my clean win. When do I get my rematch?':'Who do I have to beat to get my rematch?'):arc.route==='team'?'You still see us working as a team, boss?':'Are we still on for that fair rematch?',
  'The big show’s almost here. Can I tell people what you’re putting on the poster?',
  'Doors open soon, boss. What do you need from me tonight?'
 ][age]:opener+' '+(w(actor).trust<45&&weeklyRequest()!=='promo'?'Before we talk about a match, let me speak to the room.':{appearance:'Can you get me on the card tonight?',win:'Can you give me a clean win tonight?',promo:'Can I have a few minutes on the mic tonight?'}[weeklyRequest()]);
 return `<article class="smoke-break"><small>SMOKE BREAK · OUTSIDE ${esc(showLocation().venue)}</small><p class="scene-direction">The side door clicks shut. A wrestler steps over to talk before doors open.</p><div class="byline">${avatar(w(actor))}<h3>${esc(w(actor).name)}</h3></div><blockquote>“${esc(ask)}”</blockquote></article>`;
}
function openWeeklyBriefing(reviewOnly=false){
 if(onTitle||state.liveShow||state.recap)return;
 const b=ensureWeeklyBriefing();
 if(b.completed){
  if(reviewOnly)modal(`Week ${state.week} business`,weeklyBriefingReview(),(_,dialog)=>dialog.close(),'Close');
  return;
 }
 const d=$('#modal');
 function draw(){
  const stage=weeklyBriefingStage(),request=briefingConversation();
  const activeStep=stage==='production'?0:stage==='review'?2:1;
  d.className='weekly-briefing briefing-'+stage;
  d.setAttribute('aria-labelledby','briefing-title');
  d.innerHTML=`<form id="weekly-briefing-form"><div class="modal-head"><div><small>WEEK ${state.week} · ${esc(showLocation().town)}, WI</small><h2 id="briefing-title" tabindex="-1">${['Little Snafu · Inbox','Outside the venue','The week ahead'][activeStep]}</h2></div></div><ol class="briefing-steps" aria-label="Weekly briefing">${['Inbox','Smoke break','Week ahead'].map((label,i)=>`<li ${i===activeStep?'aria-current="step"':''} class="${i<activeStep?'done':''}"><b>${i+1}</b>${label}</li>`).join('')}</ol>${stage==='production'?`<section>${venueEmail()}<h3>Reply to the owner</h3><div class="snafu-options">${productionOptions().map((option,i)=>`<button type="button" class="answer-card" data-snafu-choice="${option.key}">${productionOptionBody(option,i)}</button>`).join('')}</div><p class="note">Costs are added to the show budget. They are charged when the show runs.</p></section>`:stage==='backstage'?`<section>${smokeBreakScene(request)}<h3>What do you say?</h3><div class="snafu-options">${request.choices.map((choice,i)=>`<button type="button" class="answer-card" data-briefing-response="${choice[0]}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="answer-body">${requestOptionBody(choice,request)}</span></button>`).join('')}</div></section>`:stage==='tone'?`<section>${smokeBreakScene(request)}<p><strong>Your answer</strong> · ${esc(request.choices.find(option=>option[0]===b.requestChoice)?.[1]||'Response selected.')}</p>${toneToggle('Put it on the poster')}<p class="note">${esc(w(request.actor).name)} will remember your answer.</p></section>`:weeklyBriefingReview()+weekAheadPanel()}<div class="modal-actions"><button type="button" class="text-btn" id="briefing-title-menu">Return to title</button>${stage==='tone'?'<button type="submit" class="btn primary">Confirm response →</button>':stage==='review'?'<button type="submit" class="btn primary">Open tonight’s poster →</button>':''}</div></form>`;
  d.oncancel=null;
  d.onclose=()=>{if(!d.open)d.removeAttribute('aria-labelledby');};
  d.querySelector('#briefing-title-menu').onclick=()=>{save();onTitle=true;d.close();render()};
  d.querySelectorAll('[data-snafu-choice]').forEach(button=>button.onclick=()=>{if(chooseBriefingProduction(button.dataset.snafuChoice))draw()});
  if(stage==='review')bindWeekAhead(d,draw);
  d.querySelectorAll('[data-briefing-response]').forEach(button=>button.onclick=()=>{if(chooseBriefingResponse(button.dataset.briefingResponse))draw()});
  d.querySelector('form').onsubmit=event=>{
   event.preventDefault();
   if(stage==='tone'){if(confirmBriefingTone(new FormData(event.currentTarget).get('tone')))draw();return}
   if(stage==='review'&&completeWeeklyBriefing()){
    d.close();render();const heading=document.querySelector('.main h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}
   }
  };
  save();if(!d.open)d.showModal();d.scrollTop=0;d.querySelector('#briefing-title').focus({preventScroll:true});refreshWebAppUI();
 }
 draw();
}
function applyProductionDecision(index,people,fallout){
 if(state.production.week!==state.week||!state.production.choice)return 0;
 const issue=productionIssue(),target=issueSegmentIndex(issue);if(index!==target)return 0;
 const option=productionOptions().find(option=>option.key===state.production.choice);if(!option)return 0;
 const average=people.reduce((total,r)=>total+r[(issue.stat==='skill'&&state.card[index].kind!=='promo'?'skill':'charisma')],0)/people.length;
 let delta=0,outcome;
 if(state.production.choice==='safe')outcome=state.production.crew?'Your crew handled it at no extra cost.':`The paid fix worked. ${money(fixCost())} was included in show costs.`;
 else if(state.production.choice==='crew'){delta=-1;outcome='The simple workaround cost 1 segment quality.'}
 else{delta=average>=75?2:-2;outcome=(delta>0?issue.success:issue.failure)+` Segment quality ${delta>0?'+':''}${delta}.`}
 fallout.push(incident(`${issue.title} ${option.label}. ${outcome}`,people.map(r=>r.id),'production'));
 return delta;
}
