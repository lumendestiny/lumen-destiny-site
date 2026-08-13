const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function onRequestGet({env}){
  if(env?.LUMEN_GUARDIAN_ENABLED!=='true') return json({ok:false,error:'guardian_not_enabled'},503);
  if(!env?.GUARDIAN_DB) return json({ok:false,error:'storage_not_configured'},503);
  const id=`LG-E2E-${crypto.randomUUID().replace(/-/g,'').slice(0,12).toUpperCase()}`;
  const now=new Date().toISOString();
  try{
    const results=await env.GUARDIAN_DB.batch([
      env.GUARDIAN_DB.prepare(`INSERT INTO guardian_orders (id,tier,price_usd,edition_limit,display_name,wish_type,payment_status,issuance_status,created_at,verification_token,is_gift,edition_key) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id,'basic',5,100,'E2E TEST','e2e','pending','pending',now,crypto.randomUUID(),0,'e2e-test'),
      env.GUARDIAN_DB.prepare(`SELECT id,tier,price_usd,display_name,payment_status,issuance_status FROM guardian_orders WHERE id=? LIMIT 1`).bind(id),
      env.GUARDIAN_DB.prepare(`DELETE FROM guardian_orders WHERE id=?`).bind(id),
      env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS n FROM guardian_orders WHERE id=?`).bind(id)
    ]);
    const row=results?.[1]?.results?.[0]||null;
    const remaining=Number(results?.[3]?.results?.[0]?.n||0);
    return json({ok:!!row&&remaining===0,writeReadDelete:true,row,cleanupRemaining:remaining});
  }catch(e){return json({ok:false,error:'e2e_failed',message:String(e?.message||e)},500)}
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
