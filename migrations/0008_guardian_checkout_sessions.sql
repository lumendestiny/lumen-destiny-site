CREATE TABLE IF NOT EXISTS guardian_checkout_sessions (
  checkout_id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created',
  provider_session_id TEXT,
  checkout_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT,
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_checkout_guardian ON guardian_checkout_sessions(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_status ON guardian_checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_created ON guardian_checkout_sessions(created_at);
