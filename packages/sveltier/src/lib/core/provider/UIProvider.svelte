<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { DefaultsConfig } from '../defaults/context.js';
	import type { DisplayOptions } from '../display/display.js';
	import type { LocaleOptions } from '../locale/locale.js';
	import type { ThemeChoice, ThemeDefinition } from '../theme/types.js';

	export interface UIProviderProps {
		/** The registered themes, for example `monolith` or `{ ...monolith, ...maison }`. */
		themes: Record<string, ThemeDefinition>;
		/** "system" or a theme name. Bindable. */
		theme?: ThemeChoice;
		/** Theme used by "system" when the OS prefers light. Defaults to the first light theme. */
		light?: string;
		/** Theme used by "system" when the OS prefers dark. Defaults to the first dark theme. */
		dark?: string;
		/** Where the user's theme choice is remembered; `false` turns persistence off. */
		storageKey?: string | false;
		/** CSP nonce for the generated `<style>` and `<script>`. */
		nonce?: string;
		/** Default props for every component below. */
		defaults?: DefaultsConfig;
		/** Breakpoint thresholds, mobile breakpoint and server width. Read once. */
		display?: DisplayOptions;
		/** Locale, currency, time zone and messages. Changes apply at once. */
		locale?: LocaleOptions;
		children?: Snippet;
	}
</script>

<script lang="ts">
	// The root of an app: theme, defaults, display and locale in one component.
	import { untrack } from 'svelte';
	import DefaultsProvider from '../defaults/DefaultsProvider.svelte';
	import { createDisplay, setDisplayContext } from '../display/display.js';
	import { createLocale, setLocaleContext } from '../locale/locale.js';
	import ThemeProvider from '../theme/ThemeProvider.svelte';

	let {
		themes,
		theme = $bindable(),
		light,
		dark,
		storageKey,
		nonce,
		defaults,
		display,
		locale,
		children
	}: UIProviderProps = $props();

	setDisplayContext(untrack(() => createDisplay(display)));
	setLocaleContext(createLocale(() => locale ?? {}));
</script>

<ThemeProvider {themes} bind:theme {light} {dark} {storageKey} {nonce}>
	<DefaultsProvider defaults={defaults ?? {}}>
		{@render children?.()}
	</DefaultsProvider>
</ThemeProvider>
