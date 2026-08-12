-- Guardian payment-reference integrity hardening
-- Provider namespaces are intentionally separate: the same opaque reference may exist at two PGs.

CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_provider_reference
ON guardian_payment_events(provider, payment_reference);

-- Only one successfully processed payment.succeeded event may own a provider payment reference.
-- Historical rejected/ignored/failed events remain available for audit without blocking legitimate processing.
CREATE UNIQUE INDEX IF NOT EXISTS uq_guardian_payment_success_provider_reference
ON guardian_payment_events(provider, payment_reference)
WHERE event_type='payment.succeeded'
  AND status='processed'
  AND payment_reference IS NOT NULL
  AND payment_reference<>'';

CREATE INDEX IF NOT EXISTS idx_guardian_orders_provider_reference
ON guardian_orders(payment_provider, payment_reference);
