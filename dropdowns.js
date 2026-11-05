'use strict';
// Every single-choice <select> in the game is shown as an in-theme picker instead of the
// system menu. The native select stays in the form (visually hidden) so FormData, validation
// and every existing change handler keep working untouched.
(function(){
 let openList=null;
 const split=text=>{const at=text.indexOf(' · ');return at>0?[text.slice(0,at),text.slice(at+3)]:[text,'']};
 const labelFor=select=>(select.getAttribute('aria-label')||select.labels?.[0]?.querySelector('span')?.textContent||select.labels?.[0]?.textContent||select.closest('label')?.querySelector('span')?.textContent||'Choose').trim();

 function sync(select){
  const button=select._picker;if(!button)return;
  const option=select.options[select.selectedIndex],text=option?option.textContent.trim():'',[main,sub]=split(text);
  const placeholder=!option||(option.disabled&&option.value==='');
  button.querySelector('.picker-main').textContent=main||'Choose…';
  const subEl=button.querySelector('.picker-sub');subEl.textContent=sub;subEl.hidden=!sub;
  button.classList.toggle('is-placeholder',placeholder);
  button.disabled=select.disabled;
  button.setAttribute('aria-label',`${labelFor(select)}: ${text||'not chosen'}`);
 }

 function enhance(select){
  if(select._picker||select.multiple||select.size>1||select.dataset.native!==undefined)return;
  const button=document.createElement('button');
  button.type='button';button.className='picker-button';
  button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
  button.innerHTML='<span class="picker-text"><span class="picker-main"></span><span class="picker-sub"></span></span><svg class="picker-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>';
  select.classList.add('picker-native');select.tabIndex=-1;select.setAttribute('aria-hidden','true');
  select.after(button);select._picker=button;
  select.addEventListener('change',()=>sync(select));
  select.addEventListener('invalid',()=>{button.classList.add('is-invalid');button.focus()});
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openList?.select===select?close():show(select)});
  button.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','Enter',' '].includes(event.key)){event.preventDefault();show(select)}});
  sync(select);
 }

 function place(list,button){
  const host=list.parentElement,rect=button.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  const hostRect=host===document.body?{left:0,top:0}:getComputedStyle(host).transform!=='none'?host.getBoundingClientRect():{left:0,top:0};
  const width=Math.min(Math.max(rect.width,240),vw-16),left=Math.min(Math.max(8,rect.left),vw-width-8);
  const below=vh-rect.bottom-10,above=rect.top-10,up=below<220&&above>below;
  list.style.width=width+'px';list.style.left=(left-hostRect.left)+'px';
  list.style.maxHeight=Math.max(160,Math.min(420,up?above:below))+'px';
  const top=up?rect.top-6-list.offsetHeight:rect.bottom+6;
  list.style.top=(top-hostRect.top)+'px';
  list.classList.toggle('opens-up',up);
 }

 function show(select){
  close();
  const button=select._picker,host=button.closest('dialog[open]')||document.body,list=document.createElement('div');
  list.className='picker-pop';list.setAttribute('role','listbox');list.tabIndex=-1;list.id='picker-pop';
  list.setAttribute('aria-label',labelFor(select));
  let index=-1;
  const addOption=(option,optIndex)=>{
   const [main,sub]=split(option.textContent.trim()),item=document.createElement('div');
   item.className='picker-option';item.id='picker-opt-'+optIndex;item.dataset.index=optIndex;item.setAttribute('role','option');
   item.setAttribute('aria-selected',String(optIndex===select.selectedIndex));
   if(option.disabled){item.setAttribute('aria-disabled','true');item.classList.add('is-disabled')}
   item.innerHTML='<span class="picker-check" aria-hidden="true"></span><span class="picker-text"><span class="picker-main"></span><span class="picker-sub"></span></span>';
   item.querySelector('.picker-main').textContent=main;const subEl=item.querySelector('.picker-sub');subEl.textContent=sub;subEl.hidden=!sub;
   item.addEventListener('click',event=>{event.stopPropagation();if(!option.disabled)choose(select,optIndex)});
   item.addEventListener('pointermove',()=>{if(!option.disabled)highlight(optIndex)});
   list.append(item);
  };
  let optIndex=0;
  for(const child of select.children){
   if(child.tagName==='OPTGROUP'){
    const head=document.createElement('div');head.className='picker-group';head.setAttribute('role','presentation');head.textContent=child.label;list.append(head);
    for(const option of child.children)addOption(option,optIndex++);
   }else if(child.tagName==='OPTION'){
    if(child.disabled&&child.value===''){optIndex++;continue}
    addOption(child,optIndex++);
   }
  }
  host.append(list);place(list,button);
  button.setAttribute('aria-expanded','true');button.classList.add('is-open');button.classList.remove('is-invalid');
  const enabled=()=>[...list.querySelectorAll('.picker-option:not(.is-disabled)')].map(item=>Number(item.dataset.index));
  function highlight(next){
   index=next;list.querySelectorAll('.picker-option').forEach(item=>item.classList.toggle('is-active',Number(item.dataset.index)===index));
   const active=list.querySelector('#picker-opt-'+index);if(active){list.setAttribute('aria-activedescendant',active.id);active.scrollIntoView({block:'nearest'})}
  }
  highlight(enabled().includes(select.selectedIndex)?select.selectedIndex:enabled()[0]??-1);
  list.addEventListener('keydown',event=>{
   const order=enabled(),at=order.indexOf(index);
   if(event.key==='ArrowDown'){event.preventDefault();highlight(order[Math.min(order.length-1,at+1)])}
   else if(event.key==='ArrowUp'){event.preventDefault();highlight(order[Math.max(0,at-1)])}
   else if(event.key==='Home'){event.preventDefault();highlight(order[0])}
   else if(event.key==='End'){event.preventDefault();highlight(order[order.length-1])}
   else if(event.key==='Enter'||event.key===' '){event.preventDefault();if(index>=0)choose(select,index)}
   else if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();button.focus()}
   else if(event.key==='Tab'){close()}
  });
  openList={select,list,button};
  list.focus({preventScroll:true});
 }

 function choose(select,index){
  if(select.selectedIndex!==index){
   select.selectedIndex=index;
   select.dispatchEvent(new Event('input',{bubbles:true}));
   select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  const button=select._picker;sync(select);close();if(button?.isConnected)button.focus({preventScroll:true});
 }

 function close(){
  if(!openList)return;
  const {list,button}=openList;openList=null;list.remove();
  button.setAttribute('aria-expanded','false');button.classList.remove('is-open');
 }

 function enhanceAll(root=document){root.querySelectorAll('select').forEach(enhance)}
 window.enhanceSelects=enhanceAll;

 document.addEventListener('pointerdown',event=>{if(openList&&!openList.list.contains(event.target)&&!openList.button.contains(event.target))close()},true);
 window.addEventListener('resize',close);
 document.addEventListener('scroll',event=>{if(openList&&!openList.list.contains(event.target))place(openList.list,openList.button)},true);
 const observer=new MutationObserver(()=>{if(openList&&!openList.button.isConnected)close();enhanceAll()});
 const start=()=>{enhanceAll();observer.observe(document.body,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
