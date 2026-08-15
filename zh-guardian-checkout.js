(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||'').toLowerCase();
  if(!lang.startsWith('zh'))return;
  document.documentElement.lang='zh-CN';
  localStorage.setItem('lumen-lang','zh');
  const map=new Map([
    ['결제 진행하기','继续付款'],
    ['결제 준비 중…','正在准备付款…'],
    ['현재 결제 기능은 준비 중입니다.','付款功能目前尚未启用。'],
    ['현재 결제 시스템을 안전 점검 중입니다. 작성한 Guardian 주문 정보는 유지됩니다. 잠시 후 다시 시도해 주세요.','付款系统正在进行安全检查。您的 Guardian 订单信息会被保留，请稍后再试。'],
    ['결제 시스템 점검 중','付款系统检查中'],
    ['다시 시도','重试'],
    ['고객지원','客户支持'],
    ['결제창을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.','无法创建付款页面，请稍后重试。'],
    ['결제 전에 환불·취소 정책과 이용약관을 확인하고 동의해 주세요.','付款前请阅读并同意退款/取消政策和使用条款。'],
    ['최종 주문 확인','最终订单确认'],
    ['상품','商品'],
    ['결제금액','付款金额'],
    ['상품유형','商品类型'],
    ['개인화 디지털 콘텐츠','个性化数字内容'],
    ['발급 후 단순변심 환불은 제한될 수 있으며, 중복결제·시스템 오류·결제 후 품절은 정책에 따라 처리됩니다.','发行后因个人原因申请退款可能受到限制。重复付款、系统错误以及付款后售罄等情况将按照退款政策处理。'],
    ['위 내용을 확인하고 결제창 열기','确认以上内容并打开付款页面'],
    ['수정하기','修改订单'],
    ['CHECKOUT REVIEW','付款确认'],
    ['PAYMENT SAFETY HOLD','付款安全暂停'],
    ['Refund / Cancellation Policy','退款 / 取消政策'],
    ['Terms','使用条款'],
    ['Continue to payment','继续付款'],
    ['Preparing payment…','正在准备付款…'],
    ['Payment is not enabled yet.','付款功能目前尚未启用。'],
    ['Payment system check in progress','付款系统检查中'],
    ['Try again','重试'],
    ['Support','客户支持'],
    ['Could not create checkout. Please try again shortly.','无法创建付款页面，请稍后重试。'],
    ['Please review and accept the refund policy and terms before payment.','付款前请阅读并同意退款政策和使用条款。'],
    ['Final order review','最终订单确认'],
    ['Product','商品'],
    ['Amount','付款金额'],
    ['Product type','商品类型'],
    ['Personalized digital content','个性化数字内容'],
    ['Confirm and open checkout','确认并打开付款页面'],
    ['Edit order','修改订单']
  ]);
  function translate(root=document){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      const before=node.nodeValue;
      if(!before)continue;
      let next=before;
      for(const [from,to] of map){if(next.includes(from))next=next.replaceAll(from,to)}
      if(next!==before)node.nodeValue=next;
    }
  }
  translate();
  let queued=false;
  const observer=new MutationObserver(mutations=>{
    if(queued)return;
    const roots=new Set();
    for(const m of mutations){
      if(m.type==='characterData'&&m.target.parentNode)roots.add(m.target.parentNode);
      for(const node of m.addedNodes){
        if(node.nodeType===1)roots.add(node);
        else if(node.nodeType===3&&node.parentNode)roots.add(node.parentNode);
      }
    }
    if(!roots.size)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      for(const root of roots)translate(root);
    });
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
