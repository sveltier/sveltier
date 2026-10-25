<script lang="ts">
	// An amount filter with two fields and its actions, and a short explanation beside a button.
	import { Button, NumberField, Popover } from '@sveltier/ui';

	let from = $state<number | null>(null);
	let to = $state<number | null>(null);
	let applied = $state('any amount');

	function apply(close: () => void) {
		applied = from == null && to == null ? 'any amount' : `${from ?? 0} to ${to ?? '∞'}`;
		close();
	}
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Popover title="Amount range" size="sm">
			{#snippet trigger(attributes)}
				<Button {...attributes} variant="outlined">Amount</Button>
			{/snippet}
			<div class="docs-fields">
				<NumberField label="From" min={0} bind:value={from} />
				<NumberField label="To" min={0} bind:value={to} />
			</div>
			{#snippet actions({ close })}
				<Button
					variant="text"
					onclick={() => {
						from = to = null;
						apply(close);
					}}>Clear</Button
				>
				<Button onclick={() => apply(close)}>Apply</Button>
			{/snippet}
		</Popover>
		<Popover title="Pending payments" side="top" align="center">
			{#snippet trigger(attributes)}
				<Button {...attributes} variant="text">What is pending?</Button>
			{/snippet}
			A payment is pending until the receiving bank confirms it, usually within one working day. Until
			then you can still cancel it.
		</Popover>
	</div>
	<p class="docs-dim">Showing: <code>{applied}</code></p>
</div>
