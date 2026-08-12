CREATE TABLE IF NOT EXISTS guardian_payment_incidents (
  incident_id TEXT PRIMARY KEY,
  guardian_id TEXT,
  provider TEXT,
  event_id TEXT,
  payment_reference TEXT,
  incident_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  severity TEXT NOT NULL DEFAULT 'high',
  summary TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_status ON guardian_payment_incidents(status, updated_at);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_guardian ON guardian_payment_incidents(guardian_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_event ON guardian_payment_incidents(event_id);
