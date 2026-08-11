const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const form=document.getElementById('sajuForm');
const elementNames=['목(木)','화(火)','토(土)','금(金)','수(水)'];
const elementTraits={
'목(木)':{title:'성장과 시작의 힘',desc:'새로운 가능성을 발견하고 앞으로 뻗어가려는 성향이 강하게 나타납니다.',action:'오늘 미뤄둔 일 하나를 작게라도 시작해보세요.'},
'화(火)':{title:'표현과 추진의 힘',desc:'사람에게 에너지를 전하고 결정을 행동으로 옮기는 힘이 돋보입니다.',action:'오늘 중요한 생각 하나를 말이나 글로 분명하게 표현해보세요.'},
'토(土)':{title:'안정과 축적의 힘',desc:'흐름을 정리하고 기반을 단단하게 만드는 능력이 강점으로 나타납니다.',action:'오늘 일정이나 재정, 공간 중 하나를 정리해 기반을 다져보세요.'},
'금(金)':{title:'판단과 선택의 힘',desc:'기준을 세우고 불필요한 것을 덜어내는 결단력이 강점으로 나타납니다.',action:'오늘 해야 할 것과 하지 않을 것을 한 가지씩 명확히 정해보세요.'},
'수(水)':{title:'관찰과 유연함의 힘',desc:'상황을 읽고 변화에 맞춰 움직이는 감각이 강점으로 나타납니다.',action:'오늘 결론을 서두르기보다 한 번 더 관찰하고 정보를 모아보세요.'}
};
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function buildScores(date,time,calendar,gender){
 const [y,m,d]=date.split('-').map(Number);const hh=time?Number(time.split(':')[0]):12;const mm=time?Number(time.split(':')[1]):0;
 const base=[(y%10)+m,(m*2)+d,(d*2)+(y%7),((y%100)+hh),(hh*2)+mm+(calendar==='lunar'?7:3)];
 const genderShift=gender==='female'?3:gender==='male'?1:2;
 return base.map((v,i)=>clamp(12+((v+i*genderShift)%19),8,32));
}
function normalizeScores(scores){const sum=scores.reduce((a,b)=>a+b,0);return scores.map(v=>Math.round(v/sum*100));}
if(form){form.addEventListener('submit',function(e){
 e.preventDefault();
 const name=document.getElementById('userName').value.trim()||'당신';
 const date=document.getElementById('birthDate').value;const time=document.getElementById('birthTime').value;
 const calendarValue=document.getElementById('calendarType').value;const calendar=calendarValue==='lunar'?'음력':'양력';
 const genderValue=document.getElementById('gender').value;const genderMap={male:'남성',female:'여성',other:'선택 안 함'};const gender=genderMap[genderValue];
 const result=document.getElementById('sajuResult');
 const scores=normalizeScores(buildScores(date,time,calendarValue,genderValue));
 const ranked=scores.map((v,i)=>({name:elementNames[i],value:v,index:i})).sort((a,b)=>b.value-a.value);
 const strongest=ranked[0],support=ranked[1],weakest=ranked[ranked.length-1];const trait=elementTraits[strongest.name];
 const bars=elementNames.map((el,i)=>`<div class="element-row"><div class="element-label"><span>${el}</span><strong>${scores[i]}%</strong></div><div class="element-track"><span style="width:${scores[i]}%"></span></div></div>`).join('');
 result.innerHTML=`<div class="result-kicker">LUMEN SAJU V2</div><h3>${name}님의 기초 오행 분석</h3><p class="result-lead"><span class="result-highlight">${strongest.name} · ${trait.title}</span></p><p>${trait.desc}</p><div class="element-chart">${bars}</div><div class="result-summary"><div><span>주요 기운</span><strong>${strongest.name}</strong></div><div><span>보조 기운</span><strong>${support.name}</strong></div><div><span>보완 포인트</span><strong>${weakest.name}</strong></div></div><p><strong>오늘의 한 걸음</strong><br>${trait.action}</p><p class="result-meta">입력 기준: ${calendar} · ${date}${time?' · '+time:' · 시간 미입력'} · ${gender}</p><p class="result-disclaimer">※ 현재 V2는 정식 만세력·절기 계산 엔진 연결 전의 개인화 기초 분석입니다. 결과를 미래의 확정된 사실이나 중요한 의사결정의 근거로 사용하지 마세요.</p>`;
 result.hidden=false;result.scrollIntoView({behavior:'smooth',block:'center'});
});}