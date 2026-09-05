import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'tracker.db');

export const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    owner_token TEXT NOT NULL UNIQUE,
    share_token TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL DEFAULT 'Untitled',
    status TEXT NOT NULL DEFAULT 'waiting',
    duration_ms INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT,
    opened_at TEXT,
    last_seen_at TEXT
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    accuracy REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_locations_session ON locations(session_id, id);
`);

// --- Prepared statements (queries.js worth of stuff, kept here since the
// dataset/schema is small enough not to warrant a separate file yet) ---

export const queries = {
  insertSession: db.prepare(`
    INSERT INTO sessions (id, owner_token, share_token, label, duration_ms, expires_at)
    VALUES (@id, @ownerToken, @shareToken, @label, @durationMs, @expiresAt)
  `),

  getByOwnerToken: db.prepare(`SELECT * FROM sessions WHERE owner_token = ?`),
  getByShareToken: db.prepare(`SELECT * FROM sessions WHERE share_token = ?`),
  getById: db.prepare(`SELECT * FROM sessions WHERE id = ?`),

  listByOwnerTokens: (tokens) => {
    if (!tokens.length) return [];
    const placeholders = tokens.map(() => '?').join(',');
    return db.prepare(`SELECT * FROM sessions WHERE owner_token IN (${placeholders}) ORDER BY created_at DESC`).all(...tokens);
  },

  setStatus: db.prepare(`UPDATE sessions SET status = ? WHERE id = ?`),
  markOpened: db.prepare(`UPDATE sessions SET opened_at = datetime('now') WHERE id = ? AND opened_at IS NULL`),
  touchLastSeen: db.prepare(`UPDATE sessions SET last_seen_at = datetime('now') WHERE id = ?`),

  expireStale: db.prepare(`
    UPDATE sessions SET status = 'expired'
    WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
    AND status NOT IN ('expired', 'stopped', 'declined')
  `),

  insertLocation: db.prepare(`
    INSERT INTO locations (session_id, lat, lng, accuracy) VALUES (?, ?, ?, ?)
  `),

  historyForSession: db.prepare(`
    SELECT lat, lng, accuracy, created_at FROM locations
    WHERE session_id = ? ORDER BY id ASC LIMIT 5000
  `),

  latestLocation: db.prepare(`
    SELECT lat, lng, accuracy, created_at FROM locations
    WHERE session_id = ? ORDER BY id DESC LIMIT 1
  `),
};
