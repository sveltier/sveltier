// Code samples for the Core pages (defaults, shared props, display, locale, UIProvider).

export const defaultsGlobal = `<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  let { children } = $props();
</script>

<UIProvider themes={monolith} defaults={{ global: { density: 'compact', rounded: 'lg' } }}>
  {@render children()}
</UIProvider>`;

export const appOptions = `<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  let { children } = $props();
</script>

<UIProvider
  themes={monolith}
  defaults={{ global: { density: 'compact' } }}
  locale={{ locale: 'en-GB', currency: 'GBP', timeZone: 'Europe/London' }}
  display={{ mobileBreakpoint: 'lg' }}
>
  {@render children()}
</UIProvider>`;

export const displayOptions = `<!-- +layout.svelte: your own thresholds, and the width the server assumes -->
<UIProvider
  themes={monolith}
  display={{ thresholds: { md: 1024 }, mobileBreakpoint: 'lg', ssrWidth: data.viewportWidth }}
>
  {@render children()}
</UIProvider>`;

export const localeOptions = `<script>
  import { UIProvider } from '@sveltier/ui';
  import { monolith } from '@sveltier/ui/themes/monolith';
  let { children } = $props();
  // A user setting: changing it reformats every amount in the app.
  let currency = $state('EUR');
</script>

<UIProvider themes={monolith} locale={{ locale: 'en-IE', currency, timeZone: 'Europe/Dublin' }}>
  {@render children()}
</UIProvider>`;

export const defaultsNested = `<DefaultsProvider defaults={{ global: { size: 'sm' } }}>
  <Toolbar />

  <!-- Inner values win, key by key: size becomes lg, PriceTag gets its colour. -->
  <DefaultsProvider defaults={{ global: { size: 'lg' }, PriceTag: { color: 'up' } }}>
    <Hero />
  </DefaultsProvider>
</DefaultsProvider>`;

export const defaultsRegister = `// src/app.d.ts, or any .d.ts file in your project
import type { Color, Size } from '@sveltier/ui';

declare module '@sveltier/ui' {
  interface ComponentDefaults {
    PriceTag: { size: Size; color: Color; showSign: boolean };
  }
}`;

export const defaultsComponent = `<script lang="ts">
  import { useDefaults, type Color, type ComponentDefaults, type Size } from '@sveltier/ui';

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

export const useDefaultsSignature = `import { useDefaults } from '@sveltier/ui';

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
  } from '@sveltier/ui';

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
import type { Color, Size, Variant } from '@sveltier/ui';

declare module '@sveltier/ui' {
  interface ComponentDefaults {
    Pill: { variant: Variant; size: Size; color: Color };
  }
}`;

export const customColor = `// themes.ts: add the colour to every theme you register
import { defineTheme, monolithDark, monolithLight } from '@sveltier/ui';

export const themes = {
  'brand-light': defineTheme({ colors: { brand: 'oklch(0.55 0.15 300)' } }, monolithLight),
  'brand-dark': defineTheme({ colors: { brand: 'oklch(0.75 0.12 300)' } }, monolithDark)
};

// app.d.ts: make it a valid \`color\`
declare module '@sveltier/ui' {
  interface CustomColors {
    brand: true;
  }
}`;

export const sharedClassesSignature = `import { sharedClasses, type SharedClassProps, type Variant } from '@sveltier/ui';

function sharedClasses(
  props: SharedClassProps,
  component?: string, // named in development warnings
  variants?: readonly Variant[] // the variants this component takes, all by default
): string;

sharedClasses({ variant: 'tonal', size: 'sm', color: 'success', rounded: true }, 'MyPill');
// 'sv-variant-tonal sv-size-sm sv-color-success sv-rounded'`;

export const displayExample = `<script>
  import { useDisplay } from '@sveltier/ui';

  const display = useDisplay();
  // Behaviour, not layout: fewer rows per page on small screens.
  const pageSize = $derived(display.mdAndUp ? 50 : 20);
</script>

{#if display.mobile}
  <MobileOrderTicket />
{:else}
  <OrderTicket />
{/if}`;

export const useDisplaySignature = `import { useDisplay, type DisplayInstance } from '@sveltier/ui';

function useDisplay(): DisplayInstance;`;

export const localeExample = `<script lang="ts">
  import { useLocale } from '@sveltier/ui';

  let { balance, change, updatedAt }: { balance: number; change: number; updatedAt: Date } =
    $props();

  const locale = useLocale();
</script>

<p>{locale.formatCurrency(balance)}</p>
<p>{locale.formatPercent(change, { minimumFractionDigits: 2, signDisplay: 'exceptZero' })}</p>
<time datetime={updatedAt.toISOString()}>{locale.formatRelative(updatedAt)}</time>`;

export const useLocaleSignature = `import { useLocale, type LocaleInstance } from '@sveltier/ui';

function useLocale(): LocaleInstance;`;

export const idsExample = `<script lang="ts">
  let { id: idProp, label, hint }: { id?: string; label: string; hint?: string } = $props();

  // Unique per instance, and the same on the server and in the browser.
  const uid = $props.id();
  const id = $derived(idProp ?? uid);
</script>

<label for={id}>{label}</label>
<input {id} aria-describedby={hint ? \`\${id}-hint\` : undefined} />
{#if hint}<p id="{id}-hint">{hint}</p>{/if}`;

export const rootElementExample = `<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ElementProps } from '@sveltier/ui';

  // Own props first; every other <span> attribute passes through.
  export type DeltaProps = ElementProps<
    HTMLSpanElement,
    HTMLAttributes<HTMLSpanElement>,
    { value: number }
  >;
</script>

<script lang="ts">
  import { useLocale } from '@sveltier/ui';

  let { value, class: className, ref = $bindable(null), ...rest }: DeltaProps = $props();
  const locale = useLocale();
</script>

<!-- The spread comes first, so the attributes the component controls come after and win. -->
<span
  bind:this={ref}
  {...rest}
  class={['delta', value < 0 ? 'delta--down' : 'delta--up', className]}
>
  {locale.formatPercent(value, { minimumFractionDigits: 2, signDisplay: 'exceptZero' })}
</span>`;
