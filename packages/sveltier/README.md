# Sveltier

The UI framework for AI coding agents, on Svelte 5.

Coding agents do not remember your library, cannot see the screen, and learn by running and
fixing. Sveltier is designed around all three, and the same choices help every developer.

- **Finds the right information.** Props tables, `llms.txt` and `llms-full.txt` are generated
  from the TypeScript types, and the typed sources ship in this package. An agent reads the API
  of the version it installed, not a guess from its training data.
- **Gets it right the first time.** `variant`, `size`, `density`, `color` and `rounded` mean the
  same thing on every component, as literal types: a value that does not exist is a type error
  that lists the ones that do.
- **Fixes itself when wrong.** Every error has a stable code, says what happened and what to do,
  and links to its entry in the docs. Development builds also warn about mistakes that types
  cannot catch.
- **Accessible without being asked.** Roles, focus and keys follow the WAI-ARIA Authoring
  Practices, tested in Chromium, Firefox and WebKit.

> **Alpha.** The API may still change between releases.

## Install

```sh
npm install sveltier
```

Svelte 5.40 or later is required.

## Set up

Wrap the app in `UIProvider` with a theme pack, then use the components anywhere inside it.

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { UIProvider } from 'sveltier';
	import { monolith } from 'sveltier/themes/monolith';
	let { children } = $props();
</script>

<!-- Monolith, light or dark following the OS -->
<UIProvider themes={monolith}>
	{@render children()}
</UIProvider>
```

```svelte
<script>
	import { Button, TextField } from 'sveltier';
	let email = $state('');
</script>

<TextField label="Email" type="email" required bind:value={email} />
<Button variant="tonal">Save</Button>
```

Fonts are not bundled: each theme names its families and falls back to system fonts. See
[Fonts](https://sveltier.com/getting-started/fonts).

## What is inside

- **Components:** Alert, Avatar, Badge, Button, ButtonGroup, Card, Chip, Divider, Icon, List,
  ProgressCircular, ProgressLinear, SegmentedControl, Skeleton, Tabs.
- **Forms:** Form, Field, TextField, Textarea, NumberField and NativeSelect, validated by the
  HTML constraints first, then your rules.
- **Primitives** for your own components: focus trap, roving focus, dismissable layers, portal,
  inert background and scroll lock, anchored positioning, keyboard maps and typeahead, motion,
  virtual lists.
- **Theme engine:** five built-in theme packs (Monolith, Heritage, Aurora, Maison and Milano),
  each in light and dark, with flash-free server rendering. Define your own with `defineTheme`.
- **Zero runtime dependencies,** and a gzip size budget on every entry.

## Docs

- [sveltier.com](https://sveltier.com)
- For agents: [llms.txt](https://sveltier.com/llms.txt) and
  [llms-full.txt](https://sveltier.com/llms-full.txt)
- [Error codes](https://sveltier.com/errors)

## License

[MIT](./LICENSE)
