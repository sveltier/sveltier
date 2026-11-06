<script lang="ts">
	// A SecureMask in a themed scope, with its bound revealed state shown.
	import SecureMask from '../../lib/components/SecureMask/SecureMask.svelte';
	import type { SecureMaskProps } from '../../lib/components/SecureMask/types.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { revealed = $bindable(false), ...props }: Partial<SecureMaskProps> = $props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<p>
		Paid from
		<SecureMask
			data-testid="mask"
			label="Account number"
			value="DE89370400440532013000"
			{...props}
			bind:revealed
		/>
	</p>
	<span data-testid="revealed">{revealed}</span>
</ThemeProvider>
