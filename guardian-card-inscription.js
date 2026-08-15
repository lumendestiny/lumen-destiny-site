(()=>{
'use strict';

const INSCRIPTIONS={
  'fortune-cat':{count:'01',limit:'100',phrase:'金 · 幸運 · 財物 · 繁盛'},
  'koi':{count:'02',limit:'100',phrase:'水 · 出世 · 合格 · 飛躍'},
  'sun-bird':{count:'03',limit:'100',phrase:'火 · 喜悅 · 好消息 · 活力'},
  'new-deer':{count:'04',limit:'100',phrase:'木 · 新出發 · 成長'},
  'gold-hamster':{count:'05',limit:'100',phrase:'土 · 貯蓄 · 守護 · 豐饒'},

  'moon-rabbit':{count:'01',limit:'100',phrase:'金 · 姻緣成就 · 幸福'},
  'dolphin':{count:'02',limit:'100',phrase:'水 · 機會 · 旅行 · 自由'},
  'fire-fox':{count:'03',limit:'100',phrase:'火 · 熱情 · 自信 · 幸運'},
  'leaf-turtle':{count:'04',limit:'100',phrase:'木 · 健康 · 安定 · 保護'},
  'star-owl':{count:'05',limit:'100',phrase:'土 · 學業 · 合格 · 目標達成'},

  'nine-fox':{count:'01',limit:'05',phrase:'金 · 守護 · 勝利 · 權威'},
  'sea-dragon':{count:'02',limit:'05',phrase:'木 · 成長 · 機會 · 飛躍'},
  'unicorn':{count:'03',limit:'05',phrase:'火 · 熱情 · 成功 · 名譽'},
  'forest-turtle':{count:'04',limit:'05',phrase:'水 · 安定 · 保護 · 長壽'},
  'wing-owl':{count:'05',limit:'05',phrase:'土 · 財物 · 繁榮 · 幸運'},

  'sky-dragon':{count:'1',limit:'1',phrase:'金 · 成功 · 權威 · 開運'},
  'fire-phoenix':{count:'1',limit:'1',phrase:'火 · 熱情 · 財物 · 昇進'},
  'moon-tiger':{count:'1',limit:'1',phrase:'木 · 守護 · 克服 · 飛躍'},
  'qilin':{count:'1',limit:'1',phrase:'土 · 繁榮 · 成長 · 幸運'},
  'black-turtle':{count:'1',limit:'1',phrase:'水 · 安定 · 長壽 · 保護'}
};

function ensureStyle(){
  if(document.getElementById('guardian-card-inscription-style'))return;
  const style=document.createElement('style');
  style.id='guardian-card-inscription-style';
  style.textContent=`
    .gc2-art{position:relative;container-type:inline-size}
    .guardian-card-inscription{position:absolute;z-index:2;left:5.5%;right:5.5%;bottom:2.4%;pointer-events:none;color:#d8aa49;text-align:center;font-family:Georgia,'Times New Roman','Noto Serif CJK KR','Noto Serif KR',serif;text-shadow:0 1px 2px rgba(0,0,0,.95),0 0 6px rgba(0,0,0,.72)}
    .guardian-card-inscription-brand{margin:0;font-size:clamp(12px,8cqw,25px);line-height:1.05;font-weight:500;letter-spacing:.055em;white-space:nowrap}
    .guardian-card-inscription-meta{margin-top:1.5cqw;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:3.2cqw;font-size:clamp(7px,3.35cqw,11px);line-height:1.1;letter-spacing:.025em;white-space:nowrap}
    .guardian-card-inscription-count{text-align:left;font-variant-numeric:tabular-nums}
    .guardian-card-inscription-purpose{text-align:right;overflow:hidden;text-overflow:clip}
    .gc2-legendary .guardian-card-inscription{color:#e0bb62}
    @media(max-width:480px){.guardian-card-inscription{left:5%;right:5%;bottom:2.1%}.guardian-card-inscription-brand{letter-spacing:.04em}.guardian-card-inscription-meta{gap:2.2cqw}}
  `;
  document.head.appendChild(style);
}

function makeInscription(card){
  const key=card?.dataset?.guardianKey;
  const data=INSCRIPTIONS[key];
  const art=card?.querySelector('.gc2-art');
  if(!data||!art)return;
  let node=art.querySelector('.guardian-card-inscription');
  if(!node){
    node=document.createElement('div');
    node.className='guardian-card-inscription';
    node.setAttribute('aria-hidden','true');
    art.appendChild(node);
  }
  node.dataset.guardianKey=key;
  node.innerHTML=`<div class="guardian-card-inscription-brand">LUMEN DESTINY</div><div class="guardian-card-inscription-meta"><span class="guardian-card-inscription-count"># ${data.count} / ${data.limit}</span><span class="guardian-card-inscription-purpose">${data.phrase}</span></div>`;
}

function syncAll(){
  ensureStyle();
  document.querySelectorAll('.gc2-card[data-guardian-key]').forEach(makeInscription);
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
  new MutationObserver(queue).observe(root,{childList:true,subtree:true});
  setTimeout(queue,100);
  setTimeout(queue,500);
}

window.LUMEN_GUARDIAN_INSCRIPTIONS=INSCRIPTIONS;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
