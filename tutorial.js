// The first-week tour: right after the opening, the Good Lord Above "checks in" and walks you through
// one week, tab by tab. Spotlights the real screens; nothing behind the tour can be tapped or scrolled.
// Replay it from the Shows tab (Settings & device) or from How to play.

// Pure step script, so tests can check it without a page.
// `view` is the tab to show, `target` the part of it to spotlight, `nav` the tab button to ring.
function tutorialSteps(){
 return [
  {view:'home',target:'.next-show',nav:'home',title:'The Road',text:'I said I would check in. This is the Road. One show a week, at your hall. Here is your cash, and here is what the show will cost.'},
  {view:'book',target:'.poster-bill > :first-child',nav:'book',title:'Book the card',text:'Tap any space to cast it, then tap 👑 Win to pick who wins. Fill every space, with at least two matches. You decide everything. That is the curse.'},
  {view:'decisions',target:'.lord-panel',nav:'decisions',title:'My file on you',text:'I keep a file. Break your word, book a cheat, let something you said get back to someone, and I send a little something down. How you take it is between you and Me.'},
  {view:'locker',target:'.town-canvas',nav:'locker',title:'Around town',text:'Every week starts here, in whatever town you are in. Two free evenings, and the buffoons will invite you places. Believe what they believe. Laugh, and they remember.'},
  {view:'office',target:'.stats',nav:'office',title:'Shows',text:'Your money, your hall and every show you have ever run. I read it. I read all of it. Run out of money and, well. Oblivion.'},
  {view:'home',target:'.bill-cta',nav:'book',title:'Saturday',text:'That is everything. Go book the card. I will be watching. Periodically.',last:true}
 ];
}

let tutorialRun=null;
function startTutorial(){
 if(tutorialRun||onTitle||!state.started||state.liveShow||state.recap)return;
 const steps=tutorialSteps(),app=document.getElementById('app'),instant=reducedMotion();
 const root=document.createElement('div');
 root.className='tutorial';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tutorial-title');
 root.innerHTML=`<svg class="tutorial-shade" aria-hidden="true" focusable="false"><defs><mask id="tutorial-holes"><rect class="tutorial-all" fill="#fff"/><g class="tutorial-cut"></g></mask></defs><rect class="tutorial-all tutorial-dim" mask="url(#tutorial-holes)"/><g class="tutorial-rings"></g></svg>
 <section class="tutorial-bubble"><div class="tutorial-face">${CUTSCENE_CAST.lord.art()}</div><div class="tutorial-copy"><p class="tutorial-who">${esc(CUTSCENE_CAST.lord.name)} <span class="tutorial-count"></span></p><h2 id="tutorial-title"></h2><p class="tutorial-text" aria-live="polite"></p></div><div class="tutorial-actions"><button type="button" class="text-btn tutorial-skip">Skip the tour</button><button type="button" class="btn tutorial-back">Back</button><button type="button" class="btn primary tutorial-next"></button></div></section>`;
 document.body.append(root);
 const bubble=root.querySelector('.tutorial-bubble'),cut=root.querySelector('.tutorial-cut'),rings=root.querySelector('.tutorial-rings');
 const run={index:-1,root};tutorialRun=run;
 // Nothing behind the tour moves: block touch scrolling, the wheel and paging keys outright.
 const block=event=>event.preventDefault();
 root.addEventListener('touchmove',block,{passive:false});root.addEventListener('wheel',block,{passive:false});
 const holes=()=>{
  const step=steps[run.index],list=[];
  const add=(el,pad)=>{if(!el)return;const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
   const x=Math.max(4,r.left-pad),y=Math.max(4,r.top-pad),right=Math.min(innerWidth-4,r.right+pad),bottom=Math.min(innerHeight-4,r.bottom+pad);
   if(bottom>y&&right>x)list.push({x,y,w:right-x,h:bottom-y})};
  add(document.querySelector(`.content ${step.target}`),8);
  add(document.querySelector(`.nav [data-nav="${step.nav}"]`),2);
  const svgRect=list.map(h=>`<rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="8"/>`).join('');
  cut.innerHTML=svgRect.replace(/<rect /g,'<rect fill="#000" ');rings.innerHTML=svgRect;
  root.querySelectorAll('.tutorial-all').forEach(r=>{r.setAttribute('width',innerWidth);r.setAttribute('height',innerHeight)});
  return list;
 };
 // The bubble rides at the top of the screen and the spotlight is scrolled to sit just under it.
 // If the page can't scroll far enough for that, the bubble drops to the bottom, clear of the tab bar.
 const frame=()=>{
  const navRect=document.querySelector('.nav')?.getBoundingClientRect(),bar=!!navRect&&navRect.top>innerHeight/2;
  return {floor:bar?innerHeight-navRect.top+10:16,left:!bar&&navRect&&navRect.right<innerWidth/2?navRect.right+16:12};
 };
 const pin=(where,f)=>{bubble.style.left=`${f.left}px`;bubble.style.right='12px';
  if(where==='top'){bubble.style.top='max(12px, env(safe-area-inset-top))';bubble.style.bottom='auto'}
  else{bubble.style.top='auto';bubble.style.bottom=`${f.floor}px`}};
 const layout=()=>{
  if(tutorialRun!==run)return;
  const f=frame(),target=document.querySelector(`.content ${steps[run.index].target}`);
  pin('top',f);
  if(target){
   const gap=bubble.getBoundingClientRect().bottom+14,r=target.getBoundingClientRect();
   window.scrollTo({top:Math.max(0,scrollY+r.top-gap),behavior:'instant'});
   const now=target.getBoundingClientRect();
   if(now.top<gap-4)pin('bottom',f);
  }
  holes();
 };
 const show=i=>{
  run.index=i;const step=steps[i];
  if(view!==step.view||state.recap||state.liveShow){view=step.view;render()}
  app.inert=true;
  root.querySelector('.tutorial-count').textContent=`· ${i+1} of ${steps.length}`;
  root.querySelector('#tutorial-title').textContent=step.title;
  root.querySelector('.tutorial-text').textContent=step.text;
  root.querySelector('.tutorial-back').hidden=i===0;
  root.querySelector('.tutorial-skip').hidden=!!step.last;
  root.querySelector('.tutorial-next').textContent=step.last?`Book week ${state.week} →`:'Next →';
  bubble.classList.remove('is-in');if(!instant){void bubble.offsetWidth;bubble.classList.add('is-in')}
  layout();
  root.querySelector('.tutorial-next').focus({preventScroll:true});
 };
 const end=goBook=>{
  if(tutorialRun!==run)return;tutorialRun=null;
  removeEventListener('resize',layout);removeEventListener('keydown',keys,true);
  root.remove();app.inert=false;
  view=goBook?'book':'home';render();window.scrollTo(0,0);
 };
 const keys=event=>{
  if(event.key==='Escape'){event.preventDefault();end(false);return}
  if(['ArrowRight'].includes(event.key)){event.preventDefault();root.querySelector('.tutorial-next').click();return}
  if(['ArrowLeft'].includes(event.key)&&run.index>0){event.preventDefault();show(run.index-1);return}
  if(['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(event.key)&&!event.target.closest?.('button'))event.preventDefault();
  if(event.key==='Tab'){const f=[...root.querySelectorAll('button:not([hidden])')],at=f.indexOf(document.activeElement);
   if(event.shiftKey&&at<=0){event.preventDefault();f.at(-1).focus()}else if(!event.shiftKey&&at===f.length-1){event.preventDefault();f[0].focus()}}
 };
 root.querySelector('.tutorial-next').onclick=()=>run.index<steps.length-1?show(run.index+1):end(true);
 root.querySelector('.tutorial-back').onclick=()=>run.index>0&&show(run.index-1);
 root.querySelector('.tutorial-skip').onclick=()=>end(false);
 addEventListener('resize',layout);addEventListener('keydown',keys,true);
 run.end=end;
 show(0);
 return run;
}
// "Take the tour" buttons live in other screens' markup; one listener covers them all.
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('click',event=>{
 const button=event.target.closest?.('[data-start-tutorial]');if(!button)return;
 const d=document.getElementById('modal');if(d?.open)d.close();
 startTutorial();
});
