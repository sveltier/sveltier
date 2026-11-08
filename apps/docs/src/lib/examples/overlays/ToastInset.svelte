<script>
	import { UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';

	let { children } = $props();
</script>

<!-- The status bar is 22px tall along the bottom: toasts stay above it. -->
<UIProvider themes={monolith} defaults={{ Toast: { inset: 22 } }}>
	{@render children()}
	<footer class="status">Connected</footer>
</UIProvider>

<style>
	.status {
		position: fixed;
		inset-inline: 0;
		inset-block-end: 0;
		block-size: 22px;
	}
</style>
