<script lang="ts">
	import { DateRangePicker } from '@sveltier/ui';

	let start = $state<string | null>(null);
	let end = $state<string | null>(null);
</script>

<!-- The first day chosen is the start, the second the end; the form gets both under one name. -->
<DateRangePicker label="Holding period" name="period" bind:start bind:end />
