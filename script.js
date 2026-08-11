const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}
function fillSelect(id,start,end,suffix,pad=false,selected=null){const el=document.getElementById(id);if(!el)return;el.innerHTML='';for(let n=start;n<=end;n++){const v=pad?String(n).padStart(2,'0'):String(n);const o=document.createElement('option');o.value=v;o.textContent=`${v}${suffix}`;if(selected!==null&&Number(v)===Number(selected))o.selected=true;el.appendChild(o);}}
fillSelect('birthYear',1900,2050,'년',false,1980);fillSelect('birthMonth',1,12,'월',true,1);fillSelect('birthDay',1,31,'일',true,1);
const time=document.getElementById('birthTime');if(time){time.innerHTML='<option value="">모름 (태어난 시간)</option>';for(let h=0;h<24;h++){for(const m of [0,30]){const v=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;const o=document.createElement('option');o.value=v;o.textContent=v;time.appendChild(o);}}}

// Fortune navigation: keep the selected section fully visible below the sticky header
const fortuneNav=document.querySelector('.main-fortune-nav');
const fortuneLinks=fortuneNav?[...fortuneNav.querySelectorAll('a[href^="#"]')]:[];
const fortuneTargets=fortuneLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
function headerOffset(){const header=document.querySelector('.fortune-header')||document.querySelector('.site-header');return (header?.getBoundingClientRect().height||0)+14;}
function setActiveFortune(id){fortuneLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${id}`));}
function scrollToFortune(target,pushHash=true){if(!target)return;const top=target.getBoundingClientRect().top+window.scrollY-headerOffset();window.scrollTo({top:Math.max(0,top),behavior:'smooth'});setActiveFortune(target.id);if(pushHash)history.replaceState(null,'',`#${target.id}`);}
fortuneLinks.forEach(link=>link.addEventListener('click',e=>{const target=document.querySelector(link.getAttribute('href'));if(!target)return;e.preventDefault();scrollToFortune(target,true);}));
if(fortuneTargets.length){let ticking=false;const updateActive=()=>{ticking=false;const marker=window.scrollY+headerOffset()+36;let current=fortuneTargets[0];for(const target of fortuneTargets){if(target.offsetTop<=marker)current=target;}setActiveFortune(current.id);};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateActive);ticking=true;}},{passive:true});window.addEventListener('resize',updateActive);updateActive();if(location.hash){const initial=document.querySelector(location.hash);if(initial&&fortuneTargets.includes(initial))setTimeout(()=>scrollToFortune(initial,false),80);}}
