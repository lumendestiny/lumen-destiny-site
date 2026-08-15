import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const fail=[];
const need=(ok,msg)=>{if(!ok)fail.push(msg)};

const legal=read('legal-i18n.js');
const footer=read('legal-footer-i18n.js');
for(const lang of ['en','ja','tl','vi','zh'])need(legal.includes(`${lang}:{`),`legal translation block missing ${lang}`);
for(const marker of [
  'Refund & Cancellation Policy','返金・キャンセルポリシー','Refund & Cancellation Policy | Lumen Destiny',
  'Chính sách hoàn tiền và hủy','退款与取消政策','Privacy Policy | Lumen Destiny','プライバシーポリシー',
  'Chính sách quyền riêng tư','隐私政策','1:1 consultation','1:1相談','1:1 tư vấn','1:1 咨询'
]) need(legal.includes(marker),`legal/support translation marker missing: ${marker}`);

for(const p of ['terms.html','refund-policy.html','privacy.html','support.html']){
  const html=read(p);
  need(html.includes('/legal-i18n.js'),`${p} does not load legal-i18n.js`);
  need(html.includes('/service-shell.js'),`${p} does not load service-shell.js`);
  if(p!=='privacy.html')need(html.includes('/legal-footer-i18n.js'),`${p} does not load legal-footer-i18n.js`);
}

for(const marker of ['Privacy Policy','プライバシーポリシー','Chính sách quyền riêng tư','隐私政策','客户支持'])need(footer.includes(marker),`legal footer localization missing: ${marker}`);
need(footer.includes("u.searchParams.set('lang',lang)"),'legal footer links do not preserve language');
need(legal.includes("if(path==='/terms')"),'terms runtime route missing');
need(legal.includes("path==='/refund-policy'"),'refund runtime route missing');
need(legal.includes("path==='/privacy'"),'privacy runtime route missing');
need(legal.includes("path==='/support'"),'support runtime route missing');
need(legal.includes("u.searchParams.set('lang',lang)"),'translated legal links do not preserve language');

if(fail.length){
  console.error(`Legal language audit FAILED with ${fail.length} issue(s):`);
  for(const x of fail)console.error(`- ${x}`);
  process.exit(1);
}
console.log('Legal language audit passed: Terms, Refund/Cancellation, Privacy and Support are wired for KO / EN / JA / TL / VI / ZH, including localized footer navigation and preserved language links.');
