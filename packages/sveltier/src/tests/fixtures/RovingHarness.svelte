<script lang="ts">
	import { rovingFocus, type RovingFocusOptions } from '../../lib/primitives/focus/roving-focus.js';

	let {
		roving = {},
		dir = 'ltr',
		count = 4,
		disabledIndex = -1,
		currentIndex = -1
	}: {
		roving?: RovingFocusOptions;
		dir?: 'ltr' | 'rtl';
		count?: number;
		disabledIndex?: number;
		currentIndex?: number;
	} = $props();
</script>

<button type="button">Before</button>
<div role="toolbar" aria-label="Formatting" {dir} {@attach rovingFocus(roving)}>
	{#each Array.from({ length: count }, (_, i) => i) as i (i)}
		<button
			type="button"
			data-sv-item
			aria-disabled={i === disabledIndex ? 'true' : undefined}
			aria-current={i === currentIndex ? 'true' : undefined}>Item {i}</button
		>
	{/each}
</div>
<button type="button">After</button>
