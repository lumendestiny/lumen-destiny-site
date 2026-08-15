import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const failures=[];
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage();
page.setDefaultTimeout(10000);

try{
  const res=await page.goto(`${base}/admin-guardian.html?admin_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
  if(!res?.ok())throw new Error(`admin page HTTP ${res?.status()}`);
  await page.waitForFunction(()=>document.getElementById('opsD1Preflight')&&document.getElementById('opsD1Gate'));

  const initial=await page.evaluate(()=>({
    robots:document.querySelector('meta[name="robots"]')?.content||'',
    secretType:document.getElementById('opsSecret')?.type||'',
    hasD1Button:!!document.getElementById('opsD1Preflight'),
    hasD1Gate:!!document.getElementById('opsD1Gate'),
    widthOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
  }));
  if(!initial.robots.includes('noindex')||!initial.robots.includes('nofollow'))failures.push(`admin robots meta is not protected (${initial.robots})`);
  if(initial.secretType!=='password')failures.push(`internal secret input type is ${initial.secretType||'missing'}`);
  if(!initial.hasD1Button||!initial.hasD1Gate)failures.push('D1 Preflight UI was not injected');
  if(initial.widthOverflow>2)failures.push(`admin dashboard has ${initial.widthOverflow}px page-level horizontal overflow at 390px`);

  await page.locator('#opsD1Preflight').click();
  const noSecretMessage=(await page.locator('#opsMessage').textContent()||'').trim();
  if(!noSecretMessage.includes('Internal secret'))failures.push(`D1 Preflight did not require the secret before request (${noSecretMessage})`);

  let requestSecret='';
  await page.route('**/api/admin/d1-preflight*',async route=>{
    requestSecret=route.request().headers()['x-lumen-internal-secret']||'';
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
      ok:true,generatedAt:'2026-08-15T09:00:00.000Z',readOnly:true,customerRowsReturned:false,
      summary:{ready:false,label:'D1 PREFLIGHT HOLD',tablesReady:true,indexesReady:true,controlSafe:true},
      releaseContext:{pgEvidenceReady:false,privacyEvidenceReady:false,paymentPublicCheckoutEnabled:false,paymentTestMode:false,releaseEvidenceReady:false},
      paymentControl:{present:true,state:'hold',changedAt:'2026-08-15T08:00:00.000Z',expected:'hold',safe:true},
      tables:[{table:'guardian_orders',ok:true,columnCount:24}],indexes:[{name:'idx_guardian_orders_created_at',ok:true}],blockers:[],
      note:'Read-only test fixture.'
    })});
  });

  await page.locator('#opsSecret').fill('runtime-test-secret');
  await page.locator('#opsD1Preflight').click();
  await page.waitForFunction(()=>{
    const message=document.getElementById('opsMessage')?.textContent||'';
    const cards=document.querySelectorAll('#opsD1Items .ops-card').length;
    return message.includes('D1 Preflight 완료')&&cards>=6;
  },{timeout:10000});
  const rendered=await page.evaluate(()=>({
    gate:document.getElementById('opsD1Gate')?.textContent||'',
    items:document.getElementById('opsD1Items')?.textContent||'',
    note:document.getElementById('opsD1Note')?.textContent||'',
    storedSession:sessionStorage.getItem('lumen-internal-secret'),
    storedLocal:localStorage.getItem('lumen-internal-secret')
  }));
  if(requestSecret!=='runtime-test-secret')failures.push('D1 Preflight request did not send the entered internal secret header');
  if(!rendered.gate.includes('스키마 PASS')||!rendered.gate.includes('Checkout control SAFE'))failures.push(`D1 gate summary did not render expected safe state (${rendered.gate})`);
  if(!rendered.items.includes('HOLD')||!rendered.items.includes('OFF'))failures.push('D1 release context cards did not render HOLD/OFF state');
  if(!rendered.note.includes('고객 row 반환 없음'))failures.push(`D1 note does not state customer rows are absent (${rendered.note})`);
  if(rendered.storedSession!=='runtime-test-secret')failures.push('internal secret was not kept in current-tab sessionStorage');
  if(rendered.storedLocal!==null)failures.push('internal secret must not be written to localStorage');

  await page.locator('#opsForget').click();
  const cleared=await page.evaluate(()=>({session:sessionStorage.getItem('lumen-internal-secret'),value:document.getElementById('opsSecret')?.value||''}));
  if(cleared.session!==null||cleared.value!=='')failures.push('Forget action did not clear the current-tab internal secret');
}catch(error){failures.push(error?.message||String(error))}
finally{await context.close();await browser.close()}

if(failures.length){
  console.error(`Admin dashboard runtime audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log('Admin dashboard runtime audit passed: noindex protection, password/session-only secret handling, completed D1 Preflight rendering, mocked read-only state, and secret clearing work on a 390px mobile viewport.');
