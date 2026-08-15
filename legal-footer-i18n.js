(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(window.__LUMEN_LANG__||qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';else if(lang.startsWith('ja'))lang='ja';else if(lang.startsWith('vi'))lang='vi';else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';else if(lang.startsWith('en'))lang='en';else lang='ko';
  if(lang==='ko')return;
  const labels={
    en:{privacy:'Privacy Policy',terms:'Terms of Use',refund:'Refund & Cancellation',support:'Support',guardian:'Guardian'},
    ja:{privacy:'プライバシーポリシー',terms:'利用規約',refund:'返金・キャンセル',support:'サポート',guardian:'Guardian'},
    tl:{privacy:'Privacy Policy',terms:'Terms of Use',refund:'Refund & Cancellation',support:'Support',guardian:'Guardian'},
    vi:{privacy:'Chính sách quyền riêng tư',terms:'Điều khoản sử dụng',refund:'Hoàn tiền & Hủy',support:'Hỗ trợ',guardian:'Guardian'},
    zh:{privacy:'隐私政策',terms:'使用条款',refund:'退款与取消',support:'客户支持',guardian:'Guardian'}
  }[lang];
  if(!labels)return;
  document.querySelectorAll('.footer-links a[href]').forEach(a=>{
    let pathname='';try{pathname=new URL(a.getAttribute('href'),location.origin).pathname}catch{return}
    const key=pathname.includes('privacy')?'privacy':pathname.includes('terms')?'terms':pathname.includes('refund-policy')?'refund':pathname.includes('support')?'support':pathname.includes('guardian')?'guardian':'';
    if(key&&labels[key])a.textContent=labels[key];
    try{const u=new URL(a.getAttribute('href'),location.origin);if(u.origin===location.origin){u.searchParams.set('lang',lang);a.setAttribute('href',u.pathname+u.search+u.hash)}}catch{}
  });
})();
