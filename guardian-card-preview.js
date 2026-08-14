(()=>{
  const tier=document.getElementById('guardianTier');
  const wish=document.getElementById('guardianWishType');
  const name=document.getElementById('guardianName');
  const card=document.querySelector('.guardian-card-preview');
  const frame=document.querySelector('.guardian-card-frame');
  if(!tier||!card||!frame)return;

  const art={
    basic:'/assets/guardian/basic-master.svg',
    custom:'/assets/guardian/personal-master.svg',
    rare:'/assets/guardian/rare-master.svg',
    legendary:'/assets/guardian/legendary-master.svg'
  };
  const valueMap={
    basic:'기본 Guardian · 고해상도 벡터 원본 · 100개 한정',
    custom:'Personal Wish · 고해상도 벡터 원본 · 100개 한정',
    rare:'Rare Edition · 고해상도 벡터 원본 · 5개 한정 · 변화하는 테두리',
    legendary:'Legendary Motion · 고해상도 벡터 원본 · 1/1 · 메인 이미지 모션'
  };

  function ensure(){
    let shell=frame.querySelector('.guardian-tier-art-shell');
    if(!shell){
      shell=document.createElement('div');
      shell.className='guardian-tier-art-shell';
      const img=document.createElement('img');
      img.className='guardian-tier-art';
      img.alt='Guardian tier card preview';
      shell.append(img);
      frame.append(shell);
    }
    let value=card.parentElement?.querySelector('.guardian-tier-value');
    if(!value&&card.parentElement){
      value=document.createElement('div');
      value.className='guardian-tier-value';
      card.insertAdjacentElement('afterend',value);
    }
    if(!document.getElementById('guardian-tier-art-style')){
      const s=document.createElement('style');
      s.id='guardian-tier-art-style';
      s.textContent=`
        .guardian-card-preview{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;height:auto!important;min-height:0!important;overflow:visible!important}
        .guardian-card-frame{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;min-height:0!important}
        .guardian-card-frame>:not(.guardian-tier-art-shell){display:none!important}
        .guardian-tier-art-shell{position:relative;width:100%;max-width:390px;margin:0 auto;border-radius:18px;isolation:isolate}
        .guardian-tier-art{display:block;width:100%;height:auto;max-height:560px;object-fit:contain;object-position:center;border-radius:18px;filter:drop-shadow(0 12px 22px rgba(24,28,38,.18));transform-origin:50% 48%}
        .guardian-tier-value{margin:8px 4px 0;text-align:center;color:#555d6a;font-size:.72rem;line-height:1.45;font-weight:750}
        .guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell{padding:5px;background:linear-gradient(115deg,#8b5cf6,#e879f9,#67e8f9,#f6d365,#8b5cf6);background-size:320% 320%;animation:guardianRareBorder 4.6s linear infinite;box-shadow:0 12px 28px rgba(80,39,129,.2)}
        .guardian-card-preview[data-tier="rare"] .guardian-tier-art{border-radius:14px}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell{overflow:hidden;box-shadow:0 0 0 2px rgba(219,174,65,.55),0 14px 34px rgba(173,116,9,.24)}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art{animation:guardianLegendaryFloat 5.8s ease-in-out infinite}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{content:"";position:absolute;inset:-35% -70%;pointer-events:none;background:linear-gradient(112deg,transparent 43%,rgba(255,244,190,.06) 47%,rgba(255,255,255,.58) 50%,rgba(255,220,108,.12) 54%,transparent 60%);animation:guardianLegendarySweep 5.2s ease-in-out infinite;z-index:2}
        @keyframes guardianRareBorder{0%{background-position:0% 50%;filter:hue-rotate(0deg)}50%{background-position:100% 50%;filter:hue-rotate(55deg)}100%{background-position:0% 50%;filter:hue-rotate(0deg)}}
        @keyframes guardianLegendaryFloat{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-7px) scale(1.012)}55%{transform:translateY(3px) scale(1.006)}78%{transform:translateY(-3px) scale(1.01)}}
        @keyframes guardianLegendarySweep{0%,55%{transform:translateX(-42%) rotate(3deg);opacity:0}67%{opacity:1}88%,100%{transform:translateX(42%) rotate(3deg);opacity:0}}
        @media(min-width:901px) and (max-height:820px){.guardian-tier-art{max-height:430px}}
        @media(max-width:900px){.guardian-tier-art-shell{max-width:430px}.guardian-tier-art{max-height:580px}}
        @media(prefers-reduced-motion:reduce){.guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell,.guardian-card-preview[data-tier="legendary"] .guardian-tier-art,.guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{animation:none!important}}
      `;
      document.head.append(s);
    }
  }

  function render(){
    ensure();
    const key=tier.value in art?tier.value:'basic';
    card.dataset.tier=key;
    const img=frame.querySelector('.guardian-tier-art');
    img.src=art[key]+'?v=20260814-vector-preview-1';
    img.alt=(tier.options[tier.selectedIndex]?.textContent||'Guardian')+' 고해상도 벡터 카드 미리보기';
    const value=card.parentElement?.querySelector('.guardian-tier-value');
    if(value)value.textContent=valueMap[key];
  }

  tier.addEventListener('change',render);
  wish?.addEventListener('change',render);
  name?.addEventListener('input',render);
  render();
})();