<script>
	import { page } from '$app/state';
	import { mdiBriefcase, mdiChartLine, mdiSwapHorizontal } from '@mdi/js';
	import {
		AppBar,
		AppFooter,
		AppLayout,
		BottomNavigation,
		List,
		ListItem,
		Main
	} from '@sveltier/ui';

	let { children } = $props();

	const pages = [
		{ label: 'Markets', href: '/markets', icon: mdiChartLine },
		{ label: 'Trade', href: '/trade', icon: mdiSwapHorizontal },
		{ label: 'Portfolio', href: '/portfolio', icon: mdiBriefcase }
	];
	// The page shown is current, in the bar and at the bottom alike.
	const items = $derived(
		pages.map((item) => ({ ...item, current: page.url.pathname.startsWith(item.href) }))
	);
</script>

<!-- The links of the bar, from the bottom navigation's breakpoint up. -->
{#snippet links()}
	<List nav>
		{#each items as item (item.href)}
			<ListItem title={item.label} href={item.href} active={item.current} />
		{/each}
	</List>
{/snippet}

<AppLayout>
	<AppBar nav={links}>
		{#snippet prepend()}<a href="/">Desk</a>{/snippet}
	</AppBar>
	<Main>{@render children()}</Main>
	<AppFooter>Prices delayed 15 minutes</AppFooter>
	<!-- On a phone: the same destinations along the bottom, under the footer's line. -->
	<BottomNavigation {items} />
</AppLayout>
