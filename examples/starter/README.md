# Sveltier starter

A SvelteKit app on [Sveltier](https://sveltier.com), ready for you and your coding agent: an app
frame with a navigation drawer, an invoices page (cards, a sortable table that turns into blocks on
a phone, a dialog with a validated form, a toast with Undo), a settings page, and light and dark
mode.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/sveltier/sveltier/tree/main/examples/starter?file=src/routes/%2Bpage.svelte)

## Start locally

```sh
npx degit sveltier/sveltier/examples/starter my-app
cd my-app
npm install
npm run dev
```

## With a coding agent

`AGENTS.md` already points agents at the docs inside `node_modules/@sveltier/ui`, for the version
installed. After an upgrade, run `npx sveltier init` to refresh it; in an app with a `.claude`
folder it also installs the Sveltier skill.

Things to ask your agent, to see how far it gets on its own:

- "Add a Clients page with a table of clients and a link to it in the drawer."
- "Let me filter the invoices by status."
- "Add a date range to the invoices page and show only the invoices due in it."
- "Offer the Maison theme pack next to Monolith, with a menu to switch."

A wrong prop value shows in the console as a `[sveltier SVxxxx]` warning that says how to fix it,
and the agent can act on it.

## What is where

| File                               | What it holds                                        |
| ---------------------------------- | ---------------------------------------------------- |
| `src/routes/+layout.svelte`        | `UIProvider`, the theme pack and the app frame       |
| `src/routes/+page.svelte`          | Invoices: cards, the table, the dialog and the toast |
| `src/routes/settings/+page.svelte` | A settings form                                      |
| `src/routes/ThemeToggle.svelte`    | The light and dark switch, through `useTheme()`      |
| `src/lib/invoices.ts`              | Sample data, to replace with your own                |

Docs: [sveltier.com](https://sveltier.com) · Feedback:
[GitHub Discussions](https://github.com/sveltier/sveltier/discussions/71)
