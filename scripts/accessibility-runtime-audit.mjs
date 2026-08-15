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
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    try{
      const res=await page.goto(`${base}${route}?lang=${lang}&a11y_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
      if(!res?.ok()){failures.push(`${lang} ${route}: HTTP ${res?.status()}`);continue}
      await page.waitForTimeout(450);
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      scans++;
      for(const v of results.violations){
        if(!['serious','critical'].includes(v.impact||''))continue;
        const nodes=v.nodes.slice(0,6).map(n=>n.target.join(' ')).join(' | ');
        failures.push(`${lang} ${route}: ${v.id} [${v.impact}] ${v.help} — ${nodes}`);
      }
      // Product-specific keyboard/focus basics that generic rules cannot prove from static markup.
      await page.keyboard.press('Tab');
      const first=await page.evaluate(()=>({cls:document.activeElement?.className||'',href:document.activeElement?.getAttribute?.('href')||'',text:document.activeElement?.textContent?.trim()||''}));
      if(!String(first.cls).includes('skip-link'))failures.push(`${lang} ${route}: first keyboard focus is not skip link (${JSON.stringify(first)})`);
      await page.keyboard.press('Enter');
      const hash=await page.evaluate(()=>location.hash);
      if(hash!=='#main-content')failures.push(`${lang} ${route}: skip link did not target #main-content (${hash})`);
    }catch(e){failures.push(`${lang} ${route}: ${e?.message||String(e)}`)}finally{await page.close()}
  }
}
await browser.close();
console.log(`Accessibility runtime audit completed: ${scans} rendered pages.`);
if(failures.length){
  console.error(`Accessibility runtime audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f}`);
  process.exit(1);
}
console.log('Accessibility runtime audit passed: no serious/critical WCAG 2.0/2.1 A/AA violations on the tested KO/EN V1 pages, and the keyboard skip link works on mobile-sized rendered pages.');
