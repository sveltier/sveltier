---
'@sveltier/ui': patch
---

The code samples in the packed docs (`llms-full.txt`, `docs/*.md`) are compiled before each release, so each one runs as written when copied alone: every sample imports what it uses and declares the values it reads. Samples that leaned on names they never defined (an icon path, a `user`, a `loading` flag, the page's own components) now define them, and a few JavaScript samples are TypeScript where they need types. The `keymap` sample uses block bodies, since a handler that returns a value other than `false` does not fit `KeyHandler`. The samples are indented with tabs, as Prettier and `sv create` write them.
