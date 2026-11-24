<script lang="ts">
	// Monolith's fonts: Geist for the interface, Geist Mono for figures.
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import { page } from '$app/state';
	import {
		AppBar,
		AppLayout,
		List,
		ListItem,
		Main,
		NavigationDrawer,
		UIProvider
	} from '@sveltier/ui';
	// One theme pack, light and dark. To offer more, spread them in: { ...monolith, ...maison }.
	import { monolith } from '@sveltier/ui/themes/monolith';
	import ThemeToggle from './ThemeToggle.svelte';

	let { children } = $props();

	const pages = [
		{ title: 'Invoices', href: '/' },
		{ title: 'Settings', href: '/settings' }
	];
</script>

<UIProvider themes={monolith}>
	<AppLayout>
		<AppBar title="Starter">
			{#snippet actions()}<ThemeToggle />{/snippet}
		</AppBar>
		<NavigationDrawer>
			<List nav>
				{#each pages as item (item.href)}
					<ListItem title={item.title} href={item.href} active={page.url.pathname === item.href} />
				{/each}
			</List>
		</NavigationDrawer>
		<Main>{@render children()}</Main>
	</AppLayout>
</UIProvider>
