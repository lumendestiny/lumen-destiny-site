(()=>{
  const qs=new URLSearchParams(location.search);
  const id=(qs.get('id')||qs.get('guardianId')||'').trim().toUpperCase();
  const verify=document.getElementById('verifyLink');
  const actions=document.querySelector('.result-actions');
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';else if(lang.startsWith('ja'))lang='ja';else if(lang.startsWith('vi'))lang='vi';else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';else if(lang.startsWith('en'))lang='en';else lang='ko';
  if(id&&verify)verify.href='/guardian-verify/?id='+encodeURIComponent(id)+'&lang='+encodeURIComponent(lang);
  if(!id||!actions)return;
  const labels={ko:['Guardian ID 복사','복사됨'],en:['Copy Guardian ID','Copied'],ja:['Guardian IDをコピー','コピー済み'],tl:['Kopyahin ang Guardian ID','Nakopya'],vi:['Sao chép Guardian ID','Đã sao chép'],zh:['复制 Guardian ID','已复制']};
  const [copyLabel,copiedLabel]=labels[lang]||labels.ko;
  const btn=document.createElement('button');
  btn.type='button';btn.className='button secondary';btn.textContent=copyLabel;btn.dataset.guardianCopy='1';
  btn.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(id)}catch{const ta=document.createElement('textarea');ta.value=id;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
    const old=btn.textContent;btn.textContent=copiedLabel;setTimeout(()=>btn.textContent=old,1600);
  });
  const refresh=document.getElementById('paymentRefresh');
  if(refresh&&refresh.nextSibling)actions.insertBefore(btn,refresh.nextSibling);else actions.prepend(btn);
})();