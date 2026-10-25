<script lang="ts">
	// Two nested boxes styled only through the shared-props variables, inside a theme. Either can
	// be a control (a button) instead of a plain box.
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import type { ThemeChoice, ThemeDefinition } from '../../lib/core/theme/types.js';
	import { sharedClasses, type SharedClassProps } from '../../lib/core/props/classes.js';
	import { monolith } from '../../lib/themes/monolith.js';
	import './shared-box.css';

	let {
		themes = monolith,
		theme = 'monolith-light',
		outer = {},
		inner = {},
		outerTag = 'div',
		innerTag = 'div'
	}: {
		themes?: Record<string, ThemeDefinition>;
		theme?: ThemeChoice;
		outer?: SharedClassProps;
		inner?: SharedClassProps;
		outerTag?: 'div' | 'button';
		innerTag?: 'div' | 'span' | 'button';
	} = $props();
</script>

<ThemeProvider {themes} {theme} storageKey={false}>
	<svelte:element this={outerTag} data-testid="outer" class={['shared-box', sharedClasses(outer)]}>
		<svelte:element this={innerTag} data-testid="inner" class={['shared-box', sharedClasses(inner)]}
		></svelte:element>
	</svelte:element>
</ThemeProvider>
