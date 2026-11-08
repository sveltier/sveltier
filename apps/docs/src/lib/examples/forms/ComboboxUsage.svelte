<script lang="ts">
	import { Combobox } from '@sveltier/ui';

	let city = $state<string | null>(null);
</script>

<!-- Type "sao" for São Paulo or "da nang" for Đà Nẵng: case and diacritics do not matter. -->
<Combobox
	label="City"
	name="city"
	placeholder="Search cities"
	options={[
		{ value: 'sao', label: 'São Paulo', description: 'Brazil', group: 'Americas' },
		{ value: 'mtl', label: 'Montréal', description: 'Canada', group: 'Americas' },
		{ value: 'zrh', label: 'Zürich', description: 'Switzerland', group: 'Europe' },
		{ value: 'dad', label: 'Đà Nẵng', description: 'Vietnam', group: 'Asia' }
	]}
	bind:value={city}
/>
