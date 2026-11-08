<script>
	import { Button, DefaultsProvider } from '@sveltier/ui';
	import PriceTag from './PriceTag.svelte';
</script>

<DefaultsProvider defaults={{ global: { size: 'sm' } }}>
	<Button>Refresh</Button>

	<!-- Inner values win, key by key: size becomes lg, PriceTag gets its colour. -->
	<DefaultsProvider defaults={{ global: { size: 'lg' }, PriceTag: { color: 'up' } }}>
		<PriceTag value={12.5} />
	</DefaultsProvider>
</DefaultsProvider>
