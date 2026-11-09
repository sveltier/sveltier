<script lang="ts">
	// The venues sample in a box as narrow as a phone, so it scrolls across with its venue pinned.
	import TablePinned from '#lib/examples/components/TablePinned.svelte';
</script>

<div class="docs-demo">
	<div class="narrow">
		<TablePinned />
	</div>
</div>

<style>
	/* A grid item no wider than a phone, which may shrink below its table: the table scrolls. */
	.narrow {
		min-inline-size: 0;
		max-inline-size: 20rem;
	}
</style>
