CREATE TABLE IF NOT EXISTS guardian_payment_control (
  control_key TEXT PRIMARY KEY,
  state TEXT NOT NULL CHECK(state IN ('open','hold')),
  note TEXT,
  changed_at TEXT NOT NULL
);

INSERT OR IGNORE INTO guardian_payment_control(control_key,state,note,changed_at)
VALUES('checkout','open','Initial payment control state',CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS guardian_payment_control_audit (
  audit_id TEXT PRIMARY KEY,
  control_key TEXT NOT NULL,
  previous_state TEXT NOT NULL,
  new_state TEXT NOT NULL,
  note TEXT NOT NULL,
  changed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guardian_payment_control_audit_changed
ON guardian_payment_control_audit(changed_at DESC);