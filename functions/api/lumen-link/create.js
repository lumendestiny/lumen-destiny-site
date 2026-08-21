const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Accept','Access-Control-Max-Age':'86400'};
const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff',...cors};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const ELEMENTS=['목','화','토','금','수'];
const enc=new TextEncoder();
const b64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function sha256(value){const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function validElements(v){return v&&ELEMENTS.every(k=>Number.isFinite(Number(v[k]))&&Number(v[k])>=0)}
export async function onRequestOptions(){return new Response(null,{status:204,headers:cors})}
export async function onRequestPost({request,env}){
 if(env?.LUMEN_LINK_ENABLED!=='true')return json({ok:false,error:'link_not_enabled'},503);
 if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
 let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
 const inviterLabel=String(body?.inviterLabel||'').trim().slice(0,40);
 const elements=body?.elements,weakest=Array.isArray(body?.weakest)?body.weakest.filter(x=>ELEMENTS.includes(x)).slice(0,5):[];
 if(!inviterLabel||!validElements(elements))return json({ok:false,error:'invalid_payload'},400);
 const tokenBytes=crypto.getRandomValues(new Uint8Array(24)),token=b64url(tokenBytes),tokenHash=await sha256(token);
 const id=`LL-${Date.now().toString(36).toUpperCase()}-${b64url(crypto.getRandomValues(new Uint8Array(5))).toUpperCase()}`;
 const expiresAt=new Date(Date.now()+7*24*60*60*1000).toISOString();
 try{await env.GUARDIAN_DB.prepare(`INSERT INTO lumen_link_invites (id,token_hash,inviter_label,inviter_elements_json,inviter_weakest_json,status,expires_at) VALUES (?,?,?,?,?,'open',?)`).bind(id,tokenHash,inviterLabel,JSON.stringify(elements),JSON.stringify(weakest),expiresAt).run()}catch{return json({ok:false,error:'storage_write_failed'},500)}
 return json({ok:true,invite:{id,token,expiresAt}});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
