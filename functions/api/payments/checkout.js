const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
const clean=(v,max)=>String(v??'').trim().slice(0,max);
const validId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const makeCheckoutId=()=>`GC-${Date.now()}-${crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase()}`;
const POLICY_VERSION='guardian-refund-2026-08-12-v1';
const LANGS=new Set(['ko','en','ja','tl','vi','zh']);
const normalizeLang=v=>{const raw=String(v||'').trim().toLowerCase();if(raw==='zh-hans'||raw==='zh-cn'||raw.startsWith('zh-'))return'zh';return LANGS.has(raw)?raw:'ko'};
function safeHttpsUrl(value){try{const u=new URL(String(value||''));return u.protocol==='https:'?u:null}catch{return null}}
async function expireOld(env,guardianId,now){try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='expired',failure_code=COALESCE(failure_code,'checkout_expired'),updated_at=? WHERE guardian_id=? AND status IN ('creating','ready') AND expires_at IS NOT NULL AND expires_at<?`).bind(now,guardianId,now).run()}catch{}}
async function paymentEmergencyState(env){if(env?.LUMEN_PAYMENT_EMERGENCY_HOLD==='true')return{hold:true,reason:'manual_emergency_hold'};try{const control=await env.GUARDIAN_DB.prepare(`SELECT state,note,changed_at FROM guardian_payment_control WHERE control_key='checkout' LIMIT 1`).first();if(control?.state==='hold')return{hold:true,reason:'operator_payment_hold',control};const row=await env.GUARDIAN_DB.prepare(`SELECT incident_id,guardian_id,provider,incident_type,status,severity,summary,updated_at FROM guardian_payment_incidents WHERE status!='resolved' AND severity='critical' ORDER BY updated_at DESC LIMIT 1`).first();if(row)return{hold:true,reason:'critical_payment_incident',incident:row};return{hold:false}}catch{return{hold:true,reason:'incident_state_unavailable'}}}
export async function onRequestPost({request,env}){
  if(env?.LUMEN_PAYMENTS_ENABLED!=='true')return json({ok:false,error:'payments_not_enabled'},503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const emergency=await paymentEmergencyState(env);
  if(emergency.hold)return json({ok:false,error:'payments_temporarily_on_hold',reason:emergency.reason,incidentId:emergency.incident?.incident_id||null,support:'/support.html'},503,{'Retry-After':'300'});
  const provider=clean(env?.LUMEN_PAYMENT_PROVIDER||'',40).toLowerCase(),adapterUrl=safeHttpsUrl(env?.LUMEN_PAYMENT_ADAPTER_URL);
  const requestHost=new URL(request.url).hostname.toLowerCase();
  const productionHost=requestHost==='lumendestiny.com'||requestHost==='www.lumendestiny.com';
  if(productionHost&&provider==='lumen-test')return json({ok:false,error:'test_payment_provider_blocked_in_production'},503);
  if(!provider||!adapterUrl||!env?.LUMEN_PAYMENT_ADAPTER_SECRET)return json({ok:false,error:'payment_provider_not_configured'},503);
  const ct=request.headers.get('content-type')||'';if(!ct.toLowerCase().includes('application/json'))return json({ok:false,error:'content_type_required'},415);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const id=clean(body?.guardianId,40).toUpperCase(),lang=normalizeLang(body?.lang),policyAccepted=body?.policyAccepted===true,policyVersion=clean(body?.policyVersion||POLICY_VERSION,80);
  if(!validId(id))return json({ok:false,error:'invalid_guardian_id'},400);
  if(!policyAccepted||policyVersion!==POLICY_VERSION)return json({ok:false,error:'policy_acceptance_required',policyVersion:POLICY_VERSION},409);
  let order;try{order=await env.GUARDIAN_DB.prepare(`SELECT id,tier,price_usd,display_name,payment_status,issuance_status,refund_status FROM guardian_orders WHERE id=? LIMIT 1`).bind(id).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  if(!order)return json({ok:false,error:'not_found'},404);
  if(order.payment_status==='paid'||order.payment_status==='refunded'||order.issuance_status==='issued'||order.refund_status==='pending'||order.refund_status==='processing')return json({ok:false,error:'order_not_payable',verifyUrl:`/guardian-verify/?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`},409);
  const priceUsd=Number(order.price_usd),amountMinor=Math.round(priceUsd*100);
  if(!Number.isFinite(priceUsd)||priceUsd<=0||!Number.isInteger(amountMinor)||amountMinor<=0)return json({ok:false,error:'invalid_server_price'},500);
  const now=new Date().toISOString();
  try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_orders SET policy_version=?,policy_accepted_at=?,policy_lang=? WHERE id=?`).bind(POLICY_VERSION,now,lang,id).run()}catch{return json({ok:false,error:'policy_storage_failed'},500)}
  await expireOld(env,id,now);
  let open;try{open=await env.GUARDIAN_DB.prepare(`SELECT checkout_id,checkout_url,expires_at FROM guardian_checkout_sessions WHERE guardian_id=? AND status='ready' AND (expires_at IS NULL OR expires_at>?) ORDER BY created_at DESC LIMIT 1`).bind(id,now).first()}catch{}
  const origin=new URL(request.url).origin,returnUrl=`${origin}/guardian-payment-result.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
  if(open?.checkout_url)return json({ok:true,reused:true,checkoutId:open.checkout_id,guardianId:id,amount:priceUsd,amountMinor,currency:'USD',provider,checkoutUrl:open.checkout_url,expiresAt:open.expires_at||null,returnUrl,policyVersion:POLICY_VERSION,policyAcceptedAt:now});
  const checkoutId=makeCheckoutId(),createdAt=now,expiresAt=new Date(Date.now()+30*60*1000).toISOString();
  try{await env.GUARDIAN_DB.prepare(`INSERT INTO guardian_checkout_sessions (checkout_id,guardian_id,provider,amount_usd,currency,status,created_at,updated_at,expires_at,policy_version,policy_accepted_at) VALUES (?,?,?,?,?,'creating',?,?,?,?,?)`).bind(checkoutId,id,provider,priceUsd,'USD',createdAt,createdAt,expiresAt,POLICY_VERSION,now).run()}catch{return json({ok:false,error:'checkout_storage_failed'},500)}
  let res,data={};try{res=await fetch(adapterUrl.toString(),{method:'POST',headers:{'content-type':'application/json','x-lumen-adapter-secret':env.LUMEN_PAYMENT_ADAPTER_SECRET},body:JSON.stringify({checkoutId,guardianId:id,amountMinor,currency:'USD',lang,description:`Lumen Guardian ${order.tier}`,customerLabel:clean(order.display_name,40),returnUrl,cancelUrl:returnUrl,metadata:{guardianId:id,tier:order.tier,checkoutId,policyVersion:POLICY_VERSION}})});try{data=await res.json()}catch{}}catch{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='adapter_error',failure_code='adapter_unreachable',updated_at=? WHERE checkout_id=?`).bind(new Date().toISOString(),checkoutId).run().catch(()=>{});return json({ok:false,error:'payment_adapter_unreachable'},502)}
  const checkoutUrl=safeHttpsUrl(data?.checkoutUrl),providerSessionId=clean(data?.providerSessionId||data?.sessionId,160);
  if(!res.ok||!checkoutUrl){await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='adapter_rejected',failure_code=COALESCE(?, 'adapter_rejected'),updated_at=? WHERE checkout_id=?`).bind(clean(data?.error,80)||'adapter_rejected',new Date().toISOString(),checkoutId).run().catch(()=>{});return json({ok:false,error:'payment_adapter_error',providerError:clean(data?.error,80)||null},502)}
  const updatedAt=new Date().toISOString();try{await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='ready',provider_session_id=?,checkout_url=?,updated_at=? WHERE checkout_id=?`).bind(providerSessionId||null,checkoutUrl.toString(),updatedAt,checkoutId).run()}catch{return json({ok:false,error:'checkout_storage_failed'},500)}
  return json({ok:true,checkoutId,guardianId:id,amount:priceUsd,amountMinor,currency:'USD',provider,checkoutUrl:checkoutUrl.toString(),expiresAt,returnUrl,policyVersion:POLICY_VERSION,policyAcceptedAt:now});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405,{Allow:'POST'})}
