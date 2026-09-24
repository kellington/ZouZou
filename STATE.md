# State

*Last updated: 2026-09-24 (vault session: Rob deleted the Replit project). Previous: 2026-09-18 (critters + daily-save bug fix)*

## Summary

ZouZou is live on Cloudflare at **https://zouzou.minus1over12.com**: one Worker serves the static
assets and a Hono API, backed by D1. **Rob deleted the Replit project on 2026-09-24** (unpublished
2026-09-17, when friends were texted the new URL). 2026-09-18: the critter picker (cats / dogs / dinosaurs / monkeys) shipped (PR #5), and a
daily-save bug was fixed and deployed (PR #6). Rob confirmed it working on production.

## What's working

- **Production:** Worker `zouzou`, deployed by Workers Builds on push to `main` (now `85ee7bc`).
  - Custom domain `zouzou.minus1over12.com`; `zouzou.rob-kellington.workers.dev` kept as a fallback.
  - pnpm 10.34.5 and Node 24.21.0 are picked up from `packageManager` and `.nvmrc`.
- **D1 `zouzou` (WNAM):**
  - `0001_init.sql` applied (seconds CHECK is integer-only).
  - Phase 0 backup imported: 62 games, 4 players, 25 daily rows over 14 dates. Plus 1 `zz-test`
    daily game from preview testing, kept by Rob's choice.
- **Zone `minus1over12.com`:**
  - Always Use HTTPS is on; apex and geeks-pickem unaffected.
  - Rate-limit rule `zouzou-api` (path starts with `/api/`, 10 req/10 s per IP, block 10 s) was
    tested: 17 × 429 on a burst of 40 parallel requests, recovered after 10 s.
- **Verified:**
  - Quincy 2b and 2c: 62/62 API harness passes (Worker vs Express parity, boundaries, Edmonton date
    incl. DST, headers, SPA fallback, JSON 404/500).
  - Rob played on desktop and phone (Phase 4).
- **Critter picker:** a "Find:" choice on the Menu, saved in the `zouzou-player` cookie (default cat).
  Per-critter icons, sounds (on every correct placement, as the meow was), win titles, rules copy.
- **Daily save fix (`658571d`):** the "Daily puzzle complete" screen no longer replaces the win
  popup, so unnamed players see the name box and Top 5 again. Before this, a daily win with no
  saved name recorded nothing (bug existed since before critters; hit everyone new to the domain).
- **Repo:**
  - `origin/main` @ `85ee7bc` (PRs #4 cf, #5 critters, #6 fix merged). Local `main` is 2 behind — pull.
  - `feature/critters` @ `658571d`, merged; can be deleted. `cf` @ `95041d1`, merged.

## In progress

- Nothing mid-flight. Uncommitted: this session's STATE/TASKS/diary edits.

## Known issues

- `GET /api` with nothing after it returns the SPA HTML instead of a JSON 404 (`run_worker_first`
  only matches `/api/*`). Cosmetic.
- `zz-test` shows in "Recent players" indefinitely, since the list shows each name's latest game.
  It is also on today's (2026-09-18) live daily board (98 s) from Rob's post-fix check.
- Rob's own 2026-09-18 daily was lost to the save bug; not backfilled (Rob's call).
- The Builds command runs `pnpm install` twice (Builds installs automatically). Harmless, adds ~2 s.
- Build log warnings, both harmless: "Ignored build scripts: workerd" and the tooltip.tsx sourcemap.
- 10 `// @replit` comments remain in `ui/badge.tsx` and `ui/button.tsx`.
- **ReplDB is gone with the Replit project (2026-09-24).** The Phase 0 export in
  `~/Documents/Backups/ZouZou/` is now the only copy of the pre-migration data. No final Repl zip
  was recorded as taken.

## Environment / setup

```
branch: feature/critters @ 658571d (origin/main @ 85ee7bc; local main behind 2) + uncommitted STATE/TASKS/diary
Mac: Node 26.8.1 (no nvm), pnpm 10.34.5 global; wrangler via npx / pnpm exec (logged in)
Backups (outside git): ~/Documents/Backups/ZouZou/ — repldb export, import SQL, pre-import D1 export
D1 Time Travel bookmarks: pre-migration 00000001-…a411fe, pre-import 00000002-00000000-…2ce7
```

## Open questions

- **PLAN.md drift:** the "Off Replit" milestone is effectively done. It's due a milestone rewrite
  (next milestone: settle in, then cancel Replit, then maybe use the kept history).
- **PLAN.md drift:** the order changed from plan §4. D1 was created, migrated and imported before
  the merge; the final ReplDB export (5d/5e) was skipped. Rob checked the live API against the
  backup first and found no new games.
- **PLAN.md drift:** all definition-of-done boxes are still unticked, though Phases 1–5 are done.
- **AI+PROCESS.md** snapshot still says "moving to Cloudflare"; there's no HTML version.
- `.claude/commands/project-status.md` still has the TEMPLATE header. The first page chose a warm
  orange palette, group Personal / Personal Project / priority 8. Keep those when customising.
- **Any friend blocked by the rate limit?** Unknown until people play; raise to 20 req/10 s if so.
- Rob's personal Repl URL `zou-zou-robkellington.replit.app` also showed "not live". The project is
  deleted (2026-09-24); the Replit account closes once conforma is off it (tracked in the conforma repo).

## Resolved this session

- Daily-save bug: the win popup (name box + Top 5) was replaced by "Daily puzzle complete" on the
  winning move. Fixed in `Game.tsx` (skip that screen while `gameState === 'won'`); merged PR #6, deployed, verified by Rob.
- Earlier today: critter picker built, Quincy PASS, merged PR #5. Status page + README reached `main` via PR #4.

---

*Updated at the end of every session by `/end-session`. This is the file the
agent reads first next session — if it's stale, everything downstream is wrong.*
