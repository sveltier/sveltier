<script lang="ts">
	// A Popover opened from a Button in a themed scope, between two plain buttons, with a field
	// and an action unless the test leaves them out, and the last close reason shown.
	import Button from '../../lib/components/Button/Button.svelte';
	import Popover from '../../lib/components/Popover/Popover.svelte';
	import type { PopoverProps } from '../../lib/components/Popover/types.js';
	import type { CloseReason } from '../../lib/core/overlay/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		open = $bindable(false),
		fields = true,
		withActions = true,
		...props
	}: Partial<PopoverProps> & { fields?: boolean; withActions?: boolean } = $props();
	let reason = $state<CloseReason | ''>('');
</script>

{#snippet apply({ close }: { close: () => void })}
	<Button onclick={close}>Apply</Button>
{/snippet}

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="padding: 40px 80px">
		<button type="button">Before</button>
		<Popover
			title="Amount range"
			{...props}
			actions={withActions ? apply : undefined}
			bind:open
			onclose={(why) => (reason = why)}
		>
			{#snippet trigger(attributes)}<Button {...attributes}>Amount</Button>{/snippet}
			{#if fields}<label>From <input name="from" /></label>{:else}Payments over the limit wait for
				approval.{/if}
		</Popover>
		<button type="button">After</button>
	</div>
	<span data-testid="reason">{reason}</span>
</ThemeProvider>
