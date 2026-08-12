# Lumen Destiny — Cloudflare AI activation checklist

This file contains only variable names and safe example values. Never commit real secrets to GitHub.

## 1. Required for AI consultation

Add these in Cloudflare Pages → Settings → Environment variables / Secrets for Production (and Preview only if needed):

- `LUMEN_AI_ENABLED` = `true`
- `OPENAI_API_KEY` = **Secret** (real OpenAI API key; never place in GitHub)

Optional tuning variables:

- `OPENAI_MODEL` = `gpt-5-mini`
- `LUMEN_AI_REQUESTS_PER_MINUTE` = `6`
- `LUMEN_AI_MAX_OUTPUT_TOKENS` = `600`

After saving, trigger a new production deployment.

## 2. Verify deployment

Open `/status.html` on the production domain.

Expected AI state:

- Pages Functions: `ONLINE`
- AI consultation: `READY`

If AI consultation is `OFF`, confirm both `LUMEN_AI_ENABLED=true` and the `OPENAI_API_KEY` secret exist in the Production environment, then redeploy.

## 3. Functional smoke test

Open `/consult.html`, enter a short question and submit.

Expected behavior when enabled:

- Question preview appears first.
- AI answer is appended underneath.
- Response language follows the selected site language.
- The response is not stored by the consultation endpoint (`stored:false`).

## 4. Cost and abuse guards already in code

The consultation endpoint currently enforces:

- JSON-only POST requests.
- Question length cap.
- Default per-client limit of 6 requests/minute (configurable).
- Default output cap of 600 tokens (configurable).
- 20-second provider timeout.
- Provider 429 and timeout handling.
- No API key exposure to the browser.
- No consultation DB persistence in the current endpoint.

## 5. Guardian server variables (later activation)

Do not enable these until D1 and payment flow are ready:

- `LUMEN_GUARDIAN_ENABLED=true`
- D1 binding: `GUARDIAN_DB`
- `LUMEN_INTERNAL_SECRET` = Secret
- `LUMEN_PAYMENTS_ENABLED=true`
- `LUMEN_PAYMENT_WEBHOOK_SECRET` = Secret

Keep payment and Guardian secrets separate from the OpenAI key.
