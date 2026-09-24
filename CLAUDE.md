# Project Protocol — ZouZou & Friends

This file tells AI agents how to operate in this repo. Content about *what* the
project is lives in the five sibling files — this file is about *how we work*,
plus durable project reference that agents need on hand.

> **This is the protocol file.** `AGENTS.md` is a pointer back here for
> non-Claude tools. Edit this one.

## What this repo is, in one line

ZouZou & Friends — a browser cat-placement logic puzzle (daily challenge + easy/medium/hard)
for Rob's friends, with a shared daily leaderboard; pnpm workspace, React 19 + Vite
client served with a Hono API by one Cloudflare Worker + D1 (migrating off Replit, 2026-09).

## Source of truth

- **PROJECT.md** — why this exists, who it's for, success criteria, non-goals.
- **PLAN.md** — current milestone and roadmap. Rewritten at milestone boundaries.
- **STATE.md** — snapshot of where things are right now. Updated every session.
- **DECISIONS.md** — append-only log of decisions and their trade-offs. Never rewrite entries.
- **TASKS.md** — active and near-term work. Rolls over constantly.

If any of these conflict, ask me which one is right. Don't silently reconcile.

Only the main session writes these files — subagents read them but never edit them.

**Migration plan (external, authoritative for the Cloudflare move):**
`../../SKYideas/SKYresearch/experiments/ai-hosting/notes/zouzou-migration-plan-2026-09-16.md`
(decisions §8, guardrail items §7, SKYresearch feedback §11). Companion:
`../../SKYideas/SKYresearch/experiments/ai-hosting/notes/static-site-playbook-2026-09-16.md`.
Plan §8 decisions are final — don't re-litigate them.

## Session protocol

Use the **`/start-session`** and **`/end-session`** skills. They are global
(`~/.claude/skills/`) and carry the full loop — read state, check git, flag
drift, propose, then update STATE.md / TASKS.md / DECISIONS.md on the way out.
Don't restate the loop here; it will drift.

`/start-session` explicitly scans this file for **session supplements**, so put
anything repo-specific under the heading below and it will be picked up.

### Session supplements for this repo

- Session notes / next prompts live in `project/diary/diary-YYYY-MM.md`.
- During the migration, check which branch you're on: migration work goes on `cf`
  (plan §4) until it merges to `main`. Don't do migration work on `main` or `vscode`.
- At end of the migration, produce a "for SKYresearch" block answering plan §11.

## Milestones

When I say "milestone" or "checkpoint":

1. Rewrite PLAN.md against reality, not against the old plan.
2. Prune TASKS.md — archive done items, drop anything that no longer matters.
3. Re-read PROJECT.md's success criteria. Confirm they still hold, or propose edits.
4. Summarize what shipped since the last milestone.

Between milestones PLAN.md is read-only. Note drift in STATE.md under "open
questions" instead.

## Status reporting

Run **`/project-status`** (`.claude/commands/project-status.md`) to generate a
dated, self-contained HTML page at `project/status/status-YYYY-MM-DD.html` plus
`project/status/STATUS-SUMMARY.md`, which feeds the workspace portfolio roll-up.

Customize that command for this project — it is meant to be tailored, not
generic. See its header comments.

## Guardrails

Always ask before:

- Installing new dependencies
- Schema or migration changes
- Destructive file operations (delete, overwrite outside the working set)
- Commits or pushes
- Running anything that touches production data or external services

Prefer small, reversible changes. If you're unsure, stop and ask. These
guardrails bind subagents too — a team member who hits one flags it in their
report instead of proceeding.

### Guardrails specific to this repo

- **Friends' data is real.** The live leaderboard and player history hold friends'
  names. Never write to the production API (Replit URL until cutover, then
  `zouzou.minus1over12.com` / workers.dev) or production D1 (`zouzou`) to "test" — use local D1, or the `zz-test` user with Rob's OK.
- **Every `wrangler … --remote` command needs Rob's OK at the moment** — D1 create,
  migrations, import, deletes (incl. `zz-test` cleanup), Time Travel restore. Previews
  share production D1 (plan D12), so a preview write *is* a production write.
- **Never commit ReplDB exports or backups.** `zouzou-repldb-*.json` holds friends'
  names; it lives outside git (`~/Documents/Backups/ZouZou/`).
- **Don't echo `REPLIT_DB_URL`** in the Repl shell — it's a full-access token.
- **Replit unpublish, Workers Builds import, `cf` → `main` merge** are Rob's clicks, with
  explicit OK. No rollback to Replit exists by decision (plan D9).
- **Don't change the API contract** (`lib/api-spec/openapi.yaml`) during the migration —
  the React client must work unchanged against the Worker.
- **Lockfile changes** (`pnpm install` that rewrites `pnpm-lock.yaml`) — show the diff
  first. Never disable `minimumReleaseAge` in `pnpm-workspace.yaml`.

## Conventions

- **Language / stack:** TypeScript 5.9, pnpm workspace, Node 24. Client: React 19.1 +
  Vite + Tailwind 4 + wouter + react-query. API: Hono on Cloudflare Workers, D1 (SQLite).
  Contract-first: OpenAPI → Orval → `@workspace/api-zod` + `@workspace/api-client-react`.
- **Code style:** Prettier (root devDep). Match surrounding code.
- **Naming:** workspace packages are `@workspace/<name>`; deployables in `artifacts/`,
  shared libs in `lib/`.
- **Testing:** no test suite yet. Verify with `pnpm run typecheck` + build + `wrangler dev`
  smoke + manual play; Quincy verifies migration phases (plan Phase 2b checklist).
- **Commits:**
- **Branching:** `main` = production (Replit publishes it manually today; Workers Builds
  deploys it after Phase 3). `cf` = Cloudflare migration branch. `vscode` = protocol-file work.
- **Secrets / env:** no app secrets — the Worker only has the D1 binding `DB`. Cloudflare
  account IDs etc. go in `SECRETS.PRIVATE.YAML` — local scratchpad, gitignored, copied
  from the `.example` twin — never the deployed secret store.

## AI team

The orchestrator doctrine — how **Alice** behaves, activation, handoffs,
statelessness, and routing to the shared members **Harry** (hiring), **Rex**
(research), **Peter** (project-room prep) and **Quincy** (QA) — is global in
`~/.claude/CLAUDE.md`. Add only this project's specialists here.

- **Specialists** (global `~/.claude/agents/`):
  - Worker / Hono / D1 / wrangler / CI → **Gage** (`subagent_type: gage`)
  - React client changes → **Wren** (`subagent_type: wren`)
- **Handoff:** Rex plan → Gage (worker diff + gate cards) → Quincy verifies → Rob runs gates.

## Notes to the agent

- Short, direct writing over hedging. "I don't know" beats a guess.
- If a task takes more than ~3 tool calls of exploration without progress, stop and check in.
- Don't reformat or restructure the protocol files unless I ask. Small content edits only.
- Terms of art for this project go in `GLOSSARY.md` — create it the first time a
  term needs pinning down.

---

## Project Reference

Durable facts agents need while working. **Update only when reality changes —
not every session.** This is the section that keeps stack detail, data models
and business rules out of STATE.md, where they'd rot.

### Repo map

| Path | What |
|---|---|
| `wrangler.jsonc` | Worker `zouzou`: assets = client build (SPA fallback), `run_worker_first: /api/*`, D1 binding `DB` → `zouzou` |
| `artifacts/zouzou-friends` | The game (React/Vite). Build → `dist/public` (Worker static assets); `public/_headers` |
| `artifacts/worker` | Hono API (`src/index.ts`), D1 migrations (`migrations/`), ReplDB → SQL transform (`scripts/repldb-to-sql.mjs`), generated `worker-configuration.d.ts` |
| `lib/api-spec` | `openapi.yaml` + Orval config — **the API contract** |
| `lib/api-zod` | Generated Zod schemas (used by the Worker) |
| `lib/api-client-react` | Generated react-query hooks (base `/api`, same-origin) |
| `screenshots/` | Game screenshots |

Removed in Phase 2c (2026-09-17): Express `api-server` (ReplDB), `mockup-sandbox`, `lib/db`,
`scripts/`, `.replit*`, `replit.md`, `.agents/`, `.npmrc`. Old API source: `git show 74b50a3:artifacts/api-server/`.

### Data model

Replit (legacy, until cutover — ReplDB KV):
- `zouzou:daily-leaderboard` → `{ date, entries: [{name, seconds}] }` — **only today**;
  overwritten when the Edmonton date rolls. Top 10, one best time per name (case-insensitive).
- `zouzou:player:<encodeURIComponent(lowercase name)>` → `{ name, entries: [{date, game, seconds}] }` — every game.

D1 (`artifacts/worker/migrations/0001_init.sql`): `daily_scores (date, name_key, name, seconds)`
PK `(date, name_key)` — best time per player per day, every day kept; `player_games (id, name_key,
name, date, game, seconds)` — every game. `seconds` CHECK: integer, 1–36000. `name_key` =
lowercased, whitespace-normalised name. `0001` is applied remotely — schema changes need `0002_*.sql`.

Client-side (cookie `zouzou-player`, 400 days; legacy localStorage `zouzou-store` /
`zouzou-best-times`): best times per mode, `daily`, `lastDailyDate`, `playerName`,
`dailyStreak`, `lastPlayedDate`. Per-origin — does not survive the domain change (plan D5).

### API (`/api`, contract in `lib/api-spec/openapi.yaml`)

- `GET /healthz` → `{status:"ok"}`
- `GET /daily/leaderboard` → `{date, entries}` for today (Edmonton)
- `POST /daily/leaderboard` `{name 1–24, seconds 1–36000 int}` → updated board
- `GET /players/recent` → latest game per named player, newest date first
- `POST /players/games` `{name, game: daily|easy|medium|hard, seconds}` → entry

### User roles

None. No auth — a player is just a typed name. Anyone with the URL can play and post.

### Key flows

1. Menu → pick Daily / Easy / Medium / Hard (`/play/:mode`; `/play/normal` → medium).
2. Play: place one cat per row, column and coloured region; cats can't touch, even
   diagonally. Tap = mark no-cat / clear; double-tap = cat. Wrong cat costs a life.
3. Win → best time saved in cookie; named player POSTs to `/players/games` (and
   `/daily/leaderboard` for daily).
4. Menu shows shared daily leaderboard + recent players (polled ~60 s).

### Business rules

- Modes: easy 6×6, 5 lives, 1 prefilled cat; medium 8×8, 4 lives; hard 10×10, 3 lives;
  daily = one puzzle per day, same for everyone — seed `YYYYMMDD`, difficulty picked from
  the seed; one completion per day (`src/pages/Game.tsx`, `src/lib/puzzle.ts`).
  Puzzles are generated client-side; the server never sees the board.
- "Day" = **America/Edmonton** date, on client and server (`getEdmontonDateKey`).
- Daily streak: +1 on consecutive-day daily wins; a missed day or running out of lives
  on daily resets it.
- Leaderboard keeps a player's best time for the day; names matched case-insensitively,
  whitespace-normalised.

### Commands

```
# run locally (wrangler is a pinned devDep — use npx/pnpm exec, not a global install)
pnpm --filter @workspace/zouzou-friends run build   # client → dist/public (needed by wrangler dev)
pnpm exec wrangler dev --local --port 8787          # Worker + assets + local D1
pnpm --filter @workspace/zouzou-friends run dev     # client-only Vite dev (PORT/BASE_PATH default 5173 and /)

# local D1
pnpm exec wrangler d1 migrations apply zouzou --local
pnpm exec wrangler d1 execute zouzou --local --file=<import.sql>

# test
pnpm run typecheck

# build / deploy
pnpm run build
pnpm --filter @workspace/api-spec run codegen      # after editing openapi.yaml
pnpm --filter @workspace/worker run cf-typegen      # after changing wrangler.jsonc bindings/compat date
# Deploy: Workers Builds on push to main (build: pnpm install --frozen-lockfile &&
# pnpm --filter @workspace/zouzou-friends run build; deploy: npx wrangler deploy).
# Remote D1 (Rob's OK every time): wrangler d1 … --remote; Time Travel 7 days on Free.
```

Live: https://zouzou-and-friends.replit.app (until cutover) → `zouzou.minus1over12.com`.
Quick check: `curl -fsSL <host>/api/daily/leaderboard | jq .`

### Known gotchas

- **OpenAPI numeric fields:** use `type: number` with bounds, not `integer` — Orval emits
  `zod.int()` which the workspace Zod doesn't have. Enforce `Number.isInteger` in the route.
- **Board drag:** don't capture the pointer on pointer-down; capture only after the drag
  threshold, or taps never reach the cell button.
- **workerd runs in UTC** — dates must go through `Intl` with `timeZone: "America/Edmonton"`
  (verified in workerd across midnight/DST, 2026-09-17).
- **SQLite `BETWEEN` accepts REALs** — integer columns need `typeof(x) = 'integer'` in the CHECK.
- **Previews share production D1** (plan D12) — test only with `zz-test`, delete its rows after (Rob's OK).
- **Re-running the ReplDB import deletes all rows first** — any real games since the last
  import are lost. Final import must happen before friends get the new link.
- **esbuild versions differ by tool** (vite 0.27.3, wrangler 0.28.1, orval 0.28.2) — don't re-add a global pin.
- `pnpm install` warns "Ignored build scripts: workerd" — harmless; `wrangler dev` works.
