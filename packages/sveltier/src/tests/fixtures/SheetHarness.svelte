<script lang="ts">
	// A Sheet opened from a Button, in a themed scope whose direction the test picks, with the
	// last close reason shown.
	import Button from '../../lib/components/Button/Button.svelte';
	import Sheet from '../../lib/components/Sheet/Sheet.svelte';
	import type { SheetProps } from '../../lib/components/Sheet/types.js';
	import type { CloseReason } from '../../lib/core/overlay/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { open = $bindable(false), dir, ...props }: SheetProps & { dir?: 'ltr' | 'rtl' } = $props();
	let reason = $state<CloseReason | ''>('');
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div {dir}>
		<Sheet title="Filters" {...props} bind:open onclose={(why) => (reason = why)}>
			{#snippet trigger(attributes)}<Button {...attributes}>Filters</Button>{/snippet}
			<label>Merchant <input name="merchant" /></label>
		</Sheet>
	</div>
	<span data-testid="reason">{reason}</span>
</ThemeProvider>
