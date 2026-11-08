// Code samples for the theming pages.
// Svelte and TypeScript samples are files in ../examples that svelte-check compiles, shown with
// ?raw. What stays a string cannot be checked as a file of its own: shell, CSS, HTML, a
// signature, a route file, or two files in one block.

export const install = {
	pnpm: 'pnpm add @sveltier/ui',
	npm: 'npm install @sveltier/ui',
	yarn: 'yarn add @sveltier/ui',
	bun: 'bun add @sveltier/ui'
};

export { default as setup } from '../examples/theme/Setup.svelte?raw';

export const viteSetup = `// src/main.ts (Vite without SvelteKit)
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });

<!-- src/App.svelte -->
<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
</script>

<UIProvider themes={monolith}>
  <h1>Hello</h1>
</UIProvider>`;

export { default as pack } from '../examples/theme/Pack.svelte?raw';

export { default as severalPacks } from '../examples/theme/SeveralPacks.svelte?raw';

export { default as toggle } from '../examples/theme/Toggle.svelte?raw';

export { default as nested } from '../examples/theme/Nested.svelte?raw';

export { default as bindTheme } from '../examples/theme/BindTheme.svelte?raw';

export { default as fonts } from '../examples/theme/Fonts.svelte?raw';

export const cookie = `<!-- src/routes/+layout.svelte -->
<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  let { data, children } = $props();
  let theme = $state(data.theme ?? 'system');

  // Mirror the choice into a cookie so the server can render it next time.
  $effect(() => {
    document.cookie = \`theme=\${theme}; path=/; max-age=31536000; samesite=lax\`;
  });
</script>

<UIProvider themes={monolith} bind:theme storageKey={false}>
  {@render children()}
</UIProvider>

// src/routes/+layout.server.ts
export const load = ({ cookies }) => ({ theme: cookies.get('theme') });`;

export const csp = `<UIProvider themes={monolith} nonce={data.cspNonce}>…</UIProvider>

// or allow the restore script by hash
import { themeScript, monolith } from '@sveltier/ui';
const script = themeScript('sv-theme', ['system', ...Object.keys(monolith)]);
// sha256 of \`script\` goes into script-src`;

export { default as defineCustom } from '../examples/theme/defineCustom.ts?raw';

export { default as extendPack } from '../examples/theme/extendPack.ts?raw';

export { default as checkContrast } from '../examples/theme/checkContrast.ts?raw';

export const contractCss = `.my-card {
  border-radius: var(--sv-radius-xl);
  font-family: var(--sv-font-ui);
  box-shadow: inset 0 1px 0 var(--sv-bevel), var(--sv-shadow);
  transition: transform var(--sv-duration-normal) var(--sv-ease);
}

.my-card h2 {
  font: var(--sv-weight-display) var(--sv-text-title) / var(--sv-leading-snug)
    var(--sv-font-display);
  letter-spacing: var(--sv-tracking-display);
}`;

export const tonal = `.badge {
  --c: var(--sv-color-success);
  background: color-mix(in oklch, var(--c) var(--sv-tonal-wash), transparent);
  color: color-mix(in oklch, var(--c) var(--sv-tonal-text-mix), var(--sv-color-text));
}`;

export const override = `/* Your styles are unlayered, so they win over every Sveltier layer
   without !important. */
.sv-theme-provider--background {
  padding: var(--sv-space-34);
}`;

/** Usage of one theme pack, for its page. */
export const packUsage = (id: string): string => `<script>
  import { UIProvider } from '@sveltier/ui';
  import { ${id} } from '@sveltier/ui/themes/${id}';
  let { children } = $props();
</script>

<UIProvider themes={${id}}>
  {@render children()}
</UIProvider>`;

export const goldenSplit = `/* 61.8% / 38.2% of the space left after the gap. */
.split {
  display: grid;
  grid-template-columns: minmax(0, 1.618fr) minmax(0, 1fr);
  gap: var(--sv-space-21);
}

/* The same split as a width. */
.aside {
  inline-size: var(--sv-golden-minor);
}`;
