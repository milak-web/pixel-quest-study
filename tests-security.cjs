const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const R=require('./src/logic.js'),M=require('./src/security-crypto.js');
const course=vm.runInNewContext(fs.readFileSync('src/security-content.js','utf8')+';({LEVELS,WORLDS})');
assert.equal(course.LEVELS.length,32);assert.equal(course.WORLDS.length,8);
const ids=new Set();let count=0,texts=0;
for(const l of course.LEVELS){assert.equal(l.steps.length,3);assert.ok(l.source);for(const s of l.steps){assert.ok(!ids.has(s.id));ids.add(s.id);assert.ok(s.text&&s.formula&&s.example);assert.equal(s.questions.length,2);for(const q of s.questions){count++;assert.ok(q.why);assert.ok(R.grade(q,q.type==='number'?String(q.answer):q.answer),s.id);if(q.type==='mc')assert.ok(!R.grade(q,(q.answer+1)%q.options.length));else if(q.type==='order')assert.ok(!R.grade(q,[]));else if(q.type==='text'){texts++;assert.ok(!R.grade(q,'WRONGANSWER'));assert.ok(R.grade(q,' '+String(q.answer).toLowerCase().split('').join(' ')+' '));}else{assert.ok(!R.grade(q,''));assert.ok(!R.grade(q,q.answer+1));}}}}
assert.equal(ids.size,96);assert.equal(count,192);assert.ok(texts>=20);
assert.equal(M.caesar('MR CARTER IS A COOL TEACHER',3),'PU FDUWHU LV D FRRO WHDFKHU');
assert.equal(M.caesar('FDW',3,true),'CAT');assert.equal(M.caesar('Z',3),'C');
assert.equal(M.prepare('BALLOON').join(''),'BALXLOON');assert.equal(M.prepare('COMMITTEE').join(''),'COMXMITXTEEX');assert.equal(M.prepare('ABX').join(''),'ABXQ');assert.equal(M.prepare('XX').join(''),'XQXQ');
assert.equal(M.square('PLAYFAIR').slice(0,7).join(''),'PLAYFIR');
for(const [a,b] of [['MO','ON'],['AR','RM'],['MC','CE'],['UL','MU'],['MD','RC'],['IN','GA']]){assert.equal(M.pair(a).out,b);assert.equal(M.pair(b,'MONARCHY',true).out,a);}
assert.equal(M.playfair('INSTRUMENTS').out,'GATLMZCLRQXA');assert.equal(M.playfair('SECRET MESSAGE','SECURITY').out,'ECUSTFVTUQUIFC');assert.equal(M.playfair('GATLMZCLRQXA','MONARCHY',true).out,'INSTRUMENTSX');
assert.equal(M.hill('HELP').out,'HIAT');assert.equal(M.hill('HIAT',undefined,true).out,'HELP');assert.equal(JSON.stringify(M.inverse([[3,3],[2,5]]).matrix),'[[15,17],[20,9]]');assert.equal(M.inverse([[1,0],[0,2]]),null);assert.equal(M.mod(-9),17);
// Property checks use independent multiplication of the inverse and original matrix.
for(const k of [[[3,3],[2,5]],[[1,2],[3,5]],[[5,8],[17,3]]]){const inv=M.inverse(k);if(!inv)continue;for(let r=0;r<2;r++)for(let c=0;c<2;c++)assert.equal(((k[r][0]*inv.matrix[0][c]+k[r][1]*inv.matrix[1][c])%26+26)%26,Number(r===c));for(const text of ['HELP','TEST','ABCD','CAT'])assert.equal(M.hill(M.hill(text,k).out,k,true).out,text.length%2?text+'X':text);}
const context={state:{active:{level:0,step:0}},esc:s=>String(s),rich:s=>String(s),icon:()=>'',matrixHTML:a=>JSON.stringify(a),QuestRules:R,SecurityMath:M,TextEncoder,document:{addEventListener(){}},$:()=>null};
vm.createContext(context);vm.runInContext(fs.readFileSync('src/security-labs.js','utf8'),context);
for(let i=0;i<32;i++)for(let j=0;j<3;j++){context.state.active={level:i,step:j};const h=vm.runInContext(`labHTML(${JSON.stringify(course.LEVELS[i].lab)})`,context);assert.ok(!/NaN|undefined/.test(h),course.LEVELS[i].title);}
for(const [input,expected] of [['','d41d8cd98f00b204e9800998ecf8427e'],['abc','900150983cd24fb0d6963f7d28e17f72'],['Message Digest 5','211b88402ac7072606ec70f190ba5dd0']])assert.equal(vm.runInContext(`md5Hex(${JSON.stringify(input)})`,context),expected);
for(const mode of ['prepare','encrypt','decrypt']){context.state.active={level:24,step:0};vm.runInContext(`secInit('playfair');secState.mode='${mode}';secState.text='MO'`,context);assert.ok(!/NaN|undefined/.test(vm.runInContext("secVisual('playfair')",context)));}
for(const mode of ['encrypt','decrypt','inverse','recover']){vm.runInContext(`secInit('hill');secState.mode='${mode}';secState.text='HELP'`,context);assert.ok(!/NaN|undefined/.test(vm.runInContext("secVisual('hill')",context)));}
let state=R.initial();for(let i=0;i<32;i++){assert.ok(R.unlocked(state,course.LEVELS,i));for(const s of course.LEVELS[i].steps)state.done[s.id]=true;}assert.equal(Object.keys(R.clean(state,course.LEVELS).done).length,96);
console.log(`PASS: 32 levels, 96 unique concepts, ${count} question variants (${texts} typed cipher variants), all 96 lab screens, published cipher vectors, inverse identities and MD5 vectors.`);
