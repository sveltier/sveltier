---
name: sveltier
description: Build or change the interface of a Svelte 5 app that uses Sveltier (@sveltier/ui), a UI framework with components, theming and fintech figures. Use it whenever you write or edit .svelte files that import from @sveltier/ui, pick a component or its props, theme the app, or fix a [sveltier SVxxxx] error or warning.
---

# Sveltier

Sveltier is a UI framework for Svelte 5. Its docs for the installed version are in `node_modules/@sveltier/ui`. They match the code the app runs, which your training data may not.

## Before you write

1. Read `node_modules/@sveltier/ui/llms.txt`. It holds the setup, the conventions every component follows, and an index of the components.
2. Open the page of each component you use: `node_modules/@sveltier/ui/docs/<group>/<page>.md`, such as `docs/forms/text-field.md`. Each page has a working example and every prop with its type and default. `components.json` holds the same data as JSON.
3. Prefer a component to hand-written markup: `Table` for rows and columns, `Amount` and `Delta` for figures, `Select` or `Combobox` for choices, `Form` with fields for input, and `useToast()` for notices.

## While you write

- Svelte 5 only: `$state`, `$derived`, `$props`, `$bindable`, snippets and `{@render}`, callback props such as `onclick`. Never write `export let`, `on:click`, `<slot>`, `createEventDispatcher` or `$:`.
- Every component takes the same shared props: `variant`, `size`, `density`, `color` and `rounded`. Set them app-wide with `defaults` on `UIProvider`.
- Style your own elements with `--sv-*` variables (`--sv-color-*`, `--sv-space-*`, `--sv-radius-md`). Never use fixed colours.
- Components put their content in snippets (`children`, `prepend`, `append`, `actions`), and two-way values use `bind:`.

## After you write

1. Run `npx svelte-check`. Type errors on a prop list its valid values, so pick one of those.
2. Read any message that starts with `[sveltier SVxxxx]`. It names the cause and the fix, and the code is explained at https://sveltier.com/errors.
3. To see what a component should look like in each state, open https://sveltier.com/examples/gallery/light/brand/default. Replace `light` with `dark`, `brand` with `amber`, or `default` with `compact` or `comfortable` for the other pages.
