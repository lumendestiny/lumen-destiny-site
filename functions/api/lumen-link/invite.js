const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const enc=new TextEncoder();
async function sha256(value){const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function onRequestGet({request,env}){
 if(env?.LUMEN_LINK_ENABLED!=='true')return json({ok:false,error:'link_not_enabled'},503);
 if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
 const token=(new URL(request.url).searchParams.get('token')||'').trim();
 if(token.length<20)return json({ok:false,error:'invalid_token'},400);
 const hash=await sha256(token);let row;
 try{row=await env.GUARDIAN_DB.prepare(`SELECT id,inviter_label,status,expires_at FROM lumen_link_invites WHERE token_hash=? LIMIT 1`).bind(hash).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
 if(!row)return json({ok:false,error:'invite_not_found'},404);
 const expired=Date.parse(row.expires_at)<=Date.now();
 return json({ok:true,invite:{id:row.id,inviterLabel:row.inviter_label,status:expired&&row.status==='open'?'expired':row.status,expiresAt:row.expires_at}});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
