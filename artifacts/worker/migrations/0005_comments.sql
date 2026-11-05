-- artifacts/worker/migrations/0005_comments.sql
-- Trash talk: one running chat shown under Today's Top 10. Every comment is
-- kept; the API returns the newest 100. No delete in the app — remove a bad
-- comment with `wrangler d1 execute … --remote` (Rob's OK).
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_key TEXT NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 200),
  -- ISO 8601 UTC, e.g. 2026-10-27T13:39:00.000Z
  created_at TEXT NOT NULL
);
