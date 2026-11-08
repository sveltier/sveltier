<script>
	import { virtualList } from '@sveltier/ui';
	let { entries } = $props();

	const list = virtualList(() => ({
		count: entries.length,
		itemSize: 55, // an estimate: each entry is measured once laid out
		key: (index) => entries[index].id
	}));
</script>

<div class="viewport" {@attach list.viewport}>
	<ol style:height="{list.totalSize}px" style:position="relative">
		{#each list.items as item (item.key)}
			<li
				data-index={item.index}
				style:position="absolute"
				style:transform="translateY({item.start}px)"
				{@attach list.measure}
			>
				{entries[item.index].text}
			</li>
		{/each}
	</ol>
</div>
