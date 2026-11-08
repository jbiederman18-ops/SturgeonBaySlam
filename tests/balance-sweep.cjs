// Balance sweep for evenings: runs whole careers through the real engine with different strategies.
// Usage: node tests/balance-sweep.cjs [weeks...]   (not part of the test suite; takes a minute or two)
// Assumes a booker who keeps every promise and takes the best reply. Goal: spreading evenly never reaches a best ending.
const fs=require('fs'),vm=require('vm'),path=require('path');const root=require('path').resolve(__dirname,'..');
const mk=function(pre={}){
 const context=vm.createContext({structuredClone,console,Math,localStorage:{getItem(){return null},setItem(){}},document:{querySelector(){return null},querySelectorAll(){return []},getElementById(){return null},addEventListener(){}},navigator:{onLine:true},window:{scrollTo(){}},...pre});
 for(const file of ['matches.js','portraits.js','moments.js','exchange.js','kayfabe.js','booking.js','pick.js','career.js','stories.js','snafu.js','ledger.js','routes.js','roster.js','relationships.js','townmap.js','opening.js','tutorial.js','webapp.js','progression.js','rise.js','aftershow.js','game.js']){
  let s=fs.readFileSync(path.join(root,file),'utf8');if(file==='game.js')s=s.replace(/render\(\);\s*$/,'');vm.runInContext(s,context,{filename:file});
 }
 return c=>vm.runInContext(c,context);
};

// strategy: {name, pick(invites, ctx) -> invite, walk:bool}
function sim(strategy,weeks,{walk=true,seed=1,pre={},cap=100}={}){
 const run=mk(pre);
 run(`Math.random=(()=>{let s=${seed};return()=>{s=(s*16807)%2147483647;return s/2147483647}})();state=fresh();state.started=true;state.card=[];`);
 run(`globalThis.__evenings={};globalThis.__score={weeks:0,room:0,pts:0};`);
 for(let wk=1;wk<=weeks;wk++){
  run(`state.week=${wk};state.recap=null;state.liveShow=null;state.card=[];`);
  const week=JSON.parse(run(`JSON.stringify(ensureWeekAhead())`));
  for(const night of week.nights||[]){
   const open=JSON.parse(run(`JSON.stringify(nightInvites(${JSON.stringify(night)}).filter(i=>inviteOpen(i)).map(i=>({...i,kind:sceneFor(i).kind,trust:w(i.actor).trust,ev:__evenings[i.actor]||0,ending:routeState(i.actor).ending})))`));
   if(!open.length)continue;
   const inv=strategy.pick(open,run);
   // best reply: accept an Ask, otherwise the biggest trust delta
   run(`(()=>{const inv=ensureWeekAhead().invites.find(i=>i.id===${JSON.stringify(inv.id)}),sc=sceneFor(inv);
     let best=0,bd=-99;sc.replies.forEach((r,i)=>{const d=r.ask==='accept'?999:r.ask?-999:replyDelta(inv.actor,r);if(d>bd){bd=d;best=i}});
     answerScene(inv.id,best);__evenings[inv.actor]=(__evenings[inv.actor]||0)+1})()`);
  }
  // Show night: the booker books whoever the strategy cares about (6 featured slots in Era I), keeps every promise.
  const booked=strategy.book(run,wk);
  run(`(()=>{const booked=${JSON.stringify(booked)};for(const id of booked)w(id).lastSeen=${wk};
    for(const p of state.promises.filter(p=>p.status==='open'&&p.due<=${wk})){p.status='kept';p.resolved=${wk};offstageTrust(w(p.actor),8);w(p.actor).morale=clamp(w(p.actor).morale+6)}
    const f=[];relationshipWeekEnd(f);
    __score.weeks++;if(wholeRoom())__score.room++;if(globalThis.__TRACE){const ids=FEATURED_IDS,t=ids.map(id=>w(id).trust),last=relations().lastEvening;console.log(state.week,'room',wholeRoom(),'gap',Math.max(...t)-Math.min(...t),'seen',ids.filter(id=>state.week-(last[id]??-99)<ROOM_WINDOW).length,'over',ids.filter(overlooked).join(','))}for(const id of FEATURED_IDS){const r=w(id);__score.pts+=(r.trust>=80||(r.trust>=ROOM_TIER&&wholeRoom())?1:0)+(r.morale>=85?1:r.morale<45?-1:0)}
    if(innerCircle().length)__score.pts+=1+innerCircle().length; /* main-event carry + losses/double duty they absorb */
    if(wholeRoom())__score.pts+=ROOM_ENSEMBLE; /* a group segment gels, plus rain checks and making do */
    const lost=booked.filter((id,i)=>i%2===1||(id===0&&${wk}%3===0));relations().results={week:${wk},won:booked.filter(id=>!lost.includes(id)),lost,cheatWins:[],cheatLosses:[]};
    ${walk?`for(const id of booked.slice(0,4))offstageTrust(w(id),6);`:''}
  })()`);
 }
 const sc=JSON.parse(run(`JSON.stringify({...__score,over:FEATURED_IDS.filter(overlooked).length,lowMorale:FEATURED_IDS.filter(id=>w(id).morale<45).length})`));
 return Object.assign(JSON.parse(run(`JSON.stringify(FEATURED_IDS.map(id=>({id,trust:w(id).trust,tier:affectionTier(w(id)),ending:routeState(id).ending,ev:__evenings[id]||0,beats:Object.keys(routeState(id).beats).length,ask:routeState(id).ask?.status||null})))`)),{score:sc});
}
const IDS=[0,1,10,18,20,31,34,37];
const urgentFirst=(a,b)=>(['final','flag','ask'].includes(b.kind)?1:0)-(['final','flag','ask'].includes(a.kind)?1:0);
const deep={name:'deep (closest first)',pick:o=>o.slice().sort((a,b)=>urgentFirst(a,b)||b.trust-a.trust)[0],book:(run,wk)=>IDS.slice(0,6)};
const spread={name:'spread evenly',pick:o=>o.slice().sort((a,b)=>a.ev-b.ev||a.trust-b.trust)[0],book:(run,wk)=>{const r=IDS.slice();const k=(wk*3)%8;return [...r.slice(k),...r.slice(0,k)].slice(0,6)}};
const spreadSmart={name:'spread, but take urgent scenes',pick:o=>o.slice().sort((a,b)=>urgentFirst(a,b)||a.ev-b.ev)[0],book:spread.book};
const focus=(targets)=>({name:'focus '+targets.join('+'),pick:o=>{const t=o.filter(i=>targets.includes(i.actor)&&!i.ending).sort((a,b)=>urgentFirst(a,b)||targets.indexOf(a.actor)-targets.indexOf(b.actor));return t[0]||o.slice().sort((a,b)=>urgentFirst(a,b)||a.ev-b.ev)[0]},book:()=>[...targets,...IDS.filter(i=>!targets.includes(i))].slice(0,6)});
module.exports={deep,sim,spread,spreadSmart,focus,IDS};
module.exports.report=(label,res)=>{const best=res.filter(r=>r.ending==='best').length,dev=res.filter(r=>r.tier==='devoted').length,sc=res.score;return `${label.padEnd(26)} best ${best} · devoted ${dev} · whole-room weeks ${sc.room}/${sc.weeks} · show pts ${String(sc.pts).padStart(3)} (${(sc.pts/sc.weeks).toFixed(1)}/wk) · overlooked ${sc.over} · low morale ${sc.lowMorale} · `+res.map(r=>`${r.id}:${r.trust}/${r.ev}/${r.ending||r.ask||r.beats+'b'}`).join(' ')};
if(false){
 const weeks=Number(process.argv[2]||24),walk=process.argv[3]!=='nowalk';
 for(const s of [spread,spreadSmart,deep,focus([0]),focus([0,37]),focus([0,37,31]),focus([0,37,31,20])]){
  const res=sim(s,weeks,{walk});
  const best=res.filter(r=>r.ending==='best').length,dev=res.filter(r=>r.tier==='devoted').length;
  console.log(`${s.name.padEnd(32)} best endings ${best} · neutral ${res.filter(r=>r.ending==='neutral').length} · devoted ${dev} · `+res.map(r=>`${r.id}:${r.trust}/${r.ev}ev/${r.ending||r.ask||r.beats+'b'}`).join(' '));
 }
}
for(const weeks of (process.argv.slice(2).length?process.argv.slice(2).map(Number):[24,36,48])){console.log('== '+weeks+' weeks');for(const s of [spread,spreadSmart,deep,focus([0]),focus([0,37]),focus([0,37,31]),focus([0,37,31,20])])console.log(module.exports.report(s.name,sim(s,weeks,{pre:JSON.parse(process.env.SWEEP_PRE||'{}')})))}
