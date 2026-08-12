const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function onRequestGet({env}){
 if(env?.LUMEN_STORIES_ENABLED!=='true'||!env?.GUARDIAN_DB)return json({ok:true,stories:[]});
 try{
  const rs=await env.GUARDIAN_DB.prepare(`SELECT id,guardian_id,story_type,story_text,display_name,created_at FROM guardian_stories WHERE status='approved' AND consent_public=1 ORDER BY reviewed_at DESC, created_at DESC LIMIT 24`).all();
  const stories=(rs?.results||[]).map(r=>({id:r.id,guardianId:r.guardian_id,type:r.story_type,story:String(r.story_text||'').slice(0,700),displayName:r.display_name||'익명',createdAt:r.created_at}));
  return json({ok:true,stories});
 }catch{return json({ok:false,error:'storage_read_failed'},500)}
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}