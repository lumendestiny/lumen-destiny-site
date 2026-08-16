import type { ElementCounts, ElementName } from './connection-engine';
import { ELEMENT_ORDER } from './connection-engine';

export type RelationGroup='family'|'partner'|'friend'|'work'|'other';
export type RelationFilter='all'|RelationGroup;

export const RELATION_FILTER_OPTIONS:{id:RelationFilter;label:string}[]=[
 {id:'all',label:'전체'},
 {id:'family',label:'가족'},
 {id:'partner',label:'연인·배우자'},
 {id:'friend',label:'친구'},
 {id:'work',label:'직장·사업'},
 {id:'other',label:'기타'},
];

const PARTNER_WORDS=['아내','남편','배우자','연인','애인','여자친구','남자친구','약혼','와이프','허즈번드','wife','husband','partner','girlfriend','boyfriend'];
const FAMILY_WORDS=['가족','부모','엄마','아빠','어머니','아버지','할머니','할아버지','형','누나','언니','오빠','동생','아들','딸','자녀','아이','사촌','삼촌','이모','고모','조카','며느리','사위','장모','장인','시어머니','시아버지','family','mother','father','sister','brother','son','daughter'];
const FRIEND_WORDS=['친구','지인','동창','동문','선배','후배','친한','베프','friend'];
const WORK_WORDS=['직장','회사','동료','상사','부하','팀장','대표','사장','직원','거래처','고객','사업','비즈니스','파트너사','협력','투자자','업무','work','coworker','colleague','boss','client','business'];

function includesAny(value:string,words:string[]){const normalized=value.trim().toLowerCase();return words.some(word=>normalized.includes(word.toLowerCase()));}

export function inferRelationGroup(relation:string):RelationGroup{
 if(includesAny(relation,PARTNER_WORDS))return 'partner';
 if(includesAny(relation,FAMILY_WORDS))return 'family';
 if(includesAny(relation,WORK_WORDS))return 'work';
 if(includesAny(relation,FRIEND_WORDS))return 'friend';
 return 'other';
}

export function relationGroupLabel(group:RelationFilter){return RELATION_FILTER_OPTIONS.find(option=>option.id===group)?.label||'기타';}

export type NetworkMember={
 id:string;
 name:string;
 relation:string;
 relationGroup?:RelationGroup;
 elements:ElementCounts;
 score:number;
 grade:string;
 addedAt:string;
};

export function memberRelationGroup(member:NetworkMember):RelationGroup{return member.relationGroup||inferRelationGroup(member.relation);}
export function filterMembersByRelation(members:NetworkMember[],group:RelationFilter){return group==='all'?members:members.filter(member=>memberRelationGroup(member)===group);}

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

export type MemberImpact={
 memberId:string;
 beforeCoverage:number;
 afterCoverage:number;
 coverageDelta:number;
 beforeAggregate:Record<ElementName,number>;
 afterAggregate:Record<ElementName,number>;
 elementDelta:Record<ElementName,number>;
 strongestIncrease:ElementName[];
 strongestDecrease:ElementName[];
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

function aggregateNetwork(me:ElementCounts,members:NetworkMember[]){
 const totals=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,me[k]])) as Record<ElementName,number>;
 for(const member of members){for(const k of ELEMENT_ORDER)totals[k]+=member.elements[k];}
 const total=ELEMENT_ORDER.reduce((sum,k)=>sum+totals[k],0)||1;
 return Object.fromEntries(ELEMENT_ORDER.map(k=>[k,Math.round((totals[k]/total)*100)])) as Record<ElementName,number>;
}

export function summarizeNetwork(me:ElementCounts,members:NetworkMember[]):NetworkSummary{
 const personalAggregate=percentOf(me);
 const personalCoverage=coverageOf(personalAggregate);
 const aggregate=aggregateNetwork(me,members);
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

export function summarizeMemberImpact(me:ElementCounts,members:NetworkMember[],memberId:string):MemberImpact|null{
 const member=members.find(item=>item.id===memberId);
 if(!member)return null;
 const beforeMembers=members.filter(item=>item.id!==memberId);
 const beforeAggregate=aggregateNetwork(me,beforeMembers);
 const afterAggregate=aggregateNetwork(me,members);
 const beforeCoverage=coverageOf(beforeAggregate);
 const afterCoverage=coverageOf(afterAggregate);
 const elementDelta=Object.fromEntries(ELEMENT_ORDER.map(k=>[k,afterAggregate[k]-beforeAggregate[k]])) as Record<ElementName,number>;
 const deltaValues=ELEMENT_ORDER.map(k=>elementDelta[k]);
 const maxDelta=Math.max(...deltaValues),minDelta=Math.min(...deltaValues);
 const strongestIncrease=maxDelta>0?ELEMENT_ORDER.filter(k=>elementDelta[k]===maxDelta):[];
 const strongestDecrease=minDelta<0?ELEMENT_ORDER.filter(k=>elementDelta[k]===minDelta):[];
 return {memberId,beforeCoverage,afterCoverage,coverageDelta:afterCoverage-beforeCoverage,beforeAggregate,afterAggregate,elementDelta,strongestIncrease,strongestDecrease};
}
