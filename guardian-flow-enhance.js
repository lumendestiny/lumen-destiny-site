(()=>{
  const path=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
  const lang=(window.__LUMEN_LANG__||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const centeredPages=new Set(['/guardian-gift','/guardian-campaigns','/guardian-gallery','/guardian-story','/guardian-payment-result','/guardian-verify','/guardian-physical-status']);
  if(centeredPages.has(path)){
    const main=document.querySelector('main');
    if(main)main.classList.add('guardian-balanced-page');
    const balance=document.createElement('style');
    balance.textContent=`
      @media (min-width:901px){
        main.guardian-balanced-page{box-sizing:border-box;margin-inline:auto!important}
        main.guardian-balanced-page>.result-hero{margin-left:auto!important;margin-right:auto!important;text-align:center}
        main.guardian-balanced-page>.result-panel{margin-left:auto!important;margin-right:auto!important}
        main.guardian-balanced-page>.result-panel>.panel-heading{align-items:center}
        main.guardian-balanced-page .result-actions{justify-content:center}
        main.guardian-balanced-page .result-disclaimer{text-wrap:balance}
      }
      @media (min-width:901px) and (min-height:950px){
        main.guardian-balanced-page>.result-hero{padding-top:clamp(18px,2.4vh,30px)!important;padding-bottom:clamp(14px,2vh,24px)!important}
        main.guardian-balanced-page>.result-panel{padding-top:clamp(20px,2.6vh,32px);padding-bottom:clamp(20px,2.6vh,32px)}
      }
      @media (min-width:901px) and (max-height:820px){
        main.guardian-balanced-page>.result-hero{padding-top:8px!important;padding-bottom:8px!important;margin-bottom:7px!important}
        main.guardian-balanced-page>.result-panel{margin-top:7px!important;margin-bottom:7px!important}
      }
      @media (max-width:900px){
        main.guardian-balanced-page{width:min(100%,760px);margin-inline:auto!important}
        main.guardian-balanced-page>.result-hero{text-align:center}
      }
    `;
    document.head.appendChild(balance);
  }

  if(path==='/guardian-order'){
    const style=document.createElement('style');
    style.textContent=`
      .guardian-inline-error{margin:8px 0 0;padding:9px 12px;border-radius:10px;background:#fff4f1;color:#9a2f24;font-size:.76rem;line-height:1.4;font-weight:700}
      @media (min-width:901px) and (max-height:900px){
        .result-page>.result-hero{padding-top:7px!important;padding-bottom:6px!important}
        .result-page>.result-hero h1{font-size:1.95rem!important}
        .result-page>.result-hero>p:last-child{font-size:.76rem!important}
        .guardian-order-shell{gap:16px!important;margin-bottom:6px!important}
        .guardian-card-preview{height:410px!important}
        .guardian-animal-stage{min-height:168px!important}
        .guardian-animal{font-size:5.45rem!important}
        .guardian-order-panel{padding:11px 14px!important}
        .guardian-order-panel .deep-reading-grid{gap:7px!important}
        .guardian-order-panel .deep-reading-grid article{padding:8px 11px!important}
        .guardian-order-panel label{margin-bottom:5px!important}
        .guardian-order-panel input,.guardian-order-panel select{height:38px!important;min-height:38px!important}
        .guardian-order-panel textarea{height:55px!important;min-height:55px!important}
        .guardian-order-panel #guardianMessage{height:40px!important;min-height:40px!important}
        .guardian-order-panel .fortune-submit{height:39px!important;margin-top:5px!important}
        .guardian-order-panel .result-disclaimer{margin-top:5px!important;padding:6px 9px!important}
      }
    `;
    document.head.appendChild(style);
    const form=document.getElementById('guardianOrderForm');
    if(form){
      const message={ko:{name:'Guardian에 표시할 이름 또는 닉네임을 입력해 주세요.',wish:'Guardian에 담을 소망을 입력해 주세요.',recipient:'선물받는 사람의 이름 또는 닉네임을 입력해 주세요.'},en:{name:'Enter the name or nickname to display on the Guardian.',wish:'Enter the wish to include in the Guardian.',recipient:'Enter the recipient name or nickname.'},ja:{name:'Guardianに表示する名前またはニックネームを入力してください。',wish:'Guardianに込める願いを入力してください。',recipient:'受取人の名前またはニックネームを入力してください。'},tl:{name:'Ilagay ang pangalan o nickname na ipapakita sa Guardian.',wish:'Ilagay ang wish para sa Guardian.',recipient:'Ilagay ang pangalan o nickname ng tatanggap.'},vi:{name:'Nhập tên hoặc biệt danh hiển thị trên Guardian.',wish:'Nhập điều ước muốn gửi vào Guardian.',recipient:'Nhập tên hoặc biệt danh người nhận.'},zh:{name:'请输入要显示在 Guardian 上的姓名或昵称。',wish:'请输入要放入 Guardian 的愿望。',recipient:'请输入收礼人的姓名或昵称。'}}[lang]||null;
      const msg=message||{name:'Please enter a display name.',wish:'Please enter a wish.',recipient:'Please enter the recipient.'};
      const show=(el,text)=>{form.querySelector('.guardian-inline-error')?.remove();const p=document.createElement('p');p.className='guardian-inline-error';p.setAttribute('role','alert');p.textContent=text;el.insertAdjacentElement('afterend',p);el.focus();p.scrollIntoView({behavior:'smooth',block:'center'});};
      form.addEventListener('submit',e=>{form.querySelector('.guardian-inline-error')?.remove();const name=document.getElementById('guardianName'),wish=document.getElementById('guardianWish'),recipient=document.getElementById('guardianRecipient'),gift=new URLSearchParams(location.search).get('gift')==='1';if(name&&!name.value.trim()){e.preventDefault();e.stopImmediatePropagation();show(name,msg.name);return}if(gift&&recipient&&!recipient.value.trim()){e.preventDefault();e.stopImmediatePropagation();show(recipient,msg.recipient);return}if(wish&&!wish.value.trim()){e.preventDefault();e.stopImmediatePropagation();show(wish,msg.wish)}} ,true);
    }
  }

  if(path==='/guardian'){
    const actions=document.querySelector('.archive-hero .result-actions');
    if(actions&&!actions.querySelector('[data-gift-entry]')){
      const a=document.createElement('a');a.className='button secondary';a.dataset.giftEntry='1';a.href='/guardian-gift/?lang='+encodeURIComponent(lang);a.textContent=({ko:'Guardian 선물하기',en:'Gift a Guardian',ja:'Guardianを贈る',tl:'Magregalo ng Guardian',vi:'Tặng Guardian',zh:'赠送 Guardian'}[lang]||'Gift a Guardian');actions.appendChild(a);
    }
  }

  if(path==='/guardian-payment-result'){
    const labels={ko:{share:'선물 링크 공유하기',copy:'선물 링크 복사',copied:'선물 링크를 복사했습니다.',title:'Guardian 선물이 도착했습니다',text:'Guardian 인증 링크를 확인해 주세요.'},en:{share:'Share gift link',copy:'Copy gift link',copied:'Gift link copied.',title:'Your Guardian gift is here',text:'Open the Guardian verification link.'},ja:{share:'ギフトリンクを共有',copy:'ギフトリンクをコピー',copied:'ギフトリンクをコピーしました。',title:'Guardianギフトが届きました',text:'Guardian認証リンクをご確認ください。'},tl:{share:'I-share ang gift link',copy:'Kopyahin ang gift link',copied:'Nakopya ang gift link.',title:'Dumating na ang Guardian gift',text:'Buksan ang Guardian verification link.'},vi:{share:'Chia sẻ liên kết quà tặng',copy:'Sao chép liên kết',copied:'Đã sao chép liên kết quà tặng.',title:'Quà Guardian đã sẵn sàng',text:'Mở liên kết xác minh Guardian.'},zh:{share:'分享礼物链接',copy:'复制礼物链接',copied:'礼物链接已复制。',title:'Guardian 礼物已送达',text:'请打开 Guardian 验证链接。'}}[lang]||null;
    const L=labels||{share:'Share gift link',copy:'Copy gift link',copied:'Gift link copied.',title:'Guardian gift',text:'Open the Guardian verification link.'};
    const mount=()=>{const state=document.getElementById('paymentState'),verify=document.getElementById('verifyLink');if(!state||!verify||verify.hidden||state.dataset.shareReady)return;const m=(state.textContent||'').match(/LG-\d{8}-[A-Z0-9]{5,12}/);if(!m)return;state.dataset.shareReady='1';const url=new URL('/guardian-verify/',location.origin);url.searchParams.set('id',m[0]);url.searchParams.set('lang',lang);const wrap=document.createElement('div');wrap.className='result-actions';wrap.dataset.giftShare='1';const share=document.createElement('button');share.type='button';share.className='button primary';share.textContent=L.share;share.onclick=async()=>{try{if(navigator.share){await navigator.share({title:L.title,text:L.text,url:url.toString()});return}await navigator.clipboard.writeText(url.toString());share.textContent=L.copied;setTimeout(()=>share.textContent=L.share,1800)}catch{}};const copy=document.createElement('button');copy.type='button';copy.className='button secondary';copy.textContent=L.copy;copy.onclick=async()=>{try{await navigator.clipboard.writeText(url.toString());copy.textContent=L.copied;setTimeout(()=>copy.textContent=L.copy,1800)}catch{}};wrap.append(share,copy);state.insertAdjacentElement('afterend',wrap)};
    const obs=new MutationObserver(mount);const target=document.getElementById('paymentState');if(target){obs.observe(target,{childList:true,subtree:true,characterData:true});setTimeout(mount,400)}
  }
})();
