ALTER TABLE guardian_orders ADD COLUMN policy_version TEXT;
ALTER TABLE guardian_orders ADD COLUMN policy_accepted_at TEXT;
ALTER TABLE guardian_orders ADD COLUMN policy_lang TEXT;
ALTER TABLE guardian_checkout_sessions ADD COLUMN policy_version TEXT;
ALTER TABLE guardian_checkout_sessions ADD COLUMN policy_accepted_at TEXT;
