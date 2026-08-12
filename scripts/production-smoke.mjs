const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const pages=['/','/compatibility?lang=ko','/consult?lang=ko','/guardian?lang=ko','/guardian-order?lang=ko','/guardian-gift?lang=ko','/guardian-campaigns?lang=ko','/guardian-gallery?lang=ko','/guardian-physical-status?lang=ko','/guardian-verify?lang=ko'];
const timeoutMs=12000;
async function fetchOnce(url,options={}){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeoutMs);try{return await fetch(url,{redirect:'manual',...options,signal:c.signal})}finally{clearTimeout(t)}}
async function fetchChecked(path){let url=base+path;const seen=new Set(),chain=[];for(let i=0;i<12;i++){if(seen.has(url))throw new Error(`${path}: redirect loop ${chain.join(' -> ')} -> ${url}`);seen.add(url);const r=await fetchOnce(url);chain.push(`${r.status} ${url}`);if(r.status>=300&&r.status<400){const loc=r.headers.get('location');if(!loc)throw new Error(`${path}: ${r.status} without Location; ${chain.join(' -> ')}`);url=new URL(loc,url).toString();continue}const text=await r.text();if(!r.ok)throw new Error(`${path}: HTTP ${r.status}; ${chain.join(' -> ')}`);if(/ERR_TOO_MANY_REDIRECTS|too many redirects/i.test(text))throw new Error(`${path}: redirect-loop error page; ${chain.join(' -> ')}`);console.log(`CHAIN ${path}: ${chain.join(' -> ')}`);return{r,text,url}}throw new Error(`${path}: too many redirect hops; ${chain.join(' -> ')}`)}
async function checkConsultProvider(){
  const r=await fetchOnce(base+'/api/consult',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic:'general',question:'연결 상태 확인을 위해 한 문장으로 인사해 주세요.',lang:'ko',context:{}})});
  let data={};try{data=await r.json()}catch{}
  if(r.ok&&data?.ok===true&&typeof data.answer==='string'&&data.answer.trim()){
    console.log('AI CONSULT LIVE',JSON.stringify({status:r.status,ok:true,model:data.model,stored:data.stored,answerLength:data.answer.length}));
    return;
  }
  if(r.status===429&&['provider_rate_limited','rate_limited'].includes(data?.error)){
    console.log('AI CONSULT CONNECTED_BUT_LIMITED',JSON.stringify({status:r.status,error:data.error}));
    return;
  }
  if(r.status===502&&['provider_error','provider_timeout','provider_unreachable'].includes(data?.error)){
    throw new Error(`/api/consult provider failure: HTTP ${r.status} ${data?.error}`);
  }
  if(r.status===503)throw new Error(`/api/consult not configured: ${data?.error||'unknown'}`);
  throw new Error(`/api/consult unexpected response: HTTP ${r.status} ${JSON.stringify(data)}`);
}
let lastErr;for(let attempt=1;attempt<=4;attempt++){try{for(const p of pages)await fetchChecked(p);const h=await fetchChecked('/api/health');let data;try{data=JSON.parse(h.text)}catch{throw new Error('/api/health: invalid JSON')}if(data?.ok!==true)throw new Error('/api/health: ok=true missing');console.log('HEALTH',JSON.stringify({version:data.version,features:data.features,configured:data.configured}));if(data?.configured?.aiEnabled&&data?.configured?.aiProviderReady)await checkConsultProvider();else throw new Error('/api/health: AI is not ready');console.log('Production smoke test passed.');process.exit(0)}catch(e){lastErr=e;console.error(`Attempt ${attempt}/4 failed:`,e?.message||e);if(attempt<4)await new Promise(r=>setTimeout(r,10000))}}console.error('Production smoke test failed:',lastErr?.message||lastErr);process.exit(1);
