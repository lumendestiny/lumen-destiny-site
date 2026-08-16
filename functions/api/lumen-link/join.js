const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const ELEMENTS=['목','화','토','금','수'];
const enc=new TextEncoder();
async function sha256(value){const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function validElements(v){return v&&ELEMENTS.every(k=>Number.isFinite(Number(v[k]))&&Number(v[k])>=0)}
function normalized(v){const total=ELEMENTS.reduce((n,k)=>n+Number(v[k]||0),0)||1;return Object.fromEntries(ELEMENTS.map(k=>[k,Number(v[k]||0)/total]))}
function complement(receiver,supplier){const r=normalized(receiver),s=normalized(supplier);return ELEMENTS.map(element=>{const need=Math.max(0,.2-r[element]),supply=Math.max(0,s[element]-.2);return {element,matched:Math.min(need,supply)}}).sort((a,b)=>b.matched-a.matched)}
function grade(score){if(score>=80)return '매우 강한 보완';if(score>=65)return '좋은 보완';if(score>=45)return '부분 보완';return '보완 관찰'}
function calculate(inviter,participant){const a=complement(inviter,participant),b=complement(participant,inviter);const gain=a.reduce((n,x)=>n+x.matched,0)+b.reduce((n,x)=>n+x.matched,0);const score=Math.max(0,Math.min(100,Math.round(35+gain*325)));const weakest=v=>{const vals=ELEMENTS.map(k=>Number(v[k]||0)),m=Math.min(...vals);return ELEMENTS.filter(k=>Number(v[k]||0)===m)};return {score,grade:grade(score),strongestForInviter:a.find(x=>x.matched>.005)?.element||null,strongestForParticipant:b.find(x=>x.matched>.005)?.element||null,sharedGap:weakest(inviter).filter(x=>weakest(participant).includes(x))}}
export async function onRequestPost({request,env}){
 if(env?.LUMEN_LINK_ENABLED!=='true')return json({ok:false,error:'link_not_enabled'},503);
 if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
 let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
 const token=String(body?.token||'').trim(),participantLabel=String(body?.participantLabel||'').trim().slice(0,40),relationLabel=String(body?.relationLabel||'').trim().slice(0,30),elements=body?.elements;
 const weakest=Array.isArray(body?.weakest)?body.weakest.filter(x=>ELEMENTS.includes(x)).slice(0,5):[];
 if(token.length<20||!participantLabel||!validElements(elements))return json({ok:false,error:'invalid_payload'},400);
 const tokenHash=await sha256(token);let invite;
 try{invite=await env.GUARDIAN_DB.prepare(`SELECT id,status,expires_at,inviter_elements_json FROM lumen_link_invites WHERE token_hash=? LIMIT 1`).bind(tokenHash).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
 if(!invite)return json({ok:false,error:'invite_not_found'},404);
 if(invite.status!=='open')return json({ok:false,error:'invite_closed'},409);
 if(Date.parse(invite.expires_at)<=Date.now())return json({ok:false,error:'invite_expired'},410);
 let inviterElements;try{inviterElements=JSON.parse(invite.inviter_elements_json)}catch{return json({ok:false,error:'invite_corrupt'},500)}
 if(!validElements(inviterElements))return json({ok:false,error:'invite_corrupt'},500);
 const result=calculate(inviterElements,elements),id=`LLR-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
 try{await env.GUARDIAN_DB.batch([
  env.GUARDIAN_DB.prepare(`INSERT INTO lumen_link_relationships (id,invite_id,participant_label,relation_label,participant_elements_json,participant_weakest_json,complement_score,complement_grade,strongest_for_inviter,strongest_for_participant,shared_gap_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(id,invite.id,participantLabel,relationLabel||null,JSON.stringify(elements),JSON.stringify(weakest),result.score,result.grade,result.strongestForInviter,result.strongestForParticipant,JSON.stringify(result.sharedGap)),
  env.GUARDIAN_DB.prepare(`UPDATE lumen_link_invites SET status='used',used_at=CURRENT_TIMESTAMP WHERE id=? AND status='open'`).bind(invite.id)
 ])}catch{return json({ok:false,error:'storage_write_failed'},500)}
 return json({ok:true,relationship:{id,inviteId:invite.id,...result}});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
