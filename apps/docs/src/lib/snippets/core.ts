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
