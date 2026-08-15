import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('functions');
const failures=[];
const files=[];

function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&/\.(?:js|mjs|cjs)$/.test(entry.name))files.push(full);
  }
}
walk(root);

const rules=[
  {name:'server console output',re:/\bconsole\s*\.\s*(?:log|info|warn|error|debug|trace)\s*\(/g},
  {name:'request headers serialized to response/log',re:/JSON\.stringify\s*\(\s*(?:Object\.fromEntries\s*\(\s*)?request\.headers/gi},
  {name:'authorization header copied into response object',re:/(?:json|JSON\.stringify)\s*\([^;\n]{0,300}(?:authorization|x-lumen-internal-secret|x-lumen-adapter-secret)/gi},
  {name:'raw parsed request body returned as JSON',re:/(?:return\s+)?json\s*\(\s*\{[^}]{0,500}\b(?:body|requestBody|payload)\s*[:,]/gis},
  {name:'exception message exposed directly to JSON response',re:/json\s*\([^;\n]{0,300}(?:error\.message|err\.message|e\.message|String\s*\(\s*(?:error|err|e)\s*\))/gi},
  {name:'secret environment value included in JSON response',re:/json\s*\([^;\n]{0,500}env\?*\.[A-Za-z0-9_]*(?:SECRET|API_KEY|TOKEN)/gi}
];

for(const file of files){
  const text=fs.readFileSync(file,'utf8');
  for(const rule of rules){
    rule.re.lastIndex=0;
    for(const match of text.matchAll(rule.re)){
      const before=text.slice(0,match.index);
      const line=before.split('\n').length;
      failures.push(`${path.relative(process.cwd(),file)}:${line} — ${rule.name}`);
    }
  }
}

const publicVerify=fs.readFileSync('functions/api/guardian/verify.js','utf8');
for(const field of ['gift_message','giver_name','recipient_name','verification_token','shipping_phone','shipping_address1','shipping_address2']){
  if(new RegExp(`\\b${field}\\b`,'i').test(publicVerify))failures.push(`functions/api/guardian/verify.js — public verification references private field ${field}`);
}

const privacyMap=fs.readFileSync('functions/api/admin/privacy-record-map.js','utf8');
for(const key of ['gift_message:','giver_name:','recipient_name:','shipping_phone:','shipping_address1:','verification_token:']){
  if(privacyMap.includes(key))failures.push(`functions/api/admin/privacy-record-map.js — response may expose raw private field key ${key}`);
}

console.log(`Sensitive logging static audit scanned ${files.length} server Function source files.`);
if(failures.length){
  console.error(`Sensitive logging static audit FAILED with ${failures.length} issue(s):`);
  for(const failure of failures)console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log('Sensitive logging static audit passed: server Functions contain no console output, direct exception/body/header echo patterns, secret-response patterns, or known private public-verification fields covered by this audit. Deployed Cloudflare log inspection is still required before the operational privacy logging gate can pass.');
