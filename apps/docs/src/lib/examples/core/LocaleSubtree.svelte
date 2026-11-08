<script>
	import { LocaleProvider, Table } from '@sveltier/ui';
	let { markets, columns } = $props();
</script>

<!-- The app is in Vietnamese (vi-VN): this table writes its figures as exchanges do,
     76,088.0 and +0.60%, while its labels and messages stay the app's. -->
<LocaleProvider locale="en-US">
	<Table aria-label="Markets" items={markets} {columns} />
</LocaleProvider>
