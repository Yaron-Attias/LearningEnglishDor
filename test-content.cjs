const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),original=fs.readFileSync('original.html','utf8');
assert.equal(require('node:crypto').createHash('sha256').update(original).digest('hex'),'131fbe27673973ddec22ad504de34f89409fa3a3efad4aa498514d7174dc0095');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(js);
const data=js.slice(js.indexOf('const W='),js.indexOf('const STARRED='));
const names=['words','match','pics','two','bank','sort','memory','hang','read','speed','finalq'];
const ctx={console,...Object.fromEntries(names.map(n=>[n,()=>{}]))};
vm.runInNewContext(data+';globalThis.result={W,POS,ST,PICS,TWO,BANK,SORT,QS};',ctx);
const {W,ST}=ctx.result;
assert.equal(W.length,100);assert.equal(new Set(W.map(w=>w[0])).size,100);assert.equal(W.filter(w=>w[3]===3).length,10);assert.equal(W.filter(w=>w[3]===4).length,12);assert.equal(ST.length,11);
for(const w of W){assert.equal(w.length,5);assert.ok(w.every(v=>v!==undefined));assert.match(w[1],/[א-ת]/)}
for(const n of ['PICS','TWO','BANK','SORT','QS']){const oldctx={...Object.fromEntries(names.map(n=>[n,()=>{}])),console};const oldjs=original.match(/<script>([\s\S]*?)<\/script>/)[1];vm.runInNewContext(oldjs.slice(oldjs.indexOf('const W='),oldjs.indexOf('const STARRED='))+';globalThis.result={PICS,TWO,BANK,SORT,QS};',oldctx);
 if(n==='TWO'){
  const bus=oldctx.result.TWO.filter(row=>row[0]==='The bus stopped and we got ___.');
  assert.equal(bus.length,1,'exactly one original ambiguous sentence');
  assert.equal(JSON.stringify(bus[0].slice(1)),JSON.stringify(['off','on']),'original answer and distractor');
  bus[0][0]='When the bus reached our stop, we got ___ and walked home.';
 }
 assert.equal(JSON.stringify(ctx.result[n]),JSON.stringify(oldctx.result[n]),n+' preserved except the approved bus context');}
assert.ok(!html.includes('mailto:'));assert.ok(html.includes('localStorage.setItem("jp-vocab"'));assert.ok(html.includes('lang="he" dir="rtl"'));
const stateCode=js.slice(js.indexOf('let S='),js.indexOf('const save='));
for(const [input,expected] of [['null',{pts:0,stars:{}}],['{"pts":12,"stars":{"match":3,"bogus":9}}',{pts:12,stars:{match:3}}],['{"pts":"bad","stars":{}}',{pts:0,stars:{}}],['broken',{pts:0,stars:{}}]]){const sctx={STARRED:ST.filter(s=>s.id!=='words'),localStorage:{getItem:()=>input}};vm.runInNewContext(stateCode+';globalThis.value=S',sctx);assert.equal(JSON.stringify(sctx.value),JSON.stringify(expected));}
console.log('PASS: valid saved state retained; null, malformed and invalid saved state recover safely.');
console.log('PASS: source identical; script syntax; 100 unique translated words; new groups 10/12; POS; 11 stations; curated datasets preserved except approved bus context; storage key; Hebrew document; no email.');
