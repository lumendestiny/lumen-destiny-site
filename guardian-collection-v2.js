(()=>{
  const tiers=[
    {key:'basic',price:5,label:'BASIC',limit:'100',tone:'#d9b46a',bg1:'#1b1208',bg2:'#4a2b0d',items:[
      ['fortune-cat','행운냥이','금(金)','행운 · 재물 · 번성'],['koi','비단잉어','수(水)','출세 · 합격 · 도약'],['sun-bird','아기 봉황','화(火)','기쁨 · 좋은 소식 · 활력'],['new-deer','새벽사슴','목(木)','새로운 시작 · 성장'],['gold-hamster','복다람','토(土)','모으기 · 지킴 · 풍요']]},
    {key:'personal',price:10,label:'PERSONAL WISH',limit:'100',tone:'#7ec8ff',bg1:'#06182e',bg2:'#123d69',items:[
      ['moon-rabbit','월토끼','금(金)','인연성취 · 행복'],['dolphin','청돌고래','수(水)','기회 · 여행 · 자유'],['fire-fox','불여우','화(火)','열정 · 자신감 · 행운'],['leaf-turtle','숲거북','목(木)','건강 · 안정 · 보호'],['star-owl','별부엉이','토(土)','학업 · 합격 · 목표달성']]},
    {key:'rare',price:50,label:'RARE EDITION',limit:'5',tone:'#b991ff',bg1:'#12091f',bg2:'#3b1760',items:[
      ['nine-fox','백호 구미호','금(金)','인연 · 지혜 · 매력'],['sea-dragon','청룡 해신룡','수(水)','재물 · 기회 · 흐름'],['unicorn','천마 유니콘','화(火)','도약 · 성공 · 명예'],['forest-turtle','청거북 산수갑','목(木)','장수 · 가족 · 평안'],['wing-owl','백운부엉이','토(土)','합격 · 지혜 · 통찰']]},
    {key:'legendary',price:100,label:'LEGENDARY 1/1',limit:'1',tone:'#ffd568',bg1:'#0b0702',bg2:'#4b2d04',items:[
      ['sky-dragon','백룡 천운개벽','금(金)','성공 · 권위 · 개운'],['fire-phoenix','주작 불사조','화(火)','열정 · 재물 · 승진'],['moon-tiger','청호 월광호','수(水)','감각 · 수호 · 극복'],['qilin','녹기린 천록','목(木)','성장 · 건강 · 번영'],['black-turtle','현무 장수거북','토(土)','안정 · 장수 · 보호']]}
  ];
  const motifs={
    'fortune-cat':'<path d="M-150 80Q-170-20-105-92L-70-152L-20-102Q0-110 20-102L70-152L105-92Q170-20 150 80Q118 170 0 178Q-118 170-150 80Z"/><path d="M-78 10q35-32 70 0M78 10q-35-32-70 0" fill="none"/><path d="M-34 72q34 34 68 0M0 70v42" fill="none"/>',
    'koi':'<path d="M-165 15Q-65-120 75-65Q145-40 172 20Q120 12 80 54Q10 132-105 72L-165 122L-142 48Z"/><circle cx="76" cy="-24" r="10" fill="#fff"/><path d="M-82 68Q-12 0 78-12M-68-10Q0 40 72 60" fill="none"/>',
    'sun-bird':'<path d="M0-170L35-74L138-124L84-26L174 0L78 36L118 138L25 80L0 178L-25 80L-118 138L-78 36L-174 0L-84-26L-138-124L-35-74Z"/><path d="M-48 30Q0-40 48 30Q18 96 0 120Q-18 96-48 30Z"/>',
    'new-deer':'<path d="M-64 120Q-100 35-44-30L-86-78M44-30L86-78M-44-30L-22-118M44-30L22-118M-22-118L-58-150M22-118L58-150" fill="none"/><path d="M-70 46Q0-38 70 46Q58 132 0 160Q-58 132-70 46Z"/>',
    'gold-hamster':'<ellipse rx="132" ry="148"/><circle cx="-90" cy="-102" r="50"/><circle cx="90" cy="-102" r="50"/><circle cx="-48" cy="-20" r="12" fill="#fff"/><circle cx="48" cy="-20" r="12" fill="#fff"/><path d="M-18 36Q0 12 18 36Q0 62-18 36Z"/>',
    'moon-rabbit':'<path d="M-64 140Q-112 52-58-20L-82-168Q-15-134-8-42Q8-42 18-42Q25-134 92-168L62-20Q115 52 68 140Q0 184-64 140Z"/>',
    'dolphin':'<path d="M-172 35Q-70-105 72-75Q142-62 168-6Q105-14 52 38Q-15 106-122 68L-168 112L-142 44Z"/><path d="M45-64Q70-116 118-124Q92-82 89-47"/>',
    'fire-fox':'<path d="M-112 126Q-144 35-86-32L-125-134L-42-96Q0-118 42-96L125-134L86-32Q144 35 112 126Q0 188-112 126Z"/><path d="M-72 46Q-34 10-4 44M72 46Q34 10 4 44" fill="none"/>',
    'leaf-turtle':'<ellipse rx="150" ry="108"/><path d="M-118-20Q0-138 118-20Q0 18-118-20ZM-72 20Q0 96 72 20Q0-2-72 20Z"/><circle cx="158" cy="0" r="42"/><path d="M-110 74l-52 48M110 74l52 48M-110-74l-52-48M110-74l52-48" fill="none"/>',
    'star-owl':'<path d="M-130 112Q-150 5-92-82L-125-142L-58-108Q0-148 58-108L125-142L92-82Q150 5 130 112Q0 188-130 112Z"/><circle cx="-50" cy="-12" r="42"/><circle cx="50" cy="-12" r="42"/><path d="M0 8L-22 45L22 45Z"/>',
    'nine-fox':'<path d="M-74 126Q-120 46-65-30L-112-136L-28-96Q0-120 28-96L112-136L65-30Q120 46 74 126Q0 174-74 126Z"/><path d="M-110 110Q-180 60-148-20M-92 132Q-172 120-166 40M110 110Q180 60 148-20M92 132Q172 120 166 40" fill="none"/>',
    'sea-dragon':'<path d="M-164 62Q-112-52-20-45Q38-40 70-92Q104-150 150-112Q92-96 88-35Q84 34 20 42Q-42 48-66 110Q-94 166-148 130Q-92 112-82 70Z"/><path d="M-110-44L-76-88L-44-56M42-80L70-126L94-86" fill="none"/>',
    'unicorn':'<path d="M-122 128Q-144 30-82-42Q-46-86 10-82Q96-76 128-8Q152 44 120 126Q0 184-122 128Z"/><path d="M16-84L50-188L72-82"/><path d="M-74-54Q-120-118-146-88Q-112-60-92-28"/>',
    'forest-turtle':'<ellipse rx="150" ry="108"/><path d="M-126-8Q0-126 126-8M-96 46Q0-46 96 46M0-104V102" fill="none"/><circle cx="158" cy="0" r="42"/><path d="M-110 74l-52 48M110 74l52 48M-110-74l-52-48M110-74l52-48" fill="none"/>',
    'wing-owl':'<path d="M-96 122Q-126 30-72-64L-102-132L-38-98Q0-126 38-98L102-132L72-64Q126 30 96 122Q0 174-96 122Z"/><path d="M-96 18L-174-44L-132 62M96 18L174-44L132 62"/><circle cx="-38" cy="-12" r="34"/><circle cx="38" cy="-12" r="34"/>',
    'sky-dragon':'<path d="M-170 72Q-124-48-28-46Q42-44 76-104Q108-160 160-120Q98-96 94-26Q90 46 22 54Q-46 62-72 124Q-98 180-154 142Q-92 122-82 80Z"/><path d="M-120-56L-78-116L-38-68M50-92L88-150L118-94" fill="none"/>',
    'fire-phoenix':'<path d="M0-176L42-74L148-130L92-18L184 12L84 50L124 160L24 94L0 186L-24 94L-124 160L-84 50L-184 12L-92-18L-148-130L-42-74Z"/><circle r="38"/>',
    'moon-tiger':'<path d="M-138 114Q-164 18-104-70L-134-142L-60-112Q0-144 60-112L134-142L104-70Q164 18 138 114Q0 188-138 114Z"/><path d="M-84-42L-32-18M84-42L32-18M-92 36L-38 44M92 36L38 44M0-82V-26" fill="none"/>',
    'qilin':'<path d="M-112 132Q-150 40-90-34Q-50-82 8-82Q90-80 126-14Q148 38 116 132Q0 184-112 132Z"/><path d="M0-86L20-168L46-88M-70-48L-118-112M68-48L118-112" fill="none"/>',
    'black-turtle':'<ellipse rx="154" ry="112"/><path d="M-128-10Q0-132 128-10M-100 48Q0-46 100 48M0-108V104" fill="none"/><circle cx="162" cy="0" r="44"/><path d="M-110 76l-54 50M110 76l54 50M-110-76l-54-50M110-76l54-50" fill="none"/><path d="M86-96Q144-148 170-98Q126-80 108-46"/>'
  };
  const esc=s=>String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  function svg(tier,item,index){
    const [key,name,element,wish]=item;
    const c=tier.tone;
    return `<svg viewBox="0 0 720 1080" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(name)} Lumen Guardian">
      <defs><linearGradient id="g${tier.key}${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${tier.bg1}"/><stop offset="1" stop-color="${tier.bg2}"/></linearGradient><radialGradient id="r${tier.key}${index}"><stop stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><filter id="gl${tier.key}${index}"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect width="720" height="1080" rx="42" fill="url(#g${tier.key}${index})"/>
      <rect x="18" y="18" width="684" height="1044" rx="34" fill="none" stroke="${c}" stroke-width="6"/>
      <rect x="34" y="34" width="652" height="1012" rx="26" fill="none" stroke="${c}" stroke-opacity=".45" stroke-width="2"/>
      <circle cx="360" cy="480" r="255" fill="url(#r${tier.key}${index})"/>
      <g stroke="${c}" stroke-width="7" fill="${c}" fill-opacity=".08" stroke-linecap="round" stroke-linejoin="round" transform="translate(360 480)" filter="url(#gl${tier.key}${index})">${motifs[key]}</g>
      <g fill="${c}" text-anchor="middle"><text x="360" y="105" font-family="Georgia,serif" font-size="44" font-weight="700">LUMEN GUARDIAN</text><text x="360" y="146" font-family="Arial,sans-serif" font-size="18" letter-spacing="5">${esc(tier.label)}</text><text x="360" y="760" font-size="34" font-weight="800">${esc(name)}</text><text x="360" y="814" font-size="25">오행 · ${esc(element)}</text><text x="360" y="858" font-size="23">${esc(wish)}</text><text x="360" y="970" font-family="Georgia,serif" font-size="22">${tier.price===100?'1 / 1 · UNIQUE ISSUE':`SERIES ${String(index+1).padStart(2,'0')} · ${tier.limit} LIMITED`}</text></g>
      <g stroke="${c}" stroke-width="2" opacity=".6"><path d="M70 210h120M530 210h120M70 900h120M530 900h120"/></g>
    </svg>`;
  }
  function card(tier,item,index){
    const [key,name,element,wish]=item;
    const tierParam=tier.key==='personal'?'custom':tier.key;
    const wishType=['wealth','career','exam','health','love'][index%5];
    return `<article class="gc2-card gc2-${tier.key}"><div class="gc2-art">${svg(tier,item,index)}</div><div class="gc2-info"><span class="gc2-price">$${tier.price}</span><span class="gc2-limit">${tier.price===100?'1/1':`${tier.limit}개 한정`}</span><h3>${esc(name)}</h3><p><strong>${esc(element)}</strong> · ${esc(wish)}</p><a class="button secondary" href="/guardian-order/?tier=${tierParam}&wishType=${wishType}">이 Guardian 선택</a></div></article>`;
  }
  function render(){
    const target=document.querySelector('#purpose-guardians .archive-grid');
    if(!target) return;
    target.className='gc2-collection';
    target.innerHTML=tiers.map(t=>`<section class="gc2-tier"><div class="gc2-tier-head"><span class="gc2-tier-price">$${t.price}</span><div><strong>${esc(t.label)}</strong><small>${t.price===100?'각 디자인 1개만 발행':`각 디자인 ${t.limit}개 한정 발행`}</small></div></div><div class="gc2-row">${t.items.map((it,i)=>card(t,it,i)).join('')}</div></section>`).join('');
    const style=document.createElement('style');
    style.textContent=`
      #purpose-guardians{justify-content:flex-start!important;padding-top:34px!important;padding-bottom:44px!important}.gc2-collection{width:100%;max-width:1500px;margin:0 auto;display:grid;gap:22px}.gc2-tier{border:1px solid #e4e7ee;border-radius:18px;background:#fff;padding:16px;box-shadow:0 12px 34px rgba(21,28,44,.07)}.gc2-tier-head{display:flex;align-items:center;gap:14px;margin:0 0 14px}.gc2-tier-price{font-family:Georgia,serif;font-size:2rem;font-weight:800;color:#ad7a16}.gc2-tier-head strong{display:block;font-size:1.05rem}.gc2-tier-head small{display:block;color:#687083;margin-top:3px}.gc2-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.gc2-card{min-width:0;border:1px solid #e0e4ec;border-radius:14px;overflow:hidden;background:#fff;display:flex;flex-direction:column}.gc2-art{aspect-ratio:2/3;background:#090b12;overflow:hidden}.gc2-art svg{display:block;width:100%;height:100%}.gc2-info{padding:12px;display:flex;flex-direction:column;gap:6px;flex:1}.gc2-info h3{margin:2px 0;font-size:.96rem}.gc2-info p{margin:0;color:#535c6f;font-size:.78rem;line-height:1.45;min-height:2.3em}.gc2-price{font-weight:900;color:#9b6e19}.gc2-limit{font-size:.7rem;color:#7a8291}.gc2-info .button{margin-top:auto;min-height:34px;font-size:.76rem;padding:0 9px}.gc2-legendary{box-shadow:inset 0 0 0 1px rgba(214,169,54,.45),0 8px 22px rgba(180,131,25,.12)}
      @media(max-width:1180px){.gc2-row{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.gc2-row{grid-template-columns:repeat(2,minmax(0,1fr))}.gc2-tier{padding:12px}.gc2-tier-price{font-size:1.65rem}}@media(max-width:480px){.gc2-row{grid-template-columns:1fr 1fr;gap:9px}.gc2-info{padding:9px}.gc2-info h3{font-size:.84rem}.gc2-info p{font-size:.7rem}.gc2-tier-head small{font-size:.72rem}}
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();