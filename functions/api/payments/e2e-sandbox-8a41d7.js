const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const POLICY_VERSION='guardian-refund-2026-08-12-v1';
const authorized=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
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
async function holdDiagnostics(env){
  let control=null,criticalIncident=null,controlError=null,incidentError=null;
  try{control=await env.GUARDIAN_DB.prepare(`SELECT control_key,state,note,changed_at FROM guardian_payment_control WHERE control_key='checkout' LIMIT 1`).first()}catch(e){controlError=String(e?.message||e||'control_query_failed').slice(0,180)}
  try{criticalIncident=await env.GUARDIAN_DB.prepare(`SELECT incident_id,guardian_id,provider,incident_type,status,severity,summary,updated_at FROM guardian_payment_incidents WHERE status!='resolved' AND severity='critical' ORDER BY updated_at DESC LIMIT 1`).first()}catch(e){incidentError=String(e?.message||e||'incident_query_failed').slice(0,180)}
  return{manualEmergencyHold:env?.LUMEN_PAYMENT_EMERGENCY_HOLD==='true',control,criticalIncident,controlError,incidentError};
}
export async function onRequestPost({request,env}){
  if(!authorized(request,env))return json({ok:false,error:'not_found'},404);
  if(env?.LUMEN_PAYMENT_TEST_MODE!=='true'||env?.LUMEN_PAYMENTS_ENABLED!=='true')return json({ok:false,error:'test_mode_not_ready'},503);
  if(!env?.GUARDIAN_DB||!env?.LUMEN_PAYMENT_WEBHOOK_SECRET||!env?.LUMEN_PAYMENT_ADAPTER_SECRET)return json({ok:false,error:'test_dependencies_missing'},503);
  const origin=new URL(request.url).origin,editionKey=`e2e-pay-${crypto.randomUUID().replace(/-/g,'').slice(0,12).toLowerCase()}`;
  let id='';
  try{
    const orderRes=await fetch(`${origin}/api/guardian/orders`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tier:'basic',name:'E2E PAYMENT TEST',wishType:'custom',editionKey})});
    const orderData=await orderRes.json();
    if(!orderRes.ok||!orderData?.order?.id)throw new Error(`order:${orderRes.status}:${orderData?.error||'unknown'}`);
    id=orderData.order.id;

    const checkoutRes=await fetch(`${origin}/api/payments/checkout`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({guardianId:id,lang:'ko',policyAccepted:true,policyVersion:POLICY_VERSION})});
    const checkoutData=await checkoutRes.json();
    if(!checkoutRes.ok||!checkoutData?.checkoutUrl){const diagnostics=await holdDiagnostics(env);await cleanup(env,id,editionKey);return json({ok:false,stage:'checkout',checkoutStatus:checkoutRes.status,checkoutError:checkoutData?.error||'unknown',checkoutReason:checkoutData?.reason||null,diagnostics},409)}

    const completeRes=await fetch(`${origin}/api/payments/test-complete`,{method:'POST',headers:{'content-type':'application/json','x-lumen-internal-secret':env.LUMEN_INTERNAL_SECRET},body:JSON.stringify({guardianId:id,mode:'success',checkoutId:checkoutData.checkoutId})});
    const completeData=await completeRes.json();
    if(!completeRes.ok)throw new Error(`complete:${completeRes.status}:${completeData?.error||completeData?.webhook?.error||'unknown'}`);

    const verifyRes=await fetch(`${origin}/api/guardian/verify?id=${encodeURIComponent(id)}`);
    const verifyData=await verifyRes.json();
    const passed=verifyRes.ok&&verifyData?.status==='verified'&&verifyData?.guardian?.paymentStatus==='paid'&&verifyData?.guardian?.issuanceStatus==='issued'&&Number(verifyData?.guardian?.serial)>=1;
    await cleanup(env,id,editionKey);
    let remaining=null;try{const r=await env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS n FROM guardian_orders WHERE id=?`).bind(id).first();remaining=Number(r?.n||0)}catch{}
    return json({ok:passed,orderCreate:true,checkout:true,checkoutProvider:checkoutData.provider||null,testPayment:true,webhook:completeData?.webhook||null,verifyStatus:verifyData?.status||null,paymentStatus:verifyData?.guardian?.paymentStatus||null,issuanceStatus:verifyData?.guardian?.issuanceStatus||null,serial:verifyData?.guardian?.serial||null,cleanupRemaining:remaining});
  }catch(error){
    if(id)await cleanup(env,id,editionKey);
    return json({ok:false,error:String(error?.message||error||'e2e_failed').slice(0,300)},500);
  }
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
