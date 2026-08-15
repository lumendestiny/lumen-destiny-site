const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const auth=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
const bool=v=>String(v||'').toLowerCase()==='true';

const TABLE_CHECKS={
  guardian_orders:['id','tier','price_usd','display_name','wish_type','payment_status','issuance_status','payment_reference','verification_token','giver_name','recipient_name','gift_message','edition_key','issuance_serial','guardian_element','guardian_design_key','personalization_source','refund_status','support_status','policy_version','policy_accepted_at','policy_lang'],
  guardian_editions:['edition_key','tier','edition_limit','issued_count','created_at'],
  guardian_edition_slots:['edition_key','slot_no','tier','order_id','reserved_at'],
  guardian_checkout_sessions:['checkout_id','guardian_id','provider','amount_usd','currency','status','provider_session_id','checkout_url','created_at','updated_at','expires_at','policy_version','policy_accepted_at'],
  guardian_payment_events:['event_id','provider','event_type','guardian_id','payment_reference','amount_usd','currency','status','received_at','processed_at','error_code'],
  guardian_refund_jobs:['refund_job_id','guardian_id','provider','payment_reference','amount_usd','currency','reason','status','created_at','updated_at'],
  guardian_payment_incidents:['incident_id','guardian_id','provider','event_id','payment_reference','incident_type','status','severity','created_at','updated_at'],
  guardian_payment_control:['control_key','state','note','changed_at'],
  guardian_payment_control_audit:['audit_id','control_key','previous_state','new_state','note','changed_at'],
  guardian_e2e_runs:['run_id','scenario','status','summary','guardian_ids','details_json','created_at'],
  guardian_stories:['id','guardian_id','story_type','story_text','status','shipping_status','physical_card_serial','production_status'],
  guardian_physical_fulfillment:['id','story_id','guardian_id','status','selected_at','updated_at']
};

const REQUIRED_INDEXES=[
  'idx_guardian_orders_created_at',
  'idx_guardian_orders_provider_reference',
  'idx_guardian_edition_slots_order_id',
  'idx_guardian_checkout_guardian',
  'idx_guardian_payment_events_provider_reference',
  'uq_guardian_payment_success_provider_reference',
  'idx_guardian_refund_jobs_status',
  'idx_guardian_payment_incidents_status',
  'idx_guardian_payment_control_audit_changed'
];

async function checkTable(db,table,columns){
  const safeTable=/^[A-Za-z0-9_]+$/.test(table);
  if(!safeTable)return{table,ok:false,error:'invalid_table_definition'};
  const safeColumns=columns.every(c=>/^[A-Za-z0-9_]+$/.test(c));
  if(!safeColumns)return{table,ok:false,error:'invalid_column_definition'};
  try{
    await db.prepare(`SELECT ${columns.join(',')} FROM ${table} LIMIT 0`).all();
    return{table,ok:true,columnCount:columns.length};
  }catch{return{table,ok:false,columnCount:columns.length,error:'table_or_required_column_missing'}}
}

async function checkIndexes(db){
  try{
    const placeholders=REQUIRED_INDEXES.map(()=>'?').join(',');
    const result=await db.prepare(`SELECT name FROM sqlite_schema WHERE type='index' AND name IN (${placeholders})`).bind(...REQUIRED_INDEXES).all();
    const present=new Set((result?.results||[]).map(r=>String(r.name)));
    return REQUIRED_INDEXES.map(name=>({name,ok:present.has(name)}));
  }catch{return REQUIRED_INDEXES.map(name=>({name,ok:false,error:'index_catalog_unavailable'}))}
}

function externalEvidenceReady(env){return bool(env?.LUMEN_PG_APPROVED)&&bool(env?.LUMEN_PG_KYC_COMPLETE)&&bool(env?.LUMEN_PG_SANDBOX_VERIFIED)&&bool(env?.LUMEN_PG_PRODUCTION_READY)}
function privacyEvidenceReady(env){return bool(env?.LUMEN_PRIVACY_POLICY_FINALIZED)&&bool(env?.LUMEN_DATA_RETENTION_VERIFIED)&&bool(env?.LUMEN_DELETE_REQUEST_FLOW_VERIFIED)&&bool(env?.LUMEN_SENSITIVE_LOGGING_VERIFIED)}

export async function onRequestGet({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  try{
    const tableResults=await Promise.all(Object.entries(TABLE_CHECKS).map(([table,columns])=>checkTable(env.GUARDIAN_DB,table,columns)));
    const indexResults=await checkIndexes(env.GUARDIAN_DB);
    let control=null;
    try{control=await env.GUARDIAN_DB.prepare(`SELECT state,changed_at FROM guardian_payment_control WHERE control_key='checkout' LIMIT 1`).first()}catch{}

    const pgReady=externalEvidenceReady(env);
    const privacyReady=privacyEvidenceReady(env);
    const publicArm=bool(env?.LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED);
    const testMode=bool(env?.LUMEN_PAYMENT_TEST_MODE);
    const releaseEvidenceReady=pgReady&&privacyReady&&!testMode;
    const currentControlState=control?.state||null;
    const validControlState=currentControlState==='hold'||currentControlState==='open';
    // Before complete external/privacy evidence and deliberate public-arm state, the DB must remain HOLD.
    const controlSafe=releaseEvidenceReady&&publicArm?validControlState:currentControlState==='hold';
    const tablesReady=tableResults.every(x=>x.ok);
    const indexesReady=indexResults.every(x=>x.ok);
    const ready=tablesReady&&indexesReady&&controlSafe;

    return json({
      ok:true,
      generatedAt:new Date().toISOString(),
      readOnly:true,
      customerRowsReturned:false,
      summary:{ready,label:ready?'D1 PREFLIGHT READY':'D1 PREFLIGHT HOLD',tablesReady,indexesReady,controlSafe},
      releaseContext:{pgEvidenceReady:pgReady,privacyEvidenceReady:privacyReady,paymentPublicCheckoutEnabled:publicArm,paymentTestMode:testMode,releaseEvidenceReady},
      paymentControl:{present:!!control,state:currentControlState,changedAt:control?.changed_at||null,expected:releaseEvidenceReady&&publicArm?'hold-or-explicit-open-final-step':'hold',safe:controlSafe},
      tables:tableResults,
      indexes:indexResults,
      blockers:[
        ...tableResults.filter(x=>!x.ok).map(x=>`schema:${x.table}`),
        ...indexResults.filter(x=>!x.ok).map(x=>`index:${x.name}`),
        ...(controlSafe?[]:[`payment_control:${currentControlState||'missing'}_expected_hold`])
      ],
      note:'Read-only Production D1 schema/control evidence. This endpoint does not return customer rows or approve backup/restore, privacy retention, PG/KYC, or physical-device gates.'
    });
  }catch{return json({ok:false,error:'d1_preflight_failed'},500)}
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
