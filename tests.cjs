const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const content=fs.readFileSync(__dirname+'/src/content.js','utf8');
const course=vm.runInNewContext(content+';({LEVELS,WORLDS})');
const R=require('./src/logic.js');
const {LEVELS,WORLDS}=course;
assert.equal(LEVELS.length,16);assert.equal(WORLDS.length,4);
const ids=new Set();let qcount=0;
for(const l of LEVELS){assert.equal(l.steps.length,3);assert.ok(l.source&&l.lab);for(const s of l.steps){assert.ok(!ids.has(s.id));ids.add(s.id);assert.ok(s.text.length>35&&s.formula&&s.example);assert.equal(s.questions.length,2);for(const q of s.questions){qcount++;assert.ok(q.why.trim().length>0);assert.ok(R.grade(q,q.type==='number'?String(q.answer):q.answer));if(q.type==='number'){assert.ok(!R.grade(q,''));assert.ok(!R.grade(q,'not a number'));assert.ok(!R.grade(q,String(q.answer+2)));}else if(q.type==='mc'){assert.ok(q.options[q.answer]);for(let i=0;i<q.options.length;i++)if(i!==q.answer)assert.ok(!R.grade(q,i));}else{assert.equal(q.items.length,new Set(q.answer).size);assert.ok(!R.grade(q,[]));}}}}
assert.equal(ids.size,48);assert.equal(qcount,96);
assert.ok(R.grade({type:'number',answer:22.5},'٢٢٫٥'));
assert.ok(R.grade({type:'number',answer:-7},'−٧'));
assert.ok(R.grade({type:'number',answer:12.5},'۱۲،۵'));
let state=R.initial();assert.ok(R.unlocked(state,LEVELS,0));assert.ok(!R.unlocked(state,LEVELS,1));
for(let i=0;i<16;i++){assert.ok(R.unlocked(state,LEVELS,i));for(const s of LEVELS[i].steps){state.done[s.id]=true;state.earned[s.id]=30;}assert.ok(R.levelDone(state,LEVELS[i]));}
assert.equal(Object.values(state.earned).reduce((a,b)=>a+b,0),1440);
for(const s of LEVELS[0].steps)state.earned[s.id]=30;
assert.equal(Object.values(state.earned).reduce((a,b)=>a+b,0),1440);
state.earned['unexpected']=999;const cleaned=R.clean(JSON.parse(JSON.stringify(state)),LEVELS);assert.ok(!cleaned.earned.unexpected);assert.ok(R.unlocked(cleaned,LEVELS,15));
assert.equal(R.clean({version:999},LEVELS).screen,'home');
for(let k=1;k<100;k++){const a=R.shuffle([0,1,2,3],k);assert.equal(new Set(a).size,4);assert.equal([...a].sort().join(','),'0,1,2,3');}
// Exercise every rendered laboratory using only the application's pure rendering functions.
const ctx={state:{active:{level:0,step:0}},labKind:'',labState:{},icon:()=>'',document:{addEventListener(){}},$:()=>null};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/src/labs.js','utf8').replace(/\nrender\(\);\s*$/,''),ctx);
for(let li=0;li<16;li++)for(let si=0;si<3;si++){ctx.state.active={level:li,step:si};const html=vm.runInContext(`labHTML(${JSON.stringify(LEVELS[li].lab)})`,ctx);assert.ok(html.includes('lab-live'));assert.ok(!/NaN|undefined/.test(html),LEVELS[li].lab);}
const interpolated=vm.runInContext('interp([[8,4],[4,8]],2)',ctx);assert.equal(JSON.stringify(interpolated),'[[8,6,4],[6,6,6],[4,6,8]]');
vm.runInContext("labState={r:1,c:1}",ctx);const convolution=vm.runInContext("labVisual('convolution')",ctx);assert.ok(convolution.includes('4.25'));
vm.runInContext("labState={A:88,B:111,gate:'AND'}",ctx);assert.ok(vm.runInContext("labVisual('logic')",ctx).includes('= 72'));
for(const kernel of ['lap','lap2','diag0','diag1','vertical','horizontal','diag2']){vm.runInContext(`labState={kernel:'${kernel}'}`,ctx);assert.ok(!/NaN|undefined/.test(vm.runInContext("labVisual('enhance')",ctx)));}
vm.runInContext("labState={kernel:'lap'}",ctx);assert.ok(vm.runInContext("labVisual('enhance')",ctx).includes('[12, 4]'));
console.log('PASS: 16 levels, 48 concepts, 96 question variants, Arabic numeric answers, locks, save validation, XP replay protection, 48 lab screens and calculation checks.');


