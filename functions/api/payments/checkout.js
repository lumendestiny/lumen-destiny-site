const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
const clean=(v,max)=>String(v??'').trim().slice(0,max);
const validId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const makeCheckoutId=()=>`GC-${Date.now()}-${crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase()}`;
function safeHttpsUrl(value){try{const u=new URL(String(value||''));return u.protocol==='https:'?u:null}catch{return null}}
async function expireOld(env,guardianId,now){try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='expired',failure_code=COALESCE(failure_code,'checkout_expired'),updated_at=? WHERE guardian_id=? AND status IN ('creating','ready') AND expires_at IS NOT NULL AND expires_at<?`).bind(now,guardianId,now).run()}catch{}}
export async function onRequestPost({request,env}){
  if(env?.LUMEN_PAYMENTS_ENABLED!=='true')return json({ok:false,error:'payments_not_enabled'},503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const provider=clean(env?.LUMEN_PAYMENT_PROVIDER||'',40).toLowerCase(),adapterUrl=safeHttpsUrl(env?.LUMEN_PAYMENT_ADAPTER_URL);
  if(!provider||!adapterUrl||!env?.LUMEN_PAYMENT_ADAPTER_SECRET)return json({ok:false,error:'payment_provider_not_configured'},503);
  const ct=request.headers.get('content-type')||'';if(!ct.toLowerCase().includes('application/json'))return json({ok:false,error:'content_type_required'},415);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const id=clean(body?.guardianId,40).toUpperCase(),lang=clean(body?.lang||'ko',8);
  if(!validId(id))return json({ok:false,error:'invalid_guardian_id'},400);
  let order;try{order=await env.GUARDIAN_DB.prepare(`SELECT id,tier,price_usd,display_name,payment_status,issuance_status,refund_status FROM guardian_orders WHERE id=? LIMIT 1`).bind(id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  if(!order)return json({ok:false,error:'not_found'},404);
  if(order.payment_status==='paid'||order.payment_status==='refunded'||order.issuance_status==='issued'||order.refund_status==='pending'||order.refund_status==='processing')return json({ok:false,error:'order_not_payable',verifyUrl:`/guardian-verify.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`},409);
  const now=new Date().toISOString();await expireOld(env,id,now);
  let open;try{open=await env.GUARDIAN_DB.prepare(`SELECT checkout_id,checkout_url,expires_at FROM guardian_checkout_sessions WHERE guardian_id=? AND status='ready' AND (expires_at IS NULL OR expires_at>?) ORDER BY created_at DESC LIMIT 1`).bind(id,now).first()}catch{}
  if(open?.checkout_url)return json({ok:true,reused:true,checkoutId:open.checkout_id,guardianId:id,amount:Number(order.price_usd),currency:'USD',provider,checkoutUrl:open.checkout_url,expiresAt:open.expires_at||null,returnUrl:`${new URL(request.url).origin}/guardian-payment-result.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`});
  const origin=new URL(request.url).origin,checkoutId=makeCheckoutId(),createdAt=now,expiresAt=new Date(Date.now()+30*60*1000).toISOString(),returnUrl=`${origin}/guardian-payment-result.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
  try{await env.GUARDIAN_DB.prepare(`INSERT INTO guardian_checkout_sessions (checkout_id,guardian_id,provider,amount_usd,currency,status,created_at,updated_at,expires_at) VALUES (?,?,?,?,?,'creating',?,?,?)`).bind(checkoutId,id,provider,Number(order.price_usd),'USD',createdAt,createdAt,expiresAt).run()}catch{return json({ok:false,error:'checkout_storage_failed'},500)}
  let res,data={};try{res=await fetch(adapterUrl.toString(),{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${env.LUMEN_PAYMENT_ADAPTER_SECRET}`},body:JSON.stringify({checkoutId,guardianId:id,amount:Number(order.price_usd),currency:'USD',description:`Lumen Guardian ${order.tier}`,customerLabel:clean(order.display_name,40),returnUrl,cancelUrl:returnUrl,metadata:{guardianId:id,tier:order.tier,checkoutId}})});try{data=await res.json()}catch{}}catch{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='adapter_error',failure_code='adapter_unreachable',updated_at=? WHERE checkout_id=?`).bind(new Date().toISOString(),checkoutId).run().catch(()=>{});return json({ok:false,error:'payment_adapter_unreachable'},502)}
  const checkoutUrl=safeHttpsUrl(data?.checkoutUrl),providerSessionId=clean(data?.providerSessionId||data?.sessionId,160);
  if(!res.ok||!checkoutUrl){await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='adapter_rejected',failure_code='adapter_rejected',updated_at=? WHERE checkout_id=?`).bind(new Date().toISOString(),checkoutId).run().catch(()=>{});return json({ok:false,error:'payment_adapter_error'},502)}
  const updatedAt=new Date().toISOString();try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='ready',provider_session_id=?,checkout_url=?,updated_at=? WHERE checkout_id=?`).bind(providerSessionId||null,checkoutUrl.toString(),updatedAt,checkoutId).run()}catch{return json({ok:false,error:'checkout_storage_failed'},500)}
  return json({ok:true,checkoutId,guardianId:id,amount:Number(order.price_usd),currency:'USD',provider,checkoutUrl:checkoutUrl.toString(),expiresAt,returnUrl});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405,{Allow:'POST'})}
