<script lang="ts">
	// 100,000 transactions in a scrolling region; only the rows in view exist in the page.
	import { useLocale, virtualList } from '@sveltier/ui';

	const COUNT = 100_000;
	const MERCHANTS = [
		'Coffee Collective',
		'Northwind Grocers',
		'Metro Transit',
		'Harbor Rent',
		'City Utilities',
		'Atlas Insurance',
		'Streamline Media'
	];

	const locale = useLocale();
	const list = virtualList(() => ({ count: COUNT, itemSize: 34, ssrHeight: 377 }));
	let row = $state(50_000);

	// Each transaction is worked out from its index: there is no array of 100,000 objects.
	function transaction(index: number) {
		if (index % 21 === 0) return { label: 'Salary', amount: 3_200 };
		const label = MERCHANTS[(index * 5) % MERCHANTS.length]!;
		return { label, amount: -(((index * 7919) % 24_000) + 100) / 100 };
	}

	function go(event: SubmitEvent) {
		event.preventDefault();
		list.scrollToIndex(row - 1, { align: 'center' });
	}
</script>

<div class="docs-demo">
	<form class="docs-virtual-go" onsubmit={go}>
		<label class="docs-field">
			<span>Row</span>
			<input type="number" min="1" max={COUNT} required bind:value={row} />
		</label>
		<button type="submit" class="docs-button">Go</button>
	</form>
	<!-- Nothing inside can take focus, so the region does, for keyboard scrolling (WCAG 2.1.1). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="docs-virtual"
		role="region"
		aria-label="Transactions"
		tabindex="0"
		{@attach list.viewport}
	>
		<div class="docs-virtual__content" role="list" style:block-size="{list.totalSize}px">
			{#each list.items as item (item.key)}
				{@const entry = transaction(item.index)}
				<div
					class="docs-virtual__row"
					role="listitem"
					aria-posinset={item.index + 1}
					aria-setsize={COUNT}
					style:block-size="{item.size}px"
					style:transform="translateY({item.start}px)"
				>
					<span class="docs-dim docs-num">{locale.formatNumber(item.index + 1)}</span>
					<span class="docs-virtual__label">{entry.label}</span>
					<span class="docs-num">
						{locale.formatCurrency(entry.amount, 'USD', { signDisplay: 'exceptZero' })}
					</span>
				</div>
			{/each}
		</div>
	</div>
	<p class="docs-dim">
		{locale.formatNumber(COUNT)} transactions. Only the rows in view, and three more on each side, are
		in the page.
	</p>
</div>
