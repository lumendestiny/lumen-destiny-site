(()=>{
  const get=(id)=>document.getElementById(id);
  function start(){
    const tier=get('guardianTier'), wish=get('guardianWishType'), name=get('guardianName');
    const card=document.querySelector('.guardian-card-preview');
    const frame=document.querySelector('.guardian-card-frame');
    const approved=window.__LUMEN_GUARDIAN_APPROVED_ASSETS__;
    if(!tier||!card||!frame||!approved)return;

    const labels={
      basic:'Guardian Basic · 승인 판매용 마스터 · 100개 한정',
      custom:'Personal Wish · 승인 판매용 마스터 · 100개 한정',
      rare:'Rare Edition · 승인 판매용 마스터 · 5개 한정 · 변화하는 테두리',
      legendary:'Legendary Motion · 승인 HD 라이브 벡터 · 1/1 · 라이브 모션'
    };

    function ensure(){
      let shell=frame.querySelector('.guardian-tier-art-shell');
      if(!shell){
        shell=document.createElement('div');
        shell.className='guardian-tier-art-shell';
        const img=document.createElement('img');
        img.className='guardian-tier-art';
        img.alt='Guardian approved sale artwork preview';
        img.decoding='async';
        const vector=document.createElement('div');
        vector.className='guardian-tier-vector';
        shell.append(img,vector);
        frame.append(shell);
      }
      let value=card.parentElement?.querySelector('.guardian-tier-value');
      if(!value&&card.parentElement){
        value=document.createElement('div');
        value.className='guardian-tier-value';
        card.insertAdjacentElement('afterend',value);
      }
      if(!get('guardian-tier-art-style')){
        const s=document.createElement('style');
        s.id='guardian-tier-art-style';
        s.textContent=`
          .guardian-card-preview{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;height:auto!important;min-height:0!important;overflow:visible!important}
          .guardian-card-frame{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;min-height:0!important}
          .guardian-card-frame>:not(.guardian-tier-art-shell){display:none!important}
          .guardian-tier-art-shell{position:relative;width:100%;max-width:390px;margin:0 auto;border-radius:18px;isolation:isolate}
          .guardian-tier-art{width:100%;height:auto;max-height:560px;object-fit:contain;object-position:center;border-radius:18px;filter:drop-shadow(0 12px 22px rgba(24,28,38,.18))}
          .guardian-tier-vector{width:100%}
          .guardian-tier-vector svg{display:block;width:100%;height:auto;max-height:560px;border-radius:18px;filter:drop-shadow(0 12px 22px rgba(24,28,38,.18))}
          .guardian-tier-art[hidden],.guardian-tier-vector[hidden]{display:none!important}
          .guardian-tier-value{margin:8px 4px 0;text-align:center;color:#555d6a;font-size:.72rem;line-height:1.45;font-weight:750}
          .guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell{padding:5px;background:linear-gradient(115deg,#8b5cf6,#e879f9,#67e8f9,#f6d365,#8b5cf6);background-size:320% 320%;animation:guardianRareBorder 4.6s linear infinite;box-shadow:0 12px 28px rgba(80,39,129,.2)}
          .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell{overflow:hidden;box-shadow:0 0 0 2px rgba(219,174,65,.55),0 14px 34px rgba(173,116,9,.24)}
          .guardian-card-preview[data-tier="legendary"] .legendary-dragon-motion{transform-box:fill-box;transform-origin:center;animation:guardianLegendaryDragon 5.8s ease-in-out infinite}
          .guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{content:"";position:absolute;inset:-35% -70%;pointer-events:none;background:linear-gradient(112deg,transparent 43%,rgba(255,244,190,.06) 47%,rgba(255,255,255,.58) 50%,rgba(255,220,108,.12) 54%,transparent 60%);animation:guardianLegendarySweep 5.2s ease-in-out infinite;z-index:2}
          @keyframes guardianRareBorder{0%{background-position:0% 50%;filter:hue-rotate(0deg)}50%{background-position:100% 50%;filter:hue-rotate(55deg)}100%{background-position:0% 50%;filter:hue-rotate(0deg)}}
          @keyframes guardianLegendaryDragon{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-6px) scale(1.012)}55%{transform:translateY(3px) scale(1.006)}78%{transform:translateY(-3px) scale(1.01)}}
          @keyframes guardianLegendarySweep{0%,55%{transform:translateX(-42%) rotate(3deg);opacity:0}67%{opacity:1}88%,100%{transform:translateX(42%) rotate(3deg);opacity:0}}
          @media(min-width:901px) and (max-height:820px){.guardian-tier-art,.guardian-tier-vector svg{max-height:430px}}
          @media(max-width:900px){.guardian-tier-art-shell{max-width:430px}.guardian-tier-art,.guardian-tier-vector svg{max-height:580px}}
          @media(prefers-reduced-motion:reduce){.guardian-card-preview[data-tier="rare"] .guardian-tier-art-shell,.guardian-card-preview[data-tier="legendary"] .legendary-dragon-motion,.guardian-card-preview[data-tier="legendary"] .guardian-tier-art-shell:after{animation:none!important}}
        `;
        document.head.append(s);
      }
      return shell;
    }

    function loadLegendary(asset,cb){
      if(window.__LUMEN_LEGENDARY_HD_ART__?.legendary){cb();return;}
      let s=document.querySelector('script[data-legendary-hd-art]');
      if(s){s.addEventListener('load',cb,{once:true});return;}
      s=document.createElement('script');
      s.src=asset.rendererSrc;
      s.dataset.legendaryHdArt='true';
      s.onload=cb;
      s.onerror=()=>console.error('Failed to load approved Legendary HD vector');
      document.head.appendChild(s);
    }

    function render(){
      const shell=ensure();
      const key=approved[tier.value]?tier.value:'basic';
      const asset=approved[key];
      const img=shell.querySelector('.guardian-tier-art');
      const vector=shell.querySelector('.guardian-tier-vector');
      card.dataset.tier=key;
      card.dataset.assetPolicy=asset.kind;

      if(key==='legendary'&&asset.renderer==='legendaryHD'){
        img.hidden=true;
        img.style.display='none';
        img.removeAttribute('src');
        vector.hidden=false;
        vector.style.display='block';
        loadLegendary(asset,()=>{
          if(card.dataset.tier!=='legendary')return;
          vector.innerHTML=window.__LUMEN_LEGENDARY_HD_ART__.legendary();
        });
      }else{
        vector.hidden=true;
        vector.style.display='none';
        vector.replaceChildren();
        img.hidden=false;
        img.style.display='block';
        if(img.getAttribute('src')!==asset.src)img.setAttribute('src',asset.src);
        img.alt=(tier.options[tier.selectedIndex]?.textContent||'Guardian')+' 승인 판매용 카드 미리보기';
      }

      const value=card.parentElement?.querySelector('.guardian-tier-value');
      if(value)value.textContent=labels[key];
    }

    tier.addEventListener('change',render);
    wish?.addEventListener('change',render);
    name?.addEventListener('input',render);
    render();
  }

  if(window.__LUMEN_GUARDIAN_APPROVED_ASSETS__){start();return;}
  const existing=document.querySelector('script[data-guardian-approved-manifest]');
  if(existing){existing.addEventListener('load',start,{once:true});return;}
  const s=document.createElement('script');
  s.src='/guardian-asset-manifest.js?v=guardian-approved-20260814-2';
  s.dataset.guardianApprovedManifest='true';
  s.onload=start;
  s.onerror=()=>console.error('Failed to load Guardian approved asset manifest');
  document.head.appendChild(s);
})();