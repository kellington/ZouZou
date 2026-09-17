# ZouZou & Friends

A cat logic puzzle for a small group of friends: one shared daily puzzle, a leaderboard,
streaks, and endless easy / medium / hard games. It runs in the browser on phone or desktop,
with no sign-up.

**Live:** https://zouzou.minus1over12.com

<p>
  <img src="screenshots/zouzou-friends-daily-desktop.jpg" alt="Daily puzzle on desktop" width="520">
  <img src="screenshots/zouzou-friends-game-mobile.jpg" alt="Game on mobile" width="200">
</p>

## How to play

- Place exactly **one cat in every row, column and coloured region**.
- Cats **can't touch each other**, not even diagonally.
- Tap once to mark "no cat" and tap again to clear it. Double-tap to place a cat. Drag to mark (or
  erase) several cells at once.
- A wrong cat costs a life. When you run out of lives, the game is over.

| Mode | Board | Lives | Notes |
|---|---|---|---|
| Easy | 6×6 | 5 | One cat pre-placed |
| Medium | 8×8 | 4 | |
| Hard | 10×10 | 3 | |
| Daily | varies | varies | Everyone gets the same puzzle; its difficulty comes from the date. One completion per day |

- **Day** means the **America/Edmonton** date, on both the client and the server.
- **Daily streak:** goes up by one for each consecutive day you win the daily. A missed day, or
  running out of lives on the daily, resets it.
- **Leaderboard:** keeps each player's best time for the day and shows the top 10. Names match
  case-insensitively.
- **Your data:** best times, streak and player name live in a browser cookie (`zouzou-player`).
  Shared scores and game history live in D1.

## Architecture

One Cloudflare Worker serves everything from a single origin:

```
browser ──► zouzou.minus1over12.com   (Worker "zouzou"; WAF rate-limit rule on /api/*)
              ├─ /api/*  → Hono app (artifacts/worker) → D1 database "zouzou" (binding DB)
              └─ else    → static assets: Vite build of artifacts/zouzou-friends
                           (SPA fallback → index.html)
```

- **Client:** React 19, Vite 7, Tailwind 4, wouter and TanStack Query. Puzzles are generated in the
  browser, so the server never sees a board.
- **API:** Hono on Cloudflare Workers. Requests are validated with Zod schemas generated from the
  OpenAPI spec.
- **Data:** Cloudflare D1 (SQLite). Every day's scores and every game played are kept.
- **Contract-first:** `lib/api-spec/openapi.yaml` feeds Orval, which generates Zod schemas (used by
  the Worker) and React Query hooks (used by the client).
- **Hosting:** Cloudflare Free plan. `noindex` is set everywhere; this is a friends' game, not a
  public site.

## Repo layout

```
wrangler.jsonc                 Worker config: assets, SPA fallback, /api/* routing, D1 binding
artifacts/
  zouzou-friends/              the game (React + Vite) → dist/public
    public/_headers            security headers + noindex for static responses
  worker/
    src/index.ts               Hono API
    migrations/                D1 schema (0001_init.sql)
    scripts/repldb-to-sql.mjs  one-off: Replit DB export → D1 import SQL
    worker-configuration.d.ts  generated Worker types (pnpm --filter @workspace/worker run cf-typegen)
lib/
  api-spec/                    openapi.yaml + Orval config (the API contract)
  api-zod/                     generated Zod schemas
  api-client-react/            generated React Query hooks
screenshots/
```

## API

All routes live under `/api` and return JSON.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/healthz` | | `{ "status": "ok" }` |
| GET | `/api/daily/leaderboard` | | `{ date, entries: [{ name, seconds }] }`: today's top 10 |
| POST | `/api/daily/leaderboard` | `{ name, seconds }` | the updated board; keeps the player's best time |
| GET | `/api/players/recent` | | `{ entries: [{ name, date, game, seconds }] }`: latest game per player, newest first |
| POST | `/api/players/games` | `{ name, game, seconds }` | the recorded entry |

Limits:
- `name`: 1–24 characters. Whitespace is collapsed, and names are matched case-insensitively.
- `seconds`: a whole number from 1 to 36000.
- `game`: one of `daily`, `easy`, `medium`, `hard`.

Invalid input gets a `400 { "error": … }` response, and an unknown route gets `404`.

```bash
curl -s https://zouzou.minus1over12.com/api/daily/leaderboard | jq .
```

## Local development

Requirements:
- Node 24 (see `.nvmrc`)
- pnpm 10.34.5 (`npm i -g pnpm@10.34.5`, pinned via `packageManager`)

```bash
pnpm install

# Full stack: Worker + static assets + local D1, at http://localhost:8787
pnpm --filter @workspace/zouzou-friends run build
pnpm exec wrangler d1 migrations apply zouzou --local
pnpm exec wrangler dev --local --port 8787

# Client only, with Vite hot reload (API calls need the Worker running)
pnpm --filter @workspace/zouzou-friends run dev
```

`wrangler` is a pinned dev dependency. Run it with `pnpm exec wrangler` or `npx wrangler`; no
global install is needed.

### Checks

```bash
pnpm run typecheck    # libs + worker + client
pnpm run build        # typecheck, then build the client
```

There's no automated test suite yet. Changes are verified with typecheck, build, a `wrangler dev`
smoke test and manual play.

### Changing the API

1. Edit `lib/api-spec/openapi.yaml`. Use `type: number` with bounds rather than `integer`, because
   the generated Zod doesn't support `.int()`. Enforce whole numbers in the route instead.
2. Run `pnpm --filter @workspace/api-spec run codegen`.
3. Update `artifacts/worker/src/index.ts`.

### Changing the database

- `0001_init.sql` has been applied in production. Never edit it; add
  `artifacts/worker/migrations/0002_<name>.sql`.
- Apply it locally with `pnpm exec wrangler d1 migrations apply zouzou --local`.
- In production, apply it with `pnpm exec wrangler d1 migrations apply zouzou --remote`, before
  merging code that depends on the change.
- If you change bindings or `compatibility_date` in `wrangler.jsonc`, regenerate types with
  `pnpm --filter @workspace/worker run cf-typegen`.

## Deployment

**Workers Builds** deploys on every push to `main`:

| Setting | Value |
|---|---|
| Install | automatic (`pnpm install --frozen-lockfile`) |
| Build command | `pnpm install --frozen-lockfile && pnpm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branches | preview builds, which share the production D1 |

- The custom domain is `zouzou.minus1over12.com`. `zouzou.rob-kellington.workers.dev` stays
  enabled as a fallback.
- **Zone settings:** Always Use HTTPS is on, and one rate-limiting rule blocks an IP for 10 s when
  it sends more than 10 requests in 10 s to paths starting with `/api/`.
- **Logs:** Workers Logs, under Worker › Observability.

### Rollback

- **Code:** Worker › Deployments › Rollback (or `npx wrangler rollback`), plus a `git revert` on
  `main`.
- **Data:** code rollbacks don't touch D1. Use Time Travel (7 days on Free):
  `npx wrangler d1 time-travel info zouzou`, then `... restore zouzou --bookmark=<id>`. Restore is
  destructive.

### Data safety

- Preview deployments write to the **production** database. Test with a throwaway player name.
- Never commit database exports; they contain players' names.
- Take a backup with
  `npx wrangler d1 export zouzou --remote --output=<path outside the repo>`.

## History

- **Aug 2026:** built with Replit Agent and hosted on Replit (Express API with Replit DB).
- **Sep 2026:** moved to Cloudflare Workers with D1, and all Replit-specific code was removed.
  Leaderboard history and game records were imported from Replit DB; per-browser progress
  (streaks, best times) restarted on the new domain.

Project docs and agent instructions: `CLAUDE.md`, `PROJECT.md`, `PLAN.md`, `STATE.md`, `DECISIONS.md`.
