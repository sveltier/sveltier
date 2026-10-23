<script lang="ts">
	// Two nested layers with a trigger outside them; every dismissal is logged.
	import { untrack } from 'svelte';
	import { dismissable } from '../../lib/primitives/layer/dismissable.js';

	let {
		innerOpen = false,
		focusOutside = false,
		escape = true
	}: { innerOpen?: boolean; focusOutside?: boolean; escape?: boolean } = $props();

	let outer = $state(true);
	let inner = $state(untrack(() => innerOpen));
	let trigger = $state<HTMLButtonElement>();
	const log = $state<string[]>([]);

	function clearOnEscape(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (event.key === 'Escape' && event.currentTarget.value) {
			event.preventDefault();
			event.currentTarget.value = '';
		}
	}
</script>

<button type="button" bind:this={trigger} onclick={() => (outer = !outer)}>Trigger</button>
<button type="button">Outside</button>
{#if outer}
	<div
		data-testid="outer"
		{@attach dismissable({
			onDismiss: (reason) => {
				log.push(`outer:${reason}`);
				outer = false;
			},
			inside: [trigger],
			escape
		})}
	>
		<button type="button" onclick={() => (inner = true)}>Open inner</button>
		<input aria-label="Outer field" />
		{#if inner}
			<div
				data-testid="inner"
				{@attach dismissable({
					onDismiss: (reason) => {
						log.push(`inner:${reason}`);
						inner = false;
					},
					focusOutside
				})}
			>
				<input aria-label="Search" onkeydown={clearOnEscape} />
			</div>
		{/if}
	</div>
{/if}
<output data-testid="log">{log.join(',')}</output>
