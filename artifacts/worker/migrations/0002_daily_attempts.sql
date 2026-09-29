-- artifacts/worker/migrations/0002_daily_attempts.sql
-- Daily attempts: how many tries (restarts after running out of lives) a player
-- needed to solve today's puzzle. The board ranks fewer attempts first, then time.
-- Existing rows predate the count and are treated as first-try solves.
ALTER TABLE daily_scores
  ADD COLUMN attempts INTEGER NOT NULL DEFAULT 1
  CHECK (typeof(attempts) = 'integer' AND attempts BETWEEN 1 AND 1000);
