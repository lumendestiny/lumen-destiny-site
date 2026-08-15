import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const cases={
  ko:{offline:'인터넷 연결이 끊겼습니다',error:'일시적인 오류가 발생했습니다',retry:'다시 시도'},
  en:{offline:'You are offline',error:'A temporary error occurred',retry:'Try again'},
  ja:{offline:'インターネット接続が切れています',error:'一時的なエラーが発生しました',retry:'再試行'},
  tl:{offline:'Walang internet connection',error:'May pansamantalang error',retry:'Subukan muli'},
  vi:{offline:'Mất kết nối Internet',error:'Đã xảy ra lỗi tạm thời',retry:'Thử lại'},
  zh:{offline:'互联网连接已断开',error:'发生了临时错误',retry:'重试'}
};

const browser=await chromium.launch({headless:true});
const failures=[];
let passed=0;

for(const [lang,expected] of Object.entries(cases)){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(10000);
  try{
    const r=await page.goto(`${base}/?lang=${lang}&recovery_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:20000});
    if(!r?.ok())throw new Error(`home HTTP ${r?.status()}`);
    await page.waitForFunction(()=>window.__LUMEN_RECOVERY_UI__===true&&document.querySelector('.lumen-recovery'));

    await page.evaluate(()=>window.dispatchEvent(new Event('offline')));
    await page.waitForFunction(()=>document.querySelector('.lumen-recovery')?.classList.contains('show'));
    let state=await page.evaluate(()=>({
      title:document.querySelector('.lumen-recovery strong')?.textContent?.trim()||'',
      retry:document.querySelector('.lumen-recovery [data-act="retry"]')?.textContent?.trim()||'',
      visible:document.querySelector('.lumen-recovery')?.classList.contains('show')||false,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    }));
    if(state.title!==expected.offline)failures.push(`${lang}: offline title mismatch (${state.title})`);
    if(state.retry!==expected.retry)failures.push(`${lang}: retry label mismatch (${state.retry})`);
    if(!state.visible)failures.push(`${lang}: offline recovery UI did not become visible`);
    if(state.overflow>2)failures.push(`${lang}: recovery UI caused ${state.overflow}px horizontal overflow`);

    await page.evaluate(()=>window.dispatchEvent(new Event('online')));
    await page.waitForFunction(()=>!document.querySelector('.lumen-recovery')?.classList.contains('show'));

    await page.evaluate(()=>window.dispatchEvent(new Event('error')));
    await page.waitForFunction(()=>document.querySelector('.lumen-recovery')?.classList.contains('show'));
    state=await page.evaluate(()=>({
      title:document.querySelector('.lumen-recovery strong')?.textContent?.trim()||'',
      reload:document.querySelector('.lumen-recovery [data-act="reload"]')?.textContent?.trim()||'',
      home:document.querySelector('.lumen-recovery [data-act="home"]')?.getAttribute('href')||''
    }));
    if(state.title!==expected.error)failures.push(`${lang}: error title mismatch (${state.title})`);
    if(!state.reload)failures.push(`${lang}: reload action is empty`);
    if(!state.home.includes(`lang=${lang}`))failures.push(`${lang}: recovery home link lost language (${state.home})`);
    passed++;
  }catch(e){failures.push(`${lang}: ${e?.message||String(e)}`)}finally{await page.close()}
}

await browser.close();
console.log(`Recovery runtime audit completed: ${passed}/6 language sessions exercised offline and error states.`);
if(failures.length){
  console.error(`Recovery runtime audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log('Recovery runtime audit passed: KO / EN / JA / TL / VI / ZH offline and temporary-error UI is localized, visible, language-preserving and mobile-safe.');
