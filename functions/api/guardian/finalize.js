const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const validId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const clean=(v,max)=>String(v??'').trim().slice(0,max);
async function ensureSlots(env,editionKey,tier,limit){const sql=`WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<?) INSERT OR IGNORE INTO guardian_edition_slots (edition_key,slot_no,tier) SELECT ?,n,? FROM seq`;await env.GUARDIAN_DB.prepare(sql).bind(limit,editionKey,tier).run()}
async function claimSlot(env,editionKey,tier,limit,id,now){await ensureSlots(env,editionKey,tier,limit);return env.GUARDIAN_DB.prepare(`UPDATE guardian_edition_slots SET order_id=?,reserved_at=? WHERE edition_key=? AND slot_no=(SELECT slot_no FROM guardian_edition_slots WHERE edition_key=? AND order_id IS NULL ORDER BY slot_no LIMIT 1) AND order_id IS NULL RETURNING slot_no`).bind(id,now,editionKey,editionKey).first()}
async function releaseSlot(env,id){try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_edition_slots SET order_id=NULL,reserved_at=NULL WHERE order_id=?`).bind(id).run()}catch{}}
export async function onRequestPost({request,env}){
  if(env?.LUMEN_GUARDIAN_ENABLED!=='true')return json({ok:false,error:'guardian_not_enabled'},503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const supplied=request.headers.get('x-lumen-internal-secret')||'';
  if(!env?.LUMEN_INTERNAL_SECRET||supplied!==env.LUMEN_INTERNAL_SECRET)return json({ok:false,error:'unauthorized'},401);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const id=clean(body?.id,40).toUpperCase(),paymentReference=clean(body?.paymentReference,120);
  if(!validId(id))return json({ok:false,error:'invalid_id'},400);
  const now=new Date().toISOString();
  let row;try{row=await env.GUARDIAN_DB.prepare('SELECT id,tier,edition_limit,edition_key,issuance_serial,payment_status,issuance_status,payment_reference FROM guardian_orders WHERE id=? LIMIT 1').bind(id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  if(!row)return json({ok:false,error:'not_found'},404);
  if(row.issuance_status==='issued')return json({ok:true,id,status:'issued',serial:row.issuance_serial||null,idempotent:true});
  if(row.payment_status!=='paid')return json({ok:false,error:'payment_not_confirmed',paymentStatus:row.payment_status||'pending'},409);
  const editionKey=clean(row.edition_key,80)||`${clean(row.tier,20)}-default`,limit=Math.max(1,Math.min(1000,Number(row.edition_limit)||1));let slot;
  try{slot=await claimSlot(env,editionKey,clean(row.tier,20),limit,id,now)}catch{return json({ok:false,error:'edition_reservation_failed'},500)}
  if(!slot)return json({ok:false,error:'edition_sold_out'},409);
  try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_orders SET issuance_status='issued',payment_reference=COALESCE(payment_reference,?),issued_at=COALESCE(issued_at,?),edition_key=?,issuance_serial=?,fulfillment_status='issued' WHERE id=? AND payment_status='paid' AND issuance_status!='issued'`).bind(paymentReference||null,now,editionKey,Number(slot.slot_no),id).run()}catch{await releaseSlot(env,id);return json({ok:false,error:'storage_write_failed'},500)}
  return json({ok:true,id,paymentStatus:'paid',issuanceStatus:'issued',editionKey,serial:Number(slot.slot_no),editionLimit:limit,issuedAt:now,verifyUrl:`/guardian-verify/?id=${encodeURIComponent(id)}`});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
