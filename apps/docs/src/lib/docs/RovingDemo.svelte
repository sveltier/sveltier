<script lang="ts">
	// A radio group: one tab stop, arrows move focus, and focus selects, as the APG pattern says.
	import { rovingFocus } from '@sveltier/ui';

	const RANGES = ['1D', '1W', '1M', '1Y', 'All'];
	let range = $state('1W');
</script>

<div class="docs-demo">
	<div class="docs-toolbar" role="radiogroup" aria-label="Chart range" {@attach rovingFocus()}>
		{#each RANGES as value (value)}
			<button
				type="button"
				role="radio"
				class="docs-toolbar__item"
				data-sv-item
				aria-checked={range === value}
				onclick={() => (range = value)}
				onfocus={() => (range = value)}>{value}</button
			>
		{/each}
	</div>
	<p class="docs-dim">
		Tab in, then use the arrow keys, Home and End. The group is a single tab stop, and Tab leaves
		it.
	</p>
</div>
