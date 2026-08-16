-- Lumen Destiny authenticated ownership for Guardian orders.
-- Raw Saju birth data remains excluded from account storage.
ALTER TABLE guardian_orders ADD COLUMN user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_guardian_orders_user_id_created_at ON guardian_orders(user_id, created_at DESC);
