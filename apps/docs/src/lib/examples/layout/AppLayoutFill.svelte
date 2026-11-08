<script>
	import { AppBar, AppFooter, AppLayout, Main } from '@sveltier/ui';

	let { children } = $props();
</script>

<!-- From md up, the frame is the window: the page never scrolls, its panes do. -->
<AppLayout fill="md">
	<AppBar title="Terminal" />
	<Main>{@render children()}</Main>
	<AppFooter sticky>
		<span>Market open</span>
		<span>Connected</span>
	</AppFooter>
</AppLayout>
