export type GuardianAvailability={key:string;tier:string;limit:number;issued:number;remaining:number;soldOut:boolean};
export type GuardianOrderDraft={
 guardianKey:string;tier:'basic'|'custom'|'rare'|'legendary';name:string;wishType:string;element?:string;
 isGift?:boolean;giverName?:string;recipientName?:string;giftMessage?:string;targetDate?:string;
};
export type GuardianOrderResponse={ok:boolean;order?:{id:string;tier:string;priceUsd:number;editionLimit:number;editionKey:string;guardianElement?:string;guardianDesignKey?:string};verifyUrl?:string;error?:string;message?:string};
const BASE='https://lumendestiny.com';
export async function fetchGuardianAvailability(){
 const r=await fetch(`${BASE}/api/guardian/availability`,{headers:{accept:'application/json'},cache:'no-store'});
 if(!r.ok)throw new Error(`availability_${r.status}`);
 const d=await r.json();
 if(!d?.ok||!Array.isArray(d.items))throw new Error('availability_invalid');
 return d.items as GuardianAvailability[];
}
export async function fetchGuardianAvailabilityFor(key:string){
 const items=await fetchGuardianAvailability();return items.find(x=>x.key===key)||null;
}
export async function createGuardianOrder(input:GuardianOrderDraft):Promise<GuardianOrderResponse>{
 const r=await fetch(`${BASE}/api/guardian/orders`,{method:'POST',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify({
  guardianKey:input.guardianKey,tier:input.tier,name:input.name,wishType:input.wishType,element:input.element,source:input.element?'saju-result':'app',
  isGift:!!input.isGift,giverName:input.giverName||'',recipientName:input.recipientName||'',giftMessage:input.giftMessage||'',targetDate:input.targetDate||'',editionKey:input.guardianKey
 })});
 let d:any={};try{d=await r.json()}catch{}
 if(!r.ok)return{ok:false,error:d?.error||`order_${r.status}`,message:d?.message};
 return d as GuardianOrderResponse;
}
