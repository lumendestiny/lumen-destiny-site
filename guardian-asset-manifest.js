/* Lumen Guardian approved asset policy.
   Single source of truth for customer-facing Guardian artwork.
   Customer UI must render only these approved masters. */
(()=>{
  const tierRenderer='/guardian-tier-hd-art.js?v=20260814-hd-1';
  const assets=Object.freeze({
    basic:Object.freeze({src:null,renderer:'tierHD',rendererKey:'basic',rendererSrc:tierRenderer,kind:'approved-live-vector',motion:'none'}),
    custom:Object.freeze({src:null,renderer:'tierHD',rendererKey:'custom',rendererSrc:tierRenderer,kind:'approved-live-vector',motion:'none'}),
    rare:Object.freeze({src:null,renderer:'tierHD',rendererKey:'rare',rendererSrc:tierRenderer,kind:'approved-live-vector',motion:'border-shift'}),
    legendary:Object.freeze({src:null,renderer:'legendaryHD',rendererSrc:'/guardian-legendary-hd-art.js?v=20260814-hd-2',kind:'approved-live-vector',motion:'live-motion'})
  });
  Object.defineProperty(window,'__LUMEN_GUARDIAN_APPROVED_ASSETS__',{value:assets,writable:false,configurable:false,enumerable:false});
})();