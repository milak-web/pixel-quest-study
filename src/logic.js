const QuestRules=(()=>{
 const normalize=s=>String(s).trim().replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٫،]/g,'.').replace(/−/g,'-').replace(/\s/g,'');
 function grade(q,value){
  if(q.type==='number'){const n=Number(normalize(value));return normalize(value)!==''&&Number.isFinite(n)&&Math.abs(n-q.answer)<=(q.tolerance||1e-8);}
  if(q.type==='order')return Array.isArray(value)&&value.length===q.answer.length&&value.every((v,i)=>v===q.answer[i]);
  return Number.isInteger(value)&&value===q.answer;
 }
 const shuffle=(a,seed)=>{const b=[...a];let s=seed>>>0;for(let i=b.length-1;i>0;i--){s=(s*1664525+1013904223)>>>0;const j=s%(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
 function initial(){return {version:1,screen:'home',done:{},earned:{},weak:{},reflections:{},attempts:{},active:null,exam:null,sound:false,examRuns:0};}
 function clean(raw,levels){
  const base=initial();if(!raw||raw.version!==1)return base;
  const ids=new Set(levels.flatMap(l=>l.steps.map(s=>s.id)));
  for(const key of ['done','weak','reflections','attempts'])if(raw[key]&&typeof raw[key]==='object')for(const [id,v] of Object.entries(raw[key]))if(ids.has(id)||key==='reflections'&&/^level-\d+$/.test(id))base[key][id]=v;
  if(raw.earned&&typeof raw.earned==='object')for(const [id,v] of Object.entries(raw.earned))if((ids.has(id)&&v===30)||(/^exam-\d+$/.test(id)&&v===10))base.earned[id]=v;
  base.sound=raw.sound===true;base.examRuns=Number.isInteger(raw.examRuns)&&raw.examRuns>=0?raw.examRuns:0;
  if(raw.active&&Number.isInteger(raw.active.level)&&levels[raw.active.level]&&Number.isInteger(raw.active.step)&&levels[raw.active.level].steps[raw.active.step])base.active={...raw.active};
  if(raw.exam&&Array.isArray(raw.exam.items)&&raw.exam.items.length===levels.length&&Number.isInteger(raw.exam.index)&&raw.exam.index>=0&&raw.exam.index<=levels.length&&raw.exam.items.every(v=>levels[v.level]?.steps[v.step]?.questions[v.variant])&&Array.isArray(raw.exam.answers))base.exam=raw.exam;
  if(['home','lesson','review','rescue','exam','examResult'].includes(raw.screen))base.screen=raw.screen;
  if(base.screen==='lesson'&&!base.active)base.screen='home';if(['exam','examResult'].includes(base.screen)&&!base.exam)base.screen='home';
  return base;
 }
 const levelDone=(state,level)=>level.steps.every(s=>state.done[s.id]===true);
 const unlocked=(state,levels,i)=>i===0||levels.slice(0,i).every(l=>levelDone(state,l));
 return {normalize,grade,shuffle,initial,clean,levelDone,unlocked};
})();
if(typeof module!=='undefined')module.exports=QuestRules;
