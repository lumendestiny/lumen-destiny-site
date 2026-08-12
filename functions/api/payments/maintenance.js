const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,...extra}});
const auth=(request,env)=>!!env?.LUMEN_INTERNAL_SECRET&&(request.headers.get('x-lumen-internal-secret')||'')===env.LUMEN_INTERNAL_SECRET;
export async function onRequestPost({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const now=new Date().toISOString();
  let result;try{result=await env.GUARDIAN_DB.prepare(`UPDATE guardian_checkout_sessions SET status='expired',failure_code=COALESCE(failure_code,'checkout_expired'),updated_at=? WHERE status IN ('creating','ready') AND expires_at IS NOT NULL AND expires_at<?`).bind(now,now).run()}catch{return json({ok:false,error:'storage_write_failed'},500)}
  return json({ok:true,expired:Number(result?.meta?.changes||0),checkedAt:now});
}
export async function onRequestGet({request,env}){
  if(!auth(request,env))return json({ok:false,error:'unauthorized'},401);
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const now=new Date().toISOString();let row;try{row=await env.GUARDIAN_DB.prepare(`SELECT COUNT(*) AS count FROM guardian_checkout_sessions WHERE status IN ('creating','ready') AND expires_at IS NOT NULL AND expires_at<?`).bind(now).first()}catch{return json({ok:false,error:'storage_read_failed'},500)}
  return json({ok:true,expiredCandidates:Number(row?.count||0),checkedAt:now});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405,{Allow:'GET, POST'})}
