(()=>{
'use strict';

const TEXT={ko:{title:'Guardian 미리보기',close:'닫기'},en:{title:'Guardian Preview',close:'Close'},ja:{title:'Guardian プレビュー',close:'閉じる'},tl:{title:'Guardian Preview',close:'Isara'},vi:{title:'Xem trước Guardian',close:'Đóng'},zh:{title:'Guardian 预览',close:'关闭'}};

function getLang(){
  const q=new URLSearchParams(location.search).get('lang');
  if(q&&TEXT[q])return q;
  const saved=(window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||'').toLowerCase();
  if(saved&&TEXT[saved])return saved;
  const h=(document.documentElement.lang||'ko').toLowerCase();
  if(h.startsWith('en'))return'en';
  if(h.startsWith('ja'))return'ja';
  if(h.startsWith('tl')||h.startsWith('fil'))return'tl';
  if(h.startsWith('vi'))return'vi';
  if(h.startsWith('zh'))return'zh';
  return'ko';
}

let lastFocus=null;

function ensureStyle(){
  if(document.getElementById('guardian-preview-lightbox-style'))return;
  const style=document.createElement('style');
  style.id='guardian-preview-lightbox-style';
  style.textContent=`
    .gc2-art{cursor:zoom-in;position:relative;outline:none}
    .gc2-art:after{content:'＋';position:absolute;right:10px;bottom:10px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(8,10,16,.72);color:#fff;font-size:20px;font-weight:700;opacity:0;transform:scale(.92);transition:.18s ease;pointer-events:none;border:1px solid rgba(255,255,255,.35)}
    .gc2-art:hover:after,.gc2-art:focus:after{opacity:1;transform:scale(1)}
    .guardian-preview-modal[hidden]{display:none!important}
    .guardian-preview-modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:24px}
    .guardian-preview-backdrop{position:absolute;inset:0;background:rgba(5,8,14,.88);backdrop-filter:blur(8px)}
    .guardian-preview-panel{position:relative;z-index:1;width:min(94vw,980px);max-height:94vh;display:flex;flex-direction:column;align-items:center;gap:10px}
    .guardian-preview-stage{width:100%;max-height:84vh;display:grid;place-items:center;overflow:hidden;border-radius:18px;background:#080b12;box-shadow:0 24px 80px rgba(0,0,0,.58);border:1px solid rgba(255,255,255,.16)}
    .guardian-preview-canvas{position:relative;display:inline-grid;place-items:center;max-width:100%;max-height:84vh}
    .guardian-preview-large{display:block;max-width:100%;max-height:84vh;width:auto;height:auto;object-fit:contain}
    .guardian-preview-art-label{position:absolute;left:3.3%;top:7.2%;width:9.2%;height:31%;box-sizing:border-box;border:2px solid #b88724;border-radius:10px;background:linear-gradient(180deg,rgba(16,12,7,.98),rgba(31,20,8,.98));box-shadow:0 0 0 2px rgba(0,0,0,.7),inset 0 0 18px rgba(218,164,54,.12);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:7px 3px;color:#e5b84d;pointer-events:none;overflow:hidden}
    .guardian-preview-element{display:grid;place-items:center;width:72%;aspect-ratio:1;border:1.5px solid #b88724;border-radius:50%;font-family:Georgia,'Times New Roman',serif;font-size:clamp(.72rem,1.6vw,1.4rem);font-weight:700;line-height:1;margin-bottom:5px;background:#171007}
    .guardian-preview-name{writing-mode:vertical-rl;text-orientation:mixed;line-height:1.12;font-size:clamp(.62rem,1.25vw,1.08rem);font-weight:800;letter-spacing:.06em;max-height:72%;overflow:hidden;text-align:center}
    .guardian-preview-title{margin:0;color:#fff;font-weight:800;text-align:center;font-size:1rem;text-shadow:0 1px 4px rgba(0,0,0,.7)}
    .guardian-preview-close{position:absolute;right:-12px;top:-12px;z-index:2;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:#111827;color:#fff;font-size:30px;line-height:1;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.35)}
    body.guardian-preview-open{overflow:hidden}
    @media(max-width:640px){.guardian-preview-modal{padding:14px}.guardian-preview-close{right:-4px;top:-8px}.guardian-preview-stage,.guardian-preview-canvas,.guardian-preview-large{max-height:78vh}.guardian-preview-art-label{left:3.2%;top:7%;width:10%;height:31%;padding:5px 2px;border-radius:7px}.guardian-preview-element{font-size:.72rem}.guardian-preview-name{font-size:.62rem}}
  `;
  document.head.appendChild(style);
}

function ensureModal(){
  let modal=document.getElementById('guardianPreviewModal');
  if(modal)return modal;
  const t=TEXT[getLang()];
  modal=document.createElement('div');
  modal.id='guardianPreviewModal';
  modal.className='guardian-preview-modal';
  modal.hidden=true;
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-label',t.title);
  modal.innerHTML=`<div class="guardian-preview-backdrop" data-preview-close></div><div class="guardian-preview-panel"><button type="button" class="guardian-preview-close" data-preview-close aria-label="${t.close}">×</button><div class="guardian-preview-stage"><div class="guardian-preview-canvas"><img class="guardian-preview-large" alt=""><div class="guardian-preview-art-label" aria-hidden="true"><span class="guardian-preview-element"></span><span class="guardian-preview-name"></span></div></div></div><p class="guardian-preview-title"></p></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target.closest('[data-preview-close]'))closePreview();});
  return modal;
}

function currentLocalizedData(img){
  const card=img.closest('.gc2-card');
  const name=card?.querySelector('.gc2-info h3')?.textContent?.trim()||img.alt?.replace(/\s+Lumen Guardian.*$/i,'').trim()||'';
  const element=card?.querySelector('.gc2-info p strong')?.textContent?.trim()||'';
  return{name,element};
}

function openPreview(img){
  ensureStyle();
  const modal=ensureModal();
  const large=modal.querySelector('.guardian-preview-large');
  const title=modal.querySelector('.guardian-preview-title');
  const labelName=modal.querySelector('.guardian-preview-name');
  const labelElement=modal.querySelector('.guardian-preview-element');
  const t=TEXT[getLang()];
  const localized=currentLocalizedData(img);
  lastFocus=document.activeElement;
  large.src=img.currentSrc||img.src;
  large.alt=localized.name?`${localized.name} Lumen Guardian HD`:(img.alt||'');
  title.textContent=large.alt;
  labelName.textContent=localized.name;
  labelElement.textContent=localized.element;
  modal.setAttribute('aria-label',t.title);
  const close=modal.querySelector('.guardian-preview-close');
  close?.setAttribute('aria-label',t.close);
  modal.hidden=false;
  document.body.classList.add('guardian-preview-open');
  close?.focus();
}

function closePreview(){
  const modal=document.getElementById('guardianPreviewModal');
  if(!modal)return;
  modal.hidden=true;
  modal.querySelector('.guardian-preview-large')?.removeAttribute('src');
  document.body.classList.remove('guardian-preview-open');
  if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
}

function makeFocusable(){
  document.querySelectorAll('.gc2-art').forEach(art=>{
    if(!art.hasAttribute('tabindex'))art.tabIndex=0;
    art.setAttribute('role','button');
    const img=art.querySelector('.gc2-hd-img');
    const card=art.closest('.gc2-card');
    const name=card?.querySelector('.gc2-info h3')?.textContent?.trim()||img?.alt||'';
    if(name)art.setAttribute('aria-label',`${name} ${TEXT[getLang()].title}`);
  });
}

document.addEventListener('click',e=>{
  const img=e.target.closest('.gc2-art .gc2-hd-img');
  if(!img)return;
  e.preventDefault();
  openPreview(img);
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closePreview();return;}
  const art=e.target.closest?.('.gc2-art');
  if(!art||(e.key!=='Enter'&&e.key!==' '))return;
  const img=art.querySelector('.gc2-hd-img');
  if(!img)return;
  e.preventDefault();
  openPreview(img);
});

function init(){
  ensureStyle();
  ensureModal();
  makeFocusable();
  const root=document.querySelector('#purpose-guardians')||document.body;
  new MutationObserver(makeFocusable).observe(root,{childList:true,subtree:true,characterData:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
