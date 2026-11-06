<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import LedgerDemo from '#lib/docs/ledger/LedgerDemo.svelte';
	import { ledgerUsage } from '#lib/snippets/finance.js';
	import LEDGER_PROPS from 'virtual:sveltier-api/LedgerProps';
	import LEDGER_ROW_PROPS from 'virtual:sveltier-api/LedgerRowProps';
</script>

<DocPage
	title="Ledger"
	lede="Labels and their figures joined by a dotted leader, the total under a double rule, as accounting paper writes them."
>
	<h2 id="usage">Usage</h2>
	<p>
		Each <code>LedgerRow</code> pairs a <code>label</code> with a figure. The figure is an
		<a href={resolve('finance/amount')}>Amount</a>, with the same <code>format</code> and
		<code>decimals</code>; give the row children instead for content of your own, such as a date or
		a <a href={resolve('finance/delta')}>Delta</a>. A dotted leader runs from the label to the
		figure, which keeps to one line at the end while a long label wraps.
	</p>
	<LedgerDemo />
	<Code title="Holdings.svelte" code={ledgerUsage} />

	<h2 id="total">The total</h2>
	<p>
		<code>total</code> marks the row that sums the ones above: a double rule over it, as an accountant
		rules off a column, and the figure one size up in a heavier weight.
	</p>

	<h2 id="receipt">On a receipt</h2>
	<p>
		The same rows go in a <a href={resolve('finance/receipt')}>Receipt</a>, which adds a title, a
		reference and a footer around them.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A <code>Ledger</code> is a description list: each label is a term (<code>&lt;dt&gt;</code>)
			and its figure the description (<code>&lt;dd&gt;</code>), so screen readers pair them. A
			<code>LedgerRow</code> outside a Ledger or a Receipt warns in development (SV4006).
		</li>
		<li>
			The figures follow Amount's <code>masked</code> default, so privacy mode hides them too.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Ledger props" rows={LEDGER_PROPS} />
	<ApiTable label="LedgerRow props" rows={LEDGER_ROW_PROPS} />
</DocPage>
