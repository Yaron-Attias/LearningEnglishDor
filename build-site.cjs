const fs = require('node:fs');
const source = fs.readFileSync(fs.existsSync('original.html')?'original.html':'C:/Users/Yaron/Downloads/All-About-Japan-Vocabulary (1).html','utf8');
if (!fs.existsSync('original.html')) fs.writeFileSync('original.html',source);
let html=source;
// Unit 2 palette: recolor interface CSS only; SVG artwork stays untouched.
html=html.replace(/<style>([\s\S]*?)<\/style>/,(_,css)=>{
  css=css.replace(/:root\{color-scheme:light dark;[\s\S]*?\}\s*:root\[data-theme=light\]\{color-scheme:light\}:root\[data-theme=dark\]\{color-scheme:dark\}/,`:root{color-scheme:dark;
--bg:#0b1721;--ink:#f2f6f8;--soft:#b5c6cf;
--red:#c5f783;--red2:#c5f783;--pink:#1d3541;--pink2:#34505c;
--indigo:#c5f783;--card:#122833;--line:#34505c;
--ok:#c5f783;--okbg:#284331;--bad:#ffa1a1;--badbg:#482c36}`);
  css=css.replace(/light-dark\([^)]*\)/g,'var(--card)');
  css=css.replace('linear-gradient(160deg,#ffe0e8 0%,#fff1e4 55%,#e6f3ff 100%)','linear-gradient(160deg,#122833 0%,#152c38 55%,#0b1721 100%)');
  css=css.replace('color:#3b2a35','color:var(--ink)').replace('header h1{color:#e0435f}','header h1{color:var(--ink)}');
  css=css.replace('linear-gradient(90deg,#ff8fa3,#ffc36b,#7fd6a8)','var(--red)').replace('linear-gradient(135deg,#ffc3d0,#ffe0b8)','linear-gradient(135deg,#1d3541,#294654)');
  css=css.replace(/border-color:#(?:a9d9c0|b6c9f5|ffd98a|a9b8ff)/g,'border-color:var(--line)');
  css=css.replace('background:#fff;color:#3b2a35;border:2px solid #ffc3d0','background:var(--card);color:var(--ink);border:2px solid var(--line)');
  css=css.replace('border:3px solid #fff','border:3px solid var(--line)');
  css+=`\n/* Interface states follow the existing Unit 2 navy, teal and lime palette. */
.btn,.tabs button.on{color:#14261c}.btn:hover{background:#d9ff9f}.btn.ghost:hover{background:#294654}
.st:nth-child(n){background:var(--card)}.st .ic{background:#1d3541}
.opt,.m,.spk,.keys button,.tabs button,.btn.ghost{background:#192f3b}
.opt:hover,.m:hover,.spk:hover,.keys button:hover,.tabs button:hover{background:#294654}
.tabs button.on:hover{background:#d9ff9f}
input[type=search]::placeholder{color:var(--soft);opacity:1}
.opt.ok:hover,.chip.ok:hover{background:var(--okbg)}.opt.bad:hover,.chip.bad:hover{background:var(--badbg)}
.m.sel,.slot.act{background:#294432;border-color:var(--red)}
.bk.n,.bk.v,.bk.a{border-color:var(--line)}.bk.over{border-color:var(--red)}
.fc .card:nth-child(n) .k{border-color:var(--line)}
.stars .on{color:var(--red)}.res{background:#0b1721cc}
`;
  return '<style>'+css+'</style>';
});
const replace=(a,b)=>{if(!html.includes(a))throw new Error('Missing source: '+a.slice(0,90));html=html.split(a).join(b)};
const extra=[
['below','למטה; מתחת','in a lower place',3,'ADV'],['complete','להשלים','to finish something',3,'V'],['dictionary','מילון','a book or tool that explains words',3,'N'],['find out','לברר','to learn information about something',3,'V'],['instructions','הוראות','directions that tell you what to do',3,'N'],['opposite','הפוך','completely different',3,'ADJ'],['raise','להרים','to lift something up',3,'V'],['repeat','לחזור על','to say or do something again',3,'V'],['spell','לאיית','to say or write the letters of a word',3,'V'],['vocabulary','אוצר מילים','the words that someone knows or learns',3,'N'],
['conversation','שיחה','a talk between people',4,'N'],['correct','נכון','right; without a mistake',4,'ADJ'],['describe','לתאר','to say what something is like',4,'V'],['document','מסמך','a file or paper with information',4,'N'],['example','דוגמה','something that shows what you mean',4,'N'],['first name','שם פרטי','the personal name used before a surname',4,'N'],['folder','תיקייה','a place to keep documents together',4,'N'],['guess','לנחש','to give an answer without being sure',4,'V'],['keyboard','מקלדת','the keys used to type on a computer',4,'N'],['quiz','בוחן','a short test',4,'N'],['surname','שם משפחה','the name shared by members of a family',4,'N'],['task','משימה','a piece of work to do',4,'N']];
replace('W.forEach(w=>',`W.push(...${JSON.stringify(extra.map(w=>w.slice(0,4)))});\nObject.assign(POS,${JSON.stringify(Object.fromEntries(extra.map(w=>[w[0],w[4]])))});\nW.forEach(w=>`);
replace('<html lang="en">','<html lang="he" dir="rtl">');
replace('<title>All About Japan – Vocabulary</title>','<title>מסע מילים ביפן</title>');
replace('<h1>All About Japan</h1>','<h1 lang="he" dir="rtl">מסע מילים ביפן</h1>');
replace('Think About It · Unit 1 · Vocabulary Journey','All About Japan · Think About It · Unit 1 · תרגול אוצר מילים');
replace('Points <b','נקודות <b');replace('Stars <b','כוכבים <b');
replace('<b id="sts">0</b>/30','<span dir="ltr"><b id="sts">0</b>/30</span>');
replace('Sound: on','צלילי משחק: פעילים');replace('Back to map','חזרה למפת התחנות');replace('Choose a station','מפת התחנות');
replace('"Sound: "+(sound?"on":"off")','"צלילי משחק: "+(sound?"פעילים":"כבויים")');
replace('["Sugoi!","Great!","Yatta!","Excellent!","Perfect!"]','["כל הכבוד!","נכון מאוד!","הצלחתם!","מצוין!","נהדר!"]');replace('["Oops!","Try again!","Almost!"]','["נסו שוב","עוד ניסיון!","כמעט!"]');
replace('<h3>${s.t}</h3><span class="he">${s.he}</span>','<h3>${s.he}</h3><span lang="en" dir="ltr">${s.t}</span>');
replace('${s.no}</span>','${s.no.replace("Final Station", "תחנה אחרונה").replace("Station", "תחנה")}</span>');
replace('${title}</h2><span class="pill">Score','${cur.he}</h2><span class="pill">ניקוד');
replace('<div class="instr"><span>${en}</span><span class="he">${he}</span></div>','<div class="instr"><span class="he">${he}</span></div>');
replace('בסוף לחצו Check.','לחיצה על מילה ממלאת את המקום הפעיל. להחלפה לחצו על מקום שכבר מולא ובחרו מילה אחרת. בסוף לחצו על ״בדיקה״.');
replace('בחרו מילה ממחסן המילים ולחצו על המקום הריק במשפט.','בחרו מקום ריק במשפט ואז מילה ממחסן המילים.');
replace('הסתכלו בתמונה ובחרו את המילה המתאימה.','הסתכלו בתמונה ובחרו את המילה המתאימה. לאחר המענה תושמע המילה, אם ההקראה זמינה.');
replace('"Excellent!":st===2?"Great job!":st===1?"Good try!":"Keep practising!"','"מצוין!":st===2?"כל הכבוד!":st===1?"ניסיון טוב!":"ממשיכים לתרגל!"');
replace('מצוין! עבודה מושלמת','הסבב הסתיים בהצלחה');
const literals={
 ' correct':' תשובות נכונות','Bonus: +':'בונוס: +',' points':' נקודות',
 'Play again':'סבב נוסף','>Map</button>':'>למפת התחנות</button>',
 'Question ${i+1}':'שאלה ${i+1}','"Streak x"':'"רצף ×"','"Amazing streak! +15":"Correct! +10"':'"רצף מצוין! +15":"נכון! +10"','"Correct! +10"':'"נכון! +10"','"Oops! The answer is: "':'"לא הפעם. התשובה הנכונה: "',
 'Round ${round+1}':'סבב ${round+1}',
 'aria-label="picture"':'aria-label="תמונה לשאלה"',
 'aria-label="blank ${k+1}"':'aria-label="מקום להשלמה ${k+1}"',
 '>Check</button>':'>בדיקה</button>',
 'Fill in all the blanks first! / השלימו את כל המשפטים':'השלימו תחילה את כל המשפטים',
 'Listen to the letter':'הקראת המכתב','>Questions</h3>':'>שאלות על המכתב</h3>',
 '>Start!</button>':'>מתחילים!</button>','Correct: <b':'תשובות נכונות: <b',
 'What does <b>${esc(w[0])}</b> mean?':'מה המשמעות של <b dir="ltr" lang="en">${esc(w[0])}</b>?',
 'Which word matches the picture?':'איזו מילה מתאימה לתמונה?',
 '<b>${w}</b> is a…':'מהו חלק הדיבר של <b dir="ltr" lang="en">${w}</b>?',
 'Moves <b':'תורות <b','Pairs <b':'זוגות <b','aria-label="card"':'aria-label="כרטיס זיכרון"',
 'Found all 6 pairs in ${moves} moves':'מצאתם את כל 6 הזוגות ב־${moves} תורות',
 'Word ${r+1}':'מילה ${r+1}','Saved words: ${won}':'מילים שפוענחו: ${won}',
 '${word.replace(/ /g,"").length} letters':'${word.replace(/ /g,"").length} אותיות',
 'Next word':'למילה הבאה','You saved ${lives} sushi! +${g}':'הצלתם ${lives} סושי! +${g}',
 '"Oh no! The word was: "':'"המילה הייתה: "',
 'aria-label="Listen to ${esc(w[0])}"':'aria-label="הקראת ${esc(w[0])}"',
 'No words found.':'לא נמצאו מילים.',
 ' – flip':' — לחצו כדי להפוך','click to flip':'לחצו כדי להפוך',
 '>Flashcards</button>':'>כרטיסיות</button>','>List</button>':'>רשימה</button>','>Flip all</button>':'>הפיכת כל הכרטיסיות</button>',
 'All (${W.length})':'הכול (${W.length})','>Parts 1–3</button>':'>חלקים 1–3</button>','>Parts 4–5</button>':'>חלקים 4–5</button>',
 'placeholder="Search a word… / חיפוש" aria-label="Search"':'placeholder="חיפוש מילה בעברית או באנגלית" aria-label="חיפוש מילה"',
 '(or picture)':'(או תמונה)'
};
for(const [a,b] of Object.entries(literals)){if(html.includes(a))html=html.split(a).join(b)}
replace('<input type="search"','<button data-p="3" lang="en" dir="ltr">In the classroom 1</button><button data-p="4" lang="en" dir="ltr">In the classroom 2</button><input type="search"');
replace('`"${w}" is not a${bk.dataset.k==="a"?"n adjective":bk.dataset.k==="n"?" noun":" verb"}. Try again!`','`המילה ${w} אינה ${bk.dataset.k==="a"?"שם תואר":bk.dataset.k==="n"?"שם עצם":"פועל"} בתרגיל הזה. נסו שוב.`');
replace('(${ok} תשובות נכונות out of ${tries} – 20 תשובות נכונות = 3 stars)','(${ok} תשובות נכונות מתוך ${tries}; 20 תשובות נכונות מזכות ב־3 כוכבים)');
replace('let S={pts:0,stars:{}};try{S=JSON.parse(localStorage.getItem("jp-vocab"))||S}catch(e){}',`let S={pts:0,stars:{}};try{const stored=JSON.parse(localStorage.getItem("jp-vocab"));if(stored&&Number.isFinite(stored.pts)&&stored.pts>=0&&stored.stars&&typeof stored.stars==="object"){S.pts=stored.pts;for(const s of STARRED){const n=stored.stars[s.id];if(Number.isInteger(n)&&n>=0&&n<=3)S.stars[s.id]=n}}}catch(e){}`);
replace('function speak(w){try{','function speak(w){try{if(!("speechSynthesis" in window))throw new Error("unavailable");');
replace('speechSynthesis.speak(u)}catch(e){}}','u.onerror=()=>{document.getElementById("audio-status").textContent="ההקראה אינה זמינה כרגע. אפשר להמשיך לתרגל ולנסות שוב באמצעות כפתור הקראה."};speechSynthesis.speak(u)}catch(e){document.getElementById("audio-status").textContent="ההקראה אינה זמינה בדפדפן הזה. אפשר להמשיך לתרגל."}}');
replace('function open(i){stationRun++;','function open(i){if("speechSynthesis" in window)speechSynthesis.cancel();stationRun++;');
replace('function home(){stationRun++;','function home(){if("speechSynthesis" in window)speechSynthesis.cancel();stationRun++;');
replace('<div class="fb"></div>','<div class="fb" role="status" aria-live="polite"></div>');
// Explicit English direction keeps sentence exercises and flip animations intact in the RTL shell.
replace('<div class="sent">','<div class="sent" dir="ltr" lang="en">');
replace('<div class="passage">','<div class="passage" dir="ltr" lang="en">');
replace('<div class="blist">','<div class="blist" dir="ltr" lang="en">');
replace('<div class="hword">','<div class="hword" dir="ltr" lang="en">');
replace('<div class="keys">','<div class="keys" dir="ltr" lang="en">');
replace('<b id="pr">0</b>/6','<span dir="ltr"><b id="pr">0</b>/6</span>');
replace('שאלה ${i+1} / ${n}','שאלה <bdi>${i+1} / ${n}</bdi>');
replace('סבב ${round+1} / ${R}','סבב <bdi>${round+1} / ${R}</bdi>');
replace('מילה ${r+1} / ${pool.length}','מילה <bdi>${r+1} / ${pool.length}</bdi>');
replace('<div class="q" data-i=','<div class="q" dir="ltr" lang="en" data-i=');
replace('<button class="m w"','<button class="m w" dir="ltr" lang="en"');
replace('<td>${esc(w[0])}</td><td style=','<td lang="en" dir="ltr">${esc(w[0])}</td><td lang="en" dir="ltr" style=');
replace('<span class="k">${esc(w[0])}','<span class="k" dir="ltr" lang="en">${esc(w[0])}');
replace('<small>לחצו כדי להפוך</small>','<small lang="he" dir="rtl">לחצו כדי להפוך</small>');
replace('</style>',`\n/* Narrow-screen additions: original artwork and station layout retained. */
button{min-height:44px;min-width:44px;touch-action:manipulation;overflow-wrap:anywhere}
.barin{direction:rtl}.pill b{unicode-bidi:isolate;direction:ltr}.pill{white-space:normal}
.st .no,.st span[lang=en]{font-size:14px}.st h3,.ptop h2{line-height:1.25}
.opts .opt,.bank .chip,.buckets .chip{unicode-bidi:plaintext}.sent b{unicode-bidi:isolate}
.fc .card .k,.fc .card .f,.mem .card .f{overflow-wrap:anywhere}.fc .card .k{font-size:clamp(17px,2.4vw,24px)}
.wl{table-layout:fixed}.wl td{overflow-wrap:anywhere}.wl td:first-child{white-space:normal}.wl td:last-child{width:58px}
.audio-status:empty{display:none}.audio-status{max-width:1000px;margin:8px auto;padding:8px 16px;color:var(--soft)}
footer{border-top:2px solid var(--line);padding:20px 16px;text-align:center;font-size:15px}footer a,dialog a{color:var(--red2)}
footer .btn{margin-top:12px}dialog{background:var(--card);color:var(--ink);border:2px solid var(--pink2);border-radius:22px;width:min(560px,calc(100% - 24px));max-height:85dvh;overflow:auto;padding:24px}dialog::backdrop{background:#0b1721cc}body:has(dialog[open]){overflow:hidden}dialog h2{font-size:26px}dialog h3{font-size:20px;margin-top:20px}dialog p{line-height:1.7}
@media(max-width:700px){.bar{position:static}.barin{gap:8px}.barin .grow{display:none}.barin .btn{padding:9px 12px}.barin #back{flex-basis:100%}.ptop{padding-inline-end:0}.deco{opacity:.2}.map{grid-template-columns:1fr}.opts{grid-template-columns:minmax(0,1fr)}.fc{gap:10px}.fc .card{aspect-ratio:auto;height:174px}.fc .card .f .e{font-size:36px}.wl,.wl tbody{display:block}.wl tr{display:grid;grid-template-columns:minmax(0,1fr) 52px;border-bottom:1px solid var(--line);padding:8px 0}.wl td{border:0;padding:5px}.wl td:nth-child(1){grid-column:1;grid-row:1}.wl td:nth-child(2){grid-column:1;grid-row:3}.wl td:nth-child(3){grid-column:1;grid-row:2}.wl td:nth-child(4){grid-column:2;grid-row:1/span 3;align-self:center}.plate{padding-inline:8px;gap:2px}.plate svg{width:clamp(22px,6vw,42px);height:42px}.plate svg:last-child{width:44px!important;height:44px!important;margin-inline-start:4px!important}.resc{max-height:85dvh;overflow:auto}.hwrap{padding-top:20px}.hwrap .fuji{max-height:85px}.hwrap h1{font-size:36px}.chip{touch-action:pan-y}.keys{grid-template-columns:repeat(5,minmax(0,1fr))}#cheer{inset-inline-end:8px}#cheer span{white-space:normal;max-width:180px}.q .opts{grid-template-columns:minmax(0,1fr)}}
@media(max-width:360px){main{padding-inline:12px}.panel{padding-inline:14px}.fc .card{height:164px}.mem{grid-template-columns:repeat(2,minmax(0,1fr))}.cols{gap:8px}.m{padding:9px 6px}.pill{padding:6px 10px}}
</style>`);
replace('<div id="tip"',`<p id="audio-status" class="audio-status" role="status"></p>
<footer>נוצר על ידי <a href="https://github.com/Yaron-Attias" target="_blank" rel="noopener noreferrer"><bdi>Yaron-Attias</bdi></a> · לשימוש אישי ולימודי בלבד<br><button class="btn ghost" id="about-open">אודות, פרטיות ותנאי שימוש</button></footer>
<dialog id="about" aria-labelledby="about-title"><h2 id="about-title">אודות האפליקציה</h2><p>תרגול אוצר מילים באנגלית בנושא יפן ובכיתה, באמצעות 11 תחנות לימוד. נוצר על ידי <a href="https://github.com/Yaron-Attias" target="_blank" rel="noopener noreferrer"><bdi>Yaron-Attias</bdi></a>.</p><h3>פרטיות ושמירה</h3><p>נקודות וכוכבים נשמרים בדפדפן במכשיר זה בלבד, תחת המפתח <bdi>jp-vocab</bdi>. האתר אינו שולח את ההתקדמות לשרת ואינו מסנכרן מכשירים. מחיקת נתוני האתר בהגדרות הדפדפן מוחקת את ההתקדמות. רענון מתחיל את המשימה מחדש. ההקראה משתמשת בשירות הדיבור של המכשיר או הדפדפן; עיבוד הטקסט עשוי להיות תלוי בשירות ובקול שנבחרו במכשיר.</p><h3>תנאי שימוש ומגבלות</h3><p>לשימוש אישי, לימודי ולא מסחרי. שימוש מסחרי או הפצת עותקים דורשים אישור מראש מהיוצר, בכפוף לרישיונות ולזכויות של צדדים שלישיים. ייתכנו טעויות בתוכן, בתרגום ובהקראה. הניקוד משקף את הסבב ואינו ציון בית־ספרי או הוכחה לשליטה בחומר. האתר מסופק במצבו הקיים ללא התחייבות לזמינות רציפה, עדכונים או תמיכה.</p><p>עודכן: 26 בנובמבר 2026</p><button class="btn" id="about-close">הבנתי, ממשיכים ללמוד</button></dialog>
<div id="tip"`);
replace('renderMap();hud();',`const about=document.getElementById("about");document.getElementById("about-open").onclick=()=>about.showModal();document.getElementById("about-close").onclick=()=>about.close();\nrenderMap();hud();`);
// Approved UAT-01/02/04: unambiguous context, readable results, and reviewable feedback.
replace('The bus stopped and we got ___.','When the bus reached our stop, we got ___ and walked home.');
replace('ok+" / "+total+" תשובות נכונות"','ok+" תשובות נכונות מתוך "+total');
// Keep the speed star target separate from the actual number of answered questions.
replace('20 תשובות נכונות מזכות ב־3 כוכבים)</div>`)','20 תשובות נכונות מזכות ב־3 כוכבים)</div>`,`${ok} תשובות נכונות מתוך ${tries}`)');
replace('s.classList.add(g?"ok":"bad");if(g)ok++',String.raw`s.classList.add(g?"ok":"bad");const feedback=document.createElement("div");feedback.className="answer-feedback";feedback.dir="rtl";feedback.lang="he";feedback.id="bank-answer-"+k;feedback.textContent=(g?"נכון. התשובה: ":"לא נכון. התשובה הנכונה: ")+set.s[k][1];s.setAttribute("aria-describedby",feedback.id);s.parentNode.appendChild(feedback);if(g)ok++`);
replace('later(()=>finish(ok,slots.length),1300)',String.raw`const review=b.querySelector(".fb");review.className="fb";review.textContent="התיקונים מוצגים מתחת לכל משפט. קראו אותם, ואז בחרו להציג את הסיכום.";const next=document.createElement("button");next.className="btn";next.id="bank-summary";next.textContent="קראתי את התיקונים — הצגת סיכום";next.onclick=()=>{next.disabled=true;finish(ok,slots.length)};b.querySelector("#chk").parentNode.appendChild(next);next.focus()`);
replace('let ans=0,ok=0,sc=0;b.querySelector("#qs")',String.raw`const summary=document.createElement("button");summary.className="btn hide";summary.id="reading-summary";summary.textContent="קראתי את התיקונים — הצגת סיכום";b.appendChild(summary);let ans=0,ok=0,sc=0;summary.onclick=()=>{summary.disabled=true;finish(ok,QS.length)};b.querySelector("#qs")`);
replace('const [,,a]=QS[+q.dataset.i];q.querySelectorAll', 'const [,options,a]=QS[+q.dataset.i];const feedback=document.createElement("div");feedback.className="answer-feedback";feedback.dir="rtl";feedback.lang="he";feedback.setAttribute("role","status");q.appendChild(feedback);q.querySelectorAll');
replace('ans++;if(ans===QS.length)later(()=>finish(ok,QS.length),900)',String.raw`feedback.textContent=(+btn.dataset.k===a?"נכון. התשובה: ":"לא נכון. התשובה הנכונה: ")+options[a];ans++;if(ans===QS.length){summary.classList.remove("hide");summary.focus()}`);
// Matching otherwise conveyed the outcome only by color and sound.
replace('<div class="cols"><div class="col">','<div class="fb" role="status" aria-live="polite"></div><div class="cols"><div class="col">');
replace('sel=null;done++;sc+=10;', 'b.querySelector(".fb").textContent="נכון. הזוג הותאם: "+m.dataset.w;sel=null;done++;sc+=10;');
replace('else{miss++;beep(0);m.classList.add("shake")','else{b.querySelector(".fb").textContent="לא נכון. הפירוש של "+sel.el.dataset.w+" הוא: "+H(W.find(w=>w[0]===sel.el.dataset.w));miss++;beep(0);m.classList.add("shake")');
replace('<div id="sq"></div>','<div id="sq"></div><div class="fb" role="status" aria-live="polite"></div>');
replace('tries++;if(+btn.dataset.k===a)', 'tries++;b.querySelector(".fb").textContent=(+btn.dataset.k===a?"נכון. התשובה: ":"לא נכון. התשובה הנכונה: ")+o[a];if(+btn.dataset.k===a)');
replace('const q=()=>{const w=deck[i++%deck.length];','const q=()=>{b.querySelector(".fb").textContent="";const w=deck[i++%deck.length];');
replace('</style>','\n.answer-feedback{flex-basis:100%;font-size:17px;line-height:1.6;margin-block:6px;text-align:start;unicode-bidi:plaintext}\n</style>');
// Approved compact home option 2 (26 November 2026); exercise content stays intact.
html=html.replace(/<header>[\s\S]*?<\/header>/,`<header class="compact-header">
 <div class="compact-title"><div class="title-art"><svg class="motif" aria-hidden="true"><use href="#i-fuji"/></svg><h1 lang="he" dir="rtl">מסע מילים ביפן</h1></div><span class="unit" dir="ltr">UNIT 1</span></div>
</header>`);
replace('<div class="lead"><h2>מפת התחנות</h2><span class="he" style="color:var(--soft)">בחרו תחנה כדי להתחיל לתרגל</span></div>','');
replace('<section id="home">','<section id="home" aria-label="תחנות התרגול">');
replace('<span class="no">${s.no.replace("Final Station", "תחנה אחרונה").replace("Station", "תחנה")}</span><h3>${s.he}</h3><span lang="en" dir="ltr">${s.t}</span>','<h3>${s.he}</h3>');
replace('<span class="ic"><svg><use href="#i-${s.ic}"/></svg></span>','<span class="ic"><svg aria-hidden="true"><use href="#i-${s.ic}"/></svg></span>');
replace('<span class="stars">${starStr(S.stars[s.id]||0)}</span>','<span class="stars" aria-label="${S.stars[s.id]||0} מתוך 3 כוכבים">${starStr(S.stars[s.id]||0)}</span>');
const soundOn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg>';
const soundOff='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/></svg>';
replace('<button class="btn ghost" id="snd" aria-pressed="true">צלילי משחק: פעילים</button>',`<button class="btn ghost sound" id="snd" aria-pressed="true" aria-label="השתקת צלילי משחק" title="השתקת צלילי משחק">${soundOn}</button>`);
replace('$("#snd").textContent="צלילי משחק: "+(sound?"פעילים":"כבויים");',`$("#snd").innerHTML=sound?${JSON.stringify(soundOn)}:${JSON.stringify(soundOff)};const label=sound?"השתקת צלילי משחק":"הפעלת צלילי משחק";$("#snd").setAttribute("aria-label",label);$("#snd").setAttribute("title",label);`);
replace('</style>',`\n/* Compact title and two-column station grid, matching the approved option 2. */
.compact-header{background:linear-gradient(130deg,#152c38,var(--bg))}
.compact-title{max-width:1180px;margin:auto;padding:10px max(5vw,16px) 0;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:44px}
.title-art{display:flex;align-items:center;gap:6px}.motif{width:34px;height:34px;flex:none}
.compact-header h1{font-family:Rubik,Arial,sans-serif;font-size:23px;font-weight:800;line-height:1.2;white-space:nowrap;text-wrap:nowrap}
.unit{font-size:12px;font-weight:800;letter-spacing:1px;color:var(--red);background:#253c32;border:1px solid #536d48;padding:5px 8px;border-radius:7px;white-space:nowrap;flex:none}
.bar{position:static;border-bottom:1px solid var(--line);background:var(--bg)}
.barin{padding-block:0;gap:12px;min-height:45px}.barin .pill{padding:0;background:transparent;border-radius:0;font-size:14px;font-weight:400;color:var(--soft);gap:4px}.barin .pill b{font-size:16px}.barin .grow{display:block}
.barin .sound{display:grid;place-items:center;width:44px;height:44px;padding:10px;flex:none;background:transparent;border:0;box-shadow:none;border-radius:10px;margin-inline-start:auto}.sound svg{width:23px;height:23px}.barin .sound:hover{background:#1d3541}.sound[aria-pressed=false]{color:var(--bad)}
main{padding-top:10px;padding-bottom:20px}
.map{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.map .st{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:99px;padding:8px;border:1px solid var(--line);border-radius:13px;text-align:center}
.map .st:hover{border-color:var(--red);transform:translateY(-2px)}
.map .st .ic{width:32px;height:32px;background:transparent;border-radius:0;box-shadow:none;flex:none}.map .st .ic svg{width:32px;height:32px}
.map .st h3{font-family:Rubik,Arial,sans-serif;font-size:14px;line-height:1.25;overflow-wrap:anywhere;text-wrap:wrap;max-width:100%}
.map .st:first-child h3{color:var(--red)}.map .stars{margin:1px 0 0;font-size:14px;line-height:1;letter-spacing:1px;direction:ltr}
.map .st:last-child:nth-child(odd){grid-column:1/-1;flex-direction:row;min-height:57px;gap:10px;text-align:start}.map .st:last-child:nth-child(odd) .stars{margin-inline-start:auto;flex:none}
@media(min-width:701px){.map{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:700px){.compact-title{padding-inline:12px}.barin{padding-inline:12px;gap:12px}.barin .grow{display:block}.barin .sound{padding:10px}.barin #back{flex-basis:100%;margin-bottom:8px}main{padding-inline:12px}.compact-header h1{font-size:21px}}
@media(max-width:360px){.compact-header h1{font-size:19px}.unit{padding-inline:6px}.compact-title{gap:6px}.title-art{gap:4px}.barin{gap:10px}}
@media(prefers-reduced-motion:reduce){.map .st{transition:none}.map .st:hover{transform:none}.map .st:hover .ic svg{animation:none}}
</style>`);
// Latest local revision: eight activities and four curated vocabulary choices.
const sentences=[
['Mount Fuji is a ___ mountain: people around the world know its name.','famous','comfortable','medical','tasty'],
['My little brother hides under his blanket because he is ___ of the dark.','afraid','glad','full','correct'],
['We have no car. To travel by rail, we will ___.','take a train','take a picture','tell a story','get the flu'],
['What is the price? How much does this ticket ___?','cost','arrive','believe','collect'],
['This bed is soft and ___. I sleep well on it.','comfortable','afraid','medical','tasty'],
['Our bus is here. We must ___ now to ride to school.','get on','get off','come home','get the flu'],
['The bus has reached our stop. We must ___ here and walk home.','get off','get on','take a train','get the flu'],
['Both T-shirts look nice. I cannot ___ which one to buy.','decide','arrive','collect','raise'],
['This song is ___: almost everyone likes listening to it.','popular','medical','afraid','full'],
['Our plane will land in Tokyo at six. That is when we ___.','arrive','leave','collect','spell'],
['He fell asleep at eight. It is ten now, and he is ___ sleeping.','still','below','instead','directly'],
['I am sick today. I do not ___, so I must stay in bed.','feel well','get on','take a picture','tell a story'],
['Dana looks after sick people in a hospital. She is a ___.','nurse','dictionary','keyboard','mountain'],
['I will ___ my friends to my party by sending them invitations.','invite','collect','spell','raise'],
['Do you ___ that ghosts are real?','believe','arrive','cost','collect'],
['My brother has a stamp album. He likes to ___ stamps.','collect','arrive','spell','cost'],
['Check your answer carefully so you do not ___.','make a mistake','get on','take a train','get the flu'],
['This cake tastes wonderful. It is very ___!','tasty','medical','afraid','below'],
['I broke your cup. I am very ___ about it.','sorry','tasty','full','medical'],
['Here is my advice: you ___ wear a coat because it is cold.','should','below','several','almost'],
['Our team beat all the other teams and won the ___.','competition','pocket','keyboard','surname'],
['Grandma lives far away. I ___ her and wish she were here.','miss','spell','cost','arrive'],
['Put your phone in the small ___ sewn into your coat.','pocket','mountain','competition','surname'],
['Write the ___ at the top of the page: 20 November.','date','nature','nurse','keyboard'],
['A thousand times a thousand is one ___.','million','thousand','several','both'],
['This train goes ___ to Kyoto, without stopping anywhere else.','directly','below','almost','instead']
];
html=html.replace(/const TWO=\[[\s\S]*?;\s*const BANK=/,'const TWO='+JSON.stringify(sentences)+';\nconst BANK=');
replace('Pick 1 of 2','Pick 1 of 4');
replace('השלמת משפטים – 2 אפשרויות','השלמת משפטים – 4 אפשרויות');
replace('מבין שתי האפשרויות','מבין ארבע האפשרויות');
replace('.map(([s,a,c])=>{const o=shuf([a,c]);','.map(([s,a,...wrong])=>{const o=shuf([a,...wrong]);');
replace('.forEach(([s,a,c])=>items.push(mk(esc(s).replace("___","<span class=blank>&nbsp;</span>"),a,[c])))','.forEach(([s,a,...wrong])=>items.push(mk(esc(s).replace("___","<span class=blank>&nbsp;</span>"),a,wrong)))');
for(const id of ['memory','hang','speed'])html=html.replace(new RegExp(',?\\{id:"'+id+'",[^}]+\\}'),'');
for(const [name,next] of [['speed','finalq'],['memory','hang'],['hang','words']]){
 const start=html.indexOf('function '+name+'('),end=html.indexOf('function '+next+'(',start);
 if(start<0||end<0)throw new Error('Missing removed activity '+name);
 html=html.slice(0,start)+html.slice(end);
}
replace('באמצעות 11 תחנות לימוד','באמצעות 8 תחנות לימוד');
replace('<b id="sts">0</b>/30','<b id="sts">0</b>/21');
replace('Choose the תשובות נכונות word to complete the sentence.','Choose the correct word to complete the sentence.');
fs.writeFileSync('index.html',html);
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/index.html',html);
console.log('Wrote index.html; source preserved; added '+extra.length+' vocabulary entries.');
