// Code samples for the Core pages (defaults, shared props, display, locale, UIProvider).
// Svelte and TypeScript samples are files in ../examples that svelte-check compiles, shown with
// ?raw. What stays a string cannot be checked as a file of its own: shell, CSS, HTML, a
// signature, a route file, or two files in one block.

export { default as defaultsGlobal } from '../examples/core/DefaultsGlobal.svelte?raw';

export { default as appOptions } from '../examples/core/AppOptions.svelte?raw';

export { default as displayOptions } from '../examples/core/DisplayOptions.svelte?raw';

export { default as localeOptions } from '../examples/core/LocaleOptions.svelte?raw';

export { default as defaultsNested } from '../examples/core/DefaultsNested.svelte?raw';

export { default as defaultsRegister } from '../examples/core/defaultsRegister.d.ts?raw';

export { default as defaultsComponent } from '../examples/core/PriceTag.svelte?raw';

export const useDefaultsSignature = `import { useDefaults } from '@sveltier/ui';

function useDefaults<T extends object>(
  name: string,
  builtins: T
): (local: Partial<T>) => T;`;

export { default as sharedComponent } from '../examples/core/SharedComponent.svelte?raw';

export { default as sharedRegister } from '../examples/core/sharedRegister.d.ts?raw';

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

export { default as displayExample } from '../examples/core/DisplayExample.svelte?raw';

export const useDisplaySignature = `import { useDisplay, type DisplayInstance } from '@sveltier/ui';

function useDisplay(): DisplayInstance;`;

export { default as localeExample } from '../examples/core/LocaleExample.svelte?raw';

export const useLocaleSignature = `import { useLocale, type LocaleInstance } from '@sveltier/ui';

function useLocale(): LocaleInstance;`;

export { default as idsExample } from '../examples/core/IdsExample.svelte?raw';

export { default as rootElementExample } from '../examples/core/RootElementExample.svelte?raw';

export { default as localeSubtree } from '../examples/core/LocaleSubtree.svelte?raw';
