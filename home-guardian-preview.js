(()=>{
'use strict';

const BASIC_PREVIEW_IDS=['fortune-cat','koi','sun-bird','new-deer','gold-hamster'];

function renderBasicPreviews(){
  const manifest=window.LUMEN_GUARDIAN_ARCHIVE_HD;
  if(!manifest?.items||!manifest?.basePath)return;
  const slots=[...document.querySelectorAll('[data-guardian-preview]')];
  slots.forEach((slot,index)=>{
    const id=slot.dataset.guardianPreview||BASIC_PREVIEW_IDS[index];
    const file=manifest.items[id];
    if(!file)return;
    const img=document.createElement('img');
    img.src=manifest.basePath+file;
    img.alt='';
    img.loading='lazy';
    img.decoding='async';
    img.className='home-guardian-preview-img';
    slot.replaceChildren(img);
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderBasicPreviews);
else renderBasicPreviews();
})();
