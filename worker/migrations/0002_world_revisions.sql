-- Reversible-by-backup additive WorldGen history schema; apply only after 0001_world_specs.sql.
CREATE TABLE IF NOT EXISTS world_revisions (
  issue_number INTEGER NOT NULL,
  version INTEGER NOT NULL CHECK(version > 0),
  world_spec TEXT NOT NULL,
  world_status TEXT NOT NULL CHECK(world_status IN ('ready','fallback','restored')),
  input_hash TEXT,
  origin TEXT NOT NULL CHECK(origin IN ('create','edit','web','rollback')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (issue_number, version),
  FOREIGN KEY (issue_number) REFERENCES objects(issue_number)
);
CREATE INDEX IF NOT EXISTS idx_world_revisions_issue ON world_revisions(issue_number, version DESC);
ALTER TABLE objects ADD COLUMN world_owner_token_hash TEXT;
