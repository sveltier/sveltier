<script lang="ts">
	// A pagination of buttons or links in a themed scope, with the page and the pages reported
	// by onchange shown.
	import Pagination from '../../lib/components/Pagination/Pagination.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		count = 10,
		page = $bindable(1),
		links = false,
		dir
	}: { count?: number; page?: number; links?: boolean; dir?: 'ltr' | 'rtl' } = $props();
	let changes = $state<number[]>([]);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div {dir}>
		<Pagination
			{count}
			bind:page
			href={links ? (target) => `#page-${target}` : undefined}
			onchange={(target) => (changes = [...changes, target])}
		/>
	</div>
	<span data-testid="page">{page}</span>
	<span data-testid="changes">{changes.join(' ')}</span>
</ThemeProvider>
