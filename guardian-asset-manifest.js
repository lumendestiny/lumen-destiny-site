/* Lumen Guardian approved asset policy.
   Single source of truth for customer-facing Guardian artwork.
   Customer UI must render only these approved sale masters. */
(()=>{
  const rev='guardian-approved-sales-lock-20260814-2';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}basic-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}personal-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}rare-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:`${base}legendary-approved-hd.webp?v=${rev}`,kind:'approved-hd-sale-master',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();