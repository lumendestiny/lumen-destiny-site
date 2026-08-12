CREATE TABLE IF NOT EXISTS guardian_physical_fulfillment (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL UNIQUE,
  guardian_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'selected',
  production_vendor TEXT,
  production_reference TEXT,
  carrier TEXT,
  tracking_number TEXT,
  selected_at TEXT NOT NULL,
  production_started_at TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (story_id) REFERENCES guardian_stories(id),
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);
CREATE INDEX IF NOT EXISTS idx_guardian_physical_status ON guardian_physical_fulfillment(status);
CREATE INDEX IF NOT EXISTS idx_guardian_physical_guardian ON guardian_physical_fulfillment(guardian_id);
