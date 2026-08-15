/* Lumen Guardian approved asset policy.
   Verified HD masters generated from the Lumen Destiny Google Drive source. */
(()=>{
  const rev='guardian-drive-hd-20260814-2';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}guardian-basic-5-hd.webp?v=${rev}`,kind:'verified-hd-master',motion:'none'}),
    custom:Object.freeze({src:`${base}guardian-wish-10-hd.webp?v=${rev}`,kind:'verified-hd-master',motion:'none'}),
    rare:Object.freeze({src:`${base}guardian-rare-50-hd.webp?v=${rev}`,kind:'verified-hd-master',motion:'border-shift'}),
    legendary:Object.freeze({src:`${base}guardian-legendary-100-hd.webp?v=${rev}`,staticSrc:`${base}legendary-approved-hd.webp?v=${rev}`,kind:'verified-hd-master',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();