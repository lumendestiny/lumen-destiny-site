(()=>{
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
  const icon={partner:'♥',family:'●',friend:'✦',work:'◆',other:'◎'};
  const label={partner:'연인·배우자',family:'가족',friend:'친구',work:'직장·사업',other:'기타'};
  const infer=text=>{
    const value=(text||'').toLowerCase();
    for(const [group,words] of Object.entries(sets))if(words.some(w=>value.includes(w.toLowerCase())))return group;
    return 'other';
  };
  const numeric=text=>{const match=String(text||'').replace(/,/g,'').match(/[+-]?\d+(?:\.\d+)?/);return match?Number(match[0]):0};
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
      const group=infer(relation);
      node.classList.remove('group-partner','group-family','group-friend','group-work','group-other');
      node.classList.add(`group-${group}`);
      let mark=node.querySelector('.node-icon');
      if(!mark){mark=document.createElement('span');mark.className='node-icon';node.prepend(mark)}
      mark.textContent=icon[group];
      mark.setAttribute('aria-hidden','true');
      const name=node.querySelector('strong')?.textContent||'인연';
      const score=node.querySelector('em')?.textContent||'';
      node.setAttribute('aria-label',`${name}, ${relation||label[group]}, 오행 보완도 ${score}, 상세 보기`);
    });
    const center=map.querySelector('.center-node');
    if(center)center.setAttribute('aria-label',`${center.querySelector('strong')?.textContent||'나'}, 인연지도의 중심`);
    if(selected&&!selected.hidden){
      const meta=selected.querySelector('.selected-head p')?.textContent||'';
      const group=infer(meta);
      selected.dataset.group=group;
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
