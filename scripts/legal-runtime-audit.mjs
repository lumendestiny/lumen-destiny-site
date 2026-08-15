import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const langs=['ko','en','ja','tl','vi','zh'];
const routes=['/terms.html','/refund-policy.html','/privacy.html','/support.html'];
const expected={
  ko:{'/terms.html':'이용약관','/refund-policy.html':'환불·취소 정책','/privacy.html':'개인정보처리방침','/support.html':'고객지원'},
  en:{'/terms.html':'Terms of Use','/refund-policy.html':'Refund & Cancellation Policy','/privacy.html':'Privacy Policy','/support.html':'Support'},
  ja:{'/terms.html':'利用規約','/refund-policy.html':'返金・キャンセルポリシー','/privacy.html':'プライバシーポリシー','/support.html':'サポート'},
  tl:{'/terms.html':'Terms of Use','/refund-policy.html':'Refund & Cancellation Policy','/privacy.html':'Privacy Policy','/support.html':'Support'},
  vi:{'/terms.html':'Điều khoản sử dụng','/refund-policy.html':'Chính sách hoàn tiền và hủy','/privacy.html':'Chính sách quyền riêng tư','/support.html':'Hỗ trợ'},
  zh:{'/terms.html':'使用条款','/refund-policy.html':'退款与取消政策','/privacy.html':'隐私政策','/support.html':'客户支持'}
};

const browser=await chromium.launch({headless:true});
const failures=[];
for(const lang of langs){
  for(const route of routes){
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    try{
      const res=await page.goto(`${base}${route}?lang=${lang}&legal_runtime_audit=1`,{waitUntil:'domcontentloaded',timeout:25000});
      if(!res?.ok()){failures.push(`${lang} ${route}: HTTP ${res?.status()}`);continue}
      await page.waitForTimeout(450);
      const state=await page.evaluate(()=>{
        const main=document.querySelector('main');
        const heading=main?.querySelector('h1,h2')?.textContent?.trim()||'';
        const mainText=main?.innerText||'';
        const footerText=document.querySelector('footer')?.innerText||'';
        const internal=[...document.querySelectorAll('main a[href],footer a[href]')].filter(a=>{
          try{return new URL(a.href,location.origin).origin===location.origin}catch{return false}
        }).map(a=>a.getAttribute('href')||'');
        return {heading,mainText,footerText,internal,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,htmlLang:document.documentElement.lang};
      });
      if(!state.heading.includes(expected[lang][route]))failures.push(`${lang} ${route}: heading mismatch (${state.heading})`);
      if(lang!=='ko'&&/[가-힣]/.test(state.mainText))failures.push(`${lang} ${route}: Korean text leaked into translated main content`);
      if(lang!=='ko'&&state.footerText&&/[가-힣]/.test(state.footerText))failures.push(`${lang} ${route}: Korean text leaked into translated footer`);
      if(state.overflow>2)failures.push(`${lang} ${route}: horizontal overflow ${state.overflow}px`);
      for(const href of state.internal){
        if(href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))continue;
        const u=new URL(href,base);
        if(u.pathname.startsWith('/guardian')||['/','/terms','/terms.html','/refund-policy','/refund-policy.html','/privacy','/privacy.html','/support','/support.html'].includes(u.pathname)){
          if(u.searchParams.get('lang')!==lang)failures.push(`${lang} ${route}: internal link lost language (${href})`);
        }
      }
    }catch(e){failures.push(`${lang} ${route}: ${e?.message||e}`)}finally{await page.close()}
  }
}
await browser.close();
if(failures.length){console.error(`Legal runtime audit failed with ${failures.length} issue(s):`);for(const f of failures)console.error(`FAIL ${f}`);process.exit(1)}
console.log('Legal runtime audit passed: KO / EN / JA / TL / VI / ZH Terms, Refund/Cancellation, Privacy and Support render without Korean leakage, preserve language links and fit a 390px mobile viewport.');
