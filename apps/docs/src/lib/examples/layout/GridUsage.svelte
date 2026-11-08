<script>
	import { Card, Col, Container, Row } from '@sveltier/ui';

	const accounts = [
		{ id: 1, name: 'Current account', note: '•• 4821' },
		{ id: 2, name: 'Savings', note: 'Instant access' },
		{ id: 3, name: 'Travel', note: 'Euro wallet' }
	];
</script>

<Container>
	<!-- One card a line on a phone, two from sm (600px), three from md (960px). -->
	<Row>
		{#each accounts as account (account.id)}
			<Col cols={12} sm={6} md={4}>
				<Card title={account.name} subtitle={account.note} />
			</Col>
		{/each}
	</Row>
</Container>
