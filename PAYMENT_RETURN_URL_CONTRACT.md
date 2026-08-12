# Lumen Guardian — Payment Return URL Contract

Updated: 2026-08-12

## Canonical customer return page
All supported payment providers should return the browser to:

`https://lumendestiny.com/guardian-payment-result.html?id={GUARDIAN_ID}&lang={LANG}`

Allowed `LANG`: `ko`, `en`, `ja`, `tl`, `vi`.

The same result page may be used for provider success, cancel, failure or generic return URLs because the browser return is never authoritative. The page re-queries Lumen's public verification/status API and renders the server-verified state.

## Security rules
- Never place API secrets, webhook secrets, raw card data, access tokens, KYC data, private wish text or payer personal data in a return URL.
- Guardian ID is the only customer/order reference intended for the browser URL.
- Ignore a provider-supplied `status=success` as proof of payment.
- Never issue a Guardian from the return page.
- Issuance requires a verified provider webhook/status plus server-side amount, currency, order and inventory checks.
- Return URLs must be HTTPS and use the production origin allowlist.

## Language preservation
The checkout request should send the language selected at order time. Provider adapters should construct the return URL using that server-validated language, falling back to `ko` if invalid or missing.

The result page should also store/apply the valid `lang` value so common navigation and all payment-state copy stay in the same language.

## Provider mapping
When an approved provider supports separate URLs, map as follows:
- success/complete URL → canonical result page
- cancel URL → canonical result page
- failure URL → canonical result page
- generic return URL → canonical result page

Do not encode a final Lumen payment state in those URLs. The verified server state determines what the customer sees.

## Required sandbox tests
1. Success return before webhook arrives → shows pending, later issued after verified webhook.
2. Success return after webhook → issued immediately.
3. User cancels → no issuance; safe status/retry guidance.
4. Provider reports failure → no issuance.
5. Browser manually changes any `status` query parameter → no effect on issuance.
6. Invalid/missing Guardian ID → no payment claim; support guidance.
7. `lang=ko/en/ja/tl/vi` preserved through checkout and return.
8. Paid-but-sold-out race → refund-pending/refunded state, never over-issuance.
