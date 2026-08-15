import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const routes=['/','/compatibility/','/guardian/','/guardian-order/','/guardian-gift/','/guardian-verify/','/terms.html','/refund-policy.html','/privacy.html','/support.html'];
const langs=['ko','en'];
const browser=await chromium.launch({headless:true});
const failures=[];
let scans=0;

for(const lang of langs){
  for(const route of routes){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const page=await context.newPage();
    try{
      const res=await page.goto(`${base}${route}?lang=${lang}&a11y_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
      if(!res?.ok()){failures.push(`${lang} ${route}: HTTP ${res?.status()}`);continue}
      await page.waitForTimeout(650);
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      scans++;
      for(const v of results.violations){
        if(!['serious','critical'].includes(v.impact||''))continue;
        const nodes=v.nodes.slice(0,6).map(n=>n.target.join(' ')).join(' | ');
        failures.push(`${lang} ${route}: ${v.id} [${v.impact}] ${v.help} — ${nodes}`);
      }

      const skip=page.locator('.skip-link');
      if(await skip.count()!==1){
        failures.push(`${lang} ${route}: expected one skip link`);
      }else{
        await skip.focus();
        const focusState=await page.evaluate(()=>{
          const el=document.activeElement,main=document.getElementById('main-content');
          const r=el?.getBoundingClientRect?.();
          return {isSkip:el?.classList?.contains('skip-link')||false,href:el?.getAttribute?.('href')||'',main:!!main,top:r?.top??-999};
        });
        if(!focusState.isSkip)failures.push(`${lang} ${route}: skip link cannot receive keyboard focus`);
        if(focusState.href!=='#main-content'||!focusState.main)failures.push(`${lang} ${route}: skip target is not wired to #main-content`);
        if(focusState.top<0)failures.push(`${lang} ${route}: focused skip link remains offscreen (${focusState.top}px)`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        const hash=await page.evaluate(()=>location.hash);
        if(hash!=='#main-content')failures.push(`${lang} ${route}: activating skip link did not target #main-content (${hash})`);
      }
    }catch(e){failures.push(`${lang} ${route}: ${e?.message||String(e)}`)}finally{await context.close()}
  }
}
await browser.close();
console.log(`Accessibility runtime audit completed: ${scans} rendered pages.`);
if(failures.length){
  console.error(`Accessibility runtime audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log('Accessibility runtime audit passed: no serious/critical WCAG 2.0/2.1 A/AA violations on the tested KO/EN V1 pages, and the keyboard skip link can be focused and activated on mobile-sized rendered pages.');
