import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const checks = [];
const add = (name, ok, detail='') => checks.push({name, ok, detail});

const checkout = read('functions/api/payments/checkout.js');
const paymentControl = read('functions/api/admin/payment-control.js');
const health = read('functions/api/health.js');
const webhook = read('functions/api/payments/webhook.js');
const refunds = read('functions/api/payments/refunds.js');
const testComplete = read('functions/api/payments/test-complete.js');
const paymentResult = read('guardian-payment-result.js');
const checkoutUi = read('guardian-checkout.js');
const zhPaymentResult = read('zh-guardian-payment-result.js');
const refundPolicy = read('refund-policy.html');

add('public checkout has explicit final arm', checkout.includes('LUMEN_PAYMENT_PUBLIC_CHECKOUT_ENABLED') && checkout.includes('payment_public_checkout_not_enabled'));
add('public checkout requires PG evidence', ['LUMEN_PG_APPROVED','LUMEN_PG_KYC_COMPLETE','LUMEN_PG_SANDBOX_VERIFIED','LUMEN_PG_PRODUCTION_READY','payment_pg_release_not_approved'].every(x=>checkout.includes(x)));
add('production checkout blocks test mode', checkout.includes('payment_test_mode_active') && checkout.includes('productionHost'));
add('checkout DB control requires explicit open', checkout.includes("if(!control)return{hold:true,reason:'payment_control_missing'}") && checkout.includes("if(control.state!=='open')") && checkout.includes("payment_control_invalid"));
add('checkout DB control read failure is hold', checkout.includes("catch{return{hold:true,reason:'incident_state_unavailable'}}"));
add('admin payment control defaults missing row to hold', paymentControl.includes("state:'hold',note:'Missing control row is treated as fail-closed HOLD'") && paymentControl.includes("state(env)||{state:'hold'}"));
add('health separates backend and public payment readiness', health.includes('paymentsBackendEnabled') && health.includes('paymentPublicCheckoutEnabled') && health.includes('pgEvidenceReady') && health.includes('publicPaymentsEnabled'));
add('browser checkout rechecks consent at final action', (checkoutUi.match(/if\(agree&&!agree\.checked\)/g)||[]).length >= 2 && checkoutUi.includes('policyAccepted:true'));
add('checkout policy links preserve language', checkoutUi.includes('/refund-policy.html?lang=${encodeURIComponent(lang)}') && checkoutUi.includes('/terms.html?lang=${encodeURIComponent(lang)}'));
add('Chinese checkout copy exists', checkoutUi.includes("zh:{pay:'继续付款'") && checkoutUi.includes("refundPolicy:'退款与取消政策'") && checkoutUi.includes("terms:'使用条款'"));
add('Chinese payment result traversal does not abort on blank text nodes', zhPaymentResult.includes('if(!s)continue') && !zhPaymentResult.includes('if(!s)return'));
add('Chinese payment result has primary action translations', zhPaymentResult.includes('当前状态再次确认') || (zhPaymentResult.includes('当前状态再') && zhPaymentResult.includes('Guardian 正式验证')) || zhPaymentResult.includes('Guardian 正式验证'));
add('cancel webhook handled', webhook.includes("payment.cancelled") && webhook.includes("payment_status"));
add('failed payment handled', webhook.includes("payment.failed") && webhook.includes("checkout.expired"));
add('refund success handled', webhook.includes("payment.refunded") && webhook.includes("refund_status='refunded'"));
add('refund failure handled', webhook.includes("payment.refund_failed") && webhook.includes("support_status='review'"));
add('refund job idempotency', refunds.includes("job.status==='completed'") && refunds.includes("idempotent:true"));
add('refund adapter requires https', refunds.includes("/^https:\\/\\//i.test(url)"));
add('refund adapter secret required', refunds.includes('LUMEN_PAYMENT_ADAPTER_SECRET'));
add('test endpoint supports refund completion', testComplete.includes("refunded:'payment.refunded'"));
add('test endpoint supports refund failure', testComplete.includes("refund_failed:'payment.refund_failed'"));
add('customer UI shows refunded state', paymentResult.includes("kind==='refunded'"));
add('customer UI warns against repaying', paymentResult.includes('noRepay') && paymentResult.includes('keepId'));
add('public cancellation policy exists', refundPolicy.includes('결제 전 취소') && refundPolicy.includes('환불 처리 상태'));
add('browser success alone does not issue', refundPolicy.includes('Webhook') && refundPolicy.includes('서버 확인'));
add('limited stock refund policy exists', refundPolicy.includes('마지막 한정 수량') && refundPolicy.includes('환불'));

const failed = checks.filter(c => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} payment-flow checks passed.`);
if (failed.length) process.exit(1);
