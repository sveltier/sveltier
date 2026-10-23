# Sveltier

A UI framework for Svelte 5, built the way Vuetify is built for Vue: shared theme, defaults,
density, variants, layout and locale mechanisms, plus a wide set of components. Its design
language, **Engraved Instrument**, is made for premium fintech products.

Smooth, light, luxurious.

> **Status: pre-alpha.** The foundations (packaging, SSR theming, testing) are in place. No
> components are published yet.

## Principles

- **Svelte 5 only**: runes, snippets, callback props, `$bindable`, attachments.
- **Zero runtime dependencies.**
- **SSR first**: no `window` or `document` at import time, and no theme flash on first paint.
- **Accessible by default**: keyboard and ARIA behaviour follow the WAI-ARIA Authoring
  Practices.
- **Overridable CSS**: plain CSS in cascade layers (`sv.tokens`, `sv.base`, `sv.components`,
  `sv.utilities`), so your own styles win without `!important`. Colours are `oklch()` custom
  properties (`--sv-*`).
- **Small**: every entry point has a gzip size budget checked in CI.

## Repository

| Path                | What                                                   |
| ------------------- | ------------------------------------------------------ |
| `packages/sveltier` | The library, built with `svelte-package`               |
| `apps/docs`         | Documentation site (SvelteKit), built with the library |

## Development

Requires Node 22.17+ and pnpm 10.

```sh
pnpm install
pnpm dev     # library in watch mode + docs at http://localhost:5173
pnpm build   # package (svelte-package, publint, attw), then docs
pnpm lint    # Prettier + ESLint
pnpm check   # svelte-check
pnpm test    # Vitest in Chromium, Firefox and WebKit, SSR tests, docs e2e
pnpm size    # gzip size budgets
```

Browser tests need Playwright's browsers once: `pnpm --filter sveltier exec playwright install`.

## License

[MIT](./LICENSE)
