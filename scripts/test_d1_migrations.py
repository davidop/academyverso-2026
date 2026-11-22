#!/usr/bin/env python3
"""Verify additive Cloudflare D1 migrations against SQLite and existing rehearsal objects."""
from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[1]
conn = sqlite3.connect(":memory:")
conn.executescript((ROOT / "worker/schema.sql").read_text())
conn.execute(
    "INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at) VALUES(?,?,?,?,?,?,datetime('now'))",
    (10,"planeta","Distrito Neón","QA","Vice Nebula","https://github.com/davidop/academyverso-2026/issues/10")
)
conn.execute(
    "INSERT INTO objects(issue_number,type,name,alias,description,issue_url,created_at) VALUES(?,?,?,?,?,?,datetime('now'))",
    (11,"planeta","Bastión Centinela","QA","Colonia","https://github.com/davidop/academyverso-2026/issues/11")
)
for p in sorted((ROOT / "worker/migrations").glob("*.sql")):
    conn.executescript(p.read_text())
columns={row[1] for row in conn.execute("PRAGMA table_info(objects)")}
assert {"world_spec","world_status","world_version","world_input_hash","world_owner_token_hash"} <= columns
rows=conn.execute("SELECT issue_number,name,hidden,world_version FROM objects ORDER BY issue_number").fetchall()
assert rows==[(10,"Distrito Neón",0,0),(11,"Bastión Centinela",0,0)],rows
row=conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='world_revisions'").fetchone()
assert row is not None
conn.execute("UPDATE objects SET world_spec='{}',world_status='fallback',world_input_hash='abc',world_version=1 WHERE issue_number=10")
conn.execute("""INSERT INTO world_revisions(issue_number,version,world_spec,world_status,input_hash,origin)
  SELECT issue_number,world_version,world_spec,world_status,world_input_hash,'create' FROM objects
  WHERE issue_number=10 AND world_input_hash='abc' AND world_version>0 AND world_spec IS NOT NULL
  ON CONFLICT(issue_number,version) DO UPDATE SET world_spec=excluded.world_spec,world_status=excluded.world_status,input_hash=excluded.input_hash""")
assert conn.execute("SELECT version,origin FROM world_revisions WHERE issue_number=10").fetchone()==(1,"create")
print("PASS: D1 migrations additive, rehearsal objects preserved, revision insert compatible")
