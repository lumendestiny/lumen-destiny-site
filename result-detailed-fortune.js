(()=>{
 const lang=(new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||document.documentElement.lang||'ko').toLowerCase(); if(!lang.startsWith('ko'))return;
 const txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
 const E={목:['성장','확장보다 우선순위를 정해 한 가지를 키우는 것','새로운 제안·학습·기획','과도한 확장'],화:['실행','속도보다 완성도를 챙기는 것','발표·홍보·협상·관계 확장','충동 결정'],토:['안정','기준과 루틴을 유지하는 것','관리·정산·장기 계획','변화를 지나치게 미루는 것'],금:['정리','선택과 집중으로 불필요한 것을 덜어내는 것','계약·검토·정리·결단','지나친 완벽주의'],수:['통찰','정보를 행동으로 전환하는 것','조사·분석·소통·유연한 대응','생각만 길어지는 것']};
 function dominant(){const s=txt(document.querySelector('#elementSummary strong'))+txt(document.getElementById('elementChart'));return (s.match(/[목화토금수]/)||['토'])[0]}
 function score(seed){let n=0;for(const c of seed)n=(n*31+c.charCodeAt(0))%997;return 62+n%29}
 function card(title,body){return `<article><span>${title}</span><p>${body}</p></article>`}
 function render(){const root=document.getElementById('manseContent');if(!root||root.hidden||document.getElementById('lumenDetailedFortune'))return false;const el=dominant(),d=E[el],now=new Date(),y=now.getFullYear(),m=now.getMonth()+1,day=now.getDate();
 const sec=document.createElement('section');sec.id='lumenDetailedFortune';sec.className='result-panel plain-reading-panel';
 const months=Array.from({length:12},(_,i)=>{const s=score(`${el}-${y}-${i+1}`);const phase=s>=82?'기회를 적극적으로 잡되 조건을 확인할 달':s>=72?'꾸준히 밀어붙이면 성과가 쌓이는 달':'정비와 준비가 다음 기회를 만드는 달';return `<article><span>${i+1}월 · ${s}점</span><p>${phase}. ${d[2]}에 힘을 싣고, ${d[3]}은 피하는 편이 좋습니다.</p></article>`}).join('');
 const hours=[['아침 06–10시','계획·연락·우선순위 설정'],['낮 10–14시','중요 업무·협상·실행'],['오후 14–18시','검토·정리·관계 조율'],['저녁 18–22시','결산·회복·내일 준비']].map(([a,b],i)=>card(`${a} · ${score(`${el}-${day}-${i}`)}점`,`${b}에 적합합니다. 오늘은 ${d[1]}을 기억하면 흐름을 안정적으로 쓰는 데 도움이 됩니다.`)).join('');
 sec.innerHTML=`<div class="panel-heading"><div><p class="section-label">DETAILED FORTUNE</p><h2>운세를 더 구체적으로 살펴보기</h2><p class="panel-copy">한 줄 길흉보다 기간별 흐름과 실제 생활에서 확인할 항목을 중심으로 정리합니다.</p></div><span class="engine-badge">상세 무료 해설</span></div>
 <h3>${y}년 신년운세 · 12개월 흐름</h3><div class="plain-reading-grid">${months}</div>
 <div class="plain-glossary"><h3>${m}월 월간운세</h3><p><strong>월초:</strong> 계획과 고정비·일정을 먼저 정리하세요. <strong>월중:</strong> ${d[2]}에 집중하기 좋습니다. <strong>월말:</strong> 성과와 지출을 함께 결산하고 다음 달에 가져갈 한 가지를 정하세요.</p></div>
 <h3 style="margin-top:22px">오늘의 시간대별 흐름</h3><div class="plain-reading-grid">${hours}</div>
 <h3 style="margin-top:22px">금전운 상세 체크</h3><div class="plain-reading-grid">
 ${card('수입','새로운 수입 가능성만 좇기보다 현재 수입원의 지속성과 반복 가능성을 먼저 보세요. '+d[2]+'과 연결된 기회는 작은 테스트 후 확대하는 방식이 좋습니다.')}
 ${card('지출','필수·성장·기분 지출을 구분하세요. 오늘의 충동보다 한 달 뒤에도 가치가 남는지를 기준으로 판단하면 좋습니다.')}
 ${card('투자','운세 점수만으로 투자 결정을 하지 마세요. 손실 한도·분할 접근·현금 여유를 먼저 정하고 실제 정보와 위험을 별도로 확인해야 합니다.')}
 ${card('사업·직장','매출이나 성과뿐 아니라 계약 조건, 일정, 상대방의 실행 가능성을 함께 확인하세요. '+d[1]+'이 이번 흐름의 핵심입니다.')}
 ${card('계약·거래','금액·기간·해지·환불·책임 범위를 문서로 다시 확인하세요. 좋은 흐름일수록 서두르기보다 조건을 명확히 하는 것이 중요합니다.')}
 ${card('오늘의 돈 습관','오늘 한 번의 큰 선택보다 자동결제 하나, 반복 지출 하나, 미뤄둔 정산 하나를 점검해 실제 현금흐름을 개선해 보세요.')}
 </div><p class="result-disclaimer">※ 점수와 운세 해설은 전통 명리 요소를 이해하기 쉽게 구조화한 참고 콘텐츠이며 투자·계약·의료·법률 등 중요한 결정을 대신하지 않습니다.</p>`;
 const fortune=document.querySelector('.fortune-reading-panel');fortune?fortune.insertAdjacentElement('afterend',sec):root.appendChild(sec);return true}
 let n=0,t=setInterval(()=>{if(render()||++n>120)clearInterval(t)},100);
})();