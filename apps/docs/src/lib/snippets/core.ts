// Code samples for the Core pages (defaults, shared props).

export const defaultsGlobal = `<script>
  import { DefaultsProvider, ThemeProvider } from 'sveltier';
  let { children } = $props();
</script>

<ThemeProvider>
  <DefaultsProvider defaults={{ global: { density: 'compact', rounded: 'lg' } }}>
    {@render children()}
  </DefaultsProvider>
</ThemeProvider>`;

export const defaultsNested = `<DefaultsProvider defaults={{ global: { size: 'sm' } }}>
  <Toolbar />

  <!-- Inner values win, key by key: size becomes lg, PriceTag gets its colour. -->
  <DefaultsProvider defaults={{ global: { size: 'lg' }, PriceTag: { color: 'up' } }}>
    <Hero />
  </DefaultsProvider>
</DefaultsProvider>`;

export const defaultsRegister = `// src/app.d.ts, or any .d.ts file in your project
import type { Color, Size } from 'sveltier';

declare module 'sveltier' {
  interface ComponentDefaults {
    PriceTag: { size: Size; color: Color; showSign: boolean };
  }
}`;

export const defaultsComponent = `<script lang="ts">
  import { useDefaults, type Color, type ComponentDefaults, type Size } from 'sveltier';

  interface Props {
    value: number;
    size?: Size;
    color?: Color;
    showSign?: boolean;
  }

  // No fallbacks in the destructuring: a fallback would hide the provider's defaults.
  let { value, size, color, showSign }: Props = $props();

  const resolve = useDefaults<ComponentDefaults['PriceTag']>('PriceTag', {
    size: 'md',
    color: 'neutral',
    showSign: true
  });
  const p = $derived(resolve({ size, color, showSign }));
</script>

<span class="price-tag price-tag--{p.size}">
  {p.showSign && value > 0 ? '+' : ''}{value}
</span>`;

export const useDefaultsSignature = `import { useDefaults } from 'sveltier';

function useDefaults<T extends object>(
  name: string,
  builtins: T
): (local: Partial<T>) => T;`;

export const sharedComponent = `<script lang="ts">
  import {
    sharedClasses,
    useDefaults,
    type Color,
    type ComponentDefaults,
    type Size,
    type Variant
  } from 'sveltier';

  interface Props {
    label: string;
    variant?: Variant;
    size?: Size;
    color?: Color;
  }

  let { label, variant, size, color }: Props = $props();

  const resolve = useDefaults<ComponentDefaults['Pill']>('Pill', {
    variant: 'tonal',
    size: 'sm',
    color: 'neutral'
  });
  // Every shared prop the component has, defaults included.
  const p = $derived(resolve({ variant, size, color }));
</script>

<span class={['pill', sharedClasses(p)]}>{label}</span>

<style>
  .pill {
    display: inline-grid;
    place-items: center;
    block-size: var(--sv-size-height);
    padding-inline: calc(var(--sv-size-height) * 0.382);
    border: var(--sv-hairline) solid var(--sv-variant-border);
    border-radius: var(--sv-radius-full);
    background: var(--sv-variant-bg);
    color: var(--sv-variant-fg);
    font-size: var(--sv-size-text);
  }
</style>`;

export const sharedRegister = `// app.d.ts
import type { Color, Size, Variant } from 'sveltier';

declare module 'sveltier' {
  interface ComponentDefaults {
    Pill: { variant: Variant; size: Size; color: Color };
  }
}`;

export const customColor = `// themes.ts: add the colour to every theme you register
import { defineTheme, monolithDark, monolithLight } from 'sveltier';

export const themes = {
  'brand-light': defineTheme({ colors: { brand: 'oklch(0.55 0.15 300)' } }, monolithLight),
  'brand-dark': defineTheme({ colors: { brand: 'oklch(0.75 0.12 300)' } }, monolithDark)
};

// app.d.ts: make it a valid \`color\`
declare module 'sveltier' {
  interface CustomColors {
    brand: true;
  }
}`;

export const sharedClassesSignature = `import { sharedClasses, type SharedClassProps } from 'sveltier';

function sharedClasses(props: SharedClassProps): string;

sharedClasses({ variant: 'tonal', size: 'sm', color: 'success', rounded: true });
// 'sv-variant-tonal sv-size-sm sv-color-success sv-rounded'`;

export const displayExample = `<script>
  import { useDisplay } from 'sveltier';

  const display = useDisplay();
  // Behaviour, not layout: fewer rows per page on small screens.
  const pageSize = $derived(display.mdAndUp ? 50 : 20);
</script>

{#if display.mobile}
  <MobileOrderTicket />
{:else}
  <OrderTicket />
{/if}`;

export const useDisplaySignature = `import { useDisplay, type DisplayInstance } from 'sveltier';

function useDisplay(): DisplayInstance;`;
