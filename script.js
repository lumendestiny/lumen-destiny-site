const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}
function fillSelect(id,start,end,suffix,pad=false,selected=null){const el=document.getElementById(id);if(!el)return;el.innerHTML='';for(let n=start;n<=end;n++){const v=pad?String(n).padStart(2,'0'):String(n);const o=document.createElement('option');o.value=v;o.textContent=`${v}${suffix}`;if(selected!==null&&Number(v)===Number(selected))o.selected=true;el.appendChild(o);}}
fillSelect('birthYear',1900,2050,'년',false,1980);fillSelect('birthMonth',1,12,'월',true,1);fillSelect('birthDay',1,31,'일',true,1);
const time=document.getElementById('birthTime');if(time){time.innerHTML='<option value="">모름 (태어난 시간)</option>';for(let h=0;h<24;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const o=document.createElement('option');o.value=v;o.textContent=v;time.appendChild(o);}}}

// Fortune navigation: deterministic click targeting + underline.
// Scroll-spy is intentionally omitted because several cards share one parent section
// and previously caused the last menu item to become active incorrectly.
const fortuneNav=document.querySelector('.main-fortune-nav');
const fortuneLinks=fortuneNav?[...fortuneNav.querySelectorAll('a[href^="#"]')]:[];
function navHeaderHeight(){const header=document.querySelector('.fortune-header')||document.querySelector('.site-header');return Math.ceil(header?.getBoundingClientRect().height||0);}
function setActiveFortune(hash){fortuneLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===hash));}
function goToFortune(hash,updateHash=true){const target=document.querySelector(hash);if(!target)return;setActiveFortune(hash);const gap=22;const y=target.getBoundingClientRect().top+window.pageYOffset-navHeaderHeight()-gap;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});if(updateHash)history.replaceState(null,'',hash);}
fortuneLinks.forEach(link=>link.addEventListener('click',e=>{const hash=link.getAttribute('href');if(!hash||!document.querySelector(hash))return;e.preventDefault();goToFortune(hash,true);}));
if(location.hash&&fortuneLinks.some(link=>link.getAttribute('href')===location.hash)){setActiveFortune(location.hash);window.addEventListener('load',()=>setTimeout(()=>goToFortune(location.hash,false),60),{once:true});}
