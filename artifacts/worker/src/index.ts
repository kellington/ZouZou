import { Hono } from "hono";
import {
  GetDailyLeaderboardResponse,
  GetRecentPlayersResponse,
  HealthCheckResponse,
  RecordPlayerGameBody,
  RecordPlayerGameResponse,
  SubmitDailyScoreBody,
  SubmitDailyScoreResponse,
} from "@workspace/api-zod";

// Env (with DB: D1Database) comes from worker-configuration.d.ts (`pnpm run cf-typegen`).
const app = new Hono<{ Bindings: Env }>().basePath("/api");

const maximumEntries = 10;

/** Same normalisation as the Express server: trim + collapse whitespace. */
const normalizeName = (name: string): string => name.trim().replace(/\s+/g, " ");
/** Key used for dedupe/grouping (Express used lowercased normalised name). */
const nameKey = (normalized: string): string => normalized.toLowerCase();

/** Ported verbatim from api-server getEdmontonDateKey. */
export function getEdmontonDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

const boardQuery = (db: D1Database, date: string) =>
  db
    .prepare(
      "SELECT name, seconds FROM daily_scores WHERE date = ?1 ORDER BY seconds, name LIMIT ?2",
    )
    .bind(date, maximumEntries);

/** Express parsed JSON bodies leniently; a missing/malformed body falls through to Zod → 400. */
async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

app.use("*", async (c, next) => {
  await next();
  c.header("X-Robots-Tag", "noindex");
});

app.get("/healthz", (c) => c.json(HealthCheckResponse.parse({ status: "ok" })));

app.get("/daily/leaderboard", async (c) => {
  const date = getEdmontonDateKey();
  const { results } = await boardQuery(c.env.DB, date).all<{
    name: string;
    seconds: number;
  }>();
  return c.json(GetDailyLeaderboardResponse.parse({ date, entries: results }));
});

app.post("/daily/leaderboard", async (c) => {
  const parsed = SubmitDailyScoreBody.safeParse(await readJson(c.req.raw));
  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400);
  }

  const name = normalizeName(parsed.data.name);
  const seconds = parsed.data.seconds;
  if (!name || !Number.isInteger(seconds)) {
    return c.json(
      { error: "Name is required and seconds must be a whole number." },
      400,
    );
  }

  const date = getEdmontonDateKey();
  const db = c.env.DB;
  // One implicit transaction: keep-best-time upsert, then read the board back.
  const [, board] = await db.batch<{ name: string; seconds: number }>([
    db
      .prepare(
        `INSERT INTO daily_scores (date, name_key, name, seconds) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (date, name_key) DO UPDATE
           SET name = excluded.name, seconds = excluded.seconds
           WHERE excluded.seconds < daily_scores.seconds`,
      )
      .bind(date, nameKey(name), name, seconds),
    boardQuery(db, date),
  ]);

  return c.json(SubmitDailyScoreResponse.parse({ date, entries: board.results }));
});

app.get("/players/recent", async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT p.name, p.date, p.game, p.seconds FROM player_games p
     WHERE p.id = (SELECT MAX(id) FROM player_games WHERE name_key = p.name_key)
     ORDER BY p.date DESC, p.name_key`,
  ).all();
  return c.json(GetRecentPlayersResponse.parse({ entries: results }));
});

app.post("/players/games", async (c) => {
  const parsed = RecordPlayerGameBody.safeParse(await readJson(c.req.raw));
  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400);
  }

  const name = normalizeName(parsed.data.name);
  if (!name) {
    return c.json({ error: "Name is required." }, 400);
  }
  // Fixes plan §1.5.1: a non-integer time used to be stored and break /players/recent.
  if (!Number.isInteger(parsed.data.seconds)) {
    return c.json({ error: "Seconds must be a whole number." }, 400);
  }

  const entry = {
    date: getEdmontonDateKey(),
    game: parsed.data.game,
    seconds: parsed.data.seconds,
  };
  await c.env.DB.prepare(
    "INSERT INTO player_games (name_key, name, date, game, seconds) VALUES (?1, ?2, ?3, ?4, ?5)",
  )
    .bind(nameKey(name), name, entry.date, entry.game, entry.seconds)
    .run();

  return c.json(RecordPlayerGameResponse.parse(entry));
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal error" }, 500);
});

export default app;
