const headers={
  'Cache-Control':'no-store, max-age=0',
  'Content-Type':'application/json; charset=utf-8',
  'X-Content-Type-Options':'nosniff'
};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
const yes=v=>String(v||'').toLowerCase()==='true';

// Supabase project URL and publishable key are browser-safe public configuration.
// Cloudflare environment variables can override these defaults at any time.
const DEFAULT_SUPABASE_URL='https://vbuvefezimrqqvqysdsv.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY='sb_publishable_UaUpuz3wJfF1tFl_9ExSUg_TQ2qnrEN';

export async function onRequestGet({env}){
  const url=String(env?.SUPABASE_URL||DEFAULT_SUPABASE_URL).trim().replace(/\/$/,'');
  const publishableKey=String(env?.SUPABASE_PUBLISHABLE_KEY||env?.SUPABASE_ANON_KEY||DEFAULT_SUPABASE_PUBLISHABLE_KEY).trim();
  const enabled=Boolean(url&&publishableKey);
  return json({
    ok:true,
    provider:'supabase',
    enabled,
    // Keep enforcement behind the release switch until OAuth providers/redirects are QA-verified.
    required:enabled&&yes(env?.LUMEN_AUTH_REQUIRED),
    url:enabled?url:'',
    publishableKey:enabled?publishableKey:'',
    methods:{email:true,google:true,kakao:false,x:true,facebook:true},
    publicRoutes:['/','/compatibility','/compatibility-result','/guardian-verify','/privacy.html','/terms.html','/support.html','/login']
  });
}

export async function onRequest(){return json({ok:false,error:'method_not_allowed'},405)}
