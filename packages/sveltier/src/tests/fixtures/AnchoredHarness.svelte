<script lang="ts">
	// A popover anchored to a fixed button, placed natively or by the fallback script.
	import {
		anchored,
		physical,
		type AnchoredOptions
	} from '../../lib/primitives/anchored/anchored.js';
	import { follow } from '../../lib/primitives/anchored/fallback.js';

	let {
		low = false,
		dir = 'ltr',
		placement = {},
		fallback = false
	}: {
		low?: boolean;
		dir?: 'ltr' | 'rtl';
		placement?: Omit<AnchoredOptions, 'anchor'>;
		fallback?: boolean;
	} = $props();

	let anchor = $state<HTMLButtonElement>();

	function open(element: HTMLElement) {
		element.showPopover();
	}

	// The script path on its own, resolved the way anchored() resolves it.
	function byScript(element: HTMLElement) {
		const [side, align] = physical(
			placement.side ?? 'bottom',
			placement.align ?? 'start',
			dir === 'rtl'
		);
		return follow(anchor!, element, {
			side,
			align,
			offset: placement.offset ?? 5,
			flip: placement.flip ?? true
		});
	}
</script>

<div {dir}>
	<button type="button" class="anchor" class:low data-testid="anchor" bind:this={anchor}
		>Anchor</button
	>
	{#if anchor}
		<div
			popover="manual"
			class="floating"
			data-testid="floating"
			{@attach open}
			{@attach fallback ? byScript : anchored({ anchor, ...placement })}
		>
			Floating
		</div>
	{/if}
</div>

<style>
	.anchor {
		position: fixed;
		inset-block-start: 100px;
		left: 200px;
		inline-size: 120px;
		block-size: 40px;
		margin: 0;
	}

	.low {
		inset-block-start: auto;
		bottom: 20px;
	}

	.floating {
		inline-size: 160px;
		block-size: 80px;
		padding: 0;
		border: 0;
	}
</style>
