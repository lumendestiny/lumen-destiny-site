export async function onRequestGet({env}){
  const guardianDb=!!env?.GUARDIAN_DB;
  let guardianDbQuery=false;
  let guardianDbError=null;
  if(guardianDb){
    try{
      const row=await env.GUARDIAN_DB.prepare('SELECT 1 AS ok').first();
      guardianDbQuery=Number(row?.ok)===1;
    }catch(error){
      guardianDbError=String(error?.message||error||'d1_query_failed').slice(0,160);
    }
  }

  const guardianEnabled=env?.LUMEN_GUARDIAN_ENABLED==='true';
  const paymentsBackendEnabled=env?.LUMEN_PAYMENTS_ENABLED==='true';
  const paymentPublicCheckoutEnabled=env?.LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED==='true';
  const paymentTestMode=env?.LUMEN_PAYMENT_TEST_MODE==='true';
  const publicPaymentsEnabled=paymentsBackendEnabled&&paymentPublicCheckoutEnabled&&!paymentTestMode;
  const aiBackendEnabled=env?.LUMEN_AI_ENABLED==='true';
  const publicConsultEnabled=env?.LUMEN_PUBLIC_CONSULT_ENABLED==='true';
  const aiProviderReady=!!env?.OPENAI_API_KEY;
  const paymentProvider=!!env?.LUMEN_PAYMENT_PROVIDER;
  const paymentAdapterUrl=!!env?.LUMEN_PAYMENT_ADAPTER_URL;
  const paymentAdapterSecret=!!env?.LUMEN_PAYMENT_ADAPTER_SECRET;
  const refundAdapterUrl=!!env?.LUMEN_PAYMENT_REFUND_ADAPTER_URL;
  const internalSecret=!!env?.LUMEN_INTERNAL_SECRET;
  const webhookSecret=!!env?.LUMEN_PAYMENT_WEBHOOK_SECRET;

  const checkoutReady=publicPaymentsEnabled&&guardianDbQuery&&paymentProvider&&paymentAdapterUrl&&paymentAdapterSecret;
  const refundReady=publicPaymentsEnabled&&guardianDbQuery&&refundAdapterUrl&&paymentAdapterSecret&&internalSecret;
  const opsReady=guardianDbQuery&&internalSecret;
  const testReady=paymentTestMode&&paymentsBackendEnabled&&guardianEnabled&&guardianDbQuery&&internalSecret&&webhookSecret&&paymentAdapterSecret&&paymentAdapterUrl;
  const features={
    consult:publicConsultEnabled&&aiBackendEnabled&&aiProviderReady,
    guardianOrders:guardianEnabled&&guardianDbQuery,
    guardianVerify:guardianEnabled&&guardianDbQuery,
    guardianFinalize:guardianEnabled&&guardianDbQuery&&internalSecret,
    payments:publicPaymentsEnabled,
    paymentCheckout:checkoutReady,
    paymentWebhook:publicPaymentsEnabled&&guardianDbQuery&&webhookSecret,
    paymentRefunds:refundReady,
    paymentMaintenance:opsReady,
    guardianOperations:opsReady,
    paymentTestMode,
    testE2E:testReady
  };
  const configured={
    aiEnabled:aiBackendEnabled,
    aiProviderReady,
    publicConsultEnabled,
    guardianEnabled,
    guardianDb,
    guardianDbQuery,
    paymentsEnabled:paymentsBackendEnabled,
    paymentPublicCheckoutEnabled,
    paymentProvider,
    paymentAdapterUrl,
    paymentAdapterSecret,
    refundAdapterUrl,
    internalSecret,
    webhookSecret,
    paymentTestMode
  };
  return Response.json({
    ok:true,
    service:'lumen-destiny-api',
    version:'2026-08-15.1',
    scope:'v1-saju-fortune-compatibility-guardian',
    features,
    configured,
    diagnostics:{guardianDbError},
    ready:Object.values(features).some(Boolean)
  },{status:200,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
