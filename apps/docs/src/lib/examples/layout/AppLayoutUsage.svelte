<!-- src/routes/+layout.svelte -->
<script>
	import { mdiBank, mdiCreditCard, mdiMagnify, mdiSwapHorizontal } from '@mdi/js';
	import { page } from '$app/state';
	import {
		AppBar,
		AppLayout,
		Button,
		Icon,
		List,
		ListItem,
		Main,
		NavigationDrawer,
		UIProvider
	} from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';

	let { children } = $props();

	const pages = [
		{ title: 'Accounts', href: '/accounts', icon: mdiBank },
		{ title: 'Payments', href: '/payments', icon: mdiSwapHorizontal },
		{ title: 'Cards', href: '/cards', icon: mdiCreditCard }
	];
</script>

<UIProvider themes={monolith}>
	<AppLayout>
		<AppBar title="Ledger">
			{#snippet actions()}
				<Button icon variant="text" color="neutral" aria-label="Search">
					<Icon path={mdiMagnify} />
				</Button>
			{/snippet}
		</AppBar>
		<NavigationDrawer>
			<List nav>
				{#each pages as item (item.href)}
					<ListItem
						title={item.title}
						href={item.href}
						active={page.url.pathname.startsWith(item.href)}
					>
						{#snippet prepend()}<Icon path={item.icon} />{/snippet}
					</ListItem>
				{/each}
			</List>
		</NavigationDrawer>
		<Main>{@render children()}</Main>
	</AppLayout>
</UIProvider>
