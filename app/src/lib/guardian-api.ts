export type GuardianAvailability={key:string;tier:string;limit:number;issued:number;remaining:number;soldOut:boolean};
const BASE='https://lumendestiny.com';
export async function fetchGuardianAvailability(){
 const r=await fetch(`${BASE}/api/guardian/availability`,{headers:{accept:'application/json'}});
 if(!r.ok)throw new Error(`availability_${r.status}`);
 const d=await r.json();
 if(!d?.ok||!Array.isArray(d.items))throw new Error('availability_invalid');
 return d.items as GuardianAvailability[];
}
export function guardianOrderUrl(key:string,element?:string){
 const u=new URL(`${BASE}/guardian-order/`);u.searchParams.set('guardian',key);u.searchParams.set('fromArchive','1');if(element)u.searchParams.set('element',element);u.searchParams.set('source','app');return u.toString();
}
