import fs from 'node:fs';

const mustContain=(file,needles)=>{const text=fs.readFileSync(file,'utf8');for(const n of needles){if(!text.includes(n))throw new Error(`${file}: missing required security guard: ${n}`)}return text};

const runtime=fs.readFileSync('runtime-config.js','utf8');
for(const forbidden of ['LUMEN_INTERNAL_SECRET','LUMEN_PAYMENT_WEBHOOK_SECRET','LUMEN_PAYMENT_ADAPTER_SECRET','OPENAI_API_KEY']){
  if(runtime.includes(forbidden))throw new Error(`runtime-config.js exposes forbidden secret name: ${forbidden}`);
}

mustContain('functions/api/payments/test-complete.js',["LUMEN_PAYMENT_TEST_MODE!=='true'","LUMEN_INTERNAL_SECRET","unauthorized"]);
mustContain('functions/api/payments/test-adapter.js',["LUMEN_PAYMENT_TEST_MODE!=='true'","LUMEN_PAYMENT_ADAPTER_SECRET","unauthorized"]);
mustContain('functions/api/admin/security-gate.js',['LUMEN_INTERNAL_SECRET','unauthorized','SECURITY RELEASE READY']);
mustContain('functions/api/admin/privacy-gate.js',['LUMEN_INTERNAL_SECRET','unauthorized','PRIVACY RELEASE READY','LUMEN_FACE_PHOTO_EPHEMERAL_VERIFIED','LUMEN_DATA_RETENTION_VERIFIED','LUMEN_DELETE_REQUEST_FLOW_VERIFIED','LUMEN_SENSITIVE_LOGGING_VERIFIED']);
mustContain('PRIVACY_RELEASE_CHECKLIST.md',['llumendestiny@gmail.com','Face photo ephemeral','Deletion request flow','Sensitive logging','PRIVACY RELEASE READY']);
mustContain('robots.txt',['Disallow: /admin-guardian.html','Disallow: /guardian-e2e-test.html','Disallow: /payment-test.html','Disallow: /payment-review.html','Disallow: /api/admin/','Disallow: /consult/']);
mustContain('_headers',['X-Frame-Options: DENY','/admin-guardian.html','/guardian-e2e-test.html','/payment-test.html','/payment-review.html','X-Robots-Tag: noindex, nofollow, noarchive']);

const publicFiles=['index.html','result.html','service-shell.js','lumen-api.js','guardian-order-v2.js','guardian-payment-result.js','guardian-verify.js'];
const secretAssignment=/(?:LUMEN_INTERNAL_SECRET|LUMEN_PAYMENT_WEBHOOK_SECRET|LUMEN_PAYMENT_ADAPTER_SECRET|OPENAI_API_KEY)\s*[:=]\s*['"`][^'"`]+/;
for(const file of publicFiles){const text=fs.readFileSync(file,'utf8');if(secretAssignment.test(text))throw new Error(`${file}: possible hard-coded secret detected`)}

console.log('Security/privacy release audit passed: client secrets absent, admin/test guards present, privacy evidence wired, and internal surfaces protected from indexing/framing.');
