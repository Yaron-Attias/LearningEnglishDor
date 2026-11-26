// Behavioral regressions using an isolated minimal DOM; visual checks run separately.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
class Element {
 constructor(tag='div',attrs={}){this.tagName=tag;this.children=[];this.attributes=attrs;this.dataset={};this.style={};this.textContent='';for(const [k,v] of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;this.className=attrs.class||'';this.id=attrs.id||'';this.classList={contains:c=>this.className.split(' ').includes(c),add:(...cs)=>this.className=[...new Set([...this.className.split(' '),...cs])].join(' '),remove:(...cs)=>this.className=this.className.split(' ').filter(c=>!cs.includes(c)).join(' '),toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)};}
 set innerHTML(value){this.children=[];this._html=value;const stack=[this];for(const token of value.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('</')){if(stack.length>1)stack.pop();continue}if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};for(const m of token.matchAll(/([\w-]+)="([^"]*)"/g))attrs[m[1]]=m[2];const el=new Element(tag,attrs);stack.at(-1).appendChild(el);if(!/\/$/.test(token.slice(0,-1))&&!['input','br','use'].includes(tag))stack.push(el)}else stack.at(-1).textContent+=token;}}
 get innerHTML(){return this._html||''}
 appendChild(el){el.parentNode=this;this.children.push(el);return el}
 setAttribute(k,v){this.attributes[k]=v}
 focus(){this.focused=true}
 matches(s){return s.startsWith('.')?this.classList.contains(s.slice(1)):s.startsWith('#')?this.id===s.slice(1):this.tagName===s}
 querySelectorAll(selector){const parts=selector.split(' '),found=[];const visit=n=>{for(const c of n.children){if(c.matches(parts.at(-1))){let p=c.parentNode,i=parts.length-2;while(p&&i>=0){if(p.matches(parts[i]))i--;p=p.parentNode}if(i<0)found.push(c)}visit(c)}};visit(this);return found}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
}
const names=['words','match','pics','two','bank','sort','memory','hang','read','speed','finalq'];
const dataContext={...Object.fromEntries(names.map(n=>[n,()=>{}]))};
vm.runInNewContext(js.slice(js.indexOf('const W='),js.indexOf('const STARRED='))+';globalThis.data={W,TWO,BANK,QS};',dataContext);
const data=dataContext.data;
function runtime(name,next){const b=new Element(),scheduled=[],results=[],points=[];const context={...data,document:{createElement:t=>new Element(t)},shell:()=>b,shuf:a=>[...a],esc:s=>s,TEXT:'<p>Letter</p>',HE:{},TIPS:{},$:()=>new Element(),speak:()=>{},add:n=>points.push(n),setSc:()=>{},beep:()=>{},later:f=>scheduled.push(f),finish:(...args)=>results.push(args)};vm.runInNewContext(js.slice(js.indexOf('function '+name+'('),js.indexOf('function '+next+'('))+';'+name+'({})',context);return {b,scheduled,results,points};}
for(const bankSet of [0,1,2,3]){
 const run=runtime('bank','sort');run.b.querySelectorAll('.tabs button')[bankSet].onclick();
 const set=data.BANK[bankSet],slots=run.b.querySelectorAll('.slot'),chips=run.b.querySelectorAll('.chip');
 slots.forEach((s,k)=>{s.onclick();chips[set.words.indexOf(k===0?set.words.find(w=>w!==set.s[k][1]):set.s[k][1])].onclick()});
 run.b.querySelector('#chk').onclick();
 assert.equal(run.results.length,0,'bank never opens summary before review');
 run.scheduled.forEach(f=>f());assert.equal(run.results.length,0,'waiting does not dismiss corrections');
 const feedback=run.b.querySelectorAll('.answer-feedback');assert.equal(feedback.length,slots.length);
 feedback.forEach((f,k)=>{assert.equal(f.textContent,(k===0?'לא נכון. התשובה הנכונה: ':'נכון. התשובה: ')+set.s[k][1]);assert.equal(f.dir,'rtl');assert.equal(slots[k].attributes['aria-describedby'],f.id)});
 const summary=run.b.querySelector('#bank-summary');assert.equal(summary.disabled,undefined);assert.equal(summary.focused,true);summary.onclick();assert.deepEqual(run.results[0],[slots.length-1,slots.length]);assert.equal(run.points.reduce((a,b)=>a+b,0),(slots.length-1)*10);
}
const read=runtime('read','speed');
read.b.querySelectorAll('.q').forEach((q,i)=>{const answer=data.QS[i][2],chosen=i===0?(answer+1)%data.QS[i][1].length:answer;q.querySelectorAll('.opt')[chosen].onclick();const f=q.querySelector('.answer-feedback');assert.equal(f.textContent,(i===0?'לא נכון. התשובה הנכונה: ':'נכון. התשובה: ')+data.QS[i][1][answer]);assert.equal(f.attributes.role,'status')});
read.scheduled.forEach(f=>f());assert.equal(read.results.length,0,'all reading corrections remain until explicit summary');
const summary=read.b.querySelector('#reading-summary');assert.equal(summary.classList.contains('hide'),false);assert.equal(summary.focused,true);summary.onclick();assert.deepEqual(read.results[0],[9,10]);
// Render the real common result function with unequal counts and the memory override.
for(const [correct,total,label,expected] of [[17,18,undefined,'17 תשובות נכונות מתוך 18'],[5,6,undefined,'5 תשובות נכונות מתוך 6'],[6,6,'מצאתם את כל 6 הזוגות ב־8 תורות','מצאתם את כל 6 הזוגות ב־8 תורות']]){
 const body=new Element(),context={document:{createElement:t=>new Element(t),body},timerId:null,clearInterval:()=>{},cur:{id:'test'},S:{stars:{}},add:()=>{},save:()=>{},hud:()=>{},confetti:()=>{},starStr:()=>'',open:()=>{},home:()=>{},ST:[],correct,total,label};
 vm.runInNewContext(js.slice(js.indexOf('function finish('),js.indexOf('function setSc('))+';finish(correct,total,"",label)',context);
 assert.ok(body.children[0].innerHTML.includes(expected));
}
// The final and sentence station must both continue to draw from the corrected shared TWO data.
assert.equal(data.TWO.filter(row=>row[0]==='When the bus reached our stop, we got ___ and walked home.'&&row[1]==='off'&&row[2]==='on').length,1);
for(const [name,next] of [['two','bank'],['finalq','memory']])assert.match(js.slice(js.indexOf('function '+name+'('),js.indexOf('function '+next+'(')),/shuf\(TWO\)/);
assert.match(js,/finish\(Math.min\(ok,20\),20,[^\n]*`\$\{ok\} תשובות נכונות מתוך \$\{tries\}`\)/,'speed reports actual answers without changing its star target');
console.log('PASS: UAT-01 shared unambiguous sentence; UAT-02 unequal-count result rendering and memory/speed semantics; UAT-04 all 4 banks and all reading questions retain explicit corrections until manual summary, focus, correct scoring.');
