-- artifacts/worker/migrations/0001_init.sql
CREATE TABLE daily_scores (
  date     TEXT    NOT NULL,                 -- YYYY-MM-DD, America/Edmonton
  name_key TEXT    NOT NULL,                 -- lower(normalized name)
  name     TEXT    NOT NULL,                 -- display casing of the best run
  seconds  INTEGER NOT NULL CHECK (typeof(seconds) = 'integer' AND seconds BETWEEN 1 AND 36000),
  PRIMARY KEY (date, name_key)               -- one best row per player per day, every day kept
);
CREATE TABLE player_games (                  -- every game ever played
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name_key TEXT    NOT NULL,
  name     TEXT    NOT NULL,
  date     TEXT    NOT NULL,
  game     TEXT    NOT NULL CHECK (game IN ('daily','easy','medium','hard')),
  seconds  INTEGER NOT NULL CHECK (typeof(seconds) = 'integer' AND seconds BETWEEN 1 AND 36000)
);
CREATE INDEX player_games_by_name ON player_games (name_key, id);
