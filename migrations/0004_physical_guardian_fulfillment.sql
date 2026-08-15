-- shipping_status is introduced by 0004_guardian_physical_shipping.sql.
-- Do not add it again here: a clean lexical replay applies the guardian shipping migration first.
ALTER TABLE guardian_stories ADD COLUMN physical_card_serial TEXT;
ALTER TABLE guardian_stories ADD COLUMN production_status TEXT NOT NULL DEFAULT 'not_started';
ALTER TABLE guardian_stories ADD COLUMN shipped_at TEXT;
ALTER TABLE guardian_stories ADD COLUMN delivered_at TEXT;
CREATE INDEX IF NOT EXISTS idx_guardian_stories_physical_status ON guardian_stories(physical_gift_status,production_status,shipping_status);
