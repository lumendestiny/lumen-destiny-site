import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const EXT=new Set(['.html','.js','.mjs']);
const SKIP_DIR=new Set(['.git','node_modules','.wrangler']);
const ALLOW_FILES=[/admin-.*\.html$/, /admin-.*\.js$/, /privacy\.html$/, /terms\.html$/, /refund-policy\.html$/, /payment-review\.html$/, /guardian-e2e-test\.html$/];
const HANGUL=/[가-힣]/;
const I18N_HINT=/(translations|messages|locale|locales|i18n|LANG|ko\s*:|['"]ko['"]\s*:|data-i18n|t\()/i;

function walk(dir,out=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(SKIP_DIR.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p,out);else if(EXT.has(path.extname(ent.name)))out.push(p)}return out}
function rel(p){return path.relative(ROOT,p).replaceAll('\\','/')}
function allowed(file,line){if(ALLOW_FILES.some(r=>r.test(file)))return true;if(I18N_HINT.test(line))return true;if(/<html[^>]+lang=["']ko["']/i.test(line))return true;return false}

const hits=[];
for(const file of walk(ROOT)){
  const r=rel(file);
  if(r.startsWith('functions/api/admin/'))continue;
  const lines=fs.readFileSync(file,'utf8').split(/\r?\n/);
  lines.forEach((line,i)=>{if(HANGUL.test(line)&&!allowed(r,line))hits.push({file:r,line:i+1,text:line.trim().slice(0,220)})});
}

console.log(`i18n hardcoded-Korean audit: ${hits.length} candidate(s)`);
for(const h of hits.slice(0,200))console.log(`${h.file}:${h.line} ${h.text}`);
if(hits.length){
  console.error('\nFAIL: user-facing Korean text may bypass the translation layer. Move strings into the shared i18n dictionary or explicitly allow a Korean-only internal/legal page.');
  process.exit(1);
}
console.log('PASS: no unexpected hardcoded Korean candidates found.');
