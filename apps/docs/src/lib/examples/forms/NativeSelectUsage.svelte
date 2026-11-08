<script>
	import { NativeSelect } from '@sveltier/ui';
	let country = $state(null);
</script>

<NativeSelect
	label="Country"
	name="country"
	placeholder="Choose a country"
	required
	options={[
		{ value: 'gb', label: 'United Kingdom' },
		{ value: 'jp', label: 'Japan' },
		{ value: 'vn', label: 'Vietnam' }
	]}
	bind:value={country}
/>
