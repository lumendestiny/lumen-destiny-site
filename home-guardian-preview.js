(()=>{
'use strict';

const BASIC_PREVIEW_IDS=['fortune-cat','koi','sun-bird','new-deer','gold-hamster'];
const LOCAL_BASIC_FALLBACK='/assets/guardian/sales/guardian-basic-5-hd.webp?v=home-basic-fallback-20260815-1';
const MAX_RETRIES=3;

function enforceLaunchScope(){
  if(document.querySelector('script[src*="/home-no-consult.js"]'))return;
  const s=document.createElement('script');
  s.src='/home-no-consult.js?v=20260816-1';
  s.defer=true;
  document.head.appendChild(s);
}

function versioned(src,version,retry){
  if(!src)return'';
  const join=src.includes('?')?'&':'?';
  return `${src}${join}v=${encodeURIComponent(version||'1')}&home=1&r=${retry}`;
}

function basicSource(manifest,id,retry){
  const file=manifest?.items?.[id];
  if(!file)return'';
  return versioned(`${manifest.basePath||''}${file}`,manifest.version||'1',retry);
}

function makeImage(slot,src){
  const img=document.createElement('img');
  let retry=0;
  let usingFallback=false;

  img.alt='Lumen Guardian Basic preview';
  img.loading='eager';
  img.decoding='async';
  img.fetchPriority='high';
  img.className='home-guardian-preview-img';

  img.addEventListener('error',()=>{
    if(!usingFallback&&retry<MAX_RETRIES){
      retry+=1;
      const id=slot.dataset.basicGuardianId||'';
      const next=basicSource(window.LUMEN_GUARDIAN_ARCHIVE_HD,id,retry);
      if(next){
        setTimeout(()=>{img.src=next;},120*retry);
        return;
      }
    }
    if(!usingFallback){
      usingFallback=true;
      img.src=LOCAL_BASIC_FALLBACK;
      return;
    }
    slot.dataset.previewError='1';
  });

  img.addEventListener('load',()=>{
    slot.dataset.previewLoaded='1';
    slot.removeAttribute('data-preview-error');
  });

  img.src=src||LOCAL_BASIC_FALLBACK;
  return img;
}

function renderBasicPreviews(){
  const manifest=window.LUMEN_GUARDIAN_ARCHIVE_HD;
  const slots=[...document.querySelectorAll('[data-guardian-preview]')];

  slots.forEach((slot,index)=>{
    const id=BASIC_PREVIEW_IDS[index%BASIC_PREVIEW_IDS.length];
    slot.dataset.basicGuardianId=id;

    const src=basicSource(manifest,id,0)||LOCAL_BASIC_FALLBACK;
    const existing=slot.querySelector('.home-guardian-preview-img');
    if(existing&&slot.dataset.previewLoaded==='1')return;

    slot.replaceChildren(makeImage(slot,src));
  });
}

function boot(){
  enforceLaunchScope();
  renderBasicPreviews();
  setTimeout(renderBasicPreviews,300);
  setTimeout(renderBasicPreviews,1000);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
