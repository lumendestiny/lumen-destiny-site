const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}

const FLAG_SVG={
ko:`<svg viewBox="0 0 36 24" width="24" height="16" aria-hidden="true"><rect width="36" height="24" fill="#fff"/><path d="M18 6a6 6 0 0 1 0 12 3 3 0 0 0 0-6 3 3 0 0 1 0-6z" fill="#cd2e3a"/><path d="M18 18a6 6 0 0 1 0-12 3 3 0 0 0 0 6 3 3 0 0 1 0 6z" fill="#0047a0"/><g stroke="#111" stroke-width="1.2"><path d="M5 5l5 3M6 3l5 3M25 18l5 3M26 16l5 3"/><path d="M30 5l-5 3M31 3l-5 3M10 18l-5 3M11 16l-5 3"/></g></svg>`,
en:`<svg viewBox="0 0 38 24" width="24" height="16" aria-hidden="true"><rect width="38" height="24" fill="#fff"/><g fill="#b22234"><rect y="0" width="38" height="2"/><rect y="4" width="38" height="2"/><rect y="8" width="38" height="2"/><rect y="12" width="38" height="2"/><rect y="16" width="38" height="2"/><rect y="20" width="38" height="2"/></g><rect width="16" height="12" fill="#3c3b6e"/><g fill="#fff"><circle cx="3" cy="3" r=".7"/><circle cx="7" cy="3" r=".7"/><circle cx="11" cy="3" r=".7"/><circle cx="3" cy="7" r=".7"/><circle cx="7" cy="7" r=".7"/><circle cx="11" cy="7" r=".7"/></g></svg>`,
ja:`<svg viewBox="0 0 36 24" width="24" height="16" aria-hidden="true"><rect width="36" height="24" fill="#fff"/><circle cx="18" cy="12" r="6" fill="#bc002d"/></svg>`,
tl:`<svg viewBox="0 0 36 24" width="24" height="16" aria-hidden="true"><rect width="36" height="12" fill="#003da5"/><rect y="12" width="36" height="12" fill="#ce1126"/><path d="M0 0l17 12L0 24z" fill="#fff"/><circle cx="5.5" cy="12" r="2.1" fill="#fcd116"/></svg>`,
vi:`<svg viewBox="0 0 36 24" width="24" height="16" aria-hidden="true"><rect width="36" height="24" fill="#da251d"/><path d="M18 5.2l1.8 4.2 4.6.4-3.5 3 1.1 4.5-4-2.4-4 2.4 1.1-4.5-3.5-3 4.6-.4z" fill="#ff0"/></svg>`
};
function renderLanguageFlags(){document.querySelectorAll('.lang-choice[data-lang]').forEach(btn=>{const lang=btn.dataset.lang;if(FLAG_SVG[lang]){btn.style.backgroundImage='none';btn.innerHTML=FLAG_SVG[lang];const svg=btn.querySelector('svg');if(svg){svg.style.display='block';svg.style.pointerEvents='none';}}});}
renderLanguageFlags();

function normalizeLang(v){v=(v||'').toLowerCase();if(v.startsWith('ja'))return'ja';if(v.startsWith('ko'))return'ko';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko';}
function currentUiLang(){return normalizeLang(window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');}
function dateLabel(value,type,lang){if(lang==='ko')return value+({year:'년',month:'월',day:'일'})[type];if(lang==='ja')return value+({year:'年',month:'月',day:'日'})[type];if(lang==='vi')return type==='year'?`Năm ${value}`:type==='month'?`Tháng ${Number(value)}`:`Ngày ${Number(value)}`;return value;}
function fillSelect(id,start,end,type,pad=false,selected=null){const el=document.getElementById(id);if(!el)return;const prev=el.value;el.innerHTML='';const lang=currentUiLang();for(let n=start;n<=end;n++){const v=pad?String(n).padStart(2,'0'):String(n);const o=document.createElement('option');o.value=v;o.textContent=dateLabel(v,type,lang);if((prev&&v===prev)||(selected!==null&&Number(v)===Number(selected)))o.selected=true;el.appendChild(o);}}
function refreshBirthDateLabels(langOverride=null){const lang=normalizeLang(langOverride||currentUiLang());[['birthYear','year'],['birthMonth','month'],['birthDay','day']].forEach(([id,type])=>{const el=document.getElementById(id);if(!el)return;[...el.options].forEach(o=>o.textContent=dateLabel(o.value,type,lang));});}
fillSelect('birthYear',1900,2050,'year',false,1980);fillSelect('birthMonth',1,12,'month',true,1);fillSelect('birthDay',1,31,'day',true,1);
const time=document.getElementById('birthTime');if(time){const first=document.createElement('option');first.value='';first.textContent='모름 (태어난 시간)';time.innerHTML='';time.appendChild(first);for(let h=0;h<24;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const o=document.createElement('option');o.value=v;o.textContent=v;time.appendChild(o);}}}

document.addEventListener('click',e=>{const el=e.target.closest('.lang-choice');if(!el)return;const lang=normalizeLang(el.dataset.lang);window.__LUMEN_LANG__=lang;localStorage.setItem('lumen-lang',lang);setTimeout(()=>{refreshBirthDateLabels(lang);renderLanguageFlags();},0);});
window.addEventListener('lumen-language-change',e=>{refreshBirthDateLabels(e.detail?.lang);renderLanguageFlags();});
setTimeout(()=>{refreshBirthDateLabels();renderLanguageFlags();},80);

const sajuForm=document.getElementById('sajuForm');if(sajuForm){let langInput=sajuForm.querySelector('input[name="lang"]');if(!langInput){langInput=document.createElement('input');langInput.type='hidden';langInput.name='lang';sajuForm.appendChild(langInput);}sajuForm.addEventListener('submit',()=>{langInput.value=currentUiLang();});}

const fortuneNav=document.querySelector('.main-fortune-nav');
const fortuneLinks=fortuneNav?[...fortuneNav.querySelectorAll('a[href^="#"]')]:[];
const fortuneServices=document.querySelector('.fortune-services');
const serviceCards=fortuneServices?[...fortuneServices.querySelectorAll('.fortune-service-card')]:[];
function navHeaderHeight(){const header=document.querySelector('.fortune-header')||document.querySelector('.site-header');return Math.ceil(header?.getBoundingClientRect().height||0);}
function setActiveFortune(hash){fortuneLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===hash));}
function setFocusedCard(hash){serviceCards.forEach(card=>card.classList.toggle('focused',`#${card.id}`===hash));}
function scrollElementBelowHeader(target,gap=14){if(!target)return;const y=target.getBoundingClientRect().top+window.pageYOffset-navHeaderHeight()-gap;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
function goToFortune(hash,updateHash=true){setActiveFortune(hash);if(hash==='#analysis'){setFocusedCard('');const target=document.querySelector('#analysis .analysis-shell')||document.querySelector('#analysis');scrollElementBelowHeader(target,10);}else{setFocusedCard(hash);if(fortuneServices)scrollElementBelowHeader(fortuneServices,8);}if(updateHash)history.replaceState(null,'',hash);}
fortuneLinks.forEach(link=>link.addEventListener('click',e=>{const hash=link.getAttribute('href');if(!hash)return;e.preventDefault();goToFortune(hash,true);}));
if(location.hash&&fortuneLinks.some(link=>link.getAttribute('href')===location.hash)){window.addEventListener('load',()=>setTimeout(()=>goToFortune(location.hash,false),60),{once:true});}
