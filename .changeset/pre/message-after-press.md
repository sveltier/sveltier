---
'@sveltier/ui': patch
---

A field's message no longer swallows the click of a button below it. When the user changed a field with no hint and then pressed a button under it, the press took focus away, the message added a line under the field, and the button moved before the release, so the click landed elsewhere. When a press takes focus away, the message now waits for its click (or, for a press that makes no click, a moment after the release). Leaving by the keyboard shows it at once, as before.
