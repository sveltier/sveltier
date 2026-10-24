<script lang="ts">
	// A card that shows its skeleton while loading, and its content once loaded.
	import { Avatar, Button, Skeleton } from '@sveltier/ui';

	let loading = $state(true);
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Button size="sm" variant="tonal" onclick={() => (loading = !loading)}>
			{loading ? 'Finish loading' : 'Load again'}
		</Button>
	</div>
	<section class="docs-skeleton-card" aria-label="Latest transfer" aria-busy={loading}>
		{#if loading}
			<div class="docs-skeleton-card__head">
				<Skeleton type="circle" />
				<Skeleton lines={2} class="docs-skeleton-card__lines" />
			</div>
			<Skeleton type="rect" />
		{:else}
			<div class="docs-skeleton-card__head">
				<Avatar color="primary">AM</Avatar>
				<div>
					<strong>Alex Morgan</strong>
					<div class="docs-dim">Transfer received today</div>
				</div>
			</div>
			<p class="docs-skeleton-card__amount docs-num">+ $1,250.00</p>
		{/if}
	</section>
</div>
