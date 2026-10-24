<script lang="ts">
	import { Alert, Avatar, Button, Card, Chip, List, ListItem } from '@sveltier/ui';

	const people = [
		{ id: 'am', name: 'Amara Mensah', email: 'amara@example.com', role: 'Admin' },
		{ id: 'lk', name: 'Lukas Keller', email: 'lukas@example.com', role: 'Editor' },
		{ id: 'yt', name: 'Yuki Tanaka', email: 'yuki@example.com', role: 'Viewer' }
	];
</script>

<Card title="Invite your team" subtitle="3 of 5 seats on Pro" level={3}>
	<List density="compact">
		{#each people as person (person.id)}
			<ListItem title={person.name} subtitle={person.email}>
				{#snippet prepend()}
					<Avatar size="sm" color="primary">{person.id.toUpperCase()}</Avatar>
				{/snippet}
				{#snippet append()}<Chip size="sm" variant="outlined">{person.role}</Chip>{/snippet}
			</ListItem>
		{/each}
	</List>
	<Alert type="info" density="compact">Invites expire after 7 days.</Alert>
	{#snippet actions()}
		<Button>Send invites</Button>
		<Button variant="text">Copy link</Button>
	{/snippet}
</Card>
