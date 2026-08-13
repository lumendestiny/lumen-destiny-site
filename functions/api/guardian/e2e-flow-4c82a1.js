const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function onRequestGet({request,env}){
  if(env?.LUMEN_GUARDIAN_ENABLED!=='true') return json({ok:false,error:'guardian_not_enabled'},503);
  if(!env?.GUARDIAN_DB) return json({ok:false,error:'storage_not_configured'},503);
  const origin=new URL(request.url).origin;
  let orderId=null,editionKey=null;
  try{
    const edition=`e2e-flow-${crypto.randomUUID().replace(/-/g,'').slice(0,8)}`;
    const orderRes=await fetch(`${origin}/api/guardian/orders`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tier:'basic',name:'E2E FLOW TEST',wishType:'e2e',editionKey:edition})});
    const orderBody=await orderRes.json().catch(()=>null);
    orderId=orderBody?.order?.id||null; editionKey=orderBody?.order?.editionKey||edition;
    if(!orderRes.ok||!orderId) return json({ok:false,stage:'order_create',status:orderRes.status,body:orderBody},500);
    const verifyRes=await fetch(`${origin}/api/guardian/verify?id=${encodeURIComponent(orderId)}`,{headers:{'accept':'application/json'}});
    const verifyBody=await verifyRes.json().catch(()=>null);
    const pendingOk=verifyRes.ok&&verifyBody?.ok===true&&verifyBody?.status==='pending'&&verifyBody?.guardian?.id===orderId&&verifyBody?.guardian?.paymentStatus==='pending'&&verifyBody?.guardian?.issuanceStatus==='pending';
    return json({ok:pendingOk,orderCreate:true,verifyPending:pendingOk,order:{id:orderId,tier:orderBody?.order?.tier,priceUsd:orderBody?.order?.priceUsd,editionKey},verify:verifyBody?.status||null,cleanup:'scheduled'});
  }catch(e){return json({ok:false,error:'e2e_flow_failed',message:String(e?.message||e)},500)}
  finally{
    if(orderId){try{await env.GUARDIAN_DB.prepare('DELETE FROM guardian_orders WHERE id=?').bind(orderId).run()}catch{}}
    if(editionKey){try{await env.GUARDIAN_DB.prepare('DELETE FROM guardian_edition_slots WHERE edition_key=? AND order_id IS NULL').bind(editionKey).run()}catch{}}
  }
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
