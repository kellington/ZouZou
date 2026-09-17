# AI + Process

## Project Snapshot
*What the project is, who it is for, and what problem it addresses.*

ZouZou & Friends: a browser cat-placement logic puzzle with a shared daily challenge, leaderboard and streaks, built for a small group of friends. Live on Replit since late Aug 2026; moving to Cloudflare.

## The AI Approach
*The practical reasons AI tools or agents were included in this project.*

Personal project with no dev budget: Replit Agent built the game end-to-end from prompts; Claude Code (with the Alice/Rex/Gage/Quincy team) takes over for the migration off Replit.

## How AI Supported the Work
*Where AI helped with planning, design, coding, analysis, testing, documentation, or review.*

## Where Human Judgment Mattered
*The decisions, corrections, constraints, and tradeoffs that required experience and direction.*

## Key Process Decisions
*The important choices that shaped scope, architecture, data, workflow, user experience, or delivery.*

- Contract-first API (OpenAPI → generated Zod + react-query hooks), so the backend can be swapped without touching the client.
- 2026-09-16: research-first migration plan (Rex) stress-tested in a grilling session before any code; decisions logged in DECISIONS.md.
- 2026-09-16: CLAUDE.md + protocol files replace `replit.md` as the agent's memory.

## Quality and Confidence Checks
*How the work was reviewed, tested, validated, simplified, or improved.*

## What Worked Well
*The AI-assisted patterns or workflows that produced useful results.*

## What Needed Caution
*Where AI was weak, misleading, incomplete, overconfident, or required close supervision.*

## Reusable Lessons
*What could be applied to other projects, teams, or client situations.*

## Current Status and Next Steps
*What is complete, what remains, and where the project could go next.*

Game complete and in use. Next: Cloudflare Worker + D1 migration (PLAN.md), then cancel Replit.

## Bottom Line
*The short version: what this project demonstrates about using AI responsibly and practically.*

**LAST UPDATE:** 2026-09-16
