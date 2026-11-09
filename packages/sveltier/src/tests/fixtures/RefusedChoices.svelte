<script lang="ts">
	// A Switch, a Checkbox, a RadioGroup and a NativeSelect, each bound through a setter that keeps
	// its owner's state while `locked`, with that state and the onchange calls written out.
	import Checkbox from '../../lib/components/Checkbox/Checkbox.svelte';
	import NativeSelect from '../../lib/components/NativeSelect/NativeSelect.svelte';
	import RadioGroup from '../../lib/components/RadioGroup/RadioGroup.svelte';
	import Switch from '../../lib/components/Switch/Switch.svelte';
	import ThemeProvider from '../../lib/core/theme/ThemeProvider.svelte';
	import { monolith } from '../../lib/themes/monolith.js';

	let { locked = true }: { locked?: boolean } = $props();

	let venues = $state(true);
	let all = $state(false);
	let some = $state(true);
	let payout = $state<number | null>(7);
	let country = $state<string | null>('gb');
	let changes = $state<string[]>([]);

	const SCHEDULES = [
		{ value: 1, label: 'Every day' },
		{ value: 7, label: 'Every week' }
	];
	const COUNTRIES = [
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'vn', label: 'Vietnam' }
	];
	const changed = (what: string) => () => (changes = [...changes, what]);
</script>

<ThemeProvider themes={monolith} theme="monolith-light" storageKey={false}>
	<Switch
		label="Venues"
		bind:checked={() => venues, (next) => !locked && (venues = next)}
		onchange={changed('venues')}
	/>
	<Checkbox
		label="Select all"
		bind:checked={() => all, (next) => !locked && (all = next)}
		bind:indeterminate={() => some, (next) => !locked && (some = next)}
		onchange={changed('all')}
	/>
	<RadioGroup
		label="Pay out"
		options={SCHEDULES}
		bind:value={() => payout, (next) => !locked && (payout = next)}
		onchange={changed('payout')}
	/>
	<NativeSelect
		label="Country"
		options={COUNTRIES}
		bind:value={() => country, (next) => !locked && (country = next)}
		onchange={changed('country')}
	/>
	<span data-testid="state">{venues} {all} {some} {payout} {country}</span>
	<span data-testid="changes">{changes.join(' ')}</span>
</ThemeProvider>
