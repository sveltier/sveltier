<script lang="ts">
	import { keymap, virtualList } from '@sveltier/ui';
	let { options }: { options: string[] } = $props();

	const id = $props.id();
	let active = $state(0);
	const list = virtualList(() => ({ count: options.length, itemSize: 34 }));

	// Focus stays on the listbox; scrollToIndex renders the new active option at once.
	const move = (by: number) => () => {
		active = Math.max(0, Math.min(options.length - 1, active + by));
		list.scrollToIndex(active);
	};
</script>

<div
	role="listbox"
	tabindex="0"
	aria-label="Currency"
	aria-activedescendant="{id}-{active}"
	{@attach list.viewport}
	{@attach keymap({ ArrowDown: move(1), ArrowUp: move(-1) })}
>
	<div style:height="{list.totalSize}px" style:position="relative">
		{#each list.items as item (item.key)}
			<div
				id="{id}-{item.index}"
				role="option"
				aria-selected={item.index === active}
				aria-setsize={options.length}
				aria-posinset={item.index + 1}
				style:position="absolute"
				style:transform="translateY({item.start}px)"
			>
				{options[item.index]}
			</div>
		{/each}
	</div>
</div>
