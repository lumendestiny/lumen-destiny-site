ALTER TABLE guardian_checkout_sessions ADD COLUMN failure_code TEXT;
ALTER TABLE guardian_checkout_sessions ADD COLUMN cancelled_at TEXT;
ALTER TABLE guardian_checkout_sessions ADD COLUMN completed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_guardian_checkout_expires ON guardian_checkout_sessions(expires_at);
