<script>
	import { Button, Checkbox, Sheet } from '@sveltier/ui';
	let pending = $state(false);
</script>

<!-- A drawer from the end edge: the right in left-to-right pages, the left in right-to-left ones. -->
<Sheet title="Filters" closable>
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="outlined">Filters</Button>
	{/snippet}

	<Checkbox label="Pending payments only" bind:checked={pending} />

	{#snippet actions({ close })}
		<Button onclick={close}>Show results</Button>
	{/snippet}
</Sheet>

<!-- A sheet from the bottom, as on a phone. -->
<Sheet title="Share the statement" side="bottom">…</Sheet>
