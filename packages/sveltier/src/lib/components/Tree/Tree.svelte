<script lang="ts" generics="I extends TreeItem">
	// Nested nodes to browse and select one of. See TreeProps.
	import { DEV, warnDuplicates, warnUnnamed } from '#dev';
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import { typeahead } from '../../primitives/keyboard/typeahead.js';
	import './tree.css';
	import type { TreeDefaults, TreeItem, TreeProps } from './types.js';

	let {
		density,
		color,
		items,
		value = $bindable(null),
		expanded = $bindable([]),
		onselect,
		item: itemSnippet,
		onkeydown: keydown,
		class: className,
		ref = $bindable(null),
		...rest
	}: TreeProps<I> = $props();

	const resolve = useDefaults<TreeDefaults>('Tree', { density: 'default', color: 'primary' });
	const p = $derived(resolve({ density, color }));

	const CHEVRON = 'M5.6 8.6 12 15l6.4-6.4L20 10.2l-8 8-8-8z';

	/** A shown node, where it sits. */
	interface Node {
		item: I;
		parent: Node | null;
		/** Its siblings, itself among them. */
		siblings: readonly I[];
	}

	const open = $derived(new Set(expanded));
	const isParent = (item: I) => item.children !== undefined;
	const childrenOf = (item: I) => (item.children ?? []) as readonly I[];

	// The nodes shown, in order: the top level, and the children of each open parent.
	const shown = $derived.by(() => {
		const nodes: Node[] = [];
		const walk = (list: readonly I[], parent: Node | null) => {
			for (const item of list) {
				const node = { item, parent, siblings: list };
				nodes.push(node);
				if (isParent(item) && open.has(item.value)) walk(childrenOf(item), node);
			}
		};
		walk(items, null);
		return nodes;
	});
	const indexOf = $derived(new Map(shown.map((node, index) => [node.item.value, index])));

	// The node last focused; the tab stop is it, else the selected node, else the first.
	let focused = $state<string | null>(null);
	const stop = $derived(
		[focused, value].find((v) => v != null && indexOf.has(v)) ?? shown[0]?.item.value
	);

	// The treeitem of each shown node, to move focus to. Not state: only handlers read it.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- never read reactively
	const elements = new Map<string, HTMLElement>();
	const register = (key: string) => (element: HTMLElement) => {
		elements.set(key, element);
		return () => {
			if (elements.get(key) === element) elements.delete(key);
		};
	};

	function focusNode(node: Node | undefined) {
		if (!node) return;
		focused = node.item.value;
		elements.get(node.item.value)?.focus();
	}

	function select(item: I) {
		if (item.disabled) return;
		value = item.value;
		onselect?.(item);
	}

	function toggle(item: I) {
		if (!open.has(item.value)) {
			expanded = [...expanded, item.value];
			return;
		}
		// Closing a parent that holds the focus moves it to the parent.
		const element = elements.get(item.value);
		const inner = focused != null ? elements.get(focused) : undefined;
		const holdsFocus = !!element && !!inner && inner !== element && element.contains(inner);
		expanded = expanded.filter((other) => other !== item.value);
		if (holdsFocus) {
			if (element.contains(document.activeElement)) element.focus();
			focused = item.value;
		}
	}

	// A listener of its own, added before typeahead's, so `*` and Space are not also typed.
	const keys = (tree: HTMLUListElement) => {
		const listener = (event: KeyboardEvent) => {
			keydown?.(event as KeyboardEvent & { currentTarget: EventTarget & HTMLUListElement });
			onkeydown(event);
		};
		tree.addEventListener('keydown', listener);
		return () => tree.removeEventListener('keydown', listener);
	};

	function onkeydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
		const target = event.target as HTMLElement;
		// Keys typed in a control inside a row stay with that control.
		if (target.getAttribute('role') !== 'treeitem') return;
		const index = shown.findIndex((node) => elements.get(node.item.value) === target);
		const node = shown[index];
		if (!node) return;
		const rtl = getComputedStyle(target).direction === 'rtl';
		const inward = rtl ? 'ArrowLeft' : 'ArrowRight';
		const outward = rtl ? 'ArrowRight' : 'ArrowLeft';
		const { item } = node;

		switch (event.key) {
			case 'ArrowDown':
				focusNode(shown[index + 1]);
				break;
			case 'ArrowUp':
				focusNode(shown[index - 1]);
				break;
			case 'Home':
				focusNode(shown[0]);
				break;
			case 'End':
				focusNode(shown.at(-1));
				break;
			case inward:
				if (!isParent(item)) break;
				if (!open.has(item.value)) toggle(item);
				else if (childrenOf(item).length > 0) focusNode(shown[index + 1]);
				break;
			case outward:
				if (isParent(item) && open.has(item.value)) toggle(item);
				else focusNode(node.parent ?? undefined);
				break;
			case 'Enter':
			case ' ':
				select(item);
				break;
			case '*': {
				const closed = node.siblings.filter((s) => isParent(s) && !open.has(s.value));
				expanded = [...expanded, ...closed.map((s) => s.value)];
				break;
			}
			default:
				return;
		}
		event.preventDefault();
	}

	if (DEV) {
		$effect(() => warnUnnamed('Tree', ref));
		$effect(() => {
			const values: string[] = [];
			const walk = (list: readonly TreeItem[]) =>
				list.forEach((item) => {
					values.push(item.value);
					if (item.children) walk(item.children);
				});
			walk(items);
			warnDuplicates('Tree', 'items', values, 'Give each node its own value.');
		});
	}
</script>

{#snippet branch(list: readonly I[], level: number)}
	{#each list as item, index (item.value)}
		{@const parent = isParent(item)}
		{@const isOpen = parent && open.has(item.value)}
		<li
			role="treeitem"
			class={[
				'sv-tree__item',
				value === item.value && 'sv-tree__item--selected',
				item.disabled && 'sv-tree__item--disabled'
			]}
			aria-level={level}
			aria-setsize={list.length}
			aria-posinset={index + 1}
			aria-expanded={parent ? isOpen : undefined}
			aria-selected={item.disabled ? undefined : value === item.value}
			aria-disabled={item.disabled || undefined}
			data-sv-label={item.label}
			tabindex={stop === item.value ? 0 : -1}
			onfocus={() => (focused = item.value)}
			{@attach register(item.value)}
		>
			<!-- The treeitem takes the keys; the row is only where the pointer selects. -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="sv-tree__row" style:--sv-tree-level={level - 1} onclick={() => select(item)}>
				{#if parent}
					<!-- Hidden: Right and Left open and close it from the keyboard. -->
					<span
						class={['sv-tree__toggle', isOpen && 'sv-tree__toggle--open']}
						aria-hidden="true"
						onclick={(event) => {
							event.stopPropagation();
							toggle(item);
						}}
					>
						<svg viewBox="0 0 24 24" fill="currentColor"><path d={CHEVRON} /></svg>
					</span>
				{:else}
					<span class="sv-tree__toggle" aria-hidden="true"></span>
				{/if}
				{#if itemSnippet}
					{@render itemSnippet(item)}
				{:else}
					{#if item.icon}
						<svg class="sv-tree__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d={item.icon} />
						</svg>
					{/if}
					<span class="sv-tree__label">{item.label}</span>
				{/if}
			</div>
			{#if isOpen}
				<ul role="group" class="sv-tree__group">
					{@render branch(childrenOf(item), level + 1)}
				</ul>
			{/if}
		</li>
	{/each}
{/snippet}

<ul
	bind:this={ref}
	{...rest}
	role="tree"
	class={['sv-tree', sharedClasses({ density: p.density, color: p.color }, 'Tree'), className]}
	{@attach keys}
	{@attach typeahead({ items: '[role="treeitem"]', onMatch: (element) => element.focus() })}
>
	{@render branch(items, 1)}
</ul>
