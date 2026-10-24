<script lang="ts">
	// An upload that advances, the circular form at a few values, and both while busy.
	import { Button, ProgressCircular, ProgressLinear, type Color } from '@sveltier/ui';

	let uploaded = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	function upload() {
		clearInterval(timer);
		uploaded = 0;
		timer = setInterval(() => {
			uploaded = Math.min(100, uploaded + 13);
			if (uploaded === 100) clearInterval(timer);
		}, 233);
	}

	const VALUES: Array<{ value: number; color: Color }> = [
		{ value: 25, color: 'primary' },
		{ value: 62, color: 'info' },
		{ value: 100, color: 'success' }
	];
</script>

<div class="docs-demo">
	<div class="docs-progress-upload">
		<ProgressLinear value={uploaded} label="Uploading statement" />
		<div class="docs-actions docs-actions--baseline">
			<Button size="sm" variant="tonal" onclick={upload}>Upload statement</Button>
			<span class="docs-dim docs-num" aria-hidden="true">{uploaded}%</span>
		</div>
	</div>
	<div class="docs-actions docs-actions--baseline">
		{#each VALUES as item (item.value)}
			<ProgressCircular value={item.value} color={item.color} size="lg"
				>{item.value}%</ProgressCircular
			>
		{/each}
		<ProgressCircular indeterminate label="Loading accounts" />
	</div>
	<ProgressLinear indeterminate label="Syncing transactions" />
</div>
