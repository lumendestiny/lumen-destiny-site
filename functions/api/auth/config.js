const headers={
  'Cache-Control':'no-store, max-age=0',
  'Content-Type':'application/json; charset=utf-8',
  'X-Content-Type-Options':'nosniff'
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const yes=v=>String(v||'').toLowerCase()==='true';

export async function onRequestGet({env}){
  const url=String(env?.SUPABASE_URL||'').trim().replace(/\/$/,'');
  const publishableKey=String(env?.SUPABASE_PUBLISHABLE_KEY||env?.SUPABASE_ANON_KEY||'').trim();
  const enabled=Boolean(url&&publishableKey);
  return json({
    ok:true,
    provider:'supabase',
    enabled,
    required:enabled&&yes(env?.LUMEN_AUTH_REQUIRED),
    url:enabled?url:'',
    publishableKey:enabled?publishableKey:'',
    methods:{email:true,google:true,kakao:true,x:true,facebook:true},
    publicRoutes:['/','/compatibility','/compatibility-result','/guardian-verify','/privacy.html','/terms.html','/support.html','/login']
  });
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
