import type { NativeSajuResult } from './saju-engine';

const E=['목','화','토','금','수'] as const;
const STEM_ELEMENT:Record<string,string>={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const BRANCH_ELEMENT:Record<string,string>={자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'};
const GENERATES:Record<string,string>={목:'화',화:'토',토:'금',금:'수',수:'목'};
const GENERATED_BY:Record<string,string>={목:'수',화:'목',토:'화',금:'토',수:'금'};
const CONTROLS:Record<string,string>={목:'토',토:'수',수:'화',화:'금',금:'목'};
const CONTROLLED_BY:Record<string,string>={목:'금',화:'수',토:'목',금:'화',수:'토'};
const COMBOS=[['자','축'],['인','해'],['묘','술'],['진','유'],['사','신'],['오','미']];
const CLASH=[['자','오'],['축','미'],['인','신'],['묘','유'],['진','술'],['사','해']];
const HARM=[['자','미'],['축','오'],['인','사'],['묘','진'],['신','해'],['유','술']];
const BREAK=[['자','유'],['축','진'],['인','해'],['묘','오'],['사','신'],['미','술']];
const PUNISH=[['인','사'],['사','신'],['신','인'],['축','술'],['술','미'],['미','축'],['자','묘']];
const SELF=new Set(['진','오','유','해']);

export type Relation={type:'합'|'충'|'해'|'파'|'형'|'자형';a:string;b:string};
export type BalanceGuide={dayElement:string;monthElement:string;supportScore:number;drainScore:number;strength:'강한 편'|'균형에 가까움'|'약한 편';surfaceWeakest:string[];recommended:string;reason:string;confidence:'참고'|'보통'};
export type FortuneBundle={year:string[];month:string[];today:string[];wealth:string[]};

function hasPair(a:string,b:string,pairs:string[][]){return pairs.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x));}
export function branchRelations(r:NativeSajuResult):Relation[]{
 const vals=[r.pillars.year,r.pillars.month,r.pillars.day,r.pillars.hour].filter(Boolean).map(p=>String(p)[1]); const out:Relation[]=[];
 for(let i=0;i<vals.length;i++)for(let j=i+1;j<vals.length;j++){
  const a=vals[i],b=vals[j];
  if(hasPair(a,b,COMBOS))out.push({type:'합',a,b});
  if(hasPair(a,b,CLASH))out.push({type:'충',a,b});
  if(hasPair(a,b,HARM))out.push({type:'해',a,b});
  if(hasPair(a,b,BREAK))out.push({type:'파',a,b});
  if(hasPair(a,b,PUNISH))out.push({type:'형',a,b});
  if(a===b&&SELF.has(a))out.push({type:'자형',a,b});
 }
 return out;
}

export function balanceGuide(r:NativeSajuResult):BalanceGuide{
 const dayElement=STEM_ELEMENT[r.dayMaster]||'토'; const monthBranch=r.pillars.month?.[1]||''; const monthElement=BRANCH_ELEMENT[monthBranch]||'토';
 let support=0,drain=0;
 for(const e of E){const n=r.elements[e]; if(e===dayElement||e===GENERATED_BY[dayElement])support+=n; else drain+=n;}
 if(monthElement===dayElement||monthElement===GENERATED_BY[dayElement])support+=2; else if(monthElement===CONTROLS[dayElement]||monthElement===CONTROLLED_BY[dayElement]||monthElement===GENERATES[dayElement])drain+=2;
 const diff=support-drain; const strength=diff>=3?'강한 편':diff<=-3?'약한 편':'균형에 가까움';
 const surfaceWeakest=r.weakest;
 let recommended=surfaceWeakest[0]||GENERATED_BY[dayElement]; let reason='표면 오행에서 가장 적게 나타나는 기운을 우선 참고합니다.';
 if(strength==='약한 편'){recommended=GENERATED_BY[dayElement];reason=`일간 ${dayElement}을 돕는 ${recommended} 기운을 우선 보완 후보로 봅니다.`;}
 else if(strength==='강한 편'){recommended=CONTROLS[dayElement];reason=`일간 ${dayElement}이 강한 편이라 균형을 잡는 ${recommended} 기운을 우선 후보로 봅니다.`;}
 return {dayElement,monthElement,supportScore:support,drainScore:drain,strength,surfaceWeakest,recommended,reason,confidence:'참고'};
}

function score(seed:string){let n=17;for(const c of seed)n=(n*33+c.charCodeAt(0))%997;return 62+n%28;}
export function fortuneBundle(r:NativeSajuResult,b:BalanceGuide,relations:Relation[],now=new Date()):FortuneBundle{
 const y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate(); const tension=relations.filter(x=>['충','형','해','파'].includes(x.type)).length; const harmony=relations.filter(x=>x.type==='합').length;
 const tone=tension>harmony?'변수와 충돌을 줄이기 위해 확인과 조율을 한 번 더 하는 것':harmony>tension?'사람과 기회를 연결하되 조건을 분명히 하는 것':'속도보다 우선순위를 정하고 한 가지씩 마무리하는 것';
 return {
  year:[`${y}년의 핵심은 ${tone}입니다.`,`${b.recommended}의 상징인 균형 주제를 생활 습관과 선택 기준에 적용해 보세요.`, `연간 참고지수 ${score(`${r.dayMaster}-${y}`)}점 · 점수보다 실제 일정·재정·관계 조건을 함께 확인하세요.`],
  month:[`${m}월 초에는 일정과 지출을 정리하고, 월중에는 중요한 실행을 집중하는 흐름이 좋습니다.`,`월말에는 성과와 관계를 함께 결산해 다음 달에 가져갈 한 가지를 정해 보세요.`,`이번 달 참고지수 ${score(`${r.dayMaster}-${y}-${m}`)}점.`],
  today:[`오늘은 ${tone}이 유리합니다.`,`오전에는 계획·연락, 오후에는 실행·검토, 저녁에는 정리와 회복에 시간을 배분해 보세요.`,`오늘 참고지수 ${score(`${r.dayMaster}-${y}-${m}-${d}`)}점.`],
  wealth:[`수입은 반복 가능성과 지속성을 먼저 보세요.`,`지출은 필수·성장·기분 지출로 나눠 점검하면 좋습니다.`,`투자·계약은 운세와 무관하게 손실 한도, 계약 조건, 현금 여유를 별도로 확인해야 합니다.`]
 };
}
