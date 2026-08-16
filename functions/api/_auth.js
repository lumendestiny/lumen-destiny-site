const yes=v=>String(v||'').toLowerCase()==='true';
const cleanBase=v=>String(v||'').trim().replace(/\/$/,'');
const DEFAULT_SUPABASE_URL='https://vbuvefezimrqqvqysdsv.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY='sb_publishable_UaUpuz3wJfF1tFl_9ExSUg_TQ2qnrEN';

export function authIsRequired(env){return yes(env?.LUMEN_AUTH_REQUIRED)}

export async function authorizeRequest(request,env){
  const required=authIsRequired(env);
  const url=cleanBase(env?.SUPABASE_URL||DEFAULT_SUPABASE_URL);
  const key=String(env?.SUPABASE_PUBLISHABLE_KEY||env?.SUPABASE_ANON_KEY||DEFAULT_SUPABASE_PUBLISHABLE_KEY).trim();
  if(!required)return{required:false,configured:Boolean(url&&key),user:null};

  if(!url||!key)return{required:true,configured:false,user:null,error:'auth_not_configured',status:503};

  const authorization=String(request.headers.get('authorization')||'').trim();
  if(!/^Bearer\s+\S+/i.test(authorization))return{required:true,configured:true,user:null,error:'auth_required',status:401};

  let response;
  try{
    response=await fetch(`${url}/auth/v1/user`,{
      method:'GET',
      headers:{apikey:key,Authorization:authorization,Accept:'application/json'}
    });
  }catch{
    return{required:true,configured:true,user:null,error:'auth_service_unavailable',status:503};
  }
  if(!response.ok)return{required:true,configured:true,user:null,error:'invalid_or_expired_session',status:401};

  let user=null;
  try{user=await response.json()}catch{}
  if(!user?.id)return{required:true,configured:true,user:null,error:'invalid_or_expired_session',status:401};
  return{required:true,configured:true,user};
}
