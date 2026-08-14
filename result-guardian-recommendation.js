(()=>{
  const qs=new URLSearchParams(location.search);
  let lang=(qs.get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase();
  if(!lang.startsWith('ko'))return;
  const txt=el=>(el?.textContent||'').replace(/\s+/g,' ').trim();
  const DATA={
    목:{name:'목(木)',theme:'성장·기획·새로운 시작',wishType:'career',guardian:'성장·도약 Guardian',benefits:['계획을 세우고 시작하는 힘','새로운 기회에 적응하는 유연성','배움과 장기적인 성장 방향'],wish:'부족한 목(木)의 성장과 시작의 의미를 기억하며, 새로운 기회를 차분히 키워가고 싶습니다.'},
    화:{name:'화(火)',theme:'표현·활력·실행',wishType:'career',guardian:'활력·실행 Guardian',benefits:['생각을 행동으로 옮기는 추진력','자신의 뜻을 표현하는 자신감','관계와 일에서 따뜻한 소통과 활력'],wish:'부족한 화(火)의 활력과 표현의 의미를 기억하며, 망설임보다 실행과 따뜻한 소통을 선택하고 싶습니다.'},
    토:{name:'토(土)',theme:'안정·관리·신뢰',wishType:'health',guardian:'안정·균형 Guardian',benefits:['생활 리듬과 꾸준함','돈·시간·일정을 관리하는 안정감','관계에서 신뢰와 중심을 지키는 힘'],wish:'부족한 토(土)의 안정과 중심의 의미를 기억하며, 생활과 마음의 균형을 꾸준히 지키고 싶습니다.'},
    금:{name:'금(金)',theme:'판단·정리·결단',wishType:'wealth',guardian:'결단·정리 Guardian',benefits:['우선순위를 정하고 불필요한 것을 줄이는 힘','돈과 일에서 기준을 세우는 판단력','결정한 일을 마무리하는 집중력'],wish:'부족한 금(金)의 기준과 결단의 의미를 기억하며, 돈과 일에서 원칙을 세우고 끝까지 정리하고 싶습니다.'},
    수:{name:'수(水)',theme:'통찰·유연성·회복',wishType:'relationship',guardian:'통찰·유연 Guardian',benefits:['상황을 넓게 보고 정보를 연결하는 힘','변화에 유연하게 대응하는 여유','관계에서 듣고 이해하며 회복하는 힘'],wish:'부족한 수(水)의 유연함과 통찰의 의미를 기억하며, 서두르지 않고 흐름을 읽으며 관계와 선택을 이어가고 싶습니다.'}
  };
  function parseCounts(){
    const counts={};
    [...document.querySelectorAll('#elementChart .element-label')].forEach(el=>{
      const s=txt(el),m=s.match(/([목화토금수])[^0-9]*([0-9]+)/);if(m)counts[m[1]]=Number(m[2]);
    });
    if(Object.keys(counts).length<5){
      const chart=txt(document.getElementById('elementChart'));
      ['목','화','토','금','수'].forEach(k=>{const m=chart.match(new RegExp(k+'[^0-9]{0,12}([0-9]+)'));if(m)counts[k]=Number(m[1])});
    }
    return counts;
  }
  function render(){
    const content=document.getElementById('manseContent');if(!content||content.hidden||document.getElementById('guardianElementRecommendation'))return false;
    const counts=parseCounts();if(Object.keys(counts).length<3)return false;
    const order=['목','화','토','금','수'];const min=Math.min(...order.map(k=>Number.isFinite(counts[k])?counts[k]:99));const weakest=order.filter(k=>(counts[k]??99)===min);const key=weakest[0],d=DATA[key];if(!d)return false;
    const name=(qs.get('name')||'').trim();
    const url=new URL('/guardian-order/',location.origin);url.searchParams.set('tier','custom');url.searchParams.set('wishType',d.wishType);url.searchParams.set('element',key);url.searchParams.set('source','saju-result');url.searchParams.set('wish',d.wish);if(name)url.searchParams.set('name',name);
    const tied=weakest.length>1?`현재 표면 오행 기준으로 ${weakest.map(x=>DATA[x].name).join('·')}이 같은 수준으로 적게 나타납니다. 그중 ${d.name}을 대표 보완 기운으로 먼저 안내합니다.`:`현재 표면 오행 분포에서 <strong>${d.name}</strong>이 가장 적게 나타납니다.`;
    const section=document.createElement('section');section.id='guardianElementRecommendation';section.className='result-panel plain-reading-panel';
    section.innerHTML=`<div class="panel-heading"><div><p class="section-label">ELEMENT BALANCE · GUARDIAN</p><h2>나에게 부족한 기운과 추천 Guardian</h2><p class="panel-copy">사주에서 적게 보이는 기운을 “나쁜 기운”으로 보지 않고, 생활에서 의식적으로 키워볼 주제로 연결합니다.</p></div><span class="engine-badge">맞춤 추천</span></div>
    <div class="plain-reading-grid"><article><span>가장 부족한 기운</span><h3>${d.name} · ${d.theme}</h3><p>${tied}</p><p>오행의 개수만으로 용신이나 실제 길흉을 확정할 수는 없지만, 일반인이 자신의 균형을 이해하는 첫 안내로 활용할 수 있습니다.</p></article><article><span>보완을 의식하면 좋은 방향</span><h3>생활에서 기대하는 변화</h3><p>${d.benefits.map(x=>'• '+x).join('<br>')}</p><p>이 내용은 전통 명리의 상징을 생활 습관과 선택 기준으로 풀어쓴 것입니다.</p></article><article><span>추천 Guardian</span><h3>${d.guardian}</h3><p>${d.name}의 상징을 카드의 문구·소망·디자인에 반영해, 내가 키우고 싶은 태도를 매일 떠올리는 용도로 추천합니다.</p><p><strong>Guardian 자체가 실제 오행이나 운세를 물리적으로 바꾼다는 의미는 아닙니다.</strong> 소망과 행동 방향을 기억하게 하는 상징적 디지털 콘텐츠입니다.</p></article><article><span>구매 전 확인</span><h3>왜 이 Guardian을 추천하나요?</h3><p>현재 결과에서 가장 약하게 보이는 ${d.name}의 주제인 <strong>${d.theme}</strong>을 보완 목표로 삼기 때문입니다. 구매 여부와 관계없이 위의 생활 실천 내용은 그대로 무료로 활용할 수 있습니다.</p><a class="button primary" href="${url.pathname+url.search}">${d.guardian} 보러가기</a></article></div>`;
    const rich=document.getElementById('lumenRichReading'),fortune=document.querySelector('.fortune-reading-panel');
    if(rich)rich.insertAdjacentElement('afterend',section);else if(fortune)fortune.insertAdjacentElement('afterend',section);else content.appendChild(section);
    return true;
  }
  let n=0;const timer=setInterval(()=>{if(render()||++n>120)clearInterval(timer)},100);
})();