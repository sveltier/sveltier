<script lang="ts">
	// A listbox: one tab stop, arrows and typeahead move focus, Enter or Space selects.
	import { keymap, rovingFocus, typeahead } from 'sveltier';

	const CURRENCIES = [
		'Australian dollar',
		'Canadian dollar',
		'Euro',
		'Japanese yen',
		'Pound sterling',
		'Singapore dollar',
		'Swiss franc',
		'US dollar'
	];
	let selected = $state('Euro');

	function select(event: Event) {
		const item = (event.target as HTMLElement).closest<HTMLElement>('[data-sv-item]');
		if (!item) return false;
		selected = item.textContent?.trim() ?? selected;
	}
</script>

<div class="docs-demo">
	<!-- svelte-ignore a11y_click_events_have_key_events (Enter and Space are bound by keymap on this element) -->
	<ul
		class="docs-listbox"
		role="listbox"
		aria-label="Account currency"
		{@attach rovingFocus({ orientation: 'vertical' })}
		{@attach typeahead()}
		{@attach keymap({ Enter: select, ' ': select })}
		onclick={select}
	>
		{#each CURRENCIES as currency (currency)}
			<li
				class="docs-listbox__option"
				role="option"
				data-sv-item
				aria-selected={selected === currency}
			>
				{currency}
			</li>
		{/each}
	</ul>
	<p class="docs-dim" aria-live="polite">
		Selected: {selected}. Tab in, then type "s" twice, or "sw", and press Enter.
	</p>
</div>
