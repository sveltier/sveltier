<script lang="ts">
	// One page of the example app: the same balances and payments under each page's title.
	import { Card, Col, Container, List, ListItem, Row } from '@sveltier/ui';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const PAYMENTS = [
		['Northwind Grocers', 'Card •• 4821', '−$64.20'],
		['Salary', 'Transfer in', '+$4,250.00'],
		['City Water', 'Direct debit', '−$38.75'],
		['Atlas Rail', 'Card •• 4821', '−$12.40'],
		['Savings', 'Transfer out', '−$500.00'],
		['Bistro Lumen', 'Card •• 4821', '−$46.90'],
		['Bookshop & Co', 'Card •• 4821', '−$22.15'],
		['Gym membership', 'Direct debit', '−$29.00'],
		['Refund: Atlas Rail', 'Card •• 4821', '+$12.40'],
		['Electricity', 'Direct debit', '−$71.30']
	];
</script>

<svelte:head>
	<title>{data.title} · App layout example · Sveltier</title>
</svelte:head>

<Container size="md" class="example-page">
	<h1>{data.title}</h1>
	<Row gap={13}>
		<Col cols={12} sm={6}>
			<Card title="Current account" subtitle="•• 4821" level={2}>
				<p class="example-balance">$8,240.50</p>
			</Card>
		</Col>
		<Col cols={12} sm={6}>
			<Card title="Savings" subtitle="Instant access" level={2}>
				<p class="example-balance">$12,480.00</p>
			</Card>
		</Col>
	</Row>
	<h2>Recent payments</h2>
	<List>
		{#each PAYMENTS as [name, method, amount], index (index)}
			<ListItem title={name} subtitle={method}>
				{#snippet append()}<span class="example-amount">{amount}</span>{/snippet}
			</ListItem>
		{/each}
	</List>
</Container>

<style>
	/* The page's blocks a φ step apart, inside the container's width. */
	:global(.example-page) {
		display: grid;
		gap: var(--sv-space-21);
	}

	h1 {
		font: var(--sv-weight-display) var(--sv-text-title) / var(--sv-leading-snug)
			var(--sv-font-display);
		letter-spacing: var(--sv-tracking-display);
	}

	h2 {
		font: var(--sv-weight-display) var(--sv-text-lg) / var(--sv-leading-snug) var(--sv-font-display);
	}

	.example-amount,
	.example-balance {
		font-family: var(--sv-font-data);
		font-variant-numeric: tabular-nums;
	}

	.example-balance {
		font-size: var(--sv-text-xl);
	}
</style>
