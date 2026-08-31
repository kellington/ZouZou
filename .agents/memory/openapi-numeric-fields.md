---
name: OpenAPI numeric fields
description: Why API numeric values avoid the OpenAPI integer type in this workspace.
---

Use bounded `number` schemas rather than `integer` for API values that pass through the current Orval/Zod generation pipeline, and enforce whole-number semantics at the server boundary when needed.

**Why:** The current generator emits `zod.int()` for OpenAPI integers, but the workspace Zod runtime does not expose that API, causing generated-library typechecks to fail.

**How to apply:** For new numeric request or response fields, use `type: number` with appropriate bounds, regenerate clients, and add `Number.isInteger` validation in the route when fractional values are invalid.