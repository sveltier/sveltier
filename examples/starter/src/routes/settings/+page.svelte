<script lang="ts">
	import { Button, Card, Form, SegmentedControl, Switch, TextField, useToast } from '@sveltier/ui';

	const toast = useToast();

	let company = $state('Acme Studio');
	let email = $state('billing@example.com');
	let terms = $state('30');
	let reminders = $state(true);

	function save(event: SubmitEvent) {
		event.preventDefault();
		// Send the settings to your server here.
		toast.show('Settings saved', { color: 'success' });
	}
</script>

<svelte:head><title>Settings · Starter</title></svelte:head>

<div class="page">
	<h1>Settings</h1>
	<Card title="Billing" level={2}>
		<Form onsubmit={save}>
			<div class="fields">
				<TextField label="Company" name="company" required bind:value={company} />
				<TextField
					label="Billing email"
					name="email"
					type="email"
					hint="Where clients reply to invoices"
					required
					bind:value={email}
				/>
				<div class="terms">
					<span id="terms-label">Payment terms, in days</span>
					<SegmentedControl
						aria-labelledby="terms-label"
						options={[
							{ value: '15', label: '15' },
							{ value: '30', label: '30' },
							{ value: '60', label: '60' }
						]}
						bind:value={terms}
					/>
				</div>
				<Switch
					label="Remind clients"
					hint="An email three days before an invoice is due"
					bind:checked={reminders}
				/>
				<div><Button type="submit">Save</Button></div>
			</div>
		</Form>
	</Card>
</div>

<style>
	.page {
		display: grid;
		gap: var(--sv-space-21);
		padding: var(--sv-space-21);
		max-inline-size: 40rem;
	}
	h1 {
		margin: 0;
	}
	.fields {
		display: grid;
		gap: var(--sv-space-21);
	}
	.terms {
		display: grid;
		gap: var(--sv-space-8);
	}
</style>
