const headers={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const PRODUCTS=[
 ['fortune-cat','basic',100],['koi','basic',100],['sun-bird','basic',100],['new-deer','basic',100],['gold-hamster','basic',100],
 ['moon-rabbit','custom',100],['dolphin','custom',100],['fire-fox','custom',100],['leaf-turtle','custom',100],['star-owl','custom',100],
 ['nine-fox','rare',5],['sea-dragon','rare',5],['unicorn','rare',5],['forest-turtle','rare',5],['wing-owl','rare',5],
 ['sky-dragon','legendary',1],['fire-phoenix','legendary',1],['moon-tiger','legendary',1],['qilin','legendary',1],['black-turtle','legendary',1]
];
export async function onRequestGet({env}){
  if(!env?.GUARDIAN_DB)return json({ok:false,error:'storage_not_configured'},503);
  const counts={};
  try{
    const out=await env.GUARDIAN_DB.prepare(`SELECT edition_key,COUNT(*) AS used FROM guardian_edition_slots WHERE order_id IS NOT NULL GROUP BY edition_key`).all();
    for(const row of out?.results||[])counts[String(row.edition_key||'')]=Number(row.used)||0;
  }catch{return json({ok:false,error:'availability_unavailable'},503)}
  return json({ok:true,generatedAt:new Date().toISOString(),items:PRODUCTS.map(([key,tier,limit])=>{const issued=Math.min(limit,Math.max(0,counts[key]||0));return{key,tier,limit,issued,remaining:Math.max(0,limit-issued),soldOut:issued>=limit}})});
}
export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
