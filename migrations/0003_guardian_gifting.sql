ALTER TABLE guardian_orders ADD COLUMN is_gift INTEGER NOT NULL DEFAULT 0;
ALTER TABLE guardian_orders ADD COLUMN giver_name TEXT;
ALTER TABLE guardian_orders ADD COLUMN recipient_name TEXT;
ALTER TABLE guardian_orders ADD COLUMN gift_message TEXT;
ALTER TABLE guardian_orders ADD COLUMN campaign_id TEXT;
ALTER TABLE guardian_orders ADD COLUMN target_date TEXT;
CREATE INDEX IF NOT EXISTS idx_guardian_orders_campaign ON guardian_orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_gift ON guardian_orders(is_gift);
