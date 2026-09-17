# Tasks

**Now** is 1–2 items. **Next** is what the agent proposes at the start of a
session. **Later** is a holding pen, not a backlog.

Keep Now + Next under ~10 items between them. Later can breathe, but anything
sitting there untouched across two milestones gets deleted, not re-filed.

When Done gets long, move it to `project/status/` history or drop it — git log
is the real record. Don't let this file become the project's second STATE.md.

## Now

- [ ] Commit protocol files (Rob's OK) and decide branch path to `cf`
- [ ] Move backup `~/Downloads/zouzou-repldb-2026-09-17.json` → `~/Documents/Backups/ZouZou/`

## Next

Migration phases — detail in the SKYresearch plan §4.

- [ ] Phase 1: `cf` branch; Repl `git log -1; git status` vs `fcf2467`; pnpm 10.34.5; overrides diff → lockfile; `PORT`/`BASE_PATH` defaults; Mac build
- [ ] Phase 2: `artifacts/worker` (Hono + D1), migration SQL, `wrangler.jsonc`, `_headers`, transform script → local D1 (Gage)
- [ ] Phase 2b: `wrangler dev` checklist (Quincy)
- [ ] Phase 2c: delete Replit-only files/deps (show list first); rebuild + smoke
- [ ] Phases 3–5: D1 create, Workers Builds, domain, Always Use HTTPS, rate-limit rule, final export/import, unpublish Replit, message friends
- [ ] "For SKYresearch" block (plan §11)

## Later

- [ ] Replace "built on Replit" meta description in `artifacts/zouzou-friends/index.html`
- [ ] Customise `.claude/commands/project-status.md` for ZouZou
- [ ] Rewrite `README.md` for the Cloudflare setup (after cutover)
- [ ] Cancel Replit after pickem moves (~Oct–Nov 2026)

## Done (recent)

- [x] 2026-09-16 — Protocol files initialised; CLAUDE.md replaces `replit.md`
- [x] 2026-09-16 — Phase 0 ReplDB backup (5 keys, 4 players, 62 games)

---

**Bigger than a session?** Most work doesn't need more than a line here. But if
an item will run for several sessions, has hard out-of-scope boundaries, or will
be driven by `/goal`, copy `optional/subtask.md` to `tasks/<slug>.md` and link
it from the section above:

```
- [ ] Auth migration → tasks/auth-migration.md
```

Don't create the `tasks/` folder until something actually needs it.
