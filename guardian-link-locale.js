(()=>{
  const raw=window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||'ko';
  const value=String(raw).toLowerCase();
  const lang=value.startsWith('zh')?'zh':value.startsWith('ja')?'ja':value.startsWith('vi')?'vi':(value.startsWith('tl')||value.startsWith('fil'))?'tl':value.startsWith('en')?'en':'ko';
  const apply=root=>{
    const links=[];
    if(root?.matches?.('a[href*="guardian-order"]'))links.push(root);
    root?.querySelectorAll?.('a[href*="guardian-order"]').forEach(a=>links.push(a));
    for(const a of links){
      try{
        const u=new URL(a.getAttribute('href'),location.origin);
        if(u.origin!==location.origin)continue;
        u.searchParams.set('lang',lang);
        a.setAttribute('href',u.pathname+u.search+u.hash);
      }catch{}
    }
  };
  apply(document);
  const observer=new MutationObserver(ms=>{
    for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)apply(n);
  });
  observer.observe(document.body,{subtree:true,childList:true});
})();
