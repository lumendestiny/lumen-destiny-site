const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const TOKEN='c72d10a9e64f58';
const POLICY_VERSION='guardian-refund-2026-08-12-v1';
async function cleanup(env,id,editionKey){
  const attempts=[
    [`UPDATE guardian_edition_slots SET order_id=NULL,reserved_at=NULL WHERE order_id=?`,[id]],
    [`DELETE FROM guardian_payment_events WHERE guardian_id=?`,[id]],
    [`DELETE FROM guardian_refund_jobs WHERE guardian_id=?`,[id]],
    [`DELETE FROM guardian_checkout_sessions WHERE guardian_id=?`,[id]],
    [`DELETE FROM guardian_orders WHERE id=?`,[id]],
    [`DELETE FROM guardian_edition_slots WHERE edition_key=? AND order_id IS NULL`,[editionKey]]
  ];
  for(const [sql,args] of attempts){try{await env.GUARDIAN_DB.prepare(sql).bind(...args).run()}catch{}}
}
export async function onRequestGet({request,env}){
  const u=new URL(request.url);
  if(u.searchParams.get('token')!==TOKEN)return json({ok:false,error:'not_found'},404);
  if(env?.LUMEN_PAYMENT_TEST_MODE!=='true'||env?.LUMEN_PAYMENTS_ENABLED!=='true')return json({ok:false,error:'test_mode_not_ready'},503);
  if(!env?.GUARDIAN_DB||!env?.LUMEN_INTERNAL_SECRET||!env?.LUMEN_PAYMENT_WEBHOOK_SECRET||!env?.LUMEN_PAYMENT_ADAPTER_SECRET)return json({ok:false,error:'test_dependencies_missing'},503);
  const origin=u.origin,editionKey=`e2e-refund-${crypto.randomUUID().replace(/-/g,'').slice(0,12).toLowerCase()}`;
  let id='';
  try{
    const orderRes=await fetch(`${origin}/api/guardian/orders`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tier:'basic',name:'E2E REFUND TEST',wishType:'custom',editionKey})});
    const orderData=await orderRes.json();
    if(!orderRes.ok||!orderData?.order?.id)throw new Error(`order:${orderRes.status}:${orderData?.error||'unknown'}`);
    id=orderData.order.id;
    const checkoutRes=await fetch(`${origin}/api/payments/checkout`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({guardianId:id,lang:'ko',policyAccepted:true,policyVersion:POLICY_VERSION})});
    const checkoutData=await checkoutRes.json();
    if(!checkoutRes.ok||!checkoutData?.checkoutUrl)throw new Error(`checkout:${checkoutRes.status}:${checkoutData?.error||'unknown'}`);
    const paidRes=await fetch(`${origin}/api/payments/test-complete`,{method:'POST',headers:{'content-type':'application/json','x-lumen-internal-secret':env.LUMEN_INTERNAL_SECRET},body:JSON.stringify({guardianId:id,mode:'success',checkoutId:checkoutData.checkoutId})});
    const paidData=await paidRes.json();
    if(!paidRes.ok||paidData?.webhook?.paymentStatus!=='paid')throw new Error(`payment:${paidRes.status}:${paidData?.error||paidData?.webhook?.error||'unknown'}`);
    const paymentReference=paidData.paymentReference;
    const refundRes=await fetch(`${origin}/api/payments/test-complete`,{method:'POST',headers:{'content-type':'application/json','x-lumen-internal-secret':env.LUMEN_INTERNAL_SECRET},body:JSON.stringify({guardianId:id,mode:'refunded',paymentReference,checkoutId:checkoutData.checkoutId,providerRefundId:`TEST-RF-${crypto.randomUUID().replace(/-/g,'').slice(0,12).toUpperCase()}`})});
    const refundData=await refundRes.json();
    if(!refundRes.ok)throw new Error(`refund:${refundRes.status}:${refundData?.error||refundData?.webhook?.error||'unknown'}`);
    const verifyRes=await fetch(`${origin}/api/guardian/verify?id=${encodeURIComponent(id)}`);
    const verifyData=await verifyRes.json();
    const passed=verifyRes.ok&&verifyData?.guardian?.paymentStatus==='refunded'&&verifyData?.guardian?.refundStatus==='refunded';
    await cleanup(env,id,editionKey);
    let remaining=null;try{const r=await env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS n FROM guardian_orders WHERE id=?`).bind(id).first();remaining=Number(r?.n||0)}catch{}
    return json({ok:passed,orderCreate:true,checkout:true,payment:true,refund:true,refundWebhook:refundData?.webhook||null,verifyStatus:verifyData?.status||null,paymentStatus:verifyData?.guardian?.paymentStatus||null,refundStatus:verifyData?.guardian?.refundStatus||null,cleanupRemaining:remaining});
  }catch(error){
    if(id)await cleanup(env,id,editionKey);
    return json({ok:false,error:String(error?.message||error||'refund_e2e_failed').slice(0,300)},500);
  }
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
