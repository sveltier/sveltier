<script lang="ts">
	import { Combobox, type SelectOption } from '@sveltier/ui';

	let symbol = $state<string | null>(null);
	let query = $state('');
	let found = $state<SelectOption[]>([]);
	let loading = $state(false);

	// Searching elsewhere: the server filters, the field shows what it found.
	$effect(() => {
		const term = query.trim();
		if (!term) return;
		loading = true;
		const controller = new AbortController();
		fetch(`/api/symbols?q=${encodeURIComponent(term)}`, { signal: controller.signal })
			.then((response) => response.json())
			.then((options: SelectOption[]) => (found = options))
			.catch(() => {})
			.finally(() => (loading = false));
		return () => controller.abort();
	});
</script>

<Combobox label="Symbol" options={found} filter={false} {loading} bind:query bind:value={symbol} />
