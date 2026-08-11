import { calculateSaju, lunarToSolar } from 'https://esm.sh/@fullstackfamily/manseryeok@latest';

const yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
const loading=document.getElementById('manseLoading');
const errorBox=document.getElementById('manseError');
const content=document.getElementById('manseContent');
const STEM_ELEMENT={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const BRANCH_ELEMENT={자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'};
const ELEMENT_LABEL={목:'목(木)',화:'화(火)',토:'토(土)',금:'금(金)',수:'수(水)'};
const ELEMENT_READING={목:'성장과 시작, 확장하려는 힘',화:'표현과 추진, 드러내는 에너지',토:'안정과 축적, 중심을 잡는 힘',금:'판단과 정리, 기준을 세우는 힘',수:'관찰과 유연함, 흐름을 읽는 힘'};
function showError(message){loading.hidden=true;content.hidden=true;errorBox.hidden=false;errorBox.innerHTML=`<h2>결과를 계산하지 못했습니다.</h2><p>${message}</p><a class="button primary" href="index.html#analysis">입력 화면으로 돌아가기</a>`;}
function splitPillar(p){if(!p||p.length<2)return ['?','?'];return [p[0],p[1]];}
function countElements(pillars){const counts={목:0,화:0,토:0,금:0,수:0};pillars.filter(Boolean).forEach(p=>{const [s,b]=splitPillar(p);if(STEM_ELEMENT[s])counts[STEM_ELEMENT[s]]++;if(BRANCH_ELEMENT[b])counts[BRANCH_ELEMENT[b]]++;});return counts;}
function buildReading(counts){const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);const top=ranked[0],low=ranked[ranked.length-1];return `<p><strong>${ELEMENT_LABEL[top[0]]}</strong>의 표면 비중이 가장 높게 나타납니다. 전통적 오행 관점에서는 ${ELEMENT_READING[top[0]]}과 관련된 성향을 살펴볼 수 있습니다.</p><p>상대적으로 <strong>${ELEMENT_LABEL[low[0]]}</strong>의 표면 비중은 낮습니다. 이것이 곧 부족함이나 불운을 뜻하는 것은 아니며, 실제 해석에서는 계절·지장간·십신·합충형파·대운 등을 함께 봐야 합니다.</p><p><strong>오늘의 한 걸음</strong><br>결과를 좋고 나쁨으로 단정하기보다, 강하게 나타난 성향을 어디에 쓰고 약하게 나타난 부분을 어떤 습관으로 보완할지 한 가지씩 정해보세요.</p>`;}
try{
 const raw=sessionStorage.getItem('lumenSajuInput');
 if(!raw)throw new Error('입력 정보가 없습니다. 무료 사주 입력 화면에서 다시 시작해주세요.');
 const input=JSON.parse(raw);const [y,m,d]=input.birthDate.split('-').map(Number);
 let sy=y,sm=m,sd=d;
 if(input.calendarType==='lunar'){
   const converted=lunarToSolar(y,m,d,Boolean(input.isLeapMonth));
   sy=converted.solar.year;sm=converted.solar.month;sd=converted.solar.day;
 }
 let hour,minute=0; if(input.birthTime){[hour,minute]=input.birthTime.split(':').map(Number);} 
 const opts={longitude:Number(input.longitude||127),applyTimeCorrection:true};
 const saju=input.birthTime?calculateSaju(sy,sm,sd,hour,minute,opts):calculateSaju(sy,sm,sd,12,0,{...opts,applyTimeCorrection:false});
 const pillars=[saju.yearPillar,saju.monthPillar,saju.dayPillar,input.birthTime?saju.hourPillar:null];
 document.getElementById('resultTitle').textContent=`${input.name}님의 만세력 결과`;
 document.getElementById('resultIntro').textContent=`기준 양력 ${sy}년 ${sm}월 ${sd}일${input.birthTime?` · ${input.birthTime}`:' · 출생시간 미입력'} · 경도 ${Number(input.longitude||127).toFixed(1)}°`;
 const names=['년주','월주','일주','시주'];const hanjas=[saju.yearPillarHanja,saju.monthPillarHanja,saju.dayPillarHanja,input.birthTime?saju.hourPillarHanja:'—'];
 document.getElementById('pillarGrid').innerHTML=names.map((n,i)=>`<article class="pillar-card"><span>${n}</span><strong>${pillars[i]||'미입력'}</strong><em>${hanjas[i]||'—'}</em></article>`).join('');
 const tc=document.getElementById('timeCorrection');
 tc.textContent=input.birthTime&&saju.isTimeCorrected&&saju.correctedTime?`진태양시 보정: 입력 ${input.birthTime} → 보정 ${String(saju.correctedTime.hour).padStart(2,'0')}:${String(saju.correctedTime.minute).padStart(2,'0')}`:(input.birthTime?'시간 보정 정보가 없는 계산 결과입니다.':'출생시간을 입력하지 않아 시주는 표시하지 않습니다.');
 const counts=countElements(pillars);const total=Object.values(counts).reduce((a,b)=>a+b,0)||1;
 document.getElementById('elementChart').innerHTML=Object.entries(counts).map(([k,v])=>{const pct=Math.round(v/total*100);return `<div class="element-row"><div class="element-label"><span>${ELEMENT_LABEL[k]}</span><strong>${v}자 · ${pct}%</strong></div><div class="element-track"><span style="width:${pct}%"></span></div></div>`}).join('');
 const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
 document.getElementById('elementSummary').innerHTML=`<div><span>가장 많이 보이는 오행</span><strong>${ELEMENT_LABEL[ranked[0][0]]}</strong></div><div><span>일간 · 나를 나타내는 천간</span><strong>${splitPillar(saju.dayPillar)[0]}</strong></div><div><span>계산 기준</span><strong>${input.calendarType==='lunar'?(input.isLeapMonth?'음력 윤달':'음력'):'양력'} → 절기 기준</strong></div>`;
 document.getElementById('basicReading').innerHTML=buildReading(counts);
 loading.hidden=true;content.hidden=false;
}catch(err){showError(err?.message||'계산 엔진 연결을 확인해주세요.');}
