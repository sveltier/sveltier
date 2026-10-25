<script lang="ts">
	// One icon button that both opens a Dialog and is described by a Tooltip.
	import Button from '../../lib/components/Button/Button.svelte';
	import Dialog from '../../lib/components/Dialog/Dialog.svelte';
	import Tooltip from '../../lib/components/Tooltip/Tooltip.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="padding: 80px 120px">
		<Dialog title="Rename the account">
			{#snippet trigger(dialog)}
				<Tooltip text="Rename the account" delay={0}>
					{#snippet trigger(tooltip)}
						<Button {...dialog} {...tooltip} icon aria-label="Rename">R</Button>
					{/snippet}
				</Tooltip>
			{/snippet}
			<label>Name <input name="name" /></label>
		</Dialog>
	</div>
</ThemeProvider>
