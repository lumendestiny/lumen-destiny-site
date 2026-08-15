(()=>{
'use strict';

function currentLang(){
  const raw=String(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  if(raw.startsWith('en'))return'en';
  if(raw.startsWith('ja'))return'ja';
  if(raw.startsWith('vi'))return'vi';
  if(raw.startsWith('tl')||raw.startsWith('fil'))return'tl';
  if(raw.startsWith('zh'))return'zh';
  return'ko';
}

function cleanKoreanElement(text){
  text=String(text||'').trim();
  const dot=text.indexOf('·');
  if(dot>=0) text=text.slice(0,dot).trim();
  return text.replace(/\s*\([^)]*\)\s*/g,'').replace(/\s+/g,' ').trim();
}

function syncCard(card){
  card.querySelectorAll('.guardian-card-local-plaque').forEach(el=>el.remove());
  if(currentLang()==='ko'){
    const strong=card.querySelector('.gc2-info p strong');
    if(strong){
      const clean=cleanKoreanElement(strong.textContent);
      if(clean&&strong.textContent.trim()!==clean) strong.textContent=clean;
    }
  }
}

function syncAll(){
  document.querySelectorAll('.gc2-card').forEach(syncCard);
}

function init(){
  syncAll();
  const root=document.querySelector('#purpose-guardians')||document.body;
  let queued=false;
  const queue=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;syncAll();});
  };
  new MutationObserver(queue).observe(root,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',queue);
  document.addEventListener('lumen:language-changed',queue);
  setTimeout(queue,100);
  setTimeout(queue,500);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
