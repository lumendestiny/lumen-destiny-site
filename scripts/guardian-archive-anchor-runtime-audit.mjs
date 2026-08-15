import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const widths=[320,360,390,430];
const langs=['ko','en','ja','tl','vi','zh'];
const outDir=path.resolve('artifacts/guardian-archive-anchor');
fs.mkdirSync(outDir,{recursive:true});

const browser=await chromium.launch({headless:true});
const failures=[];
let checks=0;

for(const width of widths){
  for(const lang of langs){
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const ctx={width,lang};
    try{
      const home=await page.goto(`${base}/?lang=${lang}&archive_anchor_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
      if(!home?.ok())throw new Error(`home HTTP ${home?.status()??'no-response'}`);
      await page.waitForTimeout(500);

      const archiveButton=page.locator('a.button[href*="/guardian/"][href*="#purpose-guardians"]').first();
      if(await archiveButton.count()!==1)throw new Error('Guardian archive button was not found on home page');
      await archiveButton.scrollIntoViewIfNeeded();
      await archiveButton.click();
      await page.waitForURL(url=>url.pathname.startsWith('/guardian')&&url.hash==='#purpose-guardians',{timeout:15000});
      await page.waitForSelector('#purpose-guardians .purpose-guardian-heading',{state:'visible',timeout:15000});
      await page.waitForTimeout(500);

      const state=await page.evaluate(()=>{
        const rect=e=>e?.getBoundingClientRect?.()||null;
        const header=document.querySelector('.fortune-header');
        const hero=document.querySelector('.archive-hero');
        const section=document.getElementById('purpose-guardians');
        const heading=section?.querySelector('.purpose-guardian-heading');
        const activeArchive=[...document.querySelectorAll('.main-fortune-nav a')].find(a=>a.classList.contains('active')||a.getAttribute('aria-current')==='page'||/아카이브|archive/i.test(a.textContent||''));
        const hs=hero?getComputedStyle(hero):null;
        const hr=rect(header),sr=rect(section),gr=rect(heading);
        return {
          hash:location.hash,
          heroDisplay:hs?.display||'',
          headerBottom:hr?.bottom??null,
          sectionTop:sr?.top??null,
          headingTop:gr?.top??null,
          headingBottom:gr?.bottom??null,
          headingVisible:!!gr&&gr.bottom>0&&gr.top<innerHeight,
          pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
          activeArchiveText:(activeArchive?.textContent||'').trim(),
          firstViewportText:(document.elementFromPoint(Math.min(40,innerWidth-1),Math.min((hr?.bottom||0)+20,innerHeight-1))?.closest('section')?.id)||''
        };
      });

      checks++;
      if(state.hash!=='#purpose-guardians')failures.push({...ctx,message:`hash mismatch ${state.hash}`});
      if(state.heroDisplay!=='none')failures.push({...ctx,message:`archive hero is still visible (${state.heroDisplay})`});
      if(!state.headingVisible)failures.push({...ctx,message:'collection heading is not visible after archive-button navigation'});
      if(state.headerBottom!==null&&state.headingTop!==null&&state.headingTop<state.headerBottom-2)failures.push({...ctx,message:`collection heading is covered by sticky header (headingTop=${state.headingTop}, headerBottom=${state.headerBottom})`});
      if(state.headerBottom!==null&&state.sectionTop!==null&&state.sectionTop>state.headerBottom+80)failures.push({...ctx,message:`collection starts too far below header (sectionTop=${state.sectionTop}, headerBottom=${state.headerBottom})`});
      if(state.pageOverflow>2)failures.push({...ctx,message:`horizontal overflow ${state.pageOverflow}px`});
      if(state.firstViewportText!=='purpose-guardians')failures.push({...ctx,message:`first content below header is ${state.firstViewportText||'not the Guardian collection'}`});

      const failedHere=failures.some(f=>f.width===width&&f.lang===lang);
      if(failedHere)await page.screenshot({path:path.join(outDir,`archive-${lang}-${width}.png`),fullPage:true});
    }catch(error){
      failures.push({...ctx,message:error?.message||String(error)});
      try{await page.screenshot({path:path.join(outDir,`archive-${lang}-${width}-exception.png`),fullPage:true});}catch{}
    }finally{
      await page.close();
    }
  }
}

await browser.close();
console.log(`Guardian archive anchor audit completed: ${checks} mobile language/width combinations.`);
if(failures.length){
  console.error(`Guardian archive anchor audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f.width}px ${f.lang} — ${f.message}`);
  process.exit(1);
}
console.log('Guardian archive anchor audit passed: the home archive button opens #purpose-guardians directly, hides the intro hero, keeps the collection below the sticky header, and avoids horizontal overflow at 320/360/390/430px in all six languages.');
