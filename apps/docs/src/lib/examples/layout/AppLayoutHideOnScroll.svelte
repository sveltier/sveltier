<script>
	import { mdiBriefcase, mdiChartLine, mdiSwapHorizontal } from '@mdi/js';
	import { AppBar, AppFooter, AppLayout, BottomNavigation, Main } from '@sveltier/ui';

	let { children } = $props();

	const items = [
		{ label: 'Markets', href: '/markets', icon: mdiChartLine, current: true },
		{ label: 'Trade', href: '/trade', icon: mdiSwapHorizontal },
		{ label: 'Portfolio', href: '/portfolio', icon: mdiBriefcase }
	];
</script>

<!-- Below 960px, the bars give the page the whole screen while it is read on. -->
<AppLayout>
	<AppBar title="Desk" hideOnScroll="md" />
	<Main>{@render children()}</Main>
	<AppFooter sticky hideOnScroll="md">Prices delayed 15 minutes</AppFooter>
	<BottomNavigation {items} hideOnScroll="md" />
</AppLayout>
