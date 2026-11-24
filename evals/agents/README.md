# Agent evals

Does Sveltier help a coding agent build UI? This eval gives Claude Code ten UI tasks in a new
SvelteKit app with `@sveltier/ui` installed, under different amounts of documentation, and scores
what it builds. Results are published as they come, including the ones that do not flatter the
library.

## Conditions

| Condition | What the agent has                                                                                |
| --------- | ------------------------------------------------------------------------------------------------- |
| `nodocs`  | The package with its docs for agents removed: types (with their TSDoc), `README.md`, nothing else |
| `plain`   | The package as published: `llms.txt`, one Markdown page per component, `components.json`          |
| `init`    | As `plain`, plus the `AGENTS.md` that `npx sveltier init` writes                                  |
| `next`    | As `init`, with changes to the docs for agents that are not released yet                          |

## Tasks

Each task, in [`tasks.mjs`](./tasks.mjs), is a prompt and a Playwright check. The prompt names the
labels and texts the check looks for, so the check reads the page by role and name, whatever code
the agent wrote. The app starts with no `UIProvider`, so every task also tests the setup.

| Task               | Asks for                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| `theme-toggle`     | A heading and a button that switches the app between light and dark         |
| `signup-form`      | A validated sign-up form and a toast on success                             |
| `sortable-table`   | A table of invoices, amounts as currency, sorted by its Amount header       |
| `confirm-dialog`   | A list of files with Delete buttons and a confirmation dialog               |
| `app-shell`        | A top bar, a navigation drawer and three pages, the current link marked     |
| `country-combobox` | A field that searches a list of countries as the user types                 |
| `tabs`             | Three tabs with their panels, moved through with the arrow keys             |
| `date-field`       | A date field limited to one month                                           |
| `row-menu`         | A list of projects, each with an Actions menu that duplicates or deletes it |
| `wallet-undo`      | A balance as currency, a button that spends from it and a toast with Undo   |

## Scores

- **Task works**: the Playwright check passes in the dev server.
- **Type errors and build**: `svelte-check` and `vite build` on the result.
- **Source**: `UIProvider` set up, Svelte 4 syntax, fixed colours, and `var(--sv-…)` names the
  library does not define (they fall back or resolve to nothing, with no error anywhere).
- **Development warnings**: `[sveltier SVxxxx]` messages in the browser console.
- **Effort**: turns, seconds and cost per run, the checks the agent ran and how many failed.

## Isolation

Runs use `claude -p` with no user settings, instruction files, memory, MCP servers or skills
(`--setting-sources project,local`, `claudeMdExcludes` on the user's folder, `--strict-mcp-config`,
`--disable-slash-commands`), no web access, and edits accepted with a short list of shell commands
(`npm`, `npx`, `node` and read-only ones). Anything else is denied, not prompted.

## Run it

Make the base apps once, in a folder outside any project (Claude Code does not read the
instructions of an app under its own temporary folder):

```sh
npx sv create base-plain --template minimal --types ts --no-add-ons --install npm
cd base-plain && npm install @sveltier/ui && git init && git add -A && git commit -m base && cd ..
cp -r base-plain base-init && (cd base-init && npx sveltier init)
cp -r base-plain base-nodocs && rm -r base-nodocs/node_modules/@sveltier/ui/{llms.txt,llms-full.txt,docs,components.json,agents,skills}
```

Then, from this folder:

```sh
node run.mjs --base <folder> --conditions nodocs,plain,init --repeat 3 --parallel 3 --model sonnet
node report.mjs <folder>/runs/<run>/results.json
```

Running the same command with the same `--out` finishes a stopped run. After a check or the scoring
changes, `node rescore.mjs <run folder>` scores the finished runs again without the agent.
