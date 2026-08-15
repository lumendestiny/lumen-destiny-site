(()=>{
'use strict';

const BASIC_PREVIEW_IDS=['fortune-cat','koi','sun-bird','new-deer','gold-hamster'];
const MAX_RETRIES=3;

function buildSrc(manifest,file,retry){
  const version=encodeURIComponent(manifest.version||'1');
  return `${manifest.basePath}${file}?v=${version}&home=1&r=${retry}`;
}

function renderBasicPreviews(){
  const manifest=window.LUMEN_GUARDIAN_ARCHIVE_HD;
  if(!manifest?.items||!manifest?.basePath)return;

  const slots=[...document.querySelectorAll('[data-guardian-preview]')];
  slots.forEach((slot,index)=>{
    const id=slot.dataset.guardianPreview||BASIC_PREVIEW_IDS[index];
    const file=manifest.items[id];
    if(!file)return;

    const img=document.createElement('img');
    let retry=0;

    img.alt='';
    img.loading='eager';
    img.decoding='async';
    img.fetchPriority='high';
    img.className='home-guardian-preview-img';

    img.addEventListener('error',()=>{
      if(retry<MAX_RETRIES){
        retry+=1;
        setTimeout(()=>{
          img.src=buildSrc(manifest,file,retry);
        },150*retry);
        return;
      }
      slot.dataset.previewError='1';
    });

    img.addEventListener('load',()=>{
      slot.dataset.previewLoaded='1';
      slot.removeAttribute('data-preview-error');
    });

    img.src=buildSrc(manifest,file,retry);
    slot.replaceChildren(img);
  });
}

function boot(){
  renderBasicPreviews();
  setTimeout(renderBasicPreviews,500);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
