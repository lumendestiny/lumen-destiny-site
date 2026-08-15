const BASE='https://lumendestiny.com';

export type AccountProfile={id:string;locale?:string;createdAt?:string};
export type SyncedGuardian={id:string;tier:string;priceUsd:number;editionLimit:number;serial?:number|null;displayName:string;guardianDesignKey?:string|null;guardianElement?:string|null;issuanceStatus:string;issuedAt?:string|null;ownershipSource?:'purchase'|'gift'|'claim'};

async function authFetch(path:string,accessToken:string,init:RequestInit={}){
 if(!accessToken)throw new Error('auth_required');
 const headers={accept:'application/json',...(init.headers||{}),authorization:`Bearer ${accessToken}`};
 const r=await fetch(`${BASE}${path}`,{...init,headers});
 let d:any={};try{d=await r.json()}catch{}
 if(!r.ok)throw new Error(d?.error||`account_${r.status}`);
 return d;
}

export async function fetchAccountMe(accessToken:string):Promise<AccountProfile>{
 const d=await authFetch('/api/account/me',accessToken);return d.user as AccountProfile;
}

export async function fetchAccountGuardians(accessToken:string):Promise<SyncedGuardian[]>{
 const d=await authFetch('/api/account/guardians',accessToken);return Array.isArray(d.items)?d.items:[];
}

export async function claimGuardian(accessToken:string,claimToken:string){
 return authFetch('/api/account/guardians/claim',accessToken,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({claimToken})});
}

export async function logoutAccount(accessToken:string){
 return authFetch('/api/account/logout',accessToken,{method:'POST'});
}

export async function deleteAccount(accessToken:string){
 return authFetch('/api/account',accessToken,{method:'DELETE'});
}
