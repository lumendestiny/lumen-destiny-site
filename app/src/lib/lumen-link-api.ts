import { savePendingInvite } from './lumen-link-invite-vault';

const API_BASE='https://lumendestiny.com';

export type LinkInvite={id:string;token:string;expiresAt:string};
export type PublicLinkInvite={id:string;inviterLabel:string;status:string;expiresAt:string};
export type LinkRelationship={id:string;participantLabel:string;relationLabel:string;elements:Record<string,number>;weakest:string[];score:number;grade:string;strongestForInviter:string|null;strongestForParticipant:string|null;sharedGap:string[];createdAt:string};
export type LinkInviteStatus={invite:{id:string;status:string;expiresAt:string;usedAt:string|null};relationship:LinkRelationship|null};

export async function createLumenLinkInvite(input:{inviterLabel:string;elements:Record<string,number>;weakest:string[]}):Promise<LinkInvite>{
 const r=await fetch(`${API_BASE}/api/lumen-link/create`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_create_failed');
 const invite=data.invite as LinkInvite;
 await savePendingInvite(invite,input.inviterLabel?`${input.inviterLabel}님의 인연지도 초대`:'인연지도 초대');
 return invite;
}

export async function getLumenLinkInvite(token:string):Promise<PublicLinkInvite>{
 const r=await fetch(`${API_BASE}/api/lumen-link/invite?token=${encodeURIComponent(token)}`,{headers:{Accept:'application/json'}});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_lookup_failed');
 return data.invite as PublicLinkInvite;
}

export async function joinLumenLinkInvite(input:{token:string;participantLabel:string;relationLabel?:string;elements:Record<string,number>;weakest:string[]}){
 const r=await fetch(`${API_BASE}/api/lumen-link/join`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_join_failed');
 return data.relationship;
}

export async function getLumenLinkInviteStatus(token:string):Promise<LinkInviteStatus>{
 const r=await fetch(`${API_BASE}/api/lumen-link/status?token=${encodeURIComponent(token)}`,{headers:{Accept:'application/json'}});
 const data=await r.json();
 if(!r.ok||!data?.ok)throw new Error(data?.error||'invite_status_failed');
 return {invite:data.invite,relationship:data.relationship};
}

export function buildLumenLinkUrl(token:string){
 return `${API_BASE}/link/${encodeURIComponent(token)}`;
}
