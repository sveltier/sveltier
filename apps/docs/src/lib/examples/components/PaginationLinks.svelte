<script>
	import { page } from '$app/state';
	import { Pagination } from '@sveltier/ui';

	let { data } = $props();
	const current = $derived(Number(page.url.searchParams.get('page') ?? 1));
</script>

<!-- Links: the address holds the page, so it can be shared, reloaded and crawled. -->
<Pagination count={data.pages} page={current} href={(n) => `?page=${n}`} />
