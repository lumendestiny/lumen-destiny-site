(()=>{
  const get=id=>document.getElementById(id);
  function start(){
    const tier=get('guardianTier'),wish=get('guardianWishType');
    const card=document.querySelector('.guardian-card-preview'),frame=document.querySelector('.guardian-card-frame');
    const approved=window.__LUMEN_GUARDIAN_APPROVED_ASSETS__;
    if(!tier||!card||!frame||!approved)return;
    const labels={basic:'Guardian Basic · 승인 판매용 이미지 · 100개 한정',custom:'Personal Wish · 승인 판매용 이미지 · 100개 한정',rare:'Rare Edition · 승인 판매용 이미지 · 5개 한정 · 변화하는 테두리',legendary:'Legendary Motion · 승인 고해상도 황금 용 · 1/1 · 라이브 모션'};
    const fallback={basic:'/assets/guardian/sales/basic-illustrated-master.webp',custom:'/assets/guardian/sales/personal-illustrated-master.webp',rare:'/assets/guardian/sales/rare-illustrated-master.webp',legendary:'/assets/guardian/sales/legendary-illustrated-master.webp'};
    let guarding=false;
    function ensure(){
      let shell=frame.querySelector('.guardian-tier-art-shell');
      if(!shell){shell=document.createElement('div');shell.className='guardian-tier-art-shell';const img=document.createElement('img');img.className='guardian-tier-art';img.decoding='async';img.loading='eager';shell.append(img);frame.append(shell)}
      let value=card.parentElement?.querySelector('.guardian-tier-value');if(!value&&card.parentElement){value=document.createElement('div');value.className='guardian-tier-value';card.insertAdjacentElement('afterend',value)}
      if(!get('guardian-tier-art-style')){const s=document.createElement('style');s.id='guardian-tier-art-style';s.textContent=`
        .guardian-card-preview{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;height:auto!important;min-height:0!important;overflow:visible!important}
        .guardian-card-frame{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;min-height:0!important}
        .guardian-card-frame>:not(.guardian-tier-art-shell){display:none!important}
        .guardian-tier-art-shell{position:relative;width:100%;max-width:390px;margin:0 auto;border-radius:18px;isolation:isolate;overflow:hidden;min-height:420px;display:flex;align-items:center;justify-content:center}
        .guardian-tier-art{display:block;width:100%;height:auto;max-height:560px;object-fit:contain;object-position:center;border-radius:18px;filter:drop-shadow(0 12px 22px rgba(24,28,38,.18));image-rendering:auto;transform-origin:50% 48%}
        .guardian-tier-value{margin:8px 4px 0;text-align:center;color:#555d6a;font-size:.72rem;line-height:1.45;font-weight:750}
        .guardian-order-panel select,.guardian-order-shell select{height:52px!important;min-height:52px!important;line-height:52px!important;padding:0 44px 0 16px!important;overflow:visible!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:16px!important;font-weight:700!important;box-sizing:border-box!important;background-position:right 14px center!important}
        .guardian-order-panel article,.guardian-order-panel label,.deep-reading-grid article{overflow:visible!important;min-height:0!important}
        .guardian-order-panel input{height:48px!important;min-height:48px!important;line-height:1.35!important;box-sizing:border-box!important}
        .guardian-order-panel textarea{line-height:1.45!important;box-sizing:border-box!important;overflow:auto!important}
        .guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell{padding:5px;background:linear-gradient(115deg,#7c3aed,#d946ef,#22d3ee,#fbbf24,#7c3aed);background-size:320% 320%;animation:guardianRareBorder 4.6s linear infinite;box-shadow:0 12px 28px rgba(80,39,129,.2)}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell{box-shadow:0 0 0 2px rgba(219,174,65,.55),0 14px 34px rgba(173,116,9,.24)}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art{animation:guardianLegendaryImage 5.8s ease-in-out infinite}
        .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{content:"";position:absolute;inset:-35% -70%;pointer-events:none;background:linear-gradient(112deg,transparent 43%,rgba(255,244,190,.06) 47%,rgba(255,255,255,.55) 50%,rgba(255,220,108,.10) 54%,transparent 60%);animation:guardianLegendarySweep 5.2s ease-in-out infinite;z-index:2}
        @keyframes guardianRareBorder{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes guardianLegendaryImage{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-4px) scale(1.008)}55%{transform:translateY(2px) scale(1.004)}78%{transform:translateY(-2px) scale(1.006)}}
        @keyframes guardianLegendarySweep{0%,55%{transform:translateX(-42%) rotate(3deg);opacity:0}67%{opacity:1}88%,100%{transform:translateX(42%) rotate(3deg);opacity:0}}
        @media(min-width:901px) and (max-height:820px){.guardian-tier-art-shell{min-height:360px}.guardian-tier-art{max-height:430px}}
        @media(max-width:900px){.guardian-tier-art-shell{max-width:430px;min-height:0}.guardian-tier-art{max-height:580px}.guardian-order-panel select,.guardian-order-shell select{font-size:15px!important}}
        @media(prefers-reduced-motion:reduce){.guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell,.guardian-card-preview[data-tier="legendary"] .guardian-tier-art,.guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{animation:none!important}}
      `;document.head.append(s)}
      return shell;
    }
    function render(){
      const shell=ensure(),key=approved[tier.value]?tier.value:'basic',asset=approved[key],img=shell.querySelector('.guardian-tier-art');
      card.dataset.tier=key;card.dataset.assetPolicy=asset.kind;guarding=true;
      img.dataset.fallback='0';
      img.onerror=()=>{if(img.dataset.fallback==='1')return;img.dataset.fallback='1';img.src=fallback[key]+'?v=guardian-safe-fallback-20260814';};
      if(img.getAttribute('src')!==asset.src)img.setAttribute('src',asset.src);
      img.alt=(tier.options[tier.selectedIndex]?.textContent||'Guardian')+' 승인 판매용 카드 이미지';
      const value=card.parentElement?.querySelector('.guardian-tier-value');if(value)value.textContent=labels[key];
      guarding=false;
    }
    const img=ensure().querySelector('.guardian-tier-art');
    new MutationObserver(()=>{if(guarding)return;const key=approved[tier.value]?tier.value:'basic',asset=approved[key];if(img.dataset.fallback!=='1'&&img.getAttribute('src')!==asset.src)render()}).observe(img,{attributes:true,attributeFilter:['src']});
    tier.addEventListener('change',render);wish?.addEventListener('change',render);render();
  }
  document.querySelectorAll('script[data-guardian-approved-manifest]').forEach(x=>x.remove());
  const s=document.createElement('script');s.src='/guardian-asset-manifest.js?v=guardian-approved-sales-lock-20260814-2';s.dataset.guardianApprovedManifest='true';s.onload=start;s.onerror=()=>console.error('Failed to load Guardian approved asset manifest');document.head.appendChild(s);
})();