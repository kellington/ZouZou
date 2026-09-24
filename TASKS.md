# Tasks

**Now** is 1–2 items. **Next** is what the agent proposes at the start of a
session. **Later** is a holding pen, not a backlog.

Keep Now + Next under ~10 items between them. Later can breathe, but anything
sitting there untouched across two milestones gets deleted, not re-filed.

When Done gets long, move it to `project/status/` history or drop it — git log
is the real record. Don't let this file become the project's second STATE.md.

## Now


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

## Done (recent)

- [x] 2026-09-24 — Merged branches deleted (feature/critters, cf, replit-deleted); Rob's name grep: only one first name, left in history
- [x] 2026-09-24 — PLAN.md rewritten: "Off Replit" closed → "Settle in"
- [x] 2026-09-24 — Repo made public (Quincy audit, self-host README, MIT LICENSE, grill-me removed; PR #9)
- [x] 2026-09-24 — Rob deleted the Replit project
- [x] 2026-09-18 — Daily-save bug fixed (win popup hidden by "Daily puzzle complete"); PR #6 merged, verified live
- [x] 2026-09-18 — Critter picker (cats/dogs/dinosaurs/monkeys); Quincy PASS; PR #5 merged
- [x] 2026-09-18 — `cf` → `main` (PR #4): README, status page, protocol files
- [x] 2026-09-17 — Phase 1: Mac build (pnpm 10.34.5, overrides removed, vite defaults, index.html noindex)
- [x] 2026-09-17 — Phase 2/2b: Hono worker, D1 schema, transform, wrangler.jsonc, _headers; Quincy PASS
- [x] 2026-09-17 — Phase 2c: Replit code/config/deps removed; Quincy PASS; CLAUDE.md updated
- [x] 2026-09-17 — Phase 3: remote D1 created, migrated, backup imported; PR #3 merged; Workers Builds live
- [x] 2026-09-17 — Phase 4: preview played on desktop + phone
- [x] 2026-09-17 — Phase 5: Always Use HTTPS, custom domain, rate-limit rule, Replit unpublished, friends texted
- [x] 2026-09-17 — Logged 3 migration decisions in DECISIONS.md
- [x] 2026-09-17 — First status page (`project/status/status-2026-09-17.html`, STATUS-SUMMARY.md)
- [x] 2026-09-17 — README rewritten; committed on `cf` (`33eb7b6`)
- [x] 2026-09-16 — Protocol files initialised; Phase 0 ReplDB backup

---

**Bigger than a session?** Most work doesn't need more than a line here. But if
an item will run for several sessions, has hard out-of-scope boundaries, or will
be driven by `/goal`, copy `optional/subtask.md` to `tasks/<slug>.md` and link
it from the section above:

```
- [ ] Auth migration → tasks/auth-migration.md
```

Don't create the `tasks/` folder until something actually needs it.
