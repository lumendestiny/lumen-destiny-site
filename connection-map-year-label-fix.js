(()=>{
'use strict';
const normalize=v=>{v=String(v||'').toLowerCase();if(v.startsWith('ko'))return'ko';if(v.startsWith('zh'))return'zh';if(v.startsWith('ja'))return'ja';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko'};
const lang=normalize(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
if(lang!=='ko')return;
const fix=()=>{
  ['meYear','otherYear'].forEach(id=>{
    const select=document.getElementById(id);
    if(!select)return;
    [...select.options].forEach(option=>{
      const next=option.value?`${option.value}년`:'연도';
      if(option.textContent!==next)option.textContent=next;
    });
  });
};
const start=()=>{
  fix();
  const targets=['meYear','otherYear'].map(id=>document.getElementById(id)).filter(Boolean);
  if(!targets.length)return;
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;fix()});
  });
  targets.forEach(el=>observer.observe(el,{subtree:true,childList:true,characterData:true}));
  setTimeout(fix,120);
  setTimeout(fix,500);
  setTimeout(fix,1200);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
