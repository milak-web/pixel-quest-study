// Exercise the shared application state transitions without browser automation.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
for(const subject of ['images','security']){
 const html={innerHTML:'',focus(){},scrollIntoView(){},remove(){},classList:{toggle(){},remove(){}}},handlers={},saved={};
 const context={TextEncoder,setTimeout:()=>1,clearTimeout(){},matchMedia:()=>({matches:true}),window:{scrollTo(){}},localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},document:{querySelector:()=>html,addEventListener:(k,f)=>(handlers[k]??=[]).push(f)}};
 vm.createContext(context);
 const run=s=>vm.runInContext(s,context);
 run(`const COURSE=${JSON.stringify({id:subject,storageKey:subject,title:subject,sourceLabel:'source',warning:'corrections',guideUrl:'guide',sourcesUrl:'sources'})};`);
 const files=(subject==='security'?['security-crypto.js','security-content.js']:['content.js']).concat(['logic.js','app.js']);
 for(const file of files)run(fs.readFileSync('src/'+file,'utf8'));
 let labs=fs.readFileSync('src/labs.js','utf8').replace(/\nrender\(\);/g,'\n');
 if(subject==='security')labs=labs.replace('function labHTML(','function imageLabHTML(');
 run(labs);if(subject==='security')run(fs.readFileSync('src/security-labs.js','utf8'));
 const levels=run('LEVELS.length');
 run('render();startExam();');assert.equal(run('state.screen'),'home');
 for(let i=0;i<levels;i++){
  run(`enterLevel(${i})`);assert.equal(run('state.active.level'),i);
  for(let j=0;j<3;j++){
   run("state.active.phase='quiz';render();");
   const q=run('activeContext().q');assert.ok(html.innerHTML.includes(q.type==='text'?'number-form':'mission'));
   run('submit(activeContext().q.answer);');assert.ok(run('state.active.feedback.pass'));
   run('nextStep();');
  }
  assert.equal(run('state.active.phase'),'summary');
 }
 assert.equal(run('completed()'),levels);assert.equal(run('xp()'),levels*90);
 run('startExam()');assert.equal(run('state.exam.items.length'),levels);
 for(let i=0;i<levels;i++){
  run('constItem=state.exam.items[state.exam.index];submit(LEVELS[constItem.level].steps[constItem.step].questions[constItem.variant].answer)');
  for(const handler of handlers.click)handler({target:{closest:()=>({dataset:{action:'examNext'}})}});
 }
 assert.equal(run('state.screen'),'examResult');assert.ok(html.innerHTML.includes(`${levels} / ${levels}`));
 assert.equal(run('state.exam.answers.filter(x=>x.pass).length'),levels);
 run("state=QuestRules.clean(JSON.parse(localStorage.getItem(SAVE)),LEVELS);render()");assert.equal(run('completed()'),levels);
 console.log(`PASS: ${subject}: full lesson progression, typed forms, XP, ${levels}-question final challenge and reload.`);
}
