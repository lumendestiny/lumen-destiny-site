const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const enc=new TextEncoder();
async function sha256(value){const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function onRequestGet({request,env}){
 if(env?.LUMEN_LINK_ENABLED!=='true')return json({ok:false,error:'link_not_enabled'},503);
 if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
 const token=(new URL(request.url).searchParams.get('token')||'').trim();
 if(token.length<20)return json({ok:false,error:'invalid_token'},400);
 const tokenHash=await sha256(token);
 let invite;try{invite=await env.GUARDIAN_DB.prepare(`SELECT id,status,expires_at,used_at FROM lumen_link_invites WHERE token_hash=? LIMIT 1`).bind(tokenHash).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
 if(!invite)return json({ok:false,error:'invite_not_found'},404);
 let relationship=null;
 if(invite.status==='used'){
  try{relationship=await env.GUARDIAN_DB.prepare(`SELECT id,participant_label,relation_label,participant_elements_json,participant_weakest_json,complement_score,complement_grade,strongest_for_inviter,strongest_for_participant,shared_gap_json,created_at FROM lumen_link_relationships WHERE invite_id=? ORDER BY created_at DESC LIMIT 1`).bind(invite.id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
 }
 return json({ok:true,invite:{id:invite.id,status:invite.status,expiresAt:invite.expires_at,usedAt:invite.used_at||null},relationship:relationship?{id:relationship.id,participantLabel:relationship.participant_label,relationLabel:relationship.relation_label||'',elements:JSON.parse(relationship.participant_elements_json||'{}'),weakest:JSON.parse(relationship.participant_weakest_json||'[]'),score:Number(relationship.complement_score)||0,grade:relationship.complement_grade,strongestForInviter:relationship.strongest_for_inviter||null,strongestForParticipant:relationship.strongest_for_participant||null,sharedGap:JSON.parse(relationship.shared_gap_json||'[]'),createdAt:relationship.created_at}:null});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
