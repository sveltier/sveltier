// Code for the SvelteKit, Vite and Styling guides. Every sample was run in a fresh app scaffolded
// by the official tools (sv create, create-vite) with the published package installed.
// Svelte and TypeScript samples are files in ../examples that svelte-check compiles, shown with
// ?raw. What stays a string cannot be checked as a file of its own: shell, CSS, HTML, a
// signature, a route file, or two files in one block.

export const kitCreate = `npx sv create my-app
cd my-app
npm install @sveltier/ui @fontsource-variable/geist @fontsource-variable/geist-mono`;

export const kitLayout = `<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import './layout.css';
  import '@fontsource-variable/geist';
  import '@fontsource-variable/geist-mono';
  import favicon from '#lib/assets/favicon.svg';
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<UIProvider themes={monolith}>
  {@render children()}
</UIProvider>`;

export const kitPage = `<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { Button, Card, useTheme } from '@sveltier/ui';

  const theme = useTheme();
</script>

<Card title="Welcome">
  <p>You are using {theme.name}.</p>
  <Button onclick={() => theme.toggle()}>Switch light and dark</Button>
  <Button href={resolve('/about')} variant="text">About</Button>
</Card>`;

export const kitActionServer = `// src/routes/+page.server.ts
import type { Actions } from './$types';

export const actions = {
  subscribe: async ({ request }) => {
    const data = await request.formData();
    return { email: String(data.get('email')) };
  }
} satisfies Actions;`;

export const kitActionPage = `<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import { fromAction } from 'svelte/attachments';
  import { Button, Form, TextField } from '@sveltier/ui';
  import type { PageProps } from './$types';

  let { form }: PageProps = $props();
</script>

<Form method="POST" action="?/subscribe" {@attach fromAction(enhance)}>
  <TextField label="Email" name="email" type="email" required />
  <Button type="submit">Subscribe</Button>
</Form>

{#if form?.email}<p>Subscribed {form.email}.</p>{/if}`;

export const kitTailwind = `<!-- src/app.html -->
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @layer theme, base, sv, components, utilities;
  </style>
  %sveltekit.head%
</head>`;

export const viteCreate = `npm create vite@latest my-app -- --template svelte-ts
cd my-app
npm install
npm install @sveltier/ui @fontsource-variable/geist @fontsource-variable/geist-mono`;

export { default as viteMain } from '../examples/guides/vite/main.ts?raw';

export { default as viteApp } from '../examples/guides/vite/App.svelte?raw';

export { default as viteToggle } from '../examples/guides/vite/ThemeToggle.svelte?raw';

export const viteHtml = `<!-- index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>My app</title>
</head>`;

export const viteTailwind = `<!-- index.html, in <head> before anything else that loads CSS -->
<style>
  @layer theme, base, sv, components, utilities;
</style>`;

export const layerOrder = `@layer sv.tokens, sv.base, sv.components, sv.utilities;`;

export const unlayered = `/* app.css: unlayered, so it wins over every Sveltier layer */
.sv-card {
  border-width: 2px;
}`;

export { default as classProp } from '../examples/guides/ClassProp.svelte?raw';

export { default as scopedTokens } from '../examples/guides/ScopedTokens.svelte?raw';

export const ownLayers = `<!-- app.html or index.html, before any stylesheet -->
<style>
  @layer reset, sv, app;
</style>`;
