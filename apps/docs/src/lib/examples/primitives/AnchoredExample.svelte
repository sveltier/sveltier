<script>
	import { anchored, dismissable } from '@sveltier/ui';
	let open = $state(false);
	let trigger = $state();
</script>

<button type="button" bind:this={trigger} aria-expanded={open} onclick={() => (open = !open)}
	>Account</button
>

{#if open}
	<!-- A manual popover sits in the top layer; anchored() places it, dismissable() closes it. -->
	<div
		popover="manual"
		{@attach (element) => element.showPopover()}
		{@attach anchored({ anchor: trigger, side: 'bottom', align: 'end' })}
		{@attach dismissable({ onDismiss: () => (open = false), inside: [trigger] })}
	>
		…
	</div>
{/if}
