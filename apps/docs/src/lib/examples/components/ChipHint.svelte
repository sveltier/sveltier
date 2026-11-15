<script>
	import { Chip, Tooltip } from '@sveltier/ui';
</script>

<!-- A tag that explains itself: focusable, so the keyboard reaches the hint too. -->
<Tooltip text="Simulated data, not the live market">
	{#snippet trigger(attributes)}
		<Chip {...attributes} tabindex={0} size="sm" color="warning">SIM</Chip>
	{/snippet}
</Tooltip>
