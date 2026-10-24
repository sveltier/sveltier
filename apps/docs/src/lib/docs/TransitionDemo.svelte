<script lang="ts">
	// A receipt that mounts and unmounts with the theme's timing, with a choice of transition.
	import { fade, pop, rise, type TransitionOptions } from '@sveltier/ui';
	import Segmented from '../Segmented.svelte';

	const TRANSITIONS = { fade, rise, pop };
	type Kind = keyof typeof TRANSITIONS;
	const KINDS = Object.keys(TRANSITIONS) as Kind[];

	let kind = $state<Kind>('rise');
	let shown = $state(true);

	// The directive takes one function, so this one runs whichever transition is chosen.
	const chosen = (node: Element, options?: TransitionOptions) => TRANSITIONS[kind](node, options);
</script>

<div class="docs-demo">
	<div class="docs-demo__controls">
		<Segmented
			label="Transition"
			name="motion-transition"
			options={KINDS.map((value) => ({ value, label: value }))}
			value={kind}
			onchange={(value) => (kind = value)}
		/>
		<button type="button" class="docs-button" aria-expanded={shown} onclick={() => (shown = !shown)}
			>Receipt</button
		>
	</div>
	<div class="docs-motion-stage">
		{#if shown}
			<div class="docs-receipt" role="group" aria-label="Transfer receipt" transition:chosen>
				<span class="docs-dim">Transfer sent</span>
				<strong class="docs-receipt__amount">€1,250.00</strong>
				<span class="docs-dim">To Alex Morgan, reference 4471</span>
			</div>
		{/if}
	</div>
	<p class="docs-dim">
		Hide and show the receipt with each transition. Switch theme packs to feel their timing, or turn
		on reduced motion in your system settings to see it become instant.
	</p>
</div>
