import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const widths=[320,360,390,430];
const langs=['ko','en','ja','tl','vi','zh'];
const routes=['/','/compatibility/','/guardian/','/guardian-order/','/guardian-gift/','/guardian-verify/'];
const outDir=path.resolve('artifacts/mobile-runtime');
fs.mkdirSync(outDir,{recursive:true});

const expectedPolicyLinks={
  ko:['환불·취소 정책','이용약관'],
  en:['Refund & cancellation policy','Terms of Use'],
  ja:['返金・キャンセルポリシー','利用規約'],
  tl:['Patakaran sa refund at cancellation','Terms of Use'],
  vi:['Chính sách hoàn tiền và hủy','Điều khoản sử dụng'],
  zh:['退款与取消政策','使用条款']
};

const browser=await chromium.launch({headless:true});
const failures=[];
let checks=0;

const slug=(route)=>route==='/'?'home':route.replace(/^\/+|\/+$/g,'').replace(/\//g,'-');
const fail=(ctx,message)=>failures.push({...ctx,message});

for(const width of widths){
  for(const lang of langs){
    for(const route of routes){
      const ctx={width,lang,route};
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:true,hasTouch:true});
      const url=`${base}${route}?lang=${lang}&mobile_runtime_audit=1`;
      try{
        const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
        if(!res||!res.ok()){
          fail(ctx,`HTTP ${res?.status()??'no-response'}`);
          continue;
        }
        await page.waitForTimeout(500);

        const state=await page.evaluate(({lang,route})=>{
          const rect=e=>e?e.getBoundingClientRect():null;
          const visible=e=>{
            if(!e||e.hidden)return false;
            const s=getComputedStyle(e),r=rect(e);
            return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r&&r.width>0&&r.height>0;
          };
          const root=document.documentElement;
          const header=document.querySelector('.fortune-header');
          const brand=document.querySelector('.brand-language-stack .brand');
          const switcher=document.querySelector('.fortune-header .language-switcher');
          const flags=[...document.querySelectorAll('.fortune-header .lang-choice')].filter(visible);
          const nav=document.querySelector('.main-fortune-nav');
          const focusables=[...document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),select,textarea')].filter(visible);
          const fieldInfo=focusables.map(e=>{
            const s=getComputedStyle(e);
            return {tag:e.tagName.toLowerCase(),id:e.id||'',name:e.getAttribute('name')||'',cls:e.className||'',font:parseFloat(s.fontSize)||0,lineHeight:s.lineHeight,parentClass:e.parentElement?.className||''};
          }).sort((a,b)=>a.font-b.font);
          const actionTargets=[...document.querySelectorAll('.fortune-submit,.result-actions button,.result-actions a.button')].filter(visible);
          const policyLinks=[...document.querySelectorAll('.guardian-policy-consent a')].map(a=>a.textContent.trim());
          const policySpan=document.querySelector('.guardian-policy-consent>span');
          const activeFlags=flags.filter(b=>b.getAttribute('aria-pressed')==='true');
          const headerStyle=header?getComputedStyle(header):null;
          const navStyle=nav?getComputedStyle(nav):null;
          const br=rect(brand),sr=rect(switcher);
          const sameRow=!!(br&&sr)&&Math.abs((br.top+br.bottom)/2-(sr.top+sr.bottom)/2)<10;
          const flagRects=flags.map(rect);
          const headerRect=rect(header);
          return {
            pageOverflow:root.scrollWidth-root.clientWidth,
            headerExists:!!header,
            headerPosition:headerStyle?.position||'',
            headerTop:headerStyle?.top||'',
            headerRect,
            sameRow,
            flagCount:flags.length,
            activeCount:activeFlags.length,
            activeLang:activeFlags[0]?.dataset?.lang||'',
            flagsVerticallyInside:!!headerRect&&flagRects.every(r=>r&&r.top>=headerRect.top-1&&r.bottom<=headerRect.bottom+1),
            navExists:!!nav,
            navOverflowX:navStyle?.overflowX||'',
            navInternalOverflow:nav?nav.scrollWidth>nav.clientWidth:false,
            minFieldFont:fieldInfo[0]?.font??null,
            minFieldTarget:fieldInfo[0]||null,
            fieldInfo,
            minActionHeight:actionTargets.length?Math.min(...actionTargets.map(e=>rect(e)?.height||0)):null,
            policyLinks,
            policyText:policySpan?.textContent||'',
            htmlLang:document.documentElement.lang,
            route
          };
        },{lang,route});

        checks++;
        if(state.pageOverflow>2) fail(ctx,`page horizontal overflow ${state.pageOverflow}px`);
        if(!state.headerExists) fail(ctx,'fortune header missing');
        if(state.headerExists&&state.headerPosition!=='sticky') fail(ctx,`header position is ${state.headerPosition}`);
        if(state.headerExists&&state.headerTop!=='0px') fail(ctx,`header top is ${state.headerTop}`);
        if(!state.sameRow) fail(ctx,'brand and language flags are not on the same row');
        if(state.flagCount!==6) fail(ctx,`expected 6 visible language flags, got ${state.flagCount}`);
        if(state.activeCount!==1||state.activeLang!==lang) fail(ctx,`active language mismatch count=${state.activeCount} active=${state.activeLang}`);
        if(!state.flagsVerticallyInside) fail(ctx,'language flag clipped vertically outside sticky header');
        if(!state.navExists) fail(ctx,'main navigation missing');
        if(state.navInternalOverflow&&!['auto','scroll'].includes(state.navOverflowX)) fail(ctx,`overflowing nav is not horizontally scrollable (${state.navOverflowX})`);
        if(state.minFieldFont!==null&&state.minFieldFont<15.9) fail(ctx,`visible form control font below 16px (${state.minFieldFont}px) target=${JSON.stringify(state.minFieldTarget)} all=${JSON.stringify(state.fieldInfo)}`);
        if(state.minActionHeight!==null&&state.minActionHeight<39.5) fail(ctx,`visible primary action touch height below 40px (${state.minActionHeight}px)`);

        if(route==='/guardian-order/'){
          const expected=expectedPolicyLinks[lang];
          if(JSON.stringify(state.policyLinks)!==JSON.stringify(expected)) fail(ctx,`policy link localization mismatch: ${JSON.stringify(state.policyLinks)}`);
          if(lang!=='ko'&&/[가-힣]/.test(state.policyText)) fail(ctx,'Korean policy text leaked into non-Korean checkout');
        }

        const sticky=await page.evaluate(()=>{
          const h=document.querySelector('.fortune-header');
          if(!h)return null;
          const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
          scrollTo(0,Math.min(500,max));
          return {after:h.getBoundingClientRect().top,max};
        });
        if(sticky&&sticky.max>20&&Math.abs(sticky.after)>1.5) fail(ctx,`sticky header moved after scroll (${sticky.after}px)`);

        const hasFailure=failures.some(f=>f.width===width&&f.lang===lang&&f.route===route);
        if(hasFailure)await page.screenshot({path:path.join(outDir,`${slug(route)}-${lang}-${width}.png`),fullPage:true});
      }catch(error){
        fail(ctx,error?.message||String(error));
        try{await page.screenshot({path:path.join(outDir,`${slug(route)}-${lang}-${width}-exception.png`),fullPage:true});}catch{}
      }finally{
        await page.close();
      }
    }
  }
}

await browser.close();
console.log(`Mobile runtime audit completed: ${checks} rendered route/language/width combinations.`);
if(failures.length){
  console.error(`Mobile runtime audit failed with ${failures.length} issue(s):`);
  for(const f of failures)console.error(`FAIL ${f.width}px ${f.lang} ${f.route} — ${f.message}`);
  process.exit(1);
}
console.log('Mobile runtime audit passed: no page-level horizontal overflow, six-language header state is stable, sticky navigation holds, visible mobile form sizing is safe, and Guardian checkout policy links are localized at 320/360/390/430px.');
