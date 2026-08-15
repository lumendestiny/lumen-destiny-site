import { calculateSaju, lunarToSolar } from '@fullstackfamily/manseryeok';
import type { SajuInput } from './saju-session';

const STEM_ELEMENT: Record<string,string>={갑:'목',을:'목',병:'화',정:'화',무:'토',기:'토',경:'금',신:'금',임:'수',계:'수'};
const STEM_YANG: Record<string,number>={갑:1,을:0,병:1,정:0,무:1,기:0,경:1,신:0,임:1,계:0};
const BRANCH_ELEMENT: Record<string,string>={자:'수',축:'토',인:'목',묘:'목',진:'토',사:'화',오:'화',미:'토',신:'금',유:'금',술:'토',해:'수'};
const HIDDEN: Record<string,string[]>={자:['계'],축:['기','계','신'],인:['갑','병','무'],묘:['을'],진:['무','을','계'],사:['병','무','경'],오:['정','기'],미:['기','정','을'],신:['경','임','무'],유:['신'],술:['무','신','정'],해:['임','갑']};
const GEN: Record<string,string>={목:'화',화:'토',토:'금',금:'수',수:'목'};
const CONTROL: Record<string,string>={목:'토',토:'수',수:'화',화:'금',금:'목'};
const ELEMENTS=['목','화','토','금','수'] as const;

export type NativeSajuResult={
 solarDate:string;
 pillars:{year:string;month:string;day:string;hour:string|null};
 pillarHanja:{year:string;month:string;day:string;hour:string|null};
 dayMaster:string;
 elements:Record<(typeof ELEMENTS)[number],number>;
 tenGods:{year:string;month:string;hour:string|null;hidden:Record<string,string[]>};
 correctedTime?:{hour:number;minute:number}|null;
 isTimeCorrected:boolean;
 strongest:string[];
 weakest:string[];
};

function tenGod(day:string,target:string){
 const me=STEM_ELEMENT[day],t=STEM_ELEMENT[target];if(!me||!t)return '—';
 const same=STEM_YANG[day]===STEM_YANG[target];
 if(me===t)return same?'비견':'겁재';
 if(GEN[me]===t)return same?'식신':'상관';
 if(CONTROL[me]===t)return same?'편재':'정재';
 if(CONTROL[t]===me)return same?'편관':'정관';
 if(GEN[t]===me)return same?'편인':'정인';
 return '—';
}

function countElements(pillars:(string|null)[]){
 const c={목:0,화:0,토:0,금:0,수:0};
 for(const p of pillars){if(!p)continue;const s=p[0],b=p[1];const se=STEM_ELEMENT[s] as keyof typeof c,be=BRANCH_ELEMENT[b] as keyof typeof c;if(se)c[se]++;if(be)c[be]++;}
 return c;
}

export function calculateNativeSaju(input:SajuInput):NativeSajuResult{
 const [rawY,rawM,rawD]=input.birthDate.split('-').map(Number);
 let y=rawY,m=rawM,d=rawD;
 if(input.calendar==='lunar'){
  const converted=lunarToSolar(y,m,d,false);
  y=converted.solar.year;m=converted.solar.month;d=converted.solar.day;
 }
 let hour:number|undefined,minute:number|undefined;
 if(input.birthTime){const parts=input.birthTime.split(':').map(Number);hour=parts[0];minute=parts[1]||0;}
 const r=calculateSaju(y,m,d,hour,minute);
 const pillars=[r.yearPillar,r.monthPillar,r.dayPillar,r.hourPillar||null];
 const elements=countElements(pillars);
 const values=ELEMENTS.map(k=>elements[k]),max=Math.max(...values),min=Math.min(...values);
 const dayMaster=r.dayPillar?.[0]||'';
 const hidden:Record<string,string[]>={};
 for(const p of pillars){if(!p)continue;const b=p[1];hidden[b]=(HIDDEN[b]||[]).map(s=>`${s}·${tenGod(dayMaster,s)}`)}
 return {
  solarDate:`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
  pillars:{year:r.yearPillar,month:r.monthPillar,day:r.dayPillar,hour:r.hourPillar||null},
  pillarHanja:{year:r.yearPillarHanja,month:r.monthPillarHanja,day:r.dayPillarHanja,hour:r.hourPillarHanja||null},
  dayMaster,
  elements,
  tenGods:{year:tenGod(dayMaster,r.yearPillar[0]),month:tenGod(dayMaster,r.monthPillar[0]),hour:r.hourPillar?tenGod(dayMaster,r.hourPillar[0]):null,hidden},
  correctedTime:r.correctedTime||null,
  isTimeCorrected:!!r.isTimeCorrected,
  strongest:ELEMENTS.filter(k=>elements[k]===max),
  weakest:ELEMENTS.filter(k=>elements[k]===min),
 };
}
