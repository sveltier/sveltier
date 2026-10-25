<script lang="ts">
	// A small banking app on AppLayout, shown in a frame on the App layout page. The address
	// chooses which part takes the corner: the bar, written first, or the drawer.
	import { page } from '$app/state';
	import { pageHref } from '#lib/docs/href.js';
	import { PAGES } from '#lib/docs/app-layout/example.js';
	import {
		AppBar,
		AppLayout,
		Avatar,
		Button,
		Icon,
		List,
		ListItem,
		Main,
		NavigationDrawer
	} from '@sveltier/ui';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const SEARCH =
		'M10 3a7 7 0 1 0 0 14 7 7 0 1 0 0-14zm0 2a5 5 0 1 1 0 10 5 5 0 1 1 0-10zm4.3 10.7 1.4-1.4 5.6 5.6-1.4 1.4z';
	const RAIL = 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6z';

	let rail = $state(false);
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet drawer()}
	<NavigationDrawer {rail}>
		<List nav>
			{#each PAGES as item (item.id)}
				<ListItem
					title={item.title}
					href={pageHref(`examples/app-layout/${data.corner}/${item.id}`)}
					active={page.params.page === item.id}
				>
					{#snippet prepend()}<Icon path={item.icon} />{/snippet}
				</ListItem>
			{/each}
		</List>
		<List nav class="example-rail">
			<ListItem title={rail ? 'Expand' : 'Collapse'} onclick={() => (rail = !rail)}>
				{#snippet prepend()}
					<Icon path={RAIL} class={rail ? 'example-flip' : undefined} />
				{/snippet}
			</ListItem>
		</List>
	</NavigationDrawer>
{/snippet}

<AppLayout>
	{#if data.corner === 'drawer'}{@render drawer()}{/if}
	<AppBar title="Ledger">
		{#snippet actions()}
			<Button icon variant="text" color="neutral" aria-label="Search">
				<Icon path={SEARCH} />
			</Button>
			<Avatar size="sm" color="primary">AL</Avatar>
		{/snippet}
	</AppBar>
	{#if data.corner === 'bar'}{@render drawer()}{/if}
	<Main>{@render children()}</Main>
</AppLayout>

<style>
	/* The rail toggle belongs to the drawer beside the content, not to the modal drawer. */
	:global(.sv-modal .example-rail) {
		display: none;
	}

	:global(.example-rail) {
		margin-block-start: auto;
	}

	:global(.example-flip) {
		transform: scaleX(-1);
	}
</style>
