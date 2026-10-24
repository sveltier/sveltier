<script lang="ts">
	// A sign-up form against a pretend server: it checks on submit, focuses the first problem,
	// shows the server's own answer, and lets you choose when the messages appear.
	import { Button, Form, SegmentedControl, TextField, type ValidateOn } from '@sveltier/ui';

	const TIMINGS: Array<{ value: ValidateOn; label: string }> = [
		{ value: 'blur', label: 'On blur' },
		{ value: 'input', label: 'On input' },
		{ value: 'submit', label: 'On submit' }
	];

	let validateOn = $state<ValidateOn>('blur');
	let email = $state('');
	let password = $state('');
	let sending = $state(false);
	let taken = $state<string | null>(null);
	let welcome = $state('');

	// Stands in for a request to the server.
	async function signUp(event: SubmitEvent) {
		event.preventDefault();
		sending = true;
		welcome = '';
		await new Promise((done) => setTimeout(done, 987));
		sending = false;
		if (email.startsWith('ada@')) taken = 'An account with this email already exists';
		else welcome = `Account created for ${email}.`;
	}
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<SegmentedControl
			options={TIMINGS}
			bind:value={validateOn}
			size="sm"
			aria-label="When messages show"
		/>
	</div>
	<Form {validateOn} onsubmit={signUp} class="docs-form">
		<TextField
			label="Email"
			type="email"
			name="email"
			autocomplete="email"
			hint="Try ada@example.com to see the server's answer"
			required
			error={taken}
			oninput={() => (taken = null)}
			bind:value={email}
		/>
		<TextField
			label="Password"
			type="password"
			name="password"
			autocomplete="new-password"
			hint="At least 8 characters"
			minlength={8}
			required
			bind:value={password}
		/>
		<Button type="submit" loading={sending}>Create account</Button>
	</Form>
	<p class="docs-dim" aria-live="polite">{welcome}</p>
</div>
