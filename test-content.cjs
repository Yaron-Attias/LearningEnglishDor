const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),original=fs.readFileSync('original.html','utf8');
assert.equal(require('node:crypto').createHash('sha256').update(original).digest('hex'),'131fbe27673973ddec22ad504de34f89409fa3a3efad4aa498514d7174dc0095');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);
const data=js.slice(js.indexOf('const W='),js.indexOf('const STARRED='));
const names=['words','match','pics','two','bank','sort','memory','hang','read','speed','finalq'];
const ctx={console,...Object.fromEntries(names.map(n=>[n,()=>{}]))};
vm.runInNewContext(data+';globalThis.result={W,POS,ST,PICS,TWO,BANK,SORT,QS};',ctx);
const {W,ST}=ctx.result;
assert.equal(W.length,100);assert.equal(new Set(W.map(w=>w[0])).size,100);assert.equal(W.filter(w=>w[3]===3).length,10);assert.equal(W.filter(w=>w[3]===4).length,12);assert.equal(ST.length,8);
for(const w of W){assert.equal(w.length,5);assert.ok(w.every(v=>v!==undefined));assert.match(w[1],/[א-ת]/)}
for(const n of ['PICS','TWO','BANK','SORT','QS']){const oldctx={...Object.fromEntries(names.map(n=>[n,()=>{}])),console};const oldjs=original.match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInNewContext(oldjs.slice(oldjs.indexOf('const W='),oldjs.indexOf('const STARRED='))+';globalThis.result={PICS,TWO,BANK,SORT,QS};',oldctx);
 if(n==='TWO')continue;
 assert.equal(JSON.stringify(ctx.result[n]),JSON.stringify(oldctx.result[n]),n+' preserved except the approved bus context');}
assert.ok(!html.includes('mailto:'));assert.ok(html.includes('localStorage.setItem("jp-vocab"'));assert.ok(html.includes('lang="he" dir="rtl"'));
const stateCode=js.slice(js.indexOf('let S='),js.indexOf('const save='));
for(const [input,expected] of [['null',{pts:0,stars:{}}],['{"pts":12,"stars":{"match":3,"bogus":9}}',{pts:12,stars:{match:3}}],['{"pts":"bad","stars":{}}',{pts:0,stars:{}}],['broken',{pts:0,stars:{}}],['{"pts":125,"stars":{"match":2,"two":3,"fix":1,"memory":3,"hang":3,"speed":3}}',{pts:125,stars:{match:2,two:3,fix:1}}]]){const sctx={STARRED:ST.filter(s=>s.id!=='words'),localStorage:{getItem:()=>input}};vm.runInNewContext(stateCode+';globalThis.value=S',sctx);assert.equal(JSON.stringify(sctx.value),JSON.stringify(expected));}
console.log('PASS: valid saved state retained; null, malformed and invalid saved state recover safely.');
console.log('PASS: source identical; script syntax; 100 unique translated words; new groups 10/12; POS; 8 stations; updated sentence dataset; other curated datasets preserved; storage key; Hebrew document; no email.');

assert.equal(ST.filter(s=>s.id!=='words').length*3,21);
assert.deepEqual(Array.from(ST,s=>s.id),['words','match','pics','two','bank','sort','read','fix']);
const vocabulary=new Set(W.map(w=>w[0]));
assert.equal(ctx.result.TWO.length,26);
for(const [sentence,answer,...wrong] of ctx.result.TWO){
 assert.equal((sentence.match(/___/g)||[]).length,1);
 assert.equal(wrong.length,3);
 assert.equal(new Set([answer,...wrong]).size,4);
 for(const word of [answer,...wrong])assert.ok(vocabulary.has(word),'canonical vocabulary choice: '+word);
}
for(const removed of ['memory','hang','speed'])assert.ok(!js.includes('function '+removed+'('));
assert.equal(fs.readFileSync('dist/index.html','utf8'),html,'dist stays in sync locally');
console.log('PASS: 26 sentences with four distinct canonical choices; 7 scored stations / 21 stars; old removed-mode stars excluded, points and remaining stars retained.');
