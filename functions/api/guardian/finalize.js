const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const validId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const clean=(v,max)=>String(v??'').trim().slice(0,max);
export async function onRequestPost({request,env}){
  if(env?.LUMEN_GUARDIAN_ENABLED!=='true')return json({ok:false,error:'guardian_not_enabled'},503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const supplied=request.headers.get('x-lumen-internal-secret')||'';
  if(!env?.LUMEN_INTERNAL_SECRET||supplied!==env.LUMEN_INTERNAL_SECRET)return json({ok:false,error:'unauthorized'},401);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const id=clean(body?.id,40).toUpperCase(),paymentReference=clean(body?.paymentReference,120);
  if(!validId(id))return json({ok:false,error:'invalid_id'},400);
  const now=new Date().toISOString();
  let row;try{row=await env.GUARDIAN_DB.prepare('SELECT id,payment_status,issuance_status FROM guardian_orders WHERE id=? LIMIT 1').bind(id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  if(!row)return json({ok:false,error:'not_found'},404);
  if(row.issuance_status==='issued')return json({ok:true,id,status:'issued',idempotent:true});
  try{
    await env.GUARDIAN_DB.prepare(`UPDATE guardian_orders SET payment_status='paid',issuance_status='issued',payment_reference=?,paid_at=COALESCE(paid_at,?),issued_at=COALESCE(issued_at,?) WHERE id=?`).bind(paymentReference||null,now,now,id).run();
  }catch{return json({ok:false,error:'storage_write_failed'},500)}
  return json({ok:true,id,paymentStatus:'paid',issuanceStatus:'issued',issuedAt:now,verifyUrl:`/guardian-verify.html?id=${encodeURIComponent(id)}`});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
