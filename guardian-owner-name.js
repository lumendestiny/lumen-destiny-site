(()=>{
'use strict';

const qs=new URLSearchParams(location.search);
const isGift=qs.get('gift')==='1';
const fromArchive=qs.get('fromArchive')==='1';

function cleanName(value){
  return String(value||'').trim().replace(/\s+/g,' ').slice(0,30);
}

function ownerName(){
  const recipient=cleanName(document.getElementById('guardianRecipient')?.value);
  const name=cleanName(document.getElementById('guardianName')?.value);
  const actual=isGift&&recipient?recipient:name;
  return actual?`${actual} 님의 Guardian`:'나만의 Guardian';
}

function ensureStyle(){
  if(document.getElementById('guardian-owner-name-style'))return;
  const style=document.createElement('style');
  style.id='guardian-owner-name-style';
  style.textContent=`
    .guardian-tier-art-shell{container-type:inline-size}
    .guardian-owner-name-overlay{position:absolute;z-index:5;left:15.5%;right:15.5%;bottom:10.7%;height:6.2%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 2.5%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;pointer-events:none;background:linear-gradient(90deg,rgba(4,4,4,.96),rgba(7,7,7,.98) 18%,rgba(7,7,7,.98) 82%,rgba(4,4,4,.96));color:#d9b94f;font-family:Georgia,'Times New Roman','Noto Serif KR','Noto Serif CJK KR',serif;font-size:clamp(10px,4.8cqw,17px);font-weight:600;letter-spacing:.015em;line-height:1;text-shadow:0 1px 2px #000,0 0 4px rgba(0,0,0,.9)}
    .guardian-owner-name-overlay[hidden]{display:none!important}
    @media(max-width:480px){.guardian-owner-name-overlay{left:15%;right:15%;bottom:10.6%;font-size:clamp(10px,4.7cqw,16px)}}
  `;
  document.head.appendChild(style);
}

function ensureOverlay(){
  const shell=document.querySelector('.guardian-tier-art-shell');
  if(!shell)return null;
  let overlay=shell.querySelector('.guardian-owner-name-overlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.className='guardian-owner-name-overlay';
    overlay.setAttribute('aria-hidden','true');
    shell.appendChild(overlay);
  }
  return overlay;
}

function sync(){
  ensureStyle();
  const tier=document.getElementById('guardianTier');
  const overlay=ensureOverlay();
  if(!tier||!overlay)return;
  const show=tier.value==='legendary'&&!fromArchive;
  overlay.hidden=!show;
  if(show)overlay.textContent=ownerName();
}

function bind(){
  ['guardianName','guardianRecipient'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el||el.dataset.ownerNameBound==='1')return;
    el.dataset.ownerNameBound='1';
    el.addEventListener('input',sync);
    el.addEventListener('change',sync);
  });
  const tier=document.getElementById('guardianTier');
  if(tier&&tier.dataset.ownerNameBound!=='1'){
    tier.dataset.ownerNameBound='1';
    tier.addEventListener('change',()=>setTimeout(sync,0));
  }
}

function init(){
  ensureStyle();
  bind();
  sync();
  const root=document.querySelector('.guardian-order-shell')||document.body;
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;bind();sync();});
  }).observe(root,{childList:true,subtree:true});
  setTimeout(sync,120);
  setTimeout(sync,500);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
