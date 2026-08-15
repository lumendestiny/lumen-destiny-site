(()=>{
  const normalizeLang=v=>{const x=String(v||'').toLowerCase();if(x.startsWith('zh'))return'zh';if(x.startsWith('ja'))return'ja';if(x.startsWith('vi'))return'vi';if(x.startsWith('tl')||x.startsWith('fil'))return'tl';if(x.startsWith('en'))return'en';return'ko'};
  const lang=()=>normalizeLang(new URLSearchParams(location.search).get('lang')||window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko');
  const save=(key,payload)=>{try{sessionStorage.setItem(key,JSON.stringify({v:1,createdAt:Date.now(),payload}));return true}catch{return false}};
  const validDate=(y,m,d)=>{y=Number(y);m=Number(m);d=Number(d);if(!Number.isInteger(y)||y<1900||y>2050||!Number.isInteger(m)||m<1||m>12||!Number.isInteger(d)||d<1)return false;return d<=new Date(y,m,0).getDate()};

  document.addEventListener('submit',event=>{
    const form=event.target;
    if(!(form instanceof HTMLFormElement))return;

    if(form.id==='sajuForm'){
      const y=document.getElementById('birthYear')?.value||'';
      const m=document.getElementById('birthMonth')?.value||'';
      const d=document.getElementById('birthDay')?.value||'';
      const name=(document.getElementById('userName')?.value||'').trim();
      if(!name||!validDate(y,m,d))return;
      const payload={
        name,
        gender:document.getElementById('gender')?.value||'other',
        birthYear:y,
        birthMonth:m,
        birthDay:d,
        birthTime:document.getElementById('birthTime')?.value||'',
        calendarType:document.getElementById('calendarType')?.value||'solar',
        isLeapMonth:document.getElementById('isLeapMonth')?.checked?'1':'',
        lang:lang()
      };
      if(!save('lumen-private-saju-v1',payload))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href=`/result.html?lang=${encodeURIComponent(payload.lang)}`;
      return;
    }

    if(form.id==='compatForm'){
      const payload={lang:lang()};
      for(const p of ['a','b']){
        const y=document.getElementById(p+'Year')?.value||'';
        const m=document.getElementById(p+'Month')?.value||'';
        const d=document.getElementById(p+'Day')?.value||'';
        const name=(document.getElementById(p+'Name')?.value||'').trim();
        if(!name||!validDate(y,m,d))return;
        payload[p+'Name']=name;
        payload[p+'Gender']=document.getElementById(p+'Gender')?.value||'unspecified';
        payload[p+'Birth']=`${y}-${m}-${d}`;
        payload[p+'Time']=document.getElementById(p+'Time')?.value||'';
        payload[p+'Calendar']=document.getElementById(p+'Calendar')?.value||'solar';
        payload[p+'Leap']=form.querySelector(`input[name="${p}Leap"]`)?.checked?'true':'false';
      }
      if(!save('lumen-private-compat-v1',payload))return;
      event.preventDefault();
      event.stopImmediatePropagation();
      location.href=`/compatibility-result/?lang=${encodeURIComponent(payload.lang)}`;
    }
  },true);
})();
