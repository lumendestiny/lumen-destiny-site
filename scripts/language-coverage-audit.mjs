import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=[];
const need=(ok,msg)=>{if(!ok)fail.push(msg)};
const hasAll=(text,items)=>items.every(x=>text.includes(x));
const segment=(text,start,end)=>{const a=text.indexOf(start);if(a<0)return'';const b=end?text.indexOf(end,a+start.length):-1;return text.slice(a,b<0?text.length:b)};

const langs=['ko','en','ja','tl','vi','zh'];
const smoke=read('scripts/production-smoke.mjs');
for(const l of langs)need(smoke.includes(`'${l}'`),`production smoke missing language ${l}`);

const shell=read('service-shell.js');
for(const l of langs)need(shell.includes(`['${l}'`),`language switcher missing ${l}`);
need(shell.includes("if(lang==='zh')")&&shell.includes("/zh-i18n.js"),'Chinese runtime patch is not loaded');
need(shell.includes("lang.startsWith('zh')"),'service shell does not normalize zh locale');

const home=read('i18n-stable.js');
for(const l of ['ko','en','ja','tl','vi'])need(home.includes(`${l}:{`),`home translation block missing ${l}`);
const homeKeys=['brand:','hero1:','hero2:','heroCopy:','free:','name:','submit:','privacy:','services:','guardianTitle:','guardianNotice:','archive:','footerLinks:'];
for(const l of ['ko','en','ja','tl','vi']){
  const order=['ko','en','ja','tl','vi']; const i=order.indexOf(l); const next=order[i+1];
  const s=segment(home,`${l}:{`,next?`,\n${next}:{`:'\n};');
  for(const k of homeKeys)need(s.includes(k),`home ${l} missing key ${k}`);
}

const zh=read('zh-i18n.js');
const zhHomeMarkers=['流明命运','免费四柱','查看结果','隐私政策','使用条款','客户支持'];
for(const m of zhHomeMarkers)need(zh.includes(m),`home zh missing translated marker: ${m}`);
const guardianKeys=['orderTitle','orderIntro','orderTier','orderWishType','orderName','orderWish','orderMessage','orderPreviewBtn','orderDisclaimer','orderPreviewTitle','orderConfirm','backArchive','verifyHero','verifyHeroCopy','verifyId','verifyButton','verifyResult','verifyNote','qrTitle','qrCopy'];
for(const k of guardianKeys)need(new RegExp(`${k}\\s*:`).test(zh),`Guardian zh missing key ${k}`);

const compat=read('compatibility-i18n.js');
const compatKeys=['inputTitle','inputDesc','a','b','name','gender','birth','time','calendar','submit','privacy','resultTitle','resultDesc','charts','reading','retry','home'];
const compatOrder=['ko','en','ja','tl','vi','zh'];
for(let i=0;i<compatOrder.length;i++){
  const l=compatOrder[i], next=compatOrder[i+1];
  const s=segment(compat,`${l}:{`,next?`,\n${next}:{`:'}}[l]');
  need(s.length>0,`compatibility translation block missing ${l}`);
  for(const k of compatKeys)need(new RegExp(`(?:^|[,\\n])${k}:`).test(s),`compatibility ${l} missing key ${k}`);
}

const guardian=read('guardian-i18n.js');
const gOrder=['en','ja','tl','vi'];
const gKeys=['giftHero','giftHeroCopy','giftDisclaimer','verifyHero','verifyHeroCopy','verifyId','verifyButton','verifyResult','verifyNote','qrTitle','qrCopy','orderHero','orderHeroCopy','orderTier','orderWishType','orderName','orderWish','orderMessage','orderPreview','orderConfirm','orderBack'];
for(let i=0;i<gOrder.length;i++){
  const l=gOrder[i], next=gOrder[i+1];
  const s=segment(guardian,`${l}:{`,next?`,${next}:{`:'};');
  need(s.length>0,`Guardian translation block missing ${l}`);
  for(const k of gKeys)need(new RegExp(`${k}\\s*:`).test(s),`Guardian ${l} missing key ${k}`);
}

// Korean is the authored HTML baseline; Chinese is supplied by zh-i18n/zh Guardian patches.
const orderHtml=read('guardian-order/index.html');
const verifyHtml=read('guardian-verify/index.html');
for(const k of ['orderTier','orderWishType','orderName','orderWish','orderMessage','orderDisclaimer'])need(orderHtml.includes(`data-i18n=\"${k}\"`),`Guardian order HTML missing i18n hook ${k}`);
for(const k of ['verifyHero','verifyHeroCopy','verifyId','verifyButton','verifyResult','verifyNote','qrTitle','qrCopy'])need(verifyHtml.includes(`data-i18n=\"${k}\"`),`Guardian verify HTML missing i18n hook ${k}`);

for(const f of ['zh-guardian-order.js','zh-guardian-checkout.js','zh-guardian-payment-result.js'])need(fs.existsSync(f),`Chinese Guardian patch missing ${f}`);

if(fail.length){
  console.error(`Language coverage audit FAILED with ${fail.length} issue(s):`);
  for(const x of fail)console.error(`- ${x}`);
  process.exit(1);
}
console.log('Language coverage audit passed: KO / EN / JA / TL / VI / ZH core V1 coverage is present.');
