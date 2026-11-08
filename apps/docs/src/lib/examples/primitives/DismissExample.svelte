<script>
	import { dismissable } from '@sveltier/ui';
	let open = $state(false);
	let trigger = $state();
</script>

<button type="button" bind:this={trigger} aria-expanded={open} onclick={() => (open = !open)}
	>Filters</button
>

{#if open}
	<!-- The trigger counts as inside, so pressing it toggles instead of dismissing. -->
	<div {@attach dismissable({ onDismiss: () => (open = false), inside: [trigger] })}>…</div>
{/if}
