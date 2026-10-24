<script lang="ts">
	// Constraints, then rules, then an answer from the server, which clears when the user types.
	import { Button, TextField } from '@sveltier/ui';

	const TAKEN = ['ada', 'grace', 'alan'];
	const rules = [
		(value: string) => /^[a-z0-9_]+$/.test(value) || 'Use lowercase letters, digits and _',
		(value: string) => !value.startsWith('_') || 'Start with a letter or a digit'
	];

	let username = $state('');
	let taken = $state<string | null>(null);
	let checking = $state(false);

	// Stands in for a request to the server.
	async function check() {
		checking = true;
		await new Promise((done) => setTimeout(done, 610));
		taken = TAKEN.includes(username) ? `“${username}” is taken` : null;
		checking = false;
	}
</script>

<div class="docs-demo">
	<TextField
		label="Username"
		hint="Lowercase letters, digits and _. Try “ada”."
		required
		minlength={3}
		maxlength={20}
		{rules}
		error={taken}
		oninput={() => (taken = null)}
		bind:value={username}
	>
		{#snippet append()}
			<Button variant="text" size="sm" loading={checking} onclick={check}>Check</Button>
		{/snippet}
	</TextField>
</div>
