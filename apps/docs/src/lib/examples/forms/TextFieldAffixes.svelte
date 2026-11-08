<script>
	import { mdiMagnify } from '@mdi/js';
	import { Button, Icon, TextField } from '@sveltier/ui';
	let visible = $state(false);
</script>

<TextField label="Search" type="search" variant="elevated">
	{#snippet prepend()}<Icon path={mdiMagnify} />{/snippet}
</TextField>

<TextField label="Password" type={visible ? 'text' : 'password'} autocomplete="current-password">
	{#snippet append()}
		<Button variant="text" size="sm" onclick={() => (visible = !visible)}>
			{visible ? 'Hide' : 'Show'}
		</Button>
	{/snippet}
</TextField>
