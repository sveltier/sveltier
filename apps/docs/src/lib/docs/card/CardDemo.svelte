<script lang="ts">
	// A full card, and the same summary in other variants and colours.
	import { Avatar, Button, Card, Chip, Icon, type Color, type Variant } from 'sveltier';

	const DOTS =
		'M5 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z';
	const OTHERS: Array<{ variant: Variant; color: Color; title: string }> = [
		{ variant: 'outlined', color: 'neutral', title: 'Outlined' },
		{ variant: 'tonal', color: 'neutral', title: 'Tonal' },
		{ variant: 'flat', color: 'primary', title: 'Flat' }
	];
</script>

<div class="docs-demo">
	<div class="docs-card-grid">
		<Card title="Savings" subtitle="Instant access · 4.1% AER" level={3}>
			{#snippet prepend()}<Avatar color="success">SV</Avatar>{/snippet}
			{#snippet append()}
				<Button icon variant="text" aria-label="Savings options"><Icon path={DOTS} /></Button>
			{/snippet}
			<p class="docs-card-amount">$12,480.00</p>
			<div class="docs-actions">
				<Chip color="success">+ $120.00 this month</Chip>
			</div>
			{#snippet actions()}
				<Button variant="tonal">Add money</Button>
				<Button variant="text">Statement</Button>
			{/snippet}
		</Card>
		<div class="docs-card-stack">
			{#each OTHERS as card (card.title)}
				<Card
					variant={card.variant}
					color={card.color}
					title={card.title}
					subtitle="Pending · $310.25"
				/>
			{/each}
		</div>
	</div>
</div>
