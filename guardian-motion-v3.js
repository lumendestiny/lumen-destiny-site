(()=>{
  function enhance(){
    const rareCards=[...document.querySelectorAll('.gc2-rare')];
    const legendaryCards=[...document.querySelectorAll('.gc2-legendary')];
    if(!rareCards.length && !legendaryCards.length) return false;

    rareCards.forEach((card,i)=>{
      card.dataset.motion='rare-border';
      const art=card.querySelector('.gc2-art');
      if(art) art.style.setProperty('--rare-delay',`${i*-0.55}s`);
    });

    legendaryCards.forEach((card,i)=>{
      card.dataset.motion='legendary-live';
      const svg=card.querySelector('.gc2-art svg');
      if(!svg) return;
      const motif=svg.querySelector('g[transform]');
      if(motif && !motif.querySelector('animateTransform')){
        const anim=document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
        anim.setAttribute('attributeName','transform');
        anim.setAttribute('type','translate');
        anim.setAttribute('values','360 480;360 462;368 474;360 492;352 476;360 480');
        anim.setAttribute('dur',`${6.2+i*.45}s`);
        anim.setAttribute('repeatCount','indefinite');
        anim.setAttribute('calcMode','spline');
        anim.setAttribute('keyTimes','0;.2;.4;.62;.82;1');
        anim.setAttribute('keySplines','.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1;.42 0 .58 1');
        motif.prepend(anim);
      }
      const glow=svg.querySelector('circle[cx="360"][cy="480"]');
      if(glow && !glow.querySelector('animate')){
        const pulse=document.createElementNS('http://www.w3.org/2000/svg','animate');
        pulse.setAttribute('attributeName','opacity');
        pulse.setAttribute('values','.55;1;.62;.92;.55');
        pulse.setAttribute('dur',`${4.8+i*.35}s`);
        pulse.setAttribute('repeatCount','indefinite');
        glow.appendChild(pulse);
      }
    });
    return true;
  }

  const css=document.createElement('style');
  css.textContent=`
    .gc2-card{isolation:isolate}.gc2-art{position:relative;z-index:1;flex:0 0 auto}.gc2-info{position:relative;z-index:3;background:#fff;overflow:visible}.gc2-info h3,.gc2-info p,.gc2-info span{position:relative;z-index:1}
    .gc2-rare .gc2-art{margin:8px;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px rgba(185,145,255,.24),0 9px 22px rgba(64,24,102,.18)}
    .gc2-rare .gc2-art::before{content:"";position:absolute;z-index:5;inset:0;border:4px solid transparent;border-radius:12px;pointer-events:none;background:linear-gradient(110deg,#8b5cf6,#e879f9,#67e8f9,#f6d365,#8b5cf6) border-box;background-size:320% 320%;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:rareBorderFlow 4.6s linear infinite;animation-delay:var(--rare-delay,0s)}
    .gc2-rare .gc2-art::after{content:"RARE · BORDER SHIFT";position:absolute;z-index:6;right:9px;top:9px;padding:4px 7px;border-radius:999px;background:rgba(12,7,24,.76);color:#efe4ff;font:700 9px/1.2 system-ui,sans-serif;letter-spacing:.08em;pointer-events:none;backdrop-filter:blur(4px)}
    @keyframes rareBorderFlow{0%{background-position:0% 50%;filter:hue-rotate(0deg);opacity:.72}50%{background-position:100% 50%;filter:hue-rotate(55deg);opacity:1}100%{background-position:0% 50%;filter:hue-rotate(0deg);opacity:.72}}

    .gc2-legendary .gc2-art{margin:7px;border-radius:12px;overflow:hidden;box-shadow:0 0 0 2px rgba(255,213,104,.48),0 12px 30px rgba(168,108,0,.28)}
    .gc2-legendary .gc2-art::before{content:"";position:absolute;z-index:4;inset:-35% -65%;pointer-events:none;background:linear-gradient(112deg,transparent 42%,rgba(255,239,173,.06) 47%,rgba(255,255,255,.55) 50%,rgba(255,221,114,.12) 54%,transparent 60%);transform:translateX(-35%) rotate(3deg);animation:legendarySweep 5.4s ease-in-out infinite}
    .gc2-legendary .gc2-art::after{content:"LIVE MOTION · 1/1";position:absolute;z-index:6;right:9px;top:9px;padding:4px 8px;border-radius:999px;background:rgba(20,11,1,.8);border:1px solid rgba(255,213,104,.5);color:#ffe59c;font:800 9px/1.2 system-ui,sans-serif;letter-spacing:.08em;pointer-events:none;box-shadow:0 0 14px rgba(255,199,70,.22)}
    @keyframes legendarySweep{0%,55%{transform:translateX(-42%) rotate(3deg);opacity:0}67%{opacity:1}88%,100%{transform:translateX(42%) rotate(3deg);opacity:0}}

    .gc2-tier:has(.gc2-rare) .gc2-tier-head small::after{content:" · 변화하는 테두리";color:#6e3db2;font-weight:700}.gc2-tier:has(.gc2-legendary) .gc2-tier-head small::after{content:" · 메인 이미지 모션";color:#9b6711;font-weight:700}
    @media(prefers-reduced-motion:reduce){.gc2-rare .gc2-art::before,.gc2-legendary .gc2-art::before{animation:none!important}.gc2-legendary animate,.gc2-legendary animateTransform{display:none}}
  `;
  document.head.appendChild(css);

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      if(enhance()) return;
      const obs=new MutationObserver(()=>{if(enhance())obs.disconnect()});
      obs.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(()=>obs.disconnect(),5000);
    });
  }else if(!enhance()){
    const obs=new MutationObserver(()=>{if(enhance())obs.disconnect()});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>obs.disconnect(),5000);
  }
})();