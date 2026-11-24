---
name: sveltier
description: Build or change the interface of a Svelte 5 app that uses Sveltier (@sveltier/ui), a UI framework with components, theming and fintech figures. Use it whenever you write or edit .svelte files that import from @sveltier/ui, pick a component or its props, theme the app, or fix a [sveltier SVxxxx] error or warning.
---

# Sveltier

Sveltier is a UI framework for Svelte 5. Its docs for the installed version are in `node_modules/@sveltier/ui`. They match the code the app runs, which your training data may not.

## Before you write

1. Check the setup, which every app needs once: its root layout (`src/routes/+layout.svelte`) wraps everything in `UIProvider` with a theme pack (`<UIProvider themes={monolith}>`, from `@sveltier/ui` and `@sveltier/ui/themes/monolith`). Without it, components render without the theme's styles. If it is missing, add it before anything else.
2. Read `node_modules/@sveltier/ui/llms.txt`. It holds the setup, the conventions every component follows, and an index of the components.
3. Open the page of each component you use: `node_modules/@sveltier/ui/docs/<group>/<page>.md`, such as `docs/forms/text-field.md`. Each page has a working example and every prop with its type and default. `components.json` holds the same data as JSON.
4. Before styling a page, read the app's `DESIGN.md` if it has one: its theme pack's colours, type, space, corners and motion, each with its `--sv-*` variable. `npx sveltier init` writes it for an app on a pack as it ships. An app whose themes are its own (made with `defineTheme`) gets none: read its theme code instead, never a pack's DESIGN.md.
5. Prefer a component to hand-written markup: `Table` for rows and columns, `Amount` and `Delta` for figures, `Select` or `Combobox` for choices, `Form` with fields for input, and `useToast()` for notices.

## While you write

These are the defaults. Where the app's own instructions, or a comment in its code, make an exception (a page that formats its figures by hand, say), keep the exception and do not rewrite it.

- Svelte 5 only: `$state`, `$derived`, `$props`, `$bindable`, snippets and `{@render}`, callback props such as `onclick`. Never write `export let`, `on:click`, `<slot>`, `createEventDispatcher` or `$:`.
- Every component takes the same shared props: `variant`, `size`, `density`, `color` and `rounded`. Set them app-wide with `defaults` on `UIProvider`.
- Style your own elements with `--sv-*` variables (`--sv-color-*`, `--sv-space-*`, `--sv-radius-md`). Never use fixed colours. Spacing is `--sv-space-N`, with N the size in px on a Fibonacci scale: 2, 3, 5, 8, 13, 21, 34, 55, 89, 144. There is no `--sv-space-4` or `--sv-space-16`.
- Components put their content in snippets (`children`, `prepend`, `append`, `actions`), and two-way values use `bind:`.

## After you write

1. Run `npx svelte-check`. Type errors on a prop list its valid values, so pick one of those.
2. Read any message that starts with `[sveltier SVxxxx]`. It names the cause and the fix, and the code is explained at https://sveltier.com/errors.
3. To see what a component should look like in each state, open https://sveltier.com/examples/gallery/light/brand/default. Replace `light` with `dark`, `brand` with `amber`, or `default` with `compact` or `comfortable` for the other pages.
