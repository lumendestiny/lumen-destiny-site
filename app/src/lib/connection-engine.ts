import { calculateNativeSaju } from './saju-engine';
import type { SajuInput } from './saju-session';

export const ELEMENT_ORDER=['목','화','토','금','수'] as const;
export type ElementName=(typeof ELEMENT_ORDER)[number];
export type ElementCounts=Record<ElementName,number>;

const LABEL:Record<ElementName,string>={목:'성장 · 확장',화:'표현 · 추진',토:'안정 · 조율',금:'결단 · 질서',수:'유연 · 통찰'};

export type ComplementDetail={element:ElementName;need:number;supply:number;matched:number;label:string};
export type ConnectionResult={
 a:{name:string;elements:ElementCounts;weakest:ElementName[]};
 b:{name:string;elements:ElementCounts;weakest:ElementName[]};
 score:number;
 grade:'매우 강한 보완'|'좋은 보완'|'부분 보완'|'보완 관찰';
 aReceives:ComplementDetail[];
 bReceives:ComplementDetail[];
 strongestForA:ComplementDetail|null;
 strongestForB:ComplementDetail|null;
 sharedGap:ElementName[];
 summary:string;
};

function normalized(counts:ElementCounts){
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+counts[k],0)||1;
 return Object.fromEntries(ELEMENT_ORDER.map(k=>[k,counts[k]/total])) as Record<ElementName,number>;
}
function complement(receiver:ElementCounts,supplier:ElementCounts){
 const r=normalized(receiver),s=normalized(supplier);
 return ELEMENT_ORDER.map(element=>{
  const target=.2;
  const need=Math.max(0,target-r[element]);
  const supply=Math.max(0,s[element]-target);
  return {element,need,supply,matched:Math.min(need,supply),label:LABEL[element]};
 }).sort((x,y)=>y.matched-x.matched);
}
function grade(score:number):ConnectionResult['grade']{
 if(score>=80)return '매우 강한 보완';
 if(score>=65)return '좋은 보완';
 if(score>=45)return '부분 보완';
 return '보완 관찰';
}

export function calculateConnection(aInput:SajuInput,bInput:SajuInput):ConnectionResult{
 const ar=calculateNativeSaju(aInput),br=calculateNativeSaju(bInput);
 const aReceives=complement(ar.elements,br.elements),bReceives=complement(br.elements,ar.elements);
 const aGain=aReceives.reduce((n,x)=>n+x.matched,0),bGain=bReceives.reduce((n,x)=>n+x.matched,0);
 const score=Math.max(0,Math.min(100,Math.round(35+(aGain+bGain)*325)));
 const strongestForA=aReceives.find(x=>x.matched>0.005)||null;
 const strongestForB=bReceives.find(x=>x.matched>0.005)||null;
 const sharedGap=ELEMENT_ORDER.filter(k=>ar.weakest.includes(k)&&br.weakest.includes(k));
 let summary=`두 사람의 오행 분포를 비교했을 때 ${grade(score)} 관계로 볼 수 있습니다.`;
 if(strongestForA)summary+=` ${bInput.name}님은 ${aInput.name}님의 ${strongestForA.element} 기운을 상대적으로 보완합니다.`;
 if(strongestForB)summary+=` ${aInput.name}님은 ${bInput.name}님의 ${strongestForB.element} 기운을 상대적으로 보완합니다.`;
 if(sharedGap.length)summary+=` 다만 ${sharedGap.join('·')} 기운은 두 사람 모두 낮게 나타나 관계 밖의 생활 습관과 환경에서도 균형을 살펴볼 수 있습니다.`;
 return {a:{name:aInput.name,elements:ar.elements,weakest:ar.weakest as ElementName[]},b:{name:bInput.name,elements:br.elements,weakest:br.weakest as ElementName[]},score,grade:grade(score),aReceives,bReceives,strongestForA,strongestForB,sharedGap,summary};
}

export function elementPercent(counts:ElementCounts,element:ElementName){
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+counts[k],0)||1;
 return Math.round((counts[element]/total)*100);
}
