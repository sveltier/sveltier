<script lang="ts">
	// Three Buttons in a group, the last with a variant of its own, in a themed scope; with
	// tooltips, each Button is the trigger of a Tooltip.
	import Button from '../../lib/components/Button/Button.svelte';
	import ButtonGroup from '../../lib/components/ButtonGroup/ButtonGroup.svelte';
	import type { ButtonGroupProps } from '../../lib/components/ButtonGroup/types.js';
	import Tooltip from '../../lib/components/Tooltip/Tooltip.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { tooltips = false, ...props }: ButtonGroupProps & { tooltips?: boolean } = $props();
	const BUTTONS = [
		{ id: 'first', label: 'Day' },
		{ id: 'middle', label: 'Week' },
		{ id: 'last', label: 'Month', variant: 'flat' as const }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<ButtonGroup data-testid="group" aria-label="Period" {...props}>
		{#each BUTTONS as button (button.id)}
			{#if tooltips}
				<Tooltip text="By {button.label.toLowerCase()}">
					{#snippet trigger(attributes)}
						<Button {...attributes} data-testid={button.id} variant={button.variant}
							>{button.label}</Button
						>
					{/snippet}
				</Tooltip>
			{:else}
				<Button data-testid={button.id} variant={button.variant}>{button.label}</Button>
			{/if}
		{/each}
	</ButtonGroup>
</ThemeProvider>
