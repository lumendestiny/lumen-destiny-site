(()=>{
  const path=location.pathname;
  const isSaju=/\/result(?:\.html)?\/?$/.test(path);
  const isCompat=/\/compatibility-result\/?$/.test(path);
  if(!isSaju&&!isCompat)return;

  const key=isSaju?'lumen-private-saju-v1':'lumen-private-compat-v1';
  const sensitive=isSaju?['name','gender','birthYear','birthMonth','birthDay','birthTime','calendarType','isLeapMonth']:['aName','aGender','aBirth','aTime','aCalendar','aLeap','bName','bGender','bBirth','bTime','bCalendar','bLeap'];
  const current=new URLSearchParams(location.search);
  const hasSensitive=sensitive.some(k=>current.has(k));

  if(!hasSensitive){
    try{
      const saved=JSON.parse(sessionStorage.getItem(key)||'null');
      if(saved?.v===1&&saved?.payload&&Date.now()-Number(saved.createdAt||0)<30*60*1000){
        const q=new URLSearchParams();
        const language=current.get('lang')||saved.payload.lang||'ko';
        q.set('lang',language);
        for(const k of sensitive){const v=saved.payload[k];if(v!==undefined&&v!==null&&String(v)!=='')q.set(k,String(v));}
        history.replaceState(history.state,'',`${path}?${q.toString()}${location.hash||''}`);
        window.__LUMEN_PRIVATE_RESULT_BRIDGED__=true;
      }
    }catch{}
  }

  const cleanup=()=>{
    const success=isSaju?Boolean(document.getElementById('manseContent')&&!document.getElementById('manseContent').hidden):Boolean(document.getElementById('compatContent')&&!document.getElementById('compatContent').hidden);
    if(!success)return false;
    try{sessionStorage.removeItem(key)}catch{}
    const q=new URLSearchParams();
    const language=new URLSearchParams(location.search).get('lang')||window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||'ko';
    q.set('lang',language);
    history.replaceState(history.state,'',`${path}?${q.toString()}${location.hash||''}`);
    window.__LUMEN_PRIVATE_RESULT_CLEAN__=true;
    return true;
  };

  window.addEventListener('load',()=>{
    let attempts=0;
    const timer=setInterval(()=>{
      attempts++;
      if(cleanup()||attempts>=40)clearInterval(timer);
    },250);
  },{once:true});
})();
