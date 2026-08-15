(()=>{
'use strict';

function currentLang(){
  const raw=String(window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  if(raw.startsWith('en'))return'en';
  if(raw.startsWith('ja'))return'ja';
  if(raw.startsWith('vi'))return'vi';
  if(raw.startsWith('tl')||raw.startsWith('fil'))return'tl';
  if(raw.startsWith('zh'))return'zh';
  return'ko';
}

function ensureStyle(){
  if(document.getElementById('guardian-card-plaque-locale-style')) return;
  const style=document.createElement('style');
  style.id='guardian-card-plaque-locale-style';
  style.textContent=`
    .gc2-art{position:relative}
    .guardian-card-local-plaque{
      position:absolute;left:5.6%;top:5.7%;z-index:6;
      width:14.5%;height:43.5%;
      min-width:42px;max-width:62px;min-height:112px;
      border-radius:12px;
      border:1.5px solid #d29a1f;
      background:linear-gradient(180deg,#140d04 0%,#2b1805 60%,#171005 100%);
      box-shadow:0 0 0 4px rgba(10,7,3,.96),inset 0 0 0 1px rgba(255,208,110,.12),inset 0 10px 20px rgba(255,190,70,.06),inset 0 -12px 18px rgba(0,0,0,.22);
      display:flex;flex-direction:column;align-items:center;
      padding:7px 4px 8px;gap:6px;pointer-events:none;overflow:hidden;
    }
    .guardian-card-local-plaque::before{
      content:'';position:absolute;inset:4px;border-radius:10px;
      border:1px solid rgba(226,173,46,.42);
      box-shadow:inset 0 0 16px rgba(255,197,76,.06);
      pointer-events:none;
    }
    .guardian-card-local-element{
      position:relative;z-index:1;width:30px;height:30px;min-width:30px;border-radius:50%;
      border:1.35px solid #d9a63a;background:radial-gradient(circle at 35% 35%,#4a2e09,#150d04 72%);
      color:#f0c14f;display:flex;align-items:center;justify-content:center;text-align:center;
      font-weight:800;font-size:11px;line-height:.95;padding:2px;letter-spacing:0;box-sizing:border-box;
      box-shadow:0 1px 0 rgba(255,210,120,.12),inset 0 0 10px rgba(255,193,70,.08);
      white-space:normal;word-break:keep-all;
    }
    .guardian-card-local-name{
      position:relative;z-index:1;flex:1 1 auto;writing-mode:vertical-rl;text-orientation:mixed;
      color:#efbf49;font-weight:800;font-size:11px;line-height:1.08;letter-spacing:.02em;
      display:flex;align-items:flex-start;justify-content:flex-start;overflow:hidden;text-align:start;
      text-shadow:0 0 6px rgba(0,0,0,.35);
    }
    html[lang^="en"] .guardian-card-local-element,
    html[lang^="vi"] .guardian-card-local-element,
    html[lang^="tl"] .guardian-card-local-element{font-size:7px;line-height:.9;padding:2px 1px}
    html[lang^="en"] .guardian-card-local-name,
    html[lang^="vi"] .guardian-card-local-name,
    html[lang^="tl"] .guardian-card-local-name{font-size:9px;letter-spacing:0}
    @media(max-width:640px){
      .guardian-card-local-plaque{left:5.4%;top:5.5%;width:14.8%;height:43.8%;min-width:38px;max-width:54px;min-height:98px;padding:6px 3px 7px;gap:5px;border-radius:10px;box-shadow:0 0 0 3px rgba(10,7,3,.96),inset 0 0 0 1px rgba(255,208,110,.12)}
      .guardian-card-local-plaque::before{inset:3px;border-radius:8px}
      .guardian-card-local-element{width:26px;height:26px;min-width:26px;font-size:10px}
      .guardian-card-local-name{font-size:10px}
      html[lang^="en"] .guardian-card-local-element,
      html[lang^="vi"] .guardian-card-local-element,
      html[lang^="tl"] .guardian-card-local-element{font-size:6.5px}
      html[lang^="en"] .guardian-card-local-name,
      html[lang^="vi"] .guardian-card-local-name,
      html[lang^="tl"] .guardian-card-local-name{font-size:8px}
    }
  `;
  document.head.appendChild(style);
}

function cleanElement(text){
  text=String(text||'').trim();
  const dot=text.indexOf('·');
  if(dot>=0) text=text.slice(0,dot).trim();
  if(currentLang()==='ko') text=text.replace(/\s*\([^)]*\)\s*/g,'').trim();
  return text.replace(/\s+/g,' ');
}

function syncCard(card){
  const art=card.querySelector('.gc2-art');
  const name=(card.querySelector('.gc2-info h3')?.textContent||'').trim();
  const strong=card.querySelector('.gc2-info p strong');
  const element=cleanElement(strong?.textContent||'');
  if(!art||!name||!element) return;

  if(currentLang()==='ko'&&strong&&strong.textContent.trim()!==element) strong.textContent=element;

  let plaque=art.querySelector('.guardian-card-local-plaque');
  if(!plaque){
    plaque=document.createElement('div');
    plaque.className='guardian-card-local-plaque';
    plaque.setAttribute('aria-hidden','true');
    plaque.innerHTML='<span class="guardian-card-local-element"></span><span class="guardian-card-local-name"></span>';
    art.appendChild(plaque);
  }
  plaque.querySelector('.guardian-card-local-element').textContent=element;
  plaque.querySelector('.guardian-card-local-name').textContent=name;
}

function syncAll(){
  ensureStyle();
  document.querySelectorAll('.gc2-card').forEach(syncCard);
}

function init(){
  syncAll();
  const root=document.querySelector('#purpose-guardians')||document.body;
  let queued=false;
  const queue=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;syncAll();});
  };
  new MutationObserver(queue).observe(root,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',queue);
  document.addEventListener('lumen:language-changed',queue);
  setTimeout(queue,100);
  setTimeout(queue,500);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
