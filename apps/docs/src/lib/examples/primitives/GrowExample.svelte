<script lang="ts">
	import { grow } from '@sveltier/ui';

	let button = $state<HTMLButtonElement>();
	let open = $state(false);
</script>

<button bind:this={button} type="button" aria-expanded={open} onclick={() => (open = !open)}>
	Filters
</button>

{#if open}
	<!-- Grows out of the button, and shrinks back into it as it closes. -->
	<div role="group" aria-label="Filters" transition:grow={{ from: () => button }}>
		Only open orders
	</div>
{/if}
