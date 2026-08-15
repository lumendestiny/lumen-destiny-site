(()=>{
  const MAX_RETRIES=2;
  document.addEventListener('error',(event)=>{
    const img=event.target;
    if(!(img instanceof HTMLImageElement)) return;
    if(!img.classList.contains('gc2-hd-img')) return;

    const tries=Number(img.dataset.lumenRetry||'0');
    if(tries>=MAX_RETRIES) return;

    event.stopPropagation();
    if(typeof event.stopImmediatePropagation==='function') event.stopImmediatePropagation();

    img.dataset.lumenRetry=String(tries+1);
    const url=new URL(img.currentSrc||img.src,window.location.href);
    url.searchParams.set('retry',`${Date.now()}-${tries+1}`);
    img.src=url.toString();
  },true);

  function prioritizeBasic(){
    document.querySelectorAll('.gc2-basic .gc2-hd-img').forEach((img)=>{
      img.loading='eager';
      img.fetchPriority='high';
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(prioritizeBasic,0));
  }else{
    setTimeout(prioritizeBasic,0);
  }
})();
