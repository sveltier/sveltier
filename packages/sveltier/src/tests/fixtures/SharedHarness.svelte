<script lang="ts">
	// Two nested boxes styled only through the shared-props variables, inside a theme.
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import type { ThemeChoice, ThemeDefinition } from '../../lib/core/theme/types.js';
	import { sharedClasses, type SharedClassProps } from '../../lib/core/props/classes.js';
	import './shared-box.css';

	let {
		themes,
		theme = 'monolith-light',
		outer = {},
		inner = {}
	}: {
		themes?: Record<string, ThemeDefinition>;
		theme?: ThemeChoice;
		outer?: SharedClassProps;
		inner?: SharedClassProps;
	} = $props();
</script>

<ThemeProvider {themes} {theme} storageKey={false}>
	<div data-testid="outer" class={['shared-box', sharedClasses(outer)]}>
		<div data-testid="inner" class={['shared-box', sharedClasses(inner)]}></div>
	</div>
</ThemeProvider>
