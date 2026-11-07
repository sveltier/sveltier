// Code for the SvelteKit, Vite and Styling guides. Every sample was run in a fresh app scaffolded
// by the official tools (sv create, create-vite) with the published package installed.

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

export const viteMain = `// src/main.ts
import { mount } from 'svelte';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import App from './App.svelte';

const app = mount(App, { target: document.getElementById('app')! });

export default app;`;

export const viteApp = `<!-- src/App.svelte -->
<script lang="ts">
  import { Button, Card, TextField, UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  import ThemeToggle from './ThemeToggle.svelte';

  let email = $state('');
</script>

<UIProvider themes={monolith}>
  <main>
    <ThemeToggle />
    <Card title="Sign up">
      <TextField label="Email" type="email" bind:value={email} />
      <Button color="primary">Continue</Button>
    </Card>
  </main>
</UIProvider>`;

export const viteToggle = `<!-- src/ThemeToggle.svelte -->
<script lang="ts">
  import { Button, useTheme } from '@sveltier/ui';

  // Inside the provider, so it finds the theme.
  const theme = useTheme();
</script>

<Button variant="text" onclick={() => theme.toggle()}>
  {theme.isDark ? 'Light' : 'Dark'} mode
</Button>`;

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

export const classProp = `<script>
  import { Button } from '@sveltier/ui';
</script>

<section class="hero">
  <Button class="cta" color="primary">Open an account</Button>
</section>

<style>
  /* The Button's element is not in this component's markup, so reach it
     through :global(), kept inside a local class. */
  .hero :global(.cta) {
    min-inline-size: 16rem;
  }
</style>`;

export const scopedTokens = `<div class="square">
  <Button>Square corners</Button>
  <TextField label="Reference" />
</div>

<style>
  /* Tokens are custom properties: set one on a container and
     everything inside follows. */
  .square {
    --sv-radius-md: 0;
  }
</style>`;

export const ownLayers = `<!-- app.html or index.html, before any stylesheet -->
<style>
  @layer reset, sv, app;
</style>`;
