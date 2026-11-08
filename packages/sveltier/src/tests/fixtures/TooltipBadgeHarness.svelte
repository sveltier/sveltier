<script lang="ts">
	// An icon button in a header, with a count pinned to it and a tooltip on it: both describe
	// the button. `joined` joins the two descriptions; without it, the badge's replaces the
	// tooltip's, as a later attribute does.
	import Badge from '../../lib/components/Badge/Badge.svelte';
	import Button from '../../lib/components/Button/Button.svelte';
	import Tooltip from '../../lib/components/Tooltip/Tooltip.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { joined = true }: { joined?: boolean } = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<div style="padding: 80px 120px">
		<Badge id="alerts" content={1} label="alerts waiting">
			<Tooltip text="Price alerts">
				{#snippet trigger(attributes)}
					<Button
						{...attributes}
						aria-label="Alerts"
						aria-describedby={joined
							? [attributes['aria-describedby'], 'alerts-label'].join(' ')
							: 'alerts-label'}
					>
						A
					</Button>
				{/snippet}
			</Tooltip>
		</Badge>
	</div>
</ThemeProvider>
