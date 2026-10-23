<script lang="ts">
	// Two modal surfaces that can open on top of each other, with page content around them.
	import { focusTrap } from '../../lib/primitives/focus/focus-trap.js';
	import { inertOthers } from '../../lib/primitives/inert/inert-others.js';
	import { scrollLock } from '../../lib/primitives/scroll-lock/scroll-lock.js';

	let { first = false, second = false }: { first?: boolean; second?: boolean } = $props();
</script>

<header data-testid="header"><button type="button">Menu</button></header>
<p data-testid="already" inert>Already inert</p>
<div aria-live="polite" data-testid="live">Saved</div>
<main data-testid="main">
	<button type="button">Page action</button>
	<section data-testid="section">
		<p data-testid="beside">Beside the first modal</p>
		{#if first}
			<div
				data-testid="first"
				role="dialog"
				aria-modal="true"
				aria-label="First"
				{@attach focusTrap()}
				{@attach inertOthers()}
				{@attach scrollLock()}
			>
				<button type="button">First action</button>
			</div>
		{/if}
	</section>
	{#if second}
		<div
			data-testid="second"
			role="dialog"
			aria-modal="true"
			aria-label="Second"
			{@attach inertOthers()}
			{@attach scrollLock()}
		>
			<button type="button">Second action</button>
		</div>
	{/if}
</main>
