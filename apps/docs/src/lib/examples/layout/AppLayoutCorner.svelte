<script>
	import { AppBar, AppLayout, Main, NavigationDrawer } from '@sveltier/ui';
</script>

<!-- The bar first: it runs across the top, the drawer starts under it. -->
<AppLayout>
	<AppBar title="Ledger" />
	<NavigationDrawer>…</NavigationDrawer>
	<Main>…</Main>
</AppLayout>

<!-- The drawer first: it runs the full height, the bar sits beside it. -->
<AppLayout>
	<NavigationDrawer>…</NavigationDrawer>
	<AppBar title="Ledger" />
	<Main>…</Main>
</AppLayout>
