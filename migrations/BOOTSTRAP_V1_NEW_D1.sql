PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS guardian_orders (
  id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  price_usd REAL NOT NULL,
  edition_limit INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  wish_type TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  issuance_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  verification_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  issued_at TEXT,
  is_gift INTEGER NOT NULL DEFAULT 0,
  giver_name TEXT,
  recipient_name TEXT,
  gift_message TEXT,
  campaign_id TEXT,
  target_date TEXT,
  payment_provider TEXT,
  payment_event_id TEXT,
  edition_key TEXT,
  issuance_serial INTEGER,
  fulfillment_status TEXT NOT NULL DEFAULT 'not_started',
  refund_status TEXT NOT NULL DEFAULT 'none',
  refund_reference TEXT,
  refund_reason TEXT,
  refunded_at TEXT,
  support_status TEXT NOT NULL DEFAULT 'none',
  policy_version TEXT,
  policy_accepted_at TEXT,
  policy_lang TEXT
);

CREATE INDEX IF NOT EXISTS idx_guardian_orders_created_at ON guardian_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_payment_status ON guardian_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_issuance_status ON guardian_orders(issuance_status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_campaign ON guardian_orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_gift ON guardian_orders(is_gift);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_provider_reference ON guardian_orders(payment_provider,payment_reference);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_refund_status ON guardian_orders(refund_status);
CREATE INDEX IF NOT EXISTS idx_guardian_orders_support_status ON guardian_orders(support_status);

CREATE TABLE IF NOT EXISTS guardian_editions (
  edition_key TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  edition_limit INTEGER NOT NULL,
  issued_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS guardian_edition_slots (
  edition_key TEXT NOT NULL,
  slot_no INTEGER NOT NULL,
  tier TEXT NOT NULL,
  order_id TEXT UNIQUE,
  reserved_at TEXT,
  PRIMARY KEY (edition_key,slot_no)
);
CREATE INDEX IF NOT EXISTS idx_guardian_edition_slots_order_id ON guardian_edition_slots(order_id);
CREATE INDEX IF NOT EXISTS idx_guardian_edition_slots_available ON guardian_edition_slots(edition_key,order_id);

CREATE TABLE IF NOT EXISTS guardian_checkout_sessions (
  checkout_id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created',
  provider_session_id TEXT,
  checkout_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT,
  failure_code TEXT,
  cancelled_at TEXT,
  completed_at TEXT,
  policy_version TEXT,
  policy_accepted_at TEXT,
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_guardian ON guardian_checkout_sessions(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_status ON guardian_checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_created ON guardian_checkout_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_guardian_checkout_expires ON guardian_checkout_sessions(expires_at);

CREATE TABLE IF NOT EXISTS guardian_payment_events (
  event_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  guardian_id TEXT,
  payment_reference TEXT,
  amount_usd REAL,
  currency TEXT,
  status TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  error_code TEXT
);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_guardian_id ON guardian_payment_events(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_received_at ON guardian_payment_events(received_at);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_events_provider_reference ON guardian_payment_events(provider,payment_reference);
CREATE UNIQUE INDEX IF NOT EXISTS uq_guardian_payment_success_provider_reference
ON guardian_payment_events(provider,payment_reference)
WHERE event_type='payment.succeeded' AND status='processed' AND payment_reference IS NOT NULL AND payment_reference<>'';

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
CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_status ON guardian_payment_incidents(status,updated_at);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_guardian ON guardian_payment_incidents(guardian_id,updated_at);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_incidents_event ON guardian_payment_incidents(event_id);

CREATE TABLE IF NOT EXISTS guardian_payment_control (
  control_key TEXT PRIMARY KEY,
  state TEXT NOT NULL CHECK(state IN ('open','hold')),
  note TEXT,
  changed_at TEXT NOT NULL
);
INSERT OR IGNORE INTO guardian_payment_control(control_key,state,note,changed_at)
VALUES('checkout','hold','Initial V1 production state: keep checkout on hold until PG/KYC/E2E gates pass',CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS guardian_payment_control_audit (
  audit_id TEXT PRIMARY KEY,
  control_key TEXT NOT NULL,
  previous_state TEXT NOT NULL,
  new_state TEXT NOT NULL,
  note TEXT NOT NULL,
  changed_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_guardian_payment_control_audit_changed ON guardian_payment_control_audit(changed_at DESC);

CREATE TABLE IF NOT EXISTS guardian_e2e_runs (
  run_id TEXT PRIMARY KEY,
  scenario TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  guardian_ids TEXT,
  details_json TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_guardian_e2e_runs_created_at ON guardian_e2e_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guardian_e2e_runs_status ON guardian_e2e_runs(status);

-- Optional/post-V1 story and physical-fulfillment tables are included so existing server endpoints remain schema-compatible.
CREATE TABLE IF NOT EXISTS guardian_stories (
  id TEXT PRIMARY KEY,
  guardian_id TEXT NOT NULL,
  story_type TEXT NOT NULL,
  story_text TEXT NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  consent_public INTEGER NOT NULL DEFAULT 0,
  no_causality_ack INTEGER NOT NULL DEFAULT 0,
  lang TEXT NOT NULL DEFAULT 'ko',
  status TEXT NOT NULL DEFAULT 'pending_review',
  evidence_status TEXT NOT NULL DEFAULT 'pending_upload',
  physical_gift_status TEXT NOT NULL DEFAULT 'not_selected',
  display_name TEXT,
  reviewed_at TEXT,
  gift_selected_at TEXT,
  created_at TEXT NOT NULL,
  shipping_claim_hash TEXT,
  shipping_claim_expires_at TEXT,
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_postal_code TEXT,
  shipping_address1 TEXT,
  shipping_address2 TEXT,
  shipping_submitted_at TEXT,
  shipping_status TEXT NOT NULL DEFAULT 'not_requested',
  physical_card_serial TEXT,
  production_status TEXT NOT NULL DEFAULT 'not_started',
  shipped_at TEXT,
  delivered_at TEXT,
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_guardian_id ON guardian_stories(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_status ON guardian_stories(status);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_shipping_status ON guardian_stories(shipping_status);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_physical_status ON guardian_stories(physical_gift_status,production_status,shipping_status);

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
