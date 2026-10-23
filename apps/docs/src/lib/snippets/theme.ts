// Code samples shown in the docs. Kept in a .ts module because a literal closing script tag
// cannot appear inside a Svelte <script> block.

export const install = {
	pnpm: 'pnpm add sveltier',
	npm: 'npm install sveltier',
	yarn: 'yarn add sveltier',
	bun: 'bun add sveltier'
};

export const setup = `<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeProvider } from 'sveltier';
  import { monolith } from 'sveltier/themes/monolith';
  let { children } = $props();
</script>

<!-- Monolith, light or dark following the OS -->
<ThemeProvider themes={monolith}>
  {@render children()}
</ThemeProvider>`;

export const viteSetup = `// src/main.ts (Vite without SvelteKit)
import { mount } from 'svelte';
import App from './App.svelte';

mount(App, { target: document.getElementById('app')! });

<!-- src/App.svelte -->
<script>
  import { ThemeProvider } from 'sveltier';
  import { monolith } from 'sveltier/themes/monolith';
</script>

<ThemeProvider themes={monolith}>
  <h1>Hello</h1>
</ThemeProvider>`;

export const pack = `<script>
  import { ThemeProvider } from 'sveltier';
  import { maison } from 'sveltier/themes/maison';
  let { children } = $props();
</script>

<ThemeProvider themes={maison}>
  {@render children()}
</ThemeProvider>`;

export const severalPacks = `<script>
  import { ThemeProvider, monolith, milano } from 'sveltier';
</script>

<!-- "system" switches between monolith-light and monolith-dark;
     users can also pick milano-light or milano-dark -->
<ThemeProvider themes={{ ...monolith, ...milano }}
  light="monolith-light" dark="monolith-dark">
  …
</ThemeProvider>`;

export const toggle = `<script>
  import { useTheme } from 'sveltier';
  const theme = useTheme();
</script>

<button type="button" onclick={() => theme.toggle()}>
  {theme.isDark ? 'Light' : 'Dark'}
</button>`;

export const nested = `<ThemeProvider themes={monolith}>
  <p>The page follows the user's choice.</p>

  <ThemeProvider theme="monolith-dark" withBackground class="card">
    <p>This card is always dark.</p>
  </ThemeProvider>
</ThemeProvider>`;

export const bindTheme = `<script>
  import { ThemeProvider } from 'sveltier';
  import { monolith } from 'sveltier/themes/monolith';
  let theme = $state('system');
</script>

<ThemeProvider themes={monolith} bind:theme>…</ThemeProvider>
<p>Current choice: {theme}</p>`;

export const fonts = `<!-- src/routes/+layout.svelte -->
<script>
  import '@fontsource-variable/geist';
  import '@fontsource-variable/geist-mono';
  import { ThemeProvider } from 'sveltier';
  import { monolith } from 'sveltier/themes/monolith';
  let { children } = $props();
</script>

<ThemeProvider themes={monolith}>{@render children()}</ThemeProvider>`;

export const cookie = `<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeProvider } from 'sveltier';
  import { monolith } from 'sveltier/themes/monolith';
  let { data, children } = $props();
  let theme = $state(data.theme ?? 'system');

  // Mirror the choice into a cookie so the server can render it next time.
  $effect(() => {
    document.cookie = \`theme=\${theme}; path=/; max-age=31536000; samesite=lax\`;
  });
</script>

<ThemeProvider themes={monolith} bind:theme storageKey={false}>
  {@render children()}
</ThemeProvider>

// src/routes/+layout.server.ts
export const load = ({ cookies }) => ({ theme: cookies.get('theme') });`;

export const csp = `<ThemeProvider themes={monolith} nonce={data.cspNonce}>…</ThemeProvider>

// or allow the restore script by hash
import { themeScript, monolith } from 'sveltier';
const script = themeScript('sv-theme', ['system', ...Object.keys(monolith)]);
// sha256 of \`script\` goes into script-src`;

export const defineCustom = `import { defineTheme } from 'sveltier';
import { monolithLight } from 'sveltier/themes/monolith';

// Extends Monolith light; everything you leave out comes from it.
export const brand = defineTheme({
  colors: {
    primary: 'oklch(0.52 0.16 255)',   // on-primary is computed for you
    brand: 'oklch(0.62 0.17 35)'        // custom colour: --sv-color-brand, --sv-on-brand
  },
  variables: {
    'radius-md': '13px',
    'font-display': "'Fraunces Variable', Georgia, serif"
  }
}, monolithLight);`;

export const extendPack = `import { defineTheme } from 'sveltier';
import { aurora, auroraDark } from 'sveltier/themes/aurora';

// Aurora with a teal primary; everything else is Aurora's.
const teal = defineTheme({ colors: { primary: 'oklch(0.78 0.11 190)' } }, auroraDark);

const themes = { ...aurora, 'aurora-teal': teal };`;

export const checkContrast = `import { contrast, parseOklch } from 'sveltier';

const ratio = contrast(parseOklch(theme.colors.text)!, parseOklch(theme.colors.background)!);
// ≥ 4.5 for body text (WCAG 1.4.3)`;

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
  import { ThemeProvider } from 'sveltier';
  import { ${id} } from 'sveltier/themes/${id}';
  let { children } = $props();
</script>

<ThemeProvider themes={${id}}>
  {@render children()}
</ThemeProvider>`;

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
