<script lang="ts" generics="T extends string | number">
	// Tabs and the selected tab's panel. See TabsProps for the props.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { rovingFocus } from '../../primitives/focus/roving-focus.js';
	import './tabs.css';
	import type { TabsDefaults, TabsItem, TabsProps } from './types.js';

	let {
		color,
		size,
		density,
		grow,
		items,
		value = $bindable(),
		onchange,
		activation = 'automatic',
		panel,
		id,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		class: className,
		ref = $bindable(null),
		...rest
	}: TabsProps<T> = $props();

	const resolve = useDefaults<TabsDefaults>('Tabs', {
		color: 'primary',
		size: 'md',
		density: 'default',
		grow: false
	});
	const p = $derived(resolve({ color, size, density, grow }));
	const base = $props.id();
	const prefix = $derived(id ?? base);

	// Without a value, the first tab that can be chosen.
	const index = $derived.by(() => {
		const chosen = items.findIndex((item) => item.value === value);
		return chosen >= 0 ? chosen : items.findIndex((item) => !item.disabled);
	});
	const selected = $derived(items[index]);

	function select(item: TabsItem<T>) {
		if (item.disabled || item.value === selected?.value) return;
		value = item.value;
		onchange?.(item.value);
	}
</script>

<div
	bind:this={ref}
	{...rest}
	id={prefix}
	class={['sv-tabs', sharedClasses(p), p.grow && 'sv-tabs--grow', className]}
>
	<div
		role="tablist"
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		class="sv-tabs__list"
		{@attach rovingFocus({ orientation: 'horizontal' })}
	>
		{#each items as item, i (item.value)}
			<button
				type="button"
				role="tab"
				id="{prefix}-tab-{i}"
				class="sv-tabs__tab"
				data-sv-item
				aria-selected={i === index}
				aria-controls={i === index && panel ? `${prefix}-panel` : undefined}
				disabled={item.disabled}
				onclick={() => select(item)}
				onfocus={() => activation === 'automatic' && select(item)}
			>
				{item.label}
			</button>
		{/each}
	</div>
	{#if panel && selected}
		<!-- Focusable, so keyboard users reach a panel with nothing focusable in it (APG). -->
		<div
			role="tabpanel"
			id="{prefix}-panel"
			aria-labelledby="{prefix}-tab-{index}"
			tabindex="0"
			class="sv-tabs__panel"
		>
			{@render panel(selected)}
		</div>
	{/if}
</div>
