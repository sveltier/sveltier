---
'@sveltier/ui': minor
---

**Breaking:** an Accordion item names its header with `label`, as a tab does, instead of `title`. `title` does nothing now and warns in development (SV4008) with the new name. Timeline items keep `title`: theirs is a heading.
