<script lang="ts" generics="T extends string | number">
	// Sections that open and close, on the platform's <details>. See AccordionProps.
	import { useDefaults } from '../../core/defaults/context.js';
	import { sharedClasses } from '../../core/props/classes.js';
	import './accordion.css';
	import type { AccordionDefaults, AccordionItem, AccordionProps } from './types.js';

	let {
		density,
		items,
		panel,
		multiple = false,
		value = $bindable(),
		onchange,
		class: className,
		ref = $bindable(null),
		...rest
	}: AccordionProps<T> = $props();

	const resolve = useDefaults<AccordionDefaults>('Accordion', { density: 'default' });
	const p = $derived(resolve({ density }));

	// The sections of one accordion share a name, so the browser keeps at most one open.
	const name = $props.id();

	const CHEVRON = 'M5.6 8.6 12 15l6.4-6.4L20 10.2l-8 8-8-8z';

	const list = $derived(Array.isArray(value) ? value : []);
	const isOpen = (item: AccordionItem<T>) =>
		multiple ? list.includes(item.value) : value === item.value;

	function change(next: T | null | T[]) {
		value = next;
		(onchange as ((value: T | null | T[]) => void) | undefined)?.(next);
	}

	// The browser has opened or closed a section: its header, finding text in it, or `open` set
	// from `value`, in which case the state already agrees.
	function toggle(item: AccordionItem<T>, details: HTMLDetailsElement) {
		if (details.open === isOpen(item)) return;
		if (multiple) {
			change(details.open ? [...list, item.value] : list.filter((other) => other !== item.value));
		} else if (details.open) {
			change(item.value);
		} else if (!ref?.querySelector(':scope > details[open]')) {
			// Closed because another opened: that one's own event sets the value.
			change(null);
		}
	}
</script>

<div bind:this={ref} {...rest} class={['sv-accordion', sharedClasses(p, 'Accordion'), className]}>
	{#each items as item (item.value)}
		<details
			class="sv-accordion__item"
			name={multiple ? undefined : name}
			open={isOpen(item)}
			ontoggle={(event) => toggle(item, event.currentTarget)}
		>
			<!-- A disabled header takes focus and is announced, but does not toggle. -->
			<summary
				class="sv-accordion__header"
				aria-disabled={item.disabled || undefined}
				onclick={(event) => item.disabled && event.preventDefault()}
			>
				<span class="sv-accordion__title">{item.title}</span>
				<svg class="sv-accordion__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d={CHEVRON} />
				</svg>
			</summary>
			<div class="sv-accordion__panel">{@render panel(item)}</div>
		</details>
	{/each}
</div>
