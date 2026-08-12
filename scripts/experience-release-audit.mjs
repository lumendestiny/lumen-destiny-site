import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const must=(p,needles)=>{const t=read(p);for(const n of needles){if(!t.includes(n))throw new Error(`${p}: missing ${n}`)}return t};
const exists=p=>{if(!fs.existsSync(p))throw new Error(`missing required V1 file: ${p}`)};

for(const p of ['index.html','result.html','compatibility/index.html','compatibility-result/index.html','guardian/index.html','guardian-order/index.html','guardian-gift/index.html','guardian-verify/index.html','privacy.html','terms.html','refund-policy.html','support.html','404.html','sitemap.xml','robots.txt','ACCESSIBILITY_RELEASE_CHECKLIST.md','GUARDIAN_CUSTOMER_JOURNEY_RELEASE.md','OPERATIONS_BACKUP_RECOVERY.md','MOBILE_HEADER_UI_SPEC.md']) exists(p);

for(const p of ['index.html','result.html','compatibility/index.html','compatibility-result/index.html','guardian/index.html','guardian-order/index.html','guardian-gift/index.html','guardian-verify/index.html','privacy.html','terms.html','refund-policy.html','support.html','404.html']){
  must(p,['<main']);
}

must('service-shell.js',['aria-pressed','aria-current','skip']);
must('service-shell.css',[':focus-visible','prefers-reduced-motion:reduce','@media(max-width:520px){','.brand-language-stack{flex-direction:row!important']);
must('ACCESSIBILITY_RELEASE_CHECKLIST.md',['320px','360px','390px','430px','200%','prefers-reduced-motion']);
must('MOBILE_HEADER_UI_SPEC.md',['Six language flags','KO / EN / JA / TL / VI / ZH','Do not stack the language bar below the brand']);
must('GUARDIAN_CUSTOMER_JOURNEY_RELEASE.md',['all six supported languages','KO/EN/JA/TL/VI/ZH']);
must('OPERATIONS_BACKUP_RECOVERY.md',['D1 backup','non-production restoration rehearsal','Secret compromise']);
must('support.html',['llumendestiny@gmail.com']);
must('privacy.html',['llumendestiny@gmail.com']);
must('robots.txt',['Disallow: /admin-guardian.html','Disallow: /guardian-e2e-test.html','Disallow: /payment-test.html','Disallow: /api/admin/']);
must('sitemap.xml',['https://lumendestiny.com/guardian/','https://lumendestiny.com/compatibility/']);

const sitemap=read('sitemap.xml');
if(sitemap.includes('/consult')) throw new Error('sitemap must not expose paused consultation');

console.log('Experience release static audit passed. Runtime/device evidence is still required before setting Experience Gate flags.');
