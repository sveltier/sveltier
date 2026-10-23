<script lang="ts">
	// A key-mapped control and a listbox with roving focus and typeahead.
	import { rovingFocus } from '../../lib/primitives/focus/roving-focus.js';
	import { keymap } from '../../lib/primitives/keyboard/keymap.js';
	import { typeahead } from '../../lib/primitives/keyboard/typeahead.js';

	let { dir = 'ltr', timeout = 500 }: { dir?: 'ltr' | 'rtl'; timeout?: number } = $props();

	const FRUITS = ['Apple', 'Avocado', 'Banana', 'Blueberry', 'Cherry', 'Date'];
	const log = $state<string[]>([]);
	const record = (entry: string) => () => {
		log.push(entry);
	};
</script>

<div {dir}>
	<div
		role="slider"
		tabindex="0"
		aria-label="Amount"
		aria-valuenow={0}
		data-testid="slider"
		{@attach keymap({
			ArrowForward: record('forward'),
			ArrowBackward: record('backward'),
			ArrowUp: record('up'),
			'Ctrl+k': record('ctrl-k'),
			'?': record('help'),
			Enter: () => false
		})}
	></div>
	<ul
		role="listbox"
		aria-label="Fruit"
		{@attach rovingFocus({ orientation: 'vertical' })}
		{@attach typeahead({ timeout })}
	>
		{#each FRUITS as fruit (fruit)}
			<li
				role="option"
				aria-selected="false"
				data-sv-item
				aria-disabled={fruit === 'Cherry' ? 'true' : undefined}
			>
				{fruit}
			</li>
		{/each}
	</ul>
</div>
<output data-testid="log">{log.join(',')}</output>
