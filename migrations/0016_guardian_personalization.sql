ALTER TABLE guardian_orders ADD COLUMN guardian_element TEXT;
ALTER TABLE guardian_orders ADD COLUMN guardian_design_key TEXT;
ALTER TABLE guardian_orders ADD COLUMN personalization_source TEXT;

CREATE INDEX IF NOT EXISTS idx_guardian_orders_element ON guardian_orders(guardian_element);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_design_key ON guardian_orders(guardian_design_key);
