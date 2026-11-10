---
'@sveltier/ui': patch
---

The docs for coding agents lead with the app's one-time setup. The `AGENTS.md` block that `npx sveltier init` writes opened with "This app's interface is built with Sveltier", which agents took to mean the app was already set up: in tests with a coding agent, a quarter of the pages written with the block in place had no `UIProvider`, so they rendered without the theme, and nothing failed. The block, the skill and `llms.txt` now say first that the root layout wraps everything in `UIProvider` with a theme pack, with the code, and to check it is there before building a page. Each Markdown page in the package names it too, for an agent that reads one page and nothing else.
