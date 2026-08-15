(()=>{
'use strict';
const TIER_KEYS=new Set(['basic','personal','rare','legendary']);

function headerOffset(){
  const header=document.querySelector('.site-header');
  return (header?.getBoundingClientRect().height||86)+8;
}

function ensureStyle(){
  if(document.getElementById('guardian-stable-mobile-fix'))return;
  const style=document.createElement('style');
  style.id='guardian-stable-mobile-fix';
  style.textContent='@media(max-width:760px){.gc2-tier-head .guardian-mobile-feature-line{display:none!important}.gc2-tier[data-tier="rare"] .gc2-tier-head small>.gc2-tier-line,.gc2-tier[data-tier="legendary"] .gc2-tier-head small>.gc2-tier-line{display:block!important;white-space:nowrap!important;line-height:1.35!important}.gc2-tier[data-tier="rare"] .gc2-tier-head small>.gc2-tier-line+.gc2-tier-line,.gc2-tier[data-tier="legendary"] .gc2-tier-head small>.gc2-tier-line+.gc2-tier-line{margin-top:4px!important}}';
  document.head.appendChild(style);
}

function revealAll(){
  document.body.classList.remove('guardian-tier-view-active');
  delete document.body.dataset.guardianTierView;
  document.querySelectorAll('.gc2-tier').forEach(tier=>{tier.hidden=false;});
  const intro=document.querySelector('.guardian-archive-intro-screen');
  if(intro)intro.hidden=false;
}

function keyFromHash(){
  const m=location.hash.match(/^#tier-(basic|personal|rare|legendary)$/);
  return m?.[1]||'';
}

function scrollToTier(key,behavior='smooth'){
  if(!TIER_KEYS.has(key))return false;
  const target=document.querySelector(`.gc2-tier[data-tier="${key}"]`);
  if(!target)return false;
  revealAll();
  const top=window.scrollY+target.getBoundingClientRect().top-headerOffset();
  window.scrollTo({top:Math.max(0,top),behavior});
  target.classList.add('tier-focus');
  setTimeout(()=>target.classList.remove('tier-focus'),900);
  return true;
}

function settleHash(behavior='auto'){
  ensureStyle();
  revealAll();
  const key=keyFromHash();
  if(key)scrollToTier(key,behavior);
}

function delayedSettle(){
  [0,120,320,700,1400,2400].forEach(ms=>setTimeout(()=>settleHash('auto'),ms));
}

document.addEventListener('click',event=>{
  const link=event.target.closest('[data-tier-jump]');
  if(!link)return;
  const key=link.dataset.tierJump;
  if(!TIER_KEYS.has(key))return;
  event.preventDefault();
  event.stopImmediatePropagation();
  ensureStyle();
  revealAll();
  history.replaceState(null,'',`#tier-${key}`);
  requestAnimationFrame(()=>scrollToTier(key,'smooth'));
},true);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',delayedSettle,{once:true});
else delayedSettle();
window.addEventListener('load',delayedSettle,{once:true});
window.addEventListener('hashchange',()=>setTimeout(()=>settleHash('auto'),0));
window.addEventListener('resize',ensureStyle);
})();
