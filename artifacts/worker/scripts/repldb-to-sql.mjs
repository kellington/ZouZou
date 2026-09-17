// Transform a ReplDB export (JSON array of {key, status, value}) into D1 import SQL.
// Contains no data. Output holds friends' names: write it OUTSIDE the repo.
// usage: node repldb-to-sql.mjs zouzou-repldb-<stamp>.json > /path/outside/repo/import.sql
import { readFileSync } from "node:fs";

const q = (s) => `'${String(s).replaceAll("'", "''")}'`;
const int = (n) => {
  if (!Number.isInteger(n) || n < 1 || n > 36000) throw new Error(`bad seconds ${n}`);
  return n;
};
const date = (d) => {
  if (typeof d !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error(`bad date ${d}`);
  return d;
};
const games = new Set(["daily", "easy", "medium", "hard"]);
const game = (g) => {
  if (!games.has(g)) throw new Error(`bad game ${g}`);
  return g;
};
const norm = (name) => {
  const n = String(name).trim().replace(/\s+/g, " ");
  if (!n) throw new Error("empty name");
  return n;
};
const key = (name) => norm(name).toLowerCase();
const upsertDaily = (d, name, s) =>
  `INSERT INTO daily_scores (date,name_key,name,seconds) VALUES (${q(date(d))},${q(key(name))},${q(norm(name))},${int(s)}) ` +
  `ON CONFLICT (date,name_key) DO UPDATE SET name=excluded.name, seconds=excluded.seconds WHERE excluded.seconds < daily_scores.seconds;`;

const rows = JSON.parse(readFileSync(process.argv[2], "utf8"));
const out = ["DELETE FROM daily_scores;", "DELETE FROM player_games;"]; // idempotent re-import
const stats = { players: 0, games: 0, leaderboardEntries: 0, dailyBackfill: 0, skipped: 0 };

for (const { key: k, status, value } of rows) {
  if (status !== 200) {
    console.error(`skip ${k}: status ${status}`);
    stats.skipped++;
    continue;
  }
  if (k === "zouzou:daily-leaderboard") {
    for (const e of value.entries) {
      out.push(upsertDaily(value.date, e.name, e.seconds));
      stats.leaderboardEntries++;
    }
  } else if (k.startsWith("zouzou:player:")) {
    stats.players++;
    for (const e of value.entries) {
      // array order preserved → AUTOINCREMENT id keeps "last entry" semantics
      out.push(
        `INSERT INTO player_games (name_key,name,date,game,seconds) VALUES (${q(key(value.name))},${q(norm(value.name))},${q(date(e.date))},${q(game(e.game))},${int(e.seconds)});`,
      );
      stats.games++;
      if (e.game === "daily") {
        out.push(upsertDaily(e.date, value.name, e.seconds)); // backfill past daily boards
        stats.dailyBackfill++;
      }
    }
  } else {
    console.error(`skip unknown key: ${k}`);
    stats.skipped++;
  }
}

console.log(out.join("\n"));
console.error(JSON.stringify(stats));
