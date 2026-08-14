/* Lumen Guardian approved asset policy.
   Single source of truth for customer-facing Guardian artwork.
   Drive keeps archival PNG masters; production uses these verified HD WebP copies. */
(()=>{
  const rev='guardian-hd-masters-20260814-1';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}guardian-basic-5-hd.webp?v=${rev}`,kind:'approved-hd-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}guardian-wish-10-hd.webp?v=${rev}`,kind:'approved-hd-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}guardian-rare-50-hd.webp?v=${rev}`,kind:'approved-hd-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:`${base}guardian-legendary-100-hd.webp?v=${rev}`,kind:'approved-hd-sale-master',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();