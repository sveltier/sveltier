<script lang="ts">
	// A country with a placeholder and a required choice, and a payment frequency with numbers as
	// values.
	import { NativeSelect } from 'sveltier';

	const COUNTRIES = [
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'jp', label: 'Japan' },
		{ value: 'sg', label: 'Singapore' },
		{ value: 'vn', label: 'Vietnam' }
	];
	const FREQUENCIES = [
		{ value: 7, label: 'Every week' },
		{ value: 30, label: 'Every month' },
		{ value: 365, label: 'Every year' }
	];

	let country = $state<string | null>(null);
	let days = $state<number | null>(30);
</script>

<div class="docs-demo">
	<div class="docs-grid-2">
		<NativeSelect
			label="Country"
			name="country"
			placeholder="Choose a country"
			hint="Where the account is held"
			required
			options={COUNTRIES}
			bind:value={country}
		/>
		<NativeSelect label="Repeat" name="days" options={FREQUENCIES} bind:value={days} />
	</div>
	<p class="docs-dim">
		Bound values: <code>country = {country}</code>, <code>days = {days}</code> (a number)
	</p>
</div>
