<!-- src/App.svelte -->
<script lang="ts">
	import { Button, Card, TextField, UIProvider } from '@sveltier/ui';
	import { monolith } from '@sveltier/ui/themes/monolith';
	import ThemeToggle from './ThemeToggle.svelte';

	let email = $state('');
</script>

<UIProvider themes={monolith}>
	<main>
		<ThemeToggle />
		<Card title="Sign up">
			<TextField label="Email" type="email" bind:value={email} />
			<Button color="primary">Continue</Button>
		</Card>
	</main>
</UIProvider>
