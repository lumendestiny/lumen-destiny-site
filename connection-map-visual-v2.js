(()=>{
  const map=document.getElementById('networkMap');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;

  const ELEMENTS=['목','화','토','금','수'];
  const PROFILE_KEY='lumen-connection-profile-v1';
  const NETWORK_KEY='lumen-connection-network-web-v1';
  const BASE='/assets/connection-animals/reference-v9/';

  // Approved character set extracted from the user's reference image.
  // 화=여우 / 수=돌고래 / 목=거북 / 금=토끼 / 토=부엉이 / 중앙=보라 고양이.
  // Each character is an independent transparent WebP asset (no sprite, no SVG fallback).
  const elementArt={
    '화':{name:'불여우',src:BASE+'fire.webp'},
    '수':{name:'물돌고래',src:BASE+'water.webp'},
    '목':{name:'숲거북',src:BASE+'wood.webp'},
    '금':{name:'달토끼',src:BASE+'metal.webp'},
    '토':{name:'별부엉이',src:BASE+'earth.webp'}
  };
  const centerCat={name:'보라 고양이',src:BASE+'center.webp'};
  const elementClass={'목':'wood','화':'fire','토':'earth','금':'metal','수':'water'};
  const elementLabel={'목':'목(木)','화':'화(火)','토':'토(土)','금':'금(金)','수':'수(水)'};

  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const dominant=elements=>{if(!elements)return'토';let best=ELEMENTS[0],value=-Infinity;for(const key of ELEMENTS){const n=Number(elements[key]||0);if(n>value){best=key;value=n}}return best};
  const networkData=()=>read(NETWORK_KEY,[]);
  const profileData=()=>read(PROFILE_KEY,null);
  const memberForNode=node=>networkData().find(member=>String(member.id)===String(node.dataset.node||''))||null;

  function ensureStyles(){
    if(document.getElementById('approvedWebpV9Characters'))return;
    const style=document.createElement('style');
    style.id='approvedWebpV9Characters';
    style.textContent=`
      .node-animal,.center-animal-img{object-fit:contain!important;object-position:center!important;background:transparent!important;border:0!important;box-shadow:none!important;pointer-events:none}
      .node-animal{position:absolute!important;left:50%!important;top:-45px!important;transform:translateX(-50%)!important;width:94px!important;height:94px!important;z-index:3!important;filter:drop-shadow(0 9px 9px rgba(62,44,127,.19))!important}
      .center-node{overflow:visible!important}
      .center-animal-img{position:relative!important;width:144px!important;height:144px!important;margin-top:-53px!important;z-index:3!important;filter:drop-shadow(0 13px 13px rgba(75,52,168,.27))!important}
      .element-badge{display:block;margin:3px auto 0;font-size:8px;font-weight:900;color:#746d83}
      .center-element-badge{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.95);color:#5d48c8;font-size:8px;font-weight:900;z-index:4;white-space:nowrap}
      @media(max-width:720px){
        .node-animal{width:72px!important;height:72px!important;top:-34px!important}
        .center-animal-img{width:108px!important;height:108px!important;margin-top:-38px!important}
        .center-element-badge{bottom:4px;font-size:7px}
      }
      @media(max-width:390px){
        .node-animal{width:62px!important;height:62px!important;top:-29px!important}
        .center-animal-img{width:90px!important;height:90px!important;margin-top:-31px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureImage(container,className,src){
    let image=container.querySelector('.'+className);
    if(!image){
      image=document.createElement('img');
      image.className=className;
      image.alt='';
      image.setAttribute('aria-hidden','true');
      image.decoding='async';
      image.loading='eager';
      container.prepend(image);
    }
    if(image.getAttribute('src')!==src)image.src=src;
    return image;
  }

  function applyElementClass(element,elementName){
    Object.values(elementClass).forEach(name=>element.classList.remove('element-'+name));
    element.classList.add('element-'+(elementClass[elementName]||'earth'));
  }

  function decorate(){
    ensureStyles();
    map.querySelectorAll('.node').forEach(node=>{
      const member=memberForNode(node);
      const element=dominant(member?.elements);
      const art=elementArt[element];
      applyElementClass(node,element);
      node.querySelector('.node-icon')?.remove();
      ensureImage(node,'node-animal',art.src);
      let badge=node.querySelector('.element-badge');
      if(!badge){badge=document.createElement('span');badge.className='element-badge';node.appendChild(badge)}
      badge.textContent=elementLabel[element];
    });

    const center=map.querySelector('.center-node');
    if(center){
      const element=dominant(profileData()?.elements);
      applyElementClass(center,element);
      center.querySelector('.center-animal')?.remove();
      ensureImage(center,'center-animal-img',centerCat.src);
      let badge=center.querySelector('.center-element-badge');
      if(!badge){badge=document.createElement('span');badge.className='center-element-badge';center.appendChild(badge)}
      badge.textContent=elementLabel[element];
    }

    if(ranking)[...ranking.querySelectorAll('.rank-row')].forEach((row,index)=>row.dataset.rank=String(index+1));
  }

  let queued=false;
  const requestDecorate=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(requestDecorate).observe(map,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',requestDecorate);
  decorate();
})();