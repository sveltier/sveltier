<script lang="ts">
	// Filters in a drawer from the end edge, and sharing in a sheet from the bottom.
	import { Button, Checkbox, RadioGroup, Sheet } from '@sveltier/ui';

	const PERIODS = [
		{ value: 7, label: 'Last 7 days' },
		{ value: 30, label: 'Last 30 days' },
		{ value: 90, label: 'Last 90 days' }
	];

	let days = $state<number | null>(30);
	let pending = $state(false);
	let shared = $state('');
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Sheet title="Filters" closable>
			{#snippet trigger(attributes)}<Button {...attributes} variant="outlined">Filters</Button
				>{/snippet}
			<div class="docs-choices docs-choices--groups">
				<RadioGroup label="Period" options={PERIODS} bind:value={days} />
				<Checkbox label="Pending payments only" bind:checked={pending} />
			</div>
			{#snippet actions({ close })}<Button onclick={close}>Show results</Button>{/snippet}
		</Sheet>
		<Sheet title="Share the statement" side="bottom">
			{#snippet trigger(attributes)}<Button {...attributes} variant="tonal">Share</Button>{/snippet}
			The link opens a read-only copy of this month's statement for 7 days.
			{#snippet actions({ close })}
				<Button
					variant="text"
					onclick={() => {
						shared = 'email';
						close();
					}}>Email it</Button
				>
				<Button
					onclick={() => {
						shared = 'link';
						close();
					}}>Copy link</Button
				>
			{/snippet}
		</Sheet>
	</div>
	<p class="docs-dim">
		Bound values: <code>days = {JSON.stringify(days)}</code>,
		<code>pending = {JSON.stringify(pending)}</code>, <code>shared = {JSON.stringify(shared)}</code>
	</p>
</div>
