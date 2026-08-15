(()=>{
'use strict';
const TITLE='가격대별 5종, 총 20종의 고해상도 판매용 Guardian';
const MOBILE_QUERY='(max-width:760px)';
const TIER_COPY={
  rare:['각 디자인 5개 한정 발행','변화하는 테두리'],
  legendary:['각 디자인 1개만 발행','메인 이미지 모션']
};
function norm(v){v=String(v||'').toLowerCase();if(v.startsWith('zh'))return'zh';if(v.startsWith('ja'))return'ja';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko';}
function lang(){return norm(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');}
function isMobile(){return window.matchMedia(MOBILE_QUERY).matches;}
let applying=false;
function applyHeading(){
  const h=document.querySelector('.purpose-guardian-heading h2');
  if(!h)return;
  const text=h.textContent.replace(/\s+/g,' ').trim();
  if(text!==TITLE||h.querySelector('.mobile-title-break'))return;
  h.innerHTML='가격대별 5종, 총 20종의 고해상도 <span class="mobile-title-break">판매용 Guardian</span>';
}
function applyTierCopy(){
  if(!isMobile())return;
  Object.entries(TIER_COPY).forEach(([key,[line1,line2]])=>{
    const small=document.querySelector(`.gc2-tier[data-tier="${key}"] .gc2-tier-head small`);
    if(!small)return;
    const first=small.querySelector('[data-mobile-tier-line="1"]')?.textContent.trim();
    const second=small.querySelector('[data-mobile-tier-line="2"]')?.textContent.trim();
    if(first===line1&&second===line2)return;
    small.innerHTML=`<span class="guardian-mobile-tier-line" data-mobile-tier-line="1">${line1}</span><span class="guardian-mobile-tier-line gc2-tier-feature" data-mobile-tier-line="2">${line2}</span>`;
  });
}
function ensureStyle(){
  if(document.getElementById('guardian-mobile-tier-break-style'))return;
  const style=document.createElement('style');
  style.id='guardian-mobile-tier-break-style';
  style.textContent='@media(max-width:760px){.gc2-tier-head small .guardian-mobile-tier-line{display:block!important;white-space:nowrap!important;line-height:1.35}.gc2-tier-head small .guardian-mobile-tier-line+.guardian-mobile-tier-line{margin-top:4px!important}}';
  document.head.appendChild(style);
}
function apply(){
  if(applying||lang()!=='ko')return;
  applying=true;
  try{ensureStyle();applyHeading();applyTierCopy();}finally{applying=false;}
}
function queue(delay=0){setTimeout(apply,delay);}
document.addEventListener('DOMContentLoaded',()=>queue(0),{once:true});
window.addEventListener('load',()=>queue(0),{once:true});
window.addEventListener('resize',()=>queue(0));
window.addEventListener('lumen-language-change',()=>queue(0));
document.addEventListener('click',e=>{if(e.target.closest('.lang-choice'))queue(30);});
const observer=new MutationObserver(()=>queue(0));
const start=()=>{
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  apply();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
