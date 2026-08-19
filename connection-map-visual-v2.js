(()=>{
  const map=document.getElementById('networkMap');
  const selected=document.getElementById('selectedPerson');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;
  const sets={partner:['아내','남편','배우자','연인','애인','여자친구','남자친구','wife','husband','partner','girlfriend','boyfriend'],family:['가족','부모','엄마','아빠','어머니','아버지','할머니','할아버지','형','누나','언니','오빠','동생','아들','딸','자녀','사촌','family','mother','father','sister','brother','son','daughter'],friend:['친구','지인','동창','동문','선배','후배','베프','friend'],work:['직장','회사','동료','상사','부하','팀장','대표','사장','직원','거래처','고객','사업','비즈니스','업무','work','coworker','colleague','boss','client','business']};
  const label={partner:'연인·배우자',family:'가족',friend:'친구',work:'직장·사업',other:'기타'};
  const art={partner:['rabbit.svg'],family:['bear.svg','dog.svg'],friend:['hedgehog.svg','bear.svg'],work:['fox.svg'],other:['penguin.svg','dog.svg']};
  const infer=text=>{const v=(text||'').toLowerCase();for(const [g,words] of Object.entries(sets))if(words.some(w=>v.includes(w.toLowerCase())))return g;return'other'};
  const hash=text=>[...String(text||'')].reduce((n,ch)=>((n*33)+ch.codePointAt(0))>>>0,11);
  const assetFor=(g,key)=>{const list=art[g]||art.other;return`/assets/connection-animals/${list[hash(key)%list.length]}`};
  function ensureImg(container,className,src){let img=container.querySelector('.'+className);if(!img){img=document.createElement('img');img.className=className;img.alt='';img.setAttribute('aria-hidden','true');container.prepend(img)}if(img.getAttribute('src')!==src)img.src=src;return img}
  function sparkles(){if(map.querySelector('.map-sparkles'))return;const s=document.createElement('span');s.className='map-sparkles';s.setAttribute('aria-hidden','true');s.innerHTML='<i>♥</i><i>✦</i><i>♡</i><i>✦</i><i>♥</i>';map.appendChild(s)}
  function decorate(){
    sparkles();
    map.querySelectorAll('.node').forEach(node=>{const relation=node.querySelector('small')?.textContent||'';const name=node.querySelector('strong')?.textContent||'인연';const group=infer(relation);node.classList.remove('group-partner','group-family','group-friend','group-work','group-other');node.classList.add(`group-${group}`);node.querySelector('.node-icon')?.remove();ensureImg(node,'node-animal',assetFor(group,`${name}|${relation}`));const score=node.querySelector('em')?.textContent||'';node.setAttribute('aria-label',`${name}, ${relation||label[group]}, 오행 보완도 ${score}`);let mark=node.querySelector('.relation-mark');if(!mark){mark=document.createElement('span');mark.className='relation-mark';node.appendChild(mark)}mark.textContent=group==='partner'?'♥':group==='work'?'✦':group==='friend'?'♡':'•'});
    const center=map.querySelector('.center-node');if(center){center.querySelector('.center-animal')?.remove();ensureImg(center,'center-animal-img','/assets/connection-animals/cat.svg');center.setAttribute('aria-label',`${center.querySelector('strong')?.textContent||'나'}, 인연지도의 중심`)}
    if(selected&&!selected.hidden){const meta=selected.querySelector('.selected-head p')?.textContent||'';const group=infer(meta);const head=selected.querySelector('.selected-head>div');if(head){const name=selected.querySelector('.selected-head h3')?.textContent||'';ensureImg(head,'selected-animal-img',assetFor(group,`${name}|${meta}`))}}
    if(ranking)[...ranking.querySelectorAll('.rank-row')].forEach((row,i)=>row.dataset.rank=String(i+1));
  }
  let queued=false;const request=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};const observer=new MutationObserver(request);observer.observe(map,{childList:true,subtree:true,characterData:true});if(selected)observer.observe(selected,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});if(ranking)observer.observe(ranking,{childList:true,subtree:true,characterData:true});decorate();
})();