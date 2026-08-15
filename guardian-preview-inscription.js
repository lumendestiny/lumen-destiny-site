(()=>{
'use strict';

let sourceArt=null;
let resizeQueued=false;

function ensureStyle(){
  if(document.getElementById('guardian-preview-inscription-style'))return;
  const style=document.createElement('style');
  style.id='guardian-preview-inscription-style';
  style.textContent=`
    .guardian-preview-stage{position:relative!important}
    .guardian-preview-inscription-layer{position:absolute;z-index:3;pointer-events:none;container-type:inline-size}
    .guardian-preview-inscription-layer .guardian-card-inscription{display:block}
  `;
  document.head.appendChild(style);
}

function placeLayer(){
  resizeQueued=false;
  const modal=document.getElementById('guardianPreviewModal');
  if(!modal||modal.hidden||!sourceArt)return;
  const stage=modal.querySelector('.guardian-preview-stage');
  const large=modal.querySelector('.guardian-preview-large');
  const source=sourceArt.querySelector('.guardian-card-inscription');
  if(!stage||!large||!source)return;

  let layer=stage.querySelector('.guardian-preview-inscription-layer');
  if(!layer){
    layer=document.createElement('div');
    layer.className='guardian-preview-inscription-layer';
    stage.appendChild(layer);
  }
  layer.innerHTML='';
  layer.appendChild(source.cloneNode(true));

  const sr=stage.getBoundingClientRect();
  const ir=large.getBoundingClientRect();
  layer.style.left=`${Math.max(0,ir.left-sr.left)}px`;
  layer.style.top=`${Math.max(0,ir.top-sr.top)}px`;
  layer.style.width=`${ir.width}px`;
  layer.style.height=`${ir.height}px`;
}

function queuePlace(){
  if(resizeQueued)return;
  resizeQueued=true;
  requestAnimationFrame(()=>requestAnimationFrame(placeLayer));
}

function rememberFromEvent(target){
  const art=target?.closest?.('.gc2-art');
  if(!art)return false;
  sourceArt=art;
  ensureStyle();
  queuePlace();
  setTimeout(queuePlace,80);
  return true;
}

document.addEventListener('click',e=>{
  if(e.target.closest('.gc2-art .gc2-hd-img'))rememberFromEvent(e.target);
});

document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('.gc2-art'))rememberFromEvent(e.target);
  if(e.key==='Escape')sourceArt=null;
});

window.addEventListener('resize',queuePlace);
window.addEventListener('orientationchange',queuePlace);

const observer=new MutationObserver(()=>{
  const modal=document.getElementById('guardianPreviewModal');
  if(modal&&!modal.hidden)queuePlace();
});

function init(){
  ensureStyle();
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','src']});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
