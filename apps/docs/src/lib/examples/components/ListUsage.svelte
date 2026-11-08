<script>
	import { List, ListItem } from '@sveltier/ui';
</script>

<nav aria-label="Banking">
	<List nav>
		<ListItem title="Overview" href="/" active />
		<ListItem title="Cards" href="/cards" />
	</List>
</nav>

<List>
	<ListItem title="Savings" subtitle="Instant access">
		{#snippet append()}$12,480.00{/snippet}
	</ListItem>
</List>
