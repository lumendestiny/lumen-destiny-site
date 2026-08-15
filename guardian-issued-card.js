(()=>{
'use strict';

const fallback={
  basic:'/assets/guardian/sales/guardian-basic-5-hd.webp',
  custom:'/assets/guardian/sales/guardian-wish-10-hd.webp',
  rare:'/assets/guardian/sales/guardian-rare-50-hd.webp',
  legendary:'/assets/guardian/sales/guardian-legendary-100-hd.webp'
};

const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const cleanName=s=>String(s||'').trim().replace(/\s+/g,' ').slice(0,40);

function ensureStyle(){
  if(document.getElementById('guardian-issued-card-style'))return;
  const style=document.createElement('style');
  style.id='guardian-issued-card-style';
  style.textContent=`
    #guardianIssuedCard{margin-top:8px}
    .guardian-issued-card-grid{display:grid;grid-template-columns:minmax(220px,330px) minmax(0,1fr);gap:18px;align-items:center}
    .guardian-issued-art-shell{position:relative;container-type:inline-size;width:100%;max-width:330px;margin:0 auto;overflow:hidden;border-radius:16px;background:#090b12;box-shadow:0 12px 30px rgba(20,24,34,.16)}
    .guardian-issued-art{display:block;width:100%;height:auto;border-radius:16px}
    .guardian-issued-owner-overlay{position:absolute;z-index:3;left:15.5%;right:15.5%;bottom:10.7%;height:6.2%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 2.5%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;background:linear-gradient(90deg,rgba(4,4,4,.96),rgba(7,7,7,.98) 18%,rgba(7,7,7,.98) 82%,rgba(4,4,4,.96));color:#d9b94f;font-family:Georgia,'Times New Roman','Noto Serif KR','Noto Serif CJK KR',serif;font-size:clamp(10px,4.8cqw,18px);font-weight:600;letter-spacing:.015em;line-height:1;text-shadow:0 1px 2px #000,0 0 4px rgba(0,0,0,.9)}
    .guardian-issued-card-copy h3{margin:.1rem 0 .45rem;font-size:1.15rem}.guardian-issued-card-copy p{margin:.25rem 0;color:#626a78;line-height:1.5}
    @media(max-width:700px){.guardian-issued-card-grid{grid-template-columns:1fr}.guardian-issued-art-shell{max-width:390px}.guardian-issued-card-copy{text-align:center}}
  `;
  document.head.appendChild(style);
}

function artSource(g){
  const archive=window.LUMEN_GUARDIAN_ARCHIVE_HD;
  const key=String(g?.guardianDesignKey||'');
  if(key&&archive?.items?.[key]){
    const src=(archive.basePath||'')+archive.items[key];
    const v=archive.version||'1';
    return{src:src+(src.includes('?')?'&':'?')+'v='+encodeURIComponent(v),archive:true};
  }
  const approved=window.__LUMEN_GUARDIAN_APPROVED_ASSETS__;
  const tier=String(g?.tier||'basic');
  return{src:approved?.[tier]?.src||fallback[tier]||fallback.basic,archive:false};
}

async function renderIssued(id){
  if(!id||!window.LumenAPI?.verifyGuardian)return;
  let res;
  try{res=await window.LumenAPI.verifyGuardian(id)}catch{return}
  const g=res?.guardian;
  if(!res?.ok||g?.issuanceStatus!=='issued'||g?.paymentStatus!=='paid')return;

  ensureStyle();
  document.getElementById('guardianIssuedCard')?.remove();
  const host=document.getElementById('verifyResult');
  if(!host)return;

  const art=artSource(g);
  const name=cleanName(g.displayName)||'나만의';
  const ownerLabel=`${name} 님의 Guardian`;
  const serial=g.serial?`# ${g.serial} / ${g.editionLimit||'—'}`:`# — / ${g.editionLimit||'—'}`;
  const showOwnerOverlay=!art.archive&&String(g.tier)==='legendary';

  const section=document.createElement('section');
  section.id='guardianIssuedCard';
  section.className='result-panel';
  section.innerHTML=`<div class="panel-heading"><div><p class="section-label">ISSUED GUARDIAN</p><h2>실제 발급 Guardian</h2></div><span class="engine-badge">${esc(serial)}</span></div><div class="guardian-issued-card-grid"><div class="guardian-issued-art-shell"><img class="guardian-issued-art" src="${esc(art.src)}" alt="${esc(ownerLabel)}">${showOwnerOverlay?`<div class="guardian-issued-owner-overlay" aria-hidden="true">${esc(ownerLabel)}</div>`:''}</div><div class="guardian-issued-card-copy"><h3>${esc(ownerLabel)}</h3><p>실제 발급 기록의 표시 이름을 사용합니다. 선물 Guardian은 받는 분 이름이 우선 적용됩니다.</p><p><strong>${esc(serial)}</strong> · ${esc(g.tier||'Guardian')}</p></div></div>`;
  host.insertAdjacentElement('afterend',section);
}

window.addEventListener('lumen-guardian-verified',e=>{
  const id=String(e.detail?.id||'').trim().toUpperCase();
  if(id)setTimeout(()=>renderIssued(id),0);
});

function init(){
  ensureStyle();
  const id=(new URLSearchParams(location.search).get('id')||'').trim().toUpperCase();
  if(id){setTimeout(()=>renderIssued(id),220);setTimeout(()=>renderIssued(id),900)}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
