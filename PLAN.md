# Plan

*Last rewritten: 2026-09-16*

## Current milestone

**Off Replit** — ZouZou runs as one Cloudflare Worker (static assets + Hono API + D1) at
`zouzou.minus1over12.com`, with all leaderboard/player history imported and Replit unpublished.

Detailed steps, schema, config and gates:
`../../SKYideas/SKYresearch/experiments/ai-hosting/notes/zouzou-migration-plan-2026-09-16.md`.

### Definition of done

- [ ] Phase 1: `cf` branch; Repl git state matches `fcf2467`; Replit platform overrides removed; `pnpm@10.34.5`; local Mac build passes.
- [ ] Phase 2: `artifacts/worker` (Hono + D1), `0001_init.sql`, root `wrangler.jsonc`, `_headers`; transform script tested on backup against local D1.
- [ ] Phase 2b: `wrangler dev` checklist passes (all 5 endpoints, SPA fallback, Edmonton date); Quincy signs off.
- [ ] Phase 2c: Replit-only files/deps deleted (list shown to Rob first); rebuild + smoke pass.
- [ ] Phases 3–4: D1 created, Workers Builds connected, custom domain + Always Use HTTPS + rate-limit rule live.
- [ ] Phase 5: fresh ReplDB export imported and verified against counts; Replit unpublished; friends messaged.
- [ ] "For SKYresearch" feedback block (plan §11) delivered.

### In scope

- New `artifacts/worker` package, D1 schema + import, root `wrangler.jsonc`, `_headers`.
- Removing Replit-specific code, config and deps (plan §1.2).
- Protocol files / CLAUDE.md replace `replit.md` as the agent instructions.

### Out of scope for this milestone

- Gameplay or UI changes; API contract changes.
- Cookie/progress handoff to the new domain (D5), redirect from the old URL (D6).
- Tests beyond the Phase 2b checklist.

## Roadmap

1. **Settle in** — one week on Cloudflare: check usage vs Free limits, rate-limit false positives, fix the `index.html` "built on Replit" meta description.
2. **Cancel Replit** — after pickem's mid-season move (~Oct–Nov 2026).
3. **Maybe** — use the kept history (past daily leaderboards, per-player stats); small test suite for the Worker.

## Open risks

- Workers Builds + pnpm version / `minimumReleaseAge` behaviour unverified (plan §9.1).
- Repl KV may be unreadable after unpublish — safety export first (plan §9.2).
- Rate-limit rule counts GETs; households on one IP could hit 10 req/10 s.
- Previews write to production D1 (accepted, D12).

---

*Overwrite this file at milestone boundaries. Git keeps the history. If a
decision caused the rewrite, log it in DECISIONS.md.*
