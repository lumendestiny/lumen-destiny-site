/* Lumen Guardian approved asset policy.
   This is the single source of truth for customer-facing Guardian artwork.
   UI scripts must read from this manifest and must not invent, downgrade,
   substitute, or procedurally redraw approved sale artwork outside approved renderers. */
(()=>{
  const rev='guardian-approved-20260814-3';
  const base='/assets/guardian/sales/';
  const assets=Object.freeze({
    basic:Object.freeze({src:`${base}basic-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    custom:Object.freeze({src:`${base}personal-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'none'}),
    rare:Object.freeze({src:`${base}rare-illustrated-master.webp?v=${rev}`,kind:'approved-sale-master',motion:'border-shift'}),
    legendary:Object.freeze({src:null,renderer:'legendaryHD',rendererSrc:'/guardian-legendary-hd-art.js?v=20260814-hd-2',kind:'approved-live-vector',motion:'live-motion'})
  });
  Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});
})();