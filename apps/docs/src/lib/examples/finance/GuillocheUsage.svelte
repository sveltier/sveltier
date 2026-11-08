<script lang="ts">
	import { Amount, Guilloche } from '@sveltier/ui';
</script>

<div class="premium">
	<Guilloche class="premium__art" pattern="rosette" />
	<p>Premium account</p>
	<Amount value={250000} format={{ style: 'currency' }} />
</div>

<style>
	.premium {
		position: relative;
		isolation: isolate;
		overflow: hidden;
	}

	.premium :global(.premium__art) {
		position: absolute;
		inset: 0;
		z-index: -1;
	}
</style>
