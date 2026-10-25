<script lang="ts">
	// One page of the example app: the same balances and payments under each page's title.
	import { Card, List, ListItem } from '@sveltier/ui';
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

<div class="example-page">
	<h1>{data.title}</h1>
	<div class="example-cards">
		<Card title="Current account" subtitle="•• 4821" level={2}>
			<p class="example-amount">$8,240.50</p>
		</Card>
		<Card title="Savings" subtitle="Instant access" level={2}>
			<p class="example-amount">$12,480.00</p>
		</Card>
	</div>
	<h2>Recent payments</h2>
	<List>
		{#each PAYMENTS as [name, method, amount], index (index)}
			<ListItem title={name} subtitle={method}>
				{#snippet append()}<span class="example-amount">{amount}</span>{/snippet}
			</ListItem>
		{/each}
	</List>
</div>

<style>
	.example-page {
		display: grid;
		gap: var(--sv-space-21);
		max-inline-size: 55rem;
		padding: var(--sv-space-21);
	}

	h1 {
		font: var(--sv-weight-display) var(--sv-text-title) / var(--sv-leading-snug)
			var(--sv-font-display);
		letter-spacing: var(--sv-tracking-display);
	}

	h2 {
		font: var(--sv-weight-display) var(--sv-text-lg) / var(--sv-leading-snug) var(--sv-font-display);
	}

	.example-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: var(--sv-space-13);
	}

	.example-amount {
		font-family: var(--sv-font-data);
		font-variant-numeric: tabular-nums;
	}

	.example-cards .example-amount {
		font-size: var(--sv-text-xl);
	}
</style>
