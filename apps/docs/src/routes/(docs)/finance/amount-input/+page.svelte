<script lang="ts">
	import { resolve } from '$app/paths';
	import ApiTable from '#lib/docs/ApiTable.svelte';
	import Code from '#lib/docs/Code.svelte';
	import DocPage from '#lib/docs/DocPage.svelte';
	import TicketDemo from '#lib/docs/ticket/TicketDemo.svelte';
	import { amountInputUsage } from '#lib/snippets/finance.js';
	import AMOUNT_INPUT_PROPS from 'virtual:sveltier-api/AmountInputProps';
</script>

<DocPage
	title="AmountInput"
	lede="An amount to use out of what is available, such as a quantity to sell or a sum to invest, with buttons for shares of the maximum."
>
	<h2 id="usage">Usage</h2>
	<p>
		Set <code>max</code> to what is available, and <code>step</code> to the lot. The buttons under
		the field set 25%, 50%, 75% or all of <code>max</code>, rounded down to whole steps so they
		never ask for more than there is; <code>shares</code> picks other fractions. Without
		<code>max</code> there are no buttons.
	</p>
	<TicketDemo />
	<Code title="Ticket.svelte" code={amountInputUsage} />

	<h2 id="field">A NumberField</h2>
	<p>
		The field is a <a href={resolve('forms/number-field')}>NumberField</a>: the same props,
		defaults, validation and keys. <code>class</code> and <code>style</code> go to the whole, field
		and buttons;
		<code>id</code>, <code>ref</code> and other attributes go to the <code>&lt;input&gt;</code>.
	</p>

	<h2 id="accessibility">Accessibility</h2>
	<ul>
		<li>
			Each button shows its percentage and is named in full, such as <q>25% of the maximum</q>, from
			the locale's <code>shareOfMax</code> message. It controls the field, and is disabled with it.
		</li>
		<li>
			The buttons follow the field in the tab order, so the keyboard reaches them after typing.
		</li>
	</ul>

	<h2 id="api">API</h2>
	<ApiTable label="AmountInput props" rows={AMOUNT_INPUT_PROPS} />
</DocPage>
