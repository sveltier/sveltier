<script>
	import { Skeleton } from '@sveltier/ui';

	let { loading } = $props();
</script>

<!-- aria-busy tells assistive technology to wait for the real content. -->
<section aria-busy={loading}>
	{#if loading}
		<Skeleton type="circle" />
		<Skeleton lines={2} />
		<Skeleton type="rect" />
	{:else}
		…
	{/if}
</section>
