import { calculateNativeSaju, NativeSajuResult } from './saju-engine';
import type { SajuInput } from './saju-session';

const STEM_ELEMENT:Record<string,'목'|'화'|'토'|'금'|'수'>={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const ELEMENT_COPY={
 목:{focus:'성장·기획·새로운 시작',risk:'일을 너무 벌이거나 결론을 늦추는 것',money:'새 수입원보다 현재 수입을 키우는 전략',action:'가장 중요한 한 가지를 먼저 키워보세요.'},
 화:{focus:'실행·표현·관계 확장',risk:'충동적인 결정과 과속',money:'매출·성과 기회를 빠르게 잡되 숫자를 재확인하는 습관',action:'속도와 완성도의 균형을 잡아보세요.'},
 토:{focus:'안정·관리·정산',risk:'변화를 지나치게 미루는 것',money:'고정비·현금흐름·장기 계획 점검',action:'지켜야 할 기준 하나를 분명히 정해보세요.'},
 금:{focus:'선택·정리·계약·결단',risk:'지나친 완벽주의와 단호함',money:'계약 조건·손익·불필요 지출을 정리하는 흐름',action:'덜어낼 것과 남길 것을 구분해보세요.'},
 수:{focus:'정보·분석·소통·유연성',risk:'생각만 길어지고 행동이 늦어지는 것',money:'정보를 비교하되 실제 현금흐름으로 연결하는 판단',action:'확인한 정보 하나를 오늘 행동으로 옮겨보세요.'},
} as const;
const ELEMENTS=['목','화','토','금','수'] as const;
function hash(seed:string){let n=2166136261;for(let i=0;i<seed.length;i++){n^=seed.charCodeAt(i);n=Math.imul(n,16777619)}return Math.abs(n>>>0)}
function score(seed:string,min=62,max=92){return min+(hash(seed)%(max-min+1))}
function dominant(r:NativeSajuResult){return r.strongest[0] as keyof typeof ELEMENT_COPY}
function weak(r:NativeSajuResult){return r.weakest[0] as keyof typeof ELEMENT_COPY}
function dayElement(r:NativeSajuResult){return STEM_ELEMENT[r.dayMaster]||dominant(r)}
function grade(v:number){return v>=86?'매우 좋음':v>=78?'좋음':v>=70?'무난함':'정비 필요'}
function relationText(r:NativeSajuResult){const max=Math.max(...ELEMENTS.map(e=>r.elements[e])),min=Math.min(...ELEMENTS.map(e=>r.elements[e]));return max-min>=4?'강한 기운과 약한 기운의 차이가 큰 편이라 한쪽으로 몰리지 않게 균형을 잡는 것이 중요합니다.':'오행 분포가 비교적 고르게 나타나므로 상황에 맞춰 유연하게 선택하는 힘을 살리기 좋습니다.'}

export type FortuneSection={title:string;score:number;grade:string;summary:string;details:{label:string;text:string}[]};
export type FortuneBundle={name:string;dayMaster:string;dayElement:string;dominant:string;weakest:string;year:FortuneSection;month:FortuneSection;today:FortuneSection;wealth:FortuneSection;months:{month:number;score:number;text:string}[]};

export function buildFortune(input:SajuInput,now=new Date()):FortuneBundle{
 const r=calculateNativeSaju(input),de=dayElement(r),dom=dominant(r),wk=weak(r),copy=ELEMENT_COPY[de];
 const y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
 const base=`${r.pillars.year}|${r.pillars.month}|${r.pillars.day}|${r.pillars.hour||''}`;
 const ys=score(`${base}-${y}-year`),ms=score(`${base}-${y}-${m}-month`),ds=score(`${base}-${y}-${m}-${d}-day`),ws=score(`${base}-${y}-${m}-wealth`);
 const year:FortuneSection={title:`${y}년 신년운세`,score:ys,grade:grade(ys),summary:`${copy.focus}이 올해의 핵심 흐름입니다. ${relationText(r)}`,details:[
  {label:'전체 흐름',text:ys>=80?'준비해 둔 일을 실행하고 성과를 구체화하기 좋은 해입니다. 다만 좋은 흐름일수록 일정과 조건을 문서로 확인하세요.':'무리한 확장보다 기반을 다지고 다음 기회를 준비하는 해로 쓰는 편이 좋습니다.'},
  {label:'일·사업',text:`${copy.focus}과 연결된 업무에서 강점을 쓰기 좋습니다. 한 번에 여러 방향을 잡기보다 올해의 핵심 목표를 1~2개로 줄이면 성과가 선명해집니다.`},
  {label:'관계',text:`강한 기운은 ${dom}, 상대적으로 적은 기운은 ${wk}로 보입니다. 자신의 방식만 고집하기보다 상대의 속도와 표현 방식을 한 번 더 확인하면 관계 피로를 줄일 수 있습니다.`},
  {label:'올해의 한 걸음',text:copy.action},
 ]};
 const month:FortuneSection={title:`${m}월 월간운세`,score:ms,grade:grade(ms),summary:`이번 달은 ${copy.focus}을 실제 일정과 숫자로 옮기는 것이 중요합니다.`,details:[
  {label:'월초',text:'해야 할 일과 지출을 먼저 정리하고 우선순위를 줄이는 시기입니다.'},
  {label:'월중',text:ms>=78?`${copy.focus}에 힘을 싣고 중요한 연락·협상·실행을 진행하기 좋습니다.`:'속도를 내기보다 조건을 다시 검토하고 누락을 줄이는 편이 좋습니다.'},
  {label:'월말',text:'성과와 지출을 함께 결산하고 다음 달에 이어갈 한 가지를 정하세요.'},
  {label:'주의',text:copy.risk},
 ]};
 const today:FortuneSection={title:'오늘의 운세',score:ds,grade:grade(ds),summary:`오늘은 ${copy.focus}을 의식적으로 활용하면 흐름을 안정적으로 쓰기 좋습니다.`,details:[
  {label:'아침 06–10시',text:'계획·연락·우선순위 설정에 적합합니다.'},
  {label:'낮 10–14시',text:ds>=78?'중요 업무·협상·실행에 힘을 싣기 좋습니다.':'중요한 결정 전 숫자와 조건을 한 번 더 확인하세요.'},
  {label:'오후 14–18시',text:'검토·정리·관계 조율에 적합합니다.'},
  {label:'저녁 18–22시',text:'결산·회복·내일 준비에 시간을 쓰면 좋습니다.'},
  {label:'오늘의 한 걸음',text:copy.action},
 ]};
 const wealth:FortuneSection={title:'금전운',score:ws,grade:grade(ws),summary:`${copy.money}이 현재 금전 흐름의 핵심입니다.`,details:[
  {label:'수입',text:ws>=80?'새 기회를 검토할 수 있지만 작은 테스트 후 확대하는 방식이 좋습니다.':'새 수입원보다 기존 수입의 안정성과 반복 가능성을 먼저 점검하세요.'},
  {label:'지출',text:'필수·성장·기분 지출을 구분하고 자동결제와 반복비용을 확인하세요.'},
  {label:'투자',text:'운세 점수만으로 투자하지 말고 손실 한도·분할 접근·현금 여유를 먼저 정하세요.'},
  {label:'사업·직장',text:`${copy.focus}과 관련된 성과 기회를 살리되 계약 조건과 상대방의 실행 가능성을 함께 확인하세요.`},
  {label:'계약·거래',text:'금액·기간·해지·환불·책임 범위를 문서로 다시 확인하는 것이 좋습니다.'},
 ]};
 const months=Array.from({length:12},(_,i)=>{const sc=score(`${base}-${y}-${i+1}-flow`,60,91);return{month:i+1,score:sc,text:sc>=83?'기회를 적극적으로 잡되 조건을 확인할 달':sc>=73?'꾸준히 밀어붙이면 성과가 쌓이는 달':'정비와 준비가 다음 기회를 만드는 달'}});
 return{name:input.name||'사용자',dayMaster:r.dayMaster,dayElement:de,dominant:dom,weakest:wk,year,month,today,wealth,months};
}
