<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { LocaleOptions } from './locale.js';

	/**
	 * A part of the page in another locale: figures and dates inside it are formatted with the
	 * settings given here, and everything left out (messages included) comes from the provider
	 * above. Renders no element of its own.
	 *
	 * @example
	 * <!-- A Vietnamese app whose market table writes figures as exchanges do, 76,088.0 -->
	 * <LocaleProvider locale="en-US">
	 *   <Table items={markets} {columns} />
	 * </LocaleProvider>
	 */
	export interface LocaleProviderProps extends LocaleOptions {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { createLocale, setLocaleContext, useLocale } from './locale.js';

	let { locale, currency, timeZone, messages, children }: LocaleProviderProps = $props();

	setLocaleContext(createLocale(() => ({ locale, currency, timeZone, messages }), useLocale()));
</script>

{@render children?.()}
