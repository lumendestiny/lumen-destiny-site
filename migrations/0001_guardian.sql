CREATE TABLE IF NOT EXISTS guardian_orders (
  id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  price_usd INTEGER NOT NULL,
  edition_limit INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  wish_type TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  issuance_status TEXT NOT NULL DEFAULT 'pending',
  issued_at TEXT,
  created_at TEXT NOT NULL,
  verification_token TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_guardian_orders_created_at ON guardian_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_status ON guardian_orders(issuance_status);
