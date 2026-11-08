<script>
	import { Button } from '@sveltier/ui';
</script>

<section class="hero">
	<Button class="cta" color="primary">Open an account</Button>
</section>

<style>
	/* The Button's element is not in this component's markup, so reach it
     through :global(), kept inside a local class. */
	.hero :global(.cta) {
		min-inline-size: 16rem;
	}
</style>
