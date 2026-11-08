<script>
	import { Button, Popover } from '@sveltier/ui';
</script>

<!-- With text only, the panel itself takes focus: screen readers read it, Escape closes it. -->
<Popover title="Pending payments" side="top" align="center">
	{#snippet trigger(attributes)}
		<Button {...attributes} variant="text">What is pending?</Button>
	{/snippet}
	A payment is pending until the receiving bank confirms it.
</Popover>
