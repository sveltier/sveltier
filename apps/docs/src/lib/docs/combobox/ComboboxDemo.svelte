<script lang="ts">
	// Cities whose names carry diacritics, grouped by region: typing finds them without the marks.
	import { Combobox, type SelectItem } from '@sveltier/ui';

	const CITIES: SelectItem<string>[] = [
		{ value: 'sao', label: 'São Paulo', description: 'Brazil', group: 'Americas' },
		{ value: 'bog', label: 'Bogotá', description: 'Colombia', group: 'Americas' },
		{ value: 'mtl', label: 'Montréal', description: 'Canada', group: 'Americas' },
		{ value: 'zrh', label: 'Zürich', description: 'Switzerland', group: 'Europe' },
		{ value: 'krk', label: 'Kraków', description: 'Poland', group: 'Europe' },
		{ value: 'dus', label: 'Düsseldorf', description: 'Germany', group: 'Europe' },
		{ value: 'rek', label: 'Reykjavík', description: 'Iceland', group: 'Europe' },
		{ value: 'mmx', label: 'Malmö', description: 'Sweden', group: 'Europe' },
		{ value: 'han', label: 'Hà Nội', description: 'Vietnam', group: 'Asia' },
		{ value: 'dad', label: 'Đà Nẵng', description: 'Vietnam', group: 'Asia' },
		{ value: 'sgn', label: 'Hồ Chí Minh City', description: 'Vietnam', group: 'Asia' },
		{ value: 'tyo', label: 'Tōkyō', description: 'Japan', group: 'Asia' }
	];
	let city = $state<string | null>(null);
</script>

<div class="docs-demo docs-ticket">
	<Combobox label="City" placeholder="Search cities" items={CITIES} bind:value={city} />
	<p class="docs-dim">Value: {city ?? 'null'}</p>
</div>
