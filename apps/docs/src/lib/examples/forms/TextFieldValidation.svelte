<script lang="ts">
	import { TextField } from '@sveltier/ui';

	// The result of a SvelteKit form action, with the server's own errors.
	let { form } = $props();
	let username = $state('');

	const rules = [
		(value: string) => /^[a-z0-9_]+$/.test(value) || 'Use lowercase letters, digits and _',
		(value: string) => !value.startsWith('_') || 'Start with a letter or a digit'
	];
</script>

<TextField
	label="Username"
	name="username"
	required
	minlength={3}
	maxlength={20}
	{rules}
	error={form?.errors?.username}
	bind:value={username}
/>
