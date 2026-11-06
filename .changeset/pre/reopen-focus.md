---
'@sveltier/ui': patch
---

A Popover or Menu opened again while it is still closing now takes focus again, as it does when it first opens: the panel that comes back is the same one, and focus used to stay on the trigger.
