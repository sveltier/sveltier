<script lang="ts">
	import { keymap } from '@sveltier/ui';
	let value = $state(50);

	// A handler that returns false lets the key through, so these return nothing.
	function to(next: number) {
		value = Math.min(100, Math.max(0, next));
	}
</script>

<!-- ArrowForward and ArrowBackward follow the writing direction. -->
<div
	role="slider"
	tabindex="0"
	aria-label="Allocation"
	aria-valuenow={value}
	{@attach keymap({
		ArrowForward: () => to(value + 1),
		ArrowBackward: () => to(value - 1),
		PageUp: () => to(value + 10),
		PageDown: () => to(value - 10),
		Home: () => to(0),
		End: () => to(100)
	})}
>
	{value}%
</div>
