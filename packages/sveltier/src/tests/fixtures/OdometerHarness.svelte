<script lang="ts">
	// An Odometer in a themed scope, under Amount defaults the test picks.
	import Odometer from '../../lib/components/Odometer/Odometer.svelte';
	import type { OdometerProps } from '../../lib/components/Odometer/types.js';
	import type { DefaultsConfig } from '../../lib/core/defaults/context.js';
	import DefaultsProvider from '../../lib/core/defaults/DefaultsProvider.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { defaults = {}, ...props }: Partial<OdometerProps> & { defaults?: DefaultsConfig } =
		$props();
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<DefaultsProvider {defaults}>
		<p style="font-size: 2rem">
			<Odometer data-testid="odometer" value={1234.5} format={{ style: 'currency' }} {...props} />
		</p>
	</DefaultsProvider>
</ThemeProvider>
