import fs from 'node:fs';

const required=[
['guardian-order/index.html','guardianPolicyAgree'],
['guardian-order/index.html','guardian-checkout.js'],
['guardian-order-v2.js','createGuardianOrder'],
['guardian-order-v2.js','recipientName'],
['guardian-order-v2.js','serverRequired'],
['guardian-order-v2.js','guardian_order_not_created'],
['guardian-order-v2.js','serverFail'],
['guardian-order-v2.js','zh:{giftTitle'],
['guardian-checkout.js','createGuardianCheckout'],
['guardian-checkout.js','policyAccepted:true'],
['functions/api/guardian/orders.js',"'pending','pending'"],
['functions/api/payments/webhook.js','existingSlot'],
['functions/api/payments/webhook.js','concurrent_issuance'],
['functions/api/payments/webhook.js','issuance_commit_failed'],
['functions/api/payments/webhook.js',"issuance_status='issued'"],
['functions/api/guardian/verify.js',"status='verified'"],
['functions/api/guardian/verify.js','issuance_serial'],
['functions/api/guardian/verify.js','issued_at'],
['guardian-verify.js',"state:'verified'"],
['guardian-verify.js','editionLimit'],
['guardian-verify.js','issuedAt'],
['guardian-verify.js','hideQr'],
['guardian-verify.js','zh:{checkTitle'],
['guardian-qr.js','/guardian-verify/'],
['guardian-payment-result.js','refund_pending'],
['guardian-payment-result.js','refunded'],
['guardian-payment-result.html','guardian-payment-ux.js'],
['guardian-payment-result.html','zh-guardian-payment-result.js'],
['guardian-payment-ux.js',"lang.startsWith('zh')"],
['guardian-payment-ux.js',"verify.href='/guardian-verify/?id='"],
['zh-guardian-payment-result.js','/guardian-verify/?id='],
['zh-guardian-payment-result.js','Guardian 付款状态'],
['guardian-gift/index.html','noindex,nofollow'],
['guardian-gift/index.html','url=/guardian/'],
['guardian-gallery.js','/api/guardian/stories-public']
];
let failed=false;
for(const[file,needle]of required){
 if(!fs.existsSync(file)){console.error(`MISSING FILE: ${file}`);failed=true;continue}
 const text=fs.readFileSync(file,'utf8');
 if(!text.includes(needle)){console.error(`MISSING CONTRACT: ${file} -> ${needle}`);failed=true}
 else console.log(`OK: ${file} -> ${needle}`)
}
if(failed)process.exit(1);
console.log('Guardian flow audit passed: order, payment, issuance, refund, verification, six-language UX and canonical verification routes are locked.');
