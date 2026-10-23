# Sveltier

A UI framework for Svelte 5: one shared system for theme, defaults, density, variants, layout
and locale, a wide set of components built on it, and five built-in design languages you
switch with one line. Made to be written quickly and correctly, by developers and by AI coding
agents.

> **Status: pre-alpha.** The foundations (packaging, SSR theming, the theme engine and its five
> themes, testing) are in place. Components come next.

## Principles

- **Fast**: zero runtime dependencies, a gzip size budget on every entry checked in CI, and
  flash-free server rendering.
- **Predictable**: Svelte 5 only (runes, snippets, callback props, `$bindable`, attachments),
  one prop vocabulary across components, strict types, a typed theme contract, and errors
  that say how to fix them.
- **Accessible by default**: keyboard and ARIA behaviour follow the WAI-ARIA Authoring
  Practices; every built-in theme passes WCAG contrast checks in light and dark.
- **Overridable CSS**: plain CSS in cascade layers (`sv.tokens`, `sv.base`, `sv.components`,
  `sv.utilities`), so your own styles win without `!important`. Colours are `oklch()` custom
  properties (`--sv-*`).

## Themes

| Theme        | Character                                                                    |
| ------------ | ---------------------------------------------------------------------------- |
| **Monolith** | Quiet luxury with Swiss precision: monochrome, Geist. The one to start with. |
| **Heritage** | Private banking, editorial: ivory, Oxford navy and brass, Instrument Serif   |
| **Aurora**   | Modern depth, dark first: frosted panels over an iris and mint glow          |
| **Maison**   | Parisian couture house: noir, off-white, Bordeaux, Cormorant Garamond        |
| **Milano**   | Milanese design: cashmere, espresso, Siena terracotta, Bodoni Moda           |

Each comes in light and dark and sets type, shape, depth and motion as well as colour.

```svelte
<script>
	import { ThemeProvider } from 'sveltier';
	import { maison } from 'sveltier/themes/maison';
	let { children } = $props();
</script>

<ThemeProvider themes={maison}>
	{@render children()}
</ThemeProvider>
```

Fonts are not bundled; each theme lists its families and falls back to system fonts.

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
