const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function onRequestGet({env}){
 const enabled=env?.LUMEN_LINK_ENABLED==='true';
 const bound=!!env?.GUARDIAN_DB;
 let schema=false;
 if(bound){try{const row=await env.GUARDIAN_DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('lumen_link_invites','lumen_link_relationships')").all();schema=Array.isArray(row?.results)&&row.results.length===2}catch{schema=false}}
 const ready=enabled&&bound&&schema;
 return json({ok:true,service:'lumen-link',ready,checks:{featureFlag:enabled,d1Bound:bound,schemaReady:schema},mode:ready?'ready':'preflight'},ready?200:503);
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
