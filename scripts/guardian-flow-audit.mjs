import fs from 'node:fs';

const required = [
  ['guardian-order.html', 'guardianPolicyAgree'],
  ['guardian-order.html', 'guardian-checkout.js'],
  ['guardian-order.js', 'createGuardianOrder'],
  ['guardian-order.js', 'recipientName'],
  ['guardian-checkout.js', 'createGuardianCheckout'],
  ['guardian-checkout.js', 'policyAccepted:true'],
  ['functions/api/guardian/orders.js', "'pending','pending'"],
  ['functions/api/payments/webhook.js', "issuance_status='issued'"],
  ['functions/api/guardian/verify.js', "status='verified'"],
  ['guardian-qr.js', '/guardian-verify.html'],
  ['guardian-payment-result.js', 'refund_pending'],
  ['guardian-payment-result.js', 'refunded'],
  ['guardian-gift.html', '/guardian-order.html?gift=1'],
  ['guardian-gallery.js', '/api/guardian/stories-public']
];

let failed = false;
for (const [file, needle] of required) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING FILE: ${file}`);
    failed = true;
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) {
    console.error(`MISSING CONTRACT: ${file} -> ${needle}`);
    failed = true;
  } else {
    console.log(`OK: ${file} -> ${needle}`);
  }
}

if (failed) process.exit(1);
console.log('Guardian flow audit passed.');
