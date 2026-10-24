<script lang="ts">
	// Three Buttons in a group, the last with a variant of its own, in a themed scope.
	import Button from '../../lib/components/Button/Button.svelte';
	import ButtonGroup from '../../lib/components/ButtonGroup/ButtonGroup.svelte';
	import type { ButtonGroupProps } from '../../lib/components/ButtonGroup/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { ...props }: ButtonGroupProps = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<ButtonGroup data-testid="group" aria-label="Period" {...props}>
		<Button data-testid="first">Day</Button>
		<Button data-testid="middle">Week</Button>
		<Button data-testid="last" variant="flat">Month</Button>
	</ButtonGroup>
</ThemeProvider>
