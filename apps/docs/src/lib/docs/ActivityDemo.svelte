<script lang="ts">
	// Entries of any length: each one is measured once it is laid out, so the list follows the
	// width of the page.
	import { useLocale, virtualList } from 'sveltier';

	const COUNT = 10_000;
	const EVENTS = [
		'Payment approved.',
		'Card ending 4471 frozen after three declined attempts in a row.',
		'Transfer to Alex Morgan released after a second review of the counterparty documents and the source of funds statement.',
		'Signed in from a new device.',
		'Direct debit set up for City Utilities, monthly, with the first collection on the 1st.',
		'Limit raised.',
		'September statement ready to download.',
		'Two-step verification turned on for this account and for every device signed in to it, including the two tablets.'
	];
	const LATEST = Date.UTC(2026, 9, 23, 17, 30);

	const locale = useLocale();
	const list = virtualList(() => ({ count: COUNT, itemSize: 55, ssrHeight: 377 }));

	const at = (index: number) => new Date(LATEST - index * 7 * 60_000);
</script>

<div class="docs-demo">
	<!-- Nothing inside can take focus, so the region does, for keyboard scrolling (WCAG 2.1.1). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="docs-virtual"
		role="region"
		aria-label="Activity log"
		tabindex="0"
		{@attach list.viewport}
	>
		<ol class="docs-virtual__content" style:block-size="{list.totalSize}px">
			{#each list.items as item (item.key)}
				{@const time = at(item.index)}
				<li
					class="docs-virtual__entry"
					data-index={item.index}
					aria-posinset={item.index + 1}
					aria-setsize={COUNT}
					style:transform="translateY({item.start}px)"
					{@attach list.measure}
				>
					<time class="docs-dim docs-num" datetime={time.toISOString()}>
						{locale.formatDate(time, {
							timeZone: 'UTC',
							hour: '2-digit',
							minute: '2-digit',
							hourCycle: 'h23'
						})}
					</time>
					<span>{EVENTS[(item.index * 3) % EVENTS.length]}</span>
				</li>
			{/each}
		</ol>
	</div>
	<p class="docs-dim">
		Entries wrap to the width of the page, so their heights are measured, not set. Scroll up from
		the end and the entry you are reading stays still as the ones above it are measured.
	</p>
</div>
