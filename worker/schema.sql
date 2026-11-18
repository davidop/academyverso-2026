CREATE TABLE IF NOT EXISTS objects (
 issue_number INTEGER PRIMARY KEY,
 type TEXT NOT NULL,
 name TEXT NOT NULL,
 alias TEXT NOT NULL,
 description TEXT NOT NULL,
 issue_url TEXT NOT NULL,
 created_at TEXT NOT NULL,
 hidden INTEGER NOT NULL DEFAULT 0,
 enriched INTEGER NOT NULL DEFAULT 0,
 ai_detail TEXT
);
CREATE INDEX IF NOT EXISTS idx_objects_visible ON objects(hidden,issue_number);
CREATE TABLE IF NOT EXISTS rates (key TEXT PRIMARY KEY,last_at INTEGER NOT NULL,count INTEGER NOT NULL);
