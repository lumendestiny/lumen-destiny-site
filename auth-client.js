const SUPABASE_ESM='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
let configPromise=null,clientPromise=null;

export const normalizeLang=value=>{
  const raw=String(value||'').toLowerCase();
  if(raw.startsWith('zh'))return'zh';
  if(raw.startsWith('ja'))return'ja';
  if(raw.startsWith('vi'))return'vi';
  if(raw.startsWith('tl')||raw.startsWith('fil'))return'tl';
  if(raw.startsWith('en'))return'en';
  return'ko';
};

export async function getAuthConfig(force=false){
  if(force)configPromise=null;
  if(!configPromise)configPromise=fetch('/api/auth/config',{headers:{accept:'application/json'},cache:'no-store',credentials:'same-origin'})
    .then(async r=>{const d=await r.json().catch(()=>null);return r.ok&&d?.ok?d:{enabled:false,required:false,methods:{}}})
    .catch(()=>({enabled:false,required:false,methods:{}}));
  return configPromise;
}

export async function getAuthClient(){
  if(!clientPromise)clientPromise=(async()=>{
    const cfg=await getAuthConfig();
    if(!cfg?.enabled||!cfg.url||!cfg.publishableKey)return null;
    const {createClient}=await import(SUPABASE_ESM);
    return createClient(cfg.url,cfg.publishableKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}
    });
  })();
  return clientPromise;
}

export async function completeAuthCallback(){
  const client=await getAuthClient();
  if(!client)return null;
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  const session=data?.session||null;
  if(session){
    const u=new URL(location.href);
    if(u.searchParams.has('code')){
      u.searchParams.delete('code');
      u.searchParams.delete('auth');
      history.replaceState(null,'',u.pathname+u.search+u.hash);
    }
  }
  return session;
}

export async function getSession(){
  const client=await getAuthClient();
  if(!client)return null;
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  return data?.session||null;
}

export async function getUser(){return(await getSession())?.user||null}
export async function getAccessToken(){return(await getSession())?.access_token||''}

export function safeNext(value='/'){
  try{
    const u=new URL(String(value||'/'),location.origin);
    return u.origin===location.origin?u.pathname+u.search+u.hash:'/';
  }catch{return'/'}
}

export function loginCallbackUrl(next='/'){
  const lang=normalizeLang(new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||'ko');
  const u=new URL('/login/',location.origin);
  u.searchParams.set('auth','callback');
  u.searchParams.set('next',safeNext(next));
  u.searchParams.set('lang',lang);
  return u.toString();
}

export async function signInOAuth(provider,next='/'){
  const client=await getAuthClient();
  if(!client)throw new Error('auth_not_configured');
  const {data,error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:loginCallbackUrl(next)}});
  if(error)throw error;
  return data;
}

export async function signInPassword(email,password){
  const client=await getAuthClient();
  if(!client)throw new Error('auth_not_configured');
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error)throw error;
  return data;
}

export async function signUpPassword(email,password,next='/'){
  const client=await getAuthClient();
  if(!client)throw new Error('auth_not_configured');
  const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:loginCallbackUrl(next)}});
  if(error)throw error;
  return data;
}

export async function signOut(){
  const client=await getAuthClient();
  if(client)await client.auth.signOut();
  localStorage.removeItem('lumen-auth-user-id');
  localStorage.removeItem('lumen-auth-user-email');
}

export async function onAuthStateChange(callback){
  const client=await getAuthClient();
  if(!client)return()=>{};
  const {data}=client.auth.onAuthStateChange((event,session)=>callback(event,session));
  return()=>data?.subscription?.unsubscribe?.();
}
