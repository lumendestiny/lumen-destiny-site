import fs from 'node:fs';

const fail=[];
const read=p=>fs.readFileSync(p,'utf8');
const publicPages=[
  ['index.html','https://lumendestiny.com/'],
  ['compatibility/index.html','https://lumendestiny.com/compatibility/'],
  ['guardian/index.html','https://lumendestiny.com/guardian/'],
  ['guardian-gift/index.html','https://lumendestiny.com/guardian-gift/']
];

function need(file,text,re,label){if(!re.test(text))fail.push(`${file}: missing ${label}`)}
for(const [file,canonical] of publicPages){
  const t=read(file);
  need(file,t,/<title>[^<]{3,}<\/title>/i,'title');
  need(file,t,/<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/i,'meta description');
  need(file,t,new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`,'i'),'canonical');
  need(file,t,/<meta\s+property=["']og:title["']/i,'og:title');
  need(file,t,/<meta\s+property=["']og:description["']/i,'og:description');
  need(file,t,/<meta\s+property=["']og:url["']/i,'og:url');
}

// Home and compatibility are language-indexed landing pages and must expose all launch alternates.
for(const file of ['index.html','compatibility/index.html']){
  const t=read(file);
  for(const lang of ['ko','en','ja','tl','vi'])need(file,t,new RegExp(`hreflang=["']${lang}["']`,'i'),`hreflang ${lang}`);
  need(file,t,/hreflang=["']zh-Hans["']/i,'hreflang zh-Hans');
  need(file,t,/hreflang=["']x-default["']/i,'hreflang x-default');
  need(file,t,/<meta\s+name=["']twitter:card["']/i,'twitter:card');
  need(file,t,/<meta\s+name=["']twitter:title["']/i,'twitter:title');
  need(file,t,/<meta\s+name=["']twitter:description["']/i,'twitter:description');
}

// Guardian gifting is a public V1 discovery page. Keep social metadata and client-side six-language coverage present.
{
  const file='guardian-gift/index.html';
  const t=read(file);
  need(file,t,/<meta\s+name=["']robots["']\s+content=["']index,follow["']/i,'public robots');
  need(file,t,/<meta\s+name=["']twitter:card["']/i,'twitter:card');
  need(file,t,/guardian-gift-i18n\.js/i,'gift localization');
}

const robots=read('robots.txt');
need('robots.txt',robots,/Sitemap:\s*https:\/\/lumendestiny\.com\/sitemap\.xml/i,'sitemap declaration');
for(const p of ['/api/admin/','/consult/'])need('robots.txt',robots,new RegExp(`Disallow:\\s*${p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`,'i'),`Disallow ${p}`);

const sitemap=read('sitemap.xml');
for(const url of ['https://lumendestiny.com/','https://lumendestiny.com/compatibility/','https://lumendestiny.com/guardian/','https://lumendestiny.com/guardian-gift/'])need('sitemap.xml',sitemap,new RegExp(`<loc>${url.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</loc>`,'i'),`public URL ${url}`);
for(const forbidden of ['admin-guardian','guardian-e2e-test','payment-test','payment-review','/api/admin/','/consult/']){
  if(sitemap.includes(forbidden))fail.push(`sitemap.xml: private/test route leaked: ${forbidden}`);
}

if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('SEO release audit passed: canonical/OG/Twitter/hreflang, public Guardian gifting, robots and sitemap discovery boundaries are locked.');
