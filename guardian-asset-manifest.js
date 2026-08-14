/* Lumen Guardian approved asset policy.
   Single source of truth for customer-facing Guardian artwork.
   Use only verified browser-decodable sale masters in production. */
(()=>{
  const rev='guardian-approved-safe-20260814-3';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}basic-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}personal-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}rare-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:`${base}legendary-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();