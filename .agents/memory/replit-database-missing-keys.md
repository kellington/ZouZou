---
name: Replit Database missing keys
description: How the Replit Database Node SDK represents a key that has not been created.
---

Treat an `@replit/database` v3 `get` result with `ok: false` and HTTP status 404 as an absent key, while surfacing every other failed result as a storage error.

**Why:** The SDK documentation implies missing values may return `null`, but the managed store returns a failed 404 result with an empty message for a key that does not exist.

**How to apply:** On reads where a missing key is an expected empty state, branch on status 404 before general error handling. Do not swallow authentication, network, or server failures.