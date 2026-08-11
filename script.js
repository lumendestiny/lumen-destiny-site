const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
const submitButton=document.getElementById('manseSubmit');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}
function goToManseResult(){
 const name=(document.getElementById('userName')?.value||'').trim();
 const birthDate=document.getElementById('birthDate')?.value||'';
 const birthTime=document.getElementById('birthTime')?.value||'';
 const cal=document.getElementById('calendarType')?.value||'solar';
 const gender=document.getElementById('gender')?.value||'other';
 const leap=document.getElementById('isLeapMonth')?.checked;
 if(!name){alert('이름 또는 별명을 입력해주세요.');document.getElementById('userName')?.focus();return;}
 if(!birthDate){alert('생년월일을 입력해주세요.');document.getElementById('birthDate')?.focus();return;}
 const params=new URLSearchParams({name,birthDate,calendarType:cal,gender});
 if(birthTime)params.set('birthTime',birthTime);
 if(cal==='lunar'&&leap)params.set('isLeapMonth','1');
 window.location.assign('/result.html?'+params.toString());
}
if(submitButton)submitButton.addEventListener('click',goToManseResult);
const form=document.getElementById('sajuForm');if(form)form.addEventListener('submit',function(e){e.preventDefault();goToManseResult();});
