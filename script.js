const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const form=document.getElementById('sajuForm');
const calendarType=document.getElementById('calendarType');
const leapMonthLabel=document.getElementById('leapMonthLabel');
function syncLeapMonth(){if(!calendarType||!leapMonthLabel)return;leapMonthLabel.style.display=calendarType.value==='lunar'?'flex':'none';if(calendarType.value!=='lunar'){const c=document.getElementById('isLeapMonth');if(c)c.checked=false;}}
if(calendarType){calendarType.addEventListener('change',syncLeapMonth);syncLeapMonth();}
if(form){form.addEventListener('submit',function(e){e.preventDefault();const payload={name:(document.getElementById('userName').value.trim()||'당신'),birthDate:document.getElementById('birthDate').value,birthTime:document.getElementById('birthTime').value,calendarType:document.getElementById('calendarType').value,isLeapMonth:document.getElementById('isLeapMonth').checked,gender:document.getElementById('gender').value,longitude:Number(document.getElementById('longitude').value||127)};sessionStorage.setItem('lumenSajuInput',JSON.stringify(payload));location.href='result.html';});}