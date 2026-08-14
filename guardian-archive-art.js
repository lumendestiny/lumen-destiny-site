(()=>{
  const cards=[...document.querySelectorAll('#purpose-guardians .archive-card')].slice(0,4);
  if(!cards.length)return;
  const rev='guardian-hd-masters-20260814-1';
  const art=[
    `/assets/guardian/sales/guardian-basic-5-hd.webp?v=${rev}`,
    `/assets/guardian/sales/guardian-wish-10-hd.webp?v=${rev}`,
    `/assets/guardian/sales/guardian-rare-50-hd.webp?v=${rev}`,
    `/assets/guardian/sales/guardian-legendary-100-hd.webp?v=${rev}`
  ];
  if(!document.getElementById('guardian-archive-art-style')){
    const s=document.createElement('style');s.id='guardian-archive-art-style';s.textContent=`
      .archive-card{overflow:hidden}.guardian-purpose-visual.guardian-sales-art{height:315px!important;min-height:315px!important;background:transparent!important;box-shadow:none!important;border-radius:14px!important;padding:0!important;margin-bottom:12px!important;overflow:hidden!important;position:relative;z-index:1}
      .guardian-sales-art img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;border-radius:14px;filter:drop-shadow(0 8px 14px rgba(28,31,42,.14));image-rendering:auto}
      .archive-card:nth-of-type(3) .guardian-sales-art{padding:4px!important;background:linear-gradient(115deg,#7c3aed,#d946ef,#22d3ee,#fbbf24,#7c3aed)!important;background-size:320% 320%!important;animation:guardianArchiveRareBorder 4.6s linear infinite}
      .archive-card:nth-of-type(4) .guardian-sales-art:after{content:"";position:absolute;inset:-35% -70%;pointer-events:none;background:linear-gradient(112deg,transparent 43%,rgba(255,244,190,.04) 47%,rgba(255,255,255,.4) 50%,rgba(255,220,108,.08) 54%,transparent 60%);animation:guardianArchiveLegendarySweep 5.2s ease-in-out infinite;z-index:3}
      .archive-card .rarity,.archive-card h3,.archive-card p,.archive-card .meta,.archive-card .button{position:relative;z-index:2;background:transparent}
      @keyframes guardianArchiveRareBorder{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes guardianArchiveLegendarySweep{0%,55%{transform:translateX(-42%) rotate(3deg);opacity:0}67%{opacity:1}88%,100%{transform:translateX(42%) rotate(3deg);opacity:0}}
      @media(min-width:1100px) and (max-height:820px){.guardian-purpose-visual.guardian-sales-art{height:250px!important;min-height:250px!important}}
      @media(max-width:1099px){.guardian-purpose-visual.guardian-sales-art{height:390px!important;min-height:390px!important}}
      @media(max-width:640px){.guardian-purpose-visual.guardian-sales-art{height:auto!important;min-height:0!important;aspect-ratio:420/680}}
      @media(prefers-reduced-motion:reduce){.archive-card:nth-of-type(3) .guardian-sales-art,.archive-card:nth-of-type(4) .guardian-sales-art:after{animation:none!important}}
    `;document.head.append(s)
  }
  cards.forEach((card,i)=>{
    const box=card.querySelector('.guardian-purpose-visual');if(!box)return;
    box.className='guardian-purpose-visual guardian-sales-art';
    box.innerHTML=`<img src="${art[i]}" alt="${card.querySelector('h3')?.textContent||'Guardian'} 승인 HD 판매용 카드 이미지">`;
  });
})();