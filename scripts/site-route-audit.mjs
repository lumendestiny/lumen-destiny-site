import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skipDirs=new Set(['.git','node_modules']);
const files=[];
const dirs=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skipDirs.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory()){dirs.push(path.relative(root,p).replaceAll('\\','/'));walk(p)}else files.push(path.relative(root,p).replaceAll('\\','/'))}}
walk(root);
const fileSet=new Set(files),dirSet=new Set(dirs);let failed=false;const errors=[];const ignorePrefixes=['/api/','/cdn-cgi/','http://','https://','mailto:','tel:','javascript:','data:','#'];
function checkTarget(from,raw){
  if(!raw||ignorePrefixes.some(p=>raw.startsWith(p)))return;
  if(!raw.startsWith('/'))return;
  const clean=raw.split('#')[0].split('?')[0];
  if(clean==='/'||clean==='')return;
  const rel=clean.slice(1);
  const candidates=[rel];
  if(rel.endsWith('/')){
    // A JS asset-base string such as /assets/guardian/sales/ is valid when the directory exists,
    // even if it is not itself an HTML route.
    if(dirSet.has(rel.slice(0,-1)))return;
    candidates.push(rel+'index.html');
  }else if(rel.endsWith('.html')){
    const canonical=rel.slice(0,-5);
    candidates.push(canonical+'/index.html');
  }else if(!path.extname(rel)){
    candidates.push(rel+'/index.html',rel+'.html');
  }
  if(!candidates.some(c=>fileSet.has(c))){errors.push(`BROKEN ROUTE: ${from} -> ${raw}`);failed=true}
}
for(const f of files.filter(f=>f.endsWith('.html')||f.endsWith('.js'))){
  const text=fs.readFileSync(f,'utf8');
  const re=/(?:href|src)\s*=\s*["']([^"']+)["']/g;
  for(const m of text.matchAll(re))checkTarget(f,m[1]);
  if(f.endsWith('.js')){
    const urlRe=/["'`](\/[A-Za-z0-9_./-]+(?:\.html)?(?:\?[^"'`]*)?)["'`]/g;
    for(const m of text.matchAll(urlRe))checkTarget(f,m[1]);
  }
}
if(fileSet.has('_redirects')){
  const lines=fs.readFileSync('_redirects','utf8').split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('#'));
  for(const line of lines){
    const[from,to,statusRaw]=line.split(/\s+/);
    if(!from||!to)continue;
    const status=Number(statusRaw||301);
    if(status!==200&&!from.includes('.')&&/\.html(?:$|[?#])/.test(to)){errors.push(`REDIRECT LOOP RISK: ${from} -> ${to} ${status}`);failed=true}
    checkTarget('_redirects',to);
  }
}
for(const required of ['compatibility/index.html','compatibility-result/index.html','guardian/index.html','guardian-order/index.html','guardian-gift/index.html','guardian-campaigns/index.html','guardian-gallery/index.html','guardian-physical-status/index.html','guardian-verify/index.html','guardian-story/index.html']){
  if(!fileSet.has(required)){errors.push(`MISSING CORE V1 PAGE: ${required}`);failed=true}
}
// Consultation may remain in source for a future upgrade, but it is explicitly outside V1 and must not become a required route.
if(fileSet.has('sitemap.xml')&&fs.readFileSync('sitemap.xml','utf8').includes('/consult')){errors.push('V1 SCOPE LEAK: consultation route present in sitemap');failed=true}
if(failed){console.error(errors.join('\n'));process.exit(1)}
console.log(`Site route audit passed. Checked ${files.length} files against V1 scope.`);
