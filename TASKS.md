# Tasks

**Now** is 1–2 items. **Next** is what the agent proposes at the start of a
session. **Later** is a holding pen, not a backlog.

Keep Now + Next under ~10 items between them. Later can breathe, but anything
sitting there untouched across two milestones gets deleted, not re-filed.

When Done gets long, move it to `project/status/` history or drop it — git log
is the real record. Don't let this file become the project's second STATE.md.

## Now

- [ ] Rob is polling friends on the new bits (tries, hearts on Top 5, Pause, Show Reward, Personal Stats); record results + whether anyone wants cross-device stats
- [ ] Rob: one real-phone play-through to a win → tap Show Reward (photo + credit link) — QA was headless only

## Next

- [ ] ~2026-09-24: one-week usage check (Worker requests/day, D1 rows read/written, rate-limit rule hits) vs Free limits → report to SKYresearch §11.10
- [ ] Watch for friends hitting 429s; if any, raise the rule to 20 req/10 s → SKYresearch §11.8
- [ ] Capture friends' reaction to the move (one line) → SKYresearch §11.9
- [ ] Ask friends how the critter choice lands
- [ ] **Replit cleanup. Paste into a new session:**
  > ZouZou's Replit project was deleted on 2026-09-24 (STATE.md). Remove the Replit leftovers in one small PR. The build must pass, and Quincy greps for any remaining `replit` outside `project/diary/`.
  > 1. Remove the 10 `// @replit` comments in `artifacts/zouzou-friends/src/components/ui/badge.tsx` and `button.tsx`.
  > 2. Remove the old deployment URL and `REPLIT_DB_URL` lines from `SECRETS.PRIVATE.YAML.example`.
  > 3. Fix the stale Replit text in CLAUDE.md (l.14 "migrating off Replit", l.89 "Replit URL until cutover", l.115 "Replit publishes it manually", l.166 "legacy, until cutover").
  > 4. Update `AI+PROCESS.md`; its snapshot still says "moving".
  > 5. Tick PROJECT.md's "$0 / no Replit dependency" criterion only after the Replit account itself is closed (tracked in conforma).
  > 6. Confirm the ReplDB export in `~/Documents/Backups/ZouZou/` is intact. It's now the only copy.

## Later

- [ ] Simplify the Workers Builds command to `pnpm run build` (install is automatic)
- [ ] `/api` with nothing after it → JSON 404 (add `/api` to `run_worker_first`)
- [ ] Optional: delete the `zz-test` rows from remote D1 (Rob's OK) — now incl. its 2026-09-18 daily
- [ ] Optional: set `workers_dev` / `preview_urls` explicitly in `wrangler.jsonc` (silences deploy warnings)
- [ ] Customise `.claude/commands/project-status.md` for ZouZou (drop the TEMPLATE header; fix the palette and group/priority used in the first page)
- [ ] Maybe: use the kept history (past daily boards, per-player stats); small Worker test suite
- [ ] Maybe: cross-device stats via D1 (`0002` migration recording losses + `/players/{name}/stats`) — only if friends ask
- [ ] Modal a11y: reduced-motion opt-out, dialog role, Escape/backdrop close (`ui.tsx`, all modals)
- [ ] Maybe: auto-pause when the tab is hidden (Pause currently manual only)
- [ ] Maybe: more reward images / dino variety (add via Rex shortlist → Rob approval → `rewards.ts` + `CREDITS.md`)
- [ ] Menu re-reads the cookie on focus/visibility so a tab left open past midnight doesn't show stale "Results"

## Done (recent)

- [x] 2026-09-29 — Personal Stats card on the menu (PR #15); Wren built, Quincy verified
- [x] 2026-09-29 — Daily Reset Board resets the streak (PR #14, Rob)
- [x] 2026-09-29 — Show Reward: 85 approved photos + Fluent 3D dinos, modal scroll fix (PR #13); Rex/Wren/Quincy
- [x] 2026-09-29 — Hearts lost on Top 5 (migration 0003, applied remotely by Rob) + Pause button (PR #12)
- [x] 2026-09-29 — Daily tries + News button (PR #11)
- [x] 2026-09-29 — Merged branches (pause-and-lives, show-reward, personal-stats) and worktrees deleted
- [x] 2026-09-27 — Results + Share (stats tiles, difficulty bars, emoji board share, URL); Wren built, Quincy verified, Rob device-tested; PR #10 merged, live
- [x] 2026-09-24 — Merged branches deleted (feature/critters, cf, replit-deleted); Rob's name grep: only one first name, left in history
- [x] 2026-09-24 — PLAN.md rewritten: "Off Replit" closed → "Settle in"
- [x] 2026-09-24 — Repo made public (Quincy audit, self-host README, MIT LICENSE, grill-me removed; PR #9)
- [x] 2026-09-24 — Rob deleted the Replit project
- [x] 2026-09-18 — Daily-save bug fixed (win popup hidden by "Daily puzzle complete"); PR #6 merged, verified live

---

**Bigger than a session?** Most work doesn't need more than a line here. But if
an item will run for several sessions, has hard out-of-scope boundaries, or will
be driven by `/goal`, copy `optional/subtask.md` to `tasks/<slug>.md` and link
it from the section above:

```
- [ ] Auth migration → tasks/auth-migration.md
```

Don't create the `tasks/` folder until something actually needs it.
