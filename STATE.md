# State

*Last updated: 2026-09-17 (status page session)*

## Summary

ZouZou is live on Cloudflare at **https://zouzou.minus1over12.com**: one Worker serves the static
assets and a Hono API, backed by D1. The Replit deployment is unpublished, and past players were
texted the new URL on 2026-09-17. The "Off Replit" milestone is done apart from the tail items
(usage check, cancelling Replit). The README rewrite is committed on `cf` (`33eb7b6`), not yet on `main`.

## What's working

- **Production:** Worker `zouzou` (version `88c45c3e`), deployed by Workers Builds on push to `main`.
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
- **Repo:**
  - Replit-only code, config and deps removed (Phase 2c).
  - `main` @ `23c01fd` (PR #3 merged); `cf` @ `33eb7b6` (pushed): 1 commit ahead with README + STATE/TASKS/diary.
  - CLAUDE.md updated for the Cloudflare setup.

## In progress

- `cf` → `main` PR not opened yet: README + protocol files + diary (`33eb7b6`), and a no-op redeploy when merged.
- Uncommitted on `cf`: `project/status/status-2026-09-17.html`, `project/status/STATUS-SUMMARY.md`
  (first status page), and this session's STATE/TASKS/diary edits.

## Known issues

- `GET /api` with nothing after it returns the SPA HTML instead of a JSON 404 (`run_worker_first`
  only matches `/api/*`). Cosmetic.
- `zz-test` shows in "Recent players" indefinitely, since the list shows each name's latest game.
- The Builds command runs `pnpm install` twice (Builds installs automatically). Harmless, adds ~2 s.
- Build log warnings, both harmless: "Ignored build scripts: workerd" and the tooltip.tsx sourcemap.
- 10 `// @replit` comments remain in `ui/badge.tsx` and `ui/button.tsx`.

## Environment / setup

```
branch: cf @ 33eb7b6 (main @ 23c01fd) + uncommitted project/status/*, STATE/TASKS/diary
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
- Rob's personal Repl URL `zou-zou-robkellington.replit.app` also shows "not live". Anything else
  still running on Replit for ZouZou (billing)?

## Resolved this session

- DECISIONS.md: logged the three 2026-09-17 calls (skipped 5d/5e, kept `zz-test`, plan §4 order).
- First `/project-status` run: `project/status/status-2026-09-17.html` + `STATUS-SUMMARY.md`.
- Earlier the same day: migration Phases 1 → 5 (5d/5e skipped), SKYresearch §11 block delivered
  (§11.8–11.10 pending), and CLAUDE.md made the agent file.

---

*Updated at the end of every session by `/end-session`. This is the file the
agent reads first next session — if it's stale, everything downstream is wrong.*
