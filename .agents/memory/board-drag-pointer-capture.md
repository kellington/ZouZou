---
name: Board drag pointer capture
description: Browser pointer-capture timing required to preserve taps alongside drag painting.
---

For board gestures, do not capture the pointer on pointer-down. Wait until movement crosses the drag threshold, then capture it for the rest of the paint gesture.

**Why:** Capturing on the board container at press time retargets the eventual click away from the cell button, so ordinary taps only focus the cell and never run its click handler.

**How to apply:** Any future touch, mouse, or stylus changes to the game board must keep native button targeting until a gesture is confirmed as a drag.