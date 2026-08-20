(()=>{
  const ids=new Set(['wealth','yearly','monthly','today']);
  const services=document.querySelector('.fortune-services');
  if(!services)return;

  function focusCard(id,scroll=true){
    if(!ids.has(id))return;
    services.querySelectorAll('.fortune-service-card').forEach(card=>card.classList.toggle('focused',card.id===id));
    document.querySelectorAll('.main-fortune-nav a[href^="#"]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${id}`));
    if(scroll){
      const top=services.getBoundingClientRect().top+window.scrollY;
      const offset=window.matchMedia('(max-width:780px)').matches?12:24;
      window.scrollTo({top:Math.max(0,top-offset),behavior:'smooth'});
    }
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest('.main-fortune-nav a[href^="#"]');
    if(!a)return;
    const id=(a.getAttribute('href')||'').slice(1);
    if(!ids.has(id))return;
    e.preventDefault();
    history.replaceState(null,'',`#${id}`);
    focusCard(id,true);
  });

  const initial=(location.hash||'').slice(1);
  if(ids.has(initial))requestAnimationFrame(()=>focusCard(initial,true));
  window.addEventListener('hashchange',()=>focusCard((location.hash||'').slice(1),true));
})();
