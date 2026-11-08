<script>
	import { page } from '$app/state';
	import { AppBar, AppLayout, List, ListItem, Main, NavigationDrawer } from '@sveltier/ui';

	let { children } = $props();

	const pages = [
		{ title: 'Markets', href: '/markets' },
		{ title: 'Trade', href: '/trade' },
		{ title: 'Portfolio', href: '/portfolio' }
	];
</script>

<!-- The links, written once: a row in the bar, a column in the drawer. -->
{#snippet links()}
	<List nav>
		{#each pages as item (item.href)}
			<ListItem title={item.title} href={item.href} active={page.url.pathname === item.href} />
		{/each}
	</List>
{/snippet}

<AppLayout>
	<AppBar nav={links}>
		<!-- The app's mark, a link home, at every width. -->
		{#snippet prepend()}<a href="/">Desk</a>{/snippet}
	</AppBar>
	<!-- Below the breakpoint, the menu button opens the same links in a modal drawer. -->
	<NavigationDrawer modal>{@render links()}</NavigationDrawer>
	<Main>{@render children()}</Main>
</AppLayout>
