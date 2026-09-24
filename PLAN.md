# Plan

*Last rewritten: 2026-09-24. "Off Replit" (2026-09-16 → 09-24) is complete: Cloudflare Worker + D1
live at `zouzou.minus1over12.com`, history imported, Replit project deleted, repo public (MIT).*

## Current milestone

**Settle in** — ZouZou runs quietly on Cloudflare Free with no surprises for friends, and the
migration's lessons are handed to SKYresearch.

### Definition of done

- [ ] One-week usage check (Worker requests/day, D1 reads/writes, rate-limit hits) vs Free limits.
- [ ] No friend blocked by the rate limit, or the rule raised to 20 req/10 s.
- [ ] Replit leftovers removed (`// @replit` comments, `.example` lines, stale CLAUDE.md / AI+PROCESS.md text).
- [ ] "For SKYresearch" feedback block (plan §11, incl. §11.8–11.10) delivered.

### In scope

- Small fixes and cleanup; docs and protocol-file updates.
- Friend feedback (critter choice, the move).

### Out of scope for this milestone

- New gameplay features; API contract changes.
- Cookie/progress handoff to the new domain (D5), redirect from the old URL (D6).

## Roadmap

1. **Close the Replit account** — once conforma is off it (tracked in the conforma repo); then tick
   PROJECT.md's "$0 / no Replit dependency" criterion.
2. **Maybe** — use the kept history (past daily leaderboards, per-player stats); small test suite for the Worker.

## Open risks

- Rate-limit rule counts GETs; households on one IP could hit 10 req/10 s.
- Previews write to production D1 (accepted, D12).
- The Phase 0 ReplDB export in `~/Documents/Backups/ZouZou/` is the only copy of pre-migration data.
- Public repo + live link: friends' names are reachable via `/api/players/recent` (accepted 2026-09-24).

---

*Overwrite this file at milestone boundaries. Git keeps the history. If a
decision caused the rewrite, log it in DECISIONS.md.*
