(()=>{
'use strict';
const TIER_KEYS=new Set(['basic','personal','rare','legendary']);
const MOBILE_TIER_COPY={
  rare:['각 디자인 5개 한정 발행','변화하는 테두리'],
  legendary:['각 디자인 1개만 발행','메인 이미지 모션']
};
function headerOffset(){
  const header=document.querySelector('.site-header');
  return (header?.getBoundingClientRect().height||86)+8;
}
function currentLang(){
  const v=String(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  if(v.startsWith('zh'))return'zh';
  if(v.startsWith('ja'))return'ja';
  if(v.startsWith('vi'))return'vi';
  if(v.startsWith('tl')||v.startsWith('fil'))return'tl';
  if(v.startsWith('en'))return'en';
  return'ko';
}
function isKoreanMobile(){
  return window.matchMedia('(max-width:760px)').matches&&currentLang()==='ko';
}
function desiredMarkup(line1,line2){
  return `<span class="gc2-tier-line guardian-final-tier-line">${line1}</span><span class="gc2-tier-line gc2-tier-feature guardian-final-tier-line">${line2}</span>`;
}
function cleanTierCopy(){
  if(!isKoreanMobile())return;
  Object.entries(MOBILE_TIER_COPY).forEach(([key,[line1,line2]])=>{
    const head=document.querySelector(`.gc2-tier[data-tier="${key}"] .gc2-tier-head`);
    if(!head)return;
    const info=[...head.children].find(el=>el.tagName==='DIV');
    if(!info)return;
    const smalls=[...info.querySelectorAll(':scope > small')];
    let small=smalls[0];
    if(!small){
      small=document.createElement('small');
      info.appendChild(small);
    }
    smalls.slice(1).forEach(el=>el.remove());

    /* Older scripts sometimes leave a feature line outside <small>. Remove it. */
    [...info.childNodes].forEach(node=>{
      if(node===small)return;
      if(node.nodeType===1&&node.tagName==='STRONG')return;
      const text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(text&&(text.includes(line1)||text.includes(line2)))node.remove();
    });
    head.querySelectorAll('.guardian-mobile-feature-line').forEach(el=>{
      if(!small.contains(el))el.remove();
    });

    const wanted=desiredMarkup(line1,line2);
    if(small.innerHTML!==wanted)small.innerHTML=wanted;
  });
}
function ensureStyle(){
  if(document.getElementById('guardian-final-tier-copy-style'))return;
  const style=document.createElement('style');
  style.id='guardian-final-tier-copy-style';
  style.textContent='@media(max-width:760px){.gc2-tier[data-tier="rare"] .gc2-tier-head small,.gc2-tier[data-tier="legendary"] .gc2-tier-head small{display:block!important}.gc2-tier-head small>.guardian-final-tier-line{display:block!important;white-space:nowrap!important;line-height:1.35!important}.gc2-tier-head small>.guardian-final-tier-line+.guardian-final-tier-line{margin-top:4px!important}.gc2-tier-head .guardian-mobile-feature-line{display:none!important}}';
  document.head.appendChild(style);
}
function revealAll(){
  document.body.classList.remove('guardian-tier-view-active');
  delete document.body.dataset.guardianTierView;
  document.querySelectorAll('.gc2-tier').forEach(tier=>{tier.hidden=false;});
  const intro=document.querySelector('.guardian-archive-intro-screen');
  if(intro)intro.hidden=false;
}
function scrollToTier(key,behavior='smooth'){
  if(!TIER_KEYS.has(key))return;
  const target=document.querySelector(`.gc2-tier[data-tier="${key}"]`);
  if(!target)return;
  revealAll();
  ensureStyle();
  cleanTierCopy();
  const top=window.scrollY+target.getBoundingClientRect().top-headerOffset();
  window.scrollTo({top:Math.max(0,top),behavior});
  target.classList.add('tier-focus');
  setTimeout(()=>target.classList.remove('tier-focus'),900);
}
function keyFromHash(){
  const m=location.hash.match(/^#tier-(basic|personal|rare|legendary)$/);
  return m?.[1]||'';
}
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-tier-jump]');
  if(!link)return;
  const key=link.dataset.tierJump;
  if(!TIER_KEYS.has(key))return;
  event.preventDefault();
  event.stopPropagation();
  revealAll();
  history.replaceState(null,'',`#tier-${key}`);
  requestAnimationFrame(()=>scrollToTier(key,'smooth'));
},true);
function settleHash(){
  const key=keyFromHash();
  revealAll();
  ensureStyle();
  cleanTierCopy();
  if(key)requestAnimationFrame(()=>scrollToTier(key,'auto'));
}
function settle(){
  [0,50,120,250,500,900,1500,2500].forEach(ms=>setTimeout(()=>{ensureStyle();cleanTierCopy();if(ms===250)settleHash();},ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
window.addEventListener('load',settle,{once:true});
window.addEventListener('hashchange',()=>setTimeout(settleHash,0));
window.addEventListener('resize',()=>setTimeout(cleanTierCopy,40));
window.addEventListener('lumen-language-change',settle);
let queued=false;
const observer=new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;ensureStyle();cleanTierCopy();});
});
const startObserver=()=>observer.observe(document.body,{childList:true,subtree:true,characterData:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startObserver,{once:true});else startObserver();
})();
