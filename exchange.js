'use strict';
// Show night is reported, not played: one short summary per segment.
const crowdHeckles=[
 'Less posing! More wrestling!', "ONE HOLD! TWO HOLDS!", 'PUT RUDY IN!', "THE BOYS! THE BOYS!",
 'You’re a towel! Act like it!', "THAT’S A FOUL, RUDY!", "DOCTOR! DOCTOR!", 'We’re ready for our close-up!',
 "FREEZE THAT RING!", 'Small ears! BIG SUPLEX!', 'SWEEP! SWEEP! SWEEP!', 'Who put you on the list?',
 "WE HEARD YOU, JOHN!", 'We want liftoff!', "TELL US ABOUT YOUR DAD!", "SIDE BY SIDE!",
 'Put the kettle on!', 'Are rope breaks covered?', 'Nice manners! Nasty headlock!', 'Log off and lock up!',
 'Three sizes! Three sizes!', 'Play the big finish!', 'FREDDIE! FREDDIE!', 'Give ’em some zest!',
 "AMEN! AMEN!", 'DROP THE BEAT!', "CALL THE MATCH, SMARK!", 'You live around the corner!',
 "TEN OUT OF TEN, TED!", 'ALL ABOARD!', 'PIZZA! PIZZA! PIZZA!', 'Pick a corner, Ron!', "BOTH BOOTS! BOTH BOOTS!", 'The proof is in the pudding!', "ONE MORE ROUND!", 'STRONG ROOTS! STRONG ROOTS!', 'YOU CHOSE US!', 'LET THE DOG WRESTLE!'
];
// Compact consequence badges shared by the in-match choices and the post-call verdict.
const STAT_GLYPHS={
 favor:'<ellipse cx="10" cy="5" rx="6" ry="2.2"/><path d="M6 17c0-3.3 1.8-6 4-6s4 2.7 4 6"/>',
 momentum:'<path d="M3 15l5-5 3 3 6-7"/><path d="M12 6h5v5"/>',
 trust:'<path d="M10 17s-6-3.6-6-8a3.3 3.3 0 0 1 6-2 3.3 3.3 0 0 1 6 2c0 4.4-6 8-6 8z"/>',
 morale:'<path d="M10 3l2.1 4.4 4.9.6-3.6 3.3.9 4.8L10 13.8 5.7 16.1l.9-4.8L3 8l4.9-.6z"/>',
 heat:'<path d="M10 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-7.5z"/>',
 promise:'<rect x="3.5" y="4.5" width="13" height="12" rx="1"/><path d="M3.5 8h13M7 3v3M13 3v3M7.5 12l2 2 3.5-4"/>',
 cash:'<rect x="2.5" y="5.5" width="15" height="9" rx="1"/><circle cx="10" cy="10" r="2"/>',
 quality:'<path d="M10 3l2.1 4.4 4.9.6-3.6 3.3.9 4.8L10 13.8 5.7 16.1l.9-4.8L3 8l4.9-.6z"/>',
 info:'<circle cx="10" cy="10" r="7"/><path d="M10 9v5M10 6.2v.1"/>',
 chemistry:'<path d="M8.5 11.5a3 3 0 0 0 4.2 0l2.6-2.6a3 3 0 0 0-4.2-4.2l-.9.9"/><path d="M11.5 8.5a3 3 0 0 0-4.2 0l-2.6 2.6a3 3 0 0 0 4.2 4.2l.9-.9"/>'
};
const STAT_NAMES={momentum:'Momentum',trust:'Trust',morale:'Morale',heat:'Heat',chemistry:'Chemistry',favor:'His favor'};
function effectChips(chips,label='What it changes',hidden=false){
 if(!chips?.length)return '';
 return `<ul class="call-chips" ${hidden?'aria-hidden="true"':`aria-label="${esc(label)}"`}>${chips.map(c=>`<li class="call-chip is-${c.stat} ${c.value<0?'is-down':''}"><svg viewBox="0 0 20 20" aria-hidden="true">${STAT_GLYPHS[c.stat]||''}</svg>${c.label?`<span>${esc(c.label)}</span>`:`<b>${c.value>0?'+':'−'}${Math.abs(c.value)}</b><span>${STAT_NAMES[c.stat]||c.stat}</span>`}${c.who?`<em>${esc(c.who)}</em>`:''}</li>`).join('')}</ul>`;
}
const SUMMARY_SKIP=/^One! Two!|calls for the bell|has won!$|have won!$|wins? it!$/;
function reportQuote(m,answer){
 const spoken=b=>typeof b.speaker==='number'&&b.text&&b.kind!=='action';
 const beat=(answer.beats||[]).find(b=>spoken(b)&&b.key)||(answer.beats||[]).find(spoken)||(m.opening||[]).find(spoken);
 return beat?{who:w(beat.speaker).name,text:beat.text}:null;
}
function reportSummary(m,s,answer){
 const action=(answer.beats||[]).filter(b=>b.speaker==='commentary'&&b.text&&!SUMMARY_SKIP.test(b.text)).map(b=>b.text);
 const lead=action.slice(0,2).join(' ');
 if(s.kind==='promo')return lead||`${w(s.a).name} ${ringPersonalities[s.a].tell}.`;
 const win=matchSides(s)[winningSide(s)],many=win.length>1;
 const how={'Disqualification':' by disqualification','Interference':' with a little help from ringside','Cheating':' with a fistful of something illegal','Upset victory':' in a stunner'}[s.finish]||'';
 return `${lead||`${w(s.winner).name} ${ringPersonalities[s.winner].tell}.`} ${sideLabel(win)} ${many?'take':'takes'} it${how}.`;
}
function reportHeadline(s,answer){
 if(s.kind==='promo'){
  const speaker=w(s.a).name;
  if(s.target==null)return `${speaker} on the mic`;
  const target=w(s.target).name;
  if(answer?.labelTag==='Credentials')return `${speaker} refuses to address ${target}`;
  if(answer?.labelTag==='Confrontation')return `${speaker} calls out ${target}`;
  return `${speaker} on the mic with ${target}`;
 }
 const sides=matchSides(s),win=winningSide(s);
 return `${sideLabel(sides[win])} def. ${sides.filter((_,i)=>i!==win).map(side=>sideLabel(side)).join(' & ')}${s.finish==='Disqualification'?' by DQ':''}`;
}
function reportCard(i,isNew){
 const live=state.liveShow,m=live.moments[i],s=state.card[i],answer=live.answers[i];
 const tier=CALL_TIERS[answer.tier||callTier(answer.delta??0)]||CALL_TIERS.fair,quote=reportQuote(m,answer);
 const people=matchPeople(s).slice(0,4).map(w),label=i===state.card.length-1?'Main event':(s.kind==='promo'?'Promo':'Match')+' '+(i+1);
 const caller=w(s.kind==='promo'?s.a:s.winner).name;
 return `<article class="report-card tone-${tier.tone} ${isNew?'is-new':''}" aria-labelledby="report-${i}"><header class="report-head"><div class="report-faces">${people.map(r=>`<span class="report-face" style="--actor-color:${r.color}">${portrait(r)}</span>`).join('')}</div><div><small>${esc(label)} · ${esc(m.context)}</small><h2 id="report-${i}">${esc(reportHeadline(s,answer))}</h2></div></header><p class="report-summary">${esc(reportSummary(m,s,answer))}</p>${quote?`<blockquote class="report-quote"><p>“${esc(quote.text.replace(/^[“"]|[”"]$/g,''))}”</p><cite>${esc(quote.who)}</cite></blockquote>`:''}${answer.form?.length?`<ul class="report-form">${answer.form.map(n=>`<li class="is-${n.tone}">${esc(n.text)}</li>`).join('')}</ul>`:''}<footer class="report-foot"><span class="call-stamp">${tier.stamp}</span><span class="report-call">${esc(caller)}’s call · ${esc(answer.labelTag||answer.tag)}</span></footer></article>`;
}
function showReportPage(){
 ensureKayfabeLive();ensureLiveCalls();
 const live=state.liveShow,total=live.moments.length,last=live.index>=total-1;
 const cards=Array.from({length:live.index+1},(_,i)=>reportCard(i,i===live.index&&live.index>0)).join('');
 return `<div class="live-wrap exchange-wrap report-wrap"><div class="exchange-top"><span class="live-label"><i class="live-dot"></i> ON AIR · WEEK ${state.week}</span><span class="exchange-count">${live.index+1} / ${total}</span></div><h1 id="live-heading" class="exchange-heading" tabindex="-1">From the curtain.</h1><p class="report-intro">The card is set. The rest is up to them.</p><ol class="exchange-progress" aria-label="Show progress">${live.moments.map((_,i)=>`<li class="${i<live.index?'done':i===live.index?'current':''}" ${i===live.index?'aria-current="step"':''}><span>${i<live.index?'✓':i+1}</span></li>`).join('')}</ol><div class="report-feed" aria-live="polite">${cards}</div><div class="report-actions"><button class="btn primary" id="next-moment">${last?'See the results':'Next segment'} →</button>${last?'':'<button class="btn" id="skip-show">Skip to the results</button>'}</div></div>`;
}
