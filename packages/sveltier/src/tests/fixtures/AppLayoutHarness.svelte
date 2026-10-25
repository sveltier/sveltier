<script lang="ts">
	// An app frame in a themed scope: a bar with an action, a drawer of links with icons, and main
	// content taller than the window. The test picks which part comes first, whether there is a
	// drawer, the props of the bar and the drawer, and whether Main is wrapped by mistake.
	import AppBar from '../../lib/components/AppLayout/AppBar.svelte';
	import AppLayout from '../../lib/components/AppLayout/AppLayout.svelte';
	import Main from '../../lib/components/AppLayout/Main.svelte';
	import NavigationDrawer from '../../lib/components/AppLayout/NavigationDrawer.svelte';
	import type { AppBarProps, NavigationDrawerProps } from '../../lib/components/AppLayout/types.js';
	import List from '../../lib/components/List/List.svelte';
	import ListItem from '../../lib/components/List/ListItem.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		drawerFirst = false,
		withDrawer = true,
		bar = {},
		drawer = {},
		open = $bindable(false),
		wrapMain = false
	}: {
		drawerFirst?: boolean;
		withDrawer?: boolean;
		bar?: Partial<AppBarProps>;
		drawer?: Partial<NavigationDrawerProps>;
		open?: boolean;
		wrapMain?: boolean;
	} = $props();

	const ICON = 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z';
	const PAGES = ['Overview', 'Payments', 'Cards'];
</script>

{#snippet main()}
	<Main>
		<h1>Overview</h1>
		<div style:block-size="1500px"></div>
		<h2 id="payments">Payments</h2>
		<div style:block-size="1500px"></div>
	</Main>
{/snippet}

{#snippet navigation()}
	<NavigationDrawer {...drawer} bind:open>
		<List nav>
			{#each PAGES as page, index (page)}
				<ListItem title={page} href="#{page.toLowerCase()}" active={index === 0}>
					{#snippet prepend()}
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={ICON} /></svg>
					{/snippet}
				</ListItem>
			{/each}
		</List>
	</NavigationDrawer>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<AppLayout>
		{#if withDrawer && drawerFirst}{@render navigation()}{/if}
		<AppBar title="Ledger" {...bar}>
			{#snippet actions()}<button type="button">Sign out</button>{/snippet}
		</AppBar>
		{#if withDrawer && !drawerFirst}{@render navigation()}{/if}
		{#if wrapMain}
			<div>{@render main()}</div>
		{:else}
			{@render main()}
		{/if}
	</AppLayout>
</ThemeProvider>
