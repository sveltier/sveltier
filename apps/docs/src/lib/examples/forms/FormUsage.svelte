<script lang="ts">
	import { Button, Form, TextField } from '@sveltier/ui';

	let email = $state('');
	let password = $state('');
	let sending = $state(false);

	// Called only when every field is valid.
	async function signUp(event: SubmitEvent) {
		event.preventDefault();
		sending = true;
		try {
			await fetch('/api/accounts', { method: 'POST', body: JSON.stringify({ email, password }) });
		} finally {
			sending = false;
		}
	}
</script>

<Form onsubmit={signUp}>
	<TextField label="Email" type="email" name="email" required bind:value={email} />
	<TextField
		label="Password"
		type="password"
		name="password"
		minlength={8}
		required
		bind:value={password}
	/>
	<Button type="submit" loading={sending}>Create account</Button>
</Form>
