-- Apply after creating a backup and testing locally; additive changes only.
ALTER TABLE objects ADD COLUMN world_spec TEXT;
ALTER TABLE objects ADD COLUMN world_status TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE objects ADD COLUMN world_version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE objects ADD COLUMN world_input_hash TEXT;
ALTER TABLE objects ADD COLUMN world_updated_at TEXT;
