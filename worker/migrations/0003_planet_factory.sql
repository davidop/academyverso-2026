-- Additive. Existing records remain legacy; hidden alone is not a moderation state.
ALTER TABLE objects ADD COLUMN factory_state TEXT NOT NULL DEFAULT 'legacy' CHECK(factory_state IN ('legacy','pending','blocked','published'));
ALTER TABLE objects ADD COLUMN factory_hash TEXT;
