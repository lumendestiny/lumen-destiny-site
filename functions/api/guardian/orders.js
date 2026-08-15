const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const TIERS={basic:{price:5,limit:100},custom:{price:10,limit:100},rare:{price:50,limit:5},legendary:{price:100,limit:1}};
const ELEMENT_DESIGNS={목:'element-wood-v1',화:'element-fire-v1',토:'element-earth-v1',금:'element-metal-v1',수:'element-water-v1'};
const ARCHIVE_DESIGNS=new Set(['fortune-cat','koi','sun-bird','new-deer','gold-hamster','moon-rabbit','dolphin','fire-fox','leaf-turtle','star-owl','nine-fox','sea-dragon','unicorn','forest-turtle','wing-owl','sky-dragon','fire-phoenix','moon-tiger','qilin','black-turtle']);
const clean=(v,max)=>String(v??'').trim().slice(0,max);
const safeEdition=v=>clean(v,80).toLowerCase().replace(/[^a-z0-9._-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
const makeId=()=>{const d=new Date(),date=`${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,'0')}${String(d.getUTCDate()).padStart(2,'0')}`,rand=crypto.randomUUID().replace(/-/g,'').slice(0,10).toUpperCase();return`LG-${date}-${rand}`};

async function ensureSlots(env,editionKey,tier,limit){
  const sql=`WITH RECURSIVE seq(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<?) INSERT OR IGNORE INTO guardian_edition_slots (edition_key,slot_no,tier) SELECT ?,n,? FROM seq`;
  await env.GUARDIAN_DB.prepare(sql).bind(limit,editionKey,tier).run();
}

export async function onRequestPost({request,env}){
  let body;
  try{body=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}

  const tier=clean(body?.tier,20);
  const name=clean(body?.name,40);
  const wishType=clean(body?.wishType||'custom',30);
  const isGift=body?.isGift===1||body?.isGift===true?1:0;
  const giverName=clean(body?.giverName,40);
  const recipientName=clean(body?.recipientName,40);
  const giftMessage=clean(body?.giftMessage,200);
  const campaignId=clean(body?.campaignId,80);
  const targetDate=clean(body?.targetDate,20);
  const rawElement=clean(body?.element,2);
  const guardianElement=ELEMENT_DESIGNS[rawElement]?rawElement:null;
  const requestedGuardianKey=clean(body?.guardianKey,80).toLowerCase();
  const archiveGuardianKey=ARCHIVE_DESIGNS.has(requestedGuardianKey)?requestedGuardianKey:null;
  const guardianDesignKey=archiveGuardianKey||(guardianElement?ELEMENT_DESIGNS[guardianElement]:null);
  const personalizationSource=guardianElement&&clean(body?.source,30)==='saju-result'?'saju-result':null;
  const displayName=isGift&&recipientName?recipientName:name;

  if(!TIERS[tier])return json({ok:false,error:'invalid_tier'},400);
  if(!name)return json({ok:false,error:'name_required'},400);
  if(isGift&&!recipientName)return json({ok:false,error:'recipient_required'},400);

  if(env?.LUMEN_GUARDIAN_ENABLED!=='true')return json({
    ok:false,
    error:'guardian_not_enabled',
    message:'Guardian server issuance is prepared but not enabled yet.',
    draft:{tier,name:displayName,wishType,price:TIERS[tier].price,isGift,recipientName,campaignId,guardianElement,guardianDesignKey,personalizationSource}
  },503);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured',message:'D1 binding GUARDIAN_DB is required.'},503);

  const id=makeId(),token=crypto.randomUUID(),createdAt=new Date().toISOString(),meta=TIERS[tier];
  const editionKey=safeEdition(body?.editionKey)||safeEdition(archiveGuardianKey)||`${tier}-default`;

  try{
    await ensureSlots(env,editionKey,tier,meta.limit);
    try{
      await env.GUARDIAN_DB.prepare(`INSERT INTO guardian_orders (id,tier,price_usd,edition_limit,display_name,wish_type,payment_status,issuance_status,created_at,verification_token,is_gift,giver_name,recipient_name,gift_message,campaign_id,target_date,edition_key,guardian_element,guardian_design_key,personalization_source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id,tier,meta.price,meta.limit,displayName,wishType,'pending','pending',createdAt,token,isGift,giverName||null,recipientName||null,giftMessage||null,campaignId||null,targetDate||null,editionKey,guardianElement,guardianDesignKey,personalizationSource).run();
    }catch(e){
      const msg=String(e?.message||e||'');
      if(!/guardian_element|guardian_design_key|personalization_source|no such column/i.test(msg))throw e;
      await env.GUARDIAN_DB.prepare(`INSERT INTO guardian_orders (id,tier,price_usd,edition_limit,display_name,wish_type,payment_status,issuance_status,created_at,verification_token,is_gift,giver_name,recipient_name,gift_message,campaign_id,target_date,edition_key) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id,tier,meta.price,meta.limit,displayName,wishType,'pending','pending',createdAt,token,isGift,giverName||null,recipientName||null,giftMessage||null,campaignId||null,targetDate||null,editionKey).run();
    }
  }catch{return json({ok:false,error:'storage_write_failed'},500)}

  return json({
    ok:true,
    order:{id,tier,priceUsd:meta.price,editionLimit:meta.limit,displayName,wishType,paymentStatus:'pending',issuanceStatus:'pending',createdAt,isGift:!!isGift,giverName,recipientName,campaignId,targetDate,editionKey,guardianElement,guardianDesignKey,personalizationSource},
    verifyUrl:`/guardian-verify/?id=${encodeURIComponent(id)}`
  },201);
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
