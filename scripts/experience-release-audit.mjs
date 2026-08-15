import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const must=(p,needles)=>{const t=read(p);for(const n of needles){if(!t.includes(n))throw new Error(`${p}: missing ${n}`)}return t};
const exists=p=>{if(!fs.existsSync(p))throw new Error(`missing required V1 file: ${p}`)};

for(const p of ['index.html','result.html','compatibility/index.html','compatibility-result/index.html','compatibility.js','guardian/index.html','guardian-order/index.html','guardian-gift/index.html','guardian-gift-i18n.js','guardian-verify/index.html','privacy.html','terms.html','refund-policy.html','support.html','404.html','sitemap.xml','robots.txt','_headers','_redirects','lumen-api.js','functions/api/consult.js','functions/api/health.js','result-zh-v1.js','result-enhance.js','result-deep.js','wealth-detail.js','transit-reading.js','current-ten-gods.js','ACCESSIBILITY_RELEASE_CHECKLIST.md','GUARDIAN_CUSTOMER_JOURNEY_RELEASE.md','OPERATIONS_BACKUP_RECOVERY.md','MOBILE_HEADER_UI_SPEC.md','V1_SCOPE.md']) exists(p);

for(const p of ['index.html','result.html','compatibility/index.html','compatibility-result/index.html','guardian/index.html','guardian-order/index.html','guardian-gift/index.html','guardian-verify/index.html','privacy.html','terms.html','refund-policy.html','support.html','404.html']) must(p,['<main']);

for(const [p,url] of [['index.html','https://lumendestiny.com/'],['compatibility/index.html','https://lumendestiny.com/compatibility/'],['guardian/index.html','https://lumendestiny.com/guardian/'],['guardian-gift/index.html','https://lumendestiny.com/guardian-gift/']]){
  must(p,['meta name="description"',`rel="canonical" href="${url}"`,'property="og:type"','property="og:site_name"',`property="og:url" content="${url}"`,'property="og:title"','property="og:description"']);
}
for(const p of ['index.html','compatibility/index.html','guardian-gift/index.html']) must(p,['name="twitter:card"','name="twitter:title"','name="twitter:description"']);

must('index.html',['hreflang="ko"','hreflang="en"','hreflang="ja"','hreflang="tl"','hreflang="vi"','hreflang="zh-Hans"','hreflang="x-default"']);
must('compatibility/index.html',['hreflang="ko"','hreflang="en"','hreflang="ja"','hreflang="tl"','hreflang="vi"','hreflang="zh-Hans"','hreflang="x-default"']);

const compatibility=must('compatibility.js',['calculateSaju,lunarToSolar','return calculateSaju(y,m,day,h||0,min||0','lunarToSolar(y,m,day','yearPillar','monthPillar','dayPillar','hourPillar','compatibility_calculation_failed']);
if(/calculateSaju\s*\(\s*\{/.test(compatibility)) throw new Error('compatibility.js: object-form calculateSaju call reintroduced');
if(compatibility.includes("el.textContent=L.error+' '+(e.message||'')")) throw new Error('compatibility.js: raw engine error must not be exposed');
must('compatibility/index.html',['aBirth','bBirth','aCalendar','bCalendar','aLeap','bLeap','lang']);
must('compatibility-result/index.html',['compatibility.js','compatError','compatContent']);

// Core result modules currently use a dedicated zh post-processing layer. Lock both the modules and the Chinese coverage until native zh branches replace it.
for(const p of ['result-enhance.js','result-deep.js','wealth-detail.js','transit-reading.js','current-ten-gods.js']) must('result.html',[p]);
must('result-zh-v1.js',["q.get('lang')","zh-CN","核心摘要","财星位置与财运流向","年运 · 月运 · 日运走势","连接十神与关系的解读","当前天干形成的十神","正财","偏财","今年","本月","今天"]);
must('result.html',['result-zh-v1.js']);

must('guardian-gift/index.html',['data-gift-i18n="hero"','guardian-gift-i18n.js','gift=1']);
must('guardian-gift-i18n.js',["lang==='zh'",'en:{','ja:{','tl:{','vi:{','zh:{','searchParams.set(\'lang\',lang)']);

// V1 product scope lock: consultation source may remain for a future upgrade, but legacy
// AI configuration alone cannot expose the route or backend.
must('functions/api/consult.js',['LUMEN_PUBLIC_CONSULT_ENABLED','feature_not_in_v1']);
must('functions/api/health.js',['publicConsultEnabled','consult:publicConsultEnabled','scope:\'v1-saju-fortune-compatibility-guardian\'']);
must('_redirects',['/consult.html / 302','/consult / 302','/consult/ / 302']);
must('_headers',['/consult/*','X-Robots-Tag: noindex, nofollow, noarchive']);

must('service-shell.js',['aria-pressed','aria-current','skip']);
must('service-shell.css',[':focus-visible','prefers-reduced-motion:reduce','@media(max-width:520px){','.brand-language-stack{flex-direction:row!important']);
must('ACCESSIBILITY_RELEASE_CHECKLIST.md',['320px','360px','390px','430px','200%','prefers-reduced-motion']);
must('MOBILE_HEADER_UI_SPEC.md',['Six language flags','KO / EN / JA / TL / VI / ZH','Do not stack the language bar below the brand']);
must('GUARDIAN_CUSTOMER_JOURNEY_RELEASE.md',['all six supported languages','KO/EN/JA/TL/VI/ZH']);
must('OPERATIONS_BACKUP_RECOVERY.md',['D1 backup','non-production restoration rehearsal','Secret compromise']);
must('support.html',['llumendestiny@gmail.com']);
must('privacy.html',['llumendestiny@gmail.com']);
must('robots.txt',['Disallow: /admin-guardian.html','Disallow: /guardian-e2e-test.html','Disallow: /payment-test.html','Disallow: /api/admin/','Disallow: /consult/']);
must('sitemap.xml',['https://lumendestiny.com/guardian/','https://lumendestiny.com/guardian-gift/','https://lumendestiny.com/compatibility/']);
must('_headers',['/result.html','/compatibility-result/*','/guardian-payment-result.html','X-Robots-Tag: noindex, nofollow, noarchive']);
must('lumen-api.js',['TIMEOUT_MS=15000','request_timeout','network_unavailable','data?.error_code']);
must('V1_SCOPE.md',['Face reading / physiognomy (관상)','1:1 AI consultation','Explicitly excluded from V1']);

const sitemap=read('sitemap.xml');
if(sitemap.includes('/consult')) throw new Error('sitemap must not expose excluded V1 consultation');

console.log('Experience release static audit passed. V1 AI exclusion, SEO/social metadata, compatibility contract, full Chinese fortune-result coverage, public six-language Guardian gifting, private-result indexing and recovery safeguards are locked. Runtime/device evidence is still required before setting Experience Gate flags.');
