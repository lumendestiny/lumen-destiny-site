const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
const validId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const clean=(v,max)=>String(v??'').trim().slice(0,max);
const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
async function logEvent(env,e){try{await env.GUARDIAN_DB.prepare(`INSERT OR IGNORE INTO guardian_payment_events (event_id,provider,event_type,guardian_id,payment_reference,amount_usd,currency,status,received_at,processed_at,error_code) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(e.eventId,e.provider,e.event,e.guardianId||null,e.paymentReference||null,e.amount,e.currency||null,e.status,e.receivedAt,e.processedAt||null,e.errorCode||null).run()}catch{}}
async function ensureSlots(env,editionKey,tier,limit){const sql=`WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<?) INSERT OR IGNORE INTO guardian_edition_slots (edition_key,slot_no,tier) SELECT ?,n,? FROM seq`;await env.GUARDIAN_DB.prepare(sql).bind(limit,editionKey,tier).run()}
async function claimSlot(env,editionKey,tier,limit,id,now){await ensureSlots(env,editionKey,tier,limit);return env.GUARDIAN_DB.prepare(`UPDATE guardian_edition_slots SET order_id=?,reserved_at=? WHERE edition_key=? AND slot_no=(SELECT slot_no FROM guardian_edition_slots WHERE edition_key=? AND order_id IS NULL ORDER BY slot_no LIMIT 1) AND order_id IS NULL RETURNING slot_no`).bind(id,now,editionKey,editionKey).first()}
async function releaseSlot(env,id){try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_edition_slots SET order_id=NULL,reserved_at=NULL WHERE order_id=?`).bind(id).run()}catch{}}
export async function onRequestPost({request,env}){
  if(env?.LUMEN_PAYMENTS_ENABLED!=='true')return json({ok:false,error:'payments_not_enabled'},503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const supplied=request.headers.get('x-lumen-webhook-secret')||'';
  if(!env?.LUMEN_PAYMENT_WEBHOOK_SECRET||supplied!==env.LUMEN_PAYMENT_WEBHOOK_SECRET)return json({ok:false,error:'unauthorized'},401);
  const ct=request.headers.get('content-type')||'';if(!ct.toLowerCase().includes('application/json'))return json({ok:false,error:'content_type_required'},415);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const event=clean(body?.event,60),id=clean(body?.guardianId,40).toUpperCase(),paymentReference=clean(body?.paymentReference,120),provider=clean(body?.provider||'adapter',40).toLowerCase(),eventId=clean(body?.eventId||paymentReference,160),currency=clean(body?.currency||'USD',8).toUpperCase(),amount=num(body?.amount);
  const receivedAt=new Date().toISOString();
  if(!eventId)return json({ok:false,error:'event_id_required'},400);
  if(event!=='payment.succeeded'){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'ignored',receivedAt,processedAt:receivedAt});return json({ok:true,ignored:true,event:event||'unknown'});}
  if(!validId(id))return json({ok:false,error:'invalid_guardian_id'},400);
  let row;try{row=await env.GUARDIAN_DB.prepare('SELECT id,tier,price_usd,edition_limit,edition_key,issuance_serial,payment_status,issuance_status,payment_reference FROM guardian_orders WHERE id=? LIMIT 1').bind(id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  if(!row){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'rejected',receivedAt,processedAt:receivedAt,errorCode:'not_found'});return json({ok:false,error:'not_found'},404)}
  if(currency!=='USD'){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'rejected',receivedAt,processedAt:receivedAt,errorCode:'currency_mismatch'});return json({ok:false,error:'currency_mismatch'},409)}
  if(amount===null||Math.abs(amount-Number(row.price_usd))>0.0001){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'rejected',receivedAt,processedAt:receivedAt,errorCode:'amount_mismatch'});return json({ok:false,error:'amount_mismatch',expected:Number(row.price_usd)},409)}
  let duplicate=false;try{const old=await env.GUARDIAN_DB.prepare('SELECT event_id,status FROM guardian_payment_events WHERE event_id=? LIMIT 1').bind(eventId).first();duplicate=!!old}catch{}
  if(duplicate)return json({ok:true,id,status:row.issuance_status||'pending',idempotent:true});
  if(row.payment_status==='paid'&&row.issuance_status==='issued'){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'processed',receivedAt,processedAt:receivedAt});return json({ok:true,id,status:'issued',serial:row.issuance_serial||null,idempotent:true})}
  const editionKey=clean(row.edition_key,80)||`${clean(row.tier,20)}-default`,limit=Math.max(1,Math.min(1000,Number(row.edition_limit)||1));let slot;
  try{slot=await claimSlot(env,editionKey,clean(row.tier,20),limit,id,receivedAt)}catch{return json({ok:false,error:'edition_reservation_failed'},500)}
  if(!slot){await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'rejected',receivedAt,processedAt:receivedAt,errorCode:'edition_sold_out'});return json({ok:false,error:'edition_sold_out'},409)}
  try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_orders SET payment_status='paid',issuance_status='issued',payment_reference=?,payment_provider=?,payment_event_id=?,paid_at=COALESCE(paid_at,?),issued_at=COALESCE(issued_at,?),edition_key=?,issuance_serial=? WHERE id=? AND payment_status!='refunded' AND issuance_status!='issued'`).bind(paymentReference||null,provider,eventId,receivedAt,receivedAt,editionKey,Number(slot.slot_no),id).run()}catch{await releaseSlot(env,id);return json({ok:false,error:'storage_write_failed'},500)}
  await logEvent(env,{eventId,provider,event,guardianId:id,paymentReference,amount,currency,status:'processed',receivedAt,processedAt:receivedAt});
  return json({ok:true,id,paymentStatus:'paid',issuanceStatus:'issued',editionKey,serial:Number(slot.slot_no),editionLimit:limit,issuedAt:receivedAt,verifyUrl:`/guardian-verify.html?id=${encodeURIComponent(id)}`});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405,{Allow:'POST'})}
