const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const auth=(request,env)=>!!env?.LUMEN_PAYMENT_ADAPTER_SECRET&&(request.headers.get('x-lumen-adapter-secret')||'')===env.LUMEN_PAYMENT_ADAPTER_SECRET;
const clean=(v,n=200)=>String(v??'').trim().slice(0,n);

export async function onRequestPost({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(env?.LUMEN_PAYMONGO_ADAPTER_ENABLED!=='true')return json({ok:false,error:'paymongo_adapter_disabled'},503);
  if(env?.LUMEN_PG_APPROVED!=='true'||env?.LUMEN_PG_KYC_COMPLETE!=='true')return json({ok:false,error:'pg_not_approved_or_kyc_incomplete'},409);

  let body;
  try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}

  const guardianId=clean(body?.guardianId,48);
  const currency=clean(body?.currency||'USD',8).toUpperCase();
  const amountMinor=Number(body?.amountMinor);
  const returnUrl=clean(body?.returnUrl,500);
  const cancelUrl=clean(body?.cancelUrl,500);

  if(!guardianId||!Number.isInteger(amountMinor)||amountMinor<=0)return json({ok:false,error:'invalid_checkout_request'},400);
  if(!/^https:\/\//i.test(returnUrl)||!/^https:\/\//i.test(cancelUrl))return json({ok:false,error:'https_return_urls_required'},400);
  if(!env?.PAYMONGO_SECRET_KEY)return json({ok:false,error:'paymongo_secret_not_configured'},503);

  return json({
    ok:false,
    error:'paymongo_provider_mapping_not_finalized',
    provider:'paymongo',
    guardianId,
    amountMinor,
    currency,
    note:'Do not enable until written business approval, KYC approval, current PayMongo API mapping, webhook verification and sandbox tests are complete.'
  },501);
}

export async function onRequest(){
  return json({ok:false,error:'method_not_allowed'},405);
}
