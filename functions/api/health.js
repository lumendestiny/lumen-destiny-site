export async function onRequestGet({env}){
  const bool=v=>String(v||'').toLowerCase()==='true';
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

  const guardianEnabled=bool(env?.LUMEN_GUARDIAN_ENABLED);
  const paymentsBackendEnabled=bool(env?.LUMEN_PAYMENTS_ENABLED);
  const paymentPublicCheckoutEnabled=bool(env?.LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED);
  const paymentTestMode=bool(env?.LUMEN_PAYMENT_TEST_MODE);
  const pgApproved=bool(env?.LUMEN_PG_APPROVED);
  const pgKycComplete=bool(env?.LUMEN_PG_KYC_COMPLETE);
  const pgSandboxVerified=bool(env?.LUMEN_PG_SANDBOX_VERIFIED);
  const pgProductionReady=bool(env?.LUMEN_PG_PRODUCTION_READY);
  const pgEvidenceReady=pgApproved&&pgKycComplete&&pgSandboxVerified&&pgProductionReady;
  const publicPaymentsEnabled=paymentsBackendEnabled&&paymentPublicCheckoutEnabled&&!paymentTestMode&&pgEvidenceReady;
  const aiBackendEnabled=bool(env?.LUMEN_AI_ENABLED);
  const publicConsultEnabled=bool(env?.LUMEN_PUBLIC_CONSULT_ENABLED);
  const aiProviderReady=!!env?.OPENAI_API_KEY;
  const paymentProvider=!!env?.LUMEN_PAYMENT_PROVIDER;
  const paymentAdapterUrl=!!env?.LUMEN_PAYMENT_ADAPTER_URL;
  const paymentAdapterSecret=!!env?.LUMEN_PAYMENT_ADAPTER_SECRET;
  const refundAdapterUrl=!!env?.LUMEN_PAYMENT_REFUND_ADAPTER_URL;
  const internalSecret=!!env?.LUMEN_INTERNAL_SECRET;
  const webhookSecret=!!env?.LUMEN_PAYMENT_WEBHOOK_SECRET;
  const authProviderReady=!!env?.SUPABASE_URL&&!!(env?.SUPABASE_PUBLISHABLE_KEY||env?.SUPABASE_ANON_KEY);
  const authRequired=bool(env?.LUMEN_AUTH_REQUIRED);

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
    authentication:authProviderReady,
    loginGate:authProviderReady&&authRequired,
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
    pgApproved,
    pgKycComplete,
    pgSandboxVerified,
    pgProductionReady,
    pgEvidenceReady,
    paymentProvider,
    paymentAdapterUrl,
    paymentAdapterSecret,
    refundAdapterUrl,
    internalSecret,
    webhookSecret,
    authProviderReady,
    authRequired,
    paymentTestMode
  };
  return Response.json({
    ok:true,
    service:'lumen-destiny-api',
    version:'2026-08-16.1',
    scope:'v1-saju-fortune-compatibility-guardian-auth',
    features,
    configured,
    diagnostics:{guardianDbError},
    ready:Object.values(features).some(Boolean)
  },{status:200,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
