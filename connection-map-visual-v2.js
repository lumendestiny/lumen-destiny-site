(()=>{
  const map=document.getElementById('networkMap');
  const selected=document.getElementById('selectedPerson');
  const ranking=document.getElementById('contributionRanking');
  if(!map)return;
  const ELEMENTS=['목','화','토','금','수'],PROFILE_KEY='lumen-connection-profile-v1',NETWORK_KEY='lumen-connection-network-web-v1';
  const BASE='/assets/connection-animals/reference-v9/';
  const elementArt={'화':{name:'불여우',src:BASE+'fire.svg'},'수':{name:'물돌고래',src:BASE+'water.svg'},'토':{name:'별부엉이',src:BASE+'earth.svg'},'목':{name:'숲거북',src:BASE+'wood.svg'},'금':{name:'달토끼',src:BASE+'metal.svg'}};
  const centerCat={name:'보라 고양이',src:BASE+'center.svg'};
  const elementClass={'목':'wood','화':'fire','토':'earth','금':'metal','수':'water'},elementLabel={'목':'목(木)','화':'화(火)','토':'토(土)','금':'금(金)','수':'수(水)'};
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const dominant=e=>{if(!e)return'토';let b=ELEMENTS[0],v=-Infinity;for(const k of ELEMENTS){const n=Number(e[k]||0);if(n>v){b=k;v=n}}return b};
  const networkData=()=>read(NETWORK_KEY,[]),profileData=()=>read(PROFILE_KEY,null);
  const memberForNode=n=>networkData().find(m=>String(m.id)===String(n.dataset.node||''))||null;
  function styles(){if(document.getElementById('exactV9Characters'))return;const s=document.createElement('style');s.id='exactV9Characters';s.textContent=`.node-animal,.center-animal-img,.selected-animal-img{object-fit:contain!important;background:transparent!important;border:0!important;filter:drop-shadow(0 10px 9px rgba(62,44,127,.2))}.node-animal{position:absolute;left:50%;top:-43px;transform:translateX(-50%);width:90px!important;height:90px!important;z-index:3}.center-animal-img{width:138px!important;height:138px!important;margin-top:-50px!important}.selected-animal-img{width:64px!important;height:64px!important}.element-badge{display:block;margin:3px auto 0;font-size:8px;font-weight:900;color:#746d83}.center-element-badge{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);padding:2px 7px;border-radius:999px;background:#fff;color:#5d48c8;font-size:8px;font-weight:900;z-index:4}@media(max-width:720px){.node-animal{width:70px!important;height:70px!important;top:-33px}.center-animal-img{width:104px!important;height:104px!important;margin-top:-36px}}`;document.head.appendChild(s)}
  function img(el,cls,src){let i=el.querySelector('.'+cls);if(!i){i=document.createElement('img');i.className=cls;i.alt='';i.decoding='async';el.prepend(i)}i.src=src;return i}
  function cls(el,e){Object.values(elementClass).forEach(c=>el.classList.remove('element-'+c));el.classList.add('element-'+(elementClass[e]||'earth'))}
  function decorate(){styles();map.querySelectorAll('.node').forEach(n=>{const m=memberForNode(n),e=dominant(m?.elements),a=elementArt[e];cls(n,e);n.querySelector('.node-icon')?.remove();img(n,'node-animal',a.src);let b=n.querySelector('.element-badge');if(!b){b=document.createElement('span');b.className='element-badge';n.appendChild(b)}b.textContent=elementLabel[e]});const c=map.querySelector('.center-node');if(c){const e=dominant(profileData()?.elements);cls(c,e);c.querySelector('.center-animal')?.remove();img(c,'center-animal-img',centerCat.src);let b=c.querySelector('.center-element-badge');if(!b){b=document.createElement('span');b.className='center-element-badge';c.appendChild(b)}b.textContent=elementLabel[e]}if(ranking)[...ranking.querySelectorAll('.rank-row')].forEach((r,i)=>r.dataset.rank=String(i+1))}
  let q=false;const req=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;decorate()})};new MutationObserver(req).observe(map,{childList:true,subtree:true,characterData:true});window.addEventListener('storage',req);decorate();
})();