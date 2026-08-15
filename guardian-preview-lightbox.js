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

function cleanElement(text){
  text=String(text||'').trim();
  const dot=text.indexOf('·');
  if(dot>=0) text=text.slice(0,dot).trim();
  if(getLang()==='ko') text=text.replace(/\s*\([^)]*\)\s*/g,'').trim();
  return text.replace(/\s+/g,' ');
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
    .guardian-preview-art-label{position:absolute;left:4.0%;top:5.7%;width:10.8%;height:40.6%;box-sizing:border-box;border:2px solid #d29a1f;border-radius:14px;background:linear-gradient(180deg,#140d04 0%,#2b1805 60%,#171005 100%);box-shadow:0 0 0 5px rgba(10,7,3,.96),inset 0 0 0 1px rgba(255,208,110,.12),inset 0 10px 20px rgba(255,190,70,.05),inset 0 -12px 18px rgba(0,0,0,.22);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:8px 4px 10px;color:#e5b84d;pointer-events:none;overflow:hidden}
    .guardian-preview-art-label::before{content:'';position:absolute;inset:4px;border-radius:12px;border:1px solid rgba(226,173,46,.42);box-shadow:inset 0 0 16px rgba(255,197,76,.06)}
    .guardian-preview-element{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:76%;aspect-ratio:1;border:1.5px solid #d9a63a;border-radius:50%;font-size:clamp(.62rem,1.15vw,1rem);font-weight:800;line-height:.92;text-align:center;padding:2px;background:radial-gradient(circle at 35% 35%,#4a2e09,#150d04 72%);white-space:normal;word-break:keep-all;box-sizing:border-box}
    .guardian-preview-name{position:relative;z-index:1;writing-mode:vertical-rl;text-orientation:mixed;line-height:1.08;font-size:clamp(.72rem,1.25vw,1.12rem);font-weight:800;letter-spacing:.04em;flex:1 1 auto;display:flex;align-items:flex-start;justify-content:flex-start;overflow:hidden;text-align:start;text-shadow:0 0 6px rgba(0,0,0,.35)}
    .guardian-preview-title{margin:0;color:#fff;font-weight:800;text-align:center;font-size:1rem;text-shadow:0 1px 4px rgba(0,0,0,.7)}
    .guardian-preview-close{position:absolute;right:-12px;top:-12px;z-index:2;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:#111827;color:#fff;font-size:30px;line-height:1;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.35)}
    body.guardian-preview-open{overflow:hidden}
    html[lang^="en"] .guardian-preview-element,
    html[lang^="vi"] .guardian-preview-element,
    html[lang^="tl"] .guardian-preview-element{font-size:clamp(.42rem,.8vw,.68rem);line-height:.9;padding:2px 1px}
    html[lang^="en"] .guardian-preview-name,
    html[lang^="vi"] .guardian-preview-name,
    html[lang^="tl"] .guardian-preview-name{font-size:clamp(.56rem,.95vw,.86rem);letter-spacing:0}
    @media(max-width:640px){.guardian-preview-modal{padding:14px}.guardian-preview-close{right:-4px;top:-8px}.guardian-preview-stage,.guardian-preview-canvas,.guardian-preview-large{max-height:78vh}.guardian-preview-art-label{left:4%;top:5.7%;width:11.2%;height:40.8%;padding:6px 3px 8px;border-radius:10px;box-shadow:0 0 0 4px rgba(10,7,3,.96),inset 0 0 0 1px rgba(255,208,110,.12)}.guardian-preview-art-label::before{inset:3px;border-radius:8px}.guardian-preview-element{font-size:.58rem}.guardian-preview-name{font-size:.68rem}html[lang^="en"] .guardian-preview-element,html[lang^="vi"] .guardian-preview-element,html[lang^="tl"] .guardian-preview-element{font-size:.38rem}html[lang^="en"] .guardian-preview-name,html[lang^="vi"] .guardian-preview-name,html[lang^="tl"] .guardian-preview-name{font-size:.52rem}}
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
  const rawElement=card?.querySelector('.gc2-info p strong')?.textContent?.trim()||'';
  return{name,element:cleanElement(rawElement)};
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
