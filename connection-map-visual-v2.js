(()=>{
  function ensureConnectionI18n(){
    if(document.querySelector('script[src*="/connection-map-i18n-v2.js"]'))return;
    const s=document.createElement('script');
    s.src='/connection-map-i18n-v2.js?v=20260816-1';
    s.defer=true;
    document.head.appendChild(s);
  }
  ensureConnectionI18n();

  const map=document.getElementById('networkMap');
  const selected=document.getElementById('selectedPerson');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;

  const sets={
    partner:['아내','남편','배우자','연인','애인','여자친구','남자친구','wife','husband','partner','girlfriend','boyfriend'],
    family:['가족','부모','엄마','아빠','어머니','아버지','할머니','할아버지','형','누나','언니','오빠','동생','아들','딸','자녀','사촌','family','mother','father','sister','brother','son','daughter'],
    friend:['친구','지인','동창','동문','선배','후배','베프','friend'],
    work:['직장','회사','동료','상사','부하','팀장','대표','사장','직원','거래처','고객','사업','비즈니스','업무','work','coworker','colleague','boss','client','business']
  };
  const animalAssets={
    partner:['/assets/connection-animals/cat.svg','/assets/connection-animals/dog.svg'],
    family:['/assets/connection-animals/dog.svg','/assets/connection-animals/hedgehog.svg'],
    friend:['/assets/connection-animals/hedgehog.svg','/assets/connection-animals/penguin.svg'],
    work:['/assets/connection-animals/fox.svg','/assets/connection-animals/penguin.svg'],
    other:['/assets/connection-animals/fox.svg','/assets/connection-animals/cat.svg','/assets/connection-animals/hedgehog.svg']
  };
  const label={partner:'연인·배우자',family:'가족',friend:'친구',work:'직장·사업',other:'기타'};
  const infer=text=>{
    const value=(text||'').toLowerCase();
    for(const [group,words] of Object.entries(sets))if(words.some(w=>value.includes(w.toLowerCase())))return group;
    return 'other';
  };
  const hash=text=>[...String(text||'')].reduce((n,ch)=>((n*31)+ch.codePointAt(0))>>>0,7);
  const assetFor=(group,key)=>{const list=animalAssets[group]||animalAssets.other;return list[hash(key)%list.length]};
  const numeric=text=>{const match=String(text||'').replace(/,/g,'').match(/[+-]?\d+(?:\.\d+)?/);return match?Number(match[0]):0};

  function ensureImg(container,className,src,alt=''){
    let img=container.querySelector('.'+className);
    if(!img){img=document.createElement('img');img.className=className;img.alt=alt;img.setAttribute('aria-hidden','true');container.prepend(img)}
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    return img;
  }

  function decorateRanking(){
    if(!ranking)return;
    const rows=[...ranking.querySelectorAll('.rank-row')];
    const values=rows.map(row=>numeric(row.querySelector('.rank-delta')?.textContent));
    const max=Math.max(1,...values.map(Math.abs));
    rows.forEach((row,index)=>{
      let meter=row.querySelector('.rank-meter');
      if(!meter){meter=document.createElement('span');meter.className='rank-meter';const fill=document.createElement('span');fill.className='rank-meter-fill';meter.appendChild(fill);row.appendChild(meter)}
      const fill=meter.querySelector('.rank-meter-fill');
      const value=values[index]||0;
      if(fill){fill.style.width=`${Math.max(8,Math.round(Math.abs(value)/max*100))}%`;fill.classList.toggle('down',value<0)}
      meter.setAttribute('aria-hidden','true');
    });
  }

  function decorate(){
    map.querySelectorAll('.node').forEach(node=>{
      const relation=node.querySelector('small')?.textContent||'';
      const name=node.querySelector('strong')?.textContent||'인연';
      const group=infer(relation);
      node.classList.remove('group-partner','group-family','group-friend','group-work','group-other');
      node.classList.add(`group-${group}`);
      const old=node.querySelector('.node-icon');if(old)old.remove();
      ensureImg(node,'node-animal',assetFor(group,`${name}|${relation}`));
      const score=node.querySelector('em')?.textContent||'';
      node.setAttribute('aria-label',`${name}, ${relation||label[group]}, 오행 보완도 ${score}, 상세 보기`);
    });

    const center=map.querySelector('.center-node');
    if(center){
      const old=center.querySelector('.center-animal');if(old)old.remove();
      ensureImg(center,'center-animal-img','/assets/connection-animals/cat.svg');
      center.setAttribute('aria-label',`${center.querySelector('strong')?.textContent||'나'}, 인연지도의 중심`);
    }

    if(selected&&!selected.hidden){
      const meta=selected.querySelector('.selected-head p')?.textContent||'';
      const group=infer(meta);
      selected.dataset.group=group;
      const head=selected.querySelector('.selected-head>div');
      if(head){
        const old=head.querySelector('.selected-animal');if(old)old.remove();
        const name=selected.querySelector('.selected-head h3')?.textContent||'';
        ensureImg(head,'selected-animal-img',assetFor(group,`${name}|${meta}`));
      }
    }
    decorateRanking();
  }

  let queued=false;
  const requestDecorate=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  const observer=new MutationObserver(requestDecorate);
  observer.observe(map,{childList:true,subtree:true,characterData:true});
  if(selected)observer.observe(selected,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  if(ranking)observer.observe(ranking,{childList:true,subtree:true,characterData:true});
  decorate();
})();
