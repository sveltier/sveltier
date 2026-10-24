<script lang="ts">
	// A popover placed against its trigger; change the side and alignment while it is open.
	import { anchored, dismissable, type Align, type Side } from '@sveltier/ui';
	import Segmented from '../Segmented.svelte';

	const SIDES: Side[] = ['top', 'bottom', 'start', 'end'];
	const ALIGNS: Align[] = ['start', 'center', 'end'];
	const options = <T extends string>(values: readonly T[]) =>
		values.map((value) => ({ value, label: value }));

	let open = $state(false);
	let side = $state<Side>('bottom');
	let align = $state<Align>('start');
	let trigger = $state<HTMLButtonElement>();
	let controls = $state<HTMLDivElement>();

	function show(element: HTMLElement) {
		element.showPopover();
	}
</script>

<div class="docs-demo">
	<div class="docs-demo__controls" bind:this={controls}>
		<Segmented
			label="Side"
			name="anchored-side"
			options={options(SIDES)}
			value={side}
			onchange={(value) => (side = value)}
		/>
		<Segmented
			label="Align"
			name="anchored-align"
			options={options(ALIGNS)}
			value={align}
			onchange={(value) => (align = value)}
		/>
	</div>
	<div class="docs-anchored-stage">
		<button
			type="button"
			class="docs-button"
			bind:this={trigger}
			aria-expanded={open}
			onclick={() => (open = !open)}>Account</button
		>
	</div>
	{#if open}
		<div
			class="docs-anchored"
			popover="manual"
			role="group"
			aria-label="Account"
			{@attach show}
			{@attach anchored({ anchor: trigger, side, align })}
			{@attach dismissable({ onDismiss: () => (open = false), inside: [trigger, controls] })}
		>
			<strong>Alex Morgan</strong>
			<span class="docs-dim">Private banking</span>
		</div>
	{/if}
	<p class="docs-dim">
		Open the popover, then change its side and alignment. Near an edge of the window it flips to the
		other side.
	</p>
</div>
