(()=>{
  if(location.pathname.startsWith('/connection-map')&&!window.__LUMEN_CONNECTION_STORAGE_SCOPED__){
    const userId=String(localStorage.getItem('lumen-auth-user-id')||'').trim();
    if(userId){
      window.__LUMEN_CONNECTION_STORAGE_SCOPED__=true;
      const keyMap={'lumen-connection-profile-v1':`lumen-connection-profile-v2:${userId}`,'lumen-connection-network-web-v1':`lumen-connection-network-web-v2:${userId}`};
      const originalGet=Storage.prototype.getItem,originalSet=Storage.prototype.setItem,originalRemove=Storage.prototype.removeItem;
      Storage.prototype.getItem=function(key){return originalGet.call(this,keyMap[key]||key)};
      Storage.prototype.setItem=function(key,value){return originalSet.call(this,keyMap[key]||key,value)};
      Storage.prototype.removeItem=function(key){return originalRemove.call(this,keyMap[key]||key)};
    }
  }

  if(!document.querySelector('link[href*="/auth-shell.css"]')){
    const authCss=document.createElement('link');
    authCss.rel='stylesheet';
    authCss.href='/auth-shell.css?v=20260816-1';
    document.head.appendChild(authCss);
  }
  if(!document.querySelector('script[src*="/auth-runtime.js"]')){
    const authRuntime=document.createElement('script');
    authRuntime.type='module';
    authRuntime.src='/auth-runtime.js?v=20260816-1';
    document.head.appendChild(authRuntime);
  }

  document.querySelectorAll('link[href*="header-language-v2.css"]').forEach(el=>el.remove());
  const f=document.createElement('link');
  f.rel='stylesheet';
  f.href='/header-language-v2.css?v=20260812-7';
  document.head.appendChild(f);

  const qs=new URLSearchParams(location.search);
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||'ko').toLowerCase();
  if(lang.startsWith('zh'))lang='zh';
  else if(lang.startsWith('ja'))lang='ja';
  else if(lang.startsWith('vi'))lang='vi';
  else if(lang.startsWith('tl')||lang.startsWith('fil'))lang='tl';
  else if(lang.startsWith('en'))lang='en';
  else lang='ko';

  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  localStorage.setItem('lumen-lang',lang);

  const main=document.querySelector('main');
  if(main&&!main.id)main.id='main-content';
  if(main&&!document.querySelector('.skip-link')){
    const labels={ko:'본문으로 바로가기',en:'Skip to main content',ja:'本文へスキップ',tl:'Lumaktaw sa pangunahing nilalaman',vi:'Bỏ qua đến nội dung chính',zh:'跳到主要内容'};
    const skip=document.createElement('a');
    skip.className='skip-link';
    skip.href='#main-content';
    skip.tabIndex=0;
    skip.textContent=labels[lang]||labels.ko;
    skip.setAttribute('aria-label',labels[lang]||labels.ko);
    document.body.prepend(skip);
  }

  const stack=document.querySelector('.brand-language-stack');
  const brand=document.querySelector('.brand');
  if(brand){
    const brandNames={ko:'루멘 명운',en:'Lumen Destiny',ja:'ルーメン・デスティニー',tl:'Lumen Destiny',vi:'Lumen Destiny',zh:'Lumen Destiny'};
    brand.textContent=brandNames[lang]||brandNames.ko;
    brand.setAttribute('aria-label',brandNames[lang]||brandNames.ko);
  }

  const fv='20260812-locked-2';
  const languageItems=[
    ['ko','한국어','/assets/flags/kr-official-locked-v2.svg?rev='+fv],
    ['en','English','/assets/flags/us-official.svg?v='+fv],
    ['ja','日本語','/assets/flags/ja.svg?v='+fv],
    ['tl','Tagalog','/assets/flags/tl.svg?v='+fv],
    ['vi','Tiếng Việt','/assets/flags/vi.svg?v='+fv],
    ['zh','简体中文','/assets/flags/zh.svg?v='+fv]
  ];
  const languageLabels={ko:'언어 선택',en:'Choose language',ja:'言語を選択',tl:'Pumili ng wika',vi:'Chọn ngôn ngữ',zh:'选择语言'};
  function makeLangButton(code,label,src){
    const b=document.createElement('button');
    b.type='button';
    b.className='lang-choice'+(code===lang?' active':'');
    b.dataset.lang=code;
    b.setAttribute('aria-label',label);
    b.setAttribute('aria-pressed',code===lang?'true':'false');
    b.title=label;
    const img=document.createElement('img');
    img.className='flag-icon';
    img.src=src;
    img.alt='';
    img.width=36;
    img.height=24;
    b.appendChild(img);
    b.addEventListener('click',()=>{
      localStorage.setItem('lumen-lang',code);
      const u=new URL(location.href);
      u.searchParams.set('lang',code);
      location.href=u.toString();
    });
    return b;
  }
  if(stack){
    let box=stack.querySelector('.language-switcher');
    if(!box){
      box=document.createElement('div');
      box.className='language-switcher';
      stack.appendChild(box);
    }
    box.setAttribute('role','group');
    box.setAttribute('aria-label',languageLabels[lang]||languageLabels.ko);
    box.replaceChildren(...languageItems.map(([code,label,src])=>makeLangButton(code,label,src)));
  }

  const nav=document.querySelector('.main-fortune-nav');
  const common={
    ko:{saju:'무료사주',wealth:'금전운',year:'신년운세',month:'월간운세',today:'오늘의 운세',compat:'궁합',connection:'인연지도',guardian:'가디언'},
    en:{saju:'Free Saju',wealth:'Money',year:'Year',month:'Month',today:'Today',compat:'Compatibility',connection:'Connection Map',guardian:'Guardian'},
    ja:{saju:'無料四柱',wealth:'金運',year:'新年運',month:'月運',today:'今日の運勢',compat:'相性',connection:'ご縁マップ',guardian:'ガーディアン'},
    tl:{saju:'Free Saju',wealth:'Pera',year:'Taon',month:'Buwan',today:'Ngayon',compat:'Compatibility',connection:'Connection Map',guardian:'Guardian'},
    vi:{saju:'Tứ trụ miễn phí',wealth:'Tài vận',year:'Năm',month:'Tháng',today:'Hôm nay',compat:'Hợp tuổi',connection:'Bản đồ quan hệ',guardian:'Guardian'},
    zh:{saju:'免费四柱',wealth:'财运',year:'新年运势',month:'月运',today:'今日运势',compat:'合婚',connection:'缘分地图',guardian:'Guardian'}
  }[lang]||{};

  const stable=new Set(['/compatibility','/compatibility-result','/connection-map','/guardian','/guardian-order','/guardian-gift','/guardian-campaigns','/guardian-gallery','/guardian-physical-status','/guardian-verify','/guardian-story','/login']);
  const stablePath=p=>{
    p=p.replace(/\.html$/,'').replace(/\/$/,'');
    return stable.has(p)?p:p||'/';
  };
  const stableHrefPath=p=>{
    const normalized=stablePath(p);
    return normalized!=='/'&&stable.has(normalized)?normalized+'/':normalized;
  };

  if(nav){
    nav.querySelectorAll('a[href*="consult"]').forEach(a=>a.remove());
    const guardianPage=location.pathname.startsWith('/guardian');
    if(guardianPage){
      const labels={
        ko:['가디언','부적 아카이브','좋은 소식','실물 카드 상태','인증'],
        en:['Guardian','Talisman Archive','Good News','Physical Card','Verify'],
        ja:['ガーディアン','お守りアーカイブ','良い知らせ','実物カード','認証'],
        tl:['Guardian','Talisman Archive','Good News','Physical Card','Verify'],
        vi:['Guardian','Kho bùa hộ mệnh','Tin vui','Thẻ vật lý','Xác minh'],
        zh:['Guardian','护符档案','好消息','实体卡状态','验证']
      }[lang]||[];
      const items=[
        ['/guardian',labels[0]],
        ['/guardian/#purpose-guardians',labels[1]],
        ['/guardian-gallery',labels[2]],
        ['/guardian-physical-status',labels[3]],
        ['/guardian-verify',labels[4]]
      ];
      const syncGuardianActive=()=>{
        const currentPath=stablePath(location.pathname);
        const archiveActive=currentPath==='/guardian'&&location.hash==='#purpose-guardians';
        nav.querySelectorAll('a').forEach(a=>{
          a.classList.remove('active');
          a.removeAttribute('aria-current');
          const href=a.getAttribute('href')||'';
          const u=new URL(href,location.origin);
          const path=stablePath(u.pathname);
          const isArchive=u.hash==='#purpose-guardians';
          const active=isArchive?archiveActive:(!archiveActive&&path===currentPath);
          if(active){
            a.classList.add('active');
            a.setAttribute('aria-current','page');
          }
        });
      };
      nav.innerHTML='';
      items.forEach(([href,text])=>{
        const a=document.createElement('a');
        a.href=href;
        a.textContent=text;
        a.addEventListener('click',()=>requestAnimationFrame(syncGuardianActive));
        nav.appendChild(a);
      });
      syncGuardianActive();
      window.addEventListener('hashchange',syncGuardianActive);
    }else{
      const map=[
        ['a[href*="#analysis"]','saju'],
        ['a[href*="#wealth"]','wealth'],
        ['a[href*="#year"]','year'],
        ['a[href*="#month"]','month'],
        ['a[href*="#today"]','today'],
        ['a[href*="compatibility"]','compat'],
        ['a[href*="connection-map"]','connection']
      ];
      map.forEach(([sel,key])=>{
        const a=nav.querySelector(sel);
        if(a&&common[key])a.textContent=common[key];
      });
      let connection=nav.querySelector('a[href*="connection-map"]');
      if(!connection){
        connection=document.createElement('a');
        connection.href='/connection-map';
        nav.appendChild(connection);
      }
      connection.textContent=common.connection||'Connection Map';
      if(stablePath(location.pathname)==='/connection-map'){
        connection.classList.add('active');
        connection.setAttribute('aria-current','page');
      }
      let g=nav.querySelector('a[href*="guardian"]');
      if(!g){
        g=document.createElement('a');
        g.className='guardian-nav-link';
        nav.appendChild(g);
      }
      g.href='/guardian';
      g.textContent=common.guardian||'Guardian';
    }
    requestAnimationFrame(()=>{
      const active=nav.querySelector('.active,[aria-current="page"]');
      if(active&&nav.scrollWidth>nav.clientWidth)active.scrollIntoView({behavior:'instant',block:'nearest',inline:'center'});
    });
  }

  document.querySelectorAll('a[href]').forEach(a=>{
    try{
      const raw=a.getAttribute('href');
      if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('http'))return;
      const u=new URL(raw,location.origin);
      if(u.origin!==location.origin)return;
      u.pathname=stableHrefPath(u.pathname);
      u.searchParams.set('lang',lang);
      a.setAttribute('href',u.pathname+u.search+u.hash);
    }catch{}
  });

  window.__LUMEN_LANG__=lang;
  if(location.pathname.startsWith('/guardian')){
    if(!document.querySelector('script[src*="/guardian-i18n.js"]')){
      const s=document.createElement('script');
      s.src='/guardian-i18n.js?v=20260812-4';
      s.defer=true;
      document.head.appendChild(s);
    }
    if(!document.querySelector('script[src*="/guardian-locale-polish.js"]')){
      const polish=document.createElement('script');
      polish.src='/guardian-locale-polish.js?v=20260816-1';
      polish.defer=true;
      document.head.appendChild(polish);
    }
    if(!document.querySelector('script[src*="/guardian-flow-enhance.js"]')){
      const flow=document.createElement('script');
      flow.src='/guardian-flow-enhance.js?v=20260814-1';
      flow.defer=true;
      document.head.appendChild(flow);
    }
    if(stablePath(location.pathname)==='/guardian'&&!document.querySelector('script[src*="/guardian-archive-art.js"]')){
      const art=document.createElement('script');
      art.src='/guardian-archive-art.js?v=20260814-1';
      art.defer=true;
      document.head.appendChild(art);
    }
    if(stablePath(location.pathname)==='/guardian-order'&&!document.querySelector('script[src*="/guardian-order-policy-i18n.js"]')){
      const policy=document.createElement('script');
      policy.src='/guardian-order-policy-i18n.js?v=20260815-1';
      policy.defer=true;
      document.head.appendChild(policy);
    }
  }

  if(!document.querySelector('script[src*="/accessibility-labels.js"]')){
    const a11y=document.createElement('script');
    a11y.src='/accessibility-labels.js?v=20260815-1';
    a11y.defer=true;
    document.head.appendChild(a11y);
  }
  if(lang==='zh'&&!document.querySelector('script[src*="/zh-i18n.js"]')){
    const z=document.createElement('script');
    z.src='/zh-i18n.js?v=20260812-2';
    z.defer=true;
    document.head.appendChild(z);
  }
  if(!document.querySelector('script[src*="/flag-runtime-lock.js"]')){
    const flagLock=document.createElement('script');
    flagLock.src='/flag-runtime-lock.js?v=20260812-2';
    flagLock.defer=true;
    document.head.appendChild(flagLock);
  }
  if(!document.querySelector('script[src*="/recovery-ui.js"]')){
    const recovery=document.createElement('script');
    recovery.src='/recovery-ui.js?v=20260812-1';
    recovery.defer=true;
    document.head.appendChild(recovery);
  }
})();
