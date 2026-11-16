<script lang="ts">
	import { page } from '$app/state';
	import { Button, Menu, type MenuItem } from '@sveltier/ui';

	const PAGES = [
		{ label: 'Watchlist', href: '/markets/watchlist' },
		{ label: 'Screener', href: '/markets/screener' },
		{ label: 'Heatmap', href: '/markets/heatmap' }
	];

	// Each item is a link; the one of the page shown is current.
	const items: MenuItem[] = $derived(
		PAGES.map((link) => ({ ...link, current: page.url.pathname === link.href }))
	);
</script>

<Menu {items}>
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="text">Markets</Button>
	{/snippet}
</Menu>
