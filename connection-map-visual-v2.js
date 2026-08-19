(()=>{
  const map=document.getElementById('networkMap');
  const selected=document.getElementById('selectedPerson');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;

  const ELEMENTS=['목','화','토','금','수'];
  const PROFILE_KEY='lumen-connection-profile-v1';
  const NETWORK_KEY='lumen-connection-network-web-v1';
  const elementArt={
    '금':{name:'월토끼',src:'/assets/guardian/archive-hd/guardian-personal-moon-rabbit-hd.webp'},
    '수':{name:'돌고래',src:'/assets/guardian/archive-hd/guardian-personal-dolphin-hd.webp'},
    '화':{name:'불여우',src:'/assets/guardian/archive-hd/guardian-personal-fire-fox-hd.webp'},
    '목':{name:'숲거북',src:'/assets/guardian/archive-hd/guardian-personal-leaf-turtle-hd.webp'},
    '토':{name:'별부엉이',src:'/assets/guardian/archive-hd/guardian-personal-star-owl-hd.webp'}
  };
  const elementClass={'목':'wood','화':'fire','토':'earth','금':'metal','수':'water'};
  const elementLabel={'목':'목(木)','화':'화(火)','토':'토(土)','금':'금(金)','수':'수(水)'};

  const sets={partner:['아내','남편','배우자','연인','애인','여자친구','남자친구','wife','husband','partner','girlfriend','boyfriend'],family:['가족','부모','엄마','아빠','어머니','아버지','할머니','할아버지','형','누나','언니','오빠','동생','아들','딸','자녀','사촌','family','mother','father','sister','brother','son','daughter'],friend:['친구','지인','동창','동문','선배','후배','베프','friend'],work:['직장','회사','동료','상사','부하','팀장','대표','사장','직원','거래처','고객','사업','비즈니스','업무','work','coworker','colleague','boss','client','business']};
  const label={partner:'연인·배우자',family:'가족',friend:'친구',work:'직장·사업',other:'기타'};
  const infer=text=>{const v=(text||'').toLowerCase();for(const [g,words] of Object.entries(sets))if(words.some(w=>v.includes(w.toLowerCase())))return g;return'other'};
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const dominant=elements=>{if(!elements)return'토';let best=ELEMENTS[0],value=-Infinity;for(const k of ELEMENTS){const n=Number(elements[k]||0);if(n>value){best=k;value=n}}return best};
  const networkData=()=>read(NETWORK_KEY,[]);
  const profileData=()=>read(PROFILE_KEY,null);
  const memberForNode=node=>{const id=node.dataset.node||'';return networkData().find(m=>String(m.id)===String(id))||null};
  const memberForSelected=()=>{const name=selected?.querySelector('.selected-head h3')?.textContent?.trim()||'';const meta=selected?.querySelector('.selected-head p')?.textContent||'';return networkData().find(m=>m.name===name&&meta.includes(m.relation||''))||networkData().find(m=>m.name===name)||null};

  function ensureStyles(){
    if(document.getElementById('connectionElementArtV9'))return;
    const style=document.createElement('style');style.id='connectionElementArtV9';style.textContent=`
      .node-animal,.center-animal-img,.selected-animal-img{object-fit:cover!important;object-position:center 42%!important;background:#fff;box-shadow:0 8px 20px rgba(61,43,135,.16);border:3px solid rgba(255,255,255,.96)}
      .node-animal{width:82px!important;height:82px!important;border-radius:26px!important;top:-38px!important;filter:none!important}
      .center-animal-img{width:102px!important;height:102px!important;border-radius:34px!important;margin-top:-32px!important;filter:none!important}
      .selected-animal-img{border-radius:17px!important;object-fit:cover!important}
      .element-badge{display:block;margin:3px auto 0;font-size:8px;font-weight:900;letter-spacing:-.02em;color:#746d83}
      .center-element-badge{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);min-width:42px;padding:2px 6px;border-radius:999px;background:rgba(255,255,255,.92);font-size:8px!important;color:#5d48c8!important;font-weight:900;white-space:nowrap}
      .selected-element-badge{display:inline-flex;margin-top:5px;padding:3px 7px;border-radius:999px;background:#f1edff;color:#5d48c8;font-size:9px;font-weight:900}
      .node.element-wood{border-color:#b9dfc6!important}.node.element-wood em{background:#4eaa72!important}.node.element-fire{border-color:#f3b6af!important}.node.element-fire em{background:#e96555!important}.node.element-earth{border-color:#e7d3a5!important}.node.element-earth em{background:#bb8d3e!important}.node.element-metal{border-color:#e6d9ef!important}.node.element-metal em{background:#9b70c7!important}.node.element-water{border-color:#b8d7f1!important}.node.element-water em{background:#4f8fc8!important}
      @media(max-width:720px){.node-animal{width:64px!important;height:64px!important;border-radius:21px!important;top:-30px!important}.center-animal-img{width:78px!important;height:78px!important;border-radius:26px!important;margin-top:-24px!important}.element-badge{font-size:7px}.center-element-badge{bottom:4px;font-size:7px!important}}
      @media(max-width:390px){.node-animal{width:56px!important;height:56px!important;border-radius:18px!important;top:-26px!important}.center-animal-img{width:68px!important;height:68px!important;border-radius:22px!important;margin-top:-21px!important}}
    `;document.head.appendChild(style);
  }
  function ensureImg(container,className,src){let img=container.querySelector('.'+className);if(!img){img=document.createElement('img');img.className=className;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';container.prepend(img)}if(img.getAttribute('src')!==src)img.src=src;return img}
  function applyElementClass(el,element){for(const c of Object.values(elementClass))el.classList.remove(`element-${c}`);el.classList.add(`element-${elementClass[element]||'earth'}`);el.dataset.element=element}
  function ensureElementBadge(node,element){let badge=node.querySelector('.element-badge');if(!badge){badge=document.createElement('span');badge.className='element-badge';node.appendChild(badge)}badge.textContent=elementLabel[element]||element}
  function sparkles(){if(map.querySelector('.map-sparkles'))return;const s=document.createElement('span');s.className='map-sparkles';s.setAttribute('aria-hidden','true');s.innerHTML='<i>♥</i><i>✦</i><i>♡</i><i>✦</i><i>♥</i>';map.appendChild(s)}

  function decorate(){
    ensureStyles();sparkles();
    map.querySelectorAll('.node').forEach(node=>{
      const relation=node.querySelector('small')?.textContent||'';
      const name=node.querySelector('strong')?.textContent||'인연';
      const group=infer(relation);
      const member=memberForNode(node);
      const element=dominant(member?.elements);
      const art=elementArt[element]||elementArt['토'];
      node.classList.remove('group-partner','group-family','group-friend','group-work','group-other');
      node.classList.add(`group-${group}`);
      applyElementClass(node,element);
      node.querySelector('.node-icon')?.remove();
      ensureImg(node,'node-animal',art.src);
      ensureElementBadge(node,element);
      const score=node.querySelector('em')?.textContent||'';
      node.setAttribute('aria-label',`${name}, ${relation||label[group]}, 주 오행 ${elementLabel[element]}, ${art.name}, 오행 보완도 ${score}`);
      let mark=node.querySelector('.relation-mark');if(!mark){mark=document.createElement('span');mark.className='relation-mark';node.appendChild(mark)}mark.textContent=group==='partner'?'♥':group==='work'?'✦':group==='friend'?'♡':'•';
    });

    const center=map.querySelector('.center-node');
    if(center){
      const profile=profileData();
      const element=dominant(profile?.elements);
      const art=elementArt[element]||elementArt['토'];
      applyElementClass(center,element);
      center.querySelector('.center-animal')?.remove();
      ensureImg(center,'center-animal-img',art.src);
      let badge=center.querySelector('.center-element-badge');if(!badge){badge=document.createElement('span');badge.className='center-element-badge';center.appendChild(badge)}badge.textContent=elementLabel[element];
      center.setAttribute('aria-label',`${center.querySelector('strong')?.textContent||'나'}, 주 오행 ${elementLabel[element]}, ${art.name}, 인연지도의 중심`);
    }

    if(selected&&!selected.hidden){
      const member=memberForSelected();
      const element=dominant(member?.elements);
      const art=elementArt[element]||elementArt['토'];
      applyElementClass(selected,element);
      const head=selected.querySelector('.selected-head>div');
      if(head){ensureImg(head,'selected-animal-img',art.src);let badge=head.querySelector('.selected-element-badge');if(!badge){badge=document.createElement('span');badge.className='selected-element-badge';head.appendChild(badge)}badge.textContent=`${elementLabel[element]} · ${art.name}`}
    }
    if(ranking)[...ranking.querySelectorAll('.rank-row')].forEach((row,i)=>row.dataset.rank=String(i+1));
  }

  let queued=false;const request=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  const observer=new MutationObserver(request);observer.observe(map,{childList:true,subtree:true,characterData:true});if(selected)observer.observe(selected,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});if(ranking)observer.observe(ranking,{childList:true,subtree:true,characterData:true});
  window.addEventListener('storage',request);
  decorate();
})();