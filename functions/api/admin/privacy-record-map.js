const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const auth=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
const validGuardianId=id=>/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(id);
const validPaymentReference=value=>/^[A-Za-z0-9._:/-]{3,160}$/.test(value);
const truthy=v=>Number(v||0)>0;
const count=v=>Number(v||0);

async function resolveGuardianId(db,url){
  const id=(url.searchParams.get('id')||'').trim().toUpperCase();
  const paymentReference=(url.searchParams.get('paymentReference')||'').trim();
  if(id){
    if(!validGuardianId(id))return {error:'invalid_id'};
    return {id,lookupType:'guardian_id'};
  }
  if(paymentReference){
    if(!validPaymentReference(paymentReference))return {error:'invalid_payment_reference'};
    const row=await db.prepare(`SELECT id FROM guardian_orders WHERE payment_reference=? LIMIT 1`).bind(paymentReference).first();
    if(!row?.id)return {error:'not_found'};
    return {id:String(row.id).toUpperCase(),lookupType:'payment_reference'};
  }
  return {error:'missing_lookup'};
}

export async function onRequestGet({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const url=new URL(request.url);
  try{
    const resolved=await resolveGuardianId(env.GUARDIAN_DB,url);
    if(resolved.error){
      const status=resolved.error==='not_found'?404:400;
      return json({ok:false,error:resolved.error},status);
    }
    const id=resolved.id;
    const [order,stories,checkouts,paymentEvents,refunds,physical,slot]=await Promise.all([
      env.GUARDIAN_DB.prepare(`SELECT id,created_at,paid_at,issued_at,refunded_at,payment_status,issuance_status,refund_status,support_status,fulfillment_status,policy_version,policy_lang,
        CASE WHEN length(trim(coalesce(display_name,'')))>0 THEN 1 ELSE 0 END AS has_display_name,
        CASE WHEN length(trim(coalesce(giver_name,'')))>0 THEN 1 ELSE 0 END AS has_giver_name,
        CASE WHEN length(trim(coalesce(recipient_name,'')))>0 THEN 1 ELSE 0 END AS has_recipient_name,
        CASE WHEN length(trim(coalesce(gift_message,'')))>0 THEN 1 ELSE 0 END AS has_gift_message,
        CASE WHEN length(trim(coalesce(target_date,'')))>0 THEN 1 ELSE 0 END AS has_target_date,
        CASE WHEN length(trim(coalesce(payment_reference,'')))>0 THEN 1 ELSE 0 END AS has_payment_reference,
        CASE WHEN length(trim(coalesce(verification_token,'')))>0 THEN 1 ELSE 0 END AS has_verification_token
        FROM guardian_orders WHERE id=? LIMIT 1`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count,
        SUM(CASE WHEN length(trim(coalesce(story_text,'')))>0 THEN 1 ELSE 0 END) AS story_text_rows,
        SUM(CASE WHEN length(trim(coalesce(display_name,'')))>0 THEN 1 ELSE 0 END) AS display_name_rows,
        SUM(CASE WHEN length(trim(coalesce(shipping_name,'')))>0 THEN 1 ELSE 0 END) AS shipping_name_rows,
        SUM(CASE WHEN length(trim(coalesce(shipping_phone,'')))>0 THEN 1 ELSE 0 END) AS shipping_phone_rows,
        SUM(CASE WHEN length(trim(coalesce(shipping_postal_code,'')))>0 THEN 1 ELSE 0 END) AS shipping_postal_rows,
        SUM(CASE WHEN length(trim(coalesce(shipping_address1,'')))>0 OR length(trim(coalesce(shipping_address2,'')))>0 THEN 1 ELSE 0 END) AS shipping_address_rows,
        MIN(created_at) AS first_created_at,MAX(created_at) AS last_created_at
        FROM guardian_stories WHERE guardian_id=?`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count,MIN(created_at) AS first_created_at,MAX(created_at) AS last_created_at FROM guardian_checkout_sessions WHERE guardian_id=?`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count,MIN(received_at) AS first_received_at,MAX(received_at) AS last_received_at FROM guardian_payment_events WHERE guardian_id=?`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count,MIN(created_at) AS first_created_at,MAX(created_at) AS last_created_at FROM guardian_refund_jobs WHERE guardian_id=?`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count,MIN(selected_at) AS first_selected_at,MAX(updated_at) AS last_updated_at FROM guardian_physical_fulfillment WHERE guardian_id=?`).bind(id).first(),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS row_count FROM guardian_edition_slots WHERE order_id=?`).bind(id).first()
    ]);

    if(!order)return json({ok:false,error:'not_found'},404);

    return json({
      ok:true,
      generatedAt:new Date().toISOString(),
      lookup:{type:resolved.lookupType,guardianId:id},
      mutationAvailable:false,
      instruction:'Read-only privacy inventory. Review retention/legal/provider obligations before any deletion or anonymization.',
      recordMap:{
        guardianOrder:{
          table:'guardian_orders',rows:1,
          lifecycle:{createdAt:order.created_at||null,paidAt:order.paid_at||null,issuedAt:order.issued_at||null,refundedAt:order.refunded_at||null},
          states:{payment:order.payment_status||null,issuance:order.issuance_status||null,refund:order.refund_status||null,support:order.support_status||null,fulfillment:order.fulfillment_status||null},
          policy:{versionPresent:!!order.policy_version,languagePresent:!!order.policy_lang},
          fieldsPresent:{displayName:truthy(order.has_display_name),giverName:truthy(order.has_giver_name),recipientName:truthy(order.has_recipient_name),giftMessage:truthy(order.has_gift_message),targetDate:truthy(order.has_target_date),paymentReference:truthy(order.has_payment_reference),verificationToken:truthy(order.has_verification_token)},
          reviewClass:'transaction_and_personalization',action:'retention_review_required'
        },
        guardianStories:{
          table:'guardian_stories',rows:count(stories?.row_count),
          firstCreatedAt:stories?.first_created_at||null,lastCreatedAt:stories?.last_created_at||null,
          fieldsPresent:{storyText:truthy(stories?.story_text_rows),displayName:truthy(stories?.display_name_rows),shippingName:truthy(stories?.shipping_name_rows),shippingPhone:truthy(stories?.shipping_phone_rows),shippingPostalCode:truthy(stories?.shipping_postal_rows),shippingAddress:truthy(stories?.shipping_address_rows)},
          reviewClass:'user_content_and_optional_shipping',action:'anonymization_scope_review'
        },
        checkoutSessions:{table:'guardian_checkout_sessions',rows:count(checkouts?.row_count),firstCreatedAt:checkouts?.first_created_at||null,lastCreatedAt:checkouts?.last_created_at||null,reviewClass:'payment_operations',action:'provider_retention_review'},
        paymentEvents:{table:'guardian_payment_events',rows:count(paymentEvents?.row_count),firstReceivedAt:paymentEvents?.first_received_at||null,lastReceivedAt:paymentEvents?.last_received_at||null,reviewClass:'payment_audit',action:'accounting_dispute_retention_review'},
        refundJobs:{table:'guardian_refund_jobs',rows:count(refunds?.row_count),firstCreatedAt:refunds?.first_created_at||null,lastCreatedAt:refunds?.last_created_at||null,reviewClass:'refund_operations',action:'provider_retention_review'},
        physicalFulfillment:{table:'guardian_physical_fulfillment',rows:count(physical?.row_count),firstSelectedAt:physical?.first_selected_at||null,lastUpdatedAt:physical?.last_updated_at||null,reviewClass:'fulfillment_operations',action:'shipping_retention_review'},
        editionSlots:{table:'guardian_edition_slots',rows:count(slot?.row_count),reviewClass:'edition_integrity',action:'preserve_or_detach_after_review'}
      },
      redactionCandidates:['guardian_orders.display_name','guardian_orders.giver_name','guardian_orders.recipient_name','guardian_orders.gift_message','guardian_orders.target_date','guardian_stories.story_text','guardian_stories.display_name','guardian_stories.shipping_name','guardian_stories.shipping_phone','guardian_stories.shipping_postal_code','guardian_stories.shipping_address1','guardian_stories.shipping_address2'],
      protectedOperationalClasses:['payment reconciliation','refund/dispute evidence','policy acceptance','limited-edition integrity','provider/accounting records'],
      nextStep:'Use PRIVACY_RELEASE_CHECKLIST.md and V1_DATA_INVENTORY.md. Do not mutate production data until the approved retention/anonymization matrix defines what may be removed.'
    });
  }catch{return json({ok:false,error:'storage_read_failed'},500)}
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
