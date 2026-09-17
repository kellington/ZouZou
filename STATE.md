# State

*Last updated: 2026-09-16 19:45*

## Summary

Game is live and in use on Replit (`zouzou-and-friends.replit.app`). Migration to
Cloudflare (Worker + D1) is planned and decided (Rex plan, 2026-09-16) but not started —
no `cf` branch yet. Protocol files initialised this session; CLAUDE.md replaces `replit.md`.

## What's working

- Game: daily (shared, seeded) + easy 6×6 / medium 8×8 / hard 10×10, lives, timer, streaks, sounds, high-contrast palette.
- Shared daily leaderboard + recent players via Express API on ReplDB (live check 2026-09-16: 2 daily entries, 4 recent players).
- Phase 0 backup done: `zouzou-repldb-2026-09-17.json` (5 keys, 4 players, 62 games), verified against live API.

## In progress

- Cloudflare migration — pick up at plan Phase 1 (see diary `project/diary/diary-2026-09.md` for the opening prompt).

## Known issues

- ReplDB leaderboard keeps only today; history of past days is lost (fixed by D1 schema).
- `POST /players/games` doesn't enforce whole-number seconds (plan §1.5).
- Vite build fails off Replit (needs `PORT`/`BASE_PATH`); Mac build blocked by linux-only overrides.
- `index.html` meta description still says "built on Replit. Update this description…".

## Environment / setup

```
branch: vscode (protocol files, uncommitted)  — main @ fcf2467 = Replit published
Mac: Node 26.8.1, no pnpm yet (pnpm@10.34.5 global install approved)
Backup still in ~/Downloads/zouzou-repldb-2026-09-17.json — plan says move to ~/Documents/Backups/ZouZou/ (not done)
```

## Open questions

- Commit protocol files on `vscode` and merge, or carry them onto `cf`?
- `.agents/memory/*` (Replit Agent memory) — gotchas now copied into CLAUDE.md; delete with other Replit files in Phase 2c?

## Resolved this session

- CLAUDE.md is the agent instruction file; `replit.md` reduced to a pointer.
- Protocol files (PROJECT/PLAN/STATE/TASKS/DECISIONS) filled from README, code, live site and migration plan.

---

*Updated at the end of every session by `/end-session`. This is the file the
agent reads first next session — if it's stale, everything downstream is wrong.*
