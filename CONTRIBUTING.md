# Contributing to Sveltier

Thanks for helping. This guide covers the setup, what a change includes, and how it is checked
and released.

## Setup

You need Node 22.17 or newer and pnpm 10.

```sh
pnpm install
pnpm --filter @sveltier/ui exec playwright install   # browsers for the tests, once
pnpm dev                                             # library in watch mode + docs at http://localhost:5173
```

| Path                | What                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `packages/sveltier` | The library (`@sveltier/ui`), built with `svelte-package`           |
| `apps/docs`         | The docs site (SvelteKit), which also generates the docs for agents |

The docs dev server compiles the library from source, so edits to it reload like app code.

## What a change includes

**Svelte 5 only.** Use runes, snippets, callback props, `$bindable` and attachments. Never use
`export let`, `<slot>`, `on:` directives or `createEventDispatcher`. Check every `.svelte` file
with Svelte's autofixer (`npx @sveltejs/mcp svelte-autofixer <file>`) before you finish.

**One vocabulary.** A component takes the shared props (`variant`, `size`, `density`, `color`,
`rounded`, `disabled`) where they apply, and reads its defaults through `useDefaults`. Do not add
aliases or a second way to do the same thing.

**Types that explain themselves:**

- A literal type is read from a `const` list, `(typeof LIST)[number]`, so a type error lists
  the valid values. A test enforces it.
- Every component exports `<Name>Props`.
- Every public export has TSDoc: a summary, `@default` for defaults, and `@example`. A test
  checks every public props type and function for an `@example`.

**Errors that say how to fix them.** Throw with `sveltierError(code, message)`. Warn in
development through `#dev`, never with a bare `console.warn`. Every code has an entry in
`src/lib/core/errors/codes.ts` and stays stable once released.

**CSS:**

- Styles live in the `sv.*` cascade layers.
- Classes start with `sv-`.
- Use logical properties (`margin-inline`, `padding-block`).
- Colours come only from the theme's `--sv-*` variables; a test fails on any literal colour.
- Animate only `transform` and `opacity`, and respect `prefers-reduced-motion`.
- Figures that line up use `font-variant-numeric: tabular-nums`.

**Accessible by default.** Keyboard and ARIA follow the WAI-ARIA Authoring Practices. Test the
behaviour with real keys, and check the docs pages with axe. Every built-in theme keeps WCAG AA
contrast in light and dark.

**SSR-safe, no dependencies.** Never touch `window` or `document` when a module loads. The
package has no runtime dependencies.

**Small.** Every entry has a gzip budget in `packages/sveltier/size.config.js`, checked by
`pnpm size`. Raising a budget needs a reason in the pull request.

**Documented.** A new component needs:

- a docs page with live examples, linked from the navigation;
- its API table, generated from its types;
- notes on keyboard and accessibility;
- an entry in the docs for agents (`apps/docs/src/lib/docs/llms.ts`).

Code samples must run as written, with their imports.

## Checks

```sh
pnpm build   # package (svelte-package, publint, attw), then the docs and the agent docs
pnpm lint    # Prettier + ESLint
pnpm check   # svelte-check in every workspace
pnpm test    # Vitest in Chromium, Firefox and WebKit, SSR tests, then the docs e2e tests
pnpm size    # gzip size budgets
```

- In browser tests, press keys with `userEvent.keyboard('{Tab}')` rather than `userEvent.tab()`.
- The docs e2e tests include a visual comparison of the component gallery (`/examples/gallery/…`)
  against reference screenshots. The references are Chromium on Linux, made in the Playwright
  image CI uses, and the test is skipped on other systems. When a change alters how components
  look, update them as `apps/docs/e2e/visual.e2e.ts` describes, and look at the new images before
  you commit them.

## Commits and pull requests

- Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) form:
  `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Every pull request that changes the package adds a changeset (`pnpm changeset`). Its front
  matter uses single quotes: `'@sveltier/ui': minor`.
- CI must pass in all three browsers, on the lowest supported Svelte as well as the current one.

## Releases

A release is a pull request that runs `pnpm changeset version`. Once it is merged, CI stages
the new version on npm, and a maintainer approves it with 2FA. See
[Releasing](./README.md#releasing).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
