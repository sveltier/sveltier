<script lang="ts">
	// A virtual list in a fixed viewport. Items are measured when they have real heights: set
	// ones (`heights`), or their own content plus `padding`.
	import type { VirtualList } from '../../lib/primitives/virtual/virtual-list.svelte.js';

	let {
		list,
		heights,
		padding,
		height = 200,
		hidden = false
	}: {
		list: VirtualList;
		heights?: (index: number) => number;
		padding?: number;
		height?: number;
		hidden?: boolean;
	} = $props();

	const natural = $derived(padding !== undefined);
	const measured = $derived(natural || heights !== undefined);
</script>

<div
	class="viewport"
	data-testid="viewport"
	style:block-size="{height}px"
	style:display={hidden ? 'none' : undefined}
	{@attach list.viewport}
>
	<div class="content" data-testid="content" style:block-size="{list.totalSize}px">
		{#each list.items as item (item.key)}
			<div
				class="item"
				data-index={item.index}
				data-key={item.key}
				style:block-size={natural ? undefined : `${heights ? heights(item.index) : item.size}px`}
				style:padding-block={natural ? `${padding}px` : undefined}
				style:transform="translateY({item.start}px)"
				{@attach measured && list.measure}
			>
				Item {item.index}
			</div>
		{/each}
	</div>
</div>

<style>
	.viewport {
		position: relative;
		overflow-y: auto;
		inline-size: 240px;
	}

	.content {
		position: relative;
	}

	.item {
		position: absolute;
		inset-block-start: 0;
		inset-inline: 0;
		box-sizing: border-box;
		overflow: hidden;
		font-size: 14px;
		line-height: 20px;
	}
</style>
