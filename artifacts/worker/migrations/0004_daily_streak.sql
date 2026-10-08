-- artifacts/worker/migrations/0004_daily_streak.sql
-- Streak: the player's daily streak (consecutive days won, from their cookie)
-- including today's win. Shown on the board next to the name; it doesn't
-- affect ranking. Existing rows predate it and stay NULL (shown without it).
ALTER TABLE daily_scores
  ADD COLUMN streak INTEGER
  CHECK (streak IS NULL OR (typeof(streak) = 'integer' AND streak BETWEEN 1 AND 100000));
