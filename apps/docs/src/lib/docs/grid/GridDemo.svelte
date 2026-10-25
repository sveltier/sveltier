<script lang="ts">
	// Accounts as cards: one a line on a phone, two from sm, three from md. Resize the window to
	// see the spans change.
	import { Card, Col, Row } from '@sveltier/ui';

	const ACCOUNTS = [
		{ name: 'Current account', note: '•• 4821', balance: '$8,240.50' },
		{ name: 'Savings', note: 'Instant access', balance: '$12,480.00' },
		{ name: 'Travel', note: 'Euro wallet', balance: '€1,315.20' }
	];
</script>

<div class="docs-demo">
	<Row>
		{#each ACCOUNTS as account (account.name)}
			<Col cols={12} sm={6} md={4}>
				<Card title={account.name} subtitle={account.note} level={3}>
					<p class="docs-balance">{account.balance}</p>
				</Card>
			</Col>
		{/each}
	</Row>
</div>
