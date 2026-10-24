<script lang="ts">
	// Icons in a themed scope: in body text, in a Button, and wrapping an SVG of their own.
	import Button from '../../lib/components/Button/Button.svelte';
	import Icon from '../../lib/components/Icon/Icon.svelte';
	import type { IconProps } from '../../lib/components/Icon/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { ...props }: IconProps = $props();

	const PLUS = 'M11 5h2v14h-2zM5 11h14v2H5z';
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<p data-testid="text" style="font-size: 20px">
		Add <Icon data-testid="icon" path={PLUS} {...props} /> funds
	</p>
	<Button data-testid="button" size="lg">
		{#snippet prepend()}<Icon data-testid="in-button" path={PLUS} />{/snippet}
		Add funds
	</Button>
	<Icon data-testid="custom" label="Bank">
		<svg viewBox="0 0 16 16" data-testid="svg"><rect width="16" height="16" /></svg>
	</Icon>
</ThemeProvider>
