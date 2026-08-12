import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const officialRel='assets/flags/kr-official-locked-v1.svg';
const officialPath=path.join(root,...officialRel.split('/'));
const forbiddenPaths=[
  path.join(root,'flags-fix.css'),
  path.join(root,'assets','flags','ko.svg'),
  path.join(root,'assets','flags','kr.svg'),
  path.join(root,'assets','flags','korea.svg'),
  path.join(root,'assets','flags','kr-official.svg')
];
const expected=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="-72 -48 144 96"><path fill="#fff" d="M-72-48v96H72v-96z"/><g stroke="#000" stroke-width="4"><path transform="rotate(33.69006752598)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/><path transform="rotate(-33.69006752598)" d="M-50-12v24m6 0V1m0-2v-11m6 0v24m76 0V1m0-2v-11m6 0v24m6 0V1m0-2v-11"/></g><g transform="rotate(33.69006752598)"><path fill="#cd2e3a" d="M12 0a18 18 0 11-36 0 24 24 0 1148 0"/><path fill="#0047a0" d="M0 0a12 12 0 1124 0 24 24 0 11-48 0 12 12 0 1024 0"/></g></svg>`;

const errors=[];
if(!fs.existsSync(officialPath)) errors.push(`Missing locked South Korea flag asset: ${officialRel}`);
else if(fs.readFileSync(officialPath,'utf8').trim()!==expected.trim()) errors.push(`Locked South Korea flag asset was modified: ${officialRel}`);
for(const p of forbiddenPaths){if(fs.existsSync(p)) errors.push(`Forbidden legacy flag asset/code exists: ${path.relative(root,p)}`)}

const textExt=new Set(['.js','.mjs','.css','.html','.json','.md','.txt','.yml','.yaml']);
const skipDirs=new Set(['.git','node_modules']);
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skipDirs.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(textExt.has(path.extname(ent.name))){const rel=path.relative(root,p).replaceAll('\\','/');if(rel==='scripts/flag-integrity-audit.mjs')continue;const t=fs.readFileSync(p,'utf8');if(/assets\/flags\/(ko|kr|korea|kr-official)\.svg/.test(t))errors.push(`Legacy Korean flag reference found in ${rel}`);if(t.includes('flags-fix.css'))errors.push(`Legacy flag CSS reference found in ${rel}`);if(/\.lang-choice\[data-lang=["']ko["']\][^{]*\{[^}]*background(?:-image)?\s*:/s.test(t))errors.push(`CSS-drawn Korean flag is forbidden in ${rel}; use locked asset only.`);if(/setTimeout\s*\([^)]*(?:10000|10_000)/s.test(t)&&/flag|lang-choice|data-lang|kr-official|taegeuk/i.test(t))errors.push(`Suspicious delayed flag mutation found in ${rel}`);if(/setInterval\s*\(/.test(t)&&/flag|lang-choice|data-lang|kr-official|taegeuk/i.test(t))errors.push(`Suspicious recurring flag mutation found in ${rel}`)}}}
walk(root);

const shell=fs.readFileSync(path.join(root,'service-shell.js'),'utf8');
if(!shell.includes('/assets/flags/kr-official-locked-v1.svg'))errors.push('service-shell.js must reference the locked Korean flag asset.');
if(shell.includes('/assets/flags/kr-official.svg'))errors.push('service-shell.js still references the retired Korean flag path.');
const lock=fs.readFileSync(path.join(root,'flag-runtime-lock.js'),'utf8');
if(!lock.includes('/assets/flags/kr-official-locked-v1.svg'))errors.push('flag-runtime-lock.js must enforce the locked Korean flag asset.');
if(errors.length){console.error('\nFLAG INTEGRITY AUDIT FAILED\n'+errors.map(e=>' - '+e).join('\n'));process.exit(1)}
console.log('FLAG INTEGRITY AUDIT PASSED: Korean flag is locked, legacy variants are blocked, and delayed mutation patterns are rejected.');
