<script>
	import { page } from '$app/state';
	import { AppBar, AppLayout, Button, List, ListItem, Main, NavigationDrawer } from '@sveltier/ui';

	let { children } = $props();

	const links = [
		{ title: 'Markets', href: '/markets' },
		{ title: 'Trade', href: '/trade' },
		{ title: 'Portfolio', href: '/portfolio' }
	];
</script>

<AppLayout>
	<AppBar title="Desk">
		<!-- From the drawer's breakpoint up: the links across the bar. -->
		{#snippet nav()}
			{#each links as link (link.href)}
				<Button
					href={link.href}
					variant="text"
					color="neutral"
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
				>
					{link.title}
				</Button>
			{/each}
		{/snippet}
	</AppBar>
	<!-- Below it: the menu button opens the same links in a modal drawer. -->
	<NavigationDrawer modal>
		<List nav>
			{#each links as link (link.href)}
				<ListItem title={link.title} href={link.href} active={page.url.pathname === link.href} />
			{/each}
		</List>
	</NavigationDrawer>
	<Main>{@render children()}</Main>
</AppLayout>
