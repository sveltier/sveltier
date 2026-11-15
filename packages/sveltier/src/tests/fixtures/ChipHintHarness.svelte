<script lang="ts">
	// A static Chip with a hint: the trigger of a Tooltip, made focusable so the keyboard reaches
	// it, in a themed scope.
	import Chip from '../../lib/components/Chip/Chip.svelte';
	import Tooltip from '../../lib/components/Tooltip/Tooltip.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<button type="button">Before</button>
	<Tooltip text="Simulated data">
		{#snippet trigger(attributes)}
			<Chip {...attributes} tabindex={0} size="sm">SIM</Chip>
		{/snippet}
	</Tooltip>
</ThemeProvider>
