const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}
function fillSelect(id,start,end,suffix,pad=false,selected=null){const el=document.getElementById(id);if(!el)return;el.innerHTML='';for(let n=start;n<=end;n++){const v=pad?String(n).padStart(2,'0'):String(n);const o=document.createElement('option');o.value=v;o.textContent=`${v}${suffix}`;if(selected!==null&&Number(v)===Number(selected))o.selected=true;el.appendChild(o);}}
fillSelect('birthYear',1900,2050,'년',false,1980);fillSelect('birthMonth',1,12,'월',true,1);fillSelect('birthDay',1,31,'일',true,1);
const time=document.getElementById('birthTime');if(time){time.innerHTML='<option value="">모름 (태어난 시간)</option>';for(let h=0;h<24;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const o=document.createElement('option');o.value=v;o.textContent=v;time.appendChild(o);}}}

const fortuneNav=document.querySelector('.main-fortune-nav');
const fortuneLinks=fortuneNav?[...fortuneNav.querySelectorAll('a[href^="#"]')]:[];
const fortuneServices=document.querySelector('.fortune-services');
const serviceCards=fortuneServices?[...fortuneServices.querySelectorAll('.fortune-service-card')]:[];
function navHeaderHeight(){const header=document.querySelector('.fortune-header')||document.querySelector('.site-header');return Math.ceil(header?.getBoundingClientRect().height||0);}
function setActiveFortune(hash){fortuneLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===hash));}
function clearFocusedService(){if(!fortuneServices)return;fortuneServices.classList.remove('focus-mode');serviceCards.forEach(card=>card.classList.remove('focused'));}
function focusService(hash){if(!fortuneServices)return false;const card=document.querySelector(hash);if(!card||!card.classList.contains('fortune-service-card'))return false;fortuneServices.classList.add('focus-mode');serviceCards.forEach(item=>item.classList.toggle('focused',item===card));return true;}
function scrollElementBelowHeader(target,gap=14){if(!target)return;const y=target.getBoundingClientRect().top+window.pageYOffset-navHeaderHeight()-gap;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
function goToFortune(hash,updateHash=true){setActiveFortune(hash);if(hash==='#analysis'){clearFocusedService();const target=document.querySelector('#analysis .analysis-shell')||document.querySelector('#analysis');scrollElementBelowHeader(target,10);}else if(focusService(hash)){scrollElementBelowHeader(fortuneServices,8);}if(updateHash)history.replaceState(null,'',hash);}
fortuneLinks.forEach(link=>link.addEventListener('click',e=>{const hash=link.getAttribute('href');if(!hash)return;e.preventDefault();goToFortune(hash,true);}));
if(location.hash&&fortuneLinks.some(link=>link.getAttribute('href')===location.hash)){window.addEventListener('load',()=>setTimeout(()=>goToFortune(location.hash,false),60),{once:true});}
