// Code samples shown on the Themes page. Kept in a .ts module because a literal closing
// script tag cannot appear inside a Svelte <script> block.

export const setup = `<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeProvider } from 'sveltier';
  let { children } = $props();
</script>

<!-- Monolith by default, light or dark following the OS -->
<ThemeProvider>
  {@render children()}
</ThemeProvider>`;

export const pack = `<script>
  import { ThemeProvider } from 'sveltier';
  import { maison } from 'sveltier/themes/maison';
</script>

<ThemeProvider themes={maison}>…</ThemeProvider>`;

export const custom = `import { defineTheme, monolith, milano } from 'sveltier';

// Every theme fulfils the same typed contract: colours plus type, shape,
// depth and motion. defineTheme() fills anything you leave out.
const brand = defineTheme({
  dark: false,
  colors: { primary: 'oklch(0.52 0.16 255)' },
  variables: { 'radius-md': '10px' }
});

const themes = { ...monolith, ...milano, brand };`;

export const toggle = `<script>
  import { useTheme } from 'sveltier';
  const theme = useTheme();
</script>

<button type="button" onclick={() => theme.toggle()}>
  {theme.isDark ? 'Light' : 'Dark'}
</button>`;
