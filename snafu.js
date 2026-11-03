'use strict';

function snafuDefaults(s){
 if(!s.production||s.production.week!==s.week)s.production={week:s.week,choice:null};
 if(!s.production.issueId){
  // Existing one-night production choices keep their original three-problem rotation.
  const pool=s.production.choice?PRODUCTION_ISSUES.slice(0,3):PRODUCTION_ISSUES;
  s.production.issueId=pool[(s.week-1)%pool.length].id;
 }
 if(!s.weeklyBriefing||s.weeklyBriefing.week!==s.week)s.weeklyBriefing=null;
 return s;
}
function productionIssue(){return PRODUCTION_ISSUES.find(issue=>issue.id===state.production.issueId)||PRODUCTION_ISSUES[(state.week-1)%PRODUCTION_ISSUES.length]}
function productionOptions(){
 const issue=productionIssue(),segment=issue.matchOnly?'first match':issue.segment===3?'main event':'opener',stat=issue.stat==='skill'?(issue.segment===3?'ring skill (mic skills for a promo)':'ring skill'):'mic skills';
 return [
  {key:'safe',label:issue.safe,hint:'Adds $40 to show costs. No quality penalty.'},
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
 if(b.completed||!state.production.choice||request.answered||!['private','public'].includes(tone)||!request.choices.some(option=>option[0]===b.requestChoice))return false;
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
 return `<section class="briefing-receipt"><h3>Production decision</h3><p>${esc(productionIssue().title)}</p><strong>${esc(production?.label||'Not decided')}</strong><p class="note">${esc(production?.hint||'Choose a response first.')}</p></section><section class="briefing-receipt"><div class="byline">${avatar(w(request.actor))}<h3>${esc(w(request.actor).name)}</h3></div><p>${esc(answer?.summary||'A response is still needed.')}</p><p class="note">Trust ${w(request.actor).trust}/100 · Momentum ${signed(w(request.actor).momentum)}</p>${answer?.tone?`<p class="note">${answer.tone==='private'?'Kept private · trust +3':'Made public · momentum +2'}</p>`:''}</section><section class="briefing-obligations"><h3>Booking reminders</h3>${promises.length?`<ul>${promises.map(p=>`<li><strong>${p.due<=state.week?'Due this week: ':''}</strong>${esc(promiseLabel(p))}</li>`).join('')}</ul>`:'<p>No open booking promises.</p>'}${challenges.length?`<h4>Open challenges</h4><ul>${challenges.map(c=>`<li>${esc(w(c.actor).name)} → ${esc(w(c.target).name)}</li>`).join('')}</ul><p class="note">Book or decline these from the story planner.</p>`:''}</section>`;
}
function weeklyBriefingCard(){
 const b=state.weeklyBriefing;
 if(!b||b.week!==state.week||!b.completed)return `<section class="card inbox"><h3>Little Snafu</h3><p class="note">This week’s production problem and backstage requests must be addressed before booking.</p></section>`;
 const option=productionOptions().find(option=>option.key===state.production.choice),request=briefingConversation();
 return `<section class="card inbox weekly-business"><small>WEEK ${state.week} · BUSINESS RESOLVED</small><h3>${esc(productionIssue().title)}</h3><p>${esc(option?.label||'Production decision saved.')}</p><p class="note">${esc(w(request.actor).name)}: ${esc(request.answered?.summary||'Response saved.')}</p><button class="text-btn" id="review-week">Review this week →</button></section>`;
}
function maybeOpenWeeklyBriefing(){
 if(onTitle||!weeklyBriefingPending()||document.querySelector('dialog[open]'))return;
 openWeeklyBriefing();
}
function venueEmail(){
 const issue=productionIssue(),venue=showLocation().venue;
 return `<article class="venue-email"><small>INBOX · 1 UNREAD</small><h3>Re: ${esc(issue.title)}</h3><p class="email-from">From the owner of ${esc(venue)}</p><p>hey booker,</p><p>${esc(issue.text)}</p><p>can you let me know what were doing before doors? im on the floor til then.</p><p class="note">sent from my phne</p></article>`;
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
 ][age]:opener+' '+{appearance:'Can you get me on the card tonight?',win:'Can you give me a clean win tonight?',promo:'Can I have a few minutes on the mic tonight?'}[weeklyRequest()];
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
  d.innerHTML=`<form id="weekly-briefing-form"><div class="modal-head"><div><small>WEEK ${state.week} · ${esc(showLocation().town)}, WI</small><h2 id="briefing-title" tabindex="-1">${['Little Snafu · Inbox','Outside the venue','Booker’s notes'][activeStep]}</h2></div></div><ol class="briefing-steps" aria-label="Weekly briefing">${['Inbox','Smoke break','Notes'].map((label,i)=>`<li ${i===activeStep?'aria-current="step"':''} class="${i<activeStep?'done':''}"><b>${i+1}</b>${label}</li>`).join('')}</ol>${stage==='production'?`<section>${venueEmail()}<h3>Reply to the owner</h3><div class="snafu-options">${productionOptions().map(option=>`<button type="button" data-snafu-choice="${option.key}"><strong>${esc(option.label)}</strong><span>${esc(option.hint)}</span></button>`).join('')}</div><p class="note">Costs are added to the show budget. They are charged when the show runs.</p></section>`:stage==='backstage'?`<section>${smokeBreakScene(request)}<h3>What do you say?</h3><div class="snafu-options">${request.choices.map(([key,label,hint])=>`<button type="button" data-briefing-response="${key}"><strong>${esc(label)}</strong><span>${esc(hint)}</span></button>`).join('')}</div></section>`:stage==='tone'?`<section>${smokeBreakScene(request)}<p><strong>Your answer</strong> · ${esc(request.choices.find(option=>option[0]===b.requestChoice)?.[1]||'Response selected.')}</p>${field('How do you handle the conversation?',`<select name="tone"><option value="private">Keep it private · trust +3</option><option value="public">Put it on the poster · momentum +2</option></select>`)}<p class="note">${esc(w(request.actor).name)} will remember your answer.</p></section>`:weeklyBriefingReview()}<div class="modal-actions"><button type="button" class="text-btn" id="briefing-title-menu">Return to title</button>${stage==='tone'?'<button type="submit" class="btn primary">Confirm response →</button>':stage==='review'?'<button type="submit" class="btn primary">Open tonight’s poster →</button>':''}</div></form>`;
  d.oncancel=event=>event.preventDefault();
  d.onclose=()=>{if(!d.open)d.removeAttribute('aria-labelledby');if(!onTitle&&weeklyBriefingPending())queueMicrotask(maybeOpenWeeklyBriefing)};
  d.querySelector('#briefing-title-menu').onclick=()=>{save();onTitle=true;d.close();render()};
  d.querySelectorAll('[data-snafu-choice]').forEach(button=>button.onclick=()=>{if(chooseBriefingProduction(button.dataset.snafuChoice))draw()});
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
 const issue=productionIssue(),target=issue.matchOnly?state.card.findIndex(segment=>segment.kind==='match'):(issue.segment??0);if(index!==target)return 0;
 const option=productionOptions().find(option=>option.key===state.production.choice);if(!option)return 0;
 const average=people.reduce((total,r)=>total+r[(issue.stat==='skill'&&state.card[index].kind!=='promo'?'skill':'charisma')],0)/people.length;
 let delta=0,outcome;
 if(state.production.choice==='safe')outcome='The paid fix worked. $40 was included in show costs.';
 else if(state.production.choice==='crew'){delta=-1;outcome='The simple workaround cost 1 segment quality.'}
 else{delta=average>=75?2:-2;outcome=(delta>0?issue.success:issue.failure)+` Segment quality ${delta>0?'+':''}${delta}.`}
 fallout.push(incident(`${issue.title} ${option.label}. ${outcome}`,people.map(r=>r.id),'production'));
 return delta;
}
