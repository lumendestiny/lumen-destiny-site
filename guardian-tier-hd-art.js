/* Compatibility lock: legacy tier renderer must never redraw customer sale artwork. It returns only approved illustrated sale masters. */
(()=>{
  const rev='guardian-approved-sales-lock-20260814-1';
  const base='/assets/guardian/sales/';
  const img=(file,label)=>`<img src="${base}${file}?v=${rev}" alt="${label}" style="display:block;width:100%;height:auto;max-height:560px;object-fit:contain;object-position:center;border-radius:18px;image-rendering:auto">`;
  window.__LUMEN_TIER_HD_ART__=Object.freeze({
    basic:()=>img('basic-illustrated-master.webp','Lumen Guardian Basic approved sale artwork'),
    custom:()=>img('personal-illustrated-master.webp','Lumen Personal Wish Guardian approved sale artwork'),
    rare:()=>img('rare-illustrated-master.webp','Lumen Rare Guardian approved sale artwork')
  });
})();