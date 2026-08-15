(()=>{
'use strict';

const BIRTH_TIME_LABEL={
  ko:'태어난 시간',
  en:'Birth time',
  ja:'出生時間',
  tl:'Oras ng kapanganakan',
  vi:'Giờ sinh',
  zh:'出生时间'
};

function normalizeLang(value){
  const v=String(value||'').toLowerCase();
  if(v.startsWith('zh'))return 'zh';
  if(v.startsWith('ja'))return 'ja';
  if(v.startsWith('ko'))return 'ko';
  if(v.startsWith('vi'))return 'vi';
  if(v.startsWith('tl')||v.startsWith('fil'))return 'tl';
  if(v.startsWith('en'))return 'en';
  return 'ko';
}

function currentLang(explicit){
  const queryLang=new URLSearchParams(location.search).get('lang');
  return normalizeLang(explicit||window.__LUMEN_LANG__||queryLang||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
}

function localizeBirthTimeOption(select,lang){
  if(!select)return;
  let option=[...select.options].find(o=>o.value==='');
  if(!option){
    option=document.createElement('option');
    option.value='';
    select.insertBefore(option,select.firstChild||null);
  }
  option.textContent=BIRTH_TIME_LABEL[lang]||BIRTH_TIME_LABEL.ko;
}

function apply(explicit){
  const lang=currentLang(explicit);
  localizeBirthTimeOption(document.getElementById('birthTime'),lang);
  localizeBirthTimeOption(document.getElementById('aTime'),lang);
  localizeBirthTimeOption(document.getElementById('bTime'),lang);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());
else apply();

window.addEventListener('load',()=>setTimeout(()=>apply(),0),{once:true});
window.addEventListener('lumen-language-change',event=>setTimeout(()=>apply(event.detail?.lang),0));
document.addEventListener('click',event=>{
  const choice=event.target.closest?.('.lang-choice');
  if(!choice)return;
  setTimeout(()=>apply(choice.dataset.lang),0);
});

setTimeout(()=>apply(),120);
setTimeout(()=>apply(),400);
})();
