-- V1 fail-closed normalization for databases that passed through the historical 0015 open default.
-- Safe to apply before PG/KYC/public-checkout approval: it only closes checkout, never opens it.

INSERT OR IGNORE INTO guardian_payment_control_audit(
  audit_id,control_key,previous_state,new_state,note,changed_at
)
SELECT
  'migration-0017-checkout-hold',
  'checkout',
  state,
  'hold',
  'V1 fail-closed normalization before public payment approval',
  CURRENT_TIMESTAMP
FROM guardian_payment_control
WHERE control_key='checkout' AND state='open';

UPDATE guardian_payment_control
SET state='hold',
    note='V1 fail-closed normalization before public payment approval',
    changed_at=CURRENT_TIMESTAMP
WHERE control_key='checkout' AND state='open';

INSERT OR IGNORE INTO guardian_payment_control(control_key,state,note,changed_at)
VALUES(
  'checkout',
  'hold',
  'V1 fail-closed normalization before public payment approval',
  CURRENT_TIMESTAMP
);
