<script lang="ts">
	// The positions sample in a box as narrow as a phone, so its rows show as blocks.
	import TableStacked from '#lib/examples/components/TableStacked.svelte';
</script>

<div class="docs-demo">
	<div class="narrow">
		<TableStacked />
	</div>
</div>

<style>
	/* A grid item no wider than a phone: the table's box is narrower than its stack width. */
	.narrow {
		min-inline-size: 0;
		max-inline-size: 22.5rem;
	}
</style>
