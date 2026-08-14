/* Lumen Guardian approved asset policy.
   Emergency-safe manifest: only browser-decodable verified sale images. */
(()=>{
  const rev='guardian-verified-safe-20260814-1';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}basic-illustrated-master.webp?v=${rev}`,kind:'verified-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}personal-illustrated-master.webp?v=${rev}`,kind:'verified-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}rare-illustrated-master.webp?v=${rev}`,kind:'verified-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:`${base}legendary-illustrated-master.webp?v=${rev}`,kind:'verified-sale-master',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();