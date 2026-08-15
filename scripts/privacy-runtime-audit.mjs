import { chromium } from 'playwright';
import fs from 'node:fs';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const langs=['ko','en','ja','tl','vi','zh'];
const browser=await chromium.launch({headless:true});
const failures=[];
let passed=0;
const fail=(lang,flow,msg)=>failures.push(`${lang} ${flow}: ${msg}`);
const forbiddenUrlParts=['name=','birthYear=','birthMonth=','birthDay=','birthTime=','aName=','aBirth=','bName=','bBirth='];

async function mobilePage(){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(20000);
  return page;
}

function networkLeak(requests,sentinel){
  return requests.find(u=>u.includes(sentinel)||forbiddenUrlParts.some(x=>u.includes(x)));
}

for(const lang of langs){
  {
    const page=await mobilePage();
    const requests=[];
    page.on('request',r=>requests.push(r.url()));
    const sentinel=`PrivSaju${lang.toUpperCase()}`;
    try{
      const r=await page.goto(`${base}/?lang=${lang}&privacy_runtime_audit=1`,{waitUntil:'domcontentloaded'});
      if(!r?.ok())throw new Error(`home HTTP ${r?.status()}`);
      await page.waitForFunction(()=>document.querySelector('#birthYear')?.options.length>100&&document.querySelector('script[src*="private-input-session"]'));
      await page.locator('#userName').fill(sentinel);
      await page.locator('#gender').selectOption('male');
      await page.locator('#birthYear').selectOption('1990');
      await page.locator('#birthMonth').selectOption('05');
      await page.locator('#birthDay').selectOption('15');
      await page.locator('#birthTime').selectOption('10:00');
      await page.locator('#calendarType').selectOption('solar');
      await Promise.all([
        page.waitForURL(url=>url.pathname.endsWith('/result.html'),{timeout:20000}),
        page.locator('#manseSubmit').click()
      ]);
      await page.locator('#manseContent').waitFor({state:'visible',timeout:15000});
      await page.waitForFunction(()=>window.__LUMEN_PRIVATE_RESULT_CLEAN__===true,{timeout:6000});
      const state=await page.evaluate(()=>({
        url:location.href,
        stored:sessionStorage.getItem('lumen-private-saju-v1'),
        clean:window.__LUMEN_PRIVATE_RESULT_CLEAN__===true,
        title:document.querySelector('#resultTitle')?.textContent?.trim()||''
      }));
      const u=new URL(state.url);
      if([...u.searchParams.keys()].some(k=>k!=='lang'))fail(lang,'saju',`result URL retained private key(s): ${u.search}`);
      if(state.stored!==null)fail(lang,'saju','sessionStorage input was not deleted after successful calculation');
      if(!state.title)fail(lang,'saju','result title is empty');
      const leak=networkLeak(requests,sentinel);
      if(leak)fail(lang,'saju',`private input appeared in a network URL: ${leak}`);
      passed++;
    }catch(e){fail(lang,'saju',e?.message||String(e))}finally{await page.close()}
  }

  {
    const page=await mobilePage();
    const requests=[];
    page.on('request',r=>requests.push(r.url()));
    const a=`PrivA${lang.toUpperCase()}`,b=`PrivB${lang.toUpperCase()}`;
    try{
      const r=await page.goto(`${base}/compatibility/?lang=${lang}&privacy_runtime_audit=1`,{waitUntil:'domcontentloaded'});
      if(!r?.ok())throw new Error(`compatibility HTTP ${r?.status()}`);
      await page.waitForFunction(()=>document.querySelector('#aYear')?.options.length>100&&document.querySelector('script[src*="private-input-session"]'));
      await page.locator('#aName').fill(a);await page.locator('#bName').fill(b);
      await page.locator('#aGender').selectOption('male');await page.locator('#bGender').selectOption('female');
      await page.locator('#aYear').selectOption('1990');await page.locator('#aMonth').selectOption('05');await page.locator('#aDay').selectOption('15');await page.locator('#aTime').selectOption('10:00');await page.locator('#aCalendar').selectOption('solar');
      await page.locator('#bYear').selectOption('1992');await page.locator('#bMonth').selectOption('08');await page.locator('#bDay').selectOption('20');await page.locator('#bTime').selectOption('14:00');await page.locator('#bCalendar').selectOption('solar');
      await Promise.all([
        page.waitForURL(url=>url.pathname.includes('/compatibility-result'),{timeout:20000}),
        page.locator('#compatForm button[type="submit"]').click()
      ]);
      await page.locator('#compatContent').waitFor({state:'visible',timeout:15000});
      await page.waitForFunction(()=>window.__LUMEN_PRIVATE_RESULT_CLEAN__===true,{timeout:6000});
      const state=await page.evaluate(()=>({url:location.href,stored:sessionStorage.getItem('lumen-private-compat-v1'),title:document.querySelector('#compatTitle')?.textContent?.trim()||''}));
      const u=new URL(state.url);
      if([...u.searchParams.keys()].some(k=>k!=='lang'))fail(lang,'compatibility',`result URL retained private key(s): ${u.search}`);
      if(state.stored!==null)fail(lang,'compatibility','sessionStorage input was not deleted after successful calculation');
      if(!state.title)fail(lang,'compatibility','result title is empty');
      const leak=networkLeak(requests,a)||networkLeak(requests,b);
      if(leak)fail(lang,'compatibility',`private input appeared in a network URL: ${leak}`);
      passed++;
    }catch(e){fail(lang,'compatibility',e?.message||String(e))}finally{await page.close()}
  }
}

await browser.close();

const verifySource=fs.readFileSync('functions/api/guardian/verify.js','utf8');
for(const field of ['gift_message','giver_name','recipient_name','verification_token']){
  if(new RegExp(`\\b${field}\\b`,'i').test(verifySource))fail('server','guardian-verify',`public verify source references private field ${field}`);
}
const privacy=fs.readFileSync('privacy.html','utf8');
if(!privacy.includes('V1 공개 범위에는 관상 사진 업로드 기능을 포함하지 않습니다'))fail('policy','privacy','face-photo exclusion is not stated for V1');
if(!privacy.includes('llumendestiny@gmail.com'))fail('policy','privacy','privacy request email is missing or incorrect');

console.log(`Privacy runtime audit completed: ${passed}/12 private-session Saju/compatibility journeys reached successful result cleanup.`);
if(failures.length){
  console.error(`Privacy runtime audit failed with ${failures.length} issue(s):`);
  for(const x of failures)console.error(`FAIL ${x}`);
  process.exit(1);
}
console.log('Privacy runtime audit passed: free-reading private inputs stayed out of network URLs, were removed from result URLs/sessionStorage after successful calculation, and Guardian public verification source excludes gift/private token fields.');
