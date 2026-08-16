CREATE TABLE IF NOT EXISTS lumen_link_invites (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  inviter_label TEXT NOT NULL,
  inviter_elements_json TEXT NOT NULL,
  inviter_weakest_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TEXT
);

CREATE TABLE IF NOT EXISTS lumen_link_relationships (
  id TEXT PRIMARY KEY,
  invite_id TEXT NOT NULL,
  participant_label TEXT NOT NULL,
  relation_label TEXT,
  participant_elements_json TEXT NOT NULL,
  participant_weakest_json TEXT NOT NULL,
  complement_score INTEGER NOT NULL,
  complement_grade TEXT NOT NULL,
  strongest_for_inviter TEXT,
  strongest_for_participant TEXT,
  shared_gap_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(invite_id) REFERENCES lumen_link_invites(id)
);

CREATE INDEX IF NOT EXISTS idx_lumen_link_invites_status_expires ON lumen_link_invites(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_lumen_link_relationships_invite ON lumen_link_relationships(invite_id, created_at DESC);
