<script lang="ts">
	// Cities with Vietnamese names in a Combobox inside a form, with the bound value, the typed
	// query and each change shown, and a field after it to tab to.
	import Combobox from '../../lib/components/Combobox/Combobox.svelte';
	import type { ComboboxProps } from '../../lib/components/Combobox/types.js';
	import type { SelectItem } from '../../lib/components/Select/options.js';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let {
		value = $bindable(null),
		query = $bindable(''),
		...props
	}: Partial<ComboboxProps<string>> = $props();
	let changes = $state<string[]>([]);

	const CITIES: SelectItem<string>[] = [
		{ value: 'hn', label: 'Hà Nội', description: 'Thủ đô', group: 'North' },
		{ value: 'hp', label: 'Hải Phòng', group: 'North' },
		{ value: 'dn', label: 'Đà Nẵng', group: 'Centre' },
		{ value: 'hue', label: 'Huế', group: 'Centre', disabled: true },
		{ value: 'hcm', label: 'Hồ Chí Minh', group: 'South' },
		{ value: 'ct', label: 'Cần Thơ', group: 'South' }
	];
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<form onsubmit={(event) => event.preventDefault()}>
		<Combobox
			label="City"
			name="city"
			items={CITIES}
			onchange={(next) => changes.push(String(next))}
			{...props}
			bind:value
			bind:query
		/>
		<input aria-label="Next" />
	</form>
	<span data-testid="value">{value ?? 'null'}</span>
	<span data-testid="query">{query}</span>
	<span data-testid="changes">{changes.join(', ')}</span>
</ThemeProvider>
