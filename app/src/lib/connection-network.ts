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
 message:string;
};

export function summarizeNetwork(me:ElementCounts,members:NetworkMember[]):NetworkSummary{
 const totals=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,me[k]])) as Record<ElementName,number>;
 for(const member of members){for(const k of ELEMENT_ORDER)totals[k]+=member.elements[k];}
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+totals[k],0)||1;
 const aggregate=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,Math.round((totals[k]/total)*100)])) as Record<ElementName,number>;
 const values=ELEMENT_ORDER.map(k=>aggregate[k]);
 const max=Math.max(...values),min=Math.min(...values);
 const strongest=ELEMENT_ORDER.filter(k=>aggregate[k]===max),weakest=ELEMENT_ORDER.filter(k=>aggregate[k]===min);
 const spread=max-min;
 const coverage=Math.max(0,Math.min(100,100-Math.round(spread*2.2)));
 const averageScore=members.length?Math.round(members.reduce((sum,m)=>sum+m.score,0)/members.length):0;
 let message=members.length?`${members.length}명의 인연을 합산한 오행 네트워크입니다.`:'아직 연결된 인연이 없습니다.';
 if(members.length)message+=` 현재 네트워크에서 ${weakest.join('·')} 기운이 상대적으로 가장 낮게 나타납니다.`;
 return {memberCount:members.length,averageScore,aggregate,strongest,weakest,coverage,message};
}
