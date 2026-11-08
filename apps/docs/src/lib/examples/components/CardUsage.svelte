<script>
	import { Avatar, Button, Card } from '@sveltier/ui';
</script>

<Card title="Savings" subtitle="Instant access" level={3}>
	{#snippet prepend()}<Avatar color="success">SV</Avatar>{/snippet}
	<p>$12,480.00</p>
	{#snippet actions()}
		<Button variant="tonal">Add money</Button>
		<Button variant="text">Statement</Button>
	{/snippet}
</Card>
