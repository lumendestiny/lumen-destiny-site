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
function isKoreanMobile(){
  if(!window.matchMedia('(max-width:760px)').matches)return false;
  const v=String(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  return !/^(en|ja|vi|zh|tl|fil)/.test(v);
}
function cleanTierCopy(){
  if(!isKoreanMobile())return;
  Object.entries(MOBILE_TIER_COPY).forEach(([key,[line1,line2]])=>{
    const head=document.querySelector(`.gc2-tier[data-tier="${key}"] .gc2-tier-head`);
    const small=head?.querySelector('small');
    if(!small)return;
    head.querySelectorAll('.guardian-mobile-feature-line').forEach(el=>el.remove());
    const desired=`<span class="gc2-tier-line guardian-mobile-tier-line">${line1}</span><span class="gc2-tier-line gc2-tier-feature guardian-mobile-tier-line">${line2}</span>`;
    if(small.innerHTML!==desired)small.innerHTML=desired;
  });
}
function revealAll(){
  document.body.classList.remove('guardian-tier-view-active');
  delete document.body.dataset.guardianTierView;
  document.querySelectorAll('.gc2-tier').forEach(tier=>{tier.hidden=false;});
  const intro=document.querySelector('.guardian-archive-intro-screen');
  if(intro)intro.hidden=false;
  cleanTierCopy();
}
function scrollToTier(key,behavior='smooth'){
  if(!TIER_KEYS.has(key))return;
  const target=document.querySelector(`.gc2-tier[data-tier="${key}"]`);
  if(!target)return;
  revealAll();
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
  cleanTierCopy();
  if(key)requestAnimationFrame(()=>scrollToTier(key,'auto'));
}
function settle(){
  [0,80,180,350,800,1400].forEach(ms=>setTimeout(()=>{settleHash();cleanTierCopy();},ms));
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
  requestAnimationFrame(()=>{queued=false;cleanTierCopy();});
});
const startObserver=()=>observer.observe(document.body,{childList:true,subtree:true,characterData:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startObserver,{once:true});else startObserver();
})();
