<script>
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
	import { Icon, List, ListItem, NavigationDrawer } from '@sveltier/ui';

	let rail = $state(false);
</script>

<!-- From the breakpoint up, rail narrows the drawer to its icons. -->
<NavigationDrawer {rail}>
	<List nav>…</List>
	<!-- margin-block-start: auto puts the toggle at the bottom of the drawer. -->
	<List nav style="margin-block-start: auto">
		<ListItem title={rail ? 'Expand' : 'Collapse'} onclick={() => (rail = !rail)}>
			{#snippet prepend()}<Icon path={rail ? mdiChevronRight : mdiChevronLeft} />{/snippet}
		</ListItem>
	</List>
</NavigationDrawer>
