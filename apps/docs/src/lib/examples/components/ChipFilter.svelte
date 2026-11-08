<script>
	import { Chip } from '@sveltier/ui';
	let card = $state(true);
	let transfer = $state(false);
</script>

<Chip bind:selected={card}>Card</Chip>
<Chip bind:selected={transfer}>Transfer</Chip>
