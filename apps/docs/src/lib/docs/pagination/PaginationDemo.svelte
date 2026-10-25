<script lang="ts">
	// Transactions ten to a page: the pagination of buttons follows the page shown.
	import { Pagination } from '@sveltier/ui';

	const TOTAL = 87;
	const PER_PAGE = 10;
	let page = $state(1);
	const first = $derived((page - 1) * PER_PAGE + 1);
	const last = $derived(Math.min(page * PER_PAGE, TOTAL));
</script>

<div class="docs-demo">
	<Pagination count={Math.ceil(TOTAL / PER_PAGE)} bind:page />
	<p class="docs-dim">Showing transactions {first}–{last} of {TOTAL}</p>
</div>
