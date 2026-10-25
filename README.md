# Sveltier

The UI framework for AI coding agents, on Svelte 5: one typed vocabulary across every component,
docs generated from the types, and errors that say how to fix them. Accessible, consistent and
polished by default, with five built-in design languages behind one theme engine.

> **Status: alpha.** Install it with `npm install @sveltier/ui`. The API may still change between
> releases.

- Docs: [sveltier.com](https://sveltier.com)
- For agents: [llms.txt](https://sveltier.com/llms.txt) and
  [llms-full.txt](https://sveltier.com/llms-full.txt)
- What the package offers and how to set it up: [packages/sveltier](./packages/sveltier#readme)

## Principles

- **Built for agents**: props tables and `llms.txt` come from the TypeScript types, shared props
  are literal types whose errors list the valid values, and every library error has a stable
  code and a fix.
- **Fast**: zero runtime dependencies, a gzip size budget on every entry checked in CI, and
  flash-free server rendering.
- **Predictable**: Svelte 5 only (runes, snippets, callback props, `$bindable`, attachments),
  one prop vocabulary across components, and a typed theme contract.
- **Accessible by default**: keyboard and ARIA behaviour follow the WAI-ARIA Authoring
  Practices; every built-in theme passes WCAG contrast checks in light and dark.
- **Overridable CSS**: plain CSS in cascade layers (`sv.tokens`, `sv.base`, `sv.components`,
  `sv.utilities`), so your own styles win without `!important`. Colours are `oklch()` custom
  properties (`--sv-*`).

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

Browser tests need Playwright's browsers once: `pnpm --filter @sveltier/ui exec playwright install`.

## Releasing

Bump `version` in `packages/sveltier/package.json` in a pull request. Once it is merged, run the
**Release** workflow on `main` (Actions > Release > Run workflow). It builds and tests the package,
then stages it on npm with trusted publishing, so no npm token is stored and npm signs provenance.
The version goes public once a maintainer approves it with 2FA, on npmjs.com (Staged Packages) or
with `npm stage approve <stage-id>`.

## License

[MIT](./LICENSE)
