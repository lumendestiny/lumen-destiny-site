(()=>{
 const lang=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase(); if(!lang.startsWith('ko'))return;
 const txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
 const E={목:['성장','확장보다 우선순위를 정해 한 가지를 키우는 것','새로운 제안·학습·기획','과도한 확장'],화:['실행','속도보다 완성도를 챙기는 것','발표·홍보·협상·관계 확장','충동 결정'],토:['안정','기준과 루틴을 유지하는 것','관리·정산·장기 계획','변화를 지나치게 미루는 것'],금:['정리','선택과 집중으로 불필요한 것을 덜어내는 것','계약·검토·정리·결단','지나친 완벽주의'],수:['통찰','정보를 행동으로 전환하는 것','조사·분석·소통·유연한 대응','생각만 길어지는 것']};
 const STEM={갑:['목','큰 방향을 세우고 성장시키는 힘','장기 계획을 세우되 중간 점검을 자주 하는 것'],을:['목','상황에 맞춰 유연하게 길을 찾는 힘','사람과 조건을 부드럽게 연결하는 것'],병:['화','표현력과 추진력으로 분위기를 움직이는 힘','속도를 내기 전 목표와 마감 기준을 정하는 것'],정:['화','세밀하게 관찰하고 필요한 곳에 집중하는 힘','작은 차이를 놓치지 않되 과도한 걱정은 줄이는 것'],무:['토','중심을 잡고 책임 있게 버티는 힘','혼자 짊어지기보다 역할을 나누는 것'],기:['토','현실적으로 관리하고 돌보는 힘','작은 개선을 꾸준히 반복하는 것'],경:['금','결단과 정리로 기준을 세우는 힘','빠른 판단 뒤 한 번 더 사실을 확인하는 것'],신:['금','섬세한 판단과 완성도를 높이는 힘','완벽보다 충분히 좋은 시점에 마무리하는 것'],임:['수','큰 흐름과 가능성을 넓게 읽는 힘','아이디어를 실제 일정과 숫자로 바꾸는 것'],계:['수','세밀한 감지와 정보 수집 능력','생각을 오래 끌지 말고 작은 행동으로 옮기는 것']};
 const GOD={비견:['자기주도·동료','내 기준을 지키되 경쟁보다 협업 구조를 만드는 것'],겁재:['경쟁·분배','돈과 역할의 경계를 분명히 하고 충동 경쟁을 피하는 것'],식신:['생산·표현','꾸준히 결과물을 만들고 실용적인 성과로 연결하는 것'],상관:['표현·변화','아이디어를 적극적으로 내되 말의 강도와 타이밍을 조절하는 것'],편재:['기회·유동 재물','넓은 기회를 보되 자금 회수 가능성과 현금흐름을 먼저 확인하는 것'],정재:['안정 재물·관리','고정수입·저축·예산처럼 반복 가능한 구조를 강화하는 것'],편관:['압박·도전','책임과 긴장을 성과로 바꾸되 무리한 일정은 줄이는 것'],정관:['규칙·직장·신뢰','절차와 약속을 지켜 평판과 안정성을 쌓는 것'],편인:['아이디어·직관','새로운 관점을 얻되 검증 없이 결론 내리지 않는 것'],정인:['학습·보호·기반','공부·자격·문서·지원체계를 활용해 기반을 단단히 하는 것']};
 function dominant(){const s=txt(document.querySelector('#elementSummary strong'))+txt(document.getElementById('elementChart'));return (s.match(/[목화토금수]/)||['토'])[0]}
 function dayStem(){const cards=[...document.querySelectorAll('#pillarGrid .pillar-card')];const s=txt(cards[2]?.querySelector('strong'));return (s.match(/[갑을병정무기경신임계]/)||[''])[0]}
 function tenGodFocus(){const s=txt(document.getElementById('tenGodGrid'));let best='',n=0;Object.keys(GOD).forEach(k=>{const c=(s.match(new RegExp(k,'g'))||[]).length;if(c>n){best=k;n=c}});return best}
 function relationFocus(){const s=txt(document.getElementById('relationGrid'));if(/충/.test(s))return '충의 기운이 보여 변화·이동·의견 차이가 생길 때 즉시 결론보다 조율 시간을 두는 편이 좋습니다.';if(/합/.test(s))return '합의 기운이 보여 협력·연결·관계 확장이 성과로 이어질 가능성을 살펴볼 수 있습니다.';if(/형|파|해/.test(s))return '형·파·해 관계가 보여 사소한 오해나 일정 변경을 크게 키우지 않도록 확인과 소통이 중요합니다.';return '지지 관계의 충돌이 두드러지지 않아 한 번에 큰 변화를 만들기보다 현재 흐름을 꾸준히 다듬는 편이 좋습니다.'}
 function score(seed){let n=0;for(const c of seed)n=(n*31+c.charCodeAt(0))%997;return 62+n%29}
 function card(title,body){return `<article><span>${title}</span><p>${body}</p></article>`}
 function render(){const root=document.getElementById('manseContent');if(!root||root.hidden||document.getElementById('lumenDetailedFortune'))return false;const el=dominant(),d=E[el],stem=dayStem(),st=STEM[stem]||[el,d[0],d[1]],god=tenGodFocus(),gd=GOD[god]||['균형','한 가지 요소보다 전체 흐름을 함께 보는 것'],rel=relationFocus(),now=new Date(),y=now.getFullYear(),m=now.getMonth()+1,day=now.getDate();
 const personal=`${stem?stem+'일간은 ':''}${st[1]}이 강점으로 읽힙니다. 십신에서는 ${god||'전체 균형'}의 의미인 ${gd[0]}이 상대적으로 눈에 띄므로 ${gd[1]}이 실제 생활의 핵심 포인트입니다.`;
 const sec=document.createElement('section');sec.id='lumenDetailedFortune';sec.className='result-panel plain-reading-panel';
 const months=Array.from({length:12},(_,i)=>{const s=score(`${stem}-${god}-${el}-${y}-${i+1}`);const phase=s>=82?'기회를 적극적으로 잡되 조건을 확인할 달':s>=72?'꾸준히 밀어붙이면 성과가 쌓이는 달':'정비와 준비가 다음 기회를 만드는 달';const focus=i%3===0?gd[1]:i%3===1?st[2]:d[2];return `<article><span>${i+1}월 · ${s}점</span><p>${phase}. ${focus}에 힘을 싣고, ${d[3]}은 피하는 편이 좋습니다.</p></article>`}).join('');
 const hours=[['아침 06–10시','계획·연락·우선순위 설정'],['낮 10–14시','중요 업무·협상·실행'],['오후 14–18시','검토·정리·관계 조율'],['저녁 18–22시','결산·회복·내일 준비']].map(([a,b],i)=>card(`${a} · ${score(`${stem}-${god}-${day}-${i}`)}점`,`${b}에 적합합니다. ${st[2]}을 기억하면 오늘의 흐름을 더 안정적으로 쓰는 데 도움이 됩니다.`)).join('');
 sec.innerHTML=`<div class="panel-heading"><div><p class="section-label">DETAILED FORTUNE</p><h2>운세를 더 구체적으로 살펴보기</h2><p class="panel-copy">일간·오행·십신·지지 관계를 함께 참고해 같은 날짜라도 개인 명식에 따라 해설이 달라지도록 구성했습니다.</p></div><span class="engine-badge">개인화 상세 해설</span></div>
 <div class="plain-glossary"><h3>이번 해석의 개인 기준</h3><p>${personal}</p><p>${rel}</p></div>
 <h3 style="margin-top:22px">${y}년 신년운세 · 12개월 흐름</h3><div class="plain-reading-grid">${months}</div>
 <div class="plain-glossary"><h3>${m}월 월간운세</h3><p><strong>월초:</strong> ${gd[1]}. <strong>월중:</strong> ${d[2]}에 집중하기 좋습니다. <strong>월말:</strong> ${st[2]}을 기준으로 성과와 지출을 함께 결산하세요.</p><p><strong>관계 흐름:</strong> ${rel}</p></div>
 <h3 style="margin-top:22px">오늘의 시간대별 흐름</h3><div class="plain-reading-grid">${hours}</div>
 <h3 style="margin-top:22px">금전운 상세 체크</h3><div class="plain-reading-grid">
 ${card('수입',`${gd[0]} 성향을 살려 새로운 수입 가능성보다 반복 가능한 구조를 먼저 보세요. ${d[2]}과 연결된 기회는 작은 테스트 후 확대하는 방식이 좋습니다.`)}
 ${card('지출',`필수·성장·기분 지출을 구분하세요. ${stem?stem+'일간의 '+st[1]:'현재 강점'}이 과해질 때 생기는 즉흥적 선택을 줄이고 한 달 뒤에도 가치가 남는지를 기준으로 판단하면 좋습니다.`)}
 ${card('투자','운세 점수만으로 투자 결정을 하지 마세요. 손실 한도·분할 접근·현금 여유를 먼저 정하고 실제 정보와 위험을 별도로 확인해야 합니다.')}
 ${card('사업·직장',`성과뿐 아니라 역할·일정·상대방의 실행 가능성을 함께 확인하세요. ${gd[1]}이 이번 흐름의 핵심입니다.`)}
 ${card('계약·거래',`금액·기간·해지·환불·책임 범위를 문서로 다시 확인하세요. ${rel}`)}
 ${card('오늘의 돈 습관',`자동결제 하나, 반복 지출 하나, 미뤄둔 정산 하나를 점검하세요. ${st[2]}이 오늘의 실천 기준입니다.`)}
 </div><p class="result-disclaimer">※ 점수와 운세 해설은 전통 명리 요소를 이해하기 쉽게 구조화한 참고 콘텐츠이며 투자·계약·의료·법률 등 중요한 결정을 대신하지 않습니다.</p>`;
 const fortune=document.querySelector('.fortune-reading-panel');fortune?fortune.insertAdjacentElement('afterend',sec):root.appendChild(sec);return true}
 let n=0,t=setInterval(()=>{if(render()||++n>120)clearInterval(t)},100);
})();