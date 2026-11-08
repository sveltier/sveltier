<script>
	import { Button, NumberField, Popover } from '@sveltier/ui';
	let from = $state(null);
	let to = $state(null);
</script>

<Popover title="Amount range" size="sm">
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Amount</Button>
	{/snippet}

	<div class="range">
		<NumberField label="From" min={0} bind:value={from} />
		<NumberField label="To" min={0} bind:value={to} />
	</div>

	{#snippet actions({ close })}
		<Button onclick={close}>Apply</Button>
	{/snippet}
</Popover>

<style>
	/* Fields stacked with the theme's spacing. */
	.range {
		display: grid;
		gap: var(--sv-space-13);
	}
</style>
