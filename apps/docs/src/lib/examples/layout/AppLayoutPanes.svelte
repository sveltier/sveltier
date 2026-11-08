<!-- Panes as tall as Main, each scrolling on its own. -->
<div class="panes">
	<section aria-label="Chart">…</section>
	<section aria-label="Order book">…</section>
</div>

<style>
	.panes {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20rem;
		block-size: 100%;
	}

	section {
		overflow: auto;
	}
</style>
