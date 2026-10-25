<script lang="ts">
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import PaginationDemo from '#lib/docs/pagination/PaginationDemo.svelte';
	import { paginationLinks, paginationUsage } from '#lib/snippets/components.js';
	import PAGINATION_PROPS from 'virtual:sveltier-api/PaginationProps';
</script>

<DocPage
	title="Pagination"
	lede="The pages of a long list, between the previous and the next page, as buttons or as links."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the number of pages as <code>count</code> and bind the <code>page</code>, counted from 1.
		The previous and next steps are disabled at the ends.
	</p>
	<PaginationDemo />
	<Code title="Transactions.svelte" code={paginationUsage} />

	<h2 id="links">Pages that load by address</h2>
	<p>
		With <code>href</code>, which returns the address of a page, every control is a link. The page
		can then be shared, reloaded and crawled, and SvelteKit loads it as it does any link. Pass the
		current page from the address as <code>page</code>.
	</p>
	<Code title="+page.svelte" code={paginationLinks} />

	<h2 id="numbers">Which numbers show</h2>
	<p>
		The first and last pages always show (<code>boundaries</code>, 1 by default), and so do the
		pages on each side of the current one (<code>siblings</code>, 1). A gap stands for the numbers
		left out. Away from the ends there are always as many controls, so they stay in place under the
		pointer as the page changes.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			The controls are a <code>&lt;nav&gt;</code> landmark named <q>Pagination</q>, from the
			locale's <code>pagination</code> message; give it another name with <code>aria-label</code>.
		</li>
		<li>
			Each number is named <q>Page 3</q> and the current one has <code>aria-current="page"</code>.
			The steps are named <q>Previous page</q> and <q>Next page</q>; all of these come from the
			locale.
		</li>
		<li>
			The gaps are hidden from assistive technology. In right-to-left pages the chevrons turn round.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Pagination props" rows={PAGINATION_PROPS} />
</DocPage>
