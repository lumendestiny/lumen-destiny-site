(()=>{
'use strict';
const TITLE='가격대별 5종, 총 20종의 고해상도 판매용 Guardian';
function norm(v){v=String(v||'').toLowerCase();if(v.startsWith('zh'))return'zh';if(v.startsWith('ja'))return'ja';if(v.startsWith('vi'))return'vi';if(v.startsWith('tl')||v.startsWith('fil'))return'tl';if(v.startsWith('en'))return'en';return'ko';}
function lang(){return norm(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');}
let applying=false;
function apply(){
  if(applying||lang()!=='ko')return;
  const h=document.querySelector('.purpose-guardian-heading h2');
  if(!h)return;
  const text=h.textContent.replace(/\s+/g,' ').trim();
  if(text!==TITLE||h.querySelector('.mobile-title-break'))return;
  applying=true;
  h.innerHTML='가격대별 5종, 총 20종의 고해상도 <span class="mobile-title-break">판매용 Guardian</span>';
  applying=false;
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0),{once:true});
window.addEventListener('load',()=>setTimeout(apply,0),{once:true});
window.addEventListener('lumen-language-change',()=>setTimeout(apply,0));
document.addEventListener('click',e=>{if(e.target.closest('.lang-choice'))setTimeout(apply,20);});
const observer=new MutationObserver(()=>apply());
const start=()=>{const h=document.querySelector('.purpose-guardian-heading h2');if(h){observer.observe(h,{childList:true,subtree:true,characterData:true});apply();}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
