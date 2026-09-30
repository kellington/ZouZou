-- artifacts/worker/migrations/0003_daily_lives_lost.sql
-- Lives lost: how many hearts the winning try of today's daily cost (0 = no
-- mistakes). Shown on the board next to the time; it doesn't affect ranking.
-- Existing rows predate the count and stay NULL (shown without it).
ALTER TABLE daily_scores
  ADD COLUMN lives_lost INTEGER
  CHECK (lives_lost IS NULL OR (typeof(lives_lost) = 'integer' AND lives_lost BETWEEN 0 AND 10));
