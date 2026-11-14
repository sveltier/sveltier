<script lang="ts">
	// Three sections, the last one disabled, in a themed scope, with the value and the values
	// onchange reported shown, and a button that sets the value from outside.
	import { untrack } from 'svelte';
	import Accordion from '../../lib/components/Accordion/Accordion.svelte';
	import type { AccordionItem } from '../../lib/components/Accordion/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	const SECTIONS: AccordionItem[] = [
		{ value: 'fees', label: 'Fees' },
		{ value: 'limits', label: 'Limits' },
		{ value: 'cards', label: 'Cards', disabled: true }
	];

	let {
		multiple = false,
		initial,
		items = SECTIONS,
		tagged = false
	}: { multiple?: boolean; initial?: string; items?: AccordionItem[]; tagged?: boolean } = $props();

	let one = $state<string | null>(untrack(() => initial ?? null));
	let many = $state<string[]>([]);
	let changes = $state<string[]>([]);

	const report = (next: unknown) => (changes = [...changes, JSON.stringify(next)]);
</script>

{#snippet tag(item: AccordionItem)}
	{item.label} <strong data-testid="tag-{item.value}">New</strong>
{/snippet}

{#snippet panel(item: AccordionItem)}
	<p>About {item.label?.toLowerCase()}.</p>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	{#if multiple}
		<Accordion {items} {panel} multiple bind:value={many} onchange={report} />
	{:else}
		<Accordion
			{items}
			{panel}
			header={tagged ? tag : undefined}
			bind:value={one}
			onchange={report}
		/>
	{/if}
	<button type="button" onclick={() => (multiple ? (many = ['limits']) : (one = 'limits'))}>
		Open limits
	</button>
	<span data-testid="value">{JSON.stringify(multiple ? many : one)}</span>
	<span data-testid="changes">{changes.join(' ')}</span>
</ThemeProvider>
