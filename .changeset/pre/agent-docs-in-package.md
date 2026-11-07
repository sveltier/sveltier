---
'@sveltier/ui': minor
---

The package now carries its docs for coding agents, generated from its types for this very version:

- `llms.txt`: setup, conventions and an index, linking the pages below.
- `llms-full.txt`.
- `docs/<group>/<page>.md`: one page per component and primitive, with an example and every prop.
- `components.json`: the same props as JSON.

New command: `npx sveltier init`. It writes a Sveltier section into the app's `AGENTS.md` that points at those files; later runs replace it in place. If the app has a `CLAUDE.md`, it imports `AGENTS.md` there too. If the app has a `.claude` folder, it installs the Sveltier skill.
