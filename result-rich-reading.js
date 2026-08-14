(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  if(!lang.startsWith('ko')) return;
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const txt=el=>(el?.textContent||'').replace(/\s+/g,' ').trim();
  const elementTips={
    목:{name:'목(木)',plain:'성장·기획·확장',strength:'새로운 방향을 만들고 시작점을 잡는 힘',watch:'일을 너무 많이 벌이거나 결과를 기다리지 못하는 조급함',work:'기획, 학습, 새로운 프로젝트를 단계별로 키우는 방식'},
    화:{name:'화(火)',plain:'표현·속도·활력',strength:'사람에게 에너지를 전달하고 분위기를 움직이는 힘',watch:'감정과 속도가 앞서 판단이 빨라질 수 있는 점',work:'중요한 결정은 한 번 식힌 뒤 다시 확인하고, 표현력은 적극적으로 활용하는 방식'},
    토:{name:'토(土)',plain:'안정·관리·현실성',strength:'흐트러진 것을 정리하고 오래 유지하는 힘',watch:'변화가 필요한 순간에도 익숙한 방식을 오래 붙잡을 수 있는 점',work:'기준과 루틴을 만들되 정기적으로 바꿀 부분을 점검하는 방식'},
    금:{name:'금(金)',plain:'판단·원칙·정리',strength:'기준을 세우고 불필요한 것을 걷어내는 힘',watch:'기준이 강해지면 자신이나 타인에게 지나치게 엄격해질 수 있는 점',work:'결정 기준을 명확히 하되 예외와 여유를 함께 두는 방식'},
    수:{name:'수(水)',plain:'정보·유연성·통찰',strength:'상황을 읽고 여러 가능성을 연결하는 힘',watch:'생각이 많아져 실행 시점이 늦어질 수 있는 점',work:'정보 수집 시간과 실행 시간을 분리해 실제 행동으로 연결하는 방식'}
  };
  const stemPlain={갑:'큰 나무처럼 방향을 세우고 앞으로 밀고 가려는 성향',을:'덩굴과 풀처럼 상황에 맞춰 유연하게 길을 찾는 성향',병:'햇빛처럼 존재감과 표현력이 비교적 분명한 성향',정:'등불처럼 세밀하게 살피고 필요한 곳에 집중하는 성향',무:'큰 땅처럼 안정감과 책임을 중시하는 성향',기:'밭과 흙처럼 현실적으로 돌보고 정리하는 성향',경:'단단한 쇠처럼 기준과 결단을 중시하는 성향',신:'보석처럼 섬세한 판단과 완성도를 중시하는 성향',임:'큰 물처럼 넓게 보고 흐름을 읽으려는 성향',계:'비와 이슬처럼 세밀하게 관찰하고 감지하는 성향'};
  function dominantElement(){const strong=txt(document.querySelector('#elementSummary strong'));const m=strong.match(/[목화토금수]/);if(m)return m[0];const bars=[...document.querySelectorAll('#elementChart .element-label')].map(x=>txt(x)).join(' ');return (bars.match(/[목화토금수]/)||['토'])[0]}
  function dayStem(){const cards=[...document.querySelectorAll('#pillarGrid .pillar-card')];const v=txt(cards[2]?.querySelector('strong'));return (v.match(/[갑을병정무기경신임계]/)||[''])[0]}
  function relationSummary(){const items=[...document.querySelectorAll('#relationGrid .relation-item')].map(x=>txt(x)).filter(Boolean);return items.slice(0,3).join(' · ')||'큰 충돌 관계가 두드러지지 않아, 특정 한 요소보다 전체 균형을 보는 편이 좋습니다.'}
  function existing(id){return txt(document.getElementById(id))}
  function currentDateCopy(){const d=new Date();return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 기준`}
  function render(){
    const content=document.getElementById('manseContent');
    if(!content||content.hidden||document.getElementById('lumenRichReading'))return false;
    const el=dominantElement(), tip=elementTips[el]||elementTips.토, stem=dayStem();
    const wealth=existing('wealthText'), year=existing('yearText'), month=existing('monthText'), today=existing('todayText');
    const section=document.createElement('section');
    section.id='lumenRichReading';section.className='result-panel';
    section.innerHTML=`<div class="panel-heading"><div><p class="section-label">EASY LUMEN READING</p><h2>쉽게 풀어보는 나의 사주와 운세</h2><p class="panel-copy">전문 용어를 그대로 나열하기보다 “그래서 내 생활에서는 어떻게 이해하면 되는지”를 중심으로 정리했습니다.</p></div><span class="engine-badge">쉬운 해설</span></div>
      <div class="deep-reading-grid" style="margin-top:18px">
        <article><span>나의 기본 성향</span><h3>${esc(stem?stem+'일간':'일간 중심')}을 쉽게 말하면</h3><p>${esc(stemPlain[stem]||'한 가지 성향으로 단정하기보다 일간과 오행의 균형을 함께 보는 것이 중요합니다.')}</p><p>특히 <strong>${tip.name}</strong> 기운이 눈에 띄며, 일상에서는 <strong>${tip.plain}</strong>과 연결해서 이해하면 쉽습니다.</p></article>
        <article><span>내가 잘 쓰면 좋은 힘</span><h3>${tip.strength}</h3><p>${tip.work}이 현재 명식의 장점을 현실에서 활용하는 방법이 될 수 있습니다.</p></article>
        <article><span>조심해서 볼 부분</span><h3>장점이 과해질 때</h3><p>${tip.watch}을 체크해 보세요. 사주는 “좋다/나쁘다”보다 어떤 힘을 어느 정도로 쓰는지가 더 중요합니다.</p></article>
        <article><span>관계에서 보이는 흐름</span><h3>사람과 부딪히는 방식</h3><p>${esc(relationSummary())}</p><p>관계 표시는 상대와의 좋고 나쁨을 확정하는 신호가 아니라, 반응 방식이 달라질 수 있는 지점을 알려주는 참고자료입니다.</p></article>
      </div>
      <div class="reading-box" style="margin-top:18px"><p><strong>금전운 — 돈을 버는 것보다 돈을 다루는 방식까지 봅니다.</strong></p><p>${esc(wealth||'수입 기회만 보지 말고 지출, 저축, 투자 한도를 함께 정해 두는 것이 좋습니다.')}</p><p>실생활에서는 ① 고정비 ② 비상자금 ③ 투자·도전 자금처럼 돈의 역할을 나누면 판단이 쉬워집니다. 큰 기회가 보여도 “얼마까지 감당할 수 있는가”를 먼저 정하는 방식이 좋습니다.</p></div>
      <div class="reading-box" style="margin-top:12px"><p><strong>신년운세 — 한 해 전체의 방향</strong></p><p>${esc(year||'올해는 한 번에 모든 것을 바꾸기보다 우선순위를 정하고 중요한 일부터 움직이는 흐름으로 활용해 보세요.')}</p><p>신년운세는 사건을 맞히는 예언이라기보다, 올해 무엇을 늘리고 무엇을 줄이면 좋은지 보는 연간 계획표처럼 읽는 것이 가장 실용적입니다.</p></div>
      <div class="reading-box" style="margin-top:12px"><p><strong>월간운세 — 이번 달의 운영 방법</strong></p><p>${esc(month||'이번 달에는 해야 할 일을 작게 나누고 실제 결과를 확인하면서 다음 행동을 조정해 보세요.')}</p><p>일·돈·관계에서 동시에 무리하기보다 이번 달의 한 가지 핵심 목표를 정하고, 나머지는 유지하는 방식이 부담을 줄이는 데 도움이 됩니다.</p></div>
      <div class="reading-box" style="margin-top:12px"><p><strong>오늘의 운세 — ${currentDateCopy()}</strong></p><p>${esc(today||'오늘은 큰 결론보다 지금 바로 할 수 있는 한 가지 행동을 정해 실행해 보세요.')}</p><p>오늘의 운세는 하루 전체를 결정하는 점수가 아니라, 오늘의 선택을 조금 더 의식적으로 만드는 체크포인트로 활용해 주세요.</p></div>
      <div class="deep-reading-grid" style="margin-top:18px">
        <article><span>용어가 어렵다면</span><h3>일간</h3><p>나를 대표하는 중심 기운입니다. 성격 전체를 뜻하기보다 “내가 세상을 받아들이고 반응하는 기본 방식”에 가깝습니다.</p></article>
        <article><span>용어가 어렵다면</span><h3>오행</h3><p>목·화·토·금·수 다섯 흐름의 균형입니다. 많다고 무조건 좋고 적다고 무조건 나쁜 것은 아닙니다.</p></article>
        <article><span>용어가 어렵다면</span><h3>십신</h3><p>일, 돈, 표현, 책임, 배움, 경쟁 같은 역할을 일간과의 관계로 분류한 전통적 해석 도구입니다.</p></article>
        <article><span>용어가 어렵다면</span><h3>합·충·형·파·해</h3><p>관계와 변화가 나타나는 방식입니다. “문제가 생긴다”가 아니라 어디에서 조율이 필요할 수 있는지를 보는 신호로 읽습니다.</p></article>
      </div>`;
    const fortune=document.querySelector('.fortune-reading-panel');
    if(fortune)fortune.insertAdjacentElement('afterend',section);else content.appendChild(section);
    return true;
  }
  let n=0;const timer=setInterval(()=>{if(render()||++n>100)clearInterval(timer)},100);
})();