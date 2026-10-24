<script lang="ts">
	// Loading keeps the button where it was, focused, and ignores presses until it is done.
	import { Button } from '@sveltier/ui';

	let paying = $state(false);
	let paid = $state(0);

	function pay() {
		paying = true;
		setTimeout(() => {
			paying = false;
			paid += 1;
		}, 1597);
	}
</script>

<div class="docs-demo">
	<div class="docs-actions">
		<Button loading={paying} onclick={pay}>Pay invoice</Button>
		<Button variant="outlined" disabled>Disabled</Button>
		<Button variant="text" href="#links">A link</Button>
		<Button variant="text" href="#links" disabled>A disabled link</Button>
	</div>
	<p class="docs-dim" aria-live="polite">
		{paid === 0 ? 'Nothing paid yet.' : `Paid ${paid} ${paid === 1 ? 'time' : 'times'}.`} Press Pay invoice
		twice quickly: the second press is ignored while it loads.
	</p>
</div>
