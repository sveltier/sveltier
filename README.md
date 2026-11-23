<p align="center">
  <a href="https://sveltier.com">
    <img src="./apps/docs/static/social-card.png" alt="Sveltier: the UI framework for AI coding agents, on Svelte 5" width="100%">
  </a>
</p>

<h1 align="center">Sveltier</h1>

<p align="center">
  <strong>The UI framework for AI coding agents, on Svelte 5.</strong><br>
  60+ accessible, typed components for SvelteKit and Vite, docs generated from the types, and
  errors that say how to fix them.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@sveltier/ui"><img src="https://img.shields.io/npm/v/@sveltier/ui?label=npm&color=cb3837" alt="npm version"></a>
  <a href="https://github.com/sveltier/sveltier/actions/workflows/ci.yml"><img src="https://github.com/sveltier/sveltier/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <img src="https://img.shields.io/badge/Svelte-5-ff3e00?logo=svelte&logoColor=white" alt="Svelte 5">
  <img src="https://img.shields.io/badge/TypeScript-typed-3178c6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/dependencies-0-2ea44f" alt="Zero runtime dependencies">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/sveltier/sveltier?color=blue" alt="MIT license"></a>
</p>

<p align="center">
  <a href="https://sveltier.com">Docs</a> ·
  <a href="https://sveltier.com/getting-started/quick-start">Quick start</a> ·
  <a href="https://sveltier.com/components/button">Components</a> ·
  <a href="https://sveltier.com/tools/playground">Playground</a> ·
  <a href="https://sveltier.com/tools/theme-builder">Theme builder</a> ·
  <a href="https://sveltier.com/llms.txt">llms.txt</a> ·
  <a href="https://github.com/sveltier/sveltier/discussions">Discussions</a>
</p>

---

## Why Sveltier

Coding agents do not remember your UI library, cannot see the screen, and learn by running the
code and fixing what breaks. Sveltier is built around those three facts, and the same choices make
it easier for every developer.

- **The right docs, for the version installed.** `llms.txt`, `llms-full.txt`, one Markdown page per
  component and `components.json` ship inside the package, generated from the TypeScript types.
  An agent reads the API it has, not a guess from its training data.
- **Right the first time.** `variant`, `size`, `density`, `color` and `rounded` mean the same thing on
  every component, as literal types: a value that does not exist is a type error that lists the
  ones that do. Every public type and function has an `@example`.
- **Self-correcting.** Every library error has a stable code, says what happened and what to do, and
  links to its entry in the docs. Development builds also warn about the mistakes types cannot
  catch, such as a value from an API that got past them:

  ```text
  [sveltier SV2002] <Button> got variant="primary". Valid values: 'elevated' | 'flat' | 'tonal' |
  'outlined' | 'text' | 'plain'. To colour it, use color="primary". https://sveltier.com/errors#SV2002
  ```

- **Accessible without being asked.** Roles, focus and keyboard follow the WAI-ARIA Authoring
  Practices, tested in Chromium, Firefox and WebKit. Every built-in theme passes WCAG AA contrast
  in light and dark.

## Quick start

```sh
npm install @sveltier/ui
```

Wrap the app once in `UIProvider` with a theme pack (in SvelteKit, the root layout; with Vite
alone, `App.svelte`):

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	let { children } = $props();
</script>

<UIProvider themes={monolith}>
	{@render children()}
</UIProvider>
```

Then use the components anywhere inside it:

```svelte
<script>
	import { Button, TextField } from '@sveltier/ui';
	let email = $state('');
</script>

<TextField label="Email" type="email" required bind:value={email} />
<Button variant="tonal">Save</Button>
```

Requires Svelte 5.40 or later. See the [installation guide](https://sveltier.com/getting-started/installation)
for SvelteKit, Vite, fonts and server-side rendering.

## For AI coding agents

```sh
npx sveltier init
```

Points the app's `AGENTS.md` (and `CLAUDE.md`, if there is one) at the docs of the installed
version, and installs the Sveltier skill where the app has a `.claude` folder. Agents then read:

| File                                         | What it holds                                          |
| -------------------------------------------- | ------------------------------------------------------ |
| `node_modules/@sveltier/ui/llms.txt`         | Setup, conventions and an index of the components      |
| `node_modules/@sveltier/ui/docs/…/<page>.md` | One page per component, with an example and every prop |
| `node_modules/@sveltier/ui/components.json`  | The same props as JSON                                 |

On the web: [llms.txt](https://sveltier.com/llms.txt), [llms-full.txt](https://sveltier.com/llms-full.txt)
and the [error codes](https://sveltier.com/errors).

## What is inside

| Group          | Components                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**     | AppLayout, AppBar, NavigationDrawer, Main, AppFooter, BottomNavigation, Container, Row, Col                                                                                                               |
| **Components** | Accordion, Alert, Avatar, Badge, Breadcrumbs, Button, ButtonGroup, Card, Chip, Divider, Icon, List, Pagination, Progress, SegmentedControl, Skeleton, Stepper, Table, Tabs, Timeline, Tree                |
| **Forms**      | Form, Field, TextField, Textarea, FileField, NumberField, NativeSelect, Select, Combobox, Checkbox, Switch, RadioGroup, Slider, OtpInput, Calendar, DatePicker, DateRangePicker, TimeField, DateTimeField |
| **Overlays**   | Dialog, Sheet, Popover, Menu, ContextMenu, CommandPalette, Tooltip, toasts (`useToast`)                                                                                                                   |
| **Finance**    | Amount, Delta, Odometer, PriceInput, AmountInput, Ledger, Receipt, PinPad, SecureMask, Guilloche                                                                                                          |
| **Primitives** | Focus trap, roving focus, dismissable layers, portal, anchored positioning, typeahead, motion, virtual lists                                                                                              |

Forms validate with the HTML constraints first, then your own rules. Overlays open in the
browser's top layer. Tables sort, pin a column, and show their rows as blocks on a phone.

## Theming

Five built-in theme packs, each in light and dark: **Monolith** (the default), **Heritage**,
**Aurora**, **Maison** and **Milano**. Themes switch with no flash on first paint, server-rendered
included. Build your own with `defineTheme` or the [theme builder](https://sveltier.com/tools/theme-builder).

Colours are `oklch()` custom properties (`--sv-*`), and all CSS lives in cascade layers
(`sv.tokens`, `sv.base`, `sv.components`, `sv.utilities`), so your own styles win without
`!important`.

## Fast by default

- **Zero runtime dependencies.**
- A gzip **size budget on every entry**, checked in CI: import one component and you ship it and what it uses, nothing else.
- **SSR-first**: layouts render on the server as they stay, with nothing measured on the client.
- **Svelte 5 only**: runes, snippets, callback props, `$bindable` and attachments, no legacy syntax.

## Status

Sveltier is at **0.x**. Patch releases do not break your code. A breaking change comes in a minor
version (0.2, 0.3), with upgrade notes in the [changelog](./packages/sveltier/CHANGELOG.md).

## Contributing

Tried it? [Tell us what worked and what got in your way](https://github.com/sveltier/sveltier/discussions/71), or
[show what you built](https://github.com/sveltier/sveltier/discussions/72). Issues and pull requests
are welcome too: [CONTRIBUTING.md](./CONTRIBUTING.md) covers the setup, the checks and the
conventions a change follows.

## License

[MIT](./LICENSE)
