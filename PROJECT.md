# ZouZou & Friends

> A cat-placement logic puzzle in the browser — a daily challenge everyone shares, plus
> endless easy/medium/hard games — for Rob's circle of friends.

## Why this exists

A small, fun daily ritual for a group of friends: one shared puzzle a day, a leaderboard
to compare times, and streaks to keep people coming back. Also a personal build that
exercises AI-assisted development (built with Replit Agent, now maintained with Claude
Code) and serves as a real-world test case for moving small apps off Replit.

## Who it's for

- Primary user: Rob's friends (a handful of players — 4 named players in history as of 2026-09).
- Secondary users: Rob, as builder; SKYresearch `ai-hosting` experiment, as a migration case study.

## Success criteria

- [ ] Friends can open one link on phone or desktop and play the daily puzzle with no sign-up.
- [ ] Shared daily leaderboard and "recent players" are correct, with history preserved.
- [ ] Runs at $0/month on Cloudflare Free with no Replit dependency.
- [ ] Rob can change and deploy it from a Mac with Claude Code (push to `main` → live).

## Non-goals

- Accounts, auth, or anti-cheat beyond a basic rate limit — it's a friends' game.
- Public launch, SEO, growth, monetisation (`X-Robots-Tag: noindex`).
- Native mobile apps.
- Server-side puzzle generation or validation.

## Constraints

- Free tier only (Cloudflare Free: 100k Worker requests/day, D1 100k rows written/day).
- Keep the API contract in `lib/api-spec/openapi.yaml`; client stays contract-generated.
- Stack stays TypeScript / pnpm / React; no rewrite.
- Friends' names are the only personal data — keep exports and backups out of git.

---

*This file changes rarely. If you find yourself editing it often, something
is wrong — either the scope is actually shifting (record that in
DECISIONS.md) or you're putting the wrong content here.*
