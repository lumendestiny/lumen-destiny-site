CREATE TABLE IF NOT EXISTS guardian_payment_events (
  event_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  guardian_id TEXT,
  payment_reference TEXT,
  amount_usd REAL,
  currency TEXT,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  error_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_guardian_id ON guardian_payment_events(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_received_at ON guardian_payment_events(received_at);

ALTER TABLE guardian_orders ADD COLUMN payment_provider TEXT;
ALTER TABLE guardian_orders ADD COLUMN payment_event_id TEXT;
