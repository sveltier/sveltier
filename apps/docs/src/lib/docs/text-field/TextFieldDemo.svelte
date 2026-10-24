<script lang="ts">
	// A sign-up pair: an email with its hint, and a password with a rule and a reveal button.
	import { Button, TextField } from '@sveltier/ui';

	let email = $state('');
	let password = $state('');
	let visible = $state(false);
	const rules = [(value: string) => /\d/.test(value) || 'Include at least one digit'];
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<TextField
			label="Email"
			type="email"
			name="email"
			autocomplete="email"
			hint="Receipts go to this address"
			required
			bind:value={email}
		/>
		<TextField
			label="Password"
			type={visible ? 'text' : 'password'}
			name="password"
			autocomplete="new-password"
			minlength={8}
			{rules}
			hint="At least 8 characters, with a digit"
			required
			bind:value={password}
		>
			{#snippet append()}
				<Button variant="text" size="sm" onclick={() => (visible = !visible)}>
					{visible ? 'Hide' : 'Show'}
				</Button>
			{/snippet}
		</TextField>
	</div>
	<p class="docs-dim">Type something, then leave the field.</p>
</div>
