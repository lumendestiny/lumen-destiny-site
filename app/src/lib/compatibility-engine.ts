import { calculateNativeSaju } from './saju-engine';
import type { SajuInput } from './saju-session';

const STEM_ELEMENT:Record<string,string>={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const GEN:Record<string,string>={목:'화',화:'토',토:'금',금:'수',수:'목'};
const CONTROL:Record<string,string>={목:'토',토:'수',수:'화',화:'금',금:'목'};
const COMBINE=[['자','축'],['인','해'],['묘','술'],['진','유'],['사','신'],['오','미']];
const CLASH=[['자','오'],['축','미'],['인','신'],['묘','유'],['진','술'],['사','해']];
const HARM=[['자','미'],['축','오'],['인','사'],['묘','진'],['신','해'],['유','술']];

const hasPair=(a:string,b:string,list:string[][])=>list.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x));

export type CompatibilityResult={
 score:number;
 headline:string;
 strengths:string[];
 cautions:string[];
 dayMasterText:string;
 branchText:string;
 practical:string[];
 a:{name:string;dayMaster:string;elements:Record<string,number>};
 b:{name:string;dayMaster:string;elements:Record<string,number>};
};

export function calculateCompatibility(a:SajuInput,b:SajuInput):CompatibilityResult{
 const ar=calculateNativeSaju(a),br=calculateNativeSaju(b);
 const ae=STEM_ELEMENT[ar.dayMaster],be=STEM_ELEMENT[br.dayMaster];
 let score=68;const strengths:string[]=[],cautions:string[]=[];
 if(ae===be){score+=9;strengths.push('두 사람의 기본 반응 속도와 가치 판단이 비슷해 서로를 빠르게 이해하기 쉽습니다.');}
 else if(GEN[ae]===be||GEN[be]===ae){score+=12;strengths.push('한 사람의 기운이 다른 사람의 흐름을 자연스럽게 북돋우는 상생 관계가 나타납니다.');}
 else if(CONTROL[ae]===be||CONTROL[be]===ae){score-=7;cautions.push('서로의 방식이 강하게 부딪힐 수 있어 결정권과 역할을 명확히 나누는 편이 좋습니다.');}
 const ap=Object.values(ar.pillars).filter(Boolean) as string[],bp=Object.values(br.pillars).filter(Boolean) as string[];
 let combines=0,clashes=0,harms=0;
 for(const x of ap)for(const y of bp){const xb=x[1],yb=y[1];if(hasPair(xb,yb,COMBINE))combines++;if(hasPair(xb,yb,CLASH))clashes++;if(hasPair(xb,yb,HARM))harms++;}
 score+=Math.min(12,combines*3);score-=Math.min(15,clashes*4);score-=Math.min(8,harms*2);score=Math.max(35,Math.min(95,score));
 if(combines)strengths.push(`지지 관계에서 합이 ${combines}개 보여 함께 움직일 때 호흡이 맞는 장면이 생기기 쉽습니다.`);
 if(clashes)cautions.push(`지지 관계에서 충이 ${clashes}개 보여 생활 리듬·의사결정 방식에서 충돌이 생길 수 있습니다.`);
 if(harms)cautions.push(`지지 관계에서 해가 ${harms}개 보여 작은 오해를 오래 쌓아두지 않는 소통이 중요합니다.`);
 if(!strengths.length)strengths.push('극단적으로 한쪽에 치우친 조합은 아니어서 관계 운영 방식에 따라 안정적으로 맞춰갈 수 있습니다.');
 if(!cautions.length)cautions.push('큰 충돌 신호가 두드러지지 않더라도 실제 관계에서는 감정 표현과 생활 습관의 차이를 확인하는 것이 중요합니다.');
 const headline=score>=85?'서로의 장점을 살리기 좋은 궁합':score>=72?'조율할수록 좋아지는 안정적인 궁합':score>=58?'강점과 차이가 함께 있는 궁합':'역할과 소통 규칙이 특히 중요한 궁합';
 return{score,headline,strengths,cautions,dayMasterText:`${a.name}님의 일간 ${ar.dayMaster}(${ae})와 ${b.name}님의 일간 ${br.dayMaster}(${be})을 비교했습니다.`,branchText:`두 명식의 지지 사이에서 합 ${combines} · 충 ${clashes} · 해 ${harms} 관계를 확인했습니다.`,practical:['감정이 올라왔을 때 바로 결론을 내리기보다 각자의 의도를 먼저 확인해 보세요.','돈·시간·가족처럼 반복해서 갈등이 생기기 쉬운 주제는 미리 기준을 정하는 편이 좋습니다.','궁합 점수보다 실제로 잘 맞는 행동 패턴을 하나씩 늘리는 것이 관계에는 더 중요합니다.'],a:{name:a.name,dayMaster:ar.dayMaster,elements:ar.elements},b:{name:b.name,dayMaster:br.dayMaster,elements:br.elements}};
}
