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
