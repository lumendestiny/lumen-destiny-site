(()=>{
  const map=document.getElementById('networkMap');
  const selected=document.getElementById('selectedPerson');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;

  const ELEMENTS=['목','화','토','금','수'];
  const PROFILE_KEY='lumen-connection-profile-v1';
  const NETWORK_KEY='lumen-connection-network-web-v1';
  const SPRITE='/assets/connection-animals/reference-v9/element-sprite.webp?v=20260819-exact1';
  // Exact characters cropped from the user-approved reference image.
  // Sprite order: 화 여우 / 수 돌고래 / 토 부엉이 / 목 거북 / 금 토끼 / 중앙 보라 고양이.
  const elementArt={
    '화':{name:'불여우',key:'fire'},
    '수':{name:'물돌고래',key:'water'},
    '토':{name:'별부엉이',key:'earth'},
    '목':{name:'숲거북',key:'wood'},
    '금':{name:'달토끼',key:'metal'}
  };
  const centerCat={name:'보라 고양이',key:'center'};
  const spritePos={fire:'0%',water:'20%',earth:'40%',wood:'60%',metal:'80%',center:'100%'};
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
    if(document.getElementById('connectionExactApprovedCharactersV9'))return;
    const style=document.createElement('style');style.id='connectionExactApprovedCharactersV9';style.textContent=`
      .character-sprite{display:block;background-image:url('${SPRITE}');background-repeat:no-repeat;background-size:600% 100%;background-color:transparent;border:0;box-shadow:none;filter:drop-shadow(0 9px 8px rgba(62,44,127,.20))}
      .node-animal{position:absolute;left:50%;top:-42px;transform:translateX(-50%);width:88px;height:88px;z-index:3}
      .center-animal-img{position:relative;width:132px;height:132px;margin-top:-48px;z-index:3;filter:drop-shadow(0 13px 12px rgba(75,52,168,.28))}
      .selected-animal-img{position:absolute;left:0;top:-5px;width:62px;height:62px;filter:drop-shadow(0 6px 7px rgba(62,44,127,.16))}
      .element-badge{display:block;margin:3px auto 0;font-size:8px;font-weight:900;color:#746d83}.center-element-badge{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);min-width:42px;padding:2px 6px;border-radius:999px;background:rgba(255,255,255,.94);font-size:8px!important;color:#5d48c8!important;font-weight:900;white-space:nowrap;z-index:4}.selected-element-badge{display:inline-flex;margin-top:5px;padding:3px 7px;border-radius:999px;background:#f1edff;color:#5d48c8;font-size:9px;font-weight:900}
      .node.element-wood{border-color:#c9dfbf!important}.node.element-wood em{background:#68aa61!important}.node.element-fire{border-color:#f2b0a8!important}.node.element-fire em{background:#ee6d48!important}.node.element-earth{border-color:#ead9bc!important}.node.element-earth em{background:#d49b58!important}.node.element-metal{border-color:#f1b7d2!important}.node.element-metal em{background:#ef5d9a!important}.node.element-water{border-color:#c7d7ec!important}.node.element-water em{background:#6c8cc6!important}
      .center-node{overflow:visible!important}.center-node span:not(.center-element-badge){position:relative;z-index:4}
      @media(max-width:720px){.node-animal{width:68px;height:68px;top:-32px}.center-animal-img{width:98px;height:98px;margin-top:-34px}.selected-animal-img{width:52px;height:52px}.element-badge{font-size:7px}.center-element-badge{bottom:4px;font-size:7px!important}}
      @media(max-width:390px){.node-animal{width:59px;height:59px;top:-28px}.center-animal-img{width:84px;height:84px;margin-top:-29px}}
    `;document.head.appendChild(style);
  }
  function ensureCharacter(container,className,key){
    let el=container.querySelector('.'+className);
    if(el?.tagName==='IMG'){el.remove();el=null}
    if(!el){el=document.createElement('span');el.className=`${className} character-sprite`;el.setAttribute('aria-hidden','true');container.prepend(el)}
    el.classList.add('character-sprite');el.style.backgroundPosition=`${spritePos[key]||'0%'} 50%`;
    return el;
  }
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
      node.classList.remove('group-partner','group-family','group-friend','group-work','group-other');node.classList.add(`group-${group}`);applyElementClass(node,element);
      node.querySelector('.node-icon')?.remove();ensureCharacter(node,'node-animal',art.key);ensureElementBadge(node,element);
      const score=node.querySelector('em')?.textContent||'';node.setAttribute('aria-label',`${name}, ${relation||label[group]}, 주 오행 ${elementLabel[element]}, ${art.name}, 오행 보완도 ${score}`);
      let mark=node.querySelector('.relation-mark');if(!mark){mark=document.createElement('span');mark.className='relation-mark';node.appendChild(mark)}mark.textContent=group==='partner'?'♥':group==='work'?'✦':group==='friend'?'♡':'•';
    });

    const center=map.querySelector('.center-node');
    if(center){const profile=profileData();const element=dominant(profile?.elements);applyElementClass(center,element);center.querySelector('.center-animal')?.remove();ensureCharacter(center,'center-animal-img',centerCat.key);let badge=center.querySelector('.center-element-badge');if(!badge){badge=document.createElement('span');badge.className='center-element-badge';center.appendChild(badge)}badge.textContent=elementLabel[element];center.setAttribute('aria-label',`${center.querySelector('strong')?.textContent||'나'}, 주 오행 ${elementLabel[element]}, ${centerCat.name}, 인연지도의 중심`)}

    if(selected&&!selected.hidden){const member=memberForSelected();const element=dominant(member?.elements);const art=elementArt[element]||elementArt['토'];applyElementClass(selected,element);const head=selected.querySelector('.selected-head>div');if(head){ensureCharacter(head,'selected-animal-img',art.key);let badge=head.querySelector('.selected-element-badge');if(!badge){badge=document.createElement('span');badge.className='selected-element-badge';head.appendChild(badge)}badge.textContent=`${elementLabel[element]} · ${art.name}`}}
    if(ranking)[...ranking.querySelectorAll('.rank-row')].forEach((row,i)=>row.dataset.rank=String(i+1));
  }

  let queued=false;const request=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  const observer=new MutationObserver(request);observer.observe(map,{childList:true,subtree:true,characterData:true});if(selected)observer.observe(selected,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});if(ranking)observer.observe(ranking,{childList:true,subtree:true,characterData:true});window.addEventListener('storage',request);decorate();
})();