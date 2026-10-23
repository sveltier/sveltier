<script lang="ts">
	// A badge on a 40px square and one alone in a line, in a themed scope.
	import Badge from '../../lib/components/Badge/Badge.svelte';
	import type { BadgeProps } from '../../lib/components/Badge/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { dir = 'ltr', ...props }: BadgeProps & { dir?: 'ltr' | 'rtl' } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div {dir} style="padding: 40px">
		<Badge data-testid="badge" {...props}>
			<span data-testid="content" style="display: block; inline-size: 40px; block-size: 40px"
			></span>
		</Badge>
		<p>Savings <Badge data-testid="inline" content="New" /></p>
	</div>
</ThemeProvider>
