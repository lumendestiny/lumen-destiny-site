const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const ELEMENTS=['목','화','토','금','수'];
const enc=new TextEncoder();
async function sha256(value){const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function validElements(v){return v&&ELEMENTS.every(k=>Number.isFinite(Number(v[k]))&&Number(v[k])>=0)}
export async function onRequestPost({request,env}){
 if(env?.LUMEN_LINK_ENABLED!=='true')return json({ok:false,error:'link_not_enabled'},503);
 if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
 let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
 const token=String(body?.token||'').trim(),participantLabel=String(body?.participantLabel||'').trim().slice(0,40),relationLabel=String(body?.relationLabel||'').trim().slice(0,30);
 const elements=body?.elements,weakest=Array.isArray(body?.weakest)?body.weakest.filter(x=>ELEMENTS.includes(x)).slice(0,5):[];
 const score=Math.max(0,Math.min(100,Number(body?.score)||0)),grade=String(body?.grade||'').trim().slice(0,30),sharedGap=Array.isArray(body?.sharedGap)?body.sharedGap.filter(x=>ELEMENTS.includes(x)).slice(0,5):[];
 if(token.length<20||!participantLabel||!validElements(elements)||!grade)return json({ok:false,error:'invalid_payload'},400);
 const tokenHash=await sha256(token);let invite;
 try{invite=await env.GUARDIAN_DB.prepare(`SELECT id,status,expires_at FROM lumen_link_invites WHERE token_hash=? LIMIT 1`).bind(tokenHash).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
 if(!invite)return json({ok:false,error:'invite_not_found'},404);
 if(invite.status!=='open')return json({ok:false,error:'invite_closed'},409);
 if(Date.parse(invite.expires_at)<=Date.now())return json({ok:false,error:'invite_expired'},410);
 const id=`LLR-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
 try{
  await env.GUARDIAN_DB.batch([
   env.GUARDIAN_DB.prepare(`INSERT INTO lumen_link_relationships (id,invite_id,participant_label,relation_label,participant_elements_json,participant_weakest_json,complement_score,complement_grade,strongest_for_inviter,strongest_for_participant,shared_gap_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(id,invite.id,participantLabel,relationLabel||null,JSON.stringify(elements),JSON.stringify(weakest),score,grade,String(body?.strongestForInviter||'').slice(0,10)||null,String(body?.strongestForParticipant||'').slice(0,10)||null,JSON.stringify(sharedGap)),
   env.GUARDIAN_DB.prepare(`UPDATE lumen_link_invites SET status='used',used_at=CURRENT_TIMESTAMP WHERE id=? AND status='open'`).bind(invite.id)
  ])
 }catch{return json({ok:false,error:'storage_write_failed'},500)}
 return json({ok:true,relationship:{id,inviteId:invite.id}});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
