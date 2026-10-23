<script lang="ts">
	import { focusTrap, type FocusTrapOptions } from '../../lib/primitives/focus/focus-trap.js';

	let {
		open = false,
		inner = false,
		empty = false,
		trap = {}
	}: { open?: boolean; inner?: boolean; empty?: boolean; trap?: FocusTrapOptions } = $props();
</script>

<button type="button">Before</button>
{#if open}
	<div data-testid="outer" {@attach focusTrap(trap)}>
		{#if !empty}
			<button type="button">One</button>
			<button type="button">Two</button>
			<input aria-label="Three" />
		{/if}
		{#if inner}
			<div data-testid="inner" {@attach focusTrap()}>
				<button type="button">Inner A</button>
				<button type="button">Inner B</button>
			</div>
		{/if}
	</div>
{/if}
<button type="button">After</button>
