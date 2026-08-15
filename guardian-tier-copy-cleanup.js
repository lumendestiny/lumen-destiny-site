(()=>{
'use strict';
const MOBILE='(max-width:760px)';
const COPY={
  rare:['각 디자인 5개 한정 발행','변화하는 테두리'],
  legendary:['각 디자인 1개만 발행','메인 이미지 모션']
};
function isKo(){
  const v=String(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  return !/^(en|ja|vi|zh|tl|fil)/.test(v);
}
function fix(){
  if(!window.matchMedia(MOBILE).matches||!isKo())return;
  Object.entries(COPY).forEach(([key,[line1,line2]])=>{
    const head=document.querySelector(`.gc2-tier[data-tier="${key}"] .gc2-tier-head`);
    if(!head)return;
    const small=head.querySelector('small');
    if(!small)return;
    head.querySelectorAll('.guardian-mobile-feature-line').forEach(el=>el.remove());
    small.innerHTML=`<span class="gc2-tier-line guardian-mobile-tier-line">${line1}</span><span class="gc2-tier-line gc2-tier-feature guardian-mobile-tier-line">${line2}</span>`;
  });
}
let queued=false;
function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;fix();});
}
const settle=()=>[0,80,220,500,900,1500].forEach(ms=>setTimeout(fix,ms));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
window.addEventListener('resize',queue);
window.addEventListener('lumen-language-change',settle);
const observer=new MutationObserver(queue);
const start=()=>observer.observe(document.body,{childList:true,subtree:true,characterData:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
