(()=>{
  const lang=window.__LUMEN_LANG__||new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang');
  if(!String(lang||'').toLowerCase().startsWith('zh'))return;
  const replacements=[
    ['服务器已创建发行准备记录。当前付款状态为待处理。','服务器已创建发行准备记录，当前付款状态为待处理。'],
    ['当前为浏览器预览记录。','当前仅为此浏览器中的预览记录。'],
    ['此 Guardian 标记为鼓励礼物。','此 Guardian 已标记为鼓励礼物。'],
    ['愿望正文不会存储在验证记录中。','愿望正文不会存储在公开验证记录中。'],
    ['Payment is not enabled yet.','付款功能目前尚未启用。'],
    ['Continue to payment','继续付款'],
    ['Preparing payment…','正在准备付款…'],
    ['Final order review','最终订单确认'],
    ['Product','商品'],
    ['Amount','付款金额'],
    ['Product type','商品类型'],
    ['Personalized digital content','个性化数字内容'],
    ['Confirm and open checkout','确认并打开付款页面'],
    ['Edit order','修改订单'],
    ['Try again','重试'],
    ['Support','客户支持'],
    ['Payment system check in progress','付款系统正在安全检查'],
    ['Payment is temporarily on hold.','付款系统正在进行安全检查，请稍后重试。'],
    ['Could not create checkout. Please try again shortly.','无法创建付款页面，请稍后重试。'],
    ['Please review and accept the refund policy and terms before payment.','付款前请阅读并同意退款与取消政策及使用条款。'],
    ['Refund / Cancellation Policy','退款与取消政策'],
    ['Terms','使用条款']
  ];
  function translate(root=document){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const n of nodes){
      let s=n.nodeValue;
      if(!s)continue;
      for(const [from,to] of replacements){if(s.includes(from))s=s.replaceAll(from,to)}
      if(s!==n.nodeValue)n.nodeValue=s;
    }
  }
  function decorate(){
    translate(document);
    const policy=document.getElementById('guardianPolicyAgree')?.parentElement;
    if(policy){
      const span=policy.querySelector('span');
      if(span&&!span.dataset.zhDone){
        span.dataset.zhDone='1';
        span.innerHTML='我已确认 Guardian 属于个性化数字内容，不保证任何特定结果，并已阅读 <a href="/refund-policy?lang=zh" target="_blank" rel="noopener">退款与取消政策</a> 与 <a href="/terms?lang=zh" target="_blank" rel="noopener">使用条款</a>。';
      }
    }
    const note=document.getElementById('guardianConfirmNote');
    if(note&&note.textContent){
      const before=note.innerHTML;
      const after=before
        .replace('발급 준비번호','准备编号')
        .replace('서버 발급 준비 기록이 생성되었습니다. 현재 결제 상태는 대기입니다.','服务器已创建发行准备记录，当前付款状态为待处理。')
        .replace('현재는 브라우저 미리보기 기록입니다.','当前仅为此浏览器中的预览记录。')
        .replace(' 이 Guardian은 응원 선물로 표시됩니다.',' 此 Guardian 已标记为鼓励礼物。')
        .replace(' 소망 본문은 인증 기록에 저장하지 않습니다.',' 愿望正文不会存储在公开验证记录中。')
        .replace('인증 화면 확인 →','查看验证页面 →');
      if(after!==before)note.innerHTML=after;
    }
  }
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;decorate()});
  });
  decorate();
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
