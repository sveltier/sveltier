---
'@sveltier/ui': patch
---

The docs for coding agents (the `AGENTS.md` that `npx sveltier init` writes, the Sveltier skill and `llms.txt`) list the spacing scale, `--sv-space-2` to `--sv-space-144`. Agents that saw only `--sv-space-*` wrote `--sv-space-4` and `--sv-space-6`, which do not exist, so their spacing fell back or vanished.
