import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const langs=['ko','en','ja','tl','vi','zh'];
const browser=await chromium.launch({headless:true});
const failures=[];
let passed=0;
const fail=(lang,flow,msg)=>failures.push(`${lang} ${flow}: ${msg}`);

async function page390(){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(18000);
  return page;
}

for(const lang of langs){
  // Free Saju input -> result calculation.
  {
    const page=await page390();
    try{
      const r=await page.goto(`${base}/?lang=${lang}&core_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:18000});
      if(!r?.ok())throw new Error(`home HTTP ${r?.status()}`);
      await page.waitForFunction(()=>document.querySelector('#birthYear')?.options.length>100&&document.querySelector('#birthTime')?.options.length>40);
      await page.locator('#userName').fill(`Runtime ${lang}`);
      await page.locator('#gender').selectOption('male');
      await page.locator('#birthYear').selectOption('1990');
      await page.locator('#birthMonth').selectOption('05');
      await page.locator('#birthDay').selectOption('15');
      await page.locator('#birthTime').selectOption('10:00');
      await page.locator('#calendarType').selectOption('solar');
      await Promise.all([
        page.waitForURL(url=>url.pathname.includes('/result'),{timeout:18000}),
        page.locator('#manseSubmit').click()
      ]);
      if(new URL(page.url()).searchParams.get('lang')!==lang)fail(lang,'saju',`result URL lost language (${page.url()})`);
      await Promise.race([
        page.locator('#manseContent').waitFor({state:'visible',timeout:10000}),
        page.locator('#manseError').waitFor({state:'visible',timeout:10000}).then(()=>{throw new Error(`manse error: ${page.locator('#manseError').innerText()}`)})
      ]);
      const state=await page.evaluate(()=>({
        title:document.querySelector('#resultTitle')?.textContent?.trim()||'',
        pillars:document.querySelectorAll('#pillarGrid>*').length,
        tenGods:document.querySelectorAll('#tenGodGrid>*').length,
        basic:document.querySelector('#basicReading')?.textContent?.trim()||'',
        wealth:document.querySelector('#wealthText')?.textContent?.trim()||'',
        year:document.querySelector('#yearText')?.textContent?.trim()||'',
        month:document.querySelector('#monthText')?.textContent?.trim()||'',
        today:document.querySelector('#todayText')?.textContent?.trim()||'',
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      }));
      if(state.pillars!==4)fail(lang,'saju',`expected 4 pillars, got ${state.pillars}`);
      if(state.tenGods<4)fail(lang,'saju',`ten-god result appears incomplete (${state.tenGods})`);
      if(!state.basic||!state.wealth||!state.year||!state.month||!state.today)fail(lang,'saju','one or more free reading sections are empty');
      if(state.overflow>2)fail(lang,'saju',`result horizontal overflow ${state.overflow}px`);
      passed++;
    }catch(e){fail(lang,'saju',e?.message||String(e))}finally{await page.close()}
  }

  // Compatibility input -> result calculation.
  {
    const page=await page390();
    try{
      const r=await page.goto(`${base}/compatibility/?lang=${lang}&core_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:18000});
      if(!r?.ok())throw new Error(`compatibility HTTP ${r?.status()}`);
      await page.waitForFunction(()=>document.querySelector('#aYear')?.options.length>100&&document.querySelector('#bYear')?.options.length>100);
      await page.locator('#aName').fill(`A ${lang}`);
      await page.locator('#bName').fill(`B ${lang}`);
      await page.locator('#aGender').selectOption('male');
      await page.locator('#bGender').selectOption('female');
      await page.locator('#aYear').selectOption('1990');
      await page.locator('#aMonth').selectOption('05');
      await page.locator('#aDay').selectOption('15');
      await page.locator('#aTime').selectOption('10:00');
      await page.locator('#aCalendar').selectOption('solar');
      await page.locator('#bYear').selectOption('1992');
      await page.locator('#bMonth').selectOption('08');
      await page.locator('#bDay').selectOption('20');
      await page.locator('#bTime').selectOption('14:00');
      await page.locator('#bCalendar').selectOption('solar');
      await Promise.all([
        page.waitForURL(url=>url.pathname.includes('/compatibility-result'),{timeout:18000}),
        page.locator('#compatForm button[type="submit"]').click()
      ]);
      if(new URL(page.url()).searchParams.get('lang')!==lang)fail(lang,'compatibility',`result URL lost language (${page.url()})`);
      await Promise.race([
        page.locator('#compatContent').waitFor({state:'visible',timeout:10000}),
        page.locator('#compatError').waitFor({state:'visible',timeout:10000}).then(()=>{throw new Error(`compatibility error: ${page.locator('#compatError').innerText()}`)})
      ]);
      const state=await page.evaluate(()=>({
        title:document.querySelector('#compatTitle')?.textContent?.trim()||'',
        charts:document.querySelectorAll('#compatCharts>*').length,
        reading:document.querySelector('#compatReading')?.textContent?.trim()||'',
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      }));
      if(state.charts<2)fail(lang,'compatibility',`expected two chart summaries, got ${state.charts}`);
      if(!state.reading)fail(lang,'compatibility','compatibility reading is empty');
      if(state.overflow>2)fail(lang,'compatibility',`result horizontal overflow ${state.overflow}px`);
      passed++;
    }catch(e){fail(lang,'compatibility',e?.message||String(e))}finally{await page.close()}
  }
}

await browser.close();
console.log(`Core V1 runtime audit completed: ${passed}/12 rendered Saju/compatibility journeys reached result validation.`);
if(failures.length){
  console.error(`Core V1 runtime audit failed with ${failures.length} issue(s):`);
  for(const x of failures)console.error(`FAIL ${x}`);
  process.exit(1);
}
console.log('Core V1 runtime audit passed: free Saju and compatibility forms calculate populated results, preserve KO / EN / JA / TL / VI / ZH, and fit a 390px mobile viewport.');
