// Code samples shown on the Theme page. Kept in a .ts module because a literal closing
// script tag cannot appear inside a Svelte <script> block.

export const setup = `<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeProvider } from 'sveltier';
  let { children } = $props();
</script>

<ThemeProvider>
  {@render children()}
</ThemeProvider>`;

export const custom = `import { bone, defineTheme, ink, verdigris } from 'sveltier';

const themes = {
  ink: ink(verdigris),
  bone: bone(verdigris),
  midnight: defineTheme({ dark: true, colors: { primary: 'oklch(0.78 0.11 260)' } })
};

<ThemeProvider {themes} light="bone" dark="ink">…</ThemeProvider>`;

export const toggle = `<script>
  import { useTheme } from 'sveltier';
  const theme = useTheme();
</script>

<button type="button" onclick={() => theme.toggle()}>
  {theme.isDark ? 'Bone' : 'Ink'}
</button>`;
