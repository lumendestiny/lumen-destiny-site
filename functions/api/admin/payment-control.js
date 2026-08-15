const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const auth=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
const clean=(value,max=1000)=>String(value??'').trim().slice(0,max);
const bool=value=>String(value||'').toLowerCase()==='true';
const makeId=()=>`PCA-${Date.now()}-${crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase()}`;

async function state(env){
  return await env.GUARDIAN_DB.prepare(`SELECT control_key,state,note,changed_at FROM guardian_payment_control WHERE control_key='checkout' LIMIT 1`).first();
}

function openPrerequisites(env){
  const checks={
    paymentsBackendEnabled:env?.LUMEN_PAYMENTS_ENABLED==='true',
    pgApproved:bool(env?.LUMEN_PG_APPROVED),
    pgKycComplete:bool(env?.LUMEN_PG_KYC_COMPLETE),
    pgSandboxVerified:bool(env?.LUMEN_PG_SANDBOX_VERIFIED),
    pgProductionReady:bool(env?.LUMEN_PG_PRODUCTION_READY),
    privacyPolicyFinalized:bool(env?.LUMEN_PRIVACY_POLICY_FINALIZED),
    dataRetentionVerified:bool(env?.LUMEN_DATA_RETENTION_VERIFIED),
    deleteRequestFlowVerified:bool(env?.LUMEN_DELETE_REQUEST_FLOW_VERIFIED),
    sensitiveLoggingVerified:bool(env?.LUMEN_SENSITIVE_LOGGING_VERIFIED),
    publicCheckoutArmed:bool(env?.LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED),
    paymentTestModeOff:env?.LUMEN_PAYMENT_TEST_MODE!=='true',
    emergencyHoldOff:env?.LUMEN_PAYMENT_EMERGENCY_HOLD!=='true'
  };
  return {ready:Object.values(checks).every(Boolean),checks,blockers:Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name)};
}

export async function onRequestGet({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  try{
    const [control,audit]=await Promise.all([
      state(env),
      env.GUARDIAN_DB.prepare(`SELECT audit_id,previous_state,new_state,note,changed_at FROM guardian_payment_control_audit WHERE control_key='checkout' ORDER BY changed_at DESC LIMIT 20`).all()
    ]);
    return json({
      ok:true,
      control:control||{control_key:'checkout',state:'hold',note:'Missing control row is treated as fail-closed HOLD',changed_at:null},
      openPrerequisites:openPrerequisites(env),
      audit:audit?.results||[]
    });
  }catch{return json({ok:false,error:'storage_read_failed'},500)}
}

export async function onRequestPost({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  let body;try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const target=clean(body?.state,20).toLowerCase(),note=clean(body?.note,1200),confirmation=clean(body?.confirmation,80);
  if(!['open','hold'].includes(target))return json({ok:false,error:'invalid_state'},400);
  if(note.length<10)return json({ok:false,error:'operation_note_required'},400);
  const required=target==='open'?'RESUME GUARDIAN PAYMENTS':'HOLD GUARDIAN PAYMENTS';
  if(confirmation!==required)return json({ok:false,error:'confirmation_mismatch',requiredConfirmation:required},409);
  try{
    const current=await state(env)||{state:'hold'};
    if(current.state===target)return json({ok:true,unchanged:true,state:target});
    if(target==='open'){
      const prerequisites=openPrerequisites(env);
      if(!prerequisites.ready)return json({ok:false,error:'payment_release_prerequisites_incomplete',blockers:prerequisites.blockers},409);
      const critical=await env.GUARDIAN_DB.prepare(`SELECT incident_id FROM guardian_payment_incidents WHERE status!='resolved' AND severity='critical' LIMIT 1`).first();
      if(critical)return json({ok:false,error:'critical_incident_unresolved',incidentId:critical.incident_id},409);
    }
    const now=new Date().toISOString(),auditId=makeId();
    await env.GUARDIAN_DB.batch([
      env.GUARDIAN_DB.prepare(`INSERT INTO guardian_payment_control(control_key,state,note,changed_at) VALUES('checkout',?,?,?) ON CONFLICT(control_key) DO UPDATE SET state=excluded.state,note=excluded.note,changed_at=excluded.changed_at`).bind(target,note,now),
      env.GUARDIAN_DB.prepare(`INSERT INTO guardian_payment_control_audit(audit_id,control_key,previous_state,new_state,note,changed_at) VALUES(?,'checkout',?,?,?,?)`).bind(auditId,current.state,target,note,now)
    ]);
    return json({ok:true,state:target,auditId,changedAt:now});
  }catch{return json({ok:false,error:'storage_write_failed'},500)}
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
