import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=[];
const need=(ok,msg)=>{if(!ok)fail.push(msg)};
const segment=(text,start,end)=>{const a=text.indexOf(start);if(a<0)return'';const from=a+start.length;const b=end?text.indexOf(end,from):-1;return text.slice(from,b<0?text.length:b)};

const langs=['ko','en','ja','tl','vi','zh'];
const smoke=read('scripts/production-smoke.mjs');
for(const l of langs)need(smoke.includes(`'${l}'`),`production smoke missing language ${l}`);

const shell=read('service-shell.js');
for(const l of langs)need(shell.includes(`['${l}'`),`language switcher missing ${l}`);
need(shell.includes("lang==='zh'")&&shell.includes("/zh-i18n.js"),'Chinese runtime patch is not loaded');
need(shell.includes("lang.startsWith('zh')"),'service shell does not normalize zh locale');
need(shell.includes("/guardian-i18n.js"),'Guardian common i18n runtime is not loaded');
need(shell.includes("guardian-order-policy-i18n.js"),'Guardian checkout policy i18n helper is not loaded');
need(shell.includes("/recovery-ui.js"),'shared recovery UI is not loaded');

const recovery=read('recovery-ui.js');
for(const marker of ['인터넷 연결이 끊겼습니다','You are offline','インターネット接続が切れています','Walang internet connection','Mất kết nối Internet','互联网连接已断开'])need(recovery.includes(marker),`recovery UI missing translated marker: ${marker}`);
need(recovery.includes("zh:{offlineT:'互联网连接已断开'"),'recovery UI Chinese translation block missing');

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

const compat=read('compatibility-i18n.js');
const compatKeys=['inputTitle','inputDesc','a','b','name','gender','birth','time','calendar','submit','privacy','resultTitle','resultDesc','charts','reading','retry','home'];
const compatOrder=['ko','en','ja','tl','vi','zh'];
for(let i=0;i<compatOrder.length;i++){
  const l=compatOrder[i], next=compatOrder[i+1];
  const s=segment(compat,`${l}:{`,next?`,\n${next}:{`:'}}[l]');
  need(s.length>0,`compatibility translation block missing ${l}`);
  for(const k of compatKeys)need(new RegExp(`(?:^|[,\\n])\\s*${k}:`).test(s),`compatibility ${l} missing key ${k}`);
}

const guardian=read('guardian-i18n.js');
const gOrder=['en','ja','tl','vi','zh'];
const gKeys=[
  'orderTitle','orderIntro','orderTier','orderWishType','orderName','orderWish','orderMessage','orderPreviewBtn','orderDisclaimer','orderConfirm','backArchive',
  'storyHero','storyHeroCopy','storyId','storyType','storyName','storyText','storySubmit','storyPrivacy',
  'trackHero','trackHeroCopy','trackStoryId','trackButton','trackPrivacy',
  'verifyHero','verifyHeroCopy','verifyId','verifyButton','verifyResult','verifyNote','qrTitle','qrCopy',
  'archiveTitle','archiveCopy','archiveOrder','archivePick','archivePickCopy','examTitle','examCopy','careerTitle','careerCopy','promotionTitle','promotionCopy','wealthCopy','storyCardTitle','storyCardCopy',
  'previewHelp','policy','storyTypes','storyNamePH','storyTextPH','wishPH','messagePH','giverPH','recipientPH'
];
for(let i=0;i<gOrder.length;i++){
  const l=gOrder[i], next=gOrder[i+1];
  const s=segment(guardian,`${l}:{`,next?`,\n${next}:{`:'}}[lang]');
  need(s.length>0,`Guardian translation block missing ${l}`);
  for(const k of gKeys)need(new RegExp(`${k}\\s*:`).test(s),`Guardian ${l} missing key ${k}`);
}
need(guardian.includes("location.pathname.replace(/\\/$/,'')==='/guardian'"),'Guardian archive runtime translation is not wired');
need(guardian.includes("document.getElementById('guardianOrderForm')"),'Guardian order runtime translation is not wired');
need(guardian.includes("document.getElementById('storyForm')"),'Guardian story runtime translation is not wired');

const orderHtml=read('guardian-order/index.html');
const storyHtml=read('guardian-story/index.html');
const physicalHtml=read('guardian-physical-status/index.html');
const verifyHtml=read('guardian-verify/index.html');
for(const k of ['orderTier','orderWishType','orderName','orderWish','orderMessage','orderDisclaimer'])need(orderHtml.includes(`data-i18n=\"${k}\"`),`Guardian order HTML missing i18n hook ${k}`);
for(const k of ['storyHero','storyHeroCopy','storyId','storyType','storyName','storyText','storySubmit'])need(storyHtml.includes(`data-i18n=\"${k}\"`),`Guardian story HTML missing i18n hook ${k}`);
for(const k of ['trackHero','trackHeroCopy','storyId','trackStoryId','trackButton'])need(physicalHtml.includes(`data-i18n=\"${k}\"`),`Guardian physical status HTML missing i18n hook ${k}`);
for(const k of ['verifyHero','verifyHeroCopy','verifyId','verifyButton','verifyResult','verifyNote','qrTitle','qrCopy'])need(verifyHtml.includes(`data-i18n=\"${k}\"`),`Guardian verify HTML missing i18n hook ${k}`);

const policyI18n=read('guardian-order-policy-i18n.js');
for(const marker of ['Refund & cancellation policy','返金・キャンセルポリシー','Patakaran sa refund at cancellation','Chính sách hoàn tiền và hủy','退款与取消政策'])need(policyI18n.includes(marker),`Guardian policy localization missing marker: ${marker}`);
need(policyI18n.includes("window.addEventListener('load',apply"),'Guardian policy localization is not load-order safe');

const checkoutUi=read('guardian-checkout.js');
need(checkoutUi.includes("zh:{pay:'继续付款'"),'Guardian checkout Chinese block missing');
need(checkoutUi.includes("refundPolicy:'退款与取消政策'")&&checkoutUi.includes("terms:'使用条款'"),'Guardian checkout Chinese policy labels missing');
need((checkoutUi.match(/if\(agree&&!agree\.checked\)/g)||[]).length>=2,'Guardian checkout does not re-check consent before final checkout');

for(const f of ['zh-guardian-order.js','zh-guardian-checkout.js','zh-guardian-payment-result.js'])need(fs.existsSync(f),`Chinese Guardian patch missing ${f}`);
const zhPayment=read('zh-guardian-payment-result.js');
need(zhPayment.includes('if(!s)continue')&&!zhPayment.includes('if(!s)return'),'Chinese payment-result translation traversal can abort early');
need(zhPayment.includes('Guardian 正式验证'),'Chinese payment-result primary action translation missing');

if(fail.length){
  console.error(`Language coverage audit FAILED with ${fail.length} issue(s):`);
  for(const x of fail)console.error(`- ${x}`);
  process.exit(1);
}
console.log('Language coverage audit passed: KO / EN / JA / TL / VI / ZH core V1, shared recovery UI, Guardian checkout policy localization, and Chinese payment-result recovery coverage are present.');
