import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const widths=[320,360,390,430];
const browser=await chromium.launch({headless:true});
const failures=[];

for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  try{
    const response=await page.goto(`${base}/?lang=ko&fortune_nav_mobile_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
    if(!response||!response.ok()) throw new Error(`HTTP ${response?.status()??'no-response'}`);
    await page.waitForTimeout(700);
    const wealthLink=page.locator('.main-fortune-nav a[href="#wealth"]');
    if(await wealthLink.count()!==1) throw new Error('wealth navigation link missing');
    await wealthLink.click();
    await page.waitForTimeout(900);

    const state=await page.evaluate(()=>{
      const header=document.querySelector('.fortune-header');
      const services=document.querySelector('.fortune-services');
      const title=document.querySelector('.fortune-services .section-title');
      const wealth=document.querySelector('#wealth');
      const link=document.querySelector('.main-fortune-nav a[href="#wealth"]');
      const rect=e=>e?e.getBoundingClientRect():null;
      const visible=e=>{
        if(!e)return false;
        const s=getComputedStyle(e),r=rect(e);
        return s.display!=='none'&&s.visibility!=='hidden'&&r&&r.width>0&&r.height>0;
      };
      return {
        hash:location.hash,
        headerBottom:rect(header)?.bottom??null,
        servicesTop:rect(services)?.top??null,
        titleVisible:visible(title),
        titleTop:rect(title)?.top??null,
        wealthVisible:visible(wealth),
        wealthFocused:wealth?.classList.contains('focused')||false,
        navActive:link?.classList.contains('active')||false,
        pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      };
    });

    const errors=[];
    if(state.hash!=='#wealth') errors.push(`hash=${state.hash}`);
    if(!state.navActive) errors.push('wealth nav not active');
    if(!state.wealthFocused) errors.push('wealth card not focused');
    if(!state.titleVisible) errors.push('FORTUNE SERVICES title not visible');
    if(!state.wealthVisible) errors.push('wealth card not visible');
    if(state.headerBottom===null||state.servicesTop===null) errors.push('header/services geometry unavailable');
    else {
      const delta=state.servicesTop-state.headerBottom;
      if(delta < -4 || delta > 48) errors.push(`services section not aligned below sticky header (delta=${delta}px)`);
    }
    if(state.pageOverflow>2) errors.push(`horizontal overflow ${state.pageOverflow}px`);
    if(errors.length) failures.push(`${width}px — ${errors.join('; ')}`);
  }catch(error){
    failures.push(`${width}px — ${error?.message||String(error)}`);
  }finally{
    await page.close();
  }
}

await browser.close();
if(failures.length){
  console.error('Fortune mobile navigation audit failed:');
  failures.forEach(item=>console.error(`FAIL ${item}`));
  process.exit(1);
}
console.log('Fortune mobile navigation audit passed: tapping 금전운 keeps the FORTUNE SERVICES heading visible below the sticky header and focuses the wealth card at 320/360/390/430px.');
