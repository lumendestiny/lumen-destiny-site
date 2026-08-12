ALTER TABLE guardian_orders ADD COLUMN edition_key TEXT;
ALTER TABLE guardian_orders ADD COLUMN issuance_serial INTEGER;

CREATE TABLE IF NOT EXISTS guardian_edition_slots (
  edition_key TEXT NOT NULL,
  slot_no INTEGER NOT NULL,
  tier TEXT NOT NULL,
  order_id TEXT UNIQUE,
  reserved_at TEXT,
  PRIMARY KEY (edition_key, slot_no)
);

CREATE INDEX IF NOT EXISTS idx_guardian_edition_slots_order_id ON guardian_edition_slots(order_id);
CREATE INDEX IF NOT EXISTS idx_guardian_edition_slots_available ON guardian_edition_slots(edition_key, order_id);
