---
'@sveltier/ui': patch
---

`npx sveltier init` installs one copy of the skill. In a workspace whose root and app folder both have a `.claude`, it went into both, and agents saw two Sveltier skills. It now goes in the root's `.claude`, or the app's when the root has none, and init names a copy an earlier run left in the app's folder.
