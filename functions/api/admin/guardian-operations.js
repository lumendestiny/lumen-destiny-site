const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const auth=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
const limit=n=>Math.max(1,Math.min(100,Number(n)||25));
export async function onRequestGet({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const url=new URL(request.url),n=limit(url.searchParams.get('limit'));
  try{
    const [orders,checkouts,refunds,events,counts,audit]=await Promise.all([
      env.GUARDIAN_DB.prepare(`SELECT id,tier,price_usd,edition_key,issuance_serial,payment_status,issuance_status,refund_status,support_status,created_at,paid_at,issued_at,refunded_at FROM guardian_orders ORDER BY created_at DESC LIMIT ?`).bind(n).all(),
      env.GUARDIAN_DB.prepare(`SELECT checkout_id,guardian_id,provider,amount_usd,currency,status,provider_session_id,failure_code,created_at,updated_at,expires_at,cancelled_at,completed_at FROM guardian_checkout_sessions ORDER BY created_at DESC LIMIT ?`).bind(n).all(),
      env.GUARDIAN_DB.prepare(`SELECT refund_job_id,guardian_id,provider,payment_reference,amount_usd,currency,reason,status,provider_refund_id,last_error,created_at,updated_at,completed_at FROM guardian_refund_jobs ORDER BY created_at DESC LIMIT ?`).bind(n).all(),
      env.GUARDIAN_DB.prepare(`SELECT event_id,provider,event_type,guardian_id,payment_reference,amount_usd,currency,status,received_at,processed_at,error_code FROM guardian_payment_events ORDER BY received_at DESC LIMIT ?`).bind(n).all(),
      env.GUARDIAN_DB.prepare(`SELECT (SELECT COUNT(*) FROM guardian_orders WHERE payment_status='pending') AS pending_orders,(SELECT COUNT(*) FROM guardian_orders WHERE support_status='review') AS support_review,(SELECT COUNT(*) FROM guardian_refund_jobs WHERE status IN ('pending','failed')) AS refund_attention,(SELECT COUNT(*) FROM guardian_checkout_sessions WHERE status IN ('creating','ready')) AS open_checkouts`).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS total_events,SUM(CASE WHEN status='processed' THEN 1 ELSE 0 END) AS processed,SUM(CASE WHEN status='rejected' THEN 1 ELSE 0 END) AS rejected,SUM(CASE WHEN error_code='amount_mismatch' THEN 1 ELSE 0 END) AS amount_mismatch,SUM(CASE WHEN error_code='currency_mismatch' THEN 1 ELSE 0 END) AS currency_mismatch,SUM(CASE WHEN error_code='payment_reference_conflict' THEN 1 ELSE 0 END) AS reference_conflict,SUM(CASE WHEN event_type='payment.refunded' AND status='processed' THEN 1 ELSE 0 END) AS refunded,SUM(CASE WHEN event_type='payment.refund_failed' THEN 1 ELSE 0 END) AS refund_failed,SUM(CASE WHEN error_code='edition_sold_out_after_payment' THEN 1 ELSE 0 END) AS sold_out_after_payment FROM guardian_payment_events`).first()
    ]);
    return json({ok:true,generatedAt:new Date().toISOString(),counts:counts||{},paymentAudit:audit||{},orders:orders?.results||[],checkouts:checkouts?.results||[],refunds:refunds?.results||[],paymentEvents:events?.results||[]});
  }catch{return json({ok:false,error:'storage_read_failed'},500)}
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405,{Allow:'GET'})}
