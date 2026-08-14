(()=>{
  const tiers=[
    {key:'basic',price:5,label:'BASIC',limit:'100',tone:'#d9b46a',bg1:'#1b1208',bg2:'#4a2b0d',items:[
      ['fortune-cat','행운냥이','금(金)','행운 · 재물 · 번성'],['koi','비단잉어','수(水)','출세 · 합격 · 도약'],['sun-bird','아기 봉황','화(火)','기쁨 · 좋은 소식 · 활력'],['new-deer','새벽사슴','목(木)','새로운 시작 · 성장'],['gold-hamster','복다람','토(土)','모으기 · 지킴 · 풍요']]},
    {key:'personal',price:10,label:'PERSONAL WISH',limit:'100',tone:'#7ec8ff',bg1:'#06182e',bg2:'#123d69',items:[
      ['moon-rabbit','달토끼','금(金)','인연성취 · 행복'],['dolphin','소망돌고래','수(水)','기회 · 여행 · 자유'],['fire-fox','불여우','화(火)','열정 · 자신감 · 행운'],['leaf-turtle','잎새거북','목(木)','건강 · 안정 · 보호'],['star-owl','별부엉이','토(土)','학업 · 합격 · 목표달성']]},
    {key:'rare',price:50,label:'RARE EDITION',limit:'5',tone:'#b991ff',bg1:'#12091f',bg2:'#3b1760',items:[
      ['nine-fox','백호','금(金)','수호 · 승리 · 권위'],['sea-dragon','청룡','목(木)','성장 · 기회 · 도약'],['unicorn','주작','화(火)','열정 · 성공 · 명예'],['forest-turtle','현무','수(水)','안정 · 보호 · 장수'],['wing-owl','황금기린','토(土)','재물 · 번영 · 행운']]},
    {key:'legendary',price:100,label:'LEGENDARY 1/1',limit:'1',tone:'#ffd568',bg1:'#0b0702',bg2:'#4b2d04',items:[
      ['sky-dragon','백룡 천운개벽','금(金)','성공 · 권위 · 개운'],['fire-phoenix','주작 불사조','화(火)','열정 · 재물 · 승진'],['moon-tiger','청호 월광호','수(水)','감각 · 수호 · 극복'],['qilin','녹기린 천록','목(木)','성장 · 건강 · 번영'],['black-turtle','현무 장수거북','토(土)','안정 · 장수 · 보호']]}
  ];
  const motifs={
    'fortune-cat':'🐯','koi':'🐟','sun-bird':'🦅','new-deer':'🦌','gold-hamster':'🐹',
    'moon-rabbit':'🐇','dolphin':'🐬','fire-fox':'🦊','leaf-turtle':'🐢','star-owl':'🦉',
    'nine-fox':'🐅','sea-dragon':'🐉','unicorn':'🦅','forest-turtle':'🐢','wing-owl':'🦌',
    'sky-dragon':'🐉','fire-phoenix':'🦅','moon-tiger':'🐅','qilin':'🦌','black-turtle':'🐢'
  };
  const esc=s=>String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  function fallbackSvg(tier,item,index){
    const [key,name,element,wish]=item;
    const c=tier.tone;
    const icon=motifs[key]||'✦';
    return `<svg viewBox="0 0 720 1080" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(name)} Lumen Guardian">
      <defs><linearGradient id="g${tier.key}${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${tier.bg1}"/><stop offset="1" stop-color="${tier.bg2}"/></linearGradient></defs>
      <rect width="720" height="1080" rx="42" fill="url(#g${tier.key}${index})"/>
      <rect x="18" y="18" width="684" height="1044" rx="34" fill="none" stroke="${c}" stroke-width="6"/>
      <rect x="34" y="34" width="652" height="1012" rx="26" fill="none" stroke="${c}" stroke-opacity=".45" stroke-width="2"/>
      <circle cx="360" cy="480" r="230" fill="${c}" opacity=".08"/>
      <text x="360" y="550" text-anchor="middle" font-size="230">${icon}</text>
      <g fill="${c}" text-anchor="middle"><text x="360" y="105" font-family="Georgia,serif" font-size="44" font-weight="700">LUMEN GUARDIAN</text><text x="360" y="146" font-family="Arial,sans-serif" font-size="18" letter-spacing="5">${esc(tier.label)}</text><text x="360" y="760" font-size="34" font-weight="800">${esc(name)}</text><text x="360" y="814" font-size="25">오행 · ${esc(element)}</text><text x="360" y="858" font-size="23">${esc(wish)}</text><text x="360" y="970" font-family="Georgia,serif" font-size="22">${tier.price===100?'1 / 1 · UNIQUE ISSUE':`SERIES ${String(index+1).padStart(2,'0')} · ${tier.limit} LIMITED`}</text></g>
    </svg>`;
  }
  function art(tier,item,index){
    const [key,name]=item;
    const manifest=window.LUMEN_GUARDIAN_ARCHIVE_HD;
    const file=manifest&&manifest.items&&manifest.items[key];
    if(!file) return fallbackSvg(tier,item,index);
    const src=(manifest.basePath||'')+file;
    const fallback=encodeURIComponent(fallbackSvg(tier,item,index));
    return `<img class="gc2-hd-img" src="${esc(src)}?v=${esc(manifest.version||'1')}" alt="${esc(name)} Lumen Guardian HD" loading="lazy" decoding="async" onerror="this.onerror=null;this.outerHTML=decodeURIComponent('${fallback}')">`;
  }
  function card(tier,item,index){
    const [key,name,element,wish]=item;
    const tierParam=tier.key==='personal'?'custom':tier.key;
    const wishType=['wealth','career','exam','health','love'][index%5];
    const hd=window.LUMEN_GUARDIAN_ARCHIVE_HD?.items?.[key];
    return `<article class="gc2-card gc2-${tier.key}" data-guardian-key="${key}" data-hd="${hd?'ready':'fallback'}"><div class="gc2-art">${art(tier,item,index)}</div><div class="gc2-info"><div class="gc2-meta"><span class="gc2-price">$${tier.price}</span><span class="gc2-limit">${tier.price===100?'1/1':`${tier.limit}개 한정`}</span>${hd?'<span class="gc2-hd">HD</span>':''}</div><h3>${esc(name)}</h3><p><strong>${esc(element)}</strong> · ${esc(wish)}</p><a class="button secondary" href="/guardian-order/?tier=${tierParam}&wishType=${wishType}">이 Guardian 선택</a></div></article>`;
  }
  function render(){
    const target=document.querySelector('#purpose-guardians .archive-grid');
    if(!target) return;
    target.className='gc2-collection';
    target.innerHTML=tiers.map(t=>`<section class="gc2-tier"><div class="gc2-tier-head"><span class="gc2-tier-price">$${t.price}</span><div><strong>${esc(t.label)}</strong><small>${t.price===100?'각 디자인 1개만 발행':`각 디자인 ${t.limit}개 한정 발행`}</small></div></div><div class="gc2-row">${t.items.map((it,i)=>card(t,it,i)).join('')}</div></section>`).join('');
    if(document.getElementById('gc2-hd-style'))return;
    const style=document.createElement('style');style.id='gc2-hd-style';style.textContent=`#purpose-guardians{justify-content:flex-start!important;padding-top:34px!important;padding-bottom:44px!important}.gc2-collection{width:100%;max-width:1500px;margin:0 auto;display:grid;gap:22px}.gc2-tier{border:1px solid #e4e7ee;border-radius:18px;background:#fff;padding:16px;box-shadow:0 12px 34px rgba(21,28,44,.07)}.gc2-tier-head{display:flex;align-items:center;gap:14px;margin:0 0 14px}.gc2-tier-price{font-family:Georgia,serif;font-size:2rem;font-weight:800;color:#ad7a16}.gc2-tier-head strong{display:block;font-size:1.05rem}.gc2-tier-head small{display:block;color:#687083;margin-top:3px}.gc2-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.gc2-card{min-width:0;border:1px solid #e0e4ec;border-radius:14px;overflow:hidden;background:#fff;display:flex;flex-direction:column}.gc2-art{aspect-ratio:2/3;background:#090b12;overflow:hidden}.gc2-art svg,.gc2-hd-img{display:block;width:100%;height:100%;object-fit:cover}.gc2-info{padding:12px;display:flex;flex-direction:column;gap:6px;flex:1}.gc2-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.gc2-info h3{margin:2px 0;font-size:.96rem}.gc2-info p{margin:0;color:#535c6f;font-size:.78rem;line-height:1.45;min-height:2.3em}.gc2-price{font-weight:900;color:#9b6e19}.gc2-limit{font-size:.7rem;color:#7a8291}.gc2-hd{font-size:.64rem;font-weight:800;color:#fff;background:#4f46e5;border-radius:999px;padding:2px 6px}.gc2-info .button{margin-top:auto;min-height:34px;font-size:.76rem;padding:0 9px}.gc2-rare{position:relative}.gc2-rare:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:14px;padding:2px;background:linear-gradient(120deg,#b991ff,#f1d6ff,#7f5bd8,#b991ff);background-size:300% 300%;animation:gc2RareBorder 5s linear infinite;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}.gc2-legendary .gc2-art{animation:gc2LegendaryGlow 4.6s ease-in-out infinite alternate}@keyframes gc2RareBorder{to{background-position:300% 0}}@keyframes gc2LegendaryGlow{from{filter:brightness(1)}to{filter:brightness(1.12) saturate(1.12)}}@media(max-width:1180px){.gc2-row{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.gc2-row{grid-template-columns:repeat(2,minmax(0,1fr))}.gc2-tier{padding:12px}.gc2-tier-price{font-size:1.65rem}}@media(max-width:480px){.gc2-row{grid-template-columns:1fr 1fr;gap:9px}.gc2-info{padding:9px}.gc2-info h3{font-size:.84rem}.gc2-info p{font-size:.7rem}.gc2-tier-head small{font-size:.72rem}}`;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
