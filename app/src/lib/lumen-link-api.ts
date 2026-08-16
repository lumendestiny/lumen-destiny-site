const API_BASE='https://lumendestiny.com';

export type LinkInvite={id:string;token:string;expiresAt:string};

export async function createLumenLinkInvite(input:{inviterLabel:string;elements:Record<string,number>;weakest:string[]}):Promise<LinkInvite>{
 const r=await fetch(`${API_BASE}/api/lumen-link/create`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_create_failed');
 return data.invite as LinkInvite;
}

export async function joinLumenLinkInvite(input:{token:string;participantLabel:string;relationLabel?:string;elements:Record<string,number>;weakest:string[]}){
 const r=await fetch(`${API_BASE}/api/lumen-link/join`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_join_failed');
 return data.relationship;
}

export function buildLumenLinkUrl(token:string){
 return `${API_BASE}/link/${encodeURIComponent(token)}`;
}
