(()=>{
  'use strict';
  // HD archive asset registry. A product is switched only after its unique master is approved.
  // Empty entries intentionally keep the existing SVG fallback; never duplicate another product's art.
  const HD={
    'fortune-cat':null,'koi':null,'sun-bird':null,'new-deer':null,'gold-hamster':null,
    'moon-rabbit':null,'dolphin':null,'fire-fox':null,'leaf-turtle':null,'star-owl':null,
    'nine-fox':null,'sea-dragon':null,'unicorn':null,'forest-turtle':null,'wing-owl':null,
    'sky-dragon':null,'fire-phoenix':null,'moon-tiger':null,'qilin':null,'black-turtle':null
  };
  const keys=Object.keys(HD);
  function enhance(){
    const cards=[...document.querySelectorAll('#purpose-guardians .gc2-card')];
    if(!cards.length) return false;
    cards.forEach((card,i)=>{
      const key=keys[i];
      const src=HD[key];
      card.dataset.guardianKey=key;
      const art=card.querySelector('.gc2-art');
      if(!art||!src) return;
      const fallback=art.innerHTML;
      const img=new Image();
      img.className='gc2-hd-image';
      img.alt=(card.querySelector('h3')?.textContent||'Lumen Guardian')+' HD 판매 이미지';
      img.decoding='async'; img.loading=i<5?'eager':'lazy';
      img.onload=()=>{art.replaceChildren(img);card.classList.add('gc2-hd-ready');};
      img.onerror=()=>{art.innerHTML=fallback;card.classList.remove('gc2-hd-ready');};
      img.src=src;
    });
    if(!document.getElementById('guardian-archive-hd-style')){
      const s=document.createElement('style');s.id='guardian-archive-hd-style';
      s.textContent='.gc2-art .gc2-hd-image{display:block;width:100%;height:100%;object-fit:cover;object-position:center}.gc2-hd-ready .gc2-art{background:#07080c}.gc2-card{contain:layout paint}';
      document.head.appendChild(s);
    }
    return true;
  }
  let tries=0;const timer=setInterval(()=>{if(enhance()||++tries>40)clearInterval(timer)},100);
})();