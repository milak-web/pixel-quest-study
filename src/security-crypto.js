const SecurityMath=(()=>{
const mod=(a,n=26)=>((a%n)+n)%n;
const clean=s=>String(s).toUpperCase().replace(/[^A-Z]/g,'');
const letters=n=>String.fromCharCode(65+mod(n));
const caesar=(s,k=3,decrypt=false)=>String(s).toUpperCase().replace(/[A-Z]/g,c=>letters(c.charCodeAt(0)-65+(decrypt?-k:k)));
function square(key='MONARCHY'){return [...new Set((clean(key).replace(/J/g,'I')+'ABCDEFGHIKLMNOPQRSTUVWXYZ').split(''))];}
function prepare(text){const s=clean(text).replace(/J/g,'I');let out=[];for(let i=0;i<s.length;){const a=s[i],b=s[i+1];if(!b||a===b){out.push(a+(a==='X'?'Q':'X'));i++;}else{out.push(a+b);i+=2;}}return out;}
function pair(pair,key='MONARCHY',decrypt=false){const sq=square(key),p=clean(pair).replace(/J/g,'I');if(p.length!==2||p[0]===p[1])throw Error('الزوج يجب أن يحتوي حرفين مختلفين.');const [a,b]=[sq.indexOf(p[0]),sq.indexOf(p[1])],r1=Math.floor(a/5),r2=Math.floor(b/5),c1=a%5,c2=b%5,d=decrypt?-1:1;let x,y,rule;if(r1===r2){x=r1*5+mod(c1+d,5);y=r2*5+mod(c2+d,5);rule='صف';}else if(c1===c2){x=mod(r1+d,5)*5+c1;y=mod(r2+d,5)*5+c2;rule='عمود';}else{x=r1*5+c2;y=r2*5+c1;rule='مستطيل';}return {input:p,out:sq[x]+sq[y],rule,positions:[a,b],outputs:[x,y]};}
function playfair(text,key='MONARCHY',decrypt=false){const s=clean(text).replace(/J/g,'I');if(decrypt&&s.length%2)throw Error('النص المشفر يجب أن يكون زوجي الطول.');const pairs=decrypt?s.match(/../g)||[]:prepare(s);const trace=pairs.map(p=>pair(p,key,decrypt));return {pairs,trace,out:trace.map(x=>x.out).join('')};}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
const determinant=k=>k[0][0]*k[1][1]-k[0][1]*k[1][0];
function inverse(k){const det=determinant(k);if(gcd(det,26)!==1)return null;let u=1;while(mod(det*u)!==1)u++;const [[a,b],[c,d]]=k;return {det,scalar:u,matrix:[[mod(u*d),mod(-u*b)],[mod(-u*c),mod(u*a)]]};}
function hill(text,k=[[3,3],[2,5]],decrypt=false){const inv=inverse(k);if(!inv)throw Error('مفتاح غير قابل للعكس بترديد26.');let s=clean(text);if(decrypt&&s.length%2)throw Error('فك التشفير يحتاج عدداً زوجياً من الحروف.');if(s.length%2)s+='X';const matrix=decrypt?inv.matrix:k,trace=[];for(let i=0;i<s.length;i+=2){const p=[s.charCodeAt(i)-65,s.charCodeAt(i+1)-65],raw=matrix.map(row=>row[0]*p[0]+row[1]*p[1]),values=raw.map(n=>mod(n));trace.push({input:s.slice(i,i+2),p,raw,values,out:values.map(letters).join('')});}return {out:trace.map(t=>t.out).join(''),trace,prepared:s,inverse:inv};}
return {mod,clean,letters,caesar,square,prepare,pair,playfair,gcd,determinant,inverse,hill};
})();
if(typeof module!=='undefined')module.exports=SecurityMath;
