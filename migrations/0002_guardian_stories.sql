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
  FOREIGN KEY (guardian_id) REFERENCES guardian_orders(id)
);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_guardian_id ON guardian_stories(guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_stories_status ON guardian_stories(status);
