<script lang="ts">
	// A trail of three steps, the last one the current page, in a themed scope.
	import Breadcrumbs from '../../lib/components/Breadcrumbs/Breadcrumbs.svelte';
	import type { BreadcrumbsItem } from '../../lib/components/Breadcrumbs/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		items = [
			{ label: 'Home', href: '/' },
			{ label: 'Accounts', href: '/accounts' },
			{ label: 'Savings' }
		],
		label
	}: { items?: BreadcrumbsItem[]; label?: string } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Breadcrumbs {items} aria-label={label} />
</ThemeProvider>
