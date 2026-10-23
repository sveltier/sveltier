<script lang="ts">
	// Filters that toggle, removable tags, and a few colours.
	import { Chip, type Color } from 'sveltier';

	const FILTERS = ['Card', 'Transfer', 'Direct debit', 'Refund'];
	let chosen = $state<Record<string, boolean>>({
		Card: true,
		Transfer: false,
		'Direct debit': false,
		Refund: false
	});
	let tags = $state(['EUR', 'GBP', 'JPY', 'USD']);
	const STATUSES: Array<{ label: string; color: Color }> = [
		{ label: 'Settled', color: 'success' },
		{ label: 'Pending', color: 'warning' },
		{ label: 'Declined', color: 'error' },
		{ label: 'Scheduled', color: 'info' }
	];
	const count = $derived(Object.values(chosen).filter(Boolean).length);
</script>

<div class="docs-demo">
	<div class="docs-actions" role="group" aria-label="Transaction types">
		{#each FILTERS as filter (filter)}
			<Chip bind:selected={chosen[filter]}>{filter}</Chip>
		{/each}
	</div>
	<p class="docs-dim" aria-live="polite">
		{count} of {FILTERS.length} transaction types shown.
	</p>
	<div class="docs-actions" role="group" aria-label="Watched currencies">
		{#each tags as tag (tag)}
			<Chip
				closable
				closeLabel="Remove {tag}"
				onclose={() => (tags = tags.filter((t) => t !== tag))}
			>
				{tag}
			</Chip>
		{/each}
		{#if tags.length === 0}
			<span class="docs-dim">No currencies watched.</span>
		{/if}
	</div>
	<div class="docs-actions">
		{#each STATUSES as status (status.label)}
			<Chip color={status.color}>{status.label}</Chip>
		{/each}
	</div>
</div>
