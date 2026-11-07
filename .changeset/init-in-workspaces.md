---
'@sveltier/ui': patch
---

`npx sveltier init` works for an app in a folder of a workspace, such as `web/` in a pnpm workspace. Run in the app's folder, it finds the repository root above it (the first folder with `.git` or `pnpm-workspace.yaml`, below the home folder):

- the app's `AGENTS.md` says which folder its paths are relative to;
- the root's `CLAUDE.md` imports it (`@web/AGENTS.md`);
- the skill goes in the root's `.claude`, with its paths written from there (`web/node_modules/@sveltier/ui/…`).

A package hoisted to the workspace root is found too. A skill that is already up to date is left as it is. The block's rules now say they give way to the app's own instructions, so agents keep a page's deliberate exceptions.
