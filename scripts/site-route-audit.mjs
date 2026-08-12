import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const skipDirs=new Set(['.git','node_modules']);
const files=[];
function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if(skipDirs.has(ent.name)) continue;
    const p=path.join(dir,ent.name);
    if(ent.isDirectory()) walk(p); else files.push(path.relative(root,p).replaceAll('\\','/'));
  }
}
walk(root);
const fileSet=new Set(files);
let failed=false;
const errors=[];
const ignorePrefixes=['/api/','/cdn-cgi/','http://','https://','mailto:','tel:','javascript:','data:','#'];
function checkTarget(from,raw){
  if(!raw||ignorePrefixes.some(p=>raw.startsWith(p))) return;
  if(!raw.startsWith('/')) return;
  const clean=raw.split('#')[0].split('?')[0];
  if(clean==='/'||clean==='') return;
  let rel=clean.slice(1);
  const candidates=[rel];
  if(!path.extname(rel)) candidates.push(rel+'.html',rel+'/index.html');
  if(rel.endsWith('/')) candidates.push(rel+'index.html');
  if(!candidates.some(c=>fileSet.has(c))){errors.push(`BROKEN ROUTE: ${from} -> ${raw}`);failed=true;}
}
for(const f of files.filter(f=>f.endsWith('.html')||f.endsWith('.js'))){
  const text=fs.readFileSync(f,'utf8');
  const re=/(?:href|src)\s*=\s*["']([^"']+)["']/g;
  for(const m of text.matchAll(re)) checkTarget(f,m[1]);
  if(f.endsWith('.js')){
    const urlRe=/["'`](\/[A-Za-z0-9_./-]+(?:\.html)?(?:\?[^"'`]*)?)["'`]/g;
    for(const m of text.matchAll(urlRe)) checkTarget(f,m[1]);
  }
}
if(fileSet.has('_redirects')){
  const lines=fs.readFileSync('_redirects','utf8').split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('#'));
  for(const line of lines){
    const [from,to]=line.split(/\s+/);
    if(!from||!to) continue;
    if(!from.includes('.')&&/\.html(?:$|[?#])/.test(to)){
      errors.push(`REDIRECT LOOP RISK: ${from} -> ${to}`);failed=true;
    }
    checkTarget('_redirects',to);
  }
}
for(const required of ['compatibility.html','compatibility-result.html','consult.html','guardian.html','guardian-order.html','guardian-gift.html','guardian-verify.html','guardian-payment-result.html']){
  if(!fileSet.has(required)){errors.push(`MISSING CORE PAGE: ${required}`);failed=true;}
}
if(failed){console.error(errors.join('\n'));process.exit(1)}
console.log(`Site route audit passed. Checked ${files.length} files.`);
