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
      position:absolute;left:10px;top:10px;z-index:5;
      width:42px;min-height:112px;padding:8px 4px;
      border:1.5px solid #b98217;border-radius:9px;
      background:linear-gradient(180deg,rgba(12,9,4,.98),rgba(42,25,4,.98));
      box-shadow:0 0 0 2px rgba(0,0,0,.38),inset 0 0 14px rgba(194,133,24,.10);
      color:#e5b84d;display:flex;flex-direction:column;align-items:center;gap:5px;
      pointer-events:none;
    }
    .guardian-card-local-plaque .guardian-card-local-element{
      width:27px;height:27px;flex:0 0 27px;border:1px solid #b98217;border-radius:50%;
      display:grid;place-items:center;font-weight:800;font-size:12px;line-height:1;
      background:rgba(0,0,0,.28);white-space:nowrap;overflow:hidden;
    }
    .guardian-card-local-plaque .guardian-card-local-name{
      writing-mode:vertical-rl;text-orientation:mixed;
      font-weight:800;font-size:12px;line-height:1.15;letter-spacing:.02em;
      max-height:82px;overflow:hidden;text-align:start;
    }
    html[lang^="en"] .guardian-card-local-plaque .guardian-card-local-name,
    html[lang^="vi"] .guardian-card-local-plaque .guardian-card-local-name,
    html[lang^="tl"] .guardian-card-local-plaque .guardian-card-local-name{
      font-size:10px;letter-spacing:0;
    }
    @media(max-width:640px){
      .guardian-card-local-plaque{left:7px;top:7px;width:36px;min-height:98px;padding:6px 3px}
      .guardian-card-local-plaque .guardian-card-local-element{width:23px;height:23px;flex-basis:23px;font-size:10px}
      .guardian-card-local-plaque .guardian-card-local-name{font-size:10px;max-height:70px}
      html[lang^="en"] .guardian-card-local-plaque .guardian-card-local-name,
      html[lang^="vi"] .guardian-card-local-plaque .guardian-card-local-name,
      html[lang^="tl"] .guardian-card-local-plaque .guardian-card-local-name{font-size:9px}
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
  let element=cleanElement(strong?.textContent||'');
  if(!art||!name||!element) return;

  if(currentLang()==='ko'&&strong&&strong.textContent.trim()!==element){
    strong.textContent=element;
  }

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
