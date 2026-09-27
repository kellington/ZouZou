# State

*Last updated: 2026-09-27 (Results + Share shipped). Previous: 2026-09-24 (repo public), 2026-09-24 (Replit project deleted), 2026-09-18 (critters + daily-save fix)*

## Summary

ZouZou is live on Cloudflare at **https://zouzou.minus1over12.com**: one Worker serves the static
assets and a Hono API, backed by D1. Replit project deleted 2026-09-24; repo public (MIT) at
https://github.com/kellington/ZouZou. **2026-09-27: Wordle-style Results + Share shipped (PR #10)**
— stats tiles, per-difficulty bars, and a share message with the unsolved board as emoji squares.
Built by Wren, verified by Quincy, share sheet tested by Rob on device, deployed by Workers Builds
(~80 s after merge), confirmed live.

## What's working

- **Production:** Worker `zouzou`, deployed by Workers Builds on push to `main` (now `e94d2fa`).
  - Custom domain `zouzou.minus1over12.com`; `zouzou.rob-kellington.workers.dev` kept as a fallback.
  - pnpm 10.34.5 and Node 24.21.0 are picked up from `packageManager` and `.nvmrc`.
- **D1 `zouzou` (WNAM):** `0001_init.sql` applied. Phase 0 backup imported (62 games, 4 players,
  25 daily rows) plus 1 `zz-test` daily game kept by Rob's choice. Unchanged this session.
- **Zone `minus1over12.com`:** Always Use HTTPS on; rate-limit rule `zouzou-api` (10 req/10 s per IP).
- **Results + Share (2026-09-27, `304d288`):**
  - Once today's daily is done, the Menu's Daily button reads **Results** and opens a modal; the
    "Daily puzzle complete" screen in Game has the same button. Modal: Played / Win % / Current
    Streak / Max Streak tiles, Easy/Medium/Hard bars (played count, `solved/played · % · avg m:ss`),
    today's difficulty row green, Share, then Close / Back to Menu.
  - **Stats live in the `zouzou-player` cookie**, not D1: `stats.{easy,medium,hard} = {played,
    solved, solvedSeconds}` + `maxDailyStreak`. Daily games count under the day's difficulty. A win
    or a lives-out counts; abandoned games don't. Old cookies hydrate to zeros; an existing streak
    seeds max streak; values clamped to non-negative integers. Everyone starts at zero from 09-27.
  - **Share** = `navigator.share({ text })` → clipboard (`Copied!`) → copyable `<pre>` block. Text:
    `ZouZou Daily - Sep/27` / `Easy Puzzle` / `Solve Time: 1:23` / blank / emoji board / blank /
    `https://zouzou.minus1over12.com`. Board = today's `regionMap` through a 10-emoji palette
    (`🟥🟧🟨🟩🟦🟪🟫⬛⬜🔲`, region % 10), prefilled cell as `🐱`. Text only on purpose — a `url`
    field makes some iOS targets drop the text. Mock + rationale: `project/ideas/share-board-emoji.md`.
  - `MODE_CONFIG` (size/lives/prefill per mode) moved from `Game.tsx` to `lib/puzzle.ts`, unchanged.
- **Critter picker** (2026-09-18) and **daily-save fix** (`658571d`) as before.
- **Verified:** Quincy's scratchpad harness (store hydration/arithmetic/streak sequencing, component
  render incl. 0-division, share gating) — component 27/27; store assertions all pass except four
  that pinned the pre-fix behaviour he reported. No test suite in the repo still.
- **Repo:** public, MIT. `main` @ `e94d2fa` (PR #10 merge). Branches: `main`, `vscode`, `share-results`
  (merged, not yet deleted).

## In progress

- Nothing mid-flight. `project/diary/diary-2026-09.md` has uncommitted notes (Rob's feature notes +
  this session's entry).

## Known issues

- **Modal (`ui.tsx`) has no reduced-motion opt-out and no dialog role / focus trap / Escape.** Pre-existing,
  affects every modal (rules, win, lost, results). Results ships its own Close button because of this.
- **Menu across midnight:** `Menu` holds a `useState` snapshot; a tab left open past Edmonton midnight
  still shows "Results" (previously a disabled button — same class of staleness). Modal hides Share
  because it recomputes today. Cosmetic.
- Hard boards have 10 regions but only 9 square emoji exist; the tenth is `🔲`. Accepted.
- `GET /api` with nothing after it returns the SPA HTML instead of a JSON 404. Cosmetic.
- `zz-test` shows in "Recent players" indefinitely; also on the 2026-09-18 daily board.
- Rob's own 2026-09-18 daily was lost to the save bug; not backfilled.
- Builds command runs `pnpm install` twice; harmless. Build log warnings (workerd scripts, tooltip
  sourcemap) harmless.
- 10 `// @replit` comments remain in `ui/badge.tsx` and `ui/button.tsx`.
- Public-repo leftovers accepted by Rob: a friend's first name in 2 old commits; diary tracked; friends'
  names reachable via `/api/players/recent`.
- ReplDB is gone; the Phase 0 export in `~/Documents/Backups/ZouZou/` is the only pre-migration copy.

## Environment / setup

```
branch: main @ e94d2fa (= origin/main) + uncommitted STATE/TASKS/diary
Mac: Node 26.8.1 (no nvm), pnpm 10.34.5 global; wrangler via npx / pnpm exec (logged in)
Backups (outside git): ~/Documents/Backups/ZouZou/ — repldb export, import SQL, pre-import D1 export
D1 Time Travel bookmarks: pre-migration 00000001-…a411fe, pre-import 00000002-00000000-…2ce7
Local smoke: pnpm --filter @workspace/zouzou-friends run build && pnpm exec wrangler dev --local --port 8787
```

## Open questions

- **PLAN drift:** "Settle in" lists new gameplay features as out of scope; Results + Share shipped
  anyway (Rob's call, 2026-09-27). Note at the next milestone rather than editing PLAN.md now.
- **Stats are per-device** (cookie). If friends ask for cross-device stats, that's the D1 route:
  `0002` migration recording losses + a `/players/{name}/stats` endpoint (contract change). Not planned.
- **AI+PROCESS.md** snapshot still says "moving to Cloudflare"; there's no HTML version.
- `.claude/commands/project-status.md` still has the TEMPLATE header (keep the warm orange palette,
  Personal / Personal Project / priority 8 when customising).
- **Any friend blocked by the rate limit?** Unknown until people play; raise to 20 req/10 s if so.
- Replit account closes once conforma is off it (tracked in the conforma repo).

## Resolved this session

- 2026-09-27: Results + Share. Decided local cookie over D1 (nothing counts losses today either way;
  Wordle parity; no server risk). Rob reviewed the emoji-board mock in `project/ideas/` before code:
  squares, `🐱` for prefilled, board after the three lines, URL appended. Quincy found one blocker
  (Results modal had no close control on the Menu) + 3 minor (legacy max streak, non-idempotent
  updater, negative/fractional coercion); all fixed by Wren. PR #10 merged, live in ~80 s.

---

*Updated at the end of every session by `/end-session`. This is the file the
agent reads first next session — if it's stale, everything downstream is wrong.*
