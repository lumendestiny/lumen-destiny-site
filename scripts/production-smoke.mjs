const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const pages=['/','/compatibility/?lang=ko','/consult/?lang=ko','/guardian/?lang=ko','/guardian-order/?lang=ko','/guardian-gift/?lang=ko','/guardian-campaigns/?lang=ko','/guardian-gallery/?lang=ko','/guardian-physical-status/?lang=ko','/guardian-verify/?lang=ko'];
const timeoutMs=12000;
async function fetchChecked(path,opts={}){const c=new AbortController();const t=setTimeout(()=>c.abort(),timeoutMs);try{const r=await fetch(base+path,{redirect:'follow',signal:c.signal,...opts});const chain=r.url;const text=await r.text();if(!r.ok)throw new Error(`${path}: HTTP ${r.status} (${chain})`);if(/ERR_TOO_MANY_REDIRECTS|too many redirects/i.test(text))throw new Error(`${path}: redirect-loop error page detected`);return{r,text,url:chain}}finally{clearTimeout(t)}}
let lastErr;
for(let attempt=1;attempt<=8;attempt++){
  try{
    for(const p of pages){const{x,url}=await fetchChecked(p);void x;console.log(`OK ${p} -> ${url}`)}
    const h=await fetchChecked('/api/health');let data;try{data=JSON.parse(h.text)}catch{throw new Error('/api/health: invalid JSON')}
    if(data?.ok!==true)throw new Error('/api/health: ok=true missing');
    console.log('HEALTH',JSON.stringify({version:data.version,features:data.features,configured:data.configured}));
    console.log('Production smoke test passed.');process.exit(0);
  }catch(e){lastErr=e;console.error(`Attempt ${attempt}/8 failed:`,e?.message||e);if(attempt<8)await new Promise(r=>setTimeout(r,15000));}
}
console.error('Production smoke test failed:',lastErr?.message||lastErr);process.exit(1);
