# State

*Last updated: 2026-09-29 evening (Pause, lives on Top 5, Show Reward, Personal Stats, Reset fix shipped). Earlier 2026-09-29: daily tries + News. Previous: 2026-09-27 (Results + Share), 2026-09-24 (repo public), 2026-09-24 (Replit project deleted)*

## Summary

ZouZou is live on Cloudflare at **https://zouzou.minus1over12.com**: one Worker serves the static
assets and a Hono API, backed by D1. Replit project deleted 2026-09-24; repo public (MIT) at
https://github.com/kellington/ZouZou. **2026-09-29 (evening): five more changes shipped** — hearts lost
on the Top 5 + Pause (PR #12, migration 0003), Show Reward (PR #13), daily Reset fix (PR #14, Rob),
Personal Stats card (PR #15). All merged and live; Rob: "things look good" after #15. **2026-09-29: daily tries shipped (PR #11).** The leaderboard
ranks fewest tries, then time, and the menu has a "📣 News!" button. **2026-09-27: Wordle-style Results + Share shipped (PR #10)**
— stats tiles, per-difficulty bars, and a share message with the unsolved board as emoji squares.
Built by Wren, verified by Quincy, share sheet tested by Rob on device, deployed by Workers Builds
(~80 s after merge), confirmed live.

## What's working

- **Production:** Worker `zouzou`, deployed by Workers Builds on push to `main` (now `d05d2aa`).
  - Custom domain `zouzou.minus1over12.com`; `zouzou.rob-kellington.workers.dev` kept as a fallback.
  - pnpm 10.34.5 and Node 24.21.0 are picked up from `packageManager` and `.nvmrc`.
- **D1 `zouzou` (WNAM):** `0001_init.sql`, `0002_daily_attempts.sql`, `0003_daily_lives_lost.sql` applied
  (0002 and 0003 by Rob, 2026-09-29, each before its merge; existing rows got `attempts = 1`,
  `lives_lost = NULL`). Next migration is `0004_*`. Note: run `migrations apply --remote` from a checkout
  that *has* the new file — the first 0003 attempt ran from `vscode` and found nothing to apply. Phase 0 backup imported (62 games,
  4 players, 25 daily rows) plus 1 `zz-test` daily game kept by Rob's choice.
- **Hearts lost + Pause (2026-09-29, PR #12, `d14455b`):**
  - Top 5 shows hearts lost on the winning try after the time: `1:20 (2♥)`; `(0♥)` = clean solve. Rows saved
    before 0003 (or from an old cached client) show no brackets. Doesn't affect ranking (tries, then time).
  - Contract: optional `livesLost` (0–10) on `POST /daily/leaderboard`; entries carry `livesLost: number | null`.
    Better result replaces lives too. Verified on local D1 (bad values rejected).
  - Pause button beside the timer: stops the clock and covers the board with an opaque grey panel (no
    peeking, no taps); Resume from the panel or the button; Reset / new puzzle unpause. No auto-pause on
    tab switch (not asked).
- **Show Reward (2026-09-29, PR #13, `b0fc369`):**
  - Win modal button reveals a random image of the player's critter, picked once per win, loaded only on tap.
  - 85 photos Rob approved from Rex's shortlist (30 cat, 31 dog, 24 monkey), Unsplash/Pexels licences,
    600×600 JPEG, self-hosted in `public/rewards/<critter>/` (~5.8 MB); credit line "Photo: name / site"
    links the photo page; `public/rewards/CREDITS.md`. Dino = Microsoft Fluent Emoji 3D sauropod + T-rex (MIT).
  - Data in `src/lib/rewards.ts`. Candidate list + review page stayed outside the repo (job tmp).
  - `Modal` card now `max-h-full overflow-y-auto` — fixed pre-existing clipping of the daily win modal on small phones.
- **Personal Stats (2026-09-29, PR #15, `a0c4059`):** menu card between Top 5 and Recent Players — total
  games, Easy/Medium/Hard played · % solved · avg time, from the cookie `stats`. Same formulas as Results.
  No Daily row (Results covers it); footnote "Daily puzzles count toward their board size."
- **Daily Reset fix (PR #14, Rob, `f1334c6`):** Reset Board after a move on the daily resets the streak
  (no-op once today's daily is won). Not QA'd by Quincy.
- **Daily tries + News (2026-09-29, `11a4519`):**
  - A try starts on a daily game's first move (tap, drag or double-tap). Reloading mid-game costs a
    try; wrong guesses within a game don't. The count is in the cookie (`dailyAttempts` /
    `dailyAttemptsDate`, reset per Edmonton day) and frozen once today's daily is won. The win
    records `dailyWinAttempts` = the day's total try count across all tabs.
  - `POST /daily/leaderboard` takes an optional `attempts` (default 1, so old clients still work).
    The upsert keeps the player's best result (fewer tries, then faster), and the board sorts the same way.
  - UI: the Top 5 shows "N tries" when more than 1; the win modal, completed screens and share text show
    "first try" / "N tries"; the out-of-lives modal on the daily explains retries.
  - "📣 News!" button in the Menu's top-right corner, with an unread dot (localStorage
    `zouzou-news-seen`). Messages live in `src/lib/news.ts`: now 4 (tries, Pause, Reward, Personal Stats).
  - Verified: Quincy drove headless Chrome against local wrangler + D1. Ready to ship. His two-tab bug
    was fixed before commit; that fix wasn't re-tested by QA. Live curl showed `attempts: 1` on
    today's 3 entries.
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
- **Repo:** public, MIT. `main` @ `d05d2aa` (PR #15 merge). Branches: `main`, `vscode` (merged feature branches and worktrees deleted).

## In progress

- Nothing mid-flight. End-session edits (STATE / TASKS / DECISIONS / CLAUDE.md / diary) on `vscode`.

## Known issues

- **Not device-tested by QA:** Show Reward and Personal Stats were checked in headless Chrome only
  (375×667, 390×844); Rob confirmed live "looks good". iOS Safari `dvh` behaviour unverified.
- **Stats count from 2026-09-27** (when the cookie `stats` began); per device.
- **Modal (`ui.tsx`) has no reduced-motion opt-out and no dialog role / focus trap / Escape.** Pre-existing,
  affects every modal (rules, win, lost, results). Results ships its own Close button because of this.
- **Menu across midnight:** `Menu` holds a `useState` snapshot; a tab left open past Edmonton midnight
  still shows "Results" (previously a disabled button — same class of staleness). Modal hides Share
  because it recomputes today. Cosmetic.
- **Daily tries are honour-system:** a private window, cleared cookies, another device, blocked cookies
  or an old cached client all start at 1. Accepted (DECISIONS 2026-09-29).
- **Daily open across midnight:** keeps yesterday's board, or a wrong board if the difficulty changes, and
  a win counts as today's. Won't fix (DECISIONS 2026-09-29).
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
branch: vscode @ d05d2aa (= origin/main) + end-session edits
Mac: Node 26.8.1 (no nvm), pnpm 10.34.5 global; wrangler via npx / pnpm exec (logged in)
Backups (outside git): ~/Documents/Backups/ZouZou/ — repldb export, import SQL, pre-import D1 export
D1 Time Travel bookmarks: pre-migration 00000001-…a411fe, pre-import 00000002-00000000-…2ce7
Local smoke: pnpm --filter @workspace/zouzou-friends run build && pnpm exec wrangler dev --local --port 8787
```

## Open questions

- **PLAN drift (growing):** "Settle in" lists new gameplay features and API contract changes as out of
  scope. Shipped anyway (Rob's call): Results + Share (09-27); daily tries (09-29, contract + 0002); hearts
  lost (contract + 0003), Pause, Show Reward, Personal Stats (all 09-29). The milestone is now really
  "friend-feedback features". Rewrite PLAN.md at the next milestone.
- **Stats are per-device** (cookie). If friends ask for cross-device stats, that's the D1 route:
  `0002` migration recording losses + a `/players/{name}/stats` endpoint (contract change). Not planned.
- **AI+PROCESS.md** snapshot still says "moving to Cloudflare"; there's no HTML version.
- Status page: global `/project-status` skill, configured by the `## Project status` block in
  `CLAUDE.md` (group/profile/priority from the workspace README table). No per-repo command.
- **Any friend blocked by the rate limit?** Unknown until people play; raise to 20 req/10 s if so.
- Replit account closes once conforma is off it (tracked in the conforma repo).

## Resolved this session (2026-09-29 evening)

- Friend (Lexi) feedback → hearts lost on Top 5 + Pause; built in main session, migration 0003 applied by
  Rob, PR #12. Rob's own ideas → Show Reward (Rex researched sources + shortlisted; Wren built; Quincy 3
  rounds incl. modal overflow fix; Rob approved 85 photos) PR #13; Personal Stats (Wren, Quincy caught a
  rounding mismatch vs Results) PR #15. Rob shipped the Reset fix himself (PR #14). All merged; branches
  and worktrees cleaned.

## Resolved earlier 2026-09-29

- 2026-09-29: Daily tries + News. Rob's spec: allow restarts, but rank by tries, then time. Built
  in the main session, QA by Quincy; the two-tab loophole was closed; News copy toned down on
  Quincy's advice. Migration 0002 applied remotely before merging PR #11; confirmed live. Midnight
  cases → won't fix (decision); Reset-Board streak → task.

## Resolved 2026-09-27

- 2026-09-27: Results + Share. Decided local cookie over D1 (nothing counts losses today either way;
  Wordle parity; no server risk). Rob reviewed the emoji-board mock in `project/ideas/` before code:
  squares, `🐱` for prefilled, board after the three lines, URL appended. Quincy found one blocker
  (Results modal had no close control on the Menu) + 3 minor (legacy max streak, non-idempotent
  updater, negative/fractional coercion); all fixed by Wren. PR #10 merged, live in ~80 s.

---

*Updated at the end of every session by `/end-session`. This is the file the
agent reads first next session — if it's stale, everything downstream is wrong.*
