CREATE TABLE IF NOT EXISTS guardian_orders (
  id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  price_usd REAL NOT NULL,
  edition_limit INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  wish_type TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  issuance_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  verification_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  issued_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_guardian_orders_created_at ON guardian_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_payment_status ON guardian_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_issuance_status ON guardian_orders(issuance_status);

CREATE TABLE IF NOT EXISTS guardian_editions (
  edition_key TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  edition_limit INTEGER NOT NULL,
  issued_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
