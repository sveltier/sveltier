<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import ReceiptDemo from '#lib/docs/ledger/ReceiptDemo.svelte';
	import { receiptUsage } from '#lib/snippets/finance.js';
	import RECEIPT_PROPS from 'virtual:sveltier-api/ReceiptProps';
</script>

<DocPage
	title="Receipt"
	lede="The record of a payment, a transfer or an order: a title and a reference, the figures, the total ruled off, and a footer."
>
	<h2 id="usage">Usage</h2>
	<p>
		Give the receipt a <code>title</code> and, as its <code>subtitle</code>, a reference or a date.
		Its rows are <a href={resolve('finance/ledger')}>LedgerRows</a>, the last one usually the
		<code>total</code>. The <code>footer</code> snippet holds a note or an action under them.
	</p>
	<ReceiptDemo />
	<Code title="TransferSent.svelte" code={receiptUsage} />

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			A <code>&lt;section&gt;</code> named by its title, so it is a region screen readers can go to.
			With <code>level</code>, the title is a heading of that level and joins the page's outline.
		</li>
		<li>The rows are a description list, each label paired with its figure.</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="Receipt props" rows={RECEIPT_PROPS} />
</DocPage>
