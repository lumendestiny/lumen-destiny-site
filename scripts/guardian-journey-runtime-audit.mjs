import { chromium } from 'playwright';

const base=(process.env.LUMEN_PROD_BASE_URL||'https://lumendestiny.com').replace(/\/$/,'');
const langs=['ko','en','ja','tl','vi','zh'];
const browser=await chromium.launch({headless:true});
const failures=[];
let checks=0;
const fail=(lang,flow,msg)=>failures.push(`${lang} ${flow}: ${msg}`);

async function open(page,path){
  const res=await page.goto(`${base}${path}`,{waitUntil:'domcontentloaded',timeout:25000});
  if(!res?.ok())throw new Error(`HTTP ${res?.status()}`);
  await page.waitForTimeout(500);
}
async function assertNoOverflow(page,lang,flow){
  const n=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  if(n>2)fail(lang,flow,`horizontal overflow ${n}px`);
}

for(const lang of langs){
  // Archive -> selected Guardian -> personalized preview. This stops before creating a server order.
  {
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    try{
      await open(page,`/guardian/?lang=${lang}&journey_runtime_audit=1`);
      const href=await page.locator('#purpose-guardians .archive-card a.button').first().getAttribute('href');
      if(!href){fail(lang,'archive','no Guardian selection CTA');continue}
      const u=new URL(href,base);
      if(!u.pathname.startsWith('/guardian-order'))fail(lang,'archive',`selection did not lead to Guardian order (${href})`);
      if(u.searchParams.get('lang')!==lang)fail(lang,'archive',`selection lost language (${href})`);
      await page.goto(u.toString(),{waitUntil:'domcontentloaded',timeout:25000});
      await page.waitForTimeout(600);
      if(new URL(page.url()).searchParams.get('lang')!==lang)fail(lang,'order',`order URL lost language (${page.url()})`);
      const fields=page.locator('#guardianOrderForm');
      if(await fields.count()!==1){fail(lang,'order','order form missing');continue}
      await page.locator('#guardianName').fill(`Runtime ${lang}`);
      await page.locator('#guardianWish').fill(`Guardian preview test ${lang}`);
      await page.locator('#guardianOrderForm button[type="submit"]').click();
      await page.waitForTimeout(250);
      const hidden=await page.locator('#guardianPreview').evaluate(el=>el.hidden);
      if(hidden)fail(lang,'order','personalized preview remained hidden');
      const preview=await page.locator('#guardianPreview').innerText();
      if(!preview.includes(`Runtime ${lang}`))fail(lang,'order','preview did not contain entered display name');
      if(!preview.includes(`Guardian preview test ${lang}`))fail(lang,'order','preview did not contain entered wish');
      const consentVisible=await page.locator('#guardianPolicyAgree').isVisible();
      if(!consentVisible)fail(lang,'order','policy consent is not visible before issuance preparation');
      await assertNoOverflow(page,lang,'order');
      checks++;
    }catch(e){fail(lang,'archive/order',e?.message||String(e))}finally{await page.close()}
  }

  // Gift landing -> gift order -> recipient preview. Stops before server order/payment.
  {
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    try{
      await open(page,`/guardian-gift/?lang=${lang}&journey_runtime_audit=1`);
      const giftCta=page.locator('.gift-entry .deep-reading-grid a.button.primary').first();
      const href=await giftCta.getAttribute('href');
      if(!href){fail(lang,'gift','gift CTA missing');continue}
      const u=new URL(href,base);
      if(u.searchParams.get('gift')!=='1')fail(lang,'gift',`gift flag missing (${href})`);
      if(u.searchParams.get('lang')!==lang)fail(lang,'gift',`gift CTA lost language (${href})`);
      await page.goto(u.toString(),{waitUntil:'domcontentloaded',timeout:25000});
      await page.waitForTimeout(600);
      const giftHidden=await page.locator('#giftFields').evaluate(el=>el.hidden);
      if(giftHidden)fail(lang,'gift-order','gift recipient fields remained hidden');
      if(!(await page.locator('#guardianRecipient').evaluate(el=>el.required)))fail(lang,'gift-order','recipient is not required in gift mode');
      await page.locator('#guardianName').fill(`Gift ${lang}`);
      await page.locator('#guardianWish').fill(`Gift wish ${lang}`);
      await page.locator('#guardianGiver').fill(`Sender ${lang}`);
      await page.locator('#guardianRecipient').fill(`Recipient ${lang}`);
      await page.locator('#guardianMessage').fill(`Message ${lang}`);
      await page.locator('#guardianOrderForm button[type="submit"]').click();
      await page.waitForTimeout(250);
      const preview=await page.locator('#guardianPreview').innerText();
      if(!preview.includes(`Recipient ${lang}`))fail(lang,'gift-order','gift preview did not contain recipient');
      if(!preview.includes(`Message ${lang}`))fail(lang,'gift-order','gift preview did not contain gift message');
      await assertNoOverflow(page,lang,'gift-order');
      checks++;
    }catch(e){fail(lang,'gift',e?.message||String(e))}finally{await page.close()}
  }
}

await browser.close();
console.log(`Guardian journey runtime audit completed: ${checks} preview flows without creating payment orders.`);
if(failures.length){
  console.error(`Guardian journey runtime audit failed with ${failures.length} issue(s):`);
  for(const x of failures)console.error(`FAIL ${x}`);
  process.exit(1);
}
console.log('Guardian journey runtime audit passed: archive selection, personalized preview, gift recipient flow, language preservation, policy visibility and 390px mobile layout work in KO / EN / JA / TL / VI / ZH without creating server orders or payments.');
