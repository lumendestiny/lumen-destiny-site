ALTER TABLE guardian_orders ADD COLUMN fulfillment_status TEXT NOT NULL DEFAULT 'not_started';
ALTER TABLE guardian_orders ADD COLUMN refund_status TEXT NOT NULL DEFAULT 'none';
ALTER TABLE guardian_orders ADD COLUMN refund_reference TEXT;
ALTER TABLE guardian_orders ADD COLUMN refund_reason TEXT;
ALTER TABLE guardian_orders ADD COLUMN refunded_at TEXT;
ALTER TABLE guardian_orders ADD COLUMN support_status TEXT NOT NULL DEFAULT 'none';

CREATE TABLE IF NOT EXISTS guardian_refund_jobs (
  refund_job_id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL UNIQUE,
  provider TEXT,
  payment_reference TEXT,
  amount_usd REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_refund_id TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_refund_jobs_status ON guardian_refund_jobs(status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_refund_status ON guardian_orders(refund_status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_support_status ON guardian_orders(support_status);
