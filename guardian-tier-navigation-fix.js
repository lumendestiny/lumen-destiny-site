(()=>{
'use strict';
const TIER_KEYS=new Set(['basic','personal','rare','legendary']);
function headerOffset(){
  const header=document.querySelector('.site-header');
  return (header?.getBoundingClientRect().height||86)+8;
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
  if(key)requestAnimationFrame(()=>scrollToTier(key,'auto'));
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    [120,350,800,1400].forEach(ms=>setTimeout(settleHash,ms));
  },{once:true});
}else{
  [0,120,350,800].forEach(ms=>setTimeout(settleHash,ms));
}
window.addEventListener('hashchange',()=>setTimeout(settleHash,0));
})();
