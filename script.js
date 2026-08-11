const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}

function normalizeLang(v){v=(v||'').toLowerCase();if(v.startsWith('ja'))return'ja';if(v.startsWith('ko'))return'ko';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko';}
function currentUiLang(){return normalizeLang(window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');}
function dateLabel(value,type,lang){if(lang==='ko')return value+({year:'년',month:'월',day:'일'})[type];if(lang==='ja')return value+({year:'年',month:'月',day:'日'})[type];if(lang==='vi')return type==='year'?`Năm ${value}`:type==='month'?`Tháng ${Number(value)}`:`Ngày ${Number(value)}`;return value;}
function fillSelect(id,start,end,type,pad=false,selected=null){const el=document.getElementById(id);if(!el)return;const prev=el.value;el.innerHTML='';const lang=currentUiLang();for(let n=start;n<=end;n++){const v=pad?String(n).padStart(2,'0'):String(n);const o=document.createElement('option');o.value=v;o.textContent=dateLabel(v,type,lang);if((prev&&v===prev)||(selected!==null&&Number(v)===Number(selected)))o.selected=true;el.appendChild(o);}}
function refreshBirthDateLabels(langOverride=null){const lang=normalizeLang(langOverride||currentUiLang());[['birthYear','year'],['birthMonth','month'],['birthDay','day']].forEach(([id,type])=>{const el=document.getElementById(id);if(!el)return;[...el.options].forEach(o=>o.textContent=dateLabel(o.value,type,lang));});}
fillSelect('birthYear',1900,2050,'year',false,1980);fillSelect('birthMonth',1,12,'month',true,1);fillSelect('birthDay',1,31,'day',true,1);
const time=document.getElementById('birthTime');if(time){const first=document.createElement('option');first.value='';first.textContent='모름 (태어난 시간)';time.innerHTML='';time.appendChild(first);for(let h=0;h<24;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const o=document.createElement('option');o.value=v;o.textContent=v;time.appendChild(o);}}}

document.addEventListener('click',e=>{const el=e.target.closest('.lang-choice');if(!el)return;const lang=normalizeLang(el.dataset.lang);window.__LUMEN_LANG__=lang;localStorage.setItem('lumen-lang',lang);setTimeout(()=>refreshBirthDateLabels(lang),0);});
window.addEventListener('lumen-language-change',e=>refreshBirthDateLabels(e.detail?.lang));
setTimeout(()=>refreshBirthDateLabels(),80);

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
