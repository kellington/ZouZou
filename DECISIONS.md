# Decisions

Append-only log of meaningful decisions. Never edit past entries — if a
decision is reversed, add a new entry that references the old one.

## How to write an entry

```
## [YYYY-MM-DD] — Short title

**Decision:** What we decided, in one sentence.
**Why:** The reasoning that drove it.
**Trade-off:** What we're giving up.
**Impact:** What changes because of this (code, scope, process).
```

Keep entries short. If you need more than ~8 lines, you're probably
writing a design doc, which belongs elsewhere.

---

## [2026-09-16] — Move off Replit to Cloudflare Worker + D1

**Decision:** One Worker `zouzou` serves the Vite build as static assets and `/api/*` via Hono on D1, at `zouzou.minus1over12.com`; full data import; Replit unpublished at cutover, never rolled back to.
**Why:** $0 on Free; ReplDB is the only real lock-in; KV list limits and eventual consistency don't fit the polling + read-modify-write API; D1 keeps full history.
**Trade-off:** Friends' cookie progress (streaks, best times, name) restarts on the new domain; previews share production D1; Free rate-limit rule can only match path.
**Impact:** New `artifacts/worker`, root `wrangler.jsonc`, Replit-only code deleted on `cf`. Full decision table D1–D13: SKYresearch `ai-hosting/notes/zouzou-migration-plan-2026-09-16.md` §8.

## [2026-09-16] — CLAUDE.md replaces replit.md as the agent file

**Decision:** Claude Code with the protocol files (CLAUDE.md + PROJECT/PLAN/STATE/TASKS/DECISIONS) is the agent setup; `replit.md` becomes a pointer and is deleted with the other Replit files.
**Why:** Development moves to the Mac ahead of the Cloudflare migration; `replit.md` was template placeholders and described a Postgres DB the app doesn't use.
**Trade-off:** Replit Agent loses its project context if used again before cutover.
**Impact:** Gotchas from `.agents/memory/` copied into CLAUDE.md Known gotchas.

## [2026-09-17] — Skip final ReplDB export/re-import (plan 5d/5e)

**Decision:** Cut over using the Phase 0 backup import; no final export or re-import.
**Why:** Rob checked the live Replit API against the backup — no new games.
**Trade-off:** Any game posted between the check and the unpublish is lost.
**Impact:** D1 holds 62 games / 4 players / 25 daily rows from the backup.

## [2026-09-17] — Keep the zz-test row in production D1

**Decision:** Leave the one zz-test daily game from preview testing in D1.
**Why:** Rob's choice; harmless, and deleting needs a remote write.
**Trade-off:** zz-test shows in "Recent players" indefinitely.
**Impact:** Deletion stays an optional Later task.

## [2026-09-17] — D1 created and imported before the cf → main merge

**Decision:** Remote D1 was created, migrated and imported before merging, not in the plan §4 order.
**Why:** Production D1 needed data before Workers Builds went live on main.
**Trade-off:** Diverges from the documented plan order.
**Impact:** PLAN.md / SKYresearch plan need the actual order noted.
