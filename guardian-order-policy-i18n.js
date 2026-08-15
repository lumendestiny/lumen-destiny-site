(()=>{
  const params=new URLSearchParams(location.search);
  let lang=(window.__LUMEN_LANG__||params.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';
  else if(lang.startsWith('ja'))lang='ja';
  else if(lang.startsWith('vi'))lang='vi';
  else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';
  else if(lang.startsWith('en'))lang='en';
  else lang='ko';

  const copy={
    ko:{lead:'Guardian이 개인화 디지털 콘텐츠이며 특정 결과를 보장하지 않는다는 점을 이해했으며 다음 내용을 확인했습니다: ',refund:'환불·취소 정책',terms:'이용약관',preview:'선택한 Guardian 카드 미리보기',agree:'Guardian 정책 및 이용약관 확인'},
    en:{lead:'I understand that Guardian is personalized digital content and does not guarantee any specific result. I have reviewed: ',refund:'Refund & cancellation policy',terms:'Terms of Use',preview:'Selected Guardian card preview',agree:'Confirm Guardian policy and Terms of Use'},
    ja:{lead:'Guardianがパーソナライズされたデジタルコンテンツであり、特定の結果を保証しないことを理解し、次の内容を確認しました：',refund:'返金・キャンセルポリシー',terms:'利用規約',preview:'選択したGuardianカードのプレビュー',agree:'Guardianポリシーと利用規約を確認'},
    tl:{lead:'Nauunawaan kong personalized digital content ang Guardian at hindi ito garantiya ng partikular na resulta. Nabasa ko ang: ',refund:'Patakaran sa refund at cancellation',terms:'Terms of Use',preview:'Preview ng napiling Guardian card',agree:'Kumpirmahin ang Guardian policy at Terms of Use'},
    vi:{lead:'Tôi hiểu Guardian là nội dung số được cá nhân hóa và không bảo đảm kết quả cụ thể. Tôi đã xem: ',refund:'Chính sách hoàn tiền và hủy',terms:'Điều khoản sử dụng',preview:'Xem trước thẻ Guardian đã chọn',agree:'Xác nhận chính sách Guardian và Điều khoản sử dụng'},
    zh:{lead:'我已了解 Guardian 属于个性化数字内容且不保证特定结果，并已查看：',refund:'退款与取消政策',terms:'使用条款',preview:'所选 Guardian 卡片预览',agree:'确认 Guardian 政策与使用条款'}
  }[lang];
  if(!copy)return;

  function apply(){
    const consent=document.querySelector('.guardian-policy-consent>span');
    if(consent){
      const refund=document.createElement('a');
      refund.href='/refund-policy.html';
      refund.target='_blank';
      refund.rel='noopener';
      refund.textContent=copy.refund;

      const terms=document.createElement('a');
      terms.href='/terms.html';
      terms.target='_blank';
      terms.rel='noopener';
      terms.textContent=copy.terms;

      consent.replaceChildren(document.createTextNode(copy.lead),refund,document.createTextNode(' · '),terms);
    }

    const preview=document.querySelector('.guardian-preview-column');
    if(preview)preview.setAttribute('aria-label',copy.preview);
    const agree=document.getElementById('guardianPolicyAgree');
    if(agree)agree.setAttribute('aria-label',copy.agree);

    // Mobile Chromium/WebKit can keep the native select at 15px even when the
    // surrounding page inherits 16px. An inline important value prevents that
    // browser-default fallback and also avoids iOS focus zoom on these controls.
    if(window.matchMedia('(max-width:900px)').matches){
      for(const id of ['guardianTier','guardianWishType']){
        const el=document.getElementById(id);
        if(el){
          el.style.setProperty('font-size','16px','important');
          el.style.setProperty('line-height','1.4','important');
        }
      }
    }
  }

  // service-shell may inject this helper before the page's deferred guardian-i18n.js
  // has executed. Apply after window load so the localized policy and mobile
  // native-control sizing always win the race.
  if(document.readyState==='complete')apply();
  else window.addEventListener('load',apply,{once:true});
})();
