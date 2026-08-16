import type { ElementCounts, ElementName } from './connection-engine';
import { ELEMENT_ORDER } from './connection-engine';

export type NetworkMember={
 id:string;
 name:string;
 relation:string;
 elements:ElementCounts;
 score:number;
 grade:string;
 addedAt:string;
};

export type NetworkSummary={
 memberCount:number;
 averageScore:number;
 aggregate:Record<ElementName,number>;
 strongest:ElementName[];
 weakest:ElementName[];
 coverage:number;
 personalCoverage:number;
 balanceDelta:number;
 recommendedElements:ElementName[];
 message:string;
};

function coverageOf(values:Record<ElementName,number>){
 const list=ELEMENT_ORDER.map(k=>values[k]);
 const spread=Math.max(...list)-Math.min(...list);
 return Math.max(0,Math.min(100,100-Math.round(spread*2.2)));
}

function percentOf(counts:ElementCounts){
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+counts[k],0)||1;
 return Object.fromEntries(ELEMENT_ORDER.map(k=>[k,Math.round((counts[k]/total)*100)])) as Record<ElementName,number>;
}

export function summarizeNetwork(me:ElementCounts,members:NetworkMember[]):NetworkSummary{
 const personalAggregate=percentOf(me);
 const personalCoverage=coverageOf(personalAggregate);
 const totals=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,me[k]])) as Record<ElementName,number>;
 for(const member of members){for(const k of ELEMENT_ORDER)totals[k]+=member.elements[k];}
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+totals[k],0)||1;
 const aggregate=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,Math.round((totals[k]/total)*100)])) as Record<ElementName,number>;
 const values=ELEMENT_ORDER.map(k=>aggregate[k]);
 const max=Math.max(...values),min=Math.min(...values);
 const strongest=ELEMENT_ORDER.filter(k=>aggregate[k]===max),weakest=ELEMENT_ORDER.filter(k=>aggregate[k]===min);
 const coverage=coverageOf(aggregate);
 const balanceDelta=coverage-personalCoverage;
 const sorted=ELEMENT_ORDER.map(k=>({element:k,value:aggregate[k]})).sort((a,b)=>a.value-b.value);
 const recommendedElements=sorted.filter(x=>x.value<=sorted[0].value+3).slice(0,2).map(x=>x.element);
 const averageScore=members.length?Math.round(members.reduce((sum,m)=>sum+m.score,0)/members.length):0;
 let message=members.length?`${members.length}명의 인연을 합산한 오행 네트워크입니다.`:'아직 연결된 인연이 없습니다.';
 if(members.length){
  message+=` 현재 네트워크에서 ${weakest.join('·')} 기운이 상대적으로 가장 낮게 나타납니다.`;
  if(balanceDelta>0)message+=` 인연이 연결되기 전보다 균형도가 ${balanceDelta}점 높아졌습니다.`;
  else if(balanceDelta<0)message+=` 현재 구성에서는 개인 기준보다 균형도가 ${Math.abs(balanceDelta)}점 낮아져 다양한 기운의 인연을 더 살펴볼 수 있습니다.`;
  else message+=' 개인 기준과 현재 인연망의 균형도는 같습니다.';
 }
 return {memberCount:members.length,averageScore,aggregate,strongest,weakest,coverage,personalCoverage,balanceDelta,recommendedElements,message};
}
