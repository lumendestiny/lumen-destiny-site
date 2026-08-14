/* Lumen Guardian approved asset policy.
   Single source of truth for customer-facing Guardian artwork.
   Basic, Personal and Rare use the approved illustrated sale masters only.
   Legendary keeps the approved HD motion renderer. */
(()=>{
  const rev='guardian-approved-sales-lock-20260814-1';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}basic-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}personal-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}rare-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:null,renderer:'legendaryHD',rendererSrc:'/guardian-legendary-hd-art.js?v=20260814-hd-2',kind:'approved-live-vector',motion:'live-motion'})
  });
  try{Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});}
  catch{window.__LUMEN_GUARDIAN_APPROVED_ASSETS__=assets;}
})();